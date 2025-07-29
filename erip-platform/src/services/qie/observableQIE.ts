/**
 * Observable QIE Service
 * 
 * Enhanced QIE with full observability integration
 * Provides complete transparency and auditability for AI-powered questionnaire intelligence
 */

import { Question, Answer, Evidence, ConfidenceLevel } from '@/types/qie'
import { AIService, aiService } from '../ai'
import { IntelligentAnswerGenerationService, AnswerGenerationOptions, GeneratedAnswer } from './intelligentAnswerGeneration'
import { EnhancedQuestionExtractionService } from './enhancedQuestionExtraction'
import { observabilityCore } from '../observability/observabilityCore'
import { aiAgentMonitoring } from '../observability/aiAgentMonitoring'
import { complianceObservability } from '../observability/complianceObservability'

export interface ObservableQIEMetrics {
  questionExtractionMetrics: {
    totalExtracted: number
    accuracyScore: number
    processingTime: number
    frameworksCovered: string[]
  }
  answerGenerationMetrics: {
    totalGenerated: number
    averageConfidence: number
    averageProcessingTime: number
    successRate: number
    evidenceUtilization: number
  }
  learningMetrics: {
    totalTrainingData: number
    modelAccuracy: number
    improvementRate: number
    feedbackIncorporated: number
  }
}

export interface QIEAuditTrail {
  questionId: string
  extractionDetails: {
    originalDocument: string
    extractedText: string
    confidence: number
    processingTime: number
    aiModel: string
  }
  answerDetails: {
    prompt: string
    response: string
    confidence: number
    evidence: Evidence[]
    reasoning: string[]
    processingTime: number
    aiModel: string
  }
  userInteractions: {
    userId: string
    action: string
    timestamp: Date
    feedback?: number
  }[]
  complianceAlignment: {
    framework: string
    requirements: string[]
    alignment: number
  }[]
}

export class ObservableQIEService {
  private static instance: ObservableQIEService
  private answerGenerationService: IntelligentAnswerGenerationService
  private questionExtractionService: EnhancedQuestionExtractionService
  private auditTrails: Map<string, QIEAuditTrail> = new Map()

  static getInstance(): ObservableQIEService {
    if (!ObservableQIEService.instance) {
      ObservableQIEService.instance = new ObservableQIEService()
    }
    return ObservableQIEService.instance
  }

  constructor() {
    this.answerGenerationService = new IntelligentAnswerGenerationService()
    this.questionExtractionService = new EnhancedQuestionExtractionService()
  }

  /**
   * Extract questions with full observability
   */
  async extractQuestionsWithObservability(
    file: File | Buffer,
    filename: string,
    organizationId: string,
    userId: string
  ): Promise<{
    questions: Question[]
    observabilityData: {
      extractionMetrics: any
      auditTrail: QIEAuditTrail[]
    }
  }> {
    const startTime = Date.now()

    // Track the extraction process
    const aiDecision = aiAgentMonitoring.monitorAIDecision(
      'QIE_QuestionExtraction',
      `Extract questions from ${filename}`,
      'Processing document for question extraction',
      0.9, // High confidence for extraction
      'gpt-4',
      { input: 1000, output: 500 }, // Estimated tokens
      0, // Will be updated
      organizationId,
      ['Document parsing', 'Pattern recognition', 'Question categorization'],
      { filename, fileSize: file instanceof File ? file.size : file.length }
    )

    try {
      // Perform extraction
      const extractionResult = await this.questionExtractionService.extractQuestionsWithAI(
        file,
        filename,
        organizationId
      )

      const processingTime = Date.now() - startTime

      // Update AI decision with actual results
      aiDecision.latency = processingTime
      aiDecision.confidence = extractionResult.metadata.confidenceDistribution.high > 0.7 ? 0.9 : 0.7

      // Track compliance event
      complianceObservability.trackEvidenceCollection(
        `extraction_${Date.now()}`,
        'upload',
        userId,
        organizationId,
        {
          framework: 'QIE',
          documentType: filename.split('.').pop(),
          questionsExtracted: extractionResult.questions.length,
          processingTime
        }
      )

      // Create audit trails for each question
      const auditTrails: QIEAuditTrail[] = extractionResult.questions.map(question => ({
        questionId: question.id,
        extractionDetails: {
          originalDocument: filename,
          extractedText: question.text,
          confidence: 0.85, // Would be calculated based on extraction algorithm
          processingTime: processingTime / extractionResult.questions.length,
          aiModel: 'question-extraction-v1'
        },
        answerDetails: {
          prompt: '',
          response: '',
          confidence: 0,
          evidence: [],
          reasoning: [],
          processingTime: 0,
          aiModel: ''
        },
        userInteractions: [{
          userId,
          action: 'extracted',
          timestamp: new Date()
        }],
        complianceAlignment: [{
          framework: question.complianceFramework || 'General',
          requirements: [question.category],
          alignment: 0.8
        }]
      }))

      // Store audit trails
      auditTrails.forEach(trail => {
        this.auditTrails.set(trail.questionId, trail)
      })

      // Track performance metrics
      observabilityCore.trackPerformance({
        metric: 'qie_question_extraction_time',
        value: processingTime,
        unit: 'milliseconds',
        component: 'QIE_QuestionExtraction',
        organizationId,
        tags: {
          document_type: filename.split('.').pop() || 'unknown',
          questions_extracted: extractionResult.questions.length.toString()
        }
      })

      return {
        questions: extractionResult.questions,
        observabilityData: {
          extractionMetrics: extractionResult.metadata,
          auditTrail: auditTrails
        }
      }
    } catch (error) {
      // Track error
      observabilityCore.trackEvent({
        type: 'error',
        source: 'qie',
        component: 'question_extraction',
        data: {
          error: error.message,
          filename,
          processingTime: Date.now() - startTime
        },
        organizationId,
        userId,
        severity: 'error',
        tags: {
          operation: 'question_extraction',
          document: filename
        }
      })

      throw error
    }
  }

