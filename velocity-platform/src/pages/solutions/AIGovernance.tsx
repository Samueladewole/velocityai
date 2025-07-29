import React from 'react';
import { ArrowRight, Brain, Shield, FileCheck, Users, AlertCircle, Sparkles, Lock, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const AIGovernance: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'ISO 42001 Compliance',
      description: 'Automated compliance with the international AI management standard',
      icon: FileCheck,
      metric: '100% framework coverage'
    },
    {
      title: 'AI Risk Assessment',
      description: 'Comprehensive evaluation of AI model risks and biases',
      icon: AlertCircle,
      metric: '87% risk reduction'
    },
    {
      title: 'Model Governance',
      description: 'Full lifecycle management from development to deployment',
      icon: Brain,
      metric: '3x faster approval'
    },
    {
      title: 'Ethical AI Framework',
      description: 'Built-in fairness, transparency, and accountability controls',
      icon: Shield,
      metric: '95% bias detection'
    }
  ];

  const benefits = [
    { metric: '92%', description: 'Faster AI compliance' },
    { metric: '€1.8M', description: 'Average fine avoidance' },
    { metric: '45%', description: 'Reduced model risks' },
    { metric: '100%', description: 'Audit trail coverage' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              AI Governance Solution
            </div>
            
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Responsible AI at
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Enterprise Scale
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Navigate the complex landscape of AI regulation with automated governance, 
              real-time monitoring, and comprehensive compliance management.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="erip-gradient-primary"
                onClick={() => navigate('/ai-governance')}
              >
                Explore AI Governance
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/assessment')}
              >
                Free AI Risk Assessment
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center bg-white/80 backdrop-blur border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">{benefit.metric}</div>
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
            Complete AI Governance Platform
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 mb-3">{feature.description}</p>
                    <p className="text-sm font-medium text-purple-600">{feature.metric}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Framework */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            AI Regulations We Cover
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
              <Lock className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">EU AI Act</h3>
              <p className="text-slate-600 mb-4">
                Full compliance with Europe's comprehensive AI regulation
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Risk categorization</li>
                <li>• Conformity assessment</li>
                <li>• Technical documentation</li>
              </ul>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
              <Sparkles className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">ISO/IEC 42001</h3>
              <p className="text-slate-600 mb-4">
                International standard for AI management systems
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• AI policy framework</li>
                <li>• Risk management</li>
                <li>• Performance evaluation</li>
              </ul>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
              <BarChart className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">NIST AI RMF</h3>
              <p className="text-slate-600 mb-4">
                US framework for trustworthy and responsible AI
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Governance structure</li>
                <li>• Risk mapping</li>
                <li>• Impact assessment</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-blue-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Future-Proof Your AI Strategy
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Stay ahead of AI regulations with automated governance and continuous compliance
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-purple-50"
              onClick={() => navigate('/demo')}
            >
              See AI Governance Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate('/company/contact')}
            >
              Talk to AI Expert
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};