import React from 'react';
import { Check, X, ArrowRight, Zap, Shield, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CurrencySelector } from '@/components/CurrencySelector';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { formatAmount, convertFrom } = useCurrency();

  // Define base prices in USD
  const basePrices = {
    starter: 550,
    growth: 1650,
    enterprise: 4400
  };

  const plans = [
    {
      name: 'Starter',
      price: formatAmount(basePrices.starter),
      period: '/month',
      description: 'Perfect for growing companies establishing their trust foundation',
      icon: Zap,
      color: 'blue',
      features: [
        'Up to 50 security questionnaires/year',
        'Basic Trust Score calculation',
        '3 compliance frameworks',
        'Email support',
        '1 user account',
        'Monthly security scans',
        'Basic API access'
      ],
      notIncluded: [
        'AI-powered automation',
        'Custom frameworks',
        'White-label options',
        'Dedicated success manager'
      ]
    },
    {
      name: 'Growth',
      price: formatAmount(basePrices.growth),
      period: '/month',
      description: 'For scaling companies accelerating sales with trust transparency',
      icon: Shield,
      color: 'purple',
      popular: true,
      features: [
        'Unlimited security questionnaires',
        'Advanced Trust Score with sharing',
        '10+ compliance frameworks',
        'Priority support',
        '5 user accounts',
        'Weekly security scans',
        'Full API access',
        'AI-powered automation',
        'Custom branding'
      ],
      notIncluded: [
        'Custom framework development',
        'Dedicated success manager'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'Comprehensive platform for large organizations with complex needs',
      icon: Building2,
      color: 'slate',
      features: [
        'Everything in Growth, plus:',
        'Unlimited users',
        'Custom compliance frameworks',
        'White-label platform',
        'Dedicated success manager',
        'Daily security scans',
        'Advanced analytics',
        'SLA guarantees',
        'On-premise deployment option',
        'Custom integrations',
        'Executive reporting'
      ],
      notIncluded: []
    }
  ];

  const allFeatures = [
    { category: 'Core Platform', features: [
      { name: 'Security questionnaire automation', starter: true, growth: true, enterprise: true },
      { name: 'Trust Score calculation', starter: true, growth: true, enterprise: true },
      { name: 'Compliance framework library', starter: '3', growth: '10+', enterprise: 'Unlimited' },
      { name: 'Evidence repository', starter: true, growth: true, enterprise: true }
    ]},
    { category: 'Automation & AI', features: [
      { name: 'AI-powered responses', starter: false, growth: true, enterprise: true },
      { name: 'Smart evidence matching', starter: false, growth: true, enterprise: true },
      { name: 'Automated gap analysis', starter: false, growth: true, enterprise: true },
      { name: 'Custom AI training', starter: false, growth: false, enterprise: true }
    ]},
    { category: 'Security & Monitoring', features: [
      { name: 'Cloud security scanning', starter: 'Monthly', growth: 'Weekly', enterprise: 'Daily' },
      { name: 'Vulnerability assessment', starter: true, growth: true, enterprise: true },
      { name: 'Risk quantification', starter: false, growth: true, enterprise: true },
      { name: 'Real-time monitoring', starter: false, growth: false, enterprise: true }
    ]},
    { category: 'Support & Success', features: [
      { name: 'Support channels', starter: 'Email', growth: 'Priority', enterprise: 'Dedicated' },
      { name: 'Onboarding', starter: 'Self-service', growth: 'Guided', enterprise: 'White-glove' },
      { name: 'Success manager', starter: false, growth: false, enterprise: true },
      { name: 'Custom training', starter: false, growth: false, enterprise: true }
    ]}
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <CurrencySelector />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the plan that fits your trust journey. Scale up anytime as your needs grow.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative p-8 ${plan.popular ? 'border-purple-500 shadow-xl scale-105' : 'border-slate-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-${plan.color}-100 mb-4`}>
                    <plan.icon className={`h-6 w-6 text-${plan.color}-600`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-3">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-slate-600">{plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-600">{plan.description}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 opacity-50">
                      <X className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-500 line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full ${plan.popular ? 'erip-gradient-primary' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => navigate(plan.name === 'Enterprise' ? '/company/contact' : '/demo')}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Detailed Feature Comparison
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-4 font-semibold">Features</th>
                    <th className="text-center py-4 px-4 font-semibold">Starter</th>
                    <th className="text-center py-4 px-4 font-semibold">Growth</th>
                    <th className="text-center py-4 px-4 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((category, catIdx) => (
                    <React.Fragment key={catIdx}>
                      <tr className="bg-slate-50">
                        <td colSpan={4} className="py-3 px-4 font-semibold text-slate-700">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featIdx) => (
                        <tr key={featIdx} className="border-b border-slate-100">
                          <td className="py-3 px-4 text-sm">{feature.name}</td>
                          <td className="text-center py-3 px-4">
                            {typeof feature.starter === 'boolean' ? (
                              feature.starter ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-slate-300 mx-auto" />
                            ) : (
                              <span className="text-sm font-medium">{feature.starter}</span>
                            )}
                          </td>
                          <td className="text-center py-3 px-4">
                            {typeof feature.growth === 'boolean' ? (
                              feature.growth ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-slate-300 mx-auto" />
                            ) : (
                              <span className="text-sm font-medium">{feature.growth}</span>
                            )}
                          </td>
                          <td className="text-center py-3 px-4">
                            {typeof feature.enterprise === 'boolean' ? (
                              feature.enterprise ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-slate-300 mx-auto" />
                            ) : (
                              <span className="text-sm font-medium">{feature.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
                <p className="text-slate-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.
                </p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Do you offer a free trial?</h3>
                <p className="text-slate-600">
                  Yes, we offer a 14-day free trial for all plans. No credit card required to start.
                </p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-slate-600">
                  We accept all major credit cards, bank transfers, and can arrange annual invoicing for Enterprise customers.
                </p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Is there a setup fee?</h3>
                <p className="text-slate-600">
                  No setup fees for Starter and Growth plans. Enterprise implementations may include professional services.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Build Trust at Scale?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of companies using ERIP to accelerate sales with trust transparency
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/demo')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate('/company/contact')}
            >
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};