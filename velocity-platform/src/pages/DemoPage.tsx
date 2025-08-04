import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Shield, 
  Database, 
  Activity, 
  Building, 
  Heart, 
  Factory, 
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Target,
  Award,
  TrendingUp,
  Globe,
  Lock
} from 'lucide-react';
import { PublicHeader } from '../components/common/PublicHeader';

const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const demoScenarios = [
    {
      id: 'startup-soc2',
      title: 'Startup SOC 2',
      description: 'Fast-growing SaaS company preparing for first SOC 2 audit',
      industry: 'SaaS',
      icon: Zap,
      duration: '15 min',
      complexity: 'Beginner',
      highlights: [
        'Automated evidence collection from AWS',
        'Real-time Trust Score tracking',
        '90-day implementation timeline',
        'Cost comparison vs traditional consultants'
      ],
      metrics: {
        timeToCompliance: '90 days',
        costSavings: '75%',
        automation: '92%'
      }
    },
    {
      id: 'healthcare-hipaa',
      title: 'Healthcare HIPAA',
      description: 'Medical device company ensuring HIPAA compliance',
      industry: 'Healthcare',
      icon: Heart,
      duration: '20 min',
      complexity: 'Intermediate',
      highlights: [
        'PHI discovery and classification',
        'BAA management automation',
        'EMR system integration',
        'Patient data breach prevention'
      ],
      metrics: {
        timeToCompliance: '6 weeks',
        costSavings: '80%',
        automation: '95%'
      }
    },
    {
      id: 'fintech-multi',
      title: 'Fintech Multi-Framework',
      description: 'Financial services with SOC 2, PCI DSS, and ISO 27001',
      industry: 'Fintech',
      icon: Building,
      duration: '25 min',
      complexity: 'Advanced',
      highlights: [
        'Multi-framework orchestration',
        'Banking system integrations',
        'Regulatory reporting automation',
        'Cross-compliance mapping'
      ],
      metrics: {
        timeToCompliance: '12 weeks',
        costSavings: '85%',
        automation: '88%'
      }
    },
    {
      id: 'enterprise-iso',
      title: 'Enterprise ISO 27001',
      description: 'Large enterprise managing global compliance requirements',
      industry: 'Enterprise',
      icon: Globe,
      duration: '30 min',
      complexity: 'Expert',
      highlights: [
        'Multi-subsidiary compliance',
        'Global policy management',
        'Risk assessment automation',
        'Continuous monitoring across regions'
      ],
      metrics: {
        timeToCompliance: '16 weeks',
        costSavings: '70%',
        automation: '90%'
      }
    },
    {
      id: 'ai-gdpr',
      title: 'AI Company EU Compliance',
      description: 'AI startup navigating EU AI Act and GDPR',
      industry: 'AI/ML',
      icon: Database,
      duration: '18 min',
      complexity: 'Intermediate',
      highlights: [
        'GDPR Article 30 RoPA automation',
        'AI Act compliance framework',
        'Data processing mapping',
        'International transfer management'
      ],
      metrics: {
        timeToCompliance: '8 weeks',
        costSavings: '82%',
        automation: '94%'
      }
    },
    {
      id: 'manufacturing-nis2',
      title: 'Manufacturing NIS2',
      description: 'Manufacturing company preparing for NIS2 requirements',
      industry: 'Manufacturing',
      icon: Factory,
      duration: '22 min',
      complexity: 'Advanced',
      highlights: [
        'OT/IT security integration',
        'Supply chain risk assessment',
        'Incident reporting automation',
        'Critical infrastructure protection'
      ],
      metrics: {
        timeToCompliance: '14 weeks',
        costSavings: '78%',
        automation: '87%'
      }
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'text-emerald-400 bg-emerald-500/20';
      case 'Intermediate': return 'text-blue-400 bg-blue-500/20';
      case 'Advanced': return 'text-amber-400 bg-amber-500/20';
      case 'Expert': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const handleDemoLaunch = (demoId: string) => {
    // Navigate to specific demo or dashboard with demo state
    navigate('/velocity/dashboard', { 
      state: { 
        demoMode: true, 
        scenario: demoId,
        fromDemo: true 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 pt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Play className="w-4 h-4" />
              Interactive Demos
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              Experience Velocity
              <span className="text-emerald-400"> In Action</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-12 max-w-4xl mx-auto">
              Explore realistic compliance scenarios and see how Velocity transforms 
              traditional compliance processes with AI-powered automation.
            </p>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">15-30 Minutes</h3>
                <p className="text-slate-400 text-sm">Interactive scenarios</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Real Scenarios</h3>
                <p className="text-slate-400 text-sm">Industry-specific use cases</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Live Data</h3>
                <p className="text-slate-400 text-sm">Realistic compliance metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Scenarios */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Choose Your Compliance Journey
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Select an industry scenario that matches your organization's needs and explore 
              how Velocity accelerates compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {demoScenarios.map((demo) => {
              const Icon = demo.icon;
              const isSelected = selectedDemo === demo.id;
              
              return (
                <div 
                  key={demo.id}
                  className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 cursor-pointer flex flex-col h-full ${
                    isSelected 
                      ? 'border-emerald-500 shadow-emerald-500/25 scale-105' 
                      : 'border-slate-200 hover:border-emerald-300 hover:shadow-xl'
                  }`}
                  onClick={() => setSelectedDemo(isSelected ? null : demo.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs text-emerald-600 font-medium mb-1">{demo.industry}</div>
                        <h3 className="text-lg font-bold text-slate-900">{demo.title}</h3>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(demo.complexity)}`}>
                      {demo.complexity}
                    </div>
                  </div>

                  <p className="text-slate-600 mb-6">{demo.description}</p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-bold text-emerald-600">{demo.metrics.timeToCompliance}</div>
                      <div className="text-xs text-slate-500">Time to Compliance</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{demo.metrics.costSavings}</div>
                      <div className="text-xs text-slate-500">Cost Savings</div>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{demo.metrics.automation}</div>
                      <div className="text-xs text-slate-500">Automation</div>
                    </div>
                  </div>

                  {/* Highlights */}
                  {isSelected && (
                    <div className="mb-6 space-y-2 animate-in slide-in-from-top-2 duration-300">
                      <h4 className="font-semibold text-slate-900 mb-3">Demo Highlights:</h4>
                      {demo.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Spacer to push CTA to bottom */}
                  <div className="flex-grow"></div>

                  {/* CTA */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{demo.duration}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDemoLaunch(demo.id);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Launch Demo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-serif">
            Why Experience Our Demos?
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            See firsthand how Velocity transforms compliance from a burden into a competitive advantage
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Real Compliance Scenarios',
                description: 'Experience actual compliance challenges and solutions'
              },
              {
                icon: TrendingUp,
                title: 'Live ROI Calculations',
                description: 'See real-time cost savings and efficiency gains'
              },
              {
                icon: Users,
                title: 'Industry Expertise',
                description: 'Scenarios built by compliance professionals'
              },
              {
                icon: Award,
                title: 'Proven Outcomes',
                description: 'Based on real customer success stories'
              }
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{benefit.title}</h3>
                  <p className="text-slate-400">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16">
            <div className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 rounded-2xl p-8 border border-emerald-500/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Transform Your Compliance?
              </h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Experience the power of AI-driven compliance automation. Start with a demo or get a personalized assessment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/velocity/assessment')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                >
                  <Target className="w-5 h-5" />
                  Start Free Assessment
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/velocity/contact')}
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-400 text-slate-300 rounded-lg font-medium hover:border-white hover:text-white transition-colors"
                >
                  <Users className="w-5 h-5" />
                  Talk to Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoPage;