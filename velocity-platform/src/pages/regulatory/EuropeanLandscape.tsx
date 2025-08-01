import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
  Globe,
  Scale,
  Brain,
  Zap,
  CheckCircle,
  Clock,
  ArrowRight,
  Info,
  Target,
  Users,
  Building,
  Factory,
  Heart,
  Laptop,
  Landmark
} from 'lucide-react';

interface EURegulation {
  id: string;
  name: string;
  fullName: string;
  status: 'active' | 'upcoming' | 'draft';
  applicableDate: string;
  description: string;
  scope: string[];
  industries: string[];
  keyRequirements: string[];
  penalties: string;
  preparationTime: string;
  complexityLevel: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

interface IndustryMapping {
  industry: string;
  icon: React.ReactNode;
  applicableRegulations: string[];
  riskProfile: 'low' | 'medium' | 'high';
  primaryConcerns: string[];
  recommendedActions: string[];
}

const euRegulations: EURegulation[] = [
  {
    id: 'eidas',
    name: 'eIDAS',
    fullName: 'Electronic Identification, Authentication and Trust Services Regulation',
    status: 'active',
    applicableDate: '2016-07-01',
    description: 'Framework for electronic identification and trust services for electronic transactions in the EU',
    scope: ['Electronic identification schemes', 'Trust service providers', 'Cross-border authentication'],
    industries: ['Financial Services', 'Government', 'Healthcare', 'Technology', 'Authentication Services'],
    keyRequirements: [
      'Mutual recognition of electronic IDs across EU',
      'Qualified trust service provider certification',
      'Electronic signatures and seals compliance',
      'Time-stamping and website authentication',
      'Cross-border interoperability',
      'Security and liability frameworks'
    ],
    penalties: 'National penalties vary by member state',
    preparationTime: '6-12 months',
    complexityLevel: 'high',
    impact: 'high'
  },
  {
    id: 'psd2',
    name: 'PSD2',
    fullName: 'Payment Services Directive 2',
    status: 'active',
    applicableDate: '2018-01-13',
    description: 'Regulation for payment services and payment service providers throughout the EU',
    scope: ['Payment service providers', 'Account servicing providers', 'Third-party providers'],
    industries: ['Financial Services', 'Banking', 'Fintech', 'Payment Processors'],
    keyRequirements: [
      'Strong customer authentication (SCA)',
      'Open banking API requirements',
      'Incident reporting to authorities',
      'Operational and security risk management',
      'Customer authentication for online payments',
      'Access to account (XS2A) provisions'
    ],
    penalties: 'Up to €5M or 10% of annual turnover',
    preparationTime: '6-12 months',
    complexityLevel: 'high',
    impact: 'high'
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    fullName: 'General Data Protection Regulation',
    status: 'active',
    applicableDate: '2018-05-25',
    description: 'Comprehensive data protection law governing personal data processing in the EU',
    scope: ['All EU residents', 'Global companies processing EU data'],
    industries: ['All industries'],
    keyRequirements: [
      'Lawful basis for processing',
      'Data subject rights (access, erasure, portability)',
      'Privacy by design and default',
      'Data protection impact assessments',
      'Breach notification (72 hours)',
      'Data protection officer appointment'
    ],
    penalties: 'Up to €20M or 4% of global turnover',
    preparationTime: '6-12 months',
    complexityLevel: 'high',
    impact: 'high'
  },
  {
    id: 'ai-act',
    name: 'AI Act',
    fullName: 'Artificial Intelligence Act',
    status: 'upcoming',
    applicableDate: '2025-08-01',
    description: 'First comprehensive AI regulation globally, establishing risk-based approach to AI governance',
    scope: ['AI systems placed on EU market', 'AI outputs used in EU'],
    industries: ['Technology', 'Healthcare', 'Financial', 'Manufacturing', 'Government'],
    keyRequirements: [
      'Risk classification (minimal, limited, high, unacceptable)',
      'Conformity assessments for high-risk AI',
      'Human oversight and transparency',
      'Data governance and management systems',
      'Record-keeping and documentation',
      'Post-market monitoring'
    ],
    penalties: 'Up to €35M or 7% of global turnover',
    preparationTime: '12-18 months',
    complexityLevel: 'high',
    impact: 'high'
  },
  {
    id: 'nis2',
    name: 'NIS2',
    fullName: 'Network and Information Systems Directive 2',
    status: 'active',
    applicableDate: '2025-10-17',
    description: 'Enhanced cybersecurity requirements for critical infrastructure and digital services',
    scope: ['Essential services', 'Important services', 'Digital service providers'],
    industries: ['Energy', 'Transport', 'Banking', 'Healthcare', 'Government', 'Technology'],
    keyRequirements: [
      'Cybersecurity risk management',
      'Incident reporting (24 hours)',
      'Business continuity and crisis management',
      'Supply chain security',
      'Vulnerability disclosure',
      'CEO/board accountability'
    ],
    penalties: 'Up to €10M or 2% of global turnover',
    preparationTime: '6-12 months',
    complexityLevel: 'high',
    impact: 'high'
  },
  {
    id: 'dora',
    name: 'DORA',
    fullName: 'Digital Operational Resilience Act',
    status: 'upcoming',
    applicableDate: '2025-01-17',
    description: 'Operational resilience requirements for financial services sector',
    scope: ['Financial entities', 'ICT third-party service providers'],
    industries: ['Financial Services', 'Banking', 'Insurance', 'Investment'],
    keyRequirements: [
      'ICT risk management framework',
      'Incident reporting and management',
      'Digital operational resilience testing',
      'Third-party risk management',
      'Information sharing arrangements'
    ],
    penalties: 'National penalties up to €5M',
    preparationTime: '12-18 months',
    complexityLevel: 'high',
    impact: 'high'
  },
  {
    id: 'dma',
    name: 'DMA',
    fullName: 'Digital Markets Act',
    status: 'active',
    applicableDate: '2025-03-06',
    description: 'Regulation targeting large digital platforms ("gatekeepers")',
    scope: ['Large digital platforms with significant market power'],
    industries: ['Technology', 'Digital Platforms', 'Social Media'],
    keyRequirements: [
      'Gatekeeper designation criteria',
      'Interoperability obligations',
      'Data portability requirements',
      'Transparency in ranking algorithms',
      'Prohibition of self-preferencing'
    ],
    penalties: 'Up to 10% of global turnover',
    preparationTime: '6-12 months',
    complexityLevel: 'medium',
    impact: 'high'
  },
  {
    id: 'dsa',
    name: 'DSA',
    fullName: 'Digital Services Act',
    status: 'active',
    applicableDate: '2025-02-17',
    description: 'Content moderation and platform accountability requirements',
    scope: ['Online platforms', 'Very large online platforms (VLOPs)'],
    industries: ['Technology', 'Social Media', 'E-commerce', 'Digital Platforms'],
    keyRequirements: [
      'Content moderation systems',
      'Transparency reporting',
      'Risk assessment for systemic risks',
      'External auditing (VLOPs)',
      'Illegal content removal procedures'
    ],
    penalties: 'Up to 6% of global turnover',
    preparationTime: '6-12 months',
    complexityLevel: 'medium',
    impact: 'medium'
  }
];

const industryMappings: IndustryMapping[] = [
  {
    industry: 'Financial Services',
    icon: <Landmark className="h-6 w-6" />,
    applicableRegulations: ['gdpr', 'dora', 'nis2', 'ai-act'],
    riskProfile: 'high',
    primaryConcerns: [
      'Digital operational resilience (DORA)',
      'AI governance for trading algorithms',
      'Customer data protection (GDPR)',
      'Cybersecurity requirements (NIS2)'
    ],
    recommendedActions: [
      'Implement DORA-compliant ICT risk framework',
      'Assess AI systems for high-risk classification',
      'Enhance incident response capabilities',
      'Review third-party service provider contracts'
    ]
  },
  {
    industry: 'Technology',
    icon: <Laptop className="h-6 w-6" />,
    applicableRegulations: ['gdpr', 'ai-act', 'dma', 'dsa', 'nis2'],
    riskProfile: 'high',
    primaryConcerns: [
      'AI Act compliance for AI products',
      'Platform regulation (DMA/DSA)',
      'Data protection across services',
      'Cybersecurity for digital services'
    ],
    recommendedActions: [
      'Conduct AI risk assessments',
      'Implement privacy by design',
      'Develop content moderation systems',
      'Assess gatekeeper designation risk'
    ]
  },
  {
    industry: 'Healthcare',
    icon: <Heart className="h-6 w-6" />,
    applicableRegulations: ['gdpr', 'ai-act', 'nis2'],
    riskProfile: 'high',
    primaryConcerns: [
      'Patient data protection (GDPR)',
      'Medical AI systems (AI Act)',
      'Healthcare infrastructure security (NIS2)',
      'Cross-border data transfers'
    ],
    recommendedActions: [
      'Implement GDPR-compliant health data processing',
      'Assess medical AI for high-risk classification',
      'Enhance cybersecurity for critical systems',
      'Establish patient consent mechanisms'
    ]
  },
  {
    industry: 'Manufacturing',
    icon: <Factory className="h-6 w-6" />,
    applicableRegulations: ['gdpr', 'ai-act', 'nis2'],
    riskProfile: 'medium',
    primaryConcerns: [
      'Industrial AI systems (AI Act)',
      'Worker data protection (GDPR)',
      'Supply chain cybersecurity (NIS2)',
      'IoT device security'
    ],
    recommendedActions: [
      'Evaluate AI in production systems',
      'Implement employee privacy measures',
      'Secure industrial control systems',
      'Assess supply chain risks'
    ]
  }
];

export const EuropeanLandscape: React.FC = () => {
  const [selectedRegulation, setSelectedRegulation] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [view, setView] = useState<'overview' | 'regulations' | 'industries'>('overview');
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700 border-green-200',
      upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
      draft: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status as keyof typeof colors];
  };

  const getComplexityBadge = (level: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    return colors[level as keyof typeof colors];
  };

  const getImpactBadge = (level: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-700',
      medium: 'bg-purple-100 text-purple-700',
      high: 'bg-red-100 text-red-700'
    };
    return colors[level as keyof typeof colors];
  };

  const getRiskBadge = (level: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    return colors[level as keyof typeof colors];
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-xl">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">European Union</h1>
            <p className="text-xl text-slate-600">Regulatory Landscape</p>
          </div>
        </div>
        <p className="text-lg text-slate-600 max-w-4xl mx-auto">
          Navigate the complex EU regulatory environment with comprehensive guidance on GDPR, AI Act, 
          NIS2, DORA, and other critical regulations affecting your business operations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{euRegulations.length}</div>
              <div className="text-sm text-slate-600">Active Regulations</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {euRegulations.filter(r => r.status === 'upcoming').length}
              </div>
              <div className="text-sm text-slate-600">Upcoming Changes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {euRegulations.filter(r => r.impact === 'high').length}
              </div>
              <div className="text-sm text-slate-600">High Impact</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">€35M</div>
              <div className="text-sm text-slate-600">Max Penalties</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Changes Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Recent & Upcoming Changes
          </CardTitle>
          <CardDescription>
            Key regulatory milestones and implementation dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {euRegulations
              .sort((a, b) => new Date(b.applicableDate).getTime() - new Date(a.applicableDate).getTime())
              .slice(0, 4)
              .map((regulation, index) => (
              <div key={regulation.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center €{
                    regulation.status === 'active' ? 'bg-green-100' :
                    regulation.status === 'upcoming' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <div className={`w-3 h-3 rounded-full €{
                      regulation.status === 'active' ? 'bg-green-600' :
                      regulation.status === 'upcoming' ? 'bg-blue-600' : 'bg-gray-600'
                    }`} />
                  </div>
                  {index < 3 && <div className="w-px h-8 bg-slate-200 mt-2" />}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{regulation.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border €{getStatusBadge(regulation.status)}`}>
                        {regulation.status}
                      </span>
                      <span className="text-sm text-slate-500">
                        {new Date(regulation.applicableDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{regulation.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setView('regulations')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              Explore Regulations
            </CardTitle>
            <CardDescription>
              Detailed guidance on specific EU regulations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-slate-600 mb-4">
                  Get comprehensive information about GDPR, AI Act, NIS2, DORA, and other EU regulations.
                </p>
                <Button>
                  View Regulations
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setView('industries')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-600" />
              Industry Guidance
            </CardTitle>
            <CardDescription>
              Sector-specific compliance requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-slate-600 mb-4">
                  Industry-specific guidance for financial services, technology, healthcare, and manufacturing.
                </p>
                <Button variant="outline">
                  Industry Analysis
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRegulations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">EU Regulations</h2>
          <p className="text-slate-600">Comprehensive regulatory guidance</p>
        </div>
        <Button variant="outline" onClick={() => setView('overview')}>
          Back to Overview
        </Button>
      </div>

      <div className="grid gap-6">
        {euRegulations.map((regulation) => (
          <Card 
            key={regulation.id}
            className={`cursor-pointer transition-all hover:shadow-lg €{
              selectedRegulation === regulation.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedRegulation(
              selectedRegulation === regulation.id ? null : regulation.id
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    {regulation.name} - {regulation.fullName}
                  </CardTitle>
                  <CardDescription>{regulation.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border €{getStatusBadge(regulation.status)}`}>
                    {regulation.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium €{getComplexityBadge(regulation.complexityLevel)}`}>
                    {regulation.complexityLevel} complexity
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium €{getImpactBadge(regulation.impact)}`}>
                    {regulation.impact} impact
                  </span>
                </div>
              </div>
            </CardHeader>
            
            {selectedRegulation === regulation.id && (
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Key Requirements</h4>
                    <ul className="space-y-1">
                      {regulation.keyRequirements.map((req, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Applicable Date</h4>
                      <p className="text-sm text-slate-600">{new Date(regulation.applicableDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Maximum Penalties</h4>
                      <p className="text-sm text-red-600 font-medium">{regulation.penalties}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Preparation Time</h4>
                      <p className="text-sm text-slate-600">{regulation.preparationTime}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Applicable Industries</h4>
                  <div className="flex flex-wrap gap-2">
                    {regulation.industries.map((industry) => (
                      <span key={industry} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/tools/compass?regulation=€{regulation.id}`)}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Assess Compliance
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderIndustries = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Industry-Specific Guidance</h2>
          <p className="text-slate-600">Regulatory requirements by sector</p>
        </div>
        <Button variant="outline" onClick={() => setView('overview')}>
          Back to Overview
        </Button>
      </div>

      <div className="grid gap-6">
        {industryMappings.map((industry) => (
          <Card 
            key={industry.industry}
            className={`cursor-pointer transition-all hover:shadow-lg €{
              selectedIndustry === industry.industry ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setSelectedIndustry(
              selectedIndustry === industry.industry ? null : industry.industry
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-green-600">{industry.icon}</div>
                  <div>
                    <CardTitle>{industry.industry}</CardTitle>
                    <CardDescription>
                      {industry.applicableRegulations.length} applicable regulations
                    </CardDescription>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium €{getRiskBadge(industry.riskProfile)}`}>
                  {industry.riskProfile} risk
                </span>
              </div>
            </CardHeader>

            {selectedIndustry === industry.industry && (
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Applicable Regulations</h4>
                    <div className="space-y-2">
                      {industry.applicableRegulations.map((regId) => {
                        const regulation = euRegulations.find(r => r.id === regId);
                        return regulation ? (
                          <div key={regId} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                            <span className="font-medium text-slate-900">{regulation.name}</span>
                            <span className={`px-2 py-1 rounded text-xs €{getStatusBadge(regulation.status)}`}>
                              {regulation.status}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Primary Concerns</h4>
                    <ul className="space-y-1">
                      {industry.primaryConcerns.map((concern, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 text-amber-600 mt-1 flex-shrink-0" />
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Recommended Actions</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {industry.recommendedActions.map((action, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                        <Zap className="h-3 w-3 text-blue-600 mt-1 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/tools/compass?industry=€{industry.industry.toLowerCase().replace(' ', '-')}`)}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Start Assessment
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Industry Resources
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {view === 'overview' && renderOverview()}
        {view === 'regulations' && renderRegulations()}
        {view === 'industries' && renderIndustries()}
      </div>
    </div>
  );
};