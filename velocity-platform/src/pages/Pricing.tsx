import React from 'react';
import { Check, X, ArrowRight, Zap, Shield, Building2, Sparkles, Bot, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CurrencySelector } from '@/components/CurrencySelector';
import { PublicHeader } from '@/components/common/PublicHeader';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { formatAmount, convertFrom } = useCurrency();

  // Define base prices in USD
  const basePrices = {
    starter: 897,
    professional: 2397,
    enterprise: 5897
  };

  const plans = [
    {
      name: 'Starter',
      price: formatAmount(basePrices.starter),
      period: '/month',
      description: 'Essential compliance automation for growing organizations',
      icon: Bot,
      color: 'blue',
      agentCount: '5 AI Agents',
      features: [
        '5 Core AI Agents included',
        'Basic GDPR Transfer Compliance',
        'AWS/GCP/Azure evidence collection',
        'Standard document generation',
        'Trust Score calculation',
        'Email support',
        'Up to 3 users',
        'Monthly compliance reports',
        'Basic API access'
      ],
      notIncluded: [
        'Advanced automation agents',
        'Real-time monitoring',
        'Custom integrations',
        'White-label options'
      ]
    },
    {
      name: 'Professional',
      price: formatAmount(basePrices.professional),
      period: '/month',
      description: 'Complete compliance automation for international organizations',
      icon: Globe,
      color: 'purple',
      popular: true,
      agentCount: '13 AI Agents',
      features: [
        'All 13 AI Agents included',
        'Complete International Transfer Compliance',
        'Multi-cloud evidence automation',
        'Advanced document generation',
        'Real-time trust score updates',
        'Priority support & training',
        'Up to 15 users',
        'Weekly compliance reports',
        'Full API & WebSocket access',
        'Custom adequacy monitoring',
        'SCC management automation'
      ],
      notIncluded: [
        'White-label platform',
        'Dedicated success manager'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'Fully customized platform for large multinational organizations',
      icon: Building2,
      color: 'slate',
      agentCount: '13+ AI Agents',
      features: [
        'Everything in Professional, plus:',
        'Unlimited users & organizations',
        'Custom AI agent development',
        'White-label platform branding',
        'Dedicated Customer Success Manager',
        'Daily compliance monitoring',
        'Advanced analytics & reporting',
        'SLA guarantees (99.9% uptime)',
        'On-premise deployment options',
        'Custom integrations & APIs',
        'Executive compliance dashboards',
        'Regulatory update notifications'
      ],
      notIncluded: []
    }
  ];

  const allFeatures = [
    { category: 'AI Agents & Automation', features: [
      { name: 'Total AI Agents included', starter: '5 Agents', professional: '13 Agents', enterprise: '13+ Agents' },
      { name: 'International Transfer Compliance', starter: 'Basic', professional: 'Complete', enterprise: 'Advanced' },
      { name: 'Multi-cloud evidence collection', starter: true, professional: true, enterprise: true },
      { name: 'Document generation automation', starter: 'Standard', professional: 'Advanced', enterprise: 'Custom' },
      { name: 'Real-time compliance monitoring', starter: false, professional: true, enterprise: true }
    ]},
    { category: 'GDPR Transfer Features', features: [
      { name: 'Transfer Impact Assessments (TIA)', starter: 'Templates', professional: 'Automated', enterprise: 'AI-Generated' },
      { name: 'Adequacy decision monitoring', starter: false, professional: true, enterprise: true },
      { name: 'Standard Contractual Clauses (SCC)', starter: 'Basic', professional: 'Automated', enterprise: 'Custom' },
      { name: 'Binding Corporate Rules (BCR)', starter: false, professional: true, enterprise: true },
      { name: 'Technical safeguards validation', starter: false, professional: true, enterprise: true }
    ]},
    { category: 'Cloud Platform Integration', features: [
      { name: 'AWS evidence collection', starter: true, professional: true, enterprise: true },
      { name: 'Google Cloud Platform scanning', starter: true, professional: true, enterprise: true },
      { name: 'Microsoft Azure monitoring', starter: true, professional: true, enterprise: true },
      { name: 'Multi-cloud compliance reports', starter: 'Monthly', professional: 'Weekly', enterprise: 'Daily' },
      { name: 'Custom cloud integrations', starter: false, professional: false, enterprise: true }
    ]},
    { category: 'Trust & Security', features: [
      { name: 'Trust Score calculation', starter: 'Basic', professional: 'Advanced', enterprise: 'Real-time' },
      { name: 'Cryptographic verification', starter: false, professional: true, enterprise: true },
      { name: 'Observability & monitoring', starter: false, professional: true, enterprise: true },
      { name: 'Continuous compliance scanning', starter: false, professional: true, enterprise: true },
      { name: 'Risk quantification & scoring', starter: false, professional: true, enterprise: true }
    ]},
    { category: 'Support & Success', features: [
      { name: 'Support channels', starter: 'Email', professional: 'Priority', enterprise: 'Dedicated CSM' },
      { name: 'Implementation onboarding', starter: 'Self-service', professional: 'Guided', enterprise: 'White-glove' },
      { name: 'Training & certification', starter: 'Documentation', professional: 'Live sessions', enterprise: 'Custom program' },
      { name: 'SLA guarantees', starter: 'Best effort', professional: '99.5%', enterprise: '99.9%' }
    ]}
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <CurrencySelector />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              AI-Powered Compliance Automation Pricing
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Scale your international transfer compliance with our 13 AI agents. 
              From essential automation to enterprise-grade customization.
            </p>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-600" />
                <span>13 AI Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span>GDPR Transfer Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Multi-Cloud Evidence</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative p-8 €{plan.popular ? 'border-purple-500 shadow-xl scale-105' : 'border-slate-200'}`}
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
                  <div className="text-xs font-medium text-purple-600 bg-purple-50 rounded-full px-3 py-1 mb-3 inline-block">
                    {plan.agentCount}
                  </div>
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
                  onClick={() => navigate(plan.name === 'Enterprise' ? '/company/contact' : '/app/signup')}
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
                    <th className="text-center py-4 px-4 font-semibold">Professional</th>
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
                            {typeof feature.professional === 'boolean' ? (
                              feature.professional ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-slate-300 mx-auto" />
                            ) : (
                              <span className="text-sm font-medium">{feature.professional}</span>
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
                <h3 className="text-lg font-semibold mb-2">How many AI agents are included in each plan?</h3>
                <p className="text-slate-600">
                  Starter includes 5 core AI agents, Professional includes all 13 AI agents, and Enterprise includes 13+ agents with custom development options.
                </p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Do you offer a free trial?</h3>
                <p className="text-slate-600">
                  Yes, we offer a 14-day free trial for all plans with full access to AI agents. No credit card required to start.
                </p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">What cloud platforms do you support?</h3>
                <p className="text-slate-600">
                  We support AWS, Google Cloud Platform, and Microsoft Azure with automated evidence collection and compliance monitoring across all three platforms.
                </p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">How does GDPR transfer compliance work?</h3>
                <p className="text-slate-600">
                  Our AI agents automatically generate Transfer Impact Assessments, monitor adequacy decisions, manage Standard Contractual Clauses, and validate technical safeguards in real-time.
                </p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
                <p className="text-slate-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle, and you get immediate access to additional AI agents.
                </p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-slate-600">
                  We accept all major credit cards, bank transfers, and can arrange annual invoicing for Enterprise customers with NET 30 terms.
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
            Ready to Automate Your International Transfer Compliance?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join organizations using Velocity AI Platform to achieve GDPR transfer compliance in hours, not weeks
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-blue-200">Automation Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">€120K</div>
              <div className="text-sm text-blue-200">Average Annual Savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2 Hours</div>
              <div className="text-sm text-blue-200">Time to Compliance</div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/app/signup')}
            >
              Start Free Trial - 13 AI Agents
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