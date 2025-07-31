import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Shield,
  Database,
  Zap,
  Cloud,
  Lock,
  CheckCircle,
  ArrowRight,
  Clock,
  TrendingUp,
  Eye,
  FileText,
  BarChart3,
  Settings,
  Sparkles,
  Globe,
  Activity,
  Award,
  Layers,
  Target
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const coreFeatures = [
    {
      icon: Bot,
      title: "10 AI Agents",
      description: "Specialized AI agents for AWS, GCP, Azure, GitHub, and more",
      color: "emerald",
      details: ["AWS Evidence Collector", "GCP Security Scanner", "Azure Security Monitor", "GitHub Security Analyzer"]
    },
    {
      icon: Database,
      title: "Evidence Automation",
      description: "Automated collection and validation of 695+ evidence types",
      color: "blue",
      details: ["Real-time collection", "Cryptographic verification", "Cross-platform correlation", "Automatic categorization"]
    },
    {
      icon: Shield,
      title: "Multi-Framework Support",
      description: "SOC 2, ISO 27001, GDPR, HIPAA, PCI DSS, and CIS Controls",
      color: "purple",
      details: ["Framework mapping", "Control validation", "Gap analysis", "Readiness scoring"]
    },
    {
      icon: TrendingUp,
      title: "Trust Score Engine",
      description: "Cryptographically verified compliance scoring with blockchain proof",
      color: "amber",
      details: ["Real-time scoring", "Merkle tree verification", "Immutable audit trail", "Trend analysis"]
    }
  ];

  const advancedFeatures = [
    {
      icon: Cloud,
      title: "One-Click Integrations",
      description: "Connect AWS, GCP, Azure, and GitHub in minutes with OAuth 2.0",
      benefits: ["15-minute setup", "Read-only access", "Zero downtime", "Encrypted transit"]
    },
    {
      icon: Eye,
      title: "Continuous Monitoring",
      description: "24/7 real-time monitoring of your compliance posture",
      benefits: ["Configuration drift detection", "Instant alerts", "Automated remediation", "Historical tracking"]
    },
    {
      icon: FileText,
      title: "QIE Intelligence",
      description: "AI-powered questionnaire processing with 96.7% accuracy",
      benefits: ["Same-day completion", "Evidence-backed responses", "Multi-framework support", "Context awareness"]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive dashboards and reporting for stakeholders",
      benefits: ["Executive summaries", "Audit-ready reports", "Trend analysis", "Custom dashboards"]
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 Type II compliance",
      benefits: ["End-to-end encryption", "Zero-trust architecture", "Role-based access", "Audit logging"]
    },
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description: "Intelligent recommendations and gap analysis",
      benefits: ["Prioritized remediation", "Risk assessment", "Cost optimization", "Timeline prediction"]
    }
  ];

  const platformCapabilities = [
    { metric: "98.7%", label: "Automation Rate", description: "vs 15% industry average" },
    { metric: "695+", label: "Evidence Types", description: "Across all platforms" },
    { metric: "60 days", label: "Audit Ready", description: "Average compliance timeline" },
    { metric: "85%", label: "Cost Reduction", description: "vs manual compliance" }
  ];

  const integrationStats = [
    { platform: "AWS", evidenceTypes: "247+", setupTime: "15 min", color: "orange" },
    { platform: "GCP", evidenceTypes: "156+", setupTime: "12 min", color: "blue" },
    { platform: "Azure", evidenceTypes: "203+", setupTime: "18 min", color: "blue" },
    { platform: "GitHub", evidenceTypes: "89+", setupTime: "8 min", color: "purple" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Platform Features
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              AI-Powered
              <span className="text-emerald-400"> Compliance Automation</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Transform your compliance program with 10 specialized AI agents, automated evidence collection, 
              and cryptographically verified trust scoring across all major frameworks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Target className="w-5 h-5" />
                Start Free Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Bot className="w-5 h-5" />
                Watch AI Agents Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Capabilities */}
      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {platformCapabilities.map((capability, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">{capability.metric}</div>
                <div className="text-white font-medium mb-1">{capability.label}</div>
                <div className="text-slate-400 text-sm">{capability.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Core Platform Features
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Built from the ground up for modern compliance teams who need speed, accuracy, and auditability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 bg-${feature.color}-500/20 rounded-lg`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Advanced Features Grid */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                Advanced Capabilities
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Enterprise-grade features designed for scale, security, and seamless integration.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advancedFeatures.map((feature, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-emerald-500/20 transition-all duration-300">
                  <div className="p-2 bg-emerald-500/20 rounded-lg w-fit mb-4">
                    <feature.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{feature.description}</p>
                  <div className="space-y-1">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Stats */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                Cloud Platform Integrations
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                One-click connections to your existing cloud infrastructure with enterprise security.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrationStats.map((platform, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                  <div className={`w-12 h-12 bg-${platform.color}-500/20 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <span className={`text-${platform.color}-400 font-bold text-sm`}>{platform.platform}</span>
                  </div>
                  <div className="text-white font-medium mb-1">{platform.platform}</div>
                  <div className="text-slate-400 text-sm mb-2">{platform.evidenceTypes} evidence types</div>
                  <div className="text-emerald-400 text-xs font-medium">⚡ {platform.setupTime} setup</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Agents Showcase */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                Meet Your AI Compliance Team
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                10 specialized AI agents working 24/7 to automate your compliance program.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 rounded-2xl p-8 border border-emerald-500/20">
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  "AWS Evidence Collector",
                  "GCP Security Scanner", 
                  "Azure Security Monitor",
                  "GitHub Security Analyzer",
                  "QIE Integration Agent",
                  "Trust Score Engine",
                  "Continuous Monitor",
                  "Document Generator",
                  "Observability Specialist",
                  "Cryptographic Verification"
                ].map((agent, index) => (
                  <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
                    <Bot className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <div className="text-white text-sm font-medium">{agent}</div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Activity className="w-4 h-4" />
                  View AI Agents Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-slate-900/50 to-emerald-900/50 rounded-2xl p-12 border border-emerald-500/20">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Ready to Transform Your Compliance Program?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join forward-thinking companies who've automated their compliance with Velocity's AI platform. 
              Get audit-ready in 60 days, not 6+ months.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Target className="w-5 h-5" />
                Get Free Compliance Assessment
              </button>
              
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
                Schedule Platform Demo
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mt-6">
              30-day free trial • No credit card required • White-glove onboarding included
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;