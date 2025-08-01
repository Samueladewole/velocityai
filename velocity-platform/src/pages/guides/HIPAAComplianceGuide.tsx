import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  Users, 
  Database, 
  Settings, 
  Zap,
  Target,
  ArrowRight,
  BookOpen,
  Download,
  Play,
  FileText,
  Lock,
  Activity,
  AlertCircle,
  TrendingUp,
  Award,
  Building,
  Heart,
  Eye,
  UserCheck,
  FileSearch,
  Key,
  Monitor,
  Clipboard,
  Phone,
  Mail
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface AIAgent {
  id: string;
  name: string;
  description: string;
  automationLevel: number;
  safeguards: string[];
  evidenceTypes: number;
}

interface HIPAASafeguard {
  id: string;
  category: string;
  name: string;
  description: string;
  automated: boolean;
  aiAgent: string;
  riskLevel: 'high' | 'medium' | 'low';
}

interface ComplianceRequirement {
  section: string;
  title: string;
  description: string;
  requirements: string[];
  automation: number;
}

const HIPAAComplianceGuide: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'framework' | 'automation' | 'implementation'>('overview');

  const aiAgents: AIAgent[] = [
    {
      id: 'phi-protection',
      name: 'PHI Protection Agent',
      description: 'Continuously monitors and protects Protected Health Information across all systems',
      automationLevel: 97,
      safeguards: ['164.308(a)', '164.312(a)', '164.314(a)'],
      evidenceTypes: 28
    },
    {
      id: 'access-control',
      name: 'Healthcare Access Control Agent',
      description: 'Manages role-based access to PHI with minimum necessary principle enforcement',
      automationLevel: 95,
      safeguards: ['164.312(a)(1)', '164.308(a)(4)'],
      evidenceTypes: 22
    },
    {
      id: 'audit-logging',
      name: 'HIPAA Audit Agent',
      description: 'Comprehensive audit logging and monitoring of all PHI access and modifications',
      automationLevel: 98,
      safeguards: ['164.312(b)', '164.308(a)(1)'],
      evidenceTypes: 25
    },
    {
      id: 'data-integrity',
      name: 'Data Integrity Agent',
      description: 'Ensures PHI accuracy, completeness, and prevents unauthorized alteration',
      automationLevel: 93,
      safeguards: ['164.312(c)', '164.308(a)(8)'],
      evidenceTypes: 19
    },
    {
      id: 'transmission-security',
      name: 'Transmission Security Agent',
      description: 'Secures PHI transmission over networks with end-to-end encryption',
      automationLevel: 96,
      safeguards: ['164.312(e)', '164.314(b)'],
      evidenceTypes: 17
    },
    {
      id: 'breach-response',
      name: 'Breach Response Agent',
      description: 'Automated breach detection, assessment, and response coordination',
      automationLevel: 89,
      safeguards: ['164.308(a)(6)', '164.400-414'],
      evidenceTypes: 16
    },
    {
      id: 'business-associate',
      name: 'Business Associate Agent',
      description: 'Manages BAA compliance and third-party PHI handling oversight',
      automationLevel: 91,
      safeguards: ['164.308(b)', '164.314(a)'],
      evidenceTypes: 14
    },
    {
      id: 'workforce-training',
      name: 'Workforce Training Agent',
      description: 'Automated HIPAA training delivery, tracking, and compliance monitoring',
      automationLevel: 94,
      safeguards: ['164.308(a)(5)', '164.530(b)'],
      evidenceTypes: 12
    },
    {
      id: 'device-control',
      name: 'Device & Media Control Agent',
      description: 'Manages device access, media disposal, and workstation security',
      automationLevel: 92,
      safeguards: ['164.310(d)', '164.312(a)(2)'],
      evidenceTypes: 18
    }
  ];

  const hipaaRequirements: ComplianceRequirement[] = [
    {
      section: 'Administrative Safeguards',
      title: 'Security Management & Workforce Training',
      description: 'Policies, procedures, and workforce requirements for PHI protection',
      requirements: [
        'Assigned security responsibility (§164.308(a)(2))',
        'Workforce training and access management (§164.308(a)(5))',
        'Information access management (§164.308(a)(4))',
        'Security awareness and training (§164.308(a)(5))',
        'Security incident procedures (§164.308(a)(6))',
        'Contingency plan (§164.308(a)(7))',
        'Regular security evaluations (§164.308(a)(8))'
      ],
      automation: 91
    },
    {
      section: 'Physical Safeguards',
      title: 'Facility Access & Workstation Security',
      description: 'Physical protection of systems, workstations, and media containing PHI',
      requirements: [
        'Facility access controls (§164.310(a)(1))',
        'Workstation use restrictions (§164.310(b))',
        'Device and media controls (§164.310(d)(1))',
        'Data backup and storage (§164.310(d)(2))',
        'Data disposal procedures (§164.310(d)(2))'
      ],
      automation: 89
    },
    {
      section: 'Technical Safeguards',
      title: 'Access Control & Data Protection',
      description: 'Technology controls for PHI access, integrity, and transmission',
      requirements: [
        'Access control (§164.312(a)(1))',
        'Audit controls (§164.312(b))',
        'Integrity controls (§164.312(c)(1))',
        'Person or entity authentication (§164.312(d))',
        'Transmission security (§164.312(e)(1))',
        'Encryption and decryption (§164.312(a)(2)(iv))'
      ],
      automation: 96
    }
  ];

  const hipaaSafeguards: HIPAASafeguard[] = [
    {
      id: '164.308(a)(2)',
      category: 'Administrative',
      name: 'Assigned Security Responsibility',
      description: 'Designate a security officer responsible for developing and implementing security policies',
      automated: true,
      aiAgent: 'Compliance Monitoring Agent',
      riskLevel: 'high'
    },
    {
      id: '164.312(a)(1)',
      category: 'Technical',
      name: 'Access Control',
      description: 'Implement technical policies for accessing electronic PHI',
      automated: true,
      aiAgent: 'Healthcare Access Control Agent',
      riskLevel: 'high'
    },
    {
      id: '164.312(b)',
      category: 'Technical',
      name: 'Audit Controls',
      description: 'Implement hardware, software, and/or procedural mechanisms for audit trails',
      automated: true,
      aiAgent: 'HIPAA Audit Agent',
      riskLevel: 'high'
    },
    {
      id: '164.310(a)(1)',
      category: 'Physical',
      name: 'Facility Access Controls',
      description: 'Limit physical access to facilities while ensuring authorized access',
      automated: true,
      aiAgent: 'Device & Media Control Agent',
      riskLevel: 'medium'
    },
    {
      id: '164.312(e)(1)',
      category: 'Technical',
      name: 'Transmission Security',
      description: 'Implement technical safeguards to guard against unauthorized access to PHI',
      automated: true,
      aiAgent: 'Transmission Security Agent',
      riskLevel: 'high'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-emerald-500 rounded-full mr-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <span className="text-emerald-400 font-semibold text-lg">Advanced Guide</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              HIPAA Compliance
              <span className="block text-emerald-400">Framework</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Complete healthcare compliance automation with Velocity's 9 specialized AI agents. 
              Protect PHI with 91% automation and continuous monitoring.
            </p>

            <div className="flex items-center justify-center gap-8 mb-8 text-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>14 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>9/10 AI Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>91% Automation Rate</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start HIPAA Assessment
              </button>
              <button 
                onClick={() => navigate('/velocity/demo/healthcare-hipaa')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                View Healthcare Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-4">
            {[
              { id: 'overview', label: 'Guide Overview', icon: BookOpen },
              { id: 'framework', label: 'HIPAA Framework', icon: Heart },
              { id: 'automation', label: 'AI Automation', icon: Zap },
              { id: 'implementation', label: 'Implementation', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === tab.id
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">What is HIPAA Compliance?</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-slate-600 mb-6">
                  The Health Insurance Portability and Accountability Act (HIPAA) establishes national standards 
                  for protecting individuals' medical records and other protected health information (PHI). 
                  HIPAA compliance is mandatory for covered entities and business associates handling PHI.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Why HIPAA Matters
                    </h3>
                    <ul className="space-y-2 text-emerald-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Legal requirement for healthcare organizations
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Protects patient privacy and data security
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Avoids penalties up to $1.5M per incident
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Builds patient trust and reputation
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Velocity Advantage
                    </h3>
                    <ul className="space-y-2 text-blue-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        91% automation of HIPAA safeguards
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        Real-time PHI protection monitoring
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        Automated breach risk assessment
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        Continuous compliance monitoring
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* HIPAA Entities */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">HIPAA Covered Entities & Requirements</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    entity: 'Covered Entities',
                    icon: Building,
                    examples: ['Healthcare providers', 'Health plans', 'Healthcare clearinghouses'],
                    requirements: 'Full HIPAA compliance required'
                  },
                  {
                    entity: 'Business Associates',
                    icon: Users,
                    examples: ['IT service providers', 'Cloud storage vendors', 'Medical transcription services'],
                    requirements: 'BAA and technical safeguards required'
                  },
                  {
                    entity: 'Subcontractors',
                    icon: Globe,
                    examples: ['Third-party developers', 'Data processors', 'Analytics providers'],
                    requirements: 'Inherit BAA requirements'
                  }
                ].map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Icon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-2">{category.entity}</h4>
                          <div className="space-y-2 mb-4">
                            {category.examples.map((example, idx) => (
                              <div key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                {example}
                              </div>
                            ))}
                          </div>
                          <div className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-2 rounded">
                            {category.requirements}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Velocity HIPAA Success Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">98.2%</div>
                  <div className="text-emerald-100">Breach prevention rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">30</div>
                  <div className="text-emerald-100">Days to compliance</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">€200K</div>
                  <div className="text-emerald-100">Average penalty savings</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">250+</div>
                  <div className="text-emerald-100">Healthcare orgs protected</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Framework Section */}
        {activeSection === 'framework' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">HIPAA Security Rule Framework</h3>
              <p className="text-slate-600 mb-8">
                The HIPAA Security Rule requires implementation of administrative, physical, and technical 
                safeguards to protect electronic PHI (ePHI). Our AI agents automate compliance across 
                all three categories of safeguards.
              </p>
              
              <div className="space-y-6">
                {hipaaRequirements.map((requirement, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{requirement.section}</h4>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                            {requirement.automation}% Automated
                          </span>
                        </div>
                        <h5 className="font-medium text-slate-800 mb-2">{requirement.title}</h5>
                        <p className="text-slate-600 text-sm mb-4">{requirement.description}</p>
                        <div className="space-y-2">
                          {requirement.requirements.map((req, reqIndex) => (
                            <div key={reqIndex} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${requirement.automation}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Safeguards */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Critical HIPAA Safeguards</h3>
              <div className="space-y-4">
                {hipaaSafeguards.map((safeguard) => (
                  <div key={safeguard.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{safeguard.id} - {safeguard.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            safeguard.category === 'Administrative' ? 'bg-blue-100 text-blue-800' :
                            safeguard.category === 'Physical' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {safeguard.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            safeguard.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                            safeguard.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {safeguard.riskLevel.toUpperCase()} RISK
                          </span>
                          {safeguard.automated && (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                              Automated
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{safeguard.description}</p>
                        <div className="text-sm text-slate-500">
                          Managed by: {safeguard.aiAgent}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Automation Section */}
        {activeSection === 'automation' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">HIPAA AI Agent Framework</h3>
              <p className="text-slate-600 mb-8">
                Our 9 specialized AI agents provide comprehensive HIPAA compliance automation, 
                from PHI protection to breach response, ensuring continuous compliance monitoring.
              </p>

              <div className="grid gap-6">
                {aiAgents.map((agent) => (
                  <div key={agent.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">{agent.name}</h4>
                        <p className="text-slate-600 text-sm mb-3">{agent.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Safeguards: {agent.safeguards.join(', ')}</span>
                          <span>{agent.evidenceTypes} evidence types</span>
                        </div>
                      </div>
                      <div className="ml-6 text-center">
                        <div className="text-2xl font-bold text-emerald-600">{agent.automationLevel}%</div>
                        <div className="text-xs text-slate-500">Automated</div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${agent.automationLevel}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PHI Protection Monitoring */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Real-time PHI Protection</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Monitoring Capabilities</h4>
                  <div className="space-y-3">
                    {[
                      { capability: 'PHI Access Monitoring', status: 'active', coverage: '100%' },
                      { capability: 'Data Encryption Validation', status: 'active', coverage: '100%' },
                      { capability: 'Audit Trail Generation', status: 'active', coverage: '100%' },
                      { capability: 'Breach Risk Assessment', status: 'active', coverage: '98%' },
                      { capability: 'Business Associate Oversight', status: 'active', coverage: '95%' },
                      { capability: 'Minimum Necessary Enforcement', status: 'active', coverage: '92%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="font-medium">{item.capability}</span>
                        </div>
                        <div className="text-sm text-slate-600">
                          {item.coverage} coverage
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Compliance Areas</h4>
                  <div className="space-y-4">
                    {[
                      { area: 'Administrative Safeguards', percentage: 91, automated: true },
                      { area: 'Physical Safeguards', percentage: 89, automated: true },
                      { area: 'Technical Safeguards', percentage: 96, automated: true },
                      { area: 'Breach Notification', percentage: 89, automated: true },
                      { area: 'Risk Assessment', percentage: 87, automated: false }
                    ].map((area, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            {area.area}
                            {area.automated && (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                                Automated
                              </span>
                            )}
                          </span>
                          <span className="text-sm text-slate-600">{area.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${area.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Implementation Section */}
        {activeSection === 'implementation' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">HIPAA Implementation Roadmap</h3>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileSearch className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Assessment</h4>
                  <p className="text-sm text-slate-600">PHI inventory and risk assessment</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Protection</h4>
                  <p className="text-sm text-slate-600">Safeguard implementation and monitoring</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Compliance</h4>
                  <p className="text-sm text-slate-600">Ongoing monitoring and reporting</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Implementation Checklist</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Conduct comprehensive PHI inventory',
                    'Perform HIPAA risk assessment',
                    'Deploy PHI protection AI agents',
                    'Implement access control systems',
                    'Set up audit logging and monitoring',
                    'Configure breach detection systems',
                    'Train workforce on HIPAA requirements',
                    'Execute Business Associate Agreements',
                    'Establish incident response procedures',
                    'Begin continuous compliance monitoring'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cost & Risk Comparison */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Cost & Risk Comparison</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-semibold text-red-800 mb-4">Manual Compliance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-red-700">Implementation:</span>
                      <span className="font-semibold text-red-800">6-12 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Consulting costs:</span>
                      <span className="font-semibold text-red-800">€200K+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Breach risk:</span>
                      <span className="font-semibold text-red-800">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Penalty risk:</span>
                      <span className="font-semibold text-red-800">€1.5M+</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h4 className="font-semibold text-emerald-800 mb-4">Velocity Approach</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Implementation:</span>
                      <span className="font-semibold text-emerald-800">30 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Platform cost:</span>
                      <span className="font-semibold text-emerald-800">€45K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Breach risk:</span>
                      <span className="font-semibold text-emerald-800">Minimal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">ROI:</span>
                      <span className="font-semibold text-emerald-800">400%+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Secure PHI with AI?
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            Join 250+ healthcare organizations protecting PHI with Velocity's HIPAA compliance platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Start HIPAA Assessment
            </button>
            <button
              onClick={() => navigate('/velocity/demo/healthcare-hipaa')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              View Healthcare Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HIPAAComplianceGuide;