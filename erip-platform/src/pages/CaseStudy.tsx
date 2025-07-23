import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Users,
  Target,
  Brain,
  ArrowRight,
  Quote,
  Award,
  BarChart3,
  FileText,
  ArrowLeft,
  Building,
  Globe,
  Zap
} from 'lucide-react';

export const CaseStudy: React.FC = () => {
  const navigate = useNavigate();

  const challenges = [
    {
      icon: Globe,
      title: 'Complex Compliance Landscape',
      description: 'Navigating eIDAS, PSD2, GDPR, and emerging AI regulations',
      impact: 'Manual tracking consumed 40% of compliance team time'
    },
    {
      icon: Clock,
      title: 'Enterprise Sales Friction',
      description: '6-8 week security review cycles delaying major deals',
      impact: 'Lost 3 major bank deals due to lengthy assessments'
    },
    {
      icon: AlertTriangle,
      title: 'Risk Blindness',
      description: 'Unable to quantify financial impact of security incidents',
      impact: 'Board asked "What\'s our exposure?" - No clear answer'
    },
    {
      icon: Users,
      title: 'Resource Constraints',
      description: 'Small compliance team overwhelmed by enterprise requirements',
      impact: 'High turnover, reactive approach to compliance'
    }
  ];

  const solutions = [
    {
      title: 'Real-Time Regulatory Intelligence',
      challenge: 'Manually tracking regulatory changes across multiple frameworks',
      solution: 'AI-powered monitoring with automatic requirement mapping',
      result: '90% reduction in compliance monitoring time, zero missed updates',
      icon: Brain,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Trust Score for Enterprise Sales',
      challenge: 'Lost major deals due to lengthy security assessments',
      solution: 'Public Trust Score URL shared in first sales meeting',
      result: 'Security review time: 8 weeks → 1 week, 65% faster deals',
      icon: Shield,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Financial Risk Quantification',
      challenge: 'No clear answer on financial exposure from breaches',
      solution: 'Monte Carlo simulation with quantified impact analysis',
      result: '€4.2M exposure identified, €500K security budget approved',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Expert Network Access',
      challenge: 'Complex biometric authentication compliance questions',
      solution: 'Connected with verified eIDAS expert within 24 hours',
      result: 'Launched biometric auth 3 months faster with full compliance',
      icon: Users,
      color: 'from-amber-500 to-amber-600'
    },
    {
      title: 'Automated Security Questionnaires',
      challenge: '20-30 hours per enterprise RFP security section',
      solution: 'AI pre-filled 85% from Trust Equity data with evidence',
      result: 'Completion time: 30 hours → 2 hours, higher win rates',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const beforeAfter = {
    before: {
      title: 'Before ERIP',
      metrics: [
        { label: 'Compliance Status', value: 'Cost center consuming €400K annually', color: 'text-red-600' },
        { label: 'Sales Cycle', value: '120 days average for enterprise deals', color: 'text-red-600' },
        { label: 'Risk Position', value: 'Unknown exposure, reactive approach', color: 'text-red-600' },
        { label: 'Team Stress', value: 'High turnover in compliance team', color: 'text-red-600' },
        { label: 'Market Position', value: 'Losing to larger competitors', color: 'text-red-600' }
      ]
    },
    after: {
      title: 'After ERIP',
      metrics: [
        { label: 'Trust Equity Score', value: '847 (Platinum tier)', color: 'text-emerald-600' },
        { label: 'Sales Cycle', value: '45 days average (62% reduction)', color: 'text-emerald-600' },
        { label: 'Quantified Risk', value: '€2.1M exposure reduced from €4.2M', color: 'text-emerald-600' },
        { label: 'Team Efficiency', value: 'Same team handles 3x more work', color: 'text-emerald-600' },
        { label: 'Market Position', value: 'Won against 2 major competitors', color: 'text-emerald-600' }
      ]
    }
  };

  const roi = {
    investment: [
      { item: 'ERIP Platform', amount: '€120K annual' },
      { item: 'Implementation', amount: '€20K one-time' },
      { item: 'Training', amount: '€10K' }
    ],
    returns: [
      { item: 'Sales acceleration (3 additional deals)', amount: '€1.8M' },
      { item: 'Compliance efficiency savings', amount: '€200K' },
      { item: 'Risk reduction (insurance decrease)', amount: '€150K' },
      { item: 'Avoided breach costs', amount: '€500K' }
    ],
    totalCost: '€150K',
    totalValue: '€2.65M',
    roiPercentage: '1,667%'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10 border border-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <Building className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Case Study</h1>
                <p className="text-xl text-blue-100">European Authentication Scaleup Transformation</p>
              </div>
            </div>
            <p className="text-lg text-slate-300 max-w-4xl mx-auto">
              How ERIP transformed a rapidly growing authentication-as-a-service provider from struggling 
              with compliance burdens to leveraging Trust Equity™ for competitive advantage
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* The Challenge */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">The Challenge</h2>
          <p className="text-lg text-slate-600 mb-8 text-center max-w-4xl mx-auto">
            A rapidly growing European authentication-as-a-service provider faced critical challenges 
            that were limiting their growth and competitive position.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => {
              const Icon = challenge.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <p className="text-sm text-slate-600">{challenge.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm font-medium text-red-800">Impact: {challenge.impact}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* The ERIP Solution */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">The ERIP Solution</h2>
          
          <div className="space-y-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <Card key={index} className="border-0 shadow-lg overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${solution.color}`} />
                  <CardContent className="p-8">
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${solution.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{solution.title}</h3>
                          <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                            <strong>Challenge:</strong> {solution.challenge}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">ERIP Solution:</h4>
                        <p className="text-sm text-blue-800">{solution.solution}</p>
                      </div>
                      
                      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                        <h4 className="font-semibold text-emerald-900 mb-2">Result:</h4>
                        <p className="text-sm font-medium text-emerald-800">{solution.result}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Transformation Results */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">The Transformation: 12-Month Impact</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-2 border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  {beforeAfter.before.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {beforeAfter.before.metrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <span className="font-medium text-slate-700">{metric.label}:</span>
                      <span className={`text-sm ${metric.color} text-right flex-1 ml-2`}>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-200 bg-emerald-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                  <Award className="h-5 w-5" />
                  {beforeAfter.after.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {beforeAfter.after.metrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <span className="font-medium text-slate-700">{metric.label}:</span>
                      <span className={`text-sm ${metric.color} text-right flex-1 ml-2 font-medium`}>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Financial ROI */}
        <section className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Financial ROI</h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <DollarSign className="h-5 w-5" />
                  Investment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roi.investment.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-slate-600">{item.item}:</span>
                      <span className="font-medium">{item.amount}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total Year 1 Cost:</span>
                      <span className="text-red-700">{roi.totalCost}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <TrendingUp className="h-5 w-5" />
                  Returns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roi.returns.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-slate-600">{item.item}:</span>
                      <span className="font-medium">{item.amount}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total Year 1 Value:</span>
                      <span className="text-emerald-700">{roi.totalValue}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Target className="h-5 w-5" />
                  ROI Result
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-700 mb-2">{roi.roiPercentage}</div>
                <p className="text-sm text-blue-600 mb-4">Return on Investment</p>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-xs text-slate-600 mb-2">Calculation:</p>
                  <p className="text-sm">({roi.totalValue} - {roi.totalCost}) ÷ {roi.totalCost} × 100</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CEO Quote */}
        <section className="bg-gradient-to-br from-purple-900 to-blue-900 text-white p-8 rounded-2xl">
          <div className="text-center">
            <Quote className="h-12 w-12 text-purple-300 mx-auto mb-6" />
            <blockquote className="text-xl font-medium mb-6 max-w-4xl mx-auto">
              "We went from dreading enterprise security reviews to using them as a competitive weapon. 
              When we show our Trust Score in the first meeting, the conversation shifts from 'prove you're secure' 
              to 'how can we move forward quickly.' ERIP didn't just solve our compliance challenges - 
              it transformed them into our biggest differentiator."
            </blockquote>
            <cite className="text-purple-200">CEO, European Authentication Provider</cite>
          </div>
        </section>

        {/* Key Success Factors */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Key Success Factors</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Executive Buy-in', description: 'CEO understood Trust Equity as competitive advantage' },
              { title: 'Sales Integration', description: 'Trust Score became part of standard sales process' },
              { title: 'Continuous Improvement', description: 'Monthly Trust Equity reviews drove behavior' },
              { title: 'Network Effects', description: 'Connected with 15 other fintechs for shared learnings' },
              { title: 'Cultural Shift', description: 'Compliance team seen as value creators, not blockers' },
              { title: 'Systematic Approach', description: 'Building Trust Equity across all business activities' }
            ].map((factor, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold text-slate-900">{factor.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{factor.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bottom Line */}
        <section className="bg-gradient-to-br from-emerald-900 to-blue-900 text-white p-8 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-6">The Bottom Line</h2>
          <p className="text-lg mb-6 max-w-4xl mx-auto">
            For authentication service providers operating in Europe's complex regulatory environment, 
            ERIP transforms compliance from a necessary evil into a strategic advantage. The combination of 
            AI-powered intelligence, Trust Equity system, and expert network creates a compound effect 
            that accelerates growth while reducing risk.
          </p>
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20 max-w-3xl mx-auto">
            <p className="text-xl font-semibold">
              The question isn't whether you can afford ERIP - it's whether you can afford to compete without it.
            </p>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              size="lg"
              onClick={() => navigate('/')}
              className="bg-white text-slate-900 hover:bg-slate-100"
            >
              Start Your Trust Equity Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};