import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Shield, 
  Grid3x3, 
  Cpu, 
  Power, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Clock, 
  DollarSign,
  Activity,
  AlertTriangle,
  Server,
  Eye,
  Settings,
  Network,
  Gauge,
  Lock,
  TrendingUp
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

const Energy: React.FC = () => {
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
                  Energy & Utilities Compliance Automation
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  Secure critical infrastructure and maintain regulatory compliance with AI-powered automation designed for energy generation, transmission, and distribution systems.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Grid3x3 className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">NERC CIP Compliance</h3>
                      <p className="text-slate-600 text-sm">Automated compliance with North American electric reliability standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Power className="w-5 h-5 text-amber-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Critical Infrastructure Protection</h3>
                      <p className="text-slate-600 text-sm">Safeguard power generation and transmission systems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Network className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">OT Security Monitoring</h3>
                      <p className="text-slate-600 text-sm">Real-time operational technology security oversight</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-red-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Energy Sector Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">25+</div>
                    <div className="text-sm text-slate-600">Utilities Protected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">100K+</div>
                    <div className="text-sm text-slate-600">Critical Assets Monitored</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                    <div className="text-sm text-slate-600">Uptime Maintained</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">Zero</div>
                    <div className="text-sm text-slate-600">Compliance Violations</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Challenges */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Energy Sector Security Challenges
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Grid3x3 className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Critical Infrastructure</h3>
                  <p className="text-slate-600">
                    Power grids, generation facilities, and transmission systems are high-value targets requiring constant protection and monitoring.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Regulatory Complexity</h3>
                  <p className="text-slate-600">
                    NERC CIP, FERC, and state regulations create complex compliance requirements with severe penalties for violations.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Clock className="w-8 h-8 text-blue-500 mb-4" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">24/7 Operations</h3>
                    <p className="text-slate-600">
                      Energy systems operate continuously, requiring security solutions that don't disrupt critical operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'solutions':
        return (
          <div className="space-y-12">
            {/* AI Agents for Energy */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Energy AI Agents
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: 'NERC CIP Compliance Agent',
                    description: 'Automated North American electric reliability compliance',
                    automation: 96,
                    icon: Grid3x3,
                    capabilities: ['CIP-002 through CIP-014', 'Critical asset identification', 'Compliance reporting']
                  },
                  {
                    name: 'Critical Infrastructure Agent',
                    description: 'Protection of bulk electric system assets',
                    automation: 94,
                    icon: Power,
                    capabilities: ['BES cyber asset monitoring', 'Physical security integration', 'Threat detection']
                  },
                  {
                    name: 'OT Security Monitor',
                    description: 'Operational technology security oversight',
                    automation: 92,
                    icon: Settings,
                    capabilities: ['SCADA monitoring', 'HMI security', 'Industrial protocol analysis']
                  },
                  {
                    name: 'Grid Security Agent',
                    description: 'Smart grid and transmission security',
                    automation: 90,
                    icon: Network,
                    capabilities: ['Smart meter security', 'Transmission monitoring', 'Distribution automation']
                  },
                  {
                    name: 'Incident Response Agent',
                    description: 'Energy sector incident management',
                    automation: 88,
                    icon: AlertTriangle,
                    capabilities: ['E-ISAC coordination', 'Outage correlation', 'Recovery prioritization']
                  },
                  {
                    name: 'Regulatory Reporting Agent',
                    description: 'Automated compliance documentation',
                    automation: 87,
                    icon: Server,
                    capabilities: ['NERC reporting', 'Audit preparation', 'Evidence collection']
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

            {/* Energy Standards */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Energy Security Standards
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { name: 'NERC CIP', focus: 'Critical Infrastructure Protection', coverage: '96%', icon: Grid3x3 },
                  { name: 'IEC 61850', focus: 'Substation Automation', coverage: '92%', icon: Zap },
                  { name: 'NIST 800-82', focus: 'Industrial Control Systems', coverage: '90%', icon: Lock },
                  { name: 'IEEE 1686', focus: 'Intelligent Electronic Devices', coverage: '88%', icon: Gauge }
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
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Energy Sector Success Stories</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                See how energy companies have secured their critical infrastructure with Velocity
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">⚡</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Regional Transmission Operator</h3>
                    <span className="text-amber-600 font-medium">Multi-State Grid</span>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  <strong>Challenge:</strong> NERC CIP compliance across 500+ substations and critical cyber assets with strict regulatory deadlines
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-xl font-bold text-emerald-600">350%</div>
                    <div className="text-sm text-slate-600">ROI Improvement</div>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-xl font-bold text-amber-600">95%</div>
                    <div className="text-sm text-slate-600">Faster Incident Response</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 italic text-sm">
                    "Velocity's automation helped us achieve continuous NERC CIP compliance while reducing our security operations overhead by 60%."
                  </p>
                  <p className="text-slate-500 text-xs mt-2">— Chief Information Security Officer</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">🔋</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Independent Power Producer</h3>
                    <span className="text-green-600 font-medium">Renewable Energy</span>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  <strong>Challenge:</strong> Securing distributed renewable energy assets and smart grid integration points across multiple states
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">50+</div>
                    <div className="text-sm text-slate-600">Facilities Protected</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">99.9%</div>
                    <div className="text-sm text-slate-600">Uptime Maintained</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 italic text-sm">
                    "Velocity's AI agents monitor our distributed assets 24/7, ensuring both security and optimal energy production without human intervention."
                  </p>
                  <p className="text-slate-500 text-xs mt-2">— VP of Operations</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'impact':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Energy Sector Business Impact</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Critical infrastructure protection and operational excellence for energy companies
              </p>
            </div>

            {/* Impact Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <Power className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Grid Reliability</h3>
                <div className="text-3xl font-bold text-amber-600 mb-2">99.9%</div>
                <p className="text-slate-600 text-sm">Uptime maintained</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Cyber Defense</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">Zero</div>
                <p className="text-slate-600 text-sm">Compliance violations</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <Network className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Asset Protection</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">100K+</div>
                <p className="text-slate-600 text-sm">Critical assets monitored</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Operational Excellence</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                <p className="text-slate-600 text-sm">Incident response improvement</p>
              </div>
            </div>

            {/* Energy Benefits */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-amber-50 to-red-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Critical Infrastructure Leadership</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">National Security Impact</h4>
                      <p className="text-slate-600 text-sm">Protect critical infrastructure essential to national security and economic stability</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">NERC CIP Excellence</h4>
                      <p className="text-slate-600 text-sm">Exceed regulatory requirements with automated compliance and continuous monitoring</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Industry Innovation</h4>
                      <p className="text-slate-600 text-sm">Lead the energy transformation with secure smart grid and renewable integration</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Operational Resilience</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Continuous Operations</h4>
                      <p className="text-slate-600 text-sm">Maintain 24/7 power generation and distribution without security compromises</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Rapid Threat Response</h4>
                      <p className="text-slate-600 text-sm">Detect and neutralize threats before they impact power delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">Stakeholder Trust</h4>
                      <p className="text-slate-600 text-sm">Build confidence with regulators, customers, and communities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* E-ISAC Partnership Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
              <Zap className="w-8 h-8 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">E-ISAC Partner</h3>
              <p className="text-slate-600 mb-4">
                Velocity is a trusted partner with the Electricity Subsector Coordinating Council (ESCC) and 
                E-ISAC for enhanced threat intelligence and incident coordination.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Zap className="w-5 h-5" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-red-50">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-red-900 to-slate-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-amber-500 rounded-full mr-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <span className="text-amber-400 font-semibold text-lg">Energy Solutions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Critical Infrastructure
              <span className="block text-amber-400">Security Automation</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Protect power generation, transmission, and distribution systems 
              with AI-powered compliance automation built for the energy sector.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/velocity/assessment')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Target className="w-5 h-5" />
                Free Energy Assessment
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
                <div className="text-3xl font-bold text-amber-400 mb-2">25+</div>
                <div className="text-sm text-slate-300">Utilities Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">100K+</div>
                <div className="text-sm text-slate-300">Critical Assets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
                <div className="text-sm text-slate-300">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">Zero</div>
                <div className="text-sm text-slate-300">Violations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'overview', label: 'Overview', icon: Zap },
            { id: 'solutions', label: 'AI Agents', icon: Settings },
            { id: 'case-studies', label: 'Case Studies', icon: Target },
            { id: 'impact', label: 'Business Impact', icon: TrendingUp }
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
        <div className="mt-16 text-center bg-gradient-to-r from-amber-900/50 to-red-900/50 rounded-2xl p-12 border border-amber-500/20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Secure Your Critical Infrastructure?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join energy companies using Velocity to maintain NERC CIP compliance and protect critical assets
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Target className="w-5 h-5" />
              Start Free Assessment
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-400 text-slate-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
            >
              <Zap className="w-5 h-5" />
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Energy;