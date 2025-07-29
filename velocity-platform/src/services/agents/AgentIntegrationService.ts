/**
 * Velocity.ai Agent Integration Service
 * Bridges TypeScript orchestrator with Python agent implementations
 * 
 * Handles:
 * - Agent process management and communication
 * - Real-time status monitoring
 * - Task distribution to Python agents
 * - WebSocket communication with frontend
 */

import { spawn, ChildProcess } from 'child_process'
import { EventEmitter } from 'events'
import WebSocket from 'ws'
import path from 'path'
import { createHash } from 'crypto'

interface AgentConfig {
  agent_id: string
  agent_type: string
  config: Record<string, any>
  python_script_path: string
  virtual_env_path?: string
}

interface AgentStatus {
  agent_id: string
  status: 'starting' | 'running' | 'paused' | 'stopped' | 'error'
  pid?: number
  metrics?: {
    cpu_usage: number
    memory_usage_mb: number
    response_time_ms: number
    evidence_collected: number
    compliance_checks_run: number
    errors_encountered: number
  }
  last_heartbeat: string
  uptime_seconds: number
}

interface TaskRequest {
  task_id: string
  agent_id: string
  task_type: string
  payload: Record<string, any>
  timeout_ms: number
}

interface TaskResponse {
  task_id: string
  status: 'completed' | 'failed' | 'timeout'
  result?: any
  error_message?: string
  execution_time_ms: number
}

export class AgentIntegrationService extends EventEmitter {
  private agents: Map<string, {
    config: AgentConfig
    process: ChildProcess | null
    status: AgentStatus
    startTime: Date
    lastHeartbeat: Date
  }> = new Map()

  private wss: WebSocket.Server | null = null
  private healthCheckInterval: NodeJS.Timeout | null = null
  private wsPort = 8080

  constructor() {
    super()
    this.setupWebSocketServer()
    this.startHealthMonitoring()
  }

  /**
   * Set up WebSocket server for real-time communication
   */
  private setupWebSocketServer() {
    this.wss = new WebSocket.Server({ port: this.wsPort })
    
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('🔌 WebSocket client connected')
      
      ws.on('message', async (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString())
          await this.handleWebSocketMessage(ws, message)
        } catch (error) {
          console.error('❌ WebSocket message error:', error)
          ws.send(JSON.stringify({
            type: 'error',
            payload: { message: 'Invalid message format' },
            timestamp: new Date().toISOString()
          }))
        }
      })

      ws.on('close', () => {
        console.log('🔌 WebSocket client disconnected')
      })

      // Send initial agent status
      this.broadcastAgentStatus(ws)
    })

    console.log(`🌐 WebSocket server listening on port ${this.wsPort}`)
  }

  /**
   * Handle incoming WebSocket messages
   */
  private async handleWebSocketMessage(ws: WebSocket, message: any) {
    const { type, payload, correlation_id } = message

    switch (type) {
      case 'ping':
        ws.send(JSON.stringify({
          type: 'pong',
          payload: { timestamp: Date.now() },
          timestamp: new Date().toISOString()
        }))
        break

      case 'subscribe':
        // Client subscription handled automatically
        break

      case 'get_agent_status':
        const agentId = payload?.agent_id
        if (agentId) {
          const status = this.getAgentStatus(agentId)
          ws.send(JSON.stringify({
            type: 'agent_status_update',
            payload: status,
            timestamp: new Date().toISOString(),
            correlation_id
          }))
        } else {
          this.broadcastAgentStatus(ws)
        }
        break

      case 'start_agent':
        const startResult = await this.startAgent(payload.agent_id, payload.config)
        ws.send(JSON.stringify({
          type: 'agent_lifecycle',
          payload: { type: 'agent_started', agent_id: payload.agent_id, success: startResult },
          timestamp: new Date().toISOString(),
          correlation_id
        }))
        break

      case 'stop_agent':
        const stopResult = await this.stopAgent(payload.agent_id, payload.graceful)
        ws.send(JSON.stringify({
          type: 'agent_lifecycle',
          payload: { type: 'agent_stopped', agent_id: payload.agent_id, success: stopResult },
          timestamp: new Date().toISOString(),
          correlation_id
        }))
        break

      case 'create_agent':
        const createResult = await this.createAgent(payload.agent_type, payload.config)
        ws.send(JSON.stringify({
          type: 'agent_lifecycle',
          payload: { type: 'agent_created', agent: createResult },
          timestamp: new Date().toISOString(),
          correlation_id
        }))
        break

      default:
        console.warn('⚠️ Unknown WebSocket message type:', type)
    }
  }

  /**
   * Broadcast agent status to all connected clients
   */
  private broadcastAgentStatus(targetWs?: WebSocket) {
    const allStatuses = Array.from(this.agents.values()).map(agent => agent.status)
    
    const message = JSON.stringify({
      type: 'agent_status_update',
      payload: allStatuses,
      timestamp: new Date().toISOString()
    })

    if (targetWs) {
      targetWs.send(message)
    } else if (this.wss) {
      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    }
  }

  /**
   * Create a new agent instance
   */
  async createAgent(agentType: string, config: Record<string, any>): Promise<AgentConfig> {
    const agentId = `${agentType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Determine Python script path based on agent type
    const scriptPaths: Record<string, string> = {
      'aws-evidence-collector': '/Users/macbook/Projects/ERIP-app/velocity-platform/src/services/agents/aws/AWSEvidenceCollector.py',
      'gcp-scanner': '/Users/macbook/Projects/ERIP-app/velocity-platform/src/services/agents/gcp/GCPScanner.py',
      'github-analyzer': '/Users/macbook/Projects/ERIP-app/velocity-platform/src/services/agents/github/GitHubAnalyzer.py',
      'azure-monitor': '/Users/macbook/Projects/ERIP-app/velocity-platform/src/services/agents/azure/AzureMonitor.py',
      'cryptographic-verification': '/Users/macbook/Projects/ERIP-app/velocity-platform/src/services/agents/crypto/CryptoVerifier.py'
    }

    const agentConfig: AgentConfig = {
      agent_id: agentId,
      agent_type: agentType,
      config: {
        ...config,
        agent_id: agentId
      },
      python_script_path: scriptPaths[agentType] || scriptPaths['aws-evidence-collector'],
      virtual_env_path: '/Users/macbook/Projects/ERIP-app/velocity-platform/venv'
    }

    // Initialize agent state
    this.agents.set(agentId, {
      config: agentConfig,
      process: null,
      status: {
        agent_id: agentId,
        status: 'stopped',
        last_heartbeat: new Date().toISOString(),
        uptime_seconds: 0
      },
      startTime: new Date(),
      lastHeartbeat: new Date()
    })

    console.log(`✨ Created agent ${agentId} of type ${agentType}`)
    
    // Emit event
    this.emit('agent_created', agentConfig)
    
    return agentConfig
  }

  /**
   * Start an agent instance
   */
  async startAgent(agentId: string, config?: Record<string, any>): Promise<boolean> {
    const agent = this.agents.get(agentId)
    if (!agent) {
      console.error(`❌ Agent ${agentId} not found`)
      return false
    }

    if (agent.process) {
      console.log(`⚡ Agent ${agentId} already running`)
      return true
    }

    try {
      console.log(`🚀 Starting agent ${agentId}`)
      
      // Update status
      agent.status.status = 'starting'
      this.broadcastAgentStatus()

      // Prepare environment and arguments
      const pythonPath = agent.config.virtual_env_path 
        ? path.join(agent.config.virtual_env_path, 'bin', 'python')
        : 'python3'

      // Create configuration file for the agent
      const agentConfigPath = `/tmp/agent_config_${agentId}.json`
      require('fs').writeFileSync(agentConfigPath, JSON.stringify(agent.config.config, null, 2))

      // Spawn Python process
      agent.process = spawn(pythonPath, [
        agent.config.python_script_path,
        '--config', agentConfigPath,
        '--agent-id', agentId
      ], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          PYTHONPATH: path.dirname(agent.config.python_script_path),
          AGENT_ID: agentId
        }
      })

      agent.startTime = new Date()
      agent.status.pid = agent.process.pid

      // Handle process events
      agent.process.stdout?.on('data', (data) => {
        const output = data.toString().trim()
        console.log(`[${agentId}] ${output}`)
        
        // Parse agent heartbeat/metrics if JSON
        try {
          const parsed = JSON.parse(output)
          if (parsed.type === 'heartbeat') {
            this.updateAgentMetrics(agentId, parsed.metrics)
          } else if (parsed.type === 'evidence_collected') {
            this.handleEvidenceCollection(agentId, parsed.data)
          }
        } catch {
          // Regular log output, ignore JSON parsing error
        }
      })

      agent.process.stderr?.on('data', (data) => {
        console.error(`[${agentId}] ERROR: ${data.toString().trim()}`)
      })

      agent.process.on('close', (code) => {
        console.log(`🛑 Agent ${agentId} process exited with code ${code}`)
        
        if (agent) {
          agent.process = null
          agent.status.status = code === 0 ? 'stopped' : 'error'
          agent.status.pid = undefined
          this.broadcastAgentStatus()
        }
      })

      agent.process.on('error', (error) => {
        console.error(`❌ Agent ${agentId} process error:`, error)
        if (agent) {
          agent.status.status = 'error'
          this.broadcastAgentStatus()
        }
      })

      // Wait a moment for the process to start
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update status to running
      agent.status.status = 'running'
      agent.lastHeartbeat = new Date()
      this.broadcastAgentStatus()

      console.log(`✅ Agent ${agentId} started successfully (PID: ${agent.process.pid})`)
      
      // Emit event
      this.emit('agent_started', { agent_id: agentId, pid: agent.process.pid })
      
      return true

    } catch (error) {
      console.error(`❌ Failed to start agent ${agentId}:`, error)
      
      if (agent) {
        agent.status.status = 'error'
        agent.process = null
        this.broadcastAgentStatus()
      }
      
      return false
    }
  }

  /**
   * Stop an agent instance
   */
  async stopAgent(agentId: string, graceful: boolean = true): Promise<boolean> {
    const agent = this.agents.get(agentId)
    if (!agent) {
      console.error(`❌ Agent ${agentId} not found`)
      return false
    }

    if (!agent.process) {
      console.log(`⚡ Agent ${agentId} already stopped`)
      return true
    }

    try {
      console.log(`🛑 Stopping agent ${agentId} ${graceful ? 'gracefully' : 'forcefully'}`)
      
      if (graceful) {
        // Send SIGTERM for graceful shutdown
        agent.process.kill('SIGTERM')
        
        // Wait up to 10 seconds for graceful shutdown
        await new Promise((resolve) => {
          const timeout = setTimeout(() => {
            if (agent.process) {
              console.log(`⚠️ Agent ${agentId} didn't stop gracefully, forcing...`)
              agent.process.kill('SIGKILL')
            }
            resolve(void 0)
          }, 10000)
          
          agent.process?.on('close', () => {
            clearTimeout(timeout)
            resolve(void 0)
          })
        })
      } else {
        // Force kill
        agent.process.kill('SIGKILL')
      }

      // Clean up
      agent.process = null
      agent.status.status = 'stopped'
      agent.status.pid = undefined
      this.broadcastAgentStatus()

      console.log(`✅ Agent ${agentId} stopped`)
      
      // Emit event
      this.emit('agent_stopped', { agent_id: agentId, graceful })
      
      return true

    } catch (error) {
      console.error(`❌ Failed to stop agent ${agentId}:`, error)
      return false
    }
  }

  /**
   * Get agent status
   */
  getAgentStatus(agentId: string): AgentStatus | null {
    const agent = this.agents.get(agentId)
    if (!agent) return null

    // Calculate uptime
    const uptime = agent.process 
      ? Math.floor((Date.now() - agent.startTime.getTime()) / 1000)
      : 0

    return {
      ...agent.status,
      uptime_seconds: uptime
    }
  }

  /**
   * List all agents
   */
  listAgents(): AgentStatus[] {
    return Array.from(this.agents.values()).map(agent => {
      const uptime = agent.process 
        ? Math.floor((Date.now() - agent.startTime.getTime()) / 1000)
        : 0

      return {
        ...agent.status,
        uptime_seconds: uptime
      }
    })
  }

  /**
   * Update agent metrics from heartbeat
   */
  private updateAgentMetrics(agentId: string, metrics: any) {
    const agent = this.agents.get(agentId)
    if (!agent) return

    agent.status.metrics = {
      cpu_usage: metrics.cpu_usage || 0,
      memory_usage_mb: metrics.memory_usage_mb || 0,
      response_time_ms: metrics.response_time_ms || 0,
      evidence_collected: metrics.evidence_collected || 0,
      compliance_checks_run: metrics.compliance_checks_run || 0,
      errors_encountered: metrics.errors_encountered || 0
    }

    agent.lastHeartbeat = new Date()
    agent.status.last_heartbeat = agent.lastHeartbeat.toISOString()

    // Broadcast updated status
    this.broadcastAgentStatus()
  }

  /**
   * Handle evidence collection from agents
   */
  private handleEvidenceCollection(agentId: string, evidenceData: any) {
    console.log(`📊 Evidence collected from agent ${agentId}:`, evidenceData.evidence_type)
    
    // Broadcast evidence update
    if (this.wss) {
      const message = JSON.stringify({
        type: 'evidence_collected',
        payload: {
          agent_id: agentId,
          evidence: evidenceData
        },
        timestamp: new Date().toISOString()
      })

      this.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    }

    // Emit event
    this.emit('evidence_collected', { agent_id: agentId, evidence: evidenceData })
  }

  /**
   * Start health monitoring
   */
  private startHealthMonitoring() {
    this.healthCheckInterval = setInterval(() => {
      const now = new Date()
      
      for (const [agentId, agent] of this.agents.entries()) {
        if (agent.process && agent.status.status === 'running') {
          // Check if agent is responsive (no heartbeat for 2 minutes)
          const timeSinceHeartbeat = now.getTime() - agent.lastHeartbeat.getTime()
          
          if (timeSinceHeartbeat > 120000) { // 2 minutes
            console.warn(`⚠️ Agent ${agentId} hasn't sent heartbeat for ${Math.floor(timeSinceHeartbeat / 1000)}s`)
            agent.status.status = 'error'
            this.broadcastAgentStatus()
          }
        }
      }
    }, 30000) // Check every 30 seconds

    console.log('❤️ Health monitoring started')
  }

  /**
   * Execute task on specific agent
   */
  async executeTask(taskRequest: TaskRequest): Promise<TaskResponse> {
    const agent = this.agents.get(taskRequest.agent_id)
    if (!agent || !agent.process) {
      return {
        task_id: taskRequest.task_id,
        status: 'failed',
        error_message: 'Agent not found or not running',
        execution_time_ms: 0
      }
    }

    const startTime = Date.now()

    try {
      // Send task to agent via stdin
      const taskMessage = JSON.stringify({
        type: 'task',
        task_id: taskRequest.task_id,
        task_type: taskRequest.task_type,
        payload: taskRequest.payload
      })

      agent.process.stdin?.write(taskMessage + '\n')

      // Wait for response (simplified - in production would use proper message handling)
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve({
            task_id: taskRequest.task_id,
            status: 'timeout',
            error_message: 'Task execution timeout',
            execution_time_ms: Date.now() - startTime
          })
        }, taskRequest.timeout_ms)

        // Listen for response (simplified)
        const responseHandler = (data: Buffer) => {
          try {
            const response = JSON.parse(data.toString())
            if (response.task_id === taskRequest.task_id) {
              clearTimeout(timeout)
              agent.process?.stdout?.off('data', responseHandler)
              
              resolve({
                task_id: taskRequest.task_id,
                status: response.status,
                result: response.result,
                error_message: response.error_message,
                execution_time_ms: Date.now() - startTime
              })
            }
          } catch {
            // Ignore parsing errors for non-JSON output
          }
        }

        agent.process?.stdout?.on('data', responseHandler)
      })

    } catch (error) {
      return {
        task_id: taskRequest.task_id,
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        execution_time_ms: Date.now() - startTime
      }
    }
  }

  /**
   * Get system metrics
   */
  getSystemMetrics() {
    const agents = Array.from(this.agents.values())
    const runningAgents = agents.filter(a => a.status.status === 'running')
    
    const totalTasks = agents.reduce((sum, a) => 
      sum + (a.status.metrics?.evidence_collected || 0), 0)
    
    const totalErrors = agents.reduce((sum, a) => 
      sum + (a.status.metrics?.errors_encountered || 0), 0)
    
    const avgResponseTime = runningAgents.length > 0
      ? runningAgents.reduce((sum, a) => 
          sum + (a.status.metrics?.response_time_ms || 0), 0) / runningAgents.length
      : 0

    return {
      total_agents: agents.length,
      running_agents: runningAgents.length,
      total_tasks: totalTasks,
      completed_tasks: totalTasks, // Simplified
      failed_tasks: totalErrors,
      avg_response_time: avgResponseTime,
      system_load: Math.random() * 60 + 20, // Simulated
      memory_usage: Math.random() * 70 + 30, // Simulated
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Shutdown all agents and service
   */
  async shutdown() {
    console.log('🛑 Shutting down Agent Integration Service')

    // Stop health monitoring
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }

    // Stop all agents
    const stopPromises = Array.from(this.agents.keys()).map(agentId => 
      this.stopAgent(agentId, true)
    )
    
    await Promise.all(stopPromises)

    // Close WebSocket server
    if (this.wss) {
      this.wss.close()
    }

    console.log('✅ Agent Integration Service shutdown complete')
  }
}

// Singleton instance
let integrationService: AgentIntegrationService | null = null

export function getAgentIntegrationService(): AgentIntegrationService {
  if (!integrationService) {
    integrationService = new AgentIntegrationService()
  }
  return integrationService
}

// Export for use in other modules
export default AgentIntegrationService