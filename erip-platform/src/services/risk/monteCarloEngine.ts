/**
 * Monte Carlo Simulation Engine for ERIP PRISM
 * 
 * High-performance Monte Carlo risk simulations with statistical analysis
 * Implements FAIR methodology and advanced financial modeling
 */

import { Logger } from '../../infrastructure/logging/logger'
// import { ERIPEventBus } from '../../infrastructure/events/eventBus'

export interface MonteCarloScenario {
  id: string
  name: string
  description: string
  probabilityDistribution: ProbabilityDistribution
  impactDistribution: ProbabilityDistribution
  frequency: FrequencyDistribution
  controls: ControlEffectiveness[]
  dependencies: string[]
}

export interface ProbabilityDistribution {
  type: 'normal' | 'lognormal' | 'beta' | 'uniform' | 'triangular' | 'poisson'
  parameters: {
    min?: number
    max?: number
    mean?: number
    stddev?: number
    alpha?: number
    beta?: number
    lambda?: number
  }
}

export interface FrequencyDistribution {
  type: 'poisson' | 'negative_binomial' | 'uniform'
  parameters: {
    lambda?: number
    n?: number
    p?: number
    min?: number
    max?: number
  }
}

export interface ControlEffectiveness {
  id: string
  name: string
  type: 'preventive' | 'detective' | 'corrective'
  effectiveness: number // 0-1
  cost: number
  reliability: number // 0-1
  coverage: number // 0-1
}

export interface SimulationParameters {
  iterations: number
  confidence: number // e.g., 95 for 95% confidence interval
  timeHorizon: number // years
  discountRate: number // for NPV calculations
  currency: string
  businessContext: {
    annualRevenue: number
    riskTolerance: 'conservative' | 'moderate' | 'aggressive'
    industryBenchmark: number
  }
}

export interface SimulationResult {
  simulationId: string
  totalIterations: number
  executionTime: number // milliseconds
  statistics: {
    mean: number
    median: number
    mode: number
    standardDeviation: number
    variance: number
    skewness: number
    kurtosis: number
    minimum: number
    maximum: number
  }
  percentiles: {
    p5: number
    p10: number
    p25: number
    p50: number
    p75: number
    p90: number
    p95: number
    p99: number
    p99_9: number
  }
  riskMetrics: {
    var95: number // Value at Risk 95%
    var99: number // Value at Risk 99%
    cvar95: number // Conditional Value at Risk 95%
    expectedShortfall: number
    probabilityOfRuin: number
  }
  scenarios: ScenarioResult[]
  sensitivity: SensitivityAnalysis
  confidenceInterval: {
    lower: number
    upper: number
    confidence: number
  }
  recommendations: string[]
}

export interface ScenarioResult {
  scenarioId: string
  name: string
  contribution: number // percentage contribution to total risk
  frequency: number // expected annual frequency
  impact: {
    mean: number
    p95: number
    distribution: number[]
  }
  controls: {
    id: string
    effectivenessUsed: number
    costBenefit: number
  }[]
}

export interface SensitivityAnalysis {
  mostInfluential: Array<{
    parameter: string
    influence: number // correlation coefficient
    scenario: string
  }>
  elasticity: Array<{
    parameter: string
    elasticity: number
    scenario: string
  }>
}

export class MonteCarloEngine {
  private logger: Logger
  // private eventBus?: ERIPEventBus
  private rng: () => number

  constructor(eventBus?: any, seed?: number) {
    this.logger = Logger.getInstance()
    // this.eventBus = eventBus
    this.rng = this.createRNG(seed)
  }

