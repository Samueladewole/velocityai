import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Award, 
  CheckCircle,
  ExternalLink,
  Download,
  Globe,
  Clock,
  TrendingUp,
  Lock,
  FileText,
  Users,
  Zap,
  Map,
  AlertCircle,
  Sparkle,
  Target,
  BarChart3,
  Calendar,
  Mail,
  Phone,
  MessageCircle,
  FileCheck
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

// Mock company data - in real app, this would come from API based on company slug
const getCompanyData = (slug: string) => {
  const baseData = {
    name: 'ACME Corporation',
    logo: '/api/placeholder/120/60',
    industry: 'Technology',
    foundedYear: 2010,
    website: 'https://acme.com',
    trustScore: {
      current: 847,
      tier: 'Platinum' as const,
      percentile: 'Top 5% in Technology',
      lastUpdated: new Date().toISOString(),
      breakdown: {
        technical: 220,
        compliance: 195,
        privacy: 187,
        operational: 245
      }
    },
    quickStats: [
      { label: 'Frameworks', value: '12', detail: 'ISO 27001, SOC2, GDPR...' },
      { label: 'Uptime', value: '99.99%', detail: 'Last 90 days' },
      { label: 'Last Audit', value: 'Oct 2024', detail: 'Passed with zero findings' }
    ]
  };

  // Customize based on slug
  const customizations: Record<string, Partial<typeof baseData>> = {
    'spotify': {
      name: 'Spotify Technology S.A.',
      industry: 'Music Streaming',
      trustScore: { ...baseData.trustScore, current: 892, tier: 'Platinum' }
    },
    'nordic-tech': {
      name: 'Nordic Tech Solutions',
      industry: 'Enterprise Software',
      trustScore: { ...baseData.trustScore, current: 782, tier: 'Gold' }
    }
  };

  return { ...baseData, ...customizations[slug] };
};

