import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Server,
  Cloud,
  Database,
  Lock,
  Wifi,
  Activity,
  Target,
  Globe
} from 'lucide-react';

export const AtlasWorking: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [cloudResources, setCloudResources] = useState<any>(null);

  // Load cloud resources on component mount
  useEffect(() => {
    loadCloudResources();
  }, []);

  const loadCloudResources = async () => {
    try {
      const response = await fetch('http://localhost:8001/atlas/cloud-resources');
      if (response.ok) {
        const data = await response.json();
        setCloudResources(data);
      }
    } catch (error) {
      console.error('Failed to load cloud resources:', error);
    }
  };

  const runSecurityAssessment = async () => {
    setIsScanning(true);
    setScanResults(null);
    
    try {
      const response = await fetch('http://localhost:8001/atlas/security-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessment_type: 'comprehensive',
          cloud_providers: ['aws', 'azure', 'gcp'],
          include_compliance: true
        })
      });
      
      if (response.ok) {
        const results = await response.json();
        setScanResults(results);
      } else {
        console.error('Security assessment failed');
      }
    } catch (error) {
      console.error('Failed to run security assessment:', error);
    } finally {
      setIsScanning(false);
    }
  };
  
  const securityControls = [
    {
      id: 'access-control',
      name: 'Access Control',
      category: 'Identity & Access',
      status: 'compliant',
      score: 92,
      controls: 47,
      gaps: 3,
      lastAssessed: '2025-07-18',
      criticality: 'high',
      environment: 'multi-cloud'
    },
    {
      id: 'network-security',
      name: 'Network Security',
      category: 'Infrastructure',
      status: 'partial',
      score: 78,
      controls: 34,
      gaps: 8,
      lastAssessed: '2025-07-16',
      criticality: 'high',
      environment: 'aws'
    },
    {
      id: 'data-protection',
      name: 'Data Protection',
      category: 'Data Security',
      status: 'compliant',
      score: 95,
      controls: 28,
      gaps: 1,
      lastAssessed: '2025-07-19',
      criticality: 'critical',
      environment: 'azure'
    },
    {
      id: 'incident-response',
      name: 'Incident Response',
      category: 'Operations',
      status: 'partial',
      score: 83,
      controls: 22,
      gaps: 4,
      lastAssessed: '2025-07-14',
      criticality: 'medium',
      environment: 'gcp'
    }
  ];

  const vulnerabilities = [
    {
      id: '1',
      title: 'Critical SQL Injection Vulnerability',
      severity: 'critical',
      cvssScore: 9.8,
      category: 'Web Application',
      environment: 'Production AWS',
      daysOpen: 2,
      affectedAssets: 3,
      description: 'SQL injection vulnerability in user authentication endpoint allowing unauthorized data access.',
      remediation: 'Apply parameterized queries and input validation'
    },
    {
      id: '2',
      title: 'Outdated SSL/TLS Configuration',
      severity: 'high',
      cvssScore: 7.4,
      category: 'Network Security',
      environment: 'Azure Load Balancer',
      daysOpen: 15,
      affectedAssets: 8,
      description: 'Legacy TLS 1.0/1.1 protocols enabled on public-facing endpoints.',
      remediation: 'Disable legacy protocols and enforce TLS 1.3'
    },
    {
      id: '3',
      title: 'Unencrypted Database Backup',
      severity: 'medium',
      cvssScore: 5.9,
      category: 'Data Protection',
      environment: 'GCP Storage',
      daysOpen: 8,
      affectedAssets: 2,
      description: 'Database backups stored without encryption in cloud storage.',
      remediation: 'Enable encryption at rest for all backup files'
    }
  ];

  const assessments = [
    {
      id: '1',
      name: 'Q3 2025 Security Assessment',
      type: 'Comprehensive',
      status: 'in-progress',
      progress: 68,
      startDate: '2025-07-01',
      estimatedCompletion: '2025-07-31',
      scope: 'All environments',
      findings: 24
    },
    {
      id: '2',
      name: 'AWS Infrastructure Review',
      type: 'Infrastructure',
      status: 'completed',
      progress: 100,
      startDate: '2025-06-15',
      estimatedCompletion: '2025-06-30',
      scope: 'AWS Production',
      findings: 12
    },
    {
      id: '3',
      name: 'Application Security Scan',
      type: 'Application',
      status: 'scheduled',
      progress: 0,
      startDate: '2025-08-01',
      estimatedCompletion: '2025-08-15',
      scope: 'Web Applications',
      findings: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'partial':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'non-compliant':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'non-compliant':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-600" />;
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
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getEnvironmentIcon = (environment: string) => {
    if (environment.toLowerCase().includes('aws')) return <Server className="h-4 w-4 text-orange-600" />;
    if (environment.toLowerCase().includes('azure')) return <Cloud className="h-4 w-4 text-blue-600" />;
    if (environment.toLowerCase().includes('gcp')) return <Database className="h-4 w-4 text-green-600" />;
    return <Globe className="h-4 w-4 text-slate-600" />;
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/20 blur-xl" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">ATLAS</h1>
              <p className="text-xl text-blue-100 mt-1">Security Assessment System</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-100">Multi-Cloud Scanning Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-200" />
                  <span className="text-blue-100">3 assessments running</span>
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
            <Button 
              className="bg-white text-blue-900 hover:bg-white/90 disabled:opacity-50"
              onClick={runSecurityAssessment}
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Run Live Scan
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Security Score</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
              <Shield className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {Math.round(securityControls.reduce((sum, c) => sum + c.score, 0) / securityControls.length)}%
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <ArrowUpRight className="h-4 w-4" />
              <span>+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Active Vulnerabilities</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-red-200 text-red-600 group-hover:from-red-200 group-hover:to-red-300 transition-all duration-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{vulnerabilities.length}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-red-700">
              <span>1 critical, 1 high</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Assets Monitored</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 text-green-600 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
              <Server className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">247</div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-700">
              <ArrowUpRight className="h-4 w-4" />
              <span>+18 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Compliance Rate</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">89%</div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <ArrowUpRight className="h-4 w-4" />
              <span>+6% this quarter</span>
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
                  <Lock className="h-5 w-5 text-blue-600" />
                  Security Controls
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Multi-cloud security assessment status
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {securityControls.map((control) => (
                <div
                  key={control.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedCategory(control.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(control.status)}
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{control.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Category: {control.category}</span>
                          <span className="flex items-center gap-1">
                            {getEnvironmentIcon(control.environment)}
                            {control.environment}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          Last assessed: {new Date(control.lastAssessed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(control.status)}`}>
                      {control.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 font-medium">Security Score</span>
                        <span className="font-bold text-slate-900">{control.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            control.score >= 90 ? "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                            control.score >= 70 ? "bg-gradient-to-r from-amber-500 to-orange-500" : 
                            "bg-gradient-to-r from-red-500 to-red-600"
                          }`}
                          style={{ width: `${control.score}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{control.controls} controls assessed</span>
                        <span className="text-red-600 font-medium">{control.gaps} gaps identified</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Scan Results */}
        {scanResults && (
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Live Security Assessment Results
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Real-time vulnerability scan completed at {new Date(scanResults.completed_at).toLocaleString()}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    scanResults.overall_score >= 8 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                    scanResults.overall_score >= 6 ? 'text-amber-700 bg-amber-50 border-amber-200' :
                    'text-red-700 bg-red-50 border-red-200'
                  }`}>
                    Score: {scanResults.overall_score}/10
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-semibold text-red-800">Critical</span>
                  </div>
                  <div className="text-2xl font-bold text-red-900">{scanResults.critical_findings}</div>
                </div>
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-800">High</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900">{scanResults.high_findings}</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-800">Total</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{scanResults.findings_count}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-900">Security Findings</h4>
                {scanResults.findings.slice(0, 3).map((finding: any, index: number) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-semibold text-slate-900">{finding.title}</h5>
                        <p className="text-sm text-slate-600 mt-1">{finding.description}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        finding.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        finding.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {finding.severity}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mb-2">
                      Risk Score: {finding.risk_score}/10 • Affected: {finding.affected_resources.length} resources
                    </div>
                    <div className="text-xs text-slate-600">
                      <strong>Remediation:</strong> {finding.remediation_steps[0]}
                    </div>
                  </div>
                ))}
              </div>

              {scanResults.recommendations && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">AI-Powered Recommendations</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {scanResults.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Cloud Resources Overview */}
        {cloudResources && (
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Cloud className="h-5 w-5 text-blue-600" />
                Multi-Cloud Resources ({cloudResources.total_resources} total)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-800">AWS</span>
                  </div>
                  <div className="space-y-1 text-sm text-orange-700">
                    <div>S3 Buckets: {cloudResources.aws_resources.s3_buckets}</div>
                    <div>EC2 Instances: {cloudResources.aws_resources.ec2_instances}</div>
                    <div>RDS Instances: {cloudResources.aws_resources.rds_instances}</div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">Azure</span>
                  </div>
                  <div className="space-y-1 text-sm text-blue-700">
                    <div>Storage Accounts: {cloudResources.azure_resources.storage_accounts}</div>
                    <div>Virtual Machines: {cloudResources.azure_resources.virtual_machines}</div>
                    <div>Databases: {cloudResources.azure_resources.databases}</div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-800">GCP</span>
                  </div>
                  <div className="space-y-1 text-sm text-emerald-700">
                    <div>Storage Buckets: {cloudResources.gcp_resources.storage_buckets}</div>
                    <div>Compute Instances: {cloudResources.gcp_resources.compute_instances}</div>
                    <div>Databases: {cloudResources.gcp_resources.databases}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vulnerabilities */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Active Vulnerabilities
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Critical and high-priority security findings
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Remediate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {vulnerabilities.map((vuln) => (
                <div
                  key={vuln.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{vuln.title}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(vuln.severity)}`}>
                          {vuln.severity}
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          CVSS {vuln.cvssScore}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{vuln.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                        <span className="flex items-center gap-1">
                          {getEnvironmentIcon(vuln.environment)}
                          {vuln.environment}
                        </span>
                        <span className="flex items-center gap-1">
                          <Server className="h-3 w-3" />
                          {vuln.affectedAssets} assets
                        </span>
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          <Clock className="h-3 w-3" />
                          {vuln.daysOpen} days open
                        </span>
                      </div>
                      <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                        <strong>Remediation:</strong> {vuln.remediation}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Status */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Activity className="h-5 w-5 text-purple-600" />
                Security Assessments
              </CardTitle>
              <CardDescription className="text-slate-600">
                Ongoing and scheduled security evaluations
              </CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Assessment
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{assessment.name}</h3>
                    <p className="text-sm text-slate-600">{assessment.type} Assessment</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assessment.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                    assessment.status === 'in-progress' ? 'bg-blue-50 text-blue-700' :
                    'bg-slate-50 text-slate-700'
                  }`}>
                    {assessment.status}
                  </div>
                </div>
                
                {assessment.status === 'in-progress' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-medium">{assessment.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${assessment.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-slate-500 space-y-1">
                  <div>Scope: {assessment.scope}</div>
                  <div>Findings: {assessment.findings}</div>
                  <div>Due: {new Date(assessment.estimatedCompletion).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Zap className="h-5 w-5 text-amber-600" />
            Security Operations
          </CardTitle>
          <CardDescription className="text-slate-600">
            AI-powered security assessment and remediation tools
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-blue-50/50 border-blue-200"
            >
              <Search className="h-8 w-8 text-blue-600" />
              <span className="font-medium">Vulnerability Scan</span>
              <span className="text-xs text-slate-500">Multi-cloud assets</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-red-50/50 border-red-200"
            >
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <span className="font-medium">Penetration Test</span>
              <span className="text-xs text-slate-500">Automated testing</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-emerald-50/50 border-emerald-200"
            >
              <FileText className="h-8 w-8 text-emerald-600" />
              <span className="font-medium">Compliance Report</span>
              <span className="text-xs text-slate-500">SOC 2, ISO 27001</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-purple-50/50 border-purple-200"
            >
              <Target className="h-8 w-8 text-purple-600" />
              <span className="font-medium">Remediation Plan</span>
              <span className="text-xs text-slate-500">AI-generated fixes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};