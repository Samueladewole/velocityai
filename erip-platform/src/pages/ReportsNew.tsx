import React, { useState, useMemo, useCallback } from 'react';
import { ComponentPageTemplate } from '@/components/templates/ComponentPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatCard, TabConfiguration } from '@/types/componentTemplate';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Shield,
  Clock,
  Filter,
  Share2,
  Eye,
  Printer,
  Mail,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  PieChart,
  Activity,
  Star,
  Zap,
  Globe,
  Users,
  Target,
  Brain,
  Database,
  LineChart,
  Settings,
  Plus,
  Edit,
  Copy,
  RefreshCw,
  Search,
  SortAsc,
  Bookmark,
  Heart,
  MessageSquare,
  ExternalLink,
  Layers,
  Timer,
  DollarSign,
  Award,
  Gauge,
  Building2,
  CreditCard,
  Workflow,
  Hash,
  GitBranch,
  BarChart2,
  Coins,
  UserCheck,
  ClipboardCheck
} from 'lucide-react';

// Enhanced Interfaces for Comprehensive Reporting System

interface ReportingMetric {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  period: string;
  description?: string;
  category: 'executive' | 'compliance' | 'risk' | 'financial' | 'operational';
  confidence: number; // 0-100
  dataSource: string;
  lastUpdated: string;
  drillDownAvailable: boolean;
  benchmark?: {
    industry: number;
    peers: number;
    target: number;
  };
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'executive' | 'compliance' | 'risk' | 'audit' | 'operational' | 'financial';
  type: 'dashboard' | 'detailed' | 'summary' | 'analytical' | 'regulatory';
  icon: React.ComponentType<any>;
  color: string;
  frequency: 'real-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  estimatedTime: number; // minutes to generate
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  frameworks: string[];
  tags: string[];
  trustPoints: number;
  outputFormats: Array<'pdf' | 'excel' | 'powerpoint' | 'html' | 'csv' | 'json'>;
  interactiveFeatures: string[];
  customizable: boolean;
  automationAvailable: boolean;
  dataRetention: number; // days
  stakeholders: string[];
  lastUsed?: string;
  isFavorite: boolean;
  rating: number;
  usage: {
    thisMonth: number;
    totalGenerated: number;
    averageGenerationTime: number;
  };
}

interface GeneratedReport {
  id: string;
  name: string;
  template: string;
  type: 'executive' | 'compliance' | 'risk' | 'audit' | 'operational';
  generatedBy: string;
  generatedAt: string;
  status: 'generating' | 'ready' | 'error' | 'expired' | 'archived';
  size: string;
  format: string;
  confidentiality: 'public' | 'internal' | 'confidential' | 'restricted';
  recipients: string[];
  downloads: number;
  views: number;
  sharing: {
    link: string;
    expiresAt: string;
    passwordProtected: boolean;
    allowDownload: boolean;
  };
  metadata: {
    pages: number;
    charts: number;
    tables: number;
    dataPoints: number;
    timeRange: string;
    version: string;
  };
  feedback: {
    rating: number;
    comments: string[];
    usefulness: number;
  };
  automation?: {
    scheduleId: string;
    nextGeneration: string;
    frequency: string;
  };
}

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  template: string;
  recipients: Array<{
    email: string;
    name: string;
    role: string;
    preferences: {
      format: string;
      delivery: 'email' | 'portal' | 'both';
      notifications: boolean;
    };
  }>;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
    time: string;
    timezone: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    customCron?: string;
  };
  status: 'active' | 'paused' | 'error' | 'pending';
  nextRun: string;
  lastRun?: string;
  lastStatus?: 'success' | 'error' | 'partial';
  configuration: {
    format: string;
    includeAttachments: boolean;
    watermark: boolean;
    customization: Record<string, any>;
  };
  notifications: {
    onSuccess: boolean;
    onError: boolean;
    onEmptyData: boolean;
    escalation: string[];
  };
  retention: {
    keepReports: number; // days
    archiveAfter: number; // days
    deleteAfter: number; // days
  };
  performance: {
    averageGenerationTime: number;
    successRate: number;
    lastErrors: string[];
  };
  trustPoints: number;
  creator: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportAnalytics {
  usage: {
    totalReports: number;
    thisMonth: number;
    avgPerDay: number;
    peakHours: number[];
    mostPopularTemplates: string[];
  };
  performance: {
    avgGenerationTime: number;
    successRate: number;
    errorRate: number;
    userSatisfaction: number;
  };
  trends: {
    monthlyGrowth: number;
    categoryDistribution: Record<string, number>;
    formatPreferences: Record<string, number>;
    stakeholderEngagement: number;
  };
  insights: Array<{
    type: 'opportunity' | 'warning' | 'success' | 'trend';
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    actionable: boolean;
    recommendations: string[];
  }>;
}

