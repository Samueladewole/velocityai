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
  CreditCard,
  DollarSign,
  BarChart3,
  Layers,
  Server
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'in-progress' | 'gap-identified' | 'not-started';
  progress: number;
  controlsTotal: number;
  controlsCompliant: number;
  riskLevel: 'low' | 'medium' | 'high';
  priority: 'high' | 'medium' | 'low';
  nextAudit: Date;
}

interface TransactionMonitoring {
  id: string;
  type: 'payment' | 'transfer' | 'loan' | 'investment';
  amount: number;
  flagged: boolean;
  riskScore: number;
  complianceCheck: string;
  timestamp: Date;
}

const FintechMultiFrameworkDemo: React.FC = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [demoPhase, setDemoPhase] = useState<'overview' | 'implementation' | 'monitoring' | 'reporting'>('overview');
  const [activeTab, setActiveTab] = useState<'frameworks' | 'transactions' | 'integration' | 'reporting'>('frameworks');
  const [liveMonitoring, setLiveMonitoring] = useState(false);

  const [frameworks] = useState<ComplianceFramework[]>([
    {
      id: 'soc2',
      name: 'SOC 2 Type II',
      description: 'Service Organization Control 2 for data security and availability',
      status: 'compliant',
      progress: 100,
      controlsTotal: 64,
      controlsCompliant: 64,
      riskLevel: 'low',
      priority: 'high',
      nextAudit: new Date('2025-06-15')
    },
    {
      id: 'pci-dss',
      name: 'PCI DSS Level 1',
      description: 'Payment Card Industry Data Security Standard for payment processing',
      status: 'compliant',
      progress: 98,
      controlsTotal: 375,
      controlsCompliant: 368,
      riskLevel: 'low',
      priority: 'high',
      nextAudit: new Date('2025-04-20')
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      description: 'Information Security Management System certification',
      status: 'in-progress',
      progress: 85,
      controlsTotal: 114,
      controlsCompliant: 97,
      riskLevel: 'medium',
      priority: 'medium',
      nextAudit: new Date('2025-08-10')
    },
    {
      id: 'basel3',
      name: 'Basel III Capital Requirements',
      description: 'International banking regulatory framework for capital adequacy',
      status: 'gap-identified',
      progress: 72,
      controlsTotal: 45,
      controlsCompliant: 32,
      riskLevel: 'high',
      priority: 'high',
      nextAudit: new Date('2025-03-30')
    },
    {
      id: 'aml-kyc',
      name: 'AML/KYC Compliance',
      description: 'Anti-Money Laundering and Know Your Customer regulations',
      status: 'in-progress',
      progress: 88,
      controlsTotal: 28,
      controlsCompliant: 25,
      riskLevel: 'medium',
      priority: 'high',
      nextAudit: new Date('2025-05-15')
    }
  ]);

  const [transactionData] = useState<TransactionMonitoring[]>([
    {
      id: '1',
      type: 'payment',
      amount: 15000,
      flagged: true,
      riskScore: 85,
      complianceCheck: 'AML screening required',
      timestamp: new Date('2025-01-15T10:30:00')
    },
    {
      id: '2',
      type: 'transfer',
      amount: 2500,
      flagged: false,
      riskScore: 25,
      complianceCheck: 'Standard processing',
      timestamp: new Date('2025-01-15T10:25:00')
    },
    {
      id: '3',
      type: 'loan',
      amount: 75000,
      flagged: true,
      riskScore: 92,
      complianceCheck: 'Basel III capital assessment',
      timestamp: new Date('2025-01-15T10:20:00')
    },
    {
      id: '4',
      type: 'investment',
      amount: 45000,
      flagged: false,
      riskScore: 35,
      complianceCheck: 'MiFID II compliant',
      timestamp: new Date('2025-01-15T10:15:00')
    }
  ]);

  const startDemo = () => {
    setIsRunning(true);
    setLiveMonitoring(true);
    simulateMultiFrameworkCompliance();
  };

  const simulateMultiFrameworkCompliance = () => {
    const phases = ['overview', 'implementation', 'monitoring', 'reporting'];
    phases.forEach((phase, index) => {
      setTimeout(() => {
        setDemoPhase(phase as any);
        if (index === phases.length - 1) {
          setTimeout(() => setIsRunning(false), 3000);
        }
      }, index * 4000);
    });
  };

  const getStatusColor = (status: ComplianceFramework['status']) => {
    const colors = {
      'compliant': 'bg-emerald-100 text-emerald-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'gap-identified': 'bg-amber-100 text-amber-800',
      'not-started': 'bg-slate-100 text-slate-600'
    };
    return colors[status];
  };

  const getRiskColor = (riskLevel: string) => {
    const colors = {
      'low': 'text-emerald-600',
      'medium': 'text-amber-600',
      'high': 'text-red-600'
    };
    return colors[riskLevel as keyof typeof colors];
  };

  const getTransactionTypeIcon = (type: TransactionMonitoring['type']) => {
    const icons = {
      'payment': CreditCard,
      'transfer': ArrowRight,
      'loan': DollarSign,
      'investment': TrendingUp
    };
    return icons[type];
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
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Fintech Demo</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Multi-Framework
              <span className="block text-blue-400">Financial Compliance</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Watch FinanceFlow master SOC 2, PCI DSS, ISO 27001, Basel III, and AML/KYC compliance simultaneously 
              with Velocity's integrated multi-framework automation platform.
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
                    Running Multi-Framework Demo...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Fintech Demo
                  </>
                )}
              </button>
              <button 
                onClick={() => navigate('/industries/financial-services')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                Fintech Solutions
              </button>
            </div>

            {/* Demo Status */}
            {isRunning && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">Demo Phase: {demoPhase}</span>
                  <span className="text-blue-300 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Live Monitoring Active
                  </span>
                </div>
                <p className="text-slate-200 text-sm mb-4">
                  {demoPhase === 'overview' && 'Analyzing multi-framework compliance requirements...'}
                  {demoPhase === 'implementation' && 'Implementing automated controls across all frameworks...'}
                  {demoPhase === 'monitoring' && 'Real-time transaction monitoring and compliance checking...'}
                  {demoPhase === 'reporting' && 'Generating unified compliance reports...'}
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">5</div>
                    <div className="text-xs text-slate-300">Frameworks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">626</div>
                    <div className="text-xs text-slate-300">Total Controls</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">89%</div>
                    <div className="text-xs text-slate-300">Avg Compliance</div>
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
              { id: 'frameworks', label: 'Compliance Frameworks', icon: Layers },
              { id: 'transactions', label: 'Transaction Monitoring', icon: Activity },
              { id: 'integration', label: 'System Integration', icon: Server },
              { id: 'reporting', label: 'Unified Reporting', icon: BarChart3 }
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
        
        {/* Company Profile */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-blue-100 rounded-xl">
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">FinanceFlow</h2>
              <p className="text-slate-600 mb-4">
                Digital banking platform providing payment processing, lending, and investment services. 
                Processes $2B+ annually across 15 countries with 500K+ active users requiring multiple regulatory compliance.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">$2B+</div>
                  <div className="text-sm text-slate-500">Annual Volume</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">500K+</div>
                  <div className="text-sm text-slate-500">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">15</div>
                  <div className="text-sm text-slate-500">Countries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600">5</div>
                  <div className="text-sm text-slate-500">Frameworks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">€50M</div>
                  <div className="text-sm text-slate-500">Penalty Risk</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frameworks Tab */}
        {activeTab === 'frameworks' && (
          <div className="space-y-6">
            <div className="grid gap-6">
              {frameworks.map((framework) => (
                <div key={framework.id} className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{framework.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(framework.status)}`}>
                          {framework.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          framework.priority === 'high' ? 'bg-red-100 text-red-800' :
                          framework.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {framework.priority} priority
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-4">{framework.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-slate-500">Progress</div>
                          <div className="font-semibold">{framework.progress}%</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Controls</div>
                          <div className="font-semibold">{framework.controlsCompliant}/{framework.controlsTotal}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Risk Level</div>
                          <div className={`font-semibold ${getRiskColor(framework.riskLevel)}`}>
                            {framework.riskLevel}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">Next Audit</div>
                          <div className="font-semibold">{framework.nextAudit.toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 text-right">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{framework.progress}%</div>
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            framework.progress >= 90 ? 'bg-emerald-500' :
                            framework.progress >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${framework.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {framework.status === 'gap-identified' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="font-medium text-amber-800">Action Required</span>
                      </div>
                      <p className="text-amber-700 text-sm">
                        {framework.id === 'basel3' ? 
                          'Capital adequacy ratios need improvement. Automated stress testing implementation recommended.' :
                          'Compliance gaps identified. Review and remediation plan available.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Framework Summary */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6">Multi-Framework Compliance Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold mb-2">89%</div>
                    <div className="text-blue-100">Average Compliance</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">626</div>
                    <div className="text-blue-100">Total Controls</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">586</div>
                    <div className="text-blue-100">Controls Implemented</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">€47M</div>
                    <div className="text-blue-100">Penalty Risk Mitigated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Real-time Transaction Compliance Monitoring</h3>
              
              <div className="space-y-4">
                {transactionData.map((transaction) => {
                  const Icon = getTransactionTypeIcon(transaction.type);
                  return (
                    <div key={transaction.id} className={`border rounded-lg p-6 ${
                      transaction.flagged ? 'border-amber-200 bg-amber-50' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            transaction.flagged ? 'bg-amber-100' : 'bg-blue-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              transaction.flagged ? 'text-amber-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Transaction
                            </div>
                            <div className="text-sm text-slate-600">
                              {transaction.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">
                            €{transaction.amount.toLocaleString()}
                          </div>
                          <div className={`text-sm font-medium ${
                            transaction.riskScore < 50 ? 'text-emerald-600' :
                            transaction.riskScore < 80 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            Risk Score: {transaction.riskScore}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-slate-500">Compliance Status</div>
                          <div className={`font-medium ${transaction.flagged ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {transaction.flagged ? 'Flagged for Review' : 'Compliant'}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">Compliance Check</div>
                          <div className="font-medium">{transaction.complianceCheck}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Action Required</div>
                          <div className="font-medium">
                            {transaction.flagged ? 'Manual Review' : 'Auto-Approved'}
                          </div>
                        </div>
                      </div>
                      
                      {transaction.flagged && (
                        <div className="mt-4 flex gap-2">
                          <button className="px-3 py-1 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600">
                            Reject
                          </button>
                          <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600">
                            Investigate
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transaction Analytics */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2,847</div>
                <div className="text-slate-600">Daily Transactions</div>
                <div className="text-sm text-slate-500 mt-2">€125M processed</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">12</div>
                <div className="text-slate-600">Flagged for Review</div>
                <div className="text-sm text-slate-500 mt-2">0.4% flag rate</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">99.8%</div>
                <div className="text-slate-600">Auto-Compliance Rate</div>
                <div className="text-sm text-slate-500 mt-2">Real-time processing</div>
              </div>
            </div>
          </div>
        )}

        {/* Integration Tab */}
        {activeTab === 'integration' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Connected Financial Systems</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Core Banking Systems</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Temenos T24', type: 'Core Banking', status: 'active', compliance: ['SOC2', 'Basel III'] },
                      { name: 'FIS Profile', type: 'Customer Management', status: 'active', compliance: ['PCI DSS', 'AML'] },
                      { name: 'Murex', type: 'Trading Platform', status: 'active', compliance: ['MiFID II', 'ISO 27001'] },
                      { name: 'Calypso', type: 'Risk Management', status: 'active', compliance: ['Basel III', 'BCBS'] }
                    ].map((system, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-medium">{system.name}</div>
                          <div className="text-sm text-slate-600">{system.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm text-emerald-600">Connected</span>
                          </div>
                          <div className="flex gap-1">
                            {system.compliance.map((comp, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Compliance & Monitoring Tools</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'SAS AML', type: 'Anti-Money Laundering', status: 'active', frameworks: ['AML', 'KYC'] },
                      { name: 'FICO Falcon', type: 'Fraud Detection', status: 'active', frameworks: ['PCI DSS'] },
                      { name: 'Moody\'s RiskCalc', type: 'Credit Risk', status: 'active', frameworks: ['Basel III'] },
                      { name: 'IBM OpenPages', type: 'GRC Platform', status: 'active', frameworks: ['SOC2', 'ISO 27001'] }
                    ].map((tool, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-sm text-slate-600">{tool.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm text-emerald-600">Active</span>
                          </div>
                          <div className="flex gap-1">
                            {tool.frameworks.map((framework, idx) => (
                              <span key={idx} className="text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded">
                                {framework}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Integration Benefits */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <Database className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-600 mb-2">95%</div>
                <div className="text-emerald-700">Data Integration</div>
                <div className="text-sm text-emerald-600 mt-2">Automated evidence collection</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-600 mb-2">Real-time</div>
                <div className="text-blue-700">Compliance Monitoring</div>
                <div className="text-sm text-blue-600 mt-2">Continuous assessment</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-600 mb-2">Zero</div>
                <div className="text-purple-700">Manual Intervention</div>
                <div className="text-sm text-purple-600 mt-2">Fully automated workflows</div>
              </div>
            </div>
          </div>
        )}

        {/* Reporting Tab */}
        {activeTab === 'reporting' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Unified Compliance Reporting</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Regulatory Reports</h4>
                  <div className="space-y-4">
                    {[
                      { report: 'SOC 2 Type II Readiness', status: 'Ready', dueDate: '2025-06-15', confidence: 98 },
                      { report: 'PCI DSS Self-Assessment', status: 'Complete', dueDate: '2025-04-20', confidence: 100 },
                      { report: 'Basel III Capital Adequacy', status: 'In Progress', dueDate: '2025-03-30', confidence: 72 },
                      { report: 'AML Suspicious Activity', status: 'Monthly Auto', dueDate: 'Ongoing', confidence: 95 }
                    ].map((report, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-slate-900">{report.report}</div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === 'Complete' || report.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' :
                            report.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {report.status}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>Due: {report.dueDate}</span>
                          <span className="font-medium">Confidence: {report.confidence}%</span>
                        </div>
                        <div className="mt-2 w-full bg-slate-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${
                              report.confidence >= 90 ? 'bg-emerald-500' :
                              report.confidence >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${report.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Executive Dashboard</h4>
                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600">89%</div>
                        <div className="text-sm text-slate-600">Overall Compliance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">€47M</div>
                        <div className="text-sm text-slate-600">Risk Mitigated</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {frameworks.map((framework) => (
                        <div key={framework.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{framework.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full ${
                                  framework.progress >= 90 ? 'bg-emerald-500' :
                                  framework.progress >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${framework.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-600 w-8">{framework.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Generation */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Generate Custom Compliance Report</h3>
              <p className="text-blue-100 mb-6">
                Create comprehensive compliance reports for stakeholders, auditors, or regulators
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                  Executive Summary
                </button>
                <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                  Detailed Audit Report
                </button>
                <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                  Regulatory Filing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Master Multi-Framework Financial Compliance
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join leading fintech companies achieving comprehensive compliance across all regulatory frameworks
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Fintech Assessment
            </button>
            <button
              onClick={() => navigate('/calculators/banking-roi')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Calculate ROI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FintechMultiFrameworkDemo;