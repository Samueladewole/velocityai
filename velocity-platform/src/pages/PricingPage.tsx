import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap,
  Bot,
  CheckCircle,
  ArrowRight,
  Trophy,
  Crown,
  Rocket,
  Star,
  Home,
  ArrowLeft
} from 'lucide-react';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const pricingTiers = [
    {
      name: "Growth",
      description: "40% cheaper than competitors - Revolutionary AI automation",
      price: { monthly: 1499, annual: 14990 },
      popular: false,
      icon: Rocket,
      color: "emerald",
      savingsMessage: "Replaces $50K+ in consulting fees annually",
      competitorComparison: "40% cheaper than traditional solutions",
      features: [
        "5 AI Agents (AWS, GCP, Trust Score, Monitor, QIE)",
        "SOC 2 + GDPR framework automation",
        "AWS & GCP cloud integrations (400+ evidence types)",
        "QIE questionnaire processing (96.7% accuracy)",
        "Cryptographic evidence verification",
        "Real-time compliance dashboard",
        "Priority support with 12-hour response",
        "Up to 25 team members",
        "2 compliance frameworks included"
      ],
      limitations: [
        "Limited to 2 frameworks (SOC 2, GDPR)",
        "Standard reporting templates",
        "Evidence retention (3 years)"
      ]
    },
    {
      name: "Professional",
      description: "35% cheaper with 8 visible AI agents - Multi-framework mastery",
      price: { monthly: 2999, annual: 29990 },
      popular: true,
      icon: Trophy,
      color: "blue",
      savingsMessage: "Replaces $120K+ in consulting fees annually",
      competitorComparison: "35% cheaper with revolutionary AI automation",
      features: [
        "8 AI Agents (AWS, GCP, Azure, GitHub, Trust Score, Monitor, QIE, DocGen)",
        "Multi-framework support (SOC 2, ISO 27001, GDPR, HIPAA)",
        "All cloud integrations (AWS, GCP, Azure, GitHub)",
        "Advanced cryptographic verification",
        "Unlimited QIE questionnaire processing",
        "Advanced analytics and custom reporting",
        "Priority support with 4-hour response",
        "Up to 75 team members",
        "4 compliance frameworks included",
        "Custom evidence workflows",
        "Framework overlap optimization"
      ],
      limitations: [
        "Limited to 4 frameworks",
        "Standard custom agent development"
      ]
    },
    {
      name: "Enterprise",
      description: "30% cheaper with ALL 10 visible AI agents + crypto verification no competitor offers",
      price: { monthly: 4999, annual: 49990 },
      popular: false,
      icon: Crown,
      color: "purple",
      savingsMessage: "Replaces $200K+ in consulting fees annually",
      competitorComparison: "30% cheaper than competitors ($7K-10K elsewhere)",
      features: [
        "ALL 10 AI Agents (complete automation suite - only platform with 10 visible agents)",
        "Cryptographic verification no competitor offers",
        "All frameworks (SOC 2, ISO 27001, GDPR, HIPAA, PCI DSS + custom)",
        "Custom framework development and mapping",
        "Unlimited everything (QIE, integrations, evidence collection)",
        "Dedicated Customer Success Manager",
        "24/7 white-glove support with 1-hour SLA",
        "Unlimited team members",
        "White-label options and API access",
        "Advanced RBAC and multi-tenant support",
        "Custom reporting and executive dashboards",
        "Advanced evidence retention (10 years)",
        "Compliance consulting and audit prep included",
        "Custom AI agent development"
      ],
      limitations: []
    }
  ];

  const calculateSavings = (monthly: number, annual: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - annual;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { savings, percentage };
  };

  const addOns = [
    { name: "Additional Framework", price: 499, description: "Per framework per month (NIST, FedRAMP, etc.)" },
    { name: "White-Glove Support", price: 799, description: "24/7 dedicated support with 30-min SLA" },
    { name: "Custom Agent Development", price: 2499, description: "Build specialized AI agents for unique requirements" },
    { name: "Executive Compliance Consulting", price: 1299, description: "C-suite compliance strategy and audit prep" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Navigation Button */}
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
              <Zap className="w-4 h-4" />
              AI Compliance Automation Pricing
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              Choose Your
              <span className="text-emerald-400"> Automation Level</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Enterprise-worthy pricing for revolutionary AI automation. 30-40% cheaper than competitors 
              with the only platform featuring 10 visible AI agents and cryptographic verification.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-12 h-6 bg-slate-700 rounded-full transition-colors duration-300"
              >
                <div className={`absolute top-1 w-4 h-4 bg-emerald-500 rounded-full transition-transform duration-300 ${
                  billingPeriod === 'annual' ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
              <span className={`text-sm ${billingPeriod === 'annual' ? 'text-white' : 'text-slate-400'}`}>
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

      {/* Pricing Cards */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {pricingTiers.map((tier, index) => {
              const savings = calculateSavings(tier.price.monthly, tier.price.annual);
              
              return (
                <div 
                  key={index} 
                  className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                    tier.popular 
                      ? 'border-blue-500/50 shadow-xl shadow-blue-500/20' 
                      : 'border-white/10 hover:border-emerald-500/30'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className={`p-4 bg-${tier.color}-500/20 rounded-lg w-fit mx-auto mb-4`}>
                      <tier.icon className={`w-8 h-8 text-${tier.color}-400`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <p className="text-slate-400 text-sm mb-6">{tier.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-white">
                          ${billingPeriod === 'monthly' ? tier.price.monthly.toLocaleString() : Math.round(tier.price.annual / 12).toLocaleString()}
                        </span>
                        <span className="text-slate-400">/month</span>
                      </div>
                      {billingPeriod === 'annual' && (
                        <div className="text-emerald-400 text-sm mt-2">
                          Save ${savings.savings.toLocaleString()}/year ({savings.percentage}% off)
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
                    
                    <button
                      onClick={() => navigate('/velocity/assessment')}
                      className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        tier.popular
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      Start {tier.name} Plan
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-white font-medium mb-3">What's included:</div>
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className={`w-4 h-4 text-${tier.color}-400 mt-0.5 flex-shrink-0`} />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {tier.limitations.length > 0 && (
                      <div className="pt-4 mt-4 border-t border-white/10">
                        <div className="text-slate-400 text-sm mb-2">Limitations:</div>
                        {tier.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="text-slate-500 text-sm">
                            • {limitation}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Add-ons */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">Add-On Services</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Extend your compliance automation with additional services and custom integrations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addon, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">{addon.name}</h3>
                  <div className="text-2xl font-bold text-emerald-400 mb-2">
                    ${addon.price}
                  </div>
                  <p className="text-slate-400 text-sm">{addon.description}</p>
                  <button className="w-full mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                    Add to Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Competitive Comparison */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">Why Velocity Dominates the Market</h2>
              <p className="text-slate-300 max-w-3xl mx-auto">
                Enterprise-worthy pricing with revolutionary capabilities no competitor can match
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-8 border border-emerald-500/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Only Platform with 10 Visible AI Agents</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Competitors hide their automation behind generic "AI-powered" claims. 
                    Velocity shows you exactly which 10 specialized agents are working for you.
                  </p>
                  <div className="text-emerald-400 font-medium">Transparency Leaders</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-2xl p-8 border border-purple-500/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Cryptographic Verification No One Else Has</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Revolutionary blockchain-based evidence verification creates immutable audit trails. 
                    Competitors still use basic file storage.
                  </p>
                  <div className="text-purple-400 font-medium">Patent-Pending Technology</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-8 border border-amber-500/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">30-40% Cheaper Than Competitors</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Traditional solutions cost $7K-10K/month for Enterprise. 
                    Velocity delivers revolutionary capabilities at $4,999/month.
                  </p>
                  <div className="text-amber-400 font-medium">Massive Cost Savings</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-full border border-emerald-500/30">
                <Crown className="w-6 h-6 text-amber-400" />
                <span className="text-white font-bold text-lg">C-Suite Approved Pricing That Reflects True Enterprise Value</span>
              </div>
            </div>
          </div>
          
          {/* FAQ */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  question: "What's included in the 30-day free trial?",
                  answer: "Full access to all features in your selected plan, including AI agents, evidence collection, and compliance monitoring. No credit card required."
                },
                {
                  question: "Can I switch plans anytime?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing."
                },
                {
                  question: "Do you offer custom frameworks?",
                  answer: "Enterprise plans include custom framework support. We can map any compliance standard to our AI automation platform."
                },
                {
                  question: "What kind of support do you provide?",
                  answer: "All plans include support. Startup gets email support, Growth gets priority support, and Enterprise gets 24/7 dedicated support."
                },
                {
                  question: "Is my data secure?",
                  answer: "Yes, we use enterprise-grade security with encryption in transit and at rest, SOC 2 compliance, and read-only access to your systems."
                },
                {
                  question: "Can I cancel anytime?",
                  answer: "Yes, you can cancel anytime with no penalties. Your data remains accessible for 90 days after cancellation for export."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-slate-300 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-emerald-900/50 to-blue-900/50 rounded-2xl p-12 border border-emerald-500/20">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Ready to Automate Your Compliance?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Start your 30-day free trial today. No credit card required, 
              cancel anytime, and get audit-ready in 45 days.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Zap className="w-5 h-5" />
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Bot className="w-5 h-5" />
                Schedule Demo
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mt-6">
              30-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;