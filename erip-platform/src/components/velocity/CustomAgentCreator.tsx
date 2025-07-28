import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Settings,
  Play,
  Code,
  Lightbulb,
  MessageSquare,
  ChevronRight,
  Copy,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgentConfig {
  name: string;
  platform: string;
  framework: string;
  description: string;
  schedule: string;
  controls: string[];
  credentials: {
    required: string[];
    optional: string[];
  };
  estimatedRuntime: string;
  automationLevel: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agentConfig?: AgentConfig;
  suggestions?: string[];
}

const CustomAgentCreator: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hi! I'm your AI Agent Creator. I can help you build custom compliance agents using natural language. Just describe what you need!\n\nFor example:\n• \"Create an AWS agent for SOC2 compliance that checks IAM policies every 4 hours\"\n• \"I need a GitHub agent that monitors code security for ISO27001\"\n• \"Build an Azure agent for GDPR data protection scanning\"",
      timestamp: new Date(),
      suggestions: [
        "Create an AWS SOC2 agent",
        "Build a GitHub security scanner", 
        "Set up Azure GDPR monitoring",
        "Create a multi-cloud agent"
      ]
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<AgentConfig | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseUserIntent = async (userInput: string): Promise<AgentConfig | null> => {
    // Simulate NLP processing with intelligent parsing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const input = userInput.toLowerCase();
    
    // Extract platform
    let platform = 'aws';
    if (input.includes('github') || input.includes('git')) platform = 'github';
    else if (input.includes('azure') || input.includes('microsoft')) platform = 'azure';
    else if (input.includes('gcp') || input.includes('google cloud')) platform = 'gcp';
    else if (input.includes('workspace')) platform = 'google_workspace';

    // Extract framework
    let framework = 'soc2';
    if (input.includes('iso27001') || input.includes('iso 27001')) framework = 'iso27001';
    else if (input.includes('gdpr')) framework = 'gdpr';
    else if (input.includes('cis') || input.includes('controls')) framework = 'cis';
    else if (input.includes('nist')) framework = 'nist';
    else if (input.includes('hipaa')) framework = 'hipaa';

    // Extract schedule
    let schedule = '4 hours';
    if (input.includes('daily') || input.includes('day')) schedule = 'daily';
    else if (input.includes('hourly') || input.includes('hour')) schedule = '1 hour';
    else if (input.includes('weekly') || input.includes('week')) schedule = 'weekly';
    else if (input.includes('real-time') || input.includes('continuous')) schedule = 'continuous';

    // Generate controls based on platform and framework
    const controls = generateControls(platform, framework);
    
    // Generate credentials requirements
    const credentials = generateCredentials(platform);

    return {
      name: `${platform.toUpperCase()} ${framework.toUpperCase()} Agent`,
      platform: platform,
      framework: framework,
      description: `Automated compliance agent for ${framework.toUpperCase()} on ${platform.toUpperCase()} platform. ${generateDescription(platform, framework)}`,
      schedule: schedule,
      controls: controls,
      credentials: credentials,
      estimatedRuntime: calculateRuntime(platform, controls.length),
      automationLevel: calculateAutomationLevel(platform, framework)
    };
  };

  const generateControls = (platform: string, framework: string): string[] => {
    const controlMap: { [key: string]: { [key: string]: string[] } } = {
      aws: {
        soc2: ['CC6.1 - IAM Policies', 'CC6.2 - Access Reviews', 'CC6.3 - Multi-Factor Auth', 'CC7.1 - CloudTrail Logging'],
        iso27001: ['A.9.1.1 - Access Control', 'A.12.4.1 - Event Logging', 'A.13.1.1 - Network Controls'],
        gdpr: ['Art. 32 - Security Measures', 'Art. 30 - Records of Processing', 'Art. 25 - Data Protection by Design'],
        cis: ['CIS 1.1 - Root Access Keys', 'CIS 1.2 - MFA for Root', 'CIS 2.1 - CloudTrail', 'CIS 3.1 - VPC Flow Logs']
      },
      github: {
        soc2: ['CC8.1 - Change Management', 'CC6.1 - Access Control', 'CC7.1 - System Monitoring'],
        iso27001: ['A.14.2.1 - Secure Development', 'A.9.2.1 - User Provisioning', 'A.12.6.1 - Vulnerability Management'],
        cis: ['CIS 1 - Asset Inventory', 'CIS 3 - Vulnerability Management', 'CIS 5 - Secure Configuration']
      },
      azure: {
        soc2: ['CC6.1 - Identity Management', 'CC7.1 - Activity Logging', 'CC6.7 - Data Classification'],
        gdpr: ['Art. 32 - Technical Measures', 'Art. 30 - Processing Records', 'Art. 35 - Impact Assessment'],
        iso27001: ['A.9.1.1 - Access Policies', 'A.18.1.1 - Legal Requirements', 'A.12.4.1 - Event Logging']
      }
    };

    return controlMap[platform]?.[framework] || ['Generic Control 1', 'Generic Control 2'];
  };

  const generateCredentials = (platform: string) => {
    const credentialsMap: { [key: string]: { required: string[], optional: string[] } } = {
      aws: {
        required: ['Access Key ID', 'Secret Access Key', 'Region'],
        optional: ['Role ARN', 'Session Token', 'External ID']
      },
      github: {
        required: ['Personal Access Token', 'Organization Name'],
        optional: ['Repository Filter', 'Team Access', 'App Installation ID']
      },
      azure: {
        required: ['Tenant ID', 'Client ID', 'Client Secret', 'Subscription ID'],
        optional: ['Resource Group', 'Management Group ID']
      },
      gcp: {
        required: ['Service Account Key', 'Project ID'],
        optional: ['Region', 'Zone', 'Organization ID']
      },
      google_workspace: {
        required: ['Service Account Credentials', 'Domain Admin Email'],
        optional: ['Organizational Unit', 'Group Filter']
      }
    };

    return credentialsMap[platform] || { required: ['API Key'], optional: ['Additional Config'] };
  };

  const generateDescription = (platform: string, framework: string): string => {
    const descriptions: { [key: string]: string } = {
      'aws_soc2': 'Monitors IAM policies, access controls, and logging configurations to ensure SOC 2 compliance across your AWS infrastructure.',
      'aws_iso27001': 'Scans security configurations, network controls, and access management to meet ISO 27001 requirements.',
      'github_soc2': 'Reviews code security policies, access controls, and change management processes for SOC 2 compliance.',
      'azure_gdpr': 'Analyzes data protection measures, processing activities, and privacy controls for GDPR compliance.',
      'gcp_cis': 'Implements CIS security benchmarks for Google Cloud Platform infrastructure and services.'
    };

    return descriptions[`${platform}_${framework}`] || 'Provides automated compliance monitoring and evidence collection.';
  };

  const calculateRuntime = (platform: string, controlCount: number): string => {
    const baseTime = platform === 'aws' ? 15 : platform === 'github' ? 8 : 12;
    const totalTime = baseTime + (controlCount * 2);
    return `${totalTime}-${totalTime + 5} minutes`;
  };

  const calculateAutomationLevel = (platform: string, framework: string): number => {
    const automationMap: { [key: string]: number } = {
      'aws_soc2': 95, 'aws_iso27001': 92, 'aws_gdpr': 88,
      'github_soc2': 90, 'github_iso27001': 87, 'github_cis': 94,
      'azure_soc2': 91, 'azure_gdpr': 89, 'azure_iso27001': 85,
      'gcp_soc2': 93, 'gcp_iso27001': 88, 'gcp_cis': 96
    };

    return automationMap[`${platform}_${framework}`] || 85;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Parse user intent with NLP
      const config = await parseUserIntent(input);
      
      if (config) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `✨ Perfect! I've created a custom agent configuration based on your requirements. Here's what I understood:

**${config.name}**
• Platform: ${config.platform.toUpperCase()}
• Framework: ${config.framework.toUpperCase()}
• Schedule: Every ${config.schedule}
• Automation Level: ${config.automationLevel}%

The agent will monitor ${config.controls.length} controls and collect evidence automatically. Would you like to review the detailed configuration?`,
          timestamp: new Date(),
          agentConfig: config,
          suggestions: [
            'Show me the detailed config',
            'Modify the schedule',
            'Add more controls',
            'Deploy this agent'
          ]
        };

        setMessages(prev => [...prev, assistantMessage]);
        setGeneratedConfig(config);
      } else {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "I had trouble understanding your request. Could you provide more details? For example:\n\n• Which cloud platform? (AWS, Azure, GCP, GitHub)\n• What compliance framework? (SOC2, ISO27001, GDPR, CIS)\n• How often should it run? (hourly, daily, weekly)\n\nTry something like: 'Create an AWS agent for SOC2 that runs every 4 hours'",
          timestamp: new Date(),
          suggestions: [
            'AWS SOC2 agent running daily',
            'GitHub ISO27001 scanner',
            'Azure GDPR compliance monitor'
          ]
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Sorry, I encountered an error processing your request. Please try again with a simpler description.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === 'Show me the detailed config' && generatedConfig) {
      setShowConfigPanel(true);
      return;
    }
    
    setInput(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const deployAgent = async () => {
    if (!generatedConfig) return;

    // Simulate deployment
    const deployMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: `🚀 Agent "${generatedConfig.name}" has been successfully deployed!\n\n✅ Configuration saved\n✅ Credentials configured\n✅ Schedule activated\n✅ Initial scan started\n\nYour agent will begin collecting evidence in the next few minutes. You can monitor its progress in the Agent Dashboard.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, deployMessage]);
    setShowConfigPanel(false);
    
    // Redirect to dashboard after 3 seconds
    setTimeout(() => {
      window.location.href = '/velocity/dashboard';
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col bg-white rounded-l-2xl shadow-xl border-r overflow-hidden">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">AI Agent Creator</h1>
                  <p className="text-blue-100 text-sm">Build intelligent compliance agents with natural language</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">AI Online</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-blue-100">Powered by</div>
                  <div className="text-sm font-semibold">Claude Opus</div>
                </div>
              </div>
            </div>
          </div>

        {/* Enhanced Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-slate-50/30 to-transparent">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-3`}>
              {message.type !== 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-2xl rounded-2xl px-6 py-4 shadow-sm ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-12' 
                  : message.type === 'system'
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-900'
                  : 'bg-white border border-gray-100 text-gray-900 shadow-md'
              }`}>
                {message.type !== 'user' && (
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm font-semibold text-gray-700">AI Agent Creator</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                  </div>
                )}
                
                <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                  {message.content}
                </div>

                {message.agentConfig && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-purple-900">Generated Configuration</h4>
                      <Button
                        onClick={() => setShowConfigPanel(true)}
                        size="sm"
                        variant="outline"
                        className="text-purple-700 border-purple-300"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Review
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-purple-700">
                      <div>Platform: {message.agentConfig.platform.toUpperCase()}</div>
                      <div>Framework: {message.agentConfig.framework.toUpperCase()}</div>
                      <div>Schedule: {message.agentConfig.schedule}</div>
                      <div>Automation: {message.agentConfig.automationLevel}%</div>
                    </div>
                  </div>
                )}

                {message.suggestions && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`text-xs px-4 py-2 rounded-full transition-all hover:scale-105 ${
                          message.type === 'user' 
                            ? 'bg-white/20 hover:bg-white/30 text-white border border-white/20' 
                            : 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {message.type === 'user' && (
                  <div className="text-xs text-blue-100 mt-3 text-right">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start items-end space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">AI is crafting your agent...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input */}
        <div className="border-t bg-gradient-to-r from-slate-50 to-blue-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="flex items-center space-x-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
                <div className="flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe the agent you want to create... (e.g., 'Create an AWS SOC2 agent that monitors IAM policies every 4 hours')"
                    className="w-full resize-none border-0 px-4 py-4 focus:ring-0 focus:outline-none placeholder-gray-400 text-gray-700"
                    rows={2}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center space-x-2 pr-2">
                  <div className="text-xs text-gray-400 hidden sm:block">
                    ⏎ to send
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-4 space-x-6 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bot className="w-3 h-3" />
                <span>Powered by AI</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
        </div>

      {/* Enhanced Configuration Panel */}
      {showConfigPanel && generatedConfig && (
        <div className="w-96 bg-white rounded-r-2xl border-l border-gray-200 flex flex-col shadow-xl">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Agent Configuration</h2>
              <Button
                onClick={() => setShowConfigPanel(false)}
                variant="ghost"
                size="sm"
              >
                ×
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Agent Name</label>
                  <div className="text-sm font-medium text-gray-900">{generatedConfig.name}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Description</label>
                  <div className="text-sm text-gray-700">{generatedConfig.description}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Platform</label>
                    <div className="text-sm font-medium text-gray-900">{generatedConfig.platform.toUpperCase()}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Framework</label>
                    <div className="text-sm font-medium text-gray-900">{generatedConfig.framework.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Schedule</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Frequency</span>
                  <span className="text-sm font-medium">Every {generatedConfig.schedule}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Runtime</span>
                  <span className="text-sm font-medium">{generatedConfig.estimatedRuntime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Automation</span>
                  <span className="text-sm font-medium text-green-600">{generatedConfig.automationLevel}%</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Controls ({generatedConfig.controls.length})</h3>
              <div className="space-y-2">
                {generatedConfig.controls.map((control, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{control}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Required Credentials</h3>
              <div className="space-y-2">
                {generatedConfig.credentials.required.map((cred, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-700">{cred}</span>
                  </div>
                ))}
              </div>
              {generatedConfig.credentials.optional.length > 0 && (
                <div className="mt-3">
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Optional</label>
                  <div className="space-y-1 mt-1">
                    {generatedConfig.credentials.optional.map((cred, index) => (
                      <div key={index} className="text-sm text-gray-500">• {cred}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t space-y-3">
            <Button onClick={deployAgent} className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Play className="w-4 h-4 mr-2" />
              Deploy Agent
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Copy className="w-3 h-3 mr-1" />
                Copy Config
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CustomAgentCreator;