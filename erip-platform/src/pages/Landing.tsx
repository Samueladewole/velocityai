import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  TrendingUp, 
  Zap, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Clock,
  Globe,
  Building,
  Award,
  Eye,
  Brain,
  Lock,
  Activity,
  Target
} from 'lucide-react';

const features = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: "COMPASS Regulatory Intelligence",
    subtitle: "Understand what you need to do",
    description: "AI-powered regulation analysis with Claude Sonnet 4. Dynamic compliance tracking across ISO 27001, SOC 2, GDPR, NIS2, AI Act, and CRA.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "ATLAS Security Assessment",
    subtitle: "Take effective action",
    description: "Intelligent assessment workflows with multi-source integration. AI-powered gap analysis and remediation with comprehensive security tools.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "PRISM Risk Quantification",
    subtitle: "Quantify financial impact and ROI",
    description: "FAIR methodology implementation with Monte Carlo simulations. Transform risk into monetary terms executives understand.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Activity className="h-8 w-8" />,
    title: "PULSE Continuous Monitoring",
    subtitle: "Stay ahead of emerging risks",
    description: "Real-time risk monitoring with predictive analytics. Automated alerting with business context and compliance drift detection.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: <Lock className="h-8 w-8" />,
    title: "CIPHER Policy Automation",
    subtitle: "Automate governance and policy management",
    description: "AI-powered policy generation from requirements. Infrastructure-as-Code integration with continuous compliance validation.",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "NEXUS Intelligence Platform",
    subtitle: "Leverage collective intelligence",
    description: "Threat intelligence integration with industry benchmarking. Academic research from Semantic Scholar and regulatory forecasting.",
    color: "from-teal-500 to-blue-500"
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "BEACON Value Demonstration",
    subtitle: "Prove and communicate business value",
    description: "ROI measurement and business impact reporting. Maturity assessment with benchmark comparisons and success story generation.",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "CLEARANCE Strategic Risk Platform",
    subtitle: "Transform cyber risks into business decisions",
    description: "Convert cyber findings to financial impact. Risk vs. opportunity analysis with approval authority routing. Eliminate 'Department of No'.",
    color: "from-rose-500 to-pink-500"
  }
];

const stats = [
  { value: "80%", label: "Compliance Research Time Saved", icon: <Clock className="h-5 w-5" /> },
  { value: "10x", label: "ROI Within 12 Months", icon: <TrendingUp className="h-5 w-5" /> },
  { value: "95%+", label: "AI Accuracy Rate", icon: <Brain className="h-5 w-5" /> },
  { value: "70%", label: "Manual Effort Reduction", icon: <Zap className="h-5 w-5" /> }
];

const testimonials = [
  {
    quote: "ERIP transformed our risk management approach. The AI-powered insights saved us millions in potential losses.",
    author: "Sarah Chen",
    title: "Chief Risk Officer",
    company: "Fortune 500 Financial Services",
    rating: 5
  },
  {
    quote: "The regulatory intelligence alone is worth the investment. We're always ahead of compliance requirements.",
    author: "Michael Rodriguez",
    title: "Head of Compliance",
    company: "Global Manufacturing Corp",
    rating: 5
  },
  {
    quote: "Real-time monitoring and predictive analytics have revolutionized our operational risk management.",
    author: "Dr. Emily Watson",
    title: "VP of Risk Strategy",
    company: "Healthcare Innovation Inc",
    rating: 5
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$2,999",
    period: "per month",
    description: "Perfect for Series A/B companies",
    features: [
      "COMPASS, ATLAS, PRISM components",
      "Up to 3 cloud accounts",
      "Basic frameworks (SOC 2, ISO 27001)",
      "Hybrid AI (Claude Haiku + Open Source)",
      "Monthly reporting",
      "Email support"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "$7,999",
    period: "per month", 
    description: "For growth companies",
    features: [
      "All 8 components including CLEARANCE",
      "Unlimited cloud accounts",
      "All compliance frameworks",
      "Full hybrid AI (All Claude models)",
      "Expert network access",
      "Real-time monitoring",
      "Priority support"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$19,999+",
    period: "per month",
    description: "For large enterprises",
    features: [
      "Platform + Custom development",
      "Self-hosted AI models",
      "Custom integrations",
      "Dedicated success manager",
      "White-label options",
      "SLA guarantees",
      "On-premises deployment"
    ],
    popular: false
  }
];

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">ERIP</h1>
                <p className="text-xs text-slate-500 font-medium -mt-1">Enterprise Risk Intelligence</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium">Pricing</a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 font-medium">Testimonials</a>
              <Link to="/app">
                <Button variant="outline" size="sm">View Dashboard</Button>
              </Link>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="premium" className="mb-4">
              🚀 Complete Enterprise Risk Intelligence Ecosystem
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              The Future of
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent block">
                Enterprise Risk Intelligence
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A comprehensive AI-powered ecosystem that transforms enterprise risk management from reactive compliance to strategic business advantage. 
              The world's first platform that integrates regulatory intelligence, risk quantification, and strategic decision automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="xl" className="shadow-xl shadow-blue-600/25">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/app">
                <Button variant="outline" size="xl">
                  <Eye className="mr-2 h-5 w-5" />
                  View Live Demo
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="info" className="mb-4">Platform Capabilities</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Eight Powerful Components,
              <span className="text-blue-600"> One Intelligence Platform</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From regulatory intelligence to strategic risk clearance - a comprehensive ecosystem that delivers unprecedented business value through AI-powered decision intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900 leading-tight">{feature.title}</CardTitle>
                  <p className="text-sm font-medium text-blue-600 italic">{feature.subtitle}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-slate-600 leading-relaxed text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="success" className="mb-4">Customer Success</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join hundreds of enterprises who've transformed their risk management with ERIP.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-slate-700 mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.author}</div>
                    <div className="text-sm text-slate-500">{testimonial.title}</div>
                    <div className="text-sm text-blue-600 font-medium">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="warning" className="mb-4">Flexible Pricing</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Scale with Your Business
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From growing enterprises to global corporations, we have a plan that fits your risk management needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="premium" className="px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-600 mb-4">{plan.description}</CardDescription>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500 ml-2">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Risk into Strategic Advantage?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join the enterprises transforming from reactive compliance to proactive risk intelligence. 
            Experience the complete ecosystem that turns cyber risk into executive decision intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="secondary" className="shadow-xl">
              Start Free 30-Day Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-700">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">ERIP</h3>
                  <p className="text-xs text-slate-400">Enterprise Risk Intelligence</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                The world's most advanced risk intelligence platform, trusted by enterprises globally.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">© 2024 ERIP. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};