/**
 * Free Trust Score Assessment
 * 
 * Lead generation tool that provides basic compliance check,
 * initial Trust Score, and top recommendations with upgrade prompts
 */

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Star,
  Zap,
  ArrowRight,
  Mail,
  Building2,
  Users,
  Target,
  Award,
  DollarSign,
  Clock,
  Lock,
  Unlock,
  Crown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProgressRing } from '@/components/ui/progress-ring'

interface AssessmentData {
  companyName: string
  email: string
  industry: string
  companySize: string
  currentFrameworks: string[]
  complianceGoals: string[]
  timeline: string
}

interface AssessmentResult {
  trustScore: number
  tier: string
  strengths: string[]
  gaps: string[]
  recommendations: Array<{
    title: string
    description: string
    impact: 'High' | 'Medium' | 'Low'
    effort: 'Easy' | 'Medium' | 'Hard'
    trustPoints: number
    isPremium: boolean
  }>
  industryComparison: {
    percentile: number
    averageScore: number
    topPerformer: number
  }
}

const INDUSTRIES = [
  'Financial Technology',
  'Healthcare & Life Sciences', 
  'Enterprise Software',
  'E-commerce & Retail',
  'Government & Public Sector',
  'Education & Research',
  'Manufacturing & IoT',
  'Energy & Utilities'
]

const COMPANY_SIZES = [
  'Startup (1-50 employees)',
  'Growth (51-200 employees)', 
  'Mid-market (201-1000 employees)',
  'Enterprise (1000+ employees)'
]

const FRAMEWORKS = [
  'SOC 2', 'ISO 27001', 'GDPR', 'HIPAA', 'PCI DSS', 
  'NIST CSF', 'FedRAMP', 'CCPA', 'None yet'
]

const COMPLIANCE_GOALS = [
  'Enterprise sales acceleration',
  'Regulatory compliance preparation', 
  'Security posture improvement',
  'Risk management optimization',
  'Audit preparation',
  'Customer trust building'
]

export const FreeTrustAssessment: React.FC = () => {
  const [step, setStep] = useState(1)
  const [isAssessing, setIsAssessing] = useState(false)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    companyName: '',
    email: '',
    industry: '',
    companySize: '',
    currentFrameworks: [],
    complianceGoals: [],
    timeline: ''
  })
  const [results, setResults] = useState<AssessmentResult | null>(null)

  const runAssessment = async () => {
    setIsAssessing(true)
    
    // Simulate assessment calculation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Calculate Trust Score based on inputs
    let baseScore = 200
    
    // Industry factors
    if (['Financial Technology', 'Healthcare & Life Sciences'].includes(assessmentData.industry)) {
      baseScore += 50
    }
    
    // Framework factors
    const frameworkPoints = assessmentData.currentFrameworks.length * 40
    if (assessmentData.currentFrameworks.includes('None yet')) {
      baseScore += 0
    } else {
      baseScore += frameworkPoints
    }
    
    // Size factors
    if (assessmentData.companySize.includes('Enterprise')) baseScore += 60
    else if (assessmentData.companySize.includes('Mid-market')) baseScore += 40
    else if (assessmentData.companySize.includes('Growth')) baseScore += 20
    
    // Goals complexity
    baseScore += assessmentData.complianceGoals.length * 15
    
    const finalScore = Math.min(baseScore, 650) // Cap free assessment at 650
    
    const getTier = (score: number) => {
      if (score >= 600) return 'Sales Accelerator'
      if (score >= 400) return 'Process Builder'
      return 'Foundation'
    }

    const mockResults: AssessmentResult = {
      trustScore: finalScore,
      tier: getTier(finalScore),
      strengths: [
        'Strong industry reputation',
        'Basic security framework',
        'Clear compliance goals'
      ].slice(0, Math.min(3, Math.floor(finalScore / 150))),
      gaps: [
        'Missing SOC 2 certification',
        'Incomplete security documentation',
        'No penetration testing'
      ],
      recommendations: [
        {
          title: 'Enable Multi-Factor Authentication',
          description: 'Add 2FA to all administrative accounts for immediate security boost',
          impact: 'High',
          effort: 'Easy',
          trustPoints: 25,
          isPremium: false
        },
        {
          title: 'Document Security Policies',
          description: 'Create formal security policies and procedures documentation',
          impact: 'Medium',
          effort: 'Medium',
          trustPoints: 35,
          isPremium: false
        },
        {
          title: 'SOC 2 Readiness Assessment',
          description: 'Full SOC 2 gap analysis and implementation roadmap',
          impact: 'High',
          effort: 'Hard',
          trustPoints: 120,
          isPremium: true
        }
      ],
      industryComparison: {
        percentile: Math.min(90, Math.floor((finalScore / 800) * 100)),
        averageScore: 485,
        topPerformer: 742
      }
    }

    setResults(mockResults)
    setIsAssessing(false)
    setStep(4)
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      runAssessment()
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return assessmentData.companyName && assessmentData.email && 
               assessmentData.industry && assessmentData.companySize
      case 2:
        return assessmentData.currentFrameworks.length > 0
      case 3:
        return assessmentData.complianceGoals.length > 0 && assessmentData.timeline
      default:
        return false
    }
  }

  const progress = (step / 4) * 100

  if (results) {
    return <AssessmentResults results={results} companyName={assessmentData.companyName} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">Free Trust Score Assessment</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get your organization's Trust Score in 3 minutes. Discover your compliance strengths, 
            identify gaps, and receive personalized recommendations to accelerate growth.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="h-5 w-5" />
              <span>3 Minutes</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Target className="h-5 w-5" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Assessment Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {step === 1 && "Tell us about your company"}
                {step === 2 && "Current compliance status"}
                {step === 3 && "Your goals and timeline"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Basic information to personalize your assessment"}
                {step === 2 && "What frameworks do you currently have in place?"}
                {step === 3 && "What are you trying to achieve?"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        value={assessmentData.companyName}
                        onChange={(e) => setAssessmentData(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Enter your company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Work Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={assessmentData.email}
                        onChange={(e) => setAssessmentData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your work email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Industry *</Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {INDUSTRIES.map((industry) => (
                        <div
                          key={industry}
                          onClick={() => setAssessmentData(prev => ({ ...prev, industry }))}
                          className={cn(
                            "p-3 border rounded-lg cursor-pointer text-center transition-all",
                            assessmentData.industry === industry
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <span className="text-sm font-medium">{industry}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Company Size *</Label>
                    <div className="grid gap-3 mt-3">
                      {COMPANY_SIZES.map((size) => (
                        <div
                          key={size}
                          onClick={() => setAssessmentData(prev => ({ ...prev, companySize: size }))}
                          className={cn(
                            "p-4 border rounded-lg cursor-pointer transition-all",
                            assessmentData.companySize === size
                              ? "border-blue-500 bg-blue-50"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <span className="font-medium">{size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label>Current Compliance Frameworks (select all that apply)</Label>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {FRAMEWORKS.map((framework) => {
                        const isSelected = assessmentData.currentFrameworks.includes(framework)
                        return (
                          <div
                            key={framework}
                            onClick={() => {
                              if (framework === 'None yet') {
                                setAssessmentData(prev => ({ ...prev, currentFrameworks: ['None yet'] }))
                              } else {
                                setAssessmentData(prev => ({
                                  ...prev,
                                  currentFrameworks: isSelected
                                    ? prev.currentFrameworks.filter(f => f !== framework && f !== 'None yet')
                                    : [...prev.currentFrameworks.filter(f => f !== 'None yet'), framework]
                                }))
                              }
                            }}
                            className={cn(
                              "p-3 border rounded-lg cursor-pointer text-center transition-all",
                              isSelected
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-slate-200 hover:border-slate-300"
                            )}
                          >
                            <span className="text-sm font-medium">{framework}</span>
                            {isSelected && <CheckCircle className="h-4 w-4 mx-auto mt-1" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Quick Tip</h4>
                    <p className="text-sm text-blue-800">
                      Don't worry if you don't have formal certifications yet. 
                      We'll show you the fastest path to build Trust Equity™.
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label>What are your main compliance goals? (select all that apply)</Label>
                    <div className="grid gap-3 mt-3">
                      {COMPLIANCE_GOALS.map((goal) => {
                        const isSelected = assessmentData.complianceGoals.includes(goal)
                        return (
                          <div
                            key={goal}
                            onClick={() => {
                              setAssessmentData(prev => ({
                                ...prev,
                                complianceGoals: isSelected
                                  ? prev.complianceGoals.filter(g => g !== goal)
                                  : [...prev.complianceGoals, goal]
                              }))
                            }}
                            className={cn(
                              "p-4 border rounded-lg cursor-pointer transition-all flex items-center gap-3",
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300"
                            )}
                          >
                            {isSelected && <CheckCircle className="h-5 w-5 text-blue-600" />}
                            <span className="font-medium">{goal}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <Label>What's your timeline for achieving these goals?</Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {['1-3 months', '3-6 months', '6-12 months', '12+ months'].map((timeline) => (
                        <div
                          key={timeline}
                          onClick={() => setAssessmentData(prev => ({ ...prev, timeline }))}
                          className={cn(
                            "p-3 border rounded-lg cursor-pointer text-center transition-all",
                            assessmentData.timeline === timeline
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <span className="font-medium">{timeline}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid() || isAssessing}
                  className="flex items-center gap-2"
                >
                  {isAssessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Calculating...
                    </>
                  ) : step === 3 ? (
                    <>Get My Trust Score <ArrowRight className="h-4 w-4" /></>
                  ) : (
                    <>Next <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const AssessmentResults: React.FC<{ results: AssessmentResult, companyName: string }> = ({ 
  results, 
  companyName 
}) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Sales Accelerator': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'Process Builder': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-orange-600 bg-orange-50 border-orange-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Award className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {companyName}'s Trust Score
          </h1>
          <p className="text-xl text-slate-600">
            Your personalized Trust Equity™ assessment results
          </p>
        </div>

        {/* Trust Score Display */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-slate-50">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <ProgressRing
                    progress={(results.trustScore / 800) * 100}
                    size={180}
                    strokeWidth={12}
                    color="blue"
                    showValue={false}
                  />
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-slate-900">{results.trustScore}</div>
                    <Badge className={cn("mt-2", getTierColor(results.tier))}>
                      {results.tier} Tier
                    </Badge>
                  </div>
                </div>

                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Great Start! 🎉</h3>
                  <p className="text-slate-600 mb-4">
                    You're in the {results.tier} tier, which puts you in the{' '}
                    <span className="font-bold text-blue-600">{results.industryComparison.percentile}th percentile</span>{' '}
                    of companies in your industry.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Industry Average:</span>
                      <span className="font-medium">{results.industryComparison.averageScore}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Top Performer:</span>
                      <span className="font-medium">{results.industryComparison.topPerformer}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Quick Wins Available:</h4>
                  <div className="space-y-2">
                    {results.recommendations.filter(r => !r.isPremium).map((rec, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span>+{rec.trustPoints} points</span>
                        <span className="text-slate-600">{rec.title}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" size="lg">
                    <Crown className="h-4 w-4 mr-2" />
                    Unlock Full Assessment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.gaps.map((gap, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Personalized Recommendations</CardTitle>
              <CardDescription>
                Top actions to improve your Trust Score and accelerate growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4 relative">
                    {rec.isPremium && (
                      <Badge className="absolute top-2 right-2 bg-purple-100 text-purple-800">
                        <Lock className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-900">{rec.title}</h4>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          +{rec.trustPoints} Trust Points
                        </div>
                        <div className="text-xs text-slate-500">
                          {rec.effort} effort • {rec.impact} impact
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm">{rec.description}</p>
                    {rec.isPremium && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg text-center">
                        <p className="text-sm text-purple-800 mb-2">
                          Unlock detailed implementation guide and expert support
                        </p>
                        <Button size="sm" variant="outline">
                          <Unlock className="h-4 w-4 mr-2" />
                          Upgrade to Premium
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Build Trust Equity™?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join 500+ organizations using ERIP to transform compliance from a cost center 
                into a competitive advantage. Start your free trial today.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">€2.3M</div>
                  <div className="text-sm text-blue-100">Average Annual ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">89%</div>
                  <div className="text-sm text-blue-100">Time Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">40%</div>
                  <div className="text-sm text-blue-100">Faster Deal Closure</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Star className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book a Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default FreeTrustAssessment