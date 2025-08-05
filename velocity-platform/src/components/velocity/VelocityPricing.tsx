import React, { useState, useEffect } from 'react';
import { Check, Zap, Shield, Target, Award, ChevronRight, Users, Database, Cloud, Headphones } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { PublicHeader, PublicFooter } from './SharedComponents';

interface TierConfig {
  name: string;
  pricing: {
    monthly: number;
    annual: number;
    annual_discount: number;
  };
  limits: {
    users: number | string;
    frameworks: number | string;
    evidence_items: number;
    api_calls: number;
    storage_gb: number;
  };
  support: string[];
  features: string[];
}

interface TierData {
  [key: string]: TierConfig;
}

const VelocityPricing: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [tiers, setTiers] = useState<TierData>({});
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const { formatAmount } = useCurrency();

  // Mock data - replace with API call
  useEffect(() => {
    const mockTiers: TierData = {
      starter: {
        name: "Velocity Starter",
        pricing: {
          monthly: 999,
          annual: 9599,
          annual_discount: 20
        },
        limits: {
          users: 5,
          frameworks: 2,
          evidence_items: 1000,
          api_calls: 10000,
          storage_gb: 100
        },
        support: ['email', 'docs'],
        features: [
          'SOC2 Type I',
          'GDPR basics',
          '95% evidence automation',
          'AI questionnaires',
          'Basic monitoring',
          'Email alerts'
        ]
      },
      growth: {
        name: "Velocity Growth",
        pricing: {
          monthly: 2499,
          annual: 23999,
          annual_discount: 20
        },
        limits: {
          users: 15,
          frameworks: 4,
          evidence_items: 5000,
          api_calls: 50000,
          storage_gb: 500
        },
        support: ['email', 'chat', 'priority'],
        features: [
          'SOC2 Type I & II',
          'ISO 27001',
          'GDPR',
          'HIPAA',
          '95% evidence automation',
          'Advanced monitoring',
          'Real-time alerts',
          'Custom workflows'
        ]
      },
      scale: {
        name: "Velocity Scale",
        pricing: {
          monthly: 4999,
          annual: 47999,
          annual_discount: 20
        },
        limits: {
          users: 'unlimited',
          frameworks: 'all',
          evidence_items: 50000,
          api_calls: 500000,
          storage_gb: 2000
        },
        support: ['email', 'chat', 'phone', 'dedicated'],
        features: [
          'All frameworks',
          'FedRAMP',
          'PCI DSS',
          'AI Act',
          '95% evidence automation',
          '24/7 monitoring',
          'Proactive alerts',
          'Custom integrations',
          'Dedicated CSM',
          'White-glove onboarding'
        ]
      }
    };

    setTiers(mockTiers);
    setLoading(false);
  }, []);

  const handleSelectPlan = async (tierKey: string) => {
    setSelectedTier(tierKey);
    
    // Simulate API call
    console.log(`Selected plan: €{tierKey}, billing: €{billingPeriod}`);
    
    // Would redirect to checkout or open modal
    setTimeout(() => {
      setSelectedTier(null);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return formatAmount(price);
  };

  const getTierIcon = (tierKey: string) => {
    const icons = {
      starter: <Zap className="w-8 h-8 text-purple-600" />,
      growth: <Shield className="w-8 h-8 text-blue-600" />,
      scale: <Target className="w-8 h-8 text-green-600" />
    };
    return icons[tierKey as keyof typeof icons];
  };

  const getTierColor = (tierKey: string) => {
    const colors = {
      starter: 'border-purple-200 hover:border-purple-300',
      growth: 'border-blue-200 hover:border-blue-300 ring-2 ring-blue-500',
      scale: 'border-green-200 hover:border-green-300'
    };
    return colors[tierKey as keyof typeof colors];
  };

  const getButtonColor = (tierKey: string) => {
    const colors = {
      starter: 'bg-purple-600 hover:bg-purple-700',
      growth: 'bg-blue-600 hover:bg-blue-700',
      scale: 'bg-green-600 hover:bg-green-700'
    };
    return colors[tierKey as keyof typeof colors];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ERIP Velocity Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              AI-powered compliance automation for fast-growing companies
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors €{
                  billingPeriod === 'monthly'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors €{
                  billingPeriod === 'annual'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(tiers).map(([tierKey, tier]) => (
            <div
              key={tierKey}
              className={`bg-white rounded-lg shadow-lg border-2 transition-all duration-200 €{getTierColor(tierKey)} €{
                tierKey === 'growth' ? 'transform scale-105' : ''
              }`}
            >
              {tierKey === 'growth' && (
                <div className="bg-blue-600 text-white text-center py-2 rounded-t-lg">
                  <span className="text-sm font-medium">Most Popular</span>
                </div>
              )}
              
              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    {getTierIcon(tierKey)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(
                        billingPeriod === 'monthly' 
                          ? tier.pricing.monthly 
                          : tier.pricing.annual / 12
                      )}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{billingPeriod === 'monthly' ? 'month' : 'month, billed annually'}
                    </span>
                  </div>
                  {billingPeriod === 'annual' && (
                    <div className="text-sm text-green-600 font-medium">
                      Save {formatPrice(tier.pricing.monthly * 12 - tier.pricing.annual)} per year
                    </div>
                  )}
                </div>

                {/* Limits */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-gray-400" />
                    <span>
                      {typeof tier.limits.users === 'number' 
                        ? `Up to €{tier.limits.users} users` 
                        : 'Unlimited users'
                      }
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Shield className="w-5 h-5 mr-3 text-gray-400" />
                    <span>
                      {typeof tier.limits.frameworks === 'number'
                        ? `€{tier.limits.frameworks} frameworks`
                        : 'All frameworks'
                      }
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Database className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{tier.limits.evidence_items.toLocaleString()} evidence items</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Cloud className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{tier.limits.storage_gb}GB storage</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Headphones className="w-5 h-5 mr-3 text-gray-400" />
                    <span>
                      {tier.support.includes('dedicated') 
                        ? 'Dedicated support'
                        : tier.support.includes('phone')
                        ? 'Phone + chat support'
                        : tier.support.includes('chat')
                        ? 'Email + chat support'
                        : 'Email support'
                      }
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(tierKey)}
                  disabled={selectedTier === tierKey}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors €{getButtonColor(tierKey)} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                >
                  {selectedTier === tierKey ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Start Free Trial</span>
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Feature Comparison
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Starter
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Growth
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scale
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Evidence Automation
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Real-time Monitoring
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      Basic
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Custom Integrations
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      Limited
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Dedicated CSM
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade anytime?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade to a higher tier at any time with immediate access to new features. 
                Downgrades take effect at your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens if I exceed my limits?
              </h3>
              <p className="text-gray-600 text-sm">
                We'll notify you when approaching limits and offer easy upgrade options. 
                Small overages are included, larger ones have transparent overage pricing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes! All plans include a 14-day free trial with full access to features. 
                No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How fast is the onboarding?
              </h3>
              <p className="text-gray-600 text-sm">
                Our AI-powered onboarding gets you to your first Trust Score in under 30 minutes. 
                Full compliance readiness typically achieved within the first week.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      </div>
      <PublicFooter />
    </>
  );
};

export default VelocityPricing;