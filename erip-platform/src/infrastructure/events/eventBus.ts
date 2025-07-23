/**
 * ERIP Event Bus Implementation
 * 
 * Central event bus using Redis Pub-Sub with AWS EventBridge integration
 * Implements high-performance event routing with persistence and replay capabilities
 */

// import Redis from 'ioredis'
// import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import { ERIPEvent, ERIPEventSchema, EVENT_ROUTING_RULES, EventRoutingRule } from './schemas'
import { Logger } from '../logging/logger'
import { TrustEquityEngine } from '../trustEquity/engine'

export interface EventBusConfig {
  redis: {
    host: string
    port: number
    password?: string
    db?: number
    keyPrefix?: string
  }
  aws?: {
    region: string
    eventBusName: string
    source: string
  }
  persistence: {
    enabled: boolean
    ttlSeconds: number
    maxEvents: number
  }
  performance: {
    batchSize: number
    flushInterval: number
    maxConcurrency: number
  }
}

export type EventHandler<T = any> = (event: T) => Promise<void> | void
export type EventFilter = (event: ERIPEvent) => boolean

export class ERIPEventBus {
  // private redis: Redis
  // private eventBridge?: EventBridgeClient
  private handlers: Map<string, Set<EventHandler>> = new Map()
  private filters: Map<string, EventFilter> = new Map()
  private logger: Logger
  private trustEngine: TrustEquityEngine
  private eventQueue: ERIPEvent[] = []
  private processingBatch = false
  private metricsCollector: EventMetricsCollector

  constructor(private config: EventBusConfig) {
    // this.redis = new Redis({
    //   host: config.redis.host,
    //   port: config.redis.port,
    //   password: config.redis.password,
    //   db: config.redis.db || 0,
    //   keyPrefix: config.redis.keyPrefix || 'erip:events:',
    //   retryDelayOnFailover: 100,
    //   lazyConnect: true,
    //   maxRetriesPerRequest: 3
    // })

    // if (config.aws) {
    //   this.eventBridge = new EventBridgeClient({ region: config.aws.region })
    // }

    this.logger = Logger.getInstance()
    this.trustEngine = TrustEquityEngine.getInstance()
    this.metricsCollector = new EventMetricsCollector()

    // this.setupRedisSubscriptions()
    this.setupBatchProcessing()
    this.setupEventRouting()
  }

  /**
   * Publish an event to the bus with automatic validation and routing
   */
  async publish<T extends ERIPEvent>(event: T): Promise<void> {
    try {
      // Add event metadata
      const enrichedEvent = {
        ...event,
        eventId: event.eventId || this.generateEventId(),
        timestamp: event.timestamp || new Date().toISOString()
      }

      // Validate event schema
      const validatedEvent = ERIPEventSchema.parse(enrichedEvent)
      
      // Log event
      this.logger.info('Publishing event', {
        eventId: validatedEvent.eventId,
        type: validatedEvent.type,
        source: validatedEvent.source
      })

      // Add to processing queue
      this.eventQueue.push(validatedEvent)

      // Immediate processing for high-priority events
      if (this.isHighPriority(validatedEvent)) {
        await this.processEvent(validatedEvent)
      }

      // Update metrics
      this.metricsCollector.recordEventPublished(validatedEvent)

    } catch (error) {
      this.logger.error('Failed to publish event', { event, error })
      throw error
    }
  }

  /**
   * Subscribe to events with optional filtering
   */
  subscribe<T extends ERIPEvent>(
    eventPattern: string,
    handler: EventHandler<T>,
    filter?: EventFilter
  ): () => void {
    const handlers = this.handlers.get(eventPattern) || new Set()
    handlers.add(handler as EventHandler)
    this.handlers.set(eventPattern, handlers)

    if (filter) {
      this.filters.set(eventPattern, filter)
    }

    this.logger.info('Subscribed to events', { pattern: eventPattern })

    // Return unsubscribe function
    return () => {
      handlers.delete(handler as EventHandler)
      if (handlers.size === 0) {
        this.handlers.delete(eventPattern)
        this.filters.delete(eventPattern)
      }
    }
  }

  /**
   * Subscribe to component-specific events
   */
  subscribeToComponent(
    component: string,
    handler: EventHandler,
    filter?: EventFilter
  ): () => void {
    return this.subscribe(`${component}:*`, handler, filter)
  }

  /**
   * Get event history for replay/audit
   */
  async getEventHistory(
    filters: {
      source?: string
      type?: string
      timeRange?: { start: Date; end: Date }
      limit?: number
    }
  ): Promise<ERIPEvent[]> {
    try {
      const pipeline = this.redis.pipeline()
      const keys = await this.redis.keys('*:event:*')
      
      keys.forEach(key => pipeline.get(key))
      const results = await pipeline.exec()
      
      const events = results
        ?.map(result => {
          try {
            return result[1] ? JSON.parse(result[1] as string) : null
          } catch {
            return null
          }
        })
        .filter(Boolean) as ERIPEvent[]

      // Apply filters
      return this.applyFilters(events, filters)
    } catch (error) {
      this.logger.error('Failed to get event history', { filters, error })
      throw error
    }
  }

  /**
   * Process a single event through the routing engine
   */
  private async processEvent(event: ERIPEvent): Promise<void> {
    try {
      // Store event for persistence
      if (this.config.persistence.enabled) {
        await this.persistEvent(event)
      }

      // Route event to AWS EventBridge if configured
      if (this.eventBridge && this.config.aws) {
        await this.forwardToEventBridge(event)
      }

      // Apply routing rules
      const routes = this.getRoutesForEvent(event)
      await Promise.all(routes.map(route => this.routeEvent(event, route)))

      // Handle trust equity events
      if (event.type === 'trust.points.earned') {
        await this.trustEngine.processPointsEvent(event.data)
      }

      // Publish to Redis channels
      await this.publishToRedis(event)

    } catch (error) {
      this.logger.error('Failed to process event', { event, error })
      throw error
    }
  }

  /**
   * Setup Redis pub/sub subscriptions
   */
  private setupRedisSubscriptions(): void {
    const subscriber = this.redis.duplicate()
    
    subscriber.psubscribe('*:event:*', (err, count) => {
      if (err) {
        this.logger.error('Failed to subscribe to Redis patterns', { error: err })
      } else {
        this.logger.info('Subscribed to Redis event patterns', { count })
      }
    })

    subscriber.on('pmessage', async (pattern, channel, message) => {
      try {
        const event = JSON.parse(message) as ERIPEvent
        await this.handleIncomingEvent(event)
      } catch (error) {
        this.logger.error('Failed to handle Redis message', { pattern, channel, error })
      }
    })
  }

  /**
   * Setup batch processing for performance optimization
   */
  private setupBatchProcessing(): void {
    setInterval(async () => {
      if (this.eventQueue.length > 0 && !this.processingBatch) {
        this.processingBatch = true
        try {
          const batch = this.eventQueue.splice(0, this.config.performance.batchSize)
          await Promise.all(
            batch.map(event => this.processEvent(event).catch(error => 
              this.logger.error('Failed to process batch event', { event, error })
            ))
          )
        } finally {
          this.processingBatch = false
        }
      }
    }, this.config.performance.flushInterval)
  }

  /**
   * Setup automatic event routing based on ERIP architecture
   */
  private setupEventRouting(): void {
    // Subscribe to all events for routing
    this.subscribe('*', async (event: ERIPEvent) => {
      const routes = this.getRoutesForEvent(event)
      
      for (const route of routes) {
        try {
          await this.routeEvent(event, route)
        } catch (error) {
          this.logger.error('Failed to route event', { event, route, error })
        }
      }
    })
  }

  /**
   * Get routing rules for a specific event
   */
  private getRoutesForEvent(event: ERIPEvent): EventRoutingRule[] {
    return EVENT_ROUTING_RULES.filter(rule => 
      rule.eventType === event.type && 
      rule.sources.includes(event.source)
    ).sort((a, b) => a.priority - b.priority)
  }

  /**
   * Route event to target components
   */
  private async routeEvent(event: ERIPEvent, rule: EventRoutingRule): Promise<void> {
    const routingPromises = rule.targets.map(async target => {
      const targetChannel = `${target}:event:${event.type}`
      
      // Apply transformation if specified
      let routedEvent = event
      if (rule.transformation) {
        routedEvent = await this.applyTransformation(event, rule.transformation)
      }

      // Check conditions
      if (rule.conditions && !this.checkConditions(event, rule.conditions)) {
        return
      }

      // Publish to target channel
      await this.redis.publish(targetChannel, JSON.stringify(routedEvent))
      
      this.logger.debug('Routed event', {
        eventId: event.eventId,
        target,
        rule: rule.eventType
      })
    })

    await Promise.allSettled(routingPromises)
  }

