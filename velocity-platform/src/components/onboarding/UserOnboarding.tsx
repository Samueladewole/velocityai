import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  CloudIcon,
  CogIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  optional?: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  company: string;
  industry: string;
  teamSize: string;
}

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

const UserOnboarding: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    role: '',
    company: '',
    industry: '',
    teamSize: '',
  });

  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([
    { id: 'gdpr', name: 'GDPR', description: 'EU General Data Protection Regulation', selected: false },
    { id: 'soc2', name: 'SOC 2', description: 'Service Organization Control 2', selected: false },
    { id: 'iso27001', name: 'ISO 27001', description: 'Information Security Management', selected: false },
    { id: 'hipaa', name: 'HIPAA', description: 'Health Insurance Portability and Accountability Act', selected: false },
    { id: 'ccpa', name: 'CCPA', description: 'California Consumer Privacy Act', selected: false },
  ]);

  const [cloudPlatforms, setCloudPlatforms] = useState([
    { id: 'aws', name: 'Amazon Web Services', selected: false },
    { id: 'gcp', name: 'Google Cloud Platform', selected: false },
    { id: 'azure', name: 'Microsoft Azure', selected: false },
    { id: 'github', name: 'GitHub', selected: false },
  ]);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Velocity AI',
      description: 'Let\'s get you set up for success',
      icon: UserIcon,
      completed: false,
    },
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Tell us about yourself and your organization',
      icon: BuildingOfficeIcon,
      completed: false,
    },
    {
      id: 'frameworks',
      title: 'Select Compliance Frameworks',
      description: 'Choose the frameworks your organization needs to comply with',
      icon: ShieldCheckIcon,
      completed: false,
    },
    {
      id: 'integrations',
      title: 'Connect Cloud Platforms',
      description: 'Connect your cloud infrastructure for automated evidence collection',
      icon: CloudIcon,
      completed: false,
      optional: true,
    },
    {
      id: 'agents',
      title: 'Configure AI Agents',
      description: 'Set up AI agents to automate your compliance tasks',
      icon: CogIcon,
      completed: false,
      optional: true,
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Start your compliance automation journey',
      icon: CheckCircleIcon,
      completed: false,
    },
  ];

  const [stepStatus, setStepStatus] = useState(steps);

  useEffect(() => {
    // Check if user has already completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('velocity_onboarding_complete');
    if (hasCompletedOnboarding && user?.onboardingComplete) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      markStepCompleted(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const markStepCompleted = (stepIndex: number) => {
    setStepStatus(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, completed: true } : step
    ));
  };

  const completeOnboarding = async () => {
    try {
      // Save user profile and preferences
      await updateUser({
        ...userProfile,
        onboardingComplete: true,
        preferences: {
          frameworks: frameworks.filter(f => f.selected).map(f => f.id),
          cloudPlatforms: cloudPlatforms.filter(p => p.selected).map(p => p.id),
        }
      });

      localStorage.setItem('velocity_onboarding_complete', 'true');
      setOnboardingComplete(true);
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleFrameworkToggle = (frameworkId: string) => {
    setFrameworks(prev => prev.map(f => 
      f.id === frameworkId ? { ...f, selected: !f.selected } : f
    ));
  };

  const handlePlatformToggle = (platformId: string) => {
    setCloudPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, selected: !p.selected } : p
    ));
  };

  const skipStep = () => {
    nextStep();
  };

  if (onboardingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <CheckCircleIcon className="w-24 h-24 text-green-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Velocity AI!</h1>
          <p className="text-xl text-purple-200 mb-6">Your account has been set up successfully.</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
      {/* Progress Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Velocity AI</span>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepStatus[index].completed ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`text-xs mt-1 text-center ${
                  index <= currentStep ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step Content */}
          {currentStep === 0 && (
            <div className="text-center">
              <UserIcon className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Velocity AI
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                We'll help you set up your compliance automation platform in just a few steps. 
                This should take about 5 minutes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <ShieldCheckIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Compliance</h3>
                  <p className="text-sm text-gray-600">Automate your compliance processes</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <CloudIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Integrations</h3>
                  <p className="text-sm text-gray-600">Connect your cloud platforms</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <ChartBarIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Analytics</h3>
                  <p className="text-sm text-gray-600">Track your compliance progress</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <BuildingOfficeIcon className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Complete Your Profile
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userProfile.email}
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={userProfile.company}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Acme Corporation"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select
                      value={userProfile.industry}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="">Select Industry</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Size
                    </label>
                    <select
                      value={userProfile.teamSize}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, teamSize: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="">Select Team Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <ShieldCheckIcon className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Select Compliance Frameworks
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Choose the compliance frameworks your organization needs to adhere to.
              </p>
              <div className="space-y-4">
                {frameworks.map((framework) => (
                  <div
                    key={framework.id}
                    onClick={() => handleFrameworkToggle(framework.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      framework.selected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                        <p className="text-sm text-gray-600">{framework.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        framework.selected
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {framework.selected && (
                          <CheckCircleIcon className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <CloudIcon className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Connect Cloud Platforms
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Connect your cloud infrastructure to enable automated evidence collection.
                You can skip this step and add integrations later.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cloudPlatforms.map((platform) => (
                  <div
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      platform.selected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        platform.selected
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {platform.selected && (
                          <CheckCircleIcon className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <CogIcon className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Configure AI Agents
              </h2>
              <p className="text-gray-600 text-center mb-8">
                AI agents will be automatically configured based on your selected frameworks
                and cloud platforms. You can customize them later in the dashboard.
              </p>
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recommended Agents</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium">Evidence Collector</span>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                      Auto-enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium">Compliance Monitor</span>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                      Auto-enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium">Report Generator</span>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                      Auto-enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                You're All Set!
              </h2>
              <p className="text-gray-600 mb-8">
                Your Velocity AI platform has been configured successfully. 
                You can now start automating your compliance processes.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Explore your personalized dashboard</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Set up cloud integrations</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Configure AI agents</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm">Start collecting evidence</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back
            </button>

            <div className="flex space-x-3">
              {steps[currentStep]?.optional && currentStep !== steps.length - 1 && (
                <button
                  onClick={skipStep}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Skip
                </button>
              )}
              
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={completeOnboarding}
                  className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Get Started
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Continue
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOnboarding;