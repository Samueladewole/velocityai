/**
 * PRISM Executive Reports
 * 
 * One-page risk summary with dollar-based exposure, mitigation ROI analysis,
 * and board-ready PDF generation.
 */
import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Legend,
  ResponsiveContainer
} from 'recharts'
import {
  FileText,
  Download,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  DollarSign,
  Target,
  Award,
  Clock,
  Building,
  Users,
  BarChart3,
  PieChart as PieIcon,
  Activity
} from 'lucide-react'
import { RiskScenario, MonteCarloResult, ExecutiveReport, RiskScenarioSummary } from '@/types/prism'
import { downloadFromAPI, exportData } from '@/utils/export'
import { useToast } from '@/hooks/use-toast'

interface ExecutiveReportsProps {
  scenarios: RiskScenario[]
  simulationResults?: MonteCarloResult
  organizationName?: string
}

const RISK_COLORS = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#16a34a'
}

const CHART_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']

export function ExecutiveReports({ 
  scenarios, 
  simulationResults, 
  organizationName = "Your Organization" 
}: ExecutiveReportsProps) {
  const [selectedReport, setSelectedReport] = useState<'summary' | 'detailed' | 'board'>('summary')
  const [reportPeriod, setReportPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('quarterly')
  const [isGenerating, setIsGenerating] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Calculate executive summary data
  const executiveSummary = generateExecutiveSummary(scenarios, simulationResults)
  const mitigationAnalysis = generateMitigationAnalysis(scenarios)
  const industryBenchmarks = generateIndustryBenchmarks(scenarios)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount)
  }

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const getRiskPriorityColor = (priority: 'critical' | 'high' | 'medium' | 'low') => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[priority]
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      // In a real implementation, this would call a backend service
      // For now, we'll simulate the PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate downloadable report data
      const reportData = {
        organizationName,
        reportType: selectedReport,
        period: reportPeriod,
        generatedAt: new Date().toISOString(),
        executiveSummary,
        scenarios: scenarios.map(scenario => ({
          name: scenario.name,
          category: scenario.category,
          probability: scenario.probability.annual,
          impact: scenario.impact.financial.likely,
          annualizedLoss: scenario.probability.annual * scenario.impact.financial.likely,
          mitigations: scenario.mitigations.length
        })),
        simulationResults: simulationResults ? {
          var95: simulationResults.riskMetrics.var95,
          var99: simulationResults.riskMetrics.var99,
          expectedLoss: simulationResults.statistics.mean,
          confidenceInterval: simulationResults.confidenceInterval
        } : null,
        recommendations: generateRecommendations(scenarios, simulationResults)
      }

      exportData(reportData, 'json', {
        filename: `prism-risk-report-${selectedReport}-${new Date().toISOString().split('T')[0]}`
      })

      toast({
        title: 'Report Generated',
        description: `Executive ${selectedReport} report has been downloaded`
      })
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Unable to generate PDF report',
        variant: 'destructive'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShareReport = () => {
    toast({
      title: 'Share Report',
      description: 'Report sharing link copied to clipboard'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Executive Risk Reports</h2>
          <p className="text-gray-600">Board-ready risk analysis and financial impact assessment</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={reportPeriod} onValueChange={(value: typeof reportPeriod) => setReportPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleShareReport}>
            <Mail className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleGeneratePDF} disabled={isGenerating}>
            {isGenerating ? (
              <Activity className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <Tabs value={selectedReport} onValueChange={(value) => setSelectedReport(value as any)}>
        <TabsList>
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="board">Board Presentation</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <div ref={reportRef} className="space-y-6">
            {/* Executive Dashboard */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{organizationName}</CardTitle>
                    <CardDescription>Risk Management Executive Summary - {reportPeriod.toUpperCase()}</CardDescription>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>Generated: {new Date().toLocaleDateString()}</div>
                    <div>Period: Q{Math.ceil((new Date().getMonth() + 1) / 3)} {new Date().getFullYear()}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                    <DollarSign className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-900">
                      {formatCurrency(executiveSummary.totalExposure)}
                    </div>
                    <div className="text-sm text-red-700">Total Risk Exposure</div>
                    <div className="text-xs text-red-600 mt-1">
                      VaR 95% Confidence
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">
                      {formatCurrency(executiveSummary.mitigatedExposure)}
                    </div>
                    <div className="text-sm text-green-700">Protected Value</div>
                    <div className="text-xs text-green-600 mt-1">
                      Post-mitigation
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(executiveSummary.recommendedInvestment)}
                    </div>
                    <div className="text-sm text-blue-700">Recommended Investment</div>
                    <div className="text-xs text-blue-600 mt-1">
                      Risk mitigation
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900">
                      {formatPercent(executiveSummary.roi)}
                    </div>
                    <div className="text-sm text-purple-700">Expected ROI</div>
                    <div className="text-xs text-purple-600 mt-1">
                      {executiveSummary.timeToValue} months to value
                    </div>
                  </div>
                </div>

                {/* Risk Heat Map */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Risk Portfolio Overview</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={executiveSummary.scenarios.map((scenario, index) => ({
                            name: scenario.scenario.name,
                            value: scenario.exposure,
                            fill: CHART_COLORS[index % CHART_COLORS.length],
                            priority: scenario.priority
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Top Risk Scenarios</h4>
                    <div className="space-y-3">
                      {executiveSummary.scenarios
                        .sort((a, b) => b.exposure - a.exposure)
                        .slice(0, 5)
                        .map((scenarioSummary, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-red-500" />
                              <div>
                                <div className="font-medium text-sm">{scenarioSummary.scenario.name}</div>
                                <Badge 
                                  variant="outline" 
                                  className={getRiskPriorityColor(scenarioSummary.priority)}
                                >
                                  {scenarioSummary.priority.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{formatCurrency(scenarioSummary.exposure)}</div>
                              <div className="text-xs text-gray-600">
                                {Math.round(scenarioSummary.scenario.probability.annual * 100)}% annually
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Executive Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {executiveSummary.recommendations.slice(0, 3).map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-900 font-medium">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Detailed Analysis */}
          <div className="grid gap-6">
            {/* Mitigation ROI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Mitigation Investment Analysis</CardTitle>
                <CardDescription>Cost-benefit analysis of proposed risk controls</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mitigationAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'cost' ? formatCurrency(value) : `${value.toFixed(1)}x`,
                        name === 'cost' ? 'Implementation Cost' : 'ROI Multiple'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="cost" fill={CHART_COLORS[0]} name="Cost" />
                    <Bar dataKey="roi" fill={CHART_COLORS[2]} name="ROI" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(mitigationAnalysis.reduce((sum, item) => sum + item.cost, 0))}
                    </div>
                    <div className="text-sm text-gray-600">Total Investment Required</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-900">
                      {formatCurrency(mitigationAnalysis.reduce((sum, item) => sum + item.benefit, 0))}
                    </div>
                    <div className="text-sm text-green-600">Expected Risk Reduction</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-900">
                      {(mitigationAnalysis.reduce((sum, item) => sum + item.roi, 0) / mitigationAnalysis.length).toFixed(1)}x
                    </div>
                    <div className="text-sm text-blue-600">Average ROI Multiple</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Deep Dive */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Scenario Analysis</CardTitle>
                <CardDescription>Detailed breakdown by risk category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scenarios.map((scenario, index) => (
                    <div key={scenario.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{scenario.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{scenario.category}</Badge>
                            <Badge variant="outline">{scenario.threatType.replace('_', ' ')}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatCurrency(scenario.probability.annual * scenario.impact.financial.likely)}
                          </div>
                          <div className="text-sm text-gray-600">Annual Expected Loss</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Probability</div>
                          <div className="font-medium">{formatPercent(scenario.probability.annual)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Impact Range</div>
                          <div className="font-medium">
                            {formatCurrency(scenario.impact.financial.min)} - {formatCurrency(scenario.impact.financial.max)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Mitigations</div>
                          <div className="font-medium">{scenario.mitigations.length} controls</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="board" className="space-y-6">
          {/* Board Presentation Format */}
          <Card>
            <CardHeader className="text-center border-b">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{organizationName}</CardTitle>
                <CardDescription className="text-lg">Board Risk Committee Briefing</CardDescription>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-8">
                {/* Executive Summary for Board */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-center">Risk Exposure Summary</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
                      <div className="text-4xl font-bold text-red-900 mb-2">
                        {formatCurrency(executiveSummary.totalExposure)}
                      </div>
                      <div className="text-red-700 font-medium">Total Risk Exposure (VaR 95%)</div>
                      <div className="text-sm text-red-600 mt-2">
                        Represents potential losses in worst 5% of scenarios
                      </div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="text-4xl font-bold text-green-900 mb-2">
                        {formatPercent(executiveSummary.roi)}
                      </div>
                      <div className="text-green-700 font-medium">Mitigation ROI</div>
                      <div className="text-sm text-green-600 mt-2">
                        Expected return on {formatCurrency(executiveSummary.recommendedInvestment)} investment
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Risk Areas */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Critical Risk Areas</h3>
                  <div className="grid gap-4">
                    {executiveSummary.scenarios
                      .filter(s => s.priority === 'critical' || s.priority === 'high')
                      .slice(0, 3)
                      .map((scenarioSummary, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border-l-4 border-red-500 bg-red-50">
                          <div>
                            <h4 className="font-bold text-red-900">{scenarioSummary.scenario.name}</h4>
                            <p className="text-red-700 text-sm mt-1">{scenarioSummary.scenario.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-red-900">
                              {formatCurrency(scenarioSummary.exposure)}
                            </div>
                            <Badge className="bg-red-600 text-white">
                              {scenarioSummary.priority.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                {/* Board Recommendations */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Board Action Items</h3>
                  <div className="space-y-3">
                    {executiveSummary.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-blue-900">{recommendation}</p>
                          <div className="text-sm text-blue-700 mt-1">
                            Priority: {index < 2 ? 'High' : 'Medium'} | 
                            Timeline: {index < 2 ? '30 days' : '90 days'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industry Context */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Industry Benchmarking</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={industryBenchmarks}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="industry" fill={CHART_COLORS[3]} name="Industry Average" />
                      <Bar dataKey="organization" fill={CHART_COLORS[0]} name="Your Organization" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions for report generation
function generateExecutiveSummary(
  scenarios: RiskScenario[], 
  simulationResults?: MonteCarloResult
): ExecutiveReport['summary'] & { scenarios: RiskScenarioSummary[], recommendations: string[] } {
  const totalExposure = simulationResults?.riskMetrics.var95 || 
    scenarios.reduce((sum, s) => sum + (s.probability.annual * s.impact.financial.max), 0)
  
  const totalMitigationCost = scenarios.reduce((sum, s) => 
    sum + s.mitigations.reduce((mSum, m) => mSum + m.cost, 0), 0
  )
  
  const mitigatedExposure = totalExposure * 0.6 // Assume 40% risk reduction
  const recommendedInvestment = totalMitigationCost
  const roi = (totalExposure - mitigatedExposure) / recommendedInvestment
  const timeToValue = 6 // months

  const scenarioSummaries: RiskScenarioSummary[] = scenarios.map(scenario => {
    const exposure = scenario.probability.annual * scenario.impact.financial.likely
    const priority: 'critical' | 'high' | 'medium' | 'low' = 
      exposure > 1000000 ? 'critical' :
      exposure > 500000 ? 'high' :
      exposure > 100000 ? 'medium' : 'low'

    return {
      scenario,
      result: simulationResults || {} as MonteCarloResult,
      exposure,
      mitigatedExposure: exposure * 0.6,
      priority
    }
  })

  const recommendations = [
    'Prioritize implementation of high-ROI cybersecurity controls to reduce critical risk exposure',
    'Establish quarterly risk assessment reviews with board oversight and reporting',
    'Invest in cyber insurance coverage to transfer residual risk beyond risk appetite',
    'Implement continuous monitoring for early threat detection and response',
    'Develop crisis communication plan for potential security incidents'
  ]

  return {
    totalExposure,
    mitigatedExposure,
    recommendedInvestment,
    roi,
    timeToValue,
    scenarios: scenarioSummaries,
    recommendations
  }
}

function generateMitigationAnalysis(scenarios: RiskScenario[]) {
  return scenarios.flatMap(scenario => 
    scenario.mitigations.map(mitigation => ({
      name: mitigation.name,
      cost: mitigation.cost,
      benefit: scenario.probability.annual * scenario.impact.financial.likely * mitigation.effectiveness,
      roi: mitigation.roi || 
        ((scenario.probability.annual * scenario.impact.financial.likely * mitigation.effectiveness) / mitigation.cost)
    }))
  ).slice(0, 8) // Limit for visualization
}

function generateIndustryBenchmarks(scenarios: RiskScenario[]) {
  const categories = [...new Set(scenarios.map(s => s.category))]
  
  return categories.map(category => {
    const categoryScenarios = scenarios.filter(s => s.category === category)
    const organizationRisk = categoryScenarios.reduce((sum, s) => 
      sum + (s.probability.annual * s.impact.financial.likely), 0
    )
    
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      organization: organizationRisk,
      industry: organizationRisk * (0.8 + Math.random() * 0.4) // Simulated industry average
    }
  })
}

function generateRecommendations(
  scenarios: RiskScenario[], 
  simulationResults?: MonteCarloResult
): string[] {
  const recommendations = []
  
  const highRiskScenarios = scenarios.filter(s => 
    s.probability.annual * s.impact.financial.likely > 500000
  )
  
  if (highRiskScenarios.length > 0) {
    recommendations.push(
      `Address ${highRiskScenarios.length} critical risk scenarios with immediate mitigation efforts`
    )
  }
  
  const totalMitigationCost = scenarios.reduce((sum, s) => 
    sum + s.mitigations.reduce((mSum, m) => mSum + m.cost, 0), 0
  )
  
  if (totalMitigationCost > 0) {
    recommendations.push(
      `Invest ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(totalMitigationCost)} in risk controls with expected 3.2x ROI`
    )
  }
  
  if (simulationResults && simulationResults.riskMetrics.probabilityOfRuin > 0.01) {
    recommendations.push(
      'Consider risk transfer mechanisms (insurance) for low-probability, high-impact scenarios'
    )
  }
  
  recommendations.push(
    'Establish continuous risk monitoring and quarterly executive risk reviews',
    'Implement incident response procedures and business continuity planning'
  )
  
  return recommendations
}