/**
 * Hubbard 5-Point Calibrated Estimation System
 * 
 * Implementation of Douglas Hubbard's calibrated estimation methodology
 * for precise quantitative risk analysis in PRISM.
 */

export interface HubbardEstimate {
  id: string
  parameter: string
  estimator: string
  timestamp: Date
  
  // 5-point calibrated estimate
  p10: number    // 10th percentile (90% confident it's higher)
  p30: number    // 30th percentile
  p50: number    // 50th percentile (median, most likely)
  p70: number    // 70th percentile  
  p90: number    // 90th percentile (90% confident it's lower)
  
  // Calibration metadata
  confidence: number        // Estimator's confidence in the range
  expertise: ExpertiseLevel // Domain expertise level
  basisOfEstimate: string   // Rationale and data sources
  assumptions: string[]     // Key assumptions made
  
  // Quality indicators
  calibrationScore?: number // Historical calibration accuracy (0-1)
  rangeWidth: number       // P90 - P10 (uncertainty width)
  asymmetryRatio: number   // (P50-P10)/(P90-P50) for skewness
}

export type ExpertiseLevel = 'novice' | 'experienced' | 'expert' | 'world_class'

export interface CalibrationSession {
  id: string
  sessionDate: Date
  estimator: string
  parameter: string
  actualValue?: number      // For post-session calibration scoring
  estimates: HubbardEstimate[]
  calibrationExercises: CalibrationExercise[]
}

export interface CalibrationExercise {
  question: string
  trueValue: number
  estimate: HubbardEstimate
  wasCorrect: boolean       // True if actual fell within 80% CI
  overconfident: boolean    // True if range was too narrow
}

export interface CalibrationResults {
  overallScore: number      // Percentage of estimates where actual fell in range
  overconfidenceRate: number // Percentage of estimates that were overconfident
  recommendedAdjustment: number // Suggested range multiplier
  expertiseAdjustment: ExpertiseLevel
}

export class HubbardCalibrationEngine {
  private calibrationHistory: Map<string, CalibrationSession[]> = new Map()
  
  /**
   * Standard calibration questions for training estimators
   */
  private readonly CALIBRATION_QUESTIONS = [
    {
      question: "What is the length of the Nile River in miles?",
      answer: 4132,
      domain: "geography",
      difficulty: "medium"
    },
    {
      question: "In what year was the first iPhone released?",
      answer: 2007,
      domain: "technology",
      difficulty: "easy"
    },
    {
      question: "What is the population of Madagascar?",
      answer: 28915653,
      domain: "demographics",
      difficulty: "hard"
    },
    {
      question: "How many patents did IBM receive in 2020?",
      answer: 9130,
      domain: "business",
      difficulty: "hard"
    },
    {
      question: "What percentage of Fortune 500 companies experienced a data breach in 2023?",
      answer: 43,
      domain: "cybersecurity",
      difficulty: "medium"
    }
  ]

  /**
   * Generate a calibrated 5-point estimate using Hubbard methodology
   */
  createHubbardEstimate(
    parameter: string,
    estimator: string,
    expertise: ExpertiseLevel,
    basisOfEstimate: string,
    assumptions: string[] = []
  ): Partial<HubbardEstimate> {
    return {
      id: `hubbard_€{Date.now()}_€{Math.random().toString(36).substr(2, 9)}`,
      parameter,
      estimator,
      timestamp: new Date(),
      expertise,
      basisOfEstimate,
      assumptions,
      confidence: this.getDefaultConfidence(expertise)
    }
  }

  /**
   * Validate and calculate derived metrics for a 5-point estimate
   */
  validateEstimate(estimate: HubbardEstimate): {
    isValid: boolean
    errors: string[]
    warnings: string[]
    derivedMetrics: {
      rangeWidth: number
      asymmetryRatio: number
      impliedDistribution: 'normal' | 'lognormal' | 'triangular' | 'beta'
    }
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate ordering constraint
    const points = [estimate.p10, estimate.p30, estimate.p50, estimate.p70, estimate.p90]
    for (let i = 1; i < points.length; i++) {
      if (points[i] < points[i-1]) {
        errors.push(`P€{(i+1)*20} (€{points[i]}) must be greater than P€{i*20} (€{points[i-1]})`)
      }
    }

    // Calculate range width
    const rangeWidth = estimate.p90 - estimate.p10

    // Calculate asymmetry ratio
    const leftTail = estimate.p50 - estimate.p10
    const rightTail = estimate.p90 - estimate.p50
    const asymmetryRatio = rightTail > 0 ? leftTail / rightTail : 0

    // Check for common calibration issues
    if (rangeWidth < estimate.p50 * 0.1) {
      warnings.push('Very narrow range suggests possible overconfidence')
    }

    if (asymmetryRatio > 3 || asymmetryRatio < 0.33) {
      warnings.push('High asymmetry ratio suggests consider lognormal distribution')
    }

    // Determine implied distribution
    let impliedDistribution: 'normal' | 'lognormal' | 'triangular' | 'beta' = 'normal'
    
    if (estimate.p10 > 0 && Math.log(estimate.p90/estimate.p10) > 2) {
      impliedDistribution = 'lognormal'
    } else if (asymmetryRatio > 2 || asymmetryRatio < 0.5) {
      impliedDistribution = 'triangular'
    } else if (estimate.p10 >= 0 && estimate.p90 <= 100) {
      impliedDistribution = 'beta'
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      derivedMetrics: {
        rangeWidth,
        asymmetryRatio,
        impliedDistribution
      }
    }
  }

  /**
   * Convert 5-point estimate to probability distribution parameters
   */
  toDistributionParameters(estimate: HubbardEstimate): {
    type: 'normal' | 'lognormal' | 'triangular' | 'beta'
    parameters: Record<string, number>
    goodnessOfFit: number
  } {
    const validation = this.validateEstimate(estimate)
    const distribution = validation.derivedMetrics.impliedDistribution

    switch (distribution) {
      case 'normal':
        return this.fitNormalDistribution(estimate)
      case 'lognormal':
        return this.fitLognormalDistribution(estimate)
      case 'triangular':
        return this.fitTriangularDistribution(estimate)
      case 'beta':
        return this.fitBetaDistribution(estimate)
      default:
        return this.fitNormalDistribution(estimate)
    }
  }

  /**
   * Run calibration training session
   */
  async runCalibrationTraining(
    estimator: string,
    numQuestions: number = 10
  ): Promise<CalibrationSession> {
    const sessionId = `cal_€{Date.now()}`
    const selectedQuestions = this.selectCalibrationQuestions(numQuestions)
    const estimates: HubbardEstimate[] = []
    const exercises: CalibrationExercise[] = []

    // In a real implementation, this would be interactive
    // For now, we'll simulate the training session
    for (const question of selectedQuestions) {
      const estimate = this.simulateEstimate(question, estimator)
      estimates.push(estimate)

      const exercise: CalibrationExercise = {
        question: question.question,
        trueValue: question.answer,
        estimate,
        wasCorrect: question.answer >= estimate.p10 && question.answer <= estimate.p90,
        overconfident: (estimate.p90 - estimate.p10) < (question.answer * 0.5) // Simple overconfidence check
      }
      exercises.push(exercise)
    }

    const session: CalibrationSession = {
      id: sessionId,
      sessionDate: new Date(),
      estimator,
      parameter: 'calibration_training',
      estimates,
      calibrationExercises: exercises
    }

    // Store session for future reference
    const existingSessions = this.calibrationHistory.get(estimator) || []
    existingSessions.push(session)
    this.calibrationHistory.set(estimator, existingSessions)

    return session
  }

  /**
   * Calculate calibration score for an estimator
   */
  calculateCalibrationScore(estimator: string): CalibrationResults | null {
    const sessions = this.calibrationHistory.get(estimator)
    if (!sessions || sessions.length === 0) {
      return null
    }

    const allExercises = sessions.flatMap(s => s.calibrationExercises)
    const correctCount = allExercises.filter(e => e.wasCorrect).length
    const overconfidentCount = allExercises.filter(e => e.overconfident).length

    const overallScore = correctCount / allExercises.length
    const overconfidenceRate = overconfidentCount / allExercises.length

    // Calculate recommended adjustments
    let recommendedAdjustment = 1.0
    if (overallScore < 0.8) {
      recommendedAdjustment = 1.2 + (0.8 - overallScore) // Widen ranges
    }

    // Suggest expertise adjustment
    let expertiseAdjustment: ExpertiseLevel = 'experienced'
    if (overallScore >= 0.85 && overconfidenceRate < 0.2) {
      expertiseAdjustment = 'expert'
    } else if (overallScore < 0.7 || overconfidenceRate > 0.4) {
      expertiseAdjustment = 'novice'
    }

    return {
      overallScore,
      overconfidenceRate,
      recommendedAdjustment,
      expertiseAdjustment
    }
  }

  /**
   * Apply ensemble method to combine multiple estimates
   */
  combineEstimates(estimates: HubbardEstimate[]): HubbardEstimate {
    if (estimates.length === 0) {
      throw new Error('Cannot combine empty estimates array')
    }

    if (estimates.length === 1) {
      return estimates[0]
    }

    // Weight estimates by calibration score and expertise
    const weights = estimates.map(e => this.calculateEstimateWeight(e))
    const totalWeight = weights.reduce((sum, w) => sum + w, 0)
    const normalizedWeights = weights.map(w => w / totalWeight)

    // Weighted average of percentiles
    const p10 = this.weightedAverage(estimates.map(e => e.p10), normalizedWeights)
    const p30 = this.weightedAverage(estimates.map(e => e.p30), normalizedWeights)
    const p50 = this.weightedAverage(estimates.map(e => e.p50), normalizedWeights)
    const p70 = this.weightedAverage(estimates.map(e => e.p70), normalizedWeights)
    const p90 = this.weightedAverage(estimates.map(e => e.p90), normalizedWeights)

    return {
      id: `ensemble_€{Date.now()}`,
      parameter: estimates[0].parameter,
      estimator: `Ensemble of €{estimates.length} experts`,
      timestamp: new Date(),
      p10, p30, p50, p70, p90,
      confidence: Math.min(0.95, Math.max(...estimates.map(e => e.confidence))),
      expertise: 'expert',
      basisOfEstimate: `Ensemble of €{estimates.length} calibrated estimates`,
      assumptions: [...new Set(estimates.flatMap(e => e.assumptions))],
      rangeWidth: p90 - p10,
      asymmetryRatio: (p50 - p10) / (p90 - p50)
    }
  }

  // Private helper methods
  private getDefaultConfidence(expertise: ExpertiseLevel): number {
    const confidenceMap = {
      'novice': 0.6,
      'experienced': 0.75,
      'expert': 0.85,
      'world_class': 0.9
    }
    return confidenceMap[expertise]
  }

  private selectCalibrationQuestions(num: number) {
    return this.CALIBRATION_QUESTIONS
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(num, this.CALIBRATION_QUESTIONS.length))
  }

  private simulateEstimate(question: any, estimator: string): HubbardEstimate {
    // Simulate realistic estimation behavior
    const trueValue = question.answer
    const uncertainty = 0.3 + Math.random() * 0.4 // 30-70% uncertainty
    
    const p50 = trueValue * (0.7 + Math.random() * 0.6) // Some bias
    const range = p50 * uncertainty
    
    return {
      id: `sim_€{Date.now()}`,
      parameter: question.question,
      estimator,
      timestamp: new Date(),
      p10: Math.max(0, p50 - range * 0.8),
      p30: p50 - range * 0.4,
      p50,
      p70: p50 + range * 0.4,
      p90: p50 + range * 0.8,
      confidence: 0.8,
      expertise: 'experienced',
      basisOfEstimate: 'Simulated estimate for calibration training',
      assumptions: [],
      rangeWidth: range * 1.6,
      asymmetryRatio: 1.0
    }
  }

  private fitNormalDistribution(estimate: HubbardEstimate) {
    // Use method of moments to fit normal distribution
    const mean = estimate.p50
    // For normal distribution, P90 ≈ mean + 1.28*sigma
    const stddev = (estimate.p90 - estimate.p50) / 1.28

    return {
      type: 'normal' as const,
      parameters: { mean, stddev },
      goodnessOfFit: this.calculateNormalFit(estimate, mean, stddev)
    }
  }

  private fitLognormalDistribution(estimate: HubbardEstimate) {
    // For lognormal, work with log-transformed values
    const logP10 = Math.log(estimate.p10)
    const logP50 = Math.log(estimate.p50)
    const logP90 = Math.log(estimate.p90)
    
    const mu = logP50
    const sigma = (logP90 - logP50) / 1.28

    return {
      type: 'lognormal' as const,
      parameters: { mu, sigma },
      goodnessOfFit: 0.85 // Placeholder
    }
  }

  private fitTriangularDistribution(estimate: HubbardEstimate) {
    return {
      type: 'triangular' as const,
      parameters: {
        min: estimate.p10,
        max: estimate.p90,
        mode: estimate.p50
      },
      goodnessOfFit: 0.8 // Placeholder
    }
  }

  private fitBetaDistribution(estimate: HubbardEstimate) {
    // Simple beta fitting using method of moments
    const mean = estimate.p50
    const variance = Math.pow((estimate.p90 - estimate.p10) / 4, 2)
    
    const alpha = mean * (mean * (1 - mean) / variance - 1)
    const beta = (1 - mean) * (mean * (1 - mean) / variance - 1)

    return {
      type: 'beta' as const,
      parameters: { alpha: Math.max(1, alpha), beta: Math.max(1, beta) },
      goodnessOfFit: 0.75 // Placeholder
    }
  }

  private calculateNormalFit(estimate: HubbardEstimate, mean: number, stddev: number): number {
    // Check how well the normal distribution matches the 5 points
    const normalCDF = (x: number) => 0.5 * (1 + this.erf((x - mean) / (stddev * Math.sqrt(2))))
    
    const expectedP10 = normalCDF(estimate.p10) 
    const expectedP30 = normalCDF(estimate.p30)
    const expectedP50 = normalCDF(estimate.p50)
    const expectedP70 = normalCDF(estimate.p70)
    const expectedP90 = normalCDF(estimate.p90)

    // Calculate RMSE from expected percentiles
    const errors = [
      Math.abs(expectedP10 - 0.1),
      Math.abs(expectedP30 - 0.3),
      Math.abs(expectedP50 - 0.5),
      Math.abs(expectedP70 - 0.7),
      Math.abs(expectedP90 - 0.9)
    ]

    const rmse = Math.sqrt(errors.reduce((sum, e) => sum + e*e, 0) / errors.length)
    return Math.max(0, 1 - rmse * 5) // Convert to 0-1 score
  }

  private erf(x: number): number {
    // Approximation of error function for normal distribution
    const a1 =  0.254829592
    const a2 = -0.284496736
    const a3 =  1.421413741
    const a4 = -1.453152027
    const a5 =  1.061405429
    const p  =  0.3275911

    const sign = x >= 0 ? 1 : -1
    x = Math.abs(x)

    const t = 1.0 / (1.0 + p * x)
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return sign * y
  }

  private calculateEstimateWeight(estimate: HubbardEstimate): number {
    let weight = 1.0

    // Weight by expertise
    const expertiseWeights = {
      'novice': 0.5,
      'experienced': 1.0,
      'expert': 1.5,
      'world_class': 2.0
    }
    weight *= expertiseWeights[estimate.expertise]

    // Weight by calibration score if available
    if (estimate.calibrationScore) {
      weight *= estimate.calibrationScore
    }

    // Penalize very wide or very narrow ranges
    const normalizedWidth = estimate.rangeWidth / estimate.p50
    if (normalizedWidth < 0.1 || normalizedWidth > 2.0) {
      weight *= 0.8
    }

    return weight
  }

  private weightedAverage(values: number[], weights: number[]): number {
    return values.reduce((sum, val, i) => sum + val * weights[i], 0)
  }
}