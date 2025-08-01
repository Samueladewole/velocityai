import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Activity,
  Users,
  BookOpen,
  Cog,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  GitBranch,
  Workflow
} from 'lucide-react';

export const CipherWorking: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  
  const policies = [
    {
      id: 'data-governance',
      name: 'Data Governance Policy',
      category: 'Data Management',
      status: 'active',
      version: '2.1.0',
      lastUpdated: '2025-07-18',
      enforcement: 'automated',
      compliance: 98.5,
      violations: 3,
      scope: 'Global',
      nextReview: '2025-08-15',
      approvedBy: 'Chief Data Officer',
      applicableFrameworks: ['GDPR', 'CCPA', 'SOX']
    },
    {
      id: 'access-control',
      name: 'Identity & Access Management',
      category: 'Security',
      status: 'active',
      version: '3.0.2',
      lastUpdated: '2025-07-15',
      enforcement: 'automated',
      compliance: 95.2,
      violations: 8,
      scope: 'Enterprise',
      nextReview: '2025-07-30',
      approvedBy: 'CISO',
      applicableFrameworks: ['ISO 27001', 'NIST', 'SOC 2']
    },
    {
      id: 'vendor-management',
      name: 'Third-Party Risk Management',
      category: 'Vendor Relations',
      status: 'review',
      version: '1.8.1',
      lastUpdated: '2025-07-10',
      enforcement: 'manual',
      compliance: 87.3,
      violations: 12,
      scope: 'Procurement',
      nextReview: '2025-07-25',
      approvedBy: 'CPO',
      applicableFrameworks: ['SOC 2', 'ISO 27001']
    },
    {
      id: 'incident-response',
      name: 'Cybersecurity Incident Response',
      category: 'Operations',
      status: 'draft',
      version: '4.0.0-beta',
      lastUpdated: '2025-07-20',
      enforcement: 'hybrid',
      compliance: 92.7,
      violations: 5,
      scope: 'IT Operations',
      nextReview: '2025-08-01',
      approvedBy: 'Pending',
      applicableFrameworks: ['NIST', 'ISO 27035']
    }
  ];

  const automationRules = [
    {
      id: 'access-review',
      name: 'Quarterly Access Review',
      description: 'Automatically trigger access reviews for all users every 90 days',
      status: 'active',
      frequency: 'Quarterly',
      lastExecuted: '2025-07-01',
      nextExecution: '2025-10-01',
      coverage: 100,
      successRate: 98.5
    },
    {
      id: 'data-classification',
      name: 'Automatic Data Classification',
      description: 'Classify data based on content analysis and apply appropriate controls',
      status: 'active',
      frequency: 'Real-time',
      lastExecuted: '2025-07-20',
      nextExecution: 'Continuous',
      coverage: 94,
      successRate: 89.2
    },
    {
      id: 'policy-violation',
      name: 'Policy Violation Detection',
      description: 'Monitor and flag potential policy violations across all systems',
      status: 'active',
      frequency: 'Real-time',
      lastExecuted: '2025-07-20',
      nextExecution: 'Continuous',
      coverage: 87,
      successRate: 95.8
    },
    {
      id: 'compliance-reporting',
      name: 'Automated Compliance Reporting',
      description: 'Generate compliance reports for multiple frameworks automatically',
      status: 'scheduled',
      frequency: 'Monthly',
      lastExecuted: '2025-06-30',
      nextExecution: '2025-07-31',
      coverage: 100,
      successRate: 97.2
    }
  ];

  const policyMetrics = {
    totalPolicies: policies.length,
    activePolicies: policies.filter(p => p.status === 'active').length,
    averageCompliance: Math.round(policies.reduce((sum, p) => sum + p.compliance, 0) / policies.length * 10) / 10,
    totalViolations: policies.reduce((sum, p) => sum + p.violations, 0),
    automatedPolicies: policies.filter(p => p.enforcement === 'automated').length,
    lastUpdated: '2025-07-20'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'review':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'draft':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'inactive':
        return 'text-slate-700 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'review':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'draft':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-purple-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-slate-600" />;
    }
  };

  const getEnforcementIcon = (enforcement: string) => {
    switch (enforcement) {
      case 'automated':
        return <Cog className="h-4 w-4 text-emerald-600" />;
      case 'manual':
        return <Users className="h-4 w-4 text-amber-600" />;
      case 'hybrid':
        return <GitBranch className="h-4 w-4 text-blue-600" />;
      default:
        return <Settings className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-pink-600/20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-xl" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">CIPHER</h1>
              <p className="text-xl text-indigo-100 mt-1">Policy Automation Engine</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-100">Automation Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-indigo-200" />
                  <span className="text-indigo-100">{policyMetrics.activePolicies} policies enforced</span>
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
            <Button className="bg-white text-indigo-900 hover:bg-white/90">
              <Settings className="h-4 w-4 mr-2" />
              Policy Builder
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Policy Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Active Policies</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-300">
              <FileText className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{policyMetrics.activePolicies}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <ArrowUpRight className="h-4 w-4" />
              <span>+2 this month</span>
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
            <div className="text-3xl font-bold text-slate-900 mb-2">{policyMetrics.averageCompliance}%</div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <ArrowUpRight className="h-4 w-4" />
              <span>+3.2% this quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Policy Violations</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-red-200 text-red-600 group-hover:from-red-200 group-hover:to-red-300 transition-all duration-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{policyMetrics.totalViolations}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <ArrowDownRight className="h-4 w-4" />
              <span>-15% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Automated Policies</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
              <Cog className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{policyMetrics.automatedPolicies}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-purple-700">
              <span>75% automation rate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Policies */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Policy Library
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Automated policy management and enforcement
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
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedPolicy(policy.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(policy.status)}
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{policy.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Category: {policy.category}</span>
                          <span>Version: {policy.version}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          Updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border €{getStatusColor(policy.status)}`}>
                        {policy.status}
                      </div>
                      <div className="flex items-center gap-1">
                        {getEnforcementIcon(policy.enforcement)}
                        <span className="text-xs text-slate-600">{policy.enforcement}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Compliance Rate</div>
                      <div className="text-xl font-bold text-emerald-700">{policy.compliance}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Violations</div>
                      <div className="text-xl font-bold text-red-700">{policy.violations}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Scope:</span>
                      <span className="font-medium text-slate-900">{policy.scope}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Next Review:</span>
                      <span className="font-medium text-blue-700">{new Date(policy.nextReview).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-600">
                        <strong>Approved by:</strong> {policy.approvedBy}
                      </div>
                      <div className="flex gap-1">
                        {policy.applicableFrameworks.map((framework, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded border border-indigo-200"
                          >
                            {framework}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Automation Rules */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Workflow className="h-5 w-5 text-purple-600" />
                  Automation Rules
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Intelligent policy enforcement and compliance automation
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {automationRules.map((rule) => (
                <div
                  key={rule.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(rule.status)}
                      <div>
                        <h3 className="font-semibold text-slate-900">{rule.name}</h3>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">{rule.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {rule.status === 'active' ? (
                        <PlayCircle className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <PauseCircle className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-slate-600 mb-1">Frequency</div>
                      <div className="font-medium text-slate-900">{rule.frequency}</div>
                    </div>
                    <div>
                      <div className="text-slate-600 mb-1">Success Rate</div>
                      <div className="font-medium text-emerald-700">{rule.successRate}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Coverage: {rule.coverage}%</span>
                    <span>Next: {rule.nextExecution === 'Continuous' ? 'Continuous' : new Date(rule.nextExecution).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">Coverage</span>
                      <span className="font-medium">{rule.coverage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `€{rule.coverage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Performance Dashboard */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Target className="h-5 w-5 text-emerald-600" />
                Policy Performance Dashboard
              </CardTitle>
              <CardDescription className="text-slate-600">
                Real-time policy compliance and enforcement metrics
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
              <div className="text-3xl font-bold text-emerald-700 mb-2">93.4%</div>
              <div className="text-sm font-medium text-emerald-800">Average Compliance</div>
              <div className="text-xs text-emerald-600 mt-1">▲ 2.1% from last month</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-2">28</div>
              <div className="text-sm font-medium text-blue-800">Total Violations</div>
              <div className="text-xs text-blue-600 mt-1">▼ 15 from last month</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-2">75%</div>
              <div className="text-sm font-medium text-purple-800">Automation Rate</div>
              <div className="text-xs text-purple-600 mt-1">▲ 12% from last quarter</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
              <div className="text-3xl font-bold text-amber-700 mb-2">4.2min</div>
              <div className="text-sm font-medium text-amber-800">Avg. Response Time</div>
              <div className="text-xs text-amber-600 mt-1">▼ 1.3min from yesterday</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Zap className="h-5 w-5 text-amber-600" />
            Policy Operations
          </CardTitle>
          <CardDescription className="text-slate-600">
            Intelligent policy automation and compliance management tools
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-indigo-50/50 border-indigo-200"
            >
              <FileText className="h-8 w-8 text-indigo-600" />
              <span className="font-medium">Policy Builder</span>
              <span className="text-xs text-slate-500">Create & manage</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-purple-50/50 border-purple-200"
            >
              <Workflow className="h-8 w-8 text-purple-600" />
              <span className="font-medium">Automation Studio</span>
              <span className="text-xs text-slate-500">Configure rules</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-emerald-50/50 border-emerald-200"
            >
              <Target className="h-8 w-8 text-emerald-600" />
              <span className="font-medium">Compliance Report</span>
              <span className="text-xs text-slate-500">Executive dashboard</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-amber-50/50 border-amber-200"
            >
              <AlertTriangle className="h-8 w-8 text-amber-600" />
              <span className="font-medium">Violation Review</span>
              <span className="text-xs text-slate-500">Investigate issues</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};