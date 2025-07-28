/**
 * Velocity AI Customer Onboarding Automation Workflow
 * Smart 30-minute setup with guided automation and instant Trust Score generation
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft,
  Settings,
  Shield,
  Zap,
  Bot,
  Cloud,
  Key,
  Target,
  Sparkles,
  Clock,
  AlertTriangle,
  Trophy,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Globe,
  Database,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  completed: boolean;
  skippable: boolean;
  icon: React.ReactNode;
}

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  selected: boolean;
  credentials: {
    [key: string]: {
      label: string;
      type: 'text' | 'password' | 'textarea';
      required: boolean;
      value: string;
      placeholder: string;
    };
  };
}

interface Framework {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  controls: number;
  estimatedSetupTime: number;
}

interface AgentConfig {
  name: string;
  platform: string;
  framework: string;
  schedule: string;
  controls: string[];
  priority: 'high' | 'medium' | 'low';
}

const VelocityOnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'aws',
      name: 'Amazon Web Services',
      icon: <Cloud className="w-6 h-6" />,
      description: 'Connect your AWS infrastructure for comprehensive compliance monitoring',
      selected: false,
      credentials: {
        accessKeyId: {
          label: 'Access Key ID',
          type: 'text',
          required: true,
          value: '',
          placeholder: 'AKIA...'
        },
        secretAccessKey: {
          label: 'Secret Access Key',
          type: 'password',
          required: true,
          value: '',
          placeholder: 'Enter your secret key'
        },
        region: {
          label: 'Default Region',
          type: 'text',
          required: true,
          value: 'us-east-1',
          placeholder: 'us-east-1'
        },
        roleArn: {
          label: 'Role ARN (Optional)',
          type: 'text',
          required: false,
          value: '',
          placeholder: 'arn:aws:iam::...'
        }
      }
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      icon: <Globe className="w-6 h-6 text-blue-500" />,
      description: 'Monitor GCP resources and security configurations',
      selected: false,
      credentials: {
        serviceAccountKey: {
          label: 'Service Account Key',
          type: 'textarea',
          required: true,
          value: '',
          placeholder: 'Paste your service account JSON key'
        },
        projectId: {
          label: 'Project ID',
          type: 'text',
          required: true,
          value: '',
          placeholder: 'your-project-id'
        }
      }
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      icon: <Database className="w-6 h-6 text-blue-600" />,
      description: 'Integrate with Azure for complete cloud governance',
      selected: false,
      credentials: {
        tenantId: {
          label: 'Tenant ID',
          type: 'text',
          required: true,
          value: '',
          placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
        },
        clientId: {
          label: 'Client ID',
          type: 'text',
          required: true,
          value: '',
          placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
        },
        clientSecret: {
          label: 'Client Secret',
          type: 'password',
          required: true,
          value: '',
          placeholder: 'Enter client secret'
        },
        subscriptionId: {
          label: 'Subscription ID',
          type: 'text',
          required: true,
          value: '',
          placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
        }
      }
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: <Bot className="w-6 h-6" />,
      description: 'Scan repositories and development workflows',
      selected: false,
      credentials: {
        token: {
          label: 'Personal Access Token',
          type: 'password',
          required: true,
          value: '',
          placeholder: 'ghp_...'
        },
        organization: {
          label: 'Organization',
          type: 'text',
          required: false,
          value: '',
          placeholder: 'your-org-name'
        }
      }
    }
  ]);

  const [frameworks, setFrameworks] = useState<Framework[]>([
    {
      id: 'soc2',
      name: 'SOC 2 Type II',
      description: 'Service Organization Control 2 compliance framework',
      selected: false,
      controls: 64,
      estimatedSetupTime: 15
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      description: 'International standard for information security management',
      selected: false,
      controls: 114,
      estimatedSetupTime: 20
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      description: 'General Data Protection Regulation compliance',
      selected: false,
      controls: 47,
      estimatedSetupTime: 12
    },
    {
      id: 'cis',
      name: 'CIS Controls',
      description: 'Center for Internet Security cybersecurity framework',
      selected: false,
      controls: 153,
      estimatedSetupTime: 25
    },
    {
      id: 'nist',
      name: 'NIST Cybersecurity Framework',
      description: 'National Institute of Standards and Technology framework',
      selected: false,
      controls: 108,
      estimatedSetupTime: 18
    }
  ]);

  const [agentConfigs, setAgentConfigs] = useState<AgentConfig[]>([]);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [totalEstimatedTime, setTotalEstimatedTime] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Velocity AI',
      description: 'Get started with AI-powered compliance automation in 30 minutes',
      estimatedTime: 2,
      completed: false,
      skippable: false,
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 'platforms',
      title: 'Connect Your Platforms',
      description: 'Select and configure cloud platforms and services to monitor',
      estimatedTime: 8,
      completed: false,
      skippable: false,
      icon: <Cloud className="w-5 h-5" />
    },
    {
      id: 'frameworks',
      title: 'Choose Compliance Frameworks',
      description: 'Select the compliance frameworks relevant to your organization',
      estimatedTime: 3,
      completed: false,
      skippable: false,
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 'agents',
      title: 'Configure AI Agents',
      description: 'Review and customize your AI agents for automated evidence collection',
      estimatedTime: 5,
      completed: false,
      skippable: true,
      icon: <Bot className="w-5 h-5" />
    },
    {
      id: 'deploy',
      title: 'Deploy & Activate',
      description: 'Deploy your agents and start automated compliance monitoring',
      estimatedTime: 10,
      completed: false,
      skippable: false,
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'complete',
      title: 'Ready to Go!',
      description: 'Your Velocity AI platform is configured and collecting evidence',
      estimatedTime: 2,
      completed: false,
      skippable: false,
      icon: <Trophy className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    // Calculate total estimated time
    const selectedPlatforms = platforms.filter(p => p.selected).length;
    const selectedFrameworks = frameworks.filter(f => f.selected);
    const frameworkTime = selectedFrameworks.reduce((sum, f) => sum + f.estimatedSetupTime, 0);
    
    setTotalEstimatedTime(Math.max(20, selectedPlatforms * 5 + frameworkTime));
  }, [platforms, frameworks]);

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId ? { ...p, selected: !p.selected } : p
    ));
  };

  const handleCredentialChange = (platformId: string, credentialKey: string, value: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? {
            ...p,
            credentials: {
              ...p.credentials,
              [credentialKey]: { ...p.credentials[credentialKey], value }
            }
          }
        : p
    ));
  };

  const handleFrameworkToggle = (frameworkId: string) => {
    setFrameworks(prev => prev.map(f => 
      f.id === frameworkId ? { ...f, selected: !f.selected } : f
    ));
  };

  const generateAgentConfigs = () => {
    const selectedPlatforms = platforms.filter(p => p.selected);
    const selectedFrameworks = frameworks.filter(f => f.selected);
    
    const configs: AgentConfig[] = [];
    
    selectedPlatforms.forEach(platform => {
      selectedFrameworks.forEach(framework => {
        configs.push({
          name: `${platform.name} ${framework.name} Agent`,
          platform: platform.id,
          framework: framework.id,
          schedule: 'Every 4 hours',
          controls: generateControlsForFramework(framework.id),
          priority: framework.id === 'soc2' || framework.id === 'gdpr' ? 'high' : 'medium'
        });
      });
    });
    
    setAgentConfigs(configs);
  };

  const generateControlsForFramework = (frameworkId: string): string[] => {
    const controlMap: { [key: string]: string[] } = {
      soc2: ['CC6.1 - Access Controls', 'CC6.2 - Authentication', 'CC7.1 - System Monitoring', 'CC8.1 - Change Management'],
      iso27001: ['A.9.1.1 - Access Control Policy', 'A.12.4.1 - Event Logging', 'A.13.1.1 - Network Controls'],
      gdpr: ['Art. 32 - Security Measures', 'Art. 30 - Records of Processing', 'Art. 25 - Data Protection by Design'],
      cis: ['CIS 1.1 - Asset Inventory', 'CIS 3.1 - Vulnerability Management', 'CIS 5.1 - Secure Configuration'],
      nist: ['PR.AC-1 - Identity Management', 'DE.CM-1 - Network Monitoring', 'RS.RP-1 - Response Planning']
    };
    
    return controlMap[frameworkId] || ['Generic Control 1', 'Generic Control 2'];
  };

  const deployAgents = async () => {
    setIsDeploying(true);
    setDeploymentProgress(0);
    
    // Simulate deployment process
    const totalSteps = agentConfigs.length * 4; // 4 steps per agent
    let completedSteps = 0;
    
    for (const agent of agentConfigs) {
      // Step 1: Validate credentials
      await new Promise(resolve => setTimeout(resolve, 1000));
      completedSteps++;
      setDeploymentProgress((completedSteps / totalSteps) * 100);
      
      // Step 2: Create agent configuration
      await new Promise(resolve => setTimeout(resolve, 800));
      completedSteps++;
      setDeploymentProgress((completedSteps / totalSteps) * 100);
      
      // Step 3: Deploy agent
      await new Promise(resolve => setTimeout(resolve, 1200));
      completedSteps++;
      setDeploymentProgress((completedSteps / totalSteps) * 100);
      
      // Step 4: Start initial scan
      await new Promise(resolve => setTimeout(resolve, 1500));
      completedSteps++;
      setDeploymentProgress((completedSteps / totalSteps) * 100);
    }
    
    // Generate initial Trust Score
    await new Promise(resolve => setTimeout(resolve, 2000));
    const score = 65 + Math.floor(Math.random() * 20); // 65-85 initial range
    setTrustScore(score);
    
    setIsDeploying(false);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: // Platforms
        return platforms.some(p => p.selected) && 
               platforms.filter(p => p.selected).every(p => 
                 Object.entries(p.credentials).every(([key, cred]) => 
                   !cred.required || cred.value.trim() !== ''
                 )
               );
      case 2: // Frameworks
        return frameworks.some(f => f.selected);
      case 3: // Agents
        return agentConfigs.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep === 2) {
      generateAgentConfigs();
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Velocity AI</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Transform your compliance process with AI-powered automation. 
                We'll have you up and running in approximately <strong>{totalEstimatedTime} minutes</strong>.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <Bot className="w-8 h-8 text-blue-600 mb-3 mx-auto" />
                <h3 className="font-semibold text-gray-900 mb-2">AI Agents</h3>
                <p className="text-sm text-gray-600">Automated evidence collection across your entire infrastructure</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <Shield className="w-8 h-8 text-green-600 mb-3 mx-auto" />
                <h3 className="font-semibold text-gray-900 mb-2">Multi-Framework</h3>
                <p className="text-sm text-gray-600">Support for SOC2, ISO27001, GDPR, CIS, and more</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <Zap className="w-8 h-8 text-purple-600 mb-3 mx-auto" />
                <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-sm text-gray-600">Get your Trust Score and evidence collection within minutes</p>
              </div>
            </div>
          </div>
        );

      case 1: // Platforms
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Platforms</h2>
              <p className="text-gray-600">Select the platforms you want to monitor and provide connection details</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platforms.map(platform => (
                <div 
                  key={platform.id}
                  className={`border-2 rounded-lg p-6 transition-all cursor-pointer ${
                    platform.selected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePlatformToggle(platform.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {platform.icon}
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                    </div>
                    {platform.selected ? 
                      <CheckCircle className="w-5 h-5 text-blue-600" /> : 
                      <Circle className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
                  
                  {platform.selected && (
                    <div className="space-y-3 border-t pt-4" onClick={e => e.stopPropagation()}>
                      {Object.entries(platform.credentials).map(([key, cred]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {cred.label} {cred.required && <span className="text-red-500">*</span>}
                          </label>
                          {cred.type === 'textarea' ? (
                            <textarea
                              value={cred.value}
                              onChange={(e) => handleCredentialChange(platform.id, key, e.target.value)}
                              placeholder={cred.placeholder}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              rows={3}
                            />
                          ) : (
                            <input
                              type={cred.type}
                              value={cred.value}
                              onChange={(e) => handleCredentialChange(platform.id, key, e.target.value)}
                              placeholder={cred.placeholder}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 2: // Frameworks
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Compliance Frameworks</h2>
              <p className="text-gray-600">Select the frameworks you need to monitor for compliance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {frameworks.map(framework => (
                <div 
                  key={framework.id}
                  className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                    framework.selected 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleFrameworkToggle(framework.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                    {framework.selected ? 
                      <CheckCircle className="w-5 h-5 text-green-600" /> : 
                      <Circle className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{framework.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{framework.controls} controls</span>
                    <span>~{framework.estimatedSetupTime}min setup</span>
                  </div>
                </div>
              ))}
            </div>
            
            {frameworks.some(f => f.selected) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Selected Frameworks Summary</span>
                </div>
                <div className="text-sm text-blue-800">
                  <div>Total Controls: {frameworks.filter(f => f.selected).reduce((sum, f) => sum + f.controls, 0)}</div>
                  <div>Estimated Setup Time: {frameworks.filter(f => f.selected).reduce((sum, f) => sum + f.estimatedSetupTime, 0)} minutes</div>
                </div>
              </div>
            )}
          </div>
        );

      case 3: // Agents
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure AI Agents</h2>
              <p className="text-gray-600">Review the agents that will be created based on your selections</p>
            </div>
            
            <div className="space-y-4">
              {agentConfigs.map((agent, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Bot className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      agent.priority === 'high' ? 'bg-red-100 text-red-800' :
                      agent.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {agent.priority} priority
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Platform:</span>
                      <div className="font-medium">{agent.platform.toUpperCase()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Framework:</span>
                      <div className="font-medium">{agent.framework.toUpperCase()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Schedule:</span>
                      <div className="font-medium">{agent.schedule}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Controls:</span>
                      <div className="font-medium">{agent.controls.length} controls</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Key Controls:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {agent.controls.slice(0, 3).map((control, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {control}
                        </span>
                      ))}
                      {agent.controls.length > 3 && (
                        <span className="text-xs text-gray-500">+{agent.controls.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Deployment Summary</span>
              </div>
              <div className="text-sm text-purple-800">
                <div>{agentConfigs.length} agents will be deployed</div>
                <div>Estimated deployment time: {agentConfigs.length * 2} minutes</div>
                <div>Evidence collection will begin immediately after deployment</div>
              </div>
            </div>
          </div>
        );

      case 4: // Deploy
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Deploy & Activate</h2>
              <p className="text-gray-600">Deploy your agents and start automated compliance monitoring</p>
            </div>
            
            {!isDeploying && deploymentProgress === 0 && (
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready for Deployment</h3>
                <p className="mb-4">
                  Your {agentConfigs.length} AI agents are configured and ready to deploy.
                  This process will take approximately {agentConfigs.length * 2} minutes.
                </p>
                <Button
                  onClick={deployAgents}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                  size="lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Deployment
                </Button>
              </div>
            )}
            
            {(isDeploying || deploymentProgress > 0) && (
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Deployment Progress</h3>
                    <span className="text-sm text-gray-500">{Math.round(deploymentProgress)}%</span>
                  </div>
                  
                  <Progress value={deploymentProgress} className="mb-4" />
                  
                  <div className="space-y-2 text-sm">
                    {agentConfigs.map((agent, index) => {
                      const agentProgress = Math.max(0, Math.min(100, (deploymentProgress - index * 25)));
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          {agentProgress === 100 ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : agentProgress > 0 ? (
                            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={agentProgress === 100 ? 'text-green-600' : 'text-gray-700'}>
                            {agent.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {trustScore !== null && (
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-6 text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Initial Trust Score Generated</h3>
                    <div className="text-4xl font-bold mb-2">{trustScore}%</div>
                    <p>Your baseline Trust Score has been calculated. It will improve as agents collect more evidence.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 5: // Complete
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🎉 Congratulations!</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your Velocity AI platform is now active and collecting compliance evidence automatically.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <Bot className="w-8 h-8 text-blue-600 mb-3 mx-auto" />
                <h3 className="font-semibold text-gray-900 mb-2">{agentConfigs.length} Agents Active</h3>
                <p className="text-sm text-gray-600">AI agents are now monitoring your infrastructure</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <Shield className="w-8 h-8 text-green-600 mb-3 mx-auto" />
                <h3 className="font-semibold text-gray-900 mb-2">Trust Score: {trustScore}%</h3>
                <p className="text-sm text-gray-600">Your baseline compliance score</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <Eye className="w-8 h-8 text-purple-600 mb-3 mx-auto" />
                <h3 className="font-semibold text-gray-900 mb-2">Evidence Collection</h3>
                <p className="text-sm text-gray-600">Automated evidence gathering in progress</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => window.location.href = '/velocity/dashboard'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Dashboard
              </Button>
              
              <Button
                onClick={() => window.location.href = '/velocity/live'}
                variant="outline"
              >
                <Zap className="w-4 h-4 mr-2" />
                Live Monitoring
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Progress */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Velocity AI Setup</h1>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep 
                    ? 'bg-green-600 text-white' 
                    : index === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900">{steps[currentStep].title}</h2>
            <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {renderStepContent()}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-3">
            {steps[currentStep].skippable && (
              <Button
                onClick={nextStep}
                variant="ghost"
              >
                Skip
              </Button>
            )}
            
            {currentStep < steps.length - 1 && (
              <Button
                onClick={nextStep}
                disabled={!canProceedToNext()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VelocityOnboardingWizard;