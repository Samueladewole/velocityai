import React from 'react';
import { ArrowRight, Globe, Shield, Users, Award, Search, Filter, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export const PublicProfiles: React.FC = () => {
  const navigate = useNavigate();

  const featuredProfiles = [
    {
      company: 'TechCorp Solutions',
      industry: 'SaaS',
      trustScore: 9.2,
      certifications: 15,
      tier: 'Platinum'
    },
    {
      company: 'DataSecure Inc',
      industry: 'Financial Services',
      trustScore: 8.7,
      certifications: 12,
      tier: 'Gold'
    },
    {
      company: 'CloudFirst Systems',
      industry: 'Cloud Infrastructure',
      trustScore: 8.9,
      certifications: 18,
      tier: 'Platinum'
    },
    {
      company: 'SecureHealth',
      industry: 'Healthcare',
      trustScore: 8.5,
      certifications: 10,
      tier: 'Gold'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Discover Trusted Companies
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Browse public trust profiles from leading organizations committed to transparency
            </p>
            
            <div className="max-w-2xl mx-auto flex gap-4">
              <Input 
                placeholder="Search companies, industries..." 
                className="flex-1"
                type="search"
              />
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button className="erip-gradient-primary">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredProfiles.map((profile, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/trust/example-company')}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{profile.company}</h3>
                    <p className="text-sm text-slate-600">{profile.industry}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {profile.tier}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{profile.trustScore}</div>
                    <p className="text-xs text-slate-600">Trust Score</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{profile.certifications}</div>
                    <p className="text-xs text-slate-600">Certifications</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">A+</div>
                    <p className="text-xs text-slate-600">Security Rating</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  View Trust Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/trust-score')}
              className="erip-gradient-primary"
            >
              Create Your Public Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};