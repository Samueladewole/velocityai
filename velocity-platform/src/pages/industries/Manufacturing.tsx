import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Factory, 
  Shield, 
  Cog, 
  Cpu, 
  Wifi, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Clock, 
  DollarSign,
  Activity,
  AlertTriangle,
  Server,
  Eye,
  Zap,
  Network,
  Settings,
  Lock
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

const Manufacturing: React.FC = () => {
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
                  Manufacturing Compliance Automation
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  Secure your smart factories and industrial IoT with AI-powered compliance automation designed for operational technology (OT) and IT convergence.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Factory className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Industrial IoT Security</h3>
                      <p className="text-slate-600 text-sm">Automated security for connected manufacturing systems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Network className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">OT/IT Convergence</h3>
                      <p className="text-slate-600 text-sm">Bridge operational and information technology security</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Cog className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Supply Chain Security</h3>
                      <p className="text-slate-600 text-sm">End-to-end vendor and supplier risk management</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Manufacturing Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                    <div className="text-sm text-slate-600">Smart Factories Protected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                    <div className="text-sm text-slate-600">IoT Devices Monitored</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">75%</div>
                    <div className="text-sm text-slate-600">Faster Incident Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">Zero</div>
                    <div className="text-sm text-slate-600">Production Shutdowns</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Challenges */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Manufacturing Security Challenges
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Wifi className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Connected Infrastructure</h3>
                  <p className="text-slate-600">
                    Thousands of IoT sensors, PLCs, and SCADA systems creating vast attack surfaces that need continuous monitoring.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Legacy System Integration</h3>
                  <p className="text-slate-600">
                    Bridging decades-old operational technology with modern IT security requirements and compliance frameworks.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Network className="w-8 h-8 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Supply Chain Risk</h3>
                  <p className="text-slate-600">
                    Managing security across complex global supply chains with hundreds of vendors and third-party integrations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'solutions':
        return (
          <div className="space-y-12">
            {/* AI Agents for Manufacturing */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Manufacturing AI Agents
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: 'Industrial IoT Monitor',
                    description: 'Continuous monitoring of manufacturing IoT devices',
                    automation: 95,
                    icon: Wifi,
                    capabilities: ['Device discovery', 'Anomaly detection', 'Firmware tracking']
                  },
                  {
                    name: 'OT Security Agent',
                    description: 'Operational technology security automation',
                    automation: 92,
                    icon: Factory,
                    capabilities: ['SCADA monitoring', 'PLC security', 'Network segmentation']
                  },
                  {
                    name: 'Supply Chain Agent',
                    description: 'Vendor risk assessment and monitoring',
                    automation: 88,
                    icon: Network,
                    capabilities: ['Vendor assessments', 'Third-party monitoring', 'Risk scoring']
                  },
                  {
                    name: 'Asset Discovery Agent',
                    description: 'Automated discovery of manufacturing assets',
                    automation: 94,
                    icon: Server,
                    capabilities: ['Network scanning', 'Asset classification', 'Inventory management']
                  },
                  {
                    name: 'Compliance Monitor',
                    description: 'Manufacturing compliance framework automation',
                    automation: 90,
                    icon: Shield,
                    capabilities: ['ISO 27001 for manufacturing', 'NIST compliance', 'Audit preparation']
                  },
                  {
                    name: 'Incident Response Agent',
                    description: 'Automated incident detection and response',
                    automation: 87,
                    icon: AlertTriangle,
                    capabilities: ['Threat detection', 'Response automation', 'Impact assessment']
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

            {/* Manufacturing Standards */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Manufacturing Security Standards
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { name: 'ISO 27001', focus: 'Information Security', coverage: '94%', icon: Shield },
                  { name: 'NIST CSF', focus: 'Cybersecurity Framework', coverage: '92%', icon: Lock },
                  { name: 'IEC 62443', focus: 'Industrial Security', coverage: '89%', icon: Factory },
                  { name: 'COBIT', focus: 'IT Governance', coverage: '87%', icon: Settings }
                ].map((standard, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                    <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                      <standard.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{standard.name}</h3>
                    <p className="text-sm text-slate-600 mb-3">{standard.focus}</p>
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Manufacturing Success Stories</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                See how manufacturing companies have secured their operations with Velocity
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🏭</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Manufacturing Conglomerate</h3>
                    <span className="text-blue-600 font-medium">50-Facility Network</span>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  <strong>Challenge:</strong> ISO 27001 certification for smart factory network with 50+ facilities and IoT security concerns
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-xl font-bold text-emerald-600">$180K</div>
                    <div className="text-sm text-slate-600">Annual Savings</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">75%</div>
                    <div className="text-sm text-slate-600">Faster Response</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 italic text-sm">
                    "Velocity understood our unique OT/IT challenges and delivered automation that works in industrial environments."
                  </p>
                  <p className="text-slate-500 text-xs mt-2">— Chief Security Officer</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">⚙️</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Automotive Manufacturer</h3>
                    <span className="text-purple-600 font-medium">Smart Factory</span>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  <strong>Challenge:</strong> Securing connected assembly lines with 5,000+ IoT sensors and real-time production monitoring
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">5K+</div>
                    <div className="text-sm text-slate-600">IoT Devices Secured</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">Zero</div>
                    <div className="text-sm text-slate-600">Production Shutdowns</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 italic text-sm">
                    "Velocity's industrial-grade security automation has kept our production lines running while maintaining complete compliance."
                  </p>
                  <p className="text-slate-500 text-xs mt-2">— Head of Manufacturing IT</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Manufacturing Pricing</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Specialized pricing for manufacturing operations based on facility size and device count
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Manufacturing Starter</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$3,999</div>
                  <div className="text-slate-600">/month</div>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Single facility (up to 1K devices)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">IoT device monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Basic OT security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">ISO 27001 compliance</span>
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
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Manufacturing Professional</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$7,999</div>
                  <div className="text-slate-600">/month</div>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Multi-facility (up to 10K devices)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Advanced OT/IT convergence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Supply chain monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">IEC 62443 compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">24/7 SOC monitoring</span>
                  </div>
                </div>

                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Start Trial
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Manufacturing Enterprise</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">Custom</div>
                  <div className="text-slate-600">Contact us</div>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Unlimited facilities & devices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Custom OT integrations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Global compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Dedicated support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">On-premise deployment</span>
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
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-blue-500 rounded-full mr-4">
                <Factory className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Manufacturing Solutions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Smart Factory
              <span className="block text-blue-400">Security Automation</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Secure your industrial IoT, operational technology, and supply chain 
              with AI-powered compliance automation built for manufacturing environments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Target className="w-5 h-5" />
                Free Manufacturing Assessment
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
                <div className="text-3xl font-bold text-emerald-400 mb-2">50+</div>
                <div className="text-sm text-slate-300">Smart Factories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
                <div className="text-sm text-slate-300">IoT Devices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">75%</div>
                <div className="text-sm text-slate-300">Faster Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">Zero</div>
                <div className="text-sm text-slate-300">Shutdowns</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'overview', label: 'Overview', icon: Factory },
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
        <div className="mt-16 text-center bg-gradient-to-r from-slate-900/50 to-blue-900/50 rounded-2xl p-12 border border-blue-500/20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Secure Your Smart Factory?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join leading manufacturers using Velocity to secure their industrial operations and maintain compliance
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
              Calculate Manufacturing ROI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manufacturing;