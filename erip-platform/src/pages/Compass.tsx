import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { 
  Compass as CompassIcon, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Globe,
  Search,
  Filter,
  Download,
  Brain,
  Upload,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { QIEWorkflowComponent } from '@/components/qie/QIEWorkflow';

interface ComplianceFramework {
  id: string;
  name: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  score: number;
  lastAssessed: string;
  requirements: number;
  gaps: number;
}

interface RegulatoryChange {
  id: string;
  title: string;
  source: string;
  impact: 'high' | 'medium' | 'low';
  effectiveDate: string;
  description: string;
  affectedFrameworks: string[];
}

const mockFrameworks: ComplianceFramework[] = [
  {
    id: 'gdpr',
    name: 'GDPR',
    status: 'compliant',
    score: 95,
    lastAssessed: '2025-07-15',
    requirements: 99,
    gaps: 2
  },
  {
    id: 'sox',
    name: 'SOX',
    status: 'partial',
    score: 78,
    lastAssessed: '2025-07-10',
    requirements: 67,
    gaps: 8
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    status: 'compliant',
    score: 92,
    lastAssessed: '2025-07-12',
    requirements: 114,
    gaps: 3
  },
  {
    id: 'nist',
    name: 'NIST CSF',
    status: 'partial',
    score: 85,
    lastAssessed: '2025-07-08',
    requirements: 108,
    gaps: 12
  }
];

const mockRegulatoryChanges: RegulatoryChange[] = [
  {
    id: '1',
    title: 'EU AI Act - Final Implementation Guidelines',
    source: 'European Commission',
    impact: 'high',
    effectiveDate: '2025-08-01',
    description: 'New requirements for high-risk AI systems including risk management and documentation.',
    affectedFrameworks: ['GDPR', 'ISO 27001']
  },
  {
    id: '2',
    title: 'Updated SOX Controls for Cloud Computing',
    source: 'SEC',
    impact: 'medium',
    effectiveDate: '2025-09-30',
    description: 'Enhanced controls for financial reporting in cloud environments.',
    affectedFrameworks: ['SOX']
  },
  {
    id: '3',
    title: 'NIST Cybersecurity Framework 2.0 Update',
    source: 'NIST',
    impact: 'medium',
    effectiveDate: '2025-10-15',
    description: 'Updated framework with enhanced supply chain security requirements.',
    affectedFrameworks: ['NIST CSF']
  }
];

export const Compass: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [frameworks] = useState<ComplianceFramework[]>(mockFrameworks);
  const [regulatoryChanges] = useState<RegulatoryChange[]>(mockRegulatoryChanges);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'qie'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-700 bg-green-50 border-green-200';
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
        return <CheckCircle className="h-4 w-4 text-green-600" />;
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
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };


  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600">
            <CompassIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              COMPASS
            </h1>
            <p className="text-lg text-slate-600">
              Regulatory Intelligence Engine
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <AccessibleButton 
              variant={activeView === 'overview' ? 'default' : 'ghost'}
              size="sm"
              className="text-sm"
              onClick={() => setActiveView('overview')}
            >
              <CompassIcon className="h-4 w-4 mr-1" />
              Overview
            </AccessibleButton>
            <AccessibleButton 
              variant={activeView === 'qie' ? 'default' : 'ghost'}
              size="sm"
              className="text-sm"
              onClick={() => setActiveView('qie')}
            >
              <Brain className="h-4 w-4 mr-1" />
              Questionnaire AI
            </AccessibleButton>
          </div>
          
          <AccessibleButton variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </AccessibleButton>
          <AccessibleButton variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </AccessibleButton>
          <AccessibleButton className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Scan Regulations
          </AccessibleButton>
        </div>
      </div>

      {/* Conditional Content */}
      {activeView === 'overview' ? (
        <>
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-4">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Total Frameworks
            </CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">{frameworks.length}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-700">
              <TrendingUp className="h-4 w-4" />
              <span>+2 this quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Compliance Score
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {Math.round(frameworks.reduce((sum, f) => sum + f.score, 0) / frameworks.length)}%
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-700">
              <TrendingUp className="h-4 w-4" />
              <span>+8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Active Gaps
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {frameworks.reduce((sum, f) => sum + f.gaps, 0)}
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-red-700">
              <span>-3 resolved this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Pending Changes
            </CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">{regulatoryChanges.length}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-purple-700">
              <span>2 high impact</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliance Frameworks */}
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
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {frameworks.map((framework) => (
                <div
                  key={framework.id}
                  className="group p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedFramework(framework.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(framework.status)}
                      <div>
                        <h3 className="font-semibold text-slate-900">{framework.name}</h3>
                        <p className="text-sm text-slate-500">
                          Last assessed: {new Date(framework.lastAssessed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(framework.status)
                    )}>
                      {framework.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Compliance Score</span>
                        <span className="font-medium">{framework.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all duration-500",
                            framework.score >= 90 ? "bg-green-500" :
                            framework.score >= 70 ? "bg-amber-500" : "bg-red-500"
                          )}
                          style={{ width: `${framework.score}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-6 text-right">
                      <div className="text-sm">
                        <span className="text-slate-600">Gaps: </span>
                        <span className="font-medium text-red-600">{framework.gaps}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {framework.requirements} requirements
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Changes */}
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
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {regulatoryChanges.map((change) => (
                <div
                  key={change.id}
                  className="group p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{change.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{change.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {change.source}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(change.effectiveDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium border ml-4",
                      getImpactColor(change.impact)
                    )}>
                      {change.impact} impact
                    </div>
                  </div>
                  
                  {change.affectedFrameworks.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-600">Affected:</span>
                        <div className="flex gap-1">
                          {change.affectedFrameworks.map((framework) => (
                            <span
                              key={framework}
                              className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
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

      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Zap className="h-5 w-5 text-amber-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <AccessibleButton
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-lg transition-all duration-200"
            >
              <Search className="h-8 w-8 text-blue-600" />
              <span className="font-medium">Scan New Regulations</span>
            </AccessibleButton>

            <AccessibleButton
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-lg transition-all duration-200"
            >
              <FileText className="h-8 w-8 text-green-600" />
              <span className="font-medium">Generate Report</span>
            </AccessibleButton>

            <AccessibleButton
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-lg transition-all duration-200"
            >
              <Users className="h-8 w-8 text-purple-600" />
              <span className="font-medium">Expert Consultation</span>
            </AccessibleButton>

            <AccessibleButton
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-lg transition-all duration-200"
            >
              <AlertTriangle className="h-8 w-8 text-amber-600" />
              <span className="font-medium">Gap Analysis</span>
            </AccessibleButton>
          </div>
        </CardContent>
      </Card>
        </>
      ) : (
        /* QIE Workflow View */
        <div className="space-y-6">
          {/* QIE Introduction Card */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Brain className="h-6 w-6 text-blue-600" />
                Questionnaire Intelligence Engine (QIE)
              </CardTitle>
              <CardDescription className="text-base">
                Transform security questionnaires from time-consuming blockers into automated accelerators. 
                Upload any questionnaire and get AI-powered assistance with evidence-backed answers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Upload className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Smart Upload</h3>
                    <p className="text-sm text-slate-600">PDF, Word, Excel support</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <Brain className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900">AI Analysis</h3>
                    <p className="text-sm text-slate-600">99% extraction accuracy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Auto Answers</h3>
                    <p className="text-sm text-slate-600">Evidence-backed responses</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QIE Workflow Component */}
          <QIEWorkflowComponent 
            onWorkflowComplete={(questionnaire) => {
              console.log('Questionnaire completed:', questionnaire)
              // Could show completion notification or redirect
            }}
          />
        </div>
      )}
    </div>
  );
};