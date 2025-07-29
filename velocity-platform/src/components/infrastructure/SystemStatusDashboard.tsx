/**
 * ERIP System Status Dashboard
 * 
 * Real-time monitoring dashboard for all ERIP components and infrastructure
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Activity,
  Server,
  Database,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  ExternalLink,
  Users,
  Shield,
  Brain,
  Target,
  MessageSquare,
  Globe,
  Settings,
  BarChart
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types matching the health check system
interface HealthCheckResult {
  name: string
  status: 'pass' | 'fail' | 'warn'
  responseTime: number
  message?: string
  data?: Record<string, any>
  timestamp: Date
}

interface ComponentHealthStatus {
  component: string
  status: 'healthy' | 'degraded' | 'unhealthy' | 'offline'
  overallScore: number
  checks: HealthCheckResult[]
  lastCheck: Date
  uptime: number
  version: string
  dependencies: Array<{
    name: string
    type: string
    status: string
    responseTime?: number
  }>
}

interface SystemHealthOverview {
  status: 'healthy' | 'degraded' | 'unhealthy'
  overallScore: number
  timestamp: Date
  components: ComponentHealthStatus[]
  infrastructure: {
    database: HealthCheckResult
    eventBus: HealthCheckResult
    serviceRegistry: HealthCheckResult
    trustEngine: HealthCheckResult
  }
  metrics: {
    totalRequests: number
    averageResponseTime: number
    errorRate: number
    uptime: number
  }
}

const COMPONENT_ICONS = {
  compass: Globe,
  atlas: Shield,
  prism: BarChart,
  pulse: Activity,
  cipher: Settings,
  nexus: Brain,
  beacon: Target,
  clearance: CheckCircle
} as const

const COMPONENT_NAMES = {
  compass: 'COMPASS',
  atlas: 'ATLAS', 
  prism: 'PRISM',
  pulse: 'PULSE',
  cipher: 'CIPHER',
  nexus: 'NEXUS',
  beacon: 'BEACON',
  clearance: 'CLEARANCE'
} as const

const COMPONENT_DESCRIPTIONS = {
  compass: 'Regulatory Intelligence',
  atlas: 'Security Assessment',
  prism: 'Risk Quantification',
  pulse: 'Continuous Monitoring',
  cipher: 'Policy Automation',
  nexus: 'Threat Intelligence',
  beacon: 'Value Demonstration',
  clearance: 'Risk Appetite Management'
} as const

export function SystemStatusDashboard() {
  const [systemHealth, setSystemHealth] = useState<SystemHealthOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchSystemHealth = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // In a real implementation, this would fetch from the health API
      const response = await fetch('/health/detailed')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const healthData = await response.json()
      setSystemHealth(healthData)
      setLastRefresh(new Date())
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system health')
      console.error('Failed to fetch system health:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemHealth()
    
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(fetchSystemHealth, 30000) // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'pass':
        return 'bg-green-500 text-white'
      case 'degraded':
      case 'warn':
        return 'bg-yellow-500 text-white'
      case 'unhealthy':
      case 'fail':
        return 'bg-red-500 text-white'
      case 'offline':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-400 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'pass':
        return <CheckCircle className="h-4 w-4" />
      case 'degraded':
      case 'warn':
        return <AlertCircle className="h-4 w-4" />
      case 'unhealthy':
      case 'fail':
        return <AlertCircle className="h-4 w-4" />
      case 'offline':
        return <Minus className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatUptime = (uptimeMs: number) => {
    const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const formatResponseTime = (timeMs: number) => {
    if (timeMs >= 1000) return `${(timeMs / 1000).toFixed(1)}s`
    return `${Math.round(timeMs)}ms`
  }

  if (loading && !systemHealth) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg text-slate-600">Loading system status...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">System Status Unavailable</h3>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={fetchSystemHealth} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!systemHealth) return null

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">System Status</h1>
            <p className="text-slate-600 mt-1">
              Real-time monitoring of all ERIP components and infrastructure
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSystemHealth}
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Activity className="h-4 w-4 mr-2" />
              Auto Refresh
            </Button>
          </div>
        </div>

        {/* Overall Status */}
        <Card className={cn(
          "border-2",
          systemHealth.status === 'healthy' ? "border-green-200 bg-green-50" :
          systemHealth.status === 'degraded' ? "border-yellow-200 bg-yellow-50" :
          "border-red-200 bg-red-50"
        )}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex items-center justify-center w-16 h-16 rounded-full",
                  systemHealth.status === 'healthy' ? "bg-green-500" :
                  systemHealth.status === 'degraded' ? "bg-yellow-500" :
                  "bg-red-500"
                )}>
                  {getStatusIcon(systemHealth.status)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    System {systemHealth.status.charAt(0).toUpperCase() + systemHealth.status.slice(1)}
                  </h2>
                  <p className="text-slate-600">
                    Overall Score: {systemHealth.overallScore}%
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900">
                  {systemHealth.overallScore}%
                </div>
                <Progress value={systemHealth.overallScore} className="w-32 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">System Uptime</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatUptime(systemHealth.metrics.uptime)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Requests</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {systemHealth.metrics.totalRequests.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatResponseTime(systemHealth.metrics.averageResponseTime)}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Error Rate</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {systemHealth.metrics.errorRate.toFixed(1)}%
                  </p>
                </div>
                {systemHealth.metrics.errorRate > 5 ? (
                  <TrendingUp className="h-8 w-8 text-red-600" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-green-600" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Infrastructure Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Infrastructure Status
            </CardTitle>
            <CardDescription>
              Core system components and dependencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(systemHealth.infrastructure).map(([key, check]) => (
                <div key={key} className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className={cn("p-2 rounded-full", getStatusColor(check.status))}>
                    {key === 'database' && <Database className="h-4 w-4" />}
                    {key === 'eventBus' && <MessageSquare className="h-4 w-4" />}
                    {key === 'serviceRegistry' && <Users className="h-4 w-4" />}
                    {key === 'trustEngine' && <Target className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatResponseTime(check.responseTime)}
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(check.status)}>
                    {check.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ERIP Components Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              ERIP Components
            </CardTitle>
            <CardDescription>
              Status of all ERIP orchestrated components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemHealth.components.map((component) => {
                const Icon = COMPONENT_ICONS[component.component as keyof typeof COMPONENT_ICONS] || Shield
                const name = COMPONENT_NAMES[component.component as keyof typeof COMPONENT_NAMES] || component.component
                const description = COMPONENT_DESCRIPTIONS[component.component as keyof typeof COMPONENT_DESCRIPTIONS] || ''
                
                return (
                  <Card key={component.component} className={cn(
                    "border-2 transition-all hover:shadow-lg",
                    component.status === 'healthy' ? "border-green-200" :
                    component.status === 'degraded' ? "border-yellow-200" :
                    component.status === 'unhealthy' ? "border-red-200" :
                    "border-gray-200"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          component.status === 'healthy' ? "bg-green-100 text-green-600" :
                          component.status === 'degraded' ? "bg-yellow-100 text-yellow-600" :
                          component.status === 'unhealthy' ? "bg-red-100 text-red-600" :
                          "bg-gray-100 text-gray-600"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge className={getStatusColor(component.status)}>
                          {component.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <h3 className="font-semibold text-slate-900">{name}</h3>
                        <p className="text-sm text-slate-600">{description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Score:</span>
                          <span className="font-medium">{component.overallScore}%</span>
                        </div>
                        <Progress value={component.overallScore} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Uptime:</span>
                          <span className="font-medium">{formatUptime(component.uptime)}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Version:</span>
                          <span className="font-medium">{component.version}</span>
                        </div>
                        
                        {component.checks.length > 0 && (
                          <div className="pt-2 border-t">
                            <div className="text-xs text-slate-500 mb-1">
                              Health Checks ({component.checks.filter(c => c.status === 'pass').length}/{component.checks.length})
                            </div>
                            <div className="flex gap-1">
                              {component.checks.slice(0, 8).map((check, idx) => (
                                <div
                                  key={idx}
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    check.status === 'pass' ? "bg-green-400" :
                                    check.status === 'warn' ? "bg-yellow-400" :
                                    "bg-red-400"
                                  )}
                                  title={`${check.name}: ${check.status}`}
                                />
                              ))}
                              {component.checks.length > 8 && (
                                <div className="w-2 h-2 rounded-full bg-gray-300" title={`+${component.checks.length - 8} more`} />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Component Dependencies */}
        {systemHealth.components.some(c => c.dependencies.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Component Dependencies
              </CardTitle>
              <CardDescription>
                External services and dependencies status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth.components
                  .filter(component => component.dependencies.length > 0)
                  .map(component => (
                    <div key={component.component} className="border rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-3">
                        {COMPONENT_NAMES[component.component as keyof typeof COMPONENT_NAMES]} Dependencies
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {component.dependencies.map((dep, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              dep.status === 'available' ? "bg-green-400" :
                              dep.status === 'degraded' ? "bg-yellow-400" :
                              "bg-red-400"
                            )} />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900">{dep.name}</div>
                              <div className="text-xs text-slate-500 capitalize">{dep.type}</div>
                            </div>
                            {dep.responseTime && (
                              <div className="text-xs text-slate-600">
                                {formatResponseTime(dep.responseTime)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center py-6 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            ERIP System Status Dashboard - Updated every 30 seconds
          </p>
          <p className="text-xs text-slate-400 mt-1">
            For technical support, contact the ERIP operations team
          </p>
        </div>
      </div>
    </div>
  )
}