  /**
   * Handle incoming events from Redis
   */
  private async handleIncomingEvent(event: ERIPEvent): Promise<void> {
    const eventPattern = `${event.source}:${event.type}`
    const handlers = this.handlers.get(eventPattern) || new Set()
    const wildcardHandlers = this.handlers.get('*') || new Set()

    const allHandlers = [...handlers, ...wildcardHandlers]

    await Promise.allSettled(
      allHandlers.map(async handler => {
        try {
          // Apply filters
          const filter = this.filters.get(eventPattern)
          if (filter && !filter(event)) {
            return
          }

          await handler(event)
          this.metricsCollector.recordEventHandled(event)
        } catch (error) {
          this.logger.error('Event handler failed', { event, error })
        }
      })
    )
  }

  /**
   * Persist event to Redis with TTL
   */
  private async persistEvent(event: ERIPEvent): Promise<void> {
    const key = `${event.source}:event:${event.eventId}`
    await this.redis.setex(
      key,
      this.config.persistence.ttlSeconds,
      JSON.stringify(event)
    )
  }

  /**
   * Forward event to AWS EventBridge
   */
  private async forwardToEventBridge(event: ERIPEvent): Promise<void> {
    if (!this.eventBridge || !this.config.aws) return

    const command = new PutEventsCommand({
      Entries: [{
        Source: this.config.aws.source,
        DetailType: event.type,
        Detail: JSON.stringify(event),
        EventBusName: this.config.aws.eventBusName
      }]
    })

    await this.eventBridge.send(command)
  }

  /**
   * Publish event to Redis channels
   */
  private async publishToRedis(event: ERIPEvent): Promise<void> {
    const channels = [
      `${event.source}:event:${event.type}`,
      `global:event:${event.type}`,
      'global:event:*'
    ]

    await Promise.all(
      channels.map(channel => 
        this.redis.publish(channel, JSON.stringify(event))
      )
    )
  }

  /**
   * Utility methods
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private isHighPriority(event: ERIPEvent): boolean {
    return ['vulnerability.discovered', 'monitoring.alert', 'threat.intelligence.updated']
      .includes(event.type) && 
      (event.data as any).severity === 'critical'
  }

  private applyFilters(events: ERIPEvent[], filters: any): ERIPEvent[] {
    return events.filter(event => {
      if (filters.source && event.source !== filters.source) return false
      if (filters.type && event.type !== filters.type) return false
      if (filters.timeRange) {
        const eventTime = new Date(event.timestamp)
        if (eventTime < filters.timeRange.start || eventTime > filters.timeRange.end) {
          return false
        }
      }
      return true
    }).slice(0, filters.limit || 1000)
  }

  private async applyTransformation(event: ERIPEvent, transformation: string): Promise<ERIPEvent> {
    // Implementation would depend on transformation rules
    return event
  }

  private checkConditions(event: ERIPEvent, conditions: Record<string, any>): boolean {
    // Implementation would check event properties against conditions
    return true
  }

  /**
   * Cleanup resources
   */
  async shutdown(): Promise<void> {
    await this.redis.quit()
    this.logger.info('Event bus shutdown complete')
  }
}

/**
 * Event metrics collector for performance monitoring
 */
class EventMetricsCollector {
  private metrics = {
    eventsPublished: 0,
    eventsHandled: 0,
    eventsByType: new Map<string, number>(),
    eventsBySource: new Map<string, number>(),
    latency: [] as number[]
  }

  recordEventPublished(event: ERIPEvent): void {
    this.metrics.eventsPublished++
    this.incrementCounter(this.metrics.eventsByType, event.type)
    this.incrementCounter(this.metrics.eventsBySource, event.source)
  }

  recordEventHandled(event: ERIPEvent): void {
    this.metrics.eventsHandled++
    const latency = Date.now() - new Date(event.timestamp).getTime()
    this.metrics.latency.push(latency)
    
    // Keep only last 1000 latency measurements
    if (this.metrics.latency.length > 1000) {
      this.metrics.latency = this.metrics.latency.slice(-1000)
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageLatency: this.metrics.latency.length > 0 
        ? this.metrics.latency.reduce((a, b) => a + b, 0) / this.metrics.latency.length 
        : 0
    }
  }

  private incrementCounter(map: Map<string, number>, key: string): void {
    map.set(key, (map.get(key) || 0) + 1)
  }
}