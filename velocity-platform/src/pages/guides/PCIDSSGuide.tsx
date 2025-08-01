import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
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
  Activity,
  Network,
  Eye,
  Search,
  Building,
  TrendingUp,
  Award,
  Users,
  Server
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface PCIRequirement {
  id: string;
  name: string;
  description: string;
  automated: boolean;
  evidenceTypes: number;
  riskLevel: 'low' | 'medium' | 'high';
  category: string;
}

interface ComplianceLevel {
  level: string;
  transactionVolume: string;
  requirements: string[];
  validationMethod: string;
  frequency: string;
}

const PCIDSSGuide: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'requirements' | 'automation' | 'implementation'>('overview');

  const pciRequirements: PCIRequirement[] = [
    {
      id: '1',
      name: 'Install and maintain firewall configuration',
      description: 'Protect cardholder data with properly configured firewalls',
      automated: true,
      evidenceTypes: 15,
      riskLevel: 'high',
      category: 'Network Security'
    },
    {
      id: '2',
      name: 'Do not use vendor-supplied defaults',
      description: 'Change default passwords and security parameters',
      automated: true,
      evidenceTypes: 12,
      riskLevel: 'high',
      category: 'Network Security'
    },
    {
      id: '3',
      name: 'Protect stored cardholder data',
      description: 'Encrypt stored cardholder data and secure storage',
      automated: true,
      evidenceTypes: 18,
      riskLevel: 'high',
      category: 'Data Protection'
    },
    {
      id: '4',
      name: 'Encrypt transmission of cardholder data',
      description: 'Secure cardholder data during transmission over networks',
      automated: true,
      evidenceTypes: 10,
      riskLevel: 'high',
      category: 'Data Protection'
    },
    {
      id: '5',
      name: 'Protect against malware',
      description: 'Use and regularly update anti-virus software',
      automated: true,
      evidenceTypes: 8,
      riskLevel: 'medium',
      category: 'System Security'
    },
    {
      id: '6',
      name: 'Develop secure systems and applications',
      description: 'Implement secure development practices',
      automated: false,
      evidenceTypes: 14,
      riskLevel: 'high',
      category: 'System Security'
    }
  ];

  const complianceLevels: ComplianceLevel[] = [
    {
      level: 'Level 1',
      transactionVolume: '6M+ transactions annually',
      requirements: ['Annual on-site assessment', 'Quarterly network scans', 'Attestation of Compliance'],
      validationMethod: 'Qualified Security Assessor (QSA)',
      frequency: 'Annual'
    },
    {
      level: 'Level 2',
      transactionVolume: '1M-6M transactions annually',
      requirements: ['Annual Self-Assessment Questionnaire', 'Quarterly network scans', 'Attestation of Compliance'],
      validationMethod: 'Self-Assessment Questionnaire (SAQ)',
      frequency: 'Annual'
    },
    {
      level: 'Level 3',
      transactionVolume: '20K-1M transactions annually',
      requirements: ['Annual Self-Assessment Questionnaire', 'Quarterly network scans'],
      validationMethod: 'Self-Assessment Questionnaire (SAQ)',
      frequency: 'Annual'
    },
    {
      level: 'Level 4',
      transactionVolume: 'Less than 20K transactions annually',
      requirements: ['Annual Self-Assessment Questionnaire', 'Quarterly network scans (if applicable)'],
      validationMethod: 'Self-Assessment Questionnaire (SAQ)',
      frequency: 'Annual'
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
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Intermediate Guide</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              PCI DSS
              <span className="block text-blue-400">Automation</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Payment card industry compliance made simple with continuous monitoring. 
              Secure payment processing with 89% automation and real-time threat detection.
            </p>

            <div className="flex items-center justify-center gap-8 mb-8 text-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>10 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>7/10 AI Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>89% Automation Rate</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start PCI DSS Assessment
              </button>
              <button 
                onClick={() => navigate('/velocity/demo/fintech-multi-framework')}
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
              { id: 'requirements', label: 'PCI DSS Requirements', icon: Shield },
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">What is PCI DSS?</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-slate-600 mb-6">
                  The Payment Card Industry Data Security Standard (PCI DSS) is a set of security standards 
                  designed to ensure that all companies that accept, process, store, or transmit credit card 
                  information maintain a secure environment. Compliance is mandatory for any business handling 
                  cardholder data.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Business Impact
                    </h3>
                    <ul className="space-y-2 text-emerald-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Avoid fines up to $100,000 per month for non-compliance
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Prevent data breaches and associated costs
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Maintain customer trust and brand reputation
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Enable secure payment processing growth
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
                        3-month compliance vs 12+ months traditional
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        89% automation of compliance monitoring
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        Continuous network scanning and vulnerability management
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        Real-time cardholder data protection monitoring
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Levels */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">PCI DSS Compliance Levels</h3>
              <div className="grid gap-6">
                {complianceLevels.map((level, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{level.level}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {level.transactionVolume}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-slate-700">Validation Method:</span>
                            <p className="text-slate-600">{level.validationMethod}</p>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Frequency:</span>
                            <p className="text-slate-600">{level.frequency}</p>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">Requirements:</span>
                            <ul className="text-slate-600 mt-1">
                              {level.requirements.map((req, reqIndex) => (
                                <li key={reqIndex} className="text-xs">• {req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 12 Requirements Overview */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">12 Core PCI DSS Requirements</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { req: '1-2', category: 'Network Security', icon: Network, count: 2 },
                  { req: '3-4', category: 'Data Protection', icon: Lock, count: 2 },
                  { req: '5-6', category: 'System Security', icon: Server, count: 2 },
                  { req: '7-8', category: 'Access Control', icon: Users, count: 2 },
                  { req: '9', category: 'Physical Security', icon: Building, count: 1 },
                  { req: '10-12', category: 'Monitoring & Testing', icon: Eye, count: 3 }
                ].map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Requirements {category.req}</h4>
                          <p className="text-sm text-slate-600">{category.category}</p>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">
                        {category.count} requirement{category.count > 1 ? 's' : ''} in this category
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Velocity PCI DSS Success Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">97.5%</div>
                  <div className="text-blue-100">Compliance Pass Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">3</div>
                  <div className="text-blue-100">Months to Compliance</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">€85K</div>
                  <div className="text-blue-100">Savings vs Traditional</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">200+</div>
                  <div className="text-blue-100">Merchants Compliant</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requirements Section */}
        {activeSection === 'requirements' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Detailed PCI DSS Requirements</h3>
              <p className="text-slate-600 mb-8">
                The 12 PCI DSS requirements are organized into 6 categories to provide comprehensive 
                protection for cardholder data. Our AI agents automate compliance monitoring and 
                evidence collection for each requirement.
              </p>
              
              <div className="space-y-4">
                {pciRequirements.map((requirement) => (
                  <div key={requirement.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">
                            Requirement {requirement.id}: {requirement.name}
                          </h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {requirement.category}
                          </span>
                          {requirement.automated && (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                              Automated
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            requirement.riskLevel === 'low' ? 'bg-emerald-100 text-emerald-800' :
                            requirement.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {requirement.riskLevel} risk
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{requirement.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>{requirement.evidenceTypes} evidence types</span>
                          <span>Continuous monitoring</span>
                          <span>Real-time alerts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cardholder Data Environment */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Cardholder Data Environment (CDE) Protection</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Data Types Protected</h4>
                  <div className="space-y-3">
                    {[
                      { type: 'Primary Account Number (PAN)', sensitivity: 'Critical', protection: 'Encryption required' },
                      { type: 'Cardholder Name', sensitivity: 'Sensitive', protection: 'Access controls' },
                      { type: 'Expiration Date', sensitivity: 'Sensitive', protection: 'Secure storage' },
                      { type: 'Service Code', sensitivity: 'Sensitive', protection: 'Restricted access' },
                      { type: 'Sensitive Authentication Data', sensitivity: 'Prohibited', protection: 'Never store' }
                    ].map((data, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{data.type}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            data.sensitivity === 'Critical' ? 'bg-red-100 text-red-800' :
                            data.sensitivity === 'Sensitive' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {data.sensitivity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{data.protection}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Security Controls</h4>
                  <div className="space-y-4">
                    {[
                      { control: 'Network Segmentation', status: 98, description: 'Isolate CDE from other networks' },
                      { control: 'Data Encryption', status: 96, description: 'Encrypt data at rest and in transit' },
                      { control: 'Access Controls', status: 94, description: 'Restrict access based on business need' },
                      { control: 'Vulnerability Management', status: 92, description: 'Regular scans and patching' },
                      { control: 'Security Monitoring', status: 99, description: 'Continuous monitoring and logging' }
                    ].map((control, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{control.control}</span>
                          <span className="text-sm text-slate-600">{control.status}% coverage</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${control.status}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500">{control.description}</p>
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
            {/* AI Agents for PCI DSS */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">7 AI Agents for PCI DSS Compliance</h3>
              <p className="text-slate-600 mb-8">
                Our specialized AI agents work together to automate PCI DSS compliance activities, 
                from network scanning to cardholder data protection monitoring.
              </p>

              <div className="grid gap-6">
                {[
                  {
                    name: 'Network Security Agent',
                    description: 'Automated firewall configuration monitoring and network segmentation validation',
                    automation: 95,
                    requirements: ['Req 1', 'Req 2'],
                    capabilities: ['Firewall rule analysis', 'Network segmentation testing', 'Default configuration detection']
                  },
                  {
                    name: 'Data Protection Agent',
                    description: 'Cardholder data discovery, classification, and encryption monitoring',
                    automation: 92,
                    requirements: ['Req 3', 'Req 4'],
                    capabilities: ['Data discovery scanning', 'Encryption validation', 'Transmission security monitoring']
                  },
                  {
                    name: 'Vulnerability Management Agent',
                    description: 'Continuous vulnerability scanning and patch management',
                    automation: 89,
                    requirements: ['Req 5', 'Req 6'],
                    capabilities: ['Vulnerability scanning', 'Malware detection', 'Secure development validation']
                  },
                  {
                    name: 'Access Control Agent',
                    description: 'User access provisioning, authentication, and authorization monitoring',
                    automation: 94,
                    requirements: ['Req 7', 'Req 8'],
                    capabilities: ['Access provisioning', 'Multi-factor authentication', 'User activity monitoring']
                  },
                  {
                    name: 'Physical Security Agent',
                    description: 'Physical access monitoring and media handling compliance',
                    automation: 85,
                    requirements: ['Req 9'],
                    capabilities: ['Physical access logging', 'Media destruction tracking', 'Visitor management']
                  },
                  {
                    name: 'Monitoring Agent',
                    description: 'Security event monitoring, logging, and incident detection',
                    automation: 98,
                    requirements: ['Req 10'],
                    capabilities: ['Log aggregation', 'Event correlation', 'Anomaly detection', 'Audit trail management']
                  },
                  {
                    name: 'Testing Agent',
                    description: 'Automated security testing and vulnerability assessments',
                    automation: 87,
                    requirements: ['Req 11', 'Req 12'],
                    capabilities: ['Penetration testing', 'Security assessments', 'Policy compliance validation']
                  }
                ].map((agent, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">{agent.name}</h4>
                        <p className="text-slate-600 text-sm mb-3">{agent.description}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-blue-600 text-xs font-medium">
                            Covers: {agent.requirements.join(', ')}
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

            {/* Continuous Monitoring Dashboard */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Real-time Compliance Monitoring</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h4 className="font-semibold text-emerald-800 mb-4">Network Security</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">98.2%</div>
                    <div className="text-emerald-700 text-sm">Firewall Rules Compliant</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700">Active firewalls</span>
                      <span className="text-emerald-800 font-medium">12/12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700">Segmentation effective</span>
                      <span className="text-emerald-800 font-medium">Yes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700">Default configs</span>
                      <span className="text-emerald-800 font-medium">0 found</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-4">Data Protection</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">96.8%</div>
                    <div className="text-blue-700 text-sm">Cardholder Data Encrypted</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Encrypted stores</span>
                      <span className="text-blue-800 font-medium">8/8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Secure transmission</span>
                      <span className="text-blue-800 font-medium">100%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Key management</span>
                      <span className="text-blue-800 font-medium">Compliant</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h4 className="font-semibold text-amber-800 mb-4">Vulnerability Status</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">2</div>
                    <div className="text-amber-700 text-sm">Critical Vulnerabilities</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Last scan</span>
                      <span className="text-amber-800 font-medium">2 hours ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Patch compliance</span>
                      <span className="text-amber-800 font-medium">94%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Anti-virus updated</span>
                      <span className="text-amber-800 font-medium">Yes</span>
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
              <h3 className="text-2xl font-bold text-slate-900 mb-6">PCI DSS Implementation Roadmap</h3>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Assessment</h4>
                  <p className="text-sm text-slate-600">Cardholder data discovery and gap analysis</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Protection</h4>
                  <p className="text-sm text-slate-600">Security controls and monitoring deployment</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Validation</h4>
                  <p className="text-sm text-slate-600">Testing and compliance validation</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    phase: 'Phase 1: Discovery & Scoping (2-3 weeks)',
                    description: 'Identify cardholder data flows and define compliance scope',
                    activities: [
                      'Cardholder data discovery across all systems',
                      'Network diagram creation and validation',
                      'Scope definition and boundary establishment',
                      'Initial risk assessment and gap analysis'
                    ],
                    automation: 90
                  },
                  {
                    phase: 'Phase 2: Security Implementation (6-8 weeks)',
                    description: 'Deploy security controls and protection mechanisms',
                    activities: [
                      'Network segmentation and firewall configuration',
                      'Data encryption and key management setup',
                      'Access control and authentication systems',
                      'Vulnerability management and monitoring tools'
                    ],
                    automation: 85
                  },
                  {
                    phase: 'Phase 3: Testing & Validation (2-3 weeks)',
                    description: 'Validate controls and prepare for assessment',
                    activities: [
                      'Penetration testing and vulnerability assessments',
                      'Security control effectiveness testing',
                      'Documentation review and evidence compilation',
                      'Self-assessment questionnaire completion'
                    ],
                    automation: 88
                  }
                ].map((phase, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{phase.phase}</h4>
                        <p className="text-slate-600 text-sm">{phase.description}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{phase.automation}%</div>
                        <div className="text-xs text-slate-500">Automated</div>
                      </div>
                    </div>
                    <ul className="space-y-2 ml-11">
                      {phase.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="text-sm text-slate-600 flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Analysis */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Investment & ROI Analysis</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-semibold text-red-800 mb-4">Non-Compliance Costs</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-red-700">Monthly fines:</span>
                      <span className="font-semibold text-red-800">Up to €100K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Data breach costs:</span>
                      <span className="font-semibold text-red-800">€4.45M average</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Traditional consulting:</span>
                      <span className="font-semibold text-red-800">€150K+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Implementation time:</span>
                      <span className="font-semibold text-red-800">12+ months</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h4 className="font-semibold text-emerald-800 mb-4">Velocity ROI</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Implementation cost:</span>
                      <span className="font-semibold text-emerald-800">€25K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Time to compliance:</span>
                      <span className="font-semibold text-emerald-800">3 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Ongoing monitoring:</span>
                      <span className="font-semibold text-emerald-800">€8K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Total 3-year savings:</span>
                      <span className="font-semibold text-emerald-800">€85K+</span>
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
            Ready for PCI DSS Compliance?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Secure your payment processing with automated compliance monitoring and protection
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
              onClick={() => navigate('/velocity/demo/fintech-multi-framework')}
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

export default PCIDSSGuide;