import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Building, 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Clock, 
  DollarSign,
  Users,
  Globe,
  Activity,
  FileText,
  Database,
  Zap
} from 'lucide-react';
import { PublicHeader } from '../components/common/PublicHeader';

const CaseStudies: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'banking' | 'healthcare' | 'saas' | 'manufacturing'>('all');

  const caseStudies = [
    {
      id: 1,
      company: "Regional Bank (€15B Assets)",
      industry: "banking",
      logo: "🏦",
      challenge: "Multi-jurisdictional banking compliance cost optimization for 2.5M customers across 12 EU countries with complex data flows and legacy banking systems",
      solution: "Velocity Banking ROI Calculator with specialized banking agents and core system integration",
      implementation: "4 weeks",
      results: [
        "€150K saved vs traditional + consulting",
        "100% compliance audit pass on first attempt",
        "83% reduction in compliance costs",
        "Zero privacy breaches since implementation",
        "Automated Banking ROI for 15 banking processes"
      ],
      metrics: {
        costSavings: "€150,000",
        timeSavings: "18 weeks",
        automationIncrease: "83%",
        auditSuccess: "100%"
      },
      quote: "Velocity transformed our banking compliance costs from a burden to a competitive advantage. The banking-specific ROI automation saved us months of manual work.",
      author: "Chief Compliance Officer",
      frameworks: ["Basel III", "GLBA", "PCI DSS"],
      featured: true
    },
    {
      id: 2,
      company: "Digital Healthcare Platform",
      industry: "healthcare",
      logo: "🏥",
      challenge: "HIPAA compliance for telehealth platform serving 500K+ patients with complex data sharing agreements",
      solution: "Velocity HIPAA automation with patient data classification and breach prevention systems",
      implementation: "6 weeks",
      results: [
        "€200K saved vs traditional consulting",
        "95% HIPAA coverage across all systems",
        "Zero patient data breaches",
        "Automated BAA management for 150+ vendors",
        "Real-time PHI monitoring and alerts"
      ],
      metrics: {
        costSavings: "€200,000",
        timeSavings: "16 weeks",
        automationIncrease: "95%",
        auditSuccess: "100%"
      },
      quote: "The healthcare-specific automation gave us confidence that every patient interaction was compliant. Our audit was seamless.",
      author: "VP of Engineering",
      frameworks: ["HIPAA", "SOC 2", "Basel III"],
      featured: true
    },
    {
      id: 3,
      company: "Enterprise SaaS Company",
      industry: "saas",
      logo: "💻",
      challenge: "SOC 2 Type II certification for multi-tenant platform serving Fortune 500 customers with strict security requirements",
      solution: "Complete Velocity platform with multi-tenant isolation monitoring and automated evidence collection",
      implementation: "8 weeks",
      results: [
        "€120K saved vs traditional audit prep",
        "96.8% audit pass rate",
        "45-day audit readiness vs 6 months",
        "Automated evidence for 400+ controls",
        "Real-time security posture monitoring"
      ],
      metrics: {
        costSavings: "€120,000",
        timeSavings: "20 weeks",
        automationIncrease: "90%",
        auditSuccess: "96.8%"
      },
      quote: "Velocity's AI agents worked around the clock collecting evidence. What used to take months now happens automatically.",
      author: "CISO",
      frameworks: ["SOC 2", "ISO 27001", "Basel III"],
      featured: false
    },
    {
      id: 4,
      company: "Investment Bank (€50B Assets)",
      industry: "banking",
      logo: "🏛️",
      challenge: "ISAE 3000 compliance for trading systems across US, EU, and APAC with complex derivatives processing",
      solution: "Velocity Enterprise with custom banking agents and global compliance monitoring",
      implementation: "12 weeks",
      results: [
        "€500K+ saved vs Big 4 consulting",
        "88% cost reduction vs traditional approach",
        "25-country compliance coverage",
        "Real-time risk monitoring for trading systems",
        "Automated regulatory reporting"
      ],
      metrics: {
        costSavings: "€500,000",
        timeSavings: "40 weeks",
        automationIncrease: "88%",
        auditSuccess: "100%"
      },
      quote: "The scale of automation Velocity delivered for our global operations was unprecedented. We're now compliant across 25 countries.",
      author: "Global Head of Compliance",
      frameworks: ["ISAE 3000", "SOX", "Basel III"],
      featured: true
    },
    {
      id: 5,
      company: "Manufacturing Conglomerate",
      industry: "manufacturing",
      logo: "🏭",
      challenge: "ISO 27001 certification for smart factory network with 50+ facilities and IoT security concerns",
      solution: "Velocity manufacturing automation with OT/IT convergence monitoring and supply chain security",
      implementation: "10 weeks",
      results: [
        "€180K saved vs consulting fees",
        "75% reduction in manual documentation",
        "50-facility network compliance",
        "Automated vendor risk assessments",
        "IoT device security monitoring"
      ],
      metrics: {
        costSavings: "€180,000",
        timeSavings: "24 weeks",
        automationIncrease: "75%",
        auditSuccess: "95%"
      },
      quote: "Velocity understood our unique OT/IT challenges and delivered automation that works in industrial environments.",
      author: "Chief Security Officer",
      frameworks: ["ISO 27001", "NIST", "SOC 2"],
      featured: false
    },
    {
      id: 6,
      company: "Fintech Startup",
      industry: "banking",
      logo: "💳",
      challenge: "Rapid compliance for Series B funding requirements across multiple frameworks with limited compliance team",
      solution: "Velocity Professional with accelerated implementation and dedicated success management",
      implementation: "3 weeks",
      results: [
        "€75K saved vs hiring compliance team",
        "4-framework compliance in 3 weeks",
        "Series B funding successful",
        "96% automation of compliance tasks",
        "Investor-ready compliance posture"
      ],
      metrics: {
        costSavings: "€75,000",
        timeSavings: "12 weeks",
        automationIncrease: "96%",
        auditSuccess: "100%"
      },
      quote: "Velocity made our Series B possible. We went from zero compliance to investment-ready in just 3 weeks.",
      author: "Co-Founder & CTO",
      frameworks: ["SOC 2", "Basel III", "PCI DSS"],
      featured: false
    }
  ];

  const industries = [
    { id: 'all', label: 'All Industries', icon: Globe },
    { id: 'banking', label: 'Financial Services', icon: Building },
    { id: 'healthcare', label: 'Healthcare', icon: Shield },
    { id: 'saas', label: 'SaaS', icon: Activity },
    { id: 'manufacturing', label: 'Manufacturing', icon: Zap }
  ];

  const filteredCaseStudies = activeFilter === 'all' 
    ? caseStudies 
    : caseStudies.filter(study => study.industry === activeFilter);

  const featuredStudies = caseStudies.filter(study => study.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-amber-500 rounded-full mr-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <span className="text-amber-400 font-semibold text-lg">Customer Success Stories</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Real Results from
              <span className="block text-amber-400">Real Companies</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              See how leading organizations across industries have transformed their compliance 
              with Velocity's AI-powered automation platform.
            </p>

            {/* Success Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">1000+</div>
                <div className="text-sm text-slate-300">Organizations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">€50M+</div>
                <div className="text-sm text-slate-300">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">96.8%</div>
                <div className="text-sm text-slate-300">Audit Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">83%</div>
                <div className="text-sm text-slate-300">Avg Cost Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Case Studies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Featured Success Stories</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Highlighted transformations that showcase the power of AI-driven compliance automation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {featuredStudies.slice(0, 2).map((study) => (
            <div key={study.id} className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{study.logo}</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{study.company}</h3>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full capitalize">
                      {study.industry}
                    </span>
                  </div>
                </div>
                <Award className="w-6 h-6 text-amber-500" />
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-2">Challenge:</h4>
                <p className="text-slate-600 text-sm mb-4">{study.challenge}</p>
                
                <h4 className="font-semibold text-slate-900 mb-2">Solution:</h4>
                <p className="text-slate-600 text-sm">{study.solution}</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="text-lg font-bold text-emerald-600">{study.metrics.costSavings}</div>
                  <div className="text-xs text-slate-600">Cost Savings</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{study.metrics.timeSavings}</div>
                  <div className="text-xs text-slate-600">Time Saved</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{study.metrics.automationIncrease}</div>
                  <div className="text-xs text-slate-600">Automation Increase</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-lg font-bold text-amber-600">{study.metrics.auditSuccess}</div>
                  <div className="text-xs text-slate-600">Audit Success</div>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <p className="text-slate-700 italic text-sm mb-2">"{study.quote}"</p>
                <p className="text-slate-500 text-xs">— {study.author}</p>
              </div>

              {/* Frameworks */}
              <div className="flex flex-wrap gap-2">
                {study.frameworks.map((framework, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                    {framework}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Industry Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">All Customer Stories</h2>
          <p className="text-lg text-slate-600 mb-8">Filter by industry to see relevant success stories</p>
          
          <div className="flex flex-wrap justify-center gap-2">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <button
                  key={industry.id}
                  onClick={() => setActiveFilter(industry.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 €{
                    activeFilter === industry.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {industry.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* All Case Studies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredCaseStudies.map((study) => (
            <div key={study.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{study.logo}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{study.company}</h3>
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded capitalize">
                      {study.industry}
                    </span>
                  </div>
                </div>
                {study.featured && <Award className="w-4 h-4 text-amber-500" />}
              </div>

              <p className="text-slate-600 text-sm mb-4 line-clamp-3">{study.challenge}</p>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center p-2 bg-emerald-50 rounded">
                  <div className="text-sm font-bold text-emerald-600">{study.metrics.costSavings}</div>
                  <div className="text-xs text-slate-600">Saved</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-sm font-bold text-blue-600">{study.implementation}</div>
                  <div className="text-xs text-slate-600">Implementation</div>
                </div>
              </div>

              {/* Key Results */}
              <div className="space-y-1 mb-4">
                {study.results.slice(0, 3).map((result, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs text-slate-700">{result}</span>
                  </div>
                ))}
              </div>

              {/* Frameworks */}
              <div className="flex flex-wrap gap-1">
                {study.frameworks.map((framework, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                    {framework}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-blue-500/20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Join These Success Stories?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            See how Velocity can transform your compliance operations with the same dramatic results
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Target className="w-5 h-5" />
              Start Your Success Story
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => navigate('/calculators/roi')}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-400 text-slate-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              Calculate Your Savings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;