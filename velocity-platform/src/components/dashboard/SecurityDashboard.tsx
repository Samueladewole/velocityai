/**
 * Real-time Security Dashboard
 * Actionable insights and immediate value for security teams
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Cloud, 
  Lock, 
  Eye,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Target,
  Activity,
  Bell,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface SecurityMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  format: 'number' | 'percentage' | 'currency';
}

interface ThreatAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  affectedResources: number;
  estimatedImpact: number;
  autoRemediationAvailable: boolean;
}

interface ComplianceStatus {
  framework: string;
  score: number;
  passing: number;
  failing: number;
  total: number;
  nextAudit: Date;
  trend: 'improving' | 'declining' | 'stable';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  estimatedTime: string;
  potentialSavings: number;
  category: 'security' | 'compliance' | 'cost' | 'performance';
}

export const SecurityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Mock data - in production this would come from APIs
  const securityMetrics: SecurityMetric[] = [
    { label: 'Trust Score', value: 87, change: 5, trend: 'up', format: 'percentage' },
    { label: 'Active Threats', value: 3, change: -2, trend: 'down', format: 'number' },
    { label: 'Compliance Score', value: 94, change: 2, trend: 'up', format: 'percentage' },
    { label: 'Monthly Savings', value: 15750, change: 3200, trend: 'up', format: 'currency' }
  ];

  const threatAlerts: ThreatAlert[] = [
    {
      id: '1',
      severity: 'critical',
      title: 'Suspicious Login from New Location',
      description: 'User admin@company.com logged in from Russia (unusual location)',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      source: 'User Behavior Analytics',
      status: 'new',
      affectedResources: 1,
      estimatedImpact: 50000,
      autoRemediationAvailable: true
    },
    {
      id: '2',
      severity: 'high',
      title: 'S3 Bucket Permissions Changed',
      description: 'Bucket "user-data-prod" permissions modified to allow public access',
      timestamp: new Date(Date.now() - 32 * 60 * 1000), // 32 minutes ago
      source: 'Cloud Security Monitor',
      status: 'investigating',
      affectedResources: 1,
      estimatedImpact: 25000,
      autoRemediationAvailable: true
    },
    {
      id: '3',
      severity: 'medium',
      title: 'Multiple Failed Login Attempts',
      description: '15 failed login attempts detected for john@company.com',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      source: 'Authentication Monitor',
      status: 'new',
      affectedResources: 1,
      estimatedImpact: 5000,
      autoRemediationAvailable: false
    }
  ];

  const complianceStatus: ComplianceStatus[] = [
    { framework: 'SOC 2', score: 96, passing: 143, failing: 6, total: 149, nextAudit: new Date('2024-03-15'), trend: 'improving' },
    { framework: 'ISO 27001', score: 92, passing: 187, failing: 16, total: 203, nextAudit: new Date('2024-04-20'), trend: 'stable' },
    { framework: 'PCI DSS', score: 89, passing: 278, failing: 34, total: 312, nextAudit: new Date('2024-05-10'), trend: 'improving' },
    { framework: 'GDPR', score: 94, passing: 67, failing: 4, total: 71, nextAudit: new Date('2024-06-01'), trend: 'improving' }
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Enable MFA for All Admin Users',
      description: '12 admin users without MFA detected',
      impact: 'high',
      effort: 'low',
      estimatedTime: '15 minutes',
      potentialSavings: 75000,
      category: 'security'
    },
    {
      id: '2',
      title: 'Fix Public S3 Buckets',
      description: '3 buckets with public read access',
      impact: 'high',
      effort: 'low',
      estimatedTime: '5 minutes',
      potentialSavings: 100000,
      category: 'security'
    },
    {
      id: '3',
      title: 'Update Security Groups',
      description: '8 overly permissive security groups found',
      impact: 'medium',
      effort: 'medium',
      estimatedTime: '30 minutes',
      potentialSavings: 25000,
      category: 'security'
    },
    {
      id: '4',
      title: 'Enable CloudTrail Logging',
      description: 'Audit logging missing in 2 regions',
      impact: 'medium',
      effort: 'low',
      estimatedTime: '10 minutes',
      potentialSavings: 15000,
      category: 'compliance'
    }
  ];

  useEffect(() => {
    // Simulate real-time updates
    if (realTimeUpdates) {
      const interval = setInterval(() => {
        // Update metrics slightly
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 500);
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [realTimeUpdates]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatMetricValue = (value: number, format: string) => {
    switch (format) {
      case 'percentage': return `${value}%`;
      case 'currency': return `$${value.toLocaleString()}`;
      default: return value.toString();
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold">
                    {formatMetricValue(metric.value, metric.format)}
                  </p>
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
                   metric.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : 
                   <Activity className="w-4 h-4" />}
                  {metric.change > 0 && '+'}
                  {formatMetricValue(metric.change, metric.format)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Threats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Active Threats
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-red-600">
              {threatAlerts.filter(t => t.status === 'new').length} New
            </Badge>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {threatAlerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
              <Badge className={getSeverityColor(alert.severity)}>
                {alert.severity.toUpperCase()}
              </Badge>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{alert.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {Math.floor((Date.now() - alert.timestamp.getTime()) / (1000 * 60))} mins ago
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Source: {alert.source}</span>
                    <span>Impact: ${alert.estimatedImpact.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.autoRemediationAvailable && (
                      <Button size="sm" className="h-7">
                        <Zap className="w-3 h-3 mr-1" />
                        Auto-Fix
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-7">
                      Investigate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Wins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Quick Security Wins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {quickActions.slice(0, 4).map((action) => (
              <div key={action.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <Badge variant="outline" className={getImpactColor(action.impact)}>
                    {action.impact} impact
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-3">{action.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <div>{action.estimatedTime}</div>
                    <div className="text-green-600 font-medium">
                      ${action.potentialSavings.toLocaleString()} savings
                    </div>
                  </div>
                  <Button size="sm" className="h-7 text-xs">
                    Fix Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderThreatIntelTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Threat Intelligence Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {threatAlerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <div>
                    <h3 className="font-semibold">{alert.title}</h3>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>{Math.floor((Date.now() - alert.timestamp.getTime()) / (1000 * 60))} mins ago</div>
                  <div>from {alert.source}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Status</div>
                  <Badge variant="outline" className="mt-1">
                    {alert.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <div className="text-gray-500">Affected Resources</div>
                  <div className="font-medium">{alert.affectedResources}</div>
                </div>
                <div>
                  <div className="text-gray-500">Est. Impact</div>
                  <div className="font-medium text-red-600">
                    ${alert.estimatedImpact.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Actions</div>
                  <div className="flex gap-2 mt-1">
                    {alert.autoRemediationAvailable && (
                      <Button size="sm" className="h-6 text-xs">
                        Auto-Fix
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderComplianceTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceStatus.map((compliance) => (
          <Card key={compliance.framework}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{compliance.framework}</h3>
                <Badge variant="outline" className={
                  compliance.trend === 'improving' ? 'text-green-600' :
                  compliance.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                }>
                  {compliance.trend}
                </Badge>
              </div>
              
              <div className="text-2xl font-bold mb-2">{compliance.score}%</div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Passing:</span>
                  <span>{compliance.passing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Failing:</span>
                  <span>{compliance.failing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span>{compliance.total}</span>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                Next audit: {compliance.nextAudit.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Actions Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quickActions.filter(a => a.category === 'compliance').map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h4 className="font-medium">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right text-sm">
                    <div className="text-gray-500">{action.estimatedTime}</div>
                    <div className="text-green-600">${action.potentialSavings.toLocaleString()}</div>
                  </div>
                  <Button size="sm">Fix Now</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Security Dashboard</h1>
            <p className="text-gray-600">Real-time security insights and actionable intelligence</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${realTimeUpdates ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">
                {realTimeUpdates ? 'Live' : 'Paused'}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="threats">Threat Intel</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {renderOverviewTab()}
          </TabsContent>

          <TabsContent value="threats">
            {renderThreatIntelTab()}
          </TabsContent>

          <TabsContent value="compliance">
            {renderComplianceTab()}
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardContent className="p-8 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Deep dive into security trends, patterns, and predictive insights
                </p>
                <Button>Coming Soon</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};