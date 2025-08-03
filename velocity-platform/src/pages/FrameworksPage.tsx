import React from 'react';
import { PublicHeader } from '../components/common/PublicHeader';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Globe, 
  Building, 
  Heart, 
  CreditCard, 
  Monitor,
  ArrowRight,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const FrameworksPage: React.FC = () => {
  const frameworks = [
    {
      name: "SOC 2",
      description: "Service Organization Control 2 Type II Compliance",
      icon: <Shield className="w-8 h-8" />,
      color: "bg-emerald-500",
      industries: ["SaaS", "Technology", "Cloud Services"],
      implementation: "45 days",
      automation: "98%",
      route: "/velocity/solutions/soc2"
    },
    {
      name: "ISO 27001",
      description: "International Information Security Management Standard",
      icon: <Lock className="w-8 h-8" />,
      color: "bg-blue-500",
      industries: ["Enterprise", "Manufacturing", "Finance"],
      implementation: "90 days",
      automation: "95%",
      route: "/velocity/solutions/iso27001"
    },
    {
      name: "GDPR",
      description: "General Data Protection Regulation",
      icon: <Globe className="w-8 h-8" />,
      color: "bg-purple-500",
      industries: ["All EU Operations", "Global Companies"],
      implementation: "30 days",
      automation: "94%",
      route: "/velocity/solutions/gdpr"
    },
    {
      name: "HIPAA",
      description: "Health Insurance Portability and Accountability Act",
      icon: <Heart className="w-8 h-8" />,
      color: "bg-red-500",
      industries: ["Healthcare", "Life Sciences", "Medical Devices"],
      implementation: "60 days",
      automation: "96%",
      route: "/velocity/solutions/hipaa"
    },
    {
      name: "PCI DSS",
      description: "Payment Card Industry Data Security Standard",
      icon: <CreditCard className="w-8 h-8" />,
      color: "bg-orange-500",
      industries: ["E-commerce", "Retail", "Payment Processing"],
      implementation: "75 days",
      automation: "97%",
      route: "/velocity/solutions/pci-dss"
    },
    {
      name: "CIS Controls",
      description: "Center for Internet Security Critical Security Controls",
      icon: <Monitor className="w-8 h-8" />,
      color: "bg-cyan-500",
      industries: ["Critical Infrastructure", "Government", "Enterprise"],
      implementation: "60 days",
      automation: "92%",
      route: "/velocity/solutions/cis-controls"
    }
  ];

  const industryStats = [
    { industry: "Banking & Financial", frameworks: "Average 3.2 frameworks", savings: "40-60% cost reduction" },
    { industry: "Healthcare", frameworks: "Average 2.8 frameworks", savings: "50-70% cost reduction" },
    { industry: "Technology", frameworks: "Average 4.1 frameworks", savings: "45-65% cost reduction" },
    { industry: "Manufacturing", frameworks: "Average 2.5 frameworks", savings: "35-55% cost reduction" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Frameworks</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              All Compliance Frameworks
              <span className="text-blue-400"> in One Platform</span>
            </h1>
            <p className="text-2xl text-white/90 mb-8">
              Multi-framework automation with AI agents that understand cross-compliance requirements
            </p>
            <p className="text-lg text-white/80 mb-12">
              Deploy multiple compliance frameworks simultaneously with intelligent overlap detection and unified evidence collection.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="default" size="lg">
                Start Multi-Framework Assessment
              </Button>
              <Button variant="outline" size="lg">
                View Platform Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Supported Compliance Frameworks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {frameworks.map((framework, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 rounded-lg ${framework.color} flex items-center justify-center mb-6 text-white`}>
                  {framework.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{framework.name}</h3>
                <p className="text-gray-600 mb-6">{framework.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Implementation:</span>
                    <span className="font-semibold">{framework.implementation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Automation:</span>
                    <span className="font-semibold text-green-600">{framework.automation}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Primary Industries:</p>
                  <div className="flex flex-wrap gap-2">
                    {framework.industries.map((industry, industryIndex) => (
                      <span key={industryIndex} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>

                <Link to={framework.route}>
                  <Button variant="outline" className="w-full">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Framework Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Multi-Framework Advantages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Unified Evidence Collection</h3>
              <p className="text-gray-600">
                Single evidence collection satisfies multiple framework requirements. 
                One AWS CloudTrail log serves SOC 2, ISO 27001, and PCI DSS simultaneously.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Exponential Cost Savings</h3>
              <p className="text-gray-600">
                Each additional framework costs 70% less when implemented together. 
                Shared infrastructure, evidence, and processes across all compliance requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Holistic Security Posture</h3>
              <p className="text-gray-600">
                Multi-framework approach creates comprehensive security coverage. 
                No gaps between compliance requirements, unified risk management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Statistics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Industry Implementation Patterns</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industryStats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-3">{stat.industry}</h3>
                <p className="text-gray-600 mb-2">{stat.frameworks}</p>
                <p className="text-green-600 font-semibold">{stat.savings}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Implement Multiple Frameworks?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get a custom multi-framework implementation plan tailored to your industry and infrastructure.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="default" size="lg">
              Start Multi-Framework Assessment
            </Button>
            <Button variant="outline" size="lg">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FrameworksPage;