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
  Factory,
  Wifi,
  Wrench,
  Truck,
  AlertCircle,
  Network,
  Server,
  Radio
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface NIS2Control {
  id: string;
  category: 'cyber-security' | 'incident-reporting' | 'business-continuity' | 'supply-chain' | 'governance';
  name: string;
  description: string;
  status: 'compliant' | 'in-progress' | 'gap' | 'critical-gap';
  affectedSystems: string[];
  businessImpact: string;
  automationLevel: number;
  lastReview: Date;
  deadline: Date;
}

interface IndustrialSystem {
  id: string;
  name: string;
  type: 'SCADA' | 'PLC' | 'HMI' | 'MES' | 'ERP' | 'IoT';
  criticality: 'essential' | 'important' | 'standard';
  vulnerabilities: number;
  patchLevel: 'current' | 'behind' | 'critical';
  networkSegmentation: boolean;
  monitoringStatus: 'active' | 'partial' | 'none';
  complianceGap: string;
}

const ManufacturingNIS2Demo: React.FC = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'ot-systems' | 'nis2-controls' | 'incident-response'>('overview');
  const [industrialAssessment, setIndustrialAssessment] = useState(false);

  const [nis2Controls] = useState<NIS2Control[]>([
    {
      id: 'NIS2-CS-01',
      category: 'cyber-security',
      name: 'Risk Management & Cybersecurity Policies',
      description: 'Your factory stays secure without disrupting production schedules',
      status: 'in-progress',
      affectedSystems: ['All Industrial Systems'],
      businessImpact: 'Protects $2.5M daily production value from cyber attacks',
      automationLevel: 75,
      lastReview: new Date('2025-01-10'),
      deadline: new Date('2025-10-17')
    },
    {
      id: 'NIS2-IR-01',
      category: 'incident-reporting',
      name: '24-Hour Incident Reporting',
      description: 'Automatic incident detection and reporting to authorities',
      status: 'gap',
      affectedSystems: ['SCADA', 'PLC Controllers', 'Network Infrastructure'],
      businessImpact: 'Avoids €10M+ fines for late incident reporting',
      automationLevel: 45,
      lastReview: new Date('2025-01-08'),
      deadline: new Date('2025-10-17')
    },
    {
      id: 'NIS2-BC-01',
      category: 'business-continuity',
      name: 'Business Continuity & Crisis Management',
      description: 'Keep production running even during cyber incidents',
      status: 'compliant',
      affectedSystems: ['Backup Systems', 'Emergency Procedures'],
      businessImpact: 'Prevents $500K+ daily losses from production downtime',
      automationLevel: 90,
      lastReview: new Date('2025-01-12'),
      deadline: new Date('2025-10-17')
    },
    {
      id: 'NIS2-SC-01',
      category: 'supply-chain',
      name: 'Supply Chain Security',
      description: 'Secure supplier connections without blocking critical deliveries',
      status: 'critical-gap',
      affectedSystems: ['Supplier Networks', 'B2B Integrations'],
      businessImpact: 'Critical: Unsecured suppliers could shut down entire production',
      automationLevel: 30,
      lastReview: new Date('2025-01-05'),
      deadline: new Date('2025-10-17')
    },
    {
      id: 'NIS2-GOV-01',
      category: 'governance',
      name: 'Corporate Accountability',
      description: 'Management responsibility and oversight that actually works',
      status: 'in-progress',
      affectedSystems: ['Management Systems', 'Reporting Infrastructure'],
      businessImpact: 'Protects executives from personal liability and imprisonment',
      automationLevel: 65,
      lastReview: new Date('2025-01-09'),
      deadline: new Date('2025-10-17')
    }
  ];

  const [industrialSystems] = useState<IndustrialSystem[]>([
    {
      id: 'main-scada',
      name: 'Main Production SCADA',
      type: 'SCADA',
      criticality: 'essential',
      vulnerabilities: 8,
      patchLevel: 'critical',
      networkSegmentation: false,
      monitoringStatus: 'partial',
      complianceGap: 'Critical: No network isolation, 8 critical vulnerabilities'
    },
    {
      id: 'assembly-plcs',
      name: 'Assembly Line PLCs',
      type: 'PLC',
      criticality: 'essential',
      vulnerabilities: 3,
      patchLevel: 'behind',
      networkSegmentation: true,
      monitoringStatus: 'active',
      complianceGap: 'Moderate: Patches needed, good monitoring in place'
    },
    {
      id: 'quality-hmi',
      name: 'Quality Control HMI',
      type: 'HMI',
      criticality: 'important',
      vulnerabilities: 1,
      patchLevel: 'current',
      networkSegmentation: true,
      monitoringStatus: 'active',
      complianceGap: 'Good: Well secured and monitored'
    },
    {
      id: 'warehouse-mes',
      name: 'Warehouse MES',
      type: 'MES',
      criticality: 'important',
      vulnerabilities: 5,
      patchLevel: 'behind',
      networkSegmentation: false,
      monitoringStatus: 'none',
      complianceGap: 'High risk: No monitoring or segmentation'
    },
    {
      id: 'sensor-network',
      name: 'IoT Sensor Network',
      type: 'IoT',
      criticality: 'standard',
      vulnerabilities: 12,
      patchLevel: 'critical',
      networkSegmentation: false,
      monitoringStatus: 'none',
      complianceGap: 'Severe: 12 vulnerabilities, no security controls'
    }
  ];

  const startDemo = () => {
    setIsRunning(true);
    setIndustrialAssessment(true);
    setDemoProgress(0);
    
    const interval = setInterval(() => {
      setDemoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + Math.random() * 6 + 3;
      });
    }, 1600);
  };

  const getStatusColor = (status: NIS2Control['status']) => {
    const colors = {
      'compliant': 'bg-emerald-100 text-emerald-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'gap': 'bg-amber-100 text-amber-800',
      'critical-gap': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getCriticalityColor = (criticality: IndustrialSystem['criticality']) => {
    const colors = {
      'essential': 'bg-red-100 text-red-800',
      'important': 'bg-amber-100 text-amber-800',
      'standard': 'bg-blue-100 text-blue-800'
    };
    return colors[criticality];
  };

  const getPatchLevelColor = (patchLevel: IndustrialSystem['patchLevel']) => {
    const colors = {
      'current': 'bg-emerald-100 text-emerald-800',
      'behind': 'bg-amber-100 text-amber-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[patchLevel];
  };

  const getSystemTypeIcon = (type: IndustrialSystem['type']) => {
    const icons = {
      'SCADA': Factory,
      'PLC': Cpu,
      'HMI': Monitor,
      'MES': Database,
      'ERP': Building,
      'IoT': Wifi
    };
    return icons[type];
  };

  const getCategoryIcon = (category: NIS2Control['category']) => {
    const icons = {
      'cyber-security': Shield,
      'incident-reporting': AlertTriangle,
      'business-continuity': Activity,
      'supply-chain': Truck,
      'governance': Users
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
                <Factory className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Manufacturing Demo</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Industrial Security
              <span className="block text-blue-400">Without the Downtime</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Watch IndustrialCorp prepare for NIS2 compliance across their smart factory. 
              See how Velocity secures critical production systems without stopping the assembly line.
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
                    Scanning Industrial Systems...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Manufacturing Demo
                  </>
                )}
              </button>
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                Assess Your Factory
              </button>
            </div>

            {/* Industrial Assessment Progress */}
            {industrialAssessment && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium flex items-center gap-2">
                    <Factory className="w-4 h-4" />
                    Industrial Security Assessment
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
                  Analyzing SCADA systems, PLCs, and industrial networks for NIS2 compliance gaps...
                </p>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">5</div>
                    <div className="text-xs text-slate-300">Industrial Systems</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">29</div>
                    <div className="text-xs text-slate-300">Vulnerabilities</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">2</div>
                    <div className="text-xs text-slate-300">Critical Gaps</div>
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
              { id: 'overview', label: 'Factory Overview', icon: Building },
              { id: 'ot-systems', label: 'Industrial Systems', icon: Factory },
              { id: 'nis2-controls', label: 'NIS2 Controls', icon: Shield },
              { id: 'incident-response', label: 'Incident Response', icon: AlertTriangle }
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
                  <Factory className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">IndustrialCorp Manufacturing</h2>
                  <p className="text-slate-600 mb-4">
                    Major automotive parts manufacturer operating smart factories across Europe. 
                    With NIS2 taking effect, they face massive fines if their industrial systems aren't secured. 
                    One cyber incident could shut down production worth $2.5M daily.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">3</div>
                      <div className="text-sm text-slate-500">Smart Factories</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">2,850</div>
                      <div className="text-sm text-slate-500">Employees</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">€850M</div>
                      <div className="text-sm text-slate-500">Annual Revenue</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600">$2.5M</div>
                      <div className="text-sm text-slate-500">Daily Production</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">9 Months</div>
                      <div className="text-sm text-slate-500">Until NIS2</div>
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
                  The Industrial Security Crisis
                </h3>
                <ul className="space-y-3 text-red-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Main SCADA system has 8 critical vulnerabilities
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    IoT sensors completely unmonitored and unpatched
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    €10M+ fines possible for NIS2 non-compliance
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Can't shut down production for security upgrades
                  </li>
                </ul>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Velocity's Industrial Solution
                </h3>
                <ul className="space-y-3 text-emerald-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Secure industrial systems without production downtime
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Automated vulnerability patching during maintenance windows
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    24/7 monitoring without affecting production performance
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Complete NIS2 compliance in 6 months
                  </li>
                </ul>
              </div>
            </div>

            {/* Expected Results */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6">Production-Safe Security</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold mb-2">Zero</div>
                    <div className="text-blue-100">Production Downtime</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">€12M+</div>
                    <div className="text-blue-100">Fines Avoided</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">6 Months</div>
                    <div className="text-blue-100">To NIS2 Compliance</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">98%</div>
                    <div className="text-blue-100">Security Automated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OT Systems Tab */}
        {activeTab === 'ot-systems' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Industrial System Security Assessment</h3>
              <div className="grid gap-6">
                {industrialSystems.map((system) => {
                  const TypeIcon = getSystemTypeIcon(system.type);
                  return (
                    <div key={system.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <TypeIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h4 className="font-semibold text-slate-900">{system.name}</h4>
                              <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">
                                {system.type}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCriticalityColor(system.criticality)}`}>
                                {system.criticality}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPatchLevelColor(system.patchLevel)}`}>
                                {system.patchLevel} patches
                              </span>
                            </div>
                            
                            <div className={`border rounded-lg p-3 mb-3 ${
                              system.complianceGap.includes('Good') || system.complianceGap.includes('Well secured') ? 'bg-emerald-50 border-emerald-200' :
                              system.complianceGap.includes('Moderate') ? 'bg-blue-50 border-blue-200' :
                              system.complianceGap.includes('High risk') ? 'bg-amber-50 border-amber-200' :
                              'bg-red-50 border-red-200'
                            }`}>
                              <div className={`text-sm font-medium mb-1 ${
                                system.complianceGap.includes('Good') || system.complianceGap.includes('Well secured') ? 'text-emerald-800' :
                                system.complianceGap.includes('Moderate') ? 'text-blue-800' :
                                system.complianceGap.includes('High risk') ? 'text-amber-800' :
                                'text-red-800'
                              }`}>
                                Security Status:
                              </div>
                              <div className={`text-sm ${
                                system.complianceGap.includes('Good') || system.complianceGap.includes('Well secured') ? 'text-emerald-700' :
                                system.complianceGap.includes('Moderate') ? 'text-blue-700' :
                                system.complianceGap.includes('High risk') ? 'text-amber-700' :
                                'text-red-700'
                              }`}>
                                {system.complianceGap}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                              <div>
                                <span className="font-medium">Vulnerabilities:</span> 
                                <span className={`ml-1 font-bold ${
                                  system.vulnerabilities === 0 ? 'text-emerald-600' :
                                  system.vulnerabilities < 5 ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                  {system.vulnerabilities}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Network Isolation:</span> 
                                <span className={`ml-1 ${system.networkSegmentation ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {system.networkSegmentation ? 'Yes' : 'No'}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Monitoring:</span> 
                                <span className={`ml-1 ${
                                  system.monitoringStatus === 'active' ? 'text-emerald-600' :
                                  system.monitoringStatus === 'partial' ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                  {system.monitoringStatus}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Business Impact:</span> 
                                <span className={`ml-1 ${
                                  system.criticality === 'essential' ? 'text-red-600' :
                                  system.criticality === 'important' ? 'text-amber-600' : 'text-blue-600'
                                }`}>
                                  {system.criticality === 'essential' ? 'Production Critical' :
                                   system.criticality === 'important' ? 'Important' : 'Standard'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 text-right">
                          <div className={`text-2xl font-bold mb-1 ${
                            system.vulnerabilities === 0 ? 'text-emerald-600' :
                            system.vulnerabilities < 5 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {system.vulnerabilities}
                          </div>
                          <div className="text-xs text-slate-500 mb-3">Vulnerabilities</div>
                          <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                            {system.vulnerabilities > 5 ? 'Emergency Fix' : 'Secure System'}
                          </button>
                        </div>
                      </div>
                      
                      {(system.vulnerabilities > 5 || !system.networkSegmentation) && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="font-medium text-red-800">Critical Security Issues</span>
                          </div>
                          <p className="text-red-700 text-sm mb-3">
                            This system poses significant risk to production and NIS2 compliance. 
                            {system.vulnerabilities > 5 && ' Multiple critical vulnerabilities detected.'}
                            {!system.networkSegmentation && ' No network isolation from corporate systems.'}
                          </p>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                              Emergency Patch
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                              Isolate Network
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

            {/* Industrial Systems Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-red-600 mb-2">2</div>
                <div className="text-red-700">Critical Systems</div>
                <div className="text-sm text-red-600 mt-2">Need immediate attention</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-amber-600 mb-2">29</div>
                <div className="text-amber-700">Total Vulnerabilities</div>
                <div className="text-sm text-amber-600 mt-2">Across all systems</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <Network className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-600 mb-2">60%</div>
                <div className="text-blue-700">Network Segmented</div>
                <div className="text-sm text-blue-600 mt-2">Need improvement</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-600 mb-2">40%</div>
                <div className="text-emerald-700">Fully Monitored</div>
                <div className="text-sm text-emerald-600 mt-2">Good coverage</div>
              </div>
            </div>
          </div>
        )}

        {/* NIS2 Controls Tab */}
        {activeTab === 'nis2-controls' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">NIS2 Directive Compliance Controls</h3>
              <div className="grid gap-6">
                {nis2Controls.map((control) => {
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
                              <div>
                                <span className="font-medium">Affected Systems:</span> {control.affectedSystems.join(', ')}
                              </div>
                              <div>
                                <span className="font-medium">Deadline:</span> {control.deadline.toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Last Review:</span> {control.lastReview.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 text-right">
                          <div className="text-2xl font-bold text-blue-600 mb-1">{control.automationLevel}%</div>
                          <div className="text-xs text-slate-500 mb-3">Compliant</div>
                          <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                            View Plan
                          </button>
                        </div>
                      </div>
                      
                      {(control.status === 'critical-gap' || control.status === 'gap') && (
                        <div className={`border rounded-lg p-4 mt-4 ${
                          control.status === 'critical-gap' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={`w-4 h-4 ${
                              control.status === 'critical-gap' ? 'text-red-600' : 'text-amber-600'
                            }`} />
                            <span className={`font-medium ${
                              control.status === 'critical-gap' ? 'text-red-800' : 'text-amber-800'
                            }`}>
                              {control.status === 'critical-gap' ? 'Critical Compliance Gap' : 'Compliance Gap'}
                            </span>
                          </div>
                          <p className={`text-sm mb-3 ${
                            control.status === 'critical-gap' ? 'text-red-700' : 'text-amber-700'
                          }`}>
                            {control.status === 'critical-gap' ? 
                              'This critical gap could result in significant fines and business disruption under NIS2.' :
                              'This control needs attention to meet NIS2 requirements by the October 2024 deadline.'
                            }
                          </p>
                          <div className="flex gap-2">
                            <button className={`px-4 py-2 text-white rounded-lg text-sm font-medium ${
                              control.status === 'critical-gap' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
                            }`}>
                              {control.status === 'critical-gap' ? 'Emergency Fix' : 'Implement Control'}
                            </button>
                            <button className={`px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-slate-50 ${
                              control.status === 'critical-gap' ? 'text-red-600 border-red-600' : 'text-amber-600 border-amber-600'
                            }`}>
                              Action Plan
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NIS2 Controls Summary */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-600 mb-2">Cybersecurity</div>
                <div className="text-slate-600">Risk Management</div>
                <div className="text-sm text-slate-500 mt-2">75% complete</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-amber-600 mb-2">Reporting</div>
                <div className="text-slate-600">Incident Notification</div>
                <div className="text-sm text-slate-500 mt-2">45% complete</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <Activity className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-600 mb-2">Continuity</div>
                <div className="text-slate-600">Business Recovery</div>
                <div className="text-sm text-slate-500 mt-2">90% complete</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <Truck className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-red-600 mb-2">Supply Chain</div>
                <div className="text-slate-600">Supplier Security</div>
                <div className="text-sm text-slate-500 mt-2">30% complete</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-600 mb-2">Governance</div>
                <div className="text-slate-600">Management Oversight</div>
                <div className="text-sm text-slate-500 mt-2">65% complete</div>
              </div>
            </div>
          </div>
        )}

        {/* Incident Response Tab */}
        {activeTab === 'incident-response' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Industrial Incident Response & Recovery</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Recent Security Incidents</h4>
                  <div className="space-y-4">
                    {[
                      {
                        incident: 'Unauthorized PLC Access Attempt',
                        severity: 'High',
                        system: 'Assembly Line PLCs',
                        detected: '15 minutes ago',
                        status: 'Blocked',
                        impact: 'No production impact'
                      },
                      {
                        incident: 'IoT Sensor Malware Detection',
                        severity: 'Critical',
                        system: 'Temperature Sensors',
                        detected: '2 hours ago',
                        status: 'Contained',
                        impact: 'Sensors isolated, backup monitoring active'
                      },
                      {
                        incident: 'SCADA Login Brute Force',
                        severity: 'Medium',
                        system: 'Main Production SCADA',
                        detected: '4 hours ago',
                        status: 'Mitigated',
                        impact: 'Account locked, no system access gained'
                      }
                    ].map((incident, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-slate-900">{incident.incident}</div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            incident.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                            incident.severity === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {incident.severity}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 mb-2">
                          <div><span className="font-medium">System:</span> {incident.system}</div>
                          <div><span className="font-medium">Detected:</span> {incident.detected}</div>
                          <div><span className="font-medium">Status:</span> 
                            <span className={`ml-1 font-medium ${
                              incident.status === 'Blocked' || incident.status === 'Contained' ? 'text-emerald-600' : 'text-blue-600'
                            }`}>
                              {incident.status}
                            </span>
                          </div>
                          <div><span className="font-medium">Impact:</span> {incident.impact}</div>
                        </div>
                        <div className="mt-3">
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 mr-2">
                            View Details
                          </button>
                          <button className="px-3 py-1 bg-white text-blue-600 border border-blue-600 rounded text-sm font-medium hover:bg-blue-50">
                            Generate Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Automated Response Capabilities</h4>
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium text-emerald-800">Immediate Threat Blocking</span>
                      </div>
                      <div className="text-sm text-emerald-700 mb-2">
                        Suspicious connections blocked within 30 seconds
                      </div>
                      <div className="text-xs text-emerald-600">✓ Active on all critical systems</div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Production-Safe Isolation</span>
                      </div>
                      <div className="text-sm text-blue-700 mb-2">
                        Infected systems isolated without stopping production
                      </div>
                      <div className="text-xs text-blue-600">✓ Tested on all production lines</div>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-800">NIS2 Auto-Reporting</span>
                      </div>
                      <div className="text-sm text-purple-700 mb-2">
                        Incident reports generated and filed within 24 hours
                      </div>
                      <div className="text-xs text-purple-600">✓ Meets all NIS2 requirements</div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-amber-800">Recovery Automation</span>
                      </div>
                      <div className="text-sm text-amber-700 mb-2">
                        Systems restored from clean backups automatically
                      </div>
                      <div className="text-xs text-amber-600">◷ Implementation in progress</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">30sec</div>
                <div className="text-slate-600">Response Time</div>
                <div className="text-sm text-slate-500 mt-2">Average threat blocking</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-slate-600">Production Uptime</div>
                <div className="text-sm text-slate-500 mt-2">During security incidents</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24hrs</div>
                <div className="text-slate-600">NIS2 Reporting</div>
                <div className="text-sm text-slate-500 mt-2">Automatic compliance</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">Zero</div>
                <div className="text-slate-600">Data Breaches</div>
                <div className="text-sm text-slate-500 mt-2">Since Velocity deployment</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Secure Your Factory Without the Downtime
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join manufacturing leaders achieving NIS2 compliance while maintaining full production capacity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Assess Your Factory
            </button>
            <button
              onClick={() => navigate('/industries/manufacturing')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Manufacturing Solutions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturingNIS2Demo;