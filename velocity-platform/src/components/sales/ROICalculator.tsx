/**
 * ROI Calculator Component
 * Interactive calculator to demonstrate concrete business value to executives
 * 
 * @description Shows real cost savings, risk reduction, and efficiency gains
 * @impact Critical for enterprise sales - helps justify $100K+ purchases
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Calculator, 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Download,
  Send,
  BarChart3,
  Zap
} from 'lucide-react';

/**
 * Company profile for ROI calculation
 */
interface CompanyProfile {
  name: string;
  industry: string;
  employees: number;
  securityTeamSize: number;
  annualRevenue: number;
  cloudSpend: number;
  complianceRequirements: string[];
  currentTools: string[];
  securityIncidents: number; // per year
  averageIncidentCost: number;
}

/**
 * ROI calculation results
 */
interface ROIResults {
  // Cost Savings
  complianceAutomationSavings: number;
  incidentPreventionSavings: number;
  operationalEfficiencySavings: number;
  toolConsolidationSavings: number;
  totalAnnualSavings: number;
  
  // Time Savings
  complianceHoursSaved: number;
  incidentResponseHoursSaved: number;
  automationHoursSaved: number;
  totalHoursSaved: number;
  
  // Risk Reduction
  riskReductionPercentage: number;
  complianceImprovementPercentage: number;
  
  // Investment
  velocityAnnualCost: number;
  implementationCost: number;
  totalFirstYearCost: number;
  
  // ROI Metrics
  netSavingsYear1: number;
  netSavingsYear3: number;
  roiPercentage: number;
  paybackPeriodMonths: number;
}

