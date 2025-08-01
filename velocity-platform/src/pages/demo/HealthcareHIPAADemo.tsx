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
  Heart,
  UserCheck,
  FileShield,
  Stethoscope,
  AlertCircle
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface HIPAAControl {
  id: string;
  category: 'administrative' | 'physical' | 'technical';
  name: string;
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'implementing';
  patientDataTypes: string[];
  riskLevel: 'low' | 'medium' | 'high';
  automationLevel: number;
  lastAssessed: Date;
}

interface PHIDataFlow {
  id: string;
  source: string;
  destination: string;
  dataType: string;
  volume: number;
  encrypted: boolean;
  authorized: boolean;
  riskScore: number;
}

const HealthcareHIPAADemo: React.FC = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'controls' | 'phi-tracking' | 'breach-prevention'>('overview');
  const [phiMonitoring, setPHIMonitoring] = useState(false);

  const [hipaaControls] = useState<HIPAAControl[]>([
    {
      id: '164.308(a)(1)',
      category: 'administrative',
      name: 'Security Officer Assignment',
      description: 'Assigned security responsibility to develop and implement policies and procedures',
      status: 'compliant',
      patientDataTypes: ['All PHI'],
      riskLevel: 'low',
      automationLevel: 95,
      lastAssessed: new Date('2025-01-15')
    },
    {
      id: '164.312(a)(1)',
      category: 'technical',
      name: 'Access Control',
      description: 'Unique user identification, emergency access procedures, automatic logoff',
      status: 'compliant',
      patientDataTypes: ['Medical Records', 'Patient Demographics'],
      riskLevel: 'low',
      automationLevel: 98,
      lastAssessed: new Date('2025-01-16')
    },
    {
      id: '164.312(e)(1)',
      category: 'technical',
      name: 'Transmission Security',
      description: 'Guard against unauthorized access to PHI transmitted over networks',
      status: 'implementing',
      patientDataTypes: ['Lab Results', 'Imaging Data'],
      riskLevel: 'high',
      automationLevel: 75,
      lastAssessed: new Date('2025-01-10')
    },
    {
      id: '164.310(a)(1)',
      category: 'physical',
      name: 'Facility Access Controls',
      description: 'Limit physical access to facilities and workstations with PHI',
      status: 'compliant',
      patientDataTypes: ['Workstation Access'],
      riskLevel: 'medium',
      automationLevel: 85,
      lastAssessed: new Date('2025-01-14')
    },
    {
      id: '164.308(a)(6)',
      category: 'administrative',
      name: 'Security Incident Procedures',
      description: 'Identify and respond to suspected or known security incidents',
      status: 'partial',
      patientDataTypes: ['Breach Logs', 'Incident Reports'],
      riskLevel: 'high',
      automationLevel: 88,
      lastAssessed: new Date('2025-01-12')
    }
  ]);

  const [phiDataFlows] = useState<PHIDataFlow[]>([
    {
      id: '1',
      source: 'Patient Portal',
      destination: 'EMR System',
      dataType: 'Patient Demographics',
      volume: 1250,
      encrypted: true,
      authorized: true,
      riskScore: 15
    },
    {
      id: '2',
      source: 'Lab System',
      destination: 'Provider Dashboard',
      dataType: 'Lab Results',
      volume: 850,
      encrypted: true,
      authorized: true,
      riskScore: 25
    },
    {
      id: '3',
      source: 'Imaging System',
      destination: 'Cloud Storage',
      dataType: 'Medical Images',
      volume: 450,
      encrypted: false,
      authorized: false,
      riskScore: 95
    },
    {
      id: '4',
      source: 'EMR System',
      destination: 'Billing System',
      dataType: 'Treatment Records',
      volume: 2100,
      encrypted: true,
      authorized: true,
      riskScore: 20
    }
  ]);

  const startDemo = () => {
    setIsRunning(true);
    setPHIMonitoring(true);
    setDemoProgress(0);
    
    const interval = setInterval(() => {
      setDemoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + Math.random() * 10 + 5;
      });
    }, 1000);
  };

  const getStatusColor = (status: HIPAAControl['status']) => {
    const colors = {
      'compliant': 'bg-emerald-100 text-emerald-800',
      'implementing': 'bg-blue-100 text-blue-800',
      'partial': 'bg-amber-100 text-amber-800',
      'non-compliant': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getCategoryIcon = (category: HIPAAControl['category']) => {
    const icons = {
      'administrative': Users,
      'physical': Building,
      'technical': Shield
    };
    return icons[category];
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 30) return 'text-emerald-600';
    if (riskScore < 70) return 'text-amber-600';
    return 'text-red-600';
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
                <Heart className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Healthcare Demo</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Medical Device
              <span className="block text-blue-400">HIPAA Compliance</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Watch how MedTech Solutions ensures HIPAA compliance for their patient monitoring devices 
              with automated PHI tracking, breach prevention, and regulatory reporting.
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
                    Start HIPAA Demo
                  </>
                )}
              </button>
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                Healthcare Assessment
              </button>
            </div>

            {/* Live PHI Monitoring */}
            {phiMonitoring && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live PHI Monitoring
                  </span>
                  <span className="text-emerald-300">{Math.round(demoProgress)}% Complete</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 mb-3">
                  <div 
                    className="bg-emerald-400 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${demoProgress}%` }}
                  ></div>
                </div>
                <p className="text-slate-200 text-sm">Scanning patient data flows and access patterns...</p>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">4,650</div>
                    <div className="text-xs text-slate-300">PHI Records Monitored</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">100%</div>
                    <div className="text-xs text-slate-300">Authorized Access</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">1</div>
                    <div className="text-xs text-slate-300">Risk Detected</div>
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
              { id: 'controls', label: 'HIPAA Controls', icon: Shield },
              { id: 'phi-tracking', label: 'PHI Data Flows', icon: Database },
              { id: 'breach-prevention', label: 'Breach Prevention', icon: AlertTriangle }
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
                  <Stethoscope className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">MedTech Solutions</h2>
                  <p className="text-slate-600 mb-4">
                    Leading manufacturer of patient monitoring devices and IoMT (Internet of Medical Things) solutions. 
                    Serves 200+ hospitals with real-time patient data collection and analysis platforms.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">500K+</div>
                      <div className="text-sm text-slate-500">Patients Monitored</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">200+</div>
                      <div className="text-sm text-slate-500">Healthcare Facilities</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">24/7</div>
                      <div className="text-sm text-slate-500">Patient Monitoring</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600">HIPAA</div>
                      <div className="text-sm text-slate-500">Compliant</div>
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
                  Healthcare Compliance Challenges
                </h3>
                <ul className="space-y-3 text-red-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Complex PHI data flows across 50+ integrated systems
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Manual HIPAA risk assessments taking 6+ months
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    Potential $4.3M penalties for HIPAA violations
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    IoMT devices creating new attack vectors
                  </li>
                </ul>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Velocity Healthcare Solution
                </h3>
                <ul className="space-y-3 text-emerald-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Real-time PHI tracking across all systems and devices
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Automated HIPAA risk assessments in 2 weeks
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    Continuous breach monitoring and prevention
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    IoMT security compliance automation
                  </li>
                </ul>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6">Healthcare Compliance Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold mb-2">100%</div>
                    <div className="text-blue-100">HIPAA Compliance Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">€280K</div>
                    <div className="text-blue-100">Avoided Penalties</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">95%</div>
                    <div className="text-blue-100">PHI Monitoring Automated</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">0</div>
                    <div className="text-blue-100">Data Breaches</div>
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
              <h3 className="text-xl font-semibold text-slate-900 mb-4">HIPAA Safeguards Implementation</h3>
              <div className="grid gap-4">
                {hipaaControls.map((control) => {
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
                            <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                              <span>PHI Types: {control.patientDataTypes.join(', ')}</span>
                              <span className={`font-medium ${
                                control.riskLevel === 'low' ? 'text-emerald-600' : 
                                control.riskLevel === 'medium' ? 'text-amber-600' : 'text-red-600'
                              }`}>
                                {control.riskLevel} risk
                              </span>
                              <span>Last assessed: {control.lastAssessed.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <button className="ml-4 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Safeguards Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-600 mb-2">Administrative</div>
                <div className="text-slate-600">Policies & Procedures</div>
                <div className="text-sm text-slate-500 mt-2">18 controls implemented</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <Building className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-600 mb-2">Physical</div>
                <div className="text-slate-600">Facility & Workstation Security</div>
                <div className="text-sm text-slate-500 mt-2">8 controls implemented</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-600 mb-2">Technical</div>
                <div className="text-slate-600">Technology & Access Controls</div>
                <div className="text-sm text-slate-500 mt-2">12 controls implemented</div>
              </div>
            </div>
          </div>
        )}

        {/* PHI Tracking Tab */}
        {activeTab === 'phi-tracking' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Protected Health Information Data Flows</h3>
              
              <div className="space-y-4">
                {phiDataFlows.map((flow) => (
                  <div key={flow.id} className="border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">{flow.source}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-medium">{flow.destination}</span>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${getRiskColor(flow.riskScore)}`}>
                        Risk: {flow.riskScore}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500">Data Type</div>
                        <div className="font-medium">{flow.dataType}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Daily Volume</div>
                        <div className="font-medium">{flow.volume.toLocaleString()} records</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Encryption</div>
                        <div className={`font-medium ${flow.encrypted ? 'text-emerald-600' : 'text-red-600'}`}>
                          {flow.encrypted ? 'Encrypted' : 'Not Encrypted'}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Authorization</div>
                        <div className={`font-medium ${flow.authorized ? 'text-emerald-600' : 'text-red-600'}`}>
                          {flow.authorized ? 'Authorized' : 'Unauthorized'}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Status</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          flow.riskScore < 30 ? 'bg-emerald-100 text-emerald-800' :
                          flow.riskScore < 70 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {flow.riskScore < 30 ? 'Compliant' : flow.riskScore < 70 ? 'Review Needed' : 'High Risk'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PHI Monitoring Dashboard */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h4 className="font-semibold text-slate-900 mb-4">Real-time PHI Access Monitoring</h4>
                <div className="space-y-3">
                  {[
                    { user: 'Dr. Sarah Johnson', action: 'Accessed patient chart', time: '2 minutes ago', risk: 'low' },
                    { user: 'Nurse Mike Chen', action: 'Updated medication list', time: '5 minutes ago', risk: 'low' },
                    { user: 'Unauthorized API', action: 'Attempted bulk download', time: '12 minutes ago', risk: 'high' },
                    { user: 'Lab Tech Anna', action: 'Uploaded test results', time: '15 minutes ago', risk: 'low' }
                  ].map((access, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-900">{access.user}</div>
                        <div className="text-sm text-slate-600">{access.action}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">{access.time}</div>
                        <div className={`text-xs font-medium ${
                          access.risk === 'low' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {access.risk} risk
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h4 className="font-semibold text-slate-900 mb-4">PHI Data Classification</h4>
                <div className="space-y-4">
                  {[
                    { type: 'Medical Records', count: 1250000, classification: 'Highly Sensitive' },
                    { type: 'Lab Results', count: 850000, classification: 'Sensitive' },
                    { type: 'Patient Demographics', count: 500000, classification: 'Sensitive' },
                    { type: 'Billing Information', count: 350000, classification: 'Confidential' }
                  ].map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{data.type}</div>
                        <div className="text-sm text-slate-600">{data.count.toLocaleString()} records</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        data.classification === 'Highly Sensitive' ? 'bg-red-100 text-red-800' :
                        data.classification === 'Sensitive' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {data.classification}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breach Prevention Tab */}
        {activeTab === 'breach-prevention' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Automated Breach Prevention System</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Threat Detection & Response</h4>
                  <div className="space-y-4">
                    {[
                      {
                        threat: 'Unauthorized PHI Access Attempt',
                        severity: 'High',
                        status: 'Blocked',
                        time: '5 minutes ago',
                        response: 'Access denied, security team notified'
                      },
                      {
                        threat: 'Unusual Data Export Pattern',
                        severity: 'Medium',
                        status: 'Investigating',
                        time: '15 minutes ago',
                        response: 'User access temporarily restricted'
                      },
                      {
                        threat: 'Failed Login Attempts',
                        severity: 'Low',
                        status: 'Monitoring',
                        time: '1 hour ago',
                        response: 'Account locked after 3 attempts'
                      }
                    ].map((threat, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-slate-900">{threat.threat}</div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            threat.severity === 'High' ? 'bg-red-100 text-red-800' :
                            threat.severity === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {threat.severity}
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 mb-2">{threat.response}</div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{threat.time}</span>
                          <span className={`font-medium ${
                            threat.status === 'Blocked' ? 'text-emerald-600' :
                            threat.status === 'Investigating' ? 'text-amber-600' : 'text-blue-600'
                          }`}>
                            {threat.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Compliance Monitoring</h4>
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium text-emerald-800">Data Encryption</span>
                      </div>
                      <div className="text-sm text-emerald-700">
                        100% of PHI transmissions encrypted with AES-256
                      </div>
                    </div>
                    
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium text-emerald-800">Access Controls</span>
                      </div>
                      <div className="text-sm text-emerald-700">
                        Role-based access with automatic session timeouts active
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-amber-800">Audit Logging</span>
                      </div>
                      <div className="text-sm text-amber-700">
                        1 system missing comprehensive audit logs - remediation in progress
                      </div>
                    </div>
                    
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium text-emerald-800">Backup & Recovery</span>
                      </div>
                      <div className="text-sm text-emerald-700">
                        Automated encrypted backups running every 4 hours
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Breach Prevention Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">0</div>
                <div className="text-slate-600">Data Breaches</div>
                <div className="text-sm text-slate-500 mt-2">Since implementation</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-slate-600">Threat Detection</div>
                <div className="text-sm text-slate-500 mt-2">Accuracy rate</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">30sec</div>
                <div className="text-slate-600">Response Time</div>
                <div className="text-sm text-slate-500 mt-2">Average incident response</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
                <div className="text-slate-600">Monitoring</div>
                <div className="text-sm text-slate-500 mt-2">Continuous protection</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Secure Your Healthcare Data with HIPAA Compliance
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join 200+ healthcare organizations protecting patient data with Velocity's automated compliance platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Healthcare Assessment
            </button>
            <button
              onClick={() => navigate('/industries/healthcare')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Healthcare Solutions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareHIPAADemo;