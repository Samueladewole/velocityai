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
  Brain,
  Eye,
  UserCheck,
  FileSearch,
  Key,
  Monitor,
  Clipboard,
  Cpu,
  Network,
  GitBranch,
  BarChart3
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface AIAgent {
  id: string;
  name: string;
  description: string;
  automationLevel: number;
  aimsControls: string[];
  evidenceTypes: number;
}

interface ISO42001Control {
  id: string;
  category: string;
  name: string;
  description: string;
  automated: boolean;
  aiAgent: string;
  riskLevel: 'high' | 'medium' | 'low';
}

interface AIManagementPhase {
  phase: string;
  title: string;
  description: string;
  controls: string[];
  automation: number;
  duration: string;
}

const ISO42001Guide: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'framework' | 'automation' | 'implementation'>('overview');

  const aiAgents: AIAgent[] = [
    {
      id: 'ai-governance',
      name: 'AI Governance Agent',
      description: 'Establishes and maintains AI governance framework and management system oversight',
      automationLevel: 96,
      aimsControls: ['5.1', '5.2', '6.1'],
      evidenceTypes: 32
    },
    {
      id: 'ai-risk-management',
      name: 'AI Risk Management Agent',
      description: 'Identifies, assesses, and mitigates AI-specific risks throughout the lifecycle',
      automationLevel: 94,
      aimsControls: ['6.2', '7.1', '7.2'],
      evidenceTypes: 28
    },
    {
      id: 'ai-data-governance',
      name: 'AI Data Governance Agent',
      description: 'Manages data quality, provenance, and lifecycle for AI systems',
      automationLevel: 97,
      aimsControls: ['7.3', '7.4', '8.1'],
      evidenceTypes: 35
    },
    {
      id: 'ai-model-management',
      name: 'AI Model Management Agent',
      description: 'Oversees AI model development, validation, and deployment processes',
      automationLevel: 95,
      aimsControls: ['8.2', '8.3', '9.1'],
      evidenceTypes: 31
    },
    {
      id: 'ai-performance-monitoring',
      name: 'AI Performance Monitoring Agent',
      description: 'Continuous monitoring of AI system performance, bias, and effectiveness',
      automationLevel: 98,
      aimsControls: ['9.2', '9.3', '10.1'],
      evidenceTypes: 26
    },
    {
      id: 'ai-transparency',
      name: 'AI Transparency Agent',
      description: 'Ensures AI system explainability, interpretability, and documentation',
      automationLevel: 92,
      aimsControls: ['8.4', '9.4', '10.2'],
      evidenceTypes: 24
    },
    {
      id: 'ai-ethics-compliance',
      name: 'AI Ethics & Compliance Agent',
      description: 'Monitors ethical AI use and regulatory compliance across all AI systems',
      automationLevel: 93,
      aimsControls: ['6.3', '7.5', '10.3'],
      evidenceTypes: 22
    },
    {
      id: 'ai-incident-response',
      name: 'AI Incident Response Agent',
      description: 'Manages AI system incidents, failures, and remediation procedures',
      automationLevel: 91,
      aimsControls: ['10.4', '10.5'],
      evidenceTypes: 19
    },
    {
      id: 'ai-lifecycle-management',
      name: 'AI Lifecycle Management Agent',
      description: 'Manages complete AI system lifecycle from conception to decommissioning',
      automationLevel: 94,
      aimsControls: ['8.5', '9.5', '10.6'],
      evidenceTypes: 29
    },
    {
      id: 'ai-stakeholder-engagement',
      name: 'AI Stakeholder Engagement Agent',
      description: 'Manages stakeholder communication and feedback for AI systems',
      automationLevel: 89,
      aimsControls: ['6.4', '10.7'],
      evidenceTypes: 18
    }
  ];

  const aiManagementPhases: AIManagementPhase[] = [
    {
      phase: 'Planning & Design',
      title: 'AI System Planning and Requirements',
      description: 'Define AI objectives, requirements, and governance framework',
      controls: [
        'AI governance framework establishment',
        'Stakeholder identification and engagement',
        'Risk assessment and impact analysis',
        'Ethical considerations and bias assessment',
        'Data requirements and quality standards'
      ],
      automation: 92,
      duration: '2-4 weeks'
    },
    {
      phase: 'Development & Testing',
      title: 'AI Model Development and Validation',
      description: 'Develop, train, and validate AI models with governance controls',
      controls: [
        'Data collection and preprocessing oversight',
        'Model development and training monitoring',
        'Performance testing and validation',
        'Bias detection and mitigation',
        'Security and privacy controls implementation'
      ],
      automation: 95,
      duration: '4-8 weeks'
    },
    {
      phase: 'Deployment & Operation',
      title: 'AI System Deployment and Monitoring',
      description: 'Deploy AI systems with continuous monitoring and governance',
      controls: [
        'Deployment approval and documentation',
        'Performance monitoring and alerting',
        'User training and support',
        'Incident detection and response',
        'Compliance monitoring and reporting'
      ],
      automation: 97,
      duration: 'Ongoing'
    },
    {
      phase: 'Maintenance & Evolution',
      title: 'AI System Maintenance and Improvement',
      description: 'Ongoing maintenance, updates, and improvement of AI systems',
      controls: [
        'Regular performance reviews',
        'Model retraining and updates',
        'Governance framework updates',
        'Stakeholder feedback integration',
        'Decommissioning planning'
      ],
      automation: 93,
      duration: 'Continuous'
    }
  ];

  const iso42001Controls: ISO42001Control[] = [
    {
      id: '5.1',
      category: 'Leadership',
      name: 'AI Policy',
      description: 'Top management establishes and maintains AI management system policy',
      automated: true,
      aiAgent: 'AI Governance Agent',
      riskLevel: 'high'
    },
    {
      id: '6.2',
      category: 'Planning',
      name: 'AI Risk Assessment',
      description: 'Systematic identification and assessment of AI-related risks',
      automated: true,
      aiAgent: 'AI Risk Management Agent',
      riskLevel: 'high'
    },
    {
      id: '7.3',
      category: 'Support',
      name: 'Data Management',
      description: 'Management of data throughout the AI system lifecycle',
      automated: true,
      aiAgent: 'AI Data Governance Agent',
      riskLevel: 'high'
    },
    {
      id: '8.2',
      category: 'Operation',
      name: 'AI System Development',
      description: 'Controls for AI system design, development, and deployment',
      automated: true,
      aiAgent: 'AI Model Management Agent',
      riskLevel: 'high'
    },
    {
      id: '9.2',
      category: 'Performance',
      name: 'Monitoring and Measurement',
      description: 'Continuous monitoring of AI system performance and effectiveness',
      automated: true,
      aiAgent: 'AI Performance Monitoring Agent',
      riskLevel: 'medium'
    },
    {
      id: '10.1',
      category: 'Improvement',
      name: 'Nonconformity and Corrective Action',
      description: 'Management of AI system nonconformities and corrective actions',
      automated: true,
      aiAgent: 'AI Incident Response Agent',
      riskLevel: 'medium'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-purple-500 rounded-full mr-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="text-purple-400 font-semibold text-lg">Expert Guide</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              ISO 42001
              <span className="block text-purple-400">AI Management</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              World's first AI management system standard with Velocity's 10 specialized AI agents. 
              Achieve responsible AI governance with 94% automation.
            </p>

            <div className="flex items-center justify-center gap-8 mb-8 text-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>16 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>10/10 AI Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>94% Automation Rate</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start AI Assessment
              </button>
              <button 
                onClick={() => navigate('/velocity/demo/ai-governance')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                View AI Demo
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
              { id: 'framework', label: 'ISO 42001 Framework', icon: Brain },
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
                      ? 'bg-purple-50 text-purple-600 border border-purple-200'
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">What is ISO 42001?</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-slate-600 mb-6">
                  ISO 42001 is the world's first international standard for AI management systems. 
                  Published in December 2023, it provides a framework for organizations to develop, 
                  deploy, and use AI systems responsibly while managing associated risks and opportunities.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Why ISO 42001 Matters
                    </h3>
                    <ul className="space-y-2 text-purple-700">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        First international standard for AI governance
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        Demonstrates responsible AI practices to stakeholders
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        Reduces AI-related risks and liability
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        Supports regulatory compliance preparation
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
                        94% automation of AI management controls
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        AI-powered AI governance and monitoring
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        Continuous risk assessment and mitigation
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        Automated compliance reporting and evidence
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* AI System Types */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">AI System Categories & Management</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    category: 'High-Risk AI Systems',
                    icon: AlertCircle,
                    examples: ['Facial recognition', 'Credit scoring', 'Medical diagnosis', 'Autonomous systems'],
                    management: 'Full AIMS implementation required',
                    color: 'red'
                  },
                  {
                    category: 'Medium-Risk AI Systems',
                    icon: Eye,
                    examples: ['Recommendation engines', 'Chatbots', 'Process automation', 'Predictive analytics'],
                    management: 'Enhanced monitoring and controls',
                    color: 'yellow'
                  },
                  {
                    category: 'Low-Risk AI Systems',
                    icon: Settings,
                    examples: ['Basic automation', 'Data processing', 'Simple classification', 'Reporting tools'],
                    management: 'Standard governance controls',
                    color: 'green'
                  }
                ].map((category, index) => {
                  const Icon = category.icon;
                  const colorClasses = {
                    red: 'bg-red-100 text-red-600 border-red-200',
                    yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
                    green: 'bg-green-100 text-green-600 border-green-200'
                  };
                  return (
                    <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-2">{category.category}</h4>
                          <div className="space-y-2 mb-4">
                            {category.examples.map((example, idx) => (
                              <div key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                {example}
                              </div>
                            ))}
                          </div>
                          <div className="text-sm font-medium text-purple-700 bg-purple-50 px-3 py-2 rounded">
                            {category.management}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Velocity ISO 42001 Success Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">99.5%</div>
                  <div className="text-purple-100">AI system uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">60</div>
                  <div className="text-purple-100">Days to certification</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">85%</div>
                  <div className="text-purple-100">Risk reduction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">150+</div>
                  <div className="text-purple-100">AI systems managed</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Framework Section */}
        {activeSection === 'framework' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">ISO 42001 Management System Framework</h3>
              <p className="text-slate-600 mb-8">
                ISO 42001 follows the high-level structure common to all ISO management system standards, 
                with specific requirements for AI management throughout the system lifecycle.
              </p>
              
              <div className="space-y-6">
                {aiManagementPhases.map((phase, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{phase.phase}</h4>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            {phase.automation}% Automated
                          </span>
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                            {phase.duration}
                          </span>
                        </div>
                        <h5 className="font-medium text-slate-800 mb-2">{phase.title}</h5>
                        <p className="text-slate-600 text-sm mb-4">{phase.description}</p>
                        <div className="space-y-2">
                          {phase.controls.map((control, controlIndex) => (
                            <div key={controlIndex} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              {control}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${phase.automation}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Controls */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Critical ISO 42001 Controls</h3>
              <div className="space-y-4">
                {iso42001Controls.map((control) => (
                  <div key={control.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{control.id} - {control.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            control.category === 'Leadership' ? 'bg-purple-100 text-purple-800' :
                            control.category === 'Planning' ? 'bg-blue-100 text-blue-800' :
                            control.category === 'Support' ? 'bg-green-100 text-green-800' :
                            control.category === 'Operation' ? 'bg-orange-100 text-orange-800' :
                            control.category === 'Performance' ? 'bg-teal-100 text-teal-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {control.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            control.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                            control.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {control.riskLevel.toUpperCase()} RISK
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
          </div>
        )}

        {/* Automation Section */}
        {activeSection === 'automation' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">AI Management AI Agent Framework</h3>
              <p className="text-slate-600 mb-8">
                Our 10 specialized AI agents provide comprehensive AI management system automation, 
                from governance and risk management to performance monitoring and incident response.
              </p>

              <div className="grid gap-6">
                {aiAgents.map((agent) => (
                  <div key={agent.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">{agent.name}</h4>
                        <p className="text-slate-600 text-sm mb-3">{agent.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Controls: {agent.aimsControls.join(', ')}</span>
                          <span>{agent.evidenceTypes} evidence types</span>
                        </div>
                      </div>
                      <div className="ml-6 text-center">
                        <div className="text-2xl font-bold text-purple-600">{agent.automationLevel}%</div>
                        <div className="text-xs text-slate-500">Automated</div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${agent.automationLevel}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI System Monitoring */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">AI System Monitoring & Governance</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Monitoring Capabilities</h4>
                  <div className="space-y-3">
                    {[
                      { capability: 'AI Model Performance', status: 'active', coverage: '100%' },
                      { capability: 'Bias Detection & Mitigation', status: 'active', coverage: '98%' },
                      { capability: 'Data Quality Monitoring', status: 'active', coverage: '100%' },
                      { capability: 'Ethical AI Compliance', status: 'active', coverage: '95%' },
                      { capability: 'Risk Assessment Automation', status: 'active', coverage: '94%' },
                      { capability: 'Stakeholder Engagement', status: 'active', coverage: '89%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
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
                  <h4 className="font-medium text-slate-900 mb-4">Governance Areas</h4>
                  <div className="space-y-4">
                    {[
                      { area: 'AI Policy & Strategy', percentage: 96, automated: true },
                      { area: 'Risk Management', percentage: 94, automated: true },
                      { area: 'Data Governance', percentage: 97, automated: true },
                      { area: 'Model Management', percentage: 95, automated: true },
                      { area: 'Performance Monitoring', percentage: 98, automated: true },
                      { area: 'Stakeholder Engagement', percentage: 89, automated: false }
                    ].map((area, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            {area.area}
                            {area.automated && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                Automated
                              </span>
                            )}
                          </span>
                          <span className="text-sm text-slate-600">{area.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full"
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
              <h3 className="text-2xl font-bold text-slate-900 mb-6">ISO 42001 Implementation Roadmap</h3>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Assessment</h4>
                  <p className="text-sm text-slate-600">AI system inventory and risk assessment</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Governance</h4>
                  <p className="text-sm text-slate-600">AI management system implementation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Certification</h4>
                  <p className="text-sm text-slate-600">Third-party audit and certification</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Implementation Checklist</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Conduct AI system inventory and classification',
                    'Perform comprehensive AI risk assessment',
                    'Establish AI governance framework',
                    'Deploy AI management AI agents',
                    'Implement data governance controls',
                    'Set up model management processes',
                    'Configure performance monitoring systems',
                    'Establish stakeholder engagement procedures',
                    'Implement incident response procedures',
                    'Begin continuous improvement processes'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROI & Benefits */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">ROI & Strategic Benefits</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-semibold text-red-800 mb-4">Traditional AI Governance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-red-700">Implementation:</span>
                      <span className="font-semibold text-red-800">12-18 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Governance costs:</span>
                      <span className="font-semibold text-red-800">€500K+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Risk exposure:</span>
                      <span className="font-semibold text-red-800">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Automation:</span>
                      <span className="font-semibold text-red-800">20-40%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-800 mb-4">Velocity Approach</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Implementation:</span>
                      <span className="font-semibold text-purple-800">60 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Platform cost:</span>
                      <span className="font-semibold text-purple-800">€75K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Risk reduction:</span>
                      <span className="font-semibold text-purple-800">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Automation:</span>
                      <span className="font-semibold text-purple-800">94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Lead in Responsible AI?
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Join the pioneers implementing the world's first AI management system standard
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Brain className="w-5 h-5" />
              Start AI Assessment
            </button>
            <button
              onClick={() => navigate('/velocity/demo/ai-governance')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              View AI Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISO42001Guide;