  /**
   * Run Monte Carlo simulation for multiple scenarios
   */
  async runSimulation(
    scenarios: MonteCarloScenario[],
    parameters: SimulationParameters
  ): Promise<SimulationResult> {
    const startTime = Date.now()
    const simulationId = this.generateSimulationId()

    this.logger.info('Starting Monte Carlo simulation', {
      simulationId,
      scenarios: scenarios.length,
      iterations: parameters.iterations
    })

    try {
      // Validate inputs
      this.validateInputs(scenarios, parameters)

      // Initialize result arrays
      const results: number[] = new Array(parameters.iterations)
      const scenarioResults: ScenarioResult[] = []

      // Run iterations
      for (let i = 0; i < parameters.iterations; i++) {
        results[i] = await this.runSingleIteration(scenarios, parameters, i)
        
        // Progress reporting for long simulations
        if (i % Math.max(1, Math.floor(parameters.iterations / 20)) === 0) {
          const progress = (i / parameters.iterations * 100).toFixed(1)
          this.logger.debug(`Simulation progress: ${progress}%`)
        }
      }

      // Calculate scenario contributions
      for (const scenario of scenarios) {
        scenarioResults.push(await this.calculateScenarioResult(scenario, parameters))
      }

      // Calculate statistics
      const statistics = this.calculateStatistics(results)
      const percentiles = this.calculatePercentiles(results)
      const riskMetrics = this.calculateRiskMetrics(results, parameters)
      const sensitivity = this.performSensitivityAnalysis(scenarios, results, parameters)
      const confidenceInterval = this.calculateConfidenceInterval(results, parameters.confidence)
      const recommendations = await this.generateRecommendations(scenarios, statistics, riskMetrics, parameters)

      const result: SimulationResult = {
        simulationId,
        totalIterations: parameters.iterations,
        executionTime: Date.now() - startTime,
        statistics,
        percentiles,
        riskMetrics,
        scenarios: scenarioResults,
        sensitivity,
        confidenceInterval,
        recommendations
      }

      // Publish completion event
      if (this.eventBus) {
        await this.eventBus.publish({
          eventId: `mc_${simulationId}`,
          timestamp: new Date().toISOString(),
          type: 'monte.carlo.completed',
          source: 'prism',
          data: {
            simulationId,
            iterations: parameters.iterations,
            scenarios: scenarios.map(s => ({
              name: s.name,
              probability: this.calculateMeanProbability(s.probabilityDistribution),
              impact: this.calculateMeanImpact(s.impactDistribution)
            })),
            results: {
              meanLoss: statistics.mean,
              medianLoss: statistics.median,
              percentile95: percentiles.p95,
              percentile99: percentiles.p99,
              standardDeviation: statistics.standardDeviation
            },
            recommendations: recommendations.slice(0, 5) // Top 5 recommendations
          }
        })
      }

      this.logger.info('Monte Carlo simulation completed', {
        simulationId,
        executionTime: result.executionTime,
        meanLoss: statistics.mean,
        var95: riskMetrics.var95
      })

      return result

    } catch (error) {
      this.logger.error('Monte Carlo simulation failed', { simulationId, error })
      throw error
    }
  }

  /**
   * Run a single Monte Carlo iteration
   */
  private async runSingleIteration(
    scenarios: MonteCarloScenario[],
    parameters: SimulationParameters,
    iteration: number
  ): Promise<number> {
    let totalLoss = 0

    for (const scenario of scenarios) {
      // Sample frequency (how many times this event occurs in the time period)
      const frequency = this.sampleFrequency(scenario.frequency)
      
      if (frequency > 0) {
        for (let occurrence = 0; occurrence < frequency; occurrence++) {
          // Sample probability of successful attack/event
          const probability = this.sampleDistribution(scenario.probabilityDistribution)
          
          if (this.rng() <= probability) {
            // Sample impact given that event occurs
            let impact = this.sampleDistribution(scenario.impactDistribution)
            
            // Apply control effectiveness
            const controlReduction = this.calculateControlReduction(scenario.controls)
            impact *= (1 - controlReduction)
            
            // Apply time value of money if multi-year
            const discountFactor = Math.pow(1 + parameters.discountRate, -parameters.timeHorizon)
            impact *= discountFactor
            
            totalLoss += impact
          }
        }
      }
    }

    return totalLoss
  }

  /**
   * Calculate scenario-specific result
   */
  private async calculateScenarioResult(
    scenario: MonteCarloScenario,
    parameters: SimulationParameters
  ): Promise<ScenarioResult> {
    // Run mini-simulation for this scenario only
    const iterations = Math.min(10000, parameters.iterations)
    const results: number[] = new Array(iterations)

    for (let i = 0; i < iterations; i++) {
      const frequency = this.sampleFrequency(scenario.frequency)
      let scenarioLoss = 0

      if (frequency > 0) {
        for (let occurrence = 0; occurrence < frequency; occurrence++) {
          const probability = this.sampleDistribution(scenario.probabilityDistribution)
          
          if (this.rng() <= probability) {
            let impact = this.sampleDistribution(scenario.impactDistribution)
            const controlReduction = this.calculateControlReduction(scenario.controls)
            impact *= (1 - controlReduction)
            scenarioLoss += impact
          }
        }
      }
      
      results[i] = scenarioLoss
    }

    const statistics = this.calculateStatistics(results)
    const percentiles = this.calculatePercentiles(results)

    return {
      scenarioId: scenario.id,
      name: scenario.name,
      contribution: 0, // Will be calculated later based on correlation
      frequency: this.calculateMeanFrequency(scenario.frequency),
      impact: {
        mean: statistics.mean,
        p95: percentiles.p95,
        distribution: results
      },
      controls: scenario.controls.map(control => ({
        id: control.id,
        effectivenessUsed: control.effectiveness * control.reliability * control.coverage,
        costBenefit: control.effectiveness > 0 ? (statistics.mean * control.effectiveness) / control.cost : 0
      }))
    }
  }

  /**
   * Sample from a probability distribution
   */
  private sampleDistribution(dist: ProbabilityDistribution): number {
    switch (dist.type) {
      case 'normal':
        return this.sampleNormal(dist.parameters.mean || 0, dist.parameters.stddev || 1)
      
      case 'lognormal':
        const normal = this.sampleNormal(dist.parameters.mean || 0, dist.parameters.stddev || 1)
        return Math.exp(normal)
      
      case 'beta':
        return this.sampleBeta(dist.parameters.alpha || 1, dist.parameters.beta || 1)
      
      case 'uniform':
        return this.sampleUniform(dist.parameters.min || 0, dist.parameters.max || 1)
      
      case 'triangular':
        return this.sampleTriangular(
          dist.parameters.min || 0,
          dist.parameters.max || 1,
          dist.parameters.mean || 0.5
        )
      
      case 'poisson':
        return this.samplePoisson(dist.parameters.lambda || 1)
      
      default:
        throw new Error(`Unsupported distribution type: ${dist.type}`)
    }
  }

  /**
   * Sample from a frequency distribution
   */
  private sampleFrequency(freq: FrequencyDistribution): number {
    switch (freq.type) {
      case 'poisson':
        return this.samplePoisson(freq.parameters.lambda || 1)
      
      case 'negative_binomial':
        return this.sampleNegativeBinomial(
          freq.parameters.n || 1,
          freq.parameters.p || 0.5
        )
      
      case 'uniform':
        return Math.floor(this.sampleUniform(
          freq.parameters.min || 0,
          freq.parameters.max || 1
        ))
      
      default:
        throw new Error(`Unsupported frequency distribution: ${freq.type}`)
    }
  }

  /**
   * Probability distribution sampling methods
   */
  private sampleNormal(mean: number, stddev: number): number {
    const u1 = this.rng()
    const u2 = this.rng()
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return mean + stddev * z
  }

  private sampleBeta(alpha: number, beta: number): number {
    const x = this.sampleGamma(alpha, 1)
    const y = this.sampleGamma(beta, 1)
    return x / (x + y)
  }

