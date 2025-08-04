import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
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
  AlertTriangle,
  FileText,
  Eye,
  Zap,
  Globe,
  Flag,
  Star,
  TrendingUp
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

const Government: React.FC = () => {
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
                  Government Compliance Automation
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  Meet stringent government security requirements with AI-powered compliance automation designed for federal, state, and local agencies.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Flag className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">FedRAMP Authorization</h3>
                      <p className="text-slate-600 text-sm">Automated FedRAMP compliance and ATO preparation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">FISMA Compliance</h3>
                      <p className="text-slate-600 text-sm">Comprehensive FISMA and NIST 800-53 automation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Continuous Monitoring</h3>
                      <p className="text-slate-600 text-sm">Real-time security posture assessment</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Government Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
                    <div className="text-sm text-slate-600">Government Agencies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">18 Months</div>
                    <div className="text-sm text-slate-600">Avg ATO Acceleration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                    <div className="text-sm text-slate-600">Control Automation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">€2M+</div>
                    <div className="text-sm text-slate-600">Avg Cost Avoidance</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Challenges */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Government Compliance Challenges
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <FileText className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Complex Requirements</h3>
                  <p className="text-slate-600">
                    NIST 800-53 has over 300 controls with thousands of implementation requirements across multiple impact levels.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Clock className="w-8 h-8 text-red-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Lengthy ATO Process</h3>
                  <p className="text-slate-600">
                    Traditional Authority to Operate (ATO) processes can take 12-18 months with extensive documentation requirements.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Eye className="w-8 h-8 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Continuous Monitoring</h3>
                  <p className="text-slate-600">
                    Requirement for real-time security posture monitoring and rapid response to emerging threats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'solutions':
        return (
          <div className="space-y-12">
            {/* AI Agents for Government */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Government AI Agents
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: 'FedRAMP Automation Agent',
                    description: 'Automated FedRAMP compliance and ATO preparation',
                    automation: 94,
                    icon: Flag,
                    capabilities: ['Control implementation', 'Evidence collection', 'ATO package generation']
                  },
                  {
                    name: 'NIST 800-53 Agent',
                    description: 'Comprehensive NIST control automation',
                    automation: 96,
                    icon: Lock,
                    capabilities: ['300+ control coverage', 'Impact level assessment', 'Control inheritance']
                  },
                  {
                    name: 'Continuous Monitoring Agent',
                    description: 'Real-time security posture monitoring',
                    automation: 92,
                    icon: Eye,
                    capabilities: ['24/7 monitoring', 'Risk assessment', 'Automated reporting']
                  },
                  {
                    name: 'FISMA Compliance Agent',
                    description: 'Federal information security automation',
                    automation: 90,
                    icon: Shield,
                    capabilities: ['FISMA requirements', 'Risk categorization', 'Security planning']
                  },
                  {
                    name: 'Supply Chain Risk Agent',
                    description: 'Vendor and supply chain security assessment',
                    automation: 88,
                    icon: Globe,
                    capabilities: ['Vendor assessments', 'Supply chain mapping', 'Risk scoring']
                  },
                  {
                    name: 'Incident Response Agent',
                    description: 'Government incident handling automation',
                    automation: 87,
                    icon: AlertTriangle,
                    capabilities: ['US-CERT coordination', 'Breach notification', 'Recovery automation']
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

            {/* Government Standards */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Government Security Standards
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { name: 'FedRAMP', impact: 'Low/Moderate/High', coverage: '96%', icon: Flag },
                  { name: 'NIST 800-53', impact: 'All Impact Levels', coverage: '94%', icon: Lock },
                  { name: 'FISMA', impact: 'Federal Compliance', coverage: '92%', icon: Shield },
                  { name: 'CJIS', impact: 'Criminal Justice', coverage: '89%', icon: Star }
                ].map((standard, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                    <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                      <standard.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{standard.name}</h3>
                    <p className="text-sm text-slate-600 mb-3">{standard.impact}</p>
                    <div className="text-2xl font-bold text-emerald-600 mb-1">{standard.coverage}</div>
                    <p className="text-xs text-slate-500">Coverage</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Government Success Stories</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                See how government agencies have accelerated their compliance with Velocity
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🏛️</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Federal Agency</h3>
                    <span className="text-blue-600 font-medium">Cabinet-Level Department</span>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  <strong>Challenge:</strong> FedRAMP High authorization for mission-critical system serving 50,000+ government employees
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-xl font-bold text-emerald-600">18 Months</div>
                    <div className="text-sm text-slate-600">ATO Acceleration</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">400%</div>
                    <div className="text-sm text-slate-600">ROI Improvement</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 italic text-sm">
                    "Velocity's automation reduced our ATO timeline from 36 months to 18 months while maintaining the highest security standards."
                  </p>
                  <p className="text-slate-500 text-xs mt-2">— Chief Information Security Officer</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🏢</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">State Government</h3>
                    <span className="text-purple-600 font-medium">Multi-Agency Platform</span>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  <strong>Challenge:</strong> NIST 800-53 compliance for shared services platform across 15 state agencies
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-slate-600">Agencies Covered</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">95%</div>
                    <div className="text-sm text-slate-600">Control Automation</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 italic text-sm">
                    "Velocity enabled us to standardize compliance across all our agencies while reducing manual effort by 95%."
                  </p>
                  <p className="text-slate-500 text-xs mt-2">— State Chief Technology Officer</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'impact':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Government Impact & Value</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Mission-critical outcomes and strategic advantages for government agencies
              </p>
            </div>

            {/* Impact Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <Flag className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Mission Readiness</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">18 Months</div>
                <p className="text-slate-600 text-sm">Faster ATO timeline</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Security Posture</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <p className="text-slate-600 text-sm">Control automation</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <Users className="w-8 h-8 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Citizen Service</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                <p className="text-slate-600 text-sm">Service availability</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Resource Efficiency</h3>
                <div className="text-3xl font-bold text-amber-600 mb-2">75%</div>
                <p className="text-slate-600 text-sm">Staff time savings</p>
              </div>
            </div>

            {/* Government Benefits */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Mission-Critical Advantages</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Accelerated ATO Process</h4>
                      <p className="text-slate-600 text-sm">Reduce Authority to Operate timeline from years to months</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Continuous Compliance</h4>
                      <p className="text-slate-600 text-sm">Maintain security posture with real-time monitoring and reporting</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Interagency Collaboration</h4>
                      <p className="text-slate-600 text-sm">Standardized security frameworks enable seamless information sharing</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Operational Excellence</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Taxpayer Value</h4>
                      <p className="text-slate-600 text-sm">Maximize public investment through efficient resource utilization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Staff Empowerment</h4>
                      <p className="text-slate-600 text-sm">Free personnel from manual tasks to focus on mission objectives</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Future-Ready Infrastructure</h4>
                      <p className="text-slate-600 text-sm">Built to adapt to evolving federal security requirements</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GSA Schedule Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <Flag className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">GSA Schedule Available</h3>
              <p className="text-slate-600 mb-4">
                Velocity is available through GSA Schedule 70 for streamlined government procurement. 
                Contact our government sales team for details.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Building2 className="w-5 h-5" />
                View Pricing Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-red-50">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-red-900 to-purple-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-blue-500 rounded-full mr-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Government Solutions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Government-Grade
              <span className="block text-blue-400">Compliance Automation</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Accelerate your ATO timeline and maintain continuous compliance 
              with AI-powered automation built for federal, state, and local government agencies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Target className="w-5 h-5" />
                Free Government Assessment
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
                <div className="text-3xl font-bold text-emerald-400 mb-2">100+</div>
                <div className="text-sm text-slate-300">Government Agencies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">18 Months</div>
                <div className="text-sm text-slate-300">ATO Acceleration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">95%</div>
                <div className="text-sm text-slate-300">Control Automation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">€2M+</div>
                <div className="text-sm text-slate-300">Cost Avoidance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'overview', label: 'Overview', icon: Building2 },
            { id: 'solutions', label: 'AI Agents', icon: Zap },
            { id: 'case-studies', label: 'Case Studies', icon: Target },
            { id: 'pricing', label: 'Pricing', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 €{
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
        <div className="mt-16 text-center bg-gradient-to-r from-blue-900/50 to-red-900/50 rounded-2xl p-12 border border-blue-500/20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Accelerate Your ATO?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join government agencies using Velocity to achieve faster compliance and maintain continuous security posture
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
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-400 text-slate-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
            >
              <Building2 className="w-5 h-5" />
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Government;