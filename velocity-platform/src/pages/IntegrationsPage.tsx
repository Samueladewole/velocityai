import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cloud, 
  Zap,
  Database,
  Bot,
  Activity,
  Lock,
  CheckCircle,
  ArrowRight,
  Settings,
  Clock,
  Shield,
  Code,
  Server,
  Globe,
  BarChart3
} from 'lucide-react';

const IntegrationsPage: React.FC = () => {
  const navigate = useNavigate();

  const cloudPlatforms = [
    {
      name: "Amazon Web Services",
      logo: "AWS",
      description: "CloudTrail, Config, Security Hub, IAM, VPC Flow Logs",
      agents: ["AWS Evidence Collector", "Trust Score Engine"],
      evidenceTypes: "247+ evidence types",
      setupTime: "15 minutes",
      color: "orange"
    },
    {
      name: "Google Cloud Platform", 
      logo: "GCP",
      description: "Cloud Security Command Center, IAM, Cloud Logging, Asset Inventory",
      agents: ["GCP Security Scanner", "Continuous Monitor"],
      evidenceTypes: "156+ evidence types",
      setupTime: "12 minutes",
      color: "blue"
    },
    {
      name: "Microsoft Azure",
      logo: "Azure", 
      description: "Security Center, Sentinel, Defender, Policy, Activity Logs",
      agents: ["Azure Security Monitor", "Observability Specialist"],
      evidenceTypes: "203+ evidence types",
      setupTime: "18 minutes",
      color: "blue"
    },
    {
      name: "GitHub",
      logo: "GitHub",
      description: "Security settings, branch protection, access controls, audit logs",
      agents: ["GitHub Security Analyzer", "Document Generator"],
      evidenceTypes: "89+ evidence types", 
      setupTime: "8 minutes",
      color: "purple"
    }
  ];

  const integrationBenefits = [
    "One-click cloud platform connections with OAuth 2.0",
    "Real-time evidence collection without performance impact", 
    "Automated compliance mapping across multiple frameworks",
    "Zero-downtime deployment with read-only access",
    "Cryptographic verification of all collected evidence",
    "Cross-platform correlation and duplicate detection"
  ];

  const securityFeatures = [
    { icon: Lock, title: "Read-Only Access", description: "Never modify your cloud resources" },
    { icon: Shield, title: "Encrypted Transit", description: "All data encrypted with TLS 1.3" },
    { icon: Code, title: "API Rate Limiting", description: "Respects cloud provider limits" },
    { icon: Settings, title: "Granular Permissions", description: "Configure exactly what we access" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            {/* Navigation Button */}
            <div className="flex justify-start mb-8">
              <button
                onClick={() => navigate('/velocity/dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Cloud className="w-4 h-4" />
              Cloud Platform Integrations
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              Connect Your
              <span className="text-emerald-400"> Cloud Infrastructure</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              One-click integrations with AWS, GCP, Azure, and GitHub. Our AI agents 
              automatically collect compliance evidence from your existing infrastructure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Settings className="w-5 h-5" />
                Start Integration Setup
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Bot className="w-5 h-5" />
                Watch Integration Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Platforms */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Supported Cloud Platforms
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Connect with the world's leading cloud platforms in minutes, not months. 
              Our pre-built integrations handle authentication, data collection, and evidence validation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {cloudPlatforms.map((platform, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-€{platform.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <span className={`text-€{platform.color}-400 font-bold text-sm`}>{platform.logo}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{platform.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                        <span>⚡ {platform.setupTime}</span>
                        <span>📊 {platform.evidenceTypes}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 text-sm font-medium">Ready</div>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm mb-4">{platform.description}</p>
                
                <div className="mb-4">
                  <div className="text-slate-400 text-xs mb-2">AI Agents:</div>
                  <div className="flex flex-wrap gap-2">
                    {platform.agents.map((agent, agentIndex) => (
                      <span key={agentIndex} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                  Configure Integration
                </button>
              </div>
            ))}
          </div>
          
          {/* Security Features */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                Enterprise-Grade Security
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Your cloud infrastructure remains secure with read-only access, 
                encrypted data transmission, and granular permission controls.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                  <div className="p-3 bg-emerald-500/20 rounded-lg w-fit mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Benefits */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">
                  🚀 Integration Benefits
                </h2>
                <div className="space-y-4">
                  {integrationBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">
                  📊 Evidence Collection Stats
                </h2>
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">695+</div>
                    <div className="text-white font-medium">Total Evidence Types</div>
                    <div className="text-emerald-200 text-sm">Across all platforms</div>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400 mb-1">98.7%</div>
                    <div className="text-white font-medium">Collection Success Rate</div>
                    <div className="text-blue-200 text-sm">Automatic retry & validation</div>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-400 mb-1">15 min</div>
                    <div className="text-white font-medium">Average Setup Time</div>
                    <div className="text-purple-200 text-sm">From start to evidence collection</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-emerald-900/50 to-blue-900/50 rounded-2xl p-12 border border-emerald-500/20">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Ready to Connect Your Cloud Infrastructure?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Start collecting compliance evidence automatically from your existing 
              cloud platforms in just 15 minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Cloud className="w-5 h-5" />
                Start Cloud Integration
              </button>
              
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
                Schedule Technical Demo
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mt-6">
              Read-only access • Zero downtime • 30-day free trial
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;