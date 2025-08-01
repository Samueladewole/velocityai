/**
 * Answer Review Interface
 * 
 * Side-by-side question/answer review with evidence attachment,
 * tone customization, and multi-format export capabilities.
 */
import React, { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  FileText, 
  Download, 
  Paperclip, 
  CheckCircle, 
  AlertCircle,
  Edit,
  Save,
  FileSpreadsheet,
  FileJson,
  FileDown
} from 'lucide-react'
import { Question, Answer, Evidence, ConfidenceLevel } from '@/types/qie'
import { exportQuestionnaireAnswers, ExportFormat } from '@/utils/export'
import { useToast } from '@/hooks/use-toast'

interface AnswerReviewProps {
  questions: Question[]
  onUpdate: (questionId: string, answer: Answer) => void
  onComplete: () => void
  organizationId: string
}

type AnswerTone = 'formal' | 'conversational' | 'technical' | 'concise'
type AnswerLength = 'brief' | 'standard' | 'detailed'

export function AnswerReview({ questions, onUpdate, onComplete, organizationId }: AnswerReviewProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(questions[0] || null)
  const [editingAnswer, setEditingAnswer] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [tone, setTone] = useState<AnswerTone>('formal')
  const [length, setLength] = useState<AnswerLength>('standard')
  const [attachedEvidence, setAttachedEvidence] = useState<Evidence[]>([])
  const { toast } = useToast()

  // Group questions by category
  const groupedQuestions = questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = []
    acc[q.category].push(q)
    return acc
  }, {} as Record<string, Question[]>)

  const handleAnswerUpdate = () => {
    if (!selectedQuestion) return

    const updatedAnswer: Answer = {
      ...selectedQuestion.answer!,
      content: editingAnswer,
      evidence: attachedEvidence,
      lastUpdated: new Date().toISOString(),
      metadata: {
        ...selectedQuestion.answer?.metadata,
        tone,
        length,
        reviewedAt: new Date().toISOString()
      }
    }

    onUpdate(selectedQuestion.id, updatedAnswer)
    setIsEditing(false)
    toast({
      title: 'Answer Updated',
      description: 'Your changes have been saved successfully.'
    })
  }

  const handleEvidenceAttach = (evidence: Evidence) => {
    setAttachedEvidence([...attachedEvidence, evidence])
  }

  const handleExport = (format: ExportFormat) => {
    try {
      exportQuestionnaireAnswers(questions, format, {
        filename: `questionnaire-review-€{organizationId}`
      })
      toast({
        title: 'Export Successful',
        description: `Questionnaire exported as €{format.toUpperCase()}`
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Unable to export questionnaire. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const getConfidenceBadgeColor = (confidence: ConfidenceLevel) => {
    const colors = {
      verified: 'bg-green-100 text-green-800',
      high: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-orange-100 text-orange-800',
      gap: 'bg-red-100 text-red-800'
    }
    return colors[confidence] || colors.medium
  }

  const answeredCount = questions.filter(q => q.answer?.content).length
  const progress = (answeredCount / questions.length) * 100

  return (
    <div className="flex h-full">
      {/* Question List Sidebar */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold mb-2">Questions ({questions.length})</h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{answeredCount} answered</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `€{progress}%` }}
            />
          </div>
        </div>

        <Tabs defaultValue={Object.keys(groupedQuestions)[0]} className="h-full">
          <TabsList className="w-full p-1">
            {Object.keys(groupedQuestions).map(category => (
              <TabsTrigger key={category} value={category} className="flex-1">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
            <TabsContent key={category} value={category} className="m-0 h-full">
              <div className="space-y-2 p-2">
                {categoryQuestions.map(question => (
                  <Card
                    key={question.id}
                    className={`p-3 cursor-pointer transition-colors €{
                      selectedQuestion?.id === question.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedQuestion(question)
                      setEditingAnswer(question.answer?.content || '')
                      setAttachedEvidence(question.answer?.evidence || [])
                      setIsEditing(false)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{question.question}</p>
                        {question.answer && (
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs €{getConfidenceBadgeColor(question.answer.confidence)}`}>
                              {question.answer.confidence}
                            </Badge>
                            {question.answer.evidence && question.answer.evidence.length > 0 && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Paperclip className="h-3 w-3" />
                                {question.answer.evidence.length}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {question.answer?.content ? (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 ml-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Answer Review Panel */}
      <div className="flex-1 overflow-y-auto">
        {selectedQuestion ? (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Question Review</h2>
              <div className="flex items-center gap-4">
                <Badge className={getConfidenceBadgeColor(selectedQuestion.answer?.confidence || 'low')}>
                  {selectedQuestion.answer?.confidence || 'No Answer'}
                </Badge>
                <span className="text-sm text-gray-500">
                  Category: {selectedQuestion.category}
                </span>
                {selectedQuestion.complianceFramework && (
                  <span className="text-sm text-gray-500">
                    Framework: {selectedQuestion.complianceFramework}
                  </span>
                )}
              </div>
            </div>

            <Card className="p-4 mb-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Question
              </h3>
              <p className="text-gray-700">{selectedQuestion.question}</p>
              {selectedQuestion.context && (
                <p className="text-sm text-gray-500 mt-2">{selectedQuestion.context}</p>
              )}
            </Card>

            <Card className="p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Answer
                </h3>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Answer
                    </Button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-1 block">Tone</label>
                      <Select value={tone} onValueChange={(v) => setTone(v as AnswerTone)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="concise">Concise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-1 block">Length</label>
                      <Select value={length} onValueChange={(v) => setLength(v as AnswerLength)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brief">Brief</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Textarea
                    value={editingAnswer}
                    onChange={(e) => setEditingAnswer(e.target.value)}
                    rows={6}
                    className="w-full"
                    placeholder="Enter your answer..."
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setEditingAnswer(selectedQuestion.answer?.content || '')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAnswerUpdate}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Answer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">
                    {selectedQuestion.answer?.content || 'No answer provided yet.'}
                  </p>
                </div>
              )}
            </Card>

            {/* Evidence Section */}
            <Card className="p-4 mb-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attached Evidence ({attachedEvidence.length})
              </h3>
              <div className="space-y-2">
                {attachedEvidence.map((evidence, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{evidence.title}</p>
                        <p className="text-xs text-gray-500">{evidence.type} • {evidence.source}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAttachedEvidence(attachedEvidence.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                <Paperclip className="h-4 w-4 mr-2" />
                Attach Evidence
              </Button>
            </Card>

            {/* Source Information */}
            {selectedQuestion.answer?.source && (
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-2">Source Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Generated by: {selectedQuestion.answer.source.generator}</p>
                  <p>Match score: {Math.round((selectedQuestion.answer.source.matchScore || 0) * 100)}%</p>
                  {selectedQuestion.answer.source.lastUsed && (
                    <p>Last used: {new Date(selectedQuestion.answer.source.lastUsed).toLocaleDateString()}</p>
                  )}
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a question to review
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('excel')}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Excel
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('json')}
        >
          <FileJson className="h-4 w-4 mr-2" />
          JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('markdown')}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Markdown
        </Button>
        <Button onClick={onComplete}>
          Complete Review
        </Button>
      </div>
    </div>
  )
}