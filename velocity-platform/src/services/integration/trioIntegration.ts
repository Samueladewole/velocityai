/**
 * ERIP Core Trio Integration Service
 * 
 * Implements the integrated workflow for COMPASS → ATLAS → PRISM
 * following the patterns specified in workflow-examples.md
 */

import { ERIPEventBus } from '../../infrastructure/events/eventBus'
import { 
  ERIPEvent, 
  CompassEvent, 
  AtlasEvent, 
  PrismEvent 
} from '../../infrastructure/events/schemas'
import { Logger } from '../../infrastructure/logging/logger'
import { TrustEquityEngine } from '../../infrastructure/trustEquity/engine'

export interface TrioIntegrationConfig {
  eventBus: ERIPEventBus
  trustEngine: TrustEquityEngine
  autoRouting: {
    compassToAtlas: boolean
    atlasToprism: boolean
    enableDecisionSupport: boolean
  }
  thresholds: {
    highRiskAmount: number
    criticalSeverityScore: number
    autoApprovalLimit: number
  }
}

export class CoreTrioIntegration {
  private eventBus: ERIPEventBus
  private logger: Logger
  private trustEngine: TrustEquityEngine
  private unsubscribeFunctions: (() => void)[] = []

  constructor(private config: TrioIntegrationConfig) {
    this.eventBus = config.eventBus
    this.trustEngine = config.trustEngine
    this.logger = new Logger('CoreTrioIntegration')
    this.setupIntegrationHandlers()
  }

  /**
   * Setup all integration event handlers for the trio workflow
   */
  private setupIntegrationHandlers(): void {
    this.logger.info('Setting up Core Trio integration handlers')

    // COMPASS → ATLAS Integration
    const compassUnsubscribe = this.eventBus.subscribeToComponent('compass', 
      this.handleCompassEvents.bind(this)
    )
    this.unsubscribeFunctions.push(compassUnsubscribe)

    // ATLAS → PRISM Integration  
    const atlasUnsubscribe = this.eventBus.subscribeToComponent('atlas',
      this.handleAtlasEvents.bind(this)
    )
    this.unsubscribeFunctions.push(atlasUnsubscribe)

    // PRISM → Decision Flow Integration
    const prismUnsubscribe = this.eventBus.subscribeToComponent('prism',
      this.handlePrismEvents.bind(this)
    )
    this.unsubscribeFunctions.push(prismUnsubscribe)

    this.logger.info('Core Trio integration handlers configured')
  }

  /**
   * Handle COMPASS events and trigger ATLAS assessments
   */
  private async handleCompassEvents(event: ERIPEvent): Promise<void> {
    if (event.source !== 'compass') return

    try {
      switch (event.type) {
        case 'regulation.detected':
          await this.handleRegulationDetected(event as CompassEvent)
          break
        
        case 'compliance.gap.identified':
          await this.handleComplianceGap(event as CompassEvent)
          break
          
        case 'questionnaire.completed':
          await this.handleQuestionnaireCompleted(event as CompassEvent)
          break
      }
    } catch (error) {
      this.logger.error('Failed to handle COMPASS event', { event, error })
    }
  }

  /**
   * Handle new regulation detection → Trigger ATLAS security assessment
   */
  private async handleRegulationDetected(event: CompassEvent & { type: 'regulation.detected' }): Promise<void> {
    this.logger.info('Processing new regulation for ATLAS assessment', { 
      regulationId: event.data.regulationId 
    })

    if (!this.config.autoRouting.compassToAtlas) {
      this.logger.debug('Auto-routing disabled for COMPASS → ATLAS')
      return
    }

    // Create ATLAS security assessment request
    await this.eventBus.publish({
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      type: 'security.assessment.requested',
      source: 'trio_integration' as any,
      data: {
        requestId: this.generateRequestId(),
        trigger: 'regulation_detected',
        regulationId: event.data.regulationId,
        scope: {
          frameworks: event.data.affectedFrameworks,
          estimatedCost: event.data.estimatedImplementationCost,
          impact: event.data.impact
        },
        assessmentType: 'compliance_driven',
        priority: event.data.impact === 'high' ? 'high' : 'medium',
        urgency: this.calculateUrgency(event.data.effectiveDate),
        requiredControls: await this.mapRegulationToControls(event.data.regulationId),
        trustEquityContext: event.data.trustEquityImpact
      }
    })

    // Award trust equity for proactive assessment
    await this.trustEngine.awardPoints({
      entityId: 'system',
      entityType: 'organization',
      points: 25,
      source: 'compass',
      category: 'compliance',
      description: `Proactive security assessment triggered for regulation ${event.data.title}`,
      evidence: [event.eventId],
      multiplier: event.data.impact === 'high' ? 1.5 : 1.0
    })

    this.logger.info('ATLAS security assessment triggered for regulation', {
      regulationId: event.data.regulationId,
      trustEquityAwarded: 25
    })
  }

  /**
   * Handle compliance gap → Trigger targeted ATLAS assessment
   */
  private async handleComplianceGap(event: CompassEvent & { type: 'compliance.gap.identified' }): Promise<void> {
    this.logger.info('Processing compliance gap for ATLAS validation', {
      gapId: event.data.gapId,
      framework: event.data.framework
    })

    // Create targeted security control assessment
    await this.eventBus.publish({
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      type: 'control.assessment.requested',
      source: 'trio_integration' as any,
      data: {
        requestId: this.generateRequestId(),
        trigger: 'compliance_gap',
        gapId: event.data.gapId,
        framework: event.data.framework,
        requirement: event.data.requirement,
        severity: event.data.severity,
        focusAreas: event.data.recommendedActions,
        expectedRemediationCost: event.data.estimatedRemediationCost,
        trustEquityAtRisk: event.data.trustEquityLoss
      }
    })
  }

  /**
   * Handle ATLAS events and trigger PRISM quantification
   */
  private async handleAtlasEvents(event: ERIPEvent): Promise<void> {
    if (event.source !== 'atlas') return

    try {
      switch (event.type) {
        case 'vulnerability.discovered':
          await this.handleVulnerabilityDiscovered(event as AtlasEvent)
          break
          
        case 'security.posture.updated':
          await this.handleSecurityPostureUpdated(event as AtlasEvent)
          break
          
        case 'asset.scanned':
          await this.handleAssetScanned(event as AtlasEvent)
          break
      }
    } catch (error) {
      this.logger.error('Failed to handle ATLAS event', { event, error })
    }
  }

  /**
   * Handle vulnerability discovery → Trigger PRISM risk quantification
   */
  private async handleVulnerabilityDiscovered(event: AtlasEvent & { type: 'vulnerability.discovered' }): Promise<void> {
    this.logger.info('Processing vulnerability for PRISM quantification', {
      vulnerabilityId: event.data.vulnerabilityId,
      severity: event.data.severity
    })

    if (!this.config.autoRouting.atlasToprism) {
      this.logger.debug('Auto-routing disabled for ATLAS → PRISM')
      return
    }

    // Create risk quantification request
    await this.eventBus.publish({
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      type: 'risk.quantification.requested',
      source: 'trio_integration' as any,
      data: {
        requestId: this.generateRequestId(),
        trigger: 'vulnerability_discovered',
        vulnerabilityId: event.data.vulnerabilityId,
        assetId: event.data.assetId,
        riskProfile: {
          assetValue: await this.getAssetValue(event.data.assetId),
          exposureLevel: this.calculateExposureLevel(event.data.cvssScore),
          businessCriticality: await this.getAssetCriticality(event.data.assetId),
          affectedSystems: event.data.affectedSystems
        },
        scenarios: [
          {
            name: 'exploitation_successful',
            probability: this.calculateExploitationProbability(event.data.cvssScore),
            impactFactors: ['data_breach', 'system_downtime', 'regulatory_fines']
          },
          {
            name: 'lateral_movement',
            probability: this.calculateLateralMovementProbability(event.data.affectedSystems.length),
            impactFactors: ['system_compromise', 'data_exfiltration']
          }
        ],
        complianceContext: event.data.complianceFrameworksAffected,
        trustEquityImpact: event.data.trustEquityImpact,
        urgency: event.data.severity === 'critical' ? 'critical' : 'high'
      }
    })

    // If critical vulnerability, also trigger immediate decision routing
    if (event.data.severity === 'critical') {
      await this.triggerImmediateDecisionRouting({
        vulnerabilityId: event.data.vulnerabilityId,
        severity: event.data.severity,
        affectedSystems: event.data.affectedSystems
      })
    }
  }

  /**
   * Handle security posture updates → Update risk models in PRISM
   */
  private async handleSecurityPostureUpdated(event: AtlasEvent & { type: 'security.posture.updated' }): Promise<void> {
    this.logger.info('Processing security posture update for PRISM', {
      assessmentId: event.data.assessmentId,
      overallScore: event.data.overallScore
    })

    // Update overall risk posture in PRISM
    await this.eventBus.publish({
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      type: 'risk.model.update.requested',
      source: 'trio_integration' as any,
      data: {
        requestId: this.generateRequestId(),
        trigger: 'security_posture_updated',
        assessmentId: event.data.assessmentId,
        postureMetrics: {
          overallScore: event.data.overallScore,
          controlsEffectiveness: (event.data.controlsPassed / event.data.controlsAssessed) * 100,
          riskReduction: this.calculateRiskReduction(event.data.overallScore),
          complianceImprovement: event.data.trustEquityChange > 0
        },
        modelAdjustments: {
          baselineProbability: this.calculateBaselineProbabilityAdjustment(event.data.overallScore),
          defenseDepth: this.calculateDefenseDepthFactor(event.data.controlsPassed),
          monitoringEffectiveness: event.data.riskLevel
        }
      }
    })
  }

  /**
   * Handle PRISM events and trigger decision flows
   */
  private async handlePrismEvents(event: ERIPEvent): Promise<void> {
    if (event.source !== 'prism') return

    try {
      switch (event.type) {
        case 'risk.quantified':
          await this.handleRiskQuantified(event as PrismEvent)
          break
          
        case 'monte.carlo.completed':
          await this.handleMonteCarloCompleted(event as PrismEvent)
          break
      }
    } catch (error) {
      this.logger.error('Failed to handle PRISM event', { event, error })
    }
  }

  /**
   * Handle risk quantification → Route to appropriate decision authority
   */
  private async handleRiskQuantified(event: PrismEvent & { type: 'risk.quantified' }): Promise<void> {
    this.logger.info('Processing risk quantification for decision routing', {
      riskId: event.data.riskId,
      ale: event.data.ale
    })

    if (!this.config.autoRouting.enableDecisionSupport) {
      this.logger.debug('Decision support routing disabled')
      return
    }

    // Determine routing based on risk amount and organizational thresholds
    const routingDecision = this.calculateDecisionRouting({
      riskAmount: event.data.ale,
      residualRisk: event.data.residualRisk,
      mitigationCost: event.data.mitigationCost,
      confidenceLevel: this.calculateConfidenceLevel(event.data.confidenceInterval),
      trustEquityRequired: event.data.trustEquityRequired
    })

    // Route to CLEARANCE for decision processing
    await this.eventBus.publish({
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      type: 'decision.routing.requested',
      source: 'trio_integration' as any,
      data: {
        requestId: this.generateRequestId(),
        trigger: 'risk_quantified',
        riskId: event.data.riskId,
        scenario: event.data.scenario,
        financialImpact: {
          ale: event.data.ale,
          sle: event.data.sle,
          aro: event.data.aro,
          mitigationCost: event.data.mitigationCost,
          residualRisk: event.data.residualRisk
        },
        routing: routingDecision,
        context: {
          confidenceInterval: event.data.confidenceInterval,
          trustEquityRequired: event.data.trustEquityRequired,
          urgency: this.calculateDecisionUrgency(event.data.ale),
          stakeholders: await this.identifyStakeholders(event.data.riskId)
        },
        recommendedActions: [
          'Review risk mitigation options',
          'Assess budget impact',
          'Evaluate timeline constraints',
          'Consider regulatory implications'
        ]
      }
    })

    // Award trust equity for completed risk analysis
    await this.trustEngine.awardPoints({
      entityId: 'system',
      entityType: 'organization',
      points: 40,
      source: 'prism',
      category: 'risk_management',
      description: `Completed quantitative risk analysis for ${event.data.scenario}`,
      evidence: [event.eventId],
      multiplier: routingDecision.priority === 'critical' ? 2.0 : 1.0
    })
  }

  /**
   * Handle Monte Carlo simulation completion → Generate executive insights
   */
  private async handleMonteCarloCompleted(event: PrismEvent & { type: 'monte.carlo.completed' }): Promise<void> {
    this.logger.info('Processing Monte Carlo results for executive reporting', {
      simulationId: event.data.simulationId,
      iterations: event.data.iterations
    })

    // Generate executive dashboard update
    await this.eventBus.publish({
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      type: 'executive.insight.generated',
      source: 'trio_integration' as any,
      data: {
        insightId: this.generateInsightId(),
        trigger: 'monte_carlo_completed',
        simulationId: event.data.simulationId,
        executiveSummary: {
          totalRiskExposure: event.data.results.percentile95,
          worstCaseScenario: event.data.results.percentile99,
          mostLikelyOutcome: event.data.results.medianLoss,
          confidenceLevel: 95,
          riskTolerance: this.assessRiskTolerance(event.data.results),
          decisionPoints: this.extractDecisionPoints(event.data.scenarios)
        },
        businessContext: {
          annualRevenue: await this.getAnnualRevenue(),
          riskBudget: await this.getRiskBudget(),
          industryBenchmarks: await this.getIndustryBenchmarks(),
          regulatoryContext: await this.getRegulatoryContext()
        },
        recommendations: event.data.recommendations,
        visualizations: [
          'risk_distribution_histogram',
          'scenario_impact_matrix',
          'cost_benefit_analysis',
          'timeline_projection'
        ]
      }
    })
  }

  /**
   * Calculate decision routing based on risk parameters
   */
  private calculateDecisionRouting(params: {
    riskAmount: number
    residualRisk: number
    mitigationCost: number
    confidenceLevel: number
    trustEquityRequired: number
  }) {
    const { riskAmount, residualRisk, mitigationCost, confidenceLevel, trustEquityRequired } = params

    // Determine routing level based on risk thresholds
    let routingLevel: 'auto_approve' | 'manager' | 'executive' | 'board' = 'manager'
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
    let slaHours = 48

    if (riskAmount >= this.config.thresholds.highRiskAmount) {
      routingLevel = 'board'
      priority = 'critical'
      slaHours = 8
    } else if (riskAmount >= this.config.thresholds.highRiskAmount * 0.5) {
      routingLevel = 'executive'
      priority = 'high'
      slaHours = 24
    } else if (riskAmount <= this.config.thresholds.autoApprovalLimit && confidenceLevel >= 90) {
      routingLevel = 'auto_approve'
      priority = 'low'
      slaHours = 1
    }

    return {
      routingLevel,
      priority,
      slaHours,
      requiredApprovals: routingLevel === 'board' ? 3 : routingLevel === 'executive' ? 2 : 1,
      escalationPath: this.defineEscalationPath(routingLevel),
      contextualFactors: {
        riskVsBudget: riskAmount / mitigationCost,
        confidenceAdjustment: confidenceLevel >= 95 ? 'high_confidence' : 'moderate_confidence',
        trustEquityImpact: trustEquityRequired > 100 ? 'significant' : 'moderate'
      }
    }
  }

  /**
   * Trigger immediate decision routing for critical situations
   */
  private async triggerImmediateDecisionRouting(context: {
    vulnerabilityId: string
    severity: string
    affectedSystems: string[]
  }): Promise<void> {
    await this.eventBus.publish({
      eventId: this.generateEventId(),
      timestamp: new Date().toISOString(),
      type: 'emergency.decision.required',
      source: 'trio_integration' as any,
      data: {
        emergencyId: this.generateEmergencyId(),
        trigger: 'critical_vulnerability',
        context,
        urgency: 'immediate',
        autoEscalate: true,
        stakeholders: ['CISO', 'CTO', 'CEO'],
        slaMinutes: 30,
        communicationChannels: ['email', 'slack', 'sms', 'phone'],
        contingencyPlans: await this.getContingencyPlans(context.vulnerabilityId)
      }
    })
  }

  // Utility methods for calculations and data retrieval
  private generateEventId(): string {
    return `trio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateInsightId(): string {
    return `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateEmergencyId(): string {
    return `emg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private calculateUrgency(effectiveDate: string): 'low' | 'medium' | 'high' | 'critical' {
    const daysUntilEffective = Math.ceil((new Date(effectiveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilEffective <= 30) return 'critical'
    if (daysUntilEffective <= 90) return 'high'
    if (daysUntilEffective <= 180) return 'medium'
    return 'low'
  }

  private calculateExposureLevel(cvssScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (cvssScore >= 9.0) return 'critical'
    if (cvssScore >= 7.0) return 'high'
    if (cvssScore >= 4.0) return 'medium'
    return 'low'
  }

  private calculateExploitationProbability(cvssScore: number): number {
    return Math.min(0.95, cvssScore / 10 * 0.8)
  }

  private calculateLateralMovementProbability(systemCount: number): number {
    return Math.min(0.8, systemCount * 0.1)
  }

  private calculateConfidenceLevel(interval: { lower: number; upper: number }): number {
    const spread = interval.upper - interval.lower
    const midpoint = (interval.upper + interval.lower) / 2
    return Math.max(50, 100 - (spread / midpoint * 100))
  }

  private calculateRiskReduction(securityScore: number): number {
    return Math.max(0, (securityScore - 50) / 50)
  }

  private calculateBaselineProbabilityAdjustment(securityScore: number): number {
    return 1 - (securityScore / 100 * 0.5)
  }

  private calculateDefenseDepthFactor(controlsPassed: number): number {
    return Math.min(2.0, 1 + (controlsPassed * 0.1))
  }

  private calculateDecisionUrgency(riskAmount: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskAmount >= this.config.thresholds.highRiskAmount) return 'critical'
    if (riskAmount >= this.config.thresholds.highRiskAmount * 0.3) return 'high'
    return 'medium'
  }

  private defineEscalationPath(level: string): string[] {
    const paths = {
      'auto_approve': ['system'],
      'manager': ['department_head', 'risk_manager'],
      'executive': ['ciso', 'cro', 'cto'],
      'board': ['ceo', 'board_chair', 'risk_committee']
    }
    return paths[level as keyof typeof paths] || ['manager']
  }

  private assessRiskTolerance(results: any): 'conservative' | 'moderate' | 'aggressive' {
    const percentile95 = results.percentile95
    const annualRevenue = 10000000 // This should come from actual data
    const ratio = percentile95 / annualRevenue

    if (ratio > 0.05) return 'conservative'
    if (ratio > 0.02) return 'moderate'
    return 'aggressive'
  }

  private extractDecisionPoints(scenarios: any[]): string[] {
    return scenarios.map(scenario => 
      `${scenario.name}: ${(scenario.probability * 100).toFixed(1)}% chance of $${scenario.impact.toLocaleString()} impact`
    )
  }

  // Placeholder methods for data retrieval - would be implemented with actual data sources
  private async mapRegulationToControls(regulationId: string): Promise<string[]> {
    return ['access_control', 'data_protection', 'incident_response'] // Placeholder
  }

  private async getAssetValue(assetId: string): Promise<number> {
    return 500000 // Placeholder
  }

  private async getAssetCriticality(assetId: string): Promise<'low' | 'medium' | 'high' | 'critical'> {
    return 'high' // Placeholder
  }

  private async identifyStakeholders(riskId: string): Promise<string[]> {
    return ['Risk Manager', 'CISO', 'Business Owner'] // Placeholder
  }

  private async getAnnualRevenue(): Promise<number> {
    return 10000000 // Placeholder
  }

  private async getRiskBudget(): Promise<number> {
    return 500000 // Placeholder
  }

  private async getIndustryBenchmarks(): Promise<any> {
    return { averageRisk: 200000, peerGroup: 'technology' } // Placeholder
  }

  private async getRegulatoryContext(): Promise<string[]> {
    return ['SOX', 'GDPR', 'CCPA'] // Placeholder
  }

  private async getContingencyPlans(vulnerabilityId: string): Promise<string[]> {
    return ['Isolate affected systems', 'Apply emergency patches', 'Activate incident response'] // Placeholder
  }

  /**
   * Shutdown the integration service
   */
  public shutdown(): void {
    this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
    this.logger.info('Core Trio integration shutdown complete')
  }
}

/**
 * Factory function to create and configure the Core Trio Integration
 */
export function createCoreTrioIntegration(config: TrioIntegrationConfig): CoreTrioIntegration {
  return new CoreTrioIntegration(config)
}