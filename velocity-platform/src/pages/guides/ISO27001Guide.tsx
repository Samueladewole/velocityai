import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  Settings, 
  Database, 
  Zap,
  Target,
  ArrowRight,
  BookOpen,
  Download,
  Play,
  FileText,
  Lock,
  Users,
  Building,
  TrendingUp,
  Award,
  Globe,
  Activity,
  Search,
  Eye,
  AlertTriangle,
  Cpu,
  Network
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface ISMSControl {
  id: string;
  domain: string;
  name: string;
  description: string;
  automated: boolean;
  evidenceTypes: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ImplementationPhase {
  phase: string;
  duration: string;
  description: string;
  activities: string[];
  automation: number;
}

const ISO27001Guide: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'framework' | 'automation' | 'implementation'>('overview');

  const ismsControls: ISMSControl[] = [
    {
      id: 'A.5.1',
      domain: 'Organizational',
      name: 'Information Security Policies',
      description: 'Policies for information security defined and approved by management',
      automated: true,
      evidenceTypes: 8,
      riskLevel: 'low'
    },
    {
      id: 'A.6.1',
      domain: 'People',
      name: 'Screening',
      description: 'Background verification of all candidates for employment',
      automated: true,
      evidenceTypes: 12,
      riskLevel: 'medium'
    },
    {
      id: 'A.8.1',
      domain: 'Technology',
      name: 'User Access Management',
      description: 'User access rights provisioned, reviewed and revoked appropriately',
      automated: true,
      evidenceTypes: 24,
      riskLevel: 'high'
    },
    {
      id: 'A.12.1',
      domain: 'Technology',
      name: 'Operational Procedures',
      description: 'Operating procedures documented and made available',
      automated: true,
      evidenceTypes: 15,
      riskLevel: 'medium'
    },
    {
      id: 'A.13.1',
      domain: 'Technology',
      name: 'Network Security Management',
      description: 'Networks are managed and controlled to protect information',
      automated: true,
      evidenceTypes: 18,
      riskLevel: 'high'
    },
    {
      id: 'A.14.1',
      domain: 'Technology',
      name: 'Secure Development',
      description: 'Security requirements for information systems development',
      automated: false,
      evidenceTypes: 10,
      riskLevel: 'medium'
    }
  ];

  const implementationPhases: ImplementationPhase[] = [
    {
      phase: 'Phase 1: Foundation',
      duration: '4-6 weeks',
      description: 'Establish ISMS foundation and conduct risk assessment',
      activities: [
        'Define information security policy and objectives',
        'Conduct comprehensive risk assessment',
        'Establish ISMS scope and boundaries',
        'Deploy AI agents for automated evidence collection'
      ],
      automation: 85
    },
    {
      phase: 'Phase 2: Implementation',
      duration: '8-12 weeks',
      description: 'Implement controls and establish operational procedures',
      activities: [
        'Implement selected security controls',
        'Develop and deploy security procedures',
        'Conduct staff training and awareness programs',
        'Establish continuous monitoring systems'
      ],
      automation: 90
    },
    {
      phase: 'Phase 3: Operation',
      duration: '4-6 weeks',
      description: 'Operationalize ISMS and prepare for certification',
      activities: [
        'Conduct internal audit and management review',
        'Address non-conformities and improvements',
        'Prepare for external certification audit',
        'Fine-tune automated compliance monitoring'
      ],
      automation: 95
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-blue-500 rounded-full mr-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Advanced Guide</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              ISO 27001
              <span className="block text-blue-400">Implementation</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Systematic approach to ISO 27001 certification with intelligent evidence collection. 
              Build a comprehensive Information Security Management System with 92% automation.
            </p>

            <div className="flex items-center justify-center gap-8 mb-8 text-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>18 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>10/10 AI Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>92% Automation Rate</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start ISO 27001 Assessment
              </button>
              <button 
                onClick={() => navigate('/velocity/demo/enterprise-iso27001')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                View Live Demo
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
              { id: 'framework', label: 'ISO 27001 Framework', icon: Shield },
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
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">What is ISO 27001?</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-slate-600 mb-6">
                  ISO 27001 is the international standard for Information Security Management Systems (ISMS). 
                  It provides a systematic approach to managing sensitive company information, ensuring it remains secure 
                  through people, processes, and technology controls.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Business Benefits
                    </h3>
                    <ul className="space-y-2 text-emerald-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Enhanced customer trust and competitive advantage
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Reduced security incidents and data breaches
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Legal and regulatory compliance assurance
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Improved business resilience and risk management
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
                        6-month implementation vs 12-18 months traditional
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        92% automation of evidence collection and monitoring
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        AI-generated policies, procedures, and documentation
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        Continuous compliance monitoring and gap detection
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ISMS Components */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Key ISMS Components</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    component: 'Leadership',
                    icon: Users,
                    description: 'Management commitment and organizational roles',
                    elements: ['Security policy', 'Roles & responsibilities', 'Resources allocation']
                  },
                  {
                    component: 'Planning',
                    icon: Target,
                    description: 'Risk assessment and treatment planning',
                    elements: ['Risk assessment', 'Risk treatment', 'Security objectives']
                  },
                  {
                    component: 'Operation',
                    icon: Settings,
                    description: 'Implementation of security controls',
                    elements: ['Control implementation', 'Documentation', 'Training']
                  },
                  {
                    component: 'Evaluation',
                    icon: Eye,
                    description: 'Monitoring, auditing, and review',
                    elements: ['Internal audit', 'Management review', 'Monitoring']
                  }
                ].map((comp, index) => {
                  const Icon = comp.icon;
                  return (
                    <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900">{comp.component}</h4>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{comp.description}</p>
                      <ul className="space-y-1">
                        {comp.elements.map((element, idx) => (
                          <li key={idx} className="text-xs text-slate-500 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            {element}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 14 Security Domains */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">ISO 27001 Annex A: 14 Security Domains</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { domain: 'A.5 Information Security Policies', controls: 2, automation: 95 },
                  { domain: 'A.6 Organization of Information Security', controls: 7, automation: 88 },
                  { domain: 'A.7 Human Resource Security', controls: 6, automation: 92 },
                  { domain: 'A.8 Asset Management', controls: 10, automation: 94 },
                  { domain: 'A.9 Access Control', controls: 14, automation: 96 },
                  { domain: 'A.10 Cryptography', controls: 2, automation: 90 },
                  { domain: 'A.11 Physical and Environmental Security', controls: 15, automation: 85 },
                  { domain: 'A.12 Operations Security', controls: 14, automation: 93 },
                  { domain: 'A.13 Communications Security', controls: 7, automation: 91 },
                  { domain: 'A.14 System Acquisition, Development and Maintenance', controls: 13, automation: 80 },
                  { domain: 'A.15 Supplier Relationships', controls: 5, automation: 87 },
                  { domain: 'A.16 Information Security Incident Management', controls: 7, automation: 89 },
                  { domain: 'A.17 Information Security Aspects of Business Continuity', controls: 4, automation: 86 },
                  { domain: 'A.18 Compliance', controls: 8, automation: 97 }
                ].map((domain, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900 text-sm">{domain.domain}</h4>
                      <span className="text-xs text-slate-500">{domain.automation}% automated</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-600">{domain.controls} controls</span>
                      <div className="w-16 bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${domain.automation}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Velocity ISO 27001 Success Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">98.2%</div>
                  <div className="text-blue-100">Certification success rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">6</div>
                  <div className="text-blue-100">Months to certification</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">€250K</div>
                  <div className="text-blue-100">Savings vs traditional</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">800+</div>
                  <div className="text-blue-100">Organizations certified</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Framework Section */}
        {activeSection === 'framework' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">ISO 27001 Control Framework</h3>
              <p className="text-slate-600 mb-8">
                ISO 27001 Annex A contains 114 security controls across 14 domains. Our AI agents automate 
                evidence collection, control testing, and continuous monitoring for comprehensive ISMS management.
              </p>
              
              <div className="space-y-4">
                {ismsControls.map((control) => (
                  <div key={control.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{control.id} - {control.name}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {control.domain}
                          </span>
                          {control.automated && (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                              Automated
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            control.riskLevel === 'low' ? 'bg-emerald-100 text-emerald-800' :
                            control.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {control.riskLevel} risk
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{control.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>{control.evidenceTypes} evidence types</span>
                          <span>Automated monitoring and alerts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PDCA Cycle */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Plan-Do-Check-Act (PDCA) Cycle</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    phase: 'Plan',
                    icon: Target,
                    color: 'blue',
                    activities: ['Establish ISMS policy', 'Define scope', 'Risk assessment', 'Risk treatment plan'],
                    automation: 85
                  },
                  {
                    phase: 'Do',
                    icon: Settings,
                    color: 'emerald',
                    activities: ['Implement controls', 'Training programs', 'Document procedures', 'Deploy technology'],
                    automation: 90
                  },
                  {
                    phase: 'Check',
                    icon: Eye,
                    color: 'amber',
                    activities: ['Monitor controls', 'Internal audit', 'Management review', 'Measure effectiveness'],
                    automation: 95
                  },
                  {
                    phase: 'Act',
                    icon: TrendingUp,
                    color: 'purple',
                    activities: ['Corrective actions', 'Improve processes', 'Update documentation', 'Continual improvement'],
                    automation: 88
                  }
                ].map((phase, index) => {
                  const Icon = phase.icon;
                  return (
                    <div key={index} className={`border border-${phase.color}-200 rounded-lg p-6 bg-${phase.color}-50`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 bg-${phase.color}-100 rounded-lg`}>
                          <Icon className={`w-6 h-6 text-${phase.color}-600`} />
                        </div>
                        <h4 className={`font-semibold text-${phase.color}-800`}>{phase.phase}</h4>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {phase.activities.map((activity, idx) => (
                          <li key={idx} className={`text-xs text-${phase.color}-700 flex items-center gap-2`}>
                            <CheckCircle className={`w-3 h-3 text-${phase.color}-500`} />
                            {activity}
                          </li>
                        ))}
                      </ul>
                      <div className="text-center">
                        <div className={`text-lg font-bold text-${phase.color}-600`}>{phase.automation}%</div>
                        <div className={`text-xs text-${phase.color}-600`}>Automated</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Implementation Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">6-Month Implementation Timeline</h3>
              <div className="space-y-6">
                {implementationPhases.map((phase, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      {index < implementationPhases.length - 1 && <div className="w-0.5 h-16 bg-slate-200 mt-2"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-900">{phase.phase}</h4>
                        <span className="text-sm text-slate-500">{phase.duration}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {phase.automation}% automated
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{phase.description}</p>
                      <ul className="space-y-1">
                        {phase.activities.map((activity, actIndex) => (
                          <li key={actIndex} className="text-sm text-slate-600 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            {activity}
                          </li>
                        ))}
                      </ul>
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
            {/* AI Agents for ISO 27001 */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">10 AI Agents for ISO 27001 ISMS</h3>
              <p className="text-slate-600 mb-8">
                Our specialized AI agents automate ISMS implementation, monitoring, and maintenance across 
                all 14 security domains with intelligent evidence collection and continuous compliance assurance.
              </p>

              <div className="grid gap-6">
                {[
                  {
                    name: 'Risk Assessment Agent',
                    description: 'Automated risk identification, analysis, and treatment planning',
                    automation: 94,
                    domains: ['All domains'],
                    capabilities: ['Asset discovery', 'Threat modeling', 'Risk scoring', 'Treatment recommendations']
                  },
                  {
                    name: 'Access Control Agent',
                    description: 'Comprehensive user access management and privilege monitoring',
                    automation: 96,
                    domains: ['A.9 Access Control'],
                    capabilities: ['User provisioning', 'Access reviews', 'Privilege escalation detection', 'Identity governance']
                  },
                  {
                    name: 'Asset Management Agent',
                    description: 'Automated asset discovery, classification, and lifecycle management',
                    automation: 94,
                    domains: ['A.8 Asset Management'],
                    capabilities: ['Asset inventory', 'Classification', 'Ownership tracking', 'Disposal management']
                  },
                  {
                    name: 'Operations Security Agent',
                    description: 'Operational procedure monitoring and security event management',
                    automation: 93,
                    domains: ['A.12 Operations Security'],
                    capabilities: ['Change management', 'Backup verification', 'Log monitoring', 'Capacity management']
                  },
                  {
                    name: 'Incident Response Agent',
                    description: 'Automated incident detection, response, and management',
                    automation: 89,
                    domains: ['A.16 Incident Management'],
                    capabilities: ['Threat detection', 'Incident triage', 'Response automation', 'Forensic analysis']
                  },
                  {
                    name: 'Compliance Monitoring Agent',
                    description: 'Continuous compliance assessment and gap identification',
                    automation: 97,
                    domains: ['A.18 Compliance'],
                    capabilities: ['Control testing', 'Gap analysis', 'Regulatory tracking', 'Audit preparation']
                  }
                ].map((agent, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">{agent.name}</h4>
                        <p className="text-slate-600 text-sm mb-3">{agent.description}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-blue-600 text-xs font-medium">
                            Covers: {agent.domains.join(', ')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.map((cap, capIndex) => (
                            <span key={capIndex} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-6 text-center">
                        <div className="text-2xl font-bold text-blue-600">{agent.automation}%</div>
                        <div className="text-xs text-slate-500">Automated</div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${agent.automation}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Automated Evidence Collection */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Intelligent Evidence Collection</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Connected Systems & Tools</h4>
                  <div className="space-y-3">
                    {[
                      { system: 'Active Directory / LDAP', evidence: 'User access logs, group memberships', status: 'active' },
                      { system: 'SIEM / Log Management', evidence: 'Security events, incident logs', status: 'active' },
                      { system: 'Cloud Infrastructure', evidence: 'Configuration data, access logs', status: 'active' },
                      { system: 'Asset Management', evidence: 'Hardware/software inventory', status: 'active' },
                      { system: 'HR Systems', evidence: 'Employee lifecycle, training records', status: 'active' },
                      { system: 'Vulnerability Scanners', evidence: 'Security assessments, patch status', status: 'active' }
                    ].map((system, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="font-medium text-sm">{system.system}</span>
                        </div>
                        <p className="text-xs text-slate-600">{system.evidence}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Evidence Categories & Automation</h4>
                  <div className="space-y-4">
                    {[
                      { category: 'Access Control Evidence', percentage: 96, automated: true },
                      { category: 'Asset Management Records', percentage: 94, automated: true },
                      { category: 'Security Monitoring Logs', percentage: 98, automated: true },
                      { category: 'Training & Awareness Records', percentage: 92, automated: true },
                      { category: 'Risk Assessment Documentation', percentage: 88, automated: true },
                      { category: 'Business Continuity Plans', percentage: 85, automated: false }
                    ].map((cat, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            {cat.category}
                            {cat.automated && (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                                Automated
                              </span>
                            )}
                          </span>
                          <span className="text-sm text-slate-600">{cat.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${cat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time ISMS Dashboard */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Real-time ISMS Monitoring</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h4 className="font-semibold text-emerald-800 mb-4">Control Effectiveness</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">94.7%</div>
                    <div className="text-emerald-700 text-sm">Controls Operating Effectively</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700">Operational</span>
                      <span className="text-emerald-800 font-medium">108/114</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700">Under Review</span>
                      <span className="text-emerald-800 font-medium">4/114</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700">Non-conformities</span>
                      <span className="text-emerald-800 font-medium">2/114</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-4">Risk Posture</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">2.1</div>
                    <div className="text-blue-700 text-sm">Average Risk Score (Low)</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">High Risk</span>
                      <span className="text-blue-800 font-medium">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Medium Risk</span>
                      <span className="text-blue-800 font-medium">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Low Risk</span>
                      <span className="text-blue-800 font-medium">85</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h4 className="font-semibold text-amber-800 mb-4">Certification Status</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">89%</div>
                    <div className="text-amber-700 text-sm">Certification Readiness</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Documentation</span>
                      <span className="text-amber-800 font-medium">95%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Evidence</span>
                      <span className="text-amber-800 font-medium">92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Process Maturity</span>
                      <span className="text-amber-800 font-medium">86%</span>
                    </div>
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
              <h3 className="text-2xl font-bold text-slate-900 mb-6">ISO 27001 Implementation Roadmap</h3>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Assessment</h4>
                  <p className="text-sm text-slate-600">Gap analysis and ISMS scoping</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Implementation</h4>
                  <p className="text-sm text-slate-600">Control deployment and automation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Certification</h4>
                  <p className="text-sm text-slate-600">Audit preparation and certification</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Pre-Implementation Checklist</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Define ISMS scope and boundaries',
                    'Conduct comprehensive asset inventory',
                    'Perform initial risk assessment',
                    'Establish information security policy',
                    'Identify key stakeholders and roles',
                    'Review regulatory and legal requirements',
                    'Assess current security controls',
                    'Plan resource allocation and budget',
                    'Schedule AI agent deployment',
                    'Prepare staff training programs'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Certification Path */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Certification Process</h3>
              <div className="space-y-6">
                {[
                  {
                    stage: 'Stage 1: Documentation Review',
                    duration: '2-3 weeks',
                    description: 'Auditor reviews ISMS documentation and policies',
                    activities: ['Document review', 'Scope verification', 'Initial gap identification']
                  },
                  {
                    stage: 'Stage 2: Implementation Audit',
                    duration: '1-2 weeks',
                    description: 'On-site audit of ISMS implementation and effectiveness',
                    activities: ['Control testing', 'Evidence review', 'Interviews', 'Risk assessment validation']
                  },
                  {
                    stage: 'Certification Decision',
                    duration: '2-4 weeks',
                    description: 'Certification body makes final decision and issues certificate',
                    activities: ['Report review', 'Corrective action review', 'Certificate issuance']
                  },
                  {
                    stage: 'Surveillance Audits',
                    duration: 'Annual',
                    description: 'Ongoing surveillance to maintain certification',
                    activities: ['Annual audits', 'Continuous monitoring', 'Improvement tracking']
                  }
                ].map((stage, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      {index < 3 && <div className="w-0.5 h-16 bg-slate-200 mt-2"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-900">{stage.stage}</h4>
                        <span className="text-sm text-slate-500">{stage.duration}</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{stage.description}</p>
                      <ul className="space-y-1">
                        {stage.activities.map((activity, actIndex) => (
                          <li key={actIndex} className="text-sm text-slate-600 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Analysis */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Investment & ROI Analysis</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-semibold text-red-800 mb-4">Traditional Approach</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-red-700">Timeline:</span>
                      <span className="font-semibold text-red-800">12-18 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Consulting costs:</span>
                      <span className="font-semibold text-red-800">€200K-300K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Internal resources:</span>
                      <span className="font-semibold text-red-800">3-5 FTEs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Automation level:</span>
                      <span className="font-semibold text-red-800">20-40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Ongoing maintenance:</span>
                      <span className="font-semibold text-red-800">€100K/year</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h4 className="font-semibold text-emerald-800 mb-4">Velocity Approach</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Timeline:</span>
                      <span className="font-semibold text-emerald-800">6 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Platform cost:</span>
                      <span className="font-semibold text-emerald-800">€50K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Internal resources:</span>
                      <span className="font-semibold text-emerald-800">1 FTE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Automation level:</span>
                      <span className="font-semibold text-emerald-800">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Ongoing maintenance:</span>
                      <span className="font-semibold text-emerald-800">€20K/year</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white text-center">
                <h4 className="font-semibold mb-2">3-Year Total Savings</h4>
                <div className="text-3xl font-bold">€250K+</div>
                <div className="text-blue-100 text-sm">Compared to traditional implementation</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Implement ISO 27001?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Build a world-class Information Security Management System with 92% automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              Start Assessment
            </button>
            <button
              onClick={() => navigate('/velocity/demo/enterprise-iso27001')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              View Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISO27001Guide;