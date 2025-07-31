import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap,
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
  Home,
  BarChart3
} from 'lucide-react';

const SOC2Page: React.FC = () => {
  const navigate = useNavigate();

  const agents = [
    { 
      name: "AWS Evidence Collector", 
      task: "Collects CloudTrail, Config, and Security Hub evidence automatically",
      automation: "98%",
      icon: Zap
    },
    { 
      name: "Trust Score Engine", 
      task: "Calculates real-time SOC 2 compliance score with cryptographic proofs",
      automation: "100%", 
      icon: Shield
    },
    { 
      name: "Continuous Monitor", 
      task: "Monitors security configuration changes and control drift",
      automation: "97%",
      icon: Eye
    },
    { 
      name: "Cryptographic Verification", 
      task: "Provides immutable blockchain-based compliance evidence",
      automation: "100%",
      icon: Lock
    }
  ];

  const benefits = [
    "45-day SOC 2 audit readiness vs 6-month manual process",
    "Automated evidence collection from AWS, GCP, Azure, GitHub",
    "Real-time compliance monitoring and drift detection",
    "Same-day questionnaire responses with 96.7% accuracy",
    "Cryptographic proof of evidence integrity",
    "95% reduction in compliance team workload"
  ];

  const stats = [
    { label: "Setup Time", value: "45 days", description: "vs 6 months manual" },
    { label: "Evidence Items", value: "800+", description: "automatically collected" },
    { label: "Success Rate", value: "98.2%", description: "audit pass rate" },
    { label: "Time Savings", value: "95%", description: "vs traditional methods" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
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
              <Shield className="w-4 h-4" />
              SOC 2 Compliance Automation
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              SOC 2 Audit Ready
              <span className="text-emerald-400"> in 45 Days</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              10 AI agents automate your entire SOC 2 compliance process, from evidence collection 
              to audit readiness. Get certified faster than ever before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Trophy className="w-5 h-5" />
                Start SOC 2 Automation
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

      {/* Stats Section */}
      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">{stat.value}</div>
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
                🤖 AI Agents Working For You
              </h2>
              <p className="text-slate-300 mb-8">
                Our specialized AI agents handle every aspect of SOC 2 compliance automatically, 
                from evidence collection to control validation.
              </p>
              <div className="space-y-6">
                {agents.map((agent, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <agent.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{agent.name}</h3>
                        <span className="text-emerald-400 font-mono text-sm">{agent.automation}</span>
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
                🚀 Revolutionary Benefits
              </h2>
              <p className="text-slate-300 mb-8">
                Experience the power of automated compliance with measurable results 
                that transform your security program.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">Audit Guarantee</span>
                </div>
                <p className="text-emerald-100 text-sm">
                  98.2% of Velocity customers pass their SOC 2 audit on the first attempt, 
                  backed by cryptographic evidence verification.
                </p>
              </div>
            </div>
          </div>
          
          {/* SOC 2 Controls Coverage */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                Complete SOC 2 Control Coverage
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Our AI agents automatically validate all 127 SOC 2 controls across 
                all five trust service categories.
              </p>
            </div>
            
            <div className="grid md:grid-cols-5 gap-6">
              {[
                { category: "Security", controls: "CC1-CC8", coverage: "98.4%" },
                { category: "Availability", controls: "A1.1-A1.3", coverage: "96.7%" },
                { category: "Processing Integrity", controls: "PI1.1-PI1.2", coverage: "94.2%" },
                { category: "Confidentiality", controls: "C1.1-C1.2", coverage: "97.8%" },
                { category: "Privacy", controls: "P1.1-P8.1", coverage: "95.3%" }
              ].map((category, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                  <h3 className="font-semibold text-white mb-2">{category.category}</h3>
                  <div className="text-slate-400 text-sm mb-3">{category.controls}</div>
                  <div className="text-2xl font-bold text-emerald-400">{category.coverage}</div>
                  <div className="text-xs text-slate-500 mt-1">Automated</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-emerald-900/50 to-blue-900/50 rounded-2xl p-12 border border-emerald-500/20">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Ready to Automate Your SOC 2 Compliance?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of companies who have transformed their compliance operations 
              with Velocity's AI automation platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Clock className="w-5 h-5" />
                Start 30-Minute Assessment
              </button>
              
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                Schedule Expert Demo
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mt-6">
              No credit card required • Exit anytime • Full data export guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOC2Page;