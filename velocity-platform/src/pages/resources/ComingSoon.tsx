import React from 'react';
import { ArrowRight, Clock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface ComingSoonProps {
  title: string;
  description: string;
  expectedDate?: string;
  features?: string[];
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title,
  description,
  expectedDate = "Q2 2025",
  features = []
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-12">
            <Clock className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              {title}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              {description}
            </p>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-full text-lg font-medium">
              <Bell className="h-5 w-5" />
              Expected Launch: {expectedDate}
            </div>
          </div>

          {features.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                What to Expect
              </h2>
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-left">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Card className="max-w-md mx-auto p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Get Notified</h3>
            <p className="text-sm text-slate-600 mb-4">
              Be the first to know when {title.toLowerCase()} launches
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button className="erip-gradient-primary">
                Notify Me
              </Button>
            </div>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
            >
              Back to Platform
            </Button>
            <Button 
              onClick={() => navigate('/demo')}
              className="erip-gradient-primary"
            >
              See What's Available Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};