const tierConfig = {
  Bronze: { color: '#d97706', gradient: 'from-amber-600 to-amber-700', bg: 'bg-amber-50' },
  Silver: { color: '#6b7280', gradient: 'from-gray-400 to-gray-500', bg: 'bg-gray-50' },
  Gold: { color: '#fbbf24', gradient: 'from-yellow-400 to-yellow-600', bg: 'bg-yellow-50' },
  Platinum: { color: '#7c3aed', gradient: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' }
};

// Security posture radar data
const securityPostureData = [
  { subject: 'Infrastructure', score: 92, benchmark: 78 },
  { subject: 'Application', score: 88, benchmark: 72 },
  { subject: 'Data Protection', score: 95, benchmark: 80 },
  { subject: 'Access Control', score: 90, benchmark: 75 },
  { subject: 'Monitoring', score: 87, benchmark: 70 },
  { subject: 'Incident Response', score: 93, benchmark: 76 }
];

// Compliance timeline data
const complianceTimeline = [
  { date: '2022-03', event: 'ISO 27001 Certified', type: 'certification', status: 'completed' },
  { date: '2022-08', event: 'SOC 2 Type II Achieved', type: 'certification', status: 'completed' },
  { date: '2023-01', event: 'GDPR Compliance Verified', type: 'compliance', status: 'completed' },
  { date: '2023-09', event: 'Penetration Test Completed', type: 'security', status: 'completed' },
  { date: '2024-12', event: 'ISO 27001 Renewal', type: 'renewal', status: 'upcoming' },
  { date: '2025-06', event: 'ISO 27701 Certification', type: 'certification', status: 'planned' }
];

// Trust Score trend data
const trustScoreTrend = [
  { month: 'Jan', score: 780 },
  { month: 'Feb', score: 795 },
  { month: 'Mar', score: 810 },
  { month: 'Apr', score: 825 },
  { month: 'May', score: 840 },
  { month: 'Jun', score: 847 }
];

const certifications = [
  {
    framework: 'ISO 27001',
    status: 'Certified',
    expiry: 'Dec 2025',
    scope: 'Information Security Management',
    logo: '🛡️',
    actions: ['Download Certificate', 'View Scope']
  },
  {
    framework: 'SOC 2 Type II',
    status: 'Certified',
    expiry: 'Mar 2025',
    scope: 'Security, Availability, Confidentiality',
    logo: '🏆',
    actions: ['Request Report']
  },
  {
    framework: 'GDPR',
    status: 'Compliant',
    updated: 'Continuous',
    scope: 'EU Data Protection',
    logo: '🔒',
    actions: ['View Measures', 'Data Processing Agreement']
  },
  {
    framework: 'HIPAA',
    status: 'Compliant',
    updated: 'Jan 2025',
    scope: 'Healthcare Data Protection',
    logo: '🏥',
    actions: ['Business Associate Agreement']
  }
];

export const TrustCenter: React.FC = () => {
  const { companySlug } = useParams<{ companySlug: string }>();
  const [activeSection, setActiveSection] = useState('overview');
  const [showContactModal, setShowContactModal] = useState(false);
  
  const company = getCompanyData(companySlug || 'default');
  const tierStyle = tierConfig[company.trustScore.tier];

  const lastUpdated = new Date(company.trustScore.lastUpdated);
  const hoursAgo = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60));

  const sections = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'compliance', label: 'Compliance', icon: CheckCircle },
    { id: 'operations', label: 'Operations', icon: BarChart3 },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'contact', label: 'Contact', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={company.logo} 
                alt={`${company.name} logo`}
                className="h-8 w-auto"
              />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Trust Center</h1>
                <p className="text-sm text-slate-600">{company.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Hero Section */}
        {activeSection === 'overview' && (
          <>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-12 text-white">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-xl" />
              
              <div className="relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <img 
                        src={company.logo} 
                        alt={`${company.name} logo`}
                        className="h-12 w-auto filter brightness-0 invert"
                      />
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${tierStyle.gradient} text-white text-sm font-medium`}>
                        ✓ ERIP Verified
                      </div>
                    </div>
                    
                    <h1 className="text-5xl font-bold tracking-tight mb-4">
                      Our Commitment to Security & Privacy
                    </h1>
                    
                    <p className="text-xl text-blue-100 mb-8">
                      Transparency, trust, and continuous security excellence. 
                      Verified by ERIP's comprehensive trust framework.
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm mb-8">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-100">All systems operational</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-200" />
                        <span className="text-blue-100">
                          Last updated: {hoursAgo < 1 ? 'Less than an hour ago' : `${hoursAgo} hours ago`}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {company.quickStats.map((stat, index) => (
                        <div key={index} className="text-center">
                          <div className="text-2xl font-bold mb-1">{stat.value}</div>
                          <div className="text-sm text-blue-100 font-medium mb-1">{stat.label}</div>
                          <div className="text-xs text-blue-200">{stat.detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trust Score Display */}
                  <div className="flex justify-center">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-8">
                      <CardContent className="text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${tierStyle.gradient} text-white font-semibold mb-6`}>
                          <Award className="h-5 w-5" />
                          {company.trustScore.tier} Tier
                        </div>
                        
                        <div className="text-7xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                          {company.trustScore.current}
                        </div>
                        
                        <p className="text-lg text-blue-100 mb-2">Trust Score</p>
                        <p className="text-sm text-blue-200">{company.trustScore.percentile}</p>
                        
                        <div className="mt-6 pt-6 border-t border-white/20">
                          <p className="text-xs text-blue-200 mb-3">Score Breakdown</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>Technical: {company.trustScore.breakdown.technical}</div>
                            <div>Compliance: {company.trustScore.breakdown.compliance}</div>
                            <div>Privacy: {company.trustScore.breakdown.privacy}</div>
                            <div>Operational: {company.trustScore.breakdown.operational}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Score Trend */}
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Trust Score Evolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trustScoreTrend}>
                    <defs>
                      <linearGradient id="trustGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#trustGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Security Practices</h2>
              <p className="text-xl text-slate-600">Multi-layered security architecture protecting your data</p>
            </div>

            {/* Security Posture Radar */}
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Security Posture Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={securityPostureData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" className="text-sm" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                      <Radar 
                        name="Our Score" 
                        dataKey="score" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar 
                        name="Industry Benchmark" 
                        dataKey="benchmark" 
                        stroke="#94a3b8" 
                        fill="transparent"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Security Highlights</h3>
                    <div className="space-y-3">
                      {[
                        { category: 'Infrastructure Security', score: 92, detail: 'Multi-region redundancy, DDoS protection' },
                        { category: 'Application Security', score: 88, detail: 'OWASP compliance, secure SDLC' },
                        { category: 'Data Protection', score: 95, detail: 'AES-256 encryption, data classification' },
                        { category: 'Access Control', score: 90, detail: 'Zero-trust, MFA enforcement' },
                        { category: 'Monitoring', score: 87, detail: '24/7 SOC, automated threat detection' },
                        { category: 'Incident Response', score: 93, detail: 'Tested playbooks, <15min MTTR' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                          <div>
                            <p className="font-medium text-slate-900">{item.category}</p>
                            <p className="text-sm text-slate-600">{item.detail}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-slate-900">{item.score}</span>
                            <span className="text-sm text-slate-500">/100</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Compliance Section */}
        {activeSection === 'compliance' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Compliance & Certifications</h2>
              <p className="text-xl text-slate-600">Industry-leading compliance across major frameworks</p>
            </div>

            {/* Certifications Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">{cert.logo}</span>
                      <div>
                        <h3 className="text-lg font-semibold">{cert.framework}</h3>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">{cert.status}</span>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{cert.scope}</p>
                    <div className="space-y-2 mb-4">
                      {cert.expiry && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Expires:</span>
                          <span className="font-medium">{cert.expiry}</span>
                        </div>
                      )}
                      {cert.updated && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Last Updated:</span>
                          <span className="font-medium">{cert.updated}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cert.actions.map((action, actionIndex) => (
                        <Button 
                          key={actionIndex}
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {action}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compliance Timeline */}
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Compliance Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                  <div className="space-y-6">
                    {complianceTimeline.map((item, index) => (
                      <div key={index} className="relative flex items-center gap-6">
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                          item.status === 'completed' 
                            ? 'bg-green-100 text-green-600' 
                            : item.status === 'upcoming'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : item.status === 'upcoming' ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <Calendar className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">{item.event}</p>
                            <span className="text-sm text-slate-500">{item.date}</span>
                          </div>
                          <p className="text-sm text-slate-600 capitalize">{item.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Privacy Section */}
        {activeSection === 'privacy' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Privacy & Data Protection</h2>
              <p className="text-xl text-slate-600">Your data, your rights, our responsibility</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Data Processing */}
              <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    Data Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
                      <h4 className="font-semibold text-slate-900 mb-2">What data we collect</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Account information (name, email, company)</li>
                        <li>• Usage analytics (anonymized)</li>
                        <li>• Security logs (IP addresses, access patterns)</li>
                        <li>• Support communications</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50/50 border border-green-100">
                      <h4 className="font-semibold text-slate-900 mb-2">How we protect it</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• AES-256 encryption at rest and in transit</li>
                        <li>• Regular security audits and penetration testing</li>
                        <li>• Strict access controls and monitoring</li>
                        <li>• GDPR and CCPA compliance</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Your Rights */}
              <Card className="border-0 bg-gradient-to-br from-white to-purple-50/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Your Rights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { title: 'Access Your Data', desc: 'Request a copy of all data we have about you', action: 'Request Access' },
                      { title: 'Delete Your Data', desc: 'Request deletion of your personal information', action: 'Request Deletion' },
                      { title: 'Portable Data', desc: 'Download your data in a machine-readable format', action: 'Download Data' },
                      { title: 'Manage Preferences', desc: 'Control how we communicate with you', action: 'Update Preferences' }
                    ].map((right, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <div>
                          <p className="font-medium text-slate-900">{right.title}</p>
                          <p className="text-sm text-slate-600">{right.desc}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          {right.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Locations */}
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-green-600" />
                  Data Center Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { region: 'European Union', location: 'Frankfurt, Germany', flag: '🇪🇺', compliance: 'GDPR Compliant' },
                    { region: 'United States', location: 'Virginia, USA', flag: '🇺🇸', compliance: 'SOC 2 Certified' },
                    { region: 'Asia Pacific', location: 'Singapore', flag: '🇸🇬', compliance: 'ISO 27001 Certified' }
                  ].map((datacenter, index) => (
                    <div key={index} className="text-center p-6 rounded-lg bg-slate-50">
                      <div className="text-4xl mb-3">{datacenter.flag}</div>
                      <h4 className="font-semibold text-slate-900 mb-1">{datacenter.region}</h4>
                      <p className="text-sm text-slate-600 mb-2">{datacenter.location}</p>
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        <CheckCircle className="h-3 w-3" />
                        {datacenter.compliance}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Operations Section */}
        {activeSection === 'operations' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Operational Excellence</h2>
              <p className="text-xl text-slate-600">Reliable, scalable, and transparent operations</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Uptime */}
              <Card className="border-0 bg-gradient-to-br from-white to-green-50/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    System Uptime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">99.99%</div>
                    <p className="text-sm text-slate-600">Last 90 days</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">SLA Target:</span>
                      <span className="font-medium">99.9%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Current Month:</span>
                      <span className="font-medium text-green-600">100%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Last Incident:</span>
                      <span className="font-medium">18 months ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance */}
              <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">&lt;200ms</div>
                      <p className="text-sm text-slate-600">Average response time</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">95th percentile:</span>
                        <span className="font-medium">450ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Auto-scaling:</span>
                        <span className="font-medium text-green-600">Active</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Load balancing:</span>
                        <span className="font-medium text-green-600">Multi-region</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Incident Response */}
              <Card className="border-0 bg-gradient-to-br from-white to-orange-50/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Incident Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-orange-600 mb-2">&lt;15min</div>
                    <p className="text-sm text-slate-600">Mean time to recovery</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">24/7 Monitoring:</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Automated alerts:</span>
                      <span className="font-medium text-green-600">Enabled</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Status page:</span>
                      <Button variant="link" className="h-auto p-0 text-blue-600">
                        status.{company.website.replace('https://', '')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Level Agreements */}
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader>
                <CardTitle>Service Level Agreements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Availability Commitments</h4>
                    <div className="space-y-3">
                      {[
                        { service: 'Core Platform', sla: '99.9%', actual: '99.99%' },
                        { service: 'API Services', sla: '99.95%', actual: '99.98%' },
                        { service: 'Data Processing', sla: '99.5%', actual: '99.87%' },
                        { service: 'Reporting', sla: '99.0%', actual: '99.94%' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                          <span className="font-medium text-slate-900">{item.service}</span>
                          <div className="text-right">
                            <div className="text-sm text-slate-500">SLA: {item.sla}</div>
                            <div className="font-semibold text-green-600">Actual: {item.actual}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Support Response Times</h4>
                    <div className="space-y-3">
                      {[
                        { priority: 'Critical', target: '1 hour', actual: '23 minutes' },
                        { priority: 'High', target: '4 hours', actual: '1.2 hours' },
                        { priority: 'Medium', target: '24 hours', actual: '6 hours' },
                        { priority: 'Low', target: '72 hours', actual: '18 hours' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                          <span className="font-medium text-slate-900">{item.priority}</span>
                          <div className="text-right">
                            <div className="text-sm text-slate-500">Target: {item.target}</div>
                            <div className="font-semibold text-green-600">Avg: {item.actual}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resources Section */}
        {activeSection === 'resources' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Resource Center</h2>
              <p className="text-xl text-slate-600">Documentation, reports, and tools at your fingertips</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Policies */}
              <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Policies & Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Security Policy', access: 'public', updated: '2024-10-15' },
                      { name: 'Privacy Policy', access: 'public', updated: '2024-11-01' },
                      { name: 'Acceptable Use Policy', access: 'public', updated: '2024-09-20' },
                      { name: 'Incident Response Plan', access: 'gated', updated: '2024-08-30' },
                      { name: 'Data Processing Agreement', access: 'public', updated: '2024-10-01' }
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <div>
                          <p className="font-medium text-slate-900">{doc.name}</p>
                          <p className="text-xs text-slate-500">Updated: {doc.updated}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          {doc.access === 'public' ? 'Download' : 'Request'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reports */}
              <Card className="border-0 bg-gradient-to-br from-white to-green-50/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Security Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'SOC 2 Type II Report', access: 'restricted', date: 'Mar 2024' },
                      { name: 'Penetration Test Summary', access: 'gated', date: 'Sep 2024' },
                      { name: 'Vulnerability Scan Results', access: 'gated', date: 'Nov 2024' },
                      { name: 'Compliance Assessment', access: 'gated', date: 'Oct 2024' },
                      { name: 'Third-Party Risk Assessment', access: 'restricted', date: 'Aug 2024' }
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <div>
                          <p className="font-medium text-slate-900">{report.name}</p>
                          <p className="text-xs text-slate-500">{report.date}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={report.access === 'restricted' ? 'text-orange-600 border-orange-200' : ''}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {report.access === 'restricted' ? 'NDA Required' : 'Request'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Questionnaires */}
              <Card className="border-0 bg-gradient-to-br from-white to-purple-50/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-purple-600" />
                    Questionnaires & Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Standard Security Questionnaire', desc: 'Pre-filled SIG Lite responses' },
                      { name: 'GDPR Questionnaire', desc: 'Data protection compliance' },
                      { name: 'Vendor Security Assessment', desc: 'VSA template with evidence' },
                      { name: 'Custom RFP Response', desc: 'Tailored to your requirements' },
                      { name: 'Trust Badge Generator', desc: 'Embed our trust score' }
                    ].map((tool, index) => (
                      <div key={index} className="p-3 rounded-lg bg-slate-50">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-slate-900">{tool.name}</p>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Use
                          </Button>
                        </div>
                        <p className="text-xs text-slate-600">{tool.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Security Questions</h4>
                    <div className="space-y-4">
                      {[
                        { q: 'How is data encrypted?', a: 'AES-256 encryption at rest and in transit with managed key rotation.' },
                        { q: 'What penetration testing do you perform?', a: 'Annual third-party penetration testing with quarterly internal assessments.' },
                        { q: 'How do you handle security incidents?', a: 'Documented incident response plan with <15 minute MTTR and stakeholder communication.' }
                      ].map((faq, index) => (
                        <div key={index} className="space-y-2">
                          <p className="font-medium text-slate-900">{faq.q}</p>
                          <p className="text-sm text-slate-600">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Compliance Questions</h4>
                    <div className="space-y-4">
                      {[
                        { q: 'Are you GDPR compliant?', a: 'Yes, with documented privacy by design and data subject rights processes.' },
                        { q: 'Do you have SOC 2 certification?', a: 'SOC 2 Type II certified with annual audits by independent third parties.' },
                        { q: 'What industry frameworks do you follow?', a: 'ISO 27001, NIST CSF, CIS Controls, and industry-specific requirements.' }
                      ].map((faq, index) => (
                        <div key={index} className="space-y-2">
                          <p className="font-medium text-slate-900">{faq.q}</p>
                          <p className="text-sm text-slate-600">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h2>
              <p className="text-xl text-slate-600">Have questions about our security practices?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Security Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    For security-related inquiries, vulnerability reports, and security partnerships.
                  </p>
                  <Button className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    security@{company.website.replace('https://', '')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-purple-600" />
                    Privacy Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    For privacy questions, data requests, and compliance inquiries.
                  </p>
                  <Button className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    privacy@{company.website.replace('https://', '')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    Trust Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    For Trust Center questions and partnership opportunities.
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => setShowContactModal(true)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Conversation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Contact Trust Team
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="How can our trust team help you?"
                  />
                </div>
                <Button className="w-full">
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};