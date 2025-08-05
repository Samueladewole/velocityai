/**
 * User Onboarding Wizard
 * Progressive security setup that demonstrates value immediately
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Cloud, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  estimatedTime: string;
  businessValue: string;
  completed: boolean;
  optional: boolean;
}

interface CompanyProfile {
  name: string;
  size: 'startup' | 'scaleup' | 'enterprise';
  industry: string;
  primaryConcerns: string[];
  cloudProviders: string[];
  complianceNeeds: string[];
}

interface OnboardingWizardProps {
  onComplete?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<CompanyProfile>({
    name: '',
    size: 'startup',
    industry: '',
    primaryConcerns: [],
    cloudProviders: [],
    complianceNeeds: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [securityScore, setSecurityScore] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Velocity Zero Trust',
      description: 'Let\'s set up your security posture in 10 minutes',
      icon: <Shield className="w-6 h-6" />,
      estimatedTime: '2 min',
      businessValue: 'Immediate visibility into your security gaps',
      completed: false,
      optional: false
    },
    {
      id: 'profile',
      title: 'Company Profile',
      description: 'Tell us about your organization',
      icon: <Users className="w-6 h-6" />,
      estimatedTime: '3 min',
      businessValue: 'Tailored security recommendations',
      completed: false,
      optional: false
    },
    {
      id: 'cloud-connect',
      title: 'Connect Your Cloud',
      description: 'Secure your AWS, Azure, or GCP environment',
      icon: <Cloud className="w-6 h-6" />,
      estimatedTime: '5 min',
      businessValue: '$50K+ annual savings from automated compliance',
      completed: false,
      optional: false
    },
    {
      id: 'team-setup',
      title: 'Invite Your Team',
      description: 'Add security team members and set permissions',
      icon: <Users className="w-6 h-6" />,
      estimatedTime: '2 min',
      businessValue: 'Collaborative security management',
      completed: false,
      optional: true
    },
    {
      id: 'quick-wins',
      title: 'Implement Quick Wins',
      description: 'Apply 3 high-impact security improvements',
      icon: <Target className="w-6 h-6" />,
      estimatedTime: '5 min',
      businessValue: 'Immediate risk reduction',
      completed: false,
      optional: false
    }
  ];

  const progress = (currentStep / (steps.length - 1)) * 100;

  useEffect(() => {
    // Simulate real-time security score calculation
    const interval = setInterval(() => {
      if (securityScore < 75) {
        setSecurityScore(prev => Math.min(prev + Math.random() * 5, 75));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [securityScore]);

  const handleNext = async () => {
    setIsLoading(true);
    
    // Simulate API calls and analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding completed
      onComplete?.();
    }
    
    setIsLoading(false);
  };

  const renderWelcomeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome to Velocity Zero Trust</h1>
        <p className="text-gray-600 text-lg">
          The industry's most intelligent security platform
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="font-semibold">10x Faster Setup</h3>
          <p className="text-sm text-gray-600">Automated security implementation</p>
        </Card>
        <Card className="text-center p-4">
          <BarChart3 className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="font-semibold">50% Cost Reduction</h3>
          <p className="text-sm text-gray-600">Eliminate manual compliance work</p>
        </Card>
        <Card className="text-center p-4">
          <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="font-semibold">90% Risk Reduction</h3>
          <p className="text-sm text-gray-600">AI-powered threat prevention</p>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">What You'll Accomplish Today:</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Connect your cloud environment for instant visibility
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Identify and fix your top 3 security risks
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Set up automated compliance monitoring
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Establish your Zero Trust foundation
          </li>
        </ul>
      </div>
    </div>
  );

  const renderProfileStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tell Us About Your Organization</h2>
        <p className="text-gray-600">This helps us provide tailored security recommendations</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Company Name</label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company Size</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'startup', label: '1-50 employees' },
                { value: 'scaleup', label: '51-500 employees' },
                { value: 'enterprise', label: '500+ employees' }
              ].map((size) => (
                <Button
                  key={size.value}
                  variant={profile.size === size.value ? 'default' : 'outline'}
                  className="text-xs p-2 h-auto"
                  onClick={() => setProfile({...profile, size: size.value as any})}
                >
                  {size.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <select
              className="w-full p-2 border rounded-md"
              value={profile.industry}
              onChange={(e) => setProfile({...profile, industry: e.target.value})}
            >
              <option value="">Select your industry</option>
              <option value="fintech">Financial Services</option>
              <option value="healthcare">Healthcare</option>
              <option value="technology">Technology</option>
              <option value="ecommerce">E-commerce</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Security Concerns</label>
            <div className="space-y-2">
              {[
                'Data breaches',
                'Compliance violations',
                'Insider threats',
                'Cloud misconfigurations',
                'Phishing attacks',
                'Ransomware'
              ].map((concern) => (
                <label key={concern} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={profile.primaryConcerns.includes(concern)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProfile({
                          ...profile,
                          primaryConcerns: [...profile.primaryConcerns, concern]
                        });
                      } else {
                        setProfile({
                          ...profile,
                          primaryConcerns: profile.primaryConcerns.filter(c => c !== concern)
                        });
                      }
                    }}
                  />
                  <span className="text-sm">{concern}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cloud Providers</label>
            <div className="flex flex-wrap gap-2">
              {['AWS', 'Azure', 'GCP', 'Heroku', 'DigitalOcean'].map((provider) => (
                <Button
                  key={provider}
                  variant={profile.cloudProviders.includes(provider) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (profile.cloudProviders.includes(provider)) {
                      setProfile({
                        ...profile,
                        cloudProviders: profile.cloudProviders.filter(p => p !== provider)
                      });
                    } else {
                      setProfile({
                        ...profile,
                        cloudProviders: [...profile.cloudProviders, provider]
                      });
                    }
                  }}
                >
                  {provider}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {profile.name && profile.industry && (
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Profile Complete!</h3>
          </div>
          <p className="text-green-700 text-sm">
            Based on your profile, we've identified {profile.primaryConcerns.length} priority areas 
            and {profile.cloudProviders.length} cloud environments to secure.
          </p>
        </div>
      )}
    </div>
  );

  const renderCloudConnectStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Connect Your Cloud Environment</h2>
        <p className="text-gray-600">
          Get instant visibility into your security posture across all cloud resources
        </p>
      </div>

      <div className="grid gap-4">
        {profile.cloudProviders.map((provider) => (
          <Card key={provider} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cloud className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">{provider} Integration</h3>
                  <p className="text-sm text-gray-600">
                    Connect via read-only IAM role (recommended)
                  </p>
                </div>
              </div>
              <Button>
                Connect {provider}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Resource discovery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Security assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Compliance monitoring</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Why Connect Your Cloud?</h3>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Discover all resources and identify shadow IT</li>
              <li>• Detect misconfigurations that lead to breaches</li>
              <li>• Automate compliance checks (SOC 2, ISO 27001, PCI DSS)</li>
              <li>• Get alerted to high-risk changes in real-time</li>
              <li>• Generate audit reports in seconds, not weeks</li>
            </ul>
          </div>
        </div>
      </div>

      <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-800">Current Security Score</h3>
            <p className="text-2xl font-bold text-green-600">{Math.round(securityScore)}%</p>
            <p className="text-sm text-gray-600">Updates in real-time as you connect services</p>
          </div>
          <div className="w-24 h-24">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-green-500 transition-all duration-1000"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((securityScore / 100) * 2 * Math.PI - Math.PI / 2)}% ${50 + 50 * Math.sin((securityScore / 100) * 2 * Math.PI - Math.PI / 2)}%, 50% 50%)`
                }}
              ></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold">Setup Progress</h1>
              <p className="text-gray-600">Step {currentStep + 1} of {steps.length}</p>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {currentStepData.estimatedTime} remaining
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {steps.map((step, index) => (
              <span 
                key={step.id}
                className={index <= currentStep ? 'text-blue-600 font-medium' : ''}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            {currentStepData.icon}
            <div>
              <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
              <p className="text-gray-600">{currentStepData.description}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-medium text-green-600">
                Business Value
              </div>
              <div className="text-xs text-gray-600">
                {currentStepData.businessValue}
              </div>
            </div>
          </div>

          {currentStep === 0 && renderWelcomeStep()}
          {currentStep === 1 && renderProfileStep()}
          {currentStep === 2 && renderCloudConnectStep()}
          
          {/* Add other steps as needed */}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="px-8"
          >
            {isLoading ? 'Processing...' : currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};