import React, { useState } from 'react';
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
  Briefcase,
  DollarSign,
  AlertTriangle,
  Settings,
  Server,
  Layers
} from 'lucide-react';

const BankingISAE: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('systems');

  const bankingSystems = [
    { 
      name: "Core Banking Platform", 
      vendor: "Temenos T24/Transact",
      evidence: "Customer transactions, account modifications, system access logs",
      automation: "Real-time API",
      controls: 42
    },
    { 
      name: "Loan Management System", 
      vendor: "Finastra Loan IQ",
      evidence: "Credit decisions, approval workflows, risk assessments, collateral tracking",
      automation: "Database sync", 
      controls: 28
    },
    { 
      name: "General Ledger", 
      vendor: "Oracle Financial",
      evidence: "Journal entries, reconciliations, financial controls, reporting",
      automation: "Direct connect",
      controls: 35
    },
    { 
      name: "Payment Processing", 
      vendor: "SWIFT/FedWire",
      evidence: "Payment instructions, settlement records, fraud detection logs",
      automation: "Event streaming",
      controls: 31
    },
    { 
      name: "Risk Management", 
      vendor: "SAS Risk Engine",
      evidence: "Risk calculations, model validations, stress test results",
      automation: "Batch sync",
      controls: 24
    },
    { 
      name: "Regulatory Reporting", 
      vendor: "Moody's RiskFoundation",
      evidence: "Regulatory filings, data lineage, validation reports",
      automation: "Scheduled extract",
      controls: 18
    }
  ];

  const complianceFrameworks = [
    {
      framework: "SOX Section 404",
      description: "Internal Controls over Financial Reporting",
      integration: "Full coordination with ISAE 3000 evidence collection",
      benefits: ["Shared evidence collection", "Unified control testing", "Integrated reporting"]
    },
    {
      framework: "Basel III Pillar 2",
      description: "Operational Risk Management",
      integration: "Operational risk data feeds into ISAE 3000 assessment",
      benefits: ["Risk event correlation", "Control effectiveness metrics", "Regulatory alignment"]
    },
    {
      framework: "COSO Framework",
      description: "Enterprise Risk Management",
      integration: "Risk assessment feeds evidence categorization",
      benefits: ["Risk-based evidence prioritization", "Control mapping", "Management oversight"]
    }
  ];

  const costBreakdown = [
    { category: "External Audit Fees", traditional: "$180,000", velocity: "$25,000", savings: "86%" },
    { category: "Internal Resources", traditional: "$120,000", velocity: "$15,000", savings: "88%" },
    { category: "System Integration", traditional: "$45,000", velocity: "$5,000", savings: "89%" },
    { category: "Documentation", traditional: "$35,000", velocity: "Included", savings: "100%" },
  ];

  const evidenceCategories = [
    {
      category: "Subject Matter Controls",
      description: "Core banking process controls",
      examples: ["Transaction processing", "Account opening/closing", "Interest calculations"],
      automation: "98%"
    },
    {
      category: "IT General Controls",
      description: "Technology infrastructure controls",
      examples: ["Access management", "Change control", "Data backup/recovery"],
      automation: "95%"
    },
    {
      category: "Management Controls",
      description: "Oversight and governance controls",
      examples: ["Management review", "Exception reporting", "Performance monitoring"],
      automation: "92%"
    },
    {
      category: "Regulatory Controls",
      description: "Compliance and regulatory controls",
      examples: ["AML monitoring", "KYC procedures", "Regulatory reporting"],
      automation: "96%"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            {/* Navigation Button */}
            <div className="flex justify-start mb-8">
              <button
                onClick={() => navigate('/velocity/solutions/isae-3000')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to ISAE 3000 Solutions
              </button>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-400 text-sm font-medium mb-6">
              <Building className="w-4 h-4" />
              Banking Industry Specialization
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              Banking ISAE 3000
              <span className="text-indigo-400"> Expertise</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Specialized ISAE 3000 automation for banking institutions with deep integration 
              into core banking systems, SOX 404 coordination, and Basel III alignment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/demo/evidence-automation')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Database className="w-5 h-5" />
                Live Banking Demo
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/velocity/contact')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                Banking Expert Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Savings Calculator */}
      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Banking ISAE 3000 Cost Analysis
            </h2>
            <p className="text-slate-300">
              Detailed cost comparison for banking institutions
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400 mb-2">$380K</div>
                <div className="text-white font-medium mb-1">Traditional Cost</div>
                <div className="text-slate-400 text-sm">Big 4 Consulting</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">$45K</div>
                <div className="text-white font-medium mb-1">Velocity Cost</div>
                <div className="text-slate-400 text-sm">AI Automation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">88%</div>
                <div className="text-white font-medium mb-1">Cost Savings</div>
                <div className="text-slate-400 text-sm">$335K Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">6 Weeks</div>
                <div className="text-white font-medium mb-1">Timeline</div>
                <div className="text-slate-400 text-sm">vs 22+ weeks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { id: 'systems', label: 'Banking Systems', icon: Server },
              { id: 'frameworks', label: 'Compliance Frameworks', icon: Shield },
              { id: 'evidence', label: 'Evidence Categories', icon: FileText },
              { id: 'costs', label: 'Cost Breakdown', icon: Calculator }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'systems' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                  Banking System Integrations
                </h2>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  Deep integration with core banking platforms for comprehensive evidence collection
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {bankingSystems.map((system, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-white text-lg">{system.name}</h3>
                      <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                        {system.controls} controls
                      </span>
                    </div>
                    <div className="text-slate-400 text-sm mb-3">{system.vendor}</div>
                    <p className="text-slate-300 text-sm mb-4">{system.evidence}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 text-sm font-medium">{system.automation}</span>
                      <div className="w-24 h-2 bg-slate-700 rounded-full">
                        <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{width: '95%'}}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'frameworks' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                  Regulatory Framework Integration
                </h2>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  Seamless coordination with banking regulatory requirements
                </p>
              </div>
              
              <div className="space-y-6">
                {complianceFrameworks.map((framework, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-semibold text-white text-lg mb-2">{framework.framework}</h3>
                        <p className="text-slate-400 text-sm">{framework.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-2">Integration</h4>
                        <p className="text-slate-300 text-sm">{framework.integration}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-2">Benefits</h4>
                        <ul className="space-y-1">
                          {framework.benefits.map((benefit, bIndex) => (
                            <li key={bIndex} className="text-slate-300 text-sm flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                  ISAE 3000 Evidence Categories
                </h2>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  Automated evidence collection organized by ISAE 3000 standards
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {evidenceCategories.map((category, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white text-lg">{category.category}</h3>
                      <span className="text-indigo-400 font-mono text-sm">{category.automation}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{category.description}</p>
                    <div>
                      <h4 className="font-medium text-white text-sm mb-2">Evidence Examples:</h4>
                      <ul className="space-y-1">
                        {category.examples.map((example, eIndex) => (
                          <li key={eIndex} className="text-slate-300 text-sm flex items-center gap-2">
                            <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'costs' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                  Detailed Cost Breakdown
                </h2>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  Line-by-line comparison of traditional vs AI-automated approach
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-6 bg-white/5 border-b border-white/10">
                  <div className="font-semibold text-white">Cost Category</div>
                  <div className="font-semibold text-white text-center">Traditional</div>
                  <div className="font-semibold text-white text-center">Velocity AI</div>
                  <div className="font-semibold text-white text-center">Savings</div>
                </div>
                {costBreakdown.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-6 border-b border-white/10 last:border-b-0">
                    <div className="text-slate-300">{item.category}</div>
                    <div className="text-center text-red-400 font-mono">{item.traditional}</div>
                    <div className="text-center text-emerald-400 font-mono">{item.velocity}</div>
                    <div className="text-center text-amber-400 font-bold">{item.savings}</div>
                  </div>
                ))}
                <div className="p-6 bg-emerald-900/20 border-t border-emerald-500/30">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="font-bold text-white">Total Investment</div>
                    <div className="text-center text-red-400 font-bold text-lg">$380,000</div>
                    <div className="text-center text-emerald-400 font-bold text-lg">$45,000</div>
                    <div className="text-center text-amber-400 font-bold text-xl">88%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20 text-center bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-12 border border-indigo-500/20">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Ready for Banking-Grade ISAE 3000 Automation?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Experience the most advanced ISAE 3000 automation platform designed 
              specifically for banking institutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/demo/evidence-automation')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Database className="w-5 h-5" />
                Live Banking Integration Demo
              </button>
              
              <button
                onClick={() => navigate('/velocity/contact')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                Schedule Banking Expert Call
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mt-6">
              FFIEC approved • SOX 404 integrated • Basel III aligned • Full audit trail
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingISAE;