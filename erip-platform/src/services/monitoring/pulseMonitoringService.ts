/**
 * PULSE - Real-time Monitoring Service
 * 
 * The heartbeat of the ERIP platform providing real-time monitoring,
 * component health tracking, and intelligent alerting
 */

import WebSocket from 'ws'
import { EventEmitter } from 'events'
import { ERIPEventBus } from '../../infrastructure/events/eventBus'
import { ERIPEvent } from '../../infrastructure/events/schemas'
import { Logger } from '../../infrastructure/logging/logger'
import { TrustEquityEngine } from '../../infrastructure/trustEquity/engine'
import { MetricsCollector } from './metricsCollector'
import { HealthChecker, HealthStatus } from './healthChecker'

export interface PulseConfig {
  eventBus: ERIPEventBus
  trustEngine: TrustEquityEngine
  monitoring: {
    metricsRetentionHours: number
    alertingEnabled: boolean
    realTimeUpdatesEnabled: boolean
    anomalyDetectionEnabled: boolean
  }
  websocket: {
    port: number
    heartbeatInterval: number
    connectionTimeout: number
  }
  database: {
    influxUrl: string
    influxToken: string
    influxOrg: string
    influxBucket: string
  }
  thresholds: {
    responseTimeMs: number
    errorRatePercent: number
    trustScoreMinimum: number
    componentHealthThreshold: number
  }
}

export interface ComponentMetrics {
  componentId: string
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  errorRate: number
  requestsPerSecond: number
  lastActivity: string
  trustContribution: number
  alerts: Alert[]
}

export interface SystemMetrics {
  timestamp: string
  overallHealth: 'healthy' | 'degraded' | 'unhealthy'
  trustScore: number
  activeComponents: number
  totalRequests: number
  averageResponseTime: number
  systemErrorRate: number
  activeAlerts: number
}

export interface Alert {
  id: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  component: string
  title: string
  description: string
  timestamp: string
  acknowledged: boolean
  resolved: boolean
  resolutionTime?: string
  metadata: Record<string, any>
}

export interface AnomalyDetection {
  metric: string
  expected: number
  actual: number
  deviation: number
  confidence: number
  timestamp: string
}

export interface RealTimeUpdate {
  type: 'metrics' | 'alert' | 'health' | 'trust_score' | 'anomaly'
  data: any
  timestamp: string
}

export class PulseMonitoringService extends EventEmitter {
  private eventBus: ERIPEventBus
  private trustEngine: TrustEquityEngine
  private logger: Logger
  private metricsCollector: MetricsCollector
  private healthChecker: HealthChecker
  
  // WebSocket server for real-time updates
  private wsServer?: WebSocket.Server
  private connectedClients: Set<WebSocket> = new Set()
  
  // Component tracking
  private componentMetrics: Map<string, ComponentMetrics> = new Map()
  private systemMetrics: SystemMetrics
  private activeAlerts: Map<string, Alert> = new Map()
  
  // Time series data storage
  private metricsHistory: Array<{ timestamp: number; metrics: SystemMetrics }> = []
  private maxHistorySize = 1000
  
  // Monitoring intervals
  private metricsInterval?: NodeJS.Timeout
  private healthCheckInterval?: NodeJS.Timeout
  private trustScoreInterval?: NodeJS.Timeout
  private anomalyDetectionInterval?: NodeJS.Timeout
  
  // Anomaly detection baselines
  private baselines: Map<string, number[]> = new Map()
  private readonly baselineWindow = 50 // Number of data points for baseline

  constructor(private config: PulseConfig) {
    super()
    
    this.eventBus = config.eventBus
    this.trustEngine = config.trustEngine
    this.logger = new Logger('PulseMonitoringService')
    
    this.systemMetrics = this.initializeSystemMetrics()
    
    this.setupMetricsCollection()
    this.setupHealthChecking()
    this.setupEventSubscriptions()
    
    if (config.monitoring.realTimeUpdatesEnabled) {
      this.setupWebSocketServer()
    }
    
    this.startMonitoringLoops()
  }

  /**
   * Initialize system metrics with default values
   */
  private initializeSystemMetrics(): SystemMetrics {
    return {
      timestamp: new Date().toISOString(),
      overallHealth: 'healthy',
      trustScore: 0,
      activeComponents: 0,
      totalRequests: 0,
      averageResponseTime: 0,
      systemErrorRate: 0,
      activeAlerts: 0
    }
  }

  /**
   * Setup metrics collection system
   */
  private setupMetricsCollection(): void {
    this.metricsCollector = new MetricsCollector({
      enabled: true,
      exportInterval: 60000, // 1 minute
      labels: {
        service: 'pulse-monitoring',
        environment: 'production'
      }
    })
  }

  /**
   * Setup health checking for all components
   */
  private setupHealthChecking(): void {
    this.healthChecker = new HealthChecker({
      interval: 30000, // 30 seconds
      checks: [
        {
          name: 'compass-health',
          check: this.checkComponentHealth.bind(this, 'compass'),
          timeout: 5000
        },
        {
          name: 'atlas-health',
          check: this.checkComponentHealth.bind(this, 'atlas'),
          timeout: 5000
        },
        {
          name: 'prism-health',
          check: this.checkComponentHealth.bind(this, 'prism'),
          timeout: 5000
        },
        {
          name: 'clearance-health',
          check: this.checkComponentHealth.bind(this, 'clearance'),
          timeout: 5000
        },
        {
          name: 'event-bus-health',
          check: this.checkEventBusHealth.bind(this),
          timeout: 3000
        },
        {
          name: 'trust-engine-health',
          check: this.checkTrustEngineHealth.bind(this),
          timeout: 3000
        }
      ],
      onStatusChange: this.handleHealthStatusChange.bind(this)
    })
  }

  /**
   * Setup event subscriptions to monitor all component activity
   */
  private setupEventSubscriptions(): void {
    // Subscribe to all events from all components
    const unsubscribe = this.eventBus.subscribe('*', this.handleComponentEvent.bind(this))
    
    // Track component-specific events
    const components = ['compass', 'atlas', 'prism', 'pulse', 'cipher', 'nexus', 'beacon', 'clearance']
    
    components.forEach(component => {
      this.eventBus.subscribeToComponent(component, (event) => {
        this.updateComponentMetrics(component, event)
      })
    })

    this.logger.info('Event subscriptions configured for all components')
  }

  /**
   * Setup WebSocket server for real-time updates
   */
  private setupWebSocketServer(): void {
    this.wsServer = new WebSocket.Server({ 
      port: this.config.websocket.port,
      perMessageDeflate: false 
    })

    this.wsServer.on('connection', (ws: WebSocket, request) => {
      this.logger.info('New WebSocket connection established', { 
        ip: request.socket.remoteAddress 
      })
      
      this.connectedClients.add(ws)
      
      // Send current system status to new client
      this.sendToClient(ws, {
        type: 'metrics',
        data: this.systemMetrics,
        timestamp: new Date().toISOString()
      })

      // Setup heartbeat
      const heartbeat = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping()
        } else {
          clearInterval(heartbeat)
        }
      }, this.config.websocket.heartbeatInterval)

      ws.on('close', () => {
        this.connectedClients.delete(ws)
        clearInterval(heartbeat)
        this.logger.info('WebSocket connection closed')
      })

      ws.on('error', (error) => {
        this.logger.error('WebSocket error', { error })
        this.connectedClients.delete(ws)
        clearInterval(heartbeat)
      })

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString())
          this.handleWebSocketMessage(ws, message)
        } catch (error) {
          this.logger.error('Invalid WebSocket message', { error, data: data.toString() })
        }
      })
    })

    this.logger.info('WebSocket server started', { port: this.config.websocket.port })
  }

  /**
   * Start all monitoring loops
   */
  private startMonitoringLoops(): void {
    // Metrics aggregation every 10 seconds
    this.metricsInterval = setInterval(() => {
      this.aggregateSystemMetrics()
    }, 10000)

    // Trust score calculation every 30 seconds
    this.trustScoreInterval = setInterval(() => {
      this.calculateRealTimeTrustScore()
    }, 30000)

    // Anomaly detection every 60 seconds
    if (this.config.monitoring.anomalyDetectionEnabled) {
      this.anomalyDetectionInterval = setInterval(() => {
        this.performAnomalyDetection()
      }, 60000)
    }

    this.logger.info('Monitoring loops started')
  }

  /**
   * Handle incoming component events
   */
  private async handleComponentEvent(event: ERIPEvent): Promise<void> {
    try {
      // Record event metrics
      this.metricsCollector.incrementCounter('events_received', { 
        source: event.source,
        type: event.type 
      })

      // Update component activity
      this.updateComponentActivity(event.source, event.type)

      // Check for alerting conditions
      await this.evaluateAlertConditions(event)

      // Store metrics if needed
      await this.storeMetricsData(event)

      // Broadcast real-time update
      if (this.config.monitoring.realTimeUpdatesEnabled) {
        this.broadcastRealTimeUpdate({
          type: 'metrics',
          data: { event },
          timestamp: new Date().toISOString()
        })
      }

    } catch (error) {
      this.logger.error('Error handling component event', { event, error })
    }
  }

  /**
   * Update component metrics based on events
   */
  private updateComponentMetrics(componentId: string, event: ERIPEvent): void {
    let metrics = this.componentMetrics.get(componentId)
    
    if (!metrics) {
      metrics = {
        componentId,
        name: componentId.toUpperCase(),
        status: 'healthy',
        responseTime: 0,
        errorRate: 0,
        requestsPerSecond: 0,
        lastActivity: new Date().toISOString(),
        trustContribution: 0,
        alerts: []
      }
      this.componentMetrics.set(componentId, metrics)
    }

    // Update last activity
    metrics.lastActivity = new Date().toISOString()

    // Calculate response time if available
    if (event.data && typeof event.data === 'object' && 'processingTime' in event.data) {
      metrics.responseTime = this.updateMovingAverage(
        metrics.responseTime,
        event.data.processingTime as number
      )
    }

    // Update trust contribution
    if (event.data && typeof event.data === 'object' && 'trustEquityImpact' in event.data) {
      metrics.trustContribution += event.data.trustEquityImpact as number
    }

    // Evaluate component health
    metrics.status = this.evaluateComponentHealth(metrics)
  }

  /**
   * Update component activity tracking
   */
  private updateComponentActivity(source: string, eventType: string): void {
    const key = `${source}:${eventType}`
    const now = Date.now()
    
    // Update request per second calculation
    this.metricsCollector.incrementCounter('component_events', { 
      component: source,
      event_type: eventType 
    })

    // Track for RPS calculation
    const rpsKey = `rps:${source}`
    let rpsData = this.baselines.get(rpsKey) || []
    rpsData.push(now)
    
    // Keep only last minute of data
    const oneMinuteAgo = now - 60000
    rpsData = rpsData.filter(timestamp => timestamp > oneMinuteAgo)
    
    this.baselines.set(rpsKey, rpsData)
  }

  /**
   * Evaluate alert conditions for incoming events
   */
  private async evaluateAlertConditions(event: ERIPEvent): Promise<void> {
    if (!this.config.monitoring.alertingEnabled) return

    // Check for error conditions
    if (this.isErrorEvent(event)) {
      await this.createAlert({
        severity: this.getErrorSeverity(event),
        component: event.source,
        title: `Error detected in ${event.source}`,
        description: `Error event: ${event.type}`,
        metadata: { event }
      })
    }

    // Check for high-risk conditions
    if (this.isHighRiskEvent(event)) {
      await this.createAlert({
        severity: 'warning',
        component: event.source,
        title: `High-risk event detected`,
        description: `High-risk event: ${event.type} from ${event.source}`,
        metadata: { event }
      })
    }

    // Check for performance thresholds
    if (event.data && typeof event.data === 'object' && 'processingTime' in event.data) {
      const processingTime = event.data.processingTime as number
      if (processingTime > this.config.thresholds.responseTimeMs) {
        await this.createAlert({
          severity: 'warning',
          component: event.source,
          title: `Slow response detected`,
          description: `Processing time (${processingTime}ms) exceeded threshold (${this.config.thresholds.responseTimeMs}ms)`,
          metadata: { processingTime, threshold: this.config.thresholds.responseTimeMs }
        })
      }
    }
  }

  /**
   * Aggregate system-wide metrics
   */
  private aggregateSystemMetrics(): void {
    const components = Array.from(this.componentMetrics.values())
    const now = new Date().toISOString()

    // Calculate overall health
    const healthyComponents = components.filter(c => c.status === 'healthy').length
    const totalComponents = components.length
    const healthPercentage = totalComponents > 0 ? healthyComponents / totalComponents : 1

    let overallHealth: 'healthy' | 'degraded' | 'unhealthy'
    if (healthPercentage >= 0.8) overallHealth = 'healthy'
    else if (healthPercentage >= 0.5) overallHealth = 'degraded'
    else overallHealth = 'unhealthy'

    // Calculate system-wide response time
    const avgResponseTime = components.length > 0 
      ? components.reduce((sum, c) => sum + c.responseTime, 0) / components.length 
      : 0

    // Calculate system error rate
    const totalRequests = this.metricsCollector.getCounterValue('events_received')
    const totalErrors = this.metricsCollector.getCounterValue('events_processed_failure')
    const systemErrorRate = totalRequests > 0 ? totalErrors / totalRequests : 0

    // Update system metrics
    this.systemMetrics = {
      timestamp: now,
      overallHealth,
      trustScore: this.systemMetrics.trustScore, // Will be updated by trust score calculation
      activeComponents: totalComponents,
      totalRequests,
      averageResponseTime: avgResponseTime,
      systemErrorRate: systemErrorRate * 100,
      activeAlerts: this.activeAlerts.size
    }

    // Store in history
    this.metricsHistory.push({
      timestamp: Date.now(),
      metrics: { ...this.systemMetrics }
    })

    // Trim history if too large
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory.shift()
    }

    // Broadcast update
    if (this.config.monitoring.realTimeUpdatesEnabled) {
      this.broadcastRealTimeUpdate({
        type: 'metrics',
        data: this.systemMetrics,
        timestamp: now
      })
    }

    this.metricsCollector.recordHistogram('system_health_percentage', healthPercentage * 100)
    this.metricsCollector.recordHistogram('system_response_time', avgResponseTime)
    this.metricsCollector.recordHistogram('system_error_rate', systemErrorRate * 100)
  }

  /**
   * Calculate real-time trust score
   */
  private async calculateRealTimeTrustScore(): Promise<void> {
    try {
      // Get system-wide trust score
      const trustScore = await this.trustEngine.getTrustScore('system', 'organization')
      
      // Update system metrics
      this.systemMetrics.trustScore = trustScore

      // Check trust score thresholds
      if (trustScore < this.config.thresholds.trustScoreMinimum) {
        await this.createAlert({
          severity: 'warning',
          component: 'trust-engine',
          title: 'Trust Score Below Threshold',
          description: `System trust score (${trustScore}) is below minimum threshold (${this.config.thresholds.trustScoreMinimum})`,
          metadata: { trustScore, threshold: this.config.thresholds.trustScoreMinimum }
        })
      }

      // Broadcast trust score update
      if (this.config.monitoring.realTimeUpdatesEnabled) {
        this.broadcastRealTimeUpdate({
          type: 'trust_score',
          data: { trustScore, timestamp: new Date().toISOString() },
          timestamp: new Date().toISOString()
        })
      }

      this.logger.debug('Trust score calculated', { trustScore })

    } catch (error) {
      this.logger.error('Failed to calculate trust score', { error })
    }
  }

  /**
   * Perform anomaly detection on metrics
   */
  private performAnomalyDetection(): void {
    if (!this.config.monitoring.anomalyDetectionEnabled) return

    const metrics = [
      'system_response_time',
      'system_error_rate',
      'events_per_second',
      'trust_score'
    ]

    metrics.forEach(metric => {
      const anomaly = this.detectAnomaly(metric)
      if (anomaly) {
        this.handleAnomalyDetected(anomaly)
      }
    })
  }

  /**
   * Detect anomaly in a specific metric
   */
  private detectAnomaly(metric: string): AnomalyDetection | null {
    const baseline = this.baselines.get(metric) || []
    if (baseline.length < this.baselineWindow) return null

    const currentValue = this.getCurrentMetricValue(metric)
    const mean = baseline.reduce((sum, val) => sum + val, 0) / baseline.length
    const stdDev = Math.sqrt(
      baseline.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / baseline.length
    )

    const deviation = Math.abs(currentValue - mean) / (stdDev || 1)
    const threshold = 3 // 3 standard deviations

    if (deviation > threshold) {
      return {
        metric,
        expected: mean,
        actual: currentValue,
        deviation,
        confidence: Math.min(deviation / threshold, 1),
        timestamp: new Date().toISOString()
      }
    }

    return null
  }

  /**
   * Handle detected anomaly
   */
  private async handleAnomalyDetected(anomaly: AnomalyDetection): Promise<void> {
    this.logger.warn('Anomaly detected', anomaly)

    await this.createAlert({
      severity: anomaly.confidence > 0.8 ? 'error' : 'warning',
      component: 'anomaly-detection',
      title: `Anomaly detected in ${anomaly.metric}`,
      description: `Metric ${anomaly.metric} deviated significantly from baseline. Expected: ${anomaly.expected.toFixed(2)}, Actual: ${anomaly.actual.toFixed(2)}`,
      metadata: anomaly
    })

    // Broadcast anomaly detection
    if (this.config.monitoring.realTimeUpdatesEnabled) {
      this.broadcastRealTimeUpdate({
        type: 'anomaly',
        data: anomaly,
        timestamp: anomaly.timestamp
      })
    }
  }

  /**
   * Create and manage alerts
   */
  private async createAlert(alertData: {
    severity: 'info' | 'warning' | 'error' | 'critical'
    component: string
    title: string
    description: string
    metadata?: Record<string, any>
  }): Promise<Alert> {
    const alert: Alert = {
      id: this.generateAlertId(),
      ...alertData,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      resolved: false,
      metadata: alertData.metadata || {}
    }

    this.activeAlerts.set(alert.id, alert)

    // Add to component metrics
    const componentMetrics = this.componentMetrics.get(alertData.component)
    if (componentMetrics) {
      componentMetrics.alerts.push(alert)
    }

    // Publish alert event
    await this.eventBus.publish({
      eventId: `alert_${alert.id}`,
      timestamp: alert.timestamp,
      type: 'monitoring.alert',
      source: 'pulse',
      data: {
        alertId: alert.id,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        source: alertData.component,
        timestamp: alert.timestamp,
        affectedAssets: [],
        correlatedEvents: [],
        autoRemediationTriggered: false,
        trustEquityImpact: 0
      }
    })

    // Broadcast alert
    if (this.config.monitoring.realTimeUpdatesEnabled) {
      this.broadcastRealTimeUpdate({
        type: 'alert',
        data: alert,
        timestamp: alert.timestamp
      })
    }

    this.logger.info('Alert created', alert)
    return alert
  }

  /**
   * Health check methods for different components
   */
  private async checkComponentHealth(component: string): Promise<{ status: 'healthy' | 'unhealthy'; details?: string }> {
    try {
      const metrics = this.componentMetrics.get(component)
      if (!metrics) {
        return { status: 'unhealthy', details: 'Component not found' }
      }

      const lastActivity = new Date(metrics.lastActivity)
      const timeSinceActivity = Date.now() - lastActivity.getTime()
      const timeoutThreshold = 300000 // 5 minutes

      if (timeSinceActivity > timeoutThreshold) {
        return { status: 'unhealthy', details: 'No recent activity' }
      }

      if (metrics.errorRate > this.config.thresholds.errorRatePercent) {
        return { status: 'unhealthy', details: `High error rate: ${metrics.errorRate}%` }
      }

      return { status: 'healthy' }

    } catch (error) {
      return { 
        status: 'unhealthy', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async checkEventBusHealth(): Promise<{ status: 'healthy' | 'unhealthy'; details?: string }> {
    try {
      // Test event bus with a health check event
      await this.eventBus.publish({
        eventId: 'health-check',
        timestamp: new Date().toISOString(),
        type: 'health.check' as any,
        source: 'pulse',
        data: { test: true }
      })
      return { status: 'healthy' }
    } catch (error) {
      return { 
        status: 'unhealthy', 
        details: error instanceof Error ? error.message : 'Event bus failure'
      }
    }
  }

  private async checkTrustEngineHealth(): Promise<{ status: 'healthy' | 'unhealthy'; details?: string }> {
    try {
      await this.trustEngine.getTrustScore('health-check', 'organization')
      return { status: 'healthy' }
    } catch (error) {
      return { 
        status: 'unhealthy', 
        details: error instanceof Error ? error.message : 'Trust engine failure'
      }
    }
  }

  /**
   * Handle health status changes
   */
  private async handleHealthStatusChange(status: HealthStatus): Promise<void> {
    this.logger.info('Health status changed', { 
      status: status.status,
      unhealthyChecks: status.checks.filter(c => c.status === 'unhealthy').length
    })

    // Create alert for health degradation
    if (status.status !== 'healthy') {
      const unhealthyChecks = status.checks.filter(c => c.status === 'unhealthy')
      await this.createAlert({
        severity: status.status === 'unhealthy' ? 'critical' : 'warning',
        component: 'system',
        title: `System health ${status.status}`,
        description: `Health checks failing: ${unhealthyChecks.map(c => c.name).join(', ')}`,
        metadata: { healthStatus: status }
      })
    }

    // Broadcast health update
    if (this.config.monitoring.realTimeUpdatesEnabled) {
      this.broadcastRealTimeUpdate({
        type: 'health',
        data: status,
        timestamp: status.timestamp
      })
    }
  }

  /**
   * WebSocket message handling
   */
  private handleWebSocketMessage(ws: WebSocket, message: any): void {
    try {
      switch (message.type) {
        case 'subscribe':
          // Handle subscription to specific metrics
          break
          
        case 'acknowledge_alert':
          this.acknowledgeAlert(message.alertId)
          break
          
        case 'resolve_alert':
          this.resolveAlert(message.alertId)
          break
          
        case 'get_metrics':
          this.sendToClient(ws, {
            type: 'metrics',
            data: this.systemMetrics,
            timestamp: new Date().toISOString()
          })
          break
      }
    } catch (error) {
      this.logger.error('Error handling WebSocket message', { message, error })
    }
  }

  /**
   * Broadcast real-time update to all connected clients
   */
  private broadcastRealTimeUpdate(update: RealTimeUpdate): void {
    const message = JSON.stringify(update)
    
    this.connectedClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message)
        } catch (error) {
          this.logger.error('Failed to send WebSocket message', { error })
          this.connectedClients.delete(client)
        }
      }
    })
  }

  /**
   * Send message to specific client
   */
  private sendToClient(client: WebSocket, update: RealTimeUpdate): void {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(update))
      } catch (error) {
        this.logger.error('Failed to send message to client', { error })
      }
    }
  }

  /**
   * Public API methods
   */
  public getSystemMetrics(): SystemMetrics {
    return { ...this.systemMetrics }
  }

  public getComponentMetrics(): ComponentMetrics[] {
    return Array.from(this.componentMetrics.values())
  }

  public getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values())
  }

  public getMetricsHistory(hours: number = 1): Array<{ timestamp: number; metrics: SystemMetrics }> {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000)
    return this.metricsHistory.filter(entry => entry.timestamp >= cutoff)
  }

  public async acknowledgeAlert(alertId: string): Promise<boolean> {
    const alert = this.activeAlerts.get(alertId)
    if (alert) {
      alert.acknowledged = true
      
      // Broadcast update
      if (this.config.monitoring.realTimeUpdatesEnabled) {
        this.broadcastRealTimeUpdate({
          type: 'alert',
          data: alert,
          timestamp: new Date().toISOString()
        })
      }
      
      return true
    }
    return false
  }

  public async resolveAlert(alertId: string): Promise<boolean> {
    const alert = this.activeAlerts.get(alertId)
    if (alert) {
      alert.resolved = true
      alert.resolutionTime = new Date().toISOString()
      
      // Remove from active alerts
      this.activeAlerts.delete(alertId)
      
      // Broadcast update
      if (this.config.monitoring.realTimeUpdatesEnabled) {
        this.broadcastRealTimeUpdate({
          type: 'alert',
          data: alert,
          timestamp: new Date().toISOString()
        })
      }
      
      return true
    }
    return false
  }

  /**
   * Utility methods
   */
  private isErrorEvent(event: ERIPEvent): boolean {
    return event.type.includes('error') || 
           event.type.includes('failure') || 
           (event.data && typeof event.data === 'object' && 'error' in event.data)
  }

  private getErrorSeverity(event: ERIPEvent): 'info' | 'warning' | 'error' | 'critical' {
    if (event.type.includes('critical') || event.source === 'atlas' && event.type.includes('vulnerability')) {
      return 'critical'
    }
    if (event.type.includes('high') || event.type.includes('failure')) {
      return 'error'
    }
    return 'warning'
  }

  private isHighRiskEvent(event: ERIPEvent): boolean {
    return event.type.includes('vulnerability') ||
           event.type.includes('breach') ||
           event.type.includes('compliance.gap') ||
           (event.data && typeof event.data === 'object' && 'severity' in event.data && event.data.severity === 'critical')
  }

  private evaluateComponentHealth(metrics: ComponentMetrics): 'healthy' | 'degraded' | 'unhealthy' {
    if (metrics.errorRate > this.config.thresholds.errorRatePercent * 2) return 'unhealthy'
    if (metrics.responseTime > this.config.thresholds.responseTimeMs * 2) return 'unhealthy'
    if (metrics.errorRate > this.config.thresholds.errorRatePercent) return 'degraded'
    if (metrics.responseTime > this.config.thresholds.responseTimeMs) return 'degraded'
    return 'healthy'
  }

  private updateMovingAverage(currentAvg: number, newValue: number, weight: number = 0.1): number {
    return currentAvg + weight * (newValue - currentAvg)
  }

  private getCurrentMetricValue(metric: string): number {
    switch (metric) {
      case 'system_response_time':
        return this.systemMetrics.averageResponseTime
      case 'system_error_rate':
        return this.systemMetrics.systemErrorRate
      case 'trust_score':
        return this.systemMetrics.trustScore
      case 'events_per_second':
        return this.metricsCollector.getCounterValue('events_received') / 60 // Approximate
      default:
        return 0
    }
  }

  private async storeMetricsData(event: ERIPEvent): Promise<void> {
    // Implementation would store metrics in InfluxDB or similar time-series database
    // For now, we just log the metrics
    this.logger.debug('Storing metrics data', { 
      source: event.source, 
      type: event.type,
      timestamp: event.timestamp 
    })
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Shutdown the monitoring service
   */
  public shutdown(): void {
    // Clear intervals
    if (this.metricsInterval) clearInterval(this.metricsInterval)
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval)
    if (this.trustScoreInterval) clearInterval(this.trustScoreInterval)
    if (this.anomalyDetectionInterval) clearInterval(this.anomalyDetectionInterval)

    // Close WebSocket server
    if (this.wsServer) {
      this.connectedClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.close()
        }
      })
      this.wsServer.close()
    }

    // Shutdown components
    this.metricsCollector?.shutdown()
    this.healthChecker?.shutdown()

    this.logger.info('PULSE monitoring service shutdown complete')
  }
}

/**
 * Factory function to create PULSE monitoring service
 */
export function createPulseMonitoringService(config: PulseConfig): PulseMonitoringService {
  return new PulseMonitoringService(config)
}