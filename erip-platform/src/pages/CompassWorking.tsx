import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FrameworkCoverageChart, ComplianceTrendChart } from '@/components/charts/RiskCharts';
import { ChartExplanationButton, PageExplanations } from '@/components/charts/ChartExplanation';
import { chartExplanations, pageCorrelations } from '@/data/chartExplanations';
// import IntelligentAssessment from '@/components/assessment/IntelligentAssessment';
import { 
  Shield, 
  Globe, 
  AlertTriangle, 
  TrendingUp, 
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  BarChart3,
  Brain
} from 'lucide-react';

export const CompassWorking: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [showAssessment, setShowAssessment] = useState<boolean>(false);

  // Chart data
  const frameworkCoverageData = [
    { name: 'GDPR', value: 95 },
    { name: 'SOX', value: 78 },
    { name: 'ISO 27001', value: 88 },
    { name: 'NIST', value: 82 },
    { name: 'PCI DSS', value: 91 }
  ];

  const complianceTrendData = [
    { month: 'Jan', compliance: 82, target: 90 },
    { month: 'Feb', compliance: 85, target: 90 },
    { month: 'Mar', compliance: 87, target: 90 },
    { month: 'Apr', compliance: 89, target: 90 },
    { month: 'May', compliance: 91, target: 90 },
    { month: 'Jun', compliance: 94, target: 90 },
  ];
  
  const frameworks = [
    { 
      id: 'gdpr',
      name: 'GDPR', 
      score: 95, 
      status: 'compliant', 
      gaps: 2, 
      requirements: 99,
      lastAssessed: '2025-07-15',
      category: 'Privacy',
      region: 'EU'
    },
    { 
      id: 'sox',
      name: 'SOX', 
      score: 78, 
      status: 'partial', 
      gaps: 8, 
      requirements: 67,
      lastAssessed: '2025-07-10',
      category: 'Financial',
      region: 'US'
    },
    { 
      id: 'iso27001',
      name: 'ISO 27001', 
      score: 92, 
      status: 'compliant', 
      gaps: 3, 
      requirements: 114,
      lastAssessed: '2025-07-12',
      category: 'Security',
      region: 'Global'
    },
    { 
      id: 'nist',
      name: 'NIST CSF', 
      score: 85, 
      status: 'partial', 
      gaps: 12, 
      requirements: 108,
      lastAssessed: '2025-07-08',
      category: 'Security',
      region: 'US'
    }
  ];

  const regulatoryChanges = [
    {
      id: '1',
      title: 'EU AI Act - Final Implementation Guidelines',
      source: 'European Commission',
      impact: 'high',
      effectiveDate: '2025-08-01',
      description: 'New requirements for high-risk AI systems including risk management and documentation.',
      affectedFrameworks: ['GDPR', 'ISO 27001'],
      daysUntilEffective: 11
    },
    {
      id: '2',
      title: 'Updated SOX Controls for Cloud Computing',
      source: 'SEC',
      impact: 'medium',
      effectiveDate: '2025-09-30',
      description: 'Enhanced controls for financial reporting in cloud environments.',
      affectedFrameworks: ['SOX'],
      daysUntilEffective: 71
    },
    {
      id: '3',
      title: 'NIST Cybersecurity Framework 2.0 Update',
      source: 'NIST',
      impact: 'medium',
      effectiveDate: '2025-10-15',
      description: 'Updated framework with enhanced supply chain security requirements.',
      affectedFrameworks: ['NIST CSF'],
      daysUntilEffective: 86
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-xl" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">COMPASS</h1>
              <p className="text-xl text-blue-100 mt-1">Regulatory Intelligence Engine</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-100">AI Analysis Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-200" />
                  <span className="text-blue-100">Last updated: {new Date().toLocaleTimeString()}</span>
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
              <Search className="h-4 w-4 mr-2" />
              Scan Regulations
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Total Frameworks</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
              <Globe className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{frameworks.length}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <ArrowUpRight className="h-4 w-4" />
              <span>+2 this quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Compliance Score</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
              <Shield className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {Math.round(frameworks.reduce((sum, f) => sum + f.score, 0) / frameworks.length)}%
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <ArrowUpRight className="h-4 w-4" />
              <span>+8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Active Gaps</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {frameworks.reduce((sum, f) => sum + f.gaps, 0)}
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-red-700">
              <ArrowDownRight className="h-4 w-4" />
              <span>-3 resolved this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Pending Changes</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
              <Zap className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{regulatoryChanges.length}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-purple-700">
              <span>2 high impact</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Framework Coverage
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Compliance scores across major frameworks
                </CardDescription>
              </div>
              <ChartExplanationButton chartId="framework-coverage" explanations={chartExplanations} />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <FrameworkCoverageChart data={frameworkCoverageData} />
            <ChartExplanationButton chartId="framework-coverage" explanations={chartExplanations} variant="inline" />
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Compliance Trend
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Overall compliance improvement over time
                </CardDescription>
              </div>
              <ChartExplanationButton chartId="compliance-trend" explanations={chartExplanations} />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ComplianceTrendChart data={complianceTrendData} />
            <ChartExplanationButton chartId="compliance-trend" explanations={chartExplanations} variant="inline" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enhanced Compliance Frameworks */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Compliance Frameworks
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Current compliance status across all frameworks
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
              {frameworks.map((framework) => (
                <div
                  key={framework.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedFramework(framework.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(framework.status)}
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{framework.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Category: {framework.category}</span>
                          <span>Region: {framework.region}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          Last assessed: {new Date(framework.lastAssessed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(framework.status)}`}>
                      {framework.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 font-medium">Compliance Score</span>
                        <span className="font-bold text-slate-900">{framework.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            framework.score >= 90 ? "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                            framework.score >= 70 ? "bg-gradient-to-r from-amber-500 to-orange-500" : 
                            "bg-gradient-to-r from-red-500 to-red-600"
                          }`}
                          style={{ width: `${framework.score}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{framework.requirements} requirements</span>
                        <span className="text-red-600 font-medium">{framework.gaps} gaps remaining</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Regulatory Changes */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Regulatory Changes
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Upcoming regulatory changes and their impact
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {regulatoryChanges.map((change, index) => (
                <div
                  key={change.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{change.title}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(change.impact)}`}>
                          {change.impact} impact
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{change.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {change.source}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(change.effectiveDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          <Clock className="h-3 w-3" />
                          {change.daysUntilEffective} days remaining
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {change.affectedFrameworks.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-600">Affected frameworks:</span>
                        <div className="flex gap-1">
                          {change.affectedFrameworks.map((framework) => (
                            <span
                              key={framework}
                              className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-md font-medium"
                            >
                              {framework}
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

      {/* Enhanced Quick Actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Zap className="h-5 w-5 text-amber-600" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-slate-600">
            AI-powered regulatory intelligence tools
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-blue-50/50 border-blue-200"
            >
              <Search className="h-8 w-8 text-blue-600" />
              <span className="font-medium">Scan New Regulations</span>
              <span className="text-xs text-slate-500">AI-powered analysis</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-emerald-50/50 border-emerald-200"
            >
              <FileText className="h-8 w-8 text-emerald-600" />
              <span className="font-medium">Generate Report</span>
              <span className="text-xs text-slate-500">Compliance summary</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-purple-50/50 border-purple-200"
            >
              <Eye className="h-8 w-8 text-purple-600" />
              <span className="font-medium">Expert Consultation</span>
              <span className="text-xs text-slate-500">Connect with experts</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-purple-50/50 border-purple-200"
              onClick={() => alert('Assessment feature coming soon!')}
            >
              <Brain className="h-8 w-8 text-purple-600" />
              <span className="font-medium">AI Assessment</span>
              <span className="text-xs text-slate-500">Coming soon</span>
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};