  private sampleGamma(shape: number, scale: number): number {
    // Marsaglia and Tsang's Method
    if (shape < 1) {
      return this.sampleGamma(shape + 1, scale) * Math.pow(this.rng(), 1 / shape)
    }

    const d = shape - 1 / 3
    const c = 1 / Math.sqrt(9 * d)

    while (true) {
      let x: number
      do {
        x = this.sampleNormal(0, 1)
      } while (x <= -1 / c)

      const v = Math.pow(1 + c * x, 3)
      const u = this.rng()

      if (u < 1 - 0.0331 * Math.pow(x, 4)) {
        return d * v * scale
      }

      if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
        return d * v * scale
      }
    }
  }

  private sampleUniform(min: number, max: number): number {
    return min + (max - min) * this.rng()
  }

  private sampleTriangular(min: number, max: number, mode: number): number {
    const u = this.rng()
    const f = (mode - min) / (max - min)
    
    if (u <= f) {
      return min + Math.sqrt(u * (max - min) * (mode - min))
    } else {
      return max - Math.sqrt((1 - u) * (max - min) * (max - mode))
    }
  }

  private samplePoisson(lambda: number): number {
    if (lambda > 30) {
      // Use normal approximation for large lambda
      return Math.max(0, Math.round(this.sampleNormal(lambda, Math.sqrt(lambda))))
    }

    const l = Math.exp(-lambda)
    let k = 0
    let p = 1

    do {
      k++
      p *= this.rng()
    } while (p > l)

    return k - 1
  }

  private sampleNegativeBinomial(n: number, p: number): number {
    return this.sampleGamma(n, (1 - p) / p)
  }

  /**
   * Calculate control effectiveness reduction
   */
  private calculateControlReduction(controls: ControlEffectiveness[]): number {
    let totalReduction = 0
    let residualProbability = 1

    // Apply controls in order (series model)
    for (const control of controls.sort((a, b) => b.effectiveness - a.effectiveness)) {
      const effectiveReduction = control.effectiveness * control.reliability * control.coverage
      residualProbability *= (1 - effectiveReduction)
    }

    return 1 - residualProbability
  }

  /**
   * Statistical calculation methods
   */
  private calculateStatistics(data: number[]): SimulationResult['statistics'] {
    const sorted = [...data].sort((a, b) => a - b)
    const n = data.length
    const sum = data.reduce((acc, val) => acc + val, 0)
    const mean = sum / n

    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1)
    const stddev = Math.sqrt(variance)

    // Calculate moments
    const skewness = this.calculateSkewness(data, mean, stddev)
    const kurtosis = this.calculateKurtosis(data, mean, stddev)

    return {
      mean,
      median: this.percentile(sorted, 50),
      mode: this.calculateMode(data),
      standardDeviation: stddev,
      variance,
      skewness,
      kurtosis,
      minimum: Math.min(...data),
      maximum: Math.max(...data)
    }
  }

  private calculatePercentiles(data: number[]): SimulationResult['percentiles'] {
    const sorted = [...data].sort((a, b) => a - b)
    
    return {
      p5: this.percentile(sorted, 5),
      p10: this.percentile(sorted, 10),
      p25: this.percentile(sorted, 25),
      p50: this.percentile(sorted, 50),
      p75: this.percentile(sorted, 75),
      p90: this.percentile(sorted, 90),
      p95: this.percentile(sorted, 95),
      p99: this.percentile(sorted, 99),
      p99_9: this.percentile(sorted, 99.9)
    }
  }

  private calculateRiskMetrics(data: number[], parameters: SimulationParameters): SimulationResult['riskMetrics'] {
    const sorted = [...data].sort((a, b) => a - b)
    const var95 = this.percentile(sorted, 95)
    const var99 = this.percentile(sorted, 99)
    
    // Conditional VaR (Expected Shortfall)
    const cvar95Index = Math.floor(0.95 * sorted.length)
    const cvar95 = sorted.slice(cvar95Index).reduce((acc, val) => acc + val, 0) / (sorted.length - cvar95Index)
    
    const expectedShortfall = cvar95
    
    // Probability of ruin (exceeding risk tolerance)
    const riskTolerance = parameters.businessContext.annualRevenue * this.getRiskToleranceMultiplier(parameters.businessContext.riskTolerance)
    const ruinEvents = data.filter(loss => loss > riskTolerance).length
    const probabilityOfRuin = ruinEvents / data.length

    return {
      var95,
      var99,
      cvar95,
      expectedShortfall,
      probabilityOfRuin
    }
  }

  private performSensitivityAnalysis(
    scenarios: MonteCarloScenario[],
    results: number[],
    parameters: SimulationParameters
  ): SensitivityAnalysis {
    // Simplified sensitivity analysis
    const mostInfluential: Array<{parameter: string, influence: number, scenario: string}> = []
    const elasticity: Array<{parameter: string, elasticity: number, scenario: string}> = []

    // This would be more sophisticated in a real implementation
    scenarios.forEach(scenario => {
      mostInfluential.push({
        parameter: 'probability',
        influence: 0.8, // Placeholder
        scenario: scenario.name
      })
      
      elasticity.push({
        parameter: 'impact',
        elasticity: 1.2, // Placeholder
        scenario: scenario.name
      })
    })

    return { mostInfluential, elasticity }
  }

  private calculateConfidenceInterval(data: number[], confidence: number): { lower: number, upper: number, confidence: number } {
    const sorted = [...data].sort((a, b) => a - b)
    const alpha = (100 - confidence) / 2
    
    return {
      lower: this.percentile(sorted, alpha),
      upper: this.percentile(sorted, 100 - alpha),
      confidence
    }
  }

  private async generateRecommendations(
    scenarios: MonteCarloScenario[],
    statistics: SimulationResult['statistics'],
    riskMetrics: SimulationResult['riskMetrics'],
    parameters: SimulationParameters
  ): Promise<string[]> {
    const recommendations: string[] = []

    // Risk level assessment
    const annualRevenue = parameters.businessContext.annualRevenue
    const riskRatio = riskMetrics.var95 / annualRevenue

    if (riskRatio > 0.1) {
      recommendations.push('HIGH PRIORITY: Risk exposure exceeds 10% of annual revenue - immediate mitigation required')
    } else if (riskRatio > 0.05) {
      recommendations.push('MEDIUM PRIORITY: Risk exposure is 5-10% of annual revenue - mitigation recommended')
    }

    // Control effectiveness
    const highImpactScenarios = scenarios.filter(s => 
      this.calculateMeanImpact(s.impactDistribution) > statistics.median
    )

    if (highImpactScenarios.length > 0) {
      recommendations.push(`Focus on ${highImpactScenarios.length} high-impact scenarios: ${highImpactScenarios.map(s => s.name).join(', ')}`)
    }

    // Statistical insights
    if (statistics.skewness > 1) {
      recommendations.push('Risk distribution is highly skewed - prepare for potential extreme losses beyond typical scenarios')
    }

    if (riskMetrics.probabilityOfRuin > 0.01) {
      recommendations.push(`${(riskMetrics.probabilityOfRuin * 100).toFixed(1)}% chance of catastrophic loss - consider insurance or risk transfer`)
    }

    // Cost-benefit analysis
    const totalControlCost = scenarios.reduce((sum, scenario) => 
      sum + scenario.controls.reduce((controlSum, control) => controlSum + control.cost, 0), 0
    )

    const riskReduction = statistics.mean * 0.3 // Assumed 30% reduction with current controls
    if (riskReduction > totalControlCost * 2) {
      recommendations.push('Current control investments show positive ROI - consider expanding similar controls')
    }

    return recommendations
  }

  /**
   * Utility methods
   */
  private percentile(sortedData: number[], p: number): number {
    const index = (p / 100) * (sortedData.length - 1)
    const lower = Math.floor(index)
    const upper = Math.ceil(index)
    const weight = index - lower

    return sortedData[lower] * (1 - weight) + sortedData[upper] * weight
  }

  private calculateSkewness(data: number[], mean: number, stddev: number): number {
    const n = data.length
    const skew = data.reduce((acc, val) => acc + Math.pow((val - mean) / stddev, 3), 0) / n
    return skew
  }

  private calculateKurtosis(data: number[], mean: number, stddev: number): number {
    const n = data.length
    const kurt = data.reduce((acc, val) => acc + Math.pow((val - mean) / stddev, 4), 0) / n
    return kurt - 3 // Excess kurtosis
  }

  private calculateMode(data: number[]): number {
    const frequency: { [key: string]: number } = {}
    let maxFreq = 0
    let mode = data[0]

    // For continuous data, we'll use binning
    const binSize = (Math.max(...data) - Math.min(...data)) / 50
    
    data.forEach(value => {
      const bin = Math.floor(value / binSize) * binSize
      const binKey = bin.toString()
      frequency[binKey] = (frequency[binKey] || 0) + 1
      
      if (frequency[binKey] > maxFreq) {
        maxFreq = frequency[binKey]
        mode = bin
      }
    })

    return mode
  }

  private calculateMeanProbability(dist: ProbabilityDistribution): number {
    return dist.parameters.mean || 0.5
  }

  private calculateMeanImpact(dist: ProbabilityDistribution): number {
    return dist.parameters.mean || (dist.parameters.min || 0 + dist.parameters.max || 1) / 2
  }

  private calculateMeanFrequency(freq: FrequencyDistribution): number {
    if (freq.type === 'poisson') return freq.parameters.lambda || 1
    if (freq.type === 'uniform') return (freq.parameters.min || 0 + freq.parameters.max || 1) / 2
    return 1
  }

  private getRiskToleranceMultiplier(tolerance: string): number {
    switch (tolerance) {
      case 'conservative': return 0.02
      case 'moderate': return 0.05
      case 'aggressive': return 0.10
      default: return 0.05
    }
  }

  private validateInputs(scenarios: MonteCarloScenario[], parameters: SimulationParameters): void {
    if (scenarios.length === 0) {
      throw new Error('At least one scenario is required')
    }

    if (parameters.iterations < 1000) {
      this.logger.warn('Low iteration count may produce unreliable results', { iterations: parameters.iterations })
    }

    if (parameters.iterations > 1000000) {
      this.logger.warn('High iteration count may cause performance issues', { iterations: parameters.iterations })
    }
  }

  private createRNG(seed?: number): () => number {
    if (seed !== undefined) {
      // Simple seeded random number generator for reproducible results
      let state = seed
      return () => {
        state = (state * 9301 + 49297) % 233280
        return state / 233280
      }
    }
    
    return Math.random
  }

  private generateSimulationId(): string {
    return `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}