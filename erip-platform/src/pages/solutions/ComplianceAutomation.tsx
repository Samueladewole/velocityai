import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Shield, 
  Brain, 
  FileCheck, 
  Award,
  Users,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const ComplianceAutomation: React.FC = () => {
  const painPoints = [
    {
      icon: Clock,
      title: 'Manual questionnaire processing',
      description: 'Teams spend 40+ hours per questionnaire with inconsistent results',
      impact: 'High Time Cost'
    },
    {
      icon: FileCheck,
      title: 'Framework management complexity',
      description: 'Managing multiple compliance frameworks with 70% overlap',
      impact: 'Resource Waste'
    },
    {
      icon: Users,
      title: 'Scattered evidence collection',
      description: 'Evidence stored across systems, difficult to find and validate',
      impact: 'Audit Risk'
    },
    {
      icon: TrendingUp,
      title: 'No competitive advantage',
      description: 'Compliance seen as cost center, not value driver',
      impact: 'Missed Opportunity'
    }
  ];

  const solutionComponents = [
    {
      name: 'QIE - Questionnaire Intelligence Engine',
      icon: Brain,
      description: 'AI-powered questionnaire automation with 95% time reduction',
      features: [
        'Smart document processing (PDF, Excel, Word)',
        'AI answer generation with confidence scoring',
        'Evidence matching and validation'
      ],
      metrics: { primary: '95%', secondary: 'time reduction' },
      href: '/qie-enhanced'
    },
    {
      name: 'ISACA DTEF Automation',
      icon: FileCheck,
      description: 'Complete Digital Trust Ecosystem Framework implementation',
      features: [
        '5-dimension trust assessment automation',
        'Gap analysis and control validation',
        'Executive reporting dashboard'
      ],
      metrics: { primary: '7.2x', secondary: 'faster compliance' },
      href: '/dtef-automation'
    },
    {
      name: 'Industry Certifications',
      icon: Award,
      description: 'TISAX, ISO 27701, SOC 2, HIPAA with automated tracking',
      features: [
        'Multi-framework certification management',
        'Automated evidence collection',
        'Certification renewal monitoring'
      ],
      metrics: { primary: '78%', secondary: 'RFP success rate' },
      href: '/certifications'
    },
    {
      name: 'Framework Management System',
      icon: Shield,
      description: '70% overlap optimization across compliance frameworks',
      features: [
        'Multi-framework overlap detection',
        'Control mapping automation',
        'Unified compliance dashboard'
      ],
      metrics: { primary: '70%', secondary: 'overlap reduction' },
      href: '/framework-management'
    }
  ];

  const customerSuccess = {
    company: 'TechCorp Solutions',
    industry: 'Technology/SaaS',
    size: 'Mid-Market (500+ employees)',
    challenge: 'Managing SOC 2, ISO 27001, and GDPR compliance across multiple product lines with limited resources',
    solution: 'Implemented ERIP compliance automation suite with QIE, DTEF, and Framework Management',
    results: [
      { metric: '92%', description: 'Reduction in questionnaire processing time' },
      { metric: '€180K', description: 'Annual cost savings from automation' },
      { metric: '45%', description: 'Faster certification renewals' },
      { metric: '3x', description: 'Increase in RFP response capacity' }
    ],
    quote: "ERIP transformed our compliance from a cost center into a competitive advantage. We now complete questionnaires in hours instead of weeks, and our Trust Score helps us win deals faster.",
    author: 'Sarah Mitchell, Chief Compliance Officer'
  };

  const roiMetrics = [
    {
      category: 'Time Savings',
      annual: '€240K',
      description: 'Reduced manual processing time',
      calculation: '40 hours/week × €150/hour × 52 weeks × 80% reduction'
    },
    {
      category: 'Sales Acceleration',
      annual: '€450K',
      description: 'Faster deal closure with Trust Scores',
      calculation: '15% higher close rate × €3M annual pipeline'
    },
    {
      category: 'Framework Optimization',
      annual: '€120K',
      description: 'Reduced duplicate work across frameworks',
      calculation: '70% overlap reduction × €171K framework costs'
    },
    {
      category: 'Audit Preparation',
      annual: '€80K',
      description: 'Streamlined audit processes',
      calculation: '50% reduction in audit prep time × €160K annual cost'
    }
  ];

  const totalROI = roiMetrics.reduce((sum, metric) => sum + parseInt(metric.annual.replace('€', '').replace('K', '')) * 1000, 0);
  const implementation = 120000; // €120K implementation cost
  const roiPercentage = Math.round(((totalROI - implementation) / implementation) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,0.02)_0%,_transparent_50%)] pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-4">
                Compliance Automation Solution
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  Automate Compliance,
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Build Trust Equity™
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Transform your compliance process from a cost center into a competitive advantage. 
                Reduce questionnaire processing time by 95% while building measurable Trust Equity 
                that accelerates sales.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="erip-gradient-primary">
                  Get Compliance Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Calculate Your ROI
                </Button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">95%</div>
                  <div className="text-sm text-slate-600">Time Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">€890K</div>
                  <div className="text-sm text-slate-600">Average Annual ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">78%</div>
                  <div className="text-sm text-slate-600">RFP Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
              <Card className="relative shadow-2xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">QIE Processing Demo</CardTitle>
                      <p className="text-blue-100 text-sm">Real-time questionnaire automation</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Document Processing</span>
                      <Badge className="bg-green-100 text-green-700">Complete</Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Answer Generation</span>
                      <Badge className="bg-green-100 text-green-700">Complete</Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Evidence Matching</span>
                      <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="bg-slate-50 rounded-lg p-4 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Processing Time</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        2.3 hours
                        <span className="text-sm font-normal text-slate-600 ml-2">
                          vs 40 hours manual
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              The Compliance Challenge
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Traditional compliance processes drain resources without creating competitive advantage. 
              ERIP transforms this challenge into opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((point, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-xl flex items-center justify-center">
                    <point.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{point.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{point.description}</p>
                  <Badge variant="destructive" className="text-xs">
                    {point.impact}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Components */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              ERIP Compliance Automation Suite
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Four integrated components that work together to automate your entire compliance process 
              while building Trust Equity for competitive advantage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutionComponents.map((component, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <component.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {component.metrics.primary}
                      </div>
                      <div className="text-xs text-slate-600">
                        {component.metrics.secondary}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {component.name}
                  </CardTitle>
                  <p className="text-slate-600">{component.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {component.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link to={component.href}>
                      Explore Component
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Success Story */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Customer Success Story
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              See how {customerSuccess.company} transformed their compliance process and achieved measurable ROI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{customerSuccess.company}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{customerSuccess.industry}</Badge>
                  <Badge variant="secondary">{customerSuccess.size}</Badge>
                </div>
                <p className="text-slate-300 mb-6">{customerSuccess.challenge}</p>
                <p className="text-slate-200 mb-8">{customerSuccess.solution}</p>
              </div>

              <blockquote className="border-l-4 border-blue-500 pl-6 mb-6">
                <p className="text-lg italic text-slate-200 mb-4">"{customerSuccess.quote}"</p>
                <footer className="text-sm text-slate-400">
                  — {customerSuccess.author}
                </footer>
              </blockquote>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-6">
                {customerSuccess.results.map((result, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                      {result.metric}
                    </div>
                    <div className="text-sm text-slate-300">
                      {result.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Calculate Your ROI
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See the financial impact of compliance automation for your organization. 
              Based on industry averages and customer data.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roiMetrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{metric.category}</h3>
                          <p className="text-2xl font-bold text-green-600">{metric.annual}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{metric.description}</p>
                      <p className="text-xs text-slate-500">{metric.calculation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="text-5xl font-bold mb-2">
                      {roiPercentage}%
                    </div>
                    <div className="text-blue-100">
                      Return on Investment
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-blue-100">Annual Benefits:</span>
                      <span className="font-semibold">€{Math.round(totalROI/1000)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-100">Implementation:</span>
                      <span className="font-semibold">€120K</span>
                    </div>
                    <div className="border-t border-blue-400 pt-2">
                      <div className="flex justify-between">
                        <span className="text-blue-100">Net Annual Value:</span>
                        <span className="font-bold">€{Math.round((totalROI - implementation)/1000)}K</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                    Get Custom ROI Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Automate Your Compliance?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies using ERIP to transform compliance from cost center to competitive advantage. 
            Get started with a personalized demo today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Schedule Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Start Free Assessment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};