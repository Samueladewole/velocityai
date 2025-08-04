import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUrlState } from '../hooks/useUrlState';
import { PublicHeader } from '../components/common/PublicHeader';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  FileText, 
  Settings, 
  Bot,
  Database,
  Target,
  Award,
  Lock,
  Globe,
  Layers,
  Timer,
  BarChart3,
  Eye,
  Cpu,
  Server,
  Activity,
  Check,
  Star,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle,
  Building,
  Rocket,
  Fingerprint,
  Calendar,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TrustPathway: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useUrlState('step', '0', {
    storageKey: 'trust_pathway_step'
  });
  const [showBackButton, setShowBackButton] = useState(false);
  const [returnPosition, setReturnPosition] = useState<any>(null);
  
  // Convert string to number for backward compatibility
  const activeStepNum = parseInt(activeStep);
  const setActiveStepNum = (step: number) => setActiveStep(step.toString());
  
  // Check if there's a return position stored
  useEffect(() => {
    const storedPosition = sessionStorage.getItem('velocity_return_position');
    if (storedPosition) {
      try {
        const position = JSON.parse(storedPosition);
        // Only show if the stored position is recent (within last 10 minutes)
        const isRecent = Date.now() - position.timestamp < 10 * 60 * 1000;
        if (isRecent && position.url !== window.location.href) {
          setReturnPosition(position);
          setShowBackButton(true);
        }
      } catch (error) {
        console.error('Error parsing return position:', error);
      }
    }
  }, []);
  
  const handleReturnToPreviousPosition = () => {
    if (returnPosition) {
      // Navigate back to the stored URL
      window.location.href = returnPosition.url;
      
      // Schedule scroll restoration after page loads
      setTimeout(() => {
        window.scrollTo({
          top: returnPosition.scrollY,
          behavior: 'smooth'
        });
      }, 100);
      
      // Clear the stored position
      sessionStorage.removeItem('velocity_return_position');
      setShowBackButton(false);
    }
  };
  
  // Handle hash navigation for scrolling to sections
  useEffect(() => {
    // Function to handle scrolling to hash element
    const handleHashScroll = () => {
      const hash = window.location.hash || location.hash;
      if (hash) {
        const elementId = hash.substring(1); // Remove the # character
        console.log(`Attempting to scroll to element: ${elementId}`);
        
        const scrollToElement = () => {
          const element = document.getElementById(elementId);
          if (element) {
            console.log(`Found element: ${elementId}, scrolling...`);
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
            return true;
          }
          return false;
        };
        
        // Multiple attempts with increasing delays to ensure page is loaded
        const delays = [0, 100, 300, 600, 1000, 1500];
        delays.forEach((delay, index) => {
          setTimeout(() => {
            if (scrollToElement()) {
              console.log(`Successfully scrolled to ${elementId} on attempt ${index + 1}`);
            } else if (index === delays.length - 1) {
              console.warn(`Failed to scroll to element: ${elementId}`);
            }
          }, delay);
        });
      }
    };
    
    // Handle both location change and hash change
    handleHashScroll();
    
    // Also listen for hash changes
    window.addEventListener('hashchange', handleHashScroll);
    
    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, [location]);

  // The 13 AI Agents in Velocity's Trust Pathway
  const aiAgents = [
    {
      id: 'aws-evidence',
      name: 'AWS Evidence Collector',
      icon: Database,
      description: 'Automatically captures comprehensive AWS security configurations, CloudTrail logs, and compliance evidence',
      capabilities: ['CloudTrail Analysis', 'IAM Policy Review', 'Security Group Monitoring', 'Compliance Documentation'],
      evidenceTypes: 89,
      successRate: 98.2
    },
    {
      id: 'gcp-scanner',
      name: 'GCP Security Scanner',
      icon: Shield,
      description: 'Monitors Google Cloud Platform security settings, IAM policies, and resource configurations',
      capabilities: ['IAM Policy Analysis', 'Resource Monitoring', 'Security Center Integration', 'Audit Logging'],
      evidenceTypes: 67,
      successRate: 97.8
    },
    {
      id: 'azure-monitor',
      name: 'Azure Security Monitor',
      icon: Eye,
      description: 'Comprehensive Azure Security Center monitoring and compliance evidence collection',
      capabilities: ['Security Center Alerts', 'Resource Compliance', 'Policy Monitoring', 'Threat Detection'],
      evidenceTypes: 74,
      successRate: 96.5
    },
    {
      id: 'github-analyzer',
      name: 'GitHub Security Analyzer',
      icon: Lock,
      description: 'Analyzes repository security, branch protection, secrets scanning, and development practices',
      capabilities: ['Branch Protection', 'Secrets Scanning', 'Code Security', 'Access Control'],
      evidenceTypes: 45,
      successRate: 99.1
    },
    {
      id: 'qie-agent',
      name: 'QIE Integration Agent',
      icon: FileText,
      description: 'Intelligent questionnaire processing and compliance evidence mapping across frameworks',
      capabilities: ['Smart Questionnaire Processing', 'Evidence Mapping', 'Framework Alignment', 'Response Validation'],
      evidenceTypes: 156,
      successRate: 94.7
    },
    {
      id: 'trust-engine',
      name: 'Trust Score Engine',
      icon: Award,
      description: 'Cryptographically verified trust score calculation with immutable blockchain proof',
      capabilities: ['Real-time Scoring', 'Cryptographic Verification', 'Blockchain Proof', 'Trend Analysis'],
      evidenceTypes: 1,
      successRate: 99.8
    },
    {
      id: 'continuous-monitor',
      name: 'Continuous Monitor',
      icon: Activity,
      description: 'Real-time monitoring of configuration changes and compliance drift detection',
      capabilities: ['Configuration Monitoring', 'Drift Detection', 'Real-time Alerts', 'Change Tracking'],
      evidenceTypes: 234,
      successRate: 97.3
    },
    {
      id: 'document-generator',
      name: 'Document Generator',
      icon: Layers,
      description: 'Automatically generates professional compliance policies, procedures, and documentation',
      capabilities: ['Policy Generation', 'Procedure Documentation', 'Template Customization', 'Compliance Alignment'],
      evidenceTypes: 12,
      successRate: 95.4
    },
    {
      id: 'observability-specialist',
      name: 'Observability Specialist',
      icon: BarChart3,
      description: 'Comprehensive system monitoring, audit trail collection, and performance analytics',
      capabilities: ['System Monitoring', 'Audit Trails', 'Performance Analytics', 'Log Analysis'],
      evidenceTypes: 178,
      successRate: 96.8
    },
    {
      id: 'crypto-verification',
      name: 'Cryptographic Verification',
      icon: Fingerprint,
      description: 'Immutable proof generation for all evidence and decisions using blockchain technology',
      capabilities: ['Blockchain Proof', 'Evidence Integrity', 'Immutable Records', 'Cryptographic Verification'],
      evidenceTypes: 1,
      successRate: 100.0
    },
    {
      id: 'isae3000-agent',
      name: 'ISAE 3000 Evidence Agent',
      icon: Building,
      description: 'Specialized banking and financial services compliance evidence collection for ISAE 3000 audits',
      capabilities: ['Banking Compliance', 'ISAE 3000 Evidence', 'Financial Controls', 'Audit Preparation'],
      evidenceTypes: 92,
      successRate: 98.7
    },
    {
      id: 'banking-roi',
      name: 'Banking ROI Calculator Agent',
      icon: DollarSign,
      description: 'Quantifies financial benefits and ROI from compliance and trust improvements',
      capabilities: ['ROI Calculation', 'Cost-Benefit Analysis', 'Financial Modeling', 'Business Impact'],
      evidenceTypes: 23,
      successRate: 97.1
    },
    {
      id: 'gdpr-compliance',
      name: 'GDPR Compliance Agent',
      icon: Globe,
      description: 'Manages GDPR compliance including data mapping, consent tracking, and international transfer solutions',
      capabilities: ['Data Mapping', 'Consent Management', 'Transfer Impact Assessments', 'Privacy Documentation'],
      evidenceTypes: 84,
      successRate: 96.3
    }
  ];

  // Progressive Trust Building Steps
  const trustSteps = [
    {
      phase: 'Discovery',
      title: 'Automated Evidence Collection',
      description: 'Our 13 AI agents begin collecting compliance evidence across your entire technology stack',
      duration: '3 days',
      activities: [
        'Deploy AI agents to cloud platforms',
        'Scan existing configurations and policies',
        'Map compliance frameworks to your infrastructure',
        'Begin continuous monitoring'
      ],
      outcome: 'Complete inventory of your compliance posture'
    },
    {
      phase: 'Analysis',
      title: 'Intelligent Gap Assessment',
      description: 'AI-powered analysis identifies compliance gaps and provides actionable recommendations',
      duration: '1-2 days',
      activities: [
        'Analyze collected evidence against frameworks',
        'Identify critical compliance gaps',
        'Generate remediation roadmap',
        'Prioritize actions by business impact'
      ],
      outcome: 'Clear roadmap to compliance certification'
    },
    {
      phase: 'Implementation',
      title: 'Guided Compliance Journey',
      description: 'Step-by-step guidance with automated documentation and evidence collection',
      duration: '30-45 days',
      activities: [
        'Implement recommended security controls',
        'Generate compliance documentation automatically',
        'Continuous evidence collection and validation',
        'Real-time progress tracking'
      ],
      outcome: 'Audit-ready compliance program'
    },
    {
      phase: 'Verification',
      title: 'Cryptographic Trust Proof',
      description: 'Immutable blockchain verification ensures trust and transparency in your compliance',
      duration: 'Ongoing',
      activities: [
        'Generate cryptographic proofs for all evidence',
        'Create immutable audit trail',
        'Calculate verified trust score',
        'Enable transparent trust sharing'
      ],
      outcome: 'Cryptographically verified trust score'
    }
  ];

  // Business Benefits
  const businessBenefits = [
    {
      category: 'Sales Acceleration',
      icon: Rocket,
      benefits: [
        'Reduce sales cycle by 40-60%',
        'Win deals 3x faster with trust proof',
        'Eliminate lengthy security questionnaires',
        'Close enterprise deals with confidence'
      ],
      metrics: { primary: '3x', secondary: 'Faster Deal Closure' }
    },
    {
      category: 'Operational Efficiency',
      icon: Zap,
      benefits: [
        'Automate 95% of compliance work',
        'Reduce manual documentation by 80%',
        'Eliminate repetitive questionnaires',
        'Focus teams on strategic initiatives'
      ],
      metrics: { primary: '95%', secondary: 'Work Automated' }
    },
    {
      category: 'Risk Reduction',
      icon: Shield,
      benefits: [
        'Continuous compliance monitoring',
        'Real-time risk assessment',
        'Proactive gap identification',
        'Regulatory change adaptation'
      ],
      metrics: { primary: '24/7', secondary: 'Risk Monitoring' }
    },
    {
      category: 'Cost Savings',
      icon: DollarSign,
      benefits: [
        'Reduce compliance costs by 70%',
        'Eliminate consultant dependencies',
        'Minimize audit preparation time',
        'Avoid regulatory penalties'
      ],
      metrics: { primary: '$500K+', secondary: 'Annual Savings' }
    }
  ];

  // Trust Score Tiers
  const trustTiers = [
    { name: 'Bronze', range: '0-25', color: 'text-amber-600', bg: 'bg-amber-50', benefits: ['Basic compliance tracking', 'Quarterly assessments'] },
    { name: 'Silver', range: '26-50', color: 'text-slate-600', bg: 'bg-slate-50', benefits: ['Monthly reporting', 'Framework alignment', 'Basic automation'] },
    { name: 'Gold', range: '51-75', color: 'text-yellow-600', bg: 'bg-yellow-50', benefits: ['Weekly insights', 'Advanced automation', 'Trust sharing'] },
    { name: 'Platinum', range: '76-90', color: 'text-purple-600', bg: 'bg-purple-50', benefits: ['Real-time monitoring', 'Predictive analytics', 'Premium support'] },
    { name: 'Diamond', range: '91-100', color: 'text-blue-600', bg: 'bg-blue-50', benefits: ['Maximum automation', 'White-glove service', 'Executive reporting'] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 px-6 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            The World's First Cryptographically Verified Compliance Platform
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
            Your <span className="text-emerald-400">Trust Pathway</span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover how Velocity transforms compliance from a burden into your competitive advantage. 
            Our progressive integration approach builds trust systematically, providing cryptographic 
            proof of your security posture that accelerates business growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/velocity/demo')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </button>
            <button 
              onClick={() => navigate('/velocity/solutions/gdpr')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              International Transfer Solutions
            </button>
          </div>
        </div>
      </section>

      {/* Progressive Trust Building Steps */}
      <section className="py-20 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 font-serif">
              Progressive Trust Building
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our methodology transforms compliance from reactive paperwork to proactive trust building, 
              creating measurable business value at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustSteps.map((step, index) => (
              <div 
                key={index}
                className={`cursor-pointer transition-all duration-300 bg-white/5 backdrop-blur-sm rounded-2xl border p-6 hover:border-emerald-500/30 ${
                  activeStepNum === index ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/20' : 'border-white/10'
                }`}
                onClick={() => setActiveStepNum(index)}
              >
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                    {index + 1}
                  </div>
                  <div className="text-sm text-emerald-400 font-medium mb-2">{step.phase}</div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                </div>
                
                <p className="text-slate-300 text-sm mb-4">{step.description}</p>
                <div className="text-xs text-slate-400 mb-3 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {step.duration}
                </div>
                <div className={`transition-all duration-300 ${
                  activeStepNum === index ? 'max-h-96' : 'max-h-0 overflow-hidden'
                }`}>
                  <div className="space-y-2 mb-4">
                    {step.activities.map((activity, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{activity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                    <div className="text-xs font-medium text-emerald-400 mb-1">Outcome</div>
                    <div className="text-sm text-emerald-300">{step.outcome}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Showcase */}
      <section id="ai-agents-section" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 font-serif">
              Meet Your 13 AI Compliance Agents
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Each agent specializes in a specific aspect of compliance, working together to build 
              a comprehensive, continuously updated picture of your security posture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiAgents.map((agent) => {
              const IconComponent = agent.icon;
              return (
                <div key={agent.id} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white">{agent.name}</h3>
                      <div className="text-xs text-slate-400">
                        {agent.evidenceTypes} evidence types • {agent.successRate}% success rate
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-4">{agent.description}</p>
                  <div className="space-y-1">
                    {agent.capabilities.slice(0, 3).map((capability, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-slate-300">{capability}</span>
                      </div>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <div className="text-xs text-slate-400 mt-2">
                        +{agent.capabilities.length - 3} more capabilities
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/velocity/agents')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
            >
              Explore All Agents in Detail
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Cryptographic Verification */}
      <section className="py-20 px-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            <Fingerprint className="w-4 h-4" />
            Blockchain-Verified Trust
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Immutable Proof of Your Compliance
          </h2>
          
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Every piece of evidence, every decision, and every trust score calculation is cryptographically 
            verified and stored on an immutable blockchain. This isn't just compliance—it's provable trust.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cryptographic Integrity</h3>
              <p className="text-slate-300 text-sm">
                Every evidence item is cryptographically signed and tamper-proof
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Immutable Records</h3>
              <p className="text-slate-300 text-sm">
                Blockchain storage ensures your compliance history can never be altered
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transparent Verification</h3>
              <p className="text-slate-300 text-sm">
                Stakeholders can independently verify your trust score and evidence
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
            <div className="text-6xl font-bold text-emerald-400 mb-2">99.9%</div>
            <div className="text-lg text-slate-300 mb-4">Evidence Integrity Guarantee</div>
            <p className="text-sm text-slate-400">
              Cryptographically verified with blockchain proof of authenticity
            </p>
          </div>
        </div>
      </section>

      {/* Trust Score Tiers */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 font-serif">
              Your Trust Score Journey
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              As your compliance improves, your trust score increases, unlocking greater business benefits 
              and competitive advantages at each tier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {trustTiers.map((tier, index) => (
              <div key={tier.name} className="bg-white/5 backdrop-blur-sm border-2 border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">
                    {tier.range}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-4">{tier.name}</h3>
                </div>
                <div className="space-y-2">
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Star className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Benefits */}
      <section className="py-20 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 font-serif">
              Measurable Business Impact
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Velocity doesn't just improve compliance—it transforms it into a revenue driver 
              and competitive advantage for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {businessBenefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <div key={benefit.category} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{benefit.category}</h3>
                    <div className="text-3xl font-bold text-emerald-400 mt-2">
                      {benefit.metrics.primary}
                    </div>
                    <div className="text-sm text-slate-400">
                      {benefit.metrics.secondary}
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    {benefit.benefits.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 font-serif">
            Ready to Transform Your Compliance?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            Join forward-thinking organizations who've made compliance their competitive advantage. 
            Start your trust pathway today and see results in days, not months.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/velocity/demo')}
              className="px-10 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300 flex items-center justify-center"
            >
              Start Free Demo
              <Rocket className="w-4 h-4 ml-2" />
            </button>
            <button 
              onClick={() => navigate('/velocity/contact')}
              className="px-10 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Schedule Strategy Call
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">2,000+</div>
              <div className="text-white/80">Evidence Types Collected</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98.5%</div>
              <div className="text-white/80">Automation Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">60%</div>
              <div className="text-white/80">Faster Deal Closure</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Floating Back Button */}
      {showBackButton && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={handleReturnToPreviousPosition}
            className="group flex items-center gap-3 px-6 py-4 bg-slate-900/95 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-slate-800/95 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <div className="text-left">
              <div className="text-sm font-semibold">Return to Previous Spot</div>
              <div className="text-xs text-slate-400">Back to where you left off</div>
            </div>
          </button>
          
          {/* Dismiss button */}
          <button
            onClick={() => {
              sessionStorage.removeItem('velocity_return_position');
              setShowBackButton(false);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-slate-600 hover:bg-slate-500 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default TrustPathway;