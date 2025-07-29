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
  Star,
  Play,
  Cloud,
  Bot,
  FileCheck,
  BarChart3,
  Globe,
  Lock,
  ChevronRight,
  CreditCard
} from 'lucide-react';
<<<<<<< HEAD
import { Button } from '@/components/ui/button';
=======
import VelocityFooter from './VelocityFooter';
>>>>>>> 07499f1e9c0f114279bedfc699fcc73e95455792

const VelocityLanding: React.FC = () => {
  const navigate = useNavigate();
  
  // Check if we're in subdomain mode or main app
  const isSubdomain = window.location.hostname.includes('velocity.') || 
                     (window.location.hostname === 'localhost' && window.location.pathname.startsWith('/velocity'));
  const routePrefix = isSubdomain ? '' : '/velocity';

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
      description: "From signup to first evidence collection in under 30 minutes",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Award,
      title: "22+ Point Trust Score Boost",
      description: "Average Trust Score improvement in first 30 days of usage",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: DollarSign,
      title: "$15,500 Cost Savings",
      description: "Average cost reduction from automated compliance processes",
      color: "from-orange-500 to-red-600"
    }
  ];

  const integrations = [
    { name: 'AWS', logo: '🌩️', description: 'Complete AWS infrastructure monitoring' },
    { name: 'Google Cloud', logo: '☁️', description: 'GCP security and compliance automation' },
    { name: 'Microsoft Azure', logo: '🌐', description: 'Azure resource compliance tracking' },
    { name: 'GitHub', logo: '🐙', description: 'Code security and policy enforcement' },
    { name: 'Google Workspace', logo: '📊', description: 'Workspace security monitoring' },
    { name: 'Slack', logo: '💬', description: 'Communication compliance tracking' },
  ];

  const frameworks = [
    { name: 'SOC 2 Type II', controls: '64 Controls', icon: Shield },
    { name: 'ISO 27001', controls: '114 Controls', icon: Lock },
    { name: 'CIS Controls v8.1', controls: '153 Controls', icon: Award },
    { name: 'GDPR', controls: '47 Controls', icon: Globe },
    { name: 'HIPAA', controls: '42 Controls', icon: FileCheck },
    { name: 'PCI DSS', controls: '78 Controls', icon: CreditCard },
  ];

  const tiers = [
    {
      name: "Starter",
      price: 249,
      description: "Perfect for growing companies",
      features: [
        "5 team members",
        "10 compliance frameworks",
        "500 evidence items/month",
        "Basic integrations",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Growth",
      price: 549,
      description: "Most popular for mid-market",
      features: [
        "20 team members",
        "25 compliance frameworks",
        "2,000 evidence items/month",
        "All integrations",
        "Priority support",
        "API access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: 1249,
      description: "For large organizations",
      features: [
        "Unlimited team members",
        "Unlimited frameworks",
        "10,000 evidence items/month",
        "White-label options",
        "Dedicated success manager",
        "Custom integrations"
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      quote: "Velocity reduced our SOC 2 prep time from 6 months to 3 weeks. The AI agents work around the clock collecting evidence.",
      author: "Sarah Chen",
      company: "TechFlow (Series B)",
      rating: 5
    },
    {
      quote: "Our Trust Score jumped 28 points in the first month. The automated evidence collection is incredibly thorough.",
      author: "Marcus Rodriguez",
      company: "DataVault (Scale-up)",
      rating: 5
    }
  ];

  const stats = [
    { value: '500+', label: 'Companies Trust Velocity' },
    { value: '95%', label: 'Automation Rate' },
    { value: '30min', label: 'Average Setup Time' },
    { value: '22pts', label: 'Avg Trust Score Boost' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              AI-Powered
              <span className="bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent"> Compliance </span>
              Automation
            </h1>
            <p className="text-xl lg:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Transform quarterly manual compliance into continuous AI monitoring. 
              95% automation, 30-minute setup, 22+ point Trust Score improvement.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                onClick={() => navigate(`${routePrefix}/signup`)}
                className="bg-white text-purple-800 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                size="lg"
              >
                <Clock className="w-5 h-5 mr-2" />
                Start 30-Min Setup
              </Button>
              <Button
                onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-800 px-8 py-4 text-lg font-semibold rounded-lg transition-all"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-purple-200 text-sm lg:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Velocity?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The only AI-native compliance platform that eliminates manual work while improving accuracy and coverage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Connect Your Entire Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Velocity integrates with 50+ platforms to provide comprehensive compliance coverage across your infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="text-3xl">{integration.logo}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate(`${routePrefix}/integrations`)}
              variant="outline"
              className="px-8 py-3"
            >
              View All Integrations <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Frameworks Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Compliance Frameworks Supported
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive coverage for all major compliance standards with automated evidence collection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frameworks.map((framework, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <framework.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                    <p className="text-sm text-gray-600">{framework.controls}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Automation Coverage</span>
                    <span className="font-medium text-purple-600">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No hidden fees. Cancel anytime. All plans include our core AI automation features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 ${
                tier.popular ? 'ring-2 ring-purple-600 relative' : ''
              }`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 mb-4">{tier.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => navigate(`${routePrefix}/signup?plan=${tier.name.toLowerCase()}`)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    tier.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Start Free Trial
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Companies
            </h2>
            <p className="text-xl text-gray-600">See what our customers are saying about Velocity</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-purple-600">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Compliance?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join 500+ companies automating their compliance with AI. Start collecting evidence in under 30 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate(`${routePrefix}/signup`)}
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-colors shadow-lg"
              size="lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button
              onClick={() => navigate(`${routePrefix}/contact`)}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-lg transition-colors"
              size="lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Talk to Sales
            </Button>
          </div>

          <p className="text-purple-200 text-sm mt-6">
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <VelocityFooter />
    </div>
  );
};

export default VelocityLanding;