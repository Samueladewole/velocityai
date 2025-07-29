import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Clock,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Download,
  Calculator,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';

const roiMetrics = [
  {
    category: 'Time Savings',
    icon: Clock,
    metrics: [
      { metric: 'Compliance Automation', savings: '85% reduction', value: '1,200 hours/year' },
      { metric: 'Questionnaire Processing', savings: '95% faster', value: '40 hours/month' },
      { metric: 'Risk Assessment', savings: '7x faster', value: '300 hours/quarter' }
    ],
    color: 'from-blue-400 to-blue-600'
  },
  {
    category: 'Cost Reduction',
    icon: DollarSign,
    metrics: [
      { metric: 'Security Incidents', savings: '60% reduction', value: '€2.3M saved' },
      { metric: 'Audit Preparation', savings: '70% lower cost', value: '€150K/year' },
      { metric: 'Tool Consolidation', savings: '12 tools → 1', value: '€200K/year' }
    ],
    color: 'from-green-400 to-green-600'
  },
  {
    category: 'Revenue Impact',
    icon: TrendingUp,
    metrics: [
      { metric: 'Sales Cycle', savings: '40% faster', value: '€3.2M accelerated' },
      { metric: 'Win Rate', savings: '+25% increase', value: '€1.8M new revenue' },
      { metric: 'Customer Trust', savings: '3x improvement', value: '€950K retention' }
    ],
    color: 'from-purple-400 to-purple-600'
  },
  {
    category: 'Risk Mitigation',
    icon: Shield,
    metrics: [
      { metric: 'Breach Prevention', savings: '90% reduction', value: '€5.2M avoided' },
      { metric: 'Compliance Fines', savings: '100% avoided', value: '€750K protected' },
      { metric: 'Insurance Premiums', savings: '35% lower', value: '€120K/year' }
    ],
    color: 'from-amber-400 to-amber-600'
  }
];

const caseStudies = [
  {
    company: 'Global FinTech Leader',
    industry: 'Financial Services',
    size: '5,000+ employees',
    results: {
      roi: '487%',
      payback: '4 months',
      savings: '€3.2M/year'
    },
    quote: "ERIP transformed our security posture while actually making us money. The Trust Score alone accelerated 5 enterprise deals."
  },
  {
    company: 'European SaaS Platform',
    industry: 'Technology',
    size: '1,200 employees',
    results: {
      roi: '312%',
      payback: '6 months',
      savings: '€1.8M/year'
    },
    quote: "We replaced 8 security tools with ERIP and reduced our compliance workload by 85%. Game-changing efficiency."
  },
  {
    company: 'Healthcare Innovation Co',
    industry: 'Healthcare',
    size: '800 employees',
    results: {
      roi: '425%',
      payback: '5 months',
      savings: '€2.1M/year'
    },
    quote: "HIPAA compliance went from nightmare to automated. ERIP paid for itself in avoided fines alone."
  }
];

const implementationSteps = [
  {
    phase: 'Week 1-2',
    title: 'Quick Start',
    activities: ['Platform deployment', 'Initial Trust Score assessment', 'Team onboarding'],
    value: 'Immediate visibility into security posture'
  },
  {
    phase: 'Week 3-4',
    title: 'Integration',
    activities: ['Connect existing tools', 'Import compliance data', 'Configure automation'],
    value: '50% workload reduction begins'
  },
  {
    phase: 'Month 2',
    title: 'Optimization',
    activities: ['Process automation', 'Risk quantification', 'Trust Score improvement'],
    value: 'First deals accelerated, costs dropping'
  },
  {
    phase: 'Month 3+',
    title: 'Scale',
    activities: ['Full platform adoption', 'Advanced features', 'Strategic initiatives'],
    value: 'Full ROI realization, transformational impact'
  }
];

export const ROIGuide: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              The ERIP ROI Guide
            </h1>
            <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto">
              See exactly how ERIP delivers 269-487% ROI in under 6 months through
              automated compliance, accelerated sales, and quantified risk reduction
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/roi-calculator')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calculate Your ROI
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => alert('Download PDF functionality would be implemented here')}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Full Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Metrics Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Four Pillars of ERIP ROI
            </h2>
            <p className="text-lg text-slate-700">
              Measurable impact across every dimension of your business
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {roiMetrics.map((category) => (
              <Card key={category.category} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.metrics.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <div>
                          <p className="font-medium text-slate-900">{item.metric}</p>
                          <p className="text-sm text-slate-600">{item.savings}</p>
                        </div>
                        <span className="text-lg font-bold text-green-600">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Real Customer Results
            </h2>
            <p className="text-lg text-slate-700">
              See how leading organizations achieve transformational ROI with ERIP
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {caseStudies.map((study, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-slate-900">{study.company}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{study.industry}</span>
                      <span>•</span>
                      <span>{study.size}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                        <p className="text-2xl font-bold text-blue-700">{study.results.roi}</p>
                        <p className="text-xs text-slate-600">ROI</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                        <p className="text-2xl font-bold text-green-700">{study.results.payback}</p>
                        <p className="text-xs text-slate-600">Payback</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                        <p className="text-2xl font-bold text-purple-700">{study.results.savings}</p>
                        <p className="text-xs text-slate-600">Savings</p>
                      </div>
                    </div>
                    <blockquote className="italic text-slate-700 border-l-4 border-blue-600 pl-4">
                      "{study.quote}"
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Path to ROI: 90-Day Journey
            </h2>
            <p className="text-lg text-slate-700">
              Start seeing returns from day one with our proven implementation approach
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {implementationSteps.map((step, index) => (
              <Card key={index} className="relative border-0 shadow-lg">
                {index < implementationSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-slate-300" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-600">{step.phase}</span>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {step.activities.map((activity, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{activity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm font-medium text-green-600">{step.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Guarantee */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            The ERIP ROI Guarantee
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            We're so confident in ERIP's value that we guarantee positive ROI within 90 days.
            If you don't see measurable financial impact, we'll work for free until you do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => navigate('/assessment')}
            >
              Start Free Assessment
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/demo')}
            >
              See Live Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Ready to Transform Your Security Economics?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <button
                  onClick={() => navigate('/roi-calculator')}
                  className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all group"
                >
                  <Calculator className="h-8 w-8 text-slate-400 group-hover:text-blue-600" />
                  <div className="text-center">
                    <p className="font-semibold text-slate-900">ROI Calculator</p>
                    <p className="text-sm text-slate-600">Get your personalized estimate</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/demo')}
                  className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-slate-200 hover:border-green-600 hover:bg-green-50 transition-all group"
                >
                  <Lightbulb className="h-8 w-8 text-slate-400 group-hover:text-green-600" />
                  <div className="text-center">
                    <p className="font-semibold text-slate-900">Live Demo</p>
                    <p className="text-sm text-slate-600">See ERIP in action</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/assessment')}
                  className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-slate-200 hover:border-purple-600 hover:bg-purple-50 transition-all group"
                >
                  <Zap className="h-8 w-8 text-slate-400 group-hover:text-purple-600" />
                  <div className="text-center">
                    <p className="font-semibold text-slate-900">Free Assessment</p>
                    <p className="text-sm text-slate-600">Start your journey today</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};