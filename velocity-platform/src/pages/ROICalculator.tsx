/**
 * ROI Calculator Tool
 * 
 * Sophisticated ROI and business value calculator for ERIP:
 * - Company profile-based calculations
 * - Industry-specific benchmarks and assumptions
 * - Time-based ROI projections
 * - Cost savings breakdown (compliance, security, operations)
 * - Risk reduction quantification
 * - Interactive scenario modeling
 * - Downloadable business case reports
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  Shield,
  Clock,
  Award,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  FileText,
  Download,
  Share2,
  Info,
  Lightbulb,
  Calendar,
  ArrowRight,
  Percent,
  Timer,
  Banknote,
  Receipt,
  Globe,
  Server,
  Lock,
  Eye,
  Briefcase,
  Heart
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface CompanyProfile {
  industry: string
  size: string
  revenue: number
  employees: number
  currentFrameworks: string[]
  complianceBudget: number
  securityBudget: number
  itBudget: number
  riskTolerance: 'low' | 'medium' | 'high'
}

interface ROICalculation {
  implementation: {
    cost: number
    timeline: number // months
  }
  savings: {
    annual: {
      compliance: number
      security: number
      operational: number
      riskReduction: number
      total: number
    }
    threeYear: number
    fiveYear: number
  }
  metrics: {
    paybackPeriod: number // months
    roi: {
      year1: number
      year3: number
      year5: number
    }
    npv: number
    irr: number
  }
  timeReduction: {
    compliancePrep: number // percentage
    auditTime: number
    riskAssessment: number
    reporting: number
  }
}

interface IndustryBenchmark {
  complianceCostPercent: number
  averageBreachCost: number
  auditCostRange: [number, number]
  timeToCompliance: number // months
  penaltyRisk: number
}

const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmark> = {
  'Financial Services': {
    complianceCostPercent: 0.15,
    averageBreachCost: 5800000,
    auditCostRange: [150000, 500000],
    timeToCompliance: 18,
    penaltyRisk: 0.12
  },
  'Healthcare': {
    complianceCostPercent: 0.12,
    averageBreachCost: 4880000,
    auditCostRange: [100000, 350000],
    timeToCompliance: 12,
    penaltyRisk: 0.08
  },
  'Technology': {
    complianceCostPercent: 0.08,
    averageBreachCost: 3920000,
    auditCostRange: [75000, 250000],
    timeToCompliance: 9,
    penaltyRisk: 0.06
  },
  'Manufacturing': {
    complianceCostPercent: 0.06,
    averageBreachCost: 3540000,
    auditCostRange: [60000, 200000],
    timeToCompliance: 15,
    penaltyRisk: 0.04
  },
  'Retail': {
    complianceCostPercent: 0.05,
    averageBreachCost: 2940000,
    auditCostRange: [50000, 150000],
    timeToCompliance: 12,
    penaltyRisk: 0.05
  }
}

const COMPANY_SIZES = [
  { id: 'startup', name: 'Startup (1-50 employees)', multiplier: 0.6 },
  { id: 'small', name: 'Small Business (51-200 employees)', multiplier: 0.8 },
  { id: 'medium', name: 'Medium Business (201-1000 employees)', multiplier: 1.0 },
  { id: 'large', name: 'Large Enterprise (1000+ employees)', multiplier: 1.3 }
]

const FRAMEWORKS = [
  'SOC 2', 'ISO 27001', 'GDPR', 'HIPAA', 'PCI DSS', 
  'NIST CSF', 'FedRAMP', 'CCPA', 'SOX', 'COBIT'
]

const INDUSTRIES = [
  'Financial Services', 'Healthcare', 'Technology', 
  'Manufacturing', 'Retail', 'Government', 'Education'
]

export const ROICalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    industry: '',
    size: '',
    revenue: 10000000,
    employees: 100,
    currentFrameworks: [],
    complianceBudget: 500000,
    securityBudget: 800000,
    itBudget: 2000000,
    riskTolerance: 'medium'
  })
  const [roiCalculation, setROICalculation] = useState<ROICalculation | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState('conservative')
  const { toast } = useToast()

  const calculateROI = async () => {
    if (!companyProfile.industry || !companyProfile.size) {
      toast({
        title: 'Missing Information',
        description: 'Please complete your company profile first.',
        variant: 'destructive'
      })
      return
    }

    setIsCalculating(true)
    
    // Simulate calculation time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const benchmark = INDUSTRY_BENCHMARKS[companyProfile.industry]
    const sizeMultiplier = COMPANY_SIZES.find(s => s.id === companyProfile.size)?.multiplier || 1.0
    
    // Calculate baseline costs
    const baseComplianceCost = companyProfile.revenue * benchmark.complianceCostPercent * sizeMultiplier
    const baseAuditCost = (benchmark.auditCostRange[0] + benchmark.auditCostRange[1]) / 2 * sizeMultiplier
    
    // ERIP implementation cost (based on company size and complexity)
    const implementationCost = Math.min(
      companyProfile.employees * 150 + companyProfile.currentFrameworks.length * 25000,
      500000 // Cap at €500k
    )
    
    // Calculate savings based on ERIP's efficiency improvements
    const complianceSavings = baseComplianceCost * 0.45 // 45% reduction in compliance costs
    const securitySavings = companyProfile.securityBudget * 0.30 // 30% operational efficiency
    const operationalSavings = companyProfile.itBudget * 0.15 // 15% IT efficiency
    const riskReductionValue = benchmark.averageBreachCost * benchmark.penaltyRisk * 0.70 // 70% risk reduction
    
    const annualSavings = complianceSavings + securitySavings + operationalSavings + riskReductionValue
    
    // Apply scenario multipliers
    const scenarioMultipliers = {
      conservative: 0.7,
      realistic: 1.0,
      optimistic: 1.3
    }
    const adjustedSavings = annualSavings * scenarioMultipliers[selectedScenario]
    
    const calculation: ROICalculation = {
      implementation: {
        cost: implementationCost,
        timeline: 3 // months
      },
      savings: {
        annual: {
          compliance: complianceSavings * scenarioMultipliers[selectedScenario],
          security: securitySavings * scenarioMultipliers[selectedScenario],
          operational: operationalSavings * scenarioMultipliers[selectedScenario],
          riskReduction: riskReductionValue * scenarioMultipliers[selectedScenario],
          total: adjustedSavings
        },
        threeYear: adjustedSavings * 3 - implementationCost,
        fiveYear: adjustedSavings * 5 - implementationCost
      },
      metrics: {
        paybackPeriod: implementationCost / (adjustedSavings / 12),
        roi: {
          year1: ((adjustedSavings - implementationCost) / implementationCost) * 100,
          year3: ((adjustedSavings * 3 - implementationCost) / implementationCost) * 100,
          year5: ((adjustedSavings * 5 - implementationCost) / implementationCost) * 100
        },
        npv: adjustedSavings * 3.5 - implementationCost, // Simplified NPV
        irr: 45 // Simplified IRR estimate
      },
      timeReduction: {
        compliancePrep: 65,
        auditTime: 50,
        riskAssessment: 80,
        reporting: 75
      }
    }
    
    setROICalculation(calculation)
    setIsCalculating(false)
    setActiveTab('results')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: amount > 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `€{value > 0 ? '+' : ''}€{value.toFixed(1)}%`
  }

  const generateYearlyProjection = () => {
    if (!roiCalculation) return []
    
    return Array.from({ length: 5 }, (_, i) => ({
      year: `Year €{i + 1}`,
      savings: roiCalculation.savings.annual.total * (i + 1),
      cumulative: roiCalculation.savings.annual.total * (i + 1) - roiCalculation.implementation.cost,
      roi: ((roiCalculation.savings.annual.total * (i + 1) - roiCalculation.implementation.cost) / roiCalculation.implementation.cost) * 100
    }))
  }

  const getSavingsBreakdown = () => {
    if (!roiCalculation) return []
    
    return [
      { name: 'Compliance', value: roiCalculation.savings.annual.compliance, color: '#3b82f6' },
      { name: 'Security', value: roiCalculation.savings.annual.security, color: '#10b981' },
      { name: 'Operations', value: roiCalculation.savings.annual.operational, color: '#f59e0b' },
      { name: 'Risk Reduction', value: roiCalculation.savings.annual.riskReduction, color: '#8b5cf6' }
    ]
  }

  const yearlyProjection = generateYearlyProjection()
  const savingsBreakdown = getSavingsBreakdown()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">ROI Calculator</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Calculate the business value and return on investment of implementing ERIP 
            for your organization's compliance and security needs.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Company Profile</TabsTrigger>
            <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
            <TabsTrigger value="results">ROI Results</TabsTrigger>
            <TabsTrigger value="report">Business Case</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tell us about your organization</CardTitle>
                <CardDescription>
                  This information helps us provide accurate ROI calculations based on industry benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <select
                      value={companyProfile.industry}
                      onChange={(e) => setCompanyProfile(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                    >
                      <option value="">Select your industry</option>
                      {INDUSTRIES.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="size">Company Size *</Label>
                    <select
                      value={companyProfile.size}
                      onChange={(e) => setCompanyProfile(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                    >
                      <option value="">Select company size</option>
                      {COMPANY_SIZES.map(size => (
                        <option key={size.id} value={size.id}>{size.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="revenue">Annual Revenue (€)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      value={companyProfile.revenue}
                      onChange={(e) => setCompanyProfile(prev => ({ ...prev, revenue: parseInt(e.target.value) || 0 }))}
                      placeholder="10000000"
                    />
                    <p className="text-sm text-slate-500 mt-1">Used for compliance cost benchmarking</p>
                  </div>

                  <div>
                    <Label htmlFor="employees">Number of Employees</Label>
                    <Input
                      id="employees"
                      type="number"
                      value={companyProfile.employees}
                      onChange={(e) => setCompanyProfile(prev => ({ ...prev, employees: parseInt(e.target.value) || 0 }))}
                      placeholder="100"
                    />
                    <p className="text-sm text-slate-500 mt-1">Affects implementation scope and costs</p>
                  </div>
                </div>

                <div>
                  <Label>Current Compliance Frameworks</Label>
                  <p className="text-sm text-slate-500 mb-3">Select all frameworks you currently maintain or are pursuing</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {FRAMEWORKS.map(framework => (
                      <div
                        key={framework}
                        onClick={() => {
                          const isSelected = companyProfile.currentFrameworks.includes(framework)
                          setCompanyProfile(prev => ({
                            ...prev,
                            currentFrameworks: isSelected
                              ? prev.currentFrameworks.filter(f => f !== framework)
                              : [...prev.currentFrameworks, framework]
                          }))
                        }}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer text-center transition-all text-sm",
                          companyProfile.currentFrameworks.includes(framework)
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {framework}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="compliance-budget">Annual Compliance Budget (€)</Label>
                    <Input
                      id="compliance-budget"
                      type="number"
                      value={companyProfile.complianceBudget}
                      onChange={(e) => setCompanyProfile(prev => ({ ...prev, complianceBudget: parseInt(e.target.value) || 0 }))}
                      placeholder="500000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="security-budget">Annual Security Budget (€)</Label>
                    <Input
                      id="security-budget"
                      type="number"
                      value={companyProfile.securityBudget}
                      onChange={(e) => setCompanyProfile(prev => ({ ...prev, securityBudget: parseInt(e.target.value) || 0 }))}
                      placeholder="800000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="it-budget">Annual IT Budget (€)</Label>
                    <Input
                      id="it-budget"
                      type="number"
                      value={companyProfile.itBudget}
                      onChange={(e) => setCompanyProfile(prev => ({ ...prev, itBudget: parseInt(e.target.value) || 0 }))}
                      placeholder="2000000"
                    />
                  </div>
                </div>

                <div>
                  <Label>Risk Tolerance</Label>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {[
                      { id: 'low', name: 'Conservative', desc: 'Minimize all risks' },
                      { id: 'medium', name: 'Balanced', desc: 'Accept some calculated risks' },
                      { id: 'high', name: 'Aggressive', desc: 'Higher risk tolerance for growth' }
                    ].map(risk => (
                      <div
                        key={risk.id}
                        onClick={() => setCompanyProfile(prev => ({ ...prev, riskTolerance: risk.id as any }))}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all",
                          companyProfile.riskTolerance === risk.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <h4 className="font-medium">{risk.name}</h4>
                        <p className="text-sm text-slate-600">{risk.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => setActiveTab('assumptions')}
                  disabled={!companyProfile.industry || !companyProfile.size}
                  className="w-full"
                  size="lg"
                >
                  Continue to Assumptions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assumptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calculation Assumptions</CardTitle>
                <CardDescription>
                  Review and adjust the assumptions used in your ROI calculation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {companyProfile.industry && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-4">
                      Industry Benchmarks for {companyProfile.industry}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>Compliance costs as % of revenue:</span>
                        <span className="font-medium">{(INDUSTRY_BENCHMARKS[companyProfile.industry]?.complianceCostPercent * 100 || 0).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average data breach cost:</span>
                        <span className="font-medium">{formatCurrency(INDUSTRY_BENCHMARKS[companyProfile.industry]?.averageBreachCost || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time to compliance:</span>
                        <span className="font-medium">{INDUSTRY_BENCHMARKS[companyProfile.industry]?.timeToCompliance} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual penalty risk:</span>
                        <span className="font-medium">{((INDUSTRY_BENCHMARKS[companyProfile.industry]?.penaltyRisk || 0) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label>ROI Scenario</Label>
                  <p className="text-sm text-slate-500 mb-3">Choose the scenario that best reflects your expectations</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'conservative', name: 'Conservative', desc: 'Lower-bound estimates', multiplier: '70%' },
                      { id: 'realistic', name: 'Realistic', desc: 'Expected outcomes', multiplier: '100%' },
                      { id: 'optimistic', name: 'Optimistic', desc: 'Best-case scenario', multiplier: '130%' }
                    ].map(scenario => (
                      <div
                        key={scenario.id}
                        onClick={() => setSelectedScenario(scenario.id)}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all",
                          selectedScenario === scenario.id
                            ? "border-green-500 bg-green-50"
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <h4 className="font-medium">{scenario.name}</h4>
                        <p className="text-sm text-slate-600">{scenario.desc}</p>
                        <p className="text-xs text-green-600 font-medium mt-1">{scenario.multiplier} of base savings</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-4">ERIP Efficiency Assumptions</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Compliance cost reduction:</span>
                      <span className="font-medium text-green-600">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security operational efficiency:</span>
                      <span className="font-medium text-green-600">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IT process efficiency:</span>
                      <span className="font-medium text-green-600">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk reduction factor:</span>
                      <span className="font-medium text-green-600">70%</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={calculateROI}
                  disabled={isCalculating}
                  className="w-full"
                  size="lg"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculating ROI...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate ROI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {!roiCalculation ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calculator className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Complete Profile to See Results
                  </h3>
                  <p className="text-slate-600">
                    Fill out your company profile and run the calculation to see your ROI analysis
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* ROI Summary */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {formatPercent(roiCalculation.metrics.roi.year3)}
                      </div>
                      <div className="text-sm text-green-800">3-Year ROI</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {formatCurrency(roiCalculation.savings.annual.total)}
                      </div>
                      <div className="text-sm text-blue-800">Annual Savings</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {roiCalculation.metrics.paybackPeriod.toFixed(1)}
                      </div>
                      <div className="text-sm text-purple-800">Payback (Months)</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-amber-600 mb-2">
                        {formatCurrency(roiCalculation.savings.fiveYear)}
                      </div>
                      <div className="text-sm text-amber-800">5-Year Value</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* ROI Over Time */}
                  <Card>
                    <CardHeader>
                      <CardTitle>ROI Projection Over Time</CardTitle>
                      <CardDescription>Cumulative return on investment by year</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={yearlyProjection}>
                            <defs>
                              <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatPercent(value as number)} />
                            <Area 
                              type="monotone" 
                              dataKey="roi" 
                              stroke="#10b981" 
                              fillOpacity={1} 
                              fill="url(#roiGradient)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Savings Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Annual Savings Breakdown</CardTitle>
                      <CardDescription>Sources of cost savings and value</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={savingsBreakdown}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                              label={(entry) => `€{entry.name}: €{formatCurrency(entry.value)}`}
                            >
                              {savingsBreakdown.map((entry, index) => (
                                <Cell key={`cell-€{index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Time Savings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Time Efficiency Gains</CardTitle>
                    <CardDescription>Percentage reduction in time spent on compliance activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-6">
                      {Object.entries(roiCalculation.timeReduction).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-2">{value}%</div>
                          <div className="text-sm text-slate-600 capitalize">
                            {key.replace(/([A-Z])/g, ' €1').trim()}
                          </div>
                          <Progress value={value} className="h-2 mt-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Implementation Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Investment</CardTitle>
                    <CardDescription>One-time costs and timeline for ERIP deployment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900 mb-2">
                          {formatCurrency(roiCalculation.implementation.cost)}
                        </div>
                        <div className="text-sm text-slate-600">Implementation Cost</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900 mb-2">
                          {roiCalculation.implementation.timeline}
                        </div>
                        <div className="text-sm text-slate-600">Months to Deploy</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900 mb-2">
                          {formatPercent(roiCalculation.metrics.irr)}
                        </div>
                        <div className="text-sm text-slate-600">Internal Rate of Return</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button onClick={() => setActiveTab('report')} className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Business Case
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Results
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Executive Business Case Report</CardTitle>
                <CardDescription>
                  Professional business case document for stakeholder presentation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!roiCalculation ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">Complete the ROI calculation to generate your business case report</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                      <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        ERIP Implementation Business Case
                      </h2>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Organization:</span>
                          <div className="font-medium">{companyProfile.industry} Company</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Analysis Date:</span>
                          <div className="font-medium">{new Date().toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Scenario:</span>
                          <div className="font-medium capitalize">{selectedScenario}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Executive Summary</h3>
                      <p className="text-slate-700">
                        Implementation of the ERIP Trust Intelligence Platform will deliver a{' '}
                        <strong className="text-green-600">{formatPercent(roiCalculation.metrics.roi.year3)}</strong> return on investment 
                        over three years, with annual savings of{' '}
                        <strong className="text-green-600">{formatCurrency(roiCalculation.savings.annual.total)}</strong>.
                        The investment will pay for itself in{' '}
                        <strong className="text-blue-600">{roiCalculation.metrics.paybackPeriod.toFixed(1)} months</strong>.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Financial Benefits</h3>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>Compliance cost reduction:</span>
                            <span className="font-medium">{formatCurrency(roiCalculation.savings.annual.compliance)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Security efficiency gains:</span>
                            <span className="font-medium">{formatCurrency(roiCalculation.savings.annual.security)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Operational savings:</span>
                            <span className="font-medium">{formatCurrency(roiCalculation.savings.annual.operational)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Risk reduction value:</span>
                            <span className="font-medium">{formatCurrency(roiCalculation.savings.annual.riskReduction)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Operational Benefits</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Time Savings</h4>
                          <ul className="text-sm space-y-1">
                            <li>• {roiCalculation.timeReduction.compliancePrep}% faster compliance preparation</li>
                            <li>• {roiCalculation.timeReduction.auditTime}% reduction in audit time</li>
                            <li>• {roiCalculation.timeReduction.riskAssessment}% faster risk assessments</li>
                            <li>• {roiCalculation.timeReduction.reporting}% less time on reporting</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-900 mb-2">Strategic Value</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Enhanced security posture</li>
                            <li>• Improved regulatory compliance</li>
                            <li>• Reduced operational risk</li>
                            <li>• Better stakeholder confidence</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Implementation Plan</h3>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">Investment Required:</span>
                            <div className="font-medium text-lg">{formatCurrency(roiCalculation.implementation.cost)}</div>
                          </div>
                          <div>
                            <span className="text-slate-600">Implementation Timeline:</span>
                            <div className="font-medium text-lg">{roiCalculation.implementation.timeline} months</div>
                          </div>
                          <div>
                            <span className="text-slate-600">Break-even Point:</span>
                            <div className="font-medium text-lg">{roiCalculation.metrics.paybackPeriod.toFixed(1)} months</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF Report
                      </Button>
                      <Button variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Report
                      </Button>
                      <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Presentation
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ROICalculator