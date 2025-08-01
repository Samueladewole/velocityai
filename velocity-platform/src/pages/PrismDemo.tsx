/**
 * PRISM Monte Carlo Demo
 * 
 * Complete risk quantification demo showcasing:
 * - Risk Scenario Builder
 * - Monte Carlo Simulation
 * - Executive Reports
 * - Financial Impact Analysis
 */
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Calculator,
  BarChart3,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Award,
  Activity,
  AlertTriangle,
  CheckCircle,
  PlayCircle
} from 'lucide-react'
import { RiskScenarioBuilder } from '@/components/prism/RiskScenarioBuilder'
import { MonteCarloVisualization } from '@/components/prism/MonteCarloVisualization'
import { ExecutiveReports } from '@/components/prism/ExecutiveReports'
import { RiskScenario, MonteCarloResult } from '@/types/prism'
import { useToast } from '@/hooks/use-toast'

export function PrismDemo() {
  const [activeTab, setActiveTab] = useState('overview')
  const [scenarios, setScenarios] = useState<RiskScenario[]>([])
  const [simulationResults, setSimulationResults] = useState<MonteCarloResult | null>(null)
  const [demoProgress, setDemoProgress] = useState(0)
  const { toast } = useToast()

  // Demo flow states
  const [completedSteps, setCompletedSteps] = useState({
    scenarios: false,
    simulation: false,
    reports: false
  })

  const handleScenariosUpdate = (newScenarios: RiskScenario[]) => {
    setScenarios(newScenarios)
    if (newScenarios.length > 0 && !completedSteps.scenarios) {
      setCompletedSteps(prev => ({ ...prev, scenarios: true }))
      setDemoProgress(33)
      toast({
        title: 'Step Complete',
        description: 'Risk scenarios configured successfully'
      })
    }
  }

  const handleSimulationComplete = (results: MonteCarloResult) => {
    setSimulationResults(results)
    if (!completedSteps.simulation) {
      setCompletedSteps(prev => ({ ...prev, simulation: true }))
      setDemoProgress(66)
      toast({
        title: 'Simulation Complete',
        description: 'Monte Carlo analysis finished'
      })
    }
  }

  const handleReportsGenerated = () => {
    if (!completedSteps.reports) {
      setCompletedSteps(prev => ({ ...prev, reports: true }))
      setDemoProgress(100)
      toast({
        title: 'Demo Complete',
        description: 'Executive reports generated'
      })
    }
  }

  const startGuidedDemo = () => {
    // Add sample scenarios for demo
    const demoScenarios: RiskScenario[] = [
      {
        id: 'demo-cyber-breach',
        name: 'Customer Data Breach',
        description: 'Unauthorized access to customer personal information and payment data',
        category: 'cyber',
        threatType: 'data_breach',
        industry: 'technology',
        createdAt: new Date(),
        updatedAt: new Date(),
        probability: {
          annual: 0.15,
          confidence: 85,
          source: 'industry'
        },
        impact: {
          financial: {
            min: 800000,
            likely: 2500000,
            max: 10000000,
            currency: 'USD'
          },
          operational: {
            downtimeHours: 48,
            affectedUsers: 25000,
            productivityLoss: 0.3
          },
          reputational: {
            customerChurn: 0.18,
            brandImpact: 75,
            recoveryTime: 180
          }
        },
        mitigations: [
          {
            id: 'encrypt-data',
            name: 'Enhanced Data Encryption',
            description: 'Implement AES-256 encryption for all customer data',
            cost: 150000,
            effectiveness: 0.4,
            implementationTime: 60,
            roi: 4.2
          },
          {
            id: 'monitoring',
            name: '24/7 Security Monitoring',
            description: 'Real-time threat detection and response',
            cost: 200000,
            effectiveness: 0.6,
            implementationTime: 90,
            roi: 7.5
          }
        ]
      },
      {
        id: 'demo-system-outage',
        name: 'Critical System Outage',
        description: 'Complete failure of primary production systems',
        category: 'operational',
        threatType: 'service_outage',
        industry: 'technology',
        createdAt: new Date(),
        updatedAt: new Date(),
        probability: {
          annual: 0.08,
          confidence: 90,
          source: 'historical'
        },
        impact: {
          financial: {
            min: 300000,
            likely: 1200000,
            max: 5000000,
            currency: 'USD'
          },
          operational: {
            downtimeHours: 12,
            affectedUsers: 50000,
            productivityLoss: 0.8
          },
          reputational: {
            customerChurn: 0.12,
            brandImpact: 60,
            recoveryTime: 90
          }
        },
        mitigations: [
          {
            id: 'redundancy',
            name: 'System Redundancy',
            description: 'Implement failover systems and load balancing',
            cost: 300000,
            effectiveness: 0.8,
            implementationTime: 120,
            roi: 3.2
          }
        ]
      },
      {
        id: 'demo-compliance',
        name: 'Regulatory Compliance Violation',
        description: 'GDPR or similar privacy regulation violation',
        category: 'compliance',
        threatType: 'compliance_violation',
        industry: 'technology',
        createdAt: new Date(),
        updatedAt: new Date(),
        probability: {
          annual: 0.05,
          confidence: 78,
          source: 'expert'
        },
        impact: {
          financial: {
            min: 100000,
            likely: 1500000,
            max: 20000000,
            currency: 'USD'
          },
          operational: {
            downtimeHours: 0,
            affectedUsers: 0,
            productivityLoss: 0.1
          },
          reputational: {
            customerChurn: 0.25,
            brandImpact: 85,
            recoveryTime: 365
          }
        },
        mitigations: [
          {
            id: 'privacy-controls',
            name: 'Privacy by Design Implementation',
            description: 'Comprehensive privacy controls and data governance',
            cost: 250000,
            effectiveness: 0.7,
            implementationTime: 180,
            roi: 4.2
          }
        ]
      }
    ]

    setScenarios(demoScenarios)
    setActiveTab('scenarios')
    toast({
      title: 'Demo Started',
      description: 'Sample scenarios loaded - customize or run simulation'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount)
  }

  const totalExposure = scenarios.reduce((sum, s) => 
    sum + (s.probability.annual * s.impact.financial.likely), 0
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600">
            <Calculator className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              PRISM Monte Carlo Demo
            </h1>
            <p className="text-xl text-slate-600">
              Proactive Risk Intelligence & Simulation Modeling
            </p>
          </div>
        </div>

        {/* Demo Progress */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Demo Progress</span>
                <span>{demoProgress}% Complete</span>
              </div>
              <Progress value={demoProgress} className="h-3" />
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className={`flex items-center gap-2 €{completedSteps.scenarios ? 'text-green-600' : 'text-gray-500'}`}>
                  {completedSteps.scenarios ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />}
                  <span>Build Scenarios</span>
                </div>
                <div className={`flex items-center gap-2 €{completedSteps.simulation ? 'text-green-600' : 'text-gray-500'}`}>
                  {completedSteps.simulation ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />}
                  <span>Run Simulation</span>
                </div>
                <div className={`flex items-center gap-2 €{completedSteps.reports ? 'text-green-600' : 'text-gray-500'}`}>
                  {completedSteps.reports ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />}
                  <span>Generate Reports</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scenarios">Risk Scenarios</TabsTrigger>
          <TabsTrigger value="simulation">Monte Carlo</TabsTrigger>
          <TabsTrigger value="reports">Executive Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Demo Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* What is PRISM */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  What is PRISM?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  PRISM (Proactive Risk Intelligence & Simulation Modeling) is a Monte Carlo-based 
                  risk quantification engine that transforms qualitative risk assessments into 
                  precise financial impact analysis.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Visual risk scenario building</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Statistical Monte Carlo simulation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Board-ready executive reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">ROI analysis for mitigations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Demo Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">{scenarios.length}</div>
                    <div className="text-sm text-blue-700">Risk Scenarios</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-900">
                      {totalExposure > 0 ? formatCurrency(totalExposure) : '€0'}
                    </div>
                    <div className="text-sm text-green-700">Total Exposure</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-900">
                      {simulationResults ? '✓' : '○'}
                    </div>
                    <div className="text-sm text-purple-700">Simulation</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-900">
                      {completedSteps.reports ? '✓' : '○'}
                    </div>
                    <div className="text-sm text-orange-700">Reports</div>
                  </div>
                </div>

                <Button onClick={startGuidedDemo} className="w-full" size="lg">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Guided Demo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Scenario Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  Create detailed risk scenarios with probability distributions, 
                  impact calculations, and mitigation strategies.
                </p>
                <Badge variant="secondary">Industry Templates</Badge>
                <Badge variant="secondary" className="ml-2">Visual Interface</Badge>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Monte Carlo Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  Run thousands of simulations to generate statistical distributions 
                  and confidence intervals for risk exposure.
                </p>
                <Badge variant="secondary">Live Animation</Badge>
                <Badge variant="secondary" className="ml-2">Statistical Analysis</Badge>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Executive Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  Generate board-ready reports with financial impact analysis, 
                  mitigation ROI, and strategic recommendations.
                </p>
                <Badge variant="secondary">PDF Export</Badge>
                <Badge variant="secondary" className="ml-2">Board Ready</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          {scenarios.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Choose your path to explore PRISM's capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('scenarios')}
                    className="h-20 flex-col gap-2"
                  >
                    <Target className="h-6 w-6" />
                    <span>Build Custom Scenarios</span>
                    <span className="text-xs text-gray-500">Start from scratch</span>
                  </Button>
                  <Button 
                    onClick={startGuidedDemo}
                    className="h-20 flex-col gap-2"
                  >
                    <Zap className="h-6 w-6" />
                    <span>Quick Demo</span>
                    <span className="text-xs">Pre-loaded scenarios</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scenarios">
          <RiskScenarioBuilder 
            onScenariosChange={handleScenariosUpdate}
            initialScenarios={scenarios}
          />
        </TabsContent>

        <TabsContent value="simulation">
          {scenarios.length > 0 ? (
            <MonteCarloVisualization 
              scenarios={scenarios}
              onResultsUpdate={handleSimulationComplete}
            />
          ) : (
            <Card className="h-64 flex items-center justify-center">
              <CardContent className="text-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Risk Scenarios</h3>
                <p className="text-gray-500 mb-4">
                  Create risk scenarios first to run Monte Carlo simulation
                </p>
                <Button onClick={() => setActiveTab('scenarios')}>
                  <Target className="h-4 w-4 mr-2" />
                  Build Scenarios
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports">
          {scenarios.length > 0 ? (
            <div onClick={handleReportsGenerated}>
              <ExecutiveReports 
                scenarios={scenarios}
                simulationResults={simulationResults || undefined}
                organizationName="Acme Technology Corp"
              />
            </div>
          ) : (
            <Card className="h-64 flex items-center justify-center">
              <CardContent className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-500 mb-4">
                  Complete risk scenarios and simulation to generate executive reports
                </p>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setActiveTab('scenarios')}>
                    Build Scenarios
                  </Button>
                  <Button onClick={startGuidedDemo}>
                    Quick Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Bottom Statistics */}
      {scenarios.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{scenarios.length}</div>
                <div className="text-sm text-gray-600">Risk Scenarios</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalExposure)}
                </div>
                <div className="text-sm text-gray-600">Expected Annual Loss</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {scenarios.reduce((sum, s) => sum + s.mitigations.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Risk Controls</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {simulationResults ? 
                    `€{Math.round(simulationResults.statistics.mean / totalExposure * 100)}%` : 
                    'Pending'
                  }
                </div>
                <div className="text-sm text-gray-600">Risk Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}