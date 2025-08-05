import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// PublicFooter Component
const PublicFooter: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-lg blur-sm opacity-50"></div>
              </div>
              <span className="text-xl font-bold text-white font-serif">Velocity</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Stop drowning in compliance paperwork. Our AI agents work around the clock with revolutionary Banking ROI calculations and ISAE 3000 evidence automation. 
              83% cost savings, 88% vs Big 4 consulting.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>✓ 13 AI Agents</span>
              <span>✓ Banking ROI Calculator</span>
              <span>✓ ISAE 3000</span>
            </div>
          </div>
          
          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <div className="space-y-3">
              {[
                { label: 'AI Agent Dashboard', path: '/platform/overview' },
                { label: 'Evidence Collection', path: '/platform/evidence-collection' },
                { label: 'Trust Score', path: '/platform/trust-score' },
                { label: 'QIE Intelligence', path: '/velocity/qie' },
                { label: 'Pricing', path: '/velocity/pricing' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="block text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Industries */}
          <div>
            <h3 className="text-white font-semibold mb-4">Industries</h3>
            <div className="space-y-3">
              {[
                { label: 'Financial Services', path: '/industries/financial-services' },
                { label: 'Healthcare', path: '/industries/healthcare' },
                { label: 'SaaS', path: '/industries/saas' },
                { label: 'Manufacturing', path: '/industries/manufacturing' },
                { label: 'Government', path: '/industries/government' },
                { label: 'Energy', path: '/industries/energy' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="block text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Solutions */}
          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <div className="space-y-3">
              {[
                { label: 'Banking ROI Calculator', path: '/calculators/banking-roi', badge: '81% savings' },
                { label: 'ISAE 3000', path: '/solutions/isae-3000', badge: '88% vs Big 4' },
                { label: 'SOC 2', path: '/velocity/solutions/soc2' },
                { label: 'ISO 27001', path: '/velocity/solutions/iso27001' },
                { label: 'GDPR & International Transfers', path: '/velocity/solutions/gdpr' },
                { label: 'HIPAA', path: '/velocity/solutions/hipaa' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="block text-slate-400 hover:text-white transition-colors text-sm w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded ml-2 flex-shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <div className="space-y-3">
              {[
                { label: 'Compliance Guides', path: '/guides/compliance-automation' },
                { label: 'ROI Calculator', path: '/calculators/roi' },
                { label: 'Banking ROI', path: '/calculators/banking-roi' },
                { label: 'GDPR ROI', path: '/calculators/gdpr-roi' },
                { label: 'Case Studies', path: '/case-studies' },
                { label: 'Demo', path: '/velocity/demo' },
                { label: 'Documentation', path: '/velocity/docs' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="block text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <hr className="border-slate-800 my-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Velocity. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-500">Enterprise-grade security</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-slate-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
import { 
  ArrowLeft,
  CheckCircle,
  Shield,
  Clock,
  BarChart3,
  Target,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Play,
  Download,
  FileText,
  Gauge,
  Zap,
  Eye,
  Star,
  Calendar,
  DollarSign
} from 'lucide-react';

// Velocity Header Component (Dark Theme with Official Logo)
const AssessmentHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate('/velocity')}
              className="flex items-center gap-4 hover:scale-105 transition-all duration-200 group"
            >
              {/* Velocity Logo */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-xl shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-slate-900 font-bold text-2xl">V</span>
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold text-white font-serif tracking-wide">Velocity</span>
                <div className="text-base text-emerald-400 font-medium -mt-1 tracking-wide">AI Compliance Assessment</div>
              </div>
            </button>
            
            {/* Breadcrumb */}
            <div className="hidden lg:flex items-center gap-3 text-sm text-slate-400 bg-slate-800/30 px-4 py-2 rounded-lg border border-slate-700/50">
              <span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/velocity')}>Home</span>
              <span className="text-slate-600">/</span>
              <span className="text-emerald-400 font-medium">Free Assessment</span>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/velocity')}
              className="flex items-center gap-2 px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 border border-slate-700/50 hover:border-slate-600"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">Back to Home</span>
            </button>
            
            <button
              onClick={() => navigate('/velocity/login')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-emerald-500/25 border border-emerald-400/20"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Benefits Section Component
const BenefitsSection = () => {
  const benefits = [
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI evaluates your compliance posture across 200+ controls',
      color: 'purple'
    },
    {
      icon: Target,
      title: 'Prioritized Roadmap',
      description: 'Get a step-by-step plan ranked by impact and effort required',
      color: 'blue'
    },
    {
      icon: DollarSign,
      title: 'Cost Optimization',
      description: 'Accurate cost estimates and ROI projections for compliance initiatives',
      color: 'emerald'
    },
    {
      icon: Clock,
      title: 'Audit Readiness',
      description: 'Timeline and milestones to achieve audit-ready status',
      color: 'amber'
    },
    {
      icon: BarChart3,
      title: 'Trust Score Projection',
      description: 'See how your trust score will improve with recommended changes',
      color: 'indigo'
    },
    {
      icon: Eye,
      title: 'Gap Visibility',
      description: 'Clear visualization of compliance gaps and remediation priorities',
      color: 'rose'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            What You'll Get from Your Assessment
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our AI-powered assessment provides comprehensive insights to accelerate your compliance journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:-translate-y-1"
            >
              <div className={`p-4 bg-${benefit.color}-100 rounded-xl w-fit mb-6 group-hover:bg-${benefit.color}-200 transition-colors`}>
                <benefit.icon className={`h-8 w-8 text-${benefit.color}-600`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Framework Selection Component
const FrameworkSelection = ({ frameworks, selectedFramework, onFrameworkSelect }: {
  frameworks: any[];
  selectedFramework: string;
  onFrameworkSelect: (framework: string) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-3">
          Choose Your Compliance Framework
        </h3>
        <p className="text-slate-600">
          Select the framework most relevant to your organization
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {frameworks.map((framework) => (
          <button
            key={framework.name}
            onClick={() => onFrameworkSelect(framework.name)}
            className={`p-6 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg group ${
              selectedFramework === framework.name
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                selectedFramework === framework.name 
                  ? 'bg-blue-100' 
                  : 'bg-slate-100 group-hover:bg-blue-50'
              }`}>
                <Shield className={`h-6 w-6 ${
                  selectedFramework === framework.name 
                    ? 'text-blue-600' 
                    : 'text-slate-600 group-hover:text-blue-600'
                }`} />
              </div>
              {selectedFramework === framework.name && (
                <CheckCircle className="h-6 w-6 text-blue-600" />
              )}
            </div>
            
            <h4 className={`font-bold text-lg mb-2 ${
              selectedFramework === framework.name ? 'text-blue-900' : 'text-slate-900'
            }`}>
              {framework.name}
            </h4>
            <p className={`text-sm ${
              selectedFramework === framework.name ? 'text-blue-700' : 'text-slate-600'
            }`}>
              {framework.description}
            </p>
            
            {framework.popular && (
              <div className="mt-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  <Star className="h-3 w-3" />
                  Most Popular
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Stats Section Component
const StatsSection = () => {
  const stats = [
    { value: '500+', label: 'Companies Assessed', icon: Users },
    { value: '20 min', label: 'Average Assessment Time', icon: Clock },
    { value: '95%', label: 'Accuracy Rate', icon: Target },
    { value: '€4.9M', label: 'Average Savings Identified', icon: TrendingUp }
  ];

  return (
    <div className="bg-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by Leading Organizations
          </h2>
          <p className="text-slate-300 text-lg">
            Join hundreds of companies who've accelerated their compliance journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/10 p-4 rounded-full w-fit mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-blue-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Assessment Component
const ComplianceAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const frameworks = [
    { 
      name: 'SOC 2', 
      description: 'Service Organization Control 2 - Trust Services Criteria',
      popular: true,
      estimatedTime: '25-30 minutes',
      complexity: 'Medium'
    },
    { 
      name: 'ISO 27001', 
      description: 'Information Security Management System',
      popular: false,
      estimatedTime: '30-35 minutes',
      complexity: 'High'
    },
    { 
      name: 'GDPR', 
      description: 'General Data Protection Regulation',
      popular: true,
      estimatedTime: '20-25 minutes',
      complexity: 'Medium'
    },
    { 
      name: 'HIPAA', 
      description: 'Health Insurance Portability and Accountability Act',
      popular: false,
      estimatedTime: '25-30 minutes',
      complexity: 'Medium'
    },
    { 
      name: 'NIST CSF', 
      description: 'Cybersecurity Framework',
      popular: false,
      estimatedTime: '35-40 minutes',
      complexity: 'High'
    },
    { 
      name: 'PCI DSS', 
      description: 'Payment Card Industry Data Security Standard',
      popular: false,
      estimatedTime: '30-35 minutes',
      complexity: 'High'
    }
  ];

  const handleFrameworkSelect = (framework: string) => {
    setSelectedFramework(framework);
  };

  const handleStartAssessment = async () => {
    if (!selectedFramework) {
      alert('Please select a compliance framework first');
      return;
    }

    setIsLoading(true);
    
    try {
      // Try to create an assessment using the backend API
      const response = await fetch('http://localhost:8000/api/v1/assessments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          framework: selectedFramework,
          organizationName: 'Demo Organization',
          assessmentType: 'free_assessment'
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Navigate to dashboard with assessment results
        navigate('/dashboard', { 
          state: { 
            assessmentStarted: true, 
            framework: selectedFramework,
            assessmentId: result.assessment_id 
          } 
        });
      } else {
        // If API fails, still provide a good user experience
        navigate('/dashboard', { 
          state: { 
            assessmentStarted: true, 
            framework: selectedFramework,
            demo: true 
          } 
        });
      }
    } catch (error) {
      console.error('Assessment API error:', error);
      // Fallback to dashboard with demo mode
      navigate('/dashboard', { 
        state: { 
          assessmentStarted: true, 
          framework: selectedFramework,
          demo: true 
        } 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedFrameworkData = frameworks.find(f => f.name === selectedFramework);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <AssessmentHeader />
      
      {/* Hero Section - Velocity Style */}
      <div className="relative overflow-hidden py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCI+PC9jaXJjbGU+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm text-emerald-400 rounded-full text-sm font-medium mb-6 border border-emerald-500/30">
              <Sparkles className="h-4 w-4" />
              Free Compliance Assessment
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight font-serif">
              Know Your <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">Compliance Score</span> in 30 Minutes
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get an AI-powered assessment of your compliance posture with actionable insights, 
              cost estimates, and a roadmap to audit readiness.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">No integration required</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Instant results</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">100% free</span>
              </div>
            </div>
          </div>
          
          {/* Assessment Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="p-8 md:p-12">
                <FrameworkSelection 
                  frameworks={frameworks}
                  selectedFramework={selectedFramework}
                  onFrameworkSelect={handleFrameworkSelect}
                />
                
                {selectedFramework && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-blue-900 mb-2">
                          {selectedFramework} Assessment Selected
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Duration: {selectedFrameworkData?.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Gauge className="h-4 w-4" />
                            <span>Complexity: {selectedFrameworkData?.complexity}</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={handleStartAssessment}
                          disabled={isLoading}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Starting Assessment...
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5" />
                              Start {selectedFramework} Assessment
                              <ArrowRight className="h-5 w-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BenefitsSection />
      <StatsSection />
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Compliance Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of companies who've accelerated their path to compliance
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                document.querySelector('.bg-white.rounded-3xl')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              Start Free Assessment
            </button>
            <button
              onClick={() => navigate('/velocity/demo')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  );
};

export default ComplianceAssessmentPage;