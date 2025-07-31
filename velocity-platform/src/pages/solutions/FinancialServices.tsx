import React from 'react';
import { ArrowRight, Building2, Shield, FileCheck, TrendingUp, Lock, Calculator, AlertTriangle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const FinancialServices: React.FC = () => {
  const navigate = useNavigate();

  const challenges = [
    {
      title: 'Basel III/IV Compliance',
      description: 'Automated capital adequacy calculations and regulatory reporting',
      icon: Calculator,
      metric: '98% accuracy'
    },
    {
      title: 'DORA Readiness',
      description: 'Digital Operational Resilience Act compliance for EU financial entities',
      icon: Shield,
      metric: '202 deadline ready'
    },
    {
      title: 'Cyber Risk Quantification',
      description: 'Financial impact modeling for board-level risk reporting',
      icon: TrendingUp,
      metric: '€4.2M average exposure'
    },
    {
      title: 'Third-Party Risk',
      description: 'Automated vendor assessments and continuous monitoring',
      icon: AlertTriangle,
      metric: '85% risk reduction'
    }
  ];

  const regulations = [
    'PSD2', 'MiFID II', 'GDPR', 'Basel III/IV', 'DORA', 'NIS2', 
    'EBA Guidelines', 'PCI DSS', 'SOX', 'AML/KYC'
  ];

  const benefits = [
    { metric: '92%', description: 'Faster regulatory reporting' },
    { metric: '€8.3M', description: 'Average compliance savings' },
    { metric: '40%', description: 'Reduced audit time' },
    { metric: '100%', description: 'Regulatory coverage' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Building2 className="h-4 w-4" />
              Financial Services Solution
            </div>
            
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Trust Intelligence for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Financial Institutions
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Navigate complex financial regulations with automated compliance, real-time risk 
              quantification, and comprehensive audit trails designed for banks, insurance, and fintech.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="erip-gradient-primary"
                onClick={() => navigate('/demo')}
              >
                See Banking Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/case-study')}
              >
                View Case Studies
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center bg-white/80 backdrop-blur border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">{benefit.metric}</div>
                <p className="text-sm text-slate-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for Financial Services Complexity
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {challenges.map((challenge, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <challenge.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                    <p className="text-slate-600 mb-3">{challenge.description}</p>
                    <p className="text-sm font-medium text-blue-600">{challenge.metric}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regulations Coverage */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comprehensive Regulatory Coverage
          </h2>
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {regulations.map((reg, index) => (
              <div 
                key={index} 
                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200"
              >
                <span className="text-sm font-medium text-slate-700">{reg}</span>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
              <Lock className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Regulatory Reporting</h3>
              <p className="text-slate-600">
                Automated reporting for ECB, EBA, and national supervisory authorities
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
              <FileCheck className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Audit Management</h3>
              <p className="text-slate-600">
                Complete audit trails with evidence collection and gap remediation
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
              <BarChart3 className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Risk Analytics</h3>
              <p className="text-slate-600">
                Real-time risk dashboards with predictive analytics and stress testing
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl text-center">
          <h3 className="text-lg font-semibold text-slate-600 mb-8">
            Trusted by Leading Financial Institutions
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-slate-400">Deutsche Bank</div>
            <div className="text-2xl font-bold text-slate-400">BNP Paribas</div>
            <div className="text-2xl font-bold text-slate-400">ING</div>
            <div className="text-2xl font-bold text-slate-400">Santander</div>
            <div className="text-2xl font-bold text-slate-400">UniCredit</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Transform Your Financial Compliance
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            See how top banks achieve 92% faster regulatory reporting with ERIP
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/demo')}
            >
              Schedule Banking Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate('/roi-calculator')}
            >
              Calculate ROI
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};