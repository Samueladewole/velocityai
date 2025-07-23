/**
 * QIE Workflow Component
 * 
 * Main component orchestrating the complete QIE workflow from upload to completion
 */

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Upload,
  Brain,
  FileCheck,
  Send,
  CheckCircle2,
  ArrowRight,
  Clock,
  Users,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Questionnaire, Question, Answer, QIEEvent, QIEWorkflow } from '@/types/qie'
import { QuestionnaireUpload } from './QuestionnaireUpload'
import { AnswerGeneration } from './AnswerGeneration'
import { AnswerReview } from './AnswerReview'
import { QuestionExtractionService } from '@/services/qie/questionExtraction'
import { EnhancedQuestionExtractionService } from '@/services/qie/enhancedQuestionExtraction'

type WorkflowStep = 'upload' | 'analysis' | 'enhancement' | 'review' | 'complete'

interface QIEWorkflowProps {
  onWorkflowComplete?: (questionnaire: Questionnaire) => void
}

export function QIEWorkflowComponent({ onWorkflowComplete }: QIEWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload')
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null)
  const [workflow, setWorkflow] = useState<QIEWorkflow | null>(null)
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const extractionService = QuestionExtractionService.getInstance()
  const enhancedExtractionService = new EnhancedQuestionExtractionService()

  const handleQuestionnaireUpload = useCallback(async (uploadedQuestionnaire: Questionnaire) => {
    setQuestionnaire(uploadedQuestionnaire)
    setWorkflow({
      id: `workflow_${Date.now()}`,
      questionnaireId: uploadedQuestionnaire.id,
      currentStep: 'analysis',
      progress: 25,
      startDate: new Date(),
      participants: ['current-user'] // Would be actual user IDs
    })
    setCurrentStep('analysis')

    // Simulate question extraction
    setIsProcessing(true)
    try {
      // In real implementation, this would extract from actual file content
      const mockQuestions: Question[] = [
        {
          id: 'q1',
          text: 'Do you encrypt sensitive data at rest using industry-standard encryption algorithms?',
          category: 'Data Security',
          framework: 'SOC2',
          required: true,
          type: 'boolean'
        },
        {
          id: 'q2', 
          text: 'Describe your backup and disaster recovery procedures including frequency and testing protocols.',
          category: 'Business Continuity',
          framework: 'ISO27001',
          required: true,
          type: 'text'
        },
        {
          id: 'q3',
          text: 'Do you implement multi-factor authentication for all administrative access?',
          category: 'Access Control',
          framework: 'SOC2',
          required: true,
          type: 'boolean'
        },
        {
          id: 'q4',
          text: 'What incident response procedures do you have in place for security breaches?',
          category: 'Incident Response',
          framework: 'NIST',
          required: true,
          type: 'text'
        },
        {
          id: 'q5',
          text: 'Do you conduct regular vulnerability assessments and penetration testing?',
          category: 'Risk Management',
          framework: 'ISO27001',
          required: false,
          type: 'boolean'
        }
      ]

      const updatedQuestionnaire = {
        ...uploadedQuestionnaire,
        questions: mockQuestions,
        status: 'ready' as const
      }

      setQuestionnaire(updatedQuestionnaire)
      setCurrentStep('enhancement')
      setWorkflow(prev => prev ? { ...prev, currentStep: 'enhancement', progress: 50 } : null)

    } catch (error) {
      console.error('Question extraction failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleAnswerGenerated = useCallback((answer: Answer) => {
    setAnswers(prev => ({
      ...prev,
      [answer.questionId]: answer
    }))

    // Update questionnaire completion percentage
    if (questionnaire) {
      const totalQuestions = questionnaire.questions.length
      const answeredQuestions = Object.keys({ ...answers, [answer.questionId]: answer }).length
      const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100)

      setQuestionnaire(prev => prev ? {
        ...prev,
        answers: Object.values({ ...answers, [answer.questionId]: answer }),
        completionPercentage
      } : null)
    }
  }, [questionnaire, answers])

  const handleNextQuestion = () => {
    if (questionnaire && selectedQuestionIndex < questionnaire.questions.length - 1) {
      setSelectedQuestionIndex(prev => prev + 1)
    } else {
      // All questions completed, move to review
      setCurrentStep('review')
      setWorkflow(prev => prev ? { ...prev, currentStep: 'review', progress: 75 } : null)
    }
  }

  const handlePreviousQuestion = () => {
    if (selectedQuestionIndex > 0) {
      setSelectedQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitQuestionnaire = () => {
    if (questionnaire) {
      const finalQuestionnaire = {
        ...questionnaire,
        status: 'completed' as const,
        completionPercentage: 100
      }

      setQuestionnaire(finalQuestionnaire)
      setCurrentStep('complete')
      setWorkflow(prev => prev ? { ...prev, currentStep: 'complete', progress: 100 } : null)
      onWorkflowComplete?.(finalQuestionnaire)
    }
  }

  const getStepStatus = (step: WorkflowStep): 'completed' | 'current' | 'pending' => {
    const stepOrder: WorkflowStep[] = ['upload', 'analysis', 'enhancement', 'review', 'complete']
    const currentIndex = stepOrder.indexOf(currentStep)
    const stepIndex = stepOrder.indexOf(step)

    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'pending'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                Questionnaire Intelligence Engine
              </CardTitle>
              <CardDescription className="text-base">
                Transform security questionnaires into automated accelerators
              </CardDescription>
            </div>
            {workflow && (
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{workflow.progress}%</div>
                <div className="text-sm text-slate-600">Complete</div>
              </div>
            )}
          </div>

          {/* Step Progress */}
          <div className="flex items-center justify-between">
            {[
              { step: 'upload', icon: Upload, label: 'Upload' },
              { step: 'analysis', icon: Brain, label: 'AI Analysis' },
              { step: 'enhancement', icon: FileCheck, label: 'Enhancement' },
              { step: 'review', icon: Users, label: 'Review' },
              { step: 'complete', icon: CheckCircle2, label: 'Complete' }
            ].map(({ step, icon: Icon, label }, index) => {
              const status = getStepStatus(step as WorkflowStep)
              return (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    status === 'completed' ? "bg-green-500 border-green-500 text-white" :
                    status === 'current' ? "bg-blue-500 border-blue-500 text-white" :
                    "bg-white border-slate-300 text-slate-400"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-2 text-sm font-medium text-slate-700">
                    {label}
                  </div>
                  {index < 4 && (
                    <ArrowRight className={cn(
                      "h-4 w-4 mx-4",
                      status === 'completed' ? "text-green-500" : "text-slate-300"
                    )} />
                  )}
                </div>
              )
            })}
          </div>

          {workflow && (
            <Progress value={workflow.progress} className="mt-4 h-3" />
          )}
        </CardHeader>
      </Card>

      {/* Step Content */}
      {currentStep === 'upload' && (
        <QuestionnaireUpload 
          onUploadComplete={handleQuestionnaireUpload}
          maxFiles={3}
          maxSize={25}
        />
      )}

      {currentStep === 'analysis' && isProcessing && (
        <Card>
          <CardContent className="p-8 text-center">
            <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              AI Extracting Questions
            </h3>
            <p className="text-slate-600 mb-4">
              Analyzing questionnaire content and categorizing questions...
            </p>
            <Progress value={75} className="max-w-md mx-auto" />
          </CardContent>
        </Card>
      )}

      {(currentStep === 'enhancement' || currentStep === 'review') && questionnaire && (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Question List Sidebar */}
          <div className="lg:col-span-4">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg">
                  Questions ({questionnaire.questions.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Progress value={questionnaire.completionPercentage} className="flex-1 h-2" />
                  <span className="text-sm font-medium text-slate-600">
                    {questionnaire.completionPercentage}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {questionnaire.questions.map((question, index) => {
                    const hasAnswer = answers[question.id]
                    const isSelected = index === selectedQuestionIndex
                    
                    return (
                      <div
                        key={question.id}
                        className={cn(
                          "p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors",
                          isSelected && "bg-blue-50 border-l-4 border-l-blue-500"
                        )}
                        onClick={() => setSelectedQuestionIndex(index)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-slate-600">
                                Q{index + 1}
                              </span>
                              {question.required && (
                                <Badge variant="outline" className="text-xs">Required</Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-900 line-clamp-2">
                              {question.text}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {question.category}
                              </Badge>
                              {question.framework && (
                                <Badge variant="outline" className="text-xs">
                                  {question.framework}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {hasAnswer ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Clock className="h-5 w-5 text-slate-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Current Question */}
            {questionnaire.questions[selectedQuestionIndex] && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        Question {selectedQuestionIndex + 1} of {questionnaire.questions.length}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {questionnaire.questions[selectedQuestionIndex].framework && (
                          <Badge variant="secondary">
                            {questionnaire.questions[selectedQuestionIndex].framework}
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          {questionnaire.questions[selectedQuestionIndex].category}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl leading-relaxed">
                      {questionnaire.questions[selectedQuestionIndex].text}
                    </CardTitle>
                  </CardHeader>
                </Card>

                {/* Answer Generation */}
                <AnswerGeneration
                  question={questionnaire.questions[selectedQuestionIndex]}
                  onAnswerGenerated={handleAnswerGenerated}
                  existingAnswer={answers[questionnaire.questions[selectedQuestionIndex].id]}
                />

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousQuestion}
                    disabled={selectedQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    {selectedQuestionIndex < questionnaire.questions.length - 1 ? (
                      <Button onClick={handleNextQuestion}>
                        Next Question
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={() => setCurrentStep('review')}>
                        Review All Answers
                        <FileCheck className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {currentStep === 'review' && questionnaire && (
        <AnswerReview
          questions={questionnaire.questions.map(q => ({
            ...q,
            id: q.id,
            question: q.text,
            category: q.category,
            complianceFramework: q.framework,
            answer: answers[q.id] ? {
              content: answers[q.id].text,
              confidence: answers[q.id].confidenceScore >= 90 ? 'verified' as const :
                         answers[q.id].confidenceScore >= 80 ? 'high' as const :
                         answers[q.id].confidenceScore >= 60 ? 'medium' as const : 'low' as const,
              evidence: answers[q.id].evidence,
              lastUpdated: answers[q.id].lastUpdated || new Date().toISOString(),
              source: {
                type: 'ai' as const,
                generator: 'enhanced-qie',
                matchScore: answers[q.id].confidenceScore / 100
              }
            } : undefined
          }))}
          onUpdate={(questionId, updatedAnswer) => {
            setAnswers(prev => ({
              ...prev,
              [questionId]: {
                text: updatedAnswer.content,
                evidence: updatedAnswer.evidence || [],
                confidenceScore: updatedAnswer.confidence === 'verified' ? 95 :
                                 updatedAnswer.confidence === 'high' ? 85 :
                                 updatedAnswer.confidence === 'medium' ? 70 : 50,
                status: 'reviewed' as const,
                lastUpdated: updatedAnswer.lastUpdated
              }
            }))
          }}
          onComplete={handleSubmitQuestionnaire}
          organizationId={questionnaire.organizationId || 'default'}
        />
      )}

      {currentStep === 'complete' && questionnaire && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Questionnaire Complete!
            </h3>
            <p className="text-lg text-slate-600 mb-6">
              Your security questionnaire has been processed and is ready for submission.
            </p>
            
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {questionnaire.questions.length}
                </div>
                <div className="text-sm text-slate-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.keys(answers).length}
                </div>
                <div className="text-sm text-slate-600">Answered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(Object.values(answers).reduce((sum, a) => sum + a.confidenceScore, 0) / Object.values(answers).length)}%
                </div>
                <div className="text-sm text-slate-600">Avg Confidence</div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="outline">
                Export PDF
              </Button>
              <Button variant="outline">
                Share with Team
              </Button>
              <Button>
                Start New Questionnaire
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}