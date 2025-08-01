import React from 'react';
import { Shield, Users, Lightbulb, Target, Award, Globe } from 'lucide-react';

const Story: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From compliance frustration to Trust Intelligence Platform - how ERIP transformed 
            the way organizations build and share trust.
          </p>
        </div>

        {/* Story Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Genesis */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">The Problem We Saw</h3>
                <p className="text-gray-600 mb-4">
                  In 2025, we witnessed organizations spending millions on compliance processes that 
                  created zero competitive advantage. Companies were drowning in spreadsheets, 
                  manual audits, and consultant fees while their compliance efforts sat in silos.
                </p>
                <p className="text-gray-600">
                  We realized that compliance wasn't just a cost center - it was untapped Trust Equity™ 
                  that could accelerate sales, partnerships, and market expansion.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">The Vision</h3>
                <p className="text-gray-600 mb-4">
                  What if compliance could be transformed from a cost center into a competitive advantage? 
                  What if trust could be quantified, automated, and shared to accelerate business growth?
                </p>
                <p className="text-gray-600">
                  This vision led to the creation of ERIP - the first Trust Intelligence Platform 
                  that converts compliance investments into measurable Trust Equity™.
                </p>
              </div>
            </div>

            {/* Innovation */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">The Innovation</h3>
                <p className="text-gray-600 mb-4">
                  We developed the world's first Trust Score algorithm that quantifies organizational 
                  trustworthiness across multiple dimensions - security, compliance, reliability, 
                  and transparency.
                </p>
                <p className="text-gray-600">
                  Combined with AI-powered automation and beautiful sharing interfaces, 
                  organizations can now showcase their trust investments to accelerate deals 
                  and partnerships.
                </p>
              </div>
            </div>

            {/* Impact */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibent text-gray-900 mb-3">The Impact</h3>
                <p className="text-gray-600 mb-4">
                  Today, ERIP serves organizations worldwide, helping them convert compliance costs 
                  into competitive advantages. Our customers report 40% faster sales cycles, 
                  60% reduction in compliance costs, and 3x faster partnership development.
                </p>
                <p className="text-gray-600">
                  We've processed over €50M in Trust Equity™ and helped organizations 
                  share trust with thousands of prospects and partners.
                </p>
              </div>
            </div>

            {/* Future */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">The Future</h3>
                <p className="text-gray-600 mb-4">
                  We're building toward a world where trust is transparent, quantifiable, and tradeable. 
                  Where organizations can instantly prove their reliability to any stakeholder. 
                  Where compliance becomes a growth accelerator, not a cost burden.
                </p>
                <p className="text-gray-600">
                  The Trust Intelligence Platform is just the beginning. 
                  Join us in reshaping how the world builds and shares trust.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Transform Your Trust?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of organizations converting compliance costs into competitive advantage.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Start Free Assessment
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;