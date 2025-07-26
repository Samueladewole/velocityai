import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface SolutionPageProps {
  badge: {
    text: string;
    icon: LucideIcon;
  };
  title: string;
  subtitle: string;
  description: string;
  metrics: Array<{
    value: string;
    label: string;
  }>;
  features: Array<{
    title: string;
    description: string;
    icon: LucideIcon;
    metric: string;
  }>;
  benefits?: Array<{
    title: string;
    description: string;
    icon: LucideIcon;
  }>;
  ctaTitle?: string;
  ctaDescription?: string;
}

export const SolutionPageTemplate: React.FC<SolutionPageProps> = ({
  badge,
  title,
  subtitle,
  description,
  metrics,
  features,
  benefits,
  ctaTitle = "Ready to Get Started?",
  ctaDescription = "See how ERIP can transform your operations"
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <badge.icon className="h-4 w-4" />
              {badge.text}
            </div>
            
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              {title}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {subtitle}
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              {description}
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="erip-gradient-primary"
                onClick={() => navigate('/demo')}
              >
                Schedule Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/assessment')}
              >
                Free Assessment
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-6 text-center bg-white/80 backdrop-blur border-slate-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
                <p className="text-sm text-slate-600">{metric.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Capabilities
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

      {/* Benefits Section */}
      {benefits && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose ERIP
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6 bg-gradient-to-br from-blue-50 to-white">
                  <benefit.icon className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {ctaTitle}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {ctaDescription}
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/demo')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate('/company/contact')}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};