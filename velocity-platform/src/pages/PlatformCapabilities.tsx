import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Brain, 
  FileCheck, 
  Award, 
  Users, 
  Eye, 
  Globe, 
  Zap, 
  BarChart3, 
  AlertTriangle, 
  Lock, 
  Briefcase,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Target,
  Settings,
  Database,
  Bot,
  Cpu,
  Network,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export const PlatformCapabilities: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState('all');

  const platformComponents = [
    {
      id: 'qie',
      name: 'QIE - Questionnaire Intelligence Engine',
      icon: Brain,
      category: 'Trust Building',
      workflow: 'automation',
      department: 'Compliance',
      description: 'AI-powered questionnaire automation with 95% time reduction',
      features: [
        'Smart document processing (PDF, Excel, Word)',
        'AI-powered answer generation with confidence scoring',
        'Evidence matching and compliance validation'
      ],
      trustPoints: 150,
      href: '/qie-enhanced',
      status: 'Active',
      valueCreated: 'Time Savings',
      metrics: { primary: '95%', secondary: 'time reduction' }
    },
    {
      id: 'dtef',
      name: 'ISACA DTEF Automation',
      icon: FileCheck,
      category: 'Trust Building',
      workflow: 'assessment',
      department: 'Risk Management',
      description: 'Complete Digital Trust Ecosystem Framework implementation',
      features: [
        '5-dimension trust assessment automation',
        'Gap analysis and control validation',
        'Executive reporting and compliance dashboard'
      ],
      trustPoints: 200,
      href: '/dtef-automation',
      status: 'Active',
      valueCreated: 'Compliance Speed',
      metrics: { primary: '7.2x', secondary: 'faster compliance' }
    },
    {
      id: 'certifications',
      name: 'Industry Certifications',
      icon: Award,
      category: 'Trust Building',
      workflow: 'validation',
      department: 'Compliance',
      description: 'TISAX, ISO 27701, SOC 2, HIPAA with automated tracking',
      features: [
        'Multi-framework certification management',
        'Automated evidence collection and validation',
        'Certification renewal and compliance monitoring'
      ],
      trustPoints: 300,
      href: '/certifications',
      status: 'Active',
      valueCreated: 'Trust Demonstration',
      metrics: { primary: '78%', secondary: 'RFP success rate' }
    },
    {
      id: 'trust-score',
      name: 'Trust Score Sharing',
      icon: ExternalLink,
      category: 'Sales Enablement',
      workflow: 'acceleration',
      department: 'Sales',
      description: 'Shareable Trust Score URLs for sales acceleration',
      features: [
        'Public trust profiles with privacy controls',
        'Social media integration and QR codes',
        'Analytics dashboard with engagement metrics'
      ],
      trustPoints: 100,
      href: '/trust-score-share',
      status: 'Active',
      valueCreated: 'Sales Speed',
      metrics: { primary: '40%', secondary: 'faster deals' }
    },
    {
      id: 'privacy-management',
      name: 'Privacy Management Suite',
      icon: Shield,
      category: 'Privacy & Protection',
      workflow: 'governance',
      department: 'Privacy',
      description: 'Shadow IT, DSAR, RoPA, DPIA with Python backend',
      features: [
        'Automated Shadow IT discovery and risk assessment',
        'DSAR processing with template generation',
        'RoPA management with GDPR compliance tracking'
      ],
      trustPoints: 250,
      href: '/privacy-management',
      status: 'Active',
      valueCreated: 'Privacy Automation',
      metrics: { primary: '100%', secondary: 'GDPR compliance' }
    },
    {
      id: 'ai-governance',
      name: 'AI Governance Module',
      icon: Bot,
      category: 'AI & Innovation',
      workflow: 'governance',
      department: 'AI Ethics',
      description: 'ISO 42001, AI Registry, Risk Assessment with enterprise governance',
      features: [
        'Complete AI system registry and EU AI Act compliance',
        'ISO 42001 compliance framework automation',
        'AI risk assessment and responsible AI training'
      ],
      trustPoints: 275,
      href: '/ai-governance',
      status: 'Active',
      valueCreated: 'AI Compliance',
      metrics: { primary: '94%', secondary: 'governance score' }
    },
    {
      id: 'framework-management',
      name: 'Framework Management System',
      icon: Settings,
      category: 'Risk Management',
      workflow: 'optimization',
      department: 'Risk Management',
      description: '70% overlap optimization across compliance frameworks',
      features: [
        'Multi-framework overlap detection and optimization',
        'Control mapping and gap analysis automation',
        'Unified compliance dashboard and reporting'
      ],
      trustPoints: 180,
      href: '/framework-management',
      status: 'Coming Soon',
      valueCreated: 'Efficiency',
      metrics: { primary: '70%', secondary: 'overlap reduction' }
    },
    {
      id: 'policy-management',
      name: 'Policy Management 2.0',
      icon: FileCheck,
      category: 'Governance',
      workflow: 'management',
      department: 'Legal',
      description: 'Next-generation policy lifecycle management platform',
      features: [
        'AI-powered policy drafting and review',
        'Automated policy impact analysis',
        'Stakeholder collaboration and approval workflows'
      ],
      trustPoints: 160,
      href: '/policy-management',
      status: 'Coming Soon',
      valueCreated: 'Policy Efficiency',
      metrics: { primary: '60%', secondary: 'faster policies' }
    },
    {
      id: 'employee-training',
      name: 'Employee Training Platform',
      icon: Users,
      category: 'Human Capital',
      workflow: 'enablement',
      department: 'HR',
      description: 'Gamified compliance training with personalized learning paths',
      features: [
        'Adaptive learning paths with gamification',
        'Real-time progress tracking and analytics',
        'Certification management and skills assessment'
      ],
      trustPoints: 120,
      href: '/employee-training',
      status: 'Coming Soon',
      valueCreated: 'Training Effectiveness',
      metrics: { primary: '85%', secondary: 'completion rate' }
    },
    {
      id: 'assessment-marketplace',
      name: 'Shared Assessment Marketplace',
      icon: Briefcase,
      category: 'Collaboration',
      workflow: 'sharing',
      department: 'Procurement',
      description: 'Collaborative platform for sharing security assessments',
      features: [
        'Vendor assessment sharing and collaboration',
        'Pre-validated security questionnaire library',
        'Industry benchmark and peer comparison'
      ],
      trustPoints: 140,
      href: '/assessment-marketplace',
      status: 'Coming Soon',
      valueCreated: 'Vendor Efficiency',
      metrics: { primary: '50%', secondary: 'faster vendor onboarding' }
    },
    {
      id: 'cloud-scanning',
      name: 'Cloud Environment Scanning',
      icon: Globe,
      category: 'Infrastructure',
      workflow: 'monitoring',
      department: 'DevOps',
      description: 'AWS, Azure, GCP security posture and compliance scanning',
      features: [
        'Multi-cloud security posture assessment',
        'Real-time configuration monitoring',
        'Automated compliance gap identification'
      ],
      trustPoints: 200,
      href: '/cloud-scanning',
      status: 'Coming Soon',
      valueCreated: 'Cloud Security',
      metrics: { primary: '99%', secondary: 'configuration coverage' }
    },
    {
      id: 'risk-quantification',
      name: 'PRISM - Risk Quantification',
      icon: BarChart3,
      category: 'Risk Analytics',
      workflow: 'analysis',
      department: 'Risk Management',
      description: 'Monte Carlo risk modeling with financial impact analysis',
      features: [
        'FAIR methodology implementation',
        'Advanced Monte Carlo simulations',
        'Financial impact modeling and VaR calculations'
      ],
      trustPoints: 220,
      href: '/prism-demo',
      status: 'Active',
      valueCreated: 'Risk Insight',
      metrics: { primary: '€2.3M', secondary: 'average ROI' }
    },
    {
      id: 'threat-intelligence',
      name: 'NEXUS - Threat Intelligence',
      icon: Eye,
      category: 'Security Intelligence',
      workflow: 'monitoring',
      department: 'Security',
      description: 'Advanced threat intelligence and industry benchmarking',
      features: [
        'Real-time threat intelligence aggregation',
        'Industry benchmarking and peer analysis',
        'Predictive risk analytics and trend analysis'
      ],
      trustPoints: 180,
      href: '/nexus',
      status: 'Active',
      valueCreated: 'Threat Awareness',
      metrics: { primary: '24/7', secondary: 'monitoring' }
    }
  ];

  const workflowCategories = [
    { id: 'all', name: 'All Components', count: platformComponents.length },
    { id: 'automation', name: 'Automation', count: platformComponents.filter(c => c.workflow === 'automation').length },
    { id: 'governance', name: 'Governance', count: platformComponents.filter(c => c.workflow === 'governance').length },
    { id: 'assessment', name: 'Assessment', count: platformComponents.filter(c => c.workflow === 'assessment').length },
    { id: 'acceleration', name: 'Acceleration', count: platformComponents.filter(c => c.workflow === 'acceleration').length }
  ];

  const departmentCategories = [
    'All Departments',
    'Compliance',
    'Risk Management', 
    'Privacy',
    'Sales',
    'AI Ethics',
    'Legal',
    'HR',
    'Security',
    'DevOps'
  ];

  const valueCategories = [
    'All Value Types',
    'Time Savings',
    'Compliance Speed',
    'Trust Demonstration', 
    'Sales Speed',
    'Privacy Automation',
    'Efficiency',
    'Risk Insight'
  ];

  const filteredComponents = activeWorkflow === 'all' 
    ? platformComponents 
    : platformComponents.filter(c => c.workflow === activeWorkflow);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,0.02)_0%,_transparent_50%)] pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl text-center relative">
          <div className="mb-6">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-4">
              Platform Capabilities
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                The Only Platform That Turns
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Compliance Into Competitive Advantage
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover how ERIP's 13+ enterprise components work together to automate compliance, 
              accelerate sales, and build measurable Trust Equity™ across your organization.
            </p>
          </div>

          {/* Value Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">95%</div>
              <div className="text-sm text-slate-600">Time Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">40%</div>
              <div className="text-sm text-slate-600">Faster Sales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">7.2x</div>
              <div className="text-sm text-slate-600">Compliance Speed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">€2.3M</div>
              <div className="text-sm text-slate-600">Average ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Component Showcase */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything You Need for Digital Trust
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore our comprehensive suite of enterprise-grade components, organized by workflow, 
              department, or value created. Hover to see how they integrate.
            </p>
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeWorkflow} onValueChange={setActiveWorkflow} className="mb-8">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
              {workflowCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-sm">
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Component Grid */}
            <TabsContent value={activeWorkflow} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredComponents.map((component) => (
                  <Card 
                    key={component.id} 
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white/70 backdrop-blur-sm flex flex-col h-full"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn(
                          "p-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110",
                          component.status === 'Active' 
                            ? "bg-gradient-to-br from-blue-600 to-purple-700" 
                            : "bg-gradient-to-br from-slate-400 to-slate-600"
                        )}>
                          <component.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={component.status === 'Active' ? 'default' : 'secondary'}
                            className="mb-2"
                          >
                            {component.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-blue-600">
                            <Star className="h-3 w-3" />
                            <span className="text-xs font-medium">+{component.trustPoints} Trust Points</span>
                          </div>
                        </div>
                      </div>
                      
                      <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {component.name}
                      </CardTitle>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {component.description}
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0 flex-grow flex flex-col pb-6">
                      {/* Key Features */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Features</h4>
                        <ul className="space-y-1">
                          {component.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Value Metrics */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg mb-6">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {component.metrics.primary}
                          </div>
                          <div className="text-xs text-slate-600">
                            {component.metrics.secondary}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500 mb-1">
                            {component.valueCreated}
                          </div>
                          <div className="text-xs text-slate-500">
                            {component.department}
                          </div>
                        </div>
                      </div>

                      {/* Spacer to push button to bottom */}
                      <div className="flex-grow"></div>

                      {/* Action Button - Always at bottom */}
                      {component.status === 'Active' ? (
                        <Button 
                          asChild 
                          className="w-full min-h-[44px] group-hover:bg-blue-600 transition-colors"
                        >
                          <Link to={component.href} className="flex items-center justify-center gap-2">
                            <span>Explore Component</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          variant="secondary"
                          disabled
                          className="w-full min-h-[44px]"
                        >
                          Coming Soon
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Integration Ecosystem */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Enterprise Integration Ecosystem
          </h2>
          <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto">
            ERIP connects seamlessly with your existing tools and platforms, 
            creating a unified trust intelligence architecture.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cloud Providers</h3>
              <p className="text-slate-300 text-sm mb-4">
                AWS, Azure, GCP integration for security posture assessment
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">AWS</Badge>
                <Badge variant="secondary">Azure</Badge>
                <Badge variant="secondary">GCP</Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Security Tools</h3>
              <p className="text-slate-300 text-sm mb-4">
                Native integrations with leading security platforms
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">SIEM</Badge>
                <Badge variant="secondary">GRC</Badge>
                <Badge variant="secondary">SOAR</Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Network className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Developer APIs</h3>
              <p className="text-slate-300 text-sm mb-4">
                RESTful APIs and SDKs for custom integrations
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">REST API</Badge>
                <Badge variant="secondary">GraphQL</Badge>
                <Badge variant="secondary">Webhooks</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Transform Your Compliance Strategy?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            See how ERIP's platform capabilities can reduce compliance costs by 70% 
            while accelerating sales by 40% through Trust Equity™ automation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-12 px-8 erip-gradient-primary">
              Get a Platform Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8">
              Start Free Assessment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};