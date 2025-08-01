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
  Cpu,
  Search
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface SOCControl {
  id: string;
  category: 'security' | 'availability' | 'processing-integrity' | 'confidentiality' | 'privacy';
  name: string;
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'testing';
  evidenceCount: number;
  automated: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  lastTested: Date;
}

interface DemoScenario {
  phase: 'assessment' | 'implementation' | 'testing' | 'audit-ready';
  day: number;
  totalDays: 45;
  description: string;
  completedControls: number;
  totalControls: number;
}

const SaaSSOC2Demo: React.FC = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<DemoScenario>({
    phase: 'assessment',
    day: 1,
    totalDays: 45,
    description: 'Initial SOC 2 readiness assessment',
    completedControls: 0,
    totalControls: 64
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'controls' | 'evidence' | 'timeline'>('overview');

  const [socControls] = useState<SOCControl[]>([
    {
      id: 'CC1.1',
      category: 'security',
      name: 'Control Environment',
      description: 'COSO control environment with organizational structure and management oversight',
      status: 'compliant',
      evidenceCount: 12,
      automated: true,
      riskLevel: 'low',
      lastTested: new Date('2025-01-15')
    },
    {
      id: 'CC2.1',
      category: 'security',
      name: 'Communication and Information',
      description: 'Information system and communication processes supporting internal control',
      status: 'testing',
      evidenceCount: 8,
      automated: true,
      riskLevel: 'medium',
      lastTested: new Date('2025-01-14')
    },
    {
      id: 'CC3.1',
      category: 'security',
      name: 'Risk Assessment',
      description: 'Risk identification, analysis, and response procedures',
      status: 'partial',
      evidenceCount: 5,
      automated: false,
      riskLevel: 'high',
      lastTested: new Date('2025-01-10')
    },
    {
      id: 'CC6.1',
      category: 'security',
      name: 'Logical and Physical Access',
      description: 'Access controls for systems, data, and facilities',
      status: 'compliant',
      evidenceCount: 18,
      automated: true,
      riskLevel: 'low',
      lastTested: new Date('2025-01-16')
    },
    {
      id: 'CC7.1',
      category: 'security',
      name: 'System Operations',
      description: 'Detection and correction of system processing deviations',
      status: 'testing',
      evidenceCount: 15,
      automated: true,
      riskLevel: 'medium',
      lastTested: new Date('2025-01-13')
    },
    {
      id: 'A1.1',
      category: 'availability',
      name: 'Availability Monitoring',
      description: 'System availability monitoring and incident response',
      status: 'compliant',
      evidenceCount: 22,
      automated: true,
      riskLevel: 'low',
      lastTested: new Date('2025-01-15')
    }
  ]);

  const startDemo = () => {
    setIsRunning(true);
    simulateSOC2Implementation();
  };

  const simulateSOC2Implementation = () => {
    const phases = [
      { phase: 'assessment', days: 7, description: 'Gap analysis and control mapping' },
      { phase: 'implementation', days: 25, description: 'Policy creation and control implementation' },
      { phase: 'testing', days: 10, description: 'Testing period for SOC 2 Type II evidence' },
      { phase: 'audit-ready', days: 3, description: 'Final audit preparation and evidence review' }
    ];

    let currentDay = 1;
    phases.forEach((phase, phaseIndex) => {
      setTimeout(() => {
        setCurrentScenario({
          phase: phase.phase as any,
          day: currentDay,
          totalDays: 45,
          description: phase.description,
          completedControls: Math.min(64, Math.floor((currentDay / 45) * 64)),
          totalControls: 64
        });
        currentDay += phase.days;
        
        if (phaseIndex === phases.length - 1) {
          setTimeout(() => setIsRunning(false), 2000);
        }
      }, phaseIndex * 3000);
    });
  };

  const getStatusColor = (status: SOCControl['status']) => {
    const colors = {
      'compliant': 'bg-emerald-100 text-emerald-800',
      'testing': 'bg-blue-100 text-blue-800',
      'partial': 'bg-amber-100 text-amber-800',
      'non-compliant': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getCategoryIcon = (category: SOCControl['category']) => {
    const icons = {
      'security': Shield,
      'availability': Activity,
      'processing-integrity': Cpu,
      'confidentiality': Lock,
      'privacy': Users
    };
    return icons[category];
  };

  const getPhaseProgress = () => {
    return Math.round((currentScenario.day / currentScenario.totalDays) * 100);
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
                <Globe className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">SaaS Company Demo</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Startup SOC 2
              <span className="block text-blue-400">Implementation</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Watch a fast-growing SaaS startup achieve SOC 2 Type II compliance in just 45 days 
              with Velocity's automated evidence collection and control implementation.
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
                    Running Demo...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start SOC 2 Demo
                  </>
                )}
              </button>
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                Try With Your Data
              </button>
            </div>

            {/* Demo Progress */}
            {isRunning && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">Phase: {currentScenario.phase}</span>
                  <span className="text-blue-300">Day {currentScenario.day} of {currentScenario.totalDays}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 mb-3">
                  <div 
                    className="bg-blue-400 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getPhaseProgress()}%` }}
                  ></div>
                </div>
                <p className="text-slate-200 text-sm">{currentScenario.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">{currentScenario.completedControls}</div>
                    <div className="text-xs text-slate-300">Controls Implemented</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{Math.round(getPhaseProgress())}%</div>
                    <div className="text-xs text-slate-300">Complete</div>
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
              { id: 'overview', label: 'Demo Overview', icon: Target },
              { id: 'controls', label: 'SOC 2 Controls', icon: Shield },
              { id: 'evidence', label: 'Evidence Collection', icon: Database },
              { id: 'timeline', label: '45-Day Timeline', icon: Clock }
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
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">CloudFlow SaaS</h2>
                  <p className="text-slate-600 mb-4">
                    Fast-growing workflow automation platform serving 50+ enterprise clients. Recently closed Series A funding 
                    and needs SOC 2 Type II compliance to win Fortune 500 deals.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">150</div>
                      <div className="text-sm text-slate-500">Employees</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">$15M</div>
                      <div className="text-sm text-slate-500">ARR</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">50+</div>
                      <div className="text-sm text-slate-500">Enterprise Clients</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600">45</div>
                      <div className="text-sm text-slate-500">Days to Audit</div>
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
                  The Challenge
                </h3>
                <ul className="space-y-3 text-red-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Lost 3 major deals worth $2M+ due to lack of SOC 2
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Enterprise RFPs require SOC 2 Type II certification
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Traditional consulting quoted 8-12 months and $150K+
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Small team, no dedicated compliance resources
                  </li>
                </ul>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Velocity Solution
                </h3>
                <ul className="space-y-3 text-emerald-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    45-day implementation with pre-built SaaS workflows
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Automated evidence collection from AWS, Google Workspace
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    AI-generated policies and procedures documentation
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Real-time compliance monitoring and gap remediation
                  </li>
                </ul>
              </div>
            </div>

            {/* Results Preview */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6">Projected Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold mb-2">96.8%</div>
                    <div className="text-blue-100">Audit Pass Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">€120K</div>
                    <div className="text-blue-100">Savings vs Traditional</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">5 Months</div>
                    <div className="text-blue-100">Time Saved</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">95%</div>
                    <div className="text-blue-100">Evidence Automated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls Tab */}
        {activeTab === 'controls' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">SOC 2 Type II Controls Status</h3>
              <div className="grid gap-4">
                {socControls.map((control) => {
                  const Icon = getCategoryIcon(control.category);
                  return (
                    <div key={control.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-slate-900">{control.id} - {control.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(control.status)}`}>
                                {control.status}
                              </span>
                              {control.automated && (
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                                  Automated
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 text-sm mb-3">{control.description}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>{control.evidenceCount} evidence items</span>
                              <span>Last tested: {control.lastTested.toLocaleDateString()}</span>
                              <span className={`font-medium ${
                                control.riskLevel === 'low' ? 'text-emerald-600' : 
                                control.riskLevel === 'medium' ? 'text-amber-600' : 'text-red-600'
                              }`}>
                                {control.riskLevel} risk
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="ml-4 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                          View Evidence
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">64</div>
                <div className="text-slate-600">Total Controls</div>
                <div className="text-sm text-slate-500 mt-2">SOC 2 Type II Trust Services</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">58</div>
                <div className="text-slate-600">Automated</div>
                <div className="text-sm text-slate-500 mt-2">91% automation rate</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">142</div>
                <div className="text-slate-600">Evidence Items</div>
                <div className="text-sm text-slate-500 mt-2">Auto-collected and validated</div>
              </div>
            </div>
          </div>
        )}

        {/* Evidence Tab */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Automated Evidence Collection</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Connected Systems</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'AWS CloudTrail', status: 'active', evidence: 45 },
                      { name: 'Google Workspace', status: 'active', evidence: 28 },
                      { name: 'GitHub Enterprise', status: 'active', evidence: 22 },
                      { name: 'Okta SSO', status: 'active', evidence: 18 },
                      { name: 'PagerDuty', status: 'active', evidence: 12 },
                      { name: 'DataDog Monitoring', status: 'active', evidence: 17 }
                    ].map((system, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="font-medium">{system.name}</span>
                        </div>
                        <div className="text-sm text-slate-600">
                          {system.evidence} evidence items
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Evidence Categories</h4>
                  <div className="space-y-4">
                    {[
                      { category: 'Access Controls', percentage: 95, items: 45 },
                      { category: 'System Operations', percentage: 88, items: 38 },
                      { category: 'Change Management', percentage: 92, items: 24 },
                      { category: 'Monitoring', percentage: 100, items: 35 }
                    ].map((cat, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{cat.category}</span>
                          <span className="text-sm text-slate-600">{cat.percentage}% complete</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${cat.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{cat.items} evidence items</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Evidence Stream */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Live Evidence Collection</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {[
                  { timestamp: '10:23 AM', source: 'AWS CloudTrail', action: 'User login event captured for CC6.1', type: 'success' },
                  { timestamp: '10:22 AM', source: 'GitHub', action: 'Code review approval documented for CC8.1', type: 'success' },
                  { timestamp: '10:21 AM', source: 'DataDog', action: 'System availability metrics collected for A1.1', type: 'success' },
                  { timestamp: '10:20 AM', source: 'Okta', action: 'MFA enforcement verified for CC6.1', type: 'success' },
                  { timestamp: '10:19 AM', source: 'PagerDuty', action: 'Incident response time logged for CC7.1', type: 'success' }
                ].map((event, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs text-slate-500">{event.timestamp}</span>
                        <span className="text-xs font-medium text-blue-600">{event.source}</span>
                      </div>
                      <p className="text-sm text-slate-700">{event.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">45-Day SOC 2 Implementation Timeline</h3>
              
              <div className="space-y-8">
                {[
                  {
                    phase: 'Week 1: Assessment & Planning',
                    days: '1-7',
                    status: 'completed',
                    tasks: [
                      'Initial gap analysis and readiness assessment',
                      'Control mapping and evidence requirements',
                      'System integrations and agent deployment',
                      'Policy template customization'
                    ]
                  },
                  {
                    phase: 'Weeks 2-4: Implementation',
                    days: '8-28',
                    status: 'in-progress',
                    tasks: [
                      'Automated policy generation and approval',
                      'Control implementation and testing',
                      'Evidence collection automation setup',
                      'Staff training and process documentation'
                    ]
                  },
                  {
                    phase: 'Weeks 5-6: Testing Period',
                    days: '29-42',
                    status: 'upcoming',
                    tasks: [
                      'Type II testing period begins',
                      'Continuous evidence collection',
                      'Gap remediation and control optimization',
                      'Pre-audit readiness verification'
                    ]
                  },
                  {
                    phase: 'Week 7: Audit Preparation',
                    days: '43-45',
                    status: 'upcoming',
                    tasks: [
                      'Audit evidence package preparation',
                      'Auditor coordination and scheduling',
                      'Final compliance verification',
                      'SOC 2 Type II audit begins'
                    ]
                  }
                ].map((phase, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start gap-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${
                          phase.status === 'completed' ? 'bg-emerald-500' :
                          phase.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-300'
                        }`}></div>
                        {index < 3 && (
                          <div className={`w-0.5 h-16 mt-2 ${
                            phase.status === 'completed' ? 'bg-emerald-200' : 'bg-slate-200'
                          }`}></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="mb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-slate-900">{phase.phase}</h4>
                            <span className="text-sm text-slate-500">Days {phase.days}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              phase.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                              phase.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {phase.status}
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {phase.tasks.map((task, taskIndex) => (
                              <li key={taskIndex} className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle className={`w-4 h-4 ${
                                  phase.status === 'completed' ? 'text-emerald-500' :
                                  phase.status === 'in-progress' ? 'text-blue-500' : 'text-slate-300'
                                }`} />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Benefits */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-600 mb-2">6x Faster</div>
                <div className="text-emerald-700">vs traditional implementations</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-600 mb-2">96.8%</div>
                <div className="text-blue-700">First-time audit pass rate</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-600 mb-2">€120K+</div>
                <div className="text-purple-700">Savings vs consulting</div>
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
            Join hundreds of SaaS companies that achieved compliance faster and cheaper with Velocity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Start Your Assessment
            </button>
            <button
              onClick={() => navigate('/velocity/pricing')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaaSSOC2Demo;