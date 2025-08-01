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
  Euro,
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
  Briefcase
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

// Market data
const marketGrowthData = [
  { year: '2025', value: 52, label: '€52B' },
  { year: '2025', value: 61, label: '€61B' },
  { year: '2026', value: 71, label: '€71B' },
  { year: '2027', value: 83, label: '€83B' },
  { year: '2028', value: 96, label: '€96B' }
];

const fundingAllocation = [
  { name: 'Product Development', value: 35, amount: '€700K', color: '#3B82F6' },
  { name: 'Sales & Marketing', value: 30, amount: '€600K', color: '#10B981' },
  { name: 'Team Building', value: 20, amount: '€400K', color: '#8B5CF6' },
  { name: 'Infrastructure', value: 10, amount: '€200K', color: '#F59E0B' },
  { name: 'Operations', value: 5, amount: '€100K', color: '#EF4444' }
];

const revenueProjections = [
  { month: 'M1', revenue: 0, customers: 0 },
  { month: 'M3', revenue: 20, customers: 2 },
  { month: 'M6', revenue: 80, customers: 5 },
  { month: 'M9', revenue: 200, customers: 12 },
  { month: 'M12', revenue: 400, customers: 25 },
  { month: 'M15', revenue: 800, customers: 45 },
  { month: 'M18', revenue: 1500, customers: 75 }
];


