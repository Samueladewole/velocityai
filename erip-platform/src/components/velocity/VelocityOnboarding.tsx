import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Play, ArrowRight, Zap, Shield, Target, Award, Globe, Heart, CreditCard, FileText, Star, Clock, Users, ExternalLink } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
  estimatedTime: number; // minutes
  required: boolean;
}

interface OnboardingStepProps {
  onComplete: (data: any) => void;
  onNext: () => void;
  data?: any;
}

interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  commonStack: string[];
  recommendedFrameworks: string[];
  estimatedTime: number;
  icon: React.ReactNode;
}

const VelocityOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [onboardingData, setOnboardingData] = useState<Record<string, any>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [startTime] = useState(new Date());
  const [trustScore, setTrustScore] = useState<number | null>(null);

  const templates: OnboardingTemplate[] = [
    {
      id: 'ai_startup',
      name: 'AI Startup',
      description: 'AI/ML companies with cloud-first architecture + CIS cybersecurity',
      industry: 'Artificial Intelligence',
      commonStack: ['AWS/GCP', 'Kubernetes', 'GitHub', 'Slack'],
      recommendedFrameworks: ['CIS Controls', 'SOC2 Type I', 'GDPR'],
      estimatedTime: 25,
      icon: <Zap className="w-6 h-6 text-purple-600" />
    },
    {
      id: 'saas',
      name: 'SaaS Platform',
      description: 'Software-as-a-Service with essential cybersecurity baseline',
      industry: 'Software',
      commonStack: ['AWS', 'GitHub', 'Stripe', 'Auth0'],
      recommendedFrameworks: ['CIS Controls', 'SOC2 Type I', 'ISO 27001'],
      estimatedTime: 30,
      icon: <Shield className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'fintech',
      name: 'FinTech',
      description: 'Financial services with strict compliance + cybersecurity requirements',
      industry: 'Financial Services',
      commonStack: ['AWS', 'Kubernetes', 'Auth0', 'Stripe'],
      recommendedFrameworks: ['CIS Controls', 'SOC2 Type II', 'PCI DSS', 'GDPR'],
      estimatedTime: 35,
      icon: <Target className="w-6 h-6 text-green-600" />
    },
    {
      id: 'healthcare',
      name: 'HealthTech',
      description: 'Healthcare technology with HIPAA + cybersecurity requirements',
      industry: 'Healthcare',
      commonStack: ['AWS', 'FHIR', 'Auth0', 'Kubernetes'],
      recommendedFrameworks: ['CIS Controls', 'HIPAA', 'SOC2 Type II', 'GDPR'],
      estimatedTime: 40,
      icon: <Award className="w-6 h-6 text-red-600" />
    }
  ];

  const steps: OnboardingStep[] = [
    {
      id: 'template_selection',
      title: 'Choose Your Template',
      description: 'Select a pre-configured template that matches your industry',
      component: TemplateSelection,
      estimatedTime: 3,
      required: true
    },
    {
      id: 'cloud_accounts',
      title: 'Connect Cloud Accounts',
      description: 'Connect your AWS, GCP, or Azure accounts for automated evidence collection',
      component: CloudAccountConnection,
      estimatedTime: 8,
      required: true
    },
    {
      id: 'framework_selection',
      title: 'Select Frameworks',
      description: 'Choose compliance frameworks relevant to your business',
      component: FrameworkSelection,
      estimatedTime: 5,
      required: true
    },
    {
      id: 'initial_scan',
      title: 'Run Initial Scan',
      description: 'Let our AI agents collect your first evidence batch',
      component: InitialScan,
      estimatedTime: 12,
      required: true
    },
    {
      id: 'trust_score',
      title: 'Review Trust Score',
      description: 'See your instant Trust Score and next steps',
      component: TrustScoreReview,
      estimatedTime: 2,
      required: true
    }
  ];

  const totalEstimatedTime = steps.reduce((sum, step) => sum + step.estimatedTime, 0);

  const handleStepComplete = (stepIndex: number, data: any) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
    setOnboardingData(prev => ({ ...prev, [`step_${stepIndex}`]: data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getElapsedTime = () => {
    return Math.round((new Date().getTime() - startTime.getTime()) / 60000);
  };

  const getProgress = () => {
    return (completedSteps.size / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ERIP Velocity Onboarding</h1>
              <p className="text-gray-600">Get to Trust Score in {totalEstimatedTime} minutes</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Elapsed: {getElapsedTime()}m / {totalEstimatedTime}m
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar with steps */}
          <div className="w-80 mr-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {completedSteps.has(index) ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : index === currentStep ? (
                        <Circle className="w-6 h-6 text-blue-500 fill-current" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div className={`flex-1 ${index === currentStep ? 'text-blue-900 font-medium' : 'text-gray-600'}`}>
                      <div className="text-sm">{step.title}</div>
                      <div className="text-xs text-gray-500">{step.estimatedTime}m</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Template info */}
            {selectedTemplate && (
              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Template</h3>
                {(() => {
                  const template = templates.find(t => t.id === selectedTemplate);
                  return template ? (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        {template.icon}
                        <span className="font-medium">{template.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="text-xs text-gray-500">
                        <div>Stack: {template.commonStack.join(', ')}</div>
                        <div>Frameworks: {template.recommendedFrameworks.join(', ')}</div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-8 py-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-600 mt-1">
                  {steps[currentStep].description}
                </p>
              </div>
              
              <div className="p-8">
                {React.createElement(steps[currentStep].component, {
                  onComplete: (data: any) => handleStepComplete(currentStep, data),
                  onNext: nextStep,
                  data: onboardingData[`step_${currentStep}`],
                  selectedTemplate,
                  setSelectedTemplate,
                  setTrustScore
                } as any)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Components
const TemplateSelection: React.FC<OnboardingStepProps & { 
  selectedTemplate: string | null; 
  setSelectedTemplate: (template: string) => void;
}> = ({ onComplete, onNext, selectedTemplate, setSelectedTemplate }) => {
  const templates: OnboardingTemplate[] = [
    {
      id: 'ai_startup',
      name: 'AI Startup',
      description: 'AI/ML companies with cloud-first architecture + CIS cybersecurity',
      industry: 'Artificial Intelligence',
      commonStack: ['AWS/GCP', 'Kubernetes', 'GitHub', 'Slack'],
      recommendedFrameworks: ['CIS Controls', 'SOC2 Type I', 'GDPR'],
      estimatedTime: 25,
      icon: <Zap className="w-8 h-8 text-purple-600" />
    },
    {
      id: 'saas',
      name: 'SaaS Platform',
      description: 'Software-as-a-Service with essential cybersecurity baseline',
      industry: 'Software',
      commonStack: ['AWS', 'GitHub', 'Stripe', 'Auth0'],
      recommendedFrameworks: ['CIS Controls', 'SOC2 Type I', 'ISO 27001'],
      estimatedTime: 30,
      icon: <Shield className="w-8 h-8 text-blue-600" />
    },
    {
      id: 'fintech',
      name: 'FinTech',
      description: 'Financial services with strict compliance + cybersecurity requirements',
      industry: 'Financial Services',
      commonStack: ['AWS', 'Kubernetes', 'Auth0', 'Stripe'],
      recommendedFrameworks: ['CIS Controls', 'SOC2 Type II', 'PCI DSS', 'GDPR'],
      estimatedTime: 35,
      icon: <Target className="w-8 h-8 text-green-600" />
    },
    {
      id: 'healthcare',
      name: 'HealthTech',
      description: 'Healthcare technology with HIPAA + cybersecurity requirements',
      industry: 'Healthcare',
      commonStack: ['AWS', 'FHIR', 'Auth0', 'Kubernetes'],
      recommendedFrameworks: ['CIS Controls', 'HIPAA', 'SOC2 Type II', 'GDPR'],
      estimatedTime: 40,
      icon: <Award className="w-8 h-8 text-red-600" />
    }
  ];

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    onComplete({ templateId, template });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSelect(template.id)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {template.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{template.description}</p>
                
                <div className="mt-4 space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-500">COMMON STACK</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.commonStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-gray-500">FRAMEWORKS</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.recommendedFrameworks.map((framework) => (
                        <span
                          key={framework}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          {framework}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Estimated setup: {template.estimatedTime} minutes
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const CloudAccountConnection: React.FC<OnboardingStepProps> = ({ onComplete, onNext }) => {
  const [connections, setConnections] = useState<Record<string, boolean>>({});
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const cloudProviders = [
    { id: 'aws', name: 'Amazon Web Services', icon: '🌐', required: true },
    { id: 'gcp', name: 'Google Cloud Platform', icon: '☁️', required: false },
    { id: 'azure', name: 'Microsoft Azure', icon: '🔷', required: false },
    { id: 'github', name: 'GitHub', icon: '🐙', required: true }
  ];

  const handleConnect = async (providerId: string) => {
    setIsConnecting(providerId);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnections(prev => ({ ...prev, [providerId]: true }));
    setIsConnecting(null);
  };

  const requiredConnections = cloudProviders.filter(p => p.required);
  const allRequiredConnected = requiredConnections.every(p => connections[p.id]);

  useEffect(() => {
    if (allRequiredConnected) {
      onComplete({ connections });
    }
  }, [connections, allRequiredConnected, onComplete]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900">Secure Connection</h3>
        <p className="text-sm text-blue-700 mt-1">
          Your credentials are encrypted and used only for evidence collection. 
          We follow SOC2 security standards.
        </p>
      </div>

      <div className="space-y-4">
        {cloudProviders.map((provider) => (
          <div
            key={provider.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{provider.icon}</span>
              <div>
                <div className="font-medium text-gray-900">{provider.name}</div>
                <div className="text-sm text-gray-600">
                  {provider.required ? 'Required' : 'Optional'} • 
                  {connections[provider.id] ? ' Connected' : ' Not connected'}
                </div>
              </div>
            </div>
            
            <div>
              {connections[provider.id] ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <button
                  onClick={() => handleConnect(provider.id)}
                  disabled={isConnecting === provider.id}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isConnecting === provider.id ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {allRequiredConnected && (
        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Additional step components would be implemented similarly...
const FrameworkSelection: React.FC<OnboardingStepProps> = ({ onComplete, onNext }) => {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['soc2', 'cis']);

  const frameworks = [
    {
      id: 'soc2',
      name: 'SOC 2',
      description: 'System and Organization Controls for SaaS companies',
      icon: Shield,
      estimatedControls: 27,
      automationRate: 89,
      popular: true,
      required: true,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'cis',
      name: 'CIS Controls',
      description: 'Center for Internet Security cybersecurity best practices',
      icon: Target,
      estimatedControls: 18,
      automationRate: 94,
      popular: true,
      required: true,
      badge: 'Essential',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      description: 'International standard for information security management',
      icon: Globe,
      estimatedControls: 114,
      automationRate: 76,
      popular: true,
      required: false,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      description: 'General Data Protection Regulation for EU compliance',
      icon: Shield,
      estimatedControls: 23,
      automationRate: 82,
      popular: false,
      required: false,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      description: 'Health Insurance Portability and Accountability Act',
      icon: Heart,
      estimatedControls: 18,
      automationRate: 71,
      popular: false,
      required: false,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'pci_dss',
      name: 'PCI DSS',
      description: 'Payment Card Industry Data Security Standard',
      icon: CreditCard,
      estimatedControls: 12,
      automationRate: 85,
      popular: false,
      required: false,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'nist_csf',
      name: 'NIST CSF',
      description: 'NIST Cybersecurity Framework for risk management',
      icon: FileText,
      estimatedControls: 23,
      automationRate: 78,
      popular: false,
      required: false,
      color: 'from-gray-500 to-gray-600'
    }
  ];

  const toggleFramework = (frameworkId: string) => {
    const framework = frameworks.find(f => f.id === frameworkId);
    if (framework?.required) return; // Can't deselect required frameworks

    setSelectedFrameworks(prev => 
      prev.includes(frameworkId)
        ? prev.filter(id => id !== frameworkId)
        : [...prev, frameworkId]
    );
  };

  const handleContinue = () => {
    onComplete({ selectedFrameworks });
    onNext();
  };

  const totalControls = frameworks
    .filter(f => selectedFrameworks.includes(f.id))
    .reduce((sum, f) => sum + f.estimatedControls, 0);

  const avgAutomation = frameworks
    .filter(f => selectedFrameworks.includes(f.id))
    .reduce((sum, f) => sum + f.automationRate, 0) / selectedFrameworks.length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-purple-900 mb-2">🚀 AI Agents & CIS Controls</h3>
        <p className="text-sm text-purple-700">
          SOC 2 + CIS Controls are required for the Velocity Tier. Our AI agents excel at automating 
          CIS cybersecurity controls with 94% automation rate - perfect for fast-growing companies.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {frameworks.map((framework) => {
          const isSelected = selectedFrameworks.includes(framework.id);
          const IconComponent = framework.icon;
          
          return (
            <div
              key={framework.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-purple-500 bg-purple-50 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              } ${framework.required ? '' : 'hover:shadow-md'}`}
              onClick={() => toggleFramework(framework.id)}
            >
              {framework.badge && (
                <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {framework.badge}
                </div>
              )}
              
              {framework.popular && !framework.badge && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Popular
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${framework.color} flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                    {framework.required && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{framework.description}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {framework.estimatedControls} controls
                    </span>
                    <span className="font-medium text-green-600">
                      {framework.automationRate}% automated
                    </span>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-500' 
                    : 'border-gray-300'
                }`}>
                  {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Selection Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">{selectedFrameworks.length}</div>
            <div className="text-sm text-gray-600">Frameworks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{totalControls}</div>
            <div className="text-sm text-gray-600">Total Controls</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{Math.round(avgAutomation)}%</div>
            <div className="text-sm text-gray-600">Avg Automation</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {selectedFrameworks.length} framework{selectedFrameworks.length !== 1 ? 's' : ''} selected
        </div>
        <button
          onClick={handleContinue}
          disabled={selectedFrameworks.length === 0}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Continue to Initial Scan
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const InitialScan: React.FC<OnboardingStepProps> = ({ onComplete, onNext, setTrustScore }) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [currentAgent, setCurrentAgent] = useState<string>('');
  const [evidenceCollected, setEvidenceCollected] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [cisControlsStatus, setCisControlsStatus] = useState<Record<string, any>>({});
  const [trustScoreIncrease, setTrustScoreIncrease] = useState(0);

  const cisControls = [
    {
      id: 'cis_1',
      name: 'CIS Control 1: Asset Inventory',
      description: 'Inventory and Control of Hardware Assets',
      automationRate: 95,
      platform: 'AWS',
      evidenceItems: ['EC2 instances', 'RDS databases', 'S3 buckets', 'Load balancers']
    },
    {
      id: 'cis_3', 
      name: 'CIS Control 3: Vulnerability Management',
      description: 'Continuous Vulnerability Management',
      automationRate: 94,
      platform: 'AWS',
      evidenceItems: ['Inspector findings', 'Security Hub alerts', 'CloudWatch metrics']
    },
    {
      id: 'cis_4',
      name: 'CIS Control 4: Admin Privileges',
      description: 'Controlled Use of Administrative Privileges',
      automationRate: 98,
      platform: 'AWS',
      evidenceItems: ['IAM policies', 'Admin users', 'CloudTrail logs', 'MFA status']
    },
    {
      id: 'cis_5',
      name: 'CIS Control 5: Secure Configuration',
      description: 'Secure Configuration for Hardware/Software',
      automationRate: 92,
      platform: 'AWS',
      evidenceItems: ['Config rules', 'Security groups', 'S3 encryption', 'KMS keys']
    },
    {
      id: 'cis_6',
      name: 'CIS Control 6: Audit Logs',
      description: 'Maintenance, Monitoring and Analysis of Audit Logs',
      automationRate: 96,
      platform: 'AWS',
      evidenceItems: ['CloudTrail events', 'VPC Flow Logs', 'CloudWatch Logs']
    }
  ];

  const agentPhases = [
    { name: 'AWS Connection Verification', duration: 2000 },
    { name: 'Resource Discovery', duration: 3000 },
    { name: 'CIS Controls Assessment', duration: 4000 },
    { name: 'Evidence Collection', duration: 3000 },
    { name: 'Trust Score Calculation', duration: 2000 }
  ];

  useEffect(() => {
    if (isScanning) {
      simulateScan();
    }
  }, [isScanning]);

  const simulateScan = async () => {
    let progress = 0;
    let totalDuration = agentPhases.reduce((sum, phase) => sum + phase.duration, 0);
    let elapsed = 0;

    for (const phase of agentPhases) {
      setCurrentAgent(phase.name);
      
      if (phase.name === 'CIS Controls Assessment') {
        // Simulate CIS Controls being evaluated
        for (const control of cisControls) {
          await new Promise(resolve => setTimeout(resolve, 800));
          setCisControlsStatus(prev => ({
            ...prev,
            [control.id]: {
              status: 'completed',
              compliance: Math.random() > 0.2 ? 'passing' : 'needs_attention',
              evidenceCount: Math.floor(Math.random() * 20) + 10,
              automationApplied: true
            }
          }));
        }
      }

      if (phase.name === 'Evidence Collection') {
        // Simulate evidence being collected
        const mockEvidence = [
          { type: 'AWS CloudTrail', count: 47, control: 'CIS Control 6' },
          { type: 'IAM Policy Analysis', count: 23, control: 'CIS Control 4' },
          { type: 'Security Group Config', count: 15, control: 'CIS Control 5' },
          { type: 'Asset Inventory', count: 89, control: 'CIS Control 1' },
          { type: 'Vulnerability Scan', count: 34, control: 'CIS Control 3' }
        ];

        for (const evidence of mockEvidence) {
          await new Promise(resolve => setTimeout(resolve, 600));
          setEvidenceCollected(prev => [...prev, evidence]);
        }
      }

      if (phase.name === 'Trust Score Calculation') {
        // Simulate Trust Score increase from CIS automation
        let increase = 0;
        const targetIncrease = 35; // CIS Controls contribute +35 points
        const steps = 20;
        
        for (let i = 0; i < steps; i++) {
          await new Promise(resolve => setTimeout(resolve, phase.duration / steps));
          increase = Math.round((i + 1) / steps * targetIncrease);
          setTrustScoreIncrease(increase);
        }
      }

      await new Promise(resolve => setTimeout(resolve, phase.duration));
      elapsed += phase.duration;
      progress = Math.round((elapsed / totalDuration) * 100);
      setScanProgress(progress);
    }

    // Complete the scan
    setCurrentAgent('Scan Complete');
    if (setTrustScore) {
      setTrustScore(67 + trustScoreIncrease); // Base score + CIS contribution
    }
    onComplete({ 
      evidenceCollected, 
      cisControlsStatus, 
      trustScoreIncrease,
      totalEvidenceItems: evidenceCollected.reduce((sum, e) => sum + e.count, 0)
    });
  };

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setCurrentAgent('');
    setEvidenceCollected([]);
    setCisControlsStatus({});
    setTrustScoreIncrease(0);
  };

  const completedControls = Object.keys(cisControlsStatus).length;
  const passingControls = Object.values(cisControlsStatus).filter((status: any) => status.compliance === 'passing').length;
  const totalEvidenceItems = evidenceCollected.reduce((sum, e) => sum + e.count, 0);

  return (
    <div className="space-y-6">
      {/* Header with CIS Controls focus */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-900">AI Agents + CIS Controls Assessment</h3>
            <p className="text-sm text-purple-700">94% automation rate • 18 cybersecurity controls • Instant compliance</p>
          </div>
        </div>
        <p className="text-sm text-purple-600">
          Our AI agents will now scan your connected cloud accounts and automatically collect evidence for 
          CIS Controls - the essential cybersecurity baseline for fast-growing companies.
        </p>
      </div>

      {!isScanning && scanProgress === 0 && (
        <div className="text-center py-8">
          <button
            onClick={startScan}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
          >
            <Play className="w-5 h-5" />
            Start CIS Controls Assessment
          </button>
          <p className="text-sm text-gray-600 mt-3">
            This will take approximately 12 minutes • Real-time progress updates
          </p>
        </div>
      )}

      {isScanning && (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Scan Progress</h3>
              <span className="text-sm font-medium text-gray-600">{scanProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              {currentAgent}
            </div>
          </div>

          {/* CIS Controls Status Grid */}
          {Object.keys(cisControlsStatus).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">CIS Controls Assessment</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {cisControls.map((control) => {
                  const status = cisControlsStatus[control.id];
                  if (!status) return null;

                  return (
                    <div key={control.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{control.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">{control.description}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          status.compliance === 'passing' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {status.evidenceCount} evidence items
                        </span>
                        <span className="font-medium text-green-600">
                          {control.automationRate}% automated
                        </span>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {control.evidenceItems.slice(0, 2).map((item) => (
                          <span key={item} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                            {item}
                          </span>
                        ))}
                        {control.evidenceItems.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{control.evidenceItems.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Evidence Collection Stream */}
          {evidenceCollected.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Evidence Collection Stream</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {evidenceCollected.map((evidence, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{evidence.type}</div>
                      <div className="text-xs text-gray-600">{evidence.control} • {evidence.count} items collected</div>
                    </div>
                    <span className="text-xs text-gray-500">Just now</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-time metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{completedControls}/5</div>
              <div className="text-sm text-gray-600">Controls Scanned</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{passingControls}</div>
              <div className="text-sm text-gray-600">Passing</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalEvidenceItems}</div>
              <div className="text-sm text-gray-600">Evidence Items</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">+{trustScoreIncrease}</div>
              <div className="text-sm text-gray-600">Trust Score Boost</div>
            </div>
          </div>
        </div>
      )}

      {scanProgress === 100 && (
        <div className="space-y-6">
          {/* Completion summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-lg font-bold text-green-900">CIS Controls Assessment Complete!</h3>
                <p className="text-sm text-green-700">94% automation rate achieved • {totalEvidenceItems} evidence items collected</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{passingControls}/5</div>
                <div className="text-sm text-gray-600">Controls Passing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">94%</div>
                <div className="text-sm text-gray-600">Avg Automation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">+{trustScoreIncrease}</div>
                <div className="text-sm text-gray-600">Trust Score Boost</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Ready to review your instant Trust Score
            </div>
            <button
              onClick={onNext}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2"
            >
              View Trust Score
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TrustScoreReview: React.FC<OnboardingStepProps & { trustScore?: number }> = ({ onComplete, onNext, data, trustScore = 102 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    // Animate the trust score
    const startScore = 67; // Base score before AI agents
    const endScore = trustScore;
    const duration = 2000;
    const steps = 50;
    const increment = (endScore - startScore) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newScore = Math.min(startScore + (increment * currentStep), endScore);
      setAnimatedScore(Math.round(newScore));
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setShowBreakdown(true), 500);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [trustScore]);

  const cisControlsContribution = 35;
  const automationMultiplier = 12; // 3x multiplier on evidence
  const baseScore = 67;

  const scoreBreakdown = [
    { label: 'Baseline Compliance', value: baseScore, color: 'text-gray-600', description: 'Starting assessment' },
    { label: 'CIS Controls Foundation', value: 15, color: 'text-purple-600', description: 'Essential cybersecurity baseline' },
    { label: 'AI Automation Bonus', value: automationMultiplier, color: 'text-blue-600', description: '3x Trust Points multiplier' },
    { label: 'Evidence Coverage', value: 8, color: 'text-green-600', description: '208 automated evidence items' }
  ];

  const totalScore = scoreBreakdown.reduce((sum, item) => sum + item.value, 0);

  const getScoreGrade = (score: number) => {
    if (score >= 95) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 85) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 75) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 65) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    return { grade: 'C', color: 'text-orange-600', bg: 'bg-orange-50' };
  };

  const grade = getScoreGrade(animatedScore);

  return (
    <div className="space-y-6">
      {/* Hero Trust Score Display */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl p-8 text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Your Instant Trust Score</h2>
          <p className="text-purple-100">Generated in 30 minutes with 94% AI automation</p>
        </div>
        
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{animatedScore}</div>
            <div className="text-purple-200">Trust Score</div>
          </div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 px-4 py-2 rounded-lg ${grade.bg} ${grade.color}`}>
              {grade.grade}
            </div>
            <div className="text-purple-200">Grade</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">208</div>
            <div className="text-sm text-purple-200">Evidence Items</div>
          </div>
          <div>
            <div className="text-2xl font-bold">94%</div>
            <div className="text-sm text-purple-200">Automated</div>
          </div>
          <div>
            <div className="text-2xl font-bold">5/5</div>
            <div className="text-sm text-purple-200">CIS Controls</div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      {showBreakdown && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust Score Breakdown</h3>
          <div className="space-y-4">
            {scoreBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
                <div className={`text-2xl font-bold ${item.color}`}>
                  +{item.value}
                </div>
              </div>
            ))}
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-lg">Total Trust Score</div>
                  <div className="text-sm text-gray-600">Ready for customer sharing</div>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {totalScore}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CIS Controls Impact */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-8 h-8 text-purple-600" />
          <div>
            <h3 className="text-lg font-bold text-purple-900">CIS Controls Impact</h3>
            <p className="text-sm text-purple-700">Essential cybersecurity foundation established</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl font-bold text-purple-600">+35</div>
            <div className="text-sm text-gray-600">Trust Score Points</div>
            <div className="text-xs text-gray-500 mt-1">From CIS Controls</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-sm text-gray-600">Automation Rate</div>
            <div className="text-xs text-gray-500 mt-1">Highest available</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl font-bold text-blue-600">18</div>
            <div className="text-sm text-gray-600">Core Controls</div>
            <div className="text-xs text-gray-500 mt-1">Cybersecurity baseline</div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <div className="font-medium text-gray-900">Continuous Monitoring Active</div>
              <div className="text-sm text-gray-600">AI agents run every 4 hours to collect new evidence</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <div className="font-medium text-gray-900">Trust Score Updates</div>
              <div className="text-sm text-gray-600">Real-time score improvements as compliance matures</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <div className="font-medium text-gray-900">Share with Customers</div>
              <div className="text-sm text-gray-600">Use your Trust Score to accelerate sales and build confidence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
          <ExternalLink className="w-5 h-5" />
          Share Trust Score
        </button>
        <button 
          onClick={() => {
            onComplete({ trustScore: animatedScore, grade: grade.grade });
            // Navigate to dashboard or main app
            window.location.href = '/velocity/dashboard';
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
        >
          <ArrowRight className="w-5 h-5" />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default VelocityOnboarding;