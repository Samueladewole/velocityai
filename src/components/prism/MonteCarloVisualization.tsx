/**
 * Monte Carlo Visualization Component
 * 
 * Live simulation animation with probability distribution charts,
 * financial impact ranges, and confidence intervals.
 */
import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  Download,
  Activity,
  BarChart3,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react'

// Mock types for demo
interface RiskScenario {
  id: string
  name: string
  probability: { annual: number }
  impact: { 
    financial: { 
      min: number
      max: number
      likely: number 
    } 
  }
  metadata?: any
}

interface MonteCarloResult {
  statistics: {
    mean: number
    median: number
    standardDeviation?: number
    stddev?: number
    skewness?: number
    minimum?: number
    maximum?: number
  }
  riskMetrics: {
    var95: number
    var99: number
    expectedShortfall: number
    probabilityOfRuin: number
  }
  percentiles?: {
    p5?: number
    p10?: number
    p25?: number
    p50?: number
    p75?: number
    p90?: number
    p95?: number
    p99?: number
  }
  executionTime: number
}

interface MonteCarloVisualizationProps {
  scenarios: RiskScenario[]
  onResultsUpdate?: (results: MonteCarloResult) => void
}

interface SimulationState {
  isRunning: boolean
  isPaused: boolean
  progress: number
  currentIteration: number
  totalIterations: number
  results: MonteCarloResult | null
  liveData: number[]
  elapsedTime: number
}

const VISUALIZATION_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16'
]

// Mock Monte Carlo simulation
const mockMonteCarloSimulation = async (scenarios: RiskScenario[], iterations: number): Promise<MonteCarloResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Generate mock results
  const mockLosses = []
  for (let i = 0; i < iterations; i++) {
    let totalLoss = 0
    scenarios.forEach(scenario => {
      if (Math.random() < scenario.probability.annual) {
        const min = scenario.impact.financial.min
        const max = scenario.impact.financial.max
        const likely = scenario.impact.financial.likely
        // Triangular distribution
        const r1 = Math.random()
        const f = (likely - min) / (max - min)
        let loss: number
        if (r1 <= f) {
          loss = min + Math.sqrt(r1 * (max - min) * (likely - min))
        } else {
          loss = max - Math.sqrt((1 - r1) * (max - min) * (max - likely))
        }
        totalLoss += loss
      }
    })
    mockLosses.push(totalLoss)
  }
  
  mockLosses.sort((a, b) => a - b)
  const mean = mockLosses.reduce((a, b) => a + b, 0) / mockLosses.length
  const variance = mockLosses.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / mockLosses.length
  const stddev = Math.sqrt(variance)
  
  return {
    statistics: {
      mean,
      median: mockLosses[Math.floor(mockLosses.length * 0.5)],
      standardDeviation: stddev,
      minimum: mockLosses[0],
      maximum: mockLosses[mockLosses.length - 1],
      skewness: 1.2
    },
    riskMetrics: {
      var95: mockLosses[Math.floor(mockLosses.length * 0.95)],
      var99: mockLosses[Math.floor(mockLosses.length * 0.99)],
      expectedShortfall: mockLosses.slice(Math.floor(mockLosses.length * 0.95)).reduce((a, b) => a + b, 0) / (mockLosses.length * 0.05),
      probabilityOfRuin: mockLosses.filter(l => l > mean * 10).length / mockLosses.length
    },
    percentiles: {
      p5: mockLosses[Math.floor(mockLosses.length * 0.05)],
      p10: mockLosses[Math.floor(mockLosses.length * 0.10)],
      p25: mockLosses[Math.floor(mockLosses.length * 0.25)],
      p50: mockLosses[Math.floor(mockLosses.length * 0.50)],
      p75: mockLosses[Math.floor(mockLosses.length * 0.75)],
      p90: mockLosses[Math.floor(mockLosses.length * 0.90)],
      p95: mockLosses[Math.floor(mockLosses.length * 0.95)],
      p99: mockLosses[Math.floor(mockLosses.length * 0.99)]
    },
    executionTime: 1000
  }
}

