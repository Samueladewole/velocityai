/**
 * Executive Dashboard Component
 * CISO-level view with business metrics and strategic insights
 * 
 * @description Shows ROI, risk reduction, and compliance at executive level
 * @impact Critical for C-suite buy-in and ongoing value demonstration
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  DollarSign, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Download,
  ChevronRight,
  Building,
  Briefcase,
  Award
} from 'lucide-react';

/**
 * Executive-level metrics
 */
interface ExecutiveMetrics {
  // Financial Impact
  totalSavings: number;
  savingsTrend: number;
  costAvoidance: number;
  roiPercentage: number;
  
  // Risk Metrics
  overallRiskScore: number;
  riskTrend: number;
  criticalRisksCount: number;
  risksResolvedThisMonth: number;
  
  // Compliance
  complianceScore: number;
  frameworksCompliant: number;
  auditReadiness: number;
  
  // Operational
  mttr: number; // Mean Time To Respond
  mttd: number; // Mean Time To Detect
  automationRate: number;
  falsePositiveRate: number;
  
  // Coverage
  assetsProtected: number;
  usersProtected: number;
  cloudAccountsMonitored: number;
  dataProcessed: number; // GB
}

/**
 * Strategic initiative tracking
 */
interface StrategicInitiative {
  id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  progress: number;
  targetDate: Date;
  businessImpact: string;
  investment: number;
  projectedSavings: number;
}

/**
 * Risk heat map data
 */
interface RiskCategory {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  mitigation: string;
}

export const ExecutiveDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock executive metrics
  const metrics: ExecutiveMetrics = {
    totalSavings: 2847000,
    savingsTrend: 12.5,
    costAvoidance: 5200000,
    roiPercentage: 347,
    
    overallRiskScore: 24,
    riskTrend: -18,
    criticalRisksCount: 2,
    risksResolvedThisMonth: 47,
    
    complianceScore: 94,
    frameworksCompliant: 4,
    auditReadiness: 97,
    
    mttr: 4.2,
    mttd: 0.8,
    automationRate: 78,
    falsePositiveRate: 3.2,
    
    assetsProtected: 12847,
    usersProtected: 3254,
    cloudAccountsMonitored: 15,
    dataProcessed: 847
  };

  const strategicInitiatives: StrategicInitiative[] = [
    {
      id: '1',
      name: 'Zero Trust Implementation',
      status: 'on-track',
      progress: 78,
      targetDate: new Date('2024-06-30'),
      businessImpact: 'Reduce breach risk by 90%',
      investment: 500000,
      projectedSavings: 2000000
    },
    {
      id: '2',
      name: 'Cloud Security Posture',
      status: 'on-track',
      progress: 65,
      targetDate: new Date('2024-09-30'),
      businessImpact: 'Secure multi-cloud infrastructure',
      investment: 350000,
      projectedSavings: 1500000
    },
    {
      id: '3',
      name: 'Compliance Automation',
      status: 'at-risk',
      progress: 45,
      targetDate: new Date('2024-05-15'),
      businessImpact: 'Reduce audit costs by 80%',
      investment: 200000,
      projectedSavings: 800000
    },
    {
      id: '4',
      name: 'Identity Modernization',
      status: 'on-track',
      progress: 52,
      targetDate: new Date('2024-12-31'),
      businessImpact: 'Enable secure remote work',
      investment: 400000,
      projectedSavings: 1200000
    }
  ];

  const riskHeatMap: RiskCategory[] = [
    { category: 'Data Exposure', severity: 'high', count: 12, trend: 'decreasing', mitigation: 'DLP implementation' },
    { category: 'Identity & Access', severity: 'medium', count: 24, trend: 'stable', mitigation: 'MFA enforcement' },
    { category: 'Cloud Misconfig', severity: 'high', count: 8, trend: 'decreasing', mitigation: 'CSPM deployment' },
    { category: 'Insider Threat', severity: 'medium', count: 5, trend: 'stable', mitigation: 'Behavior analytics' },
    { category: 'Supply Chain', severity: 'critical', count: 2, trend: 'increasing', mitigation: 'Vendor assessment' },
    { category: 'Ransomware', severity: 'high', count: 3, trend: 'decreasing', mitigation: 'EDR + backups' }
  ];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: value >= 1000000 ? 'compact' : 'standard'
    }).format(value);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-50';
      case 'at-risk': return 'text-yellow-600 bg-yellow-50';
      case 'delayed': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Executive Security Dashboard</h1>
              <p className="text-gray-600">Strategic overview of security posture and business impact</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select
                  className="border-0 focus:ring-0 text-sm"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                >
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Financial Impact Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Financial Impact
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Total Savings</span>
                  <Badge className="bg-green-100 text-green-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {metrics.savingsTrend}%
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-green-900">
                  {formatCurrency(metrics.totalSavings)}
                </div>
                <p className="text-xs text-green-700 mt-1">YTD realized savings</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Cost Avoidance</span>
                  <Shield className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-3xl font-bold">
                  {formatCurrency(metrics.costAvoidance)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Prevented breach costs</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">ROI</span>
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {metrics.roiPercentage}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Return on investment</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Efficiency Gain</span>
                  <Activity className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-3xl font-bold">
                  {metrics.automationRate}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Tasks automated</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Risk Overview Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Risk Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Overall Risk Score
                </span>
                <Badge className={metrics.riskTrend < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {metrics.riskTrend < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
                  {Math.abs(metrics.riskTrend)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-5xl font-bold">{metrics.overallRiskScore}</div>
                  <p className="text-sm text-gray-600">Out of 100 (lower is better)</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-red-600">{metrics.criticalRisksCount}</div>
                  <p className="text-sm text-gray-600">Critical risks</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Risks resolved this month</span>
                  <span className="font-semibold text-green-600">{metrics.risksResolvedThisMonth}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Mean time to detect</span>
                  <span className="font-semibold">{metrics.mttd} hours</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Mean time to respond</span>
                  <span className="font-semibold">{metrics.mttr} hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Heat Map */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Heat Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskHeatMap.map((risk) => (
                  <div key={risk.category} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${getSeverityColor(risk.severity)}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{risk.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{risk.count} issues</span>
                          {risk.trend === 'decreasing' && <TrendingDown className="w-3 h-3 text-green-500" />}
                          {risk.trend === 'increasing' && <TrendingUp className="w-3 h-3 text-red-500" />}
                          {risk.trend === 'stable' && <Activity className="w-3 h-3 text-gray-500" />}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{risk.mitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Initiatives */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Strategic Security Initiatives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strategicInitiatives.map((initiative) => (
                <div key={initiative.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{initiative.name}</h3>
                      <p className="text-sm text-gray-600">{initiative.businessImpact}</p>
                    </div>
                    <Badge className={getStatusColor(initiative.status)}>
                      {initiative.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{initiative.progress}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${initiative.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Investment</span>
                      <div className="font-medium">{formatCurrency(initiative.investment)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Projected Savings</span>
                      <div className="font-medium text-green-600">{formatCurrency(initiative.projectedSavings)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Target Date</span>
                      <div className="font-medium">{initiative.targetDate.toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance & Coverage */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-purple-600">{metrics.complianceScore}%</div>
                <p className="text-gray-600">Overall Compliance Score</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">SOC 2 Type II</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">ISO 27001</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">PCI DSS</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">GDPR</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Audit Readiness</span>
                  <span className="text-2xl font-bold text-blue-600">{metrics.auditReadiness}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coverage Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-500" />
                Security Coverage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>Users Protected</span>
                </div>
                <span className="text-2xl font-bold">{metrics.usersProtected.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Assets Monitored</span>
                </div>
                <span className="text-2xl font-bold">{metrics.assetsProtected.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                  <span>Cloud Accounts</span>
                </div>
                <span className="text-2xl font-bold">{metrics.cloudAccountsMonitored}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-orange-500" />
                  <span>Data Processed</span>
                </div>
                <span className="text-2xl font-bold">{metrics.dataProcessed} GB/day</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Recommended Actions</h3>
                <p className="text-gray-600">Based on current risk profile and industry trends</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                Schedule Strategy Review
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};