/**
 * ERIP Questionnaire Intelligence Engine (QIE) Types
 * 
 * Type definitions for the QIE system that transforms security questionnaires
 * from time-consuming blockers into automated accelerators.
 */

// Supported file formats for questionnaire upload
export interface QuestionnaireUpload {
  supported_formats: {
    documents: ["PDF", "Word", "Excel", "Google Sheets"]
    structured: ["JSON", "CSV", "XML"]
    portals: ["OneTrust", "Whistic", "Vendorpedia integration"]
  }
  
  ai_extraction: {
    question_parsing: string
    categorization: string
    duplicate_detection: string
    requirement_mapping: string
  }
}

// Confidence levels for answer generation
export type ConfidenceLevel = 'verified' | 'high' | 'medium' | 'low' | 'gap'

export interface ConfidenceMetrics {
  verified: string // "100% - Direct evidence available"
  high: string     // "90%+ - Strong supporting documentation"
  medium: string   // "70-89% - Partial evidence, needs review"
  low: string      // "<70% - Requires manual input"
  gap: string      // "No data - Flags for immediate attention"
}

// Answer generation interface
export interface AnswerGeneration {
  answer_sources: {
    trust_equity_data: string
    evidence_repository: string
    previous_answers: string
    expert_knowledge: string
    ai_generation: string
  }
  
  confidence_levels: ConfidenceMetrics
}

// Individual question analysis
export interface QuestionAnalysis {
  semantic_matching: {
    question: string
    matched_evidence: string[]
    suggested_answer: string
    confidence: string
    evidence_links: string[]
  }
}

// Answer customization and review
export interface ReviewInterface {
  answer_customization: {
    tone_adjustment: 'Formal' | 'Conversational' | 'Technical'
    length_control: 'Concise' | 'Detailed' | 'Custom'
    customer_specific: string
    version_control: string
  }
  
  collaboration: {
    team_review: string
    expert_review: string
    approval_workflow: string
    audit_trail: string
  }
}

// Question bank intelligence
export interface QuestionBank {
  pattern_recognition: {
    common_questions: string
    best_answers: string
    evolution_tracking: string
    predicitive_prep: string
  }
  
  benchmarking: {
    industry_standards: string
    win_rate_analysis: string
    red_flag_detection: string
    optimization_tips: string
  }
}

// Continuous learning system
export interface LearningSystem {
  feedback_loop: {
    buyer_reactions: string
    follow_up_patterns: string
    success_metrics: string
    improvement_suggestions: string
  }
  
  organizational_memory: {
    answer_evolution: string
    team_knowledge: string
    expert_insights: string
    compliance_updates: string
  }
}

// ROI metrics
export interface QIE_ROI {
  time_savings: {
    traditional: string
    with_qie: string
    savings: string
  }
  
  accuracy_improvement: {
    human_error_reduction: string
    evidence_attachment: string
    update_propagation: string
  }
  
  sales_acceleration: {
    response_time: string
    win_rate_increase: string
    deal_velocity: string
  }
}

// Core entities for the QIE system
export interface Question {
  id: string
  text: string
  category: string
  framework?: string
  section?: string
  required: boolean
  type: 'text' | 'boolean' | 'multiple_choice' | 'file_upload'
  options?: string[]
}

export interface Answer {
  id: string
  questionId: string
  text: string
  confidence: ConfidenceLevel
  confidenceScore: number
  evidence: Evidence[]
  lastUpdated: Date
  reviewer?: string
  status: 'draft' | 'reviewed' | 'approved' | 'rejected'
}

export interface Evidence {
  id: string
  title: string
  description: string
  type: 'document' | 'policy' | 'certificate' | 'report'
  url: string
  lastUpdated: Date
  verificationStatus: 'verified' | 'pending' | 'expired'
}

export interface Questionnaire {
  id: string
  title: string
  description: string
  source: string
  uploadDate: Date
  status: 'processing' | 'ready' | 'in_review' | 'completed'
  questions: Question[]
  answers: Answer[]
  completionPercentage: number
  dueDate?: Date
  assignee?: string
}

export interface QIEWorkflow {
  id: string
  questionnaireId: string
  currentStep: 'upload' | 'analysis' | 'enhancement' | 'review' | 'complete'
  progress: number
  startDate: Date
  estimatedCompletion?: Date
  participants: string[]
}

// Event types for the QIE system
export type QIEEvent = 
  | { type: 'QUESTIONNAIRE_UPLOADED'; payload: { questionnaireId: string; filename: string } }
  | { type: 'QUESTIONS_EXTRACTED'; payload: { questionnaireId: string; questionCount: number } }
  | { type: 'ANSWERS_GENERATED'; payload: { questionnaireId: string; answeredCount: number } }
  | { type: 'ANSWER_REVIEWED'; payload: { answerId: string; status: Answer['status'] } }
  | { type: 'QUESTIONNAIRE_SUBMITTED'; payload: { questionnaireId: string; submissionDate: Date } }