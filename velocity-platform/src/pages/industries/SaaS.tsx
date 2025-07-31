import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cloud, 
  Shield, 
  Users, 
  Database, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Clock, 
  DollarSign,
  Activity,
  Globe,
  Server,
  Eye,
  Zap,
  Building
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

const SaaS: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'solutions' | 'case-studies' | 'pricing'>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-12">
            {/* Industry Overview */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  SaaS Compliance Automation
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  Scale your SaaS business with automated SOC 2, ISO 27001, and GDPR compliance designed for multi-tenant architectures.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">SOC 2 Type II</h3>
                      <p className="text-slate-600 text-sm">Automated evidence collection for multi-tenant environments</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Global Privacy</h3>
                      <p className="text-slate-600 text-sm">GDPR, CCPA, and emerging privacy law automation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Cloud className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Cloud-Native</h3>
                      <p className="text-slate-600 text-sm">Built for AWS, Azure, GCP multi-cloud environments</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">SaaS Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                    <div className="text-sm text-slate-600">SaaS Companies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">45 Days</div>
                    <div className="text-sm text-slate-600">Avg Audit Readiness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">96.8%</div>
                    <div className="text-sm text-slate-600">First-Time Pass Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">$120K</div>
                    <div className="text-sm text-slate-600">Avg Annual Savings</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Challenges */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                SaaS Compliance Challenges
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Users className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Tenancy</h3>
                  <p className="text-slate-600">
                    Ensuring customer data isolation and security controls across thousands of tenants and environments.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Globe className="w-8 h-8 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Global Scale</h3>
                  <p className="text-slate-600">
                    Managing compliance across multiple regions, jurisdictions, and regulatory frameworks simultaneously.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Zap className="w-8 h-8 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Rapid Growth</h3>
                  <p className="text-slate-600">
                    Maintaining compliance during hypergrowth phases with scaling infrastructure and team changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'solutions':
        return (
          <div className="space-y-12">
            {/* AI Agents for SaaS */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                SaaS AI Agents
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: 'Multi-Tenant Security Agent',
                    description: 'Automated tenant isolation monitoring',
                    automation: 98,
                    icon: Users,
                    capabilities: ['Tenant isolation verification', 'Data segregation monitoring', 'Access control enforcement']
                  },
                  {
                    name: 'Cloud Infrastructure Agent',
                    description: 'Multi-cloud security and compliance',
                    automation: 96,
                    icon: Cloud,
                    capabilities: ['AWS/Azure/GCP monitoring', 'Infrastructure as code', 'Config drift detection']
                  },
                  {
                    name: 'API Security Agent',
                    description: 'Automated API security and monitoring',
                    automation: 94,
                    icon: Server,
                    capabilities: ['API endpoint monitoring', 'Rate limiting verification', 'Authentication testing']
                  },
                  {
                    name: 'Data Privacy Agent',
                    description: 'Global privacy compliance automation',
                    automation: 92,
                    icon: Globe,
                    capabilities: ['GDPR automation', 'CCPA compliance', 'Data residency monitoring']
                  },
                  {
                    name: 'DevOps Security Agent',
                    description: 'CI/CD pipeline security automation',
                    automation: 90,
                    icon: Activity,
                    capabilities: ['Pipeline security scanning', 'Secret detection', 'Deployment monitoring']
                  },
                  {
                    name: 'Customer Trust Agent',
                    description: 'Customer-facing compliance automation',
                    automation: 88,
                    icon: Shield,
                    capabilities: ['Trust center updates', 'Compliance reporting', 'Customer questionnaires']
                  }
                ].map((agent, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <agent.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{agent.name}</h3>
                        <p className="text-sm text-slate-600">{agent.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">{agent.automation}%</div>
                        <div className="text-xs text-slate-500">Automation</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {agent.capabilities.map((capability, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-slate-700">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Framework Coverage */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Compliance Framework Coverage
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { name: 'SOC 2 Type II', coverage: '96%', icon: Shield },
                  { name: 'ISO 27001', coverage: '94%', icon: Globe },
                  { name: 'GDPR', coverage: '98%', icon: Eye },
                  { name: 'CCPA', coverage: '92%', icon: Lock }
                ].map((framework, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                    <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                      <framework.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{framework.name}</h3>
                    <div className="text-2xl font-bold text-emerald-600 mb-1">{framework.coverage}</div>
                    <p className="text-sm text-slate-600">Automation Coverage</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'case-studies':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">SaaS Success Stories</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                See how SaaS companies have achieved compliance at scale with Velocity
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">💻</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Enterprise SaaS Company</h3>
                    <span className="text-blue-600 font-medium">Multi-Tenant Platform</span>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  <strong>Challenge:</strong> SOC 2 Type II certification for multi-tenant platform serving Fortune 500 customers with strict security requirements
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-xl font-bold text-emerald-600">$120K</div>
                    <div className="text-sm text-slate-600">Annual Savings</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">45 Days</div>
                    <div className="text-sm text-slate-600">Audit Readiness</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 italic text-sm">
                    "Velocity's AI agents worked around the clock collecting evidence. What used to take months now happens automatically."
                  </p>
                  <p className="text-slate-500 text-xs mt-2">— CISO</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🚀</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Hypergrowth Startup</h3>
                    <span className="text-purple-600 font-medium">Series B SaaS</span>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  <strong>Challenge:</strong> Rapid compliance for Series B funding requirements across multiple frameworks with limited compliance team
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">3 Weeks</div>
                    <div className="text-sm text-slate-600">Implementation</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">4</div>
                    <div className="text-sm text-slate-600">Frameworks</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 italic text-sm">
                    "Velocity made our Series B possible. We went from zero compliance to investment-ready in just 3 weeks."
                  </p>
                  <p className="text-slate-500 text-xs mt-2">— Co-Founder & CTO</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">SaaS Pricing</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Flexible pricing that scales with your SaaS business growth
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">SaaS Startup</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$1,499</div>
                  <div className="text-slate-600">/month</div>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Up to 1M ARR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">SOC 2 automation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Basic multi-tenancy monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Single cloud integration</span>
                  </div>
                </div>

                <button className="w-full px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Start Trial
                </button>
              </div>

              <div className="bg-blue-50 border-2 border-blue-500 rounded-2xl p-8 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">SaaS Professional</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$2,999</div>
                  <div className="text-slate-600">/month</div>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Up to 10M ARR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">SOC 2 + ISO 27001 + GDPR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Advanced multi-tenancy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Multi-cloud support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">API security monitoring</span>
                  </div>
                </div>

                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Start Trial
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">SaaS Enterprise</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">Custom</div>
                  <div className="text-slate-600">Contact us</div>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">$10M+ ARR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">All compliance frameworks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Custom integrations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Dedicated CSM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">White-label options</span>
                  </div>
                </div>

                <button className="w-full px-6 py-3 border border-slate-400 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">SaaS Solutions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Scale Compliance
              <span className="block text-blue-400">With Your SaaS</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Automated SOC 2, ISO 27001, and GDPR compliance designed specifically 
              for multi-tenant SaaS architectures and hypergrowth environments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Target className="w-5 h-5" />
                Free SaaS Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-200 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
              >
                <Activity className="w-5 h-5" />
                Schedule Demo
              </button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">500+</div>
                <div className="text-sm text-slate-300">SaaS Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">45 Days</div>
                <div className="text-sm text-slate-300">Audit Readiness</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">96.8%</div>
                <div className="text-sm text-slate-300">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">$120K</div>
                <div className="text-sm text-slate-300">Avg Savings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'overview', label: 'Overview', icon: Cloud },
            { id: 'solutions', label: 'AI Agents', icon: Zap },
            { id: 'case-studies', label: 'Case Studies', icon: Target },
            { id: 'pricing', label: 'Pricing', icon: DollarSign }
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

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-blue-500/20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Scale Your Compliance?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of SaaS companies using Velocity to automate compliance and accelerate growth
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Target className="w-5 h-5" />
              Start Free Assessment
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => navigate('/calculators/roi')}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-400 text-slate-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              Calculate SaaS ROI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaaS;