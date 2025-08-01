import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ChevronDown } from 'lucide-react';

interface ImpactMetric {
  icon: string;
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down';
  color: 'green' | 'blue' | 'purple' | 'orange';
}

interface CustomerStory {
  company: string;
  industry: string;
  size: string;
  challenge: string;
  solution: string;
  results: string[];
  roi: string;
  timeline: string;
}

const CustomerImpactShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'stories' | 'calculator'>('metrics');
  const [animateCounter, setAnimateCounter] = useState(false);

  useEffect(() => {
    setAnimateCounter(true);
  }, []);

  const impactMetrics: ImpactMetric[] = [
    {
      icon: '💰',
      title: 'Average Cost Savings',
      value: '€120K',
      description: 'First-year savings per customer',
      trend: 'up',
      color: 'green'
    },
    {
      icon: '⚡',
      title: 'Response Time',
      value: '2 Hours',
      description: 'vs 2 weeks industry standard',
      trend: 'down',
      color: 'blue'
    },
    {
      icon: '🎯',
      title: 'Deal Win Rate',
      value: '+40%',
      description: 'Increase in enterprise deals',
      trend: 'up',
      color: 'purple'
    },
    {
      icon: '🚀',
      title: 'Sales Cycle',
      value: '2.3x',
      description: 'Faster deal closure',
      trend: 'up',
      color: 'orange'
    },
    {
      icon: '✅',
      title: 'Audit Pass Rate',
      value: '95%',
      description: 'vs 70% industry average',
      trend: 'up',
      color: 'green'
    },
    {
      icon: '📊',
      title: 'ROI',
      value: '400-800%',
      description: 'Return on investment',
      trend: 'up',
      color: 'blue'
    }
  ];

  const customerStories: CustomerStory[] = [
    {
      company: 'TechFlow SaaS',
      industry: 'SaaS Platform',
      size: 'Series B (€50M ARR)',
      challenge: 'Lost €2M enterprise deal due to slow security review process',
      solution: 'Implemented Velocity QIE for instant compliance responses',
      results: [
        'Same-day security questionnaire responses',
        '40% increase in enterprise deal win rate',
        'Reduced sales cycle from 6 months to 4 months',
        'Eliminated €80K in annual consultant fees'
      ],
      roi: '650%',
      timeline: '3 months'
    },
    {
      company: 'MedSecure Health',
      industry: 'HealthTech',
      size: 'Scale-up (200 employees)',
      challenge: 'HIPAA compliance documentation took 3 months per customer',
      solution: 'Automated HIPAA compliance with real-time evidence collection',
      results: [
        'Instant HIPAA compliance reports',
        '50% faster healthcare deal closure',
        '90% reduction in compliance overhead',
        'Entered 3 new regulated markets'
      ],
      roi: '450%',
      timeline: '2 months'
    },
    {
      company: 'GlobalPay Fintech',
      industry: 'Financial Services',
      size: 'Growth Stage (€25M ARR)',
      challenge: 'SOC 2 audit prep cost €180K and took 6 months',
      solution: 'Year-round audit readiness with automated evidence collection',
      results: [
        'Completed SOC 2 in 4 weeks',
        'Reduced audit costs to €30K',
        'Continuous compliance monitoring',
        'Expanded to European markets'
      ],
      roi: '520%',
      timeline: '4 months'
    }
  ];

  const ROICalculator: React.FC = () => {
    const [companySize, setCompanySize] = useState('50');
    const [currentAuditCost, setCurrentAuditCost] = useState('100000');
    const [dealsPerYear, setDealsPerYear] = useState('50');
    
    const calculateROI = () => {
      const auditSavings = parseInt(currentAuditCost) * 0.7; // 70% reduction
      const dealAcceleration = parseInt(dealsPerYear) * 0.3 * 50000; // 30% more deals at €50K avg
      const timeSavings = parseInt(companySize) * 2000; // €2K per employee in time savings
      
      const totalSavings = auditSavings + dealAcceleration + timeSavings;
      const velocityCost = 120000; // Annual platform cost
      const roi = ((totalSavings - velocityCost) / velocityCost) * 100;
      
      return {
        totalSavings: totalSavings.toLocaleString(),
        roi: Math.round(roi),
        paybackMonths: Math.round((velocityCost / totalSavings) * 12)
      };
    };

    const results = calculateROI();

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Company Size (Employees)</label>
            <input
              type="number"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              min="10"
              max="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Current Annual Audit Costs</label>
            <input
              type="number"
              value={currentAuditCost}
              onChange={(e) => setCurrentAuditCost(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              min="50000"
              max="500000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Enterprise Deals Per Year</label>
            <input
              type="number"
              value={dealsPerYear}
              onChange={(e) => setDealsPerYear(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              min="10"
              max="200"
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20 mt-6">
          <h3 className="text-center text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Your Velocity ROI Projection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                €{results.totalSavings}
              </div>
              <div className="text-sm text-slate-400">Annual Savings</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                {results.roi}%
              </div>
              <div className="text-sm text-slate-400">ROI</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {results.paybackMonths} months
              </div>
              <div className="text-sm text-slate-400">Payback Period</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/velocity" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-white font-serif">Velocity</span>
                <div className="text-xs text-slate-400">AI Compliance Automation</div>
              </div>
            </Link>

            {/* Back to Home */}
            <Link 
              to="/velocity" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-500/20 mb-6">
              <span className="text-emerald-400 text-sm font-medium">
                ✨ Real Customer Impact • Proven Results • Measurable ROI
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-light text-white font-serif mb-4">
              Transform Compliance Into
              <span className="block font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                Competitive Advantage
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light">
              See how Velocity customers turn compliance from a cost center into a profit center, 
              accelerating growth and opening new markets.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-slate-700/50">
              <button
                onClick={() => setActiveTab('metrics')}
                className={`rounded-full px-6 py-3 font-medium transition-all duration-300 €{
                  activeTab === 'metrics'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                📊 Impact Metrics
              </button>
              <button
                onClick={() => setActiveTab('stories')}
                className={`rounded-full px-6 py-3 font-medium transition-all duration-300 €{
                  activeTab === 'stories'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                🎯 Success Stories
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`rounded-full px-6 py-3 font-medium transition-all duration-300 €{
                  activeTab === 'calculator'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                💰 ROI Calculator
              </button>
            </div>
          </div>

          {/* Content Sections */}
          {activeTab === 'metrics' && (
            <div className="space-y-8">
              {/* Key Impact Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {impactMetrics.map((metric, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{metric.icon}</div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium €{
                        metric.trend === 'up' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {metric.trend === 'up' ? '↗️' : '↘️'}
                      </div>
                    </div>
                    <div className={`text-3xl font-bold bg-gradient-to-r €{
                      metric.color === 'green' ? 'from-emerald-400 to-emerald-500' :
                      metric.color === 'blue' ? 'from-blue-400 to-cyan-500' :
                      metric.color === 'purple' ? 'from-purple-400 to-pink-500' :
                      'from-amber-400 to-orange-500'
                    } bg-clip-text text-transparent mb-2`}>
                      {metric.value}
                    </div>
                    <div className="font-semibold text-white mb-1">
                      {metric.title}
                    </div>
                    <div className="text-sm text-slate-400">
                      {metric.description}
                    </div>
                  </div>
                ))}
              </div>

            {/* Business Impact Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-3">💰</span>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                    Financial Impact
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-3 mt-1">✓</span>
                    <div>
                      <div className="text-white font-semibold">90% reduction in compliance consultant fees</div>
                      <div className="text-sm text-slate-400">Save €50K-200K per audit</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-3 mt-1">✓</span>
                    <div>
                      <div className="text-white font-semibold">80% reduction in employee time</div>
                      <div className="text-sm text-slate-400">€40K-120K productivity gains</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-3 mt-1">✓</span>
                    <div>
                      <div className="text-white font-semibold">30% more enterprise deals</div>
                      <div className="text-sm text-slate-400">Instant compliance proof</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-3">⚡</span>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                    Operational Excellence
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3 mt-1">✓</span>
                    <div>
                      <div className="text-white font-semibold">2 hours vs 2 weeks</div>
                      <div className="text-sm text-slate-400">Security assessment responses</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3 mt-1">✓</span>
                    <div>
                      <div className="text-white font-semibold">Same-day responses</div>
                      <div className="text-sm text-slate-400">Customer due diligence</div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3 mt-1">✓</span>
                    <div>
                      <div className="text-white font-semibold">Instant audit readiness</div>
                      <div className="text-sm text-slate-400">vs 6-month preparation</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-8">
            {customerStories.map((story, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {story.company}
                    </h3>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/30">
                        {story.industry}
                      </span>
                      <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm font-medium border border-slate-600/50">
                        {story.size}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                      {story.roi}% ROI
                    </div>
                    <div className="text-sm text-slate-400">{story.timeline} payback</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-red-400 mb-3 flex items-center">
                        <span className="mr-2">❌</span> Challenge
                      </h4>
                      <p className="text-slate-300 leading-relaxed">{story.challenge}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-3 flex items-center">
                        <span className="mr-2">🎯</span> Solution
                      </h4>
                      <p className="text-slate-300 leading-relaxed">{story.solution}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-emerald-400 mb-4 flex items-center">
                      <span className="mr-2">✅</span> Results
                    </h4>
                    <ul className="space-y-3">
                      {story.results.map((result, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-emerald-400 mr-3 mt-1 flex-shrink-0">•</span>
                          <span className="text-slate-300">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white font-serif mb-4">
                  Calculate Your Velocity ROI
                </h2>
                <p className="text-lg text-slate-400">
                  See your potential savings and return on investment with Velocity
                </p>
              </div>
              <ROICalculator />
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">
              Ready to Transform Your Compliance?
            </h2>
            <p className="text-xl text-white/90 mb-6">
              Join 500+ companies that turned compliance into competitive advantage
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-white/90 transition-colors">
                Start Free Trial
              </button>
              <button className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                Book Demo
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerImpactShowcase;