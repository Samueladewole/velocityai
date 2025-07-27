import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Play, ArrowRight, Zap, Shield, Target, Award } from 'lucide-react';

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
      description: 'AI/ML companies with cloud-first architecture',
      industry: 'Artificial Intelligence',
      commonStack: ['AWS/GCP', 'Kubernetes', 'GitHub', 'Slack'],
      recommendedFrameworks: ['SOC2 Type I', 'GDPR'],
      estimatedTime: 25,
      icon: <Zap className="w-6 h-6 text-purple-600" />
    },
    {
      id: 'saas',
      name: 'SaaS Platform',
      description: 'Software-as-a-Service with standard web stack',
      industry: 'Software',
      commonStack: ['AWS', 'GitHub', 'Stripe', 'Auth0'],
      recommendedFrameworks: ['SOC2 Type I', 'ISO 27001'],
      estimatedTime: 30,
      icon: <Shield className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'fintech',
      name: 'FinTech',
      description: 'Financial services with strict compliance requirements',
      industry: 'Financial Services',
      commonStack: ['AWS', 'Kubernetes', 'Auth0', 'Stripe'],
      recommendedFrameworks: ['SOC2 Type II', 'PCI DSS', 'GDPR'],
      estimatedTime: 35,
      icon: <Target className="w-6 h-6 text-green-600" />
    },
    {
      id: 'healthcare',
      name: 'HealthTech',
      description: 'Healthcare technology with HIPAA requirements',
      industry: 'Healthcare',
      commonStack: ['AWS', 'FHIR', 'Auth0', 'Kubernetes'],
      recommendedFrameworks: ['HIPAA', 'SOC2 Type II', 'GDPR'],
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
      description: 'AI/ML companies with cloud-first architecture',
      industry: 'Artificial Intelligence',
      commonStack: ['AWS/GCP', 'Kubernetes', 'GitHub', 'Slack'],
      recommendedFrameworks: ['SOC2 Type I', 'GDPR'],
      estimatedTime: 25,
      icon: <Zap className="w-8 h-8 text-purple-600" />
    },
    {
      id: 'saas',
      name: 'SaaS Platform',
      description: 'Software-as-a-Service with standard web stack',
      industry: 'Software',
      commonStack: ['AWS', 'GitHub', 'Stripe', 'Auth0'],
      recommendedFrameworks: ['SOC2 Type I', 'ISO 27001'],
      estimatedTime: 30,
      icon: <Shield className="w-8 h-8 text-blue-600" />
    },
    {
      id: 'fintech',
      name: 'FinTech',
      description: 'Financial services with strict compliance requirements',
      industry: 'Financial Services',
      commonStack: ['AWS', 'Kubernetes', 'Auth0', 'Stripe'],
      recommendedFrameworks: ['SOC2 Type II', 'PCI DSS', 'GDPR'],
      estimatedTime: 35,
      icon: <Target className="w-8 h-8 text-green-600" />
    },
    {
      id: 'healthcare',
      name: 'HealthTech',
      description: 'Healthcare technology with HIPAA requirements',
      industry: 'Healthcare',
      commonStack: ['AWS', 'FHIR', 'Auth0', 'Kubernetes'],
      recommendedFrameworks: ['HIPAA', 'SOC2 Type II', 'GDPR'],
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
  // Framework selection implementation
  return <div>Framework Selection Component</div>;
};

const InitialScan: React.FC<OnboardingStepProps> = ({ onComplete, onNext }) => {
  // Initial scan implementation
  return <div>Initial Scan Component</div>;
};

const TrustScoreReview: React.FC<OnboardingStepProps> = ({ onComplete, onNext }) => {
  // Trust score review implementation
  return <div>Trust Score Review Component</div>;
};

export default VelocityOnboarding;