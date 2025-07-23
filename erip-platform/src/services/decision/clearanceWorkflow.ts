/**
 * CLEARANCE Decision Support Workflow Service
 * 
 * Implements strategic risk clearance and decision routing workflows
 * Integrates with PRISM quantification and executive approval processes
 */

import { ERIPEventBus } from '../../infrastructure/events/eventBus'
import { Logger } from '../../infrastructure/logging/logger'
import { TrustEquityEngine } from '../../infrastructure/trustEquity/engine'
import { ERIPEvent } from '../../infrastructure/events/schemas'

export interface DecisionRequest {
  id: string
  title: string
  description: string
  requestor: {
    id: string
    name: string
    role: string
    department: string
  }
  riskProfile: {
    estimatedImpact: number
    probability: number
    timeframe: string
    confidenceLevel: number
    riskCategory: 'operational' | 'strategic' | 'compliance' | 'financial' | 'reputational'
  }
  businessContext: {
    urgency: 'low' | 'medium' | 'high' | 'critical'
    businessValue: number
    strategicAlignment: number // 1-10 scale
    competitiveImplications: string
    regulatoryContext: string[]
  }
  alternatives: DecisionAlternative[]
  stakeholders: Stakeholder[]
  deadline?: Date
  trustEquityStake: number
}

export interface DecisionAlternative {
  id: string
  name: string
  description: string
  costs: {
    implementation: number
    ongoing: number
    opportunity: number
  }
  benefits: {
    riskReduction: number
    businessValue: number
    strategicValue: number
  }
  risks: {
    implementation: number
    operational: number
    strategic: number
  }
  timeline: {
    implementation: string
    realizationOfBenefits: string
  }
  feasibility: number // 1-10 scale
  stakeholderSupport: number // 1-10 scale
}

export interface Stakeholder {
  id: string
  name: string
  role: string
  department: string
  influence: number // 1-10 scale
  interest: number // 1-10 scale
  approvalAuthority: boolean
  escalationLevel: 'department' | 'executive' | 'board'
}

export interface DecisionRouting {
  primaryApprover: string
  requiredApprovers: string[]
  consultationRequired: string[]
  escalationTriggers: EscalationTrigger[]
  slaHours: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  automatedActions: string[]
}

export interface EscalationTrigger {
  condition: string
  threshold: number
  escalateTo: string
  timeoutHours: number
  notifications: string[]
}

export interface DecisionResult {
  decisionId: string
  approved: boolean
  approver: string
  approvalLevel: 'automated' | 'manager' | 'executive' | 'board'
  conditions: string[]
  rationale: string
  processingTime: number // minutes
  trustEquityAllocated: number
  implementationPlan?: ImplementationPlan
  monitoringRequirements?: MonitoringRequirement[]
}

export interface ImplementationPlan {
  phases: ImplementationPhase[]
  resources: ResourceRequirement[]
  milestones: Milestone[]
  riskMitigation: RiskMitigationPlan[]
  successMetrics: SuccessMetric[]
}

export interface ImplementationPhase {
  name: string
  description: string
  duration: string
  dependencies: string[]
  deliverables: string[]
  risks: string[]
}

export interface ResourceRequirement {
  type: 'human' | 'financial' | 'technology' | 'infrastructure'
  description: string
  quantity: number
  cost: number
  timeline: string
}

export interface Milestone {
  name: string
  targetDate: Date
  criteria: string[]
  stakeholders: string[]
  reviewRequired: boolean
}

export interface RiskMitigationPlan {
  risk: string
  probability: number
  impact: number
  mitigationActions: string[]
  contingencyPlans: string[]
  owner: string
}

export interface SuccessMetric {
  name: string
  target: number
  measurementMethod: string
  frequency: string
  owner: string
}

export interface MonitoringRequirement {
  metric: string
  threshold: number
  frequency: string
  alertRecipients: string[]
  escalationProcedure: string
}

export class ClearanceWorkflowService {
  private eventBus: ERIPEventBus
  private logger: Logger
  private trustEngine: TrustEquityEngine
  private unsubscribeFunctions: (() => void)[] = []

  // Decision routing configuration
  private routingRules = {
    autoApprovalThresholds: {
      lowRisk: { impact: 10000, probability: 0.1, trustEquity: 50 },
      mediumRisk: { impact: 100000, probability: 0.3, trustEquity: 200 },
      highRisk: { impact: 500000, probability: 0.5, trustEquity: 500 }
    },
    approvalLevels: {
      manager: { maxImpact: 100000, maxProbability: 0.3, maxTrustEquity: 200 },
      executive: { maxImpact: 1000000, maxProbability: 0.7, maxTrustEquity: 1000 },
      board: { maxImpact: Infinity, maxProbability: 1.0, maxTrustEquity: Infinity }
    },
    slaByUrgency: {
      low: 72, // hours
      medium: 48,
      high: 24,
      critical: 8
    }
  }

  constructor(
    eventBus: ERIPEventBus, 
    trustEngine: TrustEquityEngine
  ) {
    this.eventBus = eventBus
    this.trustEngine = trustEngine
    this.logger = new Logger('ClearanceWorkflowService')
    this.setupEventHandlers()
  }

  /**
   * Setup event handlers for decision workflow triggers
   */
  private setupEventHandlers(): void {
    // Listen for risk quantification results
    const prismUnsubscribe = this.eventBus.subscribe(
      'prism:risk.quantified',
      this.handleRiskQuantificationResult.bind(this)
    )
    this.unsubscribeFunctions.push(prismUnsubscribe)

    // Listen for urgent security findings
    const atlasUnsubscribe = this.eventBus.subscribe(
      'atlas:vulnerability.discovered',
      this.handleSecurityFindings.bind(this)
    )
    this.unsubscribeFunctions.push(atlasUnsubscribe)

    // Listen for compliance gaps
    const compassUnsubscribe = this.eventBus.subscribe(
      'compass:compliance.gap.identified',
      this.handleComplianceGap.bind(this)
    )
    this.unsubscribeFunctions.push(compassUnsubscribe)

    this.logger.info('CLEARANCE workflow event handlers configured')
  }

  /**
   * Process decision request through clearance workflow
   */
  async processDecisionRequest(request: DecisionRequest): Promise<DecisionResult> {
    const startTime = Date.now()
    this.logger.info('Processing decision request', { 
      decisionId: request.id,
      urgency: request.businessContext.urgency
    })

    try {
      // Analyze decision complexity and risk
      const complexity = await this.analyzeDecisionComplexity(request)
      
      // Determine routing based on impact, probability, and trust equity
      const routing = await this.determineDecisionRouting(request, complexity)
      
      // Execute decision workflow
      const result = await this.executeDecisionWorkflow(request, routing, complexity)
      
      // Publish decision completion event
      await this.publishDecisionEvent(request, result)
      
      // Award trust equity for decision processing
      await this.awardTrustEquityForDecision(request, result)

      result.processingTime = (Date.now() - startTime) / 1000 / 60 // minutes

      this.logger.info('Decision request processed', {
        decisionId: request.id,
        approved: result.approved,
        processingTime: result.processingTime
      })

      return result

    } catch (error) {
      this.logger.error('Decision processing failed', { 
        decisionId: request.id, 
        error 
      })
      throw error
    }
  }

  /**
   * Handle risk quantification results from PRISM
   */
  private async handleRiskQuantificationResult(event: ERIPEvent): Promise<void> {
    if (event.type !== 'risk.quantified') return

    const riskData = event.data as any
    
    this.logger.info('Processing risk quantification for decision routing', {
      riskId: riskData.riskId,
      ale: riskData.ale
    })

    // Check if this risk requires immediate decision
    if (riskData.ale > this.routingRules.approvalLevels.executive.maxImpact) {
      await this.triggerUrgentDecisionRequest({
        trigger: 'high_risk_quantified',
        riskId: riskData.riskId,
        impact: riskData.ale,
        scenario: riskData.scenario,
        confidenceInterval: riskData.confidenceInterval,
        mitigationCost: riskData.mitigationCost,
        trustEquityRequired: riskData.trustEquityRequired
      })
    }
  }

  /**
   * Handle security findings that require decisions
   */
  private async handleSecurityFindings(event: ERIPEvent): Promise<void> {
    if (event.type !== 'vulnerability.discovered') return

    const vulnData = event.data as any

    if (vulnData.severity === 'critical') {
      await this.triggerUrgentDecisionRequest({
        trigger: 'critical_vulnerability',
        vulnerabilityId: vulnData.vulnerabilityId,
        assetId: vulnData.assetId,
        cvssScore: vulnData.cvssScore,
        affectedSystems: vulnData.affectedSystems,
        remediationSteps: vulnData.remediationSteps
      })
    }
  }

  /**
   * Handle compliance gaps that require decisions
   */
  private async handleComplianceGap(event: ERIPEvent): Promise<void> {
    if (event.type !== 'compliance.gap.identified') return

    const gapData = event.data as any

    if (gapData.severity === 'critical' || gapData.severity === 'high') {
      await this.triggerUrgentDecisionRequest({
        trigger: 'compliance_gap',
        gapId: gapData.gapId,
        framework: gapData.framework,
        requirement: gapData.requirement,
        severity: gapData.severity,
        estimatedCost: gapData.estimatedRemediationCost,
        recommendedActions: gapData.recommendedActions
      })
    }
  }

  /**
   * Analyze decision complexity factors
   */
  private async analyzeDecisionComplexity(request: DecisionRequest): Promise<{
    riskScore: number
    stakeholderComplexity: number
    strategicImpact: number
    regulatoryImplications: number
    overallComplexity: 'simple' | 'moderate' | 'complex' | 'highly_complex'
  }> {
    // Calculate risk score
    const riskScore = request.riskProfile.estimatedImpact * 
                     request.riskProfile.probability * 
                     (1 / request.riskProfile.confidenceLevel)

    // Analyze stakeholder complexity
    const stakeholderComplexity = request.stakeholders.reduce((complexity, stakeholder) => {
      return complexity + (stakeholder.influence * stakeholder.interest)
    }, 0) / request.stakeholders.length

    // Strategic impact assessment
    const strategicImpact = (request.businessContext.businessValue / 1000000) * 
                           request.businessContext.strategicAlignment

    // Regulatory implications
    const regulatoryImplications = request.businessContext.regulatoryContext.length * 0.2

    // Overall complexity calculation
    const complexityScore = (riskScore / 100000) + 
                           (stakeholderComplexity / 10) + 
                           (strategicImpact / 10) + 
                           regulatoryImplications

    let overallComplexity: 'simple' | 'moderate' | 'complex' | 'highly_complex'
    if (complexityScore < 2) overallComplexity = 'simple'
    else if (complexityScore < 5) overallComplexity = 'moderate'
    else if (complexityScore < 10) overallComplexity = 'complex'
    else overallComplexity = 'highly_complex'

    return {
      riskScore,
      stakeholderComplexity,
      strategicImpact,
      regulatoryImplications,
      overallComplexity
    }
  }

  /**
   * Determine decision routing based on risk and complexity
   */
  private async determineDecisionRouting(
    request: DecisionRequest,
    complexity: any
  ): Promise<DecisionRouting> {
    const impact = request.riskProfile.estimatedImpact
    const probability = request.riskProfile.probability
    const trustEquity = request.trustEquityStake
    const urgency = request.businessContext.urgency

    // Check for auto-approval eligibility
    const autoThreshold = this.routingRules.autoApprovalThresholds.lowRisk
    if (impact <= autoThreshold.impact && 
        probability <= autoThreshold.probability && 
        trustEquity <= autoThreshold.trustEquity &&
        complexity.overallComplexity === 'simple') {
      
      return {
        primaryApprover: 'automated_system',
        requiredApprovers: [],
        consultationRequired: [],
        escalationTriggers: [],
        slaHours: 1,
        priority: 'low',
        automatedActions: ['approve', 'allocate_trust_equity', 'create_implementation_plan']
      }
    }

    // Determine approval level
    let approvalLevel: 'manager' | 'executive' | 'board' = 'manager'
    const levels = this.routingRules.approvalLevels

    if (impact > levels.executive.maxImpact || 
        probability > levels.executive.maxProbability ||
        trustEquity > levels.executive.maxTrustEquity ||
        complexity.overallComplexity === 'highly_complex') {
      approvalLevel = 'board'
    } else if (impact > levels.manager.maxImpact || 
               probability > levels.manager.maxProbability ||
               trustEquity > levels.manager.maxTrustEquity ||
               complexity.overallComplexity === 'complex') {
      approvalLevel = 'executive'
    }

    // Build routing configuration
    const routing: DecisionRouting = {
      primaryApprover: this.getPrimaryApprover(approvalLevel, request),
      requiredApprovers: this.getRequiredApprovers(approvalLevel, request),
      consultationRequired: this.getConsultationRequired(request, complexity),
      escalationTriggers: this.getEscalationTriggers(approvalLevel, urgency),
      slaHours: this.routingRules.slaByUrgency[urgency],
      priority: urgency,
      automatedActions: this.getAutomatedActions(approvalLevel, complexity)
    }

    return routing
  }

  /**
   * Execute the decision workflow
   */
  private async executeDecisionWorkflow(
    request: DecisionRequest,
    routing: DecisionRouting,
    complexity: any
  ): Promise<DecisionResult> {
    // Automated approval case
    if (routing.primaryApprover === 'automated_system') {
      return this.processAutomatedApproval(request, routing)
    }

    // Human approval workflow
    return this.processHumanApprovalWorkflow(request, routing, complexity)
  }

  /**
   * Process automated approval for simple, low-risk decisions
   */
  private async processAutomatedApproval(
    request: DecisionRequest,
    routing: DecisionRouting
  ): Promise<DecisionResult> {
    // Select best alternative based on cost-benefit analysis
    const bestAlternative = this.selectOptimalAlternative(request.alternatives)
    
    // Create implementation plan
    const implementationPlan = await this.createImplementationPlan(bestAlternative, request)
    
    // Determine trust equity allocation
    const trustEquityAllocated = Math.min(request.trustEquityStake, 100) // Cap at 100 for auto-approval

    return {
      decisionId: request.id,
      approved: true,
      approver: 'Automated System',
      approvalLevel: 'automated',
      conditions: ['Automated approval based on low risk threshold'],
      rationale: `Risk impact ($${request.riskProfile.estimatedImpact.toLocaleString()}) and probability (${(request.riskProfile.probability * 100).toFixed(1)}%) within auto-approval limits`,
      processingTime: 0, // Will be set by caller
      trustEquityAllocated,
      implementationPlan,
      monitoringRequirements: this.createMonitoringRequirements(bestAlternative, 'automated')
    }
  }

  /**
   * Process human approval workflow
   */
  private async processHumanApprovalWorkflow(
    request: DecisionRequest,
    routing: DecisionRouting,
    complexity: any
  ): Promise<DecisionResult> {
    // For now, simulate approval workflow
    // In real implementation, this would integrate with workflow engine
    
    const simulatedApproval = this.simulateApprovalProcess(request, routing)
    
    if (simulatedApproval.approved) {
      const selectedAlternative = this.selectOptimalAlternative(request.alternatives)
      const implementationPlan = await this.createImplementationPlan(selectedAlternative, request)
      
      return {
        decisionId: request.id,
        approved: true,
        approver: routing.primaryApprover,
        approvalLevel: this.getApprovalLevel(routing.primaryApprover),
        conditions: simulatedApproval.conditions,
        rationale: simulatedApproval.rationale,
        processingTime: 0, // Will be set by caller
        trustEquityAllocated: request.trustEquityStake,
        implementationPlan,
        monitoringRequirements: this.createMonitoringRequirements(
          selectedAlternative, 
          this.getApprovalLevel(routing.primaryApprover)
        )
      }
    }

    return {
      decisionId: request.id,
      approved: false,
      approver: routing.primaryApprover,
      approvalLevel: this.getApprovalLevel(routing.primaryApprover),
      conditions: simulatedApproval.conditions,
      rationale: simulatedApproval.rationale,
      processingTime: 0, // Will be set by caller
      trustEquityAllocated: 0
    }
  }

  /**
   * Trigger urgent decision request for critical situations
   */
  private async triggerUrgentDecisionRequest(context: any): Promise<void> {
    await this.eventBus.publish({
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      type: 'decision.routed',
      source: 'clearance',
      data: {
        decisionId: this.generateDecisionId(),
        riskAmount: context.impact || 0,
        riskAppetite: 'conservative',
        routedTo: context.impact > 1000000 ? 'board' : 'executive',
        urgency: 'critical',
        context: JSON.stringify(context),
        requiredApprovals: context.impact > 1000000 ? 3 : 2,
        sla: 8, // hours
        trustEquityStake: context.trustEquityRequired || 100
      }
    })
  }

  /**
   * Utility methods for decision processing
   */
  private selectOptimalAlternative(alternatives: DecisionAlternative[]): DecisionAlternative {
    return alternatives.reduce((best, current) => {
      const bestScore = this.calculateAlternativeScore(best)
      const currentScore = this.calculateAlternativeScore(current)
      return currentScore > bestScore ? current : best
    })
  }

  private calculateAlternativeScore(alternative: DecisionAlternative): number {
    const totalCosts = alternative.costs.implementation + alternative.costs.ongoing + alternative.costs.opportunity
    const totalBenefits = alternative.benefits.riskReduction + alternative.benefits.businessValue + alternative.benefits.strategicValue
    const totalRisks = alternative.risks.implementation + alternative.risks.operational + alternative.risks.strategic
    
    const costBenefit = totalBenefits / (totalCosts || 1)
    const riskAdjustment = 1 / (1 + totalRisks / 100000)
    const feasibilityFactor = alternative.feasibility / 10
    const stakeholderFactor = alternative.stakeholderSupport / 10
    
    return costBenefit * riskAdjustment * feasibilityFactor * stakeholderFactor
  }

  private async createImplementationPlan(
    alternative: DecisionAlternative,
    request: DecisionRequest
  ): Promise<ImplementationPlan> {
    return {
      phases: [
        {
          name: 'Planning & Preparation',
          description: 'Detailed planning and resource allocation',
          duration: '2 weeks',
          dependencies: [],
          deliverables: ['Project plan', 'Resource allocation', 'Risk assessment'],
          risks: ['Resource availability', 'Stakeholder alignment']
        },
        {
          name: 'Implementation',
          description: alternative.description,
          duration: alternative.timeline.implementation,
          dependencies: ['Planning & Preparation'],
          deliverables: ['Implemented solution', 'Testing results', 'Documentation'],
          risks: ['Technical complexity', 'Change management']
        },
        {
          name: 'Monitoring & Optimization',
          description: 'Monitor outcomes and optimize performance',
          duration: 'Ongoing',
          dependencies: ['Implementation'],
          deliverables: ['Performance reports', 'Optimization recommendations'],
          risks: ['Performance degradation', 'Unexpected issues']
        }
      ],
      resources: [
        {
          type: 'financial',
          description: 'Implementation budget',
          quantity: 1,
          cost: alternative.costs.implementation,
          timeline: alternative.timeline.implementation
        }
      ],
      milestones: [
        {
          name: 'Implementation Complete',
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          criteria: ['Solution deployed', 'Testing passed', 'Stakeholder acceptance'],
          stakeholders: request.stakeholders.map(s => s.name),
          reviewRequired: true
        }
      ],
      riskMitigation: [
        {
          risk: 'Implementation delays',
          probability: 0.3,
          impact: alternative.costs.implementation * 0.2,
          mitigationActions: ['Dedicated project manager', 'Weekly status reviews'],
          contingencyPlans: ['Extended timeline', 'Additional resources'],
          owner: 'Project Manager'
        }
      ],
      successMetrics: [
        {
          name: 'Risk Reduction',
          target: alternative.benefits.riskReduction,
          measurementMethod: 'Quantitative risk assessment',
          frequency: 'Monthly',
          owner: 'Risk Manager'
        }
      ]
    }
  }

  private createMonitoringRequirements(
    alternative: DecisionAlternative,
    approvalLevel: string
  ): MonitoringRequirement[] {
    const requirements: MonitoringRequirement[] = [
      {
        metric: 'Implementation Progress',
        threshold: 0.8, // 80% completion
        frequency: 'Weekly',
        alertRecipients: ['Project Manager', 'Risk Manager'],
        escalationProcedure: 'Escalate to approver if < 80% on schedule'
      },
      {
        metric: 'Cost Variance',
        threshold: alternative.costs.implementation * 0.1, // 10% variance
        frequency: 'Bi-weekly',
        alertRecipients: ['Finance', 'Project Manager'],
        escalationProcedure: 'Budget review required if variance > 10%'
      }
    ]

    if (approvalLevel === 'board' || approvalLevel === 'executive') {
      requirements.push({
        metric: 'Strategic Alignment',
        threshold: 0.7, // 70% alignment score
        frequency: 'Monthly',
        alertRecipients: ['Executive Sponsor', 'Strategy Office'],
        escalationProcedure: 'Strategic review if alignment drops below 70%'
      })
    }

    return requirements
  }

  private simulateApprovalProcess(
    request: DecisionRequest,
    routing: DecisionRouting
  ): { approved: boolean; conditions: string[]; rationale: string } {
    // Simplified simulation - in real implementation would integrate with actual approval workflow
    const approvalProbability = this.calculateApprovalProbability(request)
    const approved = Math.random() < approvalProbability

    if (approved) {
      return {
        approved: true,
        conditions: ['Regular monitoring required', 'Budget compliance mandatory'],
        rationale: `Decision approved based on positive cost-benefit analysis and acceptable risk level`
      }
    } else {
      return {
        approved: false,
        conditions: ['Risk mitigation required', 'Additional analysis needed'],
        rationale: 'Risk level exceeds current risk appetite or insufficient business justification'
      }
    }
  }

  private calculateApprovalProbability(request: DecisionRequest): number {
    let probability = 0.7 // Base approval rate

    // Adjust based on business value
    if (request.businessContext.businessValue > 1000000) probability += 0.1
    
    // Adjust based on strategic alignment
    probability += (request.businessContext.strategicAlignment - 5) * 0.02
    
    // Adjust based on urgency
    if (request.businessContext.urgency === 'critical') probability += 0.1
    else if (request.businessContext.urgency === 'low') probability -= 0.1
    
    // Adjust based on risk level
    const riskLevel = request.riskProfile.estimatedImpact * request.riskProfile.probability
    if (riskLevel > 500000) probability -= 0.2
    else if (riskLevel < 50000) probability += 0.1
    
    return Math.max(0.1, Math.min(0.9, probability))
  }

  private getPrimaryApprover(approvalLevel: string, request: DecisionRequest): string {
    const approvers = {
      manager: request.stakeholders.find(s => s.escalationLevel === 'department')?.name || 'Department Manager',
      executive: request.stakeholders.find(s => s.escalationLevel === 'executive')?.name || 'Executive Team',
      board: 'Board of Directors'
    }
    return approvers[approvalLevel as keyof typeof approvers] || 'Department Manager'
  }

  private getRequiredApprovers(approvalLevel: string, request: DecisionRequest): string[] {
    if (approvalLevel === 'board') {
      return ['CEO', 'Board Chair', 'Risk Committee Chair']
    } else if (approvalLevel === 'executive') {
      return ['CRO', 'CFO']
    }
    return []
  }

  private getConsultationRequired(request: DecisionRequest, complexity: any): string[] {
    const consultations = []
    
    if (request.businessContext.regulatoryContext.length > 0) {
      consultations.push('Legal Team')
    }
    
    if (request.riskProfile.riskCategory === 'financial') {
      consultations.push('Finance Team')
    }
    
    if (complexity.overallComplexity === 'highly_complex') {
      consultations.push('Strategy Office', 'External Advisor')
    }
    
    return consultations
  }

  private getEscalationTriggers(approvalLevel: string, urgency: string): EscalationTrigger[] {
    const triggers: EscalationTrigger[] = []
    
    if (approvalLevel === 'manager') {
      triggers.push({
        condition: 'no_response',
        threshold: 24, // hours
        escalateTo: 'executive',
        timeoutHours: 24,
        notifications: ['Manager', 'Executive Assistant']
      })
    }
    
    if (urgency === 'critical') {
      triggers.push({
        condition: 'deadline_approaching',
        threshold: 4, // hours before deadline
        escalateTo: 'next_level',
        timeoutHours: 2,
        notifications: ['All Stakeholders']
      })
    }
    
    return triggers
  }

  private getAutomatedActions(approvalLevel: string, complexity: any): string[] {
    const actions = ['log_decision', 'update_risk_register']
    
    if (approvalLevel === 'automated') {
      actions.push('create_implementation_plan', 'allocate_resources', 'setup_monitoring')
    }
    
    if (complexity.overallComplexity === 'simple') {
      actions.push('auto_schedule_review')
    }
    
    return actions
  }

  private getApprovalLevel(approver: string): 'automated' | 'manager' | 'executive' | 'board' {
    if (approver === 'Automated System') return 'automated'
    if (approver === 'Board of Directors' || approver.includes('Board')) return 'board'
    if (approver.includes('Executive') || approver.includes('C')) return 'executive'
    return 'manager'
  }

  private async publishDecisionEvent(request: DecisionRequest, result: DecisionResult): Promise<void> {
    await this.eventBus.publish({
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      type: 'approval.completed',
      source: 'clearance',
      data: {
        decisionId: result.decisionId,
        approved: result.approved,
        approver: result.approver,
        approverLevel: result.approvalLevel,
        processingTime: result.processingTime,
        conditions: result.conditions,
        trustEquityAllocated: result.trustEquityAllocated
      }
    })
  }

  private async awardTrustEquityForDecision(request: DecisionRequest, result: DecisionResult): Promise<void> {
    let points = 30 // Base points for decision processing
    
    if (result.approvalLevel === 'automated') points = 20
    else if (result.approvalLevel === 'board') points = 100
    
    if (result.approved) points += 20 // Bonus for successful approval
    
    await this.trustEngine.awardPoints({
      entityId: 'system',
      entityType: 'organization',
      points,
      source: 'clearance',
      category: 'risk_management',
      description: `Processed decision: ${request.title} (${result.approved ? 'Approved' : 'Rejected'})`,
      evidence: [request.id],
      multiplier: request.businessContext.urgency === 'critical' ? 1.5 : 1.0
    })
  }

  private generateEventId(): string {
    return `clearance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateDecisionId(): string {
    return `dec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Shutdown the service
   */
  public shutdown(): void {
    this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
    this.logger.info('CLEARANCE workflow service shutdown complete')
  }
}