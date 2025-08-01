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
  Globe,
  Eye,
  UserCheck,
  FileSearch,
  Key,
  Monitor,
  Clipboard,
  Server,
  Network,
  GitBranch,
  BarChart3,
  Flag
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface AIAgent {
  id: string;
  name: string;
  description: string;
  automationLevel: number;
  frameworks: string[];
  evidenceTypes: number;
}

interface ComplianceFramework {
  framework: string;
  fullName: string;
  scope: string;
  requirements: string[];
  automation: number;
  deadline: string;
}

interface CriticalControl {
  id: string;
  framework: 'DORA' | 'NIS2' | 'Both';
  category: string;
  name: string;
  description: string;
  automated: boolean;
  aiAgent: string;
  riskLevel: 'critical' | 'high' | 'medium';
}

const DORAGuide: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'framework' | 'automation' | 'implementation'>('overview');

  const aiAgents: AIAgent[] = [
    {
      id: 'ict-risk-management',
      name: 'ICT Risk Management Agent',
      description: 'Comprehensive ICT risk identification, assessment, and mitigation across all systems',
      automationLevel: 96,
      frameworks: ['DORA', 'NIS2'],
      evidenceTypes: 34
    },
    {
      id: 'operational-resilience',
      name: 'Operational Resilience Agent',
      description: 'Monitors and ensures continuity of critical business operations and services',
      automationLevel: 94,
      frameworks: ['DORA', 'NIS2'],
      evidenceTypes: 28
    },
    {
      id: 'third-party-risk',
      name: 'Third-Party ICT Risk Agent',
      description: 'Manages risks from ICT service providers and supply chain dependencies',
      automationLevel: 92,
      frameworks: ['DORA', 'NIS2'],
      evidenceTypes: 26
    },
    {
      id: 'incident-response',
      name: 'ICT Incident Response Agent',
      description: 'Automated incident detection, classification, and response coordination',
      automationLevel: 97,
      frameworks: ['DORA', 'NIS2'],
      evidenceTypes: 31
    },
    {
      id: 'testing-assurance',
      name: 'Digital Resilience Testing Agent',
      description: 'Continuous testing of ICT systems resilience and recovery capabilities',
      automationLevel: 93,
      frameworks: ['DORA'],
      evidenceTypes: 22
    },
    {
      id: 'threat-intelligence',
      name: 'Threat Intelligence Agent',
      description: 'Real-time threat monitoring and intelligence sharing with authorities',
      automationLevel: 95,
      frameworks: ['DORA', 'NIS2'],
      evidenceTypes: 24
    },
    {
      id: 'cybersecurity-governance',
      name: 'Cybersecurity Governance Agent',
      description: 'Establishes and maintains cybersecurity governance and oversight',
      automationLevel: 91,
      frameworks: ['NIS2'],
      evidenceTypes: 19
    },
    {
      id: 'supply-chain-security',
      name: 'Supply Chain Security Agent',
      description: 'Monitors and secures supply chain relationships and dependencies',
      automationLevel: 89,
      frameworks: ['NIS2'],
      evidenceTypes: 17
    },
    {
      id: 'vulnerability-management',
      name: 'Vulnerability Management Agent',
      description: 'Continuous vulnerability assessment and patch management automation',
      automationLevel: 98,
      frameworks: ['DORA', 'NIS2'],
      evidenceTypes: 29
    }
  ];

  const complianceFrameworks: ComplianceFramework[] = [
    {
      framework: 'DORA',
      fullName: 'Digital Operational Resilience Act',
      scope: 'Financial entities (banks, insurance, investment firms)',
      requirements: [
        'ICT risk management framework implementation',
        'ICT-related incident reporting to authorities',
        'Digital operational resilience testing',
        'Third-party ICT service provider oversight',
        'Information sharing arrangements'
      ],
      automation: 94,
      deadline: 'January 17, 2025'
    },
    {
      framework: 'NIS2',
      fullName: 'Network and Information Systems Directive 2',
      scope: 'Essential and important entities across 18 sectors',
      requirements: [
        'Cybersecurity risk management measures',
        'Corporate accountability and governance',
        'Incident reporting within 24 hours',
        'Business continuity and crisis management',
        'Supply chain security measures',
        'Vulnerability handling and disclosure'
      ],
      automation: 92,
      deadline: 'October 17, 2024'
    }
  ];

  const criticalControls: CriticalControl[] = [
    {
      id: 'DORA-1',
      framework: 'DORA',
      category: 'ICT Risk Management',
      name: 'ICT Risk Management Framework',
      description: 'Comprehensive framework for identifying, assessing, and managing ICT risks',
      automated: true,
      aiAgent: 'ICT Risk Management Agent',
      riskLevel: 'critical'
    },
    {
      id: 'DORA-2',
      framework: 'DORA',
      category: 'Incident Reporting',
      name: 'ICT Incident Classification & Reporting',
      description: 'Automated incident classification and reporting to competent authorities',
      automated: true,
      aiAgent: 'ICT Incident Response Agent',
      riskLevel: 'critical'
    },
    {
      id: 'DORA-3',
      framework: 'DORA',
      category: 'Resilience Testing',
      name: 'Digital Operational Resilience Testing',
      description: 'Regular testing of ICT systems and processes resilience',
      automated: true,
      aiAgent: 'Digital Resilience Testing Agent',
      riskLevel: 'high'
    },
    {
      id: 'NIS2-1',
      framework: 'NIS2',
      category: 'Risk Management',
      name: 'Cybersecurity Risk Management',
      description: 'Implementation of appropriate technical and organizational measures',
      automated: true,
      aiAgent: 'ICT Risk Management Agent',
      riskLevel: 'critical'
    },
    {
      id: 'NIS2-2',
      framework: 'NIS2',
      category: 'Incident Response',
      name: '24-Hour Incident Reporting',
      description: 'Rapid incident detection and reporting within regulatory timeframes',
      automated: true,
      aiAgent: 'ICT Incident Response Agent',
      riskLevel: 'critical'
    },
    {
      id: 'BOTH-1',
      framework: 'Both',
      category: 'Third-Party Risk',
      name: 'Third-Party Risk Management',
      description: 'Oversight and management of ICT third-party service providers',
      automated: true,
      aiAgent: 'Third-Party ICT Risk Agent',
      riskLevel: 'high'
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
                <Flag className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Expert Guide</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              DORA & NIS2
              <span className="block text-blue-400">EU Compliance</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Complete automation for Europe's critical cybersecurity regulations with Velocity's 
              9 specialized AI agents. Achieve compliance with 93% automation.
            </p>

            <div className="flex items-center justify-center gap-8 mb-8 text-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>20 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>9/10 AI Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>93% Automation Rate</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start EU Compliance Assessment
              </button>
              <button 
                onClick={() => navigate('/velocity/demo/financial-dora')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                View Financial Demo
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
              { id: 'framework', label: 'DORA & NIS2 Framework', icon: Flag },
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">DORA & NIS2: Europe's Cybersecurity Revolution</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-slate-600 mb-6">
                  The Digital Operational Resilience Act (DORA) and Network and Information Systems Directive 2 (NIS2) 
                  represent the EU's most comprehensive cybersecurity legislation. These regulations impose strict 
                  requirements on financial entities and critical infrastructure operators.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <Flag className="w-5 h-5" />
                      Why This Matters Now
                    </h3>
                    <ul className="space-y-2 text-blue-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        DORA applies from January 17, 2025
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        NIS2 enforcement began October 17, 2024
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        Penalties up to 2% of global turnover
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        Personal liability for management
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Velocity Advantage
                    </h3>
                    <ul className="space-y-2 text-emerald-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        93% automation across both frameworks
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Real-time incident detection and reporting
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Automated third-party risk management
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Continuous resilience testing
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Framework Comparison */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">DORA vs NIS2: Key Differences</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {complianceFrameworks.map((framework, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-2 rounded-lg ${
                        framework.framework === 'DORA' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        <Flag className={`w-6 h-6 ${
                          framework.framework === 'DORA' ? 'text-blue-600' : 'text-purple-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-slate-900">{framework.framework}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            framework.framework === 'DORA' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {framework.automation}% Automated
                          </span>
                        </div>
                        <h5 className="font-medium text-slate-800 mb-2">{framework.fullName}</h5>
                        <p className="text-sm text-slate-600 mb-3">{framework.scope}</p>
                        <div className="text-sm font-medium text-red-700 bg-red-50 px-3 py-1 rounded mb-3">
                          Deadline: {framework.deadline}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {framework.requirements.map((req, reqIndex) => (
                        <div key={reqIndex} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            framework.framework === 'DORA' ? 'text-blue-500' : 'text-purple-500'
                          }`} />
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Affected Sectors */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Affected Sectors & Entities</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    DORA Entities
                  </h4>
                  <div className="space-y-2 text-blue-700 text-sm">
                    <div>• Credit institutions</div>
                    <div>• Investment firms</div>
                    <div>• Insurance undertakings</div>
                    <div>• Central counterparties</div>
                    <div>• Trade repositories</div>
                    <div>• Crypto-asset service providers</div>
                    <div>• Critical ICT third-party providers</div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    NIS2 Essential Entities
                  </h4>
                  <div className="space-y-2 text-purple-700 text-sm">
                    <div>• Energy sector</div>
                    <div>• Transport</div>
                    <div>• Banking & financial markets</div>
                    <div>• Health sector</div>
                    <div>• Drinking water supply</div>
                    <div>• Digital infrastructure</div>
                    <div>• Space sector</div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h4 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    NIS2 Important Entities
                  </h4>
                  <div className="space-y-2 text-emerald-700 text-sm">
                    <div>• Postal and courier services</div>
                    <div>• Waste management</div>
                    <div>• Chemical industry</div>
                    <div>• Food production</div>
                    <div>• Manufacturing</div>
                    <div>• Digital providers</div>
                    <div>• Research organizations</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Velocity EU Compliance Success Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">97.8%</div>
                  <div className="text-blue-100">Incident detection rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">45</div>
                  <div className="text-blue-100">Days to compliance</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">€2.8M</div>
                  <div className="text-blue-100">Average penalty avoidance</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">180+</div>
                  <div className="text-blue-100">EU entities protected</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Framework Section */}
        {activeSection === 'framework' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Critical Controls & Requirements</h3>
              <p className="text-slate-600 mb-8">
                Both DORA and NIS2 require comprehensive ICT risk management, incident response, 
                and operational resilience measures. Our AI agents automate compliance across 
                all critical control areas.
              </p>
              
              <div className="space-y-4">
                {criticalControls.map((control) => (
                  <div key={control.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{control.id} - {control.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            control.framework === 'DORA' ? 'bg-blue-100 text-blue-800' :
                            control.framework === 'NIS2' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {control.framework}
                          </span>
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                            {control.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            control.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                            control.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {control.riskLevel.toUpperCase()}
                          </span>
                          {control.automated && (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                              Automated
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{control.description}</p>
                        <div className="text-sm text-slate-500">
                          Managed by: {control.aiAgent}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reporting Requirements */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Incident Reporting Timeline</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-4">DORA Reporting</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">1</div>
                      <div>
                        <div className="font-medium text-blue-800">Initial Report: 4 hours</div>
                        <div className="text-sm text-blue-600">Major incident notification to competent authorities</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">2</div>
                      <div>
                        <div className="font-medium text-blue-800">Intermediate Report: Monthly</div>
                        <div className="text-sm text-blue-600">Status updates during prolonged incidents</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">3</div>
                      <div>
                        <div className="font-medium text-blue-800">Final Report: 3 months</div>
                        <div className="text-sm text-blue-600">Comprehensive incident analysis and lessons learned</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-800 mb-4">NIS2 Reporting</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">1</div>
                      <div>
                        <div className="font-medium text-purple-800">Early Warning: 24 hours</div>
                        <div className="text-sm text-purple-600">Significant incident notification</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">2</div>
                      <div>
                        <div className="font-medium text-purple-800">Incident Report: 72 hours</div>
                        <div className="text-sm text-purple-600">Detailed incident information</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">3</div>
                      <div>
                        <div className="font-medium text-purple-800">Final Report: 1 month</div>
                        <div className="text-sm text-purple-600">Complete incident analysis</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Automation Section */}
        {activeSection === 'automation' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">EU Compliance AI Agent Framework</h3>
              <p className="text-slate-600 mb-8">
                Our 9 specialized AI agents provide comprehensive automation for both DORA and NIS2 requirements, 
                from ICT risk management to incident response and third-party oversight.
              </p>

              <div className="grid gap-6">
                {aiAgents.map((agent) => (
                  <div key={agent.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">{agent.name}</h4>
                        <p className="text-slate-600 text-sm mb-3">{agent.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                          <span>Frameworks: {agent.frameworks.join(', ')}</span>
                          <span>{agent.evidenceTypes} evidence types</span>
                        </div>
                        <div className="flex gap-2">
                          {agent.frameworks.map((framework) => (
                            <span key={framework} className={`px-2 py-1 rounded-full text-xs font-medium ${
                              framework === 'DORA' ? 'bg-blue-100 text-blue-800' :
                              framework === 'NIS2' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {framework}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-6 text-center">
                        <div className="text-2xl font-bold text-blue-600">{agent.automationLevel}%</div>
                        <div className="text-xs text-slate-500">Automated</div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${agent.automationLevel}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Monitoring */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Real-time Operational Resilience</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Continuous Monitoring</h4>
                  <div className="space-y-3">
                    {[
                      { capability: 'ICT System Health', status: 'active', coverage: '100%' },
                      { capability: 'Third-Party Service Status', status: 'active', coverage: '98%' },
                      { capability: 'Threat Intelligence', status: 'active', coverage: '100%' },
                      { capability: 'Incident Detection', status: 'active', coverage: '97%' },
                      { capability: 'Resilience Testing', status: 'active', coverage: '93%' },
                      { capability: 'Vulnerability Scanning', status: 'active', coverage: '100%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
                      { area: 'ICT Risk Management', percentage: 96, automated: true },
                      { area: 'Incident Response', percentage: 97, automated: true },
                      { area: 'Third-Party Oversight', percentage: 92, automated: true },
                      { area: 'Resilience Testing', percentage: 93, automated: true },
                      { area: 'Threat Intelligence', percentage: 95, automated: true },
                      { area: 'Governance & Reporting', percentage: 91, automated: false }
                    ].map((area, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            {area.area}
                            {area.automated && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                Automated
                              </span>
                            )}
                          </span>
                          <span className="text-sm text-slate-600">{area.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
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
              <h3 className="text-2xl font-bold text-slate-900 mb-6">EU Compliance Implementation Roadmap</h3>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileSearch className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Assessment</h4>
                  <p className="text-sm text-slate-600">ICT asset inventory and risk assessment</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Protection</h4>
                  <p className="text-sm text-slate-600">ICT risk management and controls deployment</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Monitoring</h4>
                  <p className="text-sm text-slate-600">Continuous resilience and compliance monitoring</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Critical Deadlines
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded p-4">
                    <h5 className="font-medium text-red-800">NIS2 Enforcement</h5>
                    <div className="text-sm text-red-600">October 17, 2024 - Already in effect</div>
                  </div>
                  <div className="bg-white rounded p-4">
                    <h5 className="font-medium text-red-800">DORA Application</h5>
                    <div className="text-sm text-red-600">January 17, 2025 - 90+ days remaining</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Implementation Checklist</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Complete ICT asset and service inventory',
                    'Conduct comprehensive risk assessment',
                    'Establish ICT risk management framework',
                    'Deploy AI agents for automated monitoring',
                    'Implement incident detection and response',
                    'Set up third-party risk management',
                    'Configure automated reporting systems',
                    'Establish business continuity procedures',
                    'Implement digital resilience testing',
                    'Begin continuous compliance monitoring'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Penalty & Risk Comparison */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Penalty Risk & Mitigation</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-semibold text-red-800 mb-4">Non-Compliance Penalties</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-red-700">DORA penalties:</span>
                      <span className="font-semibold text-red-800">€1M or 1% turnover</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">NIS2 penalties:</span>
                      <span className="font-semibold text-red-800">€10M or 2% turnover</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Management liability:</span>
                      <span className="font-semibold text-red-800">Personal sanctions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Business impact:</span>
                      <span className="font-semibold text-red-800">Operational disruption</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-4">Velocity Protection</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Implementation:</span>
                      <span className="font-semibold text-blue-800">45 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Platform cost:</span>
                      <span className="font-semibold text-blue-800">€65K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Risk reduction:</span>
                      <span className="font-semibold text-blue-800">93%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">ROI:</span>
                      <span className="font-semibold text-blue-800">4,200%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for EU Cybersecurity Compliance?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join 180+ EU entities achieving DORA and NIS2 compliance with Velocity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Flag className="w-5 h-5" />
              Start EU Assessment
            </button>
            <button
              onClick={() => navigate('/velocity/demo/financial-dora')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              View Financial Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DORAGuide;