import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/contexts/CurrencyContext';
import { 
  Lightbulb, 
  TrendingUp,
  DollarSign,
  PieChart,
  Filter,
  Download,
  Eye,
  Calendar,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Activity,
  Users,
  Globe,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Award,
  Briefcase,
  Shield,
  LineChart
} from 'lucide-react';

export const BeaconWorking: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const { currency, formatAmount, isLoading } = useCurrency();
  
  const valueMetrics = [
    {
      id: 'trust-equity-score',
      name: 'Trust Equity™ Score',
      category: 'Trust Intelligence',
      currentValue: 847,
      previousValue: 692,
      improvement: 22.4,
      period: 'YoY',
      description: 'Composite score measuring accumulated trust from all compliance activities',
      components: [
        { name: 'Compliance Activities', value: 254, percentage: 30.0 },
        { name: 'Security Controls', value: 213, percentage: 25.1 },
        { name: 'Risk Mitigations', value: 195, percentage: 23.0 },
        { name: 'Certifications', value: 185, percentage: 21.9 }
      ]
    },
    {
      id: 'deal-acceleration',
      name: 'Deal Acceleration Value',
      category: 'Revenue Impact',
      currentValue: 3200000,
      previousValue: 2400000,
      improvement: 33.3,
      period: 'YoY',
      description: 'Revenue gained from 40% faster enterprise deal cycles through Trust Equity™',
      components: [
        { name: 'Faster Security Reviews', value: 1280000, percentage: 40.0 },
        { name: 'Instant Trust Verification', value: 960000, percentage: 30.0 },
        { name: 'Reduced Due Diligence', value: 640000, percentage: 20.0 },
        { name: 'Competitive Advantage', value: 320000, percentage: 10.0 }
      ]
    },
    {
      id: 'premium-pricing',
      name: 'Premium Pricing Value',
      category: 'Revenue Impact',
      currentValue: 1850000,
      previousValue: 1200000,
      improvement: 54.2,
      period: 'YoY',
      description: '25% pricing premium achieved through verified trust differentiation',
      components: [
        { name: 'Trust Differentiation', value: 650000, percentage: 35.1 },
        { name: 'Risk Reduction Guarantee', value: 520000, percentage: 28.1 },
        { name: 'Compliance Confidence', value: 420000, percentage: 22.7 },
        { name: 'Brand Trust Premium', value: 260000, percentage: 14.1 }
      ]
    },
    {
      id: 'compliance-efficiency',
      name: 'Compliance Efficiency',
      category: 'Operational',
      currentValue: 1850000,
      previousValue: 1200000,
      improvement: 54.2,
      period: 'YoY',
      description: 'Cost savings from automated compliance processes and reduced manual effort',
      components: [
        { name: 'Automated Reporting', value: 650000, percentage: 35.1 },
        { name: 'Reduced Audit Costs', value: 520000, percentage: 28.1 },
        { name: 'Faster Remediation', value: 420000, percentage: 22.7 },
        { name: 'Penalty Avoidance', value: 260000, percentage: 14.1 }
      ]
    },
    {
      id: 'incident-prevention',
      name: 'Incident Prevention',
      category: 'Security',
      currentValue: 3200000,
      previousValue: 2100000,
      improvement: 52.4,
      period: 'YoY',
      description: 'Avoided costs from prevented security incidents and breaches',
      components: [
        { name: 'Data Breach Prevention', value: 1280000, percentage: 40.0 },
        { name: 'System Downtime Avoidance', value: 960000, percentage: 30.0 },
        { name: 'Reputation Protection', value: 640000, percentage: 20.0 },
        { name: 'Legal Cost Avoidance', value: 320000, percentage: 10.0 }
      ]
    },
    {
      id: 'operational-efficiency',
      name: 'Operational Efficiency',
      category: 'Operations',
      currentValue: 1650000,
      previousValue: 980000,
      improvement: 68.4,
      period: 'YoY',
      description: 'Productivity gains from streamlined risk management processes',
      components: [
        { name: 'Time Savings', value: 660000, percentage: 40.0 },
        { name: 'Resource Optimization', value: 495000, percentage: 30.0 },
        { name: 'Decision Speed', value: 330000, percentage: 20.0 },
        { name: 'Workflow Automation', value: 165000, percentage: 10.0 }
      ]
    }
  ];

  const businessImpact = {
    totalValue: valueMetrics.reduce((sum, m) => sum + m.currentValue, 0),
    totalImprovement: valueMetrics.reduce((sum, m) => sum + (m.currentValue - m.previousValue), 0),
    averageROI: 340,
    paybackPeriod: 8, // months
    lastCalculated: '2025-07-20'
  };

  const stakeholderReports = [
    {
      id: 'executive-dashboard',
      title: 'Executive Risk Dashboard',
      audience: 'C-Suite',
      frequency: 'Monthly',
      lastGenerated: '2025-07-01',
      nextDue: '2025-08-01',
      status: 'current',
      metrics: ['Risk Appetite', 'Compliance Status', 'Key Incidents', 'Budget Performance'],
      format: 'Executive Summary'
    },
    {
      id: 'board-report',
      title: 'Board Risk Report',
      audience: 'Board of Directors',
      frequency: 'Quarterly',
      lastGenerated: '2025-07-15',
      nextDue: '2025-10-15',
      status: 'current',
      metrics: ['Strategic Risks', 'Regulatory Changes', 'Major Incidents', 'Risk Investment ROI'],
      format: 'Comprehensive Report'
    },
    {
      id: 'operational-metrics',
      title: 'Operational Risk Metrics',
      audience: 'Department Heads',
      frequency: 'Weekly',
      lastGenerated: '2025-07-20',
      nextDue: '2025-07-27',
      status: 'current',
      metrics: ['Process KPIs', 'Control Effectiveness', 'Issue Resolution', 'Training Completion'],
      format: 'Operational Dashboard'
    },
    {
      id: 'regulatory-filing',
      title: 'Regulatory Compliance Filing',
      audience: 'Regulators',
      frequency: 'Quarterly',
      lastGenerated: '2025-06-30',
      nextDue: '2025-09-30',
      status: 'upcoming',
      metrics: ['Compliance Rates', 'Violation Reports', 'Remediation Status', 'Control Testing'],
      format: 'Regulatory Filing'
    }
  ];

  const benchmarking = [
    {
      category: 'Risk Maturity',
      ourScore: 4.2,
      industryAverage: 3.6,
      bestInClass: 4.8,
      trend: 'improving'
    },
    {
      category: 'Compliance Efficiency',
      ourScore: 87,
      industryAverage: 74,
      bestInClass: 92,
      trend: 'improving'
    },
    {
      category: 'Incident Response Time',
      ourScore: 4.2, // hours
      industryAverage: 8.5,
      bestInClass: 2.1,
      trend: 'improving'
    },
    {
      category: 'Risk Investment ROI',
      ourScore: 340,
      industryAverage: 280,
      bestInClass: 420,
      trend: 'stable'
    }
  ];

  // Use the location-aware currency formatter
  const formatCurrency = (amount: number) => {
    if (isLoading) return '...';
    return formatAmount(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Risk Management':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'Operational':
        return <Activity className="h-4 w-4 text-blue-600" />;
      case 'Security':
        return <Shield className="h-4 w-4 text-purple-600" />;
      case 'Operations':
        return <Target className="h-4 w-4 text-green-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'upcoming':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'overdue':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getBenchmarkColor = (our: number, average: number, isLower: boolean = false) => {
    const better = isLower ? our < average : our > average;
    return better ? 'text-emerald-700' : 'text-amber-700';
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-red-600/20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-500/20 blur-xl" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Lightbulb className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">BEACON</h1>
              <p className="text-xl text-amber-100 mt-1">Trust Equity™ Intelligence</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-100">Value Tracking Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-200" />
                  <span className="text-amber-100">{formatCurrency(businessImpact.totalValue)} value delivered</span>
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
            <Button className="bg-white text-amber-900 hover:bg-white/90">
              <Award className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Business Impact Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Total Value</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{formatCurrency(businessImpact.totalValue)}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <ArrowUpRight className="h-4 w-4" />
              <span>+{formatCurrency(businessImpact.totalImprovement)} YoY</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">ROI</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{businessImpact.averageROI}%</div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <span>Above industry average</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Payback Period</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{businessImpact.paybackPeriod}mo</div>
            <div className="flex items-center gap-1 text-sm font-medium text-blue-700">
              <span>Ahead of plan</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Value Categories</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
              <PieChart className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{valueMetrics.length}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-purple-700">
              <span>All improving</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Value Metrics */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BarChart3 className="h-5 w-5 text-amber-600" />
                  Value Metrics
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Quantified business value from risk management initiatives
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Detailed View
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {valueMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedMetric(metric.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(metric.category)}
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{metric.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{metric.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                      <ArrowUpRight className="h-3 w-3" />
                      +{formatPercentage(metric.improvement)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Current Value</div>
                      <div className="text-2xl font-bold text-emerald-700">{formatCurrency(metric.currentValue)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Previous {metric.period}</div>
                      <div className="text-xl font-bold text-slate-600">{formatCurrency(metric.previousValue)}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-slate-600 font-medium">Value Breakdown:</div>
                    {metric.components.map((component, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{component.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-amber-600 h-1.5 rounded-full"
                              style={{ width: `${component.percentage}%` }}
                            />
                          </div>
                          <span className="font-medium text-slate-900 w-16 text-right">
                            {formatCurrency(component.value)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stakeholder Reports */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Stakeholder Reports
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Automated reporting for different stakeholder groups
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
              {stakeholderReports.map((report) => (
                <div
                  key={report.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{report.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span>Audience: {report.audience}</span>
                        <span>Format: {report.format}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-slate-600 mb-1">Frequency</div>
                      <div className="font-medium text-slate-900">{report.frequency}</div>
                    </div>
                    <div>
                      <div className="text-slate-600 mb-1">Next Due</div>
                      <div className="font-medium text-blue-700">{new Date(report.nextDue).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-600 mb-2">Key Metrics:</div>
                    <div className="flex gap-1 flex-wrap">
                      {report.metrics.map((metric, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Industry Benchmarking */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Award className="h-5 w-5 text-purple-600" />
                Industry Benchmarking
              </CardTitle>
              <CardDescription className="text-slate-600">
                Performance comparison against industry standards
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              Above Industry Average
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {benchmarking.map((benchmark, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">{benchmark.category}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    benchmark.trend === 'improving' ? 'bg-emerald-50 text-emerald-700' :
                    benchmark.trend === 'declining' ? 'bg-red-50 text-red-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {benchmark.trend}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Our Performance</span>
                    <span className="text-lg font-bold text-slate-900">
                      {benchmark.category === 'Incident Response Time' || benchmark.category === 'Risk Maturity' 
                        ? `${benchmark.ourScore}${benchmark.category === 'Risk Maturity' ? '/5' : 'h'}` 
                        : benchmark.category === 'Risk Investment ROI'
                        ? `${benchmark.ourScore}%`
                        : `${benchmark.ourScore}%`}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Industry Average</span>
                    <span className={`font-medium ${getBenchmarkColor(
                      benchmark.ourScore, 
                      benchmark.industryAverage, 
                      benchmark.category === 'Incident Response Time'
                    )}`}>
                      {benchmark.category === 'Incident Response Time' || benchmark.category === 'Risk Maturity' 
                        ? `${benchmark.industryAverage}${benchmark.category === 'Risk Maturity' ? '/5' : 'h'}` 
                        : benchmark.category === 'Risk Investment ROI'
                        ? `${benchmark.industryAverage}%`
                        : `${benchmark.industryAverage}%`}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Best in Class</span>
                    <span className="font-medium text-purple-700">
                      {benchmark.category === 'Incident Response Time' || benchmark.category === 'Risk Maturity' 
                        ? `${benchmark.bestInClass}${benchmark.category === 'Risk Maturity' ? '/5' : 'h'}` 
                        : benchmark.category === 'Risk Investment ROI'
                        ? `${benchmark.bestInClass}%`
                        : `${benchmark.bestInClass}%`}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 rounded-full h-2 relative">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                        style={{ 
                          width: `${(benchmark.ourScore / (benchmark.bestInClass * 1.1)) * 100}%` 
                        }}
                      />
                      <div
                        className="absolute top-0 w-px h-2 bg-amber-500"
                        style={{ 
                          left: `${(benchmark.industryAverage / (benchmark.bestInClass * 1.1)) * 100}%` 
                        }}
                        title="Industry Average"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Zap className="h-5 w-5 text-amber-600" />
            Value Operations
          </CardTitle>
          <CardDescription className="text-slate-600">
            Business value tracking and stakeholder communication tools
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-amber-50/50 border-amber-200"
            >
              <Award className="h-8 w-8 text-amber-600" />
              <span className="font-medium">Value Calculator</span>
              <span className="text-xs text-slate-500">ROI modeling</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-blue-50/50 border-blue-200"
            >
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="font-medium">Executive Report</span>
              <span className="text-xs text-slate-500">Stakeholder summary</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-purple-50/50 border-purple-200"
            >
              <PieChart className="h-8 w-8 text-purple-600" />
              <span className="font-medium">Value Dashboard</span>
              <span className="text-xs text-slate-500">Real-time metrics</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-emerald-50/50 border-emerald-200"
            >
              <LineChart className="h-8 w-8 text-emerald-600" />
              <span className="font-medium">Benchmarking</span>
              <span className="text-xs text-slate-500">Industry comparison</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};