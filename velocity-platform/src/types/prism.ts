/**
 * PRISM (Proactive Risk Intelligence & Simulation Modeling) Types
 * 
 * Risk quantification and Monte Carlo simulation type definitions
 */

export type RiskCategory = 'cyber' | 'operational' | 'financial' | 'reputational' | 'compliance' | 'strategic'
export type ThreatType = 'data_breach' | 'ransomware' | 'service_outage' | 'compliance_violation' | 'supply_chain' | 'insider_threat' | 'natural_disaster'
export type Industry = 'technology' | 'healthcare' | 'finance' | 'retail' | 'manufacturing' | 'energy' | 'education'

export interface RiskScenario {
  id: string
  name: string
  description: string
  category: RiskCategory
  threatType: ThreatType
  industry?: Industry
  createdAt: Date
  updatedAt: Date
  
  // Probability inputs
  probability: {
    annual: number // 0-1 probability per year
    confidence: number // 0-100 confidence in estimate
    source: 'historical' | 'industry' | 'expert' | 'custom'
  }
  
  // Optional Hubbard calibration metadata
  metadata?: {
    hubbardEstimate?: any // HubbardEstimate from calibration service
    calibrationMethod?: '5-point' | 'traditional' | 'decomposition'
    estimatorCalibrationScore?: number
    lastCalibrated?: Date
  }
  
  // Impact calculations
  impact: {
    financial: {
      min: number
      likely: number
      max: number
      currency: string
    }
    operational: {
      downtimeHours: number
      affectedUsers: number
      productivityLoss: number
    }
    reputational: {
      customerChurn: number
      brandImpact: number // 0-100
      recoveryTime: number // days
    }
  }
  
  // Mitigation strategies
  mitigations: RiskMitigation[]
  
  // Hubbard-specific impact estimates
  hubbardImpactEstimates?: {
    financial: any // HubbardEstimate for financial impact
    operational: any // HubbardEstimate for operational impact  
    reputational: any // HubbardEstimate for reputational impact
  }
  
  // Simulation parameters
  simulationParams?: SimulationParameters
}

export interface RiskMitigation {
  id: string
  name: string
  description: string
  cost: number
  effectiveness: number // 0-1 reduction in probability
  implementationTime: number // days
  roi?: number
}

export interface SimulationParameters {
  iterations: number
  timeHorizon: number // years
  discountRate: number
  correlations: RiskCorrelation[]
}

export interface RiskCorrelation {
  riskId1: string
  riskId2: string
  correlation: number // -1 to 1
}

export interface MonteCarloResult {
  scenarioId: string
  timestamp: Date
  iterations: number
  
  // Financial impact distribution
  financial: {
    percentiles: {
      p5: number
      p25: number
      p50: number
      p75: number
      p95: number
      p99: number
    }
    mean: number
    stdDev: number
    var: number // Value at Risk
    cvar: number // Conditional Value at Risk
  }
  
  // Risk metrics for compatibility
  riskMetrics?: {
    var95: number
    var99: number
    cvar95: number
    expectedShortfall: number
    probabilityOfRuin: number
  }
  
  // Statistics for compatibility 
  statistics?: {
    mean: number
    median: number
    p95: number
    p99: number
    stddev: number
  }
  
  // Confidence interval for compatibility
  confidenceInterval?: {
    lower: number
    upper: number
    confidence: number
  }
  
  // Probability outcomes
  probability: {
    occurrenceRate: number
    expectedEvents: number
    confidenceInterval: [number, number]
  }
  
  // Time series data for visualization
  simulations: SimulationRun[]
}

export interface SimulationRun {
  iteration: number
  occurred: boolean
  impact: number
  year: number
  mitigated: boolean
}

export interface RiskTemplate {
  id: string
  name: string
  description: string
  industry: Industry
  category: RiskCategory
  scenarios: Partial<RiskScenario>[]
  bestPractices: string[]
  regulatoryContext?: string[]
}

export interface ExecutiveReport {
  id: string
  generatedAt: Date
  summary: {
    totalExposure: number
    mitigatedExposure: number
    recommendedInvestment: number
    roi: number
    timeToValue: number
  }
  scenarios: RiskScenarioSummary[]
  recommendations: string[]
  visualizations: ReportVisualization[]
}

export interface RiskScenarioSummary {
  scenario: RiskScenario
  result: MonteCarloResult
  exposure: number
  mitigatedExposure: number
  priority: 'critical' | 'high' | 'medium' | 'low'
}

export interface ReportVisualization {
  type: 'distribution' | 'timeline' | 'comparison' | 'heatmap'
  title: string
  data: any
  options?: any
}