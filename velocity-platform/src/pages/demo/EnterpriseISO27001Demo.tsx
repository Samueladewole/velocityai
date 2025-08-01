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
  Network,
  Server,
  Monitor,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface ISMSControl {
  id: string;
  category: 'organizational' | 'people' | 'physical' | 'technological';
  name: string;
  description: string;
  status: 'implemented' | 'in-progress' | 'planned' | 'gap';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  globalLocations: string[];
  automationLevel: number;
  lastReview: Date;
  businessImpact: string;
}

interface GlobalLocation {
  id: string;
  name: string;
  country: string;
  employees: number;
  systems: number;
  complianceStatus: 'compliant' | 'partial' | 'gap';
  criticality: 'high' | 'medium' | 'low';
}

const EnterpriseISO27001Demo: React.FC = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'controls' | 'global-ops' | 'risk-mgmt'>('overview');
  const [globalAssessment, setGlobalAssessment] = useState(false);

  const [ismsControls] = useState<ISMSControl[]>([
    {
      id: 'A.5.1',
      category: 'organizational',
      name: 'Information Security Policies',
      description: 'Your security policies work across all offices automatically',
      status: 'implemented',
      riskLevel: 'low',
      globalLocations: ['New York', 'London', 'Singapore', 'São Paulo'],
      automationLevel: 95,
      lastReview: new Date('2024-01-10'),
      businessImpact: 'Protects company reputation and customer trust worldwide'
    },
    {
      id: 'A.8.1',
      category: 'people',
      name: 'Screening & Training',
      description: 'Every employee gets security training that actually makes sense',
      status: 'implemented',
      riskLevel: 'medium',
      globalLocations: ['New York', 'London', 'Singapore'],
      automationLevel: 88,
      lastReview: new Date('2024-01-12'),
      businessImpact: 'Prevents 85% of human error incidents across global teams'
    },
    {
      id: 'A.11.1',
      category: 'physical',
      name: 'Physical Access Controls',
      description: 'Office security that adapts to each location\'s needs',
      status: 'in-progress',
      riskLevel: 'high',
      globalLocations: ['New York', 'London'],
      automationLevel: 75,
      lastReview: new Date('2024-01-08'),
      businessImpact: 'Secures intellectual property and prevents physical breaches'
    },
    {
      id: 'A.12.1',
      category: 'technological',
      name: 'Secure System Operations',
      description: 'All your systems stay secure without slowing down your teams',
      status: 'implemented',
      riskLevel: 'low',
      globalLocations: ['New York', 'London', 'Singapore', 'São Paulo', 'Mumbai'],
      automationLevel: 92,
      lastReview: new Date('2024-01-15'),
      businessImpact: 'Maintains 99.9% uptime while ensuring security compliance'
    },
    {
      id: 'A.13.1',
      category: 'technological',
      name: 'Network Security Management',
      description: 'Your networks stay protected while teams collaborate globally',
      status: 'gap',
      riskLevel: 'critical',
      globalLocations: ['Mumbai', 'São Paulo'],
      automationLevel: 45,
      lastReview: new Date('2024-01-05'),
      businessImpact: 'Critical gap: Potential $2.5M loss from network breaches'
    }
  ]);

  const [globalLocations] = useState<GlobalLocation[]>([
    {
      id: 'nyc',
      name: 'New York HQ',
      country: 'United States',
      employees: 1250,
      systems: 45,
      complianceStatus: 'compliant',
      criticality: 'high'
    },
    {
      id: 'london',
      name: 'London Office',
      country: 'United Kingdom',
      employees: 850,
      systems: 32,
      complianceStatus: 'compliant',
      criticality: 'high'
    },
    {
      id: 'singapore',
      name: 'Singapore Hub',
      country: 'Singapore',
      employees: 650,
      systems: 28,
      complianceStatus: 'partial',
      criticality: 'medium'
    },
    {
      id: 'saopaulo',
      name: 'São Paulo Office',
      country: 'Brazil',
      employees: 420,
      systems: 18,
      complianceStatus: 'gap',
      criticality: 'medium'
    },
    {
      id: 'mumbai',
      name: 'Mumbai Center',
      country: 'India',
      employees: 950,
      systems: 35,
      complianceStatus: 'gap',
      criticality: 'high'
    }
  ]);

  const startDemo = () => {
    setIsRunning(true);
    setGlobalAssessment(true);
    setDemoProgress(0);
    
    const interval = setInterval(() => {
      setDemoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + Math.random() * 8 + 3;
      });
    }, 1200);
  };

  const getStatusColor = (status: ISMSControl['status']) => {
    const colors = {
      'implemented': 'bg-emerald-100 text-emerald-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'planned': 'bg-purple-100 text-purple-800',
      'gap': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getRiskColor = (riskLevel: string) => {
    const colors = {
      'low': 'text-emerald-600',
      'medium': 'text-amber-600',
      'high': 'text-red-600',
      'critical': 'text-red-700 font-bold'
    };
    return colors[riskLevel as keyof typeof colors];
  };

  const getLocationStatusColor = (status: GlobalLocation['complianceStatus']) => {
    const colors = {
      'compliant': 'bg-emerald-100 text-emerald-800',
      'partial': 'bg-amber-100 text-amber-800',
      'gap': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getCategoryIcon = (category: ISMSControl['category']) => {
    const icons = {
      'organizational': Building,
      'people': Users,
      'physical': Shield,
      'technological': Server
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
                <Globe className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Enterprise Demo</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Global ISO 27001
              <span className="block text-blue-400">Made Simple</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Watch GlobalTech Corp achieve ISO 27001 certification across 5 countries and 4,120 employees. 
              See how Velocity turns complex global compliance into a smooth, automated process.
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
                    Running Global Assessment...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Enterprise Demo
                  </>
                )}
              </button>
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                Get Your Assessment
              </button>
            </div>

            {/* Global Assessment Progress */}
            {globalAssessment && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Global Compliance Assessment
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
                  Analyzing security controls across New York, London, Singapore, São Paulo, and Mumbai...
                </p>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">114</div>
                    <div className="text-xs text-slate-300">ISO Controls</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">5</div>
                    <div className="text-xs text-slate-300">Global Locations</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">4,120</div>
                    <div className="text-xs text-slate-300">Employees</div>
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
              { id: 'controls', label: 'ISMS Controls', icon: Shield },
              { id: 'global-ops', label: 'Global Operations', icon: Globe },
              { id: 'risk-mgmt', label: 'Risk Management', icon: Target }
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">GlobalTech Corp</h2>
                  <p className="text-slate-600 mb-4">
                    Leading enterprise software company serving Fortune 500 clients across 25+ countries. 
                    After rapid global expansion, they need ISO 27001 to maintain client trust and win $50M+ deals 
                    that require certified information security management.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">4,120</div>
                      <div className="text-sm text-slate-500">Global Employees</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">5</div>
                      <div className="text-sm text-slate-500">Countries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">158</div>
                      <div className="text-sm text-slate-500">Business Systems</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600">$2.1B</div>
                      <div className="text-sm text-slate-500">Annual Revenue</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">6 Months</div>
                      <div className="text-sm text-slate-500">Until Audit</div>
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
                  The Global Compliance Challenge
                </h3>
                <ul className="space-y-3 text-red-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Lost $12M deal because "we don't have ISO 27001 yet"
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Each office has different security practices and tools
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Manual assessments would take 18+ months across all locations
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Compliance team of 3 people can't handle global complexity
                  </li>
                </ul>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Velocity's Global Solution
                </h3>
                <ul className="space-y-3 text-emerald-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    One platform automatically assesses all 5 global locations
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    AI agents work 24/7 collecting evidence across time zones
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    6-month certification timeline instead of 18+ months
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Your small team manages global compliance effortlessly
                  </li>
                </ul>
              </div>
            </div>

            {/* Expected Results */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6">What Success Looks Like</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold mb-2">6 Months</div>
                    <div className="text-blue-100">To ISO 27001 Certification</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">€850K</div>
                    <div className="text-blue-100">Saved vs Traditional Consulting</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">$50M+</div>
                    <div className="text-blue-100">In New Deals Unlocked</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">90%</div>
                    <div className="text-blue-100">Process Automation</div>
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
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Information Security Management System (ISMS) Controls</h3>
              <div className="grid gap-6">
                {ismsControls.map((control) => {
                  const Icon = getCategoryIcon(control.category);
                  return (
                    <div key={control.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h4 className="font-semibold text-slate-900">{control.id} - {control.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(control.status)}`}>
                                {control.status}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                {control.automationLevel}% Automated
                              </span>
                            </div>
                            <p className="text-slate-600 text-sm mb-3">{control.description}</p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                              <div className="text-sm font-medium text-blue-800 mb-1">Business Impact:</div>
                              <div className="text-blue-700 text-sm">{control.businessImpact}</div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                <span>Active in: {control.globalLocations.join(', ')}</span>
                              </div>
                              <span className={`font-medium ${getRiskColor(control.riskLevel)}`}>
                                {control.riskLevel} risk
                              </span>
                              <span>Last review: {control.lastReview.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-6 text-right">
                          <div className="text-2xl font-bold text-blue-600 mb-1">{control.automationLevel}%</div>
                          <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                      
                      {control.status === 'gap' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="font-medium text-red-800">Urgent Action Needed</span>
                          </div>
                          <p className="text-red-700 text-sm mb-3">
                            This gap puts your certification at risk and could lead to significant business impact.
                          </p>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                              Start Remediation
                            </button>
                            <button className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg text-sm font-medium hover:bg-red-50">
                              View Action Plan
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <Building className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-600 mb-2">Organizational</div>
                <div className="text-slate-600">Leadership & Governance</div>
                <div className="text-sm text-slate-500 mt-2">37 controls implemented</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <Users className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-600 mb-2">People</div>
                <div className="text-slate-600">Human Resources Security</div>
                <div className="text-sm text-slate-500 mt-2">8 controls implemented</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-600 mb-2">Physical</div>
                <div className="text-slate-600">Environmental Security</div>
                <div className="text-sm text-slate-500 mt-2">14 controls implemented</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <Server className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-amber-600 mb-2">Technological</div>
                <div className="text-slate-600">System & Network Security</div>
                <div className="text-sm text-slate-500 mt-2">55 controls implemented</div>
              </div>
            </div>
          </div>
        )}

        {/* Global Operations Tab */}
        {activeTab === 'global-ops' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Global Compliance Status</h3>
              
              <div className="grid gap-6">
                {globalLocations.map((location) => (
                  <div key={location.id} className="border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">{location.name}</h4>
                          <p className="text-slate-600">{location.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLocationStatusColor(location.complianceStatus)}`}>
                          {location.complianceStatus}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          location.criticality === 'high' ? 'bg-red-100 text-red-800' :
                          location.criticality === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {location.criticality} priority
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{location.employees}</div>
                        <div className="text-sm text-slate-500">Employees</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{location.systems}</div>
                        <div className="text-sm text-slate-500">Business Systems</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-emerald-600">
                          {location.complianceStatus === 'compliant' ? '98%' :
                           location.complianceStatus === 'partial' ? '75%' : '45%'}
                        </div>
                        <div className="text-sm text-slate-500">Compliance Score</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-amber-600">
                          {location.complianceStatus === 'compliant' ? '2' :
                           location.complianceStatus === 'partial' ? '8' : '15'}
                        </div>
                        <div className="text-sm text-slate-500">Open Issues</div>
                      </div>
                    </div>

                    {location.complianceStatus !== 'compliant' && (
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900">Key Issues:</span>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View Action Plan →
                          </button>
                        </div>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {location.complianceStatus === 'partial' ? [
                            'Physical access controls need standardization',
                            'Employee security training completion at 60%'
                          ] : [
                            'Network security gaps in Mumbai and São Paulo offices',
                            'Incident response procedures not implemented',
                            'Data classification policies missing'
                          ]}.map((issue, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Global Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <Globe className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-600 mb-2">78%</div>
                <div className="text-emerald-700">Global Compliance Average</div>
                <div className="text-sm text-emerald-600 mt-2">Up from 45% last quarter</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-600 mb-2">4,120</div>
                <div className="text-blue-700">Employees Trained</div>
                <div className="text-sm text-blue-600 mt-2">Security awareness program</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <Server className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-600 mb-2">158</div>
                <div className="text-purple-700">Systems Monitored</div>
                <div className="text-sm text-purple-600 mt-2">24/7 automated compliance</div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Management Tab */}
        {activeTab === 'risk-mgmt' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Enterprise Risk Assessment</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Critical Risks Identified</h4>
                  <div className="space-y-4">
                    {[
                      {
                        risk: 'Network Security Gaps',
                        impact: 'High',
                        probability: 'Medium',
                        locations: ['Mumbai', 'São Paulo'],
                        financial: '€2.5M potential loss',
                        timeline: 'Fix needed in 30 days'
                      },
                      {
                        risk: 'Inconsistent Access Controls',
                        impact: 'Medium',
                        probability: 'High',
                        locations: ['Singapore', 'São Paulo'],
                        financial: '€800K potential loss',
                        timeline: 'Fix needed in 60 days'
                      },
                      {
                        risk: 'Incomplete Incident Response',
                        impact: 'High',
                        probability: 'Low',
                        locations: ['All locations'],
                        financial: '€1.2M potential loss',
                        timeline: 'Fix needed in 90 days'
                      }
                    ].map((risk, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-slate-900">{risk.risk}</div>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              risk.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {risk.impact} Impact
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              risk.probability === 'High' ? 'bg-red-100 text-red-800' :
                              risk.probability === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {risk.probability} Probability
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600">
                          <div>
                            <span className="font-medium">Locations:</span> {risk.locations.join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">Financial Impact:</span> {risk.financial}
                          </div>
                          <div>
                            <span className="font-medium">Timeline:</span> {risk.timeline}
                          </div>
                        </div>
                        <div className="mt-3">
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 mr-2">
                            Create Action Plan
                          </button>
                          <button className="px-3 py-1 bg-white text-blue-600 border border-blue-600 rounded text-sm font-medium hover:bg-blue-50">
                            Assign Owner
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Risk Treatment Progress</h4>
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium text-emerald-800">Low Risk Issues</span>
                      </div>
                      <div className="text-sm text-emerald-700 mb-2">
                        85% of low-risk issues have been automatically resolved
                      </div>
                      <div className="w-full bg-emerald-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Medium Risk Issues</span>
                      </div>
                      <div className="text-sm text-blue-700 mb-2">
                        60% of medium-risk issues are in progress
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-800">High Risk Issues</span>
                      </div>
                      <div className="text-sm text-red-700 mb-2">
                        35% of high-risk issues require immediate attention
                      </div>
                      <div className="w-full bg-red-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h5 className="font-medium text-slate-900 mb-3">Automated Risk Response</h5>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Low-risk issues auto-remediated</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Stakeholders notified of high-risk issues</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Action plans created automatically</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Progress tracking and reporting enabled</span>
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
                <div className="text-3xl font-bold text-red-600 mb-2">23</div>
                <div className="text-slate-600">Critical Risks</div>
                <div className="text-sm text-slate-500 mt-2">Down from 45 last month</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">67</div>
                <div className="text-slate-600">Medium Risks</div>
                <div className="text-sm text-slate-500 mt-2">Being addressed systematically</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">€4.2M</div>
                <div className="text-slate-600">Risk Mitigated</div>
                <div className="text-sm text-slate-500 mt-2">Potential financial impact</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">78%</div>
                <div className="text-slate-600">Automated Response</div>
                <div className="text-sm text-slate-500 mt-2">Risks handled automatically</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Master Global ISO 27001 Compliance?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join enterprise companies achieving ISO 27001 faster and cheaper across all global locations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Start Global Assessment
            </button>
            <button
              onClick={() => navigate('/industries/enterprise')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Enterprise Solutions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseISO27001Demo;