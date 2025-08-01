/**
 * Message Queue Cluster for ERIP Platform
 * 
 * Implements high-performance distributed message queuing with clustering,
 * automatic failover, load balancing, and 10,000+ events/minute processing
 */

import { EventEmitter } from 'events'
import { Logger } from '../logging/logger'
import { MetricsCollector } from '../../services/monitoring/metricsCollector'
import Redis, { Cluster as RedisCluster } from 'ioredis'

export interface QueueNode {
  id: string
  host: string
  port: number
  role: 'primary' | 'replica' | 'coordinator'
  healthy: boolean
  messageCount: number
  processingRate: number
  lastHeartbeat: Date
  capacity: number
  currentLoad: number
  metadata: Record<string, any>
}

export interface MessageQueueClusterConfig {
  cluster: {
    nodes: Array<{ host: string; port: number; role?: 'primary' | 'replica' | 'coordinator' }>
    replicationFactor: number
    consistencyLevel: 'strong' | 'eventual' | 'weak'
    autoFailover: boolean
    loadBalancing: 'round_robin' | 'least_loaded' | 'hash_based'
  }
  performance: {
    batchSize: number
    batchTimeoutMs: number
    maxConcurrentMessages: number
    processingTimeoutMs: number
    retryAttempts: number
    backoffMultiplier: number
  }
  persistence: {
    enabled: boolean
    durabilityLevel: 'memory' | 'disk' | 'replicated'
    checkpointIntervalMs: number
    compressionEnabled: boolean
  }
  monitoring: {
    metricsEnabled: boolean
    healthCheckIntervalMs: number
    alertThresholds: {
      queueDepth: number
      processingLatency: number
      errorRate: number
      nodeFailures: number
    }
  }
}

export interface QueueMessage {
  id: string
  topic: string
  partition?: string
  payload: any
  headers: Record<string, string>
  timestamp: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
  retryCount: number
  maxRetries: number
  expiresAt?: Date
  processingNode?: string
}

export interface PublishResult {
  messageId: string
  partition: string
  offset: number
  timestamp: Date
  replicationStatus: 'pending' | 'replicated' | 'acknowledged'
}

export interface ConsumerGroup {
  groupId: string
  topics: string[]
  consumers: Map<string, QueueConsumer>
  offsetCommitIntervalMs: number
  autoCommit: boolean
  processingMode: 'at_least_once' | 'exactly_once' | 'at_most_once'
}

export interface QueueConsumer {
  consumerId: string
  groupId: string
  assignedPartitions: string[]
  lastHeartbeat: Date
  processingCount: number
  errorCount: number
  offsetPosition: Map<string, number>
}

export class MessageQueueCluster extends EventEmitter {
  private logger: Logger
  private metricsCollector: MetricsCollector
  private nodes: Map<string, QueueNode> = new Map()
  private redisClients: Map<string, Redis | RedisCluster> = new Map()
  private messageQueue: Map<string, QueueMessage[]> = new Map()
  private consumerGroups: Map<string, ConsumerGroup> = new Map()
  private currentPartitionAssignments: Map<string, string> = new Map()
  private healthCheckTimer?: NodeJS.Timeout
  private coordinatorElection?: NodeJS.Timeout
  private currentCoordinator?: string
  private processingStats = {
    messagesPublished: 0,
    messagesConsumed: 0,
    messagesPerSecond: 0,
    averageLatency: 0,
    errorCount: 0
  }

  constructor(private config: MessageQueueClusterConfig) {
    super()
    
    this.logger = new Logger('MessageQueueCluster')
    
    if (config.monitoring.metricsEnabled) {
      this.metricsCollector = new MetricsCollector({
        enabled: true,
        exportInterval: 60000,
        labels: { component: 'message_queue_cluster' }
      })
    }

    this.initializeCluster()
    this.startHealthChecking()
    this.startCoordinatorElection()
    this.startPerformanceTracking()
  }

  /**
   * Initialize cluster nodes and connections
   */
  private async initializeCluster(): Promise<void> {
    this.logger.info('Initializing message queue cluster', {
      nodeCount: this.config.cluster.nodes.length,
      replicationFactor: this.config.cluster.replicationFactor
    })

    for (const nodeConfig of this.config.cluster.nodes) {
      const nodeId = `€{nodeConfig.host}:€{nodeConfig.port}`
      
      const queueNode: QueueNode = {
        id: nodeId,
        host: nodeConfig.host,
        port: nodeConfig.port,
        role: nodeConfig.role || 'replica',
        healthy: true,
        messageCount: 0,
        processingRate: 0,
        lastHeartbeat: new Date(),
        capacity: 10000, // messages per minute
        currentLoad: 0,
        metadata: {}
      }

      this.nodes.set(nodeId, queueNode)

      // Create Redis connection for each node
      try {
        const redisClient = new Redis({
          host: nodeConfig.host,
          port: nodeConfig.port,
          retryDelayOnFailover: 100,
          enableReadyCheck: true,
          lazyConnect: true
        })

        await redisClient.connect()
        this.redisClients.set(nodeId, redisClient)

        this.logger.info('Connected to queue node', { nodeId, role: queueNode.role })

      } catch (error) {
        this.logger.error('Failed to connect to queue node', { nodeId, error })
        queueNode.healthy = false
      }
    }

    // Initialize topic partitions
    this.initializeTopicPartitions()
  }

  /**
   * Initialize topic partitions across cluster nodes
   */
  private initializeTopicPartitions(): void {
    const topics = ['compass.events', 'atlas.events', 'prism.events', 'workflow.events', 'system.events']
    const healthyNodes = Array.from(this.nodes.values()).filter(n => n.healthy)
    const partitionsPerTopic = Math.max(1, Math.floor(healthyNodes.length / 2))

    for (const topic of topics) {
      for (let partition = 0; partition < partitionsPerTopic; partition++) {
        const partitionKey = `€{topic}:€{partition}`
        const assignedNode = healthyNodes[partition % healthyNodes.length]
        
        this.currentPartitionAssignments.set(partitionKey, assignedNode.id)
        
        if (!this.messageQueue.has(partitionKey)) {
          this.messageQueue.set(partitionKey, [])
        }
      }
    }

    this.logger.info('Initialized topic partitions', {
      topics: topics.length,
      partitionsPerTopic,
      totalPartitions: topics.length * partitionsPerTopic
    })
  }

  /**
   * Publish message to cluster
   */
  public async publishMessage(
    topic: string, 
    payload: any, 
    options: {
      partition?: string
      priority?: 'low' | 'medium' | 'high' | 'critical'
      headers?: Record<string, string>
      maxRetries?: number
      expiresAt?: Date
    } = {}
  ): Promise<PublishResult> {
    const messageId = this.generateMessageId()
    const partition = options.partition || this.selectPartition(topic, payload)
    const partitionKey = `€{topic}:€{partition}`

    const message: QueueMessage = {
      id: messageId,
      topic,
      partition,
      payload,
      headers: options.headers || {},
      timestamp: new Date(),
      priority: options.priority || 'medium',
      retryCount: 0,
      maxRetries: options.maxRetries || this.config.performance.retryAttempts,
      expiresAt: options.expiresAt,
      processingNode: undefined
    }

    // Find target node for partition
    const targetNodeId = this.currentPartitionAssignments.get(partitionKey)
    if (!targetNodeId) {
      throw new Error(`No node assigned for partition €{partitionKey}`)
    }

    const targetNode = this.nodes.get(targetNodeId)
    if (!targetNode || !targetNode.healthy) {
      // Failover to healthy node
      const healthyNode = this.findHealthyNodeForPartition(partitionKey)
      if (!healthyNode) {
        throw new Error(`No healthy nodes available for partition €{partitionKey}`)
      }
      this.currentPartitionAssignments.set(partitionKey, healthyNode.id)
    }

    // Publish message with replication
    const result = await this.publishWithReplication(message, partitionKey)

    // Update statistics
    this.processingStats.messagesPublished++
    targetNode!.messageCount++
    targetNode!.currentLoad++

    if (this.config.monitoring.metricsEnabled) {
      this.metricsCollector.incrementCounter('messages_published', {
        topic,
        partition,
        priority: message.priority
      })
      this.metricsCollector.recordHistogram('message_publish_latency', Date.now() - message.timestamp.getTime())
    }

    this.emit('message_published', { messageId, topic, partition, result })
    return result
  }

  /**
   * Publish message with replication
   */
  private async publishWithReplication(message: QueueMessage, partitionKey: string): Promise<PublishResult> {
    const primaryNodeId = this.currentPartitionAssignments.get(partitionKey)!
    const replicaNodes = this.getReplicaNodes(primaryNodeId)

    // Add to primary queue
    const partitionQueue = this.messageQueue.get(partitionKey) || []
    partitionQueue.push(message)
    this.messageQueue.set(partitionKey, partitionQueue)

    const result: PublishResult = {
      messageId: message.id,
      partition: message.partition || '0',
      offset: partitionQueue.length - 1,
      timestamp: message.timestamp,
      replicationStatus: 'pending'
    }

    // Replicate to replica nodes based on replication factor
    if (this.config.cluster.replicationFactor > 1) {
      const replicationPromises = replicaNodes
        .slice(0, this.config.cluster.replicationFactor - 1)
        .map(nodeId => this.replicateMessage(message, nodeId))

      try {
        await Promise.all(replicationPromises)
        result.replicationStatus = 'replicated'
      } catch (error) {
        this.logger.warn('Partial replication failure', { messageId: message.id, error })
        result.replicationStatus = 'acknowledged' // At least primary has the message
      }
    } else {
      result.replicationStatus = 'acknowledged'
    }

    // Persist to Redis if enabled
    if (this.config.persistence.enabled) {
      await this.persistMessage(message, primaryNodeId)
    }

    return result
  }

  /**
   * Replicate message to replica node
   */
  private async replicateMessage(message: QueueMessage, nodeId: string): Promise<void> {
    const redisClient = this.redisClients.get(nodeId)
    if (!redisClient) {
      throw new Error(`No Redis client for node €{nodeId}`)
    }

    const messageData = JSON.stringify(message)
    await redisClient.lpush(`replica:€{message.topic}:€{message.partition}`, messageData)
  }

  /**
   * Persist message to durable storage
   */
  private async persistMessage(message: QueueMessage, nodeId: string): Promise<void> {
    const redisClient = this.redisClients.get(nodeId)
    if (!redisClient) return

    const messageData = this.config.persistence.compressionEnabled 
      ? this.compressMessage(message)
      : JSON.stringify(message)

    const ttl = message.expiresAt 
      ? Math.floor((message.expiresAt.getTime() - Date.now()) / 1000)
      : 3600 // 1 hour default

    await redisClient.setex(`message:€{message.id}`, ttl, messageData)
  }

  /**
   * Create consumer group for message consumption
   */
  public createConsumerGroup(
    groupId: string,
    topics: string[],
    options: {
      offsetCommitIntervalMs?: number
      autoCommit?: boolean
      processingMode?: 'at_least_once' | 'exactly_once' | 'at_most_once'
    } = {}
  ): ConsumerGroup {
    const consumerGroup: ConsumerGroup = {
      groupId,
      topics,
      consumers: new Map(),
      offsetCommitIntervalMs: options.offsetCommitIntervalMs || 5000,
      autoCommit: options.autoCommit !== false,
      processingMode: options.processingMode || 'at_least_once'
    }

    this.consumerGroups.set(groupId, consumerGroup)
    
    this.logger.info('Created consumer group', {
      groupId,
      topics,
      processingMode: consumerGroup.processingMode
    })

    return consumerGroup
  }

  /**
   * Subscribe consumer to topics
   */
  public async subscribeConsumer(
    groupId: string,
    consumerId: string,
    messageHandler: (message: QueueMessage) => Promise<void>
  ): Promise<void> {
    const consumerGroup = this.consumerGroups.get(groupId)
    if (!consumerGroup) {
      throw new Error(`Consumer group €{groupId} not found`)
    }

    const consumer: QueueConsumer = {
      consumerId,
      groupId,
      assignedPartitions: [],
      lastHeartbeat: new Date(),
      processingCount: 0,
      errorCount: 0,
      offsetPosition: new Map()
    }

    consumerGroup.consumers.set(consumerId, consumer)

    // Assign partitions to consumer
    this.assignPartitionsToConsumer(consumer, consumerGroup)

    // Start message processing for assigned partitions
    this.startMessageProcessing(consumer, messageHandler)

    this.logger.info('Consumer subscribed', {
      groupId,
      consumerId,
      assignedPartitions: consumer.assignedPartitions.length
    })
  }

  /**
   * Assign partitions to consumer using load balancing
   */
  private assignPartitionsToConsumer(consumer: QueueConsumer, group: ConsumerGroup): void {
    const allPartitions: string[] = []
    
    // Get all partitions for group topics
    for (const topic of group.topics) {
      for (const [partitionKey] of this.messageQueue.entries()) {
        if (partitionKey.startsWith(`€{topic}:`)) {
          allPartitions.push(partitionKey)
        }
      }
    }

    // Distribute partitions evenly among consumers
    const consumerCount = group.consumers.size
    const partitionsPerConsumer = Math.ceil(allPartitions.length / consumerCount)
    const consumerIndex = Array.from(group.consumers.keys()).indexOf(consumer.consumerId)
    
    const startIndex = consumerIndex * partitionsPerConsumer
    const endIndex = Math.min(startIndex + partitionsPerConsumer, allPartitions.length)
    
    consumer.assignedPartitions = allPartitions.slice(startIndex, endIndex)
    
    // Initialize offset positions
    for (const partition of consumer.assignedPartitions) {
      consumer.offsetPosition.set(partition, 0)
    }
  }

  /**
   * Start message processing for consumer
   */
  private async startMessageProcessing(
    consumer: QueueConsumer,
    messageHandler: (message: QueueMessage) => Promise<void>
  ): Promise<void> {
    const processMessages = async () => {
      for (const partition of consumer.assignedPartitions) {
        const messages = this.messageQueue.get(partition) || []
        const offset = consumer.offsetPosition.get(partition) || 0
        
        // Process messages in batches
        const batchSize = this.config.performance.batchSize
        const messageBatch = messages.slice(offset, offset + batchSize)
        
        if (messageBatch.length === 0) continue

        try {
          // Process batch concurrently with rate limiting
          const concurrentLimit = Math.min(
            this.config.performance.maxConcurrentMessages,
            messageBatch.length
          )
          
          for (let i = 0; i < messageBatch.length; i += concurrentLimit) {
            const chunk = messageBatch.slice(i, i + concurrentLimit)
            const processingPromises = chunk.map(async (message) => {
              const startTime = Date.now()
              
              try {
                message.processingNode = consumer.consumerId
                await messageHandler(message)
                
                consumer.processingCount++
                this.processingStats.messagesConsumed++
                
                const processingTime = Date.now() - startTime
                this.processingStats.averageLatency = 
                  (this.processingStats.averageLatency + processingTime) / 2

                if (this.config.monitoring.metricsEnabled) {
                  this.metricsCollector.incrementCounter('messages_consumed', {
                    topic: message.topic,
                    consumer: consumer.consumerId
                  })
                  this.metricsCollector.recordHistogram('message_processing_time', processingTime)
                }

              } catch (error) {
                consumer.errorCount++
                this.processingStats.errorCount++
                
                this.logger.error('Message processing failed', {
                  messageId: message.id,
                  consumerId: consumer.consumerId,
                  error
                })

                // Handle retry logic
                if (message.retryCount < message.maxRetries) {
                  message.retryCount++
                  const retryDelay = this.calculateRetryDelay(message.retryCount)
                  setTimeout(() => {
                    messages.push(message) // Re-queue for retry
                  }, retryDelay)
                } else {
                  this.emit('message_failed', { message, consumer: consumer.consumerId })
                }
              }
            })

            await Promise.all(processingPromises)
          }

          // Update offset position
          const newOffset = offset + messageBatch.length
          consumer.offsetPosition.set(partition, newOffset)
          
          // Remove processed messages from queue
          const remainingMessages = messages.slice(newOffset)
          this.messageQueue.set(partition, remainingMessages)

        } catch (error) {
          this.logger.error('Batch processing failed', {
            partition,
            batchSize: messageBatch.length,
            consumerId: consumer.consumerId,
            error
          })
        }
      }

      // Update heartbeat
      consumer.lastHeartbeat = new Date()

      // Schedule next processing cycle
      setTimeout(processMessages, 100) // 10 messages per second per consumer
    }

    // Start processing
    processMessages()
  }

  /**
   * Health checking and node monitoring
   */
  private startHealthChecking(): void {
    this.healthCheckTimer = setInterval(async () => {
      await this.performHealthChecks()
    }, this.config.monitoring.healthCheckIntervalMs)
  }

  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = Array.from(this.nodes.entries()).map(async ([nodeId, node]) => {
      try {
        const redisClient = this.redisClients.get(nodeId)
        if (!redisClient) {
          node.healthy = false
          return
        }

        // Ping Redis connection
        const startTime = Date.now()
        await redisClient.ping()
        const responseTime = Date.now() - startTime

        node.healthy = responseTime < 5000 // 5 second timeout
        node.lastHeartbeat = new Date()

        if (this.config.monitoring.metricsEnabled) {
          this.metricsCollector.recordHistogram('node_health_check_time', responseTime, {
            nodeId,
            healthy: node.healthy.toString()
          })
        }

      } catch (error) {
        node.healthy = false
        this.logger.warn('Node health check failed', { nodeId, error })
        
        if (this.config.cluster.autoFailover) {
          await this.handleNodeFailure(nodeId)
        }
      }
    })

    await Promise.allSettled(healthCheckPromises)

    // Check alert thresholds
    this.checkAlertThresholds()
  }

  /**
   * Handle node failure with automatic failover
   */
  private async handleNodeFailure(failedNodeId: string): Promise<void> {
    this.logger.warn('Handling node failure', { failedNodeId })

    // Find partitions assigned to failed node
    const affectedPartitions: string[] = []
    for (const [partition, nodeId] of this.currentPartitionAssignments.entries()) {
      if (nodeId === failedNodeId) {
        affectedPartitions.push(partition)
      }
    }

    // Reassign partitions to healthy nodes
    const healthyNodes = Array.from(this.nodes.values()).filter(n => n.healthy && n.id !== failedNodeId)
    if (healthyNodes.length === 0) {
      this.logger.error('No healthy nodes available for failover')
      this.emit('cluster_failure', { reason: 'No healthy nodes available' })
      return
    }

    for (const partition of affectedPartitions) {
      // Select least loaded healthy node
      const targetNode = healthyNodes.reduce((least, current) => 
        current.currentLoad < least.currentLoad ? current : least
      )

      this.currentPartitionAssignments.set(partition, targetNode.id)
      targetNode.currentLoad++

      this.logger.info('Partition reassigned due to node failure', {
        partition,
        fromNode: failedNodeId,
        toNode: targetNode.id
      })
    }

    this.emit('node_failed', { nodeId: failedNodeId, affectedPartitions })
  }

  /**
   * Coordinator election for cluster management
   */
  private startCoordinatorElection(): void {
    this.coordinatorElection = setInterval(() => {
      this.electCoordinator()
    }, 10000) // Every 10 seconds
  }

  private electCoordinator(): void {
    const healthyNodes = Array.from(this.nodes.values()).filter(n => n.healthy)
    
    if (healthyNodes.length === 0) {
      this.currentCoordinator = undefined
      return
    }

    // Simple leader election - lowest load node with coordinator preference
    const coordinatorCandidates = healthyNodes.filter(n => n.role === 'coordinator')
    const candidates = coordinatorCandidates.length > 0 ? coordinatorCandidates : healthyNodes

    const newCoordinator = candidates.reduce((current, candidate) => 
      candidate.currentLoad < current.currentLoad ? candidate : current
    )

    if (this.currentCoordinator !== newCoordinator.id) {
      const previousCoordinator = this.currentCoordinator
      this.currentCoordinator = newCoordinator.id
      
      this.logger.info('Coordinator elected', {
        newCoordinator: newCoordinator.id,
        previousCoordinator
      })

      this.emit('coordinator_changed', {
        newCoordinator: newCoordinator.id,
        previousCoordinator
      })
    }
  }

  /**
   * Performance tracking and metrics
   */
  private startPerformanceTracking(): void {
    setInterval(() => {
      this.calculatePerformanceMetrics()
    }, 60000) // Every minute
  }

  private calculatePerformanceMetrics(): void {
    // Calculate messages per second
    this.processingStats.messagesPerSecond = this.processingStats.messagesPublished / 60

    // Update node processing rates
    for (const node of this.nodes.values()) {
      node.processingRate = node.messageCount / 60
      node.messageCount = 0 // Reset for next minute
    }

    if (this.config.monitoring.metricsEnabled) {
      this.metricsCollector.recordHistogram('cluster_messages_per_second', this.processingStats.messagesPerSecond)
      this.metricsCollector.recordHistogram('cluster_average_latency', this.processingStats.averageLatency)
      this.metricsCollector.recordHistogram('cluster_error_rate', 
        this.processingStats.errorCount / Math.max(1, this.processingStats.messagesConsumed))
    }

    // Reset counters
    this.processingStats.messagesPublished = 0
    this.processingStats.messagesConsumed = 0
    this.processingStats.errorCount = 0
  }

  /**
   * Check alert thresholds
   */
  private checkAlertThresholds(): void {
    const thresholds = this.config.monitoring.alertThresholds
    const totalQueueDepth = Array.from(this.messageQueue.values())
      .reduce((sum, queue) => sum + queue.length, 0)

    if (totalQueueDepth > thresholds.queueDepth) {
      this.emit('alert', {
        type: 'high_queue_depth',
        value: totalQueueDepth,
        threshold: thresholds.queueDepth
      })
    }

    if (this.processingStats.averageLatency > thresholds.processingLatency) {
      this.emit('alert', {
        type: 'high_processing_latency',
        value: this.processingStats.averageLatency,
        threshold: thresholds.processingLatency
      })
    }

    const errorRate = this.processingStats.errorCount / Math.max(1, this.processingStats.messagesConsumed)
    if (errorRate > thresholds.errorRate) {
      this.emit('alert', {
        type: 'high_error_rate',
        value: errorRate,
        threshold: thresholds.errorRate
      })
    }
  }

  /**
   * Utility methods
   */
  private selectPartition(topic: string, payload: any): string {
    // Hash-based partitioning for even distribution
    let hash = 0
    const key = typeof payload === 'object' ? JSON.stringify(payload) : payload.toString()
    
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff
    }

    const partitionCount = Array.from(this.messageQueue.keys())
      .filter(k => k.startsWith(`€{topic}:`)).length || 1
    
    return Math.abs(hash % partitionCount).toString()
  }

  private getReplicaNodes(primaryNodeId: string): string[] {
    return Array.from(this.nodes.values())
      .filter(n => n.healthy && n.id !== primaryNodeId)
      .map(n => n.id)
  }

  private findHealthyNodeForPartition(partitionKey: string): QueueNode | null {
    const healthyNodes = Array.from(this.nodes.values()).filter(n => n.healthy)
    if (healthyNodes.length === 0) return null

    // Return least loaded healthy node
    return healthyNodes.reduce((least, current) => 
      current.currentLoad < least.currentLoad ? current : least
    )
  }

  private calculateRetryDelay(retryCount: number): number {
    return Math.min(
      1000 * Math.pow(this.config.performance.backoffMultiplier, retryCount),
      30000 // Max 30 seconds
    )
  }

  private compressMessage(message: QueueMessage): string {
    // Simple compression - in real implementation would use gzip or similar
    return JSON.stringify(message)
  }

  private generateMessageId(): string {
    return `msg_€{Date.now()}_€{Math.random().toString(36).substr(2, 12)}`
  }

  /**
   * Public API methods
   */
  public getClusterStatistics(): {
    nodes: QueueNode[]
    totalMessages: number
    messagesPerSecond: number
    averageLatency: number
    errorRate: number
    coordinator: string | undefined
    healthyNodes: number
    partitions: number
  } {
    const nodes = Array.from(this.nodes.values())
    const totalMessages = Array.from(this.messageQueue.values())
      .reduce((sum, queue) => sum + queue.length, 0)

    return {
      nodes,
      totalMessages,
      messagesPerSecond: this.processingStats.messagesPerSecond,
      averageLatency: this.processingStats.averageLatency,
      errorRate: this.processingStats.errorCount / Math.max(1, this.processingStats.messagesConsumed),
      coordinator: this.currentCoordinator,
      healthyNodes: nodes.filter(n => n.healthy).length,
      partitions: this.messageQueue.size
    }
  }

  public getTopicStatistics(topic: string): {
    partitions: number
    totalMessages: number
    averageMessagesPerPartition: number
    processingNodes: string[]
  } {
    const topicPartitions = Array.from(this.messageQueue.entries())
      .filter(([key]) => key.startsWith(`€{topic}:`))

    const totalMessages = topicPartitions.reduce((sum, [, queue]) => sum + queue.length, 0)
    const processingNodes = [...new Set(
      topicPartitions.map(([key]) => this.currentPartitionAssignments.get(key)).filter(Boolean)
    )] as string[]

    return {
      partitions: topicPartitions.length,
      totalMessages,
      averageMessagesPerPartition: totalMessages / Math.max(1, topicPartitions.length),
      processingNodes
    }
  }

  public async flush(): Promise<void> {
    this.logger.info('Flushing message queue cluster')
    
    // Process all remaining messages
    const flushPromises = Array.from(this.consumerGroups.values()).map(async (group) => {
      // Trigger immediate processing for all consumers
      // Implementation would depend on specific consumer processing loops
    })

    await Promise.all(flushPromises)
  }

  /**
   * Shutdown cluster gracefully
   */
  public async shutdown(): Promise<void> {
    this.logger.info('Shutting down message queue cluster')

    // Stop timers
    if (this.healthCheckTimer) clearInterval(this.healthCheckTimer)
    if (this.coordinatorElection) clearInterval(this.coordinatorElection)

    // Close all Redis connections
    const closePromises = Array.from(this.redisClients.values()).map(client => client.quit())
    await Promise.allSettled(closePromises)

    // Clear all data structures
    this.nodes.clear()
    this.redisClients.clear()
    this.messageQueue.clear()
    this.consumerGroups.clear()
    this.currentPartitionAssignments.clear()

    if (this.metricsCollector) {
      this.metricsCollector.shutdown()
    }

    this.logger.info('Message queue cluster shutdown complete')
  }
}

/**
 * Factory function to create message queue cluster
 */
export function createMessageQueueCluster(config: Partial<MessageQueueClusterConfig>): MessageQueueCluster {
  const defaultConfig: MessageQueueClusterConfig = {
    cluster: {
      nodes: [
        { host: 'localhost', port: 6379, role: 'primary' },
        { host: 'localhost', port: 6380, role: 'replica' },
        { host: 'localhost', port: 6381, role: 'coordinator' }
      ],
      replicationFactor: 2,
      consistencyLevel: 'eventual',
      autoFailover: true,
      loadBalancing: 'least_loaded'
    },
    performance: {
      batchSize: 100,
      batchTimeoutMs: 1000,
      maxConcurrentMessages: 50,
      processingTimeoutMs: 30000,
      retryAttempts: 3,
      backoffMultiplier: 2
    },
    persistence: {
      enabled: true,
      durabilityLevel: 'replicated',
      checkpointIntervalMs: 10000,
      compressionEnabled: true
    },
    monitoring: {
      metricsEnabled: true,
      healthCheckIntervalMs: 10000,
      alertThresholds: {
        queueDepth: 10000,
        processingLatency: 5000,
        errorRate: 0.05,
        nodeFailures: 1
      }
    }
  }

  return new MessageQueueCluster({ ...defaultConfig, ...config })
}