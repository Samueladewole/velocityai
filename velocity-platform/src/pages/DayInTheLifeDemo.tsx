/**
 * "Day in the Life" Demo - ERIP Complete Workflow
 * 
 * Demonstrates the full ERIP workflow from new regulation detection
 * to board-level risk quantification and deal acceleration
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Shield,
  FileText,
  Users,
  DollarSign,
  BarChart3,
  Zap,
  Award,
  ArrowRight,
  Globe,
  Building2,
  Target,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DemoStep {
  id: string
  title: string
  component: string
  description: string
  duration: number
  autoAdvance: boolean
  completed: boolean
  data?: any
}

interface DemoScenario {
  id: string
  title: string
  description: string
  steps: DemoStep[]
  totalDuration: number
  businessValue: string
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'regulation-workflow',
    title: 'New Regulation → Full Workflow',
    description: 'EU AI Act announced → Complete ERIP response in 24 hours',
    totalDuration: 45, // seconds for demo
    businessValue: 'Reduced compliance prep from 6 months to 24 hours',
    steps: [
      {
        id: 'regulation-detected',
        title: 'COMPASS: New Regulation Detected',
        component: 'compass',
        description: 'EU AI Act risk management requirements automatically identified',
        duration: 5,
        autoAdvance: true,
        completed: false,
        data: {
          regulation: 'EU AI Act Article 9',
          impact: 'High-risk AI systems require risk management',
          frameworks: ['ISO 23053', 'ISO 23894'],
          deadline: '2026-08-02'
        }
      },
      {
        id: 'security-assessment',
        title: 'ATLAS: Security Impact Assessment',
        component: 'atlas',
        description: 'AI system security controls automatically mapped and gaps identified',
        duration: 8,
        autoAdvance: true,
        completed: false,
        data: {
          gaps: ['AI model security', 'Algorithmic auditing', 'Data governance'],
          riskLevel: 'Medium',
          controlsRequired: 23,
          controlsImplemented: 18
        }
      },
      {
        id: 'risk-quantification',
        title: 'PRISM: Risk Quantification',
        component: 'prism',
        description: 'Monte Carlo simulation quantifies compliance costs and business impact',
        duration: 10,
        autoAdvance: true,
        completed: false,
        data: {
          complianceCost: 1200000,
          businessImpact: 3500000,
          timeToCompliance: '18 months',
          riskReduction: '75%'
        }
      },
      {
        id: 'decision-support',
        title: 'CLEARANCE: Decision Recommendations',
        component: 'clearance',
        description: 'AI-powered recommendations for optimal compliance strategy',
        duration: 7,
        autoAdvance: true,
        completed: false,
        data: {
          strategy: 'Phased Implementation',
          priority: ['Data governance', 'Risk management', 'Testing procedures'],
          timeline: 'Q1 2025 - Q2 2026',
          confidence: 92
        }
      },
      {
        id: 'trust-score-update',
        title: 'Trust Score Updated',
        component: 'trust',
        description: 'Trust Equity™ updated with proactive compliance preparation',
        duration: 5,
        autoAdvance: true,
        completed: false,
        data: {
          previousScore: 658,
          newScore: 682,
          improvement: 24,
          tierProgress: '68% to Market Leader'
        }
      },
      {
        id: 'board-report',
        title: 'BEACON: Executive Report Generated',
        component: 'beacon',
        description: 'Board-ready presentation with cost-benefit analysis',
        duration: 8,
        autoAdvance: true,
        completed: false,
        data: {
          reportType: 'Strategic Compliance Investment',
          recommendation: 'Approve €1.2M budget for Q1 2025',
          roi: '290% over 24 months',
          riskMitigation: '€8.4M potential savings'
        }
      },
      {
        id: 'monitoring-setup',
        title: 'PULSE: Continuous Monitoring',
        component: 'pulse',
        description: 'Real-time compliance monitoring and progress tracking activated',
        duration: 2,
        autoAdvance: false,
        completed: false,
        data: {
          metricsTracked: 15,
          alertsConfigured: 8,
          dashboardsCreated: 3,
          updateFrequency: 'Real-time'
        }
      }
    ]
  },
  {
    id: 'questionnaire-workflow',
    title: 'Security Questionnaire → 2-Hour Completion',
    description: 'Enterprise RFP security questionnaire completed in record time',
    totalDuration: 30,
    businessValue: 'Reduced RFP response time from 2 weeks to 2 hours',
    steps: [
      {
        id: 'questionnaire-upload',
        title: 'QIE: Document Upload & Analysis',
        component: 'qie',
        description: '187-question security questionnaire automatically analyzed',
        duration: 8,
        autoAdvance: true,
        completed: false,
        data: {
          questions: 187,
          categories: ['Security', 'Privacy', 'Compliance', 'Operations'],
          complexity: 'Enterprise-level',
          frameworks: ['SOC 2', 'ISO 27001', 'NIST CSF']
        }
      },
      {
        id: 'intelligent-mapping',
        title: 'Evidence Mapping & Pre-Population',
        component: 'qie',
        description: 'AI maps questions to existing evidence and pre-populates 89% of responses',
        duration: 12,
        autoAdvance: true,
        completed: false,
        data: {
          preMapped: 166,
          requiresReview: 21,
          accuracy: '96%',
          confidenceAvg: 94
        }
      },
      {
        id: 'expert-review',
        title: 'Expert Review & Validation',
        component: 'qie',
        description: 'Security expert validates responses and adds context',
        duration: 8,
        autoAdvance: true,
        completed: false,
        data: {
          validated: 187,
          modified: 12,
          addedContext: 45,
          qualityScore: 98
        }
      },
      {
        id: 'delivery-package',
        title: 'Response Package Generated',
        component: 'qie',
        description: 'Complete response with evidence attachments ready for submission',
        duration: 2,
        autoAdvance: false,
        completed: false,
        data: {
          documents: 23,
          certificates: 8,
          policies: 15,
          totalSize: '47MB'
        }
      }
    ]
  },
  {
    id: 'sales-acceleration',
    title: 'Trust Score → Faster Deal Close',
    description: 'Shared Trust Score accelerates €2.3M enterprise deal by 6 weeks',
    totalDuration: 25,
    businessValue: 'Deal acceleration: 6 weeks faster, 15% premium pricing',
    steps: [
      {
        id: 'trust-score-share',
        title: 'Trust Score Sharing',
        component: 'trust',
        description: 'Prospect receives interactive Trust Score dashboard link',
        duration: 5,
        autoAdvance: true,
        completed: false,
        data: {
          trustScore: 682,
          tier: 'Sales Accelerator',
          sharedWith: 'TechCorp CISO',
          viewCount: 3
        }
      },
      {
        id: 'instant-verification',
        title: 'Instant Security Verification',
        component: 'trust',
        description: 'Prospect verifies security posture in real-time without questionnaires',
        duration: 10,
        autoAdvance: true,
        completed: false,
        data: {
          frameworks: ['SOC 2 Type II', 'ISO 27001', 'GDPR'],
          lastAudit: '2025-11-15',
          nextReview: '2025-11-15',
          uptime: '99.9%'
        }
      },
      {
        id: 'due-diligence-bypass',
        title: 'Due Diligence Acceleration',
        component: 'clearance',
        description: 'Security review process shortened from 6 weeks to 3 days',
        duration: 8,
        autoAdvance: true,
        completed: false,
        data: {
          traditionalTime: '6 weeks',
          eripTime: '3 days',
          confidence: '98%',
          riskLevel: 'Low'
        }
      },
      {
        id: 'deal-closed',
        title: 'Deal Acceleration Achieved',
        component: 'sales',
        description: '€2.3M deal closed 6 weeks ahead of schedule with premium pricing',
        duration: 2,
        autoAdvance: false,
        completed: false,
        data: {
          dealValue: 2300000,
          timesSaved: '6 weeks',
          premiumPercent: 15,
          trustEquityValue: 345000
        }
      }
    ]
  }
]

export const DayInTheLifeDemo: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState(DEMO_SCENARIOS[0])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying && currentStepIndex >= 0 && currentStepIndex < selectedScenario.steps.length) {
      const currentStep = selectedScenario.steps[currentStepIndex]
      
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / currentStep.duration)
          
          if (newProgress >= 100) {
            // Mark step as completed
            const updatedSteps = [...selectedScenario.steps]
            updatedSteps[currentStepIndex].completed = true
            
            // Auto-advance if enabled
            if (currentStep.autoAdvance && currentStepIndex < selectedScenario.steps.length - 1) {
              setTimeout(() => {
                setCurrentStepIndex(currentStepIndex + 1)
                setProgress(0)
              }, 500)
            } else {
              setIsPlaying(false)
            }
            
            return 100
          }
          
          return newProgress
        })
        
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPlaying, currentStepIndex, selectedScenario])

  const startDemo = () => {
    if (currentStepIndex === -1) {
      setCurrentStepIndex(0)
    }
    setIsPlaying(true)
  }

  const pauseDemo = () => {
    setIsPlaying(false)
  }

  const resetDemo = () => {
    setIsPlaying(false)
    setCurrentStepIndex(-1)
    setProgress(0)
    setTimeElapsed(0)
    // Reset all step completion states
    selectedScenario.steps.forEach(step => step.completed = false)
  }

  const nextStep = () => {
    if (currentStepIndex < selectedScenario.steps.length - 1) {
      selectedScenario.steps[currentStepIndex].completed = true
      setCurrentStepIndex(currentStepIndex + 1)
      setProgress(0)
    }
  }

  const getCurrentStep = () => {
    return currentStepIndex >= 0 ? selectedScenario.steps[currentStepIndex] : null
  }

  const getComponentIcon = (component: string) => {
    switch (component) {
      case 'compass': return <Globe className="h-5 w-5" />
      case 'atlas': return <Shield className="h-5 w-5" />
      case 'prism': return <BarChart3 className="h-5 w-5" />
      case 'clearance': return <Target className="h-5 w-5" />
      case 'beacon': return <TrendingUp className="h-5 w-5" />
      case 'pulse': return <Zap className="h-5 w-5" />
      case 'qie': return <FileText className="h-5 w-5" />
      case 'trust': return <Award className="h-5 w-5" />
      case 'sales': return <DollarSign className="h-5 w-5" />
      default: return <Building2 className="h-5 w-5" />
    }
  }

  const getComponentColor = (component: string) => {
    switch (component) {
      case 'compass': return 'text-blue-600 bg-blue-50'
      case 'atlas': return 'text-green-600 bg-green-50'
      case 'prism': return 'text-purple-600 bg-purple-50'
      case 'clearance': return 'text-orange-600 bg-orange-50'
      case 'beacon': return 'text-red-600 bg-red-50'
      case 'pulse': return 'text-yellow-600 bg-yellow-50'
      case 'qie': return 'text-indigo-600 bg-indigo-50'
      case 'trust': return 'text-pink-600 bg-pink-50'
      case 'sales': return 'text-emerald-600 bg-emerald-50'
      default: return 'text-slate-600 bg-slate-50'
    }
  }

  const currentStep = getCurrentStep()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            "Day in the Life" Demo
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Experience how ERIP transforms compliance from a burden into a competitive advantage. 
            Watch real workflows that accelerate business and reduce risk.
          </p>
        </div>

        {/* Scenario Selection */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Choose Your Demo Scenario</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {DEMO_SCENARIOS.map((scenario) => (
              <Card 
                key={scenario.id}
                className={cn(
                  "cursor-pointer transition-all border-2",
                  selectedScenario.id === scenario.id 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-slate-200 hover:border-slate-300"
                )}
                onClick={() => {
                  setSelectedScenario(scenario)
                  resetDemo()
                }}
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{scenario.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{scenario.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span className="font-medium">{scenario.totalDuration}s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Steps:</span>
                      <span className="font-medium">{scenario.steps.length}</span>
                    </div>
                  </div>
                  <Badge className="mt-3 text-xs" variant="secondary">
                    {scenario.businessValue}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Demo Controls */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedScenario.title}</CardTitle>
                  <CardDescription>{selectedScenario.description}</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={startDemo} 
                    disabled={isPlaying}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {currentStepIndex === -1 ? 'Start Demo' : 'Resume'}
                  </Button>
                  <Button 
                    onClick={pauseDemo} 
                    disabled={!isPlaying}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Pause className="h-4 w-4" />
                    Pause
                  </Button>
                  <Button 
                    onClick={resetDemo}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            {currentStepIndex >= 0 && (
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Step {currentStepIndex + 1} of {selectedScenario.steps.length}</span>
                    <span>{timeElapsed}s elapsed</span>
                  </div>
                  <Progress value={(currentStepIndex / selectedScenario.steps.length) * 100} />
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Demo Workflow */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Steps Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Demo Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedScenario.steps.map((step, index) => (
                      <div 
                        key={step.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg transition-all",
                          index === currentStepIndex ? "bg-blue-50 border border-blue-200" :
                          step.completed ? "bg-green-50 border border-green-200" :
                          "bg-slate-50"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full",
                          getComponentColor(step.component)
                        )}>
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            getComponentIcon(step.component)
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-slate-900">{step.title}</h4>
                          <p className="text-xs text-slate-600">{step.duration}s</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Step Detail */}
            <div className="lg:col-span-2">
              {currentStep ? (
                <Card className="h-fit">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl",
                        getComponentColor(currentStep.component)
                      )}>
                        {getComponentIcon(currentStep.component)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{currentStep.title}</CardTitle>
                        <CardDescription>{currentStep.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>

                      {/* Data Visualization */}
                      {currentStep.data && (
                        <div className="bg-slate-50 p-6 rounded-lg">
                          <h4 className="font-semibold text-slate-900 mb-4">Live Data</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(currentStep.data).map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                </div>
                                <div className="text-xs text-slate-600 capitalize">
                                  {key.replace(/([A-Z])/g, ' €1').trim()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Manual advance button for non-auto steps */}
                      {!currentStep.autoAdvance && progress >= 100 && (
                        <Button 
                          onClick={nextStep}
                          className="w-full flex items-center gap-2"
                        >
                          Next Step <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-fit">
                  <CardContent className="p-12 text-center">
                    <Play className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Ready to Start Demo
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Click "Start Demo" to see how ERIP transforms {selectedScenario.title.toLowerCase()}
                    </p>
                    <Button onClick={startDemo} size="lg">
                      Start Demo
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Business Value Summary */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8">
              <div className="text-center">
                <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Business Value Delivered</h3>
                <p className="text-lg text-green-700 font-semibold">
                  {selectedScenario.businessValue}
                </p>
                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">89%</div>
                    <div className="text-sm text-slate-600">Time Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">2.3x</div>
                    <div className="text-sm text-slate-600">Faster Compliance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">€2.3M</div>
                    <div className="text-sm text-slate-600">Average ROI</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DayInTheLifeDemo