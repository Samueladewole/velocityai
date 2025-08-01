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
  const [activeTab, setActiveTab] = useState<'overview' | 'solutions' | 'case-studies' | 'pricing'>('overview');

  const bankingChallenges = [
    {
      title: "Complex Regulatory Landscape",
      description: "Multiple overlapping regulations (SOC 2, Basel III, GLBA, PCI DSS, ISAE 3000)",
      icon: Shield,
      solution: "Unified compliance platform handling all banking frameworks"
    },
    {
      title: "High Consulting Costs",
      description: "Traditional Big 4 consulting costs €380K+ annually for comprehensive compliance",
      icon: DollarSign,
      solution: "83-88% cost reduction with AI automation"
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
      savings: "83% cost reduction",
      timeline: "4 weeks",
      features: ["Compliance cost analysis", "Basel III cost calculations", "Regulatory efficiency metrics", "Banking automation ROI"],
      price: "€28K vs €165K traditional"
    },
    {
      name: "ISAE 3000 Evidence Collection",
      description: "Banking-specific evidence automation for service organization controls",
      savings: "88% vs Big 4",
      timeline: "6 weeks",
      features: ["Core banking integration", "Control evidence automation", "SOX 404 coordination", "Audit trail generation"],
      price: "€60K vs €380K Big 4"
    },
    {
      name: "Basel III Operational Risk",
      description: "Operational risk management and capital calculation automation",
      savings: "75% vs manual",
      timeline: "8 weeks",
      features: ["Risk event automation", "Capital calculation", "Regulatory reporting", "Stress testing"],
      price: "Included in Enterprise"
    }
  ];

  const caseStudies = [
    {
      company: "Regional Bank (€15B Assets)",
      challenge: "Banking compliance cost optimization across 12 EU countries",
      solution: "Velocity Banking ROI Calculator with core banking integration",
      results: ["€150K saved vs traditional solution", "4-week implementation", "100% compliance audit pass", "Zero regulatory issues"],
      industry: "Community Banking"
    },
    {
      company: "Digital Bank (Fintech)",
      challenge: "SOC 2 Type II + ISAE 3000 for cloud-native banking platform",
      solution: "Complete Velocity platform with specialized banking agents",
      results: ["€280K saved annually", "6-week dual certification", "96.8% audit success rate", "Real-time compliance monitoring"],
      industry: "Digital Banking"
    },
    {
      company: "Investment Bank (€50B Assets)",
      challenge: "Multi-jurisdictional compliance (US, EU, APAC) with complex trading systems",
      solution: "Velocity Enterprise with custom banking agents and global compliance",
      results: ["€500K+ saved vs Big 4", "25-country compliance", "Real-time risk monitoring", "Automated regulatory reporting"],
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
              Purpose-built for financial institutions. Banking ROI calculations (83% cost savings) 
              and ISAE 3000 evidence collection (88% vs Big 4 consulting).
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button 
                onClick={() => navigate('/pricing/financial-services')}
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Building className="w-5 h-5" />
                View Banking Pricing
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
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-4">
            {[
              { id: 'overview', label: 'Banking Overview', icon: Building },
              { id: 'solutions', label: 'Banking Solutions', icon: Shield },
              { id: 'case-studies', label: 'Customer Stories', icon: Award },
              { id: 'pricing', label: 'Banking Pricing', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 €{
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
                  <div className="text-3xl font-bold text-emerald-600 mb-2">€2.1M</div>
                  <div className="text-slate-600">Average 3-Year Savings</div>
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
                          <div className="text-lg font-bold text-emerald-600">{solution.savings}</div>
                          <div className="text-sm text-slate-500">savings</div>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 mb-6">{solution.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <div className="text-sm text-slate-500">Implementation</div>
                          <div className="font-semibold text-slate-900">{solution.timeline}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">Total Cost</div>
                          <div className="font-semibold text-slate-900">{solution.price}</div>
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

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Banking-Specific Pricing
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Transparent pricing designed for financial institutions with massive cost savings
              </p>
            </div>

            {/* Competitor Comparison */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Banking Solution Comparison</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Provider</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Banking ROI</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">ISAE 3000</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Timeline</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Automation</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-500">Banking Integration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {competitorComparison.map((provider, index) => (
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
                        <td className="px-6 py-4 font-medium text-slate-900">{provider.gdprCost}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{provider.isaeCost}</td>
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
                onClick={() => navigate('/pricing/financial-services')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Building className="w-5 h-5" />
                View Full Banking Pricing
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