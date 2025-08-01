import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Building,
  Zap,
  Target,
  BarChart3,
  Shield,
  Award,
  Star,
  Users,
  Rocket,
  Calculator,
  ChevronRight,
  Heart,
  Coffee,
  AlertCircle,
  Smile,
  Activity,
  TrendingDown
} from 'lucide-react';
import { PublicHeader } from '../common/PublicHeader';

const CustomerImpactShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'stories' | 'calculator'>('metrics');
  const [inputs, setInputs] = useState({
    teamSize: 10,
    weeklyHours: 20,
    lostDeals: 2,
    avgDealSize: 250000,
    hourlyRate: 75
  });
  const navigate = useNavigate();

  // Impact calculation
  const calculateImpact = () => {
    const hoursSaved = inputs.weeklyHours * 52;
    const timeCost = hoursSaved * inputs.hourlyRate;
    const dealValue = inputs.lostDeals * inputs.avgDealSize;
    const stressCost = inputs.teamSize * 5000; // Burnout/turnover cost
    
    const totalSavings = timeCost + dealValue + stressCost;
    const velocityCost = 60000; // Annual cost
    const roi = ((totalSavings - velocityCost) / velocityCost) * 100;
    
    return {
      hoursSaved: hoursSaved.toLocaleString(),
      lifeSaved: Math.round(hoursSaved / 40), // Weeks of life back
      dealsWon: inputs.lostDeals * 2, // Double win rate
      happierTeam: inputs.teamSize,
      totalValue: totalSavings.toLocaleString(),
      roi: Math.round(roi),
      paybackMonths: Math.round((velocityCost / totalSavings) * 12)
    };
  };

  const results = calculateImpact();

  // Human-centered Impact Metrics
  const impactMetrics = [
    {
      icon: Coffee,
      title: 'Hours Saved Weekly',
      value: '40+',
      description: 'Your team can finally have weekends',
      color: 'emerald'
    },
    {
      icon: Smile,
      title: 'Stress Reduction',
      value: '90%',
      description: 'No more audit panic attacks',
      color: 'blue'
    },
    {
      icon: Heart,
      title: 'Customer Trust',
      value: '+85%',
      description: 'Win deals with confidence',
      color: 'purple'
    },
    {
      icon: DollarSign,
      title: 'Money Back',
      value: '€120K',
      description: 'Saved annually per customer',
      color: 'amber'
    }
  ];

  // Customer Success Stories
  const customerStories = [
    {
      company: 'TechFlow SaaS',
      person: 'Sarah Chen, Head of Sales',
      industry: 'B2B Software',
      size: '50 employees',
      personalQuote: '"I used to dread security questionnaires. They killed my deals and my weekends. Now I actually smile when prospects ask about compliance."',
      challenge: 'Lost a €2M deal because it took 3 weeks to answer security questions',
      solution: 'Velocity QIE answers questionnaires in hours, not weeks',
      results: [
        'Sarah closed 3 enterprise deals in her first month',
        'No more weekend work - compliance is automated',
        'Team morale improved dramatically',
        'Customer trust scores increased by 85%'
      ],
      emotionalOutcome: 'Sarah got her life back and exceeded her quota',
      roi: '650%',
      timeline: '3 months',
      icon: Building
    },
    {
      company: 'MedSecure Health',
      person: 'Dr. James Wright, CTO',
      industry: 'Digital Health',
      size: '200 employees',
      personalQuote: '"We were drowning in HIPAA documentation. My engineers were becoming compliance officers instead of building features."',
      challenge: 'Engineers spending 30% of time on compliance instead of product',
      solution: 'Automated HIPAA compliance freed engineers to innovate',
      results: [
        'Engineers back to 100% product development',
        'Launched 3 new features that were blocked by compliance work',
        'Team happiness scores up 70%',
        'Zero compliance incidents'
      ],
      emotionalOutcome: 'The team is excited about work again',
      roi: '450%',
      timeline: '2 months',
      icon: Shield
    },
    {
      company: 'GlobalPay Fintech',
      person: 'Maria Rodriguez, Compliance Manager',
      industry: 'Financial Services',
      size: '500 employees',
      personalQuote: '"I went from being the person everyone avoided to the person enabling growth. Velocity transformed my role and my career."',
      challenge: 'Compliance was seen as the "Department of No" blocking everything',
      solution: 'Velocity made compliance enablement automatic',
      results: [
        'Compliance approval time: 6 weeks → 2 days',
        'Maria promoted to VP of Trust & Security',
        'Team grew from cost center to strategic advantage',
        'Company expanded to 3 new markets'
      ],
      emotionalOutcome: 'Maria loves her job and drives business growth',
      roi: '520%',
      timeline: '4 months',
      icon: Award
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section - Inspired by ROI Calculator */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-blue-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-emerald-500 rounded-full mr-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <span className="text-emerald-400 font-semibold text-lg">Customer Impact</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              We Give You Your
              <span className="block text-emerald-400">Life Back</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Compliance shouldn't consume your nights and weekends. See how teams like yours 
              transformed from stressed to successful, winning more deals while working less.
            </p>

            {/* Quick Stats - Like ROI Calculator */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">40+</div>
                <div className="text-sm text-slate-300">Hours Saved Weekly</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">90%</div>
                <div className="text-sm text-slate-300">Stress Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">€120K</div>
                <div className="text-sm text-slate-300">Annual Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">650%</div>
                <div className="text-sm text-slate-300">Average ROI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="bg-white rounded-full p-1 shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`rounded-full px-6 py-3 font-medium transition-all duration-300 ${
                activeTab === 'metrics'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Life Impact
            </button>
            <button
              onClick={() => setActiveTab('stories')}
              className={`rounded-full px-6 py-3 font-medium transition-all duration-300 ${
                activeTab === 'stories'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Real Stories
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`rounded-full px-6 py-3 font-medium transition-all duration-300 ${
                activeTab === 'calculator'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calculator className="w-4 h-4 inline mr-2" />
              Your Impact
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === 'metrics' && (
          <div className="space-y-12">
            {/* Human Impact Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {impactMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
                    <div className={`p-3 rounded-lg w-fit mb-4 ${
                      metric.color === 'emerald' ? 'bg-emerald-100' :
                      metric.color === 'blue' ? 'bg-blue-100' :
                      metric.color === 'purple' ? 'bg-purple-100' :
                      'bg-amber-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        metric.color === 'emerald' ? 'text-emerald-600' :
                        metric.color === 'blue' ? 'text-blue-600' :
                        metric.color === 'purple' ? 'text-purple-600' :
                        'text-amber-600'
                      }`} />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-2">
                      {metric.value}
                    </div>
                    <div className="font-semibold text-slate-800 mb-1">
                      {metric.title}
                    </div>
                    <div className="text-sm text-slate-600">
                      {metric.description}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* The Human Cost Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-red-600 mb-6 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3" />
                  Without Velocity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">•</span>
                    <div>
                      <div className="font-medium text-slate-900">Weekend work becomes normal</div>
                      <div className="text-sm text-slate-600">Missing family time for compliance reports</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">•</span>
                    <div>
                      <div className="font-medium text-slate-900">Constant stress and anxiety</div>
                      <div className="text-sm text-slate-600">Always worried about the next audit</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">•</span>
                    <div>
                      <div className="font-medium text-slate-900">Career stagnation</div>
                      <div className="text-sm text-slate-600">Stuck in compliance instead of strategic work</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">•</span>
                    <div>
                      <div className="font-medium text-slate-900">Team burnout is inevitable</div>
                      <div className="text-sm text-slate-600">Good people leave for better work-life balance</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-emerald-600 mb-6 flex items-center">
                  <Smile className="w-6 h-6 mr-3" />
                  With Velocity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900">Weekends are yours again</div>
                      <div className="text-sm text-slate-600">Compliance runs automatically 24/7</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900">Sleep peacefully</div>
                      <div className="text-sm text-slate-600">Always audit-ready with real-time monitoring</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900">Focus on strategic growth</div>
                      <div className="text-sm text-slate-600">Let AI handle the repetitive work</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900">Happy, productive teams</div>
                      <div className="text-sm text-slate-600">People love jobs that respect their time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-8">
            {customerStories.map((story, index) => {
              const IconComponent = story.icon;
              return (
                <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            {story.company}
                          </h3>
                          <p className="text-slate-700 font-medium">{story.person}</p>
                          <div className="flex gap-3 mt-2">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                              {story.industry}
                            </span>
                            <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm font-medium">
                              {story.size}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-600">
                          {story.roi} ROI
                        </div>
                        <div className="text-sm text-slate-600">{story.timeline} to value</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <blockquote className="text-lg text-slate-700 italic mb-6 border-l-4 border-emerald-500 pl-4">
                      {story.personalQuote}
                    </blockquote>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            The Breaking Point
                          </h4>
                          <p className="text-slate-700">{story.challenge}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
                            <Rocket className="w-4 h-4 mr-2" />
                            The Transformation
                          </h4>
                          <p className="text-slate-700">{story.solution}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-emerald-600 mb-4 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Life-Changing Results
                        </h4>
                        <div className="space-y-3 mb-4">
                          {story.results.map((result, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-700">{result}</span>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-lg">
                          <p className="text-emerald-900 font-medium">
                            <Heart className="w-4 h-4 inline mr-1" />
                            {story.emotionalOutcome}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Input Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Your Current Situation</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    How many people deal with compliance?
                  </label>
                  <input
                    type="number"
                    value={inputs.teamSize}
                    onChange={(e) => setInputs(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 0 }))}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Hours per week on compliance?
                  </label>
                  <input
                    type="number"
                    value={inputs.weeklyHours}
                    onChange={(e) => setInputs(prev => ({ ...prev, weeklyHours: parseInt(e.target.value) || 0 }))}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    min="5"
                    max="40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Deals delayed by compliance/year?
                  </label>
                  <input
                    type="number"
                    value={inputs.lostDeals}
                    onChange={(e) => setInputs(prev => ({ ...prev, lostDeals: parseInt(e.target.value) || 0 }))}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    min="0"
                    max="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Average Deal Size
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      value={inputs.avgDealSize}
                      onChange={(e) => setInputs(prev => ({ ...prev, avgDealSize: parseInt(e.target.value) || 0 }))}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Key Results Card */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Here's What You Get Back</h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold">{results.hoursSaved}</div>
                    <div className="text-emerald-100">Hours for real work</div>
                    <div className="text-xs text-emerald-200 mt-1">
                      = {results.lifeSaved} weeks of your life back
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{results.dealsWon}</div>
                    <div className="text-emerald-100">Extra deals won</div>
                    <div className="text-xs text-emerald-200 mt-1">
                      No more compliance delays
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{results.happierTeam}</div>
                    <div className="text-emerald-100">Happier teammates</div>
                    <div className="text-xs text-emerald-200 mt-1">
                      No more compliance stress
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">€{results.totalValue}</div>
                    <div className="text-emerald-100">Total Value</div>
                    <div className="text-xs text-emerald-200 mt-1">
                      {results.roi}% ROI
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Benefits */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Additional Benefits</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">Answer security questionnaires over coffee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">Sleep well knowing you're always audit-ready</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">Turn compliance from blocker to advantage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">Let AI handle the repetitive work</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">People love jobs that respect their time</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-slate-900 rounded-2xl p-8 text-white text-center">
                <h3 className="text-xl font-bold mb-4">Ready to Get Your Life Back?</h3>
                <p className="text-slate-300 mb-6">
                  Start today and sleep better tonight. No credit card required.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/velocity/assessment')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    <Target className="w-5 h-5" />
                    Start Your 30-Minute Assessment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => navigate('/velocity/demo')}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-slate-400 text-slate-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
                  >
                    <Activity className="w-5 h-5" />
                    See Happy Customers
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerImpactShowcase;