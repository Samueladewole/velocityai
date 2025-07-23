import React, { useState } from 'react';
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
  Target,
  Activity,
  DollarSign,
  Users,
  Settings,
  BarChart3,
  Globe,
  Share2,
  Link,
  Copy,
  ExternalLink,
  Gauge,
  Award,
  Lock,
  Key,
  Network,
  Database,
  Cloud,
  Workflow,
  Timer,
  Calculator,
  TrendingDown,
  RefreshCw,
  Brain,
  MonitorSpeaker
} from 'lucide-react';

export const ClearanceWorking: React.FC = () => {
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'decisions' | 'trust-score' | 'integrations' | 'sales-enablement'>('trust-score');
  const [showTrustCalculator, setShowTrustCalculator] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const riskDecisions = [
    {
      id: 'cloud-migration',
      title: 'Cloud Migration - Customer Data',
      category: 'Strategic Initiative',
      status: 'pending-approval',
      priority: 'high',
      requestedBy: 'IT Operations',
      submissionDate: '2025-07-19',
      estimatedValue: 2400000,
      riskExposure: 850000,
      approvalThreshold: 1000000,
      daysWaiting: 2,
      nextApprover: 'CRO',
      riskFactors: ['Data residency', 'Vendor dependency', 'Migration complexity']
    },
    {
      id: 'new-market',
      title: 'Market Expansion - APAC Region',
      category: 'Business Growth',
      status: 'approved',
      priority: 'medium',
      requestedBy: 'Business Development',
      submissionDate: '2025-07-15',
      estimatedValue: 5200000,
      riskExposure: 780000,
      approvalThreshold: 1000000,
      daysWaiting: 0,
      nextApprover: null,
      riskFactors: ['Regulatory compliance', 'Currency risk', 'Cultural barriers']
    },
    {
      id: 'vendor-contract',
      title: 'Critical Vendor Renewal',
      category: 'Vendor Management',
      status: 'escalated',
      priority: 'critical',
      requestedBy: 'Procurement',
      submissionDate: '2025-07-18',
      estimatedValue: 1800000,
      riskExposure: 1250000,
      approvalThreshold: 1000000,
      daysWaiting: 3,
      nextApprover: 'CEO',
      riskFactors: ['Service disruption', 'Cost increase', 'Alternative sourcing']
    }
  ];

  const appetiteMetrics = {
    currentExposure: 2880000,
    approvedThreshold: 5000000,
    warningThreshold: 4000000,
    monthlyBudget: 1000000,
    monthlyUsed: 750000,
    pendingDecisions: riskDecisions.filter(d => d.status === 'pending-approval').length,
    escalatedDecisions: riskDecisions.filter(d => d.status === 'escalated').length,
    lastUpdated: '2025-07-20'
  };

  const approvalWorkflow = [
    {
      level: 1,
      title: 'Department Head',
      threshold: 100000,
      avgTime: '2 hours',
      completionRate: 98,
      currentItems: 3
    },
    {
      level: 2,
      title: 'Risk Manager',
      threshold: 500000,
      avgTime: '6 hours',
      completionRate: 94,
      currentItems: 5
    },
    {
      level: 3,
      title: 'Chief Risk Officer',
      threshold: 1000000,
      avgTime: '1 day',
      completionRate: 89,
      currentItems: 2
    },
    {
      level: 4,
      title: 'Executive Committee',
      threshold: 5000000,
      avgTime: '3 days',
      completionRate: 85,
      currentItems: 1
    }
  ];


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'pending-approval':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'escalated':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'rejected':
        return 'text-slate-700 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'pending-approval':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'escalated':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  // Trust Score data
  const trustScore = {
    overall: 94,
    compliance: {
      soc2: { status: 'active', lastAssessment: '2 hours ago', score: 96 },
      iso27001: { status: 'active', lastAssessment: '1 day ago', score: 93 },
      gdpr: { status: 'active', lastAssessment: '3 hours ago', score: 97 },
      hipaa: { status: 'active', lastAssessment: '1 day ago', score: 91 }
    },
    riskExposure: 1200000,
    industryAverage: 3400000,
    lastUpdated: new Date().toISOString(),
    verifications: {
      automated: 1247,
      expert: 'Jane Doe, CISSP',
      thirdParty: '30 days ago'
    }
  };

  const integrations = [
    { name: 'AWS', type: 'cloud', status: 'connected', method: 'API (Read-Only)', lastSync: '2 minutes ago' },
    { name: 'Azure', type: 'cloud', status: 'connected', method: 'Graph API', lastSync: '5 minutes ago' },
    { name: 'GCP', type: 'cloud', status: 'connected', method: 'Cloud APIs', lastSync: '1 minute ago' },
    { name: 'CrowdStrike', type: 'security', status: 'connected', method: 'Webhook', lastSync: '3 minutes ago' },
    { name: 'Qualys', type: 'vulnerability', status: 'connected', method: 'API Import', lastSync: '10 minutes ago' },
    { name: 'Splunk', type: 'siem', status: 'connected', method: 'Alert Feed', lastSync: '1 minute ago' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Enhanced Header with Trust Score Focus */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-xl" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">CLEARANCE</h1>
              <p className="text-xl text-purple-100 mt-1">Trust Score & Sales Enablement</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-100">Trust Score: {trustScore.overall}/100</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-purple-200" />
                  <span className="text-purple-100">Updated {trustScore.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setShowShareModal(true)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Trust Score
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setShowTrustCalculator(true)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Trust Calculator
            </Button>
            <Button className="bg-white text-purple-900 hover:bg-white/90">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
        {(['trust-score', 'integrations', 'sales-enablement', 'decisions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
              activeTab === tab
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {tab === 'trust-score' && 'Trust Score Dashboard'}
            {tab === 'integrations' && 'Zero Access Integrations'}
            {tab === 'sales-enablement' && 'Sales Enablement'}
            {tab === 'decisions' && 'Risk Decisions'}
          </button>
        ))}
      </div>

      {/* Trust Score Dashboard */}
      {activeTab === 'trust-score' && (
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Trust Score</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                <Gauge className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-emerald-700 mb-2">{trustScore.overall}/100</div>
              <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
                <Award className="h-4 w-4" />
                <span>Excellent rating</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Risk Exposure</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                <TrendingDown className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-blue-700 mb-2">{formatCurrency(trustScore.riskExposure)}</div>
              <div className="flex items-center gap-1 text-sm font-medium text-blue-700">
                <span>65% below industry avg</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Verifications</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                <CheckCircle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-purple-700 mb-2">{trustScore.verifications.automated}</div>
              <div className="flex items-center gap-1 text-sm font-medium text-purple-700">
                <span>Automated checks</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Last Updated</CardTitle>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                <RefreshCw className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-amber-700 mb-2">Live</div>
              <div className="flex items-center gap-1 text-sm font-medium text-amber-700">
                <span>Real-time monitoring</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compliance Framework Status - Trust Score Tab */}
      {activeTab === 'trust-score' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Award className="h-5 w-5 text-emerald-600" />
                Compliance Framework Status
              </CardTitle>
              <CardDescription className="text-slate-600">
                Real-time compliance verification across frameworks
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Object.entries(trustScore.compliance).map(([framework, data]) => (
                  <div key={framework} className="p-4 rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <span className="font-semibold text-slate-900">{framework.toUpperCase()}</span>
                        <span className="px-2 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-full">
                          {data.status}
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-700">{data.score}/100</span>
                    </div>
                    <p className="text-sm text-slate-600">Last assessment: {data.lastAssessment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Brain className="h-5 w-5 text-blue-600" />
                Expert Validation
              </CardTitle>
              <CardDescription className="text-slate-600">
                Third-party and expert verification status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Expert Review</span>
                  </div>
                  <p className="text-blue-800">Risk assessment by {trustScore.verifications.expert}</p>
                </div>
                
                <div className="p-4 rounded-lg border border-purple-200 bg-purple-50">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">Automated Verification</span>
                  </div>
                  <p className="text-purple-800">{trustScore.verifications.automated} controls verified continuously</p>
                </div>
                
                <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-900">Third-Party Audit</span>
                  </div>
                  <p className="text-emerald-800">Last external audit: {trustScore.verifications.thirdParty}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Zero Access Integrations Tab */}
      {activeTab === 'integrations' && (
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Lock className="h-5 w-5 text-purple-600" />
              Zero Access Integration Philosophy
            </CardTitle>
            <CardDescription className="text-slate-600">
              Secure, read-only API connections without privileged access
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-900">What ERIP DOES</span>
                  </div>
                  <ul className="text-sm text-emerald-800 space-y-1">
                    <li>✅ OAuth 2.0 API connections</li>
                    <li>✅ Read-only configuration checks</li>
                    <li>✅ Compliance report aggregation</li>
                    <li>✅ Evidence collection & storage</li>
                    <li>✅ Real-time status monitoring</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-900">What ERIP NEVER DOES</span>
                  </div>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>❌ No agent installation</li>
                    <li>❌ No direct database access</li>
                    <li>❌ No system modifications</li>
                    <li>❌ No privileged access</li>
                    <li>❌ No data extraction</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Security Approach</span>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>🔒 Encrypted data in transit</li>
                    <li>🔒 Zero-trust architecture</li>
                    <li>🔒 Minimal scope permissions</li>
                    <li>🔒 Audit logging enabled</li>
                    <li>🔒 Regular security reviews</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Active Integrations</h3>
                <div className="grid gap-4">
                  {integrations.map((integration) => (
                    <div key={integration.name} className="p-4 rounded-lg border border-slate-200 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            {integration.type === 'cloud' && <Cloud className="h-5 w-5 text-blue-600" />}
                            {integration.type === 'security' && <Shield className="h-5 w-5 text-blue-600" />}
                            {integration.type === 'vulnerability' && <Search className="h-5 w-5 text-blue-600" />}
                            {integration.type === 'siem' && <MonitorSpeaker className="h-5 w-5 text-blue-600" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{integration.name}</h4>
                            <p className="text-sm text-slate-600">{integration.method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-400" />
                            <span className="text-sm font-medium text-emerald-700">{integration.status}</span>
                          </div>
                          <p className="text-xs text-slate-500">Last sync: {integration.lastSync}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sales Enablement Tab */}
      {activeTab === 'sales-enablement' && (
        <div className="space-y-6">
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Share2 className="h-5 w-5 text-purple-600" />
                Trust Score Sales Acceleration
              </CardTitle>
              <CardDescription className="text-slate-600">
                Transform security from sales blocker to competitive advantage
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Traditional Sales Process</h3>
                  <div className="space-y-3">
                    {[
                      { week: 'Week 1', task: 'Receive 200-question security questionnaire', status: 'slow' },
                      { week: 'Week 2-3', task: 'Chase down answers from security team', status: 'slow' },
                      { week: 'Week 4', task: 'Submit responses', status: 'slow' },
                      { week: 'Week 5-6', task: 'Handle follow-up questions', status: 'slow' },
                      { week: 'Week 7-8', task: 'Provide evidence/documentation', status: 'slow' },
                      { week: 'Week 9+', task: 'Deal closed (or lost to competitor)', status: 'risk' }
                    ].map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                        <Timer className="h-4 w-4 text-red-600" />
                        <div>
                          <span className="font-medium text-red-900">{step.week}:</span>
                          <span className="text-red-800 ml-2">{step.task}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">With ERIP Trust Score</h3>
                  <div className="space-y-3">
                    {[
                      { day: 'Day 1', task: 'Share Trust Score URL (erip.io/trust/yourcompany)', status: 'fast' },
                      { day: 'Day 1', task: 'Buyer sees real-time compliance status', status: 'fast' },
                      { day: 'Day 1', task: 'Verified certifications & risk metrics', status: 'fast' },
                      { day: 'Day 1', task: 'Expert validations & evidence repository', status: 'fast' },
                      { day: 'Day 2', task: 'Deal progresses to negotiation', status: 'success' }
                    ].map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                        <Zap className="h-4 w-4 text-emerald-600" />
                        <div>
                          <span className="font-medium text-emerald-900">{step.day}:</span>
                          <span className="text-emerald-800 ml-2">{step.task}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                  Instant Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Real-time compliance status
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Verified certifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Quantified risk metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Expert validations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Evidence repository access
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Workflow className="h-5 w-5 text-purple-600" />
                  Pre-answered Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Common questionnaires pre-mapped
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Evidence already collected
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Deep-dive capabilities
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    No back-and-forth delays
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Export to any format
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Network className="h-5 w-5 text-amber-600" />
                  Trust Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Mutual verification if both on ERIP
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Shared assessment standards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Network effect benefits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Industry benchmarking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Competitive differentiation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Risk Decisions Tab */}
      {activeTab === 'decisions' && (
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <FileText className="h-5 w-5 text-purple-600" />
              Risk Decisions
            </CardTitle>
            <CardDescription className="text-slate-600">
              Active risk appetite decisions and approvals
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {riskDecisions.map((decision) => (
                <div
                  key={decision.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedDecision(decision.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(decision.status)}
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{decision.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>By: {decision.requestedBy}</span>
                          <span>Category: {decision.category}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          Submitted: {new Date(decision.submissionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(decision.status)}`}>
                        {decision.status.replace('-', ' ')}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(decision.priority)}`}>
                        {decision.priority} priority
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Estimated Value</div>
                      <div className="text-xl font-bold text-emerald-700">{formatCurrency(decision.estimatedValue)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Risk Exposure</div>
                      <div className="text-xl font-bold text-red-700">{formatCurrency(decision.riskExposure)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Approval Threshold:</span>
                      <span className="font-medium text-slate-900">{formatCurrency(decision.approvalThreshold)}</span>
                    </div>
                    {decision.nextApprover && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">Next:</span>
                        <span className="font-medium text-blue-700">{decision.nextApprover}</span>
                      </div>
                    )}
                  </div>
                  
                  {decision.status === 'pending-approval' && (
                    <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 mb-3">
                      <Clock className="h-4 w-4" />
                      <span>Waiting {decision.daysWaiting} days for approval</span>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-slate-100">
                    <div className="text-xs text-slate-600 mb-2">
                      <strong>Risk Factors:</strong>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {decision.riskFactors.map((factor, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs bg-slate-100 text-slate-700 rounded"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};