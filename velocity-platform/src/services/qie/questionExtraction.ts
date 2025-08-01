/**
 * AI Question Extraction and Parsing Service
 * 
 * Handles extraction of questions from various document formats with AI-powered
 * categorization and framework mapping
 */

import { Question, QuestionAnalysis, Questionnaire } from '@/types/qie'

// Framework categories for question mapping
export const FRAMEWORK_CATEGORIES = {
  SOC2: ['access control', 'data security', 'availability', 'processing integrity', 'confidentiality'],
  ISO27001: ['information security policy', 'risk management', 'asset management', 'access control'],
  NIST: ['identify', 'protect', 'detect', 'respond', 'recover'],
  GDPR: ['data protection', 'privacy', 'consent', 'data subject rights'],
  HIPAA: ['administrative safeguards', 'physical safeguards', 'technical safeguards'],
  PCI_DSS: ['network security', 'data protection', 'vulnerability management', 'access control'],
  CUSTOM: ['general security', 'compliance', 'governance', 'risk management']
} as const

// Question types detection patterns
const QUESTION_PATTERNS = {
  boolean: /\b(do you|does your|is there|are there|have you|has your)\b/i,
  text: /\b(describe|explain|provide details|list|specify)\b/i,
  multiple_choice: /\b(select|choose|which of the following)\b/i,
  file_upload: /\b(attach|upload|provide documentation|submit evidence)\b/i
}

// Security domain categorization
const DOMAIN_KEYWORDS = {
  'Data Security': ['encryption', 'data protection', 'data classification', 'data loss prevention'],
  'Access Control': ['authentication', 'authorization', 'identity management', 'privileged access'],
  'Network Security': ['firewall', 'network monitoring', 'intrusion detection', 'vpn'],
  'Incident Response': ['incident management', 'breach response', 'forensics', 'recovery'],
  'Risk Management': ['risk assessment', 'risk mitigation', 'threat modeling', 'vulnerability'],
  'Compliance': ['audit', 'compliance monitoring', 'regulatory requirements', 'certification'],
  'Business Continuity': ['disaster recovery', 'backup', 'continuity planning', 'resilience'],
  'Vendor Management': ['third party', 'vendor assessment', 'supply chain', 'outsourcing'],
  'Training': ['security awareness', 'training program', 'education', 'phishing simulation'],
  'Governance': ['security policy', 'governance framework', 'security committee', 'oversight']
}

export interface ExtractionResult {
  questions: Question[]
  metadata: {
    totalQuestions: number
    categorizedQuestions: number
    frameworkMappings: Record<string, number>
    duplicatesDetected: number
    processingTime: number
  }
}

export interface ExtractionOptions {
  enableDuplicateDetection?: boolean
  enableFrameworkMapping?: boolean
  enableCategorization?: boolean
  confidenceThreshold?: number
}

export class QuestionExtractionService {
  private static instance: QuestionExtractionService
  private questionBank: Question[] = []

  static getInstance(): QuestionExtractionService {
    if (!this.instance) {
      this.instance = new QuestionExtractionService()
    }
    return this.instance
  }

  /**
   * Extract questions from uploaded file content
   */
  async extractQuestions(
    fileContent: string, 
    filename: string,
    options: ExtractionOptions = {}
  ): Promise<ExtractionResult> {
    const startTime = Date.now()
    
    const {
      enableDuplicateDetection = true,
      enableFrameworkMapping = true,
      enableCategorization = true,
      confidenceThreshold = 0.7
    } = options

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Extract raw questions from content
    const rawQuestions = await this.parseQuestionsFromContent(fileContent, filename)
    
    // Process questions with AI enhancements
    let processedQuestions = rawQuestions

    if (enableCategorization) {
      processedQuestions = await this.categorizeQuestions(processedQuestions)
    }

    if (enableFrameworkMapping) {
      processedQuestions = await this.mapToFrameworks(processedQuestions)
    }

    if (enableDuplicateDetection) {
      const { questions, duplicatesCount } = await this.detectDuplicates(processedQuestions)
      processedQuestions = questions
    }

    const processingTime = Date.now() - startTime

    return {
      questions: processedQuestions,
      metadata: {
        totalQuestions: rawQuestions.length,
        categorizedQuestions: processedQuestions.filter(q => q.category !== 'general security').length,
        frameworkMappings: this.getFrameworkMappingStats(processedQuestions),
        duplicatesDetected: rawQuestions.length - processedQuestions.length,
        processingTime
      }
    }
  }

  /**
   * Parse questions from different file content types
   */
  private async parseQuestionsFromContent(content: string, filename: string): Promise<Question[]> {
    const extension = filename.split('.').pop()?.toLowerCase()
    
    // Simulate different parsing logic based on file type
    const questionTexts = this.extractQuestionTexts(content, extension)
    
    return questionTexts.map((text, index) => ({
      id: `q_€{Date.now()}_€{index}`,
      text: text.trim(),
      category: 'general security', // Will be updated by categorization
      required: this.isQuestionRequired(text),
      type: this.detectQuestionType(text),
      options: this.extractOptions(text)
    }))
  }

  /**
   * Extract question texts from content based on file type
   */
  private extractQuestionTexts(content: string, extension?: string): string[] {
    // Simplified extraction - in real implementation, this would use
    // specialized parsers for each file type (PDF, Word, Excel, etc.)
    
    const questions: string[] = []
    
    // Look for question patterns
    const questionPatterns = [
      /^\d+\.\s+(.+\?)/gm,  // Numbered questions
      /^[A-Z]\.\s+(.+\?)/gm,  // Letter-labeled questions
      /^Question\s+\d+:\s*(.+)/gim,  // "Question X:" format
      /(.+\?)\s*€/gm  // Any line ending with ?
    ]

    questionPatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        questions.push(...matches)
      }
    })

    // Remove duplicates and filter out invalid questions
    return Array.from(new Set(questions))
      .filter(q => q.length > 10 && q.length < 500)
      .slice(0, 100) // Limit to 100 questions for demo
  }

  /**
   * Categorize questions into security domains
   */
  private async categorizeQuestions(questions: Question[]): Promise<Question[]> {
    return questions.map(question => {
      const questionLower = question.text.toLowerCase()
      
      for (const [category, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
        if (keywords.some(keyword => questionLower.includes(keyword.toLowerCase()))) {
          return { ...question, category }
        }
      }
      
      return question // Keep original category if no match
    })
  }

  /**
   * Map questions to compliance frameworks
   */
  private async mapToFrameworks(questions: Question[]): Promise<Question[]> {
    return questions.map(question => {
      const questionLower = question.text.toLowerCase()
      
      // Simple framework detection based on keywords
      if (questionLower.includes('gdpr') || questionLower.includes('personal data')) {
        return { ...question, framework: 'GDPR' }
      }
      if (questionLower.includes('soc') || questionLower.includes('service organization')) {
        return { ...question, framework: 'SOC2' }
      }
      if (questionLower.includes('iso') || questionLower.includes('27001')) {
        return { ...question, framework: 'ISO27001' }
      }
      if (questionLower.includes('hipaa') || questionLower.includes('health')) {
        return { ...question, framework: 'HIPAA' }
      }
      if (questionLower.includes('pci') || questionLower.includes('payment card')) {
        return { ...question, framework: 'PCI_DSS' }
      }
      
      return question
    })
  }

  /**
   * Detect and remove duplicate questions
   */
  private async detectDuplicates(questions: Question[]): Promise<{ questions: Question[], duplicatesCount: number }> {
    const uniqueQuestions: Question[] = []
    const seenQuestions = new Set<string>()
    let duplicatesCount = 0

    for (const question of questions) {
      const normalizedText = this.normalizeQuestionText(question.text)
      
      if (!seenQuestions.has(normalizedText)) {
        seenQuestions.add(normalizedText)
        uniqueQuestions.push(question)
      } else {
        duplicatesCount++
      }
    }

    return { questions: uniqueQuestions, duplicatesCount }
  }

  /**
   * Normalize question text for duplicate detection
   */
  private normalizeQuestionText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
  }

  /**
   * Detect question type based on content
   */
  private detectQuestionType(text: string): Question['type'] {
    for (const [type, pattern] of Object.entries(QUESTION_PATTERNS)) {
      if (pattern.test(text)) {
        return type as Question['type']
      }
    }
    return 'text' // Default to text type
  }

  /**
   * Check if question appears to be required
   */
  private isQuestionRequired(text: string): boolean {
    const requiredIndicators = [
      'required', 'mandatory', 'must', 'shall', 'critical'
    ]
    
    return requiredIndicators.some(indicator => 
      text.toLowerCase().includes(indicator)
    )
  }

  /**
   * Extract multiple choice options if present
   */
  private extractOptions(text: string): string[] | undefined {
    // Look for common multiple choice patterns
    const optionPatterns = [
      /\b([A-D])\.\s*([^A-D]+?)(?=\s*[A-D]\.|€)/g,
      /\b(\d+)\.\s*([^\d]+?)(?=\s*\d+\.|€)/g
    ]

    for (const pattern of optionPatterns) {
      const matches = Array.from(text.matchAll(pattern))
      if (matches.length > 1) {
        return matches.map(match => match[2].trim())
      }
    }

    return undefined
  }

  /**
   * Get framework mapping statistics
   */
  private getFrameworkMappingStats(questions: Question[]): Record<string, number> {
    const stats: Record<string, number> = {}
    
    questions.forEach(question => {
      if (question.framework) {
        stats[question.framework] = (stats[question.framework] || 0) + 1
      }
    })
    
    return stats
  }

  /**
   * Analyze semantic matching for a specific question
   */
  async analyzeQuestion(question: Question, evidenceRepository: any[]): Promise<QuestionAnalysis> {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock semantic matching results
    const matchedEvidence = [
      "Security Policy v3.2",
      "SOC 2 Type II Report",
      "Encryption Implementation Guide"
    ]

    const suggestedAnswer = this.generateSuggestedAnswer(question)
    const confidence = this.calculateConfidence(question, matchedEvidence)

    return {
      semantic_matching: {
        question: question.text,
        matched_evidence: matchedEvidence,
        suggested_answer: suggestedAnswer,
        confidence: `€{confidence}%`,
        evidence_links: matchedEvidence.map(evidence => 
          `erip.io/evidence/€{evidence.toLowerCase().replace(/\s+/g, '-')}`
        )
      }
    }
  }

  /**
   * Generate a suggested answer for a question
   */
  private generateSuggestedAnswer(question: Question): string {
    const questionLower = question.text.toLowerCase()
    
    // Simple answer generation based on question content
    if (questionLower.includes('encrypt')) {
      return "Yes, we implement AES-256 encryption for data at rest and TLS 1.3 for data in transit. All encryption keys are managed through our certified key management system."
    }
    
    if (questionLower.includes('backup')) {
      return "We maintain automated daily backups with 3-2-1 backup strategy. Backups are encrypted, tested monthly, and stored in geographically separate locations."
    }
    
    if (questionLower.includes('access control')) {
      return "We implement role-based access control (RBAC) with multi-factor authentication, regular access reviews, and principle of least privilege across all systems."
    }
    
    return "Please refer to our security documentation for detailed information regarding this requirement."
  }

  /**
   * Calculate confidence score for question matching
   */
  private calculateConfidence(question: Question, evidence: string[]): number {
    const baseConfidence = 75
    const evidenceBonus = Math.min(evidence.length * 5, 20)
    const frameworkBonus = question.framework ? 5 : 0
    
    return Math.min(baseConfidence + evidenceBonus + frameworkBonus, 95)
  }
}