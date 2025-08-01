import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
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
  Users,
  Building,
  TrendingUp,
  Award,
  Map,
  Scale,
  Eye,
  Search
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface TransferMechanism {
  id: string;
  name: string;
  description: string;
  applicability: string;
  automationLevel: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface GDPRPrinciple {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  aiSupport: boolean;
}

const GDPRTransferGuide: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'mechanisms' | 'automation' | 'implementation'>('overview');

  const transferMechanisms: TransferMechanism[] = [
    {
      id: 'adequacy',
      name: 'Adequacy Decisions',
      description: 'Countries deemed adequate by the European Commission',
      applicability: 'Transfers to 14 adequate countries',
      automationLevel: 98,
      riskLevel: 'low'
    },
    {
      id: 'sccs',
      name: 'Standard Contractual Clauses',
      description: 'New 2021 SCCs with enhanced safeguards',
      applicability: 'Most common mechanism for third countries',
      automationLevel: 95,
      riskLevel: 'medium'
    },
    {
      id: 'bcr',
      name: 'Binding Corporate Rules',
      description: 'Internal data protection rules for multinational groups',
      applicability: 'Large corporate groups only',
      automationLevel: 85,
      riskLevel: 'low'
    },
    {
      id: 'certifications',
      name: 'Approved Certifications',
      description: 'Certification schemes with binding safeguards',
      applicability: 'Limited availability, sector-specific',
      automationLevel: 90,
      riskLevel: 'medium'
    }
  ];

  const gdprPrinciples: GDPRPrinciple[] = [
    {
      id: 'lawfulness',
      name: 'Lawfulness, Fairness, Transparency',
      description: 'Processing must have legal basis and be transparent',
      requirements: ['Valid legal basis', 'Clear privacy notices', 'Fair processing'],
      aiSupport: true
    },
    {
      id: 'purpose-limitation',
      name: 'Purpose Limitation',
      description: 'Data collected for specified, explicit, legitimate purposes',
      requirements: ['Clear purpose specification', 'Compatible use only', 'Purpose documentation'],
      aiSupport: true
    },
    {
      id: 'data-minimisation',
      name: 'Data Minimisation',
      description: 'Adequate, relevant, limited to necessary data',
      requirements: ['Necessity assessment', 'Regular data reviews', 'Deletion procedures'],
      aiSupport: true
    },
    {
      id: 'accuracy',
      name: 'Accuracy',
      description: 'Keep personal data accurate and up to date',
      requirements: ['Regular updates', 'Error correction', 'Data quality controls'],
      aiSupport: true
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
                <Globe className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Advanced Guide</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              GDPR International
              <span className="block text-blue-400">Transfer Solutions</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              AI-powered cross-border transfer compliance with Transfer Impact Assessments 
              and post-Schrems II automation. Navigate complex data transfer regulations with confidence.
            </p>

            <div className="flex items-center justify-center gap-8 mb-8 text-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>14 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>12/10 AI Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>94% Automation Rate</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start GDPR Assessment
              </button>
              <button 
                onClick={() => navigate('/velocity/solutions/gdpr')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                Explore Solutions
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
              { id: 'mechanisms', label: 'Transfer Mechanisms', icon: Globe },
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
            {/* Post-Schrems II Landscape */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Post-Schrems II Compliance Landscape</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-slate-600 mb-6">
                  The Schrems II ruling in July 2020 invalidated Privacy Shield and fundamentally changed 
                  international data transfers. Organizations now face complex legal requirements, Transfer 
                  Impact Assessments (TIAs), and enhanced due diligence obligations.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Post-Schrems II Challenges
                    </h3>
                    <ul className="space-y-2 text-red-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        Privacy Shield invalidation affects US transfers
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        Transfer Impact Assessments now mandatory
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        Enhanced due diligence on government access
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        Case-by-case assessment required for each transfer
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Velocity AI Solutions
                    </h3>
                    <ul className="space-y-2 text-emerald-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Automated Transfer Impact Assessments
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Real-time government surveillance monitoring
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Intelligent mechanism selection and switching
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Continuous compliance monitoring and alerts
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer Complexity Matrix */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Transfer Complexity by Jurisdiction</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    tier: 'Low Risk',
                    color: 'emerald',
                    countries: ['UK', 'Switzerland', 'Canada', 'Japan'],
                    description: 'Adequacy decisions or strong privacy frameworks',
                    complexity: 'Simple'
                  },
                  {
                    tier: 'Medium Risk',
                    color: 'amber',
                    countries: ['Singapore', 'South Korea', 'Brazil', 'Argentina'],
                    description: 'Partial adequacy or developing frameworks',
                    complexity: 'Moderate TIA required'
                  },
                  {
                    tier: 'High Risk',
                    color: 'red',
                    countries: ['USA', 'China', 'India', 'Russia'],
                    description: 'Government surveillance concerns',
                    complexity: 'Complex TIA and safeguards'
                  }
                ].map((tier, index) => (
                  <div key={index} className={`border border-${tier.color}-200 rounded-lg p-6 bg-${tier.color}-50`}>
                    <h4 className={`font-semibold text-${tier.color}-800 mb-3`}>{tier.tier}</h4>
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tier.countries.map((country, idx) => (
                          <span key={idx} className={`px-2 py-1 bg-${tier.color}-100 text-${tier.color}-700 rounded text-xs`}>
                            {country}
                          </span>
                        ))}
                      </div>
                      <p className={`text-sm text-${tier.color}-700 mb-2`}>{tier.description}</p>
                      <p className={`text-xs text-${tier.color}-600 font-medium`}>{tier.complexity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GDPR Principles */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Core GDPR Data Protection Principles</h3>
              <div className="grid gap-4">
                {gdprPrinciples.map((principle) => (
                  <div key={principle.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{principle.name}</h4>
                          {principle.aiSupport && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              AI Supported
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{principle.description}</p>
                        <div className="space-y-1">
                          {principle.requirements.map((req, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-slate-500">
                              <CheckCircle className="w-3 h-3 text-emerald-500" />
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Velocity GDPR Transfer Success Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">94%</div>
                  <div className="text-blue-100">Automation Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">€2M+</div>
                  <div className="text-blue-100">Fines Prevented</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">72%</div>
                  <div className="text-blue-100">Faster TIA Completion</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">300+</div>
                  <div className="text-blue-100">Organizations Protected</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Mechanisms Section */}
        {activeSection === 'mechanisms' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Available Transfer Mechanisms</h3>
              <p className="text-slate-600 mb-8">
                After Schrems II, organizations must carefully evaluate and implement appropriate transfer 
                mechanisms based on destination country, data sensitivity, and government surveillance risks.
              </p>
              
              <div className="grid gap-6">
                {transferMechanisms.map((mechanism) => (
                  <div key={mechanism.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{mechanism.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            mechanism.riskLevel === 'low' ? 'bg-emerald-100 text-emerald-800' :
                            mechanism.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {mechanism.riskLevel} risk
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{mechanism.description}</p>
                        <p className="text-slate-500 text-sm">{mechanism.applicability}</p>
                      </div>
                      <div className="ml-6 text-center">
                        <div className="text-2xl font-bold text-blue-600">{mechanism.automationLevel}%</div>
                        <div className="text-xs text-slate-500">Automated</div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${mechanism.automationLevel}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transfer Impact Assessment */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Transfer Impact Assessment (TIA) Process</h3>
              <div className="space-y-6">
                {[
                  {
                    step: '1. Data Mapping',
                    description: 'Identify all personal data transfers and their purposes',
                    automation: 'Fully Automated',
                    status: 'active'
                  },
                  {
                    step: '2. Legal Basis Assessment',
                    description: 'Evaluate legal basis for processing and transfer',
                    automation: 'AI-Assisted',
                    status: 'active'
                  },
                  {
                    step: '3. Destination Country Analysis',
                    description: 'Assess destination country laws and surveillance risks',
                    automation: 'Real-time Updates',
                    status: 'active'
                  },
                  {
                    step: '4. Safeguards Evaluation',
                    description: 'Determine if additional safeguards are needed',
                    automation: 'AI-Recommended',
                    status: 'active'
                  },
                  {
                    step: '5. Risk Mitigation',
                    description: 'Implement technical and organizational measures',
                    automation: 'Guided Implementation',
                    status: 'active'
                  },
                  {
                    step: '6. Ongoing Monitoring',
                    description: 'Continuous monitoring of transfer conditions',
                    automation: 'Continuous AI',
                    status: 'active'
                  }
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      {index < 5 && <div className="w-0.5 h-12 bg-slate-200 mt-2"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-900">{step.step}</h4>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                          {step.automation}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adequacy Decisions Map */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">EU Adequacy Decisions Status</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4 text-emerald-600">✓ Adequate Countries (14)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Andorra', 'Argentina', 'Canada', 'Faroe Islands',
                      'Guernsey', 'Isle of Man', 'Israel', 'Japan',
                      'Jersey', 'New Zealand', 'South Korea', 'Switzerland',
                      'United Kingdom', 'Uruguay'
                    ].map((country, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span className="text-slate-700">{country}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-4 text-amber-600">⚠ Under Review/Partial</h4>
                  <div className="space-y-2">
                    {[
                      { country: 'USA', status: 'Data Privacy Framework pending', risk: 'High' },
                      { country: 'India', status: 'DPDP Act implementation', risk: 'Medium' },
                      { country: 'Brazil', status: 'LGPD adequacy assessment', risk: 'Medium' },
                      { country: 'Singapore', status: 'Sectoral adequacy possible', risk: 'Low' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          <span className="text-slate-700">{item.country}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.risk === 'High' ? 'bg-red-100 text-red-700' :
                          item.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.risk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Automation Section */}
        {activeSection === 'automation' && (
          <div className="space-y-8">
            {/* AI Agents for GDPR */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">12 AI Agents for GDPR Compliance</h3>
              <p className="text-slate-600 mb-8">
                Our enhanced AI agent framework for GDPR includes specialized agents for transfer assessments, 
                government surveillance monitoring, and post-Schrems II compliance requirements.
              </p>

              <div className="grid gap-6">
                {[
                  {
                    name: 'Transfer Impact Assessment Agent',
                    description: 'Automated TIA generation with real-time risk scoring',
                    automation: 96,
                    specialty: 'Post-Schrems II compliance'
                  },
                  {
                    name: 'Government Surveillance Monitor',
                    description: 'Tracks government access laws and surveillance programs',
                    automation: 94,
                    specialty: 'Legal intelligence and alerts'
                  },
                  {
                    name: 'Data Subject Rights Agent',
                    description: 'Automates DSR processing and response workflows',
                    automation: 98,
                    specialty: 'Rights fulfillment automation'
                  },
                  {
                    name: 'Consent Management Agent',
                    description: 'Dynamic consent collection and preference management',
                    automation: 95,
                    specialty: 'Granular consent controls'
                  },
                  {
                    name: 'Cross-Border Flow Monitor',
                    description: 'Real-time tracking of international data movements',
                    automation: 92,
                    specialty: 'Transfer visibility and control'
                  },
                  {
                    name: 'Adequacy Decision Tracker',
                    description: 'Monitors EU adequacy decisions and regulatory changes',
                    automation: 98,
                    specialty: 'Regulatory intelligence'
                  }
                ].map((agent, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">{agent.name}</h4>
                        <p className="text-slate-600 text-sm mb-2">{agent.description}</p>
                        <span className="text-blue-600 text-xs font-medium">{agent.specialty}</span>
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

            {/* Real-time Monitoring Dashboard */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Real-time Transfer Monitoring</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Active Transfer Streams</h4>
                  <div className="space-y-3">
                    {[
                      { destination: 'USA (AWS)', mechanism: 'SCCs + TIA', volume: '2.4TB', risk: 'Medium' },
                      { destination: 'UK (Office)', mechanism: 'Adequacy', volume: '850GB', risk: 'Low' },
                      { destination: 'Singapore (Support)', mechanism: 'SCCs', volume: '320GB', risk: 'Low' },
                      { destination: 'India (Development)', mechanism: 'SCCs + TIA', volume: '1.1TB', risk: 'High' }
                    ].map((transfer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            transfer.risk === 'Low' ? 'bg-emerald-500' :
                            transfer.risk === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                          } animate-pulse`}></div>
                          <div>
                            <div className="font-medium text-sm">{transfer.destination}</div>
                            <div className="text-xs text-slate-500">{transfer.mechanism}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{transfer.volume}</div>
                          <div className={`text-xs ${
                            transfer.risk === 'Low' ? 'text-emerald-600' :
                            transfer.risk === 'Medium' ? 'text-amber-600' : 'text-red-600'
                          }`}>{transfer.risk}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Recent Compliance Events</h4>
                  <div className="space-y-3">
                    {[
                      { time: '14:23', event: 'New adequacy decision for South Korea updated', type: 'info' },
                      { time: '13:45', event: 'US surveillance law change detected - TIA review triggered', type: 'warning' },
                      { time: '12:30', event: 'Data subject access request processed automatically', type: 'success' },
                      { time: '11:15', event: 'Consent preferences updated for 1,247 users', type: 'info' },
                      { time: '10:00', event: 'Quarterly TIA assessments completed', type: 'success' }
                    ].map((event, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          event.type === 'success' ? 'bg-emerald-500' :
                          event.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="text-xs text-slate-500 mb-1">{event.time}</div>
                          <p className="text-sm text-slate-700">{event.event}</p>
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
              <h3 className="text-2xl font-bold text-slate-900 mb-6">GDPR Implementation Roadmap</h3>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Assessment</h4>
                  <p className="text-sm text-slate-600">Data mapping and transfer impact assessment</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Implementation</h4>
                  <p className="text-sm text-slate-600">Safeguards deployment and mechanism setup</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Monitoring</h4>
                  <p className="text-sm text-slate-600">Continuous compliance monitoring and updates</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Implementation Checklist</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Complete comprehensive data mapping exercise',
                    'Conduct Transfer Impact Assessments for all third countries',
                    'Review and update privacy notices and consent mechanisms',
                    'Implement appropriate transfer mechanisms (SCCs, BCRs, etc.)',
                    'Deploy technical safeguards (encryption, pseudonymization)',
                    'Establish data subject rights fulfillment processes',
                    'Set up cross-border data flow monitoring',
                    'Create incident response procedures for data breaches',
                    'Train staff on GDPR requirements and procedures',
                    'Establish ongoing compliance monitoring systems'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cost & Risk Analysis */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">GDPR Compliance ROI Analysis</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-semibold text-red-800 mb-4">Non-Compliance Risks</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-red-700">Maximum GDPR fine:</span>
                      <span className="font-semibold text-red-800">€20M or 4% revenue</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Average data breach cost:</span>
                      <span className="font-semibold text-red-800">€4.45M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Legal and consulting:</span>
                      <span className="font-semibold text-red-800">€500K+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Reputation damage:</span>
                      <span className="font-semibold text-red-800">Immeasurable</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h4 className="font-semibold text-emerald-800 mb-4">Velocity ROI</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Implementation cost:</span>
                      <span className="font-semibold text-emerald-800">€45K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Time to compliance:</span>
                      <span className="font-semibold text-emerald-800">3 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Ongoing efficiency:</span>
                      <span className="font-semibold text-emerald-800">94% automated</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">5-year savings:</span>
                      <span className="font-semibold text-emerald-800">€2M+</span>
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
            Ready for Post-Schrems II Compliance?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Navigate complex international transfers with confidence using AI-powered GDPR compliance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              Start GDPR Assessment
            </button>
            <button
              onClick={() => navigate('/velocity/solutions/gdpr')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Globe className="w-5 h-5" />
              Explore Solutions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPRTransferGuide;