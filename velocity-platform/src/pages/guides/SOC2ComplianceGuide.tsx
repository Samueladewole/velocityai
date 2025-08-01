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
  Globe
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface AIAgent {
  id: string;
  name: string;
  description: string;
  automationLevel: number;
  controls: string[];
  evidenceTypes: number;
}

interface SOCControl {
  id: string;
  category: string;
  name: string;
  description: string;
  automated: boolean;
  aiAgent: string;
  evidenceCount: number;
}

const SOC2ComplianceGuide: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'framework' | 'automation' | 'implementation'>('overview');

  const aiAgents: AIAgent[] = [
    {
      id: 'access-control',
      name: 'Access Control Agent',
      description: 'Monitors and manages user access across all systems with real-time authentication tracking',
      automationLevel: 98,
      controls: ['CC6.1', 'CC6.2', 'CC6.3'],
      evidenceTypes: 24
    },
    {
      id: 'system-operations',
      name: 'System Operations Agent',
      description: 'Continuous monitoring of system availability, performance, and incident response',
      automationLevel: 95,
      controls: ['CC7.1', 'CC7.2', 'A1.1'],
      evidenceTypes: 18
    },
    {
      id: 'change-management',
      name: 'Change Management Agent',
      description: 'Tracks all system changes, deployments, and configuration modifications',
      automationLevel: 92,
      controls: ['CC8.1', 'PI1.1'],
      evidenceTypes: 15
    },
    {
      id: 'data-protection',
      name: 'Data Protection Agent',
      description: 'Ensures data encryption, backup integrity, and confidentiality controls',
      automationLevel: 96,
      controls: ['C1.1', 'C1.2'],
      evidenceTypes: 21
    },
    {
      id: 'compliance-monitoring',
      name: 'Compliance Monitoring Agent',
      description: 'Real-time compliance status tracking and gap identification',
      automationLevel: 94,
      controls: ['CC1.1', 'CC2.1'],
      evidenceTypes: 12
    }
  ];

  const socControls: SOCControl[] = [
    {
      id: 'CC1.1',
      category: 'Control Environment',
      name: 'Organizational Structure',
      description: 'Management establishes structures, reporting lines, and appropriate authorities',
      automated: true,
      aiAgent: 'Compliance Monitoring Agent',
      evidenceCount: 8
    },
    {
      id: 'CC6.1',
      category: 'Logical Access',
      name: 'Access Authorization',
      description: 'Logical access security measures restrict unauthorized access',
      automated: true,
      aiAgent: 'Access Control Agent',
      evidenceCount: 15
    },
    {
      id: 'CC7.1',
      category: 'System Operations',
      name: 'System Monitoring',
      description: 'System operations are monitored to detect processing deviations',
      automated: true,
      aiAgent: 'System Operations Agent',
      evidenceCount: 22
    },
    {
      id: 'A1.1',
      category: 'Availability',
      name: 'Availability Monitoring',
      description: 'System availability and performance are monitored',
      automated: true,
      aiAgent: 'System Operations Agent',
      evidenceCount: 18
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
              <span className="text-blue-400 font-semibold text-lg">Intermediate Guide</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              SOC 2 Type II
              <span className="block text-blue-400">Compliance Guide</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Complete automation framework for SOC 2 compliance with Velocity's 10 AI agents. 
              Achieve certification in 45 days with 95% automation rate.
            </p>

            <div className="flex items-center justify-center gap-8 mb-8 text-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>15 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>10/10 AI Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>95% Automation Rate</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start SOC 2 Assessment
              </button>
              <button 
                onClick={() => navigate('/velocity/demo/saas-soc2')}
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
              { id: 'framework', label: 'SOC 2 Framework', icon: Shield },
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">What is SOC 2 Type II?</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-slate-600 mb-6">
                  SOC 2 Type II is the gold standard for SaaS security compliance. Unlike Type I which evaluates 
                  controls at a point in time, Type II examines the operational effectiveness of controls over 
                  a minimum 3-month period. It's essential for enterprise sales and customer trust.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Why SOC 2 Matters
                    </h3>
                    <ul className="space-y-2 text-emerald-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Enterprise customers require SOC 2 for vendor approval
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Increases deal velocity and contract values
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Demonstrates operational maturity to investors
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        Reduces cyber insurance premiums
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
                        45-day implementation vs 8-12 months traditional
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        95% evidence collection automation
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        AI-generated policies and procedures
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

            {/* Trust Services Categories */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">SOC 2 Trust Services Categories</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    category: 'Security',
                    icon: Shield,
                    required: true,
                    description: 'Protection against unauthorized access',
                    controls: 32
                  },
                  {
                    category: 'Availability',
                    icon: Activity,
                    required: false,
                    description: 'System operational availability',
                    controls: 12
                  },
                  {
                    category: 'Processing Integrity',
                    icon: Settings,
                    required: false,
                    description: 'System processing accuracy',
                    controls: 8
                  },
                  {
                    category: 'Confidentiality',
                    icon: Lock,
                    required: false,
                    description: 'Information designated as confidential',
                    controls: 6
                  },
                  {
                    category: 'Privacy',
                    icon: Users,
                    required: false,
                    description: 'Personal information collection and use',
                    controls: 6
                  }
                ].map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-900">{category.category}</h4>
                            {category.required && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{category.description}</p>
                          <div className="text-sm text-slate-500">{category.controls} controls</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Velocity SOC 2 Success Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">96.8%</div>
                  <div className="text-blue-100">First-time pass rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">45</div>
                  <div className="text-blue-100">Average days to audit</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">€120K</div>
                  <div className="text-blue-100">Savings vs consulting</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-blue-100">Companies certified</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Framework Section */}
        {activeSection === 'framework' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">SOC 2 Control Framework</h3>
              <p className="text-slate-600 mb-8">
                SOC 2 Type II requires implementing and testing 64 controls across the five Trust Services Categories. 
                Our AI agents automate evidence collection and continuous monitoring for each control.
              </p>
              
              <div className="space-y-4">
                {socControls.map((control) => (
                  <div key={control.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{control.id} - {control.name}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {control.category}
                          </span>
                          {control.automated && (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                              Automated
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{control.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Managed by: {control.aiAgent}</span>
                          <span>{control.evidenceCount} evidence types</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Implementation Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">45-Day Implementation Timeline</h3>
              <div className="space-y-6">
                {[
                  {
                    week: 'Week 1',
                    phase: 'Assessment & Setup',
                    tasks: ['Gap analysis', 'System integrations', 'Policy templates'],
                    status: 'completed'
                  },
                  {
                    week: 'Weeks 2-4',
                    phase: 'Implementation',
                    tasks: ['Control deployment', 'Evidence automation', 'Staff training'],
                    status: 'in-progress'
                  },
                  {
                    week: 'Weeks 5-6',
                    phase: 'Testing Period',
                    tasks: ['Type II testing', 'Gap remediation', 'Pre-audit prep'],
                    status: 'upcoming'
                  },
                  {
                    week: 'Week 7',
                    phase: 'Audit Ready',
                    tasks: ['Evidence package', 'Auditor coordination', 'Final review'],
                    status: 'upcoming'
                  }
                ].map((phase, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        phase.status === 'completed' ? 'bg-emerald-500' :
                        phase.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-300'
                      }`}></div>
                      {index < 3 && <div className="w-0.5 h-12 bg-slate-200 mt-2"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-900">{phase.week}: {phase.phase}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          phase.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          phase.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {phase.status}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {phase.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="text-sm text-slate-600 flex items-center gap-2">
                            <CheckCircle className={`w-3 h-3 ${
                              phase.status === 'completed' ? 'text-emerald-500' :
                              phase.status === 'in-progress' ? 'text-blue-500' : 'text-slate-300'
                            }`} />
                            {task}
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
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">AI Agent Automation Framework</h3>
              <p className="text-slate-600 mb-8">
                Our 10 specialized AI agents work together to automate 95% of SOC 2 compliance activities, 
                from evidence collection to continuous monitoring and gap remediation.
              </p>

              <div className="grid gap-6">
                {aiAgents.map((agent) => (
                  <div key={agent.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">{agent.name}</h4>
                        <p className="text-slate-600 text-sm mb-3">{agent.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Controls: {agent.controls.join(', ')}</span>
                          <span>{agent.evidenceTypes} evidence types</span>
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

            {/* Evidence Automation */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Automated Evidence Collection</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Connected Systems</h4>
                  <div className="space-y-3">
                    {[
                      { system: 'AWS CloudTrail', evidence: 45, status: 'active' },
                      { system: 'Google Workspace', evidence: 28, status: 'active' },
                      { system: 'GitHub Enterprise', evidence: 22, status: 'active' },
                      { system: 'Okta SSO', evidence: 18, status: 'active' },
                      { system: 'DataDog Monitoring', evidence: 17, status: 'active' },
                      { system: 'PagerDuty', evidence: 12, status: 'active' }
                    ].map((system, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="font-medium">{system.system}</span>
                        </div>
                        <div className="text-sm text-slate-600">
                          {system.evidence} evidence types
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Evidence Categories</h4>
                  <div className="space-y-4">
                    {[
                      { category: 'Access Controls', percentage: 98, automated: true },
                      { category: 'System Operations', percentage: 95, automated: true },
                      { category: 'Change Management', percentage: 92, automated: true },
                      { category: 'Data Protection', percentage: 96, automated: true },
                      { category: 'Risk Management', percentage: 85, automated: false }
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
          </div>
        )}

        {/* Implementation Section */}
        {activeSection === 'implementation' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Implementation Roadmap</h3>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Assessment</h4>
                  <p className="text-sm text-slate-600">Gap analysis and readiness evaluation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Automation</h4>
                  <p className="text-sm text-slate-600">AI agent deployment and integration</p>
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
                <h4 className="font-medium text-slate-900 mb-4">Getting Started Checklist</h4>
                <div className="space-y-3">
                  {[
                    'Complete SOC 2 readiness assessment',
                    'Review system architecture and data flows',
                    'Identify key stakeholders and responsibilities',
                    'Schedule AI agent deployment and integration',
                    'Set up automated evidence collection',
                    'Begin Type II testing period',
                    'Prepare for third-party audit'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cost Comparison */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Cost & Time Comparison</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-semibold text-red-800 mb-4">Traditional Approach</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-red-700">Timeline:</span>
                      <span className="font-semibold text-red-800">8-12 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Consulting fees:</span>
                      <span className="font-semibold text-red-800">€150K+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Internal effort:</span>
                      <span className="font-semibold text-red-800">2-3 FTEs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Automation:</span>
                      <span className="font-semibold text-red-800">15-30%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h4 className="font-semibold text-emerald-800 mb-4">Velocity Approach</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Timeline:</span>
                      <span className="font-semibold text-emerald-800">45 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Platform cost:</span>
                      <span className="font-semibold text-emerald-800">€30K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Internal effort:</span>
                      <span className="font-semibold text-emerald-800">0.5 FTE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Automation:</span>
                      <span className="font-semibold text-emerald-800">95%</span>
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
            Ready to Achieve SOC 2 in 45 Days?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join 500+ companies that achieved SOC 2 compliance faster and cheaper with Velocity
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
              onClick={() => navigate('/velocity/demo/saas-soc2')}
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

export default SOC2ComplianceGuide;