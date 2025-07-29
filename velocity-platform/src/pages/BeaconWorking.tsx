import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  LineChart,
  Play
} from 'lucide-react';

export const BeaconWorking: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'investment' | 'trust-equity' | 'optimization'>('investment');
  
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

  // Security Investment Intelligence (SII) Data
  const securityInvestments = {
    totalAnnualSpend: 2400000,
    monthlySpend: 200000,
    totalValueCreated: 6900000,
    netROI: 287,
    riskReduction: 1850000,
    spendToRiskRatio: 3.5 // €1 spent = €3.50 risk reduction
  };

  const investmentCategories = [
    {
      category: 'Security Tools',
      monthlySpend: 85000,
      annualSpend: 1020000,
      items: [
        { name: 'ERIP Platform', cost: 25000, roi: 340, value: 800000 },
        { name: 'CrowdStrike EDR', cost: 8000, roi: 250, value: 1200000 },
        { name: 'Qualys VMDR', cost: 4000, roi: 180, value: 180000 },
        { name: 'KnowBe4 Training', cost: 2000, roi: 290, value: 120000 }
      ],
      riskReduction: 850000,
      trend: 'optimized'
    },
    {
      category: 'Compliance Tools',
      monthlySpend: 32000,
      annualSpend: 384000,
      items: [
        { name: 'Vanta Automation', cost: 3000, roi: 220, value: 180000 },
        { name: 'OneTrust Privacy', cost: 5000, roi: 195, value: 150000 },
        { name: 'Audit Platform', cost: 8000, roi: 160, value: 90000 }
      ],
      riskReduction: 280000,
      trend: 'improving'
    },
    {
      category: 'Personnel',
      monthlySpend: 54000,
      annualSpend: 648000,
      items: [
        { name: 'CISO Salary', cost: 15000, roi: 180, value: 450000 },
        { name: 'Security Team', cost: 37500, roi: 165, value: 620000 },
        { name: 'SOC Analysts', cost: 10000, roi: 140, value: 280000 }
      ],
      riskReduction: 520000,
      trend: 'stable'
    },
    {
      category: 'Services',
      monthlySpend: 29000,
      annualSpend: 348000,
      items: [
        { name: 'Penetration Testing', cost: 12000, roi: 280, value: 450000 },
        { name: 'Security Audits', cost: 15000, roi: 195, value: 350000 },
        { name: 'Compliance Consulting', cost: 2000, roi: 150, value: 80000 }
      ],
      riskReduction: 200000,
      trend: 'expanding'
    }
  ];

  const optimizationOpportunities = [
    {
      id: 'consolidate-tools',
      title: 'Consolidate Overlapping Tools',
      description: 'Merge 3 vulnerability scanning tools into single ERIP Security Suite',
      currentSpend: 15000,
      potentialSaving: 8400,
      riskImpact: 'neutral',
      effort: 'medium',
      paybackMonths: 2,
      confidence: 95
    },
    {
      id: 'upgrade-erip',
      title: 'Upgrade ERIP to Enterprise Tier',
      description: 'Enhanced automation and AI-driven risk intelligence',
      currentSpend: 25000,
      additionalCost: 15000,
      additionalValue: 450000,
      riskReduction: 300000,
      effort: 'low',
      paybackMonths: 3,
      confidence: 90
    },
    {
      id: 'automate-compliance',
      title: 'Add Compliance Automation',
      description: 'Reduce manual effort by 200 hours/month',
      currentSpend: 45000,
      potentialSaving: 18000,
      timeValue: 120000,
      riskReduction: 80000,
      effort: 'high',
      paybackMonths: 4,
      confidence: 85
    },
    {
      id: 'cancel-unused',
      title: 'Cancel Unused Qualys Licenses',
      description: '40% of licenses unused based on last 6 months data',
      currentSpend: 4000,
      potentialSaving: 1600,
      riskImpact: 'minimal',
      effort: 'low',
      paybackMonths: 1,
      confidence: 98
    }
  ];

  const riskToSpendCorrelation = {
    currentRisk: 2300000,
    currentSpend: 2400000,
    targetRisk: 450000,
    optimalSpend: 2650000,
    efficiency: {
      current: 3.5, // €1 spent = €3.50 risk reduction
      optimal: 4.2,  // with optimizations
      industry: 2.8  // industry average
    }
  };

  // Simple currency formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  const [animatedROI, setAnimatedROI] = useState(0);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedSavings, setAnimatedSavings] = useState(0);

  // Animated counters like other tools
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      const progress = step / steps;
      setAnimatedROI(Math.floor(securityInvestments.netROI * progress));
      setAnimatedValue(Math.floor(businessImpact.totalValue * progress));
      setAnimatedSavings(Math.floor(businessImpact.totalImprovement * progress));
      
      step++;
      if (step > steps) {
        clearInterval(timer);
      }
    }, increment);

    return () => clearInterval(timer);
  }, [securityInvestments.netROI, businessImpact.totalValue, businessImpact.totalImprovement]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Shock Value Hero - Security Investment Intelligence */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <Lightbulb className="h-8 w-8 text-amber-300" />
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            Your Security Spend Creates
            <div className="text-8xl text-yellow-300 mt-4">
              {formatCurrency(animatedValue)}
            </div>
            <div className="text-3xl font-normal mt-2">in measurable business value</div>
          </h1>
          
          <p className="text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            Most companies can't prove security ROI to the board. BEACON™ shows you exactly 
            how every euro spent on security creates quantifiable business value.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl font-bold text-amber-300 mb-2">{animatedROI}%</div>
              <div className="text-lg">Security Investment ROI</div>
              <div className="text-sm opacity-75">proven with financial data</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-orange-300 mb-2">{formatCurrency(animatedSavings)}</div>
              <div className="text-lg">Annual Value Growth</div>  
              <div className="text-sm opacity-75">year-over-year improvement</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-red-300 mb-2">€3.50</div>
              <div className="text-lg">Value Per Euro Spent</div>
              <div className="text-sm opacity-75">risk reduction efficiency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              BEACON™ Security Investment Intelligence
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              The only platform that tracks every euro spent on security, converts it into Trust Equity™, 
              and proves ROI through measurable business impact.
            </p>
          </div>

          {/* ROI Metrics */}
          <div className="grid gap-6 md:grid-cols-4 mb-16">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-4xl font-bold mb-2 text-emerald-600">
                  {formatCurrency(businessImpact.totalValue)}
                </div>
                <div className="text-sm text-slate-600 mb-2">Total Value Created</div>
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs text-slate-500">vs traditional approach</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-4xl font-bold mb-2 text-blue-600">
                  {securityInvestments.netROI}%
                </div>
                <div className="text-sm text-slate-600 mb-2">Investment ROI</div>
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-slate-500">industry-leading returns</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-4xl font-bold mb-2 text-purple-600">
                  {formatCurrency(securityInvestments.totalAnnualSpend)}
                </div>
                <div className="text-sm text-slate-600 mb-2">Annual Investment</div>
                <div className="flex items-center justify-center gap-1">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-xs text-slate-500">optimized portfolio</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-4xl font-bold mb-2 text-amber-600">
                  €{securityInvestments.spendToRiskRatio}
                </div>
                <div className="text-sm text-slate-600 mb-2">Risk Reduction Per €1</div>
                <div className="flex items-center justify-center gap-1">
                  <Target className="h-4 w-4 text-amber-600" />
                  <span className="text-xs text-slate-500">spending efficiency</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Before/After Problem */}
          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Without Investment Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-red-600 mb-4">
                  ???
                </div>
                <p className="text-red-700 mb-4">
                  No visibility into security spending ROI or business impact of investments.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <span className="text-sm text-red-700">Can't justify security budgets to board</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <span className="text-sm text-red-700">Unknown ROI on security investments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <span className="text-sm text-red-700">Wasted spend on ineffective tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  With BEACON Investment Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-green-600 mb-4">
                  {securityInvestments.netROI}%
                </div>
                <p className="text-green-700 mb-4">
                  Complete visibility into security spending with proven {securityInvestments.netROI}% ROI and optimization insights.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm text-green-700">Track all security investments and their ROI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm text-green-700">Prove business value to executives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm text-green-700">Optimize spending for maximum impact</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Dashboard Tabs */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Security Investment Intelligence Dashboard
            </h2>
            <p className="text-lg text-slate-700">
              From spending to Trust Equity™ to business value - track your complete security ROI
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-1 bg-white rounded-lg p-1 mb-8 max-w-2xl mx-auto border shadow-sm">
            <button
              onClick={() => setActiveTab('investment')}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-all flex-1 ${
                activeTab === 'investment' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Investment Portfolio
            </button>
            <button
              onClick={() => setActiveTab('trust-equity')}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-all flex-1 ${
                activeTab === 'trust-equity' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Trust Equity™ ROI
            </button>
            <button
              onClick={() => setActiveTab('optimization')}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-all flex-1 ${
                activeTab === 'optimization' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Optimization
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Trusted by Security Leaders Who Need to Prove ROI
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">{formatCurrency(businessImpact.totalValue)}</div>
                <div className="text-sm text-slate-600 mb-4">Value tracked in 12 months</div>
                <blockquote className="text-sm italic text-slate-700">
                  "BEACON finally gave us the data to prove security isn't a cost center - 
                  it's our highest-ROI business investment."
                </blockquote>
                <div className="text-xs text-slate-500 mt-2">— CFO, European FinTech</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">{securityInvestments.netROI}%</div>
                <div className="text-sm text-slate-600 mb-4">ROI in first year</div>
                <blockquote className="text-sm italic text-slate-700">
                  "Board meetings transformed overnight. We went from defending 
                  security costs to presenting investment opportunities."
                </blockquote>
                <div className="text-xs text-slate-500 mt-2">— CISO, Healthcare Corp</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">€{securityInvestments.spendToRiskRatio}</div>
                <div className="text-sm text-slate-600 mb-4">Value per euro spent</div>
                <blockquote className="text-sm italic text-slate-700">
                  "Every security decision is now data-driven. We optimize 
                  spending like any other strategic investment."
                </blockquote>
                <div className="text-xs text-slate-500 mt-2">— CRO, Tech Unicorn</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 mb-6">
            <DollarSign className="h-8 w-8" />
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            Ready to Prove Your Security ROI?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Track every euro, calculate precise ROI, and optimize your security investments 
            for maximum business impact.
          </p>
          
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-yellow-300 mb-2">
              {formatCurrency(animatedValue)}
            </div>
            <div className="text-lg">business value potential in your portfolio</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-amber-700 hover:bg-slate-100"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Investment Analysis
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              <Eye className="h-5 w-5 mr-2" />
              See Live Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Live Dashboard Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Live Security Investment Dashboard
            </h2>
            <p className="text-lg text-slate-700">
              See how BEACON tracks and optimizes your security spending in real-time
            </p>
          </div>

      {/* Tab Content */}
      {activeTab === 'investment' && (
        <>
          {/* Security Investment Portfolio */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Annual Investment</CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                  <DollarSign className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-slate-900 mb-2">{formatCurrency(securityInvestments.totalAnnualSpend)}</div>
                <div className="flex items-center gap-1 text-sm font-medium text-blue-700">
                  <span>{formatCurrency(securityInvestments.monthlySpend)}/month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Trust Equity™ Generated</CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                  <Award className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-slate-900 mb-2">847</div>
                <div className="flex items-center gap-1 text-sm font-medium text-amber-700">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+155 points YoY</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Business Value</CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-slate-900 mb-2">{formatCurrency(securityInvestments.totalValueCreated)}</div>
                <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
                  <span>From Trust Equity™</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Investment ROI</CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                  <Target className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-slate-900 mb-2">{securityInvestments.netROI}%</div>
                <div className="flex items-center gap-1 text-sm font-medium text-purple-700">
                  <span>€{securityInvestments.spendToRiskRatio} per €1 spent</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Categories */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Security Investment Portfolio
                </CardTitle>
                <CardDescription className="text-slate-600">
                  How your €{(securityInvestments.totalAnnualSpend/1000000).toFixed(1)}M annual investment builds Trust Equity™
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {investmentCategories.map((category, index) => (
                    <div key={index} className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">{category.category}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                            <span>Monthly: {formatCurrency(category.monthlySpend)}</span>
                            <span>Annual: {formatCurrency(category.annualSpend)}</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          category.trend === 'optimized' ? 'bg-emerald-50 text-emerald-700' :
                          category.trend === 'improving' ? 'bg-blue-50 text-blue-700' :
                          category.trend === 'expanding' ? 'bg-purple-50 text-purple-700' :
                          'bg-slate-50 text-slate-700'
                        }`}>
                          {category.trend}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-slate-600 mb-1">Trust Points</div>
                          <div className="text-xl font-bold text-amber-600">+{Math.floor(category.riskReduction / 10000)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-600 mb-1">Business Value</div>
                          <div className="text-xl font-bold text-emerald-700">{formatCurrency(category.riskReduction * 3)}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-slate-600 font-medium">Key Investments:</div>
                        {category.items.slice(0, 3).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">{formatCurrency(item.cost)}/mo</span>
                              <span className="text-emerald-600 font-medium">{item.roi}% ROI</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Investment-to-Trust Conversion */}
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Award className="h-5 w-5 text-amber-600" />
                  Investment → Trust Equity™ Conversion
                </CardTitle>
                <CardDescription className="text-slate-600">
                  How security spending converts to Trust Points and business value
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-5 rounded-xl border border-amber-200 bg-amber-50">
                    <h3 className="font-semibold text-amber-900 mb-4">Trust Equity™ Formula</h3>
                    <div className="text-center text-sm">
                      <div className="font-mono text-amber-800 mb-2">
                        €{(securityInvestments.totalAnnualSpend/1000000).toFixed(1)}M Investment → 847 Trust Points → {formatCurrency(securityInvestments.totalValueCreated)} Value
                      </div>
                      <div className="text-amber-700">
                        Every €1 spent = 0.35 Trust Points = €{securityInvestments.spendToRiskRatio} business value
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-slate-200 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">ERIP Platform Investment</span>
                        <span className="font-medium">{formatCurrency(25000 * 12)}/year</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-amber-600">Trust Points Generated: +180</span>
                        <span className="text-emerald-600">Business Value: {formatCurrency(800000)}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-200 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Security Team Investment</span>
                        <span className="font-medium">{formatCurrency(648000)}/year</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-amber-600">Trust Points Generated: +227</span>
                        <span className="text-emerald-600">Business Value: {formatCurrency(1350000)}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-200 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Compliance Tools Investment</span>
                        <span className="font-medium">{formatCurrency(384000)}/year</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-amber-600">Trust Points Generated: +134</span>
                        <span className="text-emerald-600">Business Value: {formatCurrency(420000)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Trust Equity™ ROI Tab - Original BEACON Content */}
      {activeTab === 'trust-equity' && (
        <>
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
        </>
      )}

      {/* Trust Equity™ ROI Tab - Original BEACON Content */}
      {activeTab === 'trust-equity' && (
        <>
          {/* Enhanced Business Impact Metrics */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Trust Equity™ Score</CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                  <Award className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-slate-900 mb-2">847</div>
                <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+155 points YoY</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Deal Acceleration</CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-slate-900 mb-2">{formatCurrency(3200000)}</div>
                <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>40% faster cycles</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Premium Pricing</CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                  <DollarSign className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-slate-900 mb-2">{formatCurrency(1850000)}</div>
                <div className="flex items-center gap-1 text-sm font-medium text-purple-700">
                  <span>25% pricing premium</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-700">Total Business Value</CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                  <Target className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-slate-900 mb-2">{formatCurrency(businessImpact.totalValue)}</div>
                <div className="flex items-center gap-1 text-sm font-medium text-blue-700">
                  <span>From Trust Equity™</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Value Metrics */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <BarChart3 className="h-5 w-5 text-amber-600" />
                  Trust Equity™ Value Breakdown
                </CardTitle>
                <CardDescription className="text-slate-600">
                  How your 847 Trust Points create measurable business value
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {valueMetrics.slice(0, 3).map((metric) => (
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
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-slate-600 mb-1">Current Value</div>
                          <div className="text-2xl font-bold text-emerald-700">{formatCurrency(metric.currentValue)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-600 mb-1">Previous {metric.period}</div>
                          <div className="text-xl font-bold text-slate-600">{formatCurrency(metric.previousValue)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Equity™ Formula */}
            <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Award className="h-5 w-5 text-amber-600" />
                  Trust Equity™ Impact Formula
                </CardTitle>
                <CardDescription className="text-slate-600">
                  How security investments convert to Trust Points and business outcomes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-5 rounded-xl border border-amber-200 bg-amber-50">
                    <h3 className="font-semibold text-amber-900 mb-4 text-center">Trust Equity™ Value Chain</h3>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">€{(securityInvestments.totalAnnualSpend/1000000).toFixed(1)}M</div>
                        <div className="text-blue-700">Security Investment</div>
                      </div>
                      <div className="text-amber-600 text-xl">→</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600 mb-1">847</div>
                        <div className="text-amber-700">Trust Points</div>
                      </div>
                      <div className="text-amber-600 text-xl">→</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">{formatCurrency(businessImpact.totalValue)}</div>
                        <div className="text-emerald-700">Business Value</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-slate-200 bg-white">
                      <div className="text-sm text-slate-600 mb-2">Deal Acceleration</div>
                      <div className="text-xl font-bold text-emerald-700 mb-1">{formatCurrency(3200000)}</div>
                      <div className="text-xs text-slate-500">40% faster enterprise deals</div>
                    </div>
                    <div className="p-4 rounded-lg border border-slate-200 bg-white">
                      <div className="text-sm text-slate-600 mb-2">Premium Pricing</div>
                      <div className="text-xl font-bold text-purple-700 mb-1">{formatCurrency(1850000)}</div>
                      <div className="text-xs text-slate-500">25% pricing advantage</div>
                    </div>
                    <div className="p-4 rounded-lg border border-slate-200 bg-white">
                      <div className="text-sm text-slate-600 mb-2">Compliance Efficiency</div>
                      <div className="text-xl font-bold text-blue-700 mb-1">{formatCurrency(1850000)}</div>
                      <div className="text-xs text-slate-500">Automated processes</div>
                    </div>
                    <div className="p-4 rounded-lg border border-slate-200 bg-white">
                      <div className="text-sm text-slate-600 mb-2">Risk Prevention</div>
                      <div className="text-xl font-bold text-red-700 mb-1">{formatCurrency(3200000)}</div>
                      <div className="text-xs text-slate-500">Incidents avoided</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Optimization Tab */}
      {activeTab === 'optimization' && (
        <>
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Zap className="h-5 w-5 text-amber-600" />
                Investment Optimization Opportunities
              </CardTitle>
              <CardDescription className="text-slate-600">
                AI-powered recommendations to optimize security spending and maximize ROI
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-5">
                {optimizationOpportunities.map((opportunity, index) => (
                  <div key={index} className="p-6 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{opportunity.title}</h3>
                        <p className="text-slate-600 mt-1">{opportunity.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          opportunity.effort === 'low' ? 'bg-emerald-50 text-emerald-700' :
                          opportunity.effort === 'medium' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {opportunity.effort} effort
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {opportunity.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Current Spend</div>
                        <div className="text-xl font-bold text-slate-900">{formatCurrency(opportunity.currentSpend)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600 mb-1">
                          {opportunity.potentialSaving ? 'Potential Saving' : 'Additional Cost'}
                        </div>
                        <div className={`text-xl font-bold ${
                          opportunity.potentialSaving ? 'text-emerald-700' : 'text-blue-600'
                        }`}>
                          {formatCurrency(opportunity.potentialSaving || opportunity.additionalCost || 0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600 mb-1">
                          {opportunity.additionalValue ? 'Additional Value' : 'Risk Impact'}
                        </div>
                        <div className={`text-xl font-bold ${
                          opportunity.additionalValue ? 'text-purple-700' : 
                          opportunity.riskImpact === 'neutral' ? 'text-slate-600' :
                          opportunity.riskImpact === 'minimal' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {opportunity.additionalValue ? formatCurrency(opportunity.additionalValue) : opportunity.riskImpact}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600 mb-1">Payback Period</div>
                        <div className="text-xl font-bold text-blue-700">{opportunity.paybackMonths}mo</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-500">
                        Recommendation based on spend analysis and industry benchmarks
                      </div>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        Implement
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
        </div>
      </section>
    </div>
  );
};