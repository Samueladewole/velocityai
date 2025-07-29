/**
 * Enterprise Database Connection Pool
 * 
 * High-performance connection pooling with automatic failover,
 * read/write splitting, and comprehensive monitoring
 */

import { EventEmitter } from 'events'
import { Logger } from '../logging/logger'
import { MetricsCollector } from '../../services/monitoring/metricsCollector'

export interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl?: boolean
  connectionTimeout: number
  queryTimeout: number
}

export interface ConnectionPoolConfig {
  primary: DatabaseConfig
  replicas: DatabaseConfig[]
  pool: {
    minConnections: number
    maxConnections: number
    acquireTimeout: number
    idleTimeout: number
    maxLifetime: number
    testQuery: string
    testInterval: number
  }
  failover: {
    enabled: boolean
    healthCheckInterval: number
    retryAttempts: number
    retryDelay: number
    automaticFailback: boolean
  }
  readWrite: {
    enabled: boolean
    readPreference: 'primary' | 'replica' | 'nearest'
    writeAlwaysPrimary: boolean
  }
  monitoring: {
    metricsEnabled: boolean
    slowQueryThreshold: number
    connectionLeakDetection: boolean
  }
}

export interface PooledConnection {
  id: string
  connection: any // Would be actual database connection object
  database: 'primary' | 'replica'
  host: string
  port: number
  createdAt: Date
  lastUsed: Date
  queryCount: number
  inUse: boolean
  isHealthy: boolean
}

export interface QueryResult {
  rows: any[]
  rowCount: number
  duration: number
  connection: string
  database: 'primary' | 'replica'
}

export interface PoolStatistics {
  totalConnections: number
  activeConnections: number
  idleConnections: number
  waitingRequests: number
  primaryHealthy: boolean
  healthyReplicas: number
  totalQueries: number
  averageQueryTime: number
  slowQueries: number
  connectionLeaks: number
}

export class EnterpriseConnectionPool extends EventEmitter {
  private logger: Logger
  private metricsCollector?: MetricsCollector
  private primaryConnections: Map<string, PooledConnection> = new Map()
  private replicaConnections: Map<string, PooledConnection> = new Map()
  private waitingQueue: Array<{
    resolve: (connection: PooledConnection) => void
    reject: (error: Error) => void
    timeout: NodeJS.Timeout
    requestType: 'read' | 'write'
    timestamp: Date
  }> = []

  private primaryHealthy = true
  private replicaHealth: Map<string, boolean> = new Map()
  private healthCheckTimer?: NodeJS.Timeout
  private cleanupTimer?: NodeJS.Timeout
  private totalQueries = 0
  private slowQueries = 0
  private queryTimes: number[] = []

  constructor(private config: ConnectionPoolConfig) {
    super()
    
    this.logger = new Logger('EnterpriseConnectionPool')
    
    if (config.monitoring.metricsEnabled) {
      this.metricsCollector = new MetricsCollector({
        enabled: true,
        exportInterval: 60000,
        labels: { component: 'connection_pool' }
      })
    }

    this.initializeConnections()
    this.startHealthChecking()
    this.startConnectionCleanup()
  }

  /**
   * Initialize database connections
   */
  private async initializeConnections(): Promise<void> {
    this.logger.info('Initializing database connections', {
      minConnections: this.config.pool.minConnections,
      maxConnections: this.config.pool.maxConnections,
      replicas: this.config.replicas.length
    })

    // Initialize primary connections
    await this.createConnections('primary', this.config.primary, this.config.pool.minConnections)

    // Initialize replica connections
    if (this.config.replicas.length > 0 && this.config.readWrite.enabled) {
      for (const replica of this.config.replicas) {
        await this.createConnections('replica', replica, Math.ceil(this.config.pool.minConnections / 2))
        this.replicaHealth.set(`${replica.host}:${replica.port}`, true)
      }
    }

    this.logger.info('Database connections initialized', {
      primaryConnections: this.primaryConnections.size,
      replicaConnections: this.replicaConnections.size
    })
  }

