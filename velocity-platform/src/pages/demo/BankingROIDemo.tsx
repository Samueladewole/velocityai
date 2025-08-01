import React, { useState, useEffect } from 'react';
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
      currentCost: 180000,
      automatedCost: 32000,
      timeSaved: '18 weeks annually',
      riskReduction: 85,
      lastCalculated: new Date('2025-01-15')
    },
    {
      id: '2',
      category: 'operational-risk',
      name: 'Operational Risk Management',
      currentCost: 150000,
      automatedCost: 28000,
      timeSaved: '14 weeks annually',
      riskReduction: 78,
      lastCalculated: new Date('2025-01-14')
    },
    {
      id: '3',
      category: 'compliance-staff',
      name: 'Compliance Staff Overhead',
      currentCost: 280000,
      automatedCost: 48000,
      timeSaved: '32 weeks annually',
      riskReduction: 92,
      lastCalculated: new Date('2025-01-13')
    },
    {
      id: '4',
      category: 'regulatory-reporting',
      name: 'Regulatory Reporting',
      currentCost: 120000,
      automatedCost: 22000,
      timeSaved: '12 weeks annually',
      riskReduction: 88,
      lastCalculated: new Date('2025-01-12')
    }
  ]);

  const [roiAnalyses] = useState<ROIAnalysis[]>([
    {
      id: '1',
      framework: 'Basel III',
      currentAnnualCost: 380000,
      velocityAnnualCost: 65000,
      savings: 315000,
      percentageSavings: 83,
      implementationTime: '8 weeks',
      paybackPeriod: '2.5 months',
      threeYearSavings: 945000
    },
    {
      id: '2',
      framework: 'ISAE 3000',
      currentAnnualCost: 280000,
      velocityAnnualCost: 48000,
      savings: 232000,
      percentageSavings: 83,
      implementationTime: '6 weeks',
      paybackPeriod: '2.1 months',
      threeYearSavings: 696000
    },
    {
      id: '3',
      framework: 'SOC 2',
      currentAnnualCost: 180000,
      velocityAnnualCost: 32000,
      savings: 148000,
      percentageSavings: 82,
      implementationTime: '4 weeks',
      paybackPeriod: '1.6 months',
      threeYearSavings: 444000
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Banking ROI Calculator</h1>
              </div>
              <p className="text-slate-600">
                Real-time cost analysis and ROI calculation for banking compliance automation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Analysis
                  </>
                )}
              </button>
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
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
          <div className="mb-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-900">Banking ROI Analysis in Progress</span>
              <span className="text-sm text-slate-500">{Math.round(analysisProgress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${analysisProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Analyzing Basel III requirements, operational risk costs, and automation opportunities...
            </p>
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
                  <div key={cost.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 rounded-lg ${getCategoryColor(cost.category)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">
                          {savingsPercentage}%
                        </div>
                        <div className="text-xs text-slate-500">Savings</div>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-slate-900 mb-2">{cost.name}</h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Current Cost:</span>
                        <span className="font-medium">{formatCurrency(cost.currentCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">With Velocity:</span>
                        <span className="font-medium text-emerald-600">{formatCurrency(cost.automatedCost)}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-2">
                        <span className="text-slate-600">Annual Savings:</span>
                        <span className="font-bold text-emerald-600">{formatCurrency(savings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Time Saved:</span>
                        <span className="font-medium">{cost.timeSaved}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Total Banking Compliance Savings</h3>
                <div className="text-5xl font-bold mb-4">
                  {formatCurrency(bankingCosts.reduce((sum, cost) => sum + (cost.currentCost - cost.automatedCost), 0))}
                </div>
                <p className="text-blue-100 mb-6">Annual savings across all banking compliance areas</p>
                
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-2xl font-bold">83%</div>
                    <div className="text-blue-100">Average Cost Reduction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">76</div>
                    <div className="text-blue-100">Weeks Saved Annually</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">86%</div>
                    <div className="text-blue-100">Risk Reduction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ROI Calculator Tab */}
        {activeTab === 'roi-calculator' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Framework ROI Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {roiAnalyses.map((analysis) => (
                  <div key={analysis.id} className="border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-slate-900">{analysis.framework}</h4>
                      <div className="text-2xl font-bold text-emerald-600">
                        {analysis.percentageSavings}%
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Current Annual Cost:</span>
                        <span className="font-medium">{formatCurrency(analysis.currentAnnualCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Velocity Annual Cost:</span>
                        <span className="font-medium">{formatCurrency(analysis.velocityAnnualCost)}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-2">
                        <span className="text-slate-600">Annual Savings:</span>
                        <span className="font-bold text-emerald-600">{formatCurrency(analysis.savings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Implementation:</span>
                        <span className="font-medium">{analysis.implementationTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Payback Period:</span>
                        <span className="font-medium">{analysis.paybackPeriod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">3-Year Savings:</span>
                        <span className="font-bold text-emerald-600">{formatCurrency(analysis.threeYearSavings)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Calculator */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Custom ROI Calculator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Annual Compliance Spend
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="€500,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of FTE Compliance Staff
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Annual Consulting Costs
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="€200,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bank Asset Size
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Under €2B</option>
                    <option>€2B - €10B</option>
                    <option>€10B - €50B</option>
                    <option>Over €50B</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Calculate Your ROI
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Automation Impact Tab */}
        {activeTab === 'automation-impact' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-slate-600">Process Automation</div>
                <div className="text-sm text-slate-500 mt-2">
                  Average automation rate across banking compliance
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">76</div>
                <div className="text-slate-600">Weeks Saved</div>
                <div className="text-sm text-slate-500 mt-2">
                  Annual time savings for compliance teams
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">86%</div>
                <div className="text-slate-600">Risk Reduction</div>
                <div className="text-sm text-slate-500 mt-2">
                  Average reduction in compliance risk
                </div>
              </div>
            </div>

            {/* Before/After Comparison */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Before vs After Automation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-red-600 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Traditional Banking Compliance
                  </h4>
                  <ul className="space-y-3 text-sm text-slate-600">
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
                  <h4 className="font-medium text-emerald-600 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Velocity Banking Automation
                  </h4>
                  <ul className="space-y-3 text-sm text-slate-600">
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