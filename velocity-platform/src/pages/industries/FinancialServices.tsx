import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Shield, 
  Database, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Award, 
  Clock, 
  DollarSign,
  Users,
  Globe,
  FileText,
  Activity,
  Lock,
  Zap
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

const FinancialServices: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'solutions' | 'case-studies' | 'impact'>('overview');

  const bankingChallenges = [
    {
      title: "Complex Regulatory Landscape",
      description: "Multiple overlapping regulations (SOC 2, Basel III, GLBA, PCI DSS, ISAE 3000)",
      icon: Shield,
      solution: "Unified compliance platform handling all banking frameworks"
    },
    {
      title: "Operational Inefficiency",
      description: "Manual compliance processes consume significant staff time and resources",
      icon: Clock,
      solution: "95% automation of routine compliance tasks, freeing staff for strategic work"
    },
    {
      title: "Long Implementation Times",
      description: "6-12 months for traditional compliance implementations",
      icon: Clock,
      solution: "6-week implementation with pre-configured banking workflows"
    },
    {
      title: "Core Banking Integration",
      description: "Complex integration with legacy banking systems and modern fintech",
      icon: Database,
      solution: "Native integration with Temenos, Finastra, FIS, Jack Henry"
    }
  ];

  const bankingSolutions = [
    {
      name: "Banking ROI Calculator",
      description: "Automated ROI calculation and cost optimization for banking compliance",
      impact: "83% faster implementation",
      timeline: "4 weeks",
      features: ["Risk reduction metrics", "Basel III compliance tracking", "Regulatory efficiency gains", "Operational excellence dashboard"],
      value: "Significant operational improvements"
    },
    {
      name: "ISAE 3000 Evidence Collection",
      description: "Banking-specific evidence automation for service organization controls",
      impact: "88% faster audit readiness",
      timeline: "6 weeks",
      features: ["Core banking integration", "Control evidence automation", "SOX 404 coordination", "Audit trail generation"],
      value: "Streamlined audit processes"
    },
    {
      name: "Basel III Operational Risk",
      description: "Operational risk management and capital calculation automation",
      impact: "75% reduction in risk exposure",
      timeline: "8 weeks",
      features: ["Risk event automation", "Capital calculation", "Regulatory reporting", "Stress testing"],
      value: "Enhanced risk management"
    }
  ];

  const caseStudies = [
    {
      company: "Regional Bank (€15B Assets)",
      challenge: "Banking compliance cost optimization across 12 EU countries",
      solution: "Velocity Banking ROI Calculator with core banking integration",
      results: ["95% reduction in compliance overhead", "4-week implementation", "100% compliance audit pass", "Zero regulatory issues"],
      industry: "Community Banking"
    },
    {
      company: "Digital Bank (Fintech)",
      challenge: "SOC 2 Type II + ISAE 3000 for cloud-native banking platform",
      solution: "Complete Velocity platform with specialized banking agents",
      results: ["90% improvement in audit efficiency", "6-week dual certification", "96.8% audit success rate", "Real-time compliance monitoring"],
      industry: "Digital Banking"
    },
    {
      company: "Investment Bank (€50B Assets)",
      challenge: "Multi-jurisdictional compliance (US, EU, APAC) with complex trading systems",
      solution: "Velocity Enterprise with custom banking agents and global compliance",
      results: ["85% faster global compliance", "25-country compliance", "Real-time risk monitoring", "Automated regulatory reporting"],
      industry: "Investment Banking"
    }
  ];

  const competitorComparison = [
    {
      provider: "Velocity Banking Solution",
      gdprCost: "€28K",
      isaeCost: "€60K",
      timeline: "6 weeks",
      automation: "95%",
      bankingIntegration: "Native"
    },
    {
      provider: "OneTrust + Big 4 Consulting",
      gdprCost: "€165K",
      isaeCost: "€380K",
      timeline: "22+ weeks",
      automation: "20%",
      bankingIntegration: "Custom"
    },
    {
      provider: "ServiceNow GRC + Consulting",
      gdprCost: "€145K",
      isaeCost: "€350K",
      timeline: "18+ weeks",
      automation: "25%",
      bankingIntegration: "Limited"
    }
  ];

  const impactComparison = [
    {
      provider: "Velocity AI Banking",
      riskReduction: "88%",
      auditReadiness: "96%",
      timeline: "6 weeks",
      automation: "95%",
      bankingIntegration: "Native"
    },
    {
      provider: "Traditional Consulting",
      riskReduction: "65%",
      auditReadiness: "78%",
      timeline: "22+ weeks",
      automation: "20%",
      bankingIntegration: "Custom"
    },
    {
      provider: "GRC Tools Only",
      riskReduction: "45%",
      auditReadiness: "62%",
      timeline: "18+ weeks",
      automation: "25%",
      bankingIntegration: "Limited"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-blue-500 rounded-full mr-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Financial Services</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Banking-First
              <span className="block text-blue-400">Compliance Automation</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Purpose-built for financial institutions. Advanced automation delivering 83% faster implementation 
              and 88% improvement in audit readiness with comprehensive regulatory coverage.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button 
                onClick={() => navigate('/pricing')}
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Building className="w-5 h-5" />
                View Pricing
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/demo/banking-compliance')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                Banking Demo
              </button>
            </div>

            {/* Key Metrics for Banking */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">83%</div>
                <div className="text-sm text-slate-300">Banking Cost Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">88%</div>
                <div className="text-sm text-slate-300">ISAE 3000 Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">6 Weeks</div>
                <div className="text-sm text-slate-300">Implementation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">150+</div>
                <div className="text-sm text-slate-300">Banks Using Velocity</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'overview', label: 'Banking Overview', icon: Building },
            { id: 'solutions', label: 'Banking Solutions', icon: Shield },
            { id: 'case-studies', label: 'Customer Stories', icon: Award },
            { id: 'impact', label: 'Business Impact', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Why Banks Choose Velocity
              </h2>
              <p className="text-lg text-slate-600 max-w-4xl mx-auto">
                The only compliance platform built specifically for financial institutions with 
                pre-configured banking workflows, core system integrations, and regulatory expertise.
              </p>
            </div>

            {/* Banking Challenges & Solutions */}
            <div className="grid md:grid-cols-2 gap-8">
              {bankingChallenges.map((challenge, index) => {
                const Icon = challenge.icon;
                return (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <Icon className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{challenge.title}</h3>
                        <p className="text-slate-600 mb-4">{challenge.description}</p>
                      </div>
                    </div>
                    
                    <div className="pl-16">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium text-emerald-700">Velocity Solution:</span>
                      </div>
                      <p className="text-slate-700 text-sm">{challenge.solution}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Banking Statistics */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Banking Industry Impact</h3>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
                  <div className="text-slate-600">Financial Institutions</div>
                  <div className="text-xs text-slate-500 mt-1">Including Top 10 banks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">400%</div>
                  <div className="text-slate-600">ROI in First Year</div>
                  <div className="text-xs text-slate-500 mt-1">Regional bank average</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                  <div className="text-slate-600">Banking Automation</div>
                  <div className="text-xs text-slate-500 mt-1">vs 15% traditional</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">6 Weeks</div>
                  <div className="text-slate-600">Avg Implementation</div>
                  <div className="text-xs text-slate-500 mt-1">vs 6+ months traditional</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Solutions Tab */}
        {activeTab === 'solutions' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Banking-Specific Solutions
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Revolutionary automation for Banking ROI, ISAE 3000, and Basel III compliance 
                with pre-configured banking workflows.
              </p>
            </div>

            <div className="space-y-8">
              {bankingSolutions.map((solution, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-bold text-slate-900">{solution.name}</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-emerald-600">{solution.impact}</div>
                          <div className="text-sm text-slate-500">improvement</div>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 mb-6">{solution.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <div className="text-sm text-slate-500">Implementation</div>
                          <div className="font-semibold text-slate-900">{solution.timeline}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">Business Value</div>
                          <div className="font-semibold text-slate-900">{solution.value}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Key Features:</h4>
                      <div className="space-y-2">
                        {solution.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-sm text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/solutions/gdpr-ropa')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mr-4"
              >
                <Shield className="w-5 h-5" />
                Explore Banking ROI
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/solutions/isae-3000')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Database className="w-5 h-5" />
                Explore ISAE 3000
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Case Studies Tab */}
        {activeTab === 'case-studies' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Banking Customer Success Stories
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Real results from financial institutions using Velocity for compliance automation
              </p>
            </div>

            <div className="space-y-8">
              {caseStudies.map((study, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{study.company}</h3>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {study.industry}
                      </span>
                    </div>
                    <Award className="w-8 h-8 text-amber-500" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Challenge:</h4>
                      <p className="text-slate-600 mb-6">{study.challenge}</p>
                      
                      <h4 className="font-semibold text-slate-900 mb-3">Solution:</h4>
                      <p className="text-slate-600">{study.solution}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Results:</h4>
                      <div className="space-y-2">
                        {study.results.map((result, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-sm text-slate-700">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Impact Tab */}
        {activeTab === 'impact' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Banking Business Impact
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Measurable outcomes and strategic advantages for financial institutions
              </p>
            </div>

            {/* Competitor Comparison */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Banking Impact Comparison</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Provider</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Risk Reduction</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Audit Readiness</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Timeline</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Automation</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Banking Integration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {impactComparison.map((provider, index) => (
                      <tr key={index} className={index === 0 ? 'bg-emerald-50' : ''}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">{provider.provider}</span>
                            {index === 0 && (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                                Best Value
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{provider.riskReduction}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{provider.auditReadiness}</td>
                        <td className="px-6 py-4 text-slate-600">{provider.timeline}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900">{provider.automation}</span>
                            {provider.automation === '95%' && <Zap className="w-4 h-4 text-amber-500" />}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{provider.bankingIntegration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Building className="w-5 h-5" />
                View Pricing Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Bank's Compliance?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join 150+ financial institutions using Velocity for automated compliance
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Target className="w-5 h-5" />
              Start Banking Assessment
            </button>
            <button 
              onClick={() => navigate('/demo/banking-compliance')}
              className="px-8 py-4 border-2 border-slate-400 text-slate-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
            >
              Schedule Banking Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialServices;