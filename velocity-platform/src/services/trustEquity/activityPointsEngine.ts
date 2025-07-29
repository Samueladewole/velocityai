/**
 * Activity-to-Points Engine
 * 
 * Maps compliance activities to Trust Equity™ points with intelligent 
 * scoring, evidence validation, and automated point attribution.
 */

import { EventEmitter } from 'events'
import { Logger } from '../../infrastructure/logging/logger'
import { TrustScoreCalculator, TrustActivity, TrustActivityType } from './trustScoreCalculator'
import { MetricsCollector } from '../monitoring/metricsCollector'

export interface ActivityMapping {
  id: string
  activityType: TrustActivityType
  sourceEvent: string
  pointsAwarded: number
  multipliers: {
    categoryMultiplier: number
    frameworkMultiplier: number
    qualityMultiplier: number
    timingMultiplier: number
  }
  validationRequired: boolean
  evidenceAttached: boolean
  automatedValidation: boolean
}

export interface EvidenceDocument {
  id: string
  filename: string
  type: 'policy' | 'procedure' | 'report' | 'certification' | 'assessment' | 'audit'
  uploadedAt: Date
  size: number
  hash: string
  metadata: {
    framework?: string
    category: string
    validatedBy?: string
    validatedAt?: Date
    confidence?: number
  }
  pointsEligible: number
  pointsAwarded: number
}

export interface ContinuousMonitoringMetric {
  id: string
  metricType: 'uptime' | 'security_events' | 'vulnerability_scans' | 'compliance_checks'
  value: number
  threshold: number
  timestamp: Date
  pointsAwarded: number
  status: 'healthy' | 'warning' | 'critical'
}

export interface ExpertContribution {
  id: string
  contributorId: string
  type: 'knowledge_sharing' | 'peer_review' | 'community_answer' | 'best_practice'
  content: string
  framework: string
  upvotes: number
  helpfulnessScore: number
  pointsAwarded: number
  validated: boolean
}

export interface ActivityRule {
  id: string
  name: string
  activityType: TrustActivityType
  conditions: {
    minFileSize?: number
    requiredMetadata?: string[]
    frameworkAlignment?: string[]
    qualityThreshold?: number
  }
  scoring: {
    basePoints: number
    qualityBonus: number
    frameworkBonus: Record<string, number>
    categoryBonus: Record<string, number>
    maxPoints: number
  }
  validation: {
    required: boolean
    automated: boolean
    validatorRole?: string
    criteria?: string[]
  }
}

export class ActivityPointsEngine extends EventEmitter {
  private logger: Logger
  private metricsCollector: MetricsCollector
  private trustCalculator: TrustScoreCalculator
  
  // Activity mappings and rules
  private activityRules: Map<string, ActivityRule> = new Map()
  private evidenceRepository: Map<string, EvidenceDocument> = new Map()
  private continuousMetrics: Map<string, ContinuousMonitoringMetric[]> = new Map()
  private expertContributions: Map<string, ExpertContribution> = new Map()

  // Processing queues
  private processingQueue: Array<{
    organizationId: string
    activity: any
    timestamp: Date
  }> = []

  constructor(trustCalculator: TrustScoreCalculator) {
    super()
    
    this.logger = new Logger('ActivityPointsEngine')
    this.metricsCollector = new MetricsCollector({
      enabled: true,
      exportInterval: 60000,
      labels: { component: 'activity_points_engine' }
    })
    
    this.trustCalculator = trustCalculator
    
    this.initializeDefaultRules()
    this.startProcessingQueue()
    this.startContinuousMonitoring()
  }

  /**
   * Initialize default activity rules
   */
  private initializeDefaultRules(): void {
    const defaultRules: ActivityRule[] = [
      {
        id: 'evidence_upload_rule',
        name: 'Evidence Document Upload',
        activityType: 'evidence_upload',
        conditions: {
          minFileSize: 1024, // 1KB minimum
          requiredMetadata: ['category', 'type']
        },
        scoring: {
          basePoints: 10,
          qualityBonus: 5,
          frameworkBonus: {
            'SOC2': 2,
            'ISO27001': 3,
            'GDPR': 2,
            'HIPAA': 3,
            'PCI_DSS': 2
          },
          categoryBonus: {
            'security': 2,
            'privacy': 2,
            'governance': 1
          },
          maxPoints: 25
        },
        validation: {
          required: false,
          automated: true
        }
      },
      {
        id: 'assessment_completion_rule',
        name: 'Compliance Assessment Completion',
        activityType: 'assessment_completion',
        conditions: {
          qualityThreshold: 0.8
        },
        scoring: {
          basePoints: 50,
          qualityBonus: 25,
          frameworkBonus: {
            'SOC2': 10,
            'ISO27001': 15,
            'GDPR': 10,
            'HIPAA': 15,
            'PCI_DSS': 10
          },
          categoryBonus: {
            'security': 5,
            'privacy': 5,
            'operational': 3
          },
          maxPoints: 100
        },
        validation: {
          required: true,
          automated: false,
          validatorRole: 'compliance_officer'
        }
      },
      {
        id: 'continuous_monitoring_rule',
        name: 'Continuous Monitoring Activity',
        activityType: 'continuous_monitoring',
        conditions: {
          qualityThreshold: 0.9
        },
        scoring: {
          basePoints: 25,
          qualityBonus: 10,
          frameworkBonus: {
            'SOC2': 5,
            'ISO27001': 5,
            'NIST': 3
          },
          categoryBonus: {
            'security': 5,
            'operational': 3
          },
          maxPoints: 50
        },
        validation: {
          required: false,
          automated: true
        }
      },
      {
        id: 'expert_contribution_rule',
        name: 'Expert Community Contribution',
        activityType: 'expert_contribution',
        conditions: {
          qualityThreshold: 0.7
        },
        scoring: {
          basePoints: 40,
          qualityBonus: 20,
          frameworkBonus: {},
          categoryBonus: {
            'knowledge_sharing': 10,
            'peer_review': 15
          },
          maxPoints: 100
        },
        validation: {
          required: true,
          automated: false,
          validatorRole: 'subject_matter_expert'
        }
      }
    ]

    defaultRules.forEach(rule => {
      this.activityRules.set(rule.id, rule)
    })

    this.logger.info('Default activity rules initialized', {
      rulesCount: defaultRules.length
    })
  }

  /**
   * Process evidence upload and award points
   */
  public async processEvidenceUpload(
    organizationId: string,
    file: {
      filename: string
      content: Buffer
      type: string
      metadata: Record<string, any>
    },
    uploadedBy: string
  ): Promise<TrustActivity> {
    const evidence: EvidenceDocument = {
      id: this.generateEvidenceId(),
      filename: file.filename,
      type: this.detectDocumentType(file.filename, file.metadata),
      uploadedAt: new Date(),
      size: file.content.length,
      hash: this.calculateFileHash(file.content),
      metadata: {
        ...file.metadata,
        category: file.metadata.category || this.categorizeDocument(file.filename)
      },
      pointsEligible: 0,
      pointsAwarded: 0
    }

    // Calculate points based on rules
    const rule = this.activityRules.get('evidence_upload_rule')!
    const points = this.calculateEvidencePoints(evidence, rule)
    evidence.pointsEligible = points
    evidence.pointsAwarded = points

    // Store evidence
    this.evidenceRepository.set(evidence.id, evidence)

    // Create trust activity
    const activity: Omit<TrustActivity, 'id' | 'timestamp'> = {
      type: 'evidence_upload',
      category: evidence.metadata.category,
      points,
      evidence: {
        type: 'document',
        url: `/evidence/${evidence.id}`,
        metadata: evidence.metadata
      },
      source: 'file_upload',
      userId: uploadedBy,
      organizationId
    }

    // Record activity
    const recordedActivity = await this.trustCalculator.recordActivity(activity)

    // Track metrics
    this.metricsCollector.incrementCounter('evidence_documents_processed', {
      type: evidence.type,
      category: evidence.metadata.category,
      organization: organizationId
    })

    this.logger.info('Evidence upload processed', {
      evidenceId: evidence.id,
      filename: evidence.filename,
      points,
      organization: organizationId
    })

    this.emit('evidence_processed', { evidence, activity: recordedActivity })
    return recordedActivity
  }

  /**
   * Process assessment completion
   */
  public async processAssessmentCompletion(
    organizationId: string,
    assessment: {
      assessmentId: string
      framework: string
      completedBy: string
      score: number
      questionsAnswered: number
      totalQuestions: number
      evidenceAttached: number
    }
  ): Promise<TrustActivity> {
    const rule = this.activityRules.get('assessment_completion_rule')!
    const completionRate = assessment.questionsAnswered / assessment.totalQuestions
    const qualityScore = (assessment.score + completionRate) / 2

    // Calculate points
    let points = rule.scoring.basePoints
    
    // Quality bonus
    if (qualityScore >= rule.conditions.qualityThreshold!) {
      points += rule.scoring.qualityBonus
    }
    
    // Framework bonus
    points += rule.scoring.frameworkBonus[assessment.framework] || 0
    
    // Evidence bonus
    points += Math.min(assessment.evidenceAttached * 5, 20)
    
    // Cap at max points
    points = Math.min(points, rule.scoring.maxPoints)

    const activity: Omit<TrustActivity, 'id' | 'timestamp'> = {
      type: 'assessment_completion',
      category: this.getFrameworkCategory(assessment.framework),
      points,
      source: 'assessment_engine',
      userId: assessment.completedBy,
      organizationId,
      evidence: {
        type: 'assessment',
        url: `/assessments/${assessment.assessmentId}`,
        metadata: {
          framework: assessment.framework,
          score: assessment.score,
          completionRate,
          evidenceCount: assessment.evidenceAttached
        }
      }
    }

    const recordedActivity = await this.trustCalculator.recordActivity(activity)

    this.metricsCollector.incrementCounter('assessments_completed', {
      framework: assessment.framework,
      organization: organizationId
    })

    this.logger.info('Assessment completion processed', {
      assessmentId: assessment.assessmentId,
      framework: assessment.framework,
      points,
      organization: organizationId
    })

    this.emit('assessment_completed', { assessment, activity: recordedActivity })
    return recordedActivity
  }

  /**
   * Process continuous monitoring metrics
   */
  public async processContinuousMonitoring(
    organizationId: string,
    metrics: Array<{
      type: 'uptime' | 'security_events' | 'vulnerability_scans' | 'compliance_checks'
      value: number
      timestamp: Date
    }>
  ): Promise<TrustActivity[]> {
    const activities: TrustActivity[] = []
    const rule = this.activityRules.get('continuous_monitoring_rule')!

    for (const metric of metrics) {
      const monitoringMetric: ContinuousMonitoringMetric = {
        id: this.generateMetricId(),
        metricType: metric.type,
        value: metric.value,
        threshold: this.getMetricThreshold(metric.type),
        timestamp: metric.timestamp,
        pointsAwarded: 0,
        status: this.evaluateMetricStatus(metric.type, metric.value)
      }

      // Calculate points based on metric performance
      let points = 0
      if (monitoringMetric.status === 'healthy') {
        points = rule.scoring.basePoints
        
        // Bonus for exceptional performance
        if (metric.value > monitoringMetric.threshold * 1.2) {
          points += rule.scoring.qualityBonus
        }
      }

      monitoringMetric.pointsAwarded = points

      // Store metric
      const orgMetrics = this.continuousMetrics.get(organizationId) || []
      orgMetrics.push(monitoringMetric)
      this.continuousMetrics.set(organizationId, orgMetrics)

      if (points > 0) {
        const activity: Omit<TrustActivity, 'id' | 'timestamp'> = {
          type: 'continuous_monitoring',
          category: 'operational',
          points,
          source: 'monitoring_system',
          userId: 'system',
          organizationId,
          evidence: {
            type: 'assessment',
            url: `/monitoring/${monitoringMetric.id}`,
            metadata: {
              metricType: metric.type,
              value: metric.value,
              status: monitoringMetric.status
            }
          }
        }

        const recordedActivity = await this.trustCalculator.recordActivity(activity)
        activities.push(recordedActivity)
      }
    }

    this.metricsCollector.incrementCounter('continuous_monitoring_processed', {
      metricsCount: metrics.length.toString(),
      organization: organizationId
    })

    this.logger.info('Continuous monitoring processed', {
      metricsProcessed: metrics.length,
      pointsAwarded: activities.reduce((sum, a) => sum + a.points, 0),
      organization: organizationId
    })

    return activities
  }

  /**
   * Process expert contributions
   */
  public async processExpertContribution(
    organizationId: string,
    contribution: {
      contributorId: string
      type: 'knowledge_sharing' | 'peer_review' | 'community_answer' | 'best_practice'
      content: string
      framework: string
      category: string
    }
  ): Promise<TrustActivity> {
    const expertContribution: ExpertContribution = {
      id: this.generateContributionId(),
      contributorId: contribution.contributorId,
      type: contribution.type,
      content: contribution.content,
      framework: contribution.framework,
      upvotes: 0,
      helpfulnessScore: 0,
      pointsAwarded: 0,
      validated: false
    }

    const rule = this.activityRules.get('expert_contribution_rule')!
    
    // Initial points (will be adjusted based on community feedback)
    let points = rule.scoring.basePoints
    points += rule.scoring.categoryBonus[contribution.type] || 0
    points = Math.min(points, rule.scoring.maxPoints)

    expertContribution.pointsAwarded = points

    // Store contribution
    this.expertContributions.set(expertContribution.id, expertContribution)

    const activity: Omit<TrustActivity, 'id' | 'timestamp'> = {
      type: 'expert_contribution',
      category: contribution.category,
      points,
      source: 'expert_community',
      userId: contribution.contributorId,
      organizationId,
      evidence: {
        type: 'document',
        url: `/contributions/${expertContribution.id}`,
        metadata: {
          contributionType: contribution.type,
          framework: contribution.framework,
          contentLength: contribution.content.length
        }
      }
    }

    const recordedActivity = await this.trustCalculator.recordActivity(activity)

    this.metricsCollector.incrementCounter('expert_contributions_processed', {
      type: contribution.type,
      framework: contribution.framework,
      organization: organizationId
    })

    this.logger.info('Expert contribution processed', {
      contributionId: expertContribution.id,
      type: contribution.type,
      points,
      organization: organizationId
    })

    this.emit('expert_contribution_processed', { contribution: expertContribution, activity: recordedActivity })
    return recordedActivity
  }

  /**
   * Update expert contribution points based on community feedback
   */
  public async updateExpertContributionPoints(
    contributionId: string,
    feedback: {
      upvotes: number
      helpfulnessScore: number
      validated: boolean
      validatedBy?: string
    }
  ): Promise<void> {
    const contribution = this.expertContributions.get(contributionId)
    if (!contribution) {
      throw new Error('Contribution not found')
    }

    const previousPoints = contribution.pointsAwarded
    
    // Update contribution data
    contribution.upvotes = feedback.upvotes
    contribution.helpfulnessScore = feedback.helpfulnessScore
    contribution.validated = feedback.validated

    // Recalculate points based on community feedback
    const rule = this.activityRules.get('expert_contribution_rule')!
    let newPoints = rule.scoring.basePoints
    
    // Community engagement bonus
    newPoints += Math.min(feedback.upvotes * 2, 20)
    newPoints += Math.round(feedback.helpfulnessScore * 10)
    
    // Validation bonus
    if (feedback.validated) {
      newPoints += 15
    }
    
    newPoints = Math.min(newPoints, rule.scoring.maxPoints)
    contribution.pointsAwarded = newPoints

    // Update stored contribution
    this.expertContributions.set(contributionId, contribution)

    // If points changed significantly, record adjustment
    const pointsDifference = newPoints - previousPoints
    if (Math.abs(pointsDifference) > 5) {
      this.logger.info('Expert contribution points updated', {
        contributionId,
        previousPoints,
        newPoints,
        pointsDifference
      })

      this.emit('expert_points_updated', {
        contributionId,
        previousPoints,
        newPoints,
        pointsDifference
      })
    }
  }

  /**
   * Helper methods
   */
  private calculateEvidencePoints(evidence: EvidenceDocument, rule: ActivityRule): number {
    let points = rule.scoring.basePoints

    // Size bonus (larger documents generally have more content)
    if (evidence.size > 100000) { // 100KB+
      points += 2
    }
    if (evidence.size > 1000000) { // 1MB+
      points += 3
    }

    // Type bonus
    const typeMultipliers = {
      'certification': 1.5,
      'audit': 1.3,
      'report': 1.2,
      'policy': 1.1,
      'procedure': 1.0
    }
    points *= typeMultipliers[evidence.type] || 1.0

    // Framework bonus
    if (evidence.metadata.framework) {
      points += rule.scoring.frameworkBonus[evidence.metadata.framework] || 0
    }

    // Category bonus
    points += rule.scoring.categoryBonus[evidence.metadata.category] || 0

    return Math.min(Math.round(points), rule.scoring.maxPoints)
  }

  private detectDocumentType(filename: string, metadata: Record<string, any>): EvidenceDocument['type'] {
    const name = filename.toLowerCase()
    
    if (name.includes('cert') || name.includes('certificate')) return 'certification'
    if (name.includes('audit') || name.includes('soc')) return 'audit'
    if (name.includes('report') || name.includes('assessment')) return 'report'
    if (name.includes('policy')) return 'policy'
    if (name.includes('procedure') || name.includes('process')) return 'procedure'
    
    return metadata.type || 'report'
  }

  private categorizeDocument(filename: string): string {
    const name = filename.toLowerCase()
    
    if (name.includes('security') || name.includes('cyber')) return 'security'
    if (name.includes('privacy') || name.includes('data protection')) return 'privacy'
    if (name.includes('governance') || name.includes('policy')) return 'governance'
    if (name.includes('risk')) return 'risk'
    if (name.includes('compliance')) return 'regulatory'
    
    return 'operational'
  }

  private getFrameworkCategory(framework: string): string {
    const frameworkCategories = {
      'SOC2': 'security',
      'ISO27001': 'security',
      'GDPR': 'privacy',
      'HIPAA': 'privacy',
      'PCI_DSS': 'security',
      'NIST': 'security'
    }
    
    return frameworkCategories[framework] || 'operational'
  }

  private getMetricThreshold(metricType: string): number {
    const thresholds = {
      'uptime': 99.0,
      'security_events': 10,
      'vulnerability_scans': 95.0,
      'compliance_checks': 90.0
    }
    
    return thresholds[metricType] || 90.0
  }

  private evaluateMetricStatus(
    metricType: string, 
    value: number
  ): ContinuousMonitoringMetric['status'] {
    const threshold = this.getMetricThreshold(metricType)
    
    if (metricType === 'security_events') {
      // Lower is better for security events
      if (value <= threshold / 2) return 'healthy'
      if (value <= threshold) return 'warning'
      return 'critical'
    } else {
      // Higher is better for uptime, scans, compliance
      if (value >= threshold) return 'healthy'
      if (value >= threshold * 0.8) return 'warning'
      return 'critical'
    }
  }

  private calculateFileHash(content: Buffer): string {
    const crypto = require('crypto')
    return crypto.createHash('sha256').update(content).digest('hex')
  }

  private startProcessingQueue(): void {
    setInterval(() => {
      if (this.processingQueue.length > 0) {
        const batch = this.processingQueue.splice(0, 10) // Process 10 at a time
        this.processBatch(batch)
      }
    }, 5000) // Every 5 seconds
  }

  private async processBatch(batch: any[]): Promise<void> {
    for (const item of batch) {
      try {
        // Process queued activities
        await this.processQueuedActivity(item)
      } catch (error) {
        this.logger.error('Failed to process queued activity', { error, item })
      }
    }
  }

  private async processQueuedActivity(item: any): Promise<void> {
    // Implementation for processing queued activities
    this.logger.debug('Processing queued activity', { item })
  }

  private startContinuousMonitoring(): void {
    // Simulate continuous monitoring data collection
    setInterval(async () => {
      // This would integrate with actual monitoring systems
      this.collectSystemMetrics()
    }, 60000) // Every minute
  }

  private async collectSystemMetrics(): Promise<void> {
    // Implementation for collecting system metrics
    this.logger.debug('Collecting system metrics')
  }

  private generateEvidenceId(): string {
    return `evidence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateMetricId(): string {
    return `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateContributionId(): string {
    return `contribution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Public API methods
   */
  public getEvidenceRepository(): EvidenceDocument[] {
    return Array.from(this.evidenceRepository.values())
  }

  public getContinuousMetrics(organizationId: string): ContinuousMonitoringMetric[] {
    return this.continuousMetrics.get(organizationId) || []
  }

  public getExpertContributions(): ExpertContribution[] {
    return Array.from(this.expertContributions.values())
  }

  public getActivityRules(): ActivityRule[] {
    return Array.from(this.activityRules.values())
  }
}

/**
 * Factory function to create Activity Points Engine
 */
export function createActivityPointsEngine(
  trustCalculator: TrustScoreCalculator
): ActivityPointsEngine {
  return new ActivityPointsEngine(trustCalculator)
}