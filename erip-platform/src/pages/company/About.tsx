import React from 'react';
import { ArrowRight, Shield, Users, Globe, Award, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Building Trust at Scale
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              ERIP transforms how organizations demonstrate trust, accelerate sales, 
              and achieve compliance in an increasingly connected world.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-slate-600 mb-8">
              We believe trust should be transparent, measurable, and shareable. Traditional security 
              questionnaires create friction in business relationships while providing little real insight 
              into an organization's security posture. ERIP changes that.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Security First</h3>
                <p className="text-sm text-slate-600">
                  Built by security professionals who understand enterprise compliance
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Business Value</h3>
                <p className="text-sm text-slate-600">
                  Transform compliance from cost center to competitive advantage
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Customer Success</h3>
                <p className="text-sm text-slate-600">
                  Obsessed with delivering measurable value to our customers
                </p>
              </Card>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <p className="text-slate-600 mb-6">
              Founded in 2024, ERIP emerged from the frustration of spending countless hours on 
              repetitive security questionnaires that added little value to anyone involved. 
              Our founders, having experienced this pain across multiple high-growth companies, 
              set out to build a better way.
            </p>
            
            <p className="text-slate-600 mb-8">
              Today, ERIP serves hundreds of organizations worldwide, from fast-growing startups 
              to Fortune 500 enterprises, helping them turn trust into their competitive advantage.
            </p>

            <div className="bg-blue-50 p-8 rounded-lg mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Join Our Mission</h3>
              <p className="text-slate-600 mb-6">
                We're always looking for talented individuals who share our vision of 
                making trust transparent and accessible.
              </p>
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => navigate('/company/careers')}
                  className="erip-gradient-primary"
                >
                  View Open Roles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/company/contact')}
                >
                  Get in Touch
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};