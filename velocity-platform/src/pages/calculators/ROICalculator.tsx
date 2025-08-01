import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Target,
  Award,
  Building,
  Zap,
  Activity
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

const ROICalculator: React.FC = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    companySize: 'medium',
    industry: 'saas',
    frameworks: 2,
    currentSpend: 150000,
    implementationTime: 6,
    staffHours: 2000,
    consultingCosts: 100000,
    riskCosts: 50000
  });

  const [results, setResults] = useState({
    velocityCost: 0,
    traditionalCost: 0,
    totalSavings: 0,
    percentageSavings: 0,
    timeSavings: 0,
    roiPayback: 0,
    threYearSavings: 0
  });

  const companySizes = {
    'startup': { label: 'Startup (1-50 employees)', multiplier: 0.5, basePrice: 1499 },
    'medium': { label: 'Medium (51-500 employees)', multiplier: 1.0, basePrice: 2999 },
    'enterprise': { label: 'Enterprise (500+ employees)', multiplier: 2.0, basePrice: 4999 }
  };

  const industries = {
    'saas': { label: 'SaaS', multiplier: 1.0, risk: 1.2 },
    'fintech': { label: 'Financial Services', multiplier: 1.5, risk: 2.0 },
    'healthcare': { label: 'Healthcare', multiplier: 1.3, risk: 1.8 },
    'manufacturing': { label: 'Manufacturing', multiplier: 1.2, risk: 1.4 },
    'government': { label: 'Government', multiplier: 1.4, risk: 1.6 },
    'energy': { label: 'Energy', multiplier: 1.3, risk: 1.7 }
  };

  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const calculateROI = () => {
    const companyData = companySizes[inputs.companySize as keyof typeof companySizes];
    const industryData = industries[inputs.industry as keyof typeof industries];
    
    // Velocity Platform Cost
    const velocityAnnualCost = companyData.basePrice * 12;
    const velocityImplementationCost = velocityAnnualCost * 0.5; // 50% of annual for implementation
    const velocityTotalFirstYear = velocityAnnualCost + velocityImplementationCost;
    
    // Traditional Cost Calculation
    const adjustedCurrentSpend = inputs.currentSpend * industryData.multiplier;
    const adjustedConsultingCosts = inputs.consultingCosts * industryData.multiplier;
    const adjustedRiskCosts = inputs.riskCosts * industryData.risk;
    const staffCostPerHour = 150; // Average compliance professional hourly rate
    const staffCosts = inputs.staffHours * staffCostPerHour;
    
    const traditionalTotalCost = adjustedCurrentSpend + adjustedConsultingCosts + adjustedRiskCosts + staffCosts;
    
    // Calculations
    const totalSavings = traditionalTotalCost - velocityTotalFirstYear;
    const percentageSavings = Math.round((totalSavings / traditionalTotalCost) * 100);
    const timeSavings = Math.max(0, inputs.implementationTime - 6); // Velocity takes 6 weeks
    const roiPayback = velocityTotalFirstYear / (totalSavings / 12); // Months to payback
    const threeYearSavings = (totalSavings * 3) - (velocityAnnualCost * 2); // 3 years minus additional Velocity costs
    
    setResults({
      velocityCost: velocityTotalFirstYear,
      traditionalCost: traditionalTotalCost,
      totalSavings: Math.max(0, totalSavings),
      percentageSavings: Math.max(0, percentageSavings),
      timeSavings: timeSavings,
      roiPayback: Math.max(0, Math.round(roiPayback)),
      threYearSavings: Math.max(0, threeYearSavings)
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-blue-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-emerald-500 rounded-full mr-4">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <span className="text-emerald-400 font-semibold text-lg">ROI Calculator</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Calculate Your
              <span className="block text-emerald-400">Compliance Savings</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              See how much you can save with Velocity's AI-powered compliance automation 
              compared to traditional solutions and manual processes.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">83%</div>
                <div className="text-sm text-slate-300">Average Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">6 Weeks</div>
                <div className="text-sm text-slate-300">Implementation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
                <div className="text-sm text-slate-300">Automation Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">6 Months</div>
                <div className="text-sm text-slate-300">Avg ROI Payback</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Input Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Your Current Situation</h2>
            
            <div className="space-y-6">
              {/* Company Size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Company Size</label>
                <select
                  value={inputs.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {Object.entries(companySizes).map(([key, data]) => (
                    <option key={key} value={key}>{data.label}</option>
                  ))}
                </select>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Industry</label>
                <select
                  value={inputs.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {Object.entries(industries).map(([key, data]) => (
                    <option key={key} value={key}>{data.label}</option>
                  ))}
                </select>
              </div>

              {/* Number of Frameworks */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Number of Compliance Frameworks: {inputs.frameworks}
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={inputs.frameworks}
                  onChange={(e) => handleInputChange('frameworks', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1 Framework</span>
                  <span>8+ Frameworks</span>
                </div>
              </div>

              {/* Current Annual Spend */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Current Annual Compliance Spend
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={inputs.currentSpend}
                    onChange={(e) => handleInputChange('currentSpend', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Implementation Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Current Implementation Timeline (months): {inputs.implementationTime}
                </label>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={inputs.implementationTime}
                  onChange={(e) => handleInputChange('implementationTime', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1 month</span>
                  <span>24+ months</span>
                </div>
              </div>

              {/* Staff Hours */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Annual Staff Hours on Compliance
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={inputs.staffHours}
                    onChange={(e) => handleInputChange('staffHours', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Consulting Costs */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Annual Consulting/Audit Costs
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={inputs.consultingCosts}
                    onChange={(e) => handleInputChange('consultingCosts', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Risk Costs */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Estimated Annual Risk/Penalty Exposure
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={inputs.riskCosts}
                    onChange={(e) => handleInputChange('riskCosts', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Key Results Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Your Velocity ROI</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold">{formatCurrency(results.totalSavings)}</div>
                  <div className="text-emerald-100">Annual Savings</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{results.percentageSavings}%</div>
                  <div className="text-emerald-100">Cost Reduction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{results.roiPayback}</div>
                  <div className="text-emerald-100">Months to ROI</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{formatCurrency(results.threYearSavings)}</div>
                  <div className="text-emerald-100">3-Year Savings</div>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Cost Comparison</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-900">Traditional Approach</div>
                    <div className="text-sm text-slate-600">Current annual total cost</div>
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    {formatCurrency(results.traditionalCost)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-900">Velocity Platform</div>
                    <div className="text-sm text-slate-600">First year total cost</div>
                  </div>
                  <div className="text-xl font-bold text-emerald-600">
                    {formatCurrency(results.velocityCost)}
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Additional Benefits</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-700">95% automation vs 15% traditional</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-700">{results.timeSavings} months faster implementation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-700">96.8% first-time audit pass rate</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-700">24/7 continuous monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-700">Cryptographic evidence verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-700">12 specialized AI agents</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-4">Ready to Start Saving?</h3>
              <p className="text-slate-300 mb-6">
                Get a personalized assessment and see these savings in action
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/velocity/assessment')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Target className="w-5 h-5" />
                  Start Free Assessment
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => navigate('/velocity/demo')}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-slate-400 text-slate-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
                >
                  <Activity className="w-5 h-5" />
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Industry-Specific Calculators */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Industry-Specific ROI Calculators
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Get more precise calculations tailored to your industry's specific compliance requirements
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                 onClick={() => navigate('/calculators/banking-roi')}>
              <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Banking ROI Calculator</h3>
              <p className="text-slate-600 mb-4">
                Specialized for financial institutions with Banking ROI and ISAE 3000 calculations
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <span>Calculate Banking Savings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                 onClick={() => navigate('/calculators/gdpr-roi')}>
              <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Banking ROI Calculator</h3>
              <p className="text-slate-600 mb-4">
                Calculate savings specifically for Banking compliance and regulatory automation
              </p>
              <div className="flex items-center gap-2 text-emerald-600 font-medium">
                <span>Calculate Banking Savings</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Healthcare ROI Calculator</h3>
              <p className="text-slate-600 mb-4">
                HIPAA-specific calculations for healthcare organizations and patient data protection
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-medium">
                <span>Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;