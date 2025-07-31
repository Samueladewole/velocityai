import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  FileText, 
  Zap, 
  Building, 
  Target, 
  DollarSign,
  ArrowRight,
  Star,
  Award,
  Lock,
  Eye,
  Activity,
  AlertTriangle,
  Database,
  Globe,
  Briefcase,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GDPRRoPAPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'comparison' | 'demo'>('overview');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const costComparison = [
    { 
      provider: "Velocity AI GDPR", 
      cost: "$28,000", 
      timeline: "4 weeks", 
      coverage: "100%",
      automation: "95%",
      support: "24/7"
    },
    { 
      provider: "Traditional Provider A", 
      cost: "$165,000", 
      timeline: "16+ weeks", 
      coverage: "85%",
      automation: "60%",
      support: "Business hours"
    },
    { 
      provider: "Traditional Company B", 
      cost: "$145,000", 
      timeline: "14+ weeks", 
      coverage: "80%",
      automation: "55%",
      support: "Business hours"
    },
    { 
      provider: "Traditional Company C", 
      cost: "$125,000", 
      timeline: "12+ weeks", 
      coverage: "75%",
      automation: "45%",
      support: "Email only"
    }
  ];

  const gdprFeatures = [
    {
      icon: Database,
      title: "Automated Data Mapping",
      description: "AI-powered discovery and mapping of personal data across all banking systems",
      benefits: ["Real-time data discovery", "Automated classification", "Cross-system mapping"]
    },
    {
      icon: FileText,
      title: "Dynamic RoPA Generation",
      description: "Automatically generate and maintain Records of Processing Activities",
      benefits: ["Auto-updating records", "Regulatory compliance", "Audit-ready documentation"]
    },
    {
      icon: Shield,
      title: "Privacy Impact Assessments",
      description: "Automated PIA generation and risk assessment for new processing activities",
      benefits: ["Risk scoring", "Mitigation recommendations", "Compliance validation"]
    },
    {
      icon: Users,
      title: "Data Subject Rights Management",
      description: "Streamlined handling of GDPR data subject requests and rights",
      benefits: ["Automated fulfillment", "Response tracking", "Audit trails"]
    },
    {
      icon: AlertTriangle,
      title: "Breach Notification System",
      description: "72-hour breach notification compliance with automated workflows",
      benefits: ["Incident detection", "Automated reporting", "Regulatory notifications"]
    },
    {
      icon: Activity,
      title: "Continuous Monitoring",
      description: "Real-time compliance monitoring and gap identification",
      benefits: ["Proactive alerts", "Compliance scoring", "Risk mitigation"]
    }
  ];

  const bankingUseCases = [
    {
      title: "Customer Data Protection",
      description: "Comprehensive protection of customer financial data across all touchpoints",
      metrics: ["2.5M+ customer records", "99.9% data accuracy", "0 breaches"]
    },
    {
      title: "Transaction Privacy",
      description: "Ensuring GDPR compliance for payment processing and transaction data",
      metrics: ["50M+ transactions/month", "Real-time anonymization", "Automated consent"]
    },
    {
      title: "Cross-Border Transfers",
      description: "Managing international data transfers with adequate safeguards",
      metrics: ["25+ countries", "BCR compliance", "Transfer impact assessments"]
    },
    {
      title: "Third-Party Risk Management",
      description: "GDPR compliance for vendor relationships and data sharing",
      metrics: ["150+ vendors", "Automated assessments", "Contract compliance"]
    }
  ];

  const competitiveAdvantages = [
    {
      title: "83% Cost Reduction",
      description: "Significantly lower total cost of ownership compared to traditional solutions",
      metric: "$137K saved vs traditional solutions"
    },
    {
      title: "4x Faster Implementation",
      description: "Rapid deployment with minimal disruption to banking operations",
      metric: "4 weeks vs 16+ weeks"
    },
    {
      title: "95% Automation",
      description: "Highest automation rate in the industry for GDPR compliance tasks",
      metric: "35% higher than competitors"
    },
    {
      title: "Banking-Specific",
      description: "Purpose-built for financial services with pre-configured banking workflows",
      metric: "100% banking compliance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-emerald-500 rounded-full mr-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <span className="text-emerald-400 font-semibold text-lg">GDPR Compliance Automation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Velocity GDPR RoPA Solution
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              AI-powered GDPR compliance automation for banking. Complete Records of Processing Activities (RoPA) 
              management with 83% cost savings vs traditional solutions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link 
                to="/demo/gdpr-ropa"
                className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Live Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors">
                Download Business Case
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">83%</div>
                <div className="text-sm text-slate-300">Cost Savings vs Traditional Solutions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">4 Weeks</div>
                <div className="text-sm text-slate-300">Implementation Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
                <div className="text-sm text-slate-300">Process Automation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">100%</div>
                <div className="text-sm text-slate-300">Banking Compliance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-500 rounded-full opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-4">
            {[
              { id: 'overview', label: 'Solution Overview', icon: Target },
              { id: 'features', label: 'GDPR Features', icon: Shield },
              { id: 'comparison', label: 'Cost Comparison', icon: DollarSign },
              { id: 'demo', label: 'Live Demo', icon: Zap }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-16">
            {/* Problem Statement */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                GDPR Compliance Shouldn't Break the Bank
              </h2>
              <p className="text-lg text-slate-600 max-w-4xl mx-auto">
                Traditional GDPR solutions are expensive, slow to implement, and require extensive manual work. 
                Velocity's AI-powered approach delivers complete compliance automation at a fraction of the cost.
              </p>
            </div>

            {/* Competitive Advantages Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {competitiveAdvantages.map((advantage, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-emerald-600 mb-2">{advantage.title}</div>
                  <p className="text-slate-600 mb-4">{advantage.description}</p>
                  <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                    {advantage.metric}
                  </div>
                </div>
              ))}
            </div>

            {/* Banking Use Cases */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Banking-Specific GDPR Use Cases</h3>
                <p className="text-slate-600">
                  Purpose-built for financial services with deep understanding of banking data flows and regulatory requirements
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {bankingUseCases.map((useCase, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                    <h4 className="font-semibold text-slate-900 mb-3">{useCase.title}</h4>
                    <p className="text-slate-600 mb-4">{useCase.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {useCase.metrics.map((metric, idx) => (
                        <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI Calculator Teaser */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Calculate Your GDPR Compliance Savings</h3>
              <p className="text-emerald-100 mb-6">
                See how much you can save with Velocity's automated GDPR solution compared to traditional approaches
              </p>
              <Link 
                to="/calculators/gdpr-roi"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                <DollarSign className="w-5 h-5" />
                Calculate ROI
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Complete GDPR Automation Suite
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                End-to-end GDPR compliance automation with AI-powered data discovery, 
                automated RoPA generation, and continuous monitoring.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gdprFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                    <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Deep Dive */}
            <div className="bg-slate-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                AI-Powered Data Discovery & Classification
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Discover</h4>
                  <p className="text-sm text-slate-600">AI scans all banking systems to identify personal data</p>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Classify</h4>
                  <p className="text-sm text-slate-600">Automatically categorizes data based on GDPR requirements</p>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Protect</h4>
                  <p className="text-sm text-slate-600">Implements appropriate safeguards and controls</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                83% Cost Savings vs Traditional Solutions
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Compare Velocity's AI-powered GDPR solution against traditional compliance platforms. 
                See the dramatic difference in cost, timeline, and automation.
              </p>
            </div>

            {/* Cost Comparison Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">GDPR Solution Comparison</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Provider</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Total Cost</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Timeline</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Coverage</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Automation</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Support</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {costComparison.map((provider, index) => (
                      <tr key={index} className={index === 0 ? 'bg-emerald-50' : ''}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">{provider.provider}</span>
                            {index === 0 && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                                <Star className="w-3 h-3" />
                                Best Value
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-900 font-medium">{provider.cost}</div>
                          {index === 0 && <div className="text-xs text-emerald-600">83% savings</div>}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{provider.timeline}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="text-slate-900">{provider.coverage}</div>
                            {provider.coverage === '100%' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="text-slate-900">{provider.automation}</div>
                            {provider.automation === '95%' && <Zap className="w-4 h-4 text-amber-500" />}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{provider.support}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TCO Breakdown */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Velocity AI GDPR</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Software License</span>
                    <span className="font-medium">$18,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Implementation</span>
                    <span className="font-medium">$6,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Training & Support</span>
                    <span className="font-medium">$4,000</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between">
                    <span className="font-semibold text-slate-900">Total Year 1</span>
                    <span className="font-bold text-emerald-600">$28,000</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Traditional Provider A</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Software License</span>
                    <span className="font-medium">$95,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Implementation</span>
                    <span className="font-medium">$45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Training & Support</span>
                    <span className="font-medium">$25,000</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between">
                    <span className="font-semibold text-slate-900">Total Year 1</span>
                    <span className="font-bold text-red-600">$165,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Calculator */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Your Potential Savings: $137,000</h3>
              <p className="text-emerald-100 mb-6">
                Based on industry average implementation costs for mid-size banks
              </p>
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div>
                  <div className="text-2xl font-bold mb-2">83%</div>
                  <div className="text-sm text-emerald-100">Cost Reduction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2">4x</div>
                  <div className="text-sm text-emerald-100">Faster Implementation</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2">6 months</div>
                  <div className="text-sm text-emerald-100">ROI Payback</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo Tab */}
        {activeTab === 'demo' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Experience GDPR Automation in Action
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                See how Velocity's AI-powered GDPR solution automatically discovers data, 
                generates RoPA records, and maintains continuous compliance.
              </p>
            </div>

            {/* Demo Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Interactive Demo</h3>
                  <p className="text-slate-600 mb-4">Click below to explore the full GDPR automation platform</p>
                  <Link 
                    to="/demo/gdpr-ropa"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    Launch Demo
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-3 bg-emerald-100 rounded-lg w-fit mx-auto mb-3">
                    <Database className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Data Discovery</h4>
                  <p className="text-sm text-slate-600">Watch AI automatically discover and classify personal data across banking systems</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">RoPA Generation</h4>
                  <p className="text-sm text-slate-600">See dynamic Records of Processing Activities created and maintained automatically</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Live Monitoring</h4>
                  <p className="text-sm text-slate-600">Experience real-time compliance monitoring and automated risk assessment</p>
                </div>
              </div>
            </div>

            {/* Demo Features */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">What You'll See in the Demo</h3>
                <div className="space-y-3">
                  {[
                    "AI-powered data discovery across core banking systems",
                    "Automated RoPA record generation and maintenance",
                    "Real-time privacy impact assessments",
                    "Data subject rights management workflows",
                    "Breach notification automation",
                    "Continuous compliance monitoring dashboard"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Ready to Get Started?</h3>
                <p className="text-slate-600 mb-6">
                  Schedule a personalized demo with our GDPR compliance experts to see how 
                  Velocity can transform your bank's privacy program.
                </p>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    <Users className="w-5 h-5" />
                    Schedule Demo Call
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                    <FileText className="w-5 h-5" />
                    Download Solution Brief
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Revolutionize Your GDPR Compliance?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join leading banks who've already reduced GDPR compliance costs by 83% with Velocity AI
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/demo/gdpr-ropa"
              className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Start Free Demo
            </Link>
            <button className="px-8 py-4 border-2 border-slate-400 text-slate-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPRRoPAPage;