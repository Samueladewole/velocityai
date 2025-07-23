import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calculator,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  PieChart,
  LineChart
} from 'lucide-react';

export const PrismWorking: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  
  const riskScenarios = [
    {
      id: 'data-breach',
      name: 'Data Breach - Customer PII',
      category: 'Cyber Security',
      probability: 0.15,
      impact: {
        min: 850000,
        most_likely: 2400000,
        max: 8500000
      },
      annualizedLoss: 360000,
      confidence: 85,
      lastCalculated: '2025-07-20',
      mitigation: 'Enhanced encryption, monitoring'
    },
    {
      id: 'system-outage',
      name: 'Critical System Outage',
      category: 'Operational',
      probability: 0.08,
      impact: {
        min: 125000,
        most_likely: 450000,
        max: 1200000
      },
      annualizedLoss: 36000,
      confidence: 92,
      lastCalculated: '2025-07-19',
      mitigation: 'Redundancy, disaster recovery'
    },
    {
      id: 'regulatory-fine',
      name: 'GDPR Compliance Violation',
      category: 'Regulatory',
      probability: 0.05,
      impact: {
        min: 50000,
        most_likely: 750000,
        max: 20000000
      },
      annualizedLoss: 37500,
      confidence: 78,
      lastCalculated: '2025-07-18',
      mitigation: 'Privacy by design, training'
    },
    {
      id: 'supply-chain',
      name: 'Supply Chain Disruption',
      category: 'Third Party',
      probability: 0.12,
      impact: {
        min: 200000,
        most_likely: 850000,
        max: 3500000
      },
      annualizedLoss: 102000,
      confidence: 88,
      lastCalculated: '2025-07-17',
      mitigation: 'Vendor diversification, contracts'
    }
  ];

  const portfolioMetrics = {
    totalALE: 535500, // Total Annualized Loss Expectancy
    var95: 12500000, // Value at Risk 95%
    var99: 28000000, // Value at Risk 99%
    expectedLoss: 535500,
    riskAppetite: 1000000,
    riskTolerance: 5000000,
    scenarios: riskScenarios.length,
    lastUpdated: '2025-07-20'
  };

  const simulations = [
    {
      id: '1',
      name: 'Q3 2025 Portfolio Risk Assessment',
      type: 'Monte Carlo',
      status: 'completed',
      iterations: 10000,
      confidence: 95,
      scenarios: 15,
      completedDate: '2025-07-20',
      results: {
        expectedLoss: 535500,
        var95: 12500000,
        worstCase: 45000000
      }
    },
    {
      id: '2',
      name: 'Cyber Risk Deep Dive',
      type: 'FAIR Analysis',
      status: 'in-progress',
      iterations: 50000,
      confidence: 99,
      scenarios: 8,
      progress: 73,
      estimatedCompletion: '2025-07-22'
    },
    {
      id: '3',
      name: 'Regulatory Impact Scenario',
      type: 'Stress Test',
      status: 'scheduled',
      iterations: 25000,
      confidence: 90,
      scenarios: 5,
      scheduledDate: '2025-07-25'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (decimal: number) => {
    return `${(decimal * 100).toFixed(1)}%`;
  };

  const getRiskLevel = (ale: number) => {
    if (ale > 500000) return { level: 'High', color: 'text-red-700 bg-red-50 border-red-200' };
    if (ale > 100000) return { level: 'Medium', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { level: 'Low', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cyber Security':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'Operational':
        return <Activity className="h-4 w-4 text-blue-600" />;
      case 'Regulatory':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'Third Party':
        return <Target className="h-4 w-4 text-orange-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-xl" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Calculator className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">PRISM</h1>
              <p className="text-xl text-emerald-100 mt-1">Risk Quantification Engine</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-100">Monte Carlo Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-emerald-200" />
                  <span className="text-emerald-100">10,000 iterations complete</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-white text-emerald-900 hover:bg-white/90">
              <Calculator className="h-4 w-4 mr-2" />
              Run Simulation
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Portfolio Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Total ALE</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{formatCurrency(portfolioMetrics.totalALE)}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <ArrowDownRight className="h-4 w-4" />
              <span>-15% from last quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">VaR (95%)</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-red-200 text-red-600 group-hover:from-red-200 group-hover:to-red-300 transition-all duration-300">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{formatCurrency(portfolioMetrics.var95)}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
              <span>95% confidence level</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Risk Appetite</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
              <Target className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{formatCurrency(portfolioMetrics.riskAppetite)}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <CheckCircle className="h-4 w-4" />
              <span>Within limits</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Active Scenarios</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
              <BarChart3 className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{portfolioMetrics.scenarios}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-purple-700">
              <ArrowUpRight className="h-4 w-4" />
              <span>+2 this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Scenarios */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  Risk Scenarios
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Quantified risk scenarios with financial impact
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {riskScenarios.map((scenario) => {
                const riskLevel = getRiskLevel(scenario.annualizedLoss);
                return (
                  <div
                    key={scenario.id}
                    className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedScenario(scenario.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(scenario.category)}
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">{scenario.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>Category: {scenario.category}</span>
                            <span>Probability: {formatPercentage(scenario.probability)}</span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">
                            Last calculated: {new Date(scenario.lastCalculated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${riskLevel.color}`}>
                        {riskLevel.level} Risk
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Annualized Loss Expectancy</div>
                        <div className="text-2xl font-bold text-slate-900">{formatCurrency(scenario.annualizedLoss)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Most Likely Impact</div>
                        <div className="text-2xl font-bold text-slate-900">{formatCurrency(scenario.impact.most_likely)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-4">
                        <span className="text-slate-600">Min: {formatCurrency(scenario.impact.min)}</span>
                        <span className="text-slate-600">Max: {formatCurrency(scenario.impact.max)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">Confidence:</span>
                        <span className="font-medium text-emerald-700">{scenario.confidence}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="text-xs text-slate-600">
                        <strong>Mitigation:</strong> {scenario.mitigation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Simulations */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  Risk Simulations
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Monte Carlo and FAIR methodology analysis
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {simulations.map((simulation) => (
                <div
                  key={simulation.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{simulation.name}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          simulation.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          simulation.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}>
                          {simulation.status}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                        <div>Type: {simulation.type}</div>
                        <div>Iterations: {simulation.iterations?.toLocaleString()}</div>
                        <div>Scenarios: {simulation.scenarios}</div>
                        <div>Confidence: {simulation.confidence}%</div>
                      </div>
                      
                      {simulation.status === 'in-progress' && simulation.progress && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span className="font-medium">{simulation.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${simulation.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {simulation.results && (
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                          <div className="text-xs font-medium text-emerald-800 mb-2">Results:</div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <div className="text-emerald-600">Expected Loss</div>
                              <div className="font-medium">{formatCurrency(simulation.results.expectedLoss)}</div>
                            </div>
                            <div>
                              <div className="text-emerald-600">VaR 95%</div>
                              <div className="font-medium">{formatCurrency(simulation.results.var95)}</div>
                            </div>
                            <div>
                              <div className="text-emerald-600">Worst Case</div>
                              <div className="font-medium">{formatCurrency(simulation.results.worstCase)}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs text-slate-500 mt-2">
                        {simulation.status === 'completed' && simulation.completedDate && 
                          `Completed: ${new Date(simulation.completedDate).toLocaleDateString()}`}
                        {simulation.status === 'in-progress' && simulation.estimatedCompletion && 
                          `Est. completion: ${new Date(simulation.estimatedCompletion).toLocaleDateString()}`}
                        {simulation.status === 'scheduled' && simulation.scheduledDate && 
                          `Scheduled: ${new Date(simulation.scheduledDate).toLocaleDateString()}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Appetite Dashboard */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Target className="h-5 w-5 text-blue-600" />
                Risk Appetite Dashboard
              </CardTitle>
              <CardDescription className="text-slate-600">
                Current risk exposure vs. appetite and tolerance levels
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              Within Appetite
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900">Current Exposure</span>
                  <span className="text-sm font-mono text-slate-700">{formatCurrency(portfolioMetrics.totalALE)}</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full shadow-sm transition-all duration-1000" 
                      style={{ width: `${(portfolioMetrics.totalALE / portfolioMetrics.riskTolerance) * 100}%` }} 
                    />
                  </div>
                  <div className="absolute left-1/2 top-0 h-4 w-px bg-amber-500" title="Risk Appetite" />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>$0</span>
                  <span className="text-amber-600 font-medium">Appetite: {formatCurrency(portfolioMetrics.riskAppetite)}</span>
                  <span>Tolerance: {formatCurrency(portfolioMetrics.riskTolerance)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-700 mb-1">54%</div>
                <div className="text-sm text-slate-600">of Risk Appetite Used</div>
                <div className="text-xs text-emerald-600 mt-1">✓ Well within limits</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700 mb-1">11%</div>
                <div className="text-sm text-slate-600">of Risk Tolerance Used</div>
                <div className="text-xs text-blue-600 mt-1">✓ Comfortable headroom</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Zap className="h-5 w-5 text-amber-600" />
            Risk Analytics
          </CardTitle>
          <CardDescription className="text-slate-600">
            Advanced quantitative risk modeling and analysis tools
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-emerald-50/50 border-emerald-200"
            >
              <Calculator className="h-8 w-8 text-emerald-600" />
              <span className="font-medium">Monte Carlo</span>
              <span className="text-xs text-slate-500">Risk simulation</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-blue-50/50 border-blue-200"
            >
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="font-medium">FAIR Analysis</span>
              <span className="text-xs text-slate-500">Quantitative framework</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-purple-50/50 border-purple-200"
            >
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <span className="font-medium">Stress Testing</span>
              <span className="text-xs text-slate-500">Scenario analysis</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-amber-50/50 border-amber-200"
            >
              <FileText className="h-8 w-8 text-amber-600" />
              <span className="font-medium">Risk Report</span>
              <span className="text-xs text-slate-500">Executive summary</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};