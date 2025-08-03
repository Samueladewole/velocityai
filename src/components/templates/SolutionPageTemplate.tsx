import React from 'react';
import { PublicHeader } from '../common/PublicHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, TrendingUp, Shield, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SolutionPageTemplateProps {
  framework: {
    name: string;
    description: string;
    color: string;
    iconColor: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  aiAgents: Array<{
    title: string;
    description: string;
    capabilities: string[];
  }>;
  benefits: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
  industries?: Array<{
    name: string;
    painPoints: string[];
    solutions: string[];
    pricing: string;
  }>;
  pricingTiers?: Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
    targetAudience: string;
  }>;
}

export const SolutionPageTemplate: React.FC<SolutionPageTemplateProps> = ({
  framework,
  hero,
  aiAgents,
  benefits,
  industries,
  pricingTiers,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link to="/velocity/solutions" className="hover:text-gray-900">Solutions</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{framework.name}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className={`py-20 ${framework.color}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6">{hero.title}</h1>
            <p className="text-2xl text-white/90 mb-8">{hero.subtitle}</p>
            <p className="text-lg text-white/80 mb-12">{hero.description}</p>
            <div className="flex gap-4 justify-center">
              <Button variant="default" size="lg">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">AI-Powered {framework.name} Agents</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiAgents.map((agent, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-8">
                <div className={`w-12 h-12 rounded-lg ${framework.iconColor} flex items-center justify-center mb-6`}>
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{agent.title}</h3>
                <p className="text-gray-600 mb-6">{agent.description}</p>
                <ul className="space-y-3">
                  {agent.capabilities.map((capability, capIndex) => (
                    <li key={capIndex} className="flex items-start">
                      <CheckCircle className={`w-5 h-5 ${framework.iconColor.replace('bg-', 'text-')} mr-3 flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-700">{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry-Specific Solutions */}
      {industries && industries.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">Industry-Specific Solutions</h2>
            <div className="grid md:grid-cols-2 gap-12">
              {industries.map((industry, index) => (
                <div key={index} className="bg-white rounded-lg p-8 shadow-lg">
                  <h3 className="text-2xl font-bold mb-6">{industry.name}</h3>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Pain Points:</h4>
                    <ul className="space-y-2">
                      {industry.painPoints.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Our Solutions:</h4>
                    <ul className="space-y-2">
                      {industry.solutions.map((solution, solIndex) => (
                        <li key={solIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mt-6">
                    <p className="text-sm text-gray-600">Starting at</p>
                    <p className="text-2xl font-bold text-gray-900">{industry.pricing}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Tiers */}
      {pricingTiers && pricingTiers.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">Choose Your Solution Tier</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pricingTiers.map((tier, index) => (
                <div key={index} className={`rounded-lg border-2 p-8 ${index === 2 ? 'border-blue-500 shadow-xl' : 'border-gray-200'}`}>
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-3xl font-bold mb-4">{tier.price}</p>
                  <p className="text-gray-600 mb-6">{tier.description}</p>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featIndex) => (
                      <li key={featIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500 italic">{tier.targetAudience}</p>
                  <Button variant={index === 2 ? 'default' : 'outline'} className="w-full mt-6">
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Velocity for {framework.name}?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 rounded-full ${framework.iconColor} flex items-center justify-center mx-auto mb-6`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${framework.color}`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your {framework.name} Compliance?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of companies using Velocity's AI agents to automate compliance and reduce costs by 80%.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="default" size="lg">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* ROI Calculator Prompt */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600 mb-4">Want to see your potential savings?</p>
          <Link to="/calculators/banking-roi" className="text-blue-600 hover:text-blue-700 font-medium">
            Try our ROI Calculator →
          </Link>
        </div>
      </section>
    </div>
  );
};