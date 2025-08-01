import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  Database, 
  FileText, 
  Users, 
  Shield, 
  Activity, 
  Zap,
  Eye,
  Download,
  ArrowRight,
  Clock,
  AlertTriangle,
  Settings,
  Globe,
  Lock,
  Target,
  Building,
  TrendingUp,
  Award,
  Brain,
  Bot,
  Cpu,
  Search,
  Scale,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface AISystem {
  id: string;
  name: string;
  riskCategory: 'minimal' | 'limited' | 'high' | 'unacceptable';
  euAIActCompliance: 'compliant' | 'in-progress' | 'gap' | 'assessment-needed';
  gdprCompliance: 'compliant' | 'partial' | 'gap';
  users: number;
  dataTypes: string[];
  businessImpact: string;
  complianceGap: string;
  automationLevel: number;
}

interface ComplianceRequirement {
  id: string;
  framework: 'EU AI Act' | 'GDPR' | 'ISO 42001' | 'IEEE Standards';
  requirement: string;
  description: string;
  status: 'implemented' | 'in-progress' | 'planned' | 'gap';
  aiSystems: string[];
  businessRisk: string;
  deadline: Date;
}

const AIComplianceDemo: React.FC = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'ai-systems' | 'requirements' | 'risk-assessment'>('overview');
  const [aiAssessment, setAIAssessment] = useState(false);

  const [aiSystems] = useState<AISystem[]>([
    {
      id: 'recommendation-engine',
      name: 'Product Recommendation Engine',
      riskCategory: 'limited',
      euAIActCompliance: 'compliant',
      gdprCompliance: 'compliant',
      users: 150000,
      dataTypes: ['Purchase History', 'Browsing Behavior', 'User Preferences'],
      businessImpact: 'Drives 35% of revenue through personalized recommendations',
      complianceGap: 'Fully compliant - transparency notices implemented',
      automationLevel: 95
    },
    {
      id: 'hiring-assistant',
      name: 'AI Hiring Assistant',
      riskCategory: 'high',
      euAIActCompliance: 'gap',
      gdprCompliance: 'partial',
      users: 500,
      dataTypes: ['CVs', 'Interview Data', 'Performance Assessments', 'Demographic Data'],
      businessImpact: 'Reduces hiring time by 60% but poses discrimination risks',
      complianceGap: 'Major gap: Bias testing and human oversight missing',
      automationLevel: 45
    },
    {
      id: 'chatbot',
      name: 'Customer Service Chatbot',
      riskCategory: 'minimal',
      euAIActCompliance: 'compliant',
      gdprCompliance: 'compliant',
      users: 50000,
      dataTypes: ['Chat History', 'Customer Support Tickets'],
      businessImpact: 'Handles 80% of customer queries automatically',
      complianceGap: 'Compliant - clear disclosure that users are talking to AI',
      automationLevel: 92
    },
    {
      id: 'credit-scoring',
      name: 'AI Credit Scoring Model',
      riskCategory: 'high',
      euAIActCompliance: 'in-progress',
      gdprCompliance: 'gap',
      users: 25000,
      dataTypes: ['Financial History', 'Social Media Data', 'Location Data', 'Employment Records'],
      businessImpact: 'Critical for loan decisions but may create unfair bias',
      complianceGap: 'In progress: Algorithmic auditing and explainability needed',
      automationLevel: 70
    },
    {
      id: 'emotion-detection',
      name: 'Emotion Detection System',
      riskCategory: 'unacceptable',
      euAIActCompliance: 'gap',
      gdprCompliance: 'gap',
      users: 1000,
      dataTypes: ['Facial Recognition', 'Biometric Data', 'Emotional States'],
      businessImpact: 'Used for employee monitoring - creates legal liability',
      complianceGap: 'Critical: Prohibited under EU AI Act - immediate shutdown required',
      automationLevel: 0
    }
  ];

  const [complianceRequirements] = useState<ComplianceRequirement[]>([
    {
      id: 'eu-ai-act-transparency',
      framework: 'EU AI Act',
      requirement: 'Transparency and Information for Users',
      description: 'Users must know they\'re interacting with AI and understand how it affects them',
      status: 'implemented',
      aiSystems: ['chatbot', 'recommendation-engine'],
      businessRisk: 'Low - already compliant systems',
      deadline: new Date('2025-08-01')
    },
    {
      id: 'eu-ai-act-high-risk',
      framework: 'EU AI Act',
      requirement: 'High-Risk AI System Compliance',
      description: 'Bias testing, human oversight, and quality management required',
      status: 'gap',
      aiSystems: ['hiring-assistant', 'credit-scoring'],
      businessRisk: 'High - €35M+ potential fines and business disruption',
      deadline: new Date('2025-08-01')
    },
    {
      id: 'gdpr-automated-decisions',
      framework: 'GDPR',
      requirement: 'Automated Decision-Making Rights',
      description: 'Right to explanation and human review for automated decisions',
      status: 'in-progress',
      aiSystems: ['hiring-assistant', 'credit-scoring'],
      businessRisk: 'Medium - customer complaints and regulatory scrutiny',
      deadline: new Date('2025-02-01')
    },
    {
      id: 'iso-42001-isms',
      framework: 'ISO 42001',
      requirement: 'AI Management System',
      description: 'Systematic approach to managing AI risks and opportunities',
      status: 'planned',
      aiSystems: ['all'],
      businessRisk: 'Medium - competitive disadvantage without certification',
      deadline: new Date('2025-12-01')
    }
  ];

  const startDemo = () => {
    setIsRunning(true);
    setAIAssessment(true);
    setDemoProgress(0);
    
    const interval = setInterval(() => {
      setDemoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + Math.random() * 7 + 4;
      });
    }, 1400);
  };

  const getRiskCategoryColor = (category: AISystem['riskCategory']) => {
    const colors = {
      'minimal': 'bg-emerald-100 text-emerald-800',
      'limited': 'bg-blue-100 text-blue-800',
      'high': 'bg-amber-100 text-amber-800',
      'unacceptable': 'bg-red-100 text-red-800'
    };
    return colors[category];
  };

  const getComplianceStatusColor = (status: string) => {
    const colors = {
      'compliant': 'bg-emerald-100 text-emerald-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'partial': 'bg-amber-100 text-amber-800',
      'gap': 'bg-red-100 text-red-800',
      'assessment-needed': 'bg-purple-100 text-purple-800',
      'implemented': 'bg-emerald-100 text-emerald-800',
      'planned': 'bg-slate-100 text-slate-800'
    };
    return colors[status as keyof typeof colors] || 'bg-slate-100 text-slate-800';
  };

  const getRiskIcon = (category: AISystem['riskCategory']) => {
    const icons = {
      'minimal': CheckCircle,
      'limited': Eye,
      'high': AlertTriangle,
      'unacceptable': AlertCircle
    };
    return icons[category];
  };

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
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">AI/ML Demo</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI Compliance
              <span className="block text-blue-400">Made Human</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Watch TechStart AI navigate EU AI Act and GDPR compliance for their 5 AI systems. 
              See how Velocity turns complex AI regulations into clear, actionable steps that protect your business.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button 
                onClick={startDemo}
                disabled={isRunning}
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing AI Systems...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start AI Compliance Demo
                  </>
                )}
              </button>
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                Assess Your AI Systems
              </button>
            </div>

            {/* AI Assessment Progress */}
            {aiAssessment && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Compliance Assessment
                  </span>
                  <span className="text-emerald-300">{Math.round(demoProgress)}% Complete</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 mb-3">
                  <div 
                    className="bg-emerald-400 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${demoProgress}%` }}
                  ></div>
                </div>
                <p className="text-slate-200 text-sm">
                  Scanning AI systems for EU AI Act compliance, bias risks, and GDPR violations...
                </p>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">5</div>
                    <div className="text-xs text-slate-300">AI Systems</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">2</div>
                    <div className="text-xs text-slate-300">High Risk</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">1</div>
                    <div className="text-xs text-slate-300">Prohibited</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-4">
            {[
              { id: 'overview', label: 'Company Overview', icon: Building },
              { id: 'ai-systems', label: 'AI System Registry', icon: Bot },
              { id: 'requirements', label: 'Compliance Requirements', icon: BookOpen },
              { id: 'risk-assessment', label: 'Risk Assessment', icon: Scale }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
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
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Company Profile */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-blue-100 rounded-xl">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">TechStart AI</h2>
                  <p className="text-slate-600 mb-4">
                    Promising AI startup building the future of personalized experiences. After initial success, 
                    they discovered their 5 AI systems have serious compliance gaps that could shut down their business. 
                    The EU AI Act deadline is approaching fast.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">5</div>
                      <div className="text-sm text-slate-500">AI Systems</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">175K</div>
                      <div className="text-sm text-slate-500">Active Users</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">€2.5M</div>
                      <div className="text-sm text-slate-500">Series A Funding</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600">15</div>
                      <div className="text-sm text-slate-500">EU Countries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">6 Months</div>
                      <div className="text-sm text-slate-500">Until EU AI Act</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenge & Solution */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  The AI Compliance Crisis
                </h3>
                <ul className="space-y-3 text-red-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    One AI system is completely prohibited under EU AI Act
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Hiring AI shows bias against women and minorities
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Potential €35M fine (up to 7% of global revenue)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Investors threatening to pull funding over compliance risks
                  </li>
                </ul>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Velocity's AI Solution
                </h3>
                <ul className="space-y-3 text-emerald-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Immediate risk assessment identifies what needs to stop now
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Step-by-step plan to fix bias and add human oversight
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Automated documentation for all EU AI Act requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Turn compliance into a competitive advantage
                  </li>
                </ul>
              </div>
            </div>

            {/* Expected Results */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6">Success Without the Stress</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold mb-2">3 Months</div>
                    <div className="text-blue-100">To Full Compliance</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">€35M+</div>
                    <div className="text-blue-100">Fines Avoided</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">95%</div>
                    <div className="text-blue-100">Process Automated</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">Zero</div>
                    <div className="text-blue-100">Business Disruption</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Systems Tab */}
        {activeTab === 'ai-systems' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">AI System Registry & Risk Assessment</h3>
              <div className="grid gap-6">
                {aiSystems.map((system) => {
                  const RiskIcon = getRiskIcon(system.riskCategory);
                  return (
                    <div key={system.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Bot className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h4 className="font-semibold text-slate-900">{system.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskCategoryColor(system.riskCategory)}`}>
                                <span className="flex items-center gap-1">
                                  <RiskIcon className="w-3 h-3" />
                                  {system.riskCategory} risk
                                </span>
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceStatusColor(system.euAIActCompliance)}`}>
                                EU AI Act: {system.euAIActCompliance}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceStatusColor(system.gdprCompliance)}`}>
                                GDPR: {system.gdprCompliance}
                              </span>
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                              <div className="text-sm font-medium text-blue-800 mb-1">Business Impact:</div>
                              <div className="text-blue-700 text-sm">{system.businessImpact}</div>
                            </div>
                            
                            <div className={`border rounded-lg p-3 mb-3 ${
                              system.complianceGap.includes('Fully compliant') ? 'bg-emerald-50 border-emerald-200' :
                              system.complianceGap.includes('In progress') ? 'bg-blue-50 border-blue-200' :
                              system.complianceGap.includes('Major gap') || system.complianceGap.includes('Critical') ? 'bg-red-50 border-red-200' :
                              'bg-amber-50 border-amber-200'
                            }`}>
                              <div className={`text-sm font-medium mb-1 ${
                                system.complianceGap.includes('Fully compliant') ? 'text-emerald-800' :
                                system.complianceGap.includes('In progress') ? 'text-blue-800' :
                                system.complianceGap.includes('Major gap') || system.complianceGap.includes('Critical') ? 'text-red-800' :
                                'text-amber-800'
                              }`}>
                                Compliance Status:
                              </div>
                              <div className={`text-sm ${
                                system.complianceGap.includes('Fully compliant') ? 'text-emerald-700' :
                                system.complianceGap.includes('In progress') ? 'text-blue-700' :
                                system.complianceGap.includes('Major gap') || system.complianceGap.includes('Critical') ? 'text-red-700' :
                                'text-amber-700'
                              }`}>
                                {system.complianceGap}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-slate-600">
                              <div>
                                <span className="font-medium">Users:</span> {system.users.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Data Types:</span> {system.dataTypes.length}
                              </div>
                              <div>
                                <span className="font-medium">Automation:</span> {system.automationLevel}%
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <details className="text-sm">
                                <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                                  View Data Types Processed
                                </summary>
                                <div className="mt-2 pl-4 border-l-2 border-blue-200">
                                  <ul className="space-y-1">
                                    {system.dataTypes.map((dataType, index) => (
                                      <li key={index} className="text-slate-600">• {dataType}</li>
                                    ))}
                                  </ul>
                                </div>
                              </details>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 text-right">
                          <div className={`text-2xl font-bold mb-1 ${
                            system.automationLevel === 0 ? 'text-red-600' :
                            system.automationLevel < 50 ? 'text-amber-600' :
                            system.automationLevel < 80 ? 'text-blue-600' : 'text-emerald-600'
                          }`}>
                            {system.automationLevel}%
                          </div>
                          <div className="text-xs text-slate-500 mb-3">Compliant</div>
                          <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                            {system.riskCategory === 'unacceptable' ? 'Shutdown Plan' : 'Action Plan'}
                          </button>
                        </div>
                      </div>
                      
                      {(system.riskCategory === 'unacceptable' || system.euAIActCompliance === 'gap') && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="font-medium text-red-800">
                              {system.riskCategory === 'unacceptable' ? 'Immediate Action Required' : 'Compliance Gap'}
                            </span>
                          </div>
                          <p className="text-red-700 text-sm mb-3">
                            {system.riskCategory === 'unacceptable' ? 
                              'This AI system is prohibited under the EU AI Act and must be shut down immediately to avoid massive fines.' :
                              'This system needs significant changes to meet EU AI Act requirements before the deadline.'
                            }
                          </p>
                          <div className="flex gap-2">
                            <button className={`px-4 py-2 text-white rounded-lg text-sm font-medium ${
                              system.riskCategory === 'unacceptable' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                            }`}>
                              {system.riskCategory === 'unacceptable' ? 'Shutdown System' : 'Fix Issues'}
                            </button>
                            <button className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg text-sm font-medium hover:bg-red-50">
                              View Details
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Systems Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-600 mb-2">2</div>
                <div className="text-emerald-700">Compliant Systems</div>
                <div className="text-sm text-emerald-600 mt-2">Low risk, good to go</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
                <div className="text-blue-700">In Progress</div>
                <div className="text-sm text-blue-600 mt-2">Being fixed</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-amber-600 mb-2">1</div>
                <div className="text-amber-700">High Risk Gap</div>
                <div className="text-sm text-amber-600 mt-2">Needs urgent attention</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-red-600 mb-2">1</div>
                <div className="text-red-700">Prohibited</div>
                <div className="text-sm text-red-600 mt-2">Must shut down</div>
              </div>
            </div>
          </div>
        )}

        {/* Requirements Tab */}
        {activeTab === 'requirements' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">AI Compliance Requirements & Deadlines</h3>
              
              <div className="space-y-6">
                {complianceRequirements.map((requirement) => (
                  <div key={requirement.id} className="border border-slate-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{requirement.requirement}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {requirement.framework}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceStatusColor(requirement.status)}`}>
                            {requirement.status}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{requirement.description}</p>
                        
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                          <div className="text-sm font-medium text-amber-800 mb-1">Business Risk:</div>
                          <div className="text-amber-700 text-sm">{requirement.businessRisk}</div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div>
                            <span className="font-medium">Deadline:</span> {requirement.deadline.toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Affected Systems:</span> {
                              requirement.aiSystems.includes('all') ? 'All AI systems' : `${requirement.aiSystems.length} systems`
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 text-right">
                        <div className={`text-sm font-medium mb-2 ${
                          requirement.deadline.getTime() - Date.now() < 90 * 24 * 60 * 60 * 1000 ? 'text-red-600' :
                          requirement.deadline.getTime() - Date.now() < 180 * 24 * 60 * 60 * 1000 ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {Math.ceil((requirement.deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000))} days left
                        </div>
                        <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                          View Plan
                        </button>
                      </div>
                    </div>
                    
                    {requirement.status === 'gap' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-red-800">Critical Compliance Gap</span>
                        </div>
                        <p className="text-red-700 text-sm mb-3">
                          This requirement has major gaps that could result in significant fines and business disruption.
                        </p>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                            Start Remediation
                          </button>
                          <button className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg text-sm font-medium hover:bg-red-50">
                            Risk Assessment
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Timeline */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6">Compliance Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold mb-2">Now</div>
                    <div className="text-blue-100">Immediate Actions</div>
                    <div className="text-sm text-blue-200 mt-2">Shut down prohibited AI</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">3 Months</div>
                    <div className="text-blue-100">GDPR Compliance</div>
                    <div className="text-sm text-blue-200 mt-2">Automated decisions fixed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">6 Months</div>
                    <div className="text-blue-100">EU AI Act Ready</div>
                    <div className="text-sm text-blue-200 mt-2">Full compliance achieved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Assessment Tab */}
        {activeTab === 'risk-assessment' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">AI Risk Assessment & Mitigation</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Critical AI Risks</h4>
                  <div className="space-y-4">
                    {[
                      {
                        risk: 'Prohibited AI System in Production',
                        severity: 'Critical',
                        impact: '€35M+ fine, business shutdown',
                        system: 'Emotion Detection System',
                        action: 'Immediate shutdown required',
                        timeline: 'Today'
                      },
                      {
                        risk: 'Discriminatory AI Hiring Decisions',
                        severity: 'High',
                        impact: 'Legal liability, reputation damage',
                        system: 'AI Hiring Assistant',
                        action: 'Bias testing and human oversight',
                        timeline: '30 days'
                      },
                      {
                        risk: 'Lack of AI Decision Transparency',
                        severity: 'Medium',
                        impact: 'GDPR violations, customer complaints',
                        system: 'Credit Scoring Model',
                        action: 'Explainability features needed',
                        timeline: '60 days'
                      }
                    ].map((risk, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-slate-900">{risk.risk}</div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            risk.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                            risk.severity === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {risk.severity}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 mb-2">
                          <div><span className="font-medium">Impact:</span> {risk.impact}</div>
                          <div><span className="font-medium">System:</span> {risk.system}</div>
                          <div><span className="font-medium">Action:</span> {risk.action}</div>
                          <div><span className="font-medium">Timeline:</span> {risk.timeline}</div>
                        </div>
                        <div className="mt-3">
                          <button className={`px-3 py-1 text-white rounded text-sm font-medium mr-2 ${
                            risk.severity === 'Critical' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                          }`}>
                            {risk.severity === 'Critical' ? 'Emergency Plan' : 'Start Mitigation'}
                          </button>
                          <button className="px-3 py-1 bg-white text-slate-600 border border-slate-300 rounded text-sm font-medium hover:bg-slate-50">
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Risk Mitigation Progress</h4>
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-800">Critical Risks</span>
                      </div>
                      <div className="text-sm text-red-700 mb-2">1 system must be shut down immediately</div>
                      <div className="w-full bg-red-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <div className="text-xs text-red-600 mt-1">0% mitigated - action required now</div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-amber-800">High Risks</span>
                      </div>
                      <div className="text-sm text-amber-700 mb-2">2 systems need significant changes</div>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <div className="text-xs text-amber-600 mt-1">25% mitigated - in progress</div>
                    </div>
                    
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium text-emerald-800">Low/Medium Risks</span>
                      </div>
                      <div className="text-sm text-emerald-700 mb-2">2 systems are compliant or low risk</div>
                      <div className="w-full bg-emerald-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <div className="text-xs text-emerald-600 mt-1">90% mitigated - mostly handled</div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h5 className="font-medium text-slate-900 mb-3">Automated Risk Monitoring</h5>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Continuous bias detection enabled</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>EU AI Act compliance tracking active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Automated risk alerts configured</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Real-time compliance dashboard ready</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">€35M+</div>
                <div className="text-slate-600">Maximum Fine Risk</div>
                <div className="text-sm text-slate-500 mt-2">7% of global revenue</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">3</div>
                <div className="text-slate-600">Critical Issues</div>
                <div className="text-sm text-slate-500 mt-2">Need immediate action</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">6 Months</div>
                <div className="text-slate-600">Until Deadline</div>
                <div className="text-sm text-slate-500 mt-2">EU AI Act enforcement</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">40%</div>
                <div className="text-slate-600">Systems Compliant</div>
                <div className="text-sm text-slate-500 mt-2">2 out of 5 systems</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't Let AI Compliance Kill Your Startup
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join AI companies turning compliance challenges into competitive advantages with Velocity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Assess Your AI Risk
            </button>
            <button
              onClick={() => navigate('/industries/ai-ml')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              AI Compliance Solutions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIComplianceDemo;