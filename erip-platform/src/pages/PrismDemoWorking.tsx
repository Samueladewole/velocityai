/**
 * Working PRISM Demo
 * Hubbard 5-point calibration risk analysis
 */
import React, { useState } from 'react'

interface HubbardEstimate {
  p10: number
  p30: number
  p50: number
  p70: number
  p90: number
}

export function PrismDemoWorking() {
  const [estimate, setEstimate] = useState<HubbardEstimate>({
    p10: 10000,
    p30: 25000,
    p50: 50000,
    p70: 75000,
    p90: 100000
  })
  
  const [simulationResults, setSimulationResults] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runSimulation = async () => {
    setIsRunning(true)
    setSimulationResults(null)
    
    try {
      // First try backend API for professional Monte Carlo analysis
      const response = await fetch('http://localhost:8001/prism/monte-carlo-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iterations: 50000,
          risk_estimates: estimate,
          analysis_type: 'hubbard_calibration'
        })
      })
      
      if (response.ok) {
        const backendResults = await response.json()
        setSimulationResults({
          mean: Math.round(backendResults.expected_loss),
          p95: Math.round(backendResults.var_results.var_95 * 1000000),
          p99: Math.round(backendResults.var_results.var_99 * 1000000),
          iterations: backendResults.iterations,
          backend_powered: true,
          risk_scenarios: backendResults.risk_scenarios,
          recommendations: backendResults.recommendations,
          analysis_id: backendResults.analysis_id
        })
      } else {
        throw new Error('Backend unavailable, using client-side calculation')
      }
    } catch (error) {
      console.log('Using client-side Monte Carlo simulation:', error)
      
      // Fallback to client-side simulation
      const iterations = 10000
      const results = []
      
      for (let i = 0; i < iterations; i++) {
        // Generate random value using triangular distribution approximation
        const random = Math.random()
        let value: number
        
        if (random < 0.1) {
          value = estimate.p10 + (estimate.p30 - estimate.p10) * (random / 0.1)
        } else if (random < 0.3) {
          value = estimate.p30 + (estimate.p50 - estimate.p30) * ((random - 0.1) / 0.2)
        } else if (random < 0.7) {
          value = estimate.p50 + (estimate.p70 - estimate.p50) * ((random - 0.3) / 0.4)
        } else if (random < 0.9) {
          value = estimate.p70 + (estimate.p90 - estimate.p70) * ((random - 0.7) / 0.2)
        } else {
          value = estimate.p90 * (1 + (random - 0.9) * 2) // Tail extension
        }
        
        results.push(value)
      }
      
      results.sort((a, b) => a - b)
      
      const mean = results.reduce((sum, val) => sum + val, 0) / results.length
      const p95 = results[Math.floor(results.length * 0.95)]
      const p99 = results[Math.floor(results.length * 0.99)]
      
      setSimulationResults({
        mean: Math.round(mean),
        p95: Math.round(p95),
        p99: Math.round(p99),
        iterations,
        backend_powered: false,
        distribution: results
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              PRISM Risk Quantification Demo
            </h1>
            <p className="text-lg text-gray-600">
              Hubbard 5-Point Calibrated Risk Analysis
            </p>
          </div>
          <a 
            href="/tools/prism" 
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Back to PRISM
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hubbard Calibration Input */}
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">
            🎯 Hubbard 5-Point Calibration
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter your calibrated estimates for annual financial risk exposure:
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                P10 (90% confident it's higher): ${estimate.p10.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="50000"
                value={estimate.p10}
                onChange={(e) => setEstimate({...estimate, p10: Number(e.target.value)})}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                P30: ${estimate.p30.toLocaleString()}
              </label>
              <input
                type="range"
                min="10000"
                max="75000"
                value={estimate.p30}
                onChange={(e) => setEstimate({...estimate, p30: Number(e.target.value)})}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                P50 (Median): ${estimate.p50.toLocaleString()}
              </label>
              <input
                type="range"
                min="25000"
                max="100000"
                value={estimate.p50}
                onChange={(e) => setEstimate({...estimate, p50: Number(e.target.value)})}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                P70: ${estimate.p70.toLocaleString()}
              </label>
              <input
                type="range"
                min="50000"
                max="150000"
                value={estimate.p70}
                onChange={(e) => setEstimate({...estimate, p70: Number(e.target.value)})}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                P90 (90% confident it's lower): ${estimate.p90.toLocaleString()}
              </label>
              <input
                type="range"
                min="75000"
                max="200000"
                value={estimate.p90}
                onChange={(e) => setEstimate({...estimate, p90: Number(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>
          
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? '⏳ Running Professional Analysis...' : '🚀 Run Monte Carlo Simulation'}
          </button>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h2 className="text-xl font-semibold mb-4 text-green-900 flex items-center gap-2">
            📊 Simulation Results
            {simulationResults?.backend_powered && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                AI-Powered Backend
              </span>
            )}
          </h2>
          
          {simulationResults ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Risk Metrics</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Expected Loss:</span>
                    <div className="font-bold text-lg">${simulationResults.mean.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">95th Percentile:</span>
                    <div className="font-bold text-lg text-orange-600">${simulationResults.p95.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">99th Percentile:</span>
                    <div className="font-bold text-lg text-red-600">${simulationResults.p99.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Simulations:</span>
                    <div className="font-bold text-lg">{simulationResults.iterations.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">✅ Executive Summary</h3>
                <ul className="text-sm space-y-1">
                  <li>• Expected annual risk exposure: ${simulationResults.mean.toLocaleString()}</li>
                  <li>• 95% confidence: losses won't exceed ${simulationResults.p95.toLocaleString()}</li>
                  <li>• Extreme scenario (99th percentile): ${simulationResults.p99.toLocaleString()}</li>
                  <li>• Risk analysis based on {simulationResults.iterations.toLocaleString()} Monte Carlo simulations</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">🔬 Hubbard Methodology</h3>
                <p className="text-sm text-purple-700">
                  This analysis uses Douglas Hubbard's 5-point calibration system to reduce overconfidence bias 
                  and provide more accurate risk quantification than traditional scoring methods.
                </p>
              </div>
              
              {/* Detailed Results Explanation */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">📖 What These Results Mean</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div>
                    <strong>Expected Loss (${simulationResults.mean.toLocaleString()}):</strong>
                    <p>The average annual financial risk exposure your organization should budget for. This is your baseline planning number.</p>
                  </div>
                  
                  <div>
                    <strong>95th Percentile (${simulationResults.p95.toLocaleString()}):</strong>
                    <p>There's a 95% chance your actual losses will be below this amount. Use this for stress testing and capital reserve planning.</p>
                  </div>
                  
                  <div>
                    <strong>99th Percentile (${simulationResults.p99.toLocaleString()}):</strong>
                    <p>This represents extreme scenarios. Only 1% of outcomes exceed this value. Critical for crisis planning and insurance decisions.</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                    <strong>📊 Business Impact:</strong>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• Budget ${simulationResults.mean.toLocaleString()} annually for security/risk management</li>
                      <li>• Ensure liquidity/insurance covers up to ${simulationResults.p95.toLocaleString()}</li>
                      <li>• Have crisis response plan for scenarios exceeding ${simulationResults.p99.toLocaleString()}</li>
                      <li>• This replaces subjective "high/medium/low" with quantified financial targets</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-300">
                    <strong>⚡ Why Hubbard Method Works:</strong>
                    <p className="text-xs mt-1">Traditional risk matrices are subjective and inconsistent. The Hubbard method uses cognitive science to improve estimation accuracy by 23-45% compared to traditional approaches.</p>
                  </div>
                </div>
              </div>
              
              {/* Backend AI Recommendations */}
              {simulationResults.backend_powered && simulationResults.recommendations && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    🤖 AI-Powered Risk Management Recommendations
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      Professional Analysis
                    </span>
                  </h3>
                  <ul className="space-y-2 text-sm text-green-800">
                    {simulationResults.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Risk Scenarios from Backend */}
              {simulationResults.backend_powered && simulationResults.risk_scenarios && (
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-900 mb-3">⚠️ Key Risk Scenarios</h3>
                  <div className="space-y-3">
                    {simulationResults.risk_scenarios.slice(0, 3).map((scenario: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border-l-4 border-orange-400">
                        <h4 className="font-medium text-orange-900">{scenario.risk_type}</h4>
                        <div className="text-sm text-orange-700 mt-1">
                          <div>Probability: {(scenario.probability * 100).toFixed(1)}% | Impact: {scenario.impact}/10</div>
                          <div className="mt-1 text-xs">{scenario.business_impact}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">🎯</div>
              <p>Configure your Hubbard estimates and run the simulation to see quantified risk results.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">💡 How Hubbard Calibration Works</h3>
        <p className="text-sm text-yellow-700">
          The Hubbard method uses 5 specific confidence intervals (P10, P30, P50, P70, P90) instead of 
          simple min/max ranges. This approach, backed by cognitive science research, significantly improves 
          estimation accuracy by reducing overconfidence bias - a major source of error in traditional risk assessments.
        </p>
      </div>
    </div>
  )
}