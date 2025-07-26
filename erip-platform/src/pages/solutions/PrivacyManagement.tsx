import React from 'react';
import { ArrowRight, Shield, Lock, FileText, Users, Globe, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const PrivacyManagement: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'GDPR Automation',
      description: 'Automated DSAR handling, consent management, and compliance workflows',
      icon: FileText,
      metric: '95% faster processing'
    },
    {
      title: 'Global Privacy Laws',
      description: 'Support for GDPR, CCPA, LGPD, PIPEDA, and 50+ privacy regulations',
      icon: Globe,
      metric: '52 jurisdictions covered'
    },
    {
      title: 'Privacy Impact Assessments',
      description: 'AI-powered PIAs with risk scoring and mitigation recommendations',
      icon: Shield,
      metric: '3x faster assessments'
    },
    {
      title: 'Data Mapping',
      description: 'Automated discovery and classification of personal data across systems',
      icon: Database,
      metric: '100% data visibility'
    }
  ];

  const benefits = [
    { metric: '89%', description: 'Reduced compliance costs' },
    { metric: '€3.2M', description: 'Average fine avoidance' },
    { metric: '48hrs', description: 'DSAR response time' },
    { metric: '100%', description: 'Audit readiness' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              <Lock className="h-4 w-4" />
              Privacy Management Solution
            </div>
            
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Privacy Compliance on
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Autopilot
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Navigate global privacy regulations with confidence. Automate DSARs, 
              manage consent, and maintain compliance across all jurisdictions.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="erip-gradient-primary"
                onClick={() => navigate('/privacy-management')}
              >
                Explore Privacy Suite
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/assessment')}
              >
                Free Privacy Assessment
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center bg-white/80 backdrop-blur border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">{benefit.metric}</div>
                <p className="text-sm text-slate-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Enterprise Privacy Management Platform
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 mb-3">{feature.description}</p>
                    <p className="text-sm font-medium text-green-600">{feature.metric}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Privacy Compliance Made Simple
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
              <Users className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">DSAR Automation</h3>
              <p className="text-slate-600 mb-4">
                Handle data subject requests in hours, not weeks
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Automated data discovery</li>
                <li>• Identity verification</li>
                <li>• Secure data delivery</li>
              </ul>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
              <CheckCircle className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Consent Management</h3>
              <p className="text-slate-600 mb-4">
                Centralized consent tracking across all touchpoints
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Preference center</li>
                <li>• Audit trail</li>
                <li>• Cookie compliance</li>
              </ul>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
              <AlertCircle className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Breach Response</h3>
              <p className="text-slate-600 mb-4">
                72-hour breach notification compliance automated
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Impact assessment</li>
                <li>• Notification templates</li>
                <li>• Regulatory reporting</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-blue-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Privacy Compliance Without the Complexity
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join leading organizations using ERIP to automate privacy management
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-green-50"
              onClick={() => navigate('/demo')}
            >
              Schedule Privacy Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate('/privacy-management')}
            >
              View Privacy Features
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};