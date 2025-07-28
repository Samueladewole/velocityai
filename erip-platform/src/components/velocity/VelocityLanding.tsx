import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Clock, 
  Network, 
  ArrowRight, 
  CheckCircle, 
  DollarSign,
  Users,
  Award,
  TrendingUp,
  Shield,
  Target,
  Star
} from 'lucide-react';
import VelocityFooter from './VelocityFooter';

const VelocityLanding: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "95% Automation",
      description: "AI agents automatically collect compliance evidence across cloud platforms",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Clock,
      title: "30-Minute Setup",
      description: "From signup to Trust Score in under 30 minutes with guided onboarding",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Award,
      title: "3x Trust Points",
      description: "AI-collected evidence receives 3x multiplier in Trust Score calculation",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Network,
      title: "Real-time Sync",
      description: "Seamless integration with Trust Equity, Compass, and Atlas",
      color: "from-orange-500 to-red-600"
    }
  ];

  const tiers = [
    {
      name: "Starter",
      price: "$999",
      period: "/month",
      description: "Perfect for AI startups getting started with compliance",
      features: [
        "Up to 5 users",
        "2 frameworks (SOC2, GDPR)",
        "1,000 evidence items",
        "Basic monitoring",
        "Email support"
      ],
      color: "from-purple-500 to-purple-600",
      popular: false
    },
    {
      name: "Growth",
      price: "$2,499",
      period: "/month",
      description: "Ideal for scaling AI companies with multiple frameworks",
      features: [
        "Up to 15 users",
        "4 frameworks",
        "5,000 evidence items",
        "Advanced monitoring",
        "Priority support"
      ],
      color: "from-blue-500 to-blue-600",
      popular: true
    },
    {
      name: "Scale",
      price: "$4,999",
      period: "/month",
      description: "Enterprise-grade for mature AI companies",
      features: [
        "Unlimited users",
        "All frameworks",
        "50,000 evidence items",
        "24/7 monitoring",
        "Dedicated CSM"
      ],
      color: "from-green-500 to-green-600",
      popular: false
    }
  ];

  const testimonials = [
    {
      company: "AI Startup Inc.",
      quote: "Velocity Tier got us SOC2 compliant in 3 weeks instead of 6 months",
      author: "Sarah Chen, CTO",
      rating: 5
    },
    {
      company: "DataFlow AI",
      quote: "The AI agents saved us 400+ hours of manual evidence collection",
      author: "Mike Rodriguez, Security Lead",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              AI Agents & Velocity Tier
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                95% Compliance
              </span>
              <br />
              Automation in 30 Minutes
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              AI-powered compliance automation designed for fast-growing AI startups. 
              Get SOC2, ISO27001, and GDPR ready with automated evidence collection and 3x Trust Points.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => navigate('/velocity/onboarding')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Clock className="w-5 h-5" />
                Start 30-Min Onboarding
              </button>
              <button
                onClick={() => navigate('/velocity/pricing')}
                className="bg-white text-purple-600 border-2 border-purple-200 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                View Pricing
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-gray-600">Automation Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">30min</div>
                <div className="text-sm text-gray-600">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">3x</div>
                <div className="text-sm text-gray-600">Trust Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">24/7</div>
                <div className="text-sm text-gray-600">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Fast-Growing AI Companies
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to achieve compliance without slowing down innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Velocity Tier Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Transparent pricing designed for AI startups and fast-growing companies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl shadow-lg border-2 p-8 relative ${
                  tier.popular ? 'border-blue-500 transform scale-105' : 'border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600 ml-1">{tier.period}</span>
                  </div>
                  <p className="text-gray-600">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/velocity/pricing')}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    tier.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading AI Companies
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600 text-sm">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Accelerate Your Compliance?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join leading AI companies using ERIP Velocity Tier for automated compliance
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/velocity/onboarding')}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/velocity/dashboard')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Target className="w-5 h-5" />
              View Demo
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <VelocityFooter />
    </div>
  );
};

export default VelocityLanding;