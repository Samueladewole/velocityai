import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface CompetitorComparison {
  feature: string;
  velocity: string | number;
  competitor1: string | number;
  competitor2: string | number;
  competitor3: string | number;
  advantage: string;
}

interface MarketAdvantage {
  title: string;
  description: string;
  impact: string;
  metrics: string[];
  icon: string;
  color: string;
}

const CompetitiveAdvantageShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'speed' | 'intelligence' | 'coverage' | 'automation'>('speed');

  const competitorData: CompetitorComparison[] = [
    {
      feature: 'Questionnaire Response Time',
      velocity: '2 hours',
      competitor1: '2-4 weeks',
      competitor2: '1-3 weeks',
      competitor3: '3-6 weeks',
      advantage: '2300% faster'
    },
    {
      feature: 'Framework Coverage',
      velocity: '6+ frameworks',
      competitor1: '1-2 frameworks',
      competitor2: '2-3 frameworks',
      competitor3: '1 framework',
      advantage: '3x more comprehensive'
    },
    {
      feature: 'Evidence Automation',
      velocity: '95%',
      competitor1: '40%',
      competitor2: '60%',
      competitor3: '30%',
      advantage: '58% higher automation'
    },
    {
      feature: 'AI Accuracy Rate',
      velocity: '96.2%',
      competitor1: '75%',
      competitor2: '82%',
      competitor3: '70%',
      advantage: '17% more accurate'
    },
    {
      feature: 'Implementation Time',
      velocity: '2 weeks',
      competitor1: '3-6 months',
      competitor2: '2-4 months',
      competitor3: '4-8 months',
      advantage: '90% faster deployment'
    },
    {
      feature: 'Annual Platform Cost',
      velocity: '$120K',
      competitor1: '$200K+',
      competitor2: '$180K+',
      competitor3: '$250K+',
      advantage: '40% more cost-effective'
    },
    {
      feature: 'Cross-Framework Intelligence',
      velocity: 'Advanced',
      competitor1: 'None',
      competitor2: 'Basic',
      competitor3: 'None',
      advantage: 'Unique capability'
    },
    {
      feature: 'Real-time Monitoring',
      velocity: 'Continuous',
      competitor1: 'Quarterly',
      competitor2: 'Monthly',
      competitor3: 'Bi-annual',
      advantage: '100% more frequent'
    }
  ];

  const marketAdvantages: MarketAdvantage[] = [
    {
      title: 'Speed Advantage',
      description: 'Transform weeks of manual work into hours of automated intelligence',
      impact: '2300% faster than traditional approaches',
      metrics: [
        '2 hours vs 2 weeks for questionnaire responses',
        '4 weeks vs 6 months for audit preparation',
        'Same-day vendor assessments vs 1-month cycles'
      ],
      icon: '⚡',
      color: 'blue'
    },
    {
      title: 'Intelligence Advantage',
      description: 'AI-powered cross-framework analysis that learns and improves',
      impact: '96.2% accuracy vs 70% industry average',
      metrics: [
        'Cross-framework pattern recognition',
        'Predictive gap analysis',
        'Smart recommendation engine',
        'Continuous learning from customer data'
      ],
      icon: '🧠',
      color: 'purple'
    },
    {
      title: 'Coverage Advantage',
      description: 'Comprehensive multi-framework support in a single platform',
      impact: '6+ frameworks vs single-framework tools',
      metrics: [
        'SOC 2, ISO 27001, GDPR, HIPAA, CIS Controls, PCI DSS',
        'Unified compliance dashboard',
        'Integrated evidence management',
        'Harmonized reporting across frameworks'
      ],
      icon: '🎯',
      color: 'green'
    },
    {
      title: 'Automation Advantage',
      description: 'End-to-end automation from evidence collection to reporting',
      impact: '95% automation vs 40% industry standard',
      metrics: [
        'Automated evidence collection from 50+ integrations',
        'AI-powered answer generation',
        'Continuous compliance monitoring',
        'Real-time gap detection and remediation'
      ],
      icon: '🤖',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'text-blue-600' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', accent: 'text-purple-600' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: 'text-green-600' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', accent: 'text-orange-600' }
    };
    return colors[color as keyof typeof colors] || colors.blue;
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
                🏆 Market Leadership • Unmatched Performance • Sustainable Advantage
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-light text-white font-serif mb-4">
              Why Velocity Wins
              <span className="block font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                Every Time
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light">
              See how Velocity's unique approach creates unmatched competitive advantages 
              that transform compliance from cost center to profit driver.
            </p>
          </div>

          {/* Competitive Comparison Table */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white font-serif mb-4">
                Head-to-Head Comparison
              </h2>
              <p className="text-slate-400">
                Velocity vs leading compliance platforms
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-700">
                    <th className="text-left py-4 px-4 font-semibold text-slate-300">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold bg-emerald-500/20 text-emerald-400 rounded-t-lg border border-emerald-500/30">
                      🚀 Velocity
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-400">Competitor A</th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-400">Competitor B</th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-400">Competitor C</th>
                    <th className="text-center py-4 px-4 font-semibold text-emerald-400">Advantage</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorData.map((row, index) => (
                    <tr key={index} className="border-b border-slate-800 hover:bg-white/5">
                      <td className="py-4 px-4 font-medium text-white">{row.feature}</td>
                      <td className="py-4 px-4 text-center bg-emerald-500/10 font-bold text-emerald-400 border-x border-emerald-500/20">
                        {row.velocity}
                      </td>
                      <td className="py-4 px-4 text-center text-slate-400">{row.competitor1}</td>
                      <td className="py-4 px-4 text-center text-slate-400">{row.competitor2}</td>
                      <td className="py-4 px-4 text-center text-slate-400">{row.competitor3}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/30">
                          {row.advantage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Market Advantages */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-white font-serif mb-8">
              Four Pillars of Competitive Advantage
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {marketAdvantages.map((advantage, index) => {
                const gradientColors = {
                  blue: 'from-blue-400 to-cyan-500',
                  purple: 'from-purple-400 to-pink-500',
                  green: 'from-emerald-400 to-emerald-500',
                  orange: 'from-amber-400 to-orange-500'
                };
                return (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="text-3xl">{advantage.icon}</div>
                      <div>
                        <h3 className={`text-xl font-bold bg-gradient-to-r ${gradientColors[advantage.color as keyof typeof gradientColors]} bg-clip-text text-transparent`}>
                          {advantage.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">{advantage.description}</p>
                      </div>
                    </div>
                    
                    <div className={`text-lg font-bold bg-gradient-to-r ${gradientColors[advantage.color as keyof typeof gradientColors]} bg-clip-text text-transparent mb-4`}>
                      {advantage.impact}
                    </div>
                    
                    <ul className="space-y-3">
                      {advantage.metrics.map((metric, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-emerald-400 mr-3 mt-1 flex-shrink-0">✓</span>
                          <span className="text-slate-300 text-sm">{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Market Position */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white font-serif mb-4">
                Market Leadership Position
              </h2>
              <p className="text-slate-400">
                How Velocity creates sustainable competitive moats
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">First-Mover Advantage</h3>
                <p className="text-slate-400 text-sm">
                  First platform to offer cross-framework AI intelligence. 
                  18-month technical lead over nearest competitor.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Network Effects</h3>
                <p className="text-slate-400 text-sm">
                  Each customer makes the platform smarter. 
                  AI learns from 500+ implementations for better accuracy.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Switching Costs</h3>
                <p className="text-slate-400 text-sm">
                  Deep integration with customer workflows. 
                  High switching costs create customer stickiness.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Testimonials on Competitive Advantage */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white font-serif mb-4">
                What Customers Say About Our Advantage
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/20">
                <div className="text-4xl mb-4">💬</div>
                <blockquote className="text-slate-300 mb-4 leading-relaxed">
                  "We evaluated 5 compliance platforms. Velocity was 10x faster and 3x more comprehensive. 
                  No other platform came close to their AI capabilities."
                </blockquote>
                <div className="text-sm">
                  <div className="font-semibold text-white">Sarah Chen</div>
                  <div className="text-slate-400">CISO, TechFlow SaaS</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm p-6 rounded-2xl border border-emerald-500/20">
                <div className="text-4xl mb-4">🏆</div>
                <blockquote className="text-slate-300 mb-4 leading-relaxed">
                  "Velocity turned compliance into our competitive advantage. 
                  We win enterprise deals specifically because of our compliance readiness."
                </blockquote>
                <div className="text-sm">
                  <div className="font-semibold text-white">Marcus Rodriguez</div>
                  <div className="text-slate-400">VP Sales, MedSecure Health</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20">
                <div className="text-4xl mb-4">🚀</div>
                <blockquote className="text-slate-300 mb-4 leading-relaxed">
                  "The ROI was obvious from day one. Velocity pays for itself in the first month 
                  through time savings alone."
                </blockquote>
                <div className="text-sm">
                  <div className="font-semibold text-white">David Park</div>
                  <div className="text-slate-400">CFO, GlobalPay Fintech</div>
                </div>
              </div>
            </div>
          </div>

          {/* Competitive Moats */}
          <div className="bg-gradient-to-r from-slate-900/90 to-blue-900/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white font-serif mb-4">
                Sustainable Competitive Moats
              </h2>
              <p className="text-slate-300">
                Why our advantages compound over time
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-3">🧠</span>
                  Data Network Effects
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>AI learns from 500+ customer implementations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>Pattern recognition improves with scale</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>Each new framework makes all frameworks smarter</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>Proprietary training data creates accuracy advantage</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-3">🔧</span>
                  Technical Barriers
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>3+ years of AI model development</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>Deep integration with 50+ enterprise systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>Proprietary cross-framework intelligence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>High-quality training datasets</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-3">👥</span>
                  Customer Lock-in
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>Deep workflow integration reduces switching costs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>Historical compliance data creates stickiness</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>Team training and process optimization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>Continuous value creation prevents churn</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="mr-3">⚡</span>
                  Speed Advantage
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>18-month technical lead over competitors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>Faster feature development cycles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>First to market with new frameworks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-400 mr-3 mt-1 flex-shrink-0">•</span>
                    <span>Rapid response to regulatory changes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-4 font-serif">
                Experience the Competitive Advantage
              </h2>
              <p className="text-xl text-white/90 mb-6">
                See why industry leaders choose Velocity to stay ahead
              </p>
              <div className="flex justify-center gap-4">
                <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-white/90 transition-colors">
                  Schedule Competitive Demo
                </button>
                <button className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                  View Full Comparison
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveAdvantageShowcase;