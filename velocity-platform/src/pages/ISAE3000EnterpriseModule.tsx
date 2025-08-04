import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle,
  ArrowRight,
  Building,
  Award,
  Clock,
  TrendingUp,
  Database,
  Activity,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { PublicHeader } from '../components/common/PublicHeader';

const ISAE3000EnterpriseModule: React.FC = () => {
  const navigate = useNavigate();

  const moduleFeatures = [
    {
      title: "Banking-Specific AI Agents",
      description: "12 specialized agents for ISAE 3000 evidence collection",
      icon: Database,
      benefits: [
        "Automated banking system integration (Temenos, Finastra, FIS)",
        "Real-time evidence collection from core banking systems",
        "AI-powered ISAE 3000 control categorization (CC1-CC9)",
        "Continuous monitoring and compliance validation"
      ]
    },
    {
      title: "Evidence Automation",
      description: "Complete automation of ISAE 3000 evidence workflows",
      icon: Activity,
      benefits: [
        "100% ISAE 3000 control coverage",
        "Automated evidence collection and validation",
        "Real-time compliance monitoring",
        "Audit-ready documentation generation"
      ]
    },
    {
      title: "Banking Integration",
      description: "Native integration with banking infrastructure",
      icon: Building,
      benefits: [
        "Core banking system connectivity",
        "Payment processing integration",
        "Risk management system monitoring",
        "Regulatory reporting automation"
      ]
    }
  ];

  const valueMetrics = [
    {
      metric: "88%",
      description: "Cost reduction vs Big 4 consulting",
      icon: TrendingUp
    },
    {
      metric: "6 weeks",
      description: "Time to audit-ready compliance",
      icon: Clock
    },
    {
      metric: "100%",
      description: "ISAE 3000 control coverage",
      icon: Shield
    },
    {
      metric: "95%",
      description: "Evidence collection automation",
      icon: Zap
    }
  ];

  const useCases = [
    {
      title: "Service Organization Control Reviews",
      description: "Automated evidence collection for Type I and Type II reports",
      outcomes: ["Continuous control monitoring", "Real-time risk assessment", "Automated documentation"]
    },
    {
      title: "Banking Compliance Validation",
      description: "Comprehensive validation of banking controls and processes",
      outcomes: ["Control effectiveness testing", "Gap identification", "Remediation tracking"]
    },
    {
      title: "Regulatory Reporting",
      description: "Automated generation of ISAE 3000 compliance reports",
      outcomes: ["Audit-ready documentation", "Stakeholder reporting", "Regulatory submissions"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Enterprise Banking Module
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              ISAE 3000
              <span className="text-emerald-400"> Evidence Automation</span>
            </h1>
            
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              Premium enterprise module for banking institutions. Transform ISAE 3000 compliance 
              from months to weeks with AI-powered automation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/velocity/pricing')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
              >
                View Enterprise Pricing
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </button>
              <button
                onClick={() => navigate('/velocity/demo')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Value Metrics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Enterprise-Grade Banking Compliance
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Designed specifically for banking institutions requiring ISAE 3000 compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">{metric.metric}</div>
                  <div className="text-slate-600">{metric.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Banking-Specific Capabilities
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Advanced features designed exclusively for banking ISAE 3000 compliance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {moduleFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 mb-6">{feature.description}</p>
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Banking Use Cases
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Real-world applications for banking institutions
            </p>
          </div>

          <div className="space-y-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-8">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{useCase.title}</h3>
                    <p className="text-slate-600">{useCase.description}</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {useCase.outcomes.map((outcome, outcomeIndex) => (
                        <div key={outcomeIndex} className="flex items-center gap-3 bg-white p-4 rounded-lg">
                          <Award className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Integration */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Part of Velocity Enterprise Platform
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            ISAE 3000 Evidence Automation is included as a premium module within 
            Velocity's comprehensive enterprise platform.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Users className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Enterprise Support</h3>
              <p className="text-slate-400 text-sm">Dedicated banking compliance specialists</p>
            </div>
            <div className="text-center">
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Custom Configuration</h3>
              <p className="text-slate-400 text-sm">Tailored for your banking infrastructure</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
              <p className="text-slate-400 text-sm">Bank-grade security and compliance</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/pricing')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
            >
              Get Enterprise Pricing
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </button>
            <button
              onClick={() => navigate('/velocity/contact')}
              className="px-8 py-4 border-2 border-slate-400 text-slate-300 rounded-xl font-medium hover:border-white hover:text-white transition-all duration-300"
            >
              Contact Sales Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ISAE3000EnterpriseModule;