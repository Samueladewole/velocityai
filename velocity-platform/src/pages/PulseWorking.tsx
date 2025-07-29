import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  BarChart3,
  Wifi,
  Server,
  Database,
  Globe,
  Bell,
  Shield,
  AlertCircle
} from 'lucide-react';

export const PulseWorking: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  
  const monitoringAlerts = [
    {
      id: 'security-breach',
      title: 'Suspicious Login Activity Detected',
      category: 'Security',
      severity: 'high',
      status: 'active',
      source: 'Authentication System',
      timestamp: '2025-07-20T14:32:00Z',
      affectedSystems: ['User Portal', 'Admin Dashboard'],
      description: 'Multiple failed login attempts from unusual geographic locations',
      recommendation: 'Enable additional MFA verification for affected accounts'
    },
    {
      id: 'performance-degradation',
      title: 'Database Response Time Increase',
      category: 'Performance',
      severity: 'medium',
      status: 'investigating',
      source: 'Database Monitor',
      timestamp: '2025-07-20T13:45:00Z',
      affectedSystems: ['Customer Portal', 'Reporting Engine'],
      description: 'Average query response time increased by 340% over last 30 minutes',
      recommendation: 'Scale database resources and optimize slow queries'
    },
    {
      id: 'compliance-drift',
      title: 'Configuration Drift - SOX Controls',
      category: 'Compliance',
      severity: 'medium',
      status: 'acknowledged',
      source: 'Compliance Scanner',
      timestamp: '2025-07-20T12:15:00Z',
      affectedSystems: ['Financial Systems'],
      description: 'Critical SOX control configurations have deviated from baseline',
      recommendation: 'Restore configurations to approved baseline immediately'
    },
    {
      id: 'capacity-warning',
      title: 'Storage Capacity Threshold Exceeded',
      category: 'Infrastructure',
      severity: 'low',
      status: 'resolved',
      source: 'Infrastructure Monitor',
      timestamp: '2025-07-20T11:20:00Z',
      affectedSystems: ['Backup Storage'],
      description: 'Backup storage utilization reached 85% of allocated capacity',
      recommendation: 'Provision additional storage or implement data retention policies'
    }
  ];

  const kpiMetrics = [
    {
      name: 'System Availability',
      current: 99.94,
      target: 99.90,
      trend: 'up',
      unit: '%',
      category: 'Performance'
    },
    {
      name: 'Mean Time to Detect',
      current: 4.2,
      target: 5.0,
      trend: 'down',
      unit: 'min',
      category: 'Security'
    },
    {
      name: 'Compliance Score',
      current: 96.8,
      target: 95.0,
      trend: 'up',
      unit: '%',
      category: 'Compliance'
    },
    {
      name: 'Risk Event Volume',
      current: 23,
      target: 30,
      trend: 'down',
      unit: 'events',
      category: 'Risk'
    }
  ];

  const monitoringSources = [
    {
      name: 'AWS CloudWatch',
      type: 'Infrastructure',
      status: 'healthy',
      metrics: 1247,
      lastUpdate: '2 min ago',
      coverage: 98
    },
    {
      name: 'Azure Sentinel',
      type: 'Security',
      status: 'healthy',
      metrics: 856,
      lastUpdate: '1 min ago',
      coverage: 94
    },
    {
      name: 'Splunk Enterprise',
      type: 'Analytics',
      status: 'warning',
      metrics: 2134,
      lastUpdate: '5 min ago',
      coverage: 89
    },
    {
      name: 'Compliance Engine',
      type: 'Compliance',
      status: 'healthy',
      metrics: 445,
      lastUpdate: '3 min ago',
      coverage: 92
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'investigating':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'acknowledged':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'resolved':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getSourceIcon = (category: string) => {
    switch (category) {
      case 'Security':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'Performance':
        return <Activity className="h-4 w-4 text-blue-600" />;
      case 'Compliance':
        return <CheckCircle className="h-4 w-4 text-purple-600" />;
      case 'Infrastructure':
        return <Server className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-600" />;
    }
  };

  const getSourceStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-600" />;
    }
  };

  const formatMetric = (value: number, unit: string) => {
    if (unit === '%') return `${value}%`;
    if (unit === 'min') return `${value} min`;
    if (unit === 'events') return `${value}`;
    return value.toString();
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-600/20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/20 blur-xl" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Activity className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">PULSE</h1>
              <p className="text-xl text-blue-100 mt-1">Continuous Monitoring Engine</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-100">Real-time monitoring active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-blue-200" />
                  <span className="text-blue-100">4 data sources connected</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-white text-blue-900 hover:bg-white/90">
              <Bell className="h-4 w-4 mr-2" />
              Alert Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        {kpiMetrics.map((metric, index) => (
          <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">{metric.name}</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                {getSourceIcon(metric.category)}
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-slate-900 mb-2">{formatMetric(metric.current, metric.unit)}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className={metric.current >= metric.target ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                    {metric.current >= metric.target ? 'Above' : 'Below'} target
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Target: {formatMetric(metric.target, metric.unit)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Alerts */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Bell className="h-5 w-5 text-red-600" />
                  Active Alerts
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Real-time monitoring alerts and incidents
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {monitoringAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedAlert(alert.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getSourceIcon(alert.category)}
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{alert.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Source: {alert.source}</span>
                          <span>Category: {alert.category}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity} severity
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-slate-700 mb-2">{alert.description}</p>
                    <div className="text-xs bg-blue-50 text-blue-700 p-2 rounded border border-blue-200">
                      <strong>Recommendation:</strong> {alert.recommendation}
                    </div>
                  </div>
                  
                  {alert.affectedSystems.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-600">Affected Systems:</span>
                        <div className="flex gap-1">
                          {alert.affectedSystems.map((system, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 text-xs bg-red-50 text-red-700 rounded border border-red-200"
                            >
                              {system}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Sources */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Wifi className="h-5 w-5 text-blue-600" />
                  Data Sources
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Connected monitoring systems and their status
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Add Source
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {monitoringSources.map((source, index) => (
                <div
                  key={index}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getSourceStatusIcon(source.status)}
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{source.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Type: {source.type}</span>
                          <span>Coverage: {source.coverage}%</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          Last update: {source.lastUpdate}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      source.status === 'healthy' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                      source.status === 'warning' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                      'text-red-700 bg-red-50 border-red-200'
                    }`}>
                      {source.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Active Metrics</div>
                      <div className="text-2xl font-bold text-slate-900">{source.metrics.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Coverage</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                source.coverage >= 95 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                                source.coverage >= 85 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                                'bg-gradient-to-r from-red-500 to-red-600'
                              }`}
                              style={{ width: `${source.coverage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-slate-900">{source.coverage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Dashboard */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                System Health Overview
              </CardTitle>
              <CardDescription className="text-slate-600">
                Real-time system performance and health metrics
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              All Systems Operational
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
              <div className="text-3xl font-bold text-emerald-700 mb-2">99.94%</div>
              <div className="text-sm font-medium text-emerald-800">System Uptime</div>
              <div className="text-xs text-emerald-600 mt-1">▲ 0.02% from yesterday</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-2">245ms</div>
              <div className="text-sm font-medium text-blue-800">Avg Response Time</div>
              <div className="text-xs text-blue-600 mt-1">▼ 12ms from yesterday</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-2">4.2min</div>
              <div className="text-sm font-medium text-purple-800">Mean Time to Detect</div>
              <div className="text-xs text-purple-600 mt-1">▼ 0.8min from yesterday</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
              <div className="text-3xl font-bold text-amber-700 mb-2">23</div>
              <div className="text-sm font-medium text-amber-800">Active Alerts</div>
              <div className="text-xs text-amber-600 mt-1">▼ 7 from yesterday</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Zap className="h-5 w-5 text-amber-600" />
            Monitoring Operations
          </CardTitle>
          <CardDescription className="text-slate-600">
            Real-time monitoring and alerting management tools
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-blue-50/50 border-blue-200"
            >
              <Bell className="h-8 w-8 text-blue-600" />
              <span className="font-medium">Alert Rules</span>
              <span className="text-xs text-slate-500">Configure thresholds</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-purple-50/50 border-purple-200"
            >
              <Activity className="h-8 w-8 text-purple-600" />
              <span className="font-medium">Health Dashboard</span>
              <span className="text-xs text-slate-500">System overview</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-emerald-50/50 border-emerald-200"
            >
              <BarChart3 className="h-8 w-8 text-emerald-600" />
              <span className="font-medium">Analytics Report</span>
              <span className="text-xs text-slate-500">Performance metrics</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-red-50/50 border-red-200"
            >
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <span className="font-medium">Incident Response</span>
              <span className="text-xs text-slate-500">Emergency protocols</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};