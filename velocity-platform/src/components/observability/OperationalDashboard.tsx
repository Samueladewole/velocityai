/**
 * Operational Observability Dashboard
 * 
 * Real-time monitoring for DevOps and operational teams
 * Provides detailed system metrics, agent performance, and operational insights
 */

import React, { useState, useEffect } from 'react'
import { observabilityCore } from '../../services/observability/observabilityCore'
import { aiAgentMonitoring } from '../../services/observability/aiAgentMonitoring'
import { complianceObservability } from '../../services/observability/complianceObservability'

interface OperationalDashboardData {
  agentHealth: Array<{
    agentType: string
    status: 'healthy' | 'degraded' | 'critical' | 'offline'
    lastActivity: Date
    uptime: number
    errorRate: number
    averageLatency: number
    confidenceScore: number
  }>
  realtimeMetrics: {
    requestsPerMinute: number
    averageResponseTime: number
    errorRate: number
    activeUsers: number
    systemLoad: number
  }
  performanceAlerts: Array<{
    id: string
    severity: 'info' | 'warning' | 'critical'
    type: string
    message: string
    timestamp: Date
    agentType: string
  }>
  systemResources: {
    cpu: number
    memory: number
    storage: number
    network: number
  }
  recentEvents: Array<{
    timestamp: Date
    type: string
    component: string
    message: string
    severity: string
  }>
}

export const OperationalDashboard: React.FC<{ organizationId: string }> = ({ organizationId }) => {
  const [dashboardData, setDashboardData] = useState<OperationalDashboardData | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    
    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [organizationId, autoRefresh])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Get operational data
      const agentHealth = aiAgentMonitoring.getAgentHealthStatus(organizationId)
      const activeAlerts = aiAgentMonitoring.getActiveAlerts(organizationId)
      const recentEvents = observabilityCore.getEvents(organizationId, undefined, 50)

      // Simulate real-time metrics (in production, these would come from actual monitoring)
      const realtimeMetrics = {
        requestsPerMinute: Math.floor(Math.random() * 100 + 50),
        averageResponseTime: Math.floor(Math.random() * 1000 + 500),
        errorRate: Math.random() * 0.05,
        activeUsers: Math.floor(Math.random() * 50 + 10),
        systemLoad: Math.random() * 0.8 + 0.1
      }

      // Simulate system resources
      const systemResources = {
        cpu: Math.random() * 70 + 20,
        memory: Math.random() * 80 + 15,
        storage: Math.random() * 60 + 30,
        network: Math.random() * 40 + 10
      }

      setDashboardData({
        agentHealth,
        realtimeMetrics,
        performanceAlerts: activeAlerts,
        systemResources,
        recentEvents: recentEvents.map(e => ({
          timestamp: e.timestamp,
          type: e.type,
          component: e.component,
          message: `${e.source}: ${JSON.stringify(e.data).substring(0, 50)}...`,
          severity: e.severity
        }))
      })
    } catch (error) {
      console.error('Error loading operational dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800'
      case 'degraded': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      case 'info': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getResourceColor = (percentage: number) => {
    if (percentage > 80) return 'bg-red-500'
    if (percentage > 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No operational data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operational Dashboard</h1>
          <p className="text-gray-600">Real-time system monitoring and performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">Auto-refresh</span>
          </label>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Now
          </button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-600">Requests/Min</div>
          <div className="text-2xl font-bold text-blue-600">
            {dashboardData.realtimeMetrics.requestsPerMinute}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-600">Avg Response</div>
          <div className="text-2xl font-bold text-green-600">
            {dashboardData.realtimeMetrics.averageResponseTime}ms
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-600">Error Rate</div>
          <div className={`text-2xl font-bold ${
            dashboardData.realtimeMetrics.errorRate > 0.01 ? 'text-red-600' : 'text-green-600'
          }`}>
            {(dashboardData.realtimeMetrics.errorRate * 100).toFixed(2)}%
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-600">Active Users</div>
          <div className="text-2xl font-bold text-purple-600">
            {dashboardData.realtimeMetrics.activeUsers}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-600">System Load</div>
          <div className={`text-2xl font-bold ${
            dashboardData.realtimeMetrics.systemLoad > 0.7 ? 'text-red-600' : 'text-green-600'
          }`}>
            {(dashboardData.realtimeMetrics.systemLoad * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Agent Health Status */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Agent Health Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.agentHealth.map((agent) => (
            <div
              key={agent.agentType}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedAgent === agent.agentType
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedAgent(
                selectedAgent === agent.agentType ? null : agent.agentType
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{agent.agentType}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span>{(agent.uptime * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span>{agent.averageLatency.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span>{(agent.confidenceScore * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Activity:</span>
                  <span>{new Date(agent.lastActivity).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Resources */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(dashboardData.systemResources).map(([resource, value]) => (
            <div key={resource} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">{resource}</span>
                <span className="text-sm text-gray-600">{value.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getResourceColor(value)}`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Alerts */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Active Alerts ({dashboardData.performanceAlerts.length})
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {dashboardData.performanceAlerts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active alerts</p>
            ) : (
              dashboardData.performanceAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.severity === 'critical' ? 'bg-red-500' :
                    alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.type}
                      </p>
                      <span className="text-xs text-gray-500">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-500">Agent: {alert.agentType}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {dashboardData.recentEvents.slice(0, 20).map((event, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                <div className="text-xs text-gray-500 w-16 flex-shrink-0">
                  {event.timestamp.toLocaleTimeString().substring(0, 5)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      event.severity === 'error' ? 'bg-red-100 text-red-800' :
                      event.severity === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-xs text-gray-600">{event.component}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 truncate">{event.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Details Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{selectedAgent} Details</h3>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              {/* Agent-specific metrics would be shown here */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium">
                    {dashboardData.agentHealth.find(a => a.agentType === selectedAgent)?.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Activity</p>
                  <p className="font-medium">
                    {new Date(dashboardData.agentHealth.find(a => a.agentType === selectedAgent)?.lastActivity || new Date()).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Detailed performance metrics and historical data would be displayed here in a production environment.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>Real-time monitoring • Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</p>
        <p className="mt-1">
          🔍 <strong>Velocity.ai Observability</strong> - Complete AI System Transparency
        </p>
      </div>
    </div>
  )
}

export default OperationalDashboard