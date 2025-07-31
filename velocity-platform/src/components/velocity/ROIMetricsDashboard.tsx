import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ROIMetric {
  title: string;
  current: number;
  previous: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  impact: 'high' | 'medium' | 'low';
  description: string;
  category: 'cost' | 'time' | 'revenue' | 'risk';
}

interface ComparisonData {
  category: string;
  velocity: number;
  industry: number;
  improvement: string;
  unit: string;
}

const ROIMetricsDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'comparison' | 'timeline'>('overview');
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({});

  const roiMetrics: ROIMetric[] = [
    {
      title: 'Audit Preparation Time',
      current: 4,
      previous: 24,
      unit: 'weeks',
      trend: 'down',
      impact: 'high',
      description: 'Time to complete audit preparation',
      category: 'time'
    },
    {
      title: 'Compliance Cost per Framework',
      current: 30,
      previous: 180,
      unit: 'K USD',
      trend: 'down',
      impact: 'high',
      description: 'Total cost including consultants and internal resources',
      category: 'cost'
    },
    {
      title: 'Security Questionnaire Response',
      current: 2,
      previous: 336,
      unit: 'hours',
      trend: 'down',
      impact: 'high',
      description: 'Average time to complete vendor security assessments',
      category: 'time'
    },
    {
      title: 'Enterprise Deal Win Rate',
      current: 85,
      previous: 60,
      unit: '%',
      trend: 'up',
      impact: 'high',
      description: 'Percentage of enterprise deals won',
      category: 'revenue'
    },
    {
      title: 'Sales Cycle Length',
      current: 90,
      previous: 150,
      unit: 'days',
      trend: 'down',
      impact: 'medium',
      description: 'Average time from lead to closed deal',
      category: 'revenue'
    },
    {
      title: 'Compliance Staff Productivity',
      current: 400,
      previous: 100,
      unit: '% increase',
      trend: 'up',
      impact: 'high',
      description: 'Productivity improvement in compliance tasks',
      category: 'time'
    },
    {
      title: 'Audit Pass Rate',
      current: 95,
      previous: 70,
      unit: '%',
      trend: 'up',
      impact: 'medium',
      description: 'First-attempt audit success rate',
      category: 'risk'
    },
    {
      title: 'Customer Due Diligence Response',
      current: 0.5,
      previous: 5,
      unit: 'days',
      trend: 'down',
      impact: 'medium',
      description: 'Time to respond to customer security requests',
      category: 'time'
    }
  ];

  const comparisonData: ComparisonData[] = [
    {
      category: 'Questionnaire Response Time',
      velocity: 2,
      industry: 336,
      improvement: '99.4% faster',
      unit: 'hours'
    },
    {
      category: 'Audit Preparation Cost',
      velocity: 30,
      industry: 180,
      improvement: '83% reduction',
      unit: 'K USD'
    },
    {
      category: 'Compliance Staff Required',
      velocity: 1,
      industry: 3,
      improvement: '67% fewer',
      unit: 'FTEs'
    },
    {
      category: 'Evidence Collection Time',
      velocity: 1,
      industry: 8,
      improvement: '87% faster',
      unit: 'weeks'
    },
    {
      category: 'Framework Coverage',
      velocity: 6,
      industry: 1.5,
      improvement: '300% more',
      unit: 'frameworks'
    },
    {
      category: 'Accuracy Rate',
      velocity: 96,
      industry: 70,
      improvement: '37% higher',
      unit: '%'
    }
  ];

  useEffect(() => {
    // Animate values on component mount
    const timer = setTimeout(() => {
      const animated: { [key: string]: number } = {};
      roiMetrics.forEach((metric, index) => {
        animated[metric.title] = metric.current;
      });
      setAnimatedValues(animated);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatMetricValue = (value: number, unit: string): string => {
    if (unit === 'K USD') return `$${value}K`;
    if (unit === '% increase') return `+${value}%`;
    return `${value} ${unit}`;
  };

  const calculateImprovement = (current: number, previous: number, trend: string): string => {
    const improvement = trend === 'down' 
      ? ((previous - current) / previous * 100)
      : ((current - previous) / previous * 100);
    
    return `${Math.round(improvement)}%`;
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'cost': return 'text-green-600';
      case 'time': return 'text-blue-600';
      case 'revenue': return 'text-purple-600';
      case 'risk': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'cost': return '💰';
      case 'time': return '⏱️';
      case 'revenue': return '📈';
      case 'risk': return '🛡️';
      default: return '📊';
    }
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
                📊 Real-Time Metrics • Proven Impact • Measurable Results
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-light text-white font-serif mb-4">
              ROI Impact
              <span className="block font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light">
              Real-time metrics showing the transformational impact of Velocity on customer operations
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-slate-700/50">
              {[
                { key: 'overview', label: '📊 Metrics Overview' },
                { key: 'comparison', label: '⚡ vs Industry' },
                { key: 'timeline', label: '📈 Impact Timeline' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveView(tab.key as any)}
                  className={`rounded-full px-6 py-3 font-medium transition-all duration-300 ${
                    activeView === tab.key
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeView === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {roiMetrics.map((metric, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-2xl">
                        {getCategoryIcon(metric.category)}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        metric.impact === 'high' 
                          ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        metric.impact === 'medium'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      }`}>
                        {metric.impact.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className={`text-3xl font-bold bg-gradient-to-r ${
                        metric.category === 'cost' ? 'from-emerald-400 to-emerald-500' :
                        metric.category === 'time' ? 'from-blue-400 to-cyan-500' :
                        metric.category === 'revenue' ? 'from-purple-400 to-pink-500' :
                        'from-amber-400 to-orange-500'
                      } bg-clip-text text-transparent`}>
                        {formatMetricValue(animatedValues[metric.title] || 0, metric.unit)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                          metric.trend === 'up' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                            : metric.trend === 'down'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                        }`}>
                          {metric.trend === 'up' ? '↗️' : metric.trend === 'down' ? '↘️' : '→'} 
                          {calculateImprovement(metric.current, metric.previous, metric.trend)} improvement
                        </span>
                      </div>
                      
                      <div className="text-sm font-semibold text-white">
                        {metric.title}
                      </div>
                      
                      <div className="text-xs text-slate-400">
                        {metric.description}
                      </div>
                      
                      <div className="text-xs text-slate-500">
                        Previous: {formatMetricValue(metric.previous, metric.unit)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20">
                  <div className="flex items-center mb-6">
                    <span className="text-3xl mr-3">💰</span>
                    <h3 className="text-xl font-bold text-emerald-400">
                      Cost Impact
                    </h3>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-2">$120K</div>
                  <div className="text-sm text-slate-400 mb-4">Average annual savings per customer</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-white">
                      <span>Audit cost reduction:</span>
                      <span className="font-semibold text-emerald-400">83%</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Staff productivity gain:</span>
                      <span className="font-semibold text-emerald-400">400%</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Consultant fee savings:</span>
                      <span className="font-semibold text-emerald-400">90%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                  <div className="flex items-center mb-6">
                    <span className="text-3xl mr-3">⏱️</span>
                    <h3 className="text-xl font-bold text-blue-400">
                      Time Impact
                    </h3>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-2">500+ Hours</div>
                  <div className="text-sm text-slate-400 mb-4">Saved per framework per year</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-white">
                      <span>Questionnaire response:</span>
                      <span className="font-semibold text-blue-400">99.4% faster</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Audit preparation:</span>
                      <span className="font-semibold text-blue-400">83% faster</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Evidence collection:</span>
                      <span className="font-semibold text-blue-400">87% faster</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                  <div className="flex items-center mb-6">
                    <span className="text-3xl mr-3">📈</span>
                    <h3 className="text-xl font-bold text-purple-400">
                      Business Impact
                    </h3>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">650% ROI</div>
                  <div className="text-sm text-slate-400 mb-4">Average return on investment</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-white">
                      <span>Enterprise win rate:</span>
                      <span className="font-semibold text-purple-400">+40%</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Sales cycle reduction:</span>
                      <span className="font-semibold text-purple-400">40%</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Audit pass rate:</span>
                      <span className="font-semibold text-purple-400">95%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comparison Tab */}
          {activeView === 'comparison' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white font-serif mb-4">Velocity vs Industry Standards</h2>
                  <p className="text-slate-400">See how Velocity compares to traditional compliance approaches</p>
                </div>
                <div className="space-y-6">
                  {comparisonData.map((item, index) => (
                    <div key={index} className="border-b border-slate-800 pb-6 last:border-b-0">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-white text-lg">{item.category}</h3>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/30">
                          {item.improvement}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-500/10 backdrop-blur-sm p-4 rounded-xl border border-blue-500/20">
                          <div className="text-sm text-blue-400 font-medium mb-2">Velocity</div>
                          <div className="text-2xl font-bold text-blue-400">
                            {item.velocity} {item.unit}
                          </div>
                        </div>
                        
                        <div className="bg-slate-700/50 backdrop-blur-sm p-4 rounded-xl border border-slate-600/50">
                          <div className="text-sm text-slate-400 font-medium mb-2">Industry Average</div>
                          <div className="text-2xl font-bold text-slate-300">
                            {item.industry} {item.unit}
                          </div>
                        </div>
                      </div>

                      {/* Visual comparison bar */}
                      <div className="mt-4">
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <span>Worse</span>
                          <div className="flex-1 bg-slate-800 rounded-full h-2 relative">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full"
                              style={{ 
                                width: `${Math.min(95, (item.industry / Math.max(item.velocity, item.industry)) * 100)}%` 
                              }}
                            />
                          </div>
                          <span>Better</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeView === 'timeline' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white font-serif mb-4">Impact Timeline: From Implementation to ROI</h2>
                  <p className="text-slate-400">Typical customer journey and value realization</p>
                </div>
                <div className="space-y-8">
                  {[
                    {
                      phase: 'Week 1-2',
                      title: 'Implementation & Setup',
                      description: 'Platform deployment and initial configuration',
                      metrics: ['Platform configured', 'Integrations connected', 'Team onboarded'],
                      impact: 'Foundation set for automation'
                    },
                    {
                      phase: 'Week 3-4',
                      title: 'First Compliance Assessment',
                      description: 'Complete first framework assessment in record time',
                      metrics: ['First questionnaire: 2 hours vs 2 weeks', 'Evidence auto-collected', 'Gaps identified'],
                      impact: '80% time savings realized'
                    },
                    {
                      phase: 'Month 2',
                      title: 'Process Optimization',
                      description: 'Workflows streamlined, staff productivity increases',
                      metrics: ['Response time: <4 hours', 'Staff productivity: +300%', 'Process automation: 90%'],
                      impact: 'Operational excellence achieved'
                    },
                    {
                      phase: 'Month 3',
                      title: 'Business Impact',
                      description: 'Measurable business outcomes and ROI realization',
                      metrics: ['Enterprise deals: +40%', 'Sales cycle: -40%', 'Cost savings: $30K/month'],
                      impact: 'ROI targets exceeded'
                    },
                    {
                      phase: 'Month 6+',
                      title: 'Competitive Advantage',
                      description: 'Market leadership through compliance excellence',
                      metrics: ['Market expansion', 'Premium pricing', 'Customer trust'],
                      impact: 'Sustainable competitive moat'
                    }
                  ].map((stage, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{stage.title}</h3>
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/30">
                            {stage.phase}
                          </span>
                        </div>
                        
                        <p className="text-slate-400 mb-4">{stage.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-slate-300 mb-3">Key Metrics</h4>
                            <ul className="text-sm space-y-2">
                              {stage.metrics.map((metric, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-emerald-400 mr-3 mt-1 flex-shrink-0">✓</span>
                                  <span className="text-slate-300">{metric}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-slate-300 mb-3">Business Impact</h4>
                            <div className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-3">
                              <span className="text-sm text-emerald-400 font-medium">{stage.impact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ROIMetricsDashboard;