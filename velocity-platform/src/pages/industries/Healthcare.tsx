import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Heart, 
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
  TrendingUp
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

const Healthcare: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'solutions' | 'case-studies' | 'impact'>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-12">
            {/* Industry Overview */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Healthcare Compliance Automation
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  Protect patient data and ensure HIPAA compliance with AI-powered automation specifically designed for healthcare organizations.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">HIPAA Compliance</h3>
                      <p className="text-slate-600 text-sm">Automated PHI protection and BAA management</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Patient Privacy</h3>
                      <p className="text-slate-600 text-sm">Real-time monitoring of patient data access</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">EMR Integration</h3>
                      <p className="text-slate-600 text-sm">Direct integration with major EMR systems</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Healthcare Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">500K+</div>
                    <div className="text-sm text-slate-600">Patient Records Protected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                    <div className="text-sm text-slate-600">HIPAA Coverage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">150+</div>
                    <div className="text-sm text-slate-600">Vendor BAAs Managed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">Zero</div>
                    <div className="text-sm text-slate-600">Patient Data Breaches</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Challenges */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Healthcare Compliance Challenges
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Complex Regulations</h3>
                  <p className="text-slate-600">
                    HIPAA, HITECH, state privacy laws, and emerging telehealth regulations create complex compliance requirements.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Users className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Patient Data Scale</h3>
                  <p className="text-slate-600">
                    Managing PHI across multiple systems, vendors, and care teams while maintaining strict access controls.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Eye className="w-8 h-8 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Audit Readiness</h3>
                  <p className="text-slate-600">
                    Continuous monitoring and documentation required for OCR audits and breach investigations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'solutions':
        return (
          <div className="space-y-12">
            {/* AI Agents for Healthcare */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Healthcare AI Agents
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: 'HIPAA Privacy Agent',
                    description: 'Automated PHI discovery and protection',
                    automation: 96,
                    icon: Shield,
                    capabilities: ['PHI classification', 'Access monitoring', 'Breach prevention']
                  },
                  {
                    name: 'EMR Integration Agent',
                    description: 'Direct EMR system monitoring and compliance',
                    automation: 94,
                    icon: Database,
                    capabilities: ['Epic integration', 'Cerner monitoring', 'Allscripts coverage']
                  },
                  {
                    name: 'Patient Consent Agent',
                    description: 'Automated consent management and tracking',
                    automation: 92,
                    icon: FileText,
                    capabilities: ['Consent tracking', 'Opt-out management', 'Audit trails']
                  },
                  {
                    name: 'Vendor BAA Agent',
                    description: 'Business Associate Agreement automation',
                    automation: 90,
                    icon: Users,
                    capabilities: ['BAA generation', 'Vendor monitoring', 'Risk assessment']
                  },
                  {
                    name: 'Telehealth Security Agent',
                    description: 'Remote care compliance monitoring',
                    automation: 88,
                    icon: Activity,
                    capabilities: ['Video security', 'Remote access control', 'Session monitoring']
                  },
                  {
                    name: 'Incident Response Agent',
                    description: 'Automated breach detection and response',
                    automation: 95,
                    icon: AlertTriangle,
                    capabilities: ['Breach detection', 'OCR notification', 'Response automation']
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

            {/* Integration Examples */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                EMR System Integrations
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {['Epic', 'Cerner', 'Allscripts', 'athenahealth'].map((emr, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{emr}</h3>
                    <p className="text-sm text-slate-600">Native integration available</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Healthcare Success Stories</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                See how healthcare organizations have transformed their compliance with Velocity
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🏥</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Digital Healthcare Platform</h3>
                    <span className="text-blue-600 font-medium">Telehealth Provider</span>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  <strong>Challenge:</strong> HIPAA compliance for telehealth platform serving 500K+ patients with complex data sharing agreements
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-xl font-bold text-emerald-600">75%</div>
                    <div className="text-sm text-slate-600">Efficiency Gain</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">95%</div>
                    <div className="text-sm text-slate-600">HIPAA Coverage</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 italic text-sm">
                    "The healthcare-specific automation gave us confidence that every patient interaction was compliant. Our audit was seamless."
                  </p>
                  <p className="text-slate-500 text-xs mt-2">— VP of Engineering</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🏥</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Regional Health System</h3>
                    <span className="text-purple-600 font-medium">Multi-facility Network</span>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  <strong>Challenge:</strong> HIPAA compliance across 12 facilities with multiple EMR systems and 2,000+ staff members
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">80%</div>
                    <div className="text-sm text-slate-600">Risk Reduction</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">12</div>
                    <div className="text-sm text-slate-600">Facilities Covered</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 italic text-sm">
                    "Velocity automated our entire HIPAA program across all facilities. We went from reactive to proactive compliance."
                  </p>
                  <p className="text-slate-500 text-xs mt-2">— Chief Compliance Officer</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'impact':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Healthcare Business Impact</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Measurable outcomes and strategic advantages for healthcare organizations
              </p>
            </div>

            {/* Impact Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Patient Safety</h3>
                <div className="text-3xl font-bold text-red-600 mb-2">95%</div>
                <p className="text-slate-600 text-sm">Reduction in privacy incidents</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <Shield className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Compliance Confidence</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">99%</div>
                <p className="text-slate-600 text-sm">HIPAA compliance coverage</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <Clock className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Operational Efficiency</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">75%</div>
                <p className="text-slate-600 text-sm">Time savings on compliance tasks</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Audit Performance</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                <p className="text-slate-600 text-sm">Audit success rate</p>
              </div>
            </div>

            {/* Value Propositions */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Strategic Advantages</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Enhanced Patient Trust</h4>
                      <p className="text-slate-600 text-sm">Patients feel more secure knowing their data is protected by advanced AI systems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Competitive Differentiation</h4>
                      <p className="text-slate-600 text-sm">Stand out with best-in-class privacy and security practices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Future-Ready Infrastructure</h4>
                      <p className="text-slate-600 text-sm">Prepared for emerging healthcare regulations and requirements</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Operational Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Staff Productivity</h4>
                      <p className="text-slate-600 text-sm">Clinical staff focus on patient care instead of compliance paperwork</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Risk Mitigation</h4>
                      <p className="text-slate-600 text-sm">Proactive threat detection prevents costly data breaches</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Scalable Growth</h4>
                      <p className="text-slate-600 text-sm">Compliance infrastructure that grows with your organization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Heart className="w-5 h-5" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-blue-500 rounded-full mr-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Healthcare Solutions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              HIPAA Compliance
              <span className="block text-blue-400">Made Simple</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Protect patient data and ensure HIPAA compliance with AI-powered automation 
              specifically designed for healthcare organizations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Target className="w-5 h-5" />
                Free HIPAA Assessment
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
                <div className="text-3xl font-bold text-emerald-400 mb-2">500K+</div>
                <div className="text-sm text-slate-300">Patient Records Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-sm text-slate-300">HIPAA Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">6 Weeks</div>
                <div className="text-sm text-slate-300">Implementation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">Zero</div>
                <div className="text-sm text-slate-300">Patient Data Breaches</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'solutions', label: 'AI Agents', icon: Zap },
            { id: 'case-studies', label: 'Case Studies', icon: Target },
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

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-blue-500/20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Secure Your Patient Data?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join leading healthcare organizations using Velocity for comprehensive HIPAA compliance automation
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
              <Heart className="w-5 h-5" />
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Healthcare;