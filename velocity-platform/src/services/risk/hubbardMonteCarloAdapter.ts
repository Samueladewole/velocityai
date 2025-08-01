/**
 * Hubbard Monte Carlo Adapter
 * 
 * Converts Hubbard 5-point calibrated estimates into Monte Carlo
 * distribution parameters for precise quantitative risk analysis.
 */

import { HubbardEstimate, HubbardCalibrationEngine } from './hubbardCalibration'
import { MonteCarloScenario, ProbabilityDistribution } from './monteCarloEngine'
import { RiskScenario } from '@/types/prism'

export interface HubbardMonteCarloConfig {
  useEnsembleMethod: boolean
  calibrationWeighting: boolean
  distributionFitting: 'auto' | 'normal' | 'lognormal' | 'beta' | 'triangular'
  confidenceAdjustment: number // Multiplier for range adjustment based on calibration
}

export class HubbardMonteCarloAdapter {
  private calibrationEngine: HubbardCalibrationEngine
  private config: HubbardMonteCarloConfig

  constructor(config: Partial<HubbardMonteCarloConfig> = {}) {
    this.calibrationEngine = new HubbardCalibrationEngine()
    this.config = {
      useEnsembleMethod: true,
      calibrationWeighting: true,
      distributionFitting: 'auto',
      confidenceAdjustment: 1.0,
      ...config
    }
  }

  /**
   * Convert Hubbard-calibrated risk scenario to Monte Carlo format
   */
  convertRiskScenario(scenario: RiskScenario): MonteCarloScenario {
    const probabilityDistribution = this.createProbabilityDistribution(scenario)
    const impactDistribution = this.createImpactDistribution(scenario)

    return {
      id: scenario.id,
      name: scenario.name,
      description: scenario.description,
      probabilityDistribution,
      impactDistribution,
      frequency: {
        type: 'poisson',
        parameters: {
          lambda: scenario.probability.annual
        }
      },
      controls: scenario.mitigations.map(mitigation => ({
        id: mitigation.id,
        name: mitigation.name,
        type: 'preventive',
        effectiveness: mitigation.effectiveness,
        cost: mitigation.cost,
        reliability: 0.95, // Default reliability
        coverage: 0.9 // Default coverage
      })),
      dependencies: [] // TODO: Implement scenario dependencies
    }
  }

  /**
   * Create probability distribution from Hubbard estimate or traditional input
   */
  private createProbabilityDistribution(scenario: RiskScenario): ProbabilityDistribution {
    const hubbardEstimate = scenario.metadata?.hubbardEstimate

    if (hubbardEstimate && scenario.metadata?.calibrationMethod === '5-point') {
      return this.convertHubbardToDistribution(hubbardEstimate)
    }

    // Fallback to traditional beta distribution
    return {
      type: 'beta',
      parameters: {
        alpha: 2,
        beta: 8,
        min: 0,
        max: scenario.probability.annual
      }
    }
  }

  /**
   * Create impact distribution from Hubbard estimates or traditional triangular
   */
  private createImpactDistribution(scenario: RiskScenario): ProbabilityDistribution {
    const financialHubbard = scenario.hubbardImpactEstimates?.financial

    if (financialHubbard) {
      return this.convertHubbardToDistribution(financialHubbard)
    }

    // Fallback to triangular distribution
    return {
      type: 'triangular',
      parameters: {
        min: scenario.impact.financial.min,
        max: scenario.impact.financial.max,
        mean: scenario.impact.financial.likely
      }
    }
  }

  /**
   * Convert Hubbard 5-point estimate to probability distribution
   */
  private convertHubbardToDistribution(hubbardEstimate: HubbardEstimate): ProbabilityDistribution {
    // Get best-fit distribution from calibration engine
    const distributionFit = this.calibrationEngine.toDistributionParameters(hubbardEstimate)
    
    // Apply calibration-based adjustments
    const adjustedParams = this.applyCalibrationAdjustments(distributionFit, hubbardEstimate)
    
    return {
      type: distributionFit.type,
      parameters: adjustedParams
    }
  }

  /**
   * Apply calibration score adjustments to distribution parameters
   */
  private applyCalibrationAdjustments(
    distributionFit: any,
    hubbardEstimate: HubbardEstimate
  ): Record<string, number> {
    const params = { ...distributionFit.parameters }
    
    // Adjust based on calibration score
    if (hubbardEstimate.calibrationScore && this.config.calibrationWeighting) {
      const calibrationAdjustment = this.calculateCalibrationAdjustment(hubbardEstimate.calibrationScore)
      
      // Widen distributions for poorly calibrated estimators
      if (distributionFit.type === 'normal' && params.stddev) {
        params.stddev *= calibrationAdjustment
      } else if (distributionFit.type === 'triangular') {
        const center = params.mode || params.mean
        const range = params.max - params.min
        const adjustedRange = range * calibrationAdjustment
        
        params.min = center - adjustedRange / 2
        params.max = center + adjustedRange / 2
      }
    }

    // Apply expertise-based adjustments
    const expertiseAdjustment = this.getExpertiseAdjustment(hubbardEstimate.expertise)
    
    if (distributionFit.type === 'normal' && params.stddev) {
      params.stddev *= expertiseAdjustment
    }

    return params
  }

  /**
   * Calculate adjustment factor based on calibration score
   */
  private calculateCalibrationAdjustment(calibrationScore: number): number {
    // Well-calibrated estimators (score > 0.8) get no adjustment
    // Poorly calibrated estimators get wider ranges
    if (calibrationScore >= 0.8) {
      return 1.0
    } else if (calibrationScore >= 0.6) {
      return 1.2
    } else {
      return 1.5
    }
  }

  /**
   * Get adjustment factor based on expertise level
   */
  private getExpertiseAdjustment(expertise: string): number {
    const adjustments = {
      'world_class': 0.8,  // Narrower ranges for world-class experts
      'expert': 0.9,
      'experienced': 1.0,
      'novice': 1.3        // Wider ranges for novices
    }
    
    return adjustments[expertise as keyof typeof adjustments] || 1.0
  }

  /**
   * Create ensemble estimate from multiple Hubbard estimates
   */
  createEnsembleScenario(
    baseScenario: RiskScenario, 
    additionalEstimates: HubbardEstimate[]
  ): MonteCarloScenario {
    if (!this.config.useEnsembleMethod || additionalEstimates.length === 0) {
      return this.convertRiskScenario(baseScenario)
    }

    // Combine estimates using the calibration engine
    const probabilityEstimates = additionalEstimates.filter(e => 
      e.parameter.includes('probability') || e.parameter.includes('likelihood')
    )

    const impactEstimates = additionalEstimates.filter(e =>
      e.parameter.includes('impact') || e.parameter.includes('loss')
    )

    // Create ensemble distributions
    let probabilityDistribution = this.createProbabilityDistribution(baseScenario)
    let impactDistribution = this.createImpactDistribution(baseScenario)

    if (probabilityEstimates.length > 1) {
      const ensembleProbability = this.calibrationEngine.combineEstimates(probabilityEstimates)
      probabilityDistribution = this.convertHubbardToDistribution(ensembleProbability)
    }

    if (impactEstimates.length > 1) {
      const ensembleImpact = this.calibrationEngine.combineEstimates(impactEstimates)
      impactDistribution = this.convertHubbardToDistribution(ensembleImpact)
    }

    return {
      id: `€{baseScenario.id}_ensemble`,
      name: `€{baseScenario.name} (Ensemble)`,
      description: `€{baseScenario.description} - Enhanced with €{additionalEstimates.length} expert estimates`,
      probabilityDistribution,
      impactDistribution,
      frequency: {
        type: 'poisson',
        parameters: {
          lambda: baseScenario.probability.annual
        }
      },
      controls: baseScenario.mitigations.map(mitigation => ({
        id: mitigation.id,
        name: mitigation.name,
        type: 'preventive',
        effectiveness: mitigation.effectiveness,
        cost: mitigation.cost,
        reliability: 0.95,
        coverage: 0.9
      })),
      dependencies: []
    }
  }

  /**
   * Validate Hubbard estimate quality for Monte Carlo use
   */
  validateHubbardForMonteCarlo(estimate: HubbardEstimate): {
    isValid: boolean
    warnings: string[]
    recommendations: string[]
  } {
    const validation = this.calibrationEngine.validateEstimate(estimate)
    const warnings: string[] = [...validation.warnings]
    const recommendations: string[] = []

    // Additional Monte Carlo specific validations
    if (estimate.rangeWidth / estimate.p50 < 0.1) {
      warnings.push('Very narrow range may not capture true uncertainty in simulation')
      recommendations.push('Consider wider confidence intervals or additional calibration training')
    }

    if (!estimate.calibrationScore || estimate.calibrationScore < 0.7) {
      warnings.push('Low calibration score may affect simulation accuracy')
      recommendations.push('Complete calibration training before using for critical decisions')
    }

    if (estimate.expertise === 'novice' && estimate.confidence > 0.9) {
      warnings.push('High confidence from novice estimator may indicate overconfidence')
      recommendations.push('Have expert review estimate or use ensemble method')
    }

    return {
      isValid: validation.isValid,
      warnings,
      recommendations
    }
  }

  /**
   * Generate Hubbard-aware simulation report
   */
  generateHubbardReport(scenarios: RiskScenario[]): {
    calibrationSummary: {
      totalEstimates: number
      hubbardEstimates: number
      averageCalibrationScore: number
      recommendedImprovements: string[]
    }
    distributionFitting: {
      [scenarioId: string]: {
        probabilityFit: string
        impactFit: string
        goodnessOfFit: number
      }
    }
  } {
    const hubbardScenarios = scenarios.filter(s => s.metadata?.hubbardEstimate)
    const calibrationScores = hubbardScenarios
      .map(s => s.metadata?.hubbardEstimate?.calibrationScore)
      .filter(score => score !== undefined) as number[]

    const averageCalibrationScore = calibrationScores.length > 0
      ? calibrationScores.reduce((sum, score) => sum + score, 0) / calibrationScores.length
      : 0

    const recommendedImprovements: string[] = []
    
    if (averageCalibrationScore < 0.8) {
      recommendedImprovements.push('Improve overall calibration through additional training')
    }
    
    if (hubbardScenarios.length < scenarios.length * 0.5) {
      recommendedImprovements.push('Use Hubbard methodology for more scenarios to improve accuracy')
    }

    const distributionFitting: any = {}
    
    hubbardScenarios.forEach(scenario => {
      if (scenario.metadata?.hubbardEstimate) {
        const probFit = this.calibrationEngine.toDistributionParameters(scenario.metadata.hubbardEstimate)
        distributionFitting[scenario.id] = {
          probabilityFit: probFit.type,
          impactFit: 'triangular', // Default for impact
          goodnessOfFit: probFit.goodnessOfFit
        }
      }
    })

    return {
      calibrationSummary: {
        totalEstimates: scenarios.length,
        hubbardEstimates: hubbardScenarios.length,
        averageCalibrationScore,
        recommendedImprovements
      },
      distributionFitting
    }
  }
}