export const SeedPitch: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    // Slide 1: Title
    {
      id: 1,
      title: 'ERIP Seed Round',
      content: (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8">
          <div className="inline-flex items-center justify-center p-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 shadow-2xl">
            <Shield className="h-16 w-16 text-white" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ERIP
            </h1>
            <p className="text-2xl text-slate-600">Enterprise Risk Intelligence Platform</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-green-800 mb-2">€2M Seed Round</h2>
            <p className="text-xl text-green-700">First Clients & Infrastructure</p>
          </div>

          <div className="flex items-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>July 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Malmö, Sweden</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>B2B SaaS</span>
            </div>
          </div>
        </div>
      )
    },

    // Slide 2: The Problem
    {
      id: 2,
      title: 'The €50B Problem',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Compliance Theater Costs €50B Annually
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              European enterprises are trapped in an expensive compliance cycle that consumes resources without reducing actual risk - creating a massive market opportunity for disruption
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
                  <span className="text-red-700 font-medium">Annual Compliance Cost</span>
                  <span className="font-bold text-red-800 text-lg">€2.3M</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-red-700 font-medium">Average Breach Cost</span>
                  <span className="font-bold text-red-800 text-lg">€4.88M</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-red-700 font-medium">Compliance Theatre Waste</span>
                  <span className="font-bold text-red-800 text-lg">86%</span>
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
                  <span className="text-orange-700 font-medium">Questionnaire Response Time</span>
                  <span className="font-bold text-orange-800 text-lg">6 months</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-orange-700 font-medium">Security Teams Overwhelmed</span>
                  <span className="font-bold text-orange-800 text-lg">73%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-orange-700 font-medium">Enterprise Deals Delayed</span>
                  <span className="font-bold text-orange-800 text-lg">40%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">The Compliance Death Spiral</h3>
            <div className="flex items-center justify-between gap-4">
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-sm font-medium">More Questionnaires</p>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-400" />
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">👥</span>
                </div>
                <p className="text-sm font-medium">More Staff Needed</p>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-400" />
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">💸</span>
                </div>
                <p className="text-sm font-medium">Higher Costs</p>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-400" />
              <div className="text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <span className="text-2xl">🚫</span>
                </div>
                <p className="text-sm font-medium">Zero Risk Reduction</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: The Solution
    {
      id: 3,
      title: 'The ERIP Solution',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              The First Security Platform That Pays for Itself
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              ERIP breaks the compliance death spiral by transforming security investments from pure cost centers into measurable profit drivers through our revolutionary Value-First Workflow™
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="font-semibold text-blue-800 mb-2">AI-Powered QIE™</h3>
                <p className="text-blue-700 text-sm">95% reduction in questionnaire response time from 6 months to 2 weeks</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <Euro className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <h3 className="font-semibold text-green-800 mb-2">€€€ Financial Intelligence</h3>
                <p className="text-green-700 text-sm">Real-time Monte Carlo risk quantification with €4.9M average customer savings</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <h3 className="font-semibold text-purple-800 mb-2">Trust Score Acceleration</h3>
                <p className="text-purple-700 text-sm">Public trust profiles eliminate security reviews, accelerating B2B deals by 40%</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Value-First Workflow™</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { step: 'Start', traditional: 100, erip: 100 },
                { step: 'Month 1', traditional: 120, erip: 80 },
                { step: 'Month 3', traditional: 150, erip: 60 },
                { step: 'Month 6', traditional: 200, erip: 40 },
                { step: 'Month 12', traditional: 300, erip: 20 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis label={{ value: 'Compliance Cost %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="traditional" stroke="#EF4444" strokeWidth={2} name="Traditional GRC" />
                <Line type="monotone" dataKey="erip" stroke="#10B981" strokeWidth={2} name="ERIP Platform" />
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
              €96B European GRC Market by 2028
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              Perfect storm of NIS2, DORA, and EU AI Act regulations creating urgent demand for intelligent compliance solutions - with 45,000 European enterprises actively seeking ROI-proven platforms
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
                          <Cell key={`cell-€{index}`} fill={index === 4 ? '#10B981' : '#3B82F6'} />
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
                  <CardTitle>Regulatory Drivers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">NIS2 Directive</span>
                    <Badge className="bg-blue-600">Oct 2025</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">DORA</span>
                    <Badge className="bg-green-600">Jan 2025</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">EU AI Act</span>
                    <Badge className="bg-purple-600">2025-2027</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">GDPR Enforcement</span>
                    <Badge className="bg-orange-600">€1.7B fines</Badge>
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
                <div className="text-2xl font-bold text-purple-600">73%</div>
                <div className="text-sm text-slate-600">Actively Seeking Solutions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">18 months</div>
                <div className="text-sm text-slate-600">Avg Sales Cycle</div>
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
              SaaS + Success Fees = Aligned Incentives
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              Revolutionary pricing model where our success is directly tied to customer ROI - we earn additional revenue only when we deliver documented savings, creating perfect alignment
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
                  <p className="text-sm text-slate-600">Up to 100 employees</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Growth</h4>
                    <span className="text-2xl font-bold text-green-600">€15K/mo</span>
                  </div>
                  <p className="text-sm text-slate-600">100-1,000 employees</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Enterprise</h4>
                    <span className="text-2xl font-bold text-purple-600">€30K+/mo</span>
                  </div>
                  <p className="text-sm text-slate-600">1,000+ employees</p>
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
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Success Fee Model</h3>
            <p className="text-slate-700 mb-4">
              Additional 10% of documented savings in Year 1 = Perfect alignment with customer success
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">€4.9M</div>
                <div className="text-sm text-slate-600">Avg Customer Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">€490K</div>
                <div className="text-sm text-slate-600">Success Fee Potential</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">€670K</div>
                <div className="text-sm text-slate-600">Total Customer Value</div>
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
              €2M to Achieve Product-Market Fit
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              Strategic investment focused on acquiring first enterprise customers, scaling infrastructure to handle enterprise workloads, and building world-class go-to-market engine
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
                        label={({ name, value }) => `€{name}: €{value}%`}
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
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `€{item.color}20` }}>
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
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Hires (First 6 Months)</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <div className="font-medium">Head of Sales</div>
                    <div className="text-sm text-slate-600">Enterprise B2B experience</div>
                  </div>
                  <span className="font-bold">€120K</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <div className="font-medium">Senior Engineers (2)</div>
                    <div className="text-sm text-slate-600">Full-stack, AI/ML focus</div>
                  </div>
                  <span className="font-bold">€180K</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <div className="font-medium">Marketing Lead</div>
                    <div className="text-sm text-slate-600">B2B SaaS growth</div>
                  </div>
                  <span className="font-bold">€90K</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <div className="font-medium">Customer Success</div>
                    <div className="text-sm text-slate-600">Technical onboarding</div>
                  </div>
                  <span className="font-bold">€70K</span>
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
              Proven three-phase strategy: Start with free risk assessments and QIE quick wins, expand through PRISM™ risk engine deployment, then scale with full platform suite and international expansion
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Phase 1: Land
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>Free risk assessment</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>QIE module for quick wins</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>90-day pilot program</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span>€€€ savings proof</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Phase 2: Expand
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Add PRISM™ risk engine</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Deploy Trust Score</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Success fee activation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Customer advocacy</span>
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
                  <span>Full platform suite</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>Enterprise accounts</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>Partner channels</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                  <span>International expansion</span>
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
                    <span>€€€ ROI case studies and whitepapers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Weekly compliance cost webinars</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>Free risk assessment tool</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>LinkedIn thought leadership</span>
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
                    <span>Industry conference presence</span>
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
              Aggressive but achievable growth trajectory leveraging 18 months of stealth development, perfect regulatory timing, and unique €€€ positioning to reach €1.5M MRR
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
                    <YAxis yAxisId="left" label={{ value: 'Revenue (€K)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Customers', angle: 90, position: 'insideRight' }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue (€K)" />
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
                  <p>Team hired</p>
                  <p>MVP complete</p>
                  <p>First pilots</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-lg font-semibold text-green-800">Q2 2025</div>
                <div className="text-sm text-green-700">
                  <p>5 customers</p>
                  <p>€80K MRR</p>
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
                  <p>€400K MRR</p>
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
                  <p>€1.5M MRR</p>
                  <p>Series A ready</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Why We'll Win</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Unique €€€ Positioning</div>
                    <div className="text-sm text-slate-600">Only platform that proves ROI</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">18 Months Development</div>
                    <div className="text-sm text-slate-600">Deep technology moat</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Perfect Timing</div>
                    <div className="text-sm text-slate-600">NIS2 + DORA compliance wave</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Founder-Market Fit</div>
                    <div className="text-sm text-slate-600">Deep enterprise security expertise</div>
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
              Join us in creating the first security platform that pays for itself - transforming how European enterprises approach compliance from reactive cost to proactive profit
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
                    <div className="text-sm text-slate-600">First €€€-focused security platform</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">€96B Market</div>
                    <div className="text-sm text-slate-600">Massive EU compliance wave</div>
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
                <p className="text-sm text-blue-100">NIS2 + DORA creating urgent demand</p>
              </div>
              <div>
                <div className="h-16 w-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <Euro className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Unique Approach</h4>
                <p className="text-sm text-blue-100">Only platform proving €€€ value</p>
              </div>
              <div>
                <div className="h-16 w-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <Rocket className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Ready to Scale</h4>
                <p className="text-sm text-blue-100">18 months development complete</p>
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
              Partner with us to revolutionize European enterprise security - from 18 months stealth development to €96B market leadership
            </p>
          </div>

          <Card className="w-full max-w-2xl border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-12 text-center">
              <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center mb-6">
                <User className="h-12 w-12 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-slate-900 mb-2">Samuel A. Adewole</h3>
              <p className="text-xl text-slate-600 mb-8">Founder & CEO, ERIP</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <a 
                    href="mailto:samuel@digitalsecurityinsights.com"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    samuel@digitalsecurityinsights.com
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
                    <div className="text-2xl font-bold text-green-600">€96B</div>
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

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 px-12">
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
          <title>ERIP Seed Pitch Deck - €2M Round</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .slide { page-break-after: always; margin-bottom: 50px; }
            .slide:last-child { page-break-after: avoid; }
            h1 { color: #2563eb; font-size: 32px; margin-bottom: 20px; text-align: center; }
            h2 { color: #1e40af; font-size: 28px; margin-bottom: 15px; }
            h3 { color: #1e3a8a; font-size: 24px; margin-bottom: 10px; }
            .highlight { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; border-radius: 12px; margin: 20px 0; }
            .metric { background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .contact { background: #dbeafe; padding: 30px; border-radius: 12px; text-align: center; }
            @media print { .slide { page-break-after: always; } }
          </style>
        </head>
        <body>
          <div class="slide">
            <h1>ERIP - Enterprise Risk Intelligence Platform</h1>
            <div class="highlight">
              <h2>€2M Seed Round</h2>
              <p>The Security Platform That Pays for Itself</p>
              <p><strong>Focus:</strong> First Clients & Infrastructure</p>
              <p><strong>Timeline:</strong> January 2025 | Amsterdam, Netherlands</p>
            </div>
          </div>
          
          <div class="slide">
            <h1>The €50B Problem</h1>
            <h2>Compliance Theater Costs €50B Annually</h2>
            <div class="grid">
              <div class="metric">
                <h3>Financial Pain Points</h3>
                <ul>
                  <li>€2.3M average annual compliance spend per enterprise</li>
                  <li>€4.88M average data breach cost (IBM 2025)</li>
                  <li>86% of compliance activities create zero risk reduction</li>
                </ul>
              </div>
              <div class="metric">
                <h3>Operational Pain Points</h3>
                <ul>
                  <li>6 months average to respond to security questionnaires</li>
                  <li>73% of security teams buried in compliance paperwork</li>
                  <li>40% of deals delayed due to security reviews</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="slide">
            <h1>The ERIP Solution</h1>
            <h2>The First Security Platform That Pays for Itself</h2>
            <div class="metric">
              <h3>Value-First Approach</h3>
              <ul>
                <li><strong>AI-powered Intelligence:</strong> 95% automation of questionnaires</li>
                <li><strong>€€€ ROI Proof:</strong> Demonstrate financial value instantly</li>
                <li><strong>40% Faster Sales:</strong> Public Trust Scores accelerate deals</li>
                <li><strong>18 Components Built:</strong> Ready for deployment</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>Market Opportunity</h1>
            <h2>€96B European GRC Market by 2028</h2>
            <div class="metric">
              <h3>Market Growth</h3>
              <ul>
                <li>2025: €52B → 2028: €96B (85% growth)</li>
                <li>45,000 EU enterprises in target market</li>
                <li>€2.3M average annual compliance spend</li>
                <li>73% actively seeking solutions</li>
              </ul>
            </div>
            <div class="metric">
              <h3>Regulatory Drivers</h3>
              <ul>
                <li><strong>NIS2 Directive:</strong> October 2025 - massive compliance wave</li>
                <li><strong>DORA:</strong> January 2025 - financial sector requirements</li>
                <li><strong>EU AI Act:</strong> 2025-2027 - AI governance demand</li>
                <li><strong>GDPR Enforcement:</strong> €1.7B fines in 2023</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>Business Model</h1>
            <h2>SaaS + Success Fees = Aligned Incentives</h2>
            <div class="metric">
              <h3>Pricing Tiers</h3>
              <ul>
                <li><strong>Starter:</strong> €5K/month (up to 100 employees)</li>
                <li><strong>Growth:</strong> €15K/month (100-1,000 employees)</li>
                <li><strong>Enterprise:</strong> €30K+/month (1,000+ employees)</li>
              </ul>
            </div>
            <div class="metric">
              <h3>Unit Economics</h3>
              <ul>
                <li>Customer Acquisition Cost: €15K</li>
                <li>Average Contract Value: €180K</li>
                <li>Lifetime Value: €720K</li>
                <li>LTV/CAC Ratio: 48:1</li>
                <li>Gross Margin: 87%</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>Use of Funds - €2M</h1>
            <h2>Focus on Product-Market Fit</h2>
            <div class="metric">
              <h3>Funding Allocation</h3>
              <ul>
                <li><strong>Product Development & Engineering:</strong> €700K (35%)</li>
                <li><strong>Sales & Marketing:</strong> €600K (30%)</li>
                <li><strong>Team Building (5 key hires):</strong> €400K (20%)</li>
                <li><strong>Infrastructure:</strong> €200K (10%)</li>
                <li><strong>Operations:</strong> €100K (5%)</li>
              </ul>
            </div>
            <div class="metric">
              <h3>Key Hires (First 6 Months)</h3>
              <ul>
                <li>Head of Sales: €120K (Enterprise B2B experience)</li>
                <li>Senior Engineers (2): €180K (Full-stack, AI/ML focus)</li>
                <li>Marketing Lead: €90K (B2B SaaS growth)</li>
                <li>Customer Success: €70K (Technical onboarding)</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>Go-to-Market Strategy</h1>
            <h2>Land & Expand with ROI Proof</h2>
            <div class="metric">
              <h3>Phase 1: Land (Months 1-6)</h3>
              <ul>
                <li>Free risk assessment</li>
                <li>QIE module for quick wins</li>
                <li>90-day pilot program</li>
                <li>€€€ savings proof</li>
              </ul>
            </div>
            <div class="metric">
              <h3>Phase 2: Expand (Months 6-18)</h3>
              <ul>
                <li>Add PRISM™ risk engine</li>
                <li>Deploy Trust Score</li>
                <li>Success fee activation</li>
                <li>Customer advocacy</li>
              </ul>
            </div>
            <div class="metric">
              <h3>Customer Acquisition Strategy</h3>
              <ul>
                <li><strong>Target:</strong> Mid-market (500-5K employees)</li>
                <li><strong>Approach:</strong> CISO/CFO dual approach</li>
                <li><strong>Channels:</strong> Big 4 consultancy partnerships</li>
                <li><strong>Content:</strong> €€€ ROI case studies and webinars</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>Traction & Milestones</h1>
            <h2>18-Month Path to Series A</h2>
            <div class="metric">
              <h3>Revenue Projections</h3>
              <ul>
                <li><strong>Month 6:</strong> 5 customers, €80K MRR</li>
                <li><strong>Month 12:</strong> 25 customers, €400K MRR</li>
                <li><strong>Month 18:</strong> 75 customers, €1.5M MRR</li>
              </ul>
            </div>
            <div class="metric">
              <h3>Why We'll Win</h3>
              <ul>
                <li><strong>Unique €€€ Positioning:</strong> Only platform proving ROI</li>
                <li><strong>18 Months Development:</strong> Deep technology moat</li>
                <li><strong>Perfect Timing:</strong> NIS2 + DORA compliance wave</li>
                <li><strong>Founder-Market Fit:</strong> Deep enterprise security expertise</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>The Ask</h1>
            <div class="highlight">
              <h2>€2M Seed Round</h2>
              <p><strong>Round Size:</strong> €2M</p>
              <p><strong>Pre-money Valuation:</strong> €8M</p>
              <p><strong>Use of Funds:</strong> 18-month runway to Series A</p>
            </div>
            <div class="metric">
              <h3>Why Invest Now?</h3>
              <ul>
                <li><strong>Perfect Timing:</strong> NIS2 + DORA creating urgent demand</li>
                <li><strong>Unique Approach:</strong> Only platform proving €€€ value</li>
                <li><strong>Ready to Scale:</strong> 18 months development complete</li>
                <li><strong>Exceptional Economics:</strong> 48:1 LTV/CAC ratio</li>
              </ul>
            </div>
          </div>

          <div class="slide">
            <h1>Contact</h1>
            <div class="contact">
              <h2>Samuel A. Adewole</h2>
              <h3>Founder & CEO, ERIP</h3>
              <p><strong>Email:</strong> samuel@digitalsecurityinsights.com</p>
              <p><strong>Phone:</strong> +46 735 457 681</p>
              <br>
              <p><strong>Ready to transform European enterprise security</strong></p>
              <p>18 months stealth development • €€€ positioning breakthrough • Ready to scale</p>
              <br>
              <div style="display: flex; justify-content: center; gap: 40px;">
                <div><strong>€2M</strong><br>Seed Target</div>
                <div><strong>€96B</strong><br>Market Size</div>
                <div><strong>48:1</strong><br>LTV/CAC</div>
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
      ERIP SEED PITCH DECK - €2M ROUND
      The Security Platform That Pays for Itself
      
      =====================================
      EXECUTIVE SUMMARY
      =====================================
      
      Company: ERIP (Enterprise Risk Intelligence Platform)
      Round: €2M Seed Funding
      Focus: First Clients & Infrastructure
      Founder: Samuel A. Adewole
      Contact: samuel@digitalsecurityinsights.com | +46 735 457 681
      
      =====================================
      THE PROBLEM: €50B COMPLIANCE THEATER
      =====================================
      
      European enterprises waste billions on ineffective security compliance:
      
      FINANCIAL PAIN POINTS:
      • €2.3M average annual compliance spend per enterprise
      • €4.88M average data breach cost (IBM 2025)
      • 86% of compliance activities create zero risk reduction
      
      OPERATIONAL PAIN POINTS:
      • 6 months average to respond to security questionnaires
      • 73% of security teams buried in compliance paperwork
      • 40% of deals delayed due to security reviews
      
      =====================================
      THE SOLUTION: ERIP PLATFORM
      =====================================
      
      The First Security Platform That Pays for Itself
      
      VALUE-FIRST APPROACH:
      • AI-powered Intelligence: 95% automation of questionnaires
      • €€€ ROI Proof: Demonstrate financial value instantly
      • 40% Faster Sales: Public Trust Scores accelerate deals
      • 18 Components Built: Ready for deployment
      
      CORE CAPABILITIES:
      • QIE - Questionnaire Intelligence Engine
      • PRISM™ Risk Quantification with Monte Carlo
      • Trust Score for sales acceleration
      • BEACON ROI Calculator with NPV/IRR
      • Complete compliance automation suite
      
      =====================================
      MARKET OPPORTUNITY
      =====================================
      
      €96B European GRC Market by 2028
      
      MARKET GROWTH:
      • 2025: €52B → 2028: €96B (85% growth)
      • 45,000 EU enterprises in target market
      • €2.3M average annual compliance spend
      • 73% actively seeking solutions
      
      REGULATORY DRIVERS:
      • NIS2 Directive (October 2025) - massive compliance wave
      • DORA (January 2025) - financial sector requirements
      • EU AI Act (2025-2027) - AI governance demand
      • GDPR Enforcement - €1.7B fines in 2023
      
      =====================================
      BUSINESS MODEL
      =====================================
      
      SaaS + Success Fees = Aligned Incentives
      
      PRICING TIERS:
      • Starter: €5K/month (up to 100 employees)
      • Growth: €15K/month (100-1,000 employees)
      • Enterprise: €30K+/month (1,000+ employees)
      
      UNIT ECONOMICS:
      • Customer Acquisition Cost: €15K
      • Average Contract Value: €180K
      • Lifetime Value: €720K
      • LTV/CAC Ratio: 48:1
      • Gross Margin: 87%
      
      SUCCESS FEE MODEL:
      • Additional 10% of documented savings in Year 1
      • Perfect alignment with customer success
      • €4.9M average customer savings
      • €490K success fee potential
      
      =====================================
      USE OF FUNDS - €2M
      =====================================
      
      Focus on Product-Market Fit
      
      FUNDING ALLOCATION:
      • Product Development & Engineering: €700K (35%)
      • Sales & Marketing: €600K (30%)
      • Team Building (5 key hires): €400K (20%)
      • Infrastructure: €200K (10%)
      • Operations: €100K (5%)
      
      KEY HIRES (FIRST 6 MONTHS):
      • Head of Sales: €120K (Enterprise B2B experience)
      • Senior Engineers (2): €180K (Full-stack, AI/ML focus)
      • Marketing Lead: €90K (B2B SaaS growth)
      • Customer Success: €70K (Technical onboarding)
      
      =====================================
      GO-TO-MARKET STRATEGY
      =====================================
      
      Land & Expand with ROI Proof
      
      PHASE 1: LAND (MONTHS 1-6)
      • Free risk assessment
      • QIE module for quick wins
      • 90-day pilot program
      • €€€ savings proof
      
      PHASE 2: EXPAND (MONTHS 6-18)
      • Add PRISM™ risk engine
      • Deploy Trust Score
      • Success fee activation
      • Customer advocacy
      
      CUSTOMER ACQUISITION:
      • Target: Mid-market (500-5K employees)
      • Approach: CISO/CFO dual approach
      • Channels: Big 4 consultancy partnerships
      • Content: €€€ ROI case studies and webinars
      
      =====================================
      TRACTION & MILESTONES
      =====================================
      
      18-Month Path to Series A
      
      REVENUE PROJECTIONS:
      • Month 6: 5 customers, €80K MRR
      • Month 12: 25 customers, €400K MRR
      • Month 18: 75 customers, €1.5M MRR
      
      WHY WE'LL WIN:
      • Unique €€€ Positioning: Only platform proving ROI
      • 18 Months Development: Deep technology moat
      • Perfect Timing: NIS2 + DORA compliance wave
      • Founder-Market Fit: Deep enterprise security expertise
      
      =====================================
      THE ASK
      =====================================
      
      €2M SEED ROUND
      
      INVESTMENT TERMS:
      • Round Size: €2M
      • Pre-money Valuation: €8M
      • Use of Funds: 18-month runway to Series A
      
      WHY INVEST NOW:
      • Perfect Timing: NIS2 + DORA creating urgent demand
      • Unique Approach: Only platform proving €€€ value
      • Ready to Scale: 18 months development complete
      • Exceptional Economics: 48:1 LTV/CAC ratio
      
      =====================================
      CONTACT INFORMATION
      =====================================
      
      Samuel A. Adewole
      Founder & CEO, ERIP
      
      Email: samuel@digitalsecurityinsights.com
      Phone: +46 735 457 681
      
      Ready to transform European enterprise security
      
      18 months stealth development
      €€€ positioning breakthrough
      Ready to scale
      
      KEY METRICS:
      • €2M Seed Target
      • €96B Market Size
      • 48:1 LTV/CAC Ratio
      
      Join us in building the security platform that pays for itself!
    `;
    
    const blob = new Blob([wordContent], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ERIP_Seed_Pitch_Deck.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToPowerPoint = () => {
    // PowerPoint content as a comprehensive text format that can be imported
    const pptContent = `
      SLIDE 1: TITLE
      ==============
      ERIP
      Enterprise Risk Intelligence Platform
      
      €2M Seed Round
      First Clients & Infrastructure
      
      January 2025 | Amsterdam, Netherlands | B2B SaaS
      
      
      SLIDE 2: THE PROBLEM
      ===================
      The €50B Problem
      Compliance Theater Costs €50B Annually
      
      FINANCIAL PAIN:
      • €2.3M average annual compliance spend
      • €4.88M average breach cost
      • 86% wasted effort
      
      OPERATIONAL PAIN:
      • 6 months questionnaire time
      • 73% teams overwhelmed
      • 40% deals delayed
      
      
      SLIDE 3: THE SOLUTION
      =====================
      The First Security Platform That Pays for Itself
      
      • AI-Powered Intelligence: 95% automation
      • €€€ ROI Proof: Instant financial value
      • 40% Faster Sales: Trust Scores accelerate deals
      • 18 Components: Ready for deployment
      
      Value-First Workflow™ transforms compliance costs into competitive advantage
      
      
      SLIDE 4: MARKET OPPORTUNITY
      ===========================
      €96B European GRC Market by 2028
      
      MARKET GROWTH: €52B (2025) → €96B (2028)
      TARGET: 45,000 EU enterprises
      SPEND: €2.3M average annual
      DEMAND: 73% actively seeking solutions
      
      REGULATORY DRIVERS:
      • NIS2 Directive (Oct 2025)
      • DORA (Jan 2025)
      • EU AI Act (2025-2027)
      • GDPR Enforcement (€1.7B fines)
      
      
      SLIDE 5: BUSINESS MODEL
      =======================
      SaaS + Success Fees = Aligned Incentives
      
      PRICING:
      • Starter: €5K/month
      • Growth: €15K/month
      • Enterprise: €30K+/month
      
      UNIT ECONOMICS:
      • CAC: €15K
      • ACV: €180K
      • LTV: €720K
      • LTV/CAC: 48:1
      • Gross Margin: 87%
      
      
      SLIDE 6: USE OF FUNDS
      =====================
      €2M to Achieve Product-Market Fit
      
      • Product Development: €700K (35%)
      • Sales & Marketing: €600K (30%)
      • Team Building: €400K (20%)
      • Infrastructure: €200K (10%)
      • Operations: €100K (5%)
      
      KEY HIRES:
      • Head of Sales: €120K
      • Senior Engineers (2): €180K
      • Marketing Lead: €90K
      • Customer Success: €70K
      
      
      SLIDE 7: GO-TO-MARKET
      =====================
      Land & Expand with ROI Proof
      
      PHASE 1 (1-6 months): Land
      • Free risk assessment
      • QIE quick wins
      • 90-day pilots
      • €€€ savings proof
      
      PHASE 2 (6-18 months): Expand
      • PRISM™ risk engine
      • Trust Score deployment
      • Success fees
      • Customer advocacy
      
      
      SLIDE 8: TRACTION
      =================
      18-Month Path to Series A
      
      PROJECTIONS:
      • Month 6: 5 customers, €80K MRR
      • Month 12: 25 customers, €400K MRR
      • Month 18: 75 customers, €1.5M MRR
      
      WHY WE'LL WIN:
      • Unique €€€ positioning
      • 18-month development moat
      • Perfect regulatory timing
      • Founder-market fit
      
      
      SLIDE 9: THE ASK
      ================
      €2M Seed Round
      
      TERMS:
      • Round Size: €2M
      • Pre-money: €8M
      • Timeline: 18-month runway
      
      WHY NOW:
      • NIS2 + DORA urgency
      • Only €€€ platform
      • Ready to scale
      • 48:1 LTV/CAC
      
      
      SLIDE 10: CONTACT
      =================
      Let's Build the Future Together
      
      Samuel A. Adewole
      Founder & CEO, ERIP
      
      samuel@digitalsecurityinsights.com
      +46 735 457 681
      
      18 months stealth development
      €€€ positioning breakthrough
      Ready to scale
      
      €2M Seed | €96B Market | 48:1 LTV/CAC
      
      Join us in building the security platform that pays for itself!
    `;
    
    const blob = new Blob([pptContent], {
      type: 'application/vnd.ms-powerpoint'
    });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ERIP_Seed_Pitch_Deck.ppt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 €{isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
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
              <h1 className="text-xl font-bold text-slate-900">ERIP Seed Pitch Deck</h1>
              <p className="text-sm text-slate-600">€2M Round - First Clients & Infrastructure</p>
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
                    €{currentSlide === index 
                      ? 'bg-blue-600 text-white shadow-lg border-blue-600 scale-105' 
                      : 'bg-white text-slate-700 hover:bg-blue-50 hover:border-blue-200 border-slate-200'
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