import React, { useState, useMemo } from 'react';
import { ComponentPageTemplate } from '@/components/templates/ComponentPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TrustPointsDisplay } from '@/components/shared/TrustPointsDisplay';
import { StatCard, TabConfiguration } from '@/types/componentTemplate';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Globe,
  Building2,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Eye,
  Copy,
  Archive,
  RefreshCw,
  GitBranch,
  Calendar,
  Hash,
  Tag,
  Workflow,
  Settings,
  Award,
  Target,
  Brain,
  BarChart3,
  Activity,
  Share2,
  BookOpen,
  UserCheck,
  ClipboardCheck,
  Star,
  Lightbulb,
  Database
} from 'lucide-react';

// Enhanced Policy Interface with comprehensive policy management features
interface Policy {
  id: string;
  title: string;
  description: string;
  category: 'security' | 'privacy' | 'operational' | 'compliance' | 'hr' | 'ai_governance' | 'data_governance';
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived' | 'expired';
  priority: 'critical' | 'high' | 'medium' | 'low';
  owner: string;
  reviewers: string[];
  approvers: string[];
  version: string;
  effectiveDate: string;
  nextReview: string;
  lastUpdated: string;
  compliance: string[];
  trustPoints: number;
  readCount: number;
  acknowledgments: number;
  totalUsers: number;
  tags: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  // Enhanced policy metadata
  documentSize: number; // in KB
  estimatedReadTime: number; // in minutes
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
  lastAudit?: string;
  nextAudit?: string;
  trainingRequired: boolean;
  digitalSignatureRequired: boolean;
  automaticReminders: boolean;
  relatedPolicies: string[];
  attachments: number;
  comments: number;
  approvalHistory: Array<{
    approver: string;
    date: string;
    action: 'approved' | 'rejected' | 'requested_changes';
    comments?: string;
  }>;
  // Compliance scoring
  complianceScore: number;
  gapAnalysis?: {
    identified: number;
    resolved: number;
    pending: number;
  };
}

// Enhanced Policy Template Interface
interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  frameworks: string[];
  sections: number;
  estimatedTime: string;
  trustPoints: number;
  icon: any;
  color: string;
  popularity: number;
  // Enhanced template features
  aiGenerated: boolean;
  lastUpdated: string;
  usageCount: number;
  rating: number;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  outcomes: string[];
  includedControls: number;
  customizable: boolean;
}

// Advanced Policy Workflow Interface
interface PolicyWorkflow {
  id: string;
  policyId: string;
  stage: 'creation' | 'review' | 'approval' | 'publication' | 'maintenance';
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  blockers: string[];
  progress: number;
}

// Policy Analytics Interface
interface PolicyAnalytics {
  totalPolicies: number;
  publishedPolicies: number;
  averageAcknowledgment: number;
  totalTrustPoints: number;
  complianceGaps: number;
  overdueReviews: number;
  pendingApprovals: number;
  trainingCompletion: number;
  riskReduction: number;
  costSavings: number;
  auditReadiness: number;
  stakeholderEngagement: number;
}

export const PolicyManagementNew: React.FC = () => {
  // State management for sophisticated policy workflows
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [workflowView, setWorkflowView] = useState('list');
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState('30d');

  // Comprehensive policy data with enhanced features
  const policies: Policy[] = [
    {
      id: 'pol-001',
      title: 'Information Security Policy',
      description: 'Comprehensive information security governance and control framework aligned with ISO 27001 and SOC 2',
      category: 'security',
      status: 'published',
      priority: 'critical',
      owner: 'Sarah Chen',
      reviewers: ['Mike Johnson', 'Lisa Wang', 'David Kim'],
      approvers: ['Chief Security Officer', 'Chief Compliance Officer'],
      version: '2.1',
      effectiveDate: '2024-01-15',
      nextReview: '2024-07-15',
      lastUpdated: '2024-01-10',
      compliance: ['ISO 27001', 'SOC 2', 'GDPR', 'NIST CSF'],
      trustPoints: 250,
      readCount: 156,
      acknowledgments: 142,
      totalUsers: 165,
      tags: ['security', 'governance', 'iso27001', 'mandatory'],
      riskLevel: 'high',
      documentSize: 145,
      estimatedReadTime: 15,
      businessImpact: 'critical',
      lastAudit: '2023-12-01',
      nextAudit: '2024-06-01',
      trainingRequired: true,
      digitalSignatureRequired: true,
      automaticReminders: true,
      relatedPolicies: ['pol-004', 'pol-005'],
      attachments: 3,
      comments: 8,
      approvalHistory: [
        { approver: 'Chief Security Officer', date: '2024-01-08', action: 'approved' },
        { approver: 'Chief Compliance Officer', date: '2024-01-09', action: 'approved' }
      ],
      complianceScore: 95,
      gapAnalysis: { identified: 12, resolved: 10, pending: 2 }
    },
    {
      id: 'pol-002',
      title: 'Data Privacy & Protection Policy',
      description: 'GDPR, CCPA, and LGPD compliant data protection procedures with automated privacy controls',
      category: 'privacy',
      status: 'review',
      priority: 'critical',
      owner: 'Tom Rodriguez',
      reviewers: ['Sarah Chen', 'Alex Kim', 'Maria Santos'],
      approvers: ['Chief Privacy Officer', 'Legal Counsel'],
      version: '1.3',
      effectiveDate: '2024-02-01',
      nextReview: '2024-08-01',
      lastUpdated: '2024-01-20',
      compliance: ['GDPR', 'CCPA', 'ISO 27701', 'LGPD'],
      trustPoints: 200,
      readCount: 134,
      acknowledgments: 128,
      totalUsers: 165,
      tags: ['privacy', 'gdpr', 'ccpa', 'data-protection'],
      riskLevel: 'high',
      documentSize: 98,
      estimatedReadTime: 12,
      businessImpact: 'critical',
      lastAudit: '2023-11-15',
      nextAudit: '2024-05-15',
      trainingRequired: true,
      digitalSignatureRequired: true,
      automaticReminders: true,
      relatedPolicies: ['pol-001', 'pol-007'],
      attachments: 5,
      comments: 12,
      approvalHistory: [
        { approver: 'Legal Counsel', date: '2024-01-18', action: 'requested_changes', comments: 'Update breach notification procedures' }
      ],
      complianceScore: 88,
      gapAnalysis: { identified: 8, resolved: 6, pending: 2 }
    },
    {
      id: 'pol-003',
      title: 'AI Ethics & Governance Policy',
      description: 'Comprehensive AI governance framework compliant with EU AI Act and ISO 42001 standards',
      category: 'ai_governance',
      status: 'draft',
      priority: 'high',
      owner: 'Dr. Emma Wilson',
      reviewers: ['Sarah Chen', 'Mike Johnson', 'Dr. Raj Patel'],
      approvers: ['Chief AI Officer', 'Ethics Committee'],
      version: '1.0',
      effectiveDate: '2024-03-01',
      nextReview: '2024-09-01',
      lastUpdated: '2024-01-22',
      compliance: ['EU AI Act', 'ISO 42001', 'IEEE Standards'],
      trustPoints: 180,
      readCount: 45,
      acknowledgments: 12,
      totalUsers: 165,
      tags: ['ai', 'ethics', 'governance', 'innovation'],
      riskLevel: 'medium',
      documentSize: 67,
      estimatedReadTime: 8,
      businessImpact: 'high',
      trainingRequired: true,
      digitalSignatureRequired: false,
      automaticReminders: true,
      relatedPolicies: ['pol-001', 'pol-006'],
      attachments: 2,
      comments: 5,
      approvalHistory: [],
      complianceScore: 75,
      gapAnalysis: { identified: 15, resolved: 8, pending: 7 }
    },
    {
      id: 'pol-004',
      title: 'Remote Work Security Policy',
      description: 'Zero-trust security controls and procedures for distributed workforce operations',
      category: 'security',
      status: 'approved',
      priority: 'high',
      owner: 'Mike Johnson',
      reviewers: ['Sarah Chen', 'Lisa Wang'],
      approvers: ['Chief Security Officer'],
      version: '1.2',
      effectiveDate: '2024-01-30',
      nextReview: '2024-07-30',
      lastUpdated: '2024-01-25',
      compliance: ['ISO 27001', 'NIST CSF', 'SOC 2'],
      trustPoints: 150,
      readCount: 98,
      acknowledgments: 89,
      totalUsers: 165,
      tags: ['remote', 'security', 'workforce', 'zero-trust'],
      riskLevel: 'medium',
      documentSize: 54,
      estimatedReadTime: 6,
      businessImpact: 'high',
      lastAudit: '2023-10-15',
      nextAudit: '2024-04-15',
      trainingRequired: true,
      digitalSignatureRequired: false,
      automaticReminders: true,
      relatedPolicies: ['pol-001'],
      attachments: 1,
      comments: 3,
      approvalHistory: [
        { approver: 'Chief Security Officer', date: '2024-01-26', action: 'approved' }
      ],
      complianceScore: 92,
      gapAnalysis: { identified: 6, resolved: 5, pending: 1 }
    },
    {
      id: 'pol-005',
      title: 'Incident Response & Crisis Management',
      description: 'Comprehensive incident response procedures with automated escalation and crisis management protocols',
      category: 'security',
      status: 'published',
      priority: 'critical',
      owner: 'Alex Kim',
      reviewers: ['Sarah Chen', 'Mike Johnson', 'Emergency Response Team'],
      approvers: ['Chief Security Officer', 'Chief Operating Officer'],
      version: '3.0',
      effectiveDate: '2023-12-01',
      nextReview: '2024-06-01',
      lastUpdated: '2023-11-28',
      compliance: ['ISO 27001', 'SOC 2', 'NIST CSF', 'ISO 27035'],
      trustPoints: 220,
      readCount: 187,
      acknowledgments: 165,
      totalUsers: 165,
      tags: ['incident', 'response', 'crisis', 'emergency'],
      riskLevel: 'critical',
      documentSize: 123,
      estimatedReadTime: 14,
      businessImpact: 'critical',
      lastAudit: '2023-09-01',
      nextAudit: '2024-03-01',
      trainingRequired: true,
      digitalSignatureRequired: true,
      automaticReminders: true,
      relatedPolicies: ['pol-001', 'pol-004'],
      attachments: 4,
      comments: 6,
      approvalHistory: [
        { approver: 'Chief Security Officer', date: '2023-11-25', action: 'approved' },
        { approver: 'Chief Operating Officer', date: '2023-11-27', action: 'approved' }
      ],
      complianceScore: 98,
      gapAnalysis: { identified: 4, resolved: 4, pending: 0 }
    },
    {
      id: 'pol-006',
      title: 'Cloud Security & Multi-Cloud Governance',
      description: 'Enterprise cloud security framework with multi-cloud governance and compliance automation',
      category: 'security',
      status: 'published',
      priority: 'high',
      owner: 'Lisa Wang',
      reviewers: ['Sarah Chen', 'Cloud Architecture Team'],
      approvers: ['Chief Technology Officer', 'Chief Security Officer'],
      version: '2.0',
      effectiveDate: '2024-01-01',
      nextReview: '2024-07-01',
      lastUpdated: '2023-12-28',
      compliance: ['CSA CCM', 'ISO 27001', 'SOC 2', 'FedRAMP'],
      trustPoints: 190,
      readCount: 112,
      acknowledgments: 95,
      totalUsers: 165,
      tags: ['cloud', 'multi-cloud', 'governance', 'automation'],
      riskLevel: 'high',
      documentSize: 89,
      estimatedReadTime: 10,
      businessImpact: 'high',
      lastAudit: '2023-08-01',
      nextAudit: '2024-02-01',
      trainingRequired: true,
      digitalSignatureRequired: false,
      automaticReminders: true,
      relatedPolicies: ['pol-001', 'pol-003'],
      attachments: 3,
      comments: 4,
      approvalHistory: [
        { approver: 'Chief Technology Officer', date: '2023-12-26', action: 'approved' },
        { approver: 'Chief Security Officer', date: '2023-12-27', action: 'approved' }
      ],
      complianceScore: 94,
      gapAnalysis: { identified: 7, resolved: 6, pending: 1 }
    }
  ];

  // Enhanced policy templates with AI-powered features
  const policyTemplates: PolicyTemplate[] = [
    {
      id: 'tpl-001',
      name: 'ISO 27001 Security Policy',
      description: 'AI-enhanced ISO 27001 compliant security policy template with automated control mapping',
      category: 'Security',
      frameworks: ['ISO 27001', 'SOC 2', 'NIST CSF'],
      sections: 12,
      estimatedTime: '4 hours',
      trustPoints: 300,
      icon: Shield,
      color: 'from-blue-600 to-blue-700',
      popularity: 95,
      aiGenerated: true,
      lastUpdated: '2024-01-15',
      usageCount: 234,
      rating: 4.8,
      complexity: 'advanced',
      prerequisites: ['Security awareness training', 'Risk assessment completion'],
      outcomes: ['ISO 27001 compliance', 'Reduced security risks', 'Audit readiness'],
      includedControls: 114,
      customizable: true
    },
    {
      id: 'tpl-002',
      name: 'GDPR Privacy Policy',
      description: 'GDPR Article 13 & 14 compliant privacy policy with automated data mapping integration',
      category: 'Privacy',
      frameworks: ['GDPR', 'ISO 27701', 'CCPA'],
      sections: 8,
      estimatedTime: '3 hours',
      trustPoints: 250,
      icon: Globe,
      color: 'from-green-600 to-green-700',
      popularity: 88,
      aiGenerated: true,
      lastUpdated: '2024-01-10',
      usageCount: 187,
      rating: 4.7,
      complexity: 'intermediate',
      prerequisites: ['Data mapping exercise', 'Legal review'],
      outcomes: ['GDPR compliance', 'Data protection readiness', 'Privacy by design'],
      includedControls: 45,
      customizable: true
    },
    {
      id: 'tpl-003',
      name: 'AI Governance Policy',
      description: 'EU AI Act and ISO 42001 compliant AI governance with ethical AI frameworks',
      category: 'AI Governance',
      frameworks: ['EU AI Act', 'ISO 42001', 'IEEE Standards'],
      sections: 10,
      estimatedTime: '5 hours',
      trustPoints: 280,
      icon: Brain,
      color: 'from-purple-600 to-purple-700',
      popularity: 72,
      aiGenerated: true,
      lastUpdated: '2024-01-20',
      usageCount: 89,
      rating: 4.6,
      complexity: 'advanced',
      prerequisites: ['AI risk assessment', 'Ethics committee approval'],
      outcomes: ['AI Act compliance', 'Ethical AI deployment', 'Risk mitigation'],
      includedControls: 67,
      customizable: true
    },
    {
      id: 'tpl-004',
      name: 'Cloud Security Policy',
      description: 'Multi-cloud security governance with zero-trust architecture and automated compliance',
      category: 'Security',
      frameworks: ['CSA CCM', 'NIST CSF', 'ISO 27001', 'FedRAMP'],
      sections: 9,
      estimatedTime: '3.5 hours',
      trustPoints: 200,
      icon: Building2,
      color: 'from-orange-600 to-orange-700',
      popularity: 81,
      aiGenerated: false,
      lastUpdated: '2024-01-05',
      usageCount: 156,
      rating: 4.5,
      complexity: 'intermediate',
      prerequisites: ['Cloud architecture review', 'Security assessment'],
      outcomes: ['Cloud security compliance', 'Zero-trust implementation', 'Multi-cloud governance'],
      includedControls: 78,
      customizable: true
    },
    {
      id: 'tpl-005',
      name: 'Incident Response Policy',
      description: 'Comprehensive incident response with automated escalation and crisis management integration',
      category: 'Security',
      frameworks: ['NIST CSF', 'ISO 27035', 'SANS'],
      sections: 7,
      estimatedTime: '2.5 hours',
      trustPoints: 220,
      icon: AlertTriangle,
      color: 'from-red-600 to-red-700',
      popularity: 90,
      aiGenerated: false,
      lastUpdated: '2023-12-28',
      usageCount: 203,
      rating: 4.9,
      complexity: 'intermediate',
      prerequisites: ['Emergency contact list', 'Communication channels setup'],
      outcomes: ['Rapid incident response', 'Reduced downtime', 'Compliance readiness'],
      includedControls: 34,
      customizable: true
    },
    {
      id: 'tpl-006',
      name: 'Remote Work Policy',
      description: 'Zero-trust remote work guidelines with security automation and productivity optimization',
      category: 'HR & Security',
      frameworks: ['ISO 27001', 'NIST CSF', 'COBIT'],
      sections: 6,
      estimatedTime: '2 hours',
      trustPoints: 150,
      icon: Users,
      color: 'from-teal-600 to-teal-700',
      popularity: 76,
      aiGenerated: false,
      lastUpdated: '2024-01-12',
      usageCount: 142,
      rating: 4.4,
      complexity: 'beginner',
      prerequisites: ['VPN setup', 'Security awareness training'],
      outcomes: ['Secure remote work', 'Productivity optimization', 'Compliance assurance'],
      includedControls: 28,
      customizable: true
    }
  ];

  // Calculate comprehensive analytics
  const analytics: PolicyAnalytics = useMemo(() => {
    const totalPolicies = policies.length;
    const publishedPolicies = policies.filter(p => p.status === 'published').length;
    const averageAcknowledgment = Math.round(
      policies.reduce((sum, p) => sum + (p.acknowledgments / p.totalUsers * 100), 0) / policies.length
    );
    const totalTrustPoints = policies.reduce((sum, p) => sum + p.trustPoints, 0);
    const complianceGaps = policies.reduce((sum, p) => sum + (p.gapAnalysis?.pending || 0), 0);
    const overdueReviews = policies.filter(p => new Date(p.nextReview) < new Date()).length;
    const pendingApprovals = policies.filter(p => p.status === 'review').length;
    const trainingCompletion = Math.round(
      policies.filter(p => p.trainingRequired).reduce((sum, p) => sum + (p.acknowledgments / p.totalUsers * 100), 0) / 
      policies.filter(p => p.trainingRequired).length || 1
    );
    const riskReduction = Math.round(
      policies.reduce((sum, p) => sum + p.complianceScore, 0) / policies.length
    );

    return {
      totalPolicies,
      publishedPolicies,
      averageAcknowledgment,
      totalTrustPoints,
      complianceGaps,
      overdueReviews,
      pendingApprovals,
      trainingCompletion,
      riskReduction,
      costSavings: 2400000, // Estimated annual cost savings
      auditReadiness: 94,
      stakeholderEngagement: 87
    };
  }, [policies]);

  // Enhanced filtering logic
  const filteredPolicies = useMemo(() => {
    return policies.filter(policy => {
      const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           policy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           policy.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || policy.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || policy.priority === selectedPriority;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });
  }, [policies, searchTerm, selectedCategory, selectedStatus, selectedPriority]);

  // Quick stats for the ComponentPageTemplate
  const quickStats: StatCard[] = [
    {
      label: 'Total Policies',
      value: analytics.totalPolicies,
      change: '+12%',
      trend: 'up',
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      description: 'Active policy documents',
      color: 'text-blue-600'
    },
    {
      label: 'Compliance Score',
      value: `€{analytics.riskReduction}%`,
      change: '+8%',
      trend: 'up',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      description: 'Average compliance rating',
      color: 'text-green-600'
    },
    {
      label: 'Acknowledgment Rate',
      value: `€{analytics.averageAcknowledgment}%`,
      change: '+5%',
      trend: 'up',
      icon: <UserCheck className="h-5 w-5 text-purple-600" />,
      description: 'Staff policy acknowledgment',
      color: 'text-purple-600'
    },
    {
      label: 'Trust Points',
      value: analytics.totalTrustPoints.toLocaleString(),
      change: '+15%',
      trend: 'up',
      icon: <Award className="h-5 w-5 text-orange-600" />,
      description: 'Cumulative trust equity',
      color: 'text-orange-600'
    },
    {
      label: 'Risk Reduction',
      value: `€{analytics.riskReduction}%`,
      change: '+12%',
      trend: 'up',
      icon: <Shield className="h-5 w-5 text-red-600" />,
      description: 'Organizational risk mitigation',
      color: 'text-red-600'
    },
    {
      label: 'Cost Savings',
      value: `€€{(analytics.costSavings / 1000000).toFixed(1)}M`,
      change: '+22%',
      trend: 'up',
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
      description: 'Annual compliance cost savings',
      color: 'text-emerald-600'
    },
    {
      label: 'Audit Readiness',
      value: `€{analytics.auditReadiness}%`,
      change: '+6%',
      trend: 'up',
      icon: <ClipboardCheck className="h-5 w-5 text-indigo-600" />,
      description: 'Audit preparation status',
      color: 'text-indigo-600'
    },
    {
      label: 'Pending Actions',
      value: analytics.complianceGaps + analytics.overdueReviews + analytics.pendingApprovals,
      change: '-18%',
      trend: 'down',
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      description: 'Items requiring attention',
      color: 'text-amber-600'
    }
  ];

  // Utility functions for policy management
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return Shield;
      case 'privacy': return Globe;
      case 'operational': return Settings;
      case 'compliance': return FileText;
      case 'hr': return Users;
      case 'ai_governance': return Brain;
      case 'data_governance': return Database;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'from-blue-600 to-blue-700';
      case 'privacy': return 'from-green-600 to-green-700';
      case 'operational': return 'from-purple-600 to-purple-700';
      case 'compliance': return 'from-orange-600 to-orange-700';
      case 'hr': return 'from-teal-600 to-teal-700';
      case 'ai_governance': return 'from-violet-600 to-violet-700';
      case 'data_governance': return 'from-cyan-600 to-cyan-700';
      default: return 'from-slate-600 to-slate-700';
    }
  };

  // Enhanced policy card component
  const PolicyCard: React.FC<{ policy: Policy }> = ({ policy }) => {
    const IconComponent = getCategoryIcon(policy.category);
    const categoryColor = getCategoryColor(policy.category);
    
    return (
      <Card 
        className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-slate-200 card-professional"
        onClick={() => setSelectedPolicy(policy.id)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r €{categoryColor} flex items-center justify-center shadow-lg`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge riskLevel={policy.riskLevel} />
              <StatusBadge status={policy.status} />
              {policy.trainingRequired && (
                <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-200 text-yellow-700">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Training
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-lg font-semibold">{policy.title}</CardTitle>
          <p className="text-sm text-slate-600 line-clamp-2">{policy.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Enhanced Policy Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Version:</span>
                <div className="font-medium flex items-center gap-1">
                  <GitBranch className="h-3 w-3" />
                  {policy.version}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Owner:</span>
                <div className="font-medium">{policy.owner}</div>
              </div>
              <div>
                <span className="text-slate-500">Next Review:</span>
                <div className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(policy.nextReview).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Read Time:</span>
                <div className="font-medium">{policy.estimatedReadTime} min</div>
              </div>
            </div>

            {/* Compliance Score & Acknowledgment Progress */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Compliance Score</span>
                  <span className="font-medium">{policy.complianceScore}%</span>
                </div>
                <Progress value={policy.complianceScore} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Acknowledgment Rate</span>
                  <span className="font-medium">{Math.round((policy.acknowledgments / policy.totalUsers) * 100)}%</span>
                </div>
                <Progress value={(policy.acknowledgments / policy.totalUsers) * 100} className="h-2" />
              </div>
            </div>

            {/* Compliance Frameworks */}
            <div className="flex flex-wrap gap-1">
              {policy.compliance.slice(0, 3).map((framework) => (
                <Badge key={framework} variant="outline" className="text-xs">
                  {framework}
                </Badge>
              ))}
              {policy.compliance.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{policy.compliance.length - 3} more
                </Badge>
              )}
            </div>

            {/* Enhanced Tags */}
            <div className="flex flex-wrap gap-1">
              {policy.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {policy.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{policy.tags.length - 2}
                </Badge>
              )}
            </div>

            {/* Gap Analysis Indicators */}
            {policy.gapAnalysis && policy.gapAnalysis.pending > 0 && (
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                <AlertTriangle className="h-3 w-3" />
                {policy.gapAnalysis.pending} compliance gaps pending
              </div>
            )}

            {/* Actions and Trust Points */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                {policy.attachments > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {policy.attachments} files
                  </Badge>
                )}
              </div>
              <TrustPointsDisplay points={policy.trustPoints} size="sm" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Enhanced template card component
  const TemplateCard: React.FC<{ template: PolicyTemplate }> = ({ template }) => {
    const IconComponent = template.icon;
    
    return (
      <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-slate-200 card-professional">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r €{template.color} flex items-center justify-center shadow-lg`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {template.popularity}% popular
              </Badge>
              {template.aiGenerated && (
                <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  AI
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
          <p className="text-sm text-slate-600 line-clamp-2">{template.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Sections:</span>
                <div className="font-medium">{template.sections}</div>
              </div>
              <div>
                <span className="text-slate-500">Est. Time:</span>
                <div className="font-medium">{template.estimatedTime}</div>
              </div>
              <div>
                <span className="text-slate-500">Complexity:</span>
                <div className="font-medium capitalize">{template.complexity}</div>
              </div>
              <div>
                <span className="text-slate-500">Controls:</span>
                <div className="font-medium">{template.includedControls}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{template.rating}</span>
              </div>
              <span className="text-slate-500">•</span>
              <span className="text-slate-500">{template.usageCount} uses</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {template.frameworks.map((framework) => (
                <Badge key={framework} variant="outline" className="text-xs">
                  {framework}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Use Template
              </Button>
              <div className="ml-3">
                <TrustPointsDisplay points={template.trustPoints} size="sm" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Tab configuration for ComponentPageTemplate
  const tabs: TabConfiguration[] = [
    {
      id: 'policies',
      label: 'Policy Library',
      badge: filteredPolicies.length,
      content: (
        <div className="space-y-6">
          {/* Enhanced Search and Filters */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search policies, descriptions, owners, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="security">Security</option>
                  <option value="privacy">Privacy</option>
                  <option value="ai_governance">AI Governance</option>
                  <option value="operational">Operational</option>
                  <option value="compliance">Compliance</option>
                  <option value="hr">HR</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="approved">Approved</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                <Button 
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <Card className="p-4 border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Priorities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Training Required</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="all">All</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Review Status</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="all">All</option>
                      <option value="current">Current</option>
                      <option value="due_soon">Due Soon</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Policy Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPolicies.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>

          {filteredPolicies.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No policies found</h3>
              <p className="text-slate-600">Try adjusting your search criteria or create a new policy.</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'templates',
      label: 'AI Templates',
      badge: policyTemplates.length,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">AI-Powered Policy Templates</h3>
              <p className="text-slate-600">Intelligent templates with automated compliance mapping and best practices</p>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Lightbulb className="h-3 w-3 mr-1" />
              AI-Enhanced
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policyTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'workflows',
      label: 'Workflows',
      badge: '3 Active',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Policy Workflows</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Workflow
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Automation
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Workflows */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Active Workflows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <div className="font-medium">AI Ethics Policy Review</div>
                      <div className="text-sm text-slate-600">Dr. Emma Wilson • Due in 3 days</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div>
                      <div className="font-medium">Privacy Policy Approval</div>
                      <div className="text-sm text-slate-600">Legal Counsel • Due yesterday</div>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Overdue</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <div className="font-medium">Security Policy Publication</div>
                      <div className="text-sm text-slate-600">Auto-publish • Ready</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Automation Rules */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Automation Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium">Auto Review Reminders</div>
                      <div className="text-sm text-slate-600">7 days before due date</div>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium">Compliance Validation</div>
                      <div className="text-sm text-slate-600">On policy updates</div>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium">Stakeholder Notifications</div>
                      <div className="text-sm text-slate-600">On status changes</div>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      badge: 'Live',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Policy Analytics & Insights</h3>
            <div className="flex gap-2">
              <select
                value={analyticsTimeRange}
                onChange={(e) => setAnalyticsTimeRange(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Policy Adoption Trends */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Adoption Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policies.slice(0, 4).map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium">{policy.title}</div>
                        <div className="text-sm text-slate-600">{policy.acknowledgments}/{policy.totalUsers} acknowledged</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress 
                          value={(policy.acknowledgments / policy.totalUsers) * 100} 
                          className="w-24 h-2" 
                        />
                        <span className="text-sm font-medium w-12 text-right">
                          {Math.round((policy.acknowledgments / policy.totalUsers) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Gaps */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Compliance Gaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policies
                    .filter(p => p.gapAnalysis && p.gapAnalysis.pending > 0)
                    .slice(0, 4)
                    .map((policy) => (
                      <div key={policy.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div>
                          <div className="font-medium">{policy.title}</div>
                          <div className="text-sm text-slate-600">{policy.gapAnalysis?.pending} gaps pending</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-amber-700">
                            {policy.gapAnalysis?.pending} issues
                          </div>
                          <div className="text-xs text-slate-500">
                            {policy.gapAnalysis?.resolved} resolved
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Review Schedule */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Review Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policies
                    .filter(p => p.status === 'published')
                    .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime())
                    .slice(0, 4)
                    .map((policy) => {
                      const daysUntilReview = Math.ceil((new Date(policy.nextReview).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      const isOverdue = daysUntilReview < 0;
                      return (
                        <div key={policy.id} className={`flex items-center justify-between p-3 rounded-lg €{
                          isOverdue ? 'bg-red-50 border border-red-200' : 'bg-slate-50'
                        }`}>
                          <div>
                            <div className="font-medium">{policy.title}</div>
                            <div className="text-sm text-slate-600">v{policy.version}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium €{isOverdue ? 'text-red-700' : ''}`}>
                              {isOverdue ? 'Overdue' : `€{daysUntilReview} days`}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(policy.nextReview).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Training Effectiveness */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Training Effectiveness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">{analytics.trainingCompletion}%</div>
                      <div className="text-sm text-green-600">Completion Rate</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">4.8</div>
                      <div className="text-sm text-blue-600">Avg. Rating</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Security Awareness</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Privacy Training</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>AI Ethics</span>
                      <span className="font-medium">73%</span>
                    </div>
                    <Progress value={73} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'compliance',
      label: 'Compliance',
      badge: `€{analytics.riskReduction}%`,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Compliance Framework Mapping</h3>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Export Matrix
            </Button>
          </div>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Framework Coverage Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['ISO 27001', 'GDPR', 'SOC 2', 'NIST CSF', 'EU AI Act', 'ISO 42001'].map((framework) => {
                  const frameworkPolicies = policies.filter(p => p.compliance.includes(framework));
                  const coverage = (frameworkPolicies.length / analytics.totalPolicies) * 100;
                  const avgCompliance = frameworkPolicies.length > 0 
                    ? Math.round(frameworkPolicies.reduce((sum, p) => sum + p.complianceScore, 0) / frameworkPolicies.length)
                    : 0;
                  
                  return (
                    <div key={framework} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{framework}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {frameworkPolicies.length} policies
                          </Badge>
                          <Badge className={
                            avgCompliance >= 90 ? 'bg-green-100 text-green-800' :
                            avgCompliance >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {avgCompliance}% compliant
                          </Badge>
                        </div>
                      </div>
                      <Progress value={coverage} className="h-2" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {frameworkPolicies.slice(0, 4).map((policy) => (
                          <div key={policy.id} className="text-xs p-2 bg-slate-50 rounded border hover:bg-slate-100 transition-colors">
                            <div className="font-medium truncate">{policy.title}</div>
                            <div className="text-slate-500">{policy.complianceScore}%</div>
                          </div>
                        ))}
                        {frameworkPolicies.length > 4 && (
                          <div className="text-xs p-2 bg-slate-100 rounded border flex items-center justify-center text-slate-600">
                            +{frameworkPolicies.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { range: '90-100%', count: policies.filter(p => p.complianceScore >= 90).length, color: 'bg-green-500' },
                    { range: '80-89%', count: policies.filter(p => p.complianceScore >= 80 && p.complianceScore < 90).length, color: 'bg-yellow-500' },
                    { range: '70-79%', count: policies.filter(p => p.complianceScore >= 70 && p.complianceScore < 80).length, color: 'bg-orange-500' },
                    { range: 'Below 70%', count: policies.filter(p => p.complianceScore < 70).length, color: 'bg-red-500' }
                  ].map((item) => (
                    <div key={item.range} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded €{item.color}`}></div>
                        <span className="text-sm">{item.range}</span>
                      </div>
                      <Badge variant="outline">{item.count} policies</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Improvement Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900">Reduce compliance gaps</div>
                    <div className="text-sm text-blue-700">Target: 0 gaps by Q2 2024</div>
                    <div className="text-xs text-blue-600 mt-1">Current: {analytics.complianceGaps} gaps</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-900">Increase acknowledgment rate</div>
                    <div className="text-sm text-green-700">Target: 95% by Q1 2024</div>
                    <div className="text-xs text-green-600 mt-1">Current: {analytics.averageAcknowledgment}%</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-900">Enhance training completion</div>
                    <div className="text-sm text-purple-700">Target: 98% by Q3 2024</div>
                    <div className="text-xs text-purple-600 mt-1">Current: {analytics.trainingCompletion}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <ComponentPageTemplate
      title="Policy Management 2.0"
      subtitle="AI-Powered Governance & Compliance Platform"
      description="Comprehensive policy lifecycle management with automated compliance tracking, intelligent workflows, and real-time analytics for enterprise-grade governance."
      trustScore={96}
      trustPoints={analytics.totalTrustPoints}
      quickStats={quickStats}
      tabs={tabs}
      headerGradient="from-slate-50 via-white to-blue-50/30"
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Policy
          </Button>
        </div>
      }
    />
  );
};