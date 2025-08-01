import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useRealtimeAgents } from '@/hooks/useRealtimeAgents'
import { 
  Activity, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  TrendingUp,
  RefreshCw,
  Plus,
  Settings,
  BarChart3
} from 'lucide-react'
import { VelocityCard, VelocityCardHeader, VelocityCardContent } from '@/components/ui/VelocityCard'
import { VelocityButton } from '@/components/ui/VelocityButton'
import { VelocityMetricCard, VelocityMetricGrid } from '@/components/ui/VelocityMetricCard'
import { VelocityAgentStatus, VelocityAgentAvatar, VelocityAgentHealth } from '@/components/ui/VelocityAgentStatus'
import { AgentChart } from './AgentChart'

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

export function AgentDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  
  // Use real-time agent data
  const {
    agents,
    systemMetrics,
    loading,
    error,
    connectionStatus,
    isConnected,
    refreshAgents
  } = useRealtimeAgents()

  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    refreshAgents()
    // Simulate refresh delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))
    setRefreshing(false)
  }

  const metrics = {
    total: systemMetrics.total_agents,
    running: systemMetrics.running_agents,
    tasks: systemMetrics.total_tasks,
    avgResponseTime: systemMetrics.avg_response_time
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold velocity-gradient-text">Agent Dashboard</h1>
            {/* Connection Status Indicator */}
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                connectionStatus === 'connected' && 'bg-green-500 animate-pulse',
                connectionStatus === 'connecting' && 'bg-yellow-500 animate-pulse',
                connectionStatus === 'disconnected' && 'bg-red-500',
                connectionStatus === 'error' && 'bg-red-500'
              )} />
              <span className="text-xs text-muted-foreground">
                {connectionStatus === 'connected' ? 'Live' : 
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 connectionStatus === 'disconnected' ? 'Offline' : 'Error'}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your AI compliance agents
            {!isConnected && ' (Demo Mode)'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <VelocityButton
            variant="secondary"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={handleRefresh}
            loading={refreshing}
          >
            Refresh
          </VelocityButton>
          <VelocityButton
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
          >
            Deploy Agent
          </VelocityButton>
        </div>
      </div>

      {/* Metrics Grid */}
      <VelocityMetricGrid columns={4}>
        <VelocityMetricCard
          title="Total Agents"
          value={metrics.total}
          icon={<Users className="h-4 w-4" />}
          change={12}
          changeLabel="vs last week"
          loading={loading}
        />
        <VelocityMetricCard
          title="Active Agents"
          value={metrics.running}
          icon={<Activity className="h-4 w-4" />}
          change={5}
          changeLabel="vs last week"
          loading={loading}
        />
        <VelocityMetricCard
          title="Active Tasks"
          value={metrics.tasks}
          icon={<CheckCircle2 className="h-4 w-4" />}
          change={-8}
          changeLabel="vs last hour"
          loading={loading}
        />
        <VelocityMetricCard
          title="Avg Response Time"
          value={metrics.avgResponseTime.toFixed(0)}
          unit="ms"
          icon={<Clock className="h-4 w-4" />}
          change={-15}
          changeLabel="improvement"
          loading={loading}
        />
      </VelocityMetricGrid>

      {/* Performance Chart */}
      <VelocityCard variant="gradient">
        <VelocityCardHeader
          title="Agent Performance"
          description="Real-time monitoring of agent activity and resource usage"
          icon={<BarChart3 className="h-5 w-5 text-purple-400" />}
          action={
            <select className="glass px-3 py-1.5 rounded-lg text-sm border border-white/10">
              <option>Last 1 hour</option>
              <option>Last 6 hours</option>
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
            </select>
          }
        />
        <VelocityCardContent>
          <AgentChart />
        </VelocityCardContent>
      </VelocityCard>

      {/* Agent List */}
      <VelocityCard>
        <VelocityCardHeader
          title="Active Agents"
          description="Monitor individual agent status and performance"
          icon={<Users className="h-5 w-5 text-purple-400" />}
        />
        <VelocityCardContent>
          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 glass rounded-lg animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10" />
                    <div>
                      <div className="h-4 w-32 bg-white/10 rounded mb-2" />
                      <div className="h-3 w-24 bg-white/10 rounded" />
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-white/10 rounded" />
                </div>
              ))
            ) : (
              agents.map((agent) => (
                <div
                  key={agent.id}
                  className={cn(
                    'flex items-center justify-between p-4 glass rounded-lg transition-all',
                    'hover:bg-white/5 cursor-pointer',
                    selectedAgent === agent.id && 'ring-2 ring-purple-500'
                  )}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <div className="flex items-center gap-4">
                    <VelocityAgentAvatar
                      agentType={agent.agent_type}
                      status={agent.status as any}
                    />
                    <div>
                      <h3 className="font-semibold">{agent.agent_type}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <VelocityAgentStatus
                          status={agent.status as any}
                          size="sm"
                        />
                        {agent.metrics && agent.status === 'running' && (
                          <VelocityAgentHealth
                            cpu={agent.metrics.cpu_usage}
                            memory={agent.metrics.memory_usage_mb}
                            responseTime={agent.metrics.response_time_ms}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {agent.active_tasks > 0 && (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-600/20">
                        <Activity className="h-3 w-3" />
                        <span className="text-sm font-medium">{agent.active_tasks} tasks</span>
                      </div>
                    )}
                    <VelocityButton
                      variant="ghost"
                      size="sm"
                      icon={<Settings className="h-4 w-4" />}
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle settings
                      }}
                    >
                      Configure
                    </VelocityButton>
                  </div>
                </div>
              ))
            )}
          </div>
        </VelocityCardContent>
      </VelocityCard>

      {/* Agent Details Panel */}
      {selectedAgent && (
        <VelocityCard variant="glow">
          <VelocityCardHeader
            title="Agent Details"
            description={`Configuration and logs for agent €{selectedAgent}`}
            action={
              <VelocityButton
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAgent(null)}
              >
                Close
              </VelocityButton>
            }
          />
          <VelocityCardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Configuration</h4>
                <pre className="glass rounded-lg p-4 text-xs overflow-auto">
{JSON.stringify({
  agent_id: selectedAgent,
  max_concurrent_tasks: 10,
  timeout_seconds: 300,
  retry_policy: {
    max_retries: 3,
    backoff_multiplier: 2
  }
}, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Logs</h4>
                <div className="glass rounded-lg p-4 space-y-2 text-xs font-mono">
                  <div className="text-green-400">[INFO] Agent started successfully</div>
                  <div className="text-blue-400">[INFO] Connected to task queue</div>
                  <div className="text-yellow-400">[WARN] High memory usage detected</div>
                  <div className="text-green-400">[INFO] Task completed: evidence-collection-123</div>
                </div>
              </div>
            </div>
          </VelocityCardContent>
        </VelocityCard>
      )}
    </div>
  )
}