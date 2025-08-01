import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Skeleton, 
  SkeletonCard, 
  SkeletonMetric 
} from '@/components/ui/skeleton';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { 
  Map as MapIcon, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Settings,
  Eye,
  RefreshCw,
  Cloud,
  Server,
  Database,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityControl {
  id: string;
  name: string;
  category: string;
  status: 'implemented' | 'partial' | 'missing' | 'testing';
  effectiveness: number;
  lastAssessed: string;
  findings: number;
  priority: 'high' | 'medium' | 'low';
}

interface SecurityFinding {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  affectedSystems: string[];
  status: 'open' | 'in-progress' | 'resolved';
  discoveredDate: string;
}

interface Environment {
  id: string;
  name: string;
  type: 'aws' | 'azure' | 'gcp' | 'on-premise';
  status: 'healthy' | 'warning' | 'critical';
  lastScan: string;
  findings: number;
  controls: number;
}

const mockControls: SecurityControl[] = [
  {
    id: 'ac-01',
    name: 'Access Control Policy',
    category: 'Access Control',
    status: 'implemented',
    effectiveness: 95,
    lastAssessed: '2025-07-15',
    findings: 1,
    priority: 'high'
  },
  {
    id: 'sc-07',
    name: 'Boundary Protection',
    category: 'System Communications',
    status: 'partial',
    effectiveness: 78,
    lastAssessed: '2025-07-12',
    findings: 3,
    priority: 'high'
  },
  {
    id: 'si-04',
    name: 'Information System Monitoring',
    category: 'System Information',
    status: 'implemented',
    effectiveness: 88,
    lastAssessed: '2025-07-10',
    findings: 0,
    priority: 'medium'
  },
  {
    id: 'ia-02',
    name: 'Identification and Authentication',
    category: 'Identification',
    status: 'testing',
    effectiveness: 85,
    lastAssessed: '2025-07-08',
    findings: 2,
    priority: 'high'
  }
];

const mockFindings: SecurityFinding[] = [
  {
    id: '1',
    title: 'Unencrypted Database Connection',
    severity: 'critical',
    category: 'Data Protection',
    description: 'Database connections are not using TLS encryption, potentially exposing sensitive data.',
    affectedSystems: ['Production DB', 'Staging DB'],
    status: 'in-progress',
    discoveredDate: '2025-07-18'
  },
  {
    id: '2',
    title: 'Weak Password Policy',
    severity: 'high',
    category: 'Access Control',
    description: 'Current password policy does not meet industry standards for complexity.',
    affectedSystems: ['User Portal', 'Admin Panel'],
    status: 'open',
    discoveredDate: '2025-07-16'
  },
  {
    id: '3',
    title: 'Missing Security Headers',
    severity: 'medium',
    category: 'Web Security',
    description: 'Web application is missing critical security headers like HSTS and CSP.',
    affectedSystems: ['Web Application'],
    status: 'open',
    discoveredDate: '2025-07-14'
  }
];

const mockEnvironments: Environment[] = [
  {
    id: 'aws-prod',
    name: 'AWS Production',
    type: 'aws',
    status: 'warning',
    lastScan: '2025-07-20',
    findings: 8,
    controls: 47
  },
  {
    id: 'azure-dev',
    name: 'Azure Development',
    type: 'azure',
    status: 'healthy',
    lastScan: '2025-07-19',
    findings: 2,
    controls: 23
  },
  {
    id: 'gcp-staging',
    name: 'GCP Staging',
    type: 'gcp',
    status: 'critical',
    lastScan: '2025-07-18',
    findings: 12,
    controls: 31
  }
];

export const Atlas: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [controls, setControls] = useState<SecurityControl[]>([]);
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setControls(mockControls);
      setFindings(mockFindings);
      setEnvironments(mockEnvironments);
      setLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
      case 'resolved':
      case 'healthy':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'partial':
      case 'in-progress':
      case 'warning':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'missing':
      case 'open':
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'testing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getEnvironmentIcon = (type: string) => {
    switch (type) {
      case 'aws':
        return <Cloud className="h-4 w-4 text-orange-600" />;
      case 'azure':
        return <Cloud className="h-4 w-4 text-blue-600" />;
      case 'gcp':
        return <Cloud className="h-4 w-4 text-green-600" />;
      case 'on-premise':
        return <Server className="h-4 w-4 text-slate-600" />;
      default:
        return <Globe className="h-4 w-4 text-slate-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="space-y-4">
          <Skeleton variant="text" width="300px" height="32px" />
          <Skeleton variant="text" width="500px" height="20px" />
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg">
              <CardContent className="p-6">
                <SkeletonMetric />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const totalFindings = findings.length;
  const criticalFindings = findings.filter(f => f.severity === 'critical').length;
  const avgEffectiveness = Math.round(controls.reduce((sum, c) => sum + c.effectiveness, 0) / controls.length);
  const implementedControls = controls.filter(c => c.status === 'implemented').length;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-red-200 text-red-600">
            <MapIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              ATLAS
            </h1>
            <p className="text-lg text-slate-600">
              Security Assessment System
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <AccessibleButton variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </AccessibleButton>
          <AccessibleButton variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Scan Now
          </AccessibleButton>
          <AccessibleButton className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Report
          </AccessibleButton>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Security Score
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">{avgEffectiveness}%</div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-700">
              <TrendingUp className="h-4 w-4" />
              <span>+5% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Active Findings
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">{totalFindings}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-red-700">
              <span>{criticalFindings} critical</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Controls Implemented
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {implementedControls}/{controls.length}
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-700">
              <TrendingUp className="h-4 w-4" />
              <span>{Math.round((implementedControls/controls.length) * 100)}% complete</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Environments
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">{environments.length}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-blue-700">
              <span>{environments.filter(e => e.status === 'healthy').length} healthy</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Security Controls */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Security Controls
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Implementation status and effectiveness
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {controls.map((control) => (
                <div
                  key={control.id}
                  className="group p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{control.name}</h3>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {control.id}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{control.category}</p>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(control.status)
                    )}>
                      {control.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Effectiveness</span>
                        <span className="font-medium">{control.effectiveness}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all duration-500",
                            control.effectiveness >= 90 ? "bg-green-500" :
                            control.effectiveness >= 70 ? "bg-amber-500" : "bg-red-500"
                          )}
                          style={{ width: `€{control.effectiveness}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="text-slate-600">Findings: </span>
                        <span className={cn(
                          "font-medium",
                          control.findings > 0 ? "text-red-600" : "text-green-600"
                        )}>
                          {control.findings}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(control.lastAssessed).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Findings */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Security Findings
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Active security issues requiring attention
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {findings.map((finding) => (
                <div
                  key={finding.id}
                  className="group p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{finding.title}</h3>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium border",
                          getSeverityColor(finding.severity)
                        )}>
                          {finding.severity}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{finding.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(finding.discoveredDate).toLocaleDateString()}
                        </span>
                        <span>{finding.category}</span>
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border ml-4",
                      getStatusColor(finding.status)
                    )}>
                      {finding.status}
                    </div>
                  </div>
                  
                  {finding.affectedSystems.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-600">Affected Systems:</span>
                        <div className="flex gap-1 flex-wrap">
                          {finding.affectedSystems.map((system) => (
                            <span
                              key={system}
                              className="px-2 py-0.5 text-xs bg-red-50 text-red-700 rounded"
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
      </div>

      {/* Environment Status */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Database className="h-5 w-5 text-purple-600" />
            Environment Status
          </CardTitle>
          <CardDescription className="text-slate-600">
            Multi-cloud security assessment overview
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            {environments.map((env) => (
              <div
                key={env.id}
                className="group p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getEnvironmentIcon(env.type)}
                    <div>
                      <h3 className="font-semibold text-slate-900">{env.name}</h3>
                      <p className="text-sm text-slate-500 capitalize">{env.type}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(env.status)
                  )}>
                    {env.status}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Controls</span>
                    <span className="font-medium">{env.controls}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Findings</span>
                    <span className={cn(
                      "font-medium",
                      env.findings > 5 ? "text-red-600" :
                      env.findings > 0 ? "text-amber-600" : "text-green-600"
                    )}>
                      {env.findings}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Last Scan</span>
                    <span className="text-slate-500">{new Date(env.lastScan).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};