import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Car,
  Lock,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Calendar,
  Zap,
  Users,
  Target,
  Award,
  Settings,
  Download,
  Brain,
  Sparkles,
  Building2,
  Heart,
  FileText,
  ChevronRight,
  Clock,
  BarChart3,
  Activity
} from 'lucide-react';

interface CertificationFramework {
  id: string;
  name: string;
  fullName: string;
  icon: React.ElementType;
  industry: string;
  description: string;
  trustEquityBoost: number;
  automationLevel: number;
  typicalDuration: string;
  renewalPeriod: string;
}

interface ControlAssessment {
  id: string;
  name: string;
  category: string;
  status: 'not_implemented' | 'partially_implemented' | 'fully_implemented';
  automationAvailable: boolean;
  trustImpact: number;
  evidence: string[];
}

interface CertificationPhase {
  id: number;
  name: string;
  duration: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progress: number;
  keyDeliverables: string[];
}

export const IndustryCertifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCertification, setSelectedCertification] = useState<string>('TISAX');
  const [assessmentMode, setAssessmentMode] = useState<'quick' | 'detailed'>('quick');

  // Certification frameworks
  const certifications: CertificationFramework[] = [
    {
      id: 'TISAX',
      name: 'TISAX',
      fullName: 'Trusted Information Security Assessment Exchange',
      icon: Car,
      industry: 'Automotive',
      description: 'Mandatory for automotive industry suppliers, covering information security, prototype protection, and data privacy',
      trustEquityBoost: 15,
      automationLevel: 75,
      typicalDuration: '6-9 months',
      renewalPeriod: '3 years'
    },
    {
      id: 'ISO27701',
      name: 'ISO 27701',
      fullName: 'Privacy Information Management System',
      icon: Lock,
      industry: 'All Industries',
      description: 'Extension to ISO 27001 for privacy management, aligning with GDPR and global privacy regulations',
      trustEquityBoost: 12,
      automationLevel: 85,
      typicalDuration: '4-6 months',
      renewalPeriod: '3 years'
    },
    {
      id: 'SOC2',
      name: 'SOC 2',
      fullName: 'Service Organization Control 2',
      icon: Shield,
      industry: 'Technology/SaaS',
      description: 'Trust services criteria for service organizations, focusing on security, availability, and confidentiality',
      trustEquityBoost: 10,
      automationLevel: 80,
      typicalDuration: '6-12 months',
      renewalPeriod: 'Annual'
    },
    {
      id: 'HIPAA',
      name: 'HIPAA',
      fullName: 'Health Insurance Portability and Accountability Act',
      icon: Heart,
      industry: 'Healthcare',
      description: 'US healthcare data protection requirements for covered entities and business associates',
      trustEquityBoost: 11,
      automationLevel: 70,
      typicalDuration: '3-6 months',
      renewalPeriod: 'Ongoing'
    }
  ];

  // Sample TISAX assessment data
  const tisaxAssessment = {
    overallScore: 78,
    trustEquityScore: 85,
    domains: [
      {
        name: 'Information Security',
        score: 82,
        weight: 40,
        controls: [
          {
            id: 'IS.1.1',
            name: 'Information Security Policies',
            category: 'Governance',
            status: 'fully_implemented' as const,
            automationAvailable: true,
            trustImpact: 8,
            evidence: ['Policy documents', 'Approval records']
          },
          {
            id: 'IS.1.2',
            name: 'Risk Management',
            category: 'Risk',
            status: 'partially_implemented' as const,
            automationAvailable: true,
            trustImpact: 9,
            evidence: ['Risk register', 'Risk assessments']
          },
          {
            id: 'IS.2.1',
            name: 'Access Control',
            category: 'Technical',
            status: 'fully_implemented' as const,
            automationAvailable: true,
            trustImpact: 9,
            evidence: ['Access control matrix', 'User provisioning logs']
          }
        ]
      },
      {
        name: 'Prototype Protection',
        score: 72,
        weight: 30,
        controls: [
          {
            id: 'PP.1.1',
            name: 'Prototype Handling',
            category: 'Physical',
            status: 'partially_implemented' as const,
            automationAvailable: false,
            trustImpact: 7,
            evidence: ['Handling procedures']
          },
          {
            id: 'PP.2.1',
            name: 'Prototype Disposal',
            category: 'Physical',
            status: 'not_implemented' as const,
            automationAvailable: false,
            trustImpact: 6,
            evidence: []
          }
        ]
      },
      {
        name: 'Data Protection',
        score: 76,
        weight: 30,
        controls: [
          {
            id: 'DP.1.1',
            name: 'Data Classification',
            category: 'Data',
            status: 'fully_implemented' as const,
            automationAvailable: true,
            trustImpact: 8,
            evidence: ['Classification scheme', 'Labeling examples']
          },
          {
            id: 'DP.2.1',
            name: 'Data Privacy',
            category: 'Privacy',
            status: 'partially_implemented' as const,
            automationAvailable: true,
            trustImpact: 9,
            evidence: ['Privacy policies', 'Consent mechanisms']
          }
        ]
      }
    ]
  };

  // Certification roadmap phases
  const certificationPhases: CertificationPhase[] = [
    {
      id: 1,
      name: 'Foundation & Governance',
      duration: '6 weeks',
      status: 'completed',
      progress: 100,
      keyDeliverables: [
        'Certification governance structure',
        'Policy framework established',
        'Initial risk assessment completed'
      ]
    },
    {
      id: 2,
      name: 'Technical Implementation',
      duration: '8 weeks',
      status: 'in_progress',
      progress: 65,
      keyDeliverables: [
        'Technical controls deployment',
        'Automation tools configured',
        'Security measures implemented'
      ]
    },
    {
      id: 3,
      name: 'Process & Training',
      duration: '4 weeks',
      status: 'upcoming',
      progress: 0,
      keyDeliverables: [
        'Operational procedures documented',
        'Staff training completed',
        'Process validation'
      ]
    },
    {
      id: 4,
      name: 'Assessment & Certification',
      duration: '4 weeks',
      status: 'upcoming',
      progress: 0,
      keyDeliverables: [
        'Internal assessment',
        'Gap remediation',
        'External audit',
        'Certification achievement'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fully_implemented':
        return 'text-green-600 bg-green-50';
      case 'partially_implemented':
        return 'text-yellow-600 bg-yellow-50';
      case 'not_implemented':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const calculateAutomationSavings = (certification: CertificationFramework) => {
    const baseDays = parseInt(certification.typicalDuration.split('-')[1]);
    const savingsDays = Math.round(baseDays * 30 * (certification.automationLevel / 100) * 0.4);
    return savingsDays;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Industry-Specific Certifications
            </h1>
            <p className="text-slate-600">
              Achieve industry compliance with automated certification management and Trust Equity™ integration
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
            <Award className="h-4 w-4 mr-2" />
            Start Certification
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Certifications</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-xs text-slate-500 mt-2">
                TISAX, ISO 27001, SOC 2
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Trust Equity Boost</p>
                  <p className="text-2xl font-bold">+37%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-xs text-slate-500 mt-2">
                From certifications
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Automation Level</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <Progress value={78} className="mt-2 h-1" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Time Saved</p>
                  <p className="text-2xl font-bold">147 days</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Through automation
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Certification Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert) => {
                const IconComponent = cert.icon;
                return (
                  <Card key={cert.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedCertification(cert.id)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                            cert.id === 'TISAX' ? 'from-blue-500 to-indigo-600' :
                            cert.id === 'ISO27701' ? 'from-purple-500 to-violet-600' :
                            cert.id === 'SOC2' ? 'from-green-500 to-emerald-600' :
                            'from-orange-500 to-red-600'
                          } text-white`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{cert.name}</CardTitle>
                            <p className="text-sm text-slate-600">{cert.fullName}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{cert.industry}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">{cert.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-600">Trust Equity™ Boost</p>
                          <p className="text-lg font-bold text-blue-600">+{cert.trustEquityBoost}%</p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-600">Automation</p>
                          <p className="text-lg font-bold">{cert.automationLevel}%</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Duration: {cert.typicalDuration}</span>
                        <span className="text-slate-600">Renewal: {cert.renewalPeriod}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Trust Equity Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Trust Equity™ Certification Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      Industry certifications directly enhance your Trust Equity™ score through 
                      validated compliance, automated controls, and continuous monitoring.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <h4 className="font-medium mb-2">Base Trust Score</h4>
                      <div className="text-2xl font-bold text-blue-600">72%</div>
                      <p className="text-sm text-slate-600 mt-1">Before certifications</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                      <h4 className="font-medium mb-2">Certification Boost</h4>
                      <div className="text-2xl font-bold text-green-600">+37%</div>
                      <p className="text-sm text-slate-600 mt-1">From 3 certifications</p>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                      <h4 className="font-medium mb-2">Current Trust Score</h4>
                      <div className="text-2xl font-bold text-purple-600">91%</div>
                      <p className="text-sm text-slate-600 mt-1">Industry leader level</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <div className="space-y-6">
            {selectedCertification === 'TISAX' && (
              <>
                {/* TISAX Assessment Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-blue-600" />
                        TISAX Assessment Status
                      </CardTitle>
                      <Badge className="bg-blue-100 text-blue-700">Assessment Level 2</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-4">Overall Compliance</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">TISAX Score</span>
                            <span className="font-bold">{tisaxAssessment.overallScore}%</span>
                          </div>
                          <Progress value={tisaxAssessment.overallScore} className="h-2" />
                          
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-sm">Trust Equity™ Score</span>
                            <span className="font-bold text-blue-600">{tisaxAssessment.trustEquityScore}%</span>
                          </div>
                          <Progress value={tisaxAssessment.trustEquityScore} className="h-2" />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-4">Domain Scores</h4>
                        <div className="space-y-2">
                          {tisaxAssessment.domains.map((domain) => (
                            <div key={domain.name} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                              <span className="text-sm">{domain.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{domain.score}%</span>
                                <Progress value={domain.score} className="w-20 h-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* TISAX Controls Detail */}
                <Card>
                  <CardHeader>
                    <CardTitle>TISAX Control Implementation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue={tisaxAssessment.domains[0].name}>
                      <TabsList className="grid grid-cols-3 w-full mb-4">
                        {tisaxAssessment.domains.map((domain) => (
                          <TabsTrigger key={domain.name} value={domain.name}>
                            {domain.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {tisaxAssessment.domains.map((domain) => (
                        <TabsContent key={domain.name} value={domain.name}>
                          <div className="space-y-3">
                            {domain.controls.map((control) => (
                              <div key={control.id} className="p-4 border border-slate-200 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h5 className="font-medium">{control.name}</h5>
                                    <p className="text-sm text-slate-600">Control ID: {control.id}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(control.status)}>
                                      {control.status.replace('_', ' ')}
                                    </Badge>
                                    {control.automationAvailable && (
                                      <Badge variant="outline" className="text-purple-600">
                                        <Zap className="h-3 w-3 mr-1" />
                                        Automated
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center gap-4 text-sm text-slate-600">
                                    <span>Category: {control.category}</span>
                                    <span>Trust Impact: {control.trustImpact}/10</span>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    <FileCheck className="h-4 w-4 mr-1" />
                                    Evidence
                                  </Button>
                                </div>

                                {control.evidence.length > 0 && (
                                  <div className="mt-3 p-3 bg-slate-50 rounded">
                                    <p className="text-xs font-medium text-slate-700 mb-1">Evidence Collected:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {control.evidence.map((ev, idx) => (
                                        <span key={idx} className="text-xs px-2 py-1 bg-white rounded border border-slate-200">
                                          {ev}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        {/* Assessment Tab */}
        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle>Certification Readiness Assessment</CardTitle>
              <p className="text-sm text-slate-600">
                AI-powered assessment for certification readiness
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Assessment Mode Selection */}
                <div className="flex items-center justify-center p-1 bg-slate-100 rounded-lg">
                  <Button
                    variant={assessmentMode === 'quick' ? 'default' : 'ghost'}
                    onClick={() => setAssessmentMode('quick')}
                    className="flex-1"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Quick Assessment (5 min)
                  </Button>
                  <Button
                    variant={assessmentMode === 'detailed' ? 'default' : 'ghost'}
                    onClick={() => setAssessmentMode('detailed')}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Detailed Analysis (2 hours)
                  </Button>
                </div>

                {assessmentMode === 'quick' ? (
                  <div className="space-y-4">
                    <Alert>
                      <Brain className="h-4 w-4" />
                      <AlertDescription>
                        Our AI will analyze your current security posture and provide instant 
                        recommendations for certification readiness across all frameworks.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certifications.map((cert) => {
                        const IconComponent = cert.icon;
                        return (
                          <div key={cert.id} className="p-4 border border-slate-200 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <IconComponent className="h-5 w-5 text-slate-600" />
                              <h4 className="font-medium">{cert.name} Assessment</h4>
                            </div>
                            <Button variant="outline" className="w-full">
                              Start {cert.name} Assessment
                            </Button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-center pt-4">
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        <Brain className="h-5 w-5 mr-2" />
                        Run All Assessments
                      </Button>
                      <p className="text-sm text-slate-600 mt-2">
                        Analyze readiness for all 4 certifications simultaneously
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        Comprehensive assessment including document review, technical scanning, 
                        and stakeholder interviews for thorough certification preparation.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-slate-200 rounded-lg">
                        <h4 className="font-medium mb-2">Document Analysis</h4>
                        <p className="text-sm text-slate-600 mb-3">
                          AI review of policies, procedures, and evidence
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Upload Documents
                        </Button>
                      </div>

                      <div className="p-4 border border-slate-200 rounded-lg">
                        <h4 className="font-medium mb-2">Technical Scanning</h4>
                        <p className="text-sm text-slate-600 mb-3">
                          Automated security and compliance scanning
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Configure Scans
                        </Button>
                      </div>

                      <div className="p-4 border border-slate-200 rounded-lg">
                        <h4 className="font-medium mb-2">Control Mapping</h4>
                        <p className="text-sm text-slate-600 mb-3">
                          Map existing controls to certification requirements
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Start Mapping
                        </Button>
                      </div>

                      <div className="p-4 border border-slate-200 rounded-lg">
                        <h4 className="font-medium mb-2">Gap Analysis</h4>
                        <p className="text-sm text-slate-600 mb-3">
                          Identify and prioritize implementation gaps
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Run Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roadmap Tab */}
        <TabsContent value="roadmap">
          <Card>
            <CardHeader>
              <CardTitle>Certification Roadmap</CardTitle>
              <p className="text-sm text-slate-600">
                Your path to achieving industry certifications
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Timeline */}
                <div className="relative">
                  <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-200" />
                  
                  <div className="space-y-8">
                    {certificationPhases.map((phase, index) => (
                      <div key={phase.id} className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 ${
                          phase.status === 'completed' ? 'bg-green-100' :
                          phase.status === 'in_progress' ? 'bg-blue-100' :
                          'bg-slate-100'
                        }`}>
                          {phase.status === 'completed' ? (
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          ) : phase.status === 'in_progress' ? (
                            <Activity className="h-8 w-8 text-blue-600" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-300" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Phase {phase.id}: {phase.name}</h4>
                            <Badge variant={
                              phase.status === 'completed' ? 'default' :
                              phase.status === 'in_progress' ? 'secondary' :
                              'outline'
                            }>
                              {phase.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-2">Duration: {phase.duration}</p>
                          
                          {phase.status !== 'upcoming' && (
                            <Progress value={phase.progress} className="h-2 mb-3" />
                          )}
                          
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-700">Key Deliverables:</p>
                            {phase.keyDeliverables.map((deliverable, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle className={`h-3 w-3 ${
                                  phase.status === 'completed' ? 'text-green-500' : 'text-slate-400'
                                }`} />
                                {deliverable}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <h4 className="font-medium mb-4">Immediate Next Steps</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h5 className="font-medium">Complete Technical Controls</h5>
                        <p className="text-sm text-slate-600">Deploy remaining access control measures</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h5 className="font-medium">Automate Evidence Collection</h5>
                        <p className="text-sm text-slate-600">Enable continuous compliance monitoring</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Certification Automation Platform</CardTitle>
                <p className="text-sm text-slate-600">
                  Reduce certification effort by up to 70% with intelligent automation
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <Zap className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h4 className="font-medium mb-2">Evidence Collection</h4>
                    <div className="text-3xl font-bold text-green-600 mb-1">87%</div>
                    <p className="text-sm text-slate-600">Automated</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <Brain className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-medium mb-2">Control Testing</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-1">92%</div>
                    <p className="text-sm text-slate-600">AI-Powered</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                    <Activity className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-medium mb-2">Continuous Monitoring</h4>
                    <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
                    <p className="text-sm text-slate-600">Real-time</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Automation Capabilities</h4>
                  
                  {certifications.map((cert) => {
                    const savings = calculateAutomationSavings(cert);
                    return (
                      <div key={cert.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <cert.icon className="h-5 w-5 text-slate-600" />
                            <h5 className="font-medium">{cert.name} Automation</h5>
                          </div>
                          <Badge variant="outline">
                            {cert.automationLevel}% Automated
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Time Savings</p>
                            <p className="font-medium">{savings} days</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Cost Reduction</p>
                            <p className="font-medium">${(savings * 1200).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Accuracy</p>
                            <p className="font-medium">99.5%</p>
                          </div>
                        </div>
                        
                        <Progress value={cert.automationLevel} className="mt-3 h-1" />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium mb-1">Enable Full Automation Suite</h4>
                      <p className="text-sm text-blue-100">
                        Activate AI-powered certification management across all frameworks
                      </p>
                    </div>
                    <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Activate Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};