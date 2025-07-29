/**
 * Compliance-Specific Observability Service
 * 
 * Enterprise-grade compliance transparency and auditability
 * Meets regulatory requirements for AI governance and decision tracking
 */

import { observabilityCore, ComplianceAuditEvent } from './observabilityCore'

export interface ComplianceFrameworkStatus {
  framework: string
  organizationId: string
  status: 'compliant' | 'partial' | 'non_compliant' | 'unknown'
  completionPercentage: number
  lastAssessment: Date
  nextReview: Date
  criticalGaps: ComplianceGap[]
  evidence: ComplianceEvidence[]
  riskScore: number
}

export interface ComplianceGap {
  id: string
  requirement: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  currentState: string
  requiredState: string
  remediation: {
    actions: string[]
    timeline: string
    effort: 'low' | 'medium' | 'high'
    cost: 'low' | 'medium' | 'high'
  }
  assignee?: string
  dueDate?: Date
}

export interface ComplianceEvidence {
  id: string
  title: string
  type: 'document' | 'assessment' | 'audit' | 'certification' | 'policy' | 'procedure'
  framework: string
  requirements: string[]
  status: 'current' | 'expiring' | 'expired' | 'pending'
  validFrom: Date
  validUntil?: Date
  source: string
  url?: string
  metadata: Record<string, any>
}

export interface ComplianceDecisionAudit {
  id: string
  timestamp: Date
  decisionType: 'evidence_approval' | 'gap_assessment' | 'risk_acceptance' | 'control_implementation'
  actor: string
  actorRole: string
  resource: string
  decision: string
  reasoning: string[]
  evidence: string[]
  impact: 'low' | 'medium' | 'high' | 'critical'
  reviewers: string[]
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'escalated'
  organizationId: string
}

export interface RegulatoryRequirement {
  id: string
  framework: string
  section: string
  requirement: string
  description: string
  mandatory: boolean
  applicability: string[]
  evidence: string[]
  controls: string[]
  lastReview: Date
  nextReview: Date
}

export class ComplianceObservabilityService {
  private static instance: ComplianceObservabilityService
  private frameworkStatuses: Map<string, ComplianceFrameworkStatus[]> = new Map() // organizationId -> statuses
  private complianceDecisions: Map<string, ComplianceDecisionAudit[]> = new Map()
  private regulatoryRequirements: Map<string, RegulatoryRequirement[]> = new Map()

  static getInstance(): ComplianceObservabilityService {
    if (!ComplianceObservabilityService.instance) {
      ComplianceObservabilityService.instance = new ComplianceObservabilityService()
      ComplianceObservabilityService.instance.initializeFrameworks()
    }
    return ComplianceObservabilityService.instance
  }

  /**
   * Track compliance decision with full audit trail
   */
  trackComplianceDecision(decision: Omit<ComplianceDecisionAudit, 'id' | 'timestamp'>): ComplianceDecisionAudit {
    const fullDecision: ComplianceDecisionAudit = {
      ...decision,
      id: this.generateId('compliance_decision'),
      timestamp: new Date()
    }

    // Store decision
    const orgDecisions = this.complianceDecisions.get(decision.organizationId) || []
    orgDecisions.push(fullDecision)
    this.complianceDecisions.set(decision.organizationId, orgDecisions)

    // Track in observability core
    observabilityCore.trackComplianceEvent({
      eventType: 'approval_workflow',
      actor: decision.actor,
      action: decision.decisionType,
      resource: decision.resource,
      outcome: decision.approvalStatus === 'approved' ? 'success' : 
               decision.approvalStatus === 'rejected' ? 'failure' : 'partial',
      evidence: {
        reasoning: decision.reasoning.join('; '),
        before: { status: 'pending' },
        after: { status: decision.approvalStatus }
      },
      complianceFramework: 'general',
      organizationId: decision.organizationId
    })

    return fullDecision
  }

  /**
   * Track evidence collection activity
   */
  trackEvidenceCollection(
    evidenceId: string,
    action: 'upload' | 'update' | 'delete' | 'approve' | 'reject',
    actor: string,
    organizationId: string,
    metadata: Record<string, any> = {}
  ): void {
    observabilityCore.trackComplianceEvent({
      eventType: 'evidence_collection',
      actor,
      action: `evidence_${action}`,
      resource: evidenceId,
      outcome: 'success',
      evidence: {
        reasoning: `Evidence ${action} by ${actor}`,
        after: metadata
      },
      complianceFramework: metadata.framework || 'general',
      organizationId
    })
  }

  /**
   * Track assessment completion
   */
  trackAssessmentCompletion(
    assessmentId: string,
    framework: string,
    completionPercentage: number,
    gaps: ComplianceGap[],
    actor: string,
    organizationId: string
  ): void {
    observabilityCore.trackComplianceEvent({
      eventType: 'assessment_completion',
      actor,
      action: 'complete_assessment',
      resource: assessmentId,
      outcome: completionPercentage >= 90 ? 'success' : completionPercentage >= 70 ? 'partial' : 'failure',
      evidence: {
        reasoning: `Assessment completed with ${completionPercentage}% compliance`,
        after: {
          completionPercentage,
          gapsFound: gaps.length,
          criticalGaps: gaps.filter(g => g.severity === 'critical').length
        }
      },
      complianceFramework: framework,
      organizationId
    })

    // Update framework status
    this.updateFrameworkStatus(organizationId, framework, completionPercentage, gaps)
  }

  /**
   * Get compliance framework status
   */
  getFrameworkStatus(organizationId: string, framework?: string): ComplianceFrameworkStatus[] {
    const allStatuses = this.frameworkStatuses.get(organizationId) || []
    return framework ? allStatuses.filter(s => s.framework === framework) : allStatuses
  }

  /**
   * Get compliance audit trail
   */
  getComplianceAuditTrail(
    organizationId: string,
    timeRange?: { start: Date; end: Date },
    framework?: string
  ): {
    decisions: ComplianceDecisionAudit[]
    events: ComplianceAuditEvent[]
    summary: {
      totalDecisions: number
      approvedDecisions: number
      rejectedDecisions: number
      pendingDecisions: number
      highImpactDecisions: number
    }
  } {
    let decisions = this.complianceDecisions.get(organizationId) || []
    let events = observabilityCore.getComplianceEvents(organizationId, 1000)

    // Apply filters
    if (timeRange) {
      decisions = decisions.filter(d => 
        d.timestamp >= timeRange.start && d.timestamp <= timeRange.end
      )
      events = events.filter(e =>
        e.timestamp >= timeRange.start && e.timestamp <= timeRange.end
      )
    }

    if (framework) {
      events = events.filter(e => e.complianceFramework === framework)
    }

    // Calculate summary
    const summary = {
      totalDecisions: decisions.length,
      approvedDecisions: decisions.filter(d => d.approvalStatus === 'approved').length,
      rejectedDecisions: decisions.filter(d => d.approvalStatus === 'rejected').length,
      pendingDecisions: decisions.filter(d => d.approvalStatus === 'pending').length,
      highImpactDecisions: decisions.filter(d => d.impact === 'high' || d.impact === 'critical').length
    }

    return { decisions, events, summary }
  }

  /**
   * Generate compliance dashboard data
   */
  getComplianceDashboard(organizationId: string): {
    overallScore: number
    frameworkScores: Record<string, number>
    criticalGaps: ComplianceGap[]
    upcomingDeadlines: Array<{
      type: 'evidence_renewal' | 'assessment_due' | 'gap_remediation'
      description: string
      dueDate: Date
      severity: 'critical' | 'high' | 'medium' | 'low'
    }>
    recentActivity: Array<{
      timestamp: Date
      type: string
      description: string
      actor: string
    }>
    trends: {
      complianceScore: 'improving' | 'declining' | 'stable'
      gapReduction: 'improving' | 'declining' | 'stable'
      evidenceQuality: 'improving' | 'declining' | 'stable'
    }
  } {
    const frameworks = this.getFrameworkStatus(organizationId)
    const auditTrail = this.getComplianceAuditTrail(organizationId, {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    })

    // Calculate overall score
    const overallScore = frameworks.length > 0
      ? frameworks.reduce((sum, f) => sum + f.completionPercentage, 0) / frameworks.length
      : 0

    // Framework scores
    const frameworkScores: Record<string, number> = {}
    frameworks.forEach(f => {
      frameworkScores[f.framework] = f.completionPercentage
    })

    // Critical gaps across all frameworks
    const criticalGaps = frameworks.flatMap(f => f.criticalGaps)
      .filter(g => g.severity === 'critical' || g.severity === 'high')
      .sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return severityOrder[b.severity] - severityOrder[a.severity]
      })
      .slice(0, 10)

    // Upcoming deadlines
    const upcomingDeadlines = this.calculateUpcomingDeadlines(frameworks, criticalGaps)

    // Recent activity
    const recentActivity = [
      ...auditTrail.decisions.slice(0, 5).map(d => ({
        timestamp: d.timestamp,
        type: d.decisionType,
        description: `${d.decisionType} by ${d.actor}`,
        actor: d.actor
      })),
      ...auditTrail.events.slice(0, 5).map(e => ({
        timestamp: e.timestamp,
        type: e.eventType,
        description: `${e.action} on ${e.resource}`,
        actor: e.actor
      }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)

    // Calculate trends
    const trends = this.calculateComplianceTrends(organizationId)

    return {
      overallScore,
      frameworkScores,
      criticalGaps,
      upcomingDeadlines,
      recentActivity,
      trends
    }
  }

  /**
   * Generate regulatory compliance report
   */
  generateRegulatoryReport(
    organizationId: string,
    frameworks: string[]
  ): {
    executiveSummary: {
      overallCompliance: number
      criticalFindings: number
      recommendedActions: string[]
      nextSteps: string[]
    }
    frameworkDetails: Array<{
      framework: string
      compliance: number
      requirements: Array<{
        requirement: string
        status: 'compliant' | 'partial' | 'non_compliant'
        evidence: string[]
        gaps: string[]
      }>
    }>
    auditReadiness: {
      score: number
      preparationItems: string[]
      evidenceGaps: string[]
      processImprovements: string[]
    }
  } {
    const frameworkStatuses = frameworks.map(f => 
      this.getFrameworkStatus(organizationId, f)[0]
    ).filter(Boolean)

    const overallCompliance = frameworkStatuses.length > 0
      ? frameworkStatuses.reduce((sum, f) => sum + f.completionPercentage, 0) / frameworkStatuses.length
      : 0

    const criticalFindings = frameworkStatuses
      .flatMap(f => f.criticalGaps)
      .filter(g => g.severity === 'critical').length

    const executiveSummary = {
      overallCompliance,
      criticalFindings,
      recommendedActions: this.generateRecommendedActions(frameworkStatuses),
      nextSteps: this.generateNextSteps(frameworkStatuses)
    }

    const frameworkDetails = frameworkStatuses.map(framework => ({
      framework: framework.framework,
      compliance: framework.completionPercentage,
      requirements: this.getFrameworkRequirements(framework)
    }))

    const auditReadiness = this.assessAuditReadiness(organizationId, frameworkStatuses)

    return {
      executiveSummary,
      frameworkDetails,
      auditReadiness
    }
  }

  private initializeFrameworks(): void {
    // Initialize common frameworks with basic structure
    const commonFrameworks = ['SOC2', 'ISO27001', 'GDPR', 'HIPAA', 'PCI_DSS', 'ISACA_DTEF']
    
    // This would typically be loaded from a configuration or database
    commonFrameworks.forEach(framework => {
      const requirements = this.getDefaultRequirements(framework)
      // Store requirements for later use
      this.regulatoryRequirements.set(framework, requirements)
    })
  }

  private getDefaultRequirements(framework: string): RegulatoryRequirement[] {
    const now = new Date()
    const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())

    const baseRequirements = {
      'SOC2': [
        {
          id: 'soc2-cc1',
          framework: 'SOC2',
          section: 'CC1',
          requirement: 'Control Environment',
          description: 'Entity demonstrates commitment to integrity and ethical values',
          mandatory: true,
          applicability: ['all'],
          evidence: ['policies', 'procedures', 'training_records'],
          controls: ['access_control', 'code_of_conduct'],
          lastReview: now,
          nextReview: nextYear
        }
      ],
      'ISO27001': [
        {
          id: 'iso27001-a5',
          framework: 'ISO27001',
          section: 'A.5',
          requirement: 'Information Security Policies',
          description: 'Management direction and support for information security',
          mandatory: true,
          applicability: ['all'],
          evidence: ['security_policy', 'management_approval'],
          controls: ['policy_management', 'regular_review'],
          lastReview: now,
          nextReview: nextYear
        }
      ],
      'ISACA_DTEF': [
        {
          id: 'dtef-te01',
          framework: 'ISACA_DTEF',
          section: 'TE01',
          requirement: 'Digital Identity Trust Foundation',
          description: 'Establish comprehensive digital identity trust infrastructure',
          mandatory: true,
          applicability: ['enterprise'],
          evidence: ['identity_management', 'pki_infrastructure'],
          controls: ['identity_verification', 'trust_anchors'],
          lastReview: now,
          nextReview: nextYear
        }
      ]
    }

    return baseRequirements[framework] || []
  }

  private updateFrameworkStatus(
    organizationId: string,
    framework: string,
    completionPercentage: number,
    gaps: ComplianceGap[]
  ): void {
    const orgStatuses = this.frameworkStatuses.get(organizationId) || []
    const existingIndex = orgStatuses.findIndex(s => s.framework === framework)

    const status: ComplianceFrameworkStatus = {
      framework,
      organizationId,
      status: completionPercentage >= 90 ? 'compliant' : 
              completionPercentage >= 70 ? 'partial' : 'non_compliant',
      completionPercentage,
      lastAssessment: new Date(),
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      criticalGaps: gaps.filter(g => g.severity === 'critical' || g.severity === 'high'),
      evidence: [], // Would be populated from actual evidence
      riskScore: this.calculateRiskScore(completionPercentage, gaps)
    }

    if (existingIndex >= 0) {
      orgStatuses[existingIndex] = status
    } else {
      orgStatuses.push(status)
    }

    this.frameworkStatuses.set(organizationId, orgStatuses)
  }

  private calculateRiskScore(completionPercentage: number, gaps: ComplianceGap[]): number {
    const completionRisk = (100 - completionPercentage) * 0.5
    const gapRisk = gaps.reduce((sum, gap) => {
      const severityWeight = { critical: 10, high: 7, medium: 4, low: 1 }
      return sum + severityWeight[gap.severity]
    }, 0)
    
    return Math.min(completionRisk + gapRisk, 100)
  }

  private calculateUpcomingDeadlines(
    frameworks: ComplianceFrameworkStatus[],
    gaps: ComplianceGap[]
  ): any[] {
    const deadlines: any[] = []

    // Evidence renewal deadlines
    frameworks.forEach(framework => {
      framework.evidence.forEach(evidence => {
        if (evidence.validUntil) {
          const daysUntilExpiry = Math.floor(
            (evidence.validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
          
          if (daysUntilExpiry <= 90) {
            deadlines.push({
              type: 'evidence_renewal',
              description: `${evidence.title} expires in ${daysUntilExpiry} days`,
              dueDate: evidence.validUntil,
              severity: daysUntilExpiry <= 30 ? 'critical' : daysUntilExpiry <= 60 ? 'high' : 'medium'
            })
          }
        }
      })

      // Assessment due dates
      const daysUntilReview = Math.floor(
        (framework.nextReview.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
      
      if (daysUntilReview <= 90) {
        deadlines.push({
          type: 'assessment_due',
          description: `${framework.framework} assessment due in ${daysUntilReview} days`,
          dueDate: framework.nextReview,
          severity: daysUntilReview <= 30 ? 'high' : 'medium'
        })
      }
    })

    // Gap remediation deadlines
    gaps.forEach(gap => {
      if (gap.dueDate) {
        const daysUntilDue = Math.floor(
          (gap.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
        
        if (daysUntilDue <= 90) {
          deadlines.push({
            type: 'gap_remediation',
            description: `${gap.requirement} remediation due in ${daysUntilDue} days`,
            dueDate: gap.dueDate,
            severity: gap.severity
          })
        }
      }
    })

    return deadlines.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  }

  private calculateComplianceTrends(organizationId: string): any {
    // Simplified trend calculation
    return {
      complianceScore: 'stable',
      gapReduction: 'improving',
      evidenceQuality: 'stable'
    }
  }

  private generateRecommendedActions(frameworks: ComplianceFrameworkStatus[]): string[] {
    const actions: string[] = []
    
    frameworks.forEach(framework => {
      if (framework.completionPercentage < 80) {
        actions.push(`Prioritize ${framework.framework} compliance improvements`)
      }
      
      const criticalGaps = framework.criticalGaps.filter(g => g.severity === 'critical')
      if (criticalGaps.length > 0) {
        actions.push(`Address ${criticalGaps.length} critical gaps in ${framework.framework}`)
      }
    })

    return actions.slice(0, 5)
  }

  private generateNextSteps(frameworks: ComplianceFrameworkStatus[]): string[] {
    const steps: string[] = []
    
    frameworks.forEach(framework => {
      const upcomingReview = Math.floor(
        (framework.nextReview.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
      
      if (upcomingReview <= 30) {
        steps.push(`Schedule ${framework.framework} review within ${upcomingReview} days`)
      }
    })

    return steps.slice(0, 3)
  }

  private getFrameworkRequirements(framework: ComplianceFrameworkStatus): any[] {
    // This would map to actual requirements
    return []
  }

  private assessAuditReadiness(
    organizationId: string,
    frameworks: ComplianceFrameworkStatus[]
  ): any {
    const avgCompliance = frameworks.length > 0
      ? frameworks.reduce((sum, f) => sum + f.completionPercentage, 0) / frameworks.length
      : 0

    const score = avgCompliance > 90 ? 95 : avgCompliance > 80 ? 85 : avgCompliance > 70 ? 75 : 60

    return {
      score,
      preparationItems: [
        'Complete evidence collection',
        'Review control documentation',
        'Prepare interview schedules'
      ].slice(0, Math.floor(4 - score / 25)),
      evidenceGaps: frameworks.flatMap(f => 
        f.criticalGaps.map(g => g.requirement)
      ).slice(0, 5),
      processImprovements: [
        'Automate compliance monitoring',
        'Enhance documentation processes',
        'Implement continuous controls testing'
      ]
    }
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export const complianceObservability = ComplianceObservabilityService.getInstance()