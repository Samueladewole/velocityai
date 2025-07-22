/**
 * Answer Generation Component
 * 
 * AI-powered answer generation with confidence levels and evidence linking
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  RefreshCw,
  Sparkles,
  Shield,
  TrendingUp,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Question, Answer, Evidence, ConfidenceLevel } from '@/types/qie'
import { IntelligentAnswerGenerationService, AnswerGenerationOptions } from '@/services/qie/intelligentAnswerGeneration'
import { useToast } from '@/hooks/use-toast'

interface AnswerGenerationProps {
  question: Question
  onAnswerGenerated: (answer: Answer) => void
  existingAnswer?: Answer
  evidenceRepository?: Evidence[]
  trustEquityData?: any
}

interface GeneratedAnswer {
  text: string
  confidence: ConfidenceLevel
  confidenceScore: number
  evidence: Evidence[]
  reasoning: string
  sources: {
    trustEquity: boolean
    evidenceRepo: boolean
    previousAnswers: boolean
    expertKnowledge: boolean
    aiGenerated: boolean
  }
}

const CONFIDENCE_LEVELS = {
  verified: { score: 100, label: '100% - Direct evidence available', color: 'bg-green-500' },
  high: { score: 90, label: '90%+ - Strong supporting documentation', color: 'bg-blue-500' },
  medium: { score: 75, label: '70-89% - Partial evidence, needs review', color: 'bg-yellow-500' },
  low: { score: 50, label: '<70% - Requires manual input', color: 'bg-orange-500' },
  gap: { score: 0, label: 'No data - Flags for immediate attention', color: 'bg-red-500' }
}

export function AnswerGeneration({ 
  question, 
  onAnswerGenerated, 
  existingAnswer,
  evidenceRepository = [],
  trustEquityData 
}: AnswerGenerationProps) {
  const [generatedAnswer, setGeneratedAnswer] = useState<GeneratedAnswer | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customAnswer, setCustomAnswer] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [options, setOptions] = useState<AnswerGenerationOptions>({
    tone: 'formal',
    length: 'standard',
    includeEvidence: true
  })
  
  const { toast } = useToast()
  const answerService = new IntelligentAnswerGenerationService()

  useEffect(() => {
    if (existingAnswer) {
      setCustomAnswer(existingAnswer.text)
      // Convert existing answer to GeneratedAnswer format for display
      setGeneratedAnswer({
        text: existingAnswer.text,
        confidence: existingAnswer.confidence,
        confidenceScore: existingAnswer.confidenceScore,
        evidence: existingAnswer.evidence,
        reasoning: 'Previously generated answer',
        sources: {
          trustEquity: true,
          evidenceRepo: existingAnswer.evidence.length > 0,
          previousAnswers: true,
          expertKnowledge: false,
          aiGenerated: true
        }
      })
    } else {
      // Auto-generate answer for new questions
      generateAnswer()
    }
  }, [question, existingAnswer])

  const generateAnswer = async () => {
    setIsGenerating(true)
    
    try {
      // Use intelligent answer generation service
      const startTime = Date.now()
      const generatedResult = await answerService.generateAnswer(
        question,
        'default-org', // TODO: Get from context
        options
      )
      
      
      // Convert to component format
      const answer: GeneratedAnswer = {
        text: generatedResult.content,
        confidence: generatedResult.confidence,
        confidenceScore: generatedResult.confidence === 'verified' ? 95 :
                        generatedResult.confidence === 'high' ? 85 :
                        generatedResult.confidence === 'medium' ? 70 : 50,
        evidence: generatedResult.evidence,
        reasoning: generatedResult.suggestedImprovements?.join(' ') || 'AI-generated answer with Trust Equity data',
        sources: {
          trustEquity: true,
          evidenceRepo: generatedResult.evidence.length > 0,
          previousAnswers: generatedResult.source.type === 'previous',
          expertKnowledge: false,
          aiGenerated: generatedResult.source.type === 'ai'
        }
      }
      
      setGeneratedAnswer(answer)
      setCustomAnswer(answer.text)
      
      // Create Answer object and notify parent
      const answerObj: Answer = {
        id: `answer_${Date.now()}`,
        questionId: question.id,
        text: answer.text,
        confidence: answer.confidence,
        confidenceScore: answer.confidenceScore,
        evidence: answer.evidence,
        lastUpdated: new Date(),
        status: 'draft'
      }
      
      onAnswerGenerated(answerObj)
      
      const processingTime = Date.now() - startTime
      toast({
        title: 'Answer Generated',
        description: `Generated with ${answer.confidence} confidence in ${(processingTime / 1000).toFixed(1)}s`
      })
      
    } catch (error) {
      console.error('Answer generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateAIAnswer = async (): Promise<GeneratedAnswer> => {
    const questionLower = question.text.toLowerCase()
    
    // Analyze question content to determine answer strategy
    let answer = ''
    let confidence: ConfidenceLevel = 'medium'
    let confidenceScore = 75
    let evidence: Evidence[] = []
    let reasoning = ''
    
    // Match against common security question patterns
    if (questionLower.includes('encrypt')) {
      answer = "Yes, we implement comprehensive encryption controls including AES-256 encryption for data at rest and TLS 1.3 for data in transit. All encryption keys are managed through our certified key management system with regular key rotation policies."
      confidence = 'high'
      confidenceScore = 92
      evidence = [
        {
          id: 'enc-1',
          title: 'Encryption Policy v3.2',
          description: 'Comprehensive encryption standards and implementation guide',
          type: 'policy',
          url: '/evidence/encryption-policy-v3.2',
          lastUpdated: new Date(),
          verificationStatus: 'verified'
        },
        {
          id: 'enc-2',
          title: 'SOC 2 Type II Report - Encryption Controls',
          description: 'Third-party audit verification of encryption implementation',
          type: 'report',
          url: '/evidence/soc2-encryption-controls',
          lastUpdated: new Date(),
          verificationStatus: 'verified'
        }
      ]
      reasoning = 'High confidence based on verified encryption policies and SOC 2 audit confirmation'
    } 
    else if (questionLower.includes('backup')) {
      answer = "We maintain comprehensive backup and recovery procedures with automated daily backups following the 3-2-1 backup strategy. All backups are encrypted, tested monthly for integrity, and stored in geographically separate locations with documented recovery procedures."
      confidence = 'high'
      confidenceScore = 88
      evidence = [
        {
          id: 'backup-1',
          title: 'Backup and Recovery Policy',
          description: 'Detailed backup procedures and recovery testing protocols',
          type: 'policy',
          url: '/evidence/backup-recovery-policy',
          lastUpdated: new Date(),
          verificationStatus: 'verified'
        }
      ]
      reasoning = 'Strong evidence from backup policy and regular testing documentation'
    }
    else if (questionLower.includes('access control') || questionLower.includes('authentication')) {
      answer = "We implement role-based access control (RBAC) with multi-factor authentication required for all system access. Access permissions follow the principle of least privilege, with regular access reviews conducted quarterly and immediate revocation upon role changes."
      confidence = 'verified'
      confidenceScore = 95
      evidence = [
        {
          id: 'access-1',
          title: 'Identity and Access Management Policy',
          description: 'Comprehensive access control framework and procedures',
          type: 'policy',
          url: '/evidence/iam-policy',
          lastUpdated: new Date(),
          verificationStatus: 'verified'
        },
        {
          id: 'access-2',
          title: 'MFA Implementation Certificate',
          description: 'Proof of multi-factor authentication deployment',
          type: 'certificate',
          url: '/evidence/mfa-certificate',
          lastUpdated: new Date(),
          verificationStatus: 'verified'
        }
      ]
      reasoning = 'Verified through multiple sources including policy documentation and implementation certificates'
    }
    else if (questionLower.includes('incident') || questionLower.includes('breach')) {
      answer = "We maintain a comprehensive incident response plan with 24/7 monitoring, defined escalation procedures, and regular tabletop exercises. Our incident response team includes security, legal, and communications specialists with established timelines for notification and remediation."
      confidence = 'medium'
      confidenceScore = 78
      evidence = [
        {
          id: 'ir-1',
          title: 'Incident Response Plan v2.1',
          description: 'Detailed incident response procedures and contact information',
          type: 'document',
          url: '/evidence/incident-response-plan',
          lastUpdated: new Date(),
          verificationStatus: 'verified'
        }
      ]
      reasoning = 'Based on documented incident response procedures, requires review for completeness'
    }
    else {
      // Generic answer for unrecognized patterns
      answer = "Please refer to our comprehensive security documentation and compliance framework. We maintain detailed policies and procedures that address this requirement in accordance with industry best practices and relevant regulatory standards."
      confidence = 'low'
      confidenceScore = 45
      evidence = []
      reasoning = 'Generic response - requires manual review and customization for specific requirements'
    }
    
    return {
      text: answer,
      confidence,
      confidenceScore,
      evidence,
      reasoning,
      sources: {
        trustEquity: trustEquityData ? true : false,
        evidenceRepo: evidence.length > 0,
        previousAnswers: false, // Would check historical answers
        expertKnowledge: confidence === 'verified',
        aiGenerated: true
      }
    }
  }

  const handleSaveAnswer = () => {
    if (!generatedAnswer) return
    
    const updatedAnswer: Answer = {
      id: existingAnswer?.id || `answer_${Date.now()}`,
      questionId: question.id,
      text: customAnswer,
      confidence: generatedAnswer.confidence,
      confidenceScore: generatedAnswer.confidenceScore,
      evidence: generatedAnswer.evidence,
      lastUpdated: new Date(),
      status: 'reviewed'
    }
    
    onAnswerGenerated(updatedAnswer)
    setIsEditing(false)
  }

  const getConfidenceInfo = (level: ConfidenceLevel) => {
    return CONFIDENCE_LEVELS[level]
  }

  if (isGenerating) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">
                AI Analyzing Question
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  Analyzing question content and context...
                </div>
                <Progress value={33} className="h-2" />
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield className="h-4 w-4" />
                  Matching against Trust Equity data...
                </div>
                <Progress value={66} className="h-2" />
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Sparkles className="h-4 w-4" />
                  Generating evidence-backed response...
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!generatedAnswer) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-600">Failed to generate answer</p>
          <Button onClick={generateAnswer} variant="outline" size="sm" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const confidenceInfo = getConfidenceInfo(generatedAnswer.confidence)

  return (
    <div className="space-y-4">
      {/* Confidence and Sources Overview */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI-Generated Answer
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                className={cn("text-white", confidenceInfo.color)}
                variant="default"
              >
                {generatedAnswer.confidenceScore}% Confidence
              </Badge>
              <Badge variant="outline">
                {generatedAnswer.confidence.toUpperCase()}
              </Badge>
            </div>
          </div>
          <CardDescription>
            {confidenceInfo.label}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Data Sources */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Data Sources Used:</h4>
            <div className="flex flex-wrap gap-2">
              {generatedAnswer.sources.trustEquity && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trust Equity Data
                </Badge>
              )}
              {generatedAnswer.sources.evidenceRepo && (
                <Badge variant="secondary" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  Evidence Repository
                </Badge>
              )}
              {generatedAnswer.sources.aiGenerated && (
                <Badge variant="secondary" className="text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Generated
                </Badge>
              )}
            </div>
          </div>

          {/* Reasoning */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>AI Reasoning:</strong> {generatedAnswer.reasoning}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Answer Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Answer Content</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              {isEditing && (
                <Button size="sm" onClick={handleSaveAnswer}>
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={customAnswer}
              onChange={(e) => setCustomAnswer(e.target.value)}
              rows={6}
              className="w-full"
              placeholder="Edit your answer..."
            />
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="text-slate-700 whitespace-pre-wrap">{customAnswer}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supporting Evidence */}
      {generatedAnswer.evidence.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Supporting Evidence ({generatedAnswer.evidence.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedAnswer.evidence.map((evidence) => (
                <div key={evidence.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-900 truncate">
                        {evidence.title}
                      </h4>
                      <Badge 
                        variant={evidence.verificationStatus === 'verified' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {evidence.verificationStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{evidence.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Last updated: {evidence.lastUpdated.toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}