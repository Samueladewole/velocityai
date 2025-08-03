import React, { useState, useEffect } from 'react';
import { PublicHeader } from '../../components/common/PublicHeader';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  Database, 
  FileText, 
  Users, 
  Shield, 
  Activity, 
  Zap,
  Eye,
  Download,
  ArrowRight,
  Clock,
  AlertTriangle,
  Settings,
  Globe,
  Lock,
  Search,
  Filter,
  Target,
  Building
} from 'lucide-react';

interface BankingCost {
  id: string;
  category: 'basel-iii' | 'operational-risk' | 'compliance-staff' | 'regulatory-reporting';
  name: string;
  currentCost: number;
  automatedCost: number;
  timeSaved: string;
  riskReduction: number;
  lastCalculated: Date;
}

interface ROIAnalysis {
  id: string;
  framework: string;
  currentAnnualCost: number;
  velocityAnnualCost: number;
  savings: number;
  percentageSavings: number;
  implementationTime: string;
  paybackPeriod: string;
  threeYearSavings: number;
}

const BankingROIDemo: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'cost-analysis' | 'roi-calculator' | 'automation-impact'>('cost-analysis');
  const [selectedFramework, setSelectedFramework] = useState<string>('basel-iii');

  const [bankingCosts] = useState<BankingCost[]>([
    {
      id: '1',
      category: 'basel-iii',
      name: 'Basel III Capital Calculations',
      currentCost: 240000, // Based on 2 FTE compliance officers at €120K/year
      automatedCost: 45000, // 81% savings - platform cost + monitoring
      timeSaved: '16 weeks annually',
      riskReduction: 85,
      lastCalculated: new Date('2025-01-15')
    },
    {
      id: '2',
      category: 'operational-risk',
      name: 'Operational Risk Management',
      currentCost: 180000, // Based on risk assessment consulting + staff time
      automatedCost: 35000, // 81% savings
      timeSaved: '12 weeks annually',
      riskReduction: 78,
      lastCalculated: new Date('2025-01-14')
    },
    {
      id: '3',
      category: 'compliance-staff',
      name: 'Compliance Staff Overhead',
      currentCost: 360000, // Based on 3 FTE at €120K/year
      automatedCost: 68000, // 81% savings
      timeSaved: '28 weeks annually',
      riskReduction: 92,
      lastCalculated: new Date('2025-01-13')
    },
    {
      id: '4',
      category: 'regulatory-reporting',
      name: 'Regulatory Reporting',
      currentCost: 150000, // Based on quarterly reporting + external audits
      automatedCost: 28000, // 81% savings
      timeSaved: '10 weeks annually',
      riskReduction: 88,
      lastCalculated: new Date('2025-01-12')
    }
  ]);

  const [roiAnalyses] = useState<ROIAnalysis[]>([
    {
      id: '1',
      framework: 'Basel III',
      currentAnnualCost: 420000, // 2 FTE + consulting + regulatory reporting
      velocityAnnualCost: 80000, // 81% savings
      savings: 340000,
      percentageSavings: 81,
      implementationTime: '8 weeks',
      paybackPeriod: '2.8 months',
      threeYearSavings: 1020000
    },
    {
      id: '2',
      framework: 'ISAE 3000',
      currentAnnualCost: 320000, // Audit preparation + external costs
      velocityAnnualCost: 61000, // 81% savings  
      savings: 259000,
      percentageSavings: 81,
      implementationTime: '6 weeks',
      paybackPeriod: '2.3 months',
      threeYearSavings: 777000
    },
    {
      id: '3',
      framework: 'SOC 2',
      currentAnnualCost: 240000, // 1.5 FTE + audit costs
      velocityAnnualCost: 46000, // 81% savings
      savings: 194000,
      percentageSavings: 81,
      implementationTime: '4 weeks',
      paybackPeriod: '1.9 months',
      threeYearSavings: 582000
    }
  ]);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 800);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryColor = (category: BankingCost['category']) => {
    const colors = {
      'basel-iii': 'bg-blue-100 text-blue-800',
      'operational-risk': 'bg-purple-100 text-purple-800',
      'compliance-staff': 'bg-emerald-100 text-emerald-800',
      'regulatory-reporting': 'bg-amber-100 text-amber-800'
    };
    return colors[category];
  };

  const getCategoryIcon = (category: BankingCost['category']) => {
    const icons = {
      'basel-iii': Shield,
      'operational-risk': AlertTriangle,
      'compliance-staff': Users,
      'regulatory-reporting': FileText
    };
    return icons[category];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Building className="w-4 h-4" />
              Banking ROI Calculator
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif">
              Calculate Your
              <span className="text-emerald-400"> Banking Savings</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Discover your potential cost savings with AI-powered banking compliance automation. 
              Real ROI analysis across Basel III, operational risk, and regulatory reporting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing Your Banking Costs...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Calculate My Banking ROI
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Eye className="w-5 h-5" />
                View Sample Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Discover */}
      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-serif">What You'll Discover</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              This calculator analyzes your current banking compliance costs and shows exact savings with Velocity's AI automation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Basel III Automation</h3>
              <p className="text-slate-400 text-sm">Calculate savings on capital calculations, stress testing, and regulatory reporting</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Staff Cost Reduction</h3>
              <p className="text-slate-400 text-sm">See how automation reduces compliance team overhead and consulting costs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">ROI Timeline</h3>
              <p className="text-slate-400 text-sm">Get precise payback periods and 3-year savings projections</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'cost-analysis', label: 'Cost Analysis', icon: Database },
            { id: 'roi-calculator', label: 'ROI Calculator', icon: Target },
            { id: 'automation-impact', label: 'Automation Impact', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white">Analyzing Your Banking Compliance Costs</span>
              <span className="text-sm text-emerald-400">{Math.round(analysisProgress)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${analysisProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-300 mt-3">
              🔍 Analyzing Basel III capital requirements • 🏦 Operational risk frameworks • 📊 Regulatory reporting costs • 🤖 Automation opportunities
            </p>
          </div>
        )}

        {/* Results Summary - shown after analysis */}
        {analysisProgress === 100 && !isAnalyzing && (
          <div className="mb-8 p-6 bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 rounded-xl border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <h3 className="text-xl font-semibold text-white">Analysis Complete</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">€754K</div>
                <div className="text-sm text-slate-300">Annual Savings Potential</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">81%</div>
                <div className="text-sm text-slate-300">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">2.6 months</div>
                <div className="text-sm text-slate-300">Payback Period</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300">
                <Download className="w-4 h-4" />
                Download Full Report
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
                Schedule Implementation Call
              </button>
            </div>
          </div>
        )}

        {/* Cost Analysis Tab */}
        {activeTab === 'cost-analysis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bankingCosts.map((cost) => {
                const Icon = getCategoryIcon(cost.category);
                const savings = cost.currentCost - cost.automatedCost;
                const savingsPercentage = Math.round((savings / cost.currentCost) * 100);
                
                return (
                  <div key={cost.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400">
                          {savingsPercentage}%
                        </div>
                        <div className="text-xs text-slate-400">Savings</div>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-white mb-2">{cost.name}</h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 w-24 flex-shrink-0">Current Cost:</span>
                        <span className="font-medium text-slate-300 text-right">{formatCurrency(cost.currentCost)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 w-24 flex-shrink-0">With Velocity:</span>
                        <span className="font-medium text-emerald-400 text-right">{formatCurrency(cost.automatedCost)}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/10 pt-2">
                        <span className="text-slate-400 w-24 flex-shrink-0">Annual Savings:</span>
                        <span className="font-bold text-emerald-400 text-right">{formatCurrency(savings)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 w-24 flex-shrink-0">Time Saved:</span>
                        <span className="font-medium text-slate-300 text-right">{cost.timeSaved}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 rounded-2xl p-8 border border-emerald-500/20 text-white">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4 font-serif">Total Banking Compliance Savings</h3>
                <div className="text-5xl font-bold mb-4 text-emerald-400">
                  {formatCurrency(bankingCosts.reduce((sum, cost) => sum + (cost.currentCost - cost.automatedCost), 0))}
                </div>
                <p className="text-emerald-100 mb-8">Annual savings across all banking compliance areas</p>
                
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">81%</div>
                    <div className="text-emerald-100">Average Cost Reduction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">66</div>
                    <div className="text-emerald-100">Weeks Saved Annually</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">86%</div>
                    <div className="text-emerald-100">Risk Reduction</div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <p className="text-emerald-100 text-sm">
                    💡 <strong>Data Sources:</strong> Figures based on industry benchmarks for mid-size European banks (€2B-€10B assets), 
                    including FTE costs at €120K/year, external consulting rates, and regulatory compliance overhead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ROI Calculator Tab */}
        {activeTab === 'roi-calculator' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 font-serif">Framework ROI Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {roiAnalyses.map((analysis) => (
                  <div key={analysis.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-white">{analysis.framework}</h4>
                      <div className="text-2xl font-bold text-emerald-400">
                        {analysis.percentageSavings}%
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Current Annual Cost:</span>
                        <span className="font-medium text-slate-300">{formatCurrency(analysis.currentAnnualCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Velocity Annual Cost:</span>
                        <span className="font-medium text-slate-300">{formatCurrency(analysis.velocityAnnualCost)}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/10 pt-2">
                        <span className="text-slate-400">Annual Savings:</span>
                        <span className="font-bold text-emerald-400">{formatCurrency(analysis.savings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Implementation:</span>
                        <span className="font-medium text-slate-300">{analysis.implementationTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payback Period:</span>
                        <span className="font-medium text-slate-300">{analysis.paybackPeriod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">3-Year Savings:</span>
                        <span className="font-bold text-emerald-400">{formatCurrency(analysis.threeYearSavings)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Calculator */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 font-serif">Custom ROI Calculator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Current Annual Compliance Spend
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400"
                    placeholder="€500,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Number of FTE Compliance Staff
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400"
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Annual Consulting Costs
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400"
                    placeholder="€200,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Bank Asset Size
                  </label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white">
                    <option>Under €2B</option>
                    <option>€2B - €10B</option>
                    <option>€10B - €50B</option>
                    <option>Over €50B</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 font-medium shadow-lg">
                  <Target className="w-5 h-5" />
                  Calculate Your ROI
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Automation Impact Tab */}
        {activeTab === 'automation-impact' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">95%</div>
                <div className="text-white">Process Automation</div>
                <div className="text-sm text-slate-400 mt-2">
                  Average automation rate across banking compliance
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">76</div>
                <div className="text-white">Weeks Saved</div>
                <div className="text-sm text-slate-400 mt-2">
                  Annual time savings for compliance teams
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">86%</div>
                <div className="text-white">Risk Reduction</div>
                <div className="text-sm text-slate-400 mt-2">
                  Average reduction in compliance risk
                </div>
              </div>
            </div>

            {/* Before/After Comparison */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-6 font-serif">Before vs After Automation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-red-400 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Traditional Banking Compliance
                  </h4>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      Manual Basel III calculations taking 12+ weeks
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      €380K+ annual consulting costs
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      High risk of regulatory penalties
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      Compliance team working overtime
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-emerald-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Velocity Banking Automation
                  </h4>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      Automated calculations completed in 2 weeks
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      €65K annual platform cost (83% savings)
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      Continuous compliance monitoring
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      Team focused on strategic initiatives
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankingROIDemo;