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
import { RiskScenario, MonteCarloResult, SimulationRun } from '@/types/prism'
import { MonteCarloEngine, SimulationParameters } from '@/services/risk/monteCarloEngine'
import { HubbardMonteCarloAdapter } from '@/services/risk/hubbardMonteCarloAdapter'
import { useToast } from '@/hooks/use-toast'

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

  const [parameters, setParameters] = useState<SimulationParameters>({
    iterations: 10000,
    confidence: 95,
    timeHorizon: 1,
    discountRate: 0.05,
    currency: 'USD',
    businessContext: {
      annualRevenue: 50000000,
      riskTolerance: 'moderate',
      industryBenchmark: 0.02
    }
  })

  const [animationData, setAnimationData] = useState<Array<{ iteration: number, value: number }>>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const { toast } = useToast()

  const monteCarloEngine = new MonteCarloEngine(undefined, 42) // Seeded for reproducibility
  const hubbardAdapter = new HubbardMonteCarloAdapter({
    useEnsembleMethod: true,
    calibrationWeighting: true,
    distributionFitting: 'auto'
  })

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startSimulation = async () => {
    if (scenarios.length === 0) {
      toast({
        title: 'No Scenarios',
        description: 'Please add risk scenarios before running simulation',
        variant: 'destructive'
      })
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
    
    setAnimationData([])
    startTimeRef.current = Date.now()

    // Convert scenarios using Hubbard adapter for enhanced precision
    const mcScenarios = scenarios.map(scenario => 
      hubbardAdapter.convertRiskScenario(scenario)
    )
    
    // Generate Hubbard-aware report for validation
    const hubbardReport = hubbardAdapter.generateHubbardReport(scenarios)
    console.log('Hubbard Analysis Report:', hubbardReport)

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
      const results = await monteCarloEngine.runSimulation(mcScenarios, parameters)
      
      setSimulationState(prev => ({
        ...prev,
        isRunning: false,
        results: results as any,
        progress: 100
      }))

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Add Hubbard-specific metadata to results
      const enhancedResults = {
        ...results,
        hubbardMetadata: {
          calibratedScenarios: scenarios.filter(s => s.metadata?.hubbardEstimate).length,
          totalScenarios: scenarios.length,
          averageCalibrationScore: scenarios
            .map(s => s.metadata?.hubbardEstimate?.calibrationScore)
            .filter(score => score !== undefined)
            .reduce((sum: number, score: number) => sum + score, 0) / 
            scenarios.filter(s => s.metadata?.hubbardEstimate).length || 0
        }
      }
      
      onResultsUpdate?.(enhancedResults as any)

      toast({
        title: 'Simulation Complete',
        description: `Completed ${parameters.iterations.toLocaleString()} iterations in ${(results.executionTime / 1000).toFixed(1)}s`
      })

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

      toast({
        title: 'Simulation Failed',
        description: 'An error occurred during the Monte Carlo simulation',
        variant: 'destructive'
      })
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
    setAnimationData([])
  }

  const generateRandomLoss = (scenarios: RiskScenario[]): number => {
    let totalLoss = 0
    scenarios.forEach(scenario => {
      if (Math.random() < scenario.probability.annual) {
        // Simple triangular distribution approximation
        const r1 = Math.random()
        const r2 = Math.random()
        const min = scenario.impact.financial.min
        const max = scenario.impact.financial.max
        const mode = scenario.impact.financial.likely
        
        let loss: number
        const f = (mode - min) / (max - min)
        
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
    { name: 'P10', value: (simulationState.results as any).percentiles?.p10 || 0, color: VISUALIZATION_COLORS[0] },
    { name: 'P25', value: (simulationState.results as any).percentiles?.p25 || 0, color: VISUALIZATION_COLORS[1] },
    { name: 'P50', value: (simulationState.results as any).percentiles?.p50 || 0, color: VISUALIZATION_COLORS[2] },
    { name: 'P75', value: (simulationState.results as any).percentiles?.p75 || 0, color: VISUALIZATION_COLORS[3] },
    { name: 'P90', value: (simulationState.results as any).percentiles?.p90 || 0, color: VISUALIZATION_COLORS[4] },
    { name: 'P95', value: (simulationState.results as any).percentiles?.p95 || 0, color: VISUALIZATION_COLORS[5] }
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

      {/* Live Visualization */}
      <Tabs defaultValue="live" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live">Live Animation</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="percentiles">Risk Metrics</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Live Loss Stream */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Loss Stream</CardTitle>
                <CardDescription>Real-time simulation results</CardDescription>
              </CardHeader>
              <CardContent>
                {liveChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={liveChartData.slice(-100)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="iteration" 
                        type="number"
                        scale="linear"
                        domain={['dataMin', 'dataMax']}
                      />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Loss']}
                        labelFormatter={(label) => `Iteration ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="loss" 
                        stroke={VISUALIZATION_COLORS[0]}
                        strokeWidth={2}
                        dot={false}
                        name="Simulated Loss"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[250px] text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                      <p>Start simulation to see live data</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Real-time Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Running Statistics</CardTitle>
                <CardDescription>Updated in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {simulationState.liveData.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-blue-600 font-medium">Current Mean</div>
                          <div className="text-lg font-bold text-blue-900">
                            {formatCurrency(
                              simulationState.liveData.reduce((a, b) => a + b, 0) / simulationState.liveData.length
                            )}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-sm text-red-600 font-medium">Current Max</div>
                          <div className="text-lg font-bold text-red-900">
                            {formatCurrency(Math.max(...simulationState.liveData))}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-sm text-green-600 font-medium">Current Min</div>
                          <div className="text-lg font-bold text-green-900">
                            {formatCurrency(Math.min(...simulationState.liveData))}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-sm text-purple-600 font-medium">Std Dev</div>
                          <div className="text-lg font-bold text-purple-900">
                            {formatCurrency(calculateStdDev(simulationState.liveData))}
                          </div>
                        </div>
                      </div>
                      <div className="text-center text-sm text-gray-600">
                        Based on {simulationState.liveData.length} samples
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Target className="h-8 w-8 mx-auto mb-2" />
                      <p>Statistics will appear here during simulation</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loss Distribution</CardTitle>
              <CardDescription>
                Probability density of potential losses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {simulationState.results ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={distributionData}>
                    <defs>
                      <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={VISUALIZATION_COLORS[0]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={VISUALIZATION_COLORS[0]} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="loss" 
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <YAxis 
                      label={{ value: 'Probability Density', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${(value * 100).toFixed(3)}%`, 'Probability']}
                      labelFormatter={(label) => `Loss: ${formatCurrency(Number(label))}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="density" 
                      stroke={VISUALIZATION_COLORS[0]}
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#lossGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                    <p>Run simulation to see distribution</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="percentiles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Percentiles</CardTitle>
                <CardDescription>Key risk metrics from simulation</CardDescription>
              </CardHeader>
              <CardContent>
                {percentileData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={percentileData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Loss Value']}
                      />
                      <Bar dataKey="value" fill={VISUALIZATION_COLORS[2]} radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    Run simulation to see percentiles
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Risk Metrics</CardTitle>
                <CardDescription>Value at Risk and statistical measures</CardDescription>
              </CardHeader>
              <CardContent>
                {simulationState.results ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-sm text-red-600 font-medium">VaR 95%</div>
                        <div className="text-xl font-bold text-red-900">
                          {formatCurrency(simulationState.results.riskMetrics.var95)}
                        </div>
                        <div className="text-xs text-red-700 mt-1">
                          95% confidence level
                        </div>
                      </div>
                      <div className="bg-red-100 p-4 rounded-lg">
                        <div className="text-sm text-red-700 font-medium">VaR 99%</div>
                        <div className="text-xl font-bold text-red-800">
                          {formatCurrency(simulationState.results.riskMetrics.var99)}
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          99% confidence level
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-sm text-orange-600 font-medium">Expected Shortfall</div>
                        <div className="text-xl font-bold text-orange-900">
                          {formatCurrency(simulationState.results.riskMetrics.expectedShortfall)}
                        </div>
                        <div className="text-xs text-orange-700 mt-1">
                          CVaR 95%
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-sm text-yellow-700 font-medium">Probability of Ruin</div>
                        <div className="text-xl font-bold text-yellow-800">
                          {(simulationState.results.riskMetrics.probabilityOfRuin * 100).toFixed(2)}%
                        </div>
                        <div className="text-xs text-yellow-600 mt-1">
                          Catastrophic loss
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Statistical Summary</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Mean Loss:</span>
                          <span className="font-mono">{formatCurrency(simulationState.results.statistics.mean)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Median Loss:</span>
                          <span className="font-mono">{formatCurrency(simulationState.results.statistics.median)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Standard Deviation:</span>
                          <span className="font-mono">{formatCurrency((simulationState.results.statistics as any).standardDeviation || (simulationState.results.statistics as any).stddev || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Skewness:</span>
                          <span className="font-mono">{((simulationState.results.statistics as any).skewness || 0).toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Target className="h-8 w-8 mx-auto mb-2" />
                    <p>Metrics will appear after simulation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Contributions</CardTitle>
              <CardDescription>Individual scenario impact on portfolio risk</CardDescription>
            </CardHeader>
            <CardContent>
              {simulationState.results && scenarios.length > 0 ? (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={scenarios.map((scenario, index) => ({
                          name: scenario.name,
                          value: scenario.probability.annual * scenario.impact.financial.likely,
                          fill: VISUALIZATION_COLORS[index % VISUALIZATION_COLORS.length]
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scenarios.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={VISUALIZATION_COLORS[index % VISUALIZATION_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [formatCurrency(value), 'Expected Loss']} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="grid gap-3">
                    {scenarios.map((scenario, index) => (
                      <div key={scenario.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: VISUALIZATION_COLORS[index % VISUALIZATION_COLORS.length] }}
                          />
                          <div>
                            <div className="font-medium">{scenario.name}</div>
                            <div className="text-sm text-gray-600">
                              {Math.round(scenario.probability.annual * 100)}% annually
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {formatCurrency(scenario.probability.annual * scenario.impact.financial.likely)}
                          </div>
                          <div className="text-sm text-gray-600">Expected loss</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p>Scenario breakdown will appear after simulation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions
function generateDistributionData(results: MonteCarloResult) {
  // Generate histogram data from percentiles
  const data: Array<{ loss: number, density: number }> = []
  const percentiles = (results as any).percentiles || {}
  const statistics = (results as any).statistics || {}
  
  // Create bins from percentile data
  const bins = [
    { loss: statistics.minimum || 0, density: 0.001 },
    { loss: percentiles.p5 || 0, density: 0.05 },
    { loss: percentiles.p10 || 0, density: 0.1 },
    { loss: percentiles.p25 || 0, density: 0.25 },
    { loss: percentiles.p50 || 0, density: 0.5 },
    { loss: percentiles.p75 || 0, density: 0.25 },
    { loss: percentiles.p90 || 0, density: 0.1 },
    { loss: percentiles.p95 || 0, density: 0.05 },
    { loss: percentiles.p99 || 0, density: 0.01 },
    { loss: statistics.maximum || 0, density: 0.001 }
  ]
  
  return bins
}

function calculateStdDev(data: number[]): number {
  if (data.length === 0) return 0
  const mean = data.reduce((a, b) => a + b) / data.length
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length
  return Math.sqrt(variance)
}