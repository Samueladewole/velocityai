import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  ExternalLink, 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Target, 
  Star,
  BarChart3,
  Brain,
  Award,
  Shield,
  Zap,
  Share2,
  MessageSquare,
  Linkedin,
  Twitter,
  Mail,
  QrCode,
  Eye,
  Download,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const SalesAcceleration: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('trust-score');

  const salesChallenges = [
    {
      icon: Clock,
      title: 'Lengthy security evaluations',
      description: 'Prospects spend weeks evaluating security posture, delaying deals',
      impact: 'Extended Sales Cycles'
    },
    {
      icon: Shield,
      title: 'Trust credibility gap',
      description: 'Difficulty demonstrating security commitment to prospects',
      impact: 'Lost Opportunities'
    },
    {
      icon: MessageSquare,
      title: 'Repetitive questionnaire responses',
      description: 'Sales teams overwhelmed with security questionnaire requests',
      impact: 'Resource Drain'
    },
    {
      icon: BarChart3,
      title: 'No competitive differentiation',
      description: 'Security seen as table stakes, not competitive advantage',
      impact: 'Commodity Pricing'
    }
  ];

  const trustScoreFeatures = [
    {
      name: 'Public Trust Profiles',
      icon: Globe,
      description: 'Shareable URLs showcasing your security posture',
      benefit: 'Instant credibility with prospects'
    },
    {
      name: 'Social Media Integration',
      icon: Share2,
      description: 'LinkedIn, Twitter, Email sharing with analytics',
      benefit: 'Amplified trust demonstration'
    },
    {
      name: 'QR Code Generation',
      icon: QrCode,
      description: 'Mobile-friendly trust score sharing at events',
      benefit: 'Conference and meeting efficiency'
    },
    {
      name: 'Real-time Analytics',
      icon: Eye,
      description: 'Track profile views and engagement metrics',
      benefit: 'Sales intelligence and insights'
    }
  ];

  const salesTeamTestimonials = [
    {
      name: 'Marcus Thompson',
      role: 'VP of Sales',
      company: 'CloudTech Solutions',
      avatar: 'MT',
      quote: "Trust Score sharing cut our security evaluation time from 6 weeks to 2 weeks. We're closing deals 40% faster and at higher margins.",
      metrics: { deals: '+40%', margin: '+25%', time: '-67%' }
    },
    {
      name: 'Sarah Chen',
      role: 'Enterprise Account Executive',
      company: 'DataSecure Inc',
      avatar: 'SC',
      quote: "Prospects now come to demos already convinced of our security. Trust Scores have become our strongest competitive differentiator.",
      metrics: { conversion: '+60%', demos: '+35%', rfp: '+78%' }
    },
    {
      name: 'David Rodriguez',
      role: 'Sales Director',
      company: 'FinTech Innovations',
      avatar: 'DR',
      quote: "The QIE system has transformed our RFP response process. What used to take weeks now takes hours, and our win rate has doubled.",
      metrics: { winRate: '+100%', rfpTime: '-90%', capacity: '+300%' }
    }
  ];

  const salesAccelerationROI = [
    {
      category: 'Shorter Sales Cycles',
      description: 'Faster security evaluation and trust building',
      impact: '40% faster deal closure',
      annualValue: '€680K',
      calculation: '40% cycle reduction × €1.7M avg deal size × 12 deals/year'
    },
    {
      category: 'Premium Pricing',
      description: 'Higher margins through trust differentiation',
      impact: '25% price premium',
      annualValue: '€425K',
      calculation: '25% margin increase × €1.7M avg deal size × 10 deals/year'
    },
    {
      category: 'Increased Win Rate',
      description: 'Higher RFP and proposal success rate',
      impact: '78% RFP success rate',
      annualValue: '€340K',
      calculation: '30% win rate increase × €1.7M avg deal size × 8 additional wins'
    },
    {
      category: 'Sales Team Efficiency',
      description: 'Reduced time on security questionnaires',
      impact: '90% time reduction',
      annualValue: '€180K',
      calculation: '20 hours/week × €150/hour × 52 weeks × 90% reduction × 4 reps'
    }
  ];

  const qieCapabilities = [
    {
      feature: 'Smart Document Processing',
      description: 'PDF, Excel, Word parsing with 95% accuracy',
      timesSaved: '35+ hours per questionnaire'
    },
    {
      feature: 'AI Answer Generation',
      description: 'Context-aware responses with confidence scoring',
      timesSaved: '80% faster response completion'
    },
    {
      feature: 'Evidence Auto-matching',
      description: 'Automatic evidence attachment and validation',
      timesSaved: '90% evidence collection time reduction'
    },
    {
      feature: 'Template Library',
      description: 'Pre-built responses for common questions',
      timesSaved: '60% reusable content across RFPs'
    }
  ];

  const demoSteps = {
    'trust-score': {
      title: 'Trust Score Sharing Demo',
      steps: [
        { step: 1, action: 'Generate shareable Trust Score URL', status: 'complete', time: '2 seconds' },
        { step: 2, action: 'Customize privacy settings and branding', status: 'complete', time: '30 seconds' },
        { step: 3, action: 'Share via LinkedIn/Email/QR code', status: 'complete', time: '10 seconds' },
        { step: 4, action: 'Track prospect engagement analytics', status: 'active', time: 'Real-time' }
      ]
    },
    'qie-processing': {
      title: 'QIE Questionnaire Processing',
      steps: [
        { step: 1, action: 'Upload security questionnaire (PDF/Excel)', status: 'complete', time: '30 seconds' },
        { step: 2, action: 'AI extracts questions and requirements', status: 'complete', time: '2 minutes' },
        { step: 3, action: 'Generate answers with evidence matching', status: 'complete', time: '15 minutes' },
        { step: 4, action: 'Review and export final response', status: 'active', time: '30 minutes' }
      ]
    }
  };

  const competitiveComparison = [
    {
      aspect: 'Trust Demonstration',
      erip: 'Public Trust Scores with real-time validation',
      traditional: 'Static security documents and presentations',
      advantage: '10x more credible'
    },
    {
      aspect: 'Questionnaire Processing',
      erip: 'AI-powered automation with 95% time reduction',
      traditional: 'Manual responses taking 40+ hours each',
      advantage: '20x faster'
    },
    {
      aspect: 'Competitive Differentiation',
      erip: 'Trust Equity as measurable competitive advantage',
      traditional: 'Security as cost center and commodity',
      advantage: '25% premium pricing'
    },
    {
      aspect: 'Sales Team Enablement',
      erip: 'Self-service tools and automated responses',
      traditional: 'Heavy reliance on security team bandwidth',
      advantage: '4x capacity increase'
    }
  ];

  const totalSalesROI = salesAccelerationROI.reduce((sum, item) => 
    sum + parseInt(item.annualValue.replace('€', '').replace('K', '')) * 1000, 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,0.02)_0%,_transparent_50%)] pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-50 text-green-700 border-green-200 mb-4">
                Sales Acceleration Solution
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-900 to-green-900 bg-clip-text text-transparent">
                  Close Deals 40% Faster
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  with Trust Scores
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Transform security from a sales barrier into your strongest competitive advantage. 
                ERIP's Trust Score sharing and QIE automation accelerate deals while commanding premium pricing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  See Sales Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Calculate Sales ROI
                </Button>
              </div>

              {/* Sales Metrics */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">40%</div>
                  <div className="text-sm text-slate-600">Faster Deals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">25%</div>
                  <div className="text-sm text-slate-600">Price Premium</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">78%</div>
                  <div className="text-sm text-slate-600">RFP Win Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-3xl blur-3xl" />
              
              <Card className="relative shadow-2xl border-0 overflow-hidden">
                <Tabs value={activeDemo} onValueChange={setActiveDemo}>
                  <CardHeader className="bg-gradient-to-r from-green-600 to-blue-700 text-white p-6">
                    <TabsList className="bg-white/20 p-0">
                      <TabsTrigger value="trust-score" className="text-white data-[state=active]:bg-white data-[state=active]:text-green-600">
                        Trust Score
                      </TabsTrigger>
                      <TabsTrigger value="qie-processing" className="text-white data-[state=active]:bg-white data-[state=active]:text-green-600">
                        QIE Processing
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {Object.entries(demoSteps).map(([key, demo]) => (
                      <TabsContent key={key} value={key} className="mt-0">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-slate-900 mb-4">{demo.title}</h3>
                          {demo.steps.map((step, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                step.status === 'complete' ? 'bg-green-100 text-green-700' :
                                step.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {step.status === 'complete' ? <CheckCircle className="h-4 w-4" /> : step.step}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-slate-900">{step.action}</div>
                                <div className="text-xs text-slate-500">{step.time}</div>
                              </div>
                              {step.status === 'active' && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                              )}
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </CardContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sales Challenges */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              The Sales Challenge
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Traditional sales processes treat security as a hurdle to overcome, not an advantage to leverage. 
              ERIP transforms this dynamic completely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {salesChallenges.map((challenge, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-xl flex items-center justify-center">
                    <challenge.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{challenge.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{challenge.description}</p>
                  <Badge variant="destructive" className="text-xs">
                    {challenge.impact}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Competitive Comparison */}
          <div className="bg-slate-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">
              ERIP vs Traditional Sales Process
            </h3>
            <div className="space-y-6">
              {competitiveComparison.map((comp, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="font-semibold text-slate-900">{comp.aspect}</div>
                  <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                    <div className="font-medium mb-1">ERIP Approach</div>
                    {comp.erip}
                  </div>
                  <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                    <div className="font-medium mb-1">Traditional</div>
                    {comp.traditional}
                  </div>
                  <div className="text-center">
                    <Badge className="bg-blue-100 text-blue-700">
                      {comp.advantage}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Score Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Trust Score: Your Sales Superpower
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Transform your security posture into a shareable, verifiable competitive advantage 
              that prospects can instantly validate and trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trustScoreFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">
                        {feature.name}
                      </h3>
                      <p className="text-slate-600 mb-3">{feature.description}</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">{feature.benefit}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sales Team Testimonials */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              What Sales Teams Are Saying
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Real results from sales professionals using ERIP to transform their security conversations 
              into competitive advantages.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {salesTeamTestimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-slate-300">{testimonial.role}</p>
                      <p className="text-xs text-slate-400">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  <blockquote className="text-slate-200 mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {Object.entries(testimonial.metrics).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-lg font-bold text-green-400">{value}</div>
                        <div className="text-xs text-slate-400 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* QIE Capabilities */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                QIE: Questionnaire Intelligence Engine
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Stop spending weeks on security questionnaires. QIE's AI-powered automation 
                processes and responds to questionnaires in hours, not weeks, with 95% accuracy.
              </p>
              
              <div className="space-y-6">
                {qieCapabilities.map((capability, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                      <Brain className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{capability.feature}</h3>
                      <p className="text-slate-600 mb-2">{capability.description}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">{capability.timesSaved}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="shadow-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                  <div className="flex items-center gap-3">
                    <Brain className="h-6 w-6" />
                    <div>
                      <CardTitle>QIE Processing Results</CardTitle>
                      <p className="text-blue-100 text-sm">Latest questionnaire automation</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Questions Processed</span>
                    <span className="font-bold text-blue-600">247/247</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">AI Confidence Score</span>
                    <span className="font-bold text-green-600">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Evidence Matched</span>
                    <span className="font-bold text-purple-600">189/247</span>
                  </div>
                  <Progress value={76} className="h-2" />
                  
                  <div className="bg-green-50 p-4 rounded-lg mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Time Saved</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      38.5 hours
                      <span className="text-sm font-normal text-slate-600 ml-2">
                        vs 40 hours manual
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sales ROI Calculator */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Sales Acceleration ROI
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Calculate the financial impact of accelerated sales cycles, premium pricing, 
              and increased win rates through Trust Score demonstration.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {salesAccelerationROI.map((roi, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{roi.category}</h3>
                          <p className="text-2xl font-bold text-green-600">{roi.annualValue}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{roi.description}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">{roi.impact}</span>
                      </div>
                      <p className="text-xs text-slate-500">{roi.calculation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Card className="bg-gradient-to-br from-green-600 to-blue-700 text-white sticky top-8">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="text-5xl font-bold mb-2">
                      €{Math.round(totalSalesROI/1000)}K
                    </div>
                    <div className="text-green-100">
                      Annual Sales ROI
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-green-100">Faster Cycles:</span>
                      <span className="font-semibold">€680K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-100">Premium Pricing:</span>
                      <span className="font-semibold">€425K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-100">Higher Win Rate:</span>
                      <span className="font-semibold">€340K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-100">Team Efficiency:</span>
                      <span className="font-semibold">€180K</span>
                    </div>
                  </div>

                  <Button className="w-full bg-white text-green-600 hover:bg-green-50">
                    Get Your Sales ROI Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Transform Security Into Your Sales Advantage
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Join leading sales teams using ERIP to close deals 40% faster while commanding 25% premium pricing. 
            See how Trust Scores can revolutionize your sales process.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-green-50">
              Book Sales Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              Share Your Trust Score
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};