  /**
   * Create database connections
   */
  private async createConnections(
    type: 'primary' | 'replica',
    config: DatabaseConfig,
    count: number
  ): Promise<void> {
    for (let i = 0; i < count; i++) {
      try {
        const connection = await this.createConnection(type, config)
        
        if (type === 'primary') {
          this.primaryConnections.set(connection.id, connection)
        } else {
          this.replicaConnections.set(connection.id, connection)
        }
        
      } catch (error) {
        this.logger.error(`Failed to create ${type} connection`, { error, config: { host: config.host, port: config.port } })
        
        if (type === 'primary') {
          this.primaryHealthy = false
        } else {
          this.replicaHealth.set(`${config.host}:${config.port}`, false)
        }
      }
    }
  }

  /**
   * Create a single database connection
   */
  private async createConnection(
    type: 'primary' | 'replica',
    config: DatabaseConfig
  ): Promise<PooledConnection> {
    // In real implementation, would create actual database connection
    // For now, simulate connection creation
    await new Promise(resolve => setTimeout(resolve, 100))

    const connectionId = this.generateConnectionId(type)
    
    const connection: PooledConnection = {
      id: connectionId,
      connection: this.simulateDatabaseConnection(config), // Mock connection object
      database: type,
      host: config.host,
      port: config.port,
      createdAt: new Date(),
      lastUsed: new Date(),
      queryCount: 0,
      inUse: false,
      isHealthy: true
    }

    this.logger.debug('Database connection created', {
      id: connectionId,
      type,
      host: config.host,
      port: config.port
    })

    return connection
  }

  /**
   * Acquire connection from pool
   */
  public async acquireConnection(queryType: 'read' | 'write' = 'read'): Promise<PooledConnection> {
    const startTime = Date.now()

    try {
      // Determine which pool to use
      const useReplica = queryType === 'read' && 
                        this.config.readWrite.enabled && 
                        this.hasHealthyReplicas() &&
                        this.config.readWrite.readPreference !== 'primary'

      const targetPool = useReplica ? this.replicaConnections : this.primaryConnections
      const poolType = useReplica ? 'replica' : 'primary'

      // Try to find available connection
      const availableConnection = this.findAvailableConnection(targetPool)
      
      if (availableConnection) {
        availableConnection.inUse = true
        availableConnection.lastUsed = new Date()

        const acquireTime = Date.now() - startTime
        
        if (this.metricsCollector) {
          this.metricsCollector.recordHistogram('connection_acquire_time', acquireTime, { pool: poolType })
          this.metricsCollector.incrementCounter('connections_acquired', { pool: poolType })
        }

        this.logger.debug('Connection acquired', {
          connectionId: availableConnection.id,
          pool: poolType,
          acquireTime
        })

        return availableConnection
      }

      // Try to create new connection if under limit
      if (this.canCreateNewConnection(poolType)) {
        const config = poolType === 'primary' ? this.config.primary : this.getHealthyReplica()
        if (config) {
          const newConnection = await this.createConnection(poolType, config)
          newConnection.inUse = true

          if (poolType === 'primary') {
            this.primaryConnections.set(newConnection.id, newConnection)
          } else {
            this.replicaConnections.set(newConnection.id, newConnection)
          }

          return newConnection
        }
      }

      // No available connections, add to queue
      return this.queueConnectionRequest(queryType)

    } catch (error) {
      if (this.metricsCollector) {
        this.metricsCollector.incrementCounter('connection_acquire_errors')
      }
      
      this.logger.error('Failed to acquire connection', { error, queryType })
      throw error
    }
  }

  /**
   * Release connection back to pool
   */
  public releaseConnection(connectionId: string): void {
    const connection = this.primaryConnections.get(connectionId) || 
                      this.replicaConnections.get(connectionId)

    if (!connection) {
      this.logger.warn('Attempted to release unknown connection', { connectionId })
      return
    }

    connection.inUse = false
    connection.lastUsed = new Date()

    if (this.metricsCollector) {
      this.metricsCollector.incrementCounter('connections_released', { 
        pool: connection.database 
      })
    }

    this.logger.debug('Connection released', {
      connectionId,
      pool: connection.database
    })

    // Process waiting queue
    this.processConnectionQueue()
  }

  /**
   * Execute query with connection pooling
   */
  public async executeQuery(
    query: string,
    params: any[] = [],
    queryType: 'read' | 'write' = 'read'
  ): Promise<QueryResult> {
    const startTime = Date.now()
    let connection: PooledConnection | null = null

    try {
      connection = await this.acquireConnection(queryType)
      
      // Execute query (simulated)
      const result = await this.executeQueryOnConnection(connection, query, params)
      const duration = Date.now() - startTime

      // Update statistics
      this.totalQueries++
      connection.queryCount++
      this.queryTimes.push(duration)
      
      // Keep only recent query times
      if (this.queryTimes.length > 1000) {
        this.queryTimes = this.queryTimes.slice(-1000)
      }

      if (duration > this.config.monitoring.slowQueryThreshold) {
        this.slowQueries++
        this.logger.warn('Slow query detected', {
          query: query.substring(0, 100),
          duration,
          connection: connection.id
        })
      }

      if (this.metricsCollector) {
        this.metricsCollector.recordHistogram('query_duration', duration, { 
          type: queryType,
          database: connection.database 
        })
        this.metricsCollector.incrementCounter('queries_executed', { 
          type: queryType,
          database: connection.database 
        })
      }

      return {
        rows: result.rows,
        rowCount: result.rowCount,
        duration,
        connection: connection.id,
        database: connection.database
      }

    } catch (error) {
      if (this.metricsCollector) {
        this.metricsCollector.incrementCounter('query_errors', { 
          type: queryType,
          database: connection?.database || 'unknown'
        })
      }

      this.logger.error('Query execution failed', {
        query: query.substring(0, 100),
        error,
        connection: connection?.id
      })

      // Mark connection as unhealthy if it's a connection error
      if (connection && this.isConnectionError(error)) {
        connection.isHealthy = false
      }

      throw error

    } finally {
      if (connection) {
        this.releaseConnection(connection.id)
      }
    }
  }

  /**
   * Execute transaction with automatic rollback on error
   */
  public async executeTransaction(queries: Array<{ query: string; params?: any[] }>): Promise<QueryResult[]> {
    let connection: PooledConnection | null = null

    try {
      connection = await this.acquireConnection('write') // Transactions always use primary
      
      // Begin transaction
      await this.executeQueryOnConnection(connection, 'BEGIN', [])
      
      const results: QueryResult[] = []
      
      // Execute all queries
      for (const { query, params = [] } of queries) {
        const result = await this.executeQueryOnConnection(connection, query, params)
        results.push({
          rows: result.rows,
          rowCount: result.rowCount,
          duration: result.duration,
          connection: connection.id,
          database: connection.database
        })
      }
      
      // Commit transaction
      await this.executeQueryOnConnection(connection, 'COMMIT', [])
      
      this.logger.debug('Transaction completed successfully', {
        connection: connection.id,
        queries: queries.length
      })
      
      return results

    } catch (error) {
      // Rollback on error
      if (connection) {
        try {
          await this.executeQueryOnConnection(connection, 'ROLLBACK', [])
        } catch (rollbackError) {
          this.logger.error('Failed to rollback transaction', { rollbackError })
        }
      }
      
      this.logger.error('Transaction failed', { error, queries: queries.length })
      throw error

    } finally {
      if (connection) {
        this.releaseConnection(connection.id)
      }
    }
  }

  /**
   * Health checking implementation
   */
  private startHealthChecking(): void {
    if (!this.config.failover.enabled) return

    this.healthCheckTimer = setInterval(async () => {
      await this.performHealthChecks()
    }, this.config.failover.healthCheckInterval)

    this.logger.info('Health checking started', {
      interval: this.config.failover.healthCheckInterval
    })
  }

  private async performHealthChecks(): Promise<void> {
    // Check primary health
    await this.checkPrimaryHealth()

    // Check replica health
    for (const replica of this.config.replicas) {
      await this.checkReplicaHealth(replica)
    }
  }