interface ChartConfiguration {
  id: string;
  title: string;
  type: 'line' | 'area' | 'bar' | 'pie' | 'radar' | 'scatter' | 'heatmap' | 'gauge' | 'treemap';
  data: any[];
  config: {
    xAxis: string;
    yAxis: string | string[];
    groupBy?: string;
    timeField?: string;
    valueField?: string;
    colorScheme: string;
    showLegend: boolean;
    interactive: boolean;
    realTime: boolean;
    drillDown: boolean;
  };
  filters: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  annotations: Array<{
    type: 'line' | 'region' | 'point';
    value: any;
    label: string;
    color: string;
  }>;
  export: {
    formats: string[];
    highResolution: boolean;
    includeLogo: boolean;
  };
  performance: {
    loadTime: number;
    dataPoints: number;
    cacheEnabled: boolean;
  };
}

export const ReportsNew: React.FC = () => {
  // State Management
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  // Mock Data - Executive Reporting Metrics with Enhanced Features
  const reportingMetrics: ReportingMetric[] = [
    {
      id: 'trust-score',
      label: 'Overall Trust Score',
      value: 87,
      change: '+5%',
      trend: 'up',
      period: 'vs last month',
      description: 'Comprehensive trust assessment across all domains',
      category: 'executive',
      confidence: 94,
      dataSource: 'Trust Analytics Engine',
      lastUpdated: '2 hours ago',
      drillDownAvailable: true,
      benchmark: { industry: 82, peers: 85, target: 90 }
    },
    {
      id: 'compliance-coverage',
      label: 'Compliance Coverage',
      value: 92,
      change: '+8%',
      trend: 'up',
      period: 'vs last quarter',
      description: 'Framework compliance and regulatory adherence',
      category: 'compliance',
      confidence: 98,
      dataSource: 'Compliance Management System',
      lastUpdated: '1 hour ago',
      drillDownAvailable: true,
      benchmark: { industry: 88, peers: 90, target: 95 }
    },
    {
      id: 'risk-reduction',
      label: 'Risk Reduction',
      value: 73,
      change: '-12%',
      trend: 'down',
      period: 'risks mitigated',
      description: 'Percentage of identified risks successfully mitigated',
      category: 'risk',
      confidence: 89,
      dataSource: 'Risk Management Platform',
      lastUpdated: '30 minutes ago',
      drillDownAvailable: true,
      benchmark: { industry: 75, peers: 78, target: 85 }
    },
    {
      id: 'roi-generated',
      label: 'ROI Generated',
      value: '€2.3M',
      change: '+23%',
      trend: 'up',
      period: 'this year',
      description: 'Return on investment from security and compliance initiatives',
      category: 'financial',
      confidence: 92,
      dataSource: 'Financial Analytics',
      lastUpdated: '4 hours ago',
      drillDownAvailable: true,
      benchmark: { industry: 1.8, peers: 2.1, target: 2.5 }
    },
    {
      id: 'automation-efficiency',
      label: 'Automation Efficiency',
      value: 89,
      change: '+15%',
      trend: 'up',
      period: 'process automation',
      description: 'Efficiency gains from automated reporting processes',
      category: 'operational',
      confidence: 91,
      dataSource: 'Process Analytics',
      lastUpdated: '1 hour ago',
      drillDownAvailable: true,
      benchmark: { industry: 85, peers: 87, target: 92 }
    },
    {
      id: 'stakeholder-satisfaction',
      label: 'Stakeholder Satisfaction',
      value: 4.6,
      change: '+0.3',
      trend: 'up',
      period: 'out of 5.0',
      description: 'Average satisfaction rating from report recipients',
      category: 'operational',
      confidence: 87,
      dataSource: 'Feedback System',
      lastUpdated: '6 hours ago',
      drillDownAvailable: true,
      benchmark: { industry: 4.2, peers: 4.4, target: 4.8 }
    }
  ];

  // Enhanced Report Templates with Comprehensive Features
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'executive-dashboard',
      name: 'Executive Dashboard',
      description: 'High-level metrics and KPIs for C-suite and board reporting',
      category: 'executive',
      type: 'dashboard',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      frequency: 'monthly',
      estimatedTime: 15,
      complexity: 'moderate',
      frameworks: ['NIST', 'ISO 27001', 'SOC 2'],
      tags: ['strategic', 'kpi', 'leadership', 'overview'],
      trustPoints: 150,
      outputFormats: ['pdf', 'powerpoint', 'html'],
      interactiveFeatures: ['drill-down', 'filtering', 'real-time'],
      customizable: true,
      automationAvailable: true,
      dataRetention: 365,
      stakeholders: ['CEO', 'CISO', 'Board'],
      lastUsed: '2 days ago',
      isFavorite: true,
      rating: 4.8,
      usage: { thisMonth: 12, totalGenerated: 156, averageGenerationTime: 12 }
    },
    {
      id: 'compliance-status',
      name: 'Compliance Status Report',
      description: 'Comprehensive compliance assessment across all frameworks',
      category: 'compliance',
      type: 'detailed',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      frequency: 'quarterly',
      estimatedTime: 25,
      complexity: 'complex',
      frameworks: ['GDPR', 'ISO 27001', 'SOC 2', 'HIPAA'],
      tags: ['regulatory', 'audit', 'frameworks', 'gaps'],
      trustPoints: 200,
      outputFormats: ['pdf', 'excel', 'html'],
      interactiveFeatures: ['gap-analysis', 'timeline', 'action-items'],
      customizable: true,
      automationAvailable: true,
      dataRetention: 2555, // 7 years for compliance
      stakeholders: ['Compliance Officer', 'Legal', 'Auditors'],
      lastUsed: '1 week ago',
      isFavorite: false,
      rating: 4.9,
      usage: { thisMonth: 8, totalGenerated: 89, averageGenerationTime: 22 }
    },
    {
      id: 'risk-register',
      name: 'Risk Register & Assessment',
      description: 'Current risks, threat landscape, and mitigation strategies',
      category: 'risk',
      type: 'analytical',
      icon: AlertTriangle,
      color: 'from-orange-500 to-orange-600',
      frequency: 'weekly',
      estimatedTime: 20,
      complexity: 'complex',
      frameworks: ['NIST CSF', 'ISO 31000', 'FAIR'],
      tags: ['threats', 'vulnerabilities', 'mitigation', 'heatmap'],
      trustPoints: 175,
      outputFormats: ['pdf', 'excel', 'csv'],
      interactiveFeatures: ['risk-matrix', 'timeline', 'scenario-modeling'],
      customizable: true,
      automationAvailable: true,
      dataRetention: 1095, // 3 years
      stakeholders: ['CISO', 'Risk Manager', 'Security Team'],
      lastUsed: '3 days ago',
      isFavorite: true,
      rating: 4.7,
      usage: { thisMonth: 16, totalGenerated: 234, averageGenerationTime: 18 }
    },
    {
      id: 'trust-analysis',
      name: 'Trust Score Deep Dive',
      description: 'Detailed analysis of trust metrics and contributing factors',
      category: 'executive',
      type: 'analytical',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      frequency: 'monthly',
      estimatedTime: 30,
      complexity: 'enterprise',
      frameworks: ['Trust Framework', 'NIST', 'Custom Metrics'],
      tags: ['trust', 'metrics', 'analytics', 'trends'],
      trustPoints: 250,
      outputFormats: ['pdf', 'powerpoint', 'html', 'json'],
      interactiveFeatures: ['predictive-modeling', 'benchmarking', 'simulation'],
      customizable: true,
      automationAvailable: false,
      dataRetention: 730, // 2 years
      stakeholders: ['CEO', 'CISO', 'Strategy Team'],
      isFavorite: false,
      rating: 4.6,
      usage: { thisMonth: 5, totalGenerated: 67, averageGenerationTime: 28 }
    },
    {
      id: 'audit-trail',
      name: 'Audit Trail & Evidence',
      description: 'Comprehensive audit documentation and evidence collection',
      category: 'audit',
      type: 'detailed',
      icon: ClipboardCheck,
      color: 'from-indigo-500 to-indigo-600',
      frequency: 'quarterly',
      estimatedTime: 45,
      complexity: 'enterprise',
      frameworks: ['SOC 2', 'ISO 27001', 'GDPR'],
      tags: ['audit', 'evidence', 'documentation', 'compliance'],
      trustPoints: 300,
      outputFormats: ['pdf', 'excel'],
      interactiveFeatures: ['document-linking', 'timestamp-verification', 'digital-signatures'],
      customizable: false,
      automationAvailable: true,
      dataRetention: 2555, // 7 years for audit
      stakeholders: ['Auditors', 'Compliance', 'Legal'],
      isFavorite: false,
      rating: 4.9,
      usage: { thisMonth: 3, totalGenerated: 34, averageGenerationTime: 42 }
    },
    {
      id: 'operational-metrics',
      name: 'Operational Excellence',
      description: 'Performance metrics and operational efficiency indicators',
      category: 'operational',
      type: 'dashboard',
      icon: Activity,
      color: 'from-cyan-500 to-cyan-600',
      frequency: 'weekly',
      estimatedTime: 15,
      complexity: 'moderate',
      frameworks: ['ITIL', 'Custom KPIs'],
      tags: ['operations', 'efficiency', 'performance', 'sla'],
      trustPoints: 125,
      outputFormats: ['pdf', 'html', 'csv'],
      interactiveFeatures: ['real-time', 'alerting', 'trending'],
      customizable: true,
      automationAvailable: true,
      dataRetention: 365,
      stakeholders: ['Operations Manager', 'IT Director'],
      lastUsed: '1 day ago',
      isFavorite: true,
      rating: 4.5,
      usage: { thisMonth: 24, totalGenerated: 312, averageGenerationTime: 13 }
    }
  ];

  // Generated Reports with Enhanced Metadata
  const generatedReports: GeneratedReport[] = [
    {
      id: 'exec-q4-2024',
      name: 'Q4 2024 Executive Summary',
      template: 'executive-dashboard',
      type: 'executive',
      generatedBy: 'John Smith',
      generatedAt: '2 days ago',
      status: 'ready',
      size: '2.4 MB',
      format: 'PDF',
      confidentiality: 'confidential',
      recipients: ['ceo@company.com', 'board@company.com'],
      downloads: 23,
      views: 67,
      sharing: {
        link: 'https://secure.erip.com/reports/exec-q4-2024',
        expiresAt: 'In 28 days',
        passwordProtected: true,
        allowDownload: true
      },
      metadata: {
        pages: 18,
        charts: 12,
        tables: 6,
        dataPoints: 1247,
        timeRange: 'Q4 2024',
        version: '1.2'
      },
      feedback: {
        rating: 4.8,
        comments: ['Very insightful', 'Great visualizations'],
        usefulness: 94
      }
    },
    {
      id: 'iso-27001-dec',
      name: 'ISO 27001 Compliance Report - December',
      template: 'compliance-status',
      type: 'compliance',
      generatedBy: 'Sarah Connor',
      generatedAt: '1 week ago',
      status: 'ready',
      size: '5.1 MB',
      format: 'PDF',
      confidentiality: 'internal',
      recipients: ['compliance@company.com', 'audit@company.com'],
      downloads: 45,
      views: 123,
      sharing: {
        link: 'https://secure.erip.com/reports/iso-27001-dec',
        expiresAt: 'In 90 days',
        passwordProtected: true,
        allowDownload: true
      },
      metadata: {
        pages: 34,
        charts: 8,
        tables: 15,
        dataPoints: 2156,
        timeRange: 'December 2024',
        version: '2.1'
      },
      feedback: {
        rating: 4.9,
        comments: ['Comprehensive analysis', 'Action items clear'],
        usefulness: 97
      },
      automation: {
        scheduleId: 'monthly-compliance',
        nextGeneration: 'In 3 weeks',
        frequency: 'Monthly'
      }
    },
    {
      id: 'risk-assessment-dec',
      name: 'December Risk Assessment',
      template: 'risk-register',
      type: 'risk',
      generatedBy: 'Mike Johnson',
      generatedAt: '2 weeks ago',
      status: 'ready',
      size: '3.8 MB',
      format: 'PDF',
      confidentiality: 'restricted',
      recipients: ['ciso@company.com', 'risk@company.com'],
      downloads: 31,
      views: 89,
      sharing: {
        link: 'https://secure.erip.com/reports/risk-assessment-dec',
        expiresAt: 'In 45 days',
        passwordProtected: true,
        allowDownload: false
      },
      metadata: {
        pages: 28,
        charts: 15,
        tables: 12,
        dataPoints: 1834,
        timeRange: 'December 2024',
        version: '1.5'
      },
      feedback: {
        rating: 4.6,
        comments: ['Detailed analysis', 'Good risk prioritization'],
        usefulness: 91
      }
    }
  ];

  // Scheduled Reports with Enhanced Configuration
  const scheduledReports: ScheduledReport[] = [
    {
      id: 'weekly-risk-digest',
      name: 'Weekly Risk Digest',
      description: 'Comprehensive weekly risk overview for leadership team',
      template: 'risk-register',
      recipients: [
        { email: 'ciso@company.com', name: 'Jane Doe', role: 'CISO', preferences: { format: 'PDF', delivery: 'email', notifications: true } },
        { email: 'cfo@company.com', name: 'Robert Lee', role: 'CFO', preferences: { format: 'PDF', delivery: 'both', notifications: false } }
      ],
      schedule: {
        frequency: 'weekly',
        time: '08:00',
        timezone: 'UTC',
        dayOfWeek: 1 // Monday
      },
      status: 'active',
      nextRun: 'In 3 days',
      lastRun: '4 days ago',
      lastStatus: 'success',
      configuration: {
        format: 'PDF',
        includeAttachments: true,
        watermark: true,
        customization: { includeExecutiveSummary: true, highlightCriticalRisks: true }
      },
      notifications: {
        onSuccess: true,
        onError: true,
        onEmptyData: false,
        escalation: ['admin@company.com']
      },
      retention: {
        keepReports: 90,
        archiveAfter: 365,
        deleteAfter: 2555
      },
      performance: {
        averageGenerationTime: 18,
        successRate: 98.5,
        lastErrors: []
      },
      trustPoints: 75,
      creator: 'system@company.com',
      createdAt: '3 months ago',
      updatedAt: '1 week ago'
    },
    {
      id: 'monthly-compliance',
      name: 'Monthly Compliance Dashboard',
      description: 'Comprehensive monthly compliance status across all frameworks',
      template: 'compliance-status',
      recipients: [
        { email: 'compliance@company.com', name: 'Alice Smith', role: 'Compliance Officer', preferences: { format: 'PDF', delivery: 'portal', notifications: true } }
      ],
      schedule: {
        frequency: 'monthly',
        time: '06:00',
        timezone: 'UTC',
        dayOfMonth: 1
      },
      status: 'active',
      nextRun: 'In 5 days',
      lastRun: '25 days ago',
      lastStatus: 'success',
      configuration: {
        format: 'PDF',
        includeAttachments: false,
        watermark: false,
        customization: { includeActionPlan: true, detailedGapAnalysis: true }
      },
      notifications: {
        onSuccess: false,
        onError: true,
        onEmptyData: true,
        escalation: ['ciso@company.com']
      },
      retention: {
        keepReports: 365,
        archiveAfter: 1095,
        deleteAfter: 2555
      },
      performance: {
        averageGenerationTime: 25,
        successRate: 96.2,
        lastErrors: ['Data source timeout on 2024-11-15']
      },
      trustPoints: 125,
      creator: 'alice.smith@company.com',
      createdAt: '6 months ago',
      updatedAt: '2 weeks ago'
    },
    {
      id: 'quarterly-board',
      name: 'Quarterly Board Report',
      description: 'Executive summary for board meetings with key metrics and insights',
      template: 'executive-dashboard',
      recipients: [
        { email: 'board@company.com', name: 'Board Members', role: 'Board', preferences: { format: 'PowerPoint', delivery: 'email', notifications: false } }
      ],
      schedule: {
        frequency: 'quarterly',
        time: '07:00',
        timezone: 'UTC',
        dayOfMonth: 1
      },
      status: 'active',
      nextRun: 'In 2 weeks',
      lastRun: '2 months ago',
      lastStatus: 'success',
      configuration: {
        format: 'PowerPoint',
        includeAttachments: true,
        watermark: true,
        customization: { executiveFocus: true, includeIndustryBenchmarks: true }
      },
      notifications: {
        onSuccess: true,
        onError: true,
        onEmptyData: true,
        escalation: ['ceo@company.com', 'ciso@company.com']
      },
      retention: {
        keepReports: 1095,
        archiveAfter: 1825,
        deleteAfter: 3650
      },
      performance: {
        averageGenerationTime: 35,
        successRate: 100,
        lastErrors: []
      },
      trustPoints: 200,
      creator: 'ceo@company.com',
      createdAt: '1 year ago',
      updatedAt: '1 month ago'
    }
  ];

  // Calculate Trust Points from reporting activities
  const calculateTrustPoints = useCallback(() => {
    return reportingMetrics.reduce((total, metric) => {
      return total + (metric.confidence * 0.5) + (metric.trend === 'up' ? 10 : metric.trend === 'down' ? -5 : 0);
    }, 0) + scheduledReports.reduce((total, schedule) => total + schedule.trustPoints, 0);
  }, [reportingMetrics, scheduledReports]);

  // Enhanced Quick Stats with Trust Points Integration
  const quickStats: StatCard[] = useMemo(() => [
    {
      label: 'Trust Score Performance',
      value: reportingMetrics.find(m => m.id === 'trust-score')?.value || 87,
      change: reportingMetrics.find(m => m.id === 'trust-score')?.change,
      trend: reportingMetrics.find(m => m.id === 'trust-score')?.trend,
      description: 'Comprehensive trust assessment with industry benchmarks',
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      color: 'text-slate-900',
      onClick: () => console.log('Navigate to Trust Analytics'),
      badge: 'High Confidence'
    },
    {
      label: 'Active Reports Generated',
      value: generatedReports.length,
      change: '+12%',
      trend: 'up',
      description: `${generatedReports.filter(r => r.status === 'ready').length} ready for review`,
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      color: 'text-slate-900',
      onClick: () => console.log('Navigate to Generated Reports')
    },
    {
      label: 'Automation Efficiency',
      value: reportingMetrics.find(m => m.id === 'automation-efficiency')?.value || 89,
      change: reportingMetrics.find(m => m.id === 'automation-efficiency')?.change,
      trend: reportingMetrics.find(m => m.id === 'automation-efficiency')?.trend,
      description: 'Process automation and report generation efficiency',
      icon: <Workflow className="h-6 w-6 text-green-600" />,
      color: 'text-slate-900',
      badge: scheduledReports.filter(s => s.status === 'active').length + ' Active'
    },
    {
      label: 'Stakeholder Satisfaction',
      value: reportingMetrics.find(m => m.id === 'stakeholder-satisfaction')?.value || 4.6,
      change: reportingMetrics.find(m => m.id === 'stakeholder-satisfaction')?.change,
      trend: reportingMetrics.find(m => m.id === 'stakeholder-satisfaction')?.trend,
      description: 'Average rating from report recipients and stakeholders',
      icon: <Heart className="h-6 w-6 text-pink-600" />,
      color: 'text-slate-900',
      badge: 'Excellent'
    },
    {
      label: 'Trust Points Earned',
      value: calculateTrustPoints().toFixed(0),
      change: '+18%',
      trend: 'up',
      description: 'Trust points from reporting activities and achievements',
      icon: <Award className="h-6 w-6 text-purple-600" />,
      color: 'text-purple-700',
      badge: 'Platinum'
    },
    {
      label: 'ROI Impact',
      value: reportingMetrics.find(m => m.id === 'roi-generated')?.value || '€2.3M',
      change: reportingMetrics.find(m => m.id === 'roi-generated')?.change,
      trend: reportingMetrics.find(m => m.id === 'roi-generated')?.trend,
      description: 'Financial impact from data-driven decision making',
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      color: 'text-green-700',
      badge: 'High Impact'
    }
  ], [reportingMetrics, generatedReports, scheduledReports, calculateTrustPoints]);

  // Enhanced Tab Configuration with Sophisticated Features
  const tabs: TabConfiguration[] = [
    {
      id: 'executive',
      label: 'Executive Dashboard',
      badge: reportingMetrics.filter(m => m.category === 'executive').length,
      content: (
        <div className="space-y-6">
          {/* Executive KPI Grid */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Executive KPI Dashboard
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Download className="h-4 w-4 mr-2" />
                    Export Dashboard
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {reportingMetrics
                  .filter(metric => metric.category === 'executive' || metric.category === 'financial')
                  .map((metric) => (
                  <Card key={metric.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-slate-600 font-medium">{metric.label}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                              {typeof metric.value === 'number' && metric.label.toLowerCase().includes('score') 
                                ? `${metric.value}%` 
                                : metric.value
                              }
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {metric.trend === 'up' ? (
                              <ArrowUp className="h-4 w-4 text-green-600" />
                            ) : metric.trend === 'down' ? (
                              <ArrowDown className="h-4 w-4 text-red-600" />
                            ) : null}
                            <span className={`text-sm font-medium ${
                              metric.trend === 'up' ? 'text-green-600' : 
                              metric.trend === 'down' ? 'text-red-600' : 'text-slate-600'
                            }`}>
                              {metric.change}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Confidence: {metric.confidence}%</span>
                            <span>{metric.lastUpdated}</span>
                          </div>
                          <Progress value={metric.confidence} className="h-1" />
                        </div>
                        
                        {metric.benchmark && (
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-slate-50 rounded">
                              <p className="text-slate-600">Industry</p>
                              <p className="font-semibold">{metric.benchmark.industry}%</p>
                            </div>
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <p className="text-slate-600">Peers</p>
                              <p className="font-semibold text-blue-600">{metric.benchmark.peers}%</p>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded">
                              <p className="text-slate-600">Target</p>
                              <p className="font-semibold text-green-600">{metric.benchmark.target}%</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {metric.dataSource}
                          </Badge>
                          {metric.drillDownAvailable && (
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-600" />
                  Trust Score Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-blue-600 opacity-50 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Interactive trust score timeline</p>
                    <p className="text-xs text-slate-500">Real-time data visualization</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Range
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Full Screen
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-orange-600" />
                  Risk & Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-orange-600 opacity-50 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Risk distribution by category</p>
                    <p className="text-xs text-slate-500">Interactive drill-down available</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <BarChart2 className="h-4 w-4 mr-1" />
                      View Type
                    </Button>
                    <Button variant="outline" size="sm">
                      <Layers className="h-4 w-4 mr-1" />
                      Drill Down
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Generate Templates */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Quick Generate Executive Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTemplates
                  .filter(template => template.category === 'executive')
                  .map((template) => (
                  <Card key={template.id} className="border border-slate-200 hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${template.color} text-white`}>
                          <template.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                          <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              <Badge variant="secondary" className="text-xs">{template.frequency}</Badge>
                              <Badge variant="outline" className="text-xs">{template.estimatedTime}min</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-slate-600">{template.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-purple-600 font-medium">+{template.trustPoints} Trust Points</span>
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                              Generate
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'generated',
      label: 'Generated Reports',
      badge: generatedReports.length,
      content: (
        <div className="space-y-6">
          {/* Filters and Search */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search reports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={activeFilter} onValueChange={setActiveFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reports</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="risk">Risk</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="size">File Size</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Bulk Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Grid */}
          <div className="grid gap-4">
            {generatedReports
              .filter(report => activeFilter === 'all' || report.type === activeFilter)
              .filter(report => searchQuery === '' || report.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((report) => (
              <Card key={report.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200">
                        <FileText className="h-6 w-6 text-slate-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-slate-900 text-lg">{report.name}</h3>
                          <Badge 
                            variant={report.status === 'ready' ? 'default' : report.status === 'generating' ? 'secondary' : 'destructive'}
                            className={report.status === 'ready' ? 'bg-green-600' : ''}
                          >
                            {report.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {report.confidentiality}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {report.generatedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {report.generatedAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <Database className="h-4 w-4" />
                            {report.size}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {report.recipients.length} recipients
                          </span>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="text-slate-500">Views</p>
                            <p className="font-semibold text-slate-900">{report.views}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-slate-500">Downloads</p>
                            <p className="font-semibold text-slate-900">{report.downloads}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-slate-500">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="font-semibold text-slate-900">{report.feedback.rating}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-slate-500">Pages</p>
                            <p className="font-semibold text-slate-900">{report.metadata.pages}</p>
                          </div>
                        </div>

                        {report.sharing && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium mb-1">Sharing Active</p>
                            <p className="text-xs text-blue-600">
                              Expires: {report.sharing.expiresAt} • 
                              {report.sharing.passwordProtected ? ' Password Protected' : ' Open Access'} • 
                              {report.sharing.allowDownload ? ' Download Enabled' : ' View Only'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'scheduled',
      label: 'Scheduled Reports',
      badge: scheduledReports.filter(s => s.status === 'active').length,
      content: (
        <div className="space-y-6">
          {/* Scheduled Reports Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Automated Report Schedules
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Templates
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-700">
                        {scheduledReports.filter(s => s.status === 'active').length}
                      </p>
                      <p className="text-sm text-green-600">Active Schedules</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-700">
                        {scheduledReports.reduce((avg, s) => avg + s.performance.averageGenerationTime, 0) / scheduledReports.length}min
                      </p>
                      <p className="text-sm text-blue-600">Avg Generation Time</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Gauge className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-700">
                        {(scheduledReports.reduce((avg, s) => avg + s.performance.successRate, 0) / scheduledReports.length).toFixed(1)}%
                      </p>
                      <p className="text-sm text-purple-600">Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheduled Reports List */}
              <div className="space-y-4">
                {scheduledReports.map((schedule) => (
                  <Card key={schedule.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100">
                            <Timer className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-slate-900 text-lg">{schedule.name}</h3>
                              <Badge 
                                variant={schedule.status === 'active' ? 'default' : 'secondary'}
                                className={schedule.status === 'active' ? 'bg-green-600' : ''}
                              >
                                {schedule.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                +{schedule.trustPoints} Trust Points
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-slate-600">{schedule.description}</p>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                              <div className="space-y-2">
                                <p className="text-slate-500 font-medium">Schedule Details</p>
                                <div className="space-y-1">
                                  <p className="flex items-center gap-2">
                                    <RefreshCw className="h-3 w-3" />
                                    {schedule.schedule.frequency} at {schedule.schedule.time}
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    Next: {schedule.nextRun}
                                  </p>
                                  {schedule.lastRun && (
                                    <p className="flex items-center gap-2">
                                      <CheckCircle className="h-3 w-3 text-green-600" />
                                      Last: {schedule.lastRun}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-slate-500 font-medium">Recipients</p>
                                <div className="space-y-1">
                                  {schedule.recipients.slice(0, 2).map((recipient, idx) => (
                                    <p key={idx} className="flex items-center gap-2 text-xs">
                                      <Mail className="h-3 w-3" />
                                      {recipient.name} ({recipient.role})
                                    </p>
                                  ))}
                                  {schedule.recipients.length > 2 && (
                                    <p className="text-xs text-slate-500">
                                      +{schedule.recipients.length - 2} more
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-slate-500 font-medium">Performance</p>
                                <div className="space-y-1">
                                  <p className="flex items-center gap-2 text-xs">
                                    <Gauge className="h-3 w-3" />
                                    {schedule.performance.successRate}% success rate
                                  </p>
                                  <p className="flex items-center gap-2 text-xs">
                                    <Timer className="h-3 w-3" />
                                    {schedule.performance.averageGenerationTime}min avg time
                                  </p>
                                  <p className="flex items-center gap-2 text-xs">
                                    <Users className="h-3 w-3" />
                                    {schedule.recipients.length} recipients
                                  </p>
                                </div>
                              </div>
                            </div>

                            {schedule.configuration && (
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs font-medium text-slate-700 mb-1">Configuration</p>
                                <div className="flex gap-4 text-xs text-slate-600">
                                  <span>Format: {schedule.configuration.format}</span>
                                  <span>•</span>
                                  <span>{schedule.configuration.includeAttachments ? 'With Attachments' : 'No Attachments'}</span>
                                  <span>•</span>
                                  <span>{schedule.configuration.watermark ? 'Watermarked' : 'No Watermark'}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'templates',
      label: 'Report Templates',
      badge: reportTemplates.length,
      content: (
        <div className="space-y-6">
          {/* Template Categories */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Report Template Library
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Template
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className="border border-slate-200 hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Template Header */}
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${template.color} text-white group-hover:scale-110 transition-transform`}>
                            <template.icon className="h-6 w-6" />
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-slate-600">{template.rating}</span>
                          </div>
                        </div>

                        {/* Template Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">{template.name}</h3>
                            {template.isFavorite && (
                              <Heart className="h-4 w-4 text-red-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{template.description}</p>
                        </div>

                        {/* Template Metadata */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-slate-500">Category</p>
                            <Badge variant="secondary" className="mt-1 text-xs capitalize">
                              {template.category}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-slate-500">Complexity</p>
                            <Badge variant="outline" className="mt-1 text-xs capitalize">
                              {template.complexity}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-slate-500">Frequency</p>
                            <p className="font-medium text-slate-900 capitalize">{template.frequency}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Time</p>
                            <p className="font-medium text-slate-900">{template.estimatedTime}min</p>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                          <p className="text-xs text-slate-500 font-medium">Features</p>
                          <div className="flex flex-wrap gap-1">
                            {template.interactiveFeatures.slice(0, 3).map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {template.interactiveFeatures.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{template.interactiveFeatures.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Frameworks */}
                        <div className="space-y-2">
                          <p className="text-xs text-slate-500 font-medium">Frameworks</p>
                          <div className="flex flex-wrap gap-1">
                            {template.frameworks.slice(0, 2).map((framework) => (
                              <Badge key={framework} variant="secondary" className="text-xs">
                                {framework}
                              </Badge>
                            ))}
                            {template.frameworks.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.frameworks.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Usage Stats */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <p className="text-slate-600">This Month</p>
                            <p className="font-semibold text-blue-600">{template.usage.thisMonth}</p>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <p className="text-slate-600">Total</p>
                            <p className="font-semibold text-green-600">{template.usage.totalGenerated}</p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <p className="text-slate-600">Trust Points</p>
                            <p className="font-semibold text-purple-600">{template.trustPoints}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                            Generate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics & Insights',
      badge: '12',
      content: (
        <div className="space-y-6">
          {/* Analytics Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Reporting Analytics & Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-700">247</p>
                      <p className="text-sm text-blue-600">Total Reports Generated</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-700">18min</p>
                      <p className="text-sm text-green-600">Avg Generation Time</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-700">4.7</p>
                      <p className="text-sm text-purple-600">User Satisfaction</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <Gauge className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold text-orange-700">97.3%</p>
                      <p className="text-sm text-orange-600">Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="border border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Report Generation Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="h-10 w-10 text-blue-600 opacity-50 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">Monthly generation trends</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Template Popularity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart2 className="h-10 w-10 text-green-600 opacity-50 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">Most used templates</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Stakeholder Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-10 w-10 text-purple-600 opacity-50 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">Report engagement by role</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="h-10 w-10 text-orange-600 opacity-50 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">System performance over time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights Section */}
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    AI-Generated Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-800">High Performance Alert</h4>
                          <p className="text-sm text-green-700">
                            Executive dashboard reports are performing 23% above industry benchmarks for engagement.
                            Consider expanding this template format to other report categories.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-800">Opportunity Identified</h4>
                          <p className="text-sm text-blue-700">
                            Risk assessment reports have 34% higher trust scores when including interactive drill-down features.
                            Recommend enabling interactive features for all risk templates.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-orange-800">Optimization Suggestion</h4>
                          <p className="text-sm text-orange-700">
                            Compliance report generation time has increased by 15% over the last month.
                            Consider optimizing data queries or implementing caching for frequently accessed compliance metrics.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <ComponentPageTemplate
      title="Reports & Analytics"
      subtitle="Executive Intelligence & Business Reporting Platform"
      description="Generate comprehensive reports, track performance metrics, and deliver actionable insights to stakeholders across all organizational levels."
      trustScore={87}
      trustPoints={calculateTrustPoints()}
      quickStats={quickStats}
      tabs={tabs}
      headerGradient="from-blue-50 via-purple-50 to-indigo-50"
      actions={
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Report
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      }
    />
  );
};