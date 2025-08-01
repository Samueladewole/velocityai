/**
 * Interactive Sandbox Environment
 * 
 * Hands-on demo environment where prospects can try ERIP features:
 * - Pre-loaded sample data and scenarios
 * - Interactive component exploration
 * - Guided tutorials and feature highlights
 * - No-setup trial experience
 * - Lead capture and conversion flows
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Award,
  Zap,
  Trophy,
  Eye,
  Brain,
  Shield,
  BarChart3,
  Activity,
  Users,
  FileText,
  Network,
  Globe,
  Calculator,
  TrendingUp,
  Clock,
  Star,
  Coffee,
  Rocket,
  HeartHandshake,
  Building2,
  DollarSign,
  AlertTriangle,
  Book,
  PlayCircle,
  Sparkles,
  MousePointer,
  Hand,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface SandboxStep {
  id: string
  title: string
  description: string
  component: string
  duration: number
  completed: boolean
  interactive: boolean
  highlights: string[]
}

interface SandboxScenario {
  id: string
  title: string
  description: string
  industry: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  steps: SandboxStep[]
  outcomes: string[]
}

interface UserProgress {
  currentScenario: string | null
  currentStep: number
  completedScenarios: string[]
  timeSpent: number
  engagementScore: number
}

const SANDBOX_SCENARIOS: SandboxScenario[] = [
  {
    id: 'soc2-starter',
    title: 'SOC 2 Compliance Fast Track',
    description: 'Experience how ERIP accelerates SOC 2 Type II certification from 12 months to 3 months',
    industry: 'SaaS/Technology',
    difficulty: 'beginner',
    duration: '8 minutes',
    steps: [
      {
        id: 'compass-discovery',
        title: 'COMPASS: Regulatory Discovery',
        description: 'Watch COMPASS automatically identify SOC 2 requirements for your industry',
        component: 'compass',
        duration: 60,
        completed: false,
        interactive: true,
        highlights: ['Real-time regulatory mapping', 'Industry-specific requirements', 'Gap analysis automation']
      },
      {
        id: 'atlas-security-scan',
        title: 'ATLAS: Security Assessment',
        description: 'See ATLAS scan your infrastructure and identify security gaps',
        component: 'atlas',
        duration: 90,
        completed: false,
        interactive: true,
        highlights: ['Multi-cloud scanning', 'Vulnerability prioritization', 'Control mapping']
      },
      {
        id: 'prism-risk-analysis',
        title: 'PRISM: Risk Quantification',
        description: 'Use PRISM to quantify the financial impact of compliance gaps',
        component: 'prism',
        duration: 120,
        completed: false,
        interactive: true,
        highlights: ['Monte Carlo simulation', 'Financial impact modeling', 'Risk scenarios']
      },
      {
        id: 'clearance-decisions',
        title: 'CLEARANCE: Risk Decisions',
        description: 'Experience automated risk decision workflows',
        component: 'clearance',
        duration: 45,
        completed: false,
        interactive: false,
        highlights: ['Automated approvals', 'Risk appetite alignment', 'Decision tracking']
      },
      {
        id: 'results-summary',
        title: 'Trust Score & ROI Results',
        description: 'See your new Trust Score and projected compliance timeline',
        component: 'results',
        duration: 30,
        completed: false,
        interactive: false,
        highlights: ['Trust Score improvement', 'Timeline acceleration', 'Cost savings']
      }
    ],
    outcomes: [
      'Trust Score improved from 420 to 650 (+230 points)',
      'Compliance timeline reduced from 12 to 3 months',
      'Projected cost savings: €180,000',
      'Ready for SOC 2 audit in Q2 2025'
    ]
  },
  {
    id: 'gdpr-healthcare',
    title: 'GDPR for Healthcare Organizations',
    description: 'Navigate complex GDPR requirements specific to healthcare and medical devices',
    industry: 'Healthcare',
    difficulty: 'intermediate',
    duration: '12 minutes',
    steps: [
      {
        id: 'compass-gdpr-mapping',
        title: 'COMPASS: GDPR Regulatory Mapping',
        description: 'Discover GDPR requirements specific to healthcare data processing',
        component: 'compass',
        duration: 90,
        completed: false,
        interactive: true,
        highlights: ['Healthcare-specific GDPR articles', 'Medical device regulations', 'Cross-border data flows']
      },
      {
        id: 'atlas-privacy-assessment',
        title: 'ATLAS: Privacy Impact Assessment',
        description: 'Automated DPIA generation for healthcare processing activities',
        component: 'atlas',
        duration: 120,
        completed: false,
        interactive: true,
        highlights: ['Automated DPIA', 'Data flow mapping', 'Consent management']
      },
      {
        id: 'cipher-policy-automation',
        title: 'CIPHER: Privacy Policy Automation',
        description: 'Transform GDPR requirements into automated privacy controls',
        component: 'cipher',
        duration: 90,
        completed: false,
        interactive: true,
        highlights: ['Policy-as-code', 'Automated enforcement', 'Breach detection']
      },
      {
        id: 'pulse-monitoring',
        title: 'PULSE: Continuous Privacy Monitoring',
        description: 'Real-time monitoring of data processing activities',
        component: 'pulse',
        duration: 60,
        completed: false,
        interactive: false,
        highlights: ['Data processing alerts', 'Consent tracking', 'Breach notification']
      }
    ],
    outcomes: [
      'Complete GDPR compliance framework established',
      'Automated privacy impact assessments',
      '72-hour breach notification system active',
      'Trust Score: 720 (Market Leader tier)'
    ]
  },
  {
    id: 'fintech-comprehensive',
    title: 'FinTech Multi-Framework Compliance',
    description: 'Handle PCI DSS, SOX, and banking regulations simultaneously',
    industry: 'Financial Services',
    difficulty: 'advanced',
    duration: '15 minutes',
    steps: [
      {
        id: 'compass-multi-framework',
        title: 'COMPASS: Multi-Framework Analysis',
        description: 'See how COMPASS handles overlapping financial regulations',
        component: 'compass',
        duration: 120,
        completed: false,
        interactive: true,
        highlights: ['Framework correlation', 'Regulatory conflicts', 'Unified compliance']
      },
      {
        id: 'atlas-payment-security',
        title: 'ATLAS: Payment Security Assessment',
        description: 'PCI DSS-specific security scanning and validation',
        component: 'atlas',
        duration: 150,
        completed: false,
        interactive: true,
        highlights: ['PCI DSS validation', 'Payment flow security', 'Card data protection']
      },
      {
        id: 'prism-financial-risk',
        title: 'PRISM: Financial Risk Modeling',
        description: 'Quantify operational and compliance risks in financial terms',
        component: 'prism',
        duration: 180,
        completed: false,
        interactive: true,
        highlights: ['Operational risk VaR', 'Compliance cost modeling', 'Regulatory capital']
      },
      {
        id: 'nexus-threat-intelligence',
        title: 'NEXUS: Financial Threat Intelligence',
        description: 'Monitor financial sector-specific threats and indicators',
        component: 'nexus',
        duration: 90,
        completed: false,
        interactive: false,
        highlights: ['FinTech threat feeds', 'APT monitoring', 'Fraud detection']
      },
      {
        id: 'beacon-executive-reporting',
        title: 'BEACON: Board-Ready Reports',
        description: 'Generate executive dashboards for regulatory reporting',
        component: 'beacon',
        duration: 60,
        completed: false,
        interactive: false,
        highlights: ['Regulatory reporting', 'Board dashboards', 'KRI tracking']
      }
    ],
    outcomes: [
      'Unified compliance across PCI DSS, SOX, and banking regs',
      'Real-time regulatory capital calculations',
      'Automated board reporting and KRI tracking',
      'Trust Score: 785 (Top 5% of financial services)'
    ]
  }
]

const COMPONENT_HIGHLIGHTS = {
  compass: {
    icon: Globe,
    color: 'from-blue-500 to-indigo-600',
    features: ['Auto-regulatory discovery', 'Gap analysis', 'Framework mapping']
  },
  atlas: {
    icon: Shield,
    color: 'from-slate-600 to-blue-700',
    features: ['Multi-cloud scanning', 'Vulnerability assessment', 'Control validation']
  },
  prism: {
    icon: Calculator,
    color: 'from-emerald-500 to-teal-600',
    features: ['Risk quantification', 'Monte Carlo modeling', 'Financial impact']
  },
  clearance: {
    icon: Target,
    color: 'from-purple-500 to-indigo-600',
    features: ['Decision automation', 'Risk appetite', 'Workflow routing']
  },
  pulse: {
    icon: Activity,
    color: 'from-blue-500 to-cyan-600',
    features: ['Real-time monitoring', 'Alert correlation', 'Anomaly detection']
  },
  cipher: {
    icon: FileText,
    color: 'from-indigo-500 to-purple-600',
    features: ['Policy automation', 'Control enforcement', 'Compliance tracking']
  },
  nexus: {
    icon: Network,
    color: 'from-cyan-500 to-blue-600',
    features: ['Threat intelligence', 'IOC correlation', 'Proactive hunting']
  },
  beacon: {
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-600',
    features: ['Value tracking', 'ROI calculation', 'Executive reporting']
  }
}

export const InteractiveSandbox: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<SandboxScenario>(SANDBOX_SCENARIOS[0])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    currentScenario: null,
    currentStep: 0,
    completedScenarios: [],
    timeSpent: 0,
    engagementScore: 0
  })
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    company: '',
    title: ''
  })
  const [tutorialActive, setTutorialActive] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying && currentStep < selectedScenario.steps.length) {
      const currentStepData = selectedScenario.steps[currentStep]
      
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / currentStepData.duration)
          
          if (newProgress >= 100) {
            // Mark step as completed
            const updatedSteps = [...selectedScenario.steps]
            updatedSteps[currentStep].completed = true
            
            // Auto-advance to next step
            if (currentStep < selectedScenario.steps.length - 1) {
              setTimeout(() => {
                setCurrentStep(currentStep + 1)
                setProgress(0)
              }, 500)
            } else {
              // Scenario completed
              setIsPlaying(false)
              setUserProgress(prev => ({
                ...prev,
                completedScenarios: [...prev.completedScenarios, selectedScenario.id],
                engagementScore: prev.engagementScore + 10
              }))
              setShowLeadCapture(true)
            }
            
            return 100
          }
          
          return newProgress
        })
        
        setUserProgress(prev => ({ ...prev, timeSpent: prev.timeSpent + 1 }))
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isPlaying, currentStep, selectedScenario])

  const startScenario = (scenario: SandboxScenario) => {
    setSelectedScenario(scenario)
    setCurrentStep(0)
    setProgress(0)
    setIsPlaying(true)
    setUserProgress(prev => ({
      ...prev,
      currentScenario: scenario.id,
      currentStep: 0
    }))
  }

  const resetScenario = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setProgress(0)
    selectedScenario.steps.forEach(step => step.completed = false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200'
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'advanced': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getComponentHighlight = (componentId: string) => {
    return COMPONENT_HIGHLIGHTS[componentId] || COMPONENT_HIGHLIGHTS.compass
  }

  const handleLeadSubmit = () => {
    // Simulate lead capture
    toast({
      title: 'Thank you for trying ERIP!',
      description: "We'll send you a personalized demo and pricing information within 24 hours."
    })
    setShowLeadCapture(false)
    
    // In real implementation, send lead data to CRM/marketing automation
    console.log('Lead captured:', leadForm)
  }

  const currentStepData = selectedScenario.steps[currentStep]
  const currentHighlight = currentStepData ? getComponentHighlight(currentStepData.component) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <PlayCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Interactive Sandbox</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Experience ERIP's power with hands-on scenarios. Try real features with sample data, 
            no setup required.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-blue-600">
              <CheckCircle className="h-5 w-5" />
              <span>No Registration Required</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <Clock className="h-5 w-5" />
              <span>5-15 Minutes Each</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Sparkles className="h-5 w-5" />
              <span>Interactive Experience</span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        {userProgress.currentScenario && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-blue-900">Your Progress</h3>
                    <p className="text-blue-700">Step {currentStep + 1} of {selectedScenario.steps.length}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">{userProgress.engagementScore}</div>
                    <div className="text-sm text-blue-700">Engagement Score</div>
                  </div>
                </div>
                <Progress 
                  value={((currentStep + (progress / 100)) / selectedScenario.steps.length) * 100} 
                  className="h-3" 
                />
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="scenarios" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scenarios">Choose Scenario</TabsTrigger>
            <TabsTrigger value="playground">Interactive Demo</TabsTrigger>
            <TabsTrigger value="results">Your Results</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Demo Scenario</h2>
              <p className="text-slate-600">
                Each scenario demonstrates different ERIP capabilities tailored to specific industries and use cases
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {SANDBOX_SCENARIOS.map((scenario) => (
                <Card 
                  key={scenario.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg",
                    selectedScenario.id === scenario.id ? "border-2 border-blue-500 bg-blue-50" : ""
                  )}
                  onClick={() => setSelectedScenario(scenario)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={cn("text-xs border", getDifficultyColor(scenario.difficulty))}>
                        {scenario.difficulty}
                      </Badge>
                      <span className="text-sm text-slate-500">{scenario.duration}</span>
                    </div>
                    <CardTitle className="text-lg">{scenario.title}</CardTitle>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-slate-700 mb-2">Industry Focus</div>
                        <Badge variant="outline">{scenario.industry}</Badge>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-slate-700 mb-2">What You'll Experience</div>
                        <div className="text-sm text-slate-600">
                          {scenario.steps.length} interactive steps across {new Set(scenario.steps.map(s => s.component)).size} components
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-slate-700 mb-2">Expected Outcomes</div>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {scenario.outcomes.slice(0, 2).map((outcome, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        className="w-full mt-4"
                        onClick={(e) => {
                          e.stopPropagation()
                          startScenario(scenario)
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playground" className="space-y-6">
            {!userProgress.currentScenario ? (
              <Card className="text-center py-12">
                <CardContent>
                  <PlayCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Choose a Scenario to Begin
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Select a demo scenario from the previous tab to start your interactive experience
                  </p>
                  <Button onClick={() => document.querySelector('[value="scenarios"]')?.click()}>
                    Choose Scenario
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Demo Controls */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{selectedScenario.title}</CardTitle>
                        <CardDescription>{selectedScenario.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button 
                          onClick={() => setIsPlaying(!isPlaying)} 
                          disabled={currentStep >= selectedScenario.steps.length}
                        >
                          {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                          {isPlaying ? 'Pause' : 'Play'}
                        </Button>
                        <Button variant="outline" onClick={resetScenario}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Step {currentStep + 1} of {selectedScenario.steps.length}</span>
                        <span>{Math.round(((currentStep + (progress / 100)) / selectedScenario.steps.length) * 100)}% Complete</span>
                      </div>
                      <Progress value={((currentStep + (progress / 100)) / selectedScenario.steps.length) * 100} />
                    </div>
                  </CardContent>
                </Card>

                {/* Current Step Display */}
                {currentStepData && currentHighlight && (
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Step Content */}
                    <div className="lg:col-span-2">
                      <Card className="h-fit">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br",
                              currentHighlight.color
                            )}>
                              <currentHighlight.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                              <CardDescription>{currentStepData.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {/* Step Progress */}
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Step Progress</span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} />
                            </div>

                            {/* Interactive Elements */}
                            {currentStepData.interactive && (
                              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-3 mb-4">
                                  <MousePointer className="h-5 w-5 text-blue-600" />
                                  <h4 className="font-semibold text-blue-900">Try It Yourself</h4>
                                </div>
                                <div className="space-y-3">
                                  {currentStepData.highlights.map((highlight, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                      <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                                        <Hand className="h-4 w-4 mr-2" />
                                        {highlight}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Feature Highlights */}
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-3">Key Features in Action</h4>
                              <div className="grid gap-3">
                                {currentStepData.highlights.map((highlight, index) => (
                                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <Zap className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm">{highlight}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Component Info Sidebar */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Component Focus
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className={cn(
                            "inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br mb-3",
                            currentHighlight.color
                          )}>
                            <currentHighlight.icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="font-semibold text-slate-900">{currentStepData.component.toUpperCase()}</h3>
                        </div>

                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Core Capabilities</h4>
                          <div className="space-y-2">
                            {currentHighlight.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button variant="outline" className="w-full">
                          <Book className="h-4 w-4 mr-2" />
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Completed Steps Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Demo Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedScenario.steps.map((step, index) => (
                        <div 
                          key={step.id}
                          className={cn(
                            "flex items-center gap-4 p-3 rounded-lg transition-all",
                            index === currentStep ? "bg-blue-50 border border-blue-200" :
                            step.completed ? "bg-green-50 border border-green-200" :
                            "bg-slate-50"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                            step.completed ? "bg-green-100 text-green-700" :
                            index === currentStep ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-500"
                          )}>
                            {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{step.title}</h4>
                            <p className="text-sm text-slate-600">{step.description}</p>
                          </div>
                          {step.interactive && (
                            <Badge variant="outline" className="text-xs">
                              Interactive
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Demo Results</h2>
              <p className="text-slate-600">
                See what you've accomplished and the business value you could achieve with ERIP
              </p>
            </div>

            {userProgress.completedScenarios.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Award className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Complete a Scenario to See Results
                  </h3>
                  <p className="text-slate-600">
                    Your demo results and potential ROI will appear here after completing scenarios
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Achievement Summary */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-slate-900">{userProgress.completedScenarios.length}</div>
                      <div className="text-sm text-slate-600">Scenarios Completed</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Clock className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-slate-900">{Math.round(userProgress.timeSpent / 60)}</div>
                      <div className="text-sm text-slate-600">Minutes Engaged</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Star className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-slate-900">{userProgress.engagementScore}</div>
                      <div className="text-sm text-slate-600">Engagement Score</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Potential ROI */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Your Potential ROI with ERIP
                    </CardTitle>
                    <CardDescription>
                      Based on the scenarios you completed, here's what you could achieve
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900">Time Savings</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Compliance Timeline Reduction:</span>
                            <span className="font-medium text-green-600">75% faster</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Manual Process Automation:</span>
                            <span className="font-medium text-green-600">80% reduction</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Risk Assessment Speed:</span>
                            <span className="font-medium text-green-600">10x faster</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900">Cost Savings</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Annual Compliance Costs:</span>
                            <span className="font-medium text-green-600">€180K saved</span>
                          </div>
                          <div className="flex justify-between">
                            <span>External Consultant Fees:</span>
                            <span className="font-medium text-green-600">€120K saved</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Penalty Avoidance:</span>
                            <span className="font-medium text-green-600">€500K protected</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Call to Action */}
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardContent className="p-8 text-center">
                    <Rocket className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Ready to Transform Your Compliance?</h3>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                      You've seen what ERIP can do. Let's discuss how we can help your organization 
                      achieve these results in real life.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        size="lg" 
                        className="bg-white text-blue-600 hover:bg-blue-50"
                        onClick={() => setShowLeadCapture(true)}
                      >
                        <Calendar className="h-5 w-5 mr-2" />
                        Schedule Demo
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-white text-white hover:bg-white hover:text-blue-600"
                      >
                        <Mail className="h-5 w-5 mr-2" />
                        Get Pricing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Lead Capture Modal */}
        {showLeadCapture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>🎉 Great demo experience!</CardTitle>
                <CardDescription>
                  Let's continue the conversation. We'll send you personalized results and next steps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={leadForm.title}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Your role"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Work Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={leadForm.company}
                    onChange={(e) => setLeadForm(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Your company name"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleLeadSubmit}
                    disabled={!leadForm.name || !leadForm.email || !leadForm.company}
                    className="flex-1"
                  >
                    Get My Personalized Results
                  </Button>
                  <Button variant="outline" onClick={() => setShowLeadCapture(false)}>
                    Skip
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default InteractiveSandbox