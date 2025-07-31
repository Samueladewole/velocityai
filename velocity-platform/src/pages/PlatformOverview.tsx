import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Bot, 
  Database, 
  Zap, 
  Eye, 
  Settings, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Activity, 
  FileText, 
  Lock, 
  Cpu, 
  Server, 
  Globe, 
  Award,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

// Import the PublicHeader component
import { PublicHeader } from '../components/common/PublicHeader';

const PlatformOverview: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'features' | 'architecture'>('overview');

  const platformFeatures = [
    {
      title: "12 Specialized AI Agents",
      description: "Revolutionary automation with visible AI agents working 24/7 on compliance tasks",
      icon: Bot,
      capabilities: ["AWS Evidence Collector", "GCP Security Scanner", "GDPR Compliance Agent", "ISAE 3000 Evidence Agent"],
      automation: "95%"
    },
    {
      title: "Evidence Collection Engine",
      description: "Automated evidence gathering from 400+ cloud services and systems",
      icon: Database,
      capabilities: ["400+ evidence types", "Real-time collection", "Cryptographic verification", "Audit trails"],
      automation: "98%"
    },
    {
      title: "Trust Score System",
      description: "Blockchain-based trust scoring with cryptographic verification",
      icon: Shield,
      capabilities: ["Merkle tree proofs", "Tamper detection", "Trust calculation", "Immutable records"],
      automation: "100%"
    },
    {
      title: "QIE Intelligence Engine",
      description: "AI-powered questionnaire processing with 96.7% accuracy",
      icon: FileText,
      capabilities: ["Framework questionnaires", "AI responses", "Multi-framework mapping", "Vendor assessments"],
      automation: "94%"
    }
  ];

  const aiAgents = [
    { name: 'AWS Evidence Collector', automation: 98, specialty: 'Cloud Infrastructure' },
    { name: 'GCP Security Scanner', automation: 97, specialty: 'Google Cloud Platform' },
    { name: 'Azure Security Monitor', automation: 96, specialty: 'Microsoft Azure' },
    { name: 'GitHub Security Analyzer', automation: 99, specialty: 'Source Code Security' },
    { name: 'QIE Integration Agent', automation: 94, specialty: 'Questionnaire Processing' },
    { name: 'Trust Score Engine', automation: 100, specialty: 'Cryptographic Verification' },
    { name: 'Continuous Monitor', automation: 97, specialty: 'Real-time Monitoring' },
    { name: 'Document Generator', automation: 95, specialty: 'Documentation' },
    { name: 'Observability Specialist', automation: 98, specialty: 'System Monitoring' },
    { name: 'Cryptographic Verification', automation: 100, specialty: 'Blockchain Proofs' },
    { name: 'GDPR Compliance Agent', automation: 96, specialty: 'Privacy Automation' },
    { name: 'ISAE 3000 Evidence Agent', automation: 94, specialty: 'Banking Evidence' }
  ];

  const architectureFeatures = [
    {
      title: "Zero Trust Architecture",
      description: "Built on zero trust principles with read-only access to your systems",
      icon: Lock
    },
    {
      title: "Multi-Cloud Native",
      description: "Native integrations with AWS, GCP, Azure, and hybrid environments",
      icon: Globe
    },
    {
      title: "Scalable Infrastructure",
      description: "Enterprise-grade infrastructure that scales with your organization",
      icon: Server
    },
    {
      title: "Real-time Processing",
      description: "Live evidence collection and continuous compliance monitoring",
      icon: Activity
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
                <Bot className="w-8 h-8 text-white" />
              </div>
              <span className="text-blue-400 font-semibold text-lg">Velocity AI Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              12 AI Agents Automate
              <span className="block text-blue-400">Your Compliance</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Revolutionary compliance automation platform with 12 specialized AI agents, 
              cryptographic verification, and 95% automation rate across all frameworks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button 
                onClick={() => navigate('/velocity/assessment')}
                className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                Start Free Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/velocity/demo')}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                Schedule Demo
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">12</div>
                <div className="text-sm text-slate-300">AI Agents</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">95%</div>
                <div className="text-sm text-slate-300">Automation Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">400+</div>
                <div className="text-sm text-slate-300">Evidence Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">96.8%</div>
                <div className="text-sm text-slate-300">Audit Pass Rate</div>
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
              { id: 'overview', label: 'Platform Overview', icon: Target },
              { id: 'agents', label: '12 AI Agents', icon: Bot },
              { id: 'features', label: 'Core Features', icon: Settings },
              { id: 'architecture', label: 'Architecture', icon: Server }
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
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                The Most Advanced Compliance Automation Platform
              </h2>
              <p className="text-lg text-slate-600 max-w-4xl mx-auto">
                Velocity combines 12 specialized AI agents with cryptographic verification to deliver 
                unprecedented compliance automation across all major frameworks.
              </p>
            </div>

            {/* Platform Features Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {platformFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 font-mono">{feature.automation}</div>
                        <div className="text-xs text-slate-500">Automation</div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 mb-6">{feature.description}</p>
                    
                    <div className="space-y-2">
                      {feature.capabilities.map((capability, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-slate-700">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Competitive Advantages */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Why Choose Velocity Platform</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">83% Cost Savings</h4>
                  <p className="text-slate-600 text-sm">vs traditional compliance solutions</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">6-Week Implementation</h4>
                  <p className="text-slate-600 text-sm">vs 6+ months traditional</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">96.8% Success Rate</h4>
                  <p className="text-slate-600 text-sm">First-time audit pass rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Agents Tab */}
        {activeTab === 'agents' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                12 Specialized AI Agents
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                The only platform with 12 visible AI agents, each specialized for specific compliance tasks. 
                Transparency and specialization that competitors can't match.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiAgents.map((agent, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Bot className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600 font-mono">{agent.automation}%</div>
                      <div className="text-xs text-slate-500">Auto</div>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 mb-2">{agent.name}</h3>
                  <p className="text-slate-600 text-sm mb-3">{agent.specialty}</p>
                  
                  <div className="flex items-center gap-2 text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs">Active 24/7</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-4">See AI Agents in Action</h3>
              <p className="text-slate-600 mb-6">
                Watch our AI agents work in real-time on your compliance tasks
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-5 h-5" />
                View Live Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Core Platform Features
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Enterprise-grade features built for modern compliance teams
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Evidence Collection", desc: "400+ automated evidence types", icon: Database },
                { title: "Trust Scoring", desc: "Cryptographic verification system", icon: Shield },
                { title: "Real-time Monitoring", desc: "24/7 compliance monitoring", icon: Eye },
                { title: "Document Generation", desc: "Automated policy creation", icon: FileText }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Architecture Tab */}
        {activeTab === 'architecture' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Enterprise Architecture
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Built on enterprise-grade infrastructure with security and scalability at its core
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {architectureFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="p-3 bg-slate-100 rounded-lg w-fit mb-4">
                      <Icon className="w-6 h-6 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Experience the Future of Compliance?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join leading organizations using Velocity's 12 AI agents for automated compliance
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/velocity/assessment')}
              className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Target className="w-5 h-5" />
              Start Free Assessment
            </button>
            <button 
              onClick={() => navigate('/velocity/pricing')}
              className="px-8 py-4 border-2 border-slate-400 text-slate-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformOverview;