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
  Settings,
  MapPin,
  FileX,
  Gavel
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicHeader } from '../../components/common/PublicHeader';

const GDPRInternationalTransfersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'comparison' | 'demo'>('overview');
  const [isVisible, setIsVisible] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isEULocation, setIsEULocation] = useState(false);
  const [currency, setCurrency] = useState('€');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    cloudProviders: [] as string[]
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Detect EU location via IP geolocation
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const euCountries = [
          'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 
          'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
          // Include EEA countries
          'IS', 'LI', 'NO', 'CH'
        ];
        
        if (euCountries.includes(data.country_code)) {
          setIsEULocation(true);
          setCurrency('€');
        }
      } catch (error) {
        console.log('Location detection failed, defaulting to USD');
        // Fallback: check timezone as backup
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone.includes('Europe/')) {
          setIsEULocation(true);
          setCurrency('€');
        }
      }
    };

    detectLocation();
  }, []);

  const cloudProviderOptions = [
    'Microsoft 365', 'AWS', 'Google Cloud', 'Azure', 'Salesforce', 
    'Slack', 'Zoom', 'Dropbox', 'Other'
  ];

  const handleCloudProviderChange = (provider: string) => {
    setFormData(prev => ({
      ...prev,
      cloudProviders: prev.cloudProviders.includes(provider)
        ? prev.cloudProviders.filter(p => p !== provider)
        : [...prev.cloudProviders, provider]
    }));
  };

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log('Download guide for:', formData);
    
    // Close modal and show success
    setShowGuideModal(false);
    alert('Guide downloaded! Check your email for the personalized PDF and demo link.');
    
    // Reset form
    setFormData({
      name: '',
      company: '',
      email: '',
      cloudProviders: []
    });
  };

  const costComparison = [
    { 
      provider: "Velocity AI International Transfers", 
      cost: isEULocation ? "€32,000" : "€35,000", 
      timeline: "3 weeks", 
      coverage: "100%",
      automation: "94%",
      support: "24/7"
    },
    { 
      provider: "Traditional Provider A", 
      cost: isEULocation ? "€165,000" : "€180,000", 
      timeline: "18+ weeks", 
      coverage: "75%",
      automation: "45%",
      support: "Business hours"
    },
    { 
      provider: "Traditional Company B", 
      cost: isEULocation ? "€151,000" : "€165,000", 
      timeline: "16+ weeks", 
      coverage: "70%",
      automation: "40%",
      support: "Business hours"
    },
    { 
      provider: "Traditional Company C", 
      cost: isEULocation ? "€133,000" : "€145,000", 
      timeline: "14+ weeks", 
      coverage: "65%",
      automation: "35%",
      support: "Email only"
    }
  ];

  const transferFeatures = [
    {
      icon: Globe,
      title: "Never Worry About Where Your Data Goes",
      description: "AI automatically checks every time your data moves to make sure it's GDPR compliant",
      benefits: ["Works while you sleep", "Catches problems early", "No more legal surprises"]
    },
    {
      icon: Shield,
      title: "Watch Your Cloud Services 24/7",
      description: "AI monitors Microsoft 365, AWS, Google Cloud and alerts you before problems happen",
      benefits: ["Real-time alerts", "No more manual checking", "Prevents enforcement actions"]
    },
    {
      icon: FileText,
      title: "Contracts That Update Themselves",
      description: "AI manages all your data processing agreements so they're always current and compliant",
      benefits: ["No more outdated contracts", "Automatic updates", "Always audit-ready"]
    },
    {
      icon: Activity,
      title: "Catch Violations Before Regulators Do",
      description: "24/7 monitoring catches compliance issues before they become expensive enforcement actions",
      benefits: ["Early warning system", "Prevent violations", "Sleep better at night"]
    },
    {
      icon: AlertTriangle,
      title: "Avoid the Microsoft 365 Trap",
      description: "Specialized protection prevents the compliance mistakes that got Microsoft 365 in trouble",
      benefits: ["Learn from others' mistakes", "Proactive protection", "Regulatory peace of mind"]
    },
    {
      icon: Gavel,
      title: "Stay Ahead of Changing Laws",
      description: "AI tracks every regulatory change and updates your compliance automatically",
      benefits: ["No more legal research", "Always current", "Automatic adjustments"]
    }
  ];

  const transferUseCases = [
    {
      title: "Use Any Cloud Service You Want",
      description: "Microsoft 365, AWS, Google Cloud, Salesforce - use whatever works best for your business without GDPR worries",
      metrics: ["50+ cloud providers supported", "No restrictions on tools", "Zero enforcement actions"]
    },
    {
      title: "Don't Get Caught Like Microsoft Did",
      description: "Our AI learned from Microsoft 365's mistakes so you don't repeat them",
      metrics: ["100% M365 coverage", "Early warning alerts", "Automated fixes"]
    },
    {
      title: "Work with Any Vendor Globally",
      description: "Connect with suppliers, partners, and customers worldwide without compliance headaches",
      metrics: ["200+ vendors supported", "Automatic compliance checks", "Global contract management"]
    },
    {
      title: "Expand Internationally with Confidence",
      description: "Enter new markets knowing your data practices are compliant in every country",
      metrics: ["35+ countries covered", "Local law compliance", "Market entry support"]
    }
  ];

  const competitiveAdvantages = [
    {
      title: "Never Get Sued Again",
      description: "AI agents prevent enforcement actions before they happen - like having a legal team that never sleeps",
      metric: "Zero violations with customers"
    },
    {
      title: "Use Any Cloud Service",
      description: "Microsoft 365, AWS, Google Cloud - use whatever works best for your business",
      metric: "100+ cloud services supported"
    },
    {
      title: `Save €{isEULocation ? "€133K" : "€145K"} Per Year`,
      description: "Stop paying lawyers €300/hour. Our AI does the work for pennies on the dollar",
      metric: "81% cheaper than law firms"
    },
    {
      title: "Setup in 3 Weeks",
      description: "From signing up to full protection - faster than hiring a single compliance lawyer",
      metric: "6x faster than traditional"
    }
  ];

  const thirteenAgents = [
    {
      name: "International Transfer Compliance Agent",
      description: "Cross-border data flow monitoring and assessment",
      automation: "Coming Q2 2025",
      icon: Globe,
      specialty: "TIA automation, adequacy tracking, SCC management",
      status: "under_development"
    },
    {
      name: "ATLAS Discovery Agent", 
      description: "Automated infrastructure mapping and data flow analysis",
      automation: "95%",
      icon: MapPin,
      specialty: "Cross-border data mapping"
    },
    {
      name: "COMPASS Risk Assessment Agent",
      description: "Comprehensive risk evaluation for international transfers", 
      automation: "94%",
      icon: Target,
      specialty: "Transfer risk scoring"
    },
    {
      name: "CIPHER Data Classification Agent",
      description: "Intelligent data categorization for transfer requirements",
      automation: "93%", 
      icon: Lock,
      specialty: "Data sensitivity analysis"
    },
    {
      name: "CLEARANCE Access Management Agent",
      description: "Automated access controls for international data access",
      automation: "92%",
      icon: Shield,
      specialty: "Transfer access control"
    },
    {
      name: "BEACON Monitoring Agent",
      description: "24/7 surveillance of cross-border data movements",
      automation: "91%",
      icon: Eye,
      specialty: "Transfer monitoring"
    },
    {
      name: "NEXUS Vendor Assessment Agent", 
      description: "Third-party risk evaluation for international partnerships",
      automation: "90%",
      icon: Users,
      specialty: "Vendor transfer compliance"
    },
    {
      name: "PRISM Evidence Collection Agent",
      description: "Automated evidence gathering for transfer compliance",
      automation: "89%",
      icon: Database,
      specialty: "Transfer documentation"
    },
    {
      name: "PULSE Performance Monitoring Agent",
      description: "System performance tracking during international operations",
      automation: "88%",
      icon: Activity,
      specialty: "Transfer performance"
    },
    {
      name: "GENESIS Cryptographic Agent",
      description: "Cryptographic verification for international data integrity",
      automation: "87%",
      icon: Award,
      specialty: "Transfer security"
    },
    {
      name: "ORACLE Predictive Agent",
      description: "Predictive analytics for transfer compliance trends",
      automation: "86%",
      icon: TrendingUp,
      specialty: "Transfer forecasting"
    },
    {
      name: "SENTINEL Incident Response Agent",
      description: "Automated response to international transfer violations",
      automation: "85%",
      icon: AlertTriangle,
      specialty: "Transfer incident response"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className={`text-center transition-all duration-1000 €{isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-emerald-500 rounded-full mr-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <span className="text-emerald-400 font-semibold text-lg">International Transfer Solutions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Never Get Caught Like Microsoft 365 Did
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Never get caught like Microsoft 365 did. Our AI agents automatically check if your cloud services 
              are GDPR compliant, so you can use the tools you need without worrying about enforcement actions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link 
                to="/demo/international-transfers"
                className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Live Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => setShowGuideModal(true)}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
              >
                Download Free Guide + See Live Demo
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">81%</div>
                <div className="text-sm text-slate-300">Cost Savings vs Traditional Solutions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">3 Weeks</div>
                <div className="text-sm text-slate-300">Implementation Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">94%</div>
                <div className="text-sm text-slate-300">Transfer Automation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">First</div>
                <div className="text-sm text-slate-300">Automated Post-Schrems II Solution</div>
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
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-4">
            {[
              { id: 'overview', label: 'Solution Overview', icon: Target },
              { id: 'features', label: 'Transfer Features', icon: Globe },
              { id: 'comparison', label: 'Cost Comparison', icon: DollarSign },
              { id: 'demo', label: 'Live Demo', icon: Zap }
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
            {/* Problem Statement */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Don't Let Cloud Compliance Kill Your Business
              </h2>
              <p className="text-lg text-slate-600 max-w-4xl mx-auto">
                Every day, companies get hit with GDPR enforcement actions for using Microsoft 365, AWS, and Google Cloud wrong. 
                Traditional lawyers charge €300/hour and still can't keep up. Our AI agents work 24/7 to keep you safe.
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

            {/* 13 AI Agents Showcase */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">13 AI Agents Including NEW Transfer Specialist</h3>
                <p className="text-slate-600">
                  Complete automation suite featuring our specialized International Transfer Compliance Agent
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {thirteenAgents.slice(0, 6).map((agent, index) => {
                  const Icon = agent.icon;
                  const isNew = agent.status === 'under_development';
                  return (
                    <div key={index} className={`border rounded-lg p-4 hover:border-blue-300 transition-colors €{
                      isNew ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg €{isNew ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                          <Icon className={`w-5 h-5 €{isNew ? 'text-emerald-600' : 'text-blue-600'}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 text-sm">{agent.name}</h4>
                          <div className={`font-bold text-sm €{isNew ? 'text-emerald-600' : 'text-emerald-600'}`}>
                            {agent.automation}
                          </div>
                          {isNew && (
                            <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full inline-block mt-1">
                              NEW
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{agent.description}</p>
                      <div className={`text-xs px-2 py-1 rounded €{
                        isNew ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {agent.specialty}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-8">
                <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  View All 13 Agents (Including NEW Transfer Agent) →
                </button>
              </div>
            </div>

            {/* Transfer Use Cases */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">International Transfer Use Cases</h3>
                <p className="text-slate-600">
                  Purpose-built for complex cross-border data scenarios and post-Schrems II requirements
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {transferUseCases.map((useCase, index) => (
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
              <h3 className="text-2xl font-bold mb-4">Calculate Your International Transfer Savings</h3>
              <p className="text-emerald-100 mb-6">
                See how much you can save with Velocity's automated transfer compliance vs traditional approaches
              </p>
              <Link 
                to="/calculators/transfer-roi"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                <DollarSign className="w-5 h-5" />
                Calculate Transfer ROI
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
                Use Any Cloud Service Without Worrying About GDPR
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Our AI agents work 24/7 to keep you compliant so you can focus on growing your business. 
                Microsoft 365, AWS, Google Cloud - use whatever works best without legal headaches.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {transferFeatures.map((feature, index) => {
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
                AI-Powered Transfer Impact Assessment (TIA) Automation
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Assess</h4>
                  <p className="text-sm text-slate-600">AI evaluates transfer risks and adequacy requirements automatically</p>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Document</h4>
                  <p className="text-sm text-slate-600">Automatically generates TIA documentation and compliance records</p>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Monitor</h4>
                  <p className="text-sm text-slate-600">Continuous monitoring prevents enforcement actions like Microsoft 365</p>
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
                81% Cost Savings vs Traditional Solutions
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Compare Velocity's AI-powered international transfer solution against traditional compliance platforms. 
                See the dramatic difference in cost, timeline, and automation.
              </p>
            </div>

            {/* Cost Comparison Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">International Transfer Solution Comparison</h3>
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
                          {index === 0 && <div className="text-xs text-emerald-600">81% savings</div>}
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
                            {provider.automation === '94%' && <Zap className="w-4 h-4 text-amber-500" />}
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
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Velocity AI International Transfers</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Software License</span>
                    <span className="font-medium">{isEULocation ? "€20,200" : "€22,000"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Implementation</span>
                    <span className="font-medium">{isEULocation ? "€7,300" : "€8,000"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Training & Support</span>
                    <span className="font-medium">{isEULocation ? "€4,500" : "€5,000"}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between">
                    <span className="font-semibold text-slate-900">Total Year 1</span>
                    <span className="font-bold text-emerald-600">{isEULocation ? "€32,000" : "€35,000"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Traditional Provider A</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Software License</span>
                    <span className="font-medium">{isEULocation ? "€96,000" : "€105,000"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Implementation</span>
                    <span className="font-medium">{isEULocation ? "€46,000" : "€50,000"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Training & Support</span>
                    <span className="font-medium">{isEULocation ? "€23,000" : "€25,000"}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between">
                    <span className="font-semibold text-slate-900">Total Year 1</span>
                    <span className="font-bold text-red-600">{isEULocation ? "€165,000" : "€180,000"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Calculator */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Your Potential Savings: {isEULocation ? "€133,000" : "€145,000"}</h3>
              <p className="text-emerald-100 mb-6">
                Based on industry average implementation costs for international transfer compliance
              </p>
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div>
                  <div className="text-2xl font-bold mb-2">81%</div>
                  <div className="text-sm text-emerald-100">Cost Reduction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2">6x</div>
                  <div className="text-sm text-emerald-100">Faster Implementation</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2">4 months</div>
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
                Experience International Transfer Automation in Action
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                See how Velocity's AI-powered solution automatically assesses transfer risks, 
                monitors cloud providers, and prevents enforcement actions.
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
                  <p className="text-slate-600 mb-4">Click below to explore the full international transfer platform</p>
                  <Link 
                    to="/demo/international-transfers"
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
                    <Globe className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Transfer Assessment</h4>
                  <p className="text-sm text-slate-600">Watch AI automatically assess transfer risks and generate TIAs</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Cloud Monitoring</h4>
                  <p className="text-sm text-slate-600">See real-time monitoring of cloud service provider compliance</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
                    <AlertTriangle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Enforcement Prevention</h4>
                  <p className="text-sm text-slate-600">Experience automated Microsoft 365 enforcement prevention</p>
                </div>
              </div>
            </div>

            {/* Demo Features */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">What You'll See in the Demo</h3>
                <div className="space-y-3">
                  {[
                    "AI-powered Transfer Impact Assessment generation",
                    "Real-time cloud service provider monitoring",
                    "Automated Standard Contractual Clauses management",
                    "Microsoft 365 enforcement prevention workflows",
                    "International transfer risk scoring",
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
                  Schedule a personalized demo with our international transfer experts to see how 
                  Velocity can transform your cross-border compliance program.
                </p>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    <Users className="w-5 h-5" />
                    Schedule Demo Call
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                    <FileText className="w-5 h-5" />
                    Download Transfer Guide
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
            Ready to Master International Transfer Compliance?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join organizations who've revolutionized their cross-border data protection with Velocity AI
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/demo/international-transfers"
              className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Start Free Demo
            </Link>
            <button className="px-8 py-4 border-2 border-slate-400 text-slate-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors">
              Contact Transfer Experts
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Guide Download Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Get Your Free Transfer Compliance Guide
                  </h3>
                  <p className="text-slate-600">
                    25-page professional PDF customized for your cloud providers
                  </p>
                </div>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <FileX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleDownloadSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Which cloud services do you use? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {cloudProviderOptions.map((provider) => (
                      <label key={provider} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.cloudProviders.includes(provider)}
                          onChange={() => handleCloudProviderChange(provider)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">{provider}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">What's Inside The Guide:</h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Transfer Impact Assessment Templates
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Cloud Provider Risk Checklists
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Standard Contractual Clauses Framework
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Microsoft 365 Case Study Analysis
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Automation vs Manual Compliance
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Personalized for Your Cloud Stack
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Download Free Guide + Demo Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGuideModal(false)}
                    className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>

                <p className="text-xs text-slate-500 text-center">
                  By downloading, you agree to receive emails about transfer compliance. 
                  Unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GDPRInternationalTransfersPage;