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
  Building,
  Users,
  Globe,
  Database,
  Lock,
  Activity,
  FileText,
  ArrowLeft,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';

const FinancialServicesPricing: React.FC = () => {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [institutionSize, setInstitutionSize] = useState<'community' | 'regional' | 'enterprise'>('regional');

  const bankingTiers = [
    {
      name: "Community Banking",
      description: "Perfect for community banks and credit unions with up to €2B in assets",
      price: { monthly: 2999, annual: 29990 },
      popular: false,
      icon: Building,
      color: "emerald",
      assetRange: "Up to €2B in assets",
      savingsMessage: "Replaces €150K+ in compliance consulting annually",
      competitorComparison: "75% cheaper than traditional banking compliance solutions",
      bankingSpecific: [
        "Core Banking System Integration (Temenos, Finastra)",
        "FDIC/NCUA Regulatory Reporting Automation",
        "BSA/AML Transaction Monitoring Integration",
        "CRA Compliance Documentation",
        "Community Reinvestment Act Reporting"
      ],
      features: [
        "8 AI Agents (AWS, GCP, Trust Score, Monitor, QIE, GDPR, ISAE3000, DocGen)",
        "Banking Frameworks (SOC 2, GDPR, GLBA, PCI DSS)",
        "Real-time regulatory compliance monitoring",
        "Automated RoPA generation for GDPR",
        "ISAE 3000 banking evidence automation",
        "Basel III operational risk alignment",
        "Cross-border transfer compliance (SWIFT)",
        "Customer data protection workflows",
        "Breach notification automation (72-hour GDPR)",
        "Up to 50 banking staff members",
        "Priority banking support (8-hour response)"
      ],
      limitations: [
        "Limited to 4 compliance frameworks",
        "Standard regulatory reporting templates",
        "Basic cross-border transfer monitoring"
      ]
    },
    {
      name: "Regional Banking",
      description: "Designed for regional banks with €2B-€50B in assets requiring multi-jurisdictional compliance",
      price: { monthly: 5999, annual: 59990 },
      popular: true,
      icon: Trophy,
      color: "blue",
      assetRange: "€2B-€50B in assets",
      savingsMessage: "Replaces €350K+ in compliance consulting annually",
      competitorComparison: "70% cheaper with revolutionary banking automation",
      bankingSpecific: [
        "Multi-State Banking Compliance Coordination",
        "Federal Reserve Stress Testing Support",
        "CCAR/DFAST Capital Planning Integration",
        "Commercial Lending Compliance (CRE, C&I)",
        "Multi-Jurisdictional Data Residency Management"
      ],
      features: [
        "ALL 12 AI Agents (complete banking automation suite)",
        "Comprehensive Banking Frameworks (SOC 2, ISO 27001, GDPR, HIPAA, PCI DSS, GLBA)",
        "Advanced ISAE 3000 evidence automation",
        "SOX 404 coordination with ISAE 3000",
        "Basel III capital calculation automation",
        "Multi-currency transaction compliance",
        "International banking integration (25+ countries)",
        "Advanced customer data classification",
        "Automated privacy impact assessments",
        "Real-time regulatory change monitoring",
        "Custom banking workflow automation",
        "Up to 200 banking staff members",
        "Dedicated Banking Success Manager",
        "Priority support (4-hour response)"
      ],
      limitations: [
        "Custom framework development requires consultation",
        "Advanced API integrations may require professional services"
      ]
    },
    {
      name: "Global Banking Enterprise",
      description: "Complete solution for global banks with €50B+ in assets and complex international operations",
      price: { monthly: 12999, annual: 129990 },
      popular: false,
      icon: Crown,
      color: "purple",
      assetRange: "€50B+ in assets",
      savingsMessage: "Replaces €750K+ in compliance consulting annually",
      competitorComparison: "65% cheaper than Big 4 consulting (€35K+/month elsewhere)",
      bankingSpecific: [
        "Global Regulatory Harmonization (Fed, ECB, BoE, etc.)",
        "Systemically Important Bank (SIB) Requirements",
        "Global SIFI Capital Requirements Automation",
        "Cross-Border Resolution Planning Support",
        "International Correspondent Banking Compliance"
      ],
      features: [
        "ALL 12 AI Agents + Custom Banking Agents",
        "Global Banking Framework Coverage (all jurisdictions)",
        "White-label compliance platform options",
        "Custom ISAE 3000 controls for banking operations",
        "Advanced Basel III/IV capital modeling",
        "Global data residency and sovereignty compliance",
        "Multi-regulatory reporting automation (50+ jurisdictions)",
        "Advanced cryptographic verification for audit trails",
        "Executive regulatory risk dashboards",
        "Unlimited international banking integrations",
        "24/7 global banking support team",
        "Dedicated C-Suite compliance consulting",
        "Custom AI agent development for unique banking needs",
        "Unlimited team members across all regions",
        "White-glove regulatory audit preparation",
        "Advanced RBAC for global banking operations"
      ],
      limitations: []
    }
  ];

  const bankingAddOns = [
    { 
      name: "Additional Jurisdiction", 
      price: 1999, 
      description: "Per additional country/regulatory jurisdiction (includes local banking laws)" 
    },
    { 
      name: "Regulatory Consulting", 
      price: 2999, 
      description: "Monthly retainer for banking compliance experts and regulatory guidance" 
    },
    { 
      name: "Custom Banking Agent", 
      price: 4999, 
      description: "Specialized AI agent for unique banking processes (trade finance, treasury, etc.)" 
    },
    { 
      name: "Audit Readiness Service", 
      price: 1999, 
      description: "Comprehensive audit preparation with dedicated banking compliance experts" 
    }
  ];

  const calculateSavings = (monthly: number, annual: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - annual;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { savings, percentage };
  };

  const getBankingComplexityMultiplier = () => {
    switch (institutionSize) {
      case 'community':
        return { multiplier: 1, description: "Community Banking Focused" };
      case 'regional':
        return { multiplier: 1.5, description: "Multi-State Operations" };
      case 'enterprise':
        return { multiplier: 2.5, description: "Global Banking Operations" };
    }
  };

  const bankingValueProps = [
    {
      icon: Shield,
      title: "Banking-Specific Compliance",
      description: "Purpose-built for financial institutions with pre-configured workflows for FDIC, Fed, OCC, and international banking regulations.",
      color: "emerald"
    },
    {
      icon: Database,
      title: "Core Banking Integration",
      description: "Native integration with major core banking systems (Temenos, Finastra, FIS, Jack Henry) for seamless data flow automation.",
      color: "blue"
    },
    {
      icon: Globe,
      title: "Cross-Border Compliance",
      description: "Automated management of international data transfers, correspondent banking compliance, and multi-jurisdictional reporting.",
      color: "purple"
    },
    {
      icon: TrendingUp,
      title: "Regulatory Change Management",
      description: "AI-powered monitoring of regulatory changes with automatic compliance workflow updates and impact assessments.",
      color: "amber"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Building className="w-4 h-4" />
              Financial Services Specialized Pricing
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              Banking-First
              <span className="text-blue-400"> Compliance Automation</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
              Purpose-built for financial institutions. Comprehensive compliance automation 
              with 65-75% cost savings compared to traditional banking compliance solutions.
            </p>
            
            {/* Institution Size Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
                {[
                  { id: 'community', label: 'Community Bank', assets: 'Up to €2B' },
                  { id: 'regional', label: 'Regional Bank', assets: '€2B-€50B' },
                  { id: 'enterprise', label: 'Global Bank', assets: '€50B+' }
                ].map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setInstitutionSize(size.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all €{
                      institutionSize === size.id
                        ? 'bg-blue-500 text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <div>{size.label}</div>
                    <div className="text-xs opacity-75">{size.assets}</div>
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
                <div className={`absolute top-1 w-4 h-4 bg-blue-500 rounded-full transition-transform duration-300 €{
                  billingPeriod === 'annual' ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
              <span className={`text-sm €{billingPeriod === 'annual' ? 'text-white' : 'text-slate-400'}`}>
                Annual
              </span>
              {billingPeriod === 'annual' && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  Save up to 17%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Banking Pricing Cards */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {bankingTiers.map((tier, index) => {
              const savings = calculateSavings(tier.price.monthly, tier.price.annual);
              const isSelected = 
                (institutionSize === 'community' && index === 0) ||
                (institutionSize === 'regional' && index === 1) ||
                (institutionSize === 'enterprise' && index === 2);
              
              return (
                <div 
                  key={index} 
                  className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 €{
                    isSelected
                      ? 'border-blue-500/70 shadow-2xl shadow-blue-500/30 scale-105' 
                      : tier.popular 
                        ? 'border-blue-500/50 shadow-xl shadow-blue-500/20 hover:scale-105' 
                        : 'border-white/10 hover:border-blue-500/30 hover:scale-105'
                  }`}
                >
                  {(tier.popular || isSelected) && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {isSelected ? 'Recommended for You' : 'Most Popular'}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className={`p-4 bg-€{tier.color}-500/20 rounded-lg w-fit mx-auto mb-4`}>
                      <tier.icon className={`w-8 h-8 text-€{tier.color}-400`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <p className="text-slate-400 text-sm mb-2">{tier.description}</p>
                    <div className="text-blue-400 font-medium text-sm mb-6">{tier.assetRange}</div>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-white">
                          €{billingPeriod === 'monthly' ? tier.price.monthly.toLocaleString() : Math.round(tier.price.annual / 12).toLocaleString()}
                        </span>
                        <span className="text-slate-400">/month</span>
                      </div>
                      {billingPeriod === 'annual' && (
                        <div className="text-blue-400 text-sm mt-2">
                          Save €{savings.savings.toLocaleString()}/year ({savings.percentage}% off)
                        </div>
                      )}
                      
                      {/* Banking Value Messaging */}
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
                      className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 €{
                        tier.popular || isSelected
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      Start Banking Trial
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Banking-Specific Features */}
                    <div className="text-blue-400 font-medium mb-3">Banking-Specific Features:</div>
                    {tier.bankingSpecific.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Building className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {/* General Features */}
                    <div className="text-white font-medium mt-6 mb-3">Platform Features:</div>
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className={`w-4 h-4 text-€{tier.color}-400 mt-0.5 flex-shrink-0`} />
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
          
          {/* Banking Add-ons */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">Banking Add-On Services</h2>
              <p className="text-slate-300 max-w-3xl mx-auto">
                Extend your banking compliance automation with specialized services for unique regulatory requirements.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bankingAddOns.map((addon, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">{addon.name}</h3>
                  </div>
                  <div className="text-2xl font-bold text-blue-400 mb-2">
                    €{addon.price.toLocaleString()}
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{addon.description}</p>
                  <button className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-medium transition-colors">
                    Add to Banking Plan
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Banking Value Propositions */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">Why Banks Choose Velocity</h2>
              <p className="text-slate-300 max-w-3xl mx-auto">
                The only compliance automation platform built specifically for financial institutions
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {bankingValueProps.map((prop, index) => {
                const Icon = prop.icon;
                return (
                  <div key={index} className={`bg-gradient-to-br from-€{prop.color}-500/10 to-€{prop.color}-600/10 rounded-2xl p-6 border border-€{prop.color}-500/20`}>
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-€{prop.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`w-6 h-6 text-€{prop.color}-400`} />
                      </div>
                      <h3 className="font-bold text-white mb-3">{prop.title}</h3>
                      <p className="text-slate-300 text-sm">{prop.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ROI Calculator Preview */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 rounded-2xl p-8 border border-blue-500/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4 font-serif">Banking ROI Calculator</h2>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  See your potential savings compared to traditional banking compliance approaches
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-white/5 rounded-xl">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">75%</div>
                  <div className="text-slate-300 text-sm">Average Cost Reduction</div>
                  <div className="text-xs text-slate-400 mt-1">vs Traditional Banking Solutions</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-xl">
                  <div className="text-3xl font-bold text-blue-400 mb-2">6 Weeks</div>
                  <div className="text-slate-300 text-sm">Implementation Time</div>
                  <div className="text-xs text-slate-400 mt-1">vs 6-18 months traditional</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-xl">
                  <div className="text-3xl font-bold text-purple-400 mb-2">€2.1M</div>
                  <div className="text-slate-300 text-sm">3-Year Savings</div>
                  <div className="text-xs text-slate-400 mt-1">Regional bank average</div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <button
                  onClick={() => navigate('/calculators/banking-roi')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-emerald-600 transition-all"
                >
                  <Target className="w-5 h-5" />
                  Calculate Your Banking ROI
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-blue-500/20">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Ready to Transform Your Banking Compliance?
            </h2>
            <p className="text-slate-300 mb-8 max-w-3xl mx-auto">
              Join leading financial institutions using Velocity for automated compliance. 
              Start with a 30-day free trial designed specifically for banks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Building className="w-5 h-5" />
                Start Banking Trial
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/demo/banking-compliance')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Shield className="w-5 h-5" />
                Banking Demo
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-400 max-w-2xl mx-auto">
              <div>✓ 30-day free trial</div>
              <div>✓ Banking compliance experts</div>
              <div>✓ Core banking integration</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialServicesPricing;