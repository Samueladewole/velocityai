import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap,
  Database,
  CheckCircle,
  ArrowRight,
  Trophy,
  Crown,
  Building,
  Star,
  FileText,
  Activity,
  Lock,
  Users,
  Globe,
  ArrowLeft,
  Target,
  TrendingUp,
  Award,
  Eye,
  Settings,
  Clock,
  DollarSign
} from 'lucide-react';

const ISAE3000ServicesPricing: React.FC = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState<'automation' | 'managed' | 'consulting'>('automation');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const isaeServiceTiers = [
    {
      name: "ISAE 3000 Automation",
      description: "Complete ISAE 3000 evidence automation for banking operations with AI-powered compliance",
      price: { monthly: 4999, annual: 49990 },
      popular: true,
      icon: Database,
      color: "emerald",
      serviceType: "automation",
      savingsMessage: "88% cheaper than Big 4 consulting (€380K+ saved annually)",
      competitorComparison: "6 weeks vs 22+ weeks with traditional consultants",
      timeline: "6 weeks to audit-ready",
      coverage: "100% ISAE 3000 controls",
      features: [
        "12 AI Agents specialized for ISAE 3000 evidence collection",
        "Automated banking system integration (Temenos, Finastra, FIS)",
        "Real-time evidence collection from 6 core banking systems",
        "AI-powered ISAE 3000 control categorization (CC1-CC9)",
        "Automated Records of Processing Activities (RoPA)",
        "Basel III operational risk alignment",
        "SOX 404 coordination and mapping",
        "Cryptographic evidence verification",
        "96.8% audit pass rate guarantee",
        "Real-time audit preparation dashboard",
        "Automated management reports",
        "24/7 evidence monitoring"
      ],
      bankingIntegrations: [
        "Core Banking Platform (Customer data, transactions)",
        "Credit Management System (Loan approvals, risk assessment)",
        "Payment Processing (Transaction monitoring, fraud detection)",
        "Risk Management System (Basel III compliance, KRIs)",
        "General Ledger (Financial reporting, reconciliations)",
        "Regulatory Reporting (FFIEC, Call reports, stress testing)"
      ],
      limitations: []
    },
    {
      name: "ISAE 3000 Managed Service",
      description: "White-glove ISAE 3000 service with dedicated banking compliance team and full audit management",
      price: { monthly: 8999, annual: 89990 },
      popular: false,
      icon: Users,
      color: "blue",
      serviceType: "managed",
      savingsMessage: "75% cheaper than Big 4 with dedicated team (€290K+ saved annually)",
      competitorComparison: "Full service with 4x faster delivery than traditional firms",
      timeline: "4 weeks to audit-ready",
      coverage: "100% ISAE 3000 + additional banking frameworks",
      features: [
        "Everything in ISAE 3000 Automation PLUS:",
        "Dedicated ISAE 3000 banking compliance team",
        "Senior Manager assigned to your engagement",
        "Monthly compliance review meetings",
        "Quarterly readiness assessments by certified professionals",
        "Direct auditor coordination and liaison",
        "Custom control testing procedures for unique banking processes",
        "Management letter preparation and review",
        "Remediation planning and implementation support",
        "Executive briefings and board reporting",
        "Unlimited consultation hours with banking experts",
        "Priority 2-hour response SLA"
      ],
      bankingIntegrations: [
        "All automation features PLUS:",
        "Custom integration with proprietary banking systems",
        "Legacy mainframe data extraction",
        "Third-party vendor compliance coordination",
        "International subsidiary compliance management",
        "Correspondent banking relationship documentation"
      ],
      limitations: []
    },
    {
      name: "ISAE 3000 Advisory & Consulting",
      description: "Strategic ISAE 3000 consulting for complex banking operations, mergers, and regulatory changes",
      price: { monthly: 12999, annual: 129990 },
      popular: false,
      icon: Crown,
      color: "purple",
      serviceType: "consulting",
      savingsMessage: "60% cheaper than Big 4 partners with superior banking expertise",
      competitorComparison: "C-suite level expertise at fraction of Big 4 costs",
      timeline: "Ongoing strategic partnership",
      coverage: "Enterprise-wide banking compliance strategy",
      features: [
        "Everything in Managed Service PLUS:",
        "C-suite banking compliance advisory",
        "ISAE 3000 framework customization for unique banking models",
        "M&A due diligence and integration support",
        "Regulatory change impact assessment and implementation",
        "Custom control design for innovative banking products",
        "Multi-jurisdictional ISAE 3000 coordination",
        "Supervisory authority relationship management",
        "Expert witness and regulatory examination support",
        "Banking industry benchmarking and best practices",
        "Custom training programs for banking staff",
        "24/7 escalation to senior banking experts"
      ],
      bankingIntegrations: [
        "All managed service features PLUS:",
        "Enterprise architecture compliance review",
        "Custom framework development",
        "Global banking subsidiary integration",
        "Fintech partnership compliance assessment",
        "Blockchain and digital asset compliance guidance"
      ],
      limitations: []
    }
  ];

  const isaeAddOns = [
    {
      name: "Additional Banking System",
      price: 1499,
      description: "Integration with additional core banking or specialized systems (per system)"
    },
    {
      name: "Multi-Jurisdiction Support",
      price: 2999,
      description: "ISAE 3000 compliance for international banking operations (per country)"
    },
    {
      name: "Custom Control Development",
      price: 3999,
      description: "Specialized ISAE 3000 controls for unique banking processes or products"
    },
    {
      name: "Accelerated Timeline",
      price: 4999,
      description: "Rush delivery - audit-ready in 3 weeks instead of standard 6 weeks"
    }
  ];

  const calculateSavings = (monthly: number, annual: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - annual;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { savings, percentage };
  };

  const competitorComparison = [
    {
      provider: "Velocity ISAE 3000",
      cost: "€60K/year",
      timeline: "6 weeks",
      coverage: "100%",
      automation: "95%",
      expertise: "Banking specialists"
    },
    {
      provider: "Deloitte",
      cost: "€380K/year",
      timeline: "22+ weeks",
      coverage: "85%",
      automation: "20%",
      expertise: "General auditors"
    },
    {
      provider: "PwC",
      cost: "€420K/year",
      timeline: "26+ weeks",
      coverage: "80%",
      automation: "15%",
      expertise: "Mixed teams"
    },
    {
      provider: "KPMG",
      cost: "€350K/year",
      timeline: "20+ weeks",
      coverage: "82%",
      automation: "25%",
      expertise: "Senior staff"
    }
  ];

  const bankingControls = [
    {
      id: "CC1",
      name: "Control Environment",
      description: "Banking governance, risk management, and organizational structure",
      automation: "92%"
    },
    {
      id: "CC2", 
      name: "Communication & Information",
      description: "Banking information systems and regulatory reporting",
      automation: "88%"
    },
    {
      id: "CC5",
      name: "Control Activities", 
      description: "Banking transaction processing and authorization controls",
      automation: "95%"
    },
    {
      id: "CC6",
      name: "Logical & Physical Access",
      description: "Banking system access controls and data security",
      automation: "94%"
    },
    {
      id: "CC7",
      name: "System Operations",
      description: "Banking system operations and change management",
      automation: "90%"
    },
    {
      id: "CC8",
      name: "Change Management",
      description: "Banking system changes and version control",
      automation: "89%"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Navigation */}
          <div className="flex justify-start mb-8">
            <button
              onClick={() => navigate('/velocity')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              ISAE 3000 Banking Services
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              ISAE 3000
              <span className="text-emerald-400"> Evidence Automation</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
              88% cheaper than Big 4 consulting with revolutionary AI automation. 
              Complete ISAE 3000 compliance for banking operations in 6 weeks.
            </p>
            
            {/* Service Type Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
                {[
                  { id: 'automation', label: 'Automation', desc: 'AI-Powered' },
                  { id: 'managed', label: 'Managed Service', desc: 'Full Support' },
                  { id: 'consulting', label: 'Advisory', desc: 'Strategic' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setServiceType(type.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all €{
                      serviceType === type.id
                        ? 'bg-emerald-500 text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <div>{type.label}</div>
                    <div className="text-xs opacity-75">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm €{billingPeriod === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-12 h-6 bg-slate-700 rounded-full transition-colors duration-300"
              >
                <div className={`absolute top-1 w-4 h-4 bg-emerald-500 rounded-full transition-transform duration-300 €{
                  billingPeriod === 'annual' ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
              <span className={`text-sm €{billingPeriod === 'annual' ? 'text-white' : 'text-slate-400'}`}>
                Annual
              </span>
              {billingPeriod === 'annual' && (
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                  Save up to 17%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ISAE 3000 Service Cards */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {isaeServiceTiers.map((tier, index) => {
              const savings = calculateSavings(tier.price.monthly, tier.price.annual);
              const isSelected = 
                (serviceType === 'automation' && index === 0) ||
                (serviceType === 'managed' && index === 1) ||
                (serviceType === 'consulting' && index === 2);
              
              return (
                <div 
                  key={index} 
                  className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 €{
                    isSelected
                      ? 'border-emerald-500/70 shadow-2xl shadow-emerald-500/30 scale-105' 
                      : tier.popular 
                        ? 'border-emerald-500/50 shadow-xl shadow-emerald-500/20 hover:scale-105' 
                        : 'border-white/10 hover:border-emerald-500/30 hover:scale-105'
                  }`}
                >
                  {(tier.popular || isSelected) && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {isSelected ? 'Selected Service' : 'Most Popular'}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className={`p-4 bg-€{tier.color}-500/20 rounded-lg w-fit mx-auto mb-4`}>
                      <tier.icon className={`w-8 h-8 text-€{tier.color}-400`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <p className="text-slate-400 text-sm mb-6">{tier.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-white">
                          €{billingPeriod === 'monthly' ? tier.price.monthly.toLocaleString() : Math.round(tier.price.annual / 12).toLocaleString()}
                        </span>
                        <span className="text-slate-400">/month</span>
                      </div>
                      {billingPeriod === 'annual' && (
                        <div className="text-emerald-400 text-sm mt-2">
                          Save €{savings.savings.toLocaleString()}/year ({savings.percentage}% off)
                        </div>
                      )}
                      
                      {/* Value Messaging */}
                      {tier.savingsMessage && (
                        <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                          <div className="text-emerald-400 text-sm font-medium">{tier.savingsMessage}</div>
                        </div>
                      )}
                      
                      {tier.competitorComparison && (
                        <div className="mt-2 text-amber-400 text-sm font-medium">
                          {tier.competitorComparison}
                        </div>
                      )}
                    </div>

                    {/* Service Highlights */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="p-2 bg-slate-800/50 rounded">
                        <div className="text-emerald-400 font-medium">Timeline</div>
                        <div className="text-white">{tier.timeline}</div>
                      </div>
                      <div className="p-2 bg-slate-800/50 rounded">
                        <div className="text-emerald-400 font-medium">Coverage</div>
                        <div className="text-white">{tier.coverage}</div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate('/solutions/isae-3000')}
                      className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 €{
                        tier.popular || isSelected
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      Start ISAE 3000 Service
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Banking Integrations */}
                    <div className="text-emerald-400 font-medium mb-3">Banking System Integration:</div>
                    {tier.bankingIntegrations.slice(0, 4).map((integration, integrationIndex) => (
                      <div key={integrationIndex} className="flex items-start gap-3">
                        <Database className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{integration}</span>
                      </div>
                    ))}
                    
                    {/* Service Features */}
                    <div className="text-white font-medium mt-6 mb-3">Service Features:</div>
                    {tier.features.slice(0, 8).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className={`w-4 h-4 text-€{tier.color}-400 mt-0.5 flex-shrink-0`} />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {tier.features.length > 8 && (
                      <div className="text-center pt-2">
                        <button className="text-emerald-400 text-sm hover:text-emerald-300">
                          +{tier.features.length - 8} more features
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Competitor Comparison Table */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">88% Cost Savings vs Big 4</h2>
              <p className="text-slate-300 max-w-3xl mx-auto">
                Compare Velocity's ISAE 3000 services against traditional Big 4 consulting firms
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Provider</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Annual Cost</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Timeline</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Coverage</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Automation</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Expertise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {competitorComparison.map((provider, index) => (
                      <tr key={index} className={index === 0 ? 'bg-emerald-500/10' : ''}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{provider.provider}</span>
                            {index === 0 && (
                              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                Best Value
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{provider.cost}</div>
                          {index === 0 && <div className="text-xs text-emerald-400">88% savings</div>}
                        </td>
                        <td className="px-6 py-4 text-slate-300">{provider.timeline}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white">{provider.coverage}</span>
                            {provider.coverage === '100%' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white">{provider.automation}</span>
                            {provider.automation === '95%' && <Zap className="w-4 h-4 text-amber-400" />}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{provider.expertise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ISAE 3000 Controls Coverage */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">Complete ISAE 3000 Controls Coverage</h2>
              <p className="text-slate-300 max-w-3xl mx-auto">
                AI-powered automation for all ISAE 3000 controls with banking-specific implementations
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bankingControls.map((control, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-white">{control.id}</span>
                    </div>
                    <div className="text-emerald-400 font-medium text-sm">{control.automation} automated</div>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{control.name}</h3>
                  <p className="text-slate-300 text-sm">{control.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add-on Services */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">ISAE 3000 Add-On Services</h2>
              <p className="text-slate-300 max-w-3xl mx-auto">
                Extend your ISAE 3000 automation with specialized banking services
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isaeAddOns.map((addon, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-white">{addon.name}</h3>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400 mb-2">
                    €{addon.price.toLocaleString()}
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{addon.description}</p>
                  <button className="w-full px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-sm font-medium transition-colors">
                    Add to Service
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-2xl p-12 border border-emerald-500/20">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Ready for ISAE 3000 Automation?
            </h2>
            <p className="text-slate-300 mb-8 max-w-3xl mx-auto">
              Join leading banks using Velocity's ISAE 3000 automation. Get audit-ready in 6 weeks 
              with 88% cost savings compared to traditional consulting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={() => navigate('/solutions/isae-3000')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Shield className="w-5 h-5" />
                Start ISAE 3000 Service
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/demo/evidence-automation')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Eye className="w-5 h-5" />
                See Evidence Demo
              </button>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4 text-sm text-slate-400 max-w-3xl mx-auto">
              <div>✓ 6-week delivery</div>
              <div>✓ 96.8% audit pass rate</div>
              <div>✓ Banking specialists</div>
              <div>✓ 88% cost savings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISAE3000ServicesPricing;