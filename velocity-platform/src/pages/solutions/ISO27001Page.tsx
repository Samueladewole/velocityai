import React from 'react';
import { PublicHeader } from '../../components/common/PublicHeader';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Globe,
  Database,
  Bot,
  Eye,
  Lock,
  CheckCircle,
  ArrowRight,
  Trophy,
  Clock,
  TrendingUp,
  Users,
  Activity,
  Settings
} from 'lucide-react';

const ISO27001Page: React.FC = () => {
  const navigate = useNavigate();

  const agents = [
    { 
      name: "Azure Security Monitor", 
      task: "Monitors Azure Security Center and implements ISO 27001 controls automatically",
      automation: "96%",
      icon: Activity
    },
    { 
      name: "Document Generator", 
      task: "Creates ISMS documentation, policies, and procedures automatically",
      automation: "95%", 
      icon: Database
    },
    { 
      name: "Continuous Monitor", 
      task: "Tracks implementation of all 114 ISO 27001 controls in real-time",
      automation: "97%",
      icon: Eye
    },
    { 
      name: "Trust Score Engine", 
      task: "Validates ISMS effectiveness with cryptographic verification",
      automation: "100%",
      icon: Shield
    }
  ];

  const benefits = [
    "60-day ISMS implementation vs 12-month traditional approach",
    "Automated documentation for all 114 ISO 27001 controls",
    "Real-time risk assessment and treatment tracking",
    "Integrated management system with SOC 2 overlap optimization",
    "Continuous monitoring of security control effectiveness",
    "90% reduction in certification preparation time"
  ];

  const stats = [
    { label: "Implementation", value: "60 days", description: "ISMS deployment" },
    { label: "Controls", value: "114", description: "automatically managed" },
    { label: "Documentation", value: "95%", description: "auto-generated" },
    { label: "Overlap Savings", value: "70%", description: "with SOC 2" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <PublicHeader />
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              ISO 27001 ISMS Automation
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              ISO 27001 Certified
              <span className="text-blue-400"> in 60 Days</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Deploy a complete Information Security Management System (ISMS) with AI automation. 
              Our agents handle documentation, implementation, and continuous monitoring.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Settings className="w-5 h-5" />
                Start ISMS Deployment
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Bot className="w-5 h-5" />
                View ISMS Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-white font-medium mb-1">{stat.label}</div>
                <div className="text-slate-400 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 mb-20">
            {/* AI Agents */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 font-serif">
                🤖 ISMS AI Automation
              </h2>
              <p className="text-slate-300 mb-8">
                Our AI agents implement and maintain your complete Information Security 
                Management System according to ISO 27001 requirements.
              </p>
              <div className="space-y-6">
                {agents.map((agent, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <agent.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{agent.name}</h3>
                        <span className="text-blue-400 font-mono text-sm">{agent.automation}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{agent.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 font-serif">
                🌍 Global Standard Benefits
              </h2>
              <p className="text-slate-300 mb-8">
                Achieve internationally recognized information security management 
                with automated compliance and continuous improvement.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Globe className="w-5 h-5" />
                  <span className="font-semibold">Multi-Framework Optimization</span>
                </div>
                <p className="text-blue-100 text-sm">
                  70% control overlap with SOC 2 means dual certification with minimal 
                  additional effort using our intelligent framework mapping.
                </p>
              </div>
            </div>
          </div>
          
          {/* ISO 27001 Controls */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                Complete ISO 27001 Annex A Controls
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                All 114 security controls across 14 categories, automatically implemented 
                and continuously monitored by our AI agents.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { category: "Information Security Policies", code: "A.5", controls: 2 },
                { category: "Organization of Information Security", code: "A.6", controls: 7 },
                { category: "Human Resource Security", code: "A.7", controls: 6 },
                { category: "Asset Management", code: "A.8", controls: 10 },
                { category: "Access Control", code: "A.9", controls: 14 },
                { category: "Cryptography", code: "A.10", controls: 2 },
                { category: "Physical Security", code: "A.11", controls: 15 },
                { category: "Operations Security", code: "A.12", controls: 14 },
                { category: "Communications Security", code: "A.13", controls: 7 },
                { category: "System Development", code: "A.14", controls: 13 },
                { category: "Supplier Relationships", code: "A.15", controls: 5 },
                { category: "Incident Management", code: "A.16", controls: 7 },
                { category: "Business Continuity", code: "A.17", controls: 4 },
                { category: "Compliance", code: "A.18", controls: 8 }
              ].map((category, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="text-blue-400 font-mono text-sm mb-1">{category.code}</div>
                  <h3 className="font-medium text-white text-sm mb-2 leading-tight">{category.category}</h3>
                  <div className="text-slate-400 text-xs">{category.controls} controls</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-blue-500/20">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Ready to Deploy Your ISMS?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Transform your information security management with AI automation. 
              Get ISO 27001 certified faster than ever before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Clock className="w-5 h-5" />
                Start ISMS Assessment
              </button>
              
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                Schedule Consultation
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mt-6">
              No commitment required • Multi-framework optimization • Expert support included
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISO27001Page;