export const ROICalculator: React.FC = () => {
  const [profile, setProfile] = useState<CompanyProfile>({
    name: '',
    industry: 'technology',
    employees: 500,
    securityTeamSize: 5,
    annualRevenue: 50000000, // $50M
    cloudSpend: 500000, // $500K
    complianceRequirements: ['SOC2', 'ISO27001'],
    currentTools: ['manual'],
    securityIncidents: 3,
    averageIncidentCost: 250000
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [calculationMethod, setCalculationMethod] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  /**
   * Industry-specific multipliers for accurate calculations
   */
  const industryMultipliers = {
    fintech: { compliance: 2.5, security: 3.0, efficiency: 1.5 },
    healthcare: { compliance: 3.0, security: 2.5, efficiency: 1.8 },
    technology: { compliance: 1.5, security: 2.0, efficiency: 2.0 },
    ecommerce: { compliance: 1.2, security: 2.5, efficiency: 1.8 },
    manufacturing: { compliance: 1.0, security: 1.5, efficiency: 1.2 },
    other: { compliance: 1.3, security: 1.8, efficiency: 1.5 }
  };

  /**
   * Calculate ROI based on company profile
   */
  const calculateROI = (): ROIResults => {
    const multipliers = industryMultipliers[profile.industry as keyof typeof industryMultipliers] || industryMultipliers.other;
    
    // Base calculations
    const avgSecuritySalary = 120000;
    const hoursPerYear = 2080;
    const hourlyRate = avgSecuritySalary / hoursPerYear;
    
    // Compliance Automation Savings
    const complianceHoursPerFramework = calculationMethod === 'conservative' ? 200 : 
                                       calculationMethod === 'moderate' ? 300 : 400;
    const complianceHoursSaved = profile.complianceRequirements.length * complianceHoursPerFramework;
    const complianceAutomationSavings = complianceHoursSaved * hourlyRate * multipliers.compliance;
    
    // Incident Prevention Savings
    const incidentReductionRate = calculationMethod === 'conservative' ? 0.5 : 
                                 calculationMethod === 'moderate' ? 0.7 : 0.85;
    const incidentPreventionSavings = profile.securityIncidents * profile.averageIncidentCost * incidentReductionRate;
    
    // Operational Efficiency Savings
    const efficiencyGainPercentage = calculationMethod === 'conservative' ? 0.25 : 
                                    calculationMethod === 'moderate' ? 0.40 : 0.55;
    const operationalEfficiencySavings = profile.securityTeamSize * avgSecuritySalary * efficiencyGainPercentage * multipliers.efficiency;
    
    // Tool Consolidation Savings
    const avgToolCost = 25000;
    const toolsReplaced = calculationMethod === 'conservative' ? 2 : 
                         calculationMethod === 'moderate' ? 3 : 4;
    const toolConsolidationSavings = toolsReplaced * avgToolCost;
    
    // Total Savings
    const totalAnnualSavings = complianceAutomationSavings + incidentPreventionSavings + 
                              operationalEfficiencySavings + toolConsolidationSavings;
    
    // Time Savings
    const incidentHoursPerEvent = 80;
    const incidentResponseHoursSaved = profile.securityIncidents * incidentHoursPerEvent * incidentReductionRate;
    const automationHoursSaved = profile.securityTeamSize * 500; // 500 hours/year per team member
    const totalHoursSaved = complianceHoursSaved + incidentResponseHoursSaved + automationHoursSaved;
    
    // Risk Metrics
    const riskReductionPercentage = calculationMethod === 'conservative' ? 60 : 
                                   calculationMethod === 'moderate' ? 75 : 85;
    const complianceImprovementPercentage = calculationMethod === 'conservative' ? 20 : 
                                          calculationMethod === 'moderate' ? 35 : 50;
    
    // Velocity Costs (tiered pricing based on company size)
    let velocityAnnualCost = 0;
    if (profile.employees <= 100) {
      velocityAnnualCost = 50000;
    } else if (profile.employees <= 500) {
      velocityAnnualCost = 100000;
    } else if (profile.employees <= 1000) {
      velocityAnnualCost = 150000;
    } else {
      velocityAnnualCost = 200000 + (profile.employees - 1000) * 50;
    }
    
    const implementationCost = velocityAnnualCost * 0.25; // 25% of annual for implementation
    const totalFirstYearCost = velocityAnnualCost + implementationCost;
    
    // ROI Calculations
    const netSavingsYear1 = totalAnnualSavings - totalFirstYearCost;
    const netSavingsYear3 = (totalAnnualSavings * 3) - (velocityAnnualCost * 3 + implementationCost);
    const roiPercentage = ((totalAnnualSavings - velocityAnnualCost) / velocityAnnualCost) * 100;
    const paybackPeriodMonths = totalFirstYearCost / (totalAnnualSavings / 12);

    return {
      complianceAutomationSavings,
      incidentPreventionSavings,
      operationalEfficiencySavings,
      toolConsolidationSavings,
      totalAnnualSavings,
      complianceHoursSaved,
      incidentResponseHoursSaved,
      automationHoursSaved,
      totalHoursSaved,
      riskReductionPercentage,
      complianceImprovementPercentage,
      velocityAnnualCost,
      implementationCost,
      totalFirstYearCost,
      netSavingsYear1,
      netSavingsYear3,
      roiPercentage,
      paybackPeriodMonths
    };
  };

  useEffect(() => {
    if (profile.employees > 0) {
      setResults(calculateROI());
    }
  }, [profile, calculationMethod]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  /**
   * Generate executive summary for download/email
   */
  const generateExecutiveSummary = () => {
    if (!results) return '';
    
    return `
VELOCITY ZERO TRUST PLATFORM - ROI ANALYSIS
${profile.name || 'Your Company'}

EXECUTIVE SUMMARY
-----------------
• Total Annual Savings: ${formatCurrency(results.totalAnnualSavings)}
• ROI: ${Math.round(results.roiPercentage)}%
• Payback Period: ${Math.round(results.paybackPeriodMonths)} months
• Risk Reduction: ${results.riskReductionPercentage}%

KEY BENEFITS
------------
1. Compliance Automation: Save ${formatNumber(results.complianceHoursSaved)} hours annually
2. Incident Prevention: Prevent ${formatCurrency(results.incidentPreventionSavings)} in breach costs
3. Team Efficiency: Free up ${results.totalHoursSaved} hours for strategic work
4. Tool Consolidation: Eliminate ${formatCurrency(results.toolConsolidationSavings)} in redundant tools

3-YEAR FINANCIAL IMPACT
----------------------
Net Savings: ${formatCurrency(results.netSavingsYear3)}
Total Value Created: ${formatCurrency(results.totalAnnualSavings * 3)}

RECOMMENDATION
--------------
Velocity's Zero Trust Platform delivers immediate ROI through automated compliance,
reduced security incidents, and operational efficiency. The platform pays for itself
in ${Math.round(results.paybackPeriodMonths)} months and generates ${Math.round(results.roiPercentage)}% ROI annually.
    `;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">ROI Calculator</h1>
        <p className="text-xl text-gray-600">
          See how much your organization can save with Velocity Zero Trust
        </p>
      </div>

      {/* Company Profile Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Company Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                placeholder="Enter company name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <select
                className="w-full p-2 border rounded-md"
                value={profile.industry}
                onChange={(e) => setProfile({...profile, industry: e.target.value})}
              >
                <option value="technology">Technology</option>
                <option value="fintech">Financial Services</option>
                <option value="healthcare">Healthcare</option>
                <option value="ecommerce">E-commerce</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Employees: {formatNumber(profile.employees)}
              </label>
              <Slider
                value={[profile.employees]}
                onValueChange={(value) => setProfile({...profile, employees: value[0]})}
                max={10000}
                min={50}
                step={50}
                className="mt-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Security Team Size: {profile.securityTeamSize}
              </label>
              <Slider
                value={[profile.securityTeamSize]}
                onValueChange={(value) => setProfile({...profile, securityTeamSize: value[0]})}
                max={50}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Annual Security Incidents: {profile.securityIncidents}
              </label>
              <Slider
                value={[profile.securityIncidents]}
                onValueChange={(value) => setProfile({...profile, securityIncidents: value[0]})}
                max={20}
                min={0}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Average Cost per Incident: {formatCurrency(profile.averageIncidentCost)}
              </label>
              <Slider
                value={[profile.averageIncidentCost]}
                onValueChange={(value) => setProfile({...profile, averageIncidentCost: value[0]})}
                max={1000000}
                min={10000}
                step={10000}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Compliance Requirements</label>
            <div className="flex flex-wrap gap-2">
              {['SOC2', 'ISO27001', 'PCI DSS', 'HIPAA', 'GDPR', 'FedRAMP'].map((req) => (
                <Button
                  key={req}
                  variant={profile.complianceRequirements.includes(req) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (profile.complianceRequirements.includes(req)) {
                      setProfile({
                        ...profile,
                        complianceRequirements: profile.complianceRequirements.filter(r => r !== req)
                      });
                    } else {
                      setProfile({
                        ...profile,
                        complianceRequirements: [...profile.complianceRequirements, req]
                      });
                    }
                  }}
                >
                  {req}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Calculation Method:</span>
              <div className="flex gap-2">
                {(['conservative', 'moderate', 'aggressive'] as const).map((method) => (
                  <Button
                    key={method}
                    variant={calculationMethod === method ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCalculationMethod(method)}
                  >
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && (
        <>
          {/* Executive Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(results.totalAnnualSavings)}
                  </div>
                  <div className="text-sm text-gray-600">Annual Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(results.roiPercentage)}%
                  </div>
                  <div className="text-sm text-gray-600">ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.round(results.paybackPeriodMonths)} mo
                  </div>
                  <div className="text-sm text-gray-600">Payback Period</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {results.riskReductionPercentage}%
                  </div>
                  <div className="text-sm text-gray-600">Risk Reduction</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Key Recommendation
                </h3>
                <p className="text-gray-700">
                  By implementing Velocity Zero Trust, {profile.name || 'your organization'} can save{' '}
                  <strong>{formatCurrency(results.totalAnnualSavings)}</strong> annually while reducing 
                  security risk by <strong>{results.riskReductionPercentage}%</strong>. 
                  The platform pays for itself in just <strong>{Math.round(results.paybackPeriodMonths)} months</strong>.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cost Savings Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Cost Savings Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Compliance Automation</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(results.complianceAutomationSavings)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Incident Prevention</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(results.incidentPreventionSavings)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Operational Efficiency</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(results.operationalEfficiencySavings)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tool Consolidation</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(results.toolConsolidationSavings)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Annual Savings</span>
                    <span className="text-green-600">
                      {formatCurrency(results.totalAnnualSavings)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Savings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Time Savings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Compliance Tasks</span>
                  <span className="font-semibold">{formatNumber(results.complianceHoursSaved)} hrs/year</span>
                </div>
                <div className="flex justify-between">
                  <span>Incident Response</span>
                  <span className="font-semibold">{formatNumber(results.incidentResponseHoursSaved)} hrs/year</span>
                </div>
                <div className="flex justify-between">
                  <span>Automation Benefits</span>
                  <span className="font-semibold">{formatNumber(results.automationHoursSaved)} hrs/year</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Time Saved</span>
                    <span>{formatNumber(results.totalHoursSaved)} hrs/year</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Equivalent to {Math.round(results.totalHoursSaved / 2080)} full-time employees
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Investment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  Investment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Velocity Annual License</span>
                  <span>{formatCurrency(results.velocityAnnualCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Implementation (One-time)</span>
                  <span>{formatCurrency(results.implementationCost)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total First Year Cost</span>
                    <span>{formatCurrency(results.totalFirstYearCost)}</span>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="flex justify-between font-bold text-green-700">
                    <span>Net Savings Year 1</span>
                    <span>{formatCurrency(results.netSavingsYear1)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-green-700 mt-2">
                    <span>Net Savings 3 Years</span>
                    <span>{formatCurrency(results.netSavingsYear3)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk & Compliance Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-500" />
                  Risk & Compliance Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Risk Reduction</span>
                    <span className="font-semibold">{results.riskReductionPercentage}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${results.riskReductionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Compliance Improvement</span>
                    <span className="font-semibold">{results.complianceImprovementPercentage}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${results.complianceImprovementPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Automated compliance reporting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Real-time threat prevention</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Zero Trust architecture</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Ready to Transform Your Security?</h3>
                  <p className="text-gray-600">
                    Get a personalized demo and detailed implementation plan
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Send className="w-4 h-4 mr-2" />
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};