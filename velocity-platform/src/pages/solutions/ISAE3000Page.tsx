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
  BarChart3,
  Building,
  Calculator,
  FileText,
  Briefcase
} from 'lucide-react';

const ISAE3000Page: React.FC = () => {
  const navigate = useNavigate();

  const agents = [
    { 
      name: "ISAE 3000 Evidence Agent", 
      task: "Automates evidence collection from banking systems with regulatory compliance",
      automation: "98%",
      icon: Database
    },
    { 
      name: "Banking Integration Engine", 
      task: "Connects to core banking, loan systems, and general ledger automatically",
      automation: "95%", 
      icon: Building
    },
    { 
      name: "Evidence Categorization AI", 
      task: "Classifies evidence by ISAE 3000 standards with audit trail verification",
      automation: "97%",
      icon: Eye
    },
    { 
      name: "Audit Preparation Bot", 
      task: "Generates professional audit packages and management reports in real-time",
      automation: "100%",
      icon: FileText
    }
  ];

  const benefits = [
    "6-week ISAE 3000 audit readiness vs 22+ weeks traditional process",
    "88% cost savings compared to Big 4 consulting fees (vs Deloitte rates)",
    "100% evidence coverage vs 80-90% manual collection",
    "SOX 404 coordination and Basel III operational risk alignment",
    "Real-time banking system integration and monitoring",
    "Automated regulatory reporting and exception management"
  ];

  const costComparison = [
    { provider: "Velocity AI", cost: "$45,000", timeline: "6 weeks", coverage: "100%" },
    { provider: "Deloitte", cost: "$380,000", timeline: "22+ weeks", coverage: "85%" },
    { provider: "PwC", cost: "$350,000", timeline: "20+ weeks", coverage: "80%" },
    { provider: "EY", cost: "$365,000", timeline: "24+ weeks", coverage: "82%" }
  ];

  const bankingCapabilities = [
    { system: "Core Banking Systems", integration: "Real-time API", coverage: "Transaction logs, account changes, system controls" },
    { system: "Loan Management", integration: "Database sync", coverage: "Credit decisions, approval workflows, risk assessments" },
    { system: "General Ledger", integration: "Direct connect", coverage: "Financial controls, reconciliations, journal entries" },
    { system: "Payment Systems", integration: "Event streaming", coverage: "Payment processing, settlement, fraud controls" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
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
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Building className="w-4 h-4" />
              ISAE 3000 Banking Automation
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              ISAE 3000 Evidence
              <span className="text-blue-400"> Automation</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Revolutionary AI automation for banking ISAE 3000 audits. 88% cost savings, 
              6-week timeline, and 100% evidence coverage with real-time system integration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/demo/evidence-automation')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Trophy className="w-5 h-5" />
                Live Evidence Demo
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/velocity/industries/banking-isae')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Building className="w-5 h-5" />
                Banking Specialization
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Comparison Section */}
      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              ROI Calculator: 88% Cost Savings vs Big 4
            </h2>
            <p className="text-slate-300">
              Compare Velocity's ISAE 3000 automation against traditional consulting approaches
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {costComparison.map((provider, index) => (
              <div key={index} className={`p-6 rounded-lg border ${
                provider.provider === 'Velocity AI' 
                  ? 'bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border-blue-500/30' 
                  : 'bg-white/5 border-white/10'
              }`}>
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-2">{provider.provider}</h3>
                  <div className="text-3xl font-bold text-blue-400 mb-2">{provider.cost}</div>
                  <div className="text-white font-medium mb-1">{provider.timeline}</div>
                  <div className="text-slate-400 text-sm">Coverage: {provider.coverage}</div>
                  {provider.provider === 'Velocity AI' && (
                    <div className="mt-3 px-3 py-1 bg-emerald-500/20 rounded-full">
                      <span className="text-emerald-400 text-xs font-medium">Best Value</span>
                    </div>
                  )}
                </div>
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
                🤖 Banking-Specialized AI Agents
              </h2>
              <p className="text-slate-300 mb-8">
                Our ISAE 3000 Evidence Agent and specialized banking integrations automate 
                the entire audit evidence collection and preparation process.
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
                🚀 Revolutionary Banking Benefits
              </h2>
              <p className="text-slate-300 mb-8">
                Transform your ISAE 3000 audit process with measurable results 
                that outperform traditional consulting approaches.
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
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">Banking Audit Guarantee</span>
                </div>
                <p className="text-blue-100 text-sm">
                  96.8% of banking clients pass ISAE 3000 audits on first attempt with 
                  cryptographic evidence verification and regulatory compliance.
                </p>
              </div>
            </div>
          </div>
          
          {/* Banking System Integration */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                Complete Banking System Integration
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Real-time evidence collection from all critical banking systems 
                with ISAE 3000 compliance validation.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {bankingCapabilities.map((capability, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">{capability.system}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      {capability.integration}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">{capability.coverage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ISAE 3000 Standards Coverage */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                ISAE 3000 Standards Compliance
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Full compliance with ISAE 3000 standards including SOX 404 coordination 
                and Basel III operational risk alignment.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { standard: "ISAE 3000 Core", requirements: "Subject matter assessment", coverage: "100%" },
                { standard: "SOX 404 Integration", requirements: "Internal controls", coverage: "98.2%" },
                { standard: "Basel III Alignment", requirements: "Operational risk", coverage: "96.7%" }
              ].map((standard, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                  <h3 className="font-semibold text-white mb-2">{standard.standard}</h3>
                  <div className="text-slate-400 text-sm mb-3">{standard.requirements}</div>
                  <div className="text-2xl font-bold text-blue-400">{standard.coverage}</div>
                  <div className="text-xs text-slate-500 mt-1">Automated</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-900/50 to-emerald-900/50 rounded-2xl p-12 border border-blue-500/20">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Ready to Revolutionize Your ISAE 3000 Process?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join forward-thinking banks who have transformed their audit operations 
              with 88% cost savings and 6-week implementation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/demo/evidence-automation')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Clock className="w-5 h-5" />
                Live Evidence Demo
              </button>
              
              <button
                onClick={() => navigate('/velocity/contact')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                Schedule Banking Expert
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mt-6">
              Banking-grade security • Regulatory compliant • Full audit trail guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISAE3000Page;