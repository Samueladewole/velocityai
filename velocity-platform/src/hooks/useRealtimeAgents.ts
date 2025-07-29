import { useState, useEffect, useRef } from 'react'
import { useVelocityWebSocket } from '@/services/websocket/VelocityWebSocket'

interface Agent {
  id: string
  agent_type: string
  status: string
  created_at: string
  last_active: string | null
  metrics?: {
    cpu_usage: number
    memory_usage_mb: number
    response_time_ms: number
  }
  active_tasks: number
}

interface SystemMetrics {
  total_agents: number
  running_agents: number
  total_tasks: number
  completed_tasks: number
  failed_tasks: number
  avg_response_time: number
  system_load: number
  memory_usage: number
}

export function useRealtimeAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    total_agents: 0,
    running_agents: 0,
    total_tasks: 0,
    completed_tasks: 0,
    failed_tasks: 0,
    avg_response_time: 0,
    system_load: 0,
    memory_usage: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting')
  
  const { 
    ws, 
    isConnected, 
    onAgentStatusUpdate, 
    onTaskStatusUpdate, 
    onSystemMetrics,
    onAgentLifecycle,
    requestAgentStatus,
    requestSystemMetrics
  } = useVelocityWebSocket()

  const unsubscribeRefs = useRef<(() => void)[]>([])

  // Initialize real-time subscriptions
  useEffect(() => {
    setConnectionStatus(ws.getConnectionStatus())
    
    if (!isConnected) {
      // Use mock data when WebSocket is not connected
      const mockAgents: Agent[] = [
        {
          id: '1',
          agent_type: 'aws-evidence-collector',
          status: 'running',
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          metrics: {
            cpu_usage: 32.5 + Math.random() * 10,
            memory_usage_mb: 256 + Math.random() * 50,
            response_time_ms: 85 + Math.random() * 20
          },
          active_tasks: Math.floor(Math.random() * 5) + 1
        },
        {
          id: '2',
          agent_type: 'gcp-scanner',
          status: 'running',
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          metrics: {
            cpu_usage: 45.2 + Math.random() * 10,
            memory_usage_mb: 312 + Math.random() * 50,
            response_time_ms: 120 + Math.random() * 30
          },
          active_tasks: Math.floor(Math.random() * 8) + 2
        },
        {
          id: '3',
          agent_type: 'github-analyzer',
          status: Math.random() > 0.7 ? 'paused' : 'running',
          created_at: new Date().toISOString(),
          last_active: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          metrics: {
            cpu_usage: Math.random() * 60,
            memory_usage_mb: 128 + Math.random() * 100,
            response_time_ms: Math.random() * 200
          },
          active_tasks: Math.floor(Math.random() * 3)
        },
        {
          id: '4',
          agent_type: 'cryptographic-verification',
          status: 'running',
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          metrics: {
            cpu_usage: 78.9 + Math.random() * 15,
            memory_usage_mb: 512 + Math.random() * 100,
            response_time_ms: 42 + Math.random() * 15
          },
          active_tasks: Math.floor(Math.random() * 15) + 5
        },
        {
          id: '5',
          agent_type: 'azure-monitor',
          status: Math.random() > 0.8 ? 'error' : 'running',
          created_at: new Date().toISOString(),
          last_active: new Date(Date.now() - Math.random() * 7200000).toISOString(),
          metrics: {
            cpu_usage: Math.random() * 40,
            memory_usage_mb: 64 + Math.random() * 150,
            response_time_ms: Math.random() * 300
          },
          active_tasks: Math.floor(Math.random() * 5)
        }
      ]

      const mockMetrics: SystemMetrics = {
        total_agents: mockAgents.length,
        running_agents: mockAgents.filter(a => a.status === 'running').length,
        total_tasks: mockAgents.reduce((sum, a) => sum + a.active_tasks, 0),
        completed_tasks: Math.floor(Math.random() * 100) + 50,
        failed_tasks: Math.floor(Math.random() * 10),
        avg_response_time: mockAgents
          .filter(a => a.metrics)
          .reduce((sum, a) => sum + (a.metrics?.response_time_ms || 0), 0) / 
          Math.max(1, mockAgents.filter(a => a.metrics).length),
        system_load: Math.random() * 60 + 20,
        memory_usage: Math.random() * 70 + 30
      }

      setAgents(mockAgents)
      setSystemMetrics(mockMetrics)
      setLoading(false)
      setError(null)

      return
    }

    // Real WebSocket subscriptions
    const unsubscribeAgentStatus = onAgentStatusUpdate((update) => {
      setAgents(prev => {
        const index = prev.findIndex(a => a.id === update.agent_id)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = {
            ...updated[index],
            status: update.status,
            metrics: update.metrics,
            active_tasks: update.active_tasks,
            last_active: update.last_activity
          }
          return updated
        } else {
          // New agent
          return [...prev, {
            id: update.agent_id,
            agent_type: 'unknown',
            status: update.status,
            created_at: new Date().toISOString(),
            last_active: update.last_activity,
            metrics: update.metrics,
            active_tasks: update.active_tasks
          }]
        }
      })
    })

    const unsubscribeTaskUpdates = onTaskStatusUpdate((update) => {
      // Update task count for the agent
      setAgents(prev => prev.map(agent => {
        if (agent.id === update.agent_id) {
          return {
            ...agent,
            active_tasks: update.status === 'completed' || update.status === 'failed'
              ? Math.max(0, agent.active_tasks - 1)
              : agent.active_tasks
          }
        }
        return agent
      }))
    })

    const unsubscribeSystemMetrics = onSystemMetrics((metrics) => {
      setSystemMetrics(metrics)
    })

    const unsubscribeAgentLifecycle = onAgentLifecycle((event) => {
      if (event.type === 'agent_created') {
        setAgents(prev => [...prev, event.agent])
      } else if (event.type === 'agent_terminated') {
        setAgents(prev => prev.filter(a => a.id !== event.agent_id))
      }
    })

    // Store unsubscribe functions
    unsubscribeRefs.current = [
      unsubscribeAgentStatus,
      unsubscribeTaskUpdates,
      unsubscribeSystemMetrics,
      unsubscribeAgentLifecycle
    ]

    // Request initial data
    requestAgentStatus()
    requestSystemMetrics()
    
    setLoading(false)
    setError(null)

    // Cleanup function
    return () => {
      unsubscribeRefs.current.forEach(unsubscribe => unsubscribe())
      unsubscribeRefs.current = []
    }
  }, [isConnected])

  // Update connection status
  useEffect(() => {
    const interval = setInterval(() => {
      const status = ws.getConnectionStatus()
      setConnectionStatus(status)
      
      if (status === 'error') {
        setError('WebSocket connection failed')
      } else if (status === 'connected' && error) {
        setError(null)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [ws, error])

  // Simulate real-time updates for mock data
  useEffect(() => {
    if (isConnected) return

    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        metrics: agent.metrics ? {
          cpu_usage: Math.max(0, Math.min(100, agent.metrics.cpu_usage + (Math.random() - 0.5) * 10)),
          memory_usage_mb: Math.max(64, agent.metrics.memory_usage_mb + (Math.random() - 0.5) * 20),
          response_time_ms: Math.max(10, agent.metrics.response_time_ms + (Math.random() - 0.5) * 30)
        } : undefined,
        active_tasks: Math.max(0, agent.active_tasks + Math.floor((Math.random() - 0.7) * 3)),
        last_active: agent.status === 'running' ? new Date().toISOString() : agent.last_active
      })))

      setSystemMetrics(prev => ({
        ...prev,
        total_tasks: Math.max(0, prev.total_tasks + Math.floor((Math.random() - 0.3) * 5)),
        completed_tasks: prev.completed_tasks + Math.floor(Math.random() * 3),
        failed_tasks: prev.failed_tasks + (Math.random() > 0.9 ? 1 : 0),
        system_load: Math.max(0, Math.min(100, prev.system_load + (Math.random() - 0.5) * 10)),
        memory_usage: Math.max(0, Math.min(100, prev.memory_usage + (Math.random() - 0.5) * 5))
      }))
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [isConnected])

  // Helper functions
  const getAgentById = (id: string) => agents.find(a => a.id === id)
  
  const getAgentsByType = (type: string) => agents.filter(a => a.agent_type === type)
  
  const getAgentsByStatus = (status: string) => agents.filter(a => a.status === status)

  const getHealthyAgents = () => agents.filter(a => 
    a.status === 'running' && 
    a.metrics && 
    a.metrics.cpu_usage < 80 && 
    a.metrics.response_time_ms < 200
  )

  const getUnhealthyAgents = () => agents.filter(a => 
    a.status === 'error' || 
    (a.metrics && (a.metrics.cpu_usage > 80 || a.metrics.response_time_ms > 500))
  )

  return {
    agents,
    systemMetrics,
    loading,
    error,
    connectionStatus,
    isConnected,
    
    // Helper functions
    getAgentById,
    getAgentsByType,
    getAgentsByStatus,
    getHealthyAgents,
    getUnhealthyAgents,
    
    // Actions
    refreshAgents: () => {
      requestAgentStatus()
      requestSystemMetrics()
    }
  }
}