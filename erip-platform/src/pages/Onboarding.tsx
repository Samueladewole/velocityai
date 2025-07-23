/**
 * ERIP Onboarding Flow
 * Complete user journey from company setup to baseline Trust Score
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Globe,
  Users,
  DollarSign,
  Award,
  Target,
  Zap,
  Heart
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
  completed: boolean
}

interface CompanyProfile {
  name: string
  industry: string[]
  size: string
  revenue: string
  regions: string[]
  description: string
}

interface FrameworkSelection {
  primary: string[]
  secondary: string[]
  customRequirements: string[]
}

interface AssessmentWizard {
  currentFrameworks: string[]
  securityTools: string[]
  complianceStatus: Record<string, string>
  riskTolerance: string
}

const INDUSTRIES = [
  { id: 'fintech', name: 'Financial Technology', icon: DollarSign },
  { id: 'healthcare', name: 'Healthcare & Life Sciences', icon: Heart },
  { id: 'enterprise', name: 'Enterprise Software', icon: Building2 },
  { id: 'ecommerce', name: 'E-commerce & Retail', icon: Globe },
  { id: 'government', name: 'Government & Public Sector', icon: Shield },
  { id: 'education', name: 'Education & Research', icon: Users },
  { id: 'manufacturing', name: 'Manufacturing & IoT', icon: Target },
  { id: 'energy', name: 'Energy & Utilities', icon: Zap }
]

const FRAMEWORKS = [
  { id: 'soc2', name: 'SOC 2', category: 'Security', complexity: 'Medium' },
  { id: 'iso27001', name: 'ISO 27001', category: 'Security', complexity: 'High' },
  { id: 'gdpr', name: 'GDPR', category: 'Privacy', complexity: 'High' },
  { id: 'hipaa', name: 'HIPAA', category: 'Healthcare', complexity: 'Medium' },
  { id: 'pci', name: 'PCI DSS', category: 'Payments', complexity: 'Medium' },
  { id: 'nist', name: 'NIST CSF', category: 'Security', complexity: 'High' },
  { id: 'fedramp', name: 'FedRAMP', category: 'Government', complexity: 'Very High' },
  { id: 'ccpa', name: 'CCPA', category: 'Privacy', complexity: 'Medium' }
]

const COMPANY_SIZES = [
  { id: 'startup', name: 'Startup (1-50 employees)', trustFactors: ['Agility', 'Innovation'] },
  { id: 'growth', name: 'Growth (51-200 employees)', trustFactors: ['Scalability', 'Process'] },
  { id: 'midmarket', name: 'Mid-market (201-1000 employees)', trustFactors: ['Compliance', 'Security'] },
  { id: 'enterprise', name: 'Enterprise (1000+ employees)', trustFactors: ['Governance', 'Risk Management'] }
]

export const Onboarding: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: '',
    industry: [],
    size: '',
    revenue: '',
    regions: [],
    description: ''
  })
  const [frameworkSelection, setFrameworkSelection] = useState<FrameworkSelection>({
    primary: [],
    secondary: [],
    customRequirements: []
  })
  const [assessmentWizard, setAssessmentWizard] = useState<AssessmentWizard>({
    currentFrameworks: [],
    securityTools: [],
    complianceStatus: {},
    riskTolerance: ''
  })
  const [isGeneratingBaseline, setIsGeneratingBaseline] = useState(false)
  const [baselineTrustScore, setBaselineTrustScore] = useState<number | null>(null)

  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Company Profile',
      description: 'Tell us about your organization',
      component: CompanyProfileStep,
      completed: companyProfile.name !== '' && companyProfile.industry.length > 0
    },
    {
      id: 'frameworks',
      title: 'Framework Selection',
      description: 'Choose your compliance frameworks',
      component: FrameworkSelectionStep,
      completed: frameworkSelection.primary.length > 0
    },
    {
      id: 'assessment',
      title: 'Initial Assessment',
      description: 'Quick assessment of your current state',
      component: AssessmentWizardStep,
      completed: assessmentWizard.riskTolerance !== ''
    },
    {
      id: 'baseline',
      title: 'Baseline Trust Score',
      description: 'Generate your starting Trust Score',
      component: BaselineTrustScoreStep,
      completed: baselineTrustScore !== null
    }
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      navigate('/dashboard', { 
        state: { 
          onboardingCompleted: true,
          baselineTrustScore,
          companyProfile,
          frameworkSelection 
        }
      })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generateBaselineTrustScore = async () => {
    setIsGeneratingBaseline(true)
    
    // Simulate trust score calculation based on inputs
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Calculate baseline score
    let score = 200 // Base score
    
    // Industry factors
    if (companyProfile.industry.includes('fintech') || companyProfile.industry.includes('healthcare')) {
      score += 50 // Higher trust requirements
    }
    
    // Framework factors
    score += frameworkSelection.primary.length * 25
    score += frameworkSelection.secondary.length * 10
    
    // Size factors
    if (companyProfile.size === 'enterprise') score += 75
    else if (companyProfile.size === 'midmarket') score += 50
    else if (companyProfile.size === 'growth') score += 25
    
    // Risk tolerance factors
    if (assessmentWizard.riskTolerance === 'low') score += 50
    else if (assessmentWizard.riskTolerance === 'medium') score += 25
    
    setBaselineTrustScore(Math.min(score, 800)) // Cap at 800 for baseline
    setIsGeneratingBaseline(false)
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome to ERIP</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Let's get you set up with the Trust Intelligence Platform. 
            This will take about 5 minutes and help us create your personalized Trust Equity™ experience.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-slate-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  index <= currentStep 
                    ? "bg-blue-600 text-white" 
                    : "bg-slate-200 text-slate-500"
                )}>
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs text-slate-600 mt-1 text-center max-w-20">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-900">
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription className="text-lg">
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <CurrentStepComponent
                companyProfile={companyProfile}
                setCompanyProfile={setCompanyProfile}
                frameworkSelection={frameworkSelection}
                setFrameworkSelection={setFrameworkSelection}
                assessmentWizard={assessmentWizard}
                setAssessmentWizard={setAssessmentWizard}
                baselineTrustScore={baselineTrustScore}
                isGeneratingBaseline={isGeneratingBaseline}
                onGenerateBaseline={generateBaselineTrustScore}
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!steps[currentStep].completed}
              className="flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step Components
const CompanyProfileStep: React.FC<any> = ({ companyProfile, setCompanyProfile }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="company-name" className="text-base font-medium">Company Name *</Label>
          <Input
            id="company-name"
            value={companyProfile.name}
            onChange={(e) => setCompanyProfile(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your company name"
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-base font-medium">Industry *</Label>
          <p className="text-sm text-slate-600 mb-3">Select all that apply to your business</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {INDUSTRIES.map((industry) => {
              const Icon = industry.icon
              const isSelected = companyProfile.industry.includes(industry.id)
              return (
                <div
                  key={industry.id}
                  onClick={() => {
                    setCompanyProfile(prev => ({
                      ...prev,
                      industry: isSelected
                        ? prev.industry.filter(i => i !== industry.id)
                        : [...prev.industry, industry.id]
                    }))
                  }}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all text-center",
                    isSelected 
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{industry.name}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Company Size *</Label>
          <div className="grid gap-3 mt-3">
            {COMPANY_SIZES.map((size) => (
              <div
                key={size.id}
                onClick={() => setCompanyProfile(prev => ({ ...prev, size: size.id }))}
                className={cn(
                  "p-4 border rounded-lg cursor-pointer transition-all",
                  companyProfile.size === size.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-900">{size.name}</h3>
                    <div className="flex gap-2 mt-2">
                      {size.trustFactors.map(factor => (
                        <Badge key={factor} variant="secondary" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {companyProfile.size === size.id && (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const FrameworkSelectionStep: React.FC<any> = ({ frameworkSelection, setFrameworkSelection }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Primary Frameworks</h3>
        <p className="text-slate-600 mb-4">
          Select the compliance frameworks that are critical for your business
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FRAMEWORKS.map((framework) => {
            const isSelected = frameworkSelection.primary.includes(framework.id)
            return (
              <div
                key={framework.id}
                onClick={() => {
                  setFrameworkSelection(prev => ({
                    ...prev,
                    primary: isSelected
                      ? prev.primary.filter(f => f !== framework.id)
                      : [...prev.primary, framework.id]
                  }))
                }}
                className={cn(
                  "p-4 border rounded-lg cursor-pointer transition-all",
                  isSelected 
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-slate-900">{framework.name}</h4>
                    <p className="text-sm text-slate-600">{framework.category}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {framework.complexity}
                    </Badge>
                  </div>
                  {isSelected && <CheckCircle className="h-5 w-5 text-blue-600" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Secondary Frameworks</h3>
        <p className="text-slate-600 mb-4">
          Optional frameworks you may need in the future
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FRAMEWORKS.filter(f => !frameworkSelection.primary.includes(f.id)).map((framework) => {
            const isSelected = frameworkSelection.secondary.includes(framework.id)
            return (
              <div
                key={framework.id}
                onClick={() => {
                  setFrameworkSelection(prev => ({
                    ...prev,
                    secondary: isSelected
                      ? prev.secondary.filter(f => f !== framework.id)
                      : [...prev.secondary, framework.id]
                  }))
                }}
                className={cn(
                  "p-3 border rounded-lg cursor-pointer transition-all text-center",
                  isSelected 
                    ? "border-green-500 bg-green-50"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <h4 className="font-medium text-sm">{framework.name}</h4>
                <p className="text-xs text-slate-600">{framework.category}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const AssessmentWizardStep: React.FC<any> = ({ assessmentWizard, setAssessmentWizard }) => {
  const riskToleranceLevels = [
    { id: 'low', name: 'Conservative', description: 'Minimal risk tolerance, maximum security' },
    { id: 'medium', name: 'Balanced', description: 'Balanced approach to risk and innovation' },
    { id: 'high', name: 'Aggressive', description: 'Higher risk tolerance, faster growth' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Risk Tolerance *</h3>
        <div className="grid gap-3">
          {riskToleranceLevels.map((level) => (
            <div
              key={level.id}
              onClick={() => setAssessmentWizard(prev => ({ ...prev, riskTolerance: level.id }))}
              className={cn(
                "p-4 border rounded-lg cursor-pointer transition-all",
                assessmentWizard.riskTolerance === level.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-slate-900">{level.name}</h4>
                  <p className="text-sm text-slate-600">{level.description}</p>
                </div>
                {assessmentWizard.riskTolerance === level.id && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• We'll analyze your responses to calculate your baseline Trust Score</li>
          <li>• ERIP will recommend priority actions to improve your score</li>
          <li>• You'll get access to automated compliance workflows</li>
          <li>• Sales acceleration tools will be configured for your industry</li>
        </ul>
      </div>
    </div>
  )
}

const BaselineTrustScoreStep: React.FC<any> = ({ 
  baselineTrustScore, 
  isGeneratingBaseline, 
  onGenerateBaseline 
}) => {
  if (baselineTrustScore === null && !isGeneratingBaseline) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <TrendingUp className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Ready to Generate Your Trust Score
          </h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Based on your responses, we'll calculate your baseline Trust Score and 
            create a personalized improvement roadmap.
          </p>
        </div>
        <Button
          onClick={onGenerateBaseline}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Generate My Trust Score
        </Button>
      </div>
    )
  }

  if (isGeneratingBaseline) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Calculating Your Trust Score...
          </h3>
          <p className="text-slate-600">
            Analyzing your compliance frameworks, industry requirements, and risk profile
          </p>
        </div>
      </div>
    )
  }

  const getTierInfo = (score: number) => {
    if (score >= 800) return { name: 'Market Leader', color: 'text-purple-600', bg: 'bg-purple-50' }
    if (score >= 600) return { name: 'Sales Accelerator', color: 'text-blue-600', bg: 'bg-blue-50' }
    if (score >= 400) return { name: 'Process Builder', color: 'text-green-600', bg: 'bg-green-50' }
    return { name: 'Foundation', color: 'text-orange-600', bg: 'bg-orange-50' }
  }

  const tierInfo = getTierInfo(baselineTrustScore!)

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto">
        <div className={cn("inline-flex items-center justify-center w-24 h-24 rounded-full", tierInfo.bg)}>
          <span className={cn("text-3xl font-bold", tierInfo.color)}>
            {baselineTrustScore}
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Your Baseline Trust Score: {baselineTrustScore}
        </h3>
        <Badge className={cn("text-base px-4 py-2", tierInfo.color, tierInfo.bg)}>
          {tierInfo.name} Tier
        </Badge>
        <p className="text-slate-600 mt-4 max-w-md mx-auto">
          Congratulations! You're ready to start building Trust Equity™. 
          Your personalized dashboard will show you exactly how to improve your score.
        </p>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">🎉 You're all set!</h4>
        <p className="text-sm text-green-800">
          Welcome to ERIP! Your Trust Intelligence Platform is ready. 
          Click "Complete Setup" to access your dashboard and start building Trust Equity™.
        </p>
      </div>
    </div>
  )
}

export default Onboarding