import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Case Study Data
const caseStudies = [
  {
    id: 'techcorp-soc2',
    company: 'TechCorp Solutions',
    industry: 'SaaS',
    size: '500 employees',
    revenue: '€50M ARR',
    challenge: 'First-time SOC 2 Type II certification blocking enterprise deals',
    framework: 'SOC 2 Type II',
    timeline: '6 weeks',
    icon: '🚀',
    color: 'emerald',
    metrics: {
      implementationTime: { before: '12 months', after: '6 weeks', improvement: '95%' },
      cost: { before: '€280K', after: '€85K', improvement: '70%' },
      automationRate: '95%',
      dealVelocity: '+120%',
      revenueImpact: '+€8.5M',
      trustScore: '94/100'
    },
    results: [
      'Achieved SOC 2 Type II certification in 6 weeks vs industry average of 12 months',
      'Reduced compliance costs by 70% through AI automation',
      'Accelerated enterprise deal closure by 120%',
      'Generated €8.5M in additional revenue within 12 months',
      'Maintained 95% automation rate for ongoing compliance'
    ],
    testimonial: {
      quote: "Velocity AI transformed our compliance program from a cost center into a competitive advantage. We're now winning enterprise deals we couldn't even bid on before.",
      author: "Sarah Chen",
      title: "CEO, TechCorp Solutions"
    }
  },
  {
    id: 'healthtech-hipaa',
    company: 'MedFlow Analytics',
    industry: 'Healthcare Technology',
    size: '250 employees',
    revenue: '€25M ARR',
    challenge: 'HIPAA compliance for AI-powered medical analytics platform',
    framework: 'HIPAA + SOC 2',
    timeline: '8 weeks',
    icon: '🏥',
    color: 'blue',
    metrics: {
      implementationTime: { before: '18 months', after: '8 weeks', improvement: '89%' },
      cost: { before: '€320K', after: '€95K', improvement: '70%' },
      automationRate: '91%',
      auditPrep: '2 weeks vs 6 months',
      riskReduction: '85%',
      customerConfidence: '+65%'
    },
    results: [
      'Achieved dual HIPAA & SOC 2 compliance in 8 weeks',
      'Reduced compliance preparation time by 89%',
      'Automated 91% of ongoing compliance activities',
      'Reduced security risk by 85% through continuous monitoring',
      'Increased customer confidence scores by 65%'
    ],
    testimonial: {
      quote: "Velocity's AI agents gave us the confidence to handle sensitive medical data at scale. Our customers trust us with their most critical healthcare analytics.",
      author: "Dr. Michael Rodriguez",
      title: "CTO, MedFlow Analytics"
    }
  }
];

const CaseStudyCard: React.FC<{
  study: typeof caseStudies[0];
  onClick: () => void;
}> = ({ study, onClick }) => {
  const colorClasses = {
    emerald: 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60',
    blue: 'border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60',
    amber: 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60',
    purple: 'border-purple-500/30 bg-purple-500/5 hover:border-purple-500/60',
    indigo: 'border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500/60'
  };

  return (
    <div
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 cursor-pointer transform hover:scale-105 €{colorClasses[study.color as keyof typeof colorClasses]}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{study.icon}</div>
        <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">
          {study.industry}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{study.company}</h3>
      <p className="text-slate-300 text-sm mb-4">{study.challenge}</p>
      
      <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
        <span>{study.size}</span>
        <span className="text-emerald-400">{study.framework}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {study.metrics.implementationTime.improvement}
          </div>
          <div className="text-xs text-slate-400">Faster Implementation</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {study.metrics.cost.improvement}
          </div>
          <div className="text-xs text-slate-400">Cost Reduction</div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-700">
        <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
          Read Full Case Study →
        </button>
      </div>
    </div>
  );
};

const CaseStudies: React.FC<{ searchTerm?: string; selectedCategory?: string }> = ({ 
  searchTerm = '', 
  selectedCategory = '' 
}) => {
  const [selectedStudy, setSelectedStudy] = useState<typeof caseStudies[0] | null>(null);
  
  const filteredStudies = caseStudies.filter(study => {
    const matchesSearch = study.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.challenge.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || study.industry === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Overview Stats */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Real Results from Real Companies
        </h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-emerald-400 mb-2">87%</div>
            <div className="text-slate-400 text-sm">Average Time Reduction</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400 mb-2">70%</div>
            <div className="text-slate-400 text-sm">Average Cost Savings</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400 mb-2">91%</div>
            <div className="text-slate-400 text-sm">Average Automation Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400 mb-2">€23M</div>
            <div className="text-slate-400 text-sm">Total Revenue Impact</div>
          </div>
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudies.map((study) => (
          <CaseStudyCard
            key={study.id}
            study={study}
            onClick={() => setSelectedStudy(study)}
          />
        ))}
      </div>

      {filteredStudies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No case studies found</h3>
          <p className="text-slate-400">Try adjusting your search terms or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default CaseStudies;