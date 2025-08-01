/**
 * PRISM Risk Quantification API Service
 * 
 * REST API endpoints for risk quantification, Monte Carlo simulations,
 * and decision support workflows
 */

import express, { Request, Response, Router } from 'express'
import { z } from 'zod'
import { MonteCarloEngine, MonteCarloScenario, SimulationParameters, SimulationResult } from '../risk/monteCarloEngine'
import { ERIPEventBus } from '../../infrastructure/events/eventBus'
import { Logger } from '../../infrastructure/logging/logger'
import { TrustEquityEngine } from '../../infrastructure/trustEquity/engine'

// ===============================
// Request/Response Schemas
// ===============================

const RiskScenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  assetId: z.string().optional(),
  vulnerabilityId: z.string().optional(),
  threatType: z.enum(['vulnerability', 'compliance', 'operational', 'strategic']),
  probability: z.object({
    type: z.enum(['normal', 'lognormal', 'beta', 'uniform', 'triangular', 'poisson']),
    parameters: z.record(z.number())
  }),
  impact: z.object({
    type: z.enum(['normal', 'lognormal', 'beta', 'uniform', 'triangular', 'poisson']),
    parameters: z.record(z.number())
  }),
  frequency: z.object({
    type: z.enum(['poisson', 'negative_binomial', 'uniform']),
    parameters: z.record(z.number())
  }),
  controls: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['preventive', 'detective', 'corrective']),
    effectiveness: z.number().min(0).max(1),
    cost: z.number().min(0),
    reliability: z.number().min(0).max(1),
    coverage: z.number().min(0).max(1)
  }))
})

const SimulationRequestSchema = z.object({
  scenarios: z.array(RiskScenarioSchema).min(1),
  parameters: z.object({
    iterations: z.number().min(1000).max(1000000).default(10000),
    confidence: z.number().min(80).max(99).default(95),
    timeHorizon: z.number().min(1).max(10).default(1),
    discountRate: z.number().min(0).max(0.2).default(0.05),
    currency: z.string().default('USD'),
    businessContext: z.object({
      annualRevenue: z.number().min(0),
      riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']).default('moderate'),
      industryBenchmark: z.number().min(0).optional()
    })
  })
})

const QuickRiskAssessmentSchema = z.object({
  assetValue: z.number().min(0),
  threatLevel: z.enum(['low', 'medium', 'high', 'critical']),
  vulnerabilities: z.array(z.object({
    cvssScore: z.number().min(0).max(10),
    exploitProbability: z.number().min(0).max(1),
    businessImpact: z.enum(['low', 'medium', 'high', 'critical'])
  })),
  existingControls: z.array(z.object({
    effectiveness: z.number().min(0).max(1),
    coverage: z.number().min(0).max(1)
  })).optional()
})

const PortfolioRiskSchema = z.object({
  assets: z.array(z.object({
    id: z.string(),
    value: z.number().min(0),
    criticality: z.enum(['low', 'medium', 'high', 'critical']),
    riskScenarios: z.array(z.string())
  })),
  correlations: z.array(z.object({
    asset1: z.string(),
    asset2: z.string(),
    correlation: z.number().min(-1).max(1)
  })).optional()
})

// ===============================
// API Service Class
// ===============================

export class PrismApiService {
  private router: Router
  private monteCarloEngine: MonteCarloEngine
  private eventBus: ERIPEventBus
  private logger: Logger
  private trustEngine: TrustEquityEngine

  constructor(eventBus: ERIPEventBus, trustEngine: TrustEquityEngine) {
    this.router = express.Router()
    this.eventBus = eventBus
    this.trustEngine = trustEngine
    this.monteCarloEngine = new MonteCarloEngine(eventBus)
    this.logger = new Logger('PrismApiService')
    this.setupRoutes()
  }

  private setupRoutes(): void {
    // Monte Carlo simulation endpoint
    this.router.post('/simulate', this.handleMonteCarloSimulation.bind(this))
    
    // Quick risk assessment
    this.router.post('/assess/quick', this.handleQuickRiskAssessment.bind(this))
    
    // FAIR methodology calculation
    this.router.post('/fair', this.handleFairCalculation.bind(this))
    
    // Portfolio risk analysis
    this.router.post('/portfolio', this.handlePortfolioRisk.bind(this))
    
    // Risk scenario management
    this.router.get('/scenarios', this.getScenarios.bind(this))
    this.router.post('/scenarios', this.createScenario.bind(this))
    this.router.put('/scenarios/:id', this.updateScenario.bind(this))
    this.router.delete('/scenarios/:id', this.deleteScenario.bind(this))
    
    // Risk metrics and KPIs
    this.router.get('/metrics', this.getRiskMetrics.bind(this))
    this.router.get('/metrics/trends', this.getRiskTrends.bind(this))
    
    // Decision support
    this.router.post('/decision-support', this.handleDecisionSupport.bind(this))
    
    // Model validation
    this.router.post('/validate', this.validateRiskModel.bind(this))
    
    // Export results
    this.router.get('/results/:simulationId/export', this.exportResults.bind(this))
  }

  /**
   * Run Monte Carlo simulation
   */
  private async handleMonteCarloSimulation(req: Request, res: Response): Promise<void> {
    try {
      const requestId = this.generateRequestId()
      this.logger.info('Starting Monte Carlo simulation', { requestId })

      // Validate request
      const validatedRequest = SimulationRequestSchema.parse(req.body)
      
      // Convert API scenarios to engine format
      const scenarios: MonteCarloScenario[] = validatedRequest.scenarios.map(scenario => ({
        id: scenario.id,
        name: scenario.name,
        description: scenario.description,
        probabilityDistribution: scenario.probability,
        impactDistribution: scenario.impact,
        frequency: scenario.frequency,
        controls: scenario.controls,
        dependencies: [] // Could be expanded based on scenario relationships
      }))

      // Run simulation
      const result = await this.monteCarloEngine.runSimulation(scenarios, validatedRequest.parameters)

      // Publish completion event
      await this.eventBus.publish({
        eventId: `prism_€{requestId}`,
        timestamp: new Date().toISOString(),
        type: 'risk.quantified',
        source: 'prism',
        data: {
          riskId: requestId,
          scenario: 'monte_carlo_simulation',
          probability: result.statistics.mean / validatedRequest.parameters.businessContext.annualRevenue,
          impact: result.statistics.mean,
          ale: result.statistics.mean,
          sle: result.statistics.mean, // Simplified for demo
          aro: 1, // Annual frequency
          confidenceInterval: result.confidenceInterval,
          mitigationCost: this.calculateMitigationCost(scenarios),
          residualRisk: result.riskMetrics.var95,
          trustEquityRequired: Math.ceil(result.riskMetrics.var95 / 10000)
        }
      })

      // Award trust equity for completed analysis
      await this.trustEngine.awardPoints({
        entityId: 'system',
        entityType: 'organization',
        points: 50,
        source: 'prism',
        category: 'risk_management',
        description: `Completed Monte Carlo simulation with €{result.totalIterations} iterations`,
        evidence: [requestId],
        multiplier: validatedRequest.parameters.iterations >= 100000 ? 1.5 : 1.0
      })

      res.json({
        requestId,
        status: 'completed',
        result: {
          ...result,
          businessInsights: await this.generateBusinessInsights(result, validatedRequest.parameters),
          complianceContext: await this.getComplianceContext(scenarios),
          actionItems: await this.generateActionItems(result, scenarios)
        }
      })

    } catch (error) {
      this.logger.error('Monte Carlo simulation failed', { error })
      res.status(400).json({
        error: 'Simulation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Quick risk assessment for immediate decisions
   */
  private async handleQuickRiskAssessment(req: Request, res: Response): Promise<void> {
    try {
      const requestId = this.generateRequestId()
      const validatedRequest = QuickRiskAssessmentSchema.parse(req.body)

      this.logger.info('Processing quick risk assessment', { requestId })

      // Calculate base risk metrics
      const assetValue = validatedRequest.assetValue
      const threatMultiplier = this.getThreatMultiplier(validatedRequest.threatLevel)
      
      // Aggregate vulnerability risks
      const vulnerabilityRisk = validatedRequest.vulnerabilities.reduce((total, vuln) => {
        const impactMultiplier = this.getImpactMultiplier(vuln.businessImpact)
        const riskScore = (vuln.cvssScore / 10) * vuln.exploitProbability * impactMultiplier
        return total + (assetValue * riskScore)
      }, 0)

      // Apply control effectiveness
      let controlReduction = 0
      if (validatedRequest.existingControls) {
        controlReduction = validatedRequest.existingControls.reduce((total, control) => {
          return total + (control.effectiveness * control.coverage)
        }, 0) / validatedRequest.existingControls.length
      }

      const residualRisk = vulnerabilityRisk * threatMultiplier * (1 - controlReduction)
      
      // Generate risk level and recommendations
      const riskLevel = this.categorizeRiskLevel(residualRisk, assetValue)
      const recommendations = this.generateQuickRecommendations(riskLevel, validatedRequest)
      
      const result = {
        requestId,
        assessmentType: 'quick_assessment',
        riskMetrics: {
          assetValue,
          vulnerabilityRisk,
          threatLevel: validatedRequest.threatLevel,
          controlEffectiveness: controlReduction,
          residualRisk,
          riskLevel,
          riskRatio: residualRisk / assetValue
        },
        recommendations,
        urgency: riskLevel === 'critical' ? 'immediate' : riskLevel === 'high' ? 'high' : 'medium',
        nextSteps: [
          'Review and validate risk assumptions',
          'Consider additional control measures',
          'Monitor threat landscape changes',
          'Schedule detailed risk assessment if needed'
        ]
      }

      // Publish risk assessment event
      await this.eventBus.publish({
        eventId: `quick_€{requestId}`,
        timestamp: new Date().toISOString(),
        type: 'risk.quantified',
        source: 'prism',
        data: {
          riskId: requestId,
          scenario: 'quick_assessment',
          probability: vulnerabilityRisk > 0 ? 0.3 : 0.1, // Simplified
          impact: residualRisk,
          ale: residualRisk,
          sle: residualRisk,
          aro: 1,
          confidenceInterval: { lower: residualRisk * 0.7, upper: residualRisk * 1.3 },
          mitigationCost: residualRisk * 0.1, // Estimated 10% of risk
          residualRisk,
          trustEquityRequired: Math.ceil(residualRisk / 5000)
        }
      })

      res.json(result)

    } catch (error) {
      this.logger.error('Quick risk assessment failed', { error })
      res.status(400).json({
        error: 'Assessment failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * FAIR methodology calculation
   */
  private async handleFairCalculation(req: Request, res: Response): Promise<void> {
    try {
      const {
        assetValue,
        threatEventFrequency,
        vulnerabilityProbability,
        lossMagnitude,
        controlStrength
      } = req.body

      const requestId = this.generateRequestId()
      this.logger.info('Processing FAIR calculation', { requestId })

      // FAIR calculation: Loss Event Frequency = TEF * Vulnerability
      const lossEventFrequency = threatEventFrequency * vulnerabilityProbability

      // Apply control strength
      const residualFrequency = lossEventFrequency * (1 - controlStrength)

      // Calculate Annual Loss Expectancy (ALE)
      const ale = residualFrequency * lossMagnitude

      // Generate FAIR-compliant result
      const result = {
        requestId,
        methodology: 'FAIR',
        calculations: {
          threatEventFrequency,
          vulnerabilityProbability,
          lossEventFrequency,
          controlStrength,
          residualFrequency,
          lossMagnitude,
          ale
        },
        riskFactors: {
          contactFrequency: threatEventFrequency,
          threatCapability: vulnerabilityProbability,
          controlDifficulty: 1 - controlStrength,
          lossForm: 'productivity_loss', // Could be more specific
          primaryLoss: lossMagnitude * 0.8,
          secondaryLoss: lossMagnitude * 0.2
        },
        confidenceInterval: {
          lower: ale * 0.6,
          upper: ale * 1.4,
          confidence: 80
        }
      }

      res.json(result)

    } catch (error) {
      this.logger.error('FAIR calculation failed', { error })
      res.status(400).json({
        error: 'FAIR calculation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Portfolio risk analysis
   */
  private async handlePortfolioRisk(req: Request, res: Response): Promise<void> {
    try {
      const requestId = this.generateRequestId()
      const validatedRequest = PortfolioRiskSchema.parse(req.body)

      this.logger.info('Processing portfolio risk analysis', { requestId })

      // Calculate individual asset risks
      const assetRisks = await Promise.all(
        validatedRequest.assets.map(async asset => {
          const baseRisk = asset.value * this.getCriticalityMultiplier(asset.criticality)
          // In real implementation, would fetch actual scenario data
          return {
            assetId: asset.id,
            individualRisk: baseRisk * 0.05, // 5% base risk
            value: asset.value,
            criticality: asset.criticality
          }
        })
      )

      // Calculate portfolio-level metrics
      const totalValue = assetRisks.reduce((sum, asset) => sum + asset.value, 0)
      const totalRisk = assetRisks.reduce((sum, asset) => sum + asset.individualRisk, 0)
      
      // Apply correlations if provided
      let correlationAdjustment = 1.0
      if (validatedRequest.correlations && validatedRequest.correlations.length > 0) {
        const avgCorrelation = validatedRequest.correlations.reduce((sum, corr) => sum + Math.abs(corr.correlation), 0) / validatedRequest.correlations.length
        correlationAdjustment = 1 + (avgCorrelation * 0.3) // Simplified correlation adjustment
      }

      const portfolioRisk = totalRisk * correlationAdjustment

      const result = {
        requestId,
        portfolioMetrics: {
          totalAssets: validatedRequest.assets.length,
          totalValue,
          portfolioRisk,
          riskConcentration: Math.max(...assetRisks.map(a => a.individualRisk)) / totalRisk,
          diversificationRatio: totalRisk / (assetRisks.reduce((sum, asset) => sum + asset.individualRisk, 0) / assetRisks.length),
          correlationAdjustment
        },
        assetRisks,
        riskDistribution: {
          critical: assetRisks.filter(a => a.criticality === 'critical').length,
          high: assetRisks.filter(a => a.criticality === 'high').length,
          medium: assetRisks.filter(a => a.criticality === 'medium').length,
          low: assetRisks.filter(a => a.criticality === 'low').length
        },
        recommendations: await this.generatePortfolioRecommendations(assetRisks, portfolioRisk)
      }

      res.json(result)

    } catch (error) {
      this.logger.error('Portfolio risk analysis failed', { error })
      res.status(400).json({
        error: 'Portfolio analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Decision support workflow
   */
  private async handleDecisionSupport(req: Request, res: Response): Promise<void> {
    try {
      const { riskAmount, mitigationOptions, businessContext, timeframe } = req.body
      const requestId = this.generateRequestId()

      this.logger.info('Processing decision support request', { requestId, riskAmount })

      // Analyze mitigation options
      const optionAnalysis = mitigationOptions.map((option: any) => {
        const costBenefit = option.riskReduction / option.cost
        const paybackPeriod = option.cost / (option.riskReduction * (timeframe || 1))
        const roi = ((option.riskReduction - option.cost) / option.cost) * 100

        return {
          ...option,
          costBenefit,
          paybackPeriod,
          roi,
          effectiveness: option.riskReduction / riskAmount
        }
      }).sort((a: any, b: any) => b.costBenefit - a.costBenefit)

      // Decision matrix
      const decisionMatrix = {
        doNothing: {
          cost: 0,
          riskReduction: 0,
          acceptableIf: riskAmount < (businessContext.riskTolerance || 100000)
        },
        accept: {
          cost: 0,
          residualRisk: riskAmount,
          recommendedIf: riskAmount < (businessContext.annualRevenue * 0.01)
        },
        mitigate: {
          bestOption: optionAnalysis[0],
          alternatives: optionAnalysis.slice(1, 3)
        },
        transfer: {
          insuranceCost: riskAmount * 0.05, // Estimated 5% of risk
          recommended: riskAmount > (businessContext.annualRevenue * 0.02)
        }
      }

      // Generate recommendation
      const recommendation = this.generateRiskDecisionRecommendation(
        riskAmount, 
        optionAnalysis, 
        businessContext
      )

      res.json({
        requestId,
        riskAmount,
        decisionMatrix,
        recommendation,
        optionAnalysis: optionAnalysis.slice(0, 5), // Top 5 options
        sensitivity: {
          riskToleranceImpact: this.calculateSensitivity(riskAmount, businessContext),
          timeframeSensitivity: optionAnalysis.map((opt: any) => ({
            option: opt.name,
            sensitivity: opt.paybackPeriod
          }))
        }
      })

    } catch (error) {
      this.logger.error('Decision support failed', { error })
      res.status(400).json({
        error: 'Decision support failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Get risk metrics and KPIs
   */
  private async getRiskMetrics(req: Request, res: Response): Promise<void> {
    try {
      // In real implementation, would fetch from database
      const metrics = {
        totalRiskExposure: 2500000,
        riskTrend: 'decreasing',
        topRisks: [
          { name: 'Data Breach', ale: 1200000, trend: 'stable' },
          { name: 'System Outage', ale: 800000, trend: 'decreasing' },
          { name: 'Compliance Violation', ale: 500000, trend: 'increasing' }
        ],
        controlEffectiveness: 0.75,
        riskReductionThisYear: 0.15,
        mitigationSpend: 150000,
        riskSpendRatio: 0.06 // 6% of risk exposure
      }

      res.json(metrics)

    } catch (error) {
      this.logger.error('Failed to get risk metrics', { error })
      res.status(500).json({ error: 'Failed to retrieve metrics' })
    }
  }

  // Utility methods
  private getThreatMultiplier(level: string): number {
    const multipliers = { low: 0.2, medium: 0.5, high: 0.8, critical: 1.0 }
    return multipliers[level as keyof typeof multipliers] || 0.5
  }

  private getImpactMultiplier(level: string): number {
    const multipliers = { low: 0.1, medium: 0.3, high: 0.7, critical: 1.0 }
    return multipliers[level as keyof typeof multipliers] || 0.3
  }

  private getCriticalityMultiplier(level: string): number {
    const multipliers = { low: 0.5, medium: 1.0, high: 1.5, critical: 2.0 }
    return multipliers[level as keyof typeof multipliers] || 1.0
  }

  private categorizeRiskLevel(risk: number, assetValue: number): 'low' | 'medium' | 'high' | 'critical' {
    const ratio = risk / assetValue
    if (ratio > 0.1) return 'critical'
    if (ratio > 0.05) return 'high'
    if (ratio > 0.01) return 'medium'
    return 'low'
  }

  private generateQuickRecommendations(riskLevel: string, assessment: any): string[] {
    const recommendations = []
    
    if (riskLevel === 'critical') {
      recommendations.push('IMMEDIATE ACTION: Implement emergency controls')
      recommendations.push('Consider temporary asset isolation')
      recommendations.push('Activate incident response procedures')
    } else if (riskLevel === 'high') {
      recommendations.push('Priority mitigation required within 30 days')
      recommendations.push('Review and enhance existing controls')
      recommendations.push('Consider risk transfer options')
    } else {
      recommendations.push('Monitor risk levels regularly')
      recommendations.push('Evaluate cost-effective control improvements')
    }

    return recommendations
  }

  private generateRiskDecisionRecommendation(riskAmount: number, options: any[], context: any): any {
    if (riskAmount < context.annualRevenue * 0.001) {
      return {
        decision: 'accept',
        rationale: 'Risk is minimal compared to business size',
        action: 'Monitor and accept current risk level'
      }
    }

    if (options.length > 0 && options[0].roi > 200) {
      return {
        decision: 'mitigate',
        rationale: `Best option provides €{options[0].roi.toFixed(0)}% ROI`,
        action: `Implement €{options[0].name}`
      }
    }

    return {
      decision: 'transfer',
      rationale: 'Risk exceeds mitigation cost-effectiveness threshold',
      action: 'Consider insurance or risk sharing arrangements'
    }
  }

  private calculateSensitivity(riskAmount: number, context: any): any {
    return {
      revenueImpact: riskAmount / context.annualRevenue,
      toleranceExcess: riskAmount / (context.riskTolerance || context.annualRevenue * 0.05)
    }
  }

  private calculateMitigationCost(scenarios: MonteCarloScenario[]): number {
    return scenarios.reduce((total, scenario) => {
      return total + scenario.controls.reduce((controlTotal, control) => controlTotal + control.cost, 0)
    }, 0)
  }

  private async generateBusinessInsights(result: SimulationResult, parameters: any): Promise<string[]> {
    const insights = []
    
    const riskRatio = result.riskMetrics.var95 / parameters.businessContext.annualRevenue
    if (riskRatio > 0.05) {
      insights.push(`Risk exposure represents €{(riskRatio * 100).toFixed(1)}% of annual revenue`)
    }

    if (result.statistics.skewness > 1) {
      insights.push('Risk distribution shows potential for extreme losses beyond normal expectations')
    }

    if (result.riskMetrics.probabilityOfRuin > 0.01) {
      insights.push(`€{(result.riskMetrics.probabilityOfRuin * 100).toFixed(1)}% probability of catastrophic loss`)
    }

    return insights
  }

  private async getComplianceContext(scenarios: MonteCarloScenario[]): Promise<string[]> {
    // Simplified - would integrate with COMPASS in real implementation
    return ['SOX', 'GDPR', 'PCI-DSS']
  }

  private async generateActionItems(result: SimulationResult, scenarios: MonteCarloScenario[]): Promise<string[]> {
    const actions = []
    
    if (result.riskMetrics.var95 > 1000000) {
      actions.push('Board-level risk review required')
    }

    actions.push('Update risk register with quantified metrics')
    actions.push('Review control effectiveness based on simulation results')
    actions.push('Schedule follow-up assessment in 6 months')

    return actions
  }

  private async generatePortfolioRecommendations(assetRisks: any[], portfolioRisk: number): Promise<string[]> {
    const recommendations = []
    
    const highRiskAssets = assetRisks.filter(asset => asset.criticality === 'critical' || asset.criticality === 'high')
    if (highRiskAssets.length > assetRisks.length * 0.5) {
      recommendations.push('Consider diversifying asset risk levels')
    }

    recommendations.push('Implement portfolio-level risk monitoring')
    recommendations.push('Review asset interdependencies and correlation risks')
    
    return recommendations
  }

  private generateRequestId(): string {
    return `prism_€{Date.now()}_€{Math.random().toString(36).substr(2, 9)}`
  }

  // Additional endpoint implementations would go here...
  private async getScenarios(req: Request, res: Response): Promise<void> {
    // Placeholder implementation
    res.json({ scenarios: [] })
  }

  private async createScenario(req: Request, res: Response): Promise<void> {
    // Placeholder implementation
    res.json({ created: true })
  }

  private async updateScenario(req: Request, res: Response): Promise<void> {
    // Placeholder implementation
    res.json({ updated: true })
  }

  private async deleteScenario(req: Request, res: Response): Promise<void> {
    // Placeholder implementation
    res.json({ deleted: true })
  }

  private async getRiskTrends(req: Request, res: Response): Promise<void> {
    // Placeholder implementation
    res.json({ trends: [] })
  }

  private async validateRiskModel(req: Request, res: Response): Promise<void> {
    // Placeholder implementation
    res.json({ valid: true })
  }

  private async exportResults(req: Request, res: Response): Promise<void> {
    // Placeholder implementation
    res.json({ exported: true })
  }

  public getRouter(): Router {
    return this.router
  }
}

/**
 * Factory function to create PRISM API router
 */
export function createPrismRouter(): Router {
  const prismApi = new PrismApiService()
  return prismApi.getRouter()
}