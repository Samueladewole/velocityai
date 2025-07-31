import React, { useState, useEffect } from 'react';
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
  Search,
  Filter,
  Target,
  Building
} from 'lucide-react';

interface DataFlow {
  id: string;
  name: string;
  category: 'customer-data' | 'transaction-data' | 'employee-data' | 'vendor-data';
  personalDataTypes: string[];
  legalBasis: string;
  purposes: string[];
  retentionPeriod: string;
  thirdPartySharing: boolean;
  dataLocation: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: Date;
}

interface RoPARecord {
  id: string;
  processingActivity: string;
  controller: string;
  dpo: string;
  purposes: string[];
  categories: string[];
  recipients: string[];
  thirdCountries: string[];
  retentionPeriod: string;
  technicalMeasures: string[];
  organisationalMeasures: string[];
  lastReview: Date;
  status: 'draft' | 'approved' | 'under-review';
}

const GDPRRoPADemo: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<'discovery' | 'mapping' | 'classification' | 'ropa' | 'complete'>('discovery');
  const [discoveredData, setDiscoveredData] = useState<DataFlow[]>([]);
  const [ropaRecords, setRopaRecords] = useState<RoPARecord[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const bankingSystems = [
    { name: 'Core Banking System', type: 'customer-data', count: 2500000 },
    { name: 'Credit Management', type: 'transaction-data', count: 850000 },
    { name: 'Digital Banking Platform', type: 'customer-data', count: 1200000 },
    { name: 'Payment Processing', type: 'transaction-data', count: 3500000 },
    { name: 'HR Information System', type: 'employee-data', count: 15000 },
    { name: 'Vendor Management System', type: 'vendor-data', count: 45000 }
  ];

  const sampleDataFlows: DataFlow[] = [
    {
      id: 'flow-001',
      name: 'Customer Account Opening',
      category: 'customer-data',
      personalDataTypes: ['Name', 'Address', 'Date of Birth', 'National ID', 'Email', 'Phone'],
      legalBasis: 'Contract performance',
      purposes: ['Account establishment', 'KYC compliance', 'Risk assessment'],
      retentionPeriod: '10 years after account closure',
      thirdPartySharing: true,
      dataLocation: 'EU, UK',
      riskLevel: 'medium',
      lastUpdated: new Date()
    },
    {
      id: 'flow-002',
      name: 'Credit Card Transactions',
      category: 'transaction-data',
      personalDataTypes: ['Cardholder name', 'Card number (masked)', 'Transaction amount', 'Merchant details'],
      legalBasis: 'Contract performance',
      purposes: ['Payment processing', 'Fraud prevention', 'Financial reporting'],
      retentionPeriod: '7 years',
      thirdPartySharing: true,
      dataLocation: 'EU, US (adequacy decision)',
      riskLevel: 'high',
      lastUpdated: new Date()
    },
    {
      id: 'flow-003',
      name: 'Employee Payroll Processing',
      category: 'employee-data',
      personalDataTypes: ['Name', 'Address', 'Tax ID', 'Bank details', 'Salary information'],
      legalBasis: 'Legal obligation',
      purposes: ['Payroll processing', 'Tax reporting', 'Benefits administration'],
      retentionPeriod: '7 years',
      thirdPartySharing: false,
      dataLocation: 'EU',
      riskLevel: 'medium',
      lastUpdated: new Date()
    },
    {
      id: 'flow-004',
      name: 'Digital Banking Usage Analytics',
      category: 'customer-data',
      personalDataTypes: ['User ID', 'IP address', 'Device information', 'Usage patterns'],
      legalBasis: 'Legitimate interest',
      purposes: ['Service improvement', 'Security monitoring', 'Product development'],
      retentionPeriod: '2 years',
      thirdPartySharing: false,
      dataLocation: 'EU',
      riskLevel: 'low',
      lastUpdated: new Date()
    }
  ];

  const sampleRopaRecords: RoPARecord[] = [
    {
      id: 'ropa-001',
      processingActivity: 'Customer Account Management',
      controller: 'Velocity Bank Ltd',
      dpo: 'dpo@velocitybank.com',
      purposes: ['Account establishment', 'KYC compliance', 'Customer service'],
      categories: ['Name and contact details', 'Financial information', 'Identification data'],
      recipients: ['Credit reference agencies', 'Regulatory authorities', 'IT service providers'],
      thirdCountries: ['United Kingdom (adequacy decision)'],
      retentionPeriod: '10 years after account closure or relationship termination',
      technicalMeasures: ['Encryption at rest and in transit', 'Access controls', 'Regular security updates'],
      organisationalMeasures: ['Staff training', 'Data protection policies', 'Regular audits'],
      lastReview: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: 'approved'
    },
    {
      id: 'ropa-002',
      processingActivity: 'Payment Transaction Processing',
      controller: 'Velocity Bank Ltd',
      dpo: 'dpo@velocitybank.com',
      purposes: ['Payment processing', 'Fraud prevention', 'Transaction monitoring'],
      categories: ['Payment data', 'Transaction history', 'Device information'],
      recipients: ['Payment processors', 'Fraud prevention services', 'Regulatory authorities'],
      thirdCountries: ['United States (Standard Contractual Clauses)'],
      retentionPeriod: '7 years from transaction date',
      technicalMeasures: ['Tokenization', 'End-to-end encryption', 'Secure APIs'],
      organisationalMeasures: ['PCI DSS compliance', 'Regular penetration testing', 'Incident response plan'],
      lastReview: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'approved'
    }
  ];

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(100, prev + Math.random() * 3 + 1);
          
          // Update current step based on progress
          if (newProgress < 25) {
            setCurrentStep('discovery');
          } else if (newProgress < 50) {
            setCurrentStep('mapping');
          } else if (newProgress < 75) {
            setCurrentStep('classification');
          } else if (newProgress < 100) {
            setCurrentStep('ropa');
          } else {
            setCurrentStep('complete');
            setIsRunning(false);
          }
          
          return newProgress;
        });
      }, 500);

      // Add discovered data flows gradually
      const dataInterval = setInterval(() => {
        setDiscoveredData(prev => {
          if (prev.length < sampleDataFlows.length) {
            return [...prev, sampleDataFlows[prev.length]];
          }
          return prev;
        });
      }, 2000);

      // Add RoPA records after 75% progress
      const ropaInterval = setInterval(() => {
        if (progress > 75) {
          setRopaRecords(prev => {
            if (prev.length < sampleRopaRecords.length) {
              return [...prev, sampleRopaRecords[prev.length]];
            }
            return prev;
          });
        }
      }, 3000);

      return () => {
        clearInterval(interval);
        clearInterval(dataInterval);
        clearInterval(ropaInterval);
      };
    }
  }, [isRunning, progress]);

  const handleStart = () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentStep('discovery');
    setDiscoveredData([]);
    setRopaRecords([]);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setProgress(0);
    setCurrentStep('discovery');
    setDiscoveredData([]);
    setRopaRecords([]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'customer-data':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'transaction-data':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'employee-data':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'vendor-data':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'low':
        return 'text-emerald-600 bg-emerald-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'under-review':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'draft':
        return 'text-slate-600 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const filteredDataFlows = discoveredData.filter(flow => {
    if (selectedCategory !== 'all' && flow.category !== selectedCategory) return false;
    if (searchQuery && !flow.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">GDPR RoPA Generator Demo</h1>
              <p className="text-slate-600 mt-1">AI-powered Records of Processing Activities automation</p>
            </div>
            <div className="flex items-center gap-3">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Start Discovery
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  Stop
                </button>
              )}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-slate-500 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Discovery Progress</h2>
            <span className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-3 mb-6">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-5 gap-4">
            {[
              { id: 'discovery', label: 'Data Discovery', icon: Database, description: 'Scanning banking systems' },
              { id: 'mapping', label: 'Data Mapping', icon: Target, description: 'Mapping data flows' },
              { id: 'classification', label: 'Classification', icon: Shield, description: 'Classifying data types' },
              { id: 'ropa', label: 'RoPA Generation', icon: FileText, description: 'Creating RoPA records' },
              { id: 'complete', label: 'Complete', icon: CheckCircle, description: 'Process finished' }
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = ['discovery', 'mapping', 'classification', 'ropa'].indexOf(currentStep) > ['discovery', 'mapping', 'classification', 'ropa'].indexOf(step.id);
              
              return (
                <div key={step.id} className={`text-center p-4 rounded-lg border-2 transition-all ${
                  isActive ? 'border-blue-500 bg-blue-50' : 
                  isCompleted ? 'border-emerald-500 bg-emerald-50' : 
                  'border-slate-200 bg-slate-50'
                }`}>
                  <div className={`p-2 rounded-full w-fit mx-auto mb-2 ${
                    isActive ? 'bg-blue-100' : 
                    isCompleted ? 'bg-emerald-100' : 
                    'bg-slate-200'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isActive ? 'text-blue-600' : 
                      isCompleted ? 'text-emerald-600' : 
                      'text-slate-400'
                    }`} />
                  </div>
                  <div className={`font-medium text-sm ${
                    isActive ? 'text-blue-900' : 
                    isCompleted ? 'text-emerald-900' : 
                    'text-slate-600'
                  }`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{step.description}</div>
                  {isActive && (
                    <div className="mt-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto animate-pulse"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Activity */}
        {isRunning && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">
                    {currentStep === 'discovery' && 'Discovering personal data across banking systems...'}
                    {currentStep === 'mapping' && 'Mapping data flows and processing activities...'}
                    {currentStep === 'classification' && 'Classifying data by GDPR categories...'}
                    {currentStep === 'ropa' && 'Generating Records of Processing Activities...'}
                    {currentStep === 'complete' && 'Data discovery and RoPA generation complete!'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {currentStep === 'discovery' && `Scanning ${bankingSystems.length} banking systems for personal data`}
                    {currentStep === 'mapping' && `Analyzing ${discoveredData.length} data flows`}
                    {currentStep === 'classification' && 'Applying GDPR data categories and legal basis'}
                    {currentStep === 'ropa' && 'Creating comprehensive RoPA documentation'}
                    {currentStep === 'complete' && `Generated ${ropaRecords.length} RoPA records from ${discoveredData.length} data flows`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Systems Scanned</div>
                <div className="text-lg font-bold text-slate-900">{bankingSystems.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* Banking Systems Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Banking Systems Scanned</h3>
            <div className="space-y-3">
              {bankingSystems.map((system, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="font-medium text-slate-900">{system.name}</div>
                      <div className="text-sm text-slate-500">{system.type.replace('-', ' ')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-slate-900">{system.count.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">records</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Discovery Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{discoveredData.length}</div>
                <div className="text-sm text-blue-700">Data Flows</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">{ropaRecords.length}</div>
                <div className="text-sm text-emerald-700">RoPA Records</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {discoveredData.reduce((sum, flow) => sum + flow.personalDataTypes.length, 0)}
                </div>
                <div className="text-sm text-purple-700">Data Types</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {discoveredData.filter(flow => flow.riskLevel === 'high').length}
                </div>
                <div className="text-sm text-amber-700">High Risk</div>
              </div>
            </div>
          </div>
        </div>

        {/* Discovered Data Flows */}
        {discoveredData.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 mb-8">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Discovered Data Flows</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search data flows..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="customer-data">Customer Data</option>
                    <option value="transaction-data">Transaction Data</option>
                    <option value="employee-data">Employee Data</option>
                    <option value="vendor-data">Vendor Data</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredDataFlows.map((flow) => (
                <div key={flow.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-slate-900">{flow.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getCategoryColor(flow.category)}`}>
                          {flow.category.replace('-', ' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getRiskColor(flow.riskLevel)}`}>
                          {flow.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-slate-500 font-medium">Legal Basis:</span> {flow.legalBasis}
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">Retention:</span> {flow.retentionPeriod}
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">Location:</span> {flow.dataLocation}
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">Third Party:</span> {flow.thirdPartySharing ? 'Yes' : 'No'}
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-sm text-slate-500 font-medium mb-1">Personal Data Types:</div>
                        <div className="flex flex-wrap gap-1">
                          {flow.personalDataTypes.map((type, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-slate-500 font-medium mb-1">Processing Purposes:</div>
                        <div className="flex flex-wrap gap-1">
                          {flow.purposes.map((purpose, idx) => (
                            <span key={idx} className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs rounded">
                              {purpose}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated RoPA Records */}
        {ropaRecords.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Generated RoPA Records</h3>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-emerald-600 font-medium">Auto-generated and compliant</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {ropaRecords.map((record) => (
                <div key={record.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-slate-900">{record.processingActivity}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getStatusColor(record.status)}`}>
                          {record.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">
                        <strong>Controller:</strong> {record.controller} | <strong>DPO:</strong> {record.dpo}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <div>
                        <div className="text-slate-500 font-medium mb-1">Processing Purposes:</div>
                        <div className="flex flex-wrap gap-1">
                          {record.purposes.map((purpose, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                              {purpose}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-slate-500 font-medium mb-1">Data Categories:</div>
                        <div className="flex flex-wrap gap-1">
                          {record.categories.map((category, idx) => (
                            <span key={idx} className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs rounded">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-slate-500 font-medium mb-1">Recipients:</div>
                        <div className="text-slate-700">{record.recipients.join(', ')}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-slate-500 font-medium mb-1">Third Countries:</div>
                        <div className="text-slate-700">{record.thirdCountries.join(', ') || 'None'}</div>
                      </div>

                      <div>
                        <div className="text-slate-500 font-medium mb-1">Retention Period:</div>
                        <div className="text-slate-700">{record.retentionPeriod}</div>
                      </div>

                      <div>
                        <div className="text-slate-500 font-medium mb-1">Last Review:</div>
                        <div className="text-slate-700">{record.lastReview.toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demo Complete CTA */}
        {currentStep === 'complete' && (
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-8 text-white text-center mt-8">
            <div className="p-3 bg-white/20 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">GDPR RoPA Generation Complete!</h3>
            <p className="text-emerald-100 mb-6">
              Successfully discovered {discoveredData.length} data flows and generated {ropaRecords.length} compliant RoPA records 
              in under 5 minutes. Traditional manual processes would take weeks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download RoPA Records
              </button>
              <button 
                onClick={handleReset}
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Run Demo Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GDPRRoPADemo;