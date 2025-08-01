import React, { useState, useEffect } from 'react';
import { ComponentPageTemplate, StatCard, TabConfiguration } from '@/components/templates/ComponentPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { 
  Cloud, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  Activity,
  Lock,
  Database,
  Globe,
  Cpu,
  TrendingUp,
  BarChart3,
  FileCheck,
  Settings,
  Zap,
  Scan,
  RefreshCw,
  Plus,
  Eye,
  Download,
  Upload,
  Building2,
  Server,
  HardDrive,
  Network,
  Key,
  AlertCircle,
  Wifi,
  Timer,
  Target
} from 'lucide-react';

interface CloudProvider {
  id: string;
  name: string;
  type: 'aws' | 'azure' | 'gcp' | 'oci' | 'alibaba';
  status: 'connected' | 'pending' | 'error' | 'disconnected';
  resources: number;
  findings: number;
  criticalFindings: number;
  compliance: number;
  lastScan: string;
  trustPoints: number;
  region: string;
  accountId: string;
}

interface SecurityFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  resource: string;
  provider: string;
  region: string;
  category: string;
  recommendation: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  discoveredDate: string;
  trustImpact: number;
}

interface ComplianceFramework {
  id: string;
  name: string;
  coverage: number;
  findings: number;
  controls: number;
  implemented: number;
  lastAssessment: string;
  trustPoints: number;
}

export const CloudSecurity: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [scanning, setScanning] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  // Sample data with enhanced structure
  const cloudProviders: CloudProvider[] = [
    {
      id: 'aws-prod',
      name: 'AWS Production',
      type: 'aws',
      status: 'connected',
      resources: 234,
      findings: 12,
      criticalFindings: 2,
      compliance: 94,
      lastScan: '5 minutes ago',
      trustPoints: 180,
      region: 'us-east-1',
      accountId: '123456789012'
    },
    {
      id: 'azure-prod',
      name: 'Azure Production',
      type: 'azure',
      status: 'connected',
      resources: 156,
      findings: 8,
      criticalFindings: 1,
      compliance: 91,
      lastScan: '12 minutes ago',
      trustPoints: 145,
      region: 'East US',
      accountId: 'sub-abc123'
    },
    {
      id: 'gcp-staging',
      name: 'Google Cloud Staging',
      type: 'gcp',
      status: 'pending',
      resources: 0,
      findings: 0,
      criticalFindings: 0,
      compliance: 0,
      lastScan: 'Not started',
      trustPoints: 0,
      region: 'us-central1',
      accountId: 'project-staging'
    }
  ];

  const securityFindings: SecurityFinding[] = [
    {
      id: 'find-1',
      severity: 'critical',
      title: 'S3 Bucket Publicly Accessible',
      description: 'Bucket customer-data-prod allows public read access to sensitive customer information',
      resource: 's3://customer-data-prod',
      provider: 'AWS',
      region: 'us-east-1',
      category: 'Data Exposure',
      recommendation: 'Configure bucket ACL to restrict public access and enable bucket encryption',
      status: 'open',
      discoveredDate: '2024-01-20',
      trustImpact: -50
    },
    {
      id: 'find-2',
      severity: 'critical',
      title: 'RDS Instance Without Encryption',
      description: 'Production database instance is not encrypted at rest',
      resource: 'rds-prod-db-01',
      provider: 'AWS',
      region: 'us-east-1',
      category: 'Encryption',
      recommendation: 'Enable encryption at rest and in transit for RDS instance',
      status: 'investigating',
      discoveredDate: '2024-01-19',
      trustImpact: -40
    },
    {
      id: 'find-3',
      severity: 'high',
      title: 'IAM Policy Too Permissive',
      description: 'Policy DeveloperAccess grants excessive permissions including administrative access',
      resource: 'iam-policy-dev-access',
      provider: 'AWS',
      region: 'Global',
      category: 'Access Control',
      recommendation: 'Apply principle of least privilege and review policy permissions',
      status: 'open',
      discoveredDate: '2024-01-18',
      trustImpact: -30
    }
  ];

  const complianceFrameworks: ComplianceFramework[] = [
    {
      id: 'soc2',
      name: 'SOC 2 Type II',
      coverage: 92,
      findings: 8,
      controls: 64,
      implemented: 59,
      lastAssessment: '2024-01-15',
      trustPoints: 200
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      coverage: 88,
      findings: 12,
      controls: 114,
      implemented: 100,
      lastAssessment: '2024-01-10',
      trustPoints: 250
    },
    {
      id: 'pci',
      name: 'PCI DSS',
      coverage: 95,
      findings: 5,
      controls: 78,
      implemented: 74,
      lastAssessment: '2024-01-20',
      trustPoints: 180
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      coverage: 90,
      findings: 10,
      controls: 45,
      implemented: 40,
      lastAssessment: '2024-01-12',
      trustPoints: 150
    }
  ];

  const runSecurityScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 3000);
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'aws': return <Globe className="h-5 w-5" />;
      case 'azure': return <Cloud className="h-5 w-5" />;
      case 'gcp': return <Database className="h-5 w-5" />;
      case 'oci': return <Server className="h-5 w-5" />;
      default: return <Cpu className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'open': return 'text-red-600 bg-red-50';
      case 'investigating': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Calculate metrics for ComponentPageTemplate
  const totalResources = cloudProviders.reduce((sum, provider) => sum + provider.resources, 0);
  const totalFindings = securityFindings.length;
  const criticalFindings = securityFindings.filter(f => f.severity === 'critical').length;
  const highFindings = securityFindings.filter(f => f.severity === 'high').length;
  const avgCompliance = Math.round(cloudProviders.reduce((sum, provider) => sum + provider.compliance, 0) / cloudProviders.filter(p => p.status === 'connected').length);
  const totalTrustPoints = cloudProviders.reduce((sum, provider) => sum + provider.trustPoints, 0) + 
                          complianceFrameworks.reduce((sum, framework) => sum + framework.trustPoints, 0);
  const openFindings = securityFindings.filter(f => f.status === 'open').length;

  // ComponentPageTemplate Quick Stats
  const quickStats: StatCard[] = [
    {
      label: 'Cloud Accounts',
      value: cloudProviders.length,
      change: `€{cloudProviders.filter(p => p.status === 'connected').length}`,
      trend: 'up',
      icon: <Cloud className="h-6 w-6 text-purple-600" />,
      description: `€{cloudProviders.filter(p => p.status === 'connected').length} connected`,
      color: 'text-purple-600'
    },
    {
      label: 'Security Findings',
      value: totalFindings,
      change: `€{criticalFindings}`,
      trend: criticalFindings > 0 ? 'down' : 'up',
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      description: `€{criticalFindings} critical`,
      color: 'text-red-600'
    },
    {
      label: 'Compliance Score',
      value: `€{avgCompliance}%`,
      change: '+3%',
      trend: 'up',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      description: 'Average across providers',
      color: 'text-green-600'
    },
    {
      label: 'Resources Scanned',
      value: totalResources,
      change: '+47',
      trend: 'up',
      icon: <Search className="h-6 w-6 text-blue-600" />,
      description: 'Across all cloud accounts',
      color: 'text-blue-600'
    }
  ];

  // Tab configurations
  const tabs: TabConfiguration[] = [
    {
      id: 'overview',
      label: 'Cloud Overview',
      badge: cloudProviders.filter(p => p.status === 'connected').length,
      content: (
        <div className="space-y-6">
          {/* Cloud Providers */}
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Connected Cloud Providers
                </CardTitle>
                <Button variant="outline" className="text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provider
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cloudProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg €{
                        provider.status === 'connected' ? 'bg-green-100' : 
                        provider.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        {getProviderIcon(provider.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{provider.name}</h3>
                        <p className="text-sm text-slate-600">{provider.lastScan}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {provider.region}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {provider.accountId}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Resources</p>
                        <p className="font-semibold">{provider.resources.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Findings</p>
                        <p className="font-semibold text-orange-600">{provider.findings}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Compliance</p>
                        <p className="font-semibold text-green-600">{provider.compliance}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Trust Points</p>
                        <p className="font-semibold text-blue-600">+{provider.trustPoints}</p>
                      </div>
                      <Badge className={getStatusColor(provider.status)}>
                        {provider.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Findings Summary */}
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Security Findings Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { severity: 'Critical', count: criticalFindings, color: 'from-red-500 to-red-600', examples: ['S3 bucket publicly accessible', 'RDS instance without encryption'] },
                  { severity: 'High', count: highFindings, color: 'from-orange-500 to-orange-600', examples: ['IAM policies too permissive', 'Security groups allow 0.0.0.0/0'] },
                  { severity: 'Medium', count: securityFindings.filter(f => f.severity === 'medium').length, color: 'from-yellow-500 to-yellow-600', examples: ['CloudTrail not configured', 'MFA not enforced'] },
                  { severity: 'Low', count: securityFindings.filter(f => f.severity === 'low').length, color: 'from-blue-500 to-blue-600', examples: ['Tags missing', 'Old snapshots retained'] }
                ].map((finding) => (
                  <Card key={finding.severity} className="border-0 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`bg-gradient-to-r €{finding.color} text-white`}>
                          {finding.severity}
                        </Badge>
                        <span className="text-2xl font-bold">{finding.count}</span>
                      </div>
                      <div className="space-y-1">
                        {finding.examples.map((example, idx) => (
                          <p key={idx} className="text-xs text-slate-600 line-clamp-1">
                            • {example}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'findings',
      label: 'Security Findings',
      badge: openFindings,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Security Findings</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileCheck className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure Rules
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {securityFindings.map((finding) => (
              <Card key={finding.id} className={`card-professional border €{getSeverityColor(finding.severity)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(finding.severity)}>
                          {finding.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {finding.category}
                        </Badge>
                        <Badge className={getStatusColor(finding.status)}>
                          {finding.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">{finding.title}</h4>
                      <p className="text-sm text-slate-600 mb-3">{finding.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
                        <div>
                          <span className="font-medium">Resource:</span> {finding.resource}
                        </div>
                        <div>
                          <span className="font-medium">Provider:</span> {finding.provider} ({finding.region})
                        </div>
                        <div>
                          <span className="font-medium">Discovered:</span> {finding.discoveredDate}
                        </div>
                        <div>
                          <span className="font-medium">Trust Impact:</span> 
                          <span className={finding.trustImpact < 0 ? 'text-red-600' : 'text-green-600'}>
                            {finding.trustImpact > 0 ? '+' : ''}{finding.trustImpact} points
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Fix Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <h5 className="text-sm font-medium text-slate-700 mb-1">Recommendation</h5>
                    <p className="text-sm text-slate-600">{finding.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {criticalFindings} critical findings require immediate attention. 
              Resolving security issues improves Trust Equity and reduces organizational risk.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3 mt-6">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Shield className="h-4 w-4 mr-2" />
              Auto-Remediate Findings
            </Button>
            <Button variant="outline">
              Export Security Report
            </Button>
            <Button variant="ghost" size="sm">
              Schedule Review
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'compliance',
      label: 'Compliance',
      badge: `€{avgCompliance}%`,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Compliance Framework Coverage</h3>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Framework
            </Button>
          </div>

          <div className="grid gap-4">
            {complianceFrameworks.map((framework) => (
              <Card key={framework.id} className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900">{framework.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {framework.findings} findings
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                        <div>
                          <span className="font-medium">Controls:</span> {framework.implemented}/{framework.controls}
                        </div>
                        <div>
                          <span className="font-medium">Last Assessment:</span> {framework.lastAssessment}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {framework.coverage}%
                      </div>
                      <div className="text-sm text-slate-500">compliant</div>
                      <div className="text-sm text-blue-600 mt-2">
                        +{framework.trustPoints} Trust Points
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Compliance Progress</span>
                      <span className="font-medium">{framework.coverage}%</span>
                    </div>
                    <Progress value={framework.coverage} className="h-3" />
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Controls
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Assessment Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Evidence
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Compliance frameworks provide structured security controls and demonstrate regulatory adherence. 
              Strong compliance scores significantly boost Trust Equity and customer confidence.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3 mt-6">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Framework
            </Button>
            <Button variant="outline">
              Generate Compliance Report
            </Button>
            <Button variant="ghost" size="sm">
              Review Controls
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'inventory',
      label: 'Resource Inventory',
      badge: totalResources,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Cloud Resource Inventory</h3>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Inventory
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { type: 'Compute', icon: Server, count: Math.floor(totalResources * 0.4), examples: ['EC2 Instances', 'Virtual Machines', 'Container Services'] },
              { type: 'Storage', icon: HardDrive, count: Math.floor(totalResources * 0.35), examples: ['S3 Buckets', 'Blob Storage', 'Cloud Storage'] },
              { type: 'Network', icon: Network, count: Math.floor(totalResources * 0.25), examples: ['VPCs', 'Load Balancers', 'Security Groups'] }
            ].map((category) => (
              <Card key={category.type} className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-blue-50">
                      <category.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{category.type}</h4>
                      <p className="text-2xl font-bold text-blue-600">{category.count}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {category.examples.map((example, idx) => (
                      <p key={idx} className="text-sm text-slate-600">• {example}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="card-professional">
            <CardContent className="p-8 text-center">
              <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Detailed Inventory Available
              </h3>
              <p className="text-slate-600 mb-4">
                Complete visibility into all your cloud resources across providers with security posture analysis
              </p>
              <Button onClick={() => navigate('/tools/atlas')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Target className="h-4 w-4 mr-2" />
                Launch ATLAS Scanner
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" onClick={runSecurityScan} disabled={scanning}>
        {scanning ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Scan className="h-4 w-4 mr-2" />
            Run Scan
          </>
        )}
      </Button>
      <Button onClick={() => navigate('/tools/atlas')} className="bg-gradient-to-r from-blue-600 to-purple-600">
        <Shield className="h-4 w-4 mr-2" />
        Launch ATLAS
      </Button>
    </>
  );

  return (
    <ComponentPageTemplate
      title="Cloud Security Scanner"
      subtitle="Multi-Cloud Security Posture Management & Compliance"
      description="Comprehensive security assessment across AWS, Azure, GCP and other cloud providers with real-time threat detection, compliance monitoring, and automated remediation guidance."
      trustScore={avgCompliance}
      trustPoints={totalTrustPoints}
      quickStats={quickStats}
      tabs={tabs}
      actions={headerActions}
      headerGradient="from-blue-50 to-purple-50"
      className="card-professional"
    />
  );
};