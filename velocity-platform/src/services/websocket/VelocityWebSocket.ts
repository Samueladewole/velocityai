/**
 * Velocity.ai WebSocket Service
 * Real-time communication for agent status updates and live monitoring
 */

interface WebSocketMessage {
  type: string
  payload: any
  timestamp: string
  correlation_id?: string
}

interface AgentStatusUpdate {
  agent_id: string
  status: string
  metrics?: {
    cpu_usage: number
    memory_usage_mb: number
    response_time_ms: number
  }
  active_tasks: number
  last_activity: string
}

interface TaskStatusUpdate {
  task_id: string
  agent_id: string
  status: string
  started_at?: string
  completed_at?: string
  result?: any
  error_message?: string
}

export class VelocityWebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempt = 0
  private maxReconnectAttempts = 5
  private reconnectInterval = 1000
  private heartbeatInterval: NodeJS.Timeout | null = null
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()
  private isConnected = false
  private messageQueue: WebSocketMessage[] = []

  constructor(private url: string = 'ws://localhost:8080/ws') {
    this.connect()
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url)
      
      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)
      
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error)
      this.handleReconnect()
    }
  }

  private handleOpen() {
    console.log('✅ WebSocket connected to Velocity backend')
    this.isConnected = true
    this.reconnectAttempt = 0
    
    // Start heartbeat
    this.startHeartbeat()
    
    // Send queued messages
    this.flushMessageQueue()
    
    // Subscribe to default channels
    this.subscribe('agent_status')
    this.subscribe('task_updates')
    this.subscribe('system_metrics')
  }

  private handleMessage(event: MessageEvent) {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      
      // Handle different message types
      switch (message.type) {
        case 'agent_status_update':
          this.notifySubscribers('agent_status', message.payload)
          break
          
        case 'task_status_update':
          this.notifySubscribers('task_updates', message.payload)
          break
          
        case 'system_metrics':
          this.notifySubscribers('system_metrics', message.payload)
          break
          
        case 'agent_created':
        case 'agent_started':
        case 'agent_stopped':
          this.notifySubscribers('agent_lifecycle', message.payload)
          break
          
        case 'evidence_collected':
          this.notifySubscribers('evidence_updates', message.payload)
          break
          
        case 'compliance_score_update':
          this.notifySubscribers('compliance_updates', message.payload)
          break
          
        case 'pong':
          // Heartbeat response
          break
          
        default:
          console.warn('⚠️ Unknown message type:', message.type)
      }
      
    } catch (error) {
      console.error('❌ Failed to parse WebSocket message:', error)
    }
  }

  private handleClose(event: CloseEvent) {
    console.log('🔌 WebSocket connection closed:', event.code, event.reason)
    this.isConnected = false
    this.stopHeartbeat()
    
    // Attempt reconnection unless it was a clean close
    if (event.code !== 1000) {
      this.handleReconnect()
    }
  }

  private handleError(event: Event) {
    console.error('❌ WebSocket error:', event)
  }

  private handleReconnect() {
    if (this.reconnectAttempt < this.maxReconnectAttempts) {
      this.reconnectAttempt++
      console.log(`🔄 Attempting WebSocket reconnection €{this.reconnectAttempt}/€{this.maxReconnectAttempts}`)
      
      setTimeout(() => {
        this.connect()
      }, this.reconnectInterval * Math.pow(2, this.reconnectAttempt)) // Exponential backoff
    } else {
      console.error('💀 Max WebSocket reconnection attempts reached')
      this.notifySubscribers('connection_failed', { 
        reason: 'Max reconnection attempts exceeded' 
      })
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', { timestamp: Date.now() })
      }
    }, 30000) // Send ping every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      if (message) {
        this.sendMessage(message)
      }
    }
  }

  private sendMessage(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('⚠️ WebSocket not ready, message queued')
      this.messageQueue.push(message)
    }
  }

  private notifySubscribers(channel: string, data: any) {
    const subscribers = this.subscribers.get(channel)
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`❌ Error in WebSocket subscriber for €{channel}:`, error)
        }
      })
    }
  }

  // Public API

  /**
   * Send a message to the WebSocket server
   */
  public send(type: string, payload: any, correlationId?: string) {
    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      correlation_id: correlationId
    }

    this.sendMessage(message)
  }

  /**
   * Subscribe to a WebSocket channel
   */
  public subscribe(channel: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set())
    }
    
    this.subscribers.get(channel)!.add(callback)
    
    // Send subscription request to server
    this.send('subscribe', { channel })
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(channel)?.delete(callback)
      if (this.subscribers.get(channel)?.size === 0) {
        this.subscribers.delete(channel)
        this.send('unsubscribe', { channel })
      }
    }
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (!this.ws) return 'disconnected'
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting'
      case WebSocket.OPEN:
        return 'connected'
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected'
      default:
        return 'error'
    }
  }

  /**
   * Close WebSocket connection
   */
  public disconnect() {
    this.stopHeartbeat()
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    
    this.isConnected = false
    this.subscribers.clear()
    this.messageQueue = []
  }

  /**
   * Force reconnection
   */
  public reconnect() {
    this.disconnect()
    this.reconnectAttempt = 0
    this.connect()
  }

  // Convenience methods for common operations

  /**
   * Subscribe to agent status updates
   */
  public onAgentStatusUpdate(callback: (update: AgentStatusUpdate) => void) {
    return this.subscribe('agent_status', callback)
  }

  /**
   * Subscribe to task status updates
   */
  public onTaskStatusUpdate(callback: (update: TaskStatusUpdate) => void) {
    return this.subscribe('task_updates', callback)
  }

  /**
   * Subscribe to system metrics
   */
  public onSystemMetrics(callback: (metrics: any) => void) {
    return this.subscribe('system_metrics', callback)
  }

  /**
   * Subscribe to agent lifecycle events
   */
  public onAgentLifecycle(callback: (event: any) => void) {
    return this.subscribe('agent_lifecycle', callback)
  }

  /**
   * Request agent status
   */
  public requestAgentStatus(agentId?: string) {
    this.send('get_agent_status', { agent_id: agentId })
  }

  /**
   * Request system metrics
   */
  public requestSystemMetrics() {
    this.send('get_system_metrics', {})
  }

  /**
   * Start agent
   */
  public startAgent(agentId: string, config?: any) {
    this.send('start_agent', { agent_id: agentId, config })
  }

  /**
   * Stop agent
   */
  public stopAgent(agentId: string, graceful = true) {
    this.send('stop_agent', { agent_id: agentId, graceful })
  }

  /**
   * Create new agent
   */
  public createAgent(agentType: string, config: any) {
    this.send('create_agent', { agent_type: agentType, config })
  }
}

// Singleton instance
let velocityWebSocket: VelocityWebSocketService | null = null

export function getVelocityWebSocket(): VelocityWebSocketService {
  if (!velocityWebSocket) {
    // Use environment variable or default to localhost
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws'
    velocityWebSocket = new VelocityWebSocketService(wsUrl)
  }
  return velocityWebSocket
}

// React hook for WebSocket
export function useVelocityWebSocket() {
  const ws = getVelocityWebSocket()
  
  return {
    ws,
    isConnected: ws.getConnectionStatus() === 'connected',
    subscribe: ws.subscribe.bind(ws),
    send: ws.send.bind(ws),
    onAgentStatusUpdate: ws.onAgentStatusUpdate.bind(ws),
    onTaskStatusUpdate: ws.onTaskStatusUpdate.bind(ws),
    onSystemMetrics: ws.onSystemMetrics.bind(ws),
    requestAgentStatus: ws.requestAgentStatus.bind(ws),
    startAgent: ws.startAgent.bind(ws),
    stopAgent: ws.stopAgent.bind(ws),
    createAgent: ws.createAgent.bind(ws)
  }
}