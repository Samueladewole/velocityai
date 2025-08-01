import React, { useState, useEffect } from 'react';
import { ComponentPageTemplate, StatCard, TabConfiguration } from '@/components/templates/ComponentPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { 
  Brain,
  Bot,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Database,
  Eye,
  Download,
  Upload,
  Settings,
  Zap,
  Activity,
  BarChart3,
  Globe,
  Lock,
  FileCheck,
  Scan,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Calendar,
  Target,
  Cpu,
  Code,
  Award,
  Network,
  Building2,
  BookOpen,
  GraduationCap
} from 'lucide-react';

interface AISystem {
  id: string;
  name: string;
  type: 'llm' | 'ml' | 'computer_vision' | 'nlp' | 'recommendation' | 'automation';
  riskLevel: 'minimal' | 'limited' | 'high' | 'unacceptable';
  status: 'development' | 'testing' | 'production' | 'retired';
  owner: string;
  dataTypes: string[];
  complianceStatus: 'compliant' | 'non_compliant' | 'pending_review';
  lastAssessment: string;
  trustPoints: number;
}

interface ISO42001Control {
  id: string;
  category: string;
  name: string;
  description: string;
  status: 'implemented' | 'partial' | 'not_implemented' | 'not_applicable';
  evidence: string[];
  responsible: string;
  lastReview: string;
}

interface RiskAssessment {
  id: string;
  systemId: string;
  systemName: string;
  assessmentDate: string;
  assessor: string;
  riskLevel: 'minimal' | 'limited' | 'high' | 'unacceptable';
  mitigations: string[];
  status: 'draft' | 'review' | 'approved' | 'rejected';
  findings: number;
  addressed: number;
}

interface TrainingModule {
  id: string;
  title: string;
  category: 'ethics' | 'governance' | 'risk' | 'compliance' | 'technical';
  duration: string;
  completionRate: number;
  participants: number;
  status: 'active' | 'draft' | 'archived';
  certificationRequired: boolean;
}

export const AIGovernance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('iso42001');
  const [scanning, setScanning] = useState(false);
  
  // Sample data
  const aiSystems: AISystem[] = [
    {
      id: 'ai-1',
      name: 'Customer Service Chatbot',
      type: 'llm',
      riskLevel: 'limited',
      status: 'production',
      owner: 'Product Team',
      dataTypes: ['Customer Data', 'Communication Logs'],
      complianceStatus: 'compliant',
      lastAssessment: '2025-01-15',
      trustPoints: 150
    },
    {
      id: 'ai-2',
      name: 'Fraud Detection System',
      type: 'ml',
      riskLevel: 'high',
      status: 'production',
      owner: 'Security Team',
      dataTypes: ['Financial Data', 'Transaction History', 'Personal Data'],
      complianceStatus: 'compliant',
      lastAssessment: '2025-01-10',
      trustPoints: 300
    },
    {
      id: 'ai-3',
      name: 'Document Classification',
      type: 'nlp',
      riskLevel: 'limited',
      status: 'testing',
      owner: 'Data Team',
      dataTypes: ['Business Documents', 'Metadata'],
      complianceStatus: 'pending_review',
      lastAssessment: '2025-01-08',
      trustPoints: 75
    },
    {
      id: 'ai-4',
      name: 'Hiring Assistant',
      type: 'recommendation',
      riskLevel: 'high',
      status: 'development',
      owner: 'HR Team',
      dataTypes: ['Personal Data', 'CV Data', 'Performance Data'],
      complianceStatus: 'non_compliant',
      lastAssessment: '2023-12-20',
      trustPoints: 0
    }
  ];

  const iso42001Controls: ISO42001Control[] = [
    {
      id: 'iso-1',
      category: 'AI Management System',
      name: 'AI Policy and Objectives',
      description: 'Establish and maintain AI policy aligned with organizational objectives',
      status: 'implemented',
      evidence: ['AI Policy Document v2.1', 'Board Approval Minutes'],
      responsible: 'AI Governance Board',
      lastReview: '2025-01-15'
    },
    {
      id: 'iso-2',
      category: 'Risk Management',
      name: 'AI Risk Assessment Process',
      description: 'Systematic identification and assessment of AI-related risks',
      status: 'implemented',
      evidence: ['Risk Assessment Framework', 'Risk Register'],
      responsible: 'Chief Risk Officer',
      lastReview: '2025-01-10'
    },
    {
      id: 'iso-3',
      category: 'Data Governance',
      name: 'AI Data Management',
      description: 'Ensure quality, integrity and security of AI training data',
      status: 'partial',
      evidence: ['Data Quality Guidelines'],
      responsible: 'Data Protection Officer',
      lastReview: '2025-01-05'
    },
    {
      id: 'iso-4',
      category: 'Monitoring',
      name: 'AI Performance Monitoring',
      description: 'Continuous monitoring of AI system performance and impact',
      status: 'not_implemented',
      evidence: [],
      responsible: 'Technical Team',
      lastReview: '2023-12-15'
    }
  ];

  const riskAssessments: RiskAssessment[] = [
    {
      id: 'risk-1',
      systemId: 'ai-1',
      systemName: 'Customer Service Chatbot',
      assessmentDate: '2025-01-15',
      assessor: 'AI Ethics Team',
      riskLevel: 'limited',
      mitigations: ['Output filtering', 'Human oversight', 'Data minimization'],
      status: 'approved',
      findings: 5,
      addressed: 5
    },
    {
      id: 'risk-2',
      systemId: 'ai-2',
      systemName: 'Fraud Detection System',
      assessmentDate: '2025-01-10',
      assessor: 'Security Team',
      riskLevel: 'high',
      mitigations: ['Explainability features', 'Bias testing', 'Regular audits'],
      status: 'approved',
      findings: 8,
      addressed: 6
    },
    {
      id: 'risk-3',
      systemId: 'ai-4',
      systemName: 'Hiring Assistant',
      assessmentDate: '2023-12-20',
      assessor: 'HR Ethics Board',
      riskLevel: 'high',
      mitigations: ['Bias detection', 'Human review', 'Fairness testing'],
      status: 'review',
      findings: 12,
      addressed: 3
    }
  ];

  const trainingModules: TrainingModule[] = [
    {
      id: 'train-1',
      title: 'AI Ethics Fundamentals',
      category: 'ethics',
      duration: '2 hours',
      completionRate: 78,
      participants: 145,
      status: 'active',
      certificationRequired: true
    },
    {
      id: 'train-2',
      title: 'ISO 42001 Compliance',
      category: 'compliance',
      duration: '1.5 hours',
      completionRate: 65,
      participants: 89,
      status: 'active',
      certificationRequired: true
    },
    {
      id: 'train-3',
      title: 'AI Risk Assessment',
      category: 'risk',
      duration: '3 hours',
      completionRate: 45,
      participants: 52,
      status: 'active',
      certificationRequired: false
    },
    {
      id: 'train-4',
      title: 'Responsible AI Development',
      category: 'technical',
      duration: '4 hours',
      completionRate: 32,
      participants: 78,
      status: 'draft',
      certificationRequired: true
    }
  ];

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 3000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'unacceptable':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'limited':
        return 'text-yellow-600 bg-yellow-50';
      case 'minimal':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
      case 'compliant':
      case 'approved':
      case 'production':
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'partial':
      case 'pending_review':
      case 'review':
      case 'testing':
        return 'text-yellow-600 bg-yellow-50';
      case 'not_implemented':
      case 'non_compliant':
      case 'rejected':
      case 'development':
      case 'draft':
        return 'text-red-600 bg-red-50';
      case 'retired':
      case 'archived':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Quick stats calculations
  const totalSystems = aiSystems.length;
  const compliantSystems = aiSystems.filter(sys => sys.complianceStatus === 'compliant').length;
  const highRiskSystems = aiSystems.filter(sys => sys.riskLevel === 'high' || sys.riskLevel === 'unacceptable').length;
  const implementedControls = iso42001Controls.filter(ctrl => ctrl.status === 'implemented').length;
  const totalTrustPoints = aiSystems.reduce((sum, sys) => sum + sys.trustPoints, 0);
  const avgTrainingCompletion = Math.round(trainingModules.reduce((sum, mod) => sum + mod.completionRate, 0) / trainingModules.length);

  const quickStats: StatCard[] = [
    {
      label: 'AI Systems',
      value: totalSystems,
      change: `+€{compliantSystems}`,
      trend: 'up',
      icon: <Bot className="h-6 w-6 text-blue-600" />,
      description: `€{compliantSystems} compliant`,
      color: 'text-blue-600'
    },
    {
      label: 'ISO 42001 Controls',
      value: `€{implementedControls}/€{iso42001Controls.length}`,
      change: '+2',
      trend: 'up',
      icon: <Shield className="h-6 w-6 text-green-600" />,
      description: 'Controls implemented',
      color: 'text-green-600'
    },
    {
      label: 'High Risk Systems',
      value: highRiskSystems,
      change: '-1',
      trend: 'up',
      icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
      description: 'Require attention',
      color: 'text-orange-600'
    },
    {
      label: 'Training Completion',
      value: `€{avgTrainingCompletion}%`,
      change: '+12%',
      trend: 'up',
      icon: <GraduationCap className="h-6 w-6 text-purple-600" />,
      description: 'Average completion rate',
      color: 'text-purple-600'
    }
  ];

  // Tab configurations
  const tabs: TabConfiguration[] = [
    {
      id: 'iso42001',
      label: 'ISO 42001 Compliance',
      badge: `€{implementedControls}/€{iso42001Controls.length}`,
      content: (
        <div className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                ISO 42001 AI Management System Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {iso42001Controls.map((control) => (
                  <Card key={control.id} className="border-slate-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {control.category}
                            </Badge>
                            <h4 className="font-medium">{control.name}</h4>
                          </div>
                          <p className="text-sm text-slate-600">{control.description}</p>
                        </div>
                        <Badge className={getStatusColor(control.status)}>
                          {control.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h5 className="font-medium text-sm text-slate-600 mb-2">Evidence</h5>
                          <div className="space-y-1">
                            {control.evidence.length > 0 ? (
                              control.evidence.map((evidence, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs block w-fit">
                                  {evidence}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">No evidence provided</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-sm text-slate-600 mb-2">Responsible</h5>
                          <p className="text-sm">{control.responsible}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-sm text-slate-600 mb-2">Last Review</h5>
                          <p className="text-sm">{control.lastReview}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-slate-100">
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Update
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Evidence
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert className="mt-6">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {implementedControls} of {iso42001Controls.length} ISO 42001 controls implemented. 
                  System achieving {Math.round((implementedControls / iso42001Controls.length) * 100)}% compliance.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'registry',
      label: 'AI System Registry',
      badge: totalSystems,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">AI System Registry</h3>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Register AI System
            </Button>
          </div>

          <div className="grid gap-4">
            {aiSystems.map((system) => (
              <Card key={system.id} className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{system.name}</h4>
                          <p className="text-sm text-slate-500">Type: {system.type.toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge className={getRiskColor(system.riskLevel)}>
                        {system.riskLevel} risk
                      </Badge>
                      <Badge className={getStatusColor(system.status)}>
                        {system.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-slate-600">Owner:</span>
                      <div className="font-medium">{system.owner}</div>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">Compliance:</span>
                      <Badge className={getStatusColor(system.complianceStatus)}>
                        {system.complianceStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">Last Assessment:</span>
                      <div className="font-medium">{system.lastAssessment}</div>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">Trust Points:</span>
                      <div className="font-medium text-blue-600">{system.trustPoints}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium text-sm text-slate-600 mb-2">Data Types</h5>
                    <div className="flex flex-wrap gap-1">
                      {system.dataTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Scan className="h-4 w-4 mr-2" />
                      Risk Assessment
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'risk',
      label: 'Risk Assessments',
      badge: riskAssessments.length,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">AI Risk Assessments</h3>
            <Button className="bg-gradient-to-r from-orange-600 to-red-600">
              <Plus className="h-4 w-4 mr-2" />
              New Assessment
            </Button>
          </div>

          <div className="grid gap-4">
            {riskAssessments.map((assessment) => (
              <Card key={assessment.id} className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{assessment.systemName}</h4>
                      <p className="text-sm text-slate-500">
                        Assessed by {assessment.assessor} on {assessment.assessmentDate}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getRiskColor(assessment.riskLevel)}>
                        {assessment.riskLevel} risk
                      </Badge>
                      <Badge className={getStatusColor(assessment.status)}>
                        {assessment.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-slate-600">Findings:</span>
                      <div className="font-medium">{assessment.findings}</div>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">Addressed:</span>
                      <div className="font-medium">{assessment.addressed}/{assessment.findings}</div>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">Progress:</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(assessment.addressed / assessment.findings) * 100} 
                          className="h-2 flex-1"
                        />
                        <span className="text-sm">
                          {Math.round((assessment.addressed / assessment.findings) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium text-sm text-slate-600 mb-2">Mitigations</h5>
                    <div className="flex flex-wrap gap-1">
                      {assessment.mitigations.map((mitigation, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {mitigation}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {highRiskSystems} AI systems classified as high risk. Regular assessments required per ISO 42001.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      id: 'training',
      label: 'Responsible AI Training',
      badge: `€{avgTrainingCompletion}%`,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Responsible AI Training Modules</h3>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Module
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingModules.map((module) => (
              <Card key={module.id} className="card-professional">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{module.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {module.category}
                        </Badge>
                        <span className="text-sm text-slate-500">{module.duration}</span>
                        {module.certificationRequired && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            Certification Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(module.status)}>
                      {module.status}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Completion Rate</span>
                        <span className="font-medium">{module.completionRate}%</span>
                      </div>
                      <Progress value={module.completionRate} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Participants:</span>
                      <span className="font-medium">{module.participants}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100">
                    <Button variant="outline" size="sm" className="flex-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Content
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <GraduationCap className="h-4 w-4" />
            <AlertDescription>
              AI training completion rate: {avgTrainingCompletion}%. 
              Ongoing education ensures responsible AI development and deployment.
            </AlertDescription>
          </Alert>
        </div>
      )
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" onClick={startScan} disabled={scanning}>
        {scanning ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Scan className="h-4 w-4 mr-2" />
            AI Audit
          </>
        )}
      </Button>
      <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
        <Download className="h-4 w-4 mr-2" />
        Export AI Report
      </Button>
    </>
  );

  return (
    <ComponentPageTemplate
      title="AI Governance Module"
      subtitle="Comprehensive AI Management & ISO 42001 Compliance"
      description="Advanced AI governance framework with system registry, risk assessments, ISO 42001 compliance tracking, and responsible AI training programs."
      trustScore={Math.round((implementedControls / iso42001Controls.length) * 100)}
      trustPoints={totalTrustPoints}
      quickStats={quickStats}
      tabs={tabs}
      actions={headerActions}
      headerGradient="from-blue-50 to-purple-50"
      className="card-professional"
    />
  );
};