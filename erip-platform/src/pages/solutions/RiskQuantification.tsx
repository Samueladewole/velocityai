import React from 'react';
import { ArrowRight, TrendingUp, Shield, Calculator, BarChart3, AlertTriangle, Target, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const RiskQuantification: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Monte Carlo Simulations',
      description: 'Run 50,000+ iterations for statistically accurate risk predictions',
      icon: Calculator,
      metric: '99% confidence intervals'
    },
    {
      title: 'FAIR Methodology',
      description: 'Industry-standard Factor Analysis of Information Risk framework',
      icon: BarChart3,
      metric: 'ISO 31000 compliant'
    },
    {
      title: 'Financial Impact Analysis',
      description: 'Convert security risks into business-understood financial metrics',
      icon: DollarSign,
      metric: '€2.3M average risk reduction'
    },
    {
      title: 'Real-Time Risk Dashboard',
      description: 'Live risk posture monitoring with automated alerts',
      icon: AlertTriangle,
      metric: '24/7 monitoring'
    }
  ];

  const benefits = [
    { metric: '87%', description: 'More accurate risk predictions' },
    { metric: '€4.2M', description: 'Average annual loss prevention' },
    { metric: '6x', description: 'Faster risk assessments' },
    { metric: '40%', description: 'Reduction in security incidents' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              Risk Quantification Solution
            </div>
            
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Transform Security Risks into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Business Intelligence
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              ERIP's advanced risk quantification engine converts complex security vulnerabilities 
              into clear financial metrics that drive executive decisions.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="erip-gradient-primary"
                onClick={() => navigate('/demo')}
              >
                See Risk Analysis Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/roi-calculator')}
              >
                Calculate Your Risk Exposure
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center bg-white/80 backdrop-blur border-slate-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">{benefit.metric}</div>
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
            Enterprise-Grade Risk Quantification
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 mb-3">{feature.description}</p>
                    <p className="text-sm font-medium text-blue-600">{feature.metric}</p>
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
            Risk Quantification in Action
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
              <Target className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Board Reporting</h3>
              <p className="text-slate-600 mb-4">
                Present security risks in financial terms that board members understand
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Potential loss scenarios</li>
                <li>• Risk appetite alignment</li>
                <li>• Investment justification</li>
              </ul>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
              <Shield className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Security Planning</h3>
              <p className="text-slate-600 mb-4">
                Prioritize security investments based on quantified risk reduction
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Control effectiveness</li>
                <li>• Budget optimization</li>
                <li>• ROI calculations</li>
              </ul>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
              <DollarSign className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Cyber Insurance</h3>
              <p className="text-slate-600 mb-4">
                Optimize coverage with accurate risk exposure calculations
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Premium negotiation</li>
                <li>• Coverage optimization</li>
                <li>• Claims preparation</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Quantify Your Security Risks?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            See how ERIP transforms complex vulnerabilities into actionable business intelligence
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/demo')}
            >
              Schedule Live Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate('/tools/prism')}
            >
              Explore PRISM Engine
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};