export function MonteCarloVisualization({ scenarios, onResultsUpdate }: MonteCarloVisualizationProps) {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    isPaused: false,
    progress: 0,
    currentIteration: 0,
    totalIterations: 10000,
    results: null,
    liveData: [],
    elapsedTime: 0
  })

  const [parameters] = useState({
    iterations: 10000,
    confidence: 95,
    timeHorizon: 1,
    discountRate: 0.05,
    currency: 'USD'
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startSimulation = async () => {
    if (scenarios.length === 0) {
      console.log('Please add risk scenarios before running simulation')
      return
    }

    setSimulationState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      progress: 0,
      currentIteration: 0,
      liveData: [],
      results: null
    }))
    
    startTimeRef.current = Date.now()

    try {
      // Start live animation
      intervalRef.current = setInterval(() => {
        setSimulationState(prev => {
          if (prev.currentIteration >= parameters.iterations) {
            return prev
          }

          const newIteration = prev.currentIteration + Math.floor(Math.random() * 50) + 10
          const cappedIteration = Math.min(newIteration, parameters.iterations)
          
          // Generate mock live data point
          const randomLoss = generateRandomLoss(scenarios)
          const newLiveData = [...prev.liveData, randomLoss]
          
          // Keep only last 1000 points for performance
          if (newLiveData.length > 1000) {
            newLiveData.shift()
          }

          const progress = (cappedIteration / parameters.iterations) * 100
          const elapsedTime = Date.now() - startTimeRef.current

          return {
            ...prev,
            currentIteration: cappedIteration,
            progress,
            liveData: newLiveData,
            elapsedTime
          }
        })
      }, 50)

      // Run actual simulation in background
      const results = await mockMonteCarloSimulation(scenarios, parameters.iterations)
      
      setSimulationState(prev => ({
        ...prev,
        isRunning: false,
        results,
        progress: 100
      }))

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      
      onResultsUpdate?.(results)

    } catch (error) {
      console.error('Simulation error:', error)
      setSimulationState(prev => ({
        ...prev,
        isRunning: false,
        progress: 0
      }))
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const pauseSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setSimulationState(prev => ({
      ...prev,
      isPaused: true,
      isRunning: false
    }))
  }

  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setSimulationState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      progress: 0,
      currentIteration: 0,
      liveData: [],
      results: null
    }))
  }

  const generateRandomLoss = (scenarios: RiskScenario[]): number => {
    let totalLoss = 0
    scenarios.forEach(scenario => {
      if (Math.random() < scenario.probability.annual) {
        // Simple triangular distribution approximation
        const min = scenario.impact.financial.min
        const max = scenario.impact.financial.max
        const mode = scenario.impact.financial.likely
        
        let loss: number
        const f = (mode - min) / (max - min)
        const r1 = Math.random()
        
        if (r1 <= f) {
          loss = min + Math.sqrt(r1 * (max - min) * (mode - min))
        } else {
          loss = max - Math.sqrt((1 - r1) * (max - min) * (max - mode))
        }
        
        totalLoss += loss
      }
    })
    return totalLoss
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount)
  }

  const formatTime = (ms: number) => {
    const seconds = ms / 1000
    if (seconds < 60) return `${seconds.toFixed(1)}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  // Prepare distribution data for visualization
  const distributionData = simulationState.results ? 
    generateDistributionData(simulationState.results) : []

  const liveChartData = simulationState.liveData.map((value, index) => ({
    iteration: index + 1,
    loss: value
  }))

  const percentileData = simulationState.results ? [
    { name: 'P10', value: simulationState.results.percentiles?.p10 || 0, color: VISUALIZATION_COLORS[0] },
    { name: 'P25', value: simulationState.results.percentiles?.p25 || 0, color: VISUALIZATION_COLORS[1] },
    { name: 'P50', value: simulationState.results.percentiles?.p50 || 0, color: VISUALIZATION_COLORS[2] },
    { name: 'P75', value: simulationState.results.percentiles?.p75 || 0, color: VISUALIZATION_COLORS[3] },
    { name: 'P90', value: simulationState.results.percentiles?.p90 || 0, color: VISUALIZATION_COLORS[4] },
    { name: 'P95', value: simulationState.results.percentiles?.p95 || 0, color: VISUALIZATION_COLORS[5] }
  ] : []

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Monte Carlo Simulation
              </CardTitle>
              <CardDescription>
                {scenarios.length} scenarios • {parameters.iterations.toLocaleString()} iterations
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={simulationState.isRunning}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={stopSimulation}
                disabled={!simulationState.isRunning && !simulationState.results}
              >
                <Square className="h-4 w-4 mr-2" />
                Reset
              </Button>
              {!simulationState.isRunning && !simulationState.isPaused && (
                <Button onClick={startSimulation} disabled={scenarios.length === 0}>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              )}
              {simulationState.isRunning && (
                <Button onClick={pauseSimulation} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {(simulationState.isRunning || simulationState.progress > 0) && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span>Progress: {simulationState.progress.toFixed(1)}%</span>
                  <span>Iteration: {simulationState.currentIteration.toLocaleString()}/{parameters.iterations.toLocaleString()}</span>
                  <span>Elapsed: {formatTime(simulationState.elapsedTime)}</span>
                </div>
                {simulationState.isRunning && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Zap className="h-4 w-4 animate-pulse" />
                    <span>Running...</span>
                  </div>
                )}
              </div>
              <Progress value={simulationState.progress} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Results Display */}
      {simulationState.results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-sm text-red-600 font-medium">VaR 95%</div>
                    <div className="text-xl font-bold text-red-900">
                      {formatCurrency(simulationState.results.riskMetrics.var95)}
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm text-orange-600 font-medium">Expected Loss</div>
                    <div className="text-xl font-bold text-orange-900">
                      {formatCurrency(simulationState.results.statistics.mean)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribution Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={percentileData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Loss Value']} />
                  <Bar dataKey="value" fill={VISUALIZATION_COLORS[2]} radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Helper functions
function generateDistributionData(results: MonteCarloResult) {
  const data: Array<{ loss: number, density: number }> = []
  const percentiles = results.percentiles || {}
  const statistics = results.statistics || {}
  
  // Create bins from percentile data
  const bins = [
    { loss: statistics.minimum || 0, density: 0.001 },
    { loss: percentiles.p10 || 0, density: 0.1 },
    { loss: percentiles.p25 || 0, density: 0.25 },
    { loss: percentiles.p50 || 0, density: 0.5 },
    { loss: percentiles.p75 || 0, density: 0.25 },
    { loss: percentiles.p90 || 0, density: 0.1 },
    { loss: statistics.maximum || 0, density: 0.001 }
  ]
  
  return bins
}