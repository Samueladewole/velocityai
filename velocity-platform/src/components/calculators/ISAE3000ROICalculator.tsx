import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Users,
  Building,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Download,
  RefreshCw,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';

interface CompanyProfile {
  name: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  industry: 'commercial-banking' | 'investment-banking' | 'credit-union' | 'fintech' | 'insurance';
  assets: number;
  employees: number;
  branches: number;
  systemComplexity: 'low' | 'medium' | 'high' | 'very-high';
}

interface CostBreakdown {
  category: string;
  traditionalCost: number;
  velocityCost: number;
  savings: number;
  savingsPercentage: number;
  description: string;
}

interface ROIResults {
  totalTraditionalCost: number;
  totalVelocityCost: number;
  totalSavings: number;
  savingsPercentage: number;
  paybackPeriod: number;
  roi: number;
  timeline: {
    traditional: number;
    velocity: number;
    timeSaved: number;
  };
  costBreakdown: CostBreakdown[];
  riskReduction: number;
  efficiencyGain: number;
}

interface ISAE3000ROICalculatorProps {
  className?: string;
}

const ISAE3000ROICalculator: React.FC<ISAE3000ROICalculatorProps> = ({ className = '' }) => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: '',
    size: 'medium',
    industry: 'commercial-banking',
    assets: 1000000000, // €1B
    employees: 500,
    branches: 25,
    systemComplexity: 'medium'
  });

  const [roiResults, setROIResults] = useState<ROIResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'results' | 'comparison'>('input');

  const industryMultipliers = {
    'commercial-banking': 1.0,
    'investment-banking': 1.5,
    'credit-union': 0.7,
    'fintech': 0.9,
    'insurance': 1.2
  };

  const sizeMultipliers = {
    'small': 0.6,
    'medium': 1.0,
    'large': 1.8,
    'enterprise': 2.5
  };

  const complexityMultipliers = {
    'low': 0.7,
    'medium': 1.0,
    'high': 1.4,
    'very-high': 2.0
  };

  const calculateROI = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const industryMultiplier = industryMultipliers[companyProfile.industry];
      const sizeMultiplier = sizeMultipliers[companyProfile.size];
      const complexityMultiplier = complexityMultipliers[companyProfile.systemComplexity];
      
      const baseMultiplier = industryMultiplier * sizeMultiplier * complexityMultiplier;
      
      // Traditional consulting costs (based on Big 4 rates)
      const externalAuditFees = 180000 * baseMultiplier;
      const internalResources = 120000 * baseMultiplier;
      const systemIntegration = 45000 * baseMultiplier;
      const documentation = 35000 * baseMultiplier;
      const projectManagement = 25000 * baseMultiplier;
      const riskManagement = 30000 * baseMultiplier;
      const complianceConsulting = 40000 * baseMultiplier;
      
      // Velocity costs
      const velocityPlatform = 15000 * baseMultiplier;
      const velocitySetup = 8000 * baseMultiplier;
      const velocityTraining = 3000 * baseMultiplier;
      const velocityMaintenance = 12000 * baseMultiplier; // Annual
      const velocitySupport = 7000 * baseMultiplier;
      
      const costBreakdown: CostBreakdown[] = [
        {
          category: 'External Audit Fees',
          traditionalCost: externalAuditFees,
          velocityCost: velocityPlatform,
          savings: externalAuditFees - velocityPlatform,
          savingsPercentage: ((externalAuditFees - velocityPlatform) / externalAuditFees) * 100,
          description: 'Big 4 consulting vs Velocity platform licensing'
        },
        {
          category: 'Internal Resources',
          traditionalCost: internalResources,
          velocityCost: velocitySetup,
          savings: internalResources - velocitySetup,
          savingsPercentage: ((internalResources - velocitySetup) / internalResources) * 100,
          description: 'Internal staff time vs automated setup'
        },
        {
          category: 'System Integration',
          traditionalCost: systemIntegration,
          velocityCost: velocityTraining,
          savings: systemIntegration - velocityTraining,
          savingsPercentage: ((systemIntegration - velocityTraining) / systemIntegration) * 100,
          description: 'Manual integration vs AI-powered connections'
        },
        {
          category: 'Documentation & Reporting',
          traditionalCost: documentation,
          velocityCost: 0, // Included in platform
          savings: documentation,
          savingsPercentage: 100,
          description: 'Manual documentation vs automated generation'
        },
        {
          category: 'Project Management',
          traditionalCost: projectManagement,
          velocityCost: velocitySupport,
          savings: projectManagement - velocitySupport,
          savingsPercentage: ((projectManagement - velocitySupport) / projectManagement) * 100,
          description: 'Traditional PM vs automated workflows'
        },
        {
          category: 'Risk & Compliance',
          traditionalCost: riskManagement + complianceConsulting,
          velocityCost: velocityMaintenance,
          savings: (riskManagement + complianceConsulting) - velocityMaintenance,
          savingsPercentage: (((riskManagement + complianceConsulting) - velocityMaintenance) / (riskManagement + complianceConsulting)) * 100,
          description: 'Manual compliance vs AI-powered monitoring'
        }
      ];
      
      const totalTraditionalCost = costBreakdown.reduce((sum, item) => sum + item.traditionalCost, 0);
      const totalVelocityCost = costBreakdown.reduce((sum, item) => sum + item.velocityCost, 0);
      const totalSavings = totalTraditionalCost - totalVelocityCost;
      const savingsPercentage = (totalSavings / totalTraditionalCost) * 100;
      
      // Timeline calculations (in weeks)
      const traditionalTimeline = 22 * baseMultiplier;
      const velocityTimeline = 6;
      const timeSaved = traditionalTimeline - velocityTimeline;
      
      // ROI calculations
      const paybackPeriod = totalVelocityCost / (totalSavings / 12); // months
      const roi = ((totalSavings - totalVelocityCost) / totalVelocityCost) * 100;
      
      // Additional benefits
      const riskReduction = 75; // % reduction in audit risk
      const efficiencyGain = 88; // % efficiency improvement
      
      setROIResults({
        totalTraditionalCost,
        totalVelocityCost,
        totalSavings,
        savingsPercentage,
        paybackPeriod,
        roi,
        timeline: {
          traditional: traditionalTimeline,
          velocity: velocityTimeline,
          timeSaved
        },
        costBreakdown,
        riskReduction,
        efficiencyGain
      });
      
      setActiveTab('results');
      setIsCalculating(false);
    }, 2000);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-lg €{className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">ISAE 3000 ROI Calculator</h1>
              <p className="text-slate-600 mt-1">Calculate your savings with Velocity's banking automation</p>
            </div>
          </div>
          {roiResults && (
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mt-6 bg-slate-100 rounded-lg p-1">
          {[
            { id: 'input', label: 'Company Profile', icon: Building },
            { id: 'results', label: 'ROI Results', icon: TrendingUp },
            { id: 'comparison', label: 'Cost Comparison', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors €{
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'input' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Company Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Company Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={companyProfile.name}
                    onChange={(e) => setCompanyProfile({...companyProfile, name: e.target.value})}
                    placeholder="Your Bank Name"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Size
                  </label>
                  <select
                    value={companyProfile.size}
                    onChange={(e) => setCompanyProfile({...companyProfile, size: e.target.value as any})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="small">Small Bank (< €1B assets)</option>
                    <option value="medium">Medium Bank (€1B - €10B assets)</option>
                    <option value="large">Large Bank (€10B - €50B assets)</option>
                    <option value="enterprise">Enterprise Bank (> €50B assets)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Industry Type
                  </label>
                  <select
                    value={companyProfile.industry}
                    onChange={(e) => setCompanyProfile({...companyProfile, industry: e.target.value as any})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="commercial-banking">Commercial Banking</option>
                    <option value="investment-banking">Investment Banking</option>
                    <option value="credit-union">Credit Union</option>
                    <option value="fintech">FinTech</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>
              </div>

              {/* Operational Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Operational Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Total Assets (USD)
                  </label>
                  <input
                    type="number"
                    value={companyProfile.assets}
                    onChange={(e) => setCompanyProfile({...companyProfile, assets: parseInt(e.target.value) || 0})}
                    placeholder="1000000000"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Current value: {formatCurrency(companyProfile.assets)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Employees
                  </label>
                  <input
                    type="number"
                    value={companyProfile.employees}
                    onChange={(e) => setCompanyProfile({...companyProfile, employees: parseInt(e.target.value) || 0})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    System Complexity
                  </label>
                  <select
                    value={companyProfile.systemComplexity}
                    onChange={(e) => setCompanyProfile({...companyProfile, systemComplexity: e.target.value as any})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low - Basic core banking system</option>
                    <option value="medium">Medium - Multiple integrated systems</option>
                    <option value="high">High - Complex multi-vendor environment</option>
                    <option value="very-high">Very High - Legacy + modern hybrid systems</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="text-center pt-6 border-t border-slate-200">
              <button
                onClick={calculateROI}
                disabled={isCalculating}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Calculating ROI...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    Calculate ROI & Savings
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'results' && roiResults && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-emerald-700">
                    {formatCurrency(roiResults.totalSavings)}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-emerald-800">Total Savings</h3>
                <p className="text-xs text-emerald-600 mt-1">
                  {roiResults.savingsPercentage.toFixed(1)}% cost reduction
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-blue-700">
                    {roiResults.roi.toFixed(0)}%
                  </span>
                </div>
                <h3 className="text-sm font-medium text-blue-800">Return on Investment</h3>
                <p className="text-xs text-blue-600 mt-1">
                  First year ROI
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-purple-700">
                    {roiResults.timeline.timeSaved.toFixed(0)} weeks
                  </span>
                </div>
                <h3 className="text-sm font-medium text-purple-800">Time Saved</h3>
                <p className="text-xs text-purple-600 mt-1">
                  6 weeks vs {roiResults.timeline.traditional.toFixed(0)} weeks traditional
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-amber-700">
                    {roiResults.riskReduction}%
                  </span>
                </div>
                <h3 className="text-sm font-medium text-amber-800">Risk Reduction</h3>
                <p className="text-xs text-amber-600 mt-1">
                  Lower audit failure risk
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Executive Summary</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Financial Impact</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Save {formatCurrency(roiResults.totalSavings)} in first year
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {roiResults.savingsPercentage.toFixed(1)}% cost reduction vs Big 4 consulting
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Payback period: {roiResults.paybackPeriod.toFixed(1)} months
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Operational Benefits</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      {roiResults.efficiencyGain}% efficiency improvement
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      {roiResults.timeline.timeSaved.toFixed(0)} weeks faster implementation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      100% evidence coverage vs 80-90% manual
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && roiResults && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Detailed Cost Breakdown</h3>
              <p className="text-slate-600">Traditional consulting vs Velocity automation</p>
            </div>

            <div className="space-y-4">
              {roiResults.costBreakdown.map((item, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-900">{item.category}</h4>
                    <span className="text-sm font-bold text-emerald-600">
                      {item.savingsPercentage.toFixed(0)}% savings
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4">{item.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-1">Traditional Cost</p>
                      <p className="text-lg font-bold text-red-600">{formatCurrency(item.traditionalCost)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-1">Velocity Cost</p>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(item.velocityCost)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-1">Your Savings</p>
                      <p className="text-lg font-bold text-emerald-600">{formatCurrency(item.savings)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000"
                      style={{ width: `€{item.savingsPercentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Traditional Total</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(roiResults.totalTraditionalCost)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Velocity Total</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(roiResults.totalVelocityCost)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Total Savings</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(roiResults.totalSavings)}</p>
                  <p className="text-sm text-emerald-600 font-medium">
                    {roiResults.savingsPercentage.toFixed(1)}% reduction
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ISAE3000ROICalculator;