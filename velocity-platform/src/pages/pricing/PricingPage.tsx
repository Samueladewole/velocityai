import React from 'react';
import { PublicHeader } from '../../components/common/PublicHeader';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Shield, 
  Users, 
  Building,
  Zap,
  Globe,
  Lock,
  Award,
  ArrowRight,
  Clock,
  Database,
  Cpu
} from 'lucide-react';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const pricingTiers = [
    {
      name: "Starter",
      price: "€12K",
      priceSubtext: "/year",
      description: "Perfect for startups and small businesses beginning their compliance journey",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "1 compliance framework (SOC 2, ISO 27001, GDPR, etc.)",
        "Up to 50 employees",
        "Basic AI automation & evidence collection",
        "Standard integrations (AWS, Azure, GitHub)",
        "Email support",
        "GDPR compliance built-in",
        "EU data residency"
      ],
      cta: "Start Free Trial",
      highlighted: false
    },
    {
      name: "Growth",
      price: "€25K",
      priceSubtext: "/year",
      description: "For growing companies with multiple compliance requirements",
      icon: <Users className="w-6 h-6" />,
      features: [
        "Up to 3 compliance frameworks",
        "Up to 200 employees",
        "Advanced AI agents + predictive analytics",
        "Premium integrations + custom workflows",
        "Priority support + compliance advisor",
        "Risk assessment automation",
        "Multi-framework optimization"
      ],
      cta: "Schedule Demo",
      highlighted: true,
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      priceSubtext: "pricing",
      description: "Tailored solutions for large organizations and complex needs",
      icon: <Building className="w-6 h-6" />,
      features: [
        "Unlimited compliance frameworks",
        "Unlimited employees",
        "Multi-entity/subsidiary management",
        "White-label options",
        "Dedicated CSM + legal advisory",
        "SLA guarantees",
        "Custom integrations"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  const comparisonPoints = [
    {
      feature: "Data Location",
      velocity: "EU-based (GDPR compliant)",
      competitors: "US-based servers"
    },
    {
      feature: "Regulatory Focus",
      velocity: "EU + global frameworks",
      competitors: "US-centric frameworks"
    },
    {
      feature: "Support Hours",
      velocity: "European time zones",
      competitors: "US business hours"
    },
    {
      feature: "Currency",
      velocity: "EUR pricing, no FX risk",
      competitors: "USD pricing only"
    },
    {
      feature: "Compliance Culture",
      velocity: "European compliance expertise",
      competitors: "US enterprise focus"
    }
  ];

  const frameworks = [
    "SOC 2", "ISO 27001", "GDPR", "HIPAA", "PCI DSS", 
    "ISO 27701", "CIS Controls", "NIST", "Basel III"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Enterprise Compliance. Startup Pricing. Zero Complexity.
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              Compliance That Scales
              <span className="text-emerald-400"> With Your Business</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              All compliance frameworks included. No hidden fees. Your data stays in Europe.
              Get enterprise-grade automation at prices built for European businesses.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div 
                key={index} 
                className={`relative bg-white/5 backdrop-blur-sm rounded-2xl border ${
                  tier.highlighted 
                    ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/20' 
                    : 'border-white/10'
                } p-8 hover:bg-white/10 transition-all duration-300 flex flex-col`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-emerald-500 text-white text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-emerald-400">{tier.price}</span>
                      <span className="text-slate-400">{tier.priceSubtext}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-500/20 rounded-lg">
                    {tier.icon}
                  </div>
                </div>
                
                <p className="text-slate-300 mb-6">{tier.description}</p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => tier.cta === 'Contact Sales' 
                    ? navigate('/velocity/contact') 
                    : tier.cta === 'Schedule Demo'
                    ? navigate('/velocity/demo')
                    : navigate('/velocity/assessment')
                  }
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="w-4 h-4 inline-block ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frameworks Included */}
      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              All Compliance Frameworks Included
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Choose any framework with Starter, mix and match with Growth, or get unlimited access with Enterprise
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {frameworks.map((framework, index) => (
              <div 
                key={index} 
                className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-white"
              >
                {framework}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* European Advantage */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Why Leading Companies Choose Velocity
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Superior compliance automation with unmatched data sovereignty and local expertise
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-3 text-center p-4 border-b border-white/10">
              <div className="text-slate-400 font-medium">Feature</div>
              <div className="text-emerald-400 font-bold">Velocity (EU)</div>
              <div className="text-slate-400 font-medium">US Competitors</div>
            </div>
            {comparisonPoints.map((point, index) => (
              <div key={index} className="grid grid-cols-3 text-center p-4 border-b border-white/10 last:border-0">
                <div className="text-white font-medium">{point.feature}</div>
                <div className="text-emerald-300">{point.velocity}</div>
                <div className="text-slate-400">{point.competitors}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Data Sovereignty</h3>
              <p className="text-slate-400">Your compliance data never leaves the EU. Full GDPR compliance built-in.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">45-Day Readiness</h3>
              <p className="text-slate-400">Get audit-ready 4x faster than traditional methods with AI automation.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">98% Pass Rate</h3>
              <p className="text-slate-400">Industry-leading first-attempt audit success with our AI agents.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 rounded-2xl p-12 border border-emerald-500/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Calculate Your ROI
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Most companies save 81% on compliance costs with Velocity. 
              See your potential savings with our interactive calculator.
            </p>
            <button
              onClick={() => navigate('/calculators/banking-roi')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Database className="w-5 h-5" />
              Calculate My Savings
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-emerald-900/50 to-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-serif">
            Ready to Switch to European Compliance?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of European companies who've already made the switch. 
            Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/velocity/demo')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <Cpu className="w-5 h-5" />
              Watch 5-Min Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;