  private async checkPrimaryHealth(): Promise<void> {
    try {
      const healthyConnections = Array.from(this.primaryConnections.values())
        .filter(conn => conn.isHealthy)

      if (healthyConnections.length === 0) {
        this.primaryHealthy = false
        this.emit('primary_unhealthy')
        return
      }

      const testConnection = healthyConnections[0]
      await this.executeQueryOnConnection(testConnection, this.config.pool.testQuery, [])
      
      if (!this.primaryHealthy) {
        this.primaryHealthy = true
        this.emit('primary_recovered')
        this.logger.info('Primary database recovered')
      }

    } catch (error) {
      if (this.primaryHealthy) {
        this.primaryHealthy = false
        this.emit('primary_unhealthy', error)
        this.logger.error('Primary database unhealthy', { error })
      }
    }
  }

  private async checkReplicaHealth(replica: DatabaseConfig): Promise<void> {
    const replicaKey = `${replica.host}:${replica.port}`
    
    try {
      const replicaConnections = Array.from(this.replicaConnections.values())
        .filter(conn => conn.host === replica.host && conn.port === replica.port && conn.isHealthy)

      if (replicaConnections.length === 0) {
        this.replicaHealth.set(replicaKey, false)
        return
      }

      const testConnection = replicaConnections[0]
      await this.executeQueryOnConnection(testConnection, this.config.pool.testQuery, [])
      
      if (!this.replicaHealth.get(replicaKey)) {
        this.replicaHealth.set(replicaKey, true)
        this.emit('replica_recovered', replica)
        this.logger.info('Replica database recovered', { host: replica.host, port: replica.port })
      }

    } catch (error) {
      if (this.replicaHealth.get(replicaKey)) {
        this.replicaHealth.set(replicaKey, false)
        this.emit('replica_unhealthy', { replica, error })
        this.logger.error('Replica database unhealthy', { host: replica.host, port: replica.port, error })
      }
    }
  }

  /**
   * Connection cleanup and management
   */
  private startConnectionCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupIdleConnections()
      this.detectConnectionLeaks()
    }, 60000) // Clean up every minute
  }

  private cleanupIdleConnections(): void {
    const now = Date.now()
    const idleTimeout = this.config.pool.idleTimeout
    const maxLifetime = this.config.pool.maxLifetime

    let cleanedCount = 0

    // Clean up primary connections
    for (const [id, connection] of this.primaryConnections.entries()) {
      if (connection.inUse) continue

      const idleTime = now - connection.lastUsed.getTime()
      const lifetime = now - connection.createdAt.getTime()

      if (idleTime > idleTimeout || lifetime > maxLifetime) {
        this.closeConnection(connection)
        this.primaryConnections.delete(id)
        cleanedCount++
      }
    }

    // Clean up replica connections
    for (const [id, connection] of this.replicaConnections.entries()) {
      if (connection.inUse) continue

      const idleTime = now - connection.lastUsed.getTime()
      const lifetime = now - connection.createdAt.getTime()

      if (idleTime > idleTimeout || lifetime > maxLifetime) {
        this.closeConnection(connection)
        this.replicaConnections.delete(id)
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug('Cleaned up idle connections', { count: cleanedCount })
    }

    // Ensure minimum connections
    this.ensureMinimumConnections()
  }

  private detectConnectionLeaks(): void {
    if (!this.config.monitoring.connectionLeakDetection) return

    const now = Date.now()
    const leakThreshold = 600000 // 10 minutes
    let leaks = 0

    const allConnections = [
      ...Array.from(this.primaryConnections.values()),
      ...Array.from(this.replicaConnections.values())
    ]

    for (const connection of allConnections) {
      if (connection.inUse && (now - connection.lastUsed.getTime()) > leakThreshold) {
        this.logger.warn('Potential connection leak detected', {
          connectionId: connection.id,
          inUseDuration: now - connection.lastUsed.getTime(),
          queryCount: connection.queryCount
        })
        leaks++
      }
    }

    if (this.metricsCollector && leaks > 0) {
      this.metricsCollector.recordHistogram('connection_leaks', leaks)
    }
  }

  private async ensureMinimumConnections(): Promise<void> {
    // Ensure minimum primary connections
    const healthyPrimary = Array.from(this.primaryConnections.values()).filter(c => c.isHealthy).length
    if (healthyPrimary < this.config.pool.minConnections) {
      const needed = this.config.pool.minConnections - healthyPrimary
      await this.createConnections('primary', this.config.primary, needed)
    }

    // Ensure minimum replica connections
    if (this.config.readWrite.enabled && this.config.replicas.length > 0) {
      const healthyReplicas = Array.from(this.replicaConnections.values()).filter(c => c.isHealthy).length
      const minReplicas = Math.ceil(this.config.pool.minConnections / 2)
      
      if (healthyReplicas < minReplicas) {
        const needed = minReplicas - healthyReplicas
        const healthyReplicaConfig = this.getHealthyReplica()
        
        if (healthyReplicaConfig) {
          await this.createConnections('replica', healthyReplicaConfig, needed)
        }
      }
    }
  }

  /**
   * Utility methods
   */
  private findAvailableConnection(pool: Map<string, PooledConnection>): PooledConnection | null {
    for (const connection of pool.values()) {
      if (!connection.inUse && connection.isHealthy) {
        return connection
      }
    }
    return null
  }

  private canCreateNewConnection(poolType: 'primary' | 'replica'): boolean {
    const currentCount = poolType === 'primary' 
      ? this.primaryConnections.size 
      : this.replicaConnections.size
    
    return currentCount < this.config.pool.maxConnections
  }

  private hasHealthyReplicas(): boolean {
    return Array.from(this.replicaHealth.values()).some(healthy => healthy)
  }

  private getHealthyReplica(): DatabaseConfig | null {
    for (let i = 0; i < this.config.replicas.length; i++) {
      const replica = this.config.replicas[i]
      const replicaKey = `${replica.host}:${replica.port}`
      
      if (this.replicaHealth.get(replicaKey)) {
        return replica
      }
    }
    return null
  }

  private async queueConnectionRequest(queryType: 'read' | 'write'): Promise<PooledConnection> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.waitingQueue.findIndex(item => item.resolve === resolve)
        if (index !== -1) {
          this.waitingQueue.splice(index, 1)
        }
        reject(new Error('Connection acquisition timeout'))
      }, this.config.pool.acquireTimeout)

      this.waitingQueue.push({
        resolve,
        reject,
        timeout,
        requestType: queryType,
        timestamp: new Date()
      })

      if (this.metricsCollector) {
        this.metricsCollector.recordHistogram('connection_queue_size', this.waitingQueue.length)
      }
    })
  }

  private processConnectionQueue(): void {
    while (this.waitingQueue.length > 0) {
      const request = this.waitingQueue[0]
      
      // Try to fulfill the request
      const useReplica = request.requestType === 'read' && 
                        this.config.readWrite.enabled && 
                        this.hasHealthyReplicas()

      const targetPool = useReplica ? this.replicaConnections : this.primaryConnections
      const availableConnection = this.findAvailableConnection(targetPool)

      if (availableConnection) {
        this.waitingQueue.shift()
        clearTimeout(request.timeout)
        
        availableConnection.inUse = true
        availableConnection.lastUsed = new Date()
        
        request.resolve(availableConnection)
      } else {
        break // No available connections, wait for more to be released
      }
    }
  }

  private async executeQueryOnConnection(
    connection: PooledConnection,
    query: string,
    params: any[]
  ): Promise<{ rows: any[]; rowCount: number; duration: number }> {
    const startTime = Date.now()
    
    // Simulate query execution
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
    
    const duration = Date.now() - startTime
    
    // Simulate result
    return {
      rows: [{ id: 1, data: 'simulated result' }],
      rowCount: 1,
      duration
    }
  }

  private simulateDatabaseConnection(config: DatabaseConfig): any {
    return {
      host: config.host,
      port: config.port,
      database: config.database,
      connected: true,
      mockConnection: true
    }
  }

  private closeConnection(connection: PooledConnection): void {
    // In real implementation, would close actual database connection
    this.logger.debug('Closing database connection', { connectionId: connection.id })
  }

  private isConnectionError(error: any): boolean {
    // Check if error is connection-related
    const connectionErrors = [
      'ECONNRESET',
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT',
      'connection terminated',
      'server closed the connection'
    ]
    
    const errorMessage = error.message?.toLowerCase() || ''
    return connectionErrors.some(connError => errorMessage.includes(connError))
  }

  private generateConnectionId(type: 'primary' | 'replica'): string {
    return `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Public API methods
   */
  public getStatistics(): PoolStatistics {
    const allConnections = [
      ...Array.from(this.primaryConnections.values()),
      ...Array.from(this.replicaConnections.values())
    ]

    const activeConnections = allConnections.filter(c => c.inUse).length
    const idleConnections = allConnections.filter(c => !c.inUse && c.isHealthy).length
    const healthyReplicas = Array.from(this.replicaHealth.values()).filter(h => h).length
    const avgQueryTime = this.queryTimes.length > 0
      ? this.queryTimes.reduce((sum, time) => sum + time, 0) / this.queryTimes.length
      : 0

    return {
      totalConnections: allConnections.length,
      activeConnections,
      idleConnections,
      waitingRequests: this.waitingQueue.length,
      primaryHealthy: this.primaryHealthy,
      healthyReplicas,
      totalQueries: this.totalQueries,
      averageQueryTime: avgQueryTime,
      slowQueries: this.slowQueries,
      connectionLeaks: 0 // Would be calculated in real implementation
    }
  }

  public async warmupPool(): Promise<void> {
    this.logger.info('Warming up connection pool')
    
    // Create minimum connections for all databases
    await this.ensureMinimumConnections()
    
    // Test all connections
    const testPromises = [
      ...Array.from(this.primaryConnections.values()),
      ...Array.from(this.replicaConnections.values())
    ].map(connection => this.executeQueryOnConnection(connection, this.config.pool.testQuery, []))

    await Promise.allSettled(testPromises)
    
    this.logger.info('Connection pool warmed up')
  }

  /**
   * Shutdown connection pool
   */
  public async shutdown(): Promise<void> {
    this.logger.info('Shutting down connection pool')

    // Stop timers
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
    }
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }

    // Reject all waiting requests
    this.waitingQueue.forEach(request => {
      clearTimeout(request.timeout)
      request.reject(new Error('Connection pool shutting down'))
    })
    this.waitingQueue = []

    // Close all connections
    const allConnections = [
      ...Array.from(this.primaryConnections.values()),
      ...Array.from(this.replicaConnections.values())
    ]

    for (const connection of allConnections) {
      this.closeConnection(connection)
    }

    this.primaryConnections.clear()
    this.replicaConnections.clear()

    if (this.metricsCollector) {
      this.metricsCollector.shutdown()
    }

    this.logger.info('Connection pool shutdown complete')
  }
}

/**
 * Factory function to create connection pool
 */
export function createConnectionPool(config: Partial<ConnectionPoolConfig>): EnterpriseConnectionPool {
  const defaultConfig: ConnectionPoolConfig = {
    primary: {
      host: 'localhost',
      port: 5432,
      database: 'erip_platform',
      username: 'erip_user',
      password: 'erip_password',
      connectionTimeout: 30000,
      queryTimeout: 60000
    },
    replicas: [],
    pool: {
      minConnections: 5,
      maxConnections: 50,
      acquireTimeout: 30000,
      idleTimeout: 300000,
      maxLifetime: 3600000,
      testQuery: 'SELECT 1',
      testInterval: 60000
    },
    failover: {
      enabled: true,
      healthCheckInterval: 30000,
      retryAttempts: 3,
      retryDelay: 5000,
      automaticFailback: true
    },
    readWrite: {
      enabled: true,
      readPreference: 'replica',
      writeAlwaysPrimary: true
    },
    monitoring: {
      metricsEnabled: true,
      slowQueryThreshold: 1000,
      connectionLeakDetection: true
    }
  }

  return new EnterpriseConnectionPool({ ...defaultConfig, ...config })
}