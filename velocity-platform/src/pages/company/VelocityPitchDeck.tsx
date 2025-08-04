import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  ArrowRight,
  Download,
  Maximize,
  TrendingUp,
  Users,
  Globe,
  Target,
  Rocket,
  Shield,
  DollarSign,
  Brain,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  User,
  Mail,
  Phone,
  ChevronRight,
  Calendar,
  MapPin,
  Briefcase,
  Activity,
  Bot,
  Database
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Market data for trust intelligence and enterprise security
const marketGrowthData = [
  { year: '2024', value: 48.2, label: '€48.2B' },
  { year: '2025', value: 58.7, label: '€58.7B' },
  { year: '2026', value: 71.3, label: '€71.3B' },
  { year: '2027', value: 86.8, label: '€86.8B' },
  { year: '2028', value: 105.4, label: '€105.4B' }
];

const fundingAllocation = [
  { name: 'Platform Development', value: 35, amount: '€700K', color: '#3B82F6' },
  { name: 'Sales & Marketing', value: 30, amount: '€600K', color: '#10B981' },
  { name: 'Team Expansion', value: 20, amount: '€400K', color: '#8B5CF6' },
  { name: 'Infrastructure', value: 10, amount: '€200K', color: '#F59E0B' },
  { name: 'Operations', value: 5, amount: '€100K', color: '#EF4444' }
];

const revenueProjections = [
  { month: 'M1', revenue: 0, customers: 0 },
  { month: 'M3', revenue: 30, customers: 2 },
  { month: 'M6', revenue: 140, customers: 5 },
  { month: 'M9', revenue: 320, customers: 12 },
  { month: 'M12', revenue: 580, customers: 25 },
  { month: 'M15', revenue: 920, customers: 42 },
  { month: 'M18', revenue: 1500, customers: 75 }
];

export const VelocityPitchDeck: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    // Slide 1: Title
    {
      id: 1,
      title: 'Velocity AI Seed Round',
      content: (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8">
          <div className="inline-flex items-center justify-center p-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl">
            <Zap className="h-16 w-16 text-white" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Velocity
            </h1>
            <p className="text-2xl text-slate-600">Enterprise Trust Intelligence Platform</p>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-green-800 mb-2">€2M Seed Round</h2>
            <p className="text-xl text-green-700">Transform Trust into Revenue Growth</p>
          </div>

          <div className="flex items-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>August 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>B2B AI SaaS</span>
            </div>
          </div>
        </div>
      )
    },

    // Slide 2: The Problem
    {
      id: 2,
      title: 'The $50B Compliance Crisis',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trust is the New Currency in Enterprise Sales
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              86% of enterprise deals stall on security reviews. Organizations lose €2.3M annually on manual compliance processes while missing millions in revenue opportunities
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  Financial Pain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-red-700 font-medium">Lost Revenue (Security Delays)</span>
                  <span className="font-bold text-red-800 text-lg">€4.2M</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-red-700 font-medium">Annual Compliance Cost</span>
                  <span className="font-bold text-red-800 text-lg">€2.3M</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-red-700 font-medium">Average Breach Cost</span>
                  <span className="font-bold text-red-800 text-lg">€4.88M</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Clock className="h-5 w-5" />
                  Operational Pain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-orange-700 font-medium">Security Questionnaire Time</span>
                  <span className="font-bold text-orange-800 text-lg">6 months</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-orange-700 font-medium">Enterprise Deals Delayed</span>
                  <span className="font-bold text-orange-800 text-lg">86%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-orange-700 font-medium">Manual Evidence Collection</span>
                  <span className="font-bold text-orange-800 text-lg">40+ hours/week</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">The Manual Compliance Trap</h3>
            <div className="flex items-center justify-between gap-4">
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-sm font-medium">Manual Evidence Collection</p>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-400" />
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">⏰</span>
                </div>
                <p className="text-sm font-medium">Months of Preparation</p>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-400" />
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">💸</span>
                </div>
                <p className="text-sm font-medium">Massive Resource Drain</p>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-400" />
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">🔄</span>
                </div>
                <p className="text-sm font-medium">Repeated Every Audit</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: The Solution  
    {
      id: 3,
      title: 'The Velocity AI Solution',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Transform Trust into Revenue Growth
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              Velocity's Trust Intelligence Platform continuously monitors your security posture, automates evidence collection, and accelerates enterprise sales with real-time trust verification
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="font-semibold text-blue-800 mb-2">Trust Score Engine</h3>
                <p className="text-blue-700 text-sm">Real-time trust verification with cryptographic proof for instant credibility</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <h3 className="font-semibold text-green-800 mb-2">Revenue Acceleration</h3>
                <p className="text-green-700 text-sm">Accelerate enterprise deals by 340% with same-day security responses</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6 text-center">
                <Activity className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <h3 className="font-semibold text-purple-800 mb-2">Automated Intelligence</h3>
                <p className="text-purple-700 text-sm">95% reduction in manual compliance work with continuous monitoring</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Velocity Advantage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { step: 'Start', traditional: 100, velocity: 100 },
                { step: 'Month 1', traditional: 120, velocity: 70 },
                { step: 'Month 3', traditional: 180, velocity: 40 },
                { step: 'Month 6', traditional: 250, velocity: 25 },
                { step: 'Month 12', traditional: 400, velocity: 15 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis label={{ value: 'Compliance Effort %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="traditional" stroke="#EF4444" strokeWidth={2} name="Traditional Approach" />
                <Line type="monotone" dataKey="velocity" stroke="#10B981" strokeWidth={2} name="Velocity AI Platform" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    },

    // Slide 4: Market Opportunity
    {
      id: 4,
      title: 'Market Opportunity',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              €105.4B Trust Intelligence Market by 2028
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              The convergence of zero-trust security and enterprise sales acceleration creates a massive opportunity - with 86% of enterprise deals requiring trust verification
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Market Growth Trajectory</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={marketGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6">
                        {marketGrowthData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 4 ? '#10B981' : '#3B82F6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Market Drivers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Enterprise Sales Delays</span>
                    <Badge className="bg-blue-600">86% Due to Security</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Trust Verification Demand</span>
                    <Badge className="bg-green-600">€4.2M Lost Revenue</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Zero Trust Architecture</span>
                    <Badge className="bg-purple-600">92% Adoption</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">Regulatory Compliance</span>
                    <Badge className="bg-orange-600">€2.3M Annual Cost</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-slate-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Target Market Segments</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">45,000</div>
                <div className="text-sm text-slate-600">EU Enterprises</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">€2.3M</div>
                <div className="text-sm text-slate-600">Avg Annual Spend</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">86%</div>
                <div className="text-sm text-slate-600">Deals Delayed by Security</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">18 months</div>
                <div className="text-sm text-slate-600">Enterprise Sales Cycle</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Business Model
    {
      id: 5,
      title: 'Business Model',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trust Intelligence Platform + Success Fees
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              Platform-as-a-Service model with success-based expansion revenue - customers pay more as they unlock more business value from accelerated sales and reduced risk
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Pricing Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Starter</h4>
                    <span className="text-2xl font-bold text-blue-600">€5K/mo</span>
                  </div>
                  <p className="text-sm text-slate-600">Up to 100 employees, SOC 2 + basic trust score</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Growth</h4>
                    <span className="text-2xl font-bold text-green-600">€15K/mo</span>
                  </div>
                  <p className="text-sm text-slate-600">100-1,000 employees, multi-framework support</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Enterprise</h4>
                    <span className="text-2xl font-bold text-purple-600">€30K+/mo</span>
                  </div>
                  <p className="text-sm text-slate-600">1,000+ employees, full platform suite</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Unit Economics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span>Customer Acquisition Cost</span>
                  <span className="font-bold text-green-800">€15K</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span>Average Contract Value</span>
                  <span className="font-bold text-green-800">€180K</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span>Lifetime Value</span>
                  <span className="font-bold text-green-800">€720K</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span>LTV/CAC Ratio</span>
                  <span className="font-bold text-green-800">48:1</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span>Gross Margin</span>
                  <span className="font-bold text-green-800">87%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Expansion Model</h3>
            <p className="text-slate-700 mb-4">
              Natural growth through additional frameworks, more employees, and advanced features
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">€4.9M</div>
                <div className="text-sm text-slate-600">Avg Customer Value Created</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">€490K</div>
                <div className="text-sm text-slate-600">Success Fee Potential</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">15 months</div>
                <div className="text-sm text-slate-600">Payback Period</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 6: Use of Funds
    {
      id: 6,
      title: 'Use of Funds',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              $2M to Scale AI Platform
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              Strategic investment focused on accelerating AI development, scaling go-to-market efforts, and building world-class team to capture the compliance automation opportunity
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Funding Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={fundingAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {fundingAllocation.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {fundingAllocation.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                      <div>
                        <div className="font-semibold" style={{ color: item.color }}>{item.name}</div>
                        <div className="text-sm text-slate-600">{item.amount}</div>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}%</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-slate-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Hires (First 9 Months)</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <div className="font-medium">VP of Sales</div>
                    <div className="text-sm text-slate-600">Enterprise B2B SaaS experience</div>
                  </div>
                  <span className="font-bold">$180K</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <div className="font-medium">AI Engineers (3)</div>
                    <div className="text-sm text-slate-600">ML/LLM specialization</div>
                  </div>
                  <span className="font-bold">$450K</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <div className="font-medium">Head of Marketing</div>
                    <div className="text-sm text-slate-600">B2B growth marketing</div>
                  </div>
                  <span className="font-bold">$150K</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <div className="font-medium">Customer Success Lead</div>
                    <div className="text-sm text-slate-600">Technical implementation</div>
                  </div>
                  <span className="font-bold">$120K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: Go-to-Market Strategy
    {
      id: 7,
      title: 'Go-to-Market Strategy',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Land & Expand with ROI Proof
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              Proven three-phase strategy: Start with Trust Score quick wins, expand through full platform deployment, then scale with success fees and international expansion
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Phase 1: Product-Led
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Free trust assessment</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Trust Score pilot program</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>90-day proof of value</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Revenue impact demonstration</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Phase 2: Enterprise Sales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Add full platform suite</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Deploy success fee model</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Customer advocacy program</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Multi-framework expansion</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Phase 3: Scale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>Enterprise accounts (1,000+ employees)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>Partner with Big 4 consultancies</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>International expansion</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>Industry vertical focus</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Acquisition Strategy</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-orange-800 mb-3">Inbound Marketing</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>ROI calculators and trust assessments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Weekly trust score webinars</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Success story case studies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>SEO-optimized content hub</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-800 mb-3">Outbound Sales</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Target mid-market (500-5K employees)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>CISO/CFO dual approach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Partner with Big 4 consultancies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Industry conference sponsorships</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 8: Traction & Milestones
    {
      id: 8,
      title: 'Traction & Milestones',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              18-Month Path to Series A
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              Aggressive but achievable growth trajectory leveraging unique trust positioning and proven €4.9M average customer value to reach €1.5M ARR
            </p>
          </div>

          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Customer Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueProjections}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" label={{ value: 'Revenue ($K)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Customers', angle: 90, position: 'insideRight' }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue ($K)" />
                    <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#3B82F6" strokeWidth={3} name="Customers" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <div className="text-lg font-semibold text-blue-800">Q1 2025</div>
                <div className="text-sm text-blue-700">
                  <p>Team scaling</p>
                  <p>Platform GA</p>
                  <p>First enterprise deals</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-lg font-semibold text-green-800">Q2 2025</div>
                <div className="text-sm text-green-700">
                  <p>5 customers</p>
                  <p>€140K ARR</p>
                  <p>Product-market fit</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <div className="text-lg font-semibold text-purple-800">Q4 2025</div>
                <div className="text-sm text-purple-700">
                  <p>25 customers</p>
                  <p>€580K ARR</p>
                  <p>Series A prep</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4 text-center">
                <Rocket className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                <div className="text-lg font-semibold text-orange-800">Q2 2026</div>
                <div className="text-sm text-orange-700">
                  <p>75 customers</p>
                  <p>€1.5M ARR</p>
                  <p>Series A ready</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Competitive Advantages</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Unique €€€ Positioning</div>
                    <div className="text-sm text-slate-600">Only platform that proves financial ROI</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">18 Months Development</div>
                    <div className="text-sm text-slate-600">Deep technology moat with trust intelligence</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Perfect Timing</div>
                    <div className="text-sm text-slate-600">Zero trust + enterprise sales acceleration wave</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Founder-Market Fit</div>
                    <div className="text-sm text-slate-600">Deep enterprise security and trust intelligence expertise</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 9: The Ask
    {
      id: 9,
      title: 'The Ask',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              €2M Seed Round
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto">
              Join us in creating the first security platform that pays for itself - transforming how European enterprises approach trust from reactive cost to proactive profit
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-2xl text-green-800">Investment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="text-lg">Round Size</span>
                  <span className="text-2xl font-bold text-green-600">€2M</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="text-lg">Pre-money Valuation</span>
                  <span className="text-2xl font-bold text-green-600">€8M</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="text-lg">Use of Funds</span>
                  <span className="text-lg font-semibold text-green-600">18-month runway</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">What We're Building</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Category Creator</div>
                    <div className="text-sm text-slate-600">First trust intelligence platform that proves ROI</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">€105.4B Market</div>
                    <div className="text-sm text-slate-600">Massive EU trust intelligence opportunity</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">48:1 LTV/CAC</div>
                    <div className="text-sm text-slate-600">Exceptional unit economics</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Why Invest Now?</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="h-16 w-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Perfect Timing</h4>
                <p className="text-sm text-blue-100">Zero trust + sales acceleration creating urgent demand</p>
              </div>
              <div>
                <div className="h-16 w-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <Bot className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Unique Approach</h4>
                <p className="text-sm text-blue-100">Only platform proving €€€ value to customers</p>
              </div>
              <div>
                <div className="h-16 w-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <Rocket className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Ready to Scale</h4>
                <p className="text-sm text-blue-100">18 months development complete with proven ROI</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 10: Contact
    {
      id: 10,
      title: 'Contact',
      content: (
        <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Let's Build the Future Together
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              Partner with us to revolutionize European enterprise security - from 18 months stealth development to €105.4B market leadership
            </p>
          </div>

          <Card className="w-full max-w-2xl border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-12 text-center">
              <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6">
                <User className="h-12 w-12 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-slate-900 mb-2">Velocity Leadership</h3>
              <p className="text-xl text-slate-600 mb-8">Founders & Executive Team</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <a 
                    href="mailto:funding@velocity.com"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    funding@velocity.com
                  </a>
                </div>
                
                <div className="flex items-center justify-center gap-3 text-lg">
                  <Phone className="h-6 w-6 text-blue-600" />
                  <a 
                    href="tel:+46735457681"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    +46 735 457 681
                  </a>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-slate-600 mb-4">
                  18 months stealth development • €€€ positioning breakthrough • Ready to scale
                </p>
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">€2M</div>
                    <div className="text-sm text-slate-500">Seed Target</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">€105B</div>
                    <div className="text-sm text-slate-500">Market Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">48:1</div>
                    <div className="text-sm text-slate-500">LTV/CAC</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl p-6 px-12">
            <p className="text-lg font-semibold">
              🚀 Join us in building the security platform that pays for itself
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Velocity AI Seed Pitch Deck - $2M Round</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .slide { page-break-after: always; margin-bottom: 50px; }
            .slide:last-child { page-break-after: avoid; }
            h1 { color: #7c3aed; font-size: 32px; margin-bottom: 20px; text-align: center; }
            h2 { color: #6d28d9; font-size: 28px; margin-bottom: 15px; }
            h3 { color: #5b21b6; font-size: 24px; margin-bottom: 10px; }
            .highlight { background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 20px; border-radius: 12px; margin: 20px 0; }
            .metric { background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .contact { background: #ddd6fe; padding: 30px; border-radius: 12px; text-align: center; }
            @media print { .slide { page-break-after: always; } }
          </style>
        </head>
        <body>
          <div class="slide">
            <h1>Velocity AI - AI Compliance Automation Platform</h1>
            <div class="highlight">
              <h2>$2M Seed Round</h2>
              <p>Accelerate Compliance with AI</p>
              <p><strong>Focus:</strong> AI Development & Market Expansion</p>
              <p><strong>Timeline:</strong> August 2025 | San Francisco, CA</p>
            </div>
          </div>
          
          <div class="slide">
            <h1>The $50B Compliance Crisis</h1>
            <h2>Compliance Complexity Costs Enterprises $50B Annually</h2>
            <div class="grid">
              <div class="metric">
                <h3>Financial Pain Points</h3>
                <ul>
                  <li>$2.8M average annual compliance spend per enterprise</li>
                  <li>$4.45M average data breach cost</li>
                  <li>73% of compliance activities are manual waste</li>
                </ul>
              </div>
              <div class="metric">
                <h3>Operational Pain Points</h3>
                <ul>
                  <li>8-12 months to achieve SOC 2 readiness</li>
                  <li>85% of compliance teams overwhelmed</li>
                  <li>40+ hours/week spent on evidence collection</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="slide">
            <h1>The Velocity AI Solution</h1>
            <h2>AI-Powered Compliance That Runs Itself</h2>
            <div class="metric">
              <h3>AI-First Approach</h3>
              <ul>
                <li><strong>13 AI Agents:</strong> Specialized agents for different frameworks</li>
                <li><strong>Real-Time Monitoring:</strong> Continuous compliance tracking</li>
                <li><strong>90% Automation:</strong> Reduce manual evidence collection</li>
                <li><strong>Audit Ready:</strong> Always prepared for compliance audits</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>Market Opportunity</h1>
            <h2>$32.8B AI Compliance Market by 2028</h2>
            <div class="metric">
              <h3>Market Growth</h3>
              <ul>
                <li>2024: $8.2B → 2028: $32.8B (300% growth)</li>
                <li>125,000 SaaS companies in target market</li>
                <li>$380K average annual compliance spend</li>
                <li>78% actively seeking AI solutions</li>
              </ul>
            </div>
            <div class="metric">
              <h3>Market Drivers</h3>
              <ul>
                <li><strong>SOC 2 Requirements:</strong> Growing 25% year-over-year</li>
                <li><strong>GDPR Enforcement:</strong> $2.1B in fines during 2024</li>
                <li><strong>AI Act Compliance:</strong> New regulations 2025-2027</li>
                <li><strong>Remote Work Security:</strong> 78% enterprise priority</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>Business Model</h1>
            <h2>SaaS Platform with Usage-Based Growth</h2>
            <div class="metric">
              <h3>Pricing Tiers</h3>
              <ul>
                <li><strong>Starter:</strong> $2K/month (up to 50 employees)</li>
                <li><strong>Growth:</strong> $8K/month (50-500 employees)</li>
                <li><strong>Enterprise:</strong> $25K+/month (500+ employees)</li>
              </ul>
            </div>
            <div class="metric">
              <h3>Unit Economics</h3>
              <ul>
                <li>Customer Acquisition Cost: $8K</li>
                <li>Average Contract Value: $96K</li>
                <li>Lifetime Value: $480K</li>
                <li>LTV/CAC Ratio: 60:1</li>
                <li>Gross Margin: 92%</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>Use of Funds - $2M</h1>
            <h2>Focus on AI Platform Scaling</h2>
            <div class="metric">
              <h3>Funding Allocation</h3>
              <ul>
                <li><strong>AI Development:</strong> $800K (40%)</li>
                <li><strong>Sales & Marketing:</strong> $500K (25%)</li>
                <li><strong>Team Expansion:</strong> $400K (20%)</li>
                <li><strong>Infrastructure:</strong> $200K (10%)</li>
                <li><strong>Operations:</strong> $100K (5%)</li>
              </ul>
            </div>
            <div class="metric">
              <h3>Key Hires (First 9 Months)</h3>
              <ul>
                <li>VP of Sales: $180K (Enterprise B2B SaaS experience)</li>
                <li>AI Engineers (3): $450K (ML/LLM specialization)</li>
                <li>Head of Marketing: $150K (B2B growth marketing)</li>
                <li>Customer Success Lead: $120K (Technical implementation)</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>Go-to-Market Strategy</h1>
            <h2>Product-Led Growth with Enterprise Sales</h2>
            <div class="metric">
              <h3>Phase 1: Product-Led (Months 1-6)</h3>
              <ul>
                <li>Free compliance assessment</li>
                <li>14-day free trial</li>
                <li>Self-serve onboarding</li>
                <li>AI-powered quick wins</li>
              </ul>
            </div>
            <div class="metric">
              <h3>Phase 2: Enterprise Sales (Months 6-18)</h3>
              <ul>
                <li>Target mid-market (50-500 employees)</li>
                <li>CISO + CFO sales approach</li>
                <li>Proof-of-concept deployments</li>
                <li>ROI-focused positioning</li>
              </ul>
            </div>
            <div class="metric">
              <h3>Customer Acquisition Strategy</h3>
              <ul>
                <li><strong>Inbound:</strong> Interactive demos, ROI calculators, webinars</li>
                <li><strong>Outbound:</strong> Target SaaS companies, account-based marketing</li>
                <li><strong>Partnerships:</strong> Audit firms, industry conferences</li>
                <li><strong>Content:</strong> SEO-optimized compliance automation content</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>Traction & Milestones</h1>
            <h2>18-Month Path to Series A</h2>
            <div class="metric">
              <h3>Revenue Projections</h3>
              <ul>
                <li><strong>Month 6:</strong> 8 customers, $120K ARR</li>
                <li><strong>Month 12:</strong> 32 customers, $520K ARR</li>
                <li><strong>Month 18:</strong> 85 customers, $1.4M ARR</li>
              </ul>
            </div>
            <div class="metric">
              <h3>Competitive Advantages</h3>
              <ul>
                <li><strong>AI-First Approach:</strong> 13 specialized agents vs traditional workflows</li>
                <li><strong>Deep Compliance Expertise:</strong> Built by former auditors</li>
                <li><strong>Market Timing:</strong> AI capabilities meeting compliance urgency</li>
                <li><strong>Proven Team:</strong> Track record in enterprise AI and compliance</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>The Ask</h1>
            <div class="highlight">
              <h2>$2M Seed Round</h2>
              <p><strong>Round Size:</strong> $2M</p>
              <p><strong>Pre-money Valuation:</strong> $8M</p>
              <p><strong>Use of Funds:</strong> 18-month runway to Series A</p>
            </div>
            <div class="metric">
              <h3>Why Invest Now?</h3>
              <ul>
                <li><strong>Perfect Timing:</strong> AI capabilities meeting compliance urgency</li>
                <li><strong>AI Leadership:</strong> First mover in AI-powered compliance</li>
                <li><strong>Ready to Scale:</strong> Proven product with enterprise traction</li>
                <li><strong>Exceptional Economics:</strong> 60:1 LTV/CAC ratio</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>Contact</h1>
            <div class="contact">
              <h2>Velocity AI Team</h2>
              <h3>Founders & Leadership</h3>
              <p><strong>Email:</strong> investors@velocity.ai</p>
              <p><strong>Phone:</strong> +1 (415) 555-1234</p>
              <br>
              <p><strong>Ready to transform compliance with AI</strong></p>
              <p>13 AI agents • 90% automation • Ready to scale</p>
              <br>
              <div style="display: flex; justify-content: center; gap: 40px;">
                <div><strong>$2M</strong><br>Seed Round</div>
                <div><strong>$32.8B</strong><br>Market Size</div>
                <div><strong>60:1</strong><br>LTV/CAC</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportToWord = () => {
    const wordContent = `
      VELOCITY AI SEED PITCH DECK - $2M ROUND
      AI Compliance Automation Platform
      
      =====================================
      EXECUTIVE SUMMARY
      =====================================
      
      Company: Velocity AI (AI Compliance Automation Platform)
      Round: $2M Seed Funding
      Focus: AI Development & Market Expansion
      Contact: investors@velocity.ai | +1 (415) 555-1234
      
      =====================================
      THE PROBLEM: $50B COMPLIANCE CRISIS
      =====================================
      
      Enterprises waste billions on manual compliance processes:
      
      FINANCIAL PAIN POINTS:
      • $2.8M average annual compliance spend per enterprise
      • $4.45M average data breach cost
      • 73% of compliance activities are manual waste
      
      OPERATIONAL PAIN POINTS:
      • 8-12 months to achieve SOC 2 readiness
      • 85% of compliance teams overwhelmed
      • 40+ hours/week spent on evidence collection
      
      =====================================
      THE SOLUTION: VELOCITY AI PLATFORM
      =====================================
      
      AI-Powered Compliance That Runs Itself
      
      AI-FIRST APPROACH:
      • 13 AI Agents: Specialized agents for different frameworks
      • Real-Time Monitoring: Continuous compliance tracking
      • 90% Automation: Reduce manual evidence collection
      • Audit Ready: Always prepared for compliance audits
      
      CORE CAPABILITIES:
      • SOC 2, ISO 27001, HIPAA, GDPR automation
      • Continuous monitoring and gap detection
      • Automated evidence collection and management
      • Real-time compliance dashboard
      • AI-powered risk assessments
      
      =====================================
      MARKET OPPORTUNITY
      =====================================
      
      $32.8B AI Compliance Market by 2028
      
      MARKET GROWTH:
      • 2024: $8.2B → 2028: $32.8B (300% growth)
      • 125,000 SaaS companies in target market
      • $380K average annual compliance spend
      • 78% actively seeking AI solutions
      
      MARKET DRIVERS:
      • SOC 2 Requirements (Growing 25% year-over-year)
      • GDPR Enforcement ($2.1B in fines during 2024)
      • AI Act Compliance (New regulations 2025-2027)
      • Remote Work Security (78% enterprise priority)
      
      =====================================
      BUSINESS MODEL
      =====================================
      
      SaaS Platform with Usage-Based Growth
      
      PRICING TIERS:
      • Starter: $2K/month (up to 50 employees)
      • Growth: $8K/month (50-500 employees)
      • Enterprise: $25K+/month (500+ employees)
      
      UNIT ECONOMICS:
      • Customer Acquisition Cost: $8K
      • Average Contract Value: $96K
      • Lifetime Value: $480K
      • LTV/CAC Ratio: 60:1
      • Gross Margin: 92%
      
      REVENUE EXPANSION:
      • Natural growth through additional frameworks
      • 140% Net Revenue Retention
      • $280K average expansion revenue
      • 18 month payback period
      
      =====================================
      USE OF FUNDS - $2M
      =====================================
      
      Focus on AI Platform Scaling
      
      FUNDING ALLOCATION:
      • AI Development: $800K (40%)
      • Sales & Marketing: $500K (25%)
      • Team Expansion: $400K (20%)
      • Infrastructure: $200K (10%)
      • Operations: $100K (5%)
      
      KEY HIRES (FIRST 9 MONTHS):
      • VP of Sales: $180K (Enterprise B2B SaaS experience)
      • AI Engineers (3): $450K (ML/LLM specialization)
      • Head of Marketing: $150K (B2B growth marketing)
      • Customer Success Lead: $120K (Technical implementation)
      
      =====================================
      GO-TO-MARKET STRATEGY
      =====================================
      
      Product-Led Growth with Enterprise Sales
      
      PHASE 1: PRODUCT-LED (MONTHS 1-6)
      • Free compliance assessment
      • 14-day free trial
      • Self-serve onboarding
      • AI-powered quick wins
      
      PHASE 2: ENTERPRISE SALES (MONTHS 6-18)
      • Target mid-market (50-500 employees)
      • CISO + CFO sales approach
      • Proof-of-concept deployments
      • ROI-focused positioning
      
      CUSTOMER ACQUISITION:
      • Inbound: Interactive demos, ROI calculators, webinars
      • Outbound: Target SaaS companies, account-based marketing
      • Partnerships: Audit firms, industry conferences
      • Content: SEO-optimized compliance automation content
      
      =====================================
      TRACTION & MILESTONES
      =====================================
      
      18-Month Path to Series A
      
      REVENUE PROJECTIONS:
      • Month 6: 8 customers, $120K ARR
      • Month 12: 32 customers, $520K ARR
      • Month 18: 85 customers, $1.4M ARR
      
      COMPETITIVE ADVANTAGES:
      • AI-First Approach: 13 specialized agents vs traditional workflows
      • Deep Compliance Expertise: Built by former auditors
      • Market Timing: AI capabilities meeting compliance urgency
      • Proven Team: Track record in enterprise AI and compliance
      
      =====================================
      THE ASK
      =====================================
      
      $2M SEED ROUND
      
      INVESTMENT TERMS:
      • Round Size: $2M
      • Pre-money Valuation: $8M
      • Use of Funds: 18-month runway to Series A
      
      WHY INVEST NOW:
      • Perfect Timing: AI capabilities meeting compliance urgency
      • AI Leadership: First mover in AI-powered compliance
      • Ready to Scale: Proven product with enterprise traction
      • Exceptional Economics: 60:1 LTV/CAC ratio
      
      =====================================
      CONTACT INFORMATION
      =====================================
      
      Velocity AI Team
      Founders & Leadership
      
      Email: investors@velocity.ai
      Phone: +1 (415) 555-1234
      
      Ready to transform compliance with AI
      
      13 AI agents
      90% automation
      Ready to scale
      
      KEY METRICS:
      • $2M Seed Round
      • $32.8B Market Size
      • 60:1 LTV/CAC Ratio
      
      Join us in making compliance effortless with AI!
    `;
    
    const blob = new Blob([wordContent], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Velocity_AI_Seed_Pitch_Deck.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToPowerPoint = () => {
    const pptContent = `
      SLIDE 1: TITLE
      ==============
      Velocity AI
      AI Compliance Automation Platform
      
      $2M Seed Round
      Accelerate Compliance with AI
      
      August 2025 | San Francisco, CA | B2B AI SaaS
      
      
      SLIDE 2: THE PROBLEM
      ===================
      The $50B Compliance Crisis
      Compliance Complexity Costs Enterprises $50B Annually
      
      FINANCIAL PAIN:
      • $2.8M average annual compliance spend
      • $4.45M average breach cost  
      • 73% manual process waste
      
      OPERATIONAL PAIN:
      • 8-12 months to SOC 2 readiness
      • 85% teams overwhelmed
      • 40+ hours/week evidence collection
      
      
      SLIDE 3: THE SOLUTION
      =====================
      AI-Powered Compliance That Runs Itself
      
      • 13 AI Agents: Specialized for different frameworks
      • Real-Time Monitoring: Continuous compliance tracking
      • 90% Automation: Reduce manual evidence collection
      • Audit Ready: Always prepared for compliance audits
      
      Velocity transforms compliance from burden to competitive advantage
      
      
      SLIDE 4: MARKET OPPORTUNITY
      ===========================
      $32.8B AI Compliance Market by 2028
      
      MARKET GROWTH: $8.2B (2024) → $32.8B (2028)
      TARGET: 125,000 SaaS companies
      SPEND: $380K average annual
      DEMAND: 78% actively seeking AI solutions
      
      MARKET DRIVERS:
      • SOC 2 Requirements (25% YoY growth)
      • GDPR Enforcement ($2.1B fines 2024)
      • AI Act Compliance (2025-2027)
      • Remote Work Security (78% priority)
      
      
      SLIDE 5: BUSINESS MODEL
      =======================
      SaaS Platform with Usage-Based Growth
      
      PRICING:
      • Starter: $2K/month
      • Growth: $8K/month
      • Enterprise: $25K+/month
      
      UNIT ECONOMICS:
      • CAC: $8K
      • ACV: $96K
      • LTV: $480K
      • LTV/CAC: 60:1
      • Gross Margin: 92%
      
      
      SLIDE 6: USE OF FUNDS
      =====================
      $2M to Scale AI Platform
      
      • AI Development: $800K (40%)
      • Sales & Marketing: $500K (25%)
      • Team Expansion: $400K (20%)
      • Infrastructure: $200K (10%)
      • Operations: $100K (5%)
      
      KEY HIRES:
      • VP of Sales: $180K
      • AI Engineers (3): $450K
      • Head of Marketing: $150K
      • Customer Success Lead: $120K
      
      
      SLIDE 7: GO-TO-MARKET
      =====================
      Product-Led Growth with Enterprise Sales
      
      PHASE 1 (1-6 months): Product-Led
      • Free compliance assessment
      • 14-day free trial
      • Self-serve onboarding
      • AI-powered quick wins
      
      PHASE 2 (6-18 months): Enterprise Sales
      • Target mid-market (50-500 employees)
      • CISO + CFO approach
      • Proof-of-concept deployments
      • ROI-focused positioning
      
      
      SLIDE 8: TRACTION
      =================
      18-Month Path to Series A
      
      PROJECTIONS:
      • Month 6: 8 customers, $120K ARR
      • Month 12: 32 customers, $520K ARR
      • Month 18: 85 customers, $1.4M ARR
      
      COMPETITIVE ADVANTAGES:
      • AI-first approach
      • Deep compliance expertise
      • Perfect market timing
      • Proven team track record
      
      
      SLIDE 9: THE ASK
      ================
      $2M Seed Round
      
      TERMS:
      • Round Size: $2M
      • Pre-money: $8M
      • Timeline: 18-month runway
      
      WHY NOW:
      • AI capabilities meet compliance urgency
      • First mover in AI-powered compliance
      • Ready to scale with proven product
      • 60:1 LTV/CAC economics
      
      
      SLIDE 10: CONTACT
      =================
      Let's Transform Compliance Together
      
      Velocity AI Team
      Founders & Leadership
      
      investors@velocity.ai
      +1 (415) 555-1234
      
      13 AI agents
      90% automation
      Ready to scale
      
      $2M Seed | $32.8B Market | 60:1 LTV/CAC
      
      Join us in making compliance effortless with AI!
    `;
    
    const blob = new Blob([pptContent], {
      type: 'application/vnd.ms-powerpoint'
    });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Velocity_AI_Seed_Pitch_Deck.ppt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Velocity AI Seed Pitch Deck</h1>
              <p className="text-sm text-slate-600">$2M Round - AI Compliance Automation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={exportToPDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={exportToWord}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Word
            </Button>
            <Button
              variant="outline"
              onClick={exportToPowerPoint}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              PowerPoint
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-2"
            >
              <Maximize className="h-4 w-4" />
              {isFullscreen ? 'Exit' : 'Present'}
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 p-8">
        <Card className="max-w-7xl mx-auto min-h-[600px] shadow-xl">
          <CardContent className="p-12">
            {slides[currentSlide].content}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <div className="text-sm text-slate-500">
              {slides[currentSlide].title}
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced Slide Navigation */}
      {!isFullscreen && (
        <div className="bg-slate-100 border-t border-slate-200 p-6">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">Pitch Deck Navigation</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`
                    p-3 rounded-lg text-sm font-medium transition-all text-left border-2
                    ${currentSlide === index 
                      ? 'bg-purple-600 text-white shadow-lg border-purple-600 scale-105' 
                      : 'bg-white text-slate-700 hover:bg-purple-50 hover:border-purple-200 border-slate-200'
                    }
                  `}
                >
                  <div className="text-xs opacity-75 mb-1">Slide {index + 1}</div>
                  <div className="font-semibold">{slide.title}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-slate-600">
              Click any slide above to jump directly to that section
            </div>
          </div>
        </div>
      )}
    </div>
  );
};