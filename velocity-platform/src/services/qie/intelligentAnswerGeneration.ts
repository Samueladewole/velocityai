/**
 * Intelligent Answer Generation Service
 * 
 * AI-powered answer generation that pulls from Trust Equity data,
 * matches previous answers, and generates confidence scores.
 */

import { Question, Answer, Evidence, ConfidenceLevel } from '@/types/qie'
// import { TrustScoreCalculator } from '../trustEquity/trustScoreCalculator'
import { AIService, aiService } from '../ai'
import { EnhancedQuestionExtractionService } from './enhancedQuestionExtraction'

export interface AnswerGenerationOptions {
  tone?: 'formal' | 'conversational' | 'technical' | 'concise'
  length?: 'brief' | 'standard' | 'detailed'
  includeEvidence?: boolean
  maxEvidenceItems?: number
}

export interface AnswerMatch {
  questionId: string
  question: string
  answer: string
  confidence: number
  source: string
  usedCount: number
  lastUsed: Date
  effectiveness: number
}

export interface GeneratedAnswer {
  content: string
  confidence: ConfidenceLevel
  evidence: Evidence[]
  source: {
    type: 'previous' | 'ai' | 'template' | 'manual'
    generator: string
    matchScore: number
    lastUsed?: string
  }
  suggestedImprovements?: string[]
  metadata: {
    tone: string
    length: string
    generatedAt: string
    processingTime: number
  }
}

export class IntelligentAnswerGenerationService {
  private trustCalculator: any
  private aiService: AIService
  private extractionService: EnhancedQuestionExtractionService
  private answerBank: Map<string, AnswerMatch[]> = new Map()
  private learningData: Map<string, number> = new Map() // questionHash -> effectiveness

  constructor() {
    this.trustCalculator = null // Disabled for browser compatibility
    this.aiService = aiService
    this.extractionService = new EnhancedQuestionExtractionService()
    this.initializeAnswerBank()
  }

  /**
   * Generate intelligent answer for a question
   */
  async generateAnswer(
    question: Question,
    organizationId: string,
    options: AnswerGenerationOptions = {}
  ): Promise<GeneratedAnswer> {
    const startTime = Date.now()
    
    // 1. Search for previous similar answers
    const previousMatches = await this.findSimilarAnswers(question)
    
    // 2. Pull relevant Trust Equity data
    const trustData = await this.getTrustEquityData(organizationId, question)
    
    // 3. Find matching evidence
    const evidence = await this.findRelevantEvidence(question, organizationId)
    
    // 4. Generate or select answer
    let answer: GeneratedAnswer
    
    if (previousMatches.length > 0 && previousMatches[0].confidence > 0.85) {
      // Use previous answer with high confidence
      answer = await this.adaptPreviousAnswer(previousMatches[0], question, options)
    } else {
      // Generate new answer using AI
      answer = await this.generateNewAnswer(question, trustData, evidence, options)
    }
    
    // 5. Apply learning improvements
    answer = await this.applyLearningImprovements(answer, question)
    
    // 6. Record generation metrics
    answer.metadata.processingTime = Date.now() - startTime
    
    return answer
  }

  /**
   * Find similar answers from answer bank
   */
  private async findSimilarAnswers(question: Question): Promise<AnswerMatch[]> {
    const questionHash = this.hashQuestion(question)
    const existingMatches = this.answerBank.get(questionHash) || []
    
    // Semantic similarity search
    const semanticMatches = await this.semanticSearch(question.question, Array.from(this.answerBank.values()).flat())
    
    // Combine and rank matches
    const allMatches = [...existingMatches, ...semanticMatches]
      .filter((match, index, self) => 
        index === self.findIndex(m => m.questionId === match.questionId)
      )
      .sort((a, b) => b.confidence * b.effectiveness - a.confidence * a.effectiveness)
    
    return allMatches.slice(0, 5)
  }

  /**
   * Get relevant Trust Equity data for the question
   */
  private async getTrustEquityData(organizationId: string, question: Question): Promise<any> {
    const trustData = this.trustCalculator.exportData(organizationId)
    
    // Filter relevant data based on question category and framework
    const relevantData = {
      score: trustData.currentScore,
      breakdown: trustData.breakdown,
      activities: trustData.activities.filter(activity => 
        this.isActivityRelevant(activity, question)
      ),
      profile: trustData.profile
    }
    
    return relevantData
  }

  /**
   * Find relevant evidence from Trust Equity system
   */
  private async findRelevantEvidence(
    question: Question,
    organizationId: string
  ): Promise<Evidence[]> {
    // Mock evidence retrieval - in production, this would query actual document store
    const evidencePool: Evidence[] = [
      {
        id: 'ev1',
        title: 'Information Security Policy',
        type: 'policy',
        source: 'trust-equity',
        url: '/documents/security-policy.pdf',
        relevanceScore: 0.95,
        lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ev2',
        title: 'SOC2 Type II Report',
        type: 'certification',
        source: 'trust-equity',
        url: '/documents/soc2-report.pdf',
        relevanceScore: 0.90,
        lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ev3',
        title: 'Penetration Test Results',
        type: 'assessment',
        source: 'trust-equity',
        url: '/documents/pentest-results.pdf',
        relevanceScore: 0.85,
        lastUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    // Filter evidence based on question requirements
    return evidencePool
      .filter(e => this.isEvidenceRelevant(e, question))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3)
  }

  /**
   * Adapt a previous answer for the current question
   */
  private async adaptPreviousAnswer(
    match: AnswerMatch,
    question: Question,
    options: AnswerGenerationOptions
  ): Promise<GeneratedAnswer> {
    const adaptedContent = await this.aiService.processTask({
      type: 'text_generation',
      prompt: `Adapt this previous answer for a similar question:
        
        Previous Question: €{match.question}
        Previous Answer: €{match.answer}
        
        New Question: €{question.question}
        Context: €{question.context || 'Security questionnaire'}
        Tone: €{options.tone || 'formal'}
        Length: €{options.length || 'standard'}
        
        Adapt the answer to precisely address the new question while maintaining accuracy.`,
      context: {
        framework: question.complianceFramework,
        category: question.category
      }
    })
    
    return {
      content: adaptedContent.result,
      confidence: this.calculateConfidence(match.confidence, adaptedContent.confidence),
      evidence: [],
      source: {
        type: 'previous',
        generator: 'answer-adaptation',
        matchScore: match.confidence,
        lastUsed: match.lastUsed.toISOString()
      },
      metadata: {
        tone: options.tone || 'formal',
        length: options.length || 'standard',
        generatedAt: new Date().toISOString(),
        processingTime: 0
      }
    }
  }

  /**
   * Generate new answer using AI
   */
  private async generateNewAnswer(
    question: Question,
    trustData: any,
    evidence: Evidence[],
    options: AnswerGenerationOptions
  ): Promise<GeneratedAnswer> {
    const prompt = this.buildAnswerPrompt(question, trustData, evidence, options)
    
    const aiResponse = await this.aiService.processTask({
      type: 'question_answering',
      prompt,
      context: {
        organizationData: trustData,
        evidence: evidence.map(e => ({ title: e.title, type: e.type }))
      }
    })
    
    // Extract confidence from AI response
    const confidence = this.extractConfidenceLevel(aiResponse)
    
    return {
      content: aiResponse.result,
      confidence,
      evidence: options.includeEvidence ? evidence : [],
      source: {
        type: 'ai',
        generator: aiResponse.model,
        matchScore: aiResponse.confidence
      },
      suggestedImprovements: this.generateImprovementSuggestions(question, aiResponse.result),
      metadata: {
        tone: options.tone || 'formal',
        length: options.length || 'standard',
        generatedAt: new Date().toISOString(),
        processingTime: 0
      }
    }
  }

  /**
   * Apply learning-based improvements to answer
   */
  private async applyLearningImprovements(
    answer: GeneratedAnswer,
    question: Question
  ): Promise<GeneratedAnswer> {
    const questionHash = this.hashQuestion(question)
    const effectiveness = this.learningData.get(questionHash) || 0.5
    
    if (effectiveness < 0.7) {
      // Low effectiveness - suggest improvements
      answer.suggestedImprovements = [
        ...(answer.suggestedImprovements || []),
        'Consider adding more specific details',
        'Include quantitative metrics if available',
        'Reference recent compliance assessments'
      ]
    }
    
    return answer
  }

  /**
   * Build AI prompt for answer generation
   */
  private buildAnswerPrompt(
    question: Question,
    trustData: any,
    evidence: Evidence[],
    options: AnswerGenerationOptions
  ): string {
    return `Generate a €{options.tone || 'formal'} answer for this security questionnaire question:

Question: €{question.question}
Category: €{question.category}
Framework: €{question.complianceFramework || 'General'}
Type: €{question.type}

Organization Trust Score: €{trustData.score}/100
Relevant Activities: €{trustData.activities.length} recent security activities

Available Evidence:
€{evidence.map(e => `- €{e.title} (€{e.type})`).join('\n')}

Requirements:
- Answer length: €{options.length || 'standard'}
- Be accurate and specific
- Reference evidence where applicable
- Use appropriate security terminology
- Address all aspects of the question

Generate a comprehensive answer that demonstrates security maturity.`
  }

  /**
   * Calculate combined confidence level
   */
  private calculateConfidence(matchConfidence: number, aiConfidence: number): ConfidenceLevel {
    const combined = (matchConfidence + aiConfidence) / 2
    
    if (combined >= 0.9) return 'verified'
    if (combined >= 0.8) return 'high'
    if (combined >= 0.6) return 'medium'
    if (combined >= 0.4) return 'low'
    return 'gap'
  }

  /**
   * Extract confidence level from AI response
   */
  private extractConfidenceLevel(aiResponse: any): ConfidenceLevel {
    const confidence = aiResponse.confidence || 0.7
    
    if (confidence >= 0.9) return 'verified'
    if (confidence >= 0.8) return 'high'
    if (confidence >= 0.6) return 'medium'
    if (confidence >= 0.4) return 'low'
    return 'gap'
  }

  /**
   * Generate improvement suggestions
   */
  private generateImprovementSuggestions(question: Question, answer: string): string[] {
    const suggestions: string[] = []
    
    // Check answer length
    if (answer.length < 100) {
      suggestions.push('Consider providing more detail')
    }
    
    // Check for specific elements
    if (!answer.includes('policy') && question.category === 'Data Security') {
      suggestions.push('Reference relevant security policies')
    }
    
    if (!answer.match(/\d+/) && question.type === 'text') {
      suggestions.push('Include specific metrics or timeframes')
    }
    
    return suggestions
  }

  /**
   * Semantic search for similar questions
   */
  private async semanticSearch(query: string, answers: AnswerMatch[]): Promise<AnswerMatch[]> {
    // Simple keyword matching - in production, use vector embeddings
    const queryWords = query.toLowerCase().split(/\s+/)
    
    return answers
      .map(answer => ({
        ...answer,
        similarity: this.calculateSimilarity(queryWords, answer.question.toLowerCase().split(/\s+/))
      }))
      .filter(a => a.similarity > 0.5)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10)
  }

  /**
   * Calculate word-based similarity
   */
  private calculateSimilarity(words1: string[], words2: string[]): number {
    const set1 = new Set(words1)
    const set2 = new Set(words2)
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    return intersection.size / union.size
  }

  /**
   * Hash question for lookup
   */
  private hashQuestion(question: Question): string {
    const normalized = question.question
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .sort()
      .join(' ')
    
    return `€{question.category}:€{question.complianceFramework}:€{normalized}`
  }

  /**
   * Check if activity is relevant to question
   */
  private isActivityRelevant(activity: any, question: Question): boolean {
    // Check category match
    if (activity.category && activity.category === question.category) {
      return true
    }
    
    // Check framework match
    if (activity.framework && activity.framework === question.complianceFramework) {
      return true
    }
    
    // Keyword matching
    const activityText = `€{activity.name} €{activity.description}`.toLowerCase()
    const questionWords = question.question.toLowerCase().split(/\s+/)
    
    return questionWords.some(word => activityText.includes(word))
  }

  /**
   * Check if evidence is relevant to question
   */
  private isEvidenceRelevant(evidence: Evidence, question: Question): boolean {
    // Type-based relevance
    const typeRelevance: Record<string, string[]> = {
      'policy': ['policy', 'procedure', 'governance'],
      'certification': ['compliance', 'certification', 'audit'],
      'assessment': ['test', 'assessment', 'scan', 'vulnerability']
    }
    
    const relevantTypes = typeRelevance[evidence.type] || []
    const questionLower = question.question.toLowerCase()
    
    return relevantTypes.some(type => questionLower.includes(type))
  }

  /**
   * Initialize answer bank with common patterns
   */
  private initializeAnswerBank(): void {
    // Common security questionnaire patterns
    const commonPatterns: AnswerMatch[] = [
      {
        questionId: 'pattern_encryption',
        question: 'Do you encrypt data at rest?',
        answer: 'Yes, we implement AES-256 encryption for all data at rest. Our encryption strategy includes database encryption, file system encryption, and encrypted backups. Keys are managed through a dedicated KMS with regular rotation.',
        confidence: 0.95,
        source: 'template',
        usedCount: 45,
        lastUsed: new Date(),
        effectiveness: 0.88
      },
      {
        questionId: 'pattern_mfa',
        question: 'Do you enforce multi-factor authentication?',
        answer: 'Yes, MFA is mandatory for all user accounts. We support TOTP, SMS, and hardware tokens. Administrative accounts require hardware tokens or biometric authentication. MFA is enforced through SAML SSO integration.',
        confidence: 0.93,
        source: 'template',
        usedCount: 38,
        lastUsed: new Date(),
        effectiveness: 0.91
      }
    ]
    
    commonPatterns.forEach(pattern => {
      const hash = this.hashQuestion({
        id: pattern.questionId,
        question: pattern.question,
        category: 'Security',
        type: 'boolean'
      } as Question)
      
      this.answerBank.set(hash, [pattern])
    })
  }

  /**
   * Record answer effectiveness for learning
   */
  recordAnswerEffectiveness(
    questionId: string,
    question: Question,
    effectiveness: number
  ): void {
    const hash = this.hashQuestion(question)
    this.learningData.set(hash, effectiveness)
    
    // Update answer bank effectiveness
    const matches = this.answerBank.get(hash)
    if (matches) {
      matches.forEach(match => {
        if (match.questionId === questionId) {
          match.effectiveness = effectiveness
          match.usedCount++
          match.lastUsed = new Date()
        }
      })
    }
  }

  /**
   * Get learning insights
   */
  getLearningInsights(): {
    totalAnswers: number
    averageEffectiveness: number
    topPatterns: AnswerMatch[]
    improvementAreas: string[]
  } {
    const allAnswers = Array.from(this.answerBank.values()).flat()
    const totalAnswers = allAnswers.reduce((sum, a) => sum + a.usedCount, 0)
    const averageEffectiveness = allAnswers.reduce((sum, a) => sum + a.effectiveness, 0) / allAnswers.length
    
    return {
      totalAnswers,
      averageEffectiveness,
      topPatterns: allAnswers.sort((a, b) => b.usedCount - a.usedCount).slice(0, 5),
      improvementAreas: this.identifyImprovementAreas()
    }
  }

  /**
   * Identify areas needing improvement
   */
  private identifyImprovementAreas(): string[] {
    const areas: string[] = []
    const lowEffectiveness = Array.from(this.learningData.entries())
      .filter(([_, effectiveness]) => effectiveness < 0.6)
    
    if (lowEffectiveness.length > 5) {
      areas.push('Improve answer quality for technical questions')
    }
    
    return areas
  }
}