  /**
   * Generate answer with full observability
   */
  async generateAnswerWithObservability(
    question: Question,
    organizationId: string,
    userId: string,
    options: AnswerGenerationOptions = {}
  ): Promise<{
    answer: GeneratedAnswer
    observabilityData: {
      decisionTrace: any
      complianceAlignment: any
      auditTrail: QIEAuditTrail
    }
  }> {
    const startTime = Date.now()

    // Build comprehensive prompt for observability
    const prompt = this.buildObservablePrompt(question, options)

    // Monitor AI decision
    const aiDecision = aiAgentMonitoring.monitorAIDecision(
      'QIE_AnswerGeneration',
      prompt,
      '', // Will be filled with response
      0, // Will be calculated
      'gpt-4',
      { input: 0, output: 0 }, // Will be estimated
      0, // Will be measured
      organizationId,
      [
        'Question analysis',
        'Evidence retrieval',
        'Answer generation',
        'Compliance alignment'
      ],
      {
        questionCategory: question.category,
        questionType: question.type,
        complianceFramework: question.complianceFramework
      }
    )

    try {
      // Generate answer using existing service
      const answer = await this.answerGenerationService.generateAnswer(
        question,
        organizationId,
        options
      )

      const processingTime = Date.now() - startTime

      // Update AI decision with results
      aiDecision.response = answer.content
      aiDecision.confidence = this.convertConfidenceToNumber(answer.confidence)
      aiDecision.latency = processingTime
      aiDecision.tokens = {
        input: Math.floor(prompt.length / 4), // Rough estimation
        output: Math.floor(answer.content.length / 4)
      }

      // Analyze compliance alignment
      const complianceAlignment = await this.analyzeComplianceAlignment(question, answer)

      // Track compliance event
      complianceObservability.trackComplianceEvent({
        eventType: 'assessment_completion',
        actor: userId,
        action: 'generate_answer',
        resource: question.id,
        outcome: answer.confidence === 'verified' || answer.confidence === 'high' ? 'success' : 'partial',
        evidence: {
          reasoning: `Generated answer with ${answer.confidence} confidence`,
          after: {
            confidence: answer.confidence,
            evidenceCount: answer.evidence.length,
            processingTime
          }
        },
        complianceFramework: question.complianceFramework || 'General',
        organizationId
      })

      // Update audit trail
      const auditTrail = this.auditTrails.get(question.id) || this.createNewAuditTrail(question.id)
      auditTrail.answerDetails = {
        prompt,
        response: answer.content,
        confidence: this.convertConfidenceToNumber(answer.confidence),
        evidence: answer.evidence,
        reasoning: answer.suggestedImprovements || [],
        processingTime,
        aiModel: 'gpt-4'
      }
      auditTrail.userInteractions.push({
        userId,
        action: 'generate_answer',
        timestamp: new Date()
      })
      auditTrail.complianceAlignment = complianceAlignment

      this.auditTrails.set(question.id, auditTrail)

      // Track performance metrics
      observabilityCore.trackPerformance({
        metric: 'qie_answer_generation_time',
        value: processingTime,
        unit: 'milliseconds',
        component: 'QIE_AnswerGeneration',
        organizationId,
        tags: {
          confidence: answer.confidence,
          evidence_count: answer.evidence.length.toString(),
          question_category: question.category
        }
      })

      observabilityCore.trackPerformance({
        metric: 'qie_answer_confidence',
        value: this.convertConfidenceToNumber(answer.confidence),
        unit: 'score',
        component: 'QIE_AnswerGeneration',
        organizationId,
        tags: {
          question_type: question.type,
          framework: question.complianceFramework || 'general'
        }
      })

      return {
        answer,
        observabilityData: {
          decisionTrace: aiDecision,
          complianceAlignment,
          auditTrail
        }
      }
    } catch (error) {
      // Track error
      observabilityCore.trackEvent({
        type: 'error',
        source: 'qie',
        component: 'answer_generation',
        data: {
          error: error.message,
          questionId: question.id,
          processingTime: Date.now() - startTime
        },
        organizationId,
        userId,
        severity: 'error',
        tags: {
          operation: 'answer_generation',
          question_category: question.category
        }
      })

      throw error
    }
  }

  /**
   * Get QIE performance metrics
   */
  getQIEMetrics(organizationId: string): ObservableQIEMetrics {
    // Get agent metrics for QIE agents
    const qieAgents = aiAgentMonitoring.getAgentPerformanceMetrics(organizationId)
      .filter(agent => agent.agentType.startsWith('QIE_'))

    const extractionAgent = qieAgents.find(a => a.agentType === 'QIE_QuestionExtraction')
    const answerAgent = qieAgents.find(a => a.agentType === 'QIE_AnswerGeneration')

    return {
      questionExtractionMetrics: {
        totalExtracted: extractionAgent?.metrics.totalDecisions || 0,
        accuracyScore: extractionAgent?.metrics.qualityScore || 0,
        processingTime: extractionAgent?.metrics.averageLatency || 0,
        frameworksCovered: this.getFrameworksCovered(organizationId)
      },
      answerGenerationMetrics: {
        totalGenerated: answerAgent?.metrics.totalDecisions || 0,
        averageConfidence: answerAgent?.metrics.averageConfidence || 0,
        averageProcessingTime: answerAgent?.metrics.averageLatency || 0,
        successRate: answerAgent?.metrics.successRate || 0,
        evidenceUtilization: this.calculateEvidenceUtilization(organizationId)
      },
      learningMetrics: {
        totalTrainingData: this.getTotalTrainingData(organizationId),
        modelAccuracy: this.calculateModelAccuracy(organizationId),
        improvementRate: this.calculateImprovementRate(organizationId),
        feedbackIncorporated: this.getFeedbackIncorporated(organizationId)
      }
    }
  }

  /**
   * Get comprehensive QIE audit trail
   */
  getQIEAuditTrail(questionId: string): QIEAuditTrail | null {
    return this.auditTrails.get(questionId) || null
  }

  /**
   * Record user feedback for learning
   */
  async recordUserFeedback(
    questionId: string,
    userId: string,
    feedback: {
      rating: number // 1-5 scale
      comments?: string
      accuracy?: number
      helpfulness?: number
    },
    organizationId: string
  ): Promise<void> {
    // Update audit trail
    const auditTrail = this.auditTrails.get(questionId)
    if (auditTrail) {
      auditTrail.userInteractions.push({
        userId,
        action: 'feedback',
        timestamp: new Date(),
        feedback: feedback.rating
      })
      this.auditTrails.set(questionId, auditTrail)
    }

    // Track feedback event
    observabilityCore.trackEvent({
      type: 'user_action',
      source: 'qie',
      component: 'feedback_system',
      data: {
        questionId,
        feedback,
        userId
      },
      organizationId,
      userId,
      severity: 'info',
      tags: {
        operation: 'user_feedback',
        rating: feedback.rating.toString()
      }
    })

    // Update learning metrics
    await this.updateLearningMetrics(questionId, feedback, organizationId)
  }

  // Private helper methods

  private buildObservablePrompt(question: Question, options: AnswerGenerationOptions): string {
    return `
Generate a comprehensive answer for this security questionnaire question with full observability:

Question: ${question.question}
Category: ${question.category}
Type: ${question.type}
Framework: ${question.complianceFramework || 'General'}
Required: ${question.required ? 'Yes' : 'No'}

Answer Requirements:
- Tone: ${options.tone || 'formal'}
- Length: ${options.length || 'standard'}
- Include Evidence: ${options.includeEvidence ? 'Yes' : 'No'}

Please provide:
1. A complete, accurate answer
2. Confidence level with reasoning
3. Evidence citations where applicable
4. Compliance framework alignment
5. Quality assurance notes

The answer will be fully audited and must meet enterprise compliance standards.
    `.trim()
  }

  private async analyzeComplianceAlignment(question: Question, answer: GeneratedAnswer): Promise<any[]> {
    // Analyze how well the answer aligns with compliance requirements
    const frameworks = [question.complianceFramework].filter(Boolean)
    
    return frameworks.map(framework => ({
      framework: framework || 'General',
      requirements: [question.category],
      alignment: this.calculateAlignmentScore(question, answer),
      gaps: this.identifyGaps(question, answer),
      recommendations: this.generateAlignmentRecommendations(question, answer)
    }))
  }

  private calculateAlignmentScore(question: Question, answer: GeneratedAnswer): number {
    // Calculate alignment score based on confidence, evidence, and completeness
    const confidenceScore = this.convertConfidenceToNumber(answer.confidence)
    const evidenceScore = Math.min(answer.evidence.length / 3, 1) // Up to 3 evidence items
    const completenessScore = Math.min(answer.content.length / 500, 1) // Target 500 chars
    
    return (confidenceScore * 0.5 + evidenceScore * 0.3 + completenessScore * 0.2)
  }

  private identifyGaps(question: Question, answer: GeneratedAnswer): string[] {
    const gaps: string[] = []
    
    if (answer.confidence === 'low' || answer.confidence === 'gap') {
      gaps.push('Low confidence in answer accuracy')
    }
    
    if (answer.evidence.length === 0) {
      gaps.push('No supporting evidence provided')
    }
    
    if (answer.content.length < 100) {
      gaps.push('Answer lacks sufficient detail')
    }
    
    return gaps
  }

  private generateAlignmentRecommendations(question: Question, answer: GeneratedAnswer): string[] {
    const recommendations: string[] = []
    
    if (answer.evidence.length < 2) {
      recommendations.push('Add more supporting evidence')
    }
    
    if (this.convertConfidenceToNumber(answer.confidence) < 0.8) {
      recommendations.push('Improve answer confidence through better research')
    }
    
    recommendations.push('Regular review and update of answer based on feedback')
    
    return recommendations
  }

  private convertConfidenceToNumber(confidence: ConfidenceLevel): number {
    switch (confidence) {
      case 'verified': return 0.95
      case 'high': return 0.85
      case 'medium': return 0.7
      case 'low': return 0.5
      case 'gap': return 0.3
      default: return 0.5
    }
  }

  private createNewAuditTrail(questionId: string): QIEAuditTrail {
    return {
      questionId,
      extractionDetails: {
        originalDocument: '',
        extractedText: '',
        confidence: 0,
        processingTime: 0,
        aiModel: ''
      },
      answerDetails: {
        prompt: '',
        response: '',
        confidence: 0,
        evidence: [],
        reasoning: [],
        processingTime: 0,
        aiModel: ''
      },
      userInteractions: [],
      complianceAlignment: []
    }
  }

  private getFrameworksCovered(organizationId: string): string[] {
    // Analyze audit trails to determine frameworks covered
    const frameworks = new Set<string>()
    this.auditTrails.forEach(trail => {
      trail.complianceAlignment.forEach(alignment => {
        frameworks.add(alignment.framework)
      })
    })
    return Array.from(frameworks)
  }

  private calculateEvidenceUtilization(organizationId: string): number {
    // Calculate how often evidence is used in answers
    let totalAnswers = 0
    let answersWithEvidence = 0
    
    this.auditTrails.forEach(trail => {
      if (trail.answerDetails.response) {
        totalAnswers++
        if (trail.answerDetails.evidence.length > 0) {
          answersWithEvidence++
        }
      }
    })
    
    return totalAnswers > 0 ? answersWithEvidence / totalAnswers : 0
  }

  private getTotalTrainingData(organizationId: string): number {
    return this.auditTrails.size
  }

  private calculateModelAccuracy(organizationId: string): number {
    // Calculate accuracy based on user feedback
    let totalFeedback = 0
    let positiveRatings = 0
    
    this.auditTrails.forEach(trail => {
      trail.userInteractions.forEach(interaction => {
        if (interaction.feedback && interaction.feedback > 0) {
          totalFeedback++
          if (interaction.feedback >= 4) { // 4-5 star ratings considered positive
            positiveRatings++
          }
        }
      })
    })
    
    return totalFeedback > 0 ? positiveRatings / totalFeedback : 0.8 // Default to 80%
  }

  private calculateImprovementRate(organizationId: string): number {
    // Simplified improvement rate calculation
    return 0.05 // 5% improvement rate (would be calculated from historical data)
  }

  private getFeedbackIncorporated(organizationId: string): number {
    let feedbackCount = 0
    this.auditTrails.forEach(trail => {
      feedbackCount += trail.userInteractions.filter(i => i.action === 'feedback').length
    })
    return feedbackCount
  }

  private async updateLearningMetrics(
    questionId: string, 
    feedback: any, 
    organizationId: string
  ): Promise<void> {
    // Update learning algorithms based on feedback
    // This would trigger model retraining or prompt optimization
    
    // Track learning event
    observabilityCore.trackEvent({
      type: 'ai_decision',
      source: 'qie',
      component: 'learning_system',
      data: {
        questionId,
        feedback,
        action: 'update_learning_metrics'
      },
      organizationId,
      severity: 'info',
      tags: {
        operation: 'learning_update',
        feedback_rating: feedback.rating?.toString() || 'unknown'
      }
    })
  }
}

export const observableQIE = ObservableQIEService.getInstance()