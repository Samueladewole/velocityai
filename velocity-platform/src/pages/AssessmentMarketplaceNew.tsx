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
  ShoppingCart, 
  Star, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Globe,
  Building2,
  Search,
  Filter,
  Plus,
  Award,
  Target,
  Brain,
  FileText,
  Verified,
  DollarSign,
  Package,
  Heart,
  Share2,
  MessageSquare,
  Bookmark,
  Play,
  Settings,
  BarChart3,
  Activity,
  Database,
  Lightbulb,
  UserCheck,
  ClipboardCheck,
  BookOpen,
  GitBranch,
  Calendar,
  Hash,
  Tag,
  Workflow,
  Copy,
  Archive,
  RefreshCw,
  Edit,
  Upload,
  ExternalLink,
  Layers,
  Gauge,
  Timer,
  Coins,
  CreditCard,
  LineChart,
  PieChart,
  BarChart2
} from 'lucide-react';

// Enhanced Assessment Interface with comprehensive marketplace features
interface Assessment {
  id: string;
  title: string;
  description: string;
  category: 'security' | 'privacy' | 'compliance' | 'risk' | 'ai-governance' | 'operational' | 'quality';
  type: 'questionnaire' | 'checklist' | 'audit' | 'maturity' | 'gap-analysis' | 'risk-assessment' | 'control-assessment';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  framework: string[];
  price: number;
  priceType: 'free' | 'one-time' | 'subscription' | 'usage-based';
  rating: number;
  reviews: number;
  downloads: number;
  trustPoints: number;
  estimatedTime: number; // minutes
  questions: number;
  provider: {
    name: string;
    verified: boolean;
    avatar: string;
    rating: number;
    assessmentsPublished: number;
    trustScore: number;
    memberSince: string;
  };
  tags: string[];
  lastUpdated: string;
  features: string[];
  isFavorite: boolean;
  isOwned: boolean;
  previewAvailable: boolean;
  // Enhanced marketplace features
  publishedDate: string;
  versionHistory: Array<{
    version: string;
    date: string;
    changes: string;
  }>;
  compatibility: string[];
  languages: string[];
  businessDomains: string[];
  integrations: string[];
  customizationLevel: 'none' | 'basic' | 'moderate' | 'extensive';
  supportLevel: 'community' | 'standard' | 'premium' | 'enterprise';
  certifications: string[];
  complianceScope: string[];
  riskCategories: string[];
  industryVerticals: string[];
  executionModes: Array<'self-assessment' | 'guided' | 'automated' | 'hybrid'>;
  reportingFeatures: string[];
  // Quality metrics
  completionRate: number;
  customerSatisfaction: number;
  averageScore: number;
  benchmarkData: boolean;
  // Marketplace analytics
  viewCount: number;
  saveCount: number;
  shareCount: number;
  recentActivity: number; // views in last 30 days
  trending: boolean;
  featured: boolean;
  recommended: boolean;
  // Licensing and usage
  license: 'open' | 'commercial' | 'enterprise' | 'custom';
  usageRights: string[];
  restrictions: string[];
  attribution: boolean;
  redistribution: boolean;
  // Community features
  communityRating: number;
  communityComments: number;
  communityContributions: number;
  forkedCount: number;
  derivedAssessments: number;
}

// Enhanced Marketplace Provider Interface
interface MarketplaceProvider {
  id: string;
  name: string;
  type: 'individual' | 'organization' | 'certified_partner' | 'enterprise';
  verified: boolean;
  trustScore: number;
  specializations: string[];
  assessmentsCount: number;
  totalDownloads: number;
  averageRating: number;
  memberSince: string;
  location: string;
  certifications: string[];
  endorsements: number;
  responseTime: number; // hours
  supportQuality: number;
}

// Assessment Execution and Results Interface
interface AssessmentExecution {
  id: string;
  assessmentId: string;
  executorId: string;
  startedAt: string;
  completedAt?: string;
  status: 'not_started' | 'in_progress' | 'paused' | 'completed' | 'abandoned';
  progress: number;
  currentQuestion: number;
  responses: Record<string, any>;
  timeSpent: number; // minutes
  score?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  gapAnalysis?: {
    identified: number;
    resolved: number;
    pending: number;
  };
  complianceStatus: Record<string, boolean>;
  trustPointsEarned: number;
}

// Marketplace Statistics Interface
interface MarketplaceStats {
  totalAssessments: number;
  freeAssessments: number;
  premiumAssessments: number;
  verifiedProviders: number;
  totalDownloads: number;
  averageRating: number;
  activeUsers: number;
  recentUploads: number;
  totalTrustPointsDistributed: number;
  categories: Array<{ name: string; count: number; growth: number }>;
  topFrameworks: Array<{ name: string; count: number; adoption: number }>;
  qualityMetrics: {
    averageCompletionRate: number;
    averageCustomerSatisfaction: number;
    certifiedAssessments: number;
    communityRating: number;
  };
  marketplaceTrends: {
    mostDownloaded: string[];
    trending: string[];
    recentlyUpdated: string[];
    highestRated: string[];
  };
}

// Assessment Library Management Interface
interface AssessmentLibrary {
  owned: Assessment[];
  favorites: Assessment[];
  inProgress: AssessmentExecution[];
  completed: AssessmentExecution[];
  shared: Assessment[];
  drafted: Assessment[];
  analytics: {
    totalAssessments: number;
    completionRate: number;
    averageScore: number;
    trustPointsEarned: number;
    timeSpent: number;
    strengths: string[];
    improvementAreas: string[];
  };
}

export const AssessmentMarketplaceNew: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceType, setSelectedPriceType] = useState('all');
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Enhanced assessment data with comprehensive marketplace features
  const assessments: Assessment[] = [
    {
      id: 'ass-001',
      title: 'ISO 27001 Readiness Assessment',
      description: 'Comprehensive readiness evaluation for ISO 27001 certification with detailed gap analysis and remediation roadmap',
      category: 'security',
      type: 'maturity',
      difficulty: 'intermediate',
      framework: ['ISO 27001', 'ISO 27002'],
      price: 0,
      priceType: 'free',
      rating: 4.8,
      reviews: 245,
      downloads: 3420,
      trustPoints: 300,
      estimatedTime: 120,
      questions: 98,
      provider: {
        name: 'ERIP Security',
        verified: true,
        avatar: '🛡️',
        rating: 4.9,
        assessmentsPublished: 12,
        trustScore: 950,
        memberSince: '2023-01-15'
      },
      tags: ['iso27001', 'security', 'certification', 'gap-analysis'],
      lastUpdated: '2024-01-15',
      publishedDate: '2023-06-20',
      features: ['Automated scoring', 'Gap analysis', 'Remediation plan', 'Trust Points rewards'],
      isFavorite: false,
      isOwned: false,
      previewAvailable: true,
      versionHistory: [
        { version: '2.1', date: '2024-01-15', changes: 'Updated control requirements' },
        { version: '2.0', date: '2023-12-01', changes: 'Major framework update' }
      ],
      compatibility: ['Web', 'Mobile', 'API'],
      languages: ['English', 'Spanish', 'German'],
      businessDomains: ['IT', 'Finance', 'Healthcare'],
      integrations: ['SIEM', 'GRC platforms', 'Ticketing systems'],
      customizationLevel: 'extensive',
      supportLevel: 'premium',
      certifications: ['ISO 27001:2022', 'NIST approved'],
      complianceScope: ['SOX', 'HIPAA', 'GDPR'],
      riskCategories: ['Operational', 'Technical', 'Legal'],
      industryVerticals: ['Technology', 'Financial Services', 'Healthcare'],
      executionModes: ['self-assessment', 'guided', 'automated'],
      reportingFeatures: ['Executive summary', 'Technical details', 'Action plans'],
      completionRate: 87,
      customerSatisfaction: 4.6,
      averageScore: 72,
      benchmarkData: true,
      viewCount: 15420,
      saveCount: 892,
      shareCount: 234,
      recentActivity: 1250,
      trending: true,
      featured: true,
      recommended: true,
      license: 'open',
      usageRights: ['Commercial use', 'Modification', 'Distribution'],
      restrictions: ['Attribution required'],
      attribution: true,
      redistribution: true,
      communityRating: 4.7,
      communityComments: 89,
      communityContributions: 23,
      forkedCount: 45,
      derivedAssessments: 12
    },
    {
      id: 'ass-002',
      title: 'GDPR Compliance Audit',
      description: 'Complete GDPR compliance assessment with privacy impact analysis and data flow mapping',
      category: 'privacy',
      type: 'audit',
      difficulty: 'intermediate',
      framework: ['GDPR', 'ISO 27701'],
      price: 149,
      priceType: 'one-time',
      rating: 4.6,
      reviews: 189,
      downloads: 2156,
      trustPoints: 250,
      estimatedTime: 90,
      questions: 67,
      provider: {
        name: 'Privacy Experts',
        verified: true,
        avatar: '🔒',
        rating: 4.7,
        assessmentsPublished: 8,
        trustScore: 875,
        memberSince: '2023-03-10'
      },
      tags: ['gdpr', 'privacy', 'compliance', 'audit'],
      lastUpdated: '2024-01-20',
      publishedDate: '2023-07-15',
      features: ['DPIA templates', 'Legal guidance', 'Compliance dashboard', 'Action items'],
      isFavorite: true,
      isOwned: false,
      previewAvailable: true,
      versionHistory: [
        { version: '1.5', date: '2024-01-20', changes: 'Added new DPIA requirements' },
        { version: '1.4', date: '2023-11-15', changes: 'Enhanced data mapping' }
      ],
      compatibility: ['Web', 'Mobile'],
      languages: ['English', 'French', 'Italian'],
      businessDomains: ['Legal', 'HR', 'Marketing'],
      integrations: ['Data mapping tools', 'Privacy management platforms'],
      customizationLevel: 'moderate',
      supportLevel: 'standard',
      certifications: ['CIPP/E certified', 'Legal reviewed'],
      complianceScope: ['GDPR', 'CCPA', 'LGPD'],
      riskCategories: ['Privacy', 'Legal', 'Reputational'],
      industryVerticals: ['All industries'],
      executionModes: ['self-assessment', 'guided'],
      reportingFeatures: ['Legal summary', 'Technical recommendations', 'DPIA reports'],
      completionRate: 92,
      customerSatisfaction: 4.5,
      averageScore: 68,
      benchmarkData: true,
      viewCount: 8950,
      saveCount: 567,
      shareCount: 123,
      recentActivity: 789,
      trending: false,
      featured: true,
      recommended: true,
      license: 'commercial',
      usageRights: ['Single organization'],
      restrictions: ['No redistribution'],
      attribution: false,
      redistribution: false,
      communityRating: 4.5,
      communityComments: 45,
      communityContributions: 8,
      forkedCount: 12,
      derivedAssessments: 3
    },
    {
      id: 'ass-003',
      title: 'SOC 2 Type II Preparation',
      description: 'Comprehensive SOC 2 Type II readiness assessment with control validation and evidence collection guidance',
      category: 'compliance',
      type: 'checklist',
      difficulty: 'advanced',
      framework: ['SOC 2', 'AICPA TSC'],
      price: 299,
      priceType: 'one-time',
      rating: 4.9,
      reviews: 134,
      downloads: 1892,
      trustPoints: 400,
      estimatedTime: 180,
      questions: 156,
      provider: {
        name: 'Audit Solutions',
        verified: true,
        avatar: '📋',
        rating: 4.8,
        assessmentsPublished: 15,
        trustScore: 920,
        memberSince: '2022-11-05'
      },
      tags: ['soc2', 'audit', 'compliance', 'controls'],
      lastUpdated: '2024-01-18',
      publishedDate: '2023-05-10',
      features: ['Control testing', 'Evidence collection', 'Audit preparation', 'Continuous monitoring'],
      isFavorite: false,
      isOwned: true,
      previewAvailable: true,
      versionHistory: [
        { version: '3.2', date: '2024-01-18', changes: 'Updated TSC criteria' },
        { version: '3.1', date: '2023-10-20', changes: 'Enhanced control testing' }
      ],
      compatibility: ['Web', 'API'],
      languages: ['English'],
      businessDomains: ['Finance', 'Technology', 'SaaS'],
      integrations: ['Audit management systems', 'Evidence collection tools'],
      customizationLevel: 'extensive',
      supportLevel: 'enterprise',
      certifications: ['CPA reviewed', 'SOC 2 certified'],
      complianceScope: ['SOC 2', 'SOC 1', 'ISO 27001'],
      riskCategories: ['Operational', 'Financial', 'Compliance'],
      industryVerticals: ['Technology', 'SaaS', 'Financial Services'],
      executionModes: ['guided', 'automated'],
      reportingFeatures: ['Audit readiness report', 'Control gap analysis', 'Evidence tracking'],
      completionRate: 78,
      customerSatisfaction: 4.8,
      averageScore: 84,
      benchmarkData: true,
      viewCount: 12340,
      saveCount: 678,
      shareCount: 189,
      recentActivity: 945,
      trending: true,
      featured: true,
      recommended: false,
      license: 'commercial',
      usageRights: ['Enterprise license'],
      restrictions: ['Named users only'],
      attribution: false,
      redistribution: false,
      communityRating: 4.8,
      communityComments: 67,
      communityContributions: 15,
      forkedCount: 8,
      derivedAssessments: 5
    },
    {
      id: 'ass-004',
      title: 'AI Risk Assessment Framework',
      description: 'EU AI Act compliance assessment with risk categorization, bias detection, and mitigation planning',
      category: 'ai-governance',
      type: 'questionnaire',
      difficulty: 'advanced',
      framework: ['EU AI Act', 'ISO 42001'],
      price: 199,
      priceType: 'one-time',
      rating: 4.7,
      reviews: 89,
      downloads: 1456,
      trustPoints: 350,
      estimatedTime: 150,
      questions: 112,
      provider: {
        name: 'AI Governance Pro',
        verified: true,
        avatar: '🤖',
        rating: 4.6,
        assessmentsPublished: 6,
        trustScore: 780,
        memberSince: '2023-08-22'
      },
      tags: ['ai', 'risk', 'governance', 'eu-ai-act'],
      lastUpdated: '2024-01-22',
      publishedDate: '2023-09-01',
      features: ['Risk categorization', 'Mitigation planning', 'Compliance mapping', 'AI system registry'],
      isFavorite: false,
      isOwned: false,
      previewAvailable: true,
      versionHistory: [
        { version: '1.3', date: '2024-01-22', changes: 'Updated for final AI Act' },
        { version: '1.2', date: '2023-12-10', changes: 'Added bias detection' }
      ],
      compatibility: ['Web', 'API'],
      languages: ['English', 'German', 'French'],
      businessDomains: ['AI/ML', 'Technology', 'Research'],
      integrations: ['ML monitoring tools', 'Model registries'],
      customizationLevel: 'extensive',
      supportLevel: 'premium',
      certifications: ['AI expert reviewed', 'Legal compliance verified'],
      complianceScope: ['EU AI Act', 'GDPR', 'ISO 42001'],
      riskCategories: ['AI Ethics', 'Algorithmic', 'Data'],
      industryVerticals: ['Technology', 'Healthcare', 'Finance', 'Automotive'],
      executionModes: ['self-assessment', 'guided', 'automated'],
      reportingFeatures: ['Risk classification', 'Compliance roadmap', 'Mitigation plans'],
      completionRate: 85,
      customerSatisfaction: 4.4,
      averageScore: 76,
      benchmarkData: false,
      viewCount: 7890,
      saveCount: 445,
      shareCount: 98,
      recentActivity: 567,
      trending: true,
      featured: false,
      recommended: true,
      license: 'commercial',
      usageRights: ['Commercial use', 'Customization'],
      restrictions: ['Industry specific'],
      attribution: true,
      redistribution: false,
      communityRating: 4.6,
      communityComments: 34,
      communityContributions: 12,
      forkedCount: 18,
      derivedAssessments: 7
    },
    {
      id: 'ass-005',
      title: 'Cloud Security Posture Assessment',
      description: 'Multi-cloud security assessment covering AWS, Azure, and GCP with automated configuration analysis',
      category: 'security',
      type: 'audit',
      difficulty: 'intermediate',
      framework: ['CSA CCM', 'NIST CSF', 'CIS Controls'],
      price: 0,
      priceType: 'free',
      rating: 4.5,
      reviews: 312,
      downloads: 4567,
      trustPoints: 200,
      estimatedTime: 75,
      questions: 84,
      provider: {
        name: 'Cloud Security Guild',
        verified: true,
        avatar: '☁️',
        rating: 4.4,
        assessmentsPublished: 18,
        trustScore: 820,
        memberSince: '2022-12-15'
      },
      tags: ['cloud', 'security', 'aws', 'azure', 'gcp'],
      lastUpdated: '2024-01-12',
      publishedDate: '2023-04-20',
      features: ['Multi-cloud support', 'Best practices', 'Automated checks', 'Remediation guides'],
      isFavorite: true,
      isOwned: false,
      previewAvailable: true,
      versionHistory: [
        { version: '2.4', date: '2024-01-12', changes: 'Added GCP support' },
        { version: '2.3', date: '2023-09-30', changes: 'Enhanced Azure coverage' }
      ],
      compatibility: ['Web', 'API', 'CLI'],
      languages: ['English', 'Japanese', 'Korean'],
      businessDomains: ['DevOps', 'Infrastructure', 'Security'],
      integrations: ['Cloud APIs', 'SIEM systems', 'DevOps tools'],
      customizationLevel: 'moderate',
      supportLevel: 'community',
      certifications: ['Cloud security certified', 'CSA approved'],
      complianceScope: ['SOC 2', 'ISO 27001', 'FedRAMP'],
      riskCategories: ['Infrastructure', 'Data', 'Access'],
      industryVerticals: ['Technology', 'Startups', 'Enterprise'],
      executionModes: ['self-assessment', 'automated'],
      reportingFeatures: ['Configuration analysis', 'Best practice recommendations', 'Risk scoring'],
      completionRate: 91,
      customerSatisfaction: 4.3,
      averageScore: 65,
      benchmarkData: true,
      viewCount: 18750,
      saveCount: 1234,
      shareCount: 345,
      recentActivity: 1450,
      trending: false,
      featured: false,
      recommended: true,
      license: 'open',
      usageRights: ['All use cases'],
      restrictions: ['Attribution preferred'],
      attribution: true,
      redistribution: true,
      communityRating: 4.4,
      communityComments: 156,
      communityContributions: 67,
      forkedCount: 89,
      derivedAssessments: 23
    },
    {
      id: 'ass-006',
      title: 'Cybersecurity Maturity Model',
      description: 'NIST Cybersecurity Framework maturity assessment with organizational capability evaluation and roadmap planning',
      category: 'security',
      type: 'maturity',
      difficulty: 'beginner',
      framework: ['NIST CSF', 'NIST 800-53'],
      price: 49,
      priceType: 'one-time',
      rating: 4.3,
      reviews: 267,
      downloads: 3890,
      trustPoints: 150,
      estimatedTime: 60,
      questions: 45,
      provider: {
        name: 'CyberMaturity',
        verified: false,
        avatar: '🎯',
        rating: 4.2,
        assessmentsPublished: 4,
        trustScore: 650,
        memberSince: '2023-10-01'
      },
      tags: ['nist', 'maturity', 'cybersecurity', 'framework'],
      lastUpdated: '2024-01-10',
      publishedDate: '2023-10-15',
      features: ['Maturity scoring', 'Roadmap planning', 'Benchmark comparison', 'Progress tracking'],
      isFavorite: false,
      isOwned: false,
      previewAvailable: false,
      versionHistory: [
        { version: '1.2', date: '2024-01-10', changes: 'Updated NIST 2.0 alignment' },
        { version: '1.1', date: '2023-11-20', changes: 'Added benchmarking' }
      ],
      compatibility: ['Web'],
      languages: ['English'],
      businessDomains: ['Security', 'Risk Management'],
      integrations: ['Basic reporting'],
      customizationLevel: 'basic',
      supportLevel: 'standard',
      certifications: ['NIST aligned'],
      complianceScope: ['NIST CSF'],
      riskCategories: ['Operational', 'Strategic'],
      industryVerticals: ['SMB', 'Government'],
      executionModes: ['self-assessment'],
      reportingFeatures: ['Maturity dashboard', 'Gap analysis', 'Improvement roadmap'],
      completionRate: 88,
      customerSatisfaction: 4.1,
      averageScore: 58,
      benchmarkData: true,
      viewCount: 9870,
      saveCount: 456,
      shareCount: 67,
      recentActivity: 567,
      trending: false,
      featured: false,
      recommended: false,
      license: 'commercial',
      usageRights: ['Basic commercial'],
      restrictions: ['Single use'],
      attribution: false,
      redistribution: false,
      communityRating: 4.2,
      communityComments: 78,
      communityContributions: 5,
      forkedCount: 12,
      derivedAssessments: 2
    }
  ];

  // Enhanced marketplace statistics
  const stats: MarketplaceStats = {
    totalAssessments: assessments.length,
    freeAssessments: assessments.filter(a => a.priceType === 'free').length,
    premiumAssessments: assessments.filter(a => a.price > 0).length,
    verifiedProviders: [...new Set(assessments.filter(a => a.provider.verified).map(a => a.provider.name))].length,
    totalDownloads: assessments.reduce((sum, a) => sum + a.downloads, 0),
    averageRating: assessments.reduce((sum, a) => sum + a.rating, 0) / assessments.length,
    activeUsers: 2847,
    recentUploads: 23,
    totalTrustPointsDistributed: assessments.reduce((sum, a) => sum + a.trustPoints, 0),
    categories: [
      { name: 'Security', count: assessments.filter(a => a.category === 'security').length, growth: 15 },
      { name: 'Privacy', count: assessments.filter(a => a.category === 'privacy').length, growth: 8 },
      { name: 'Compliance', count: assessments.filter(a => a.category === 'compliance').length, growth: 22 },
      { name: 'AI Governance', count: assessments.filter(a => a.category === 'ai-governance').length, growth: 45 },
      { name: 'Risk', count: assessments.filter(a => a.category === 'risk').length, growth: 12 }
    ],
    topFrameworks: [
      { name: 'ISO 27001', count: 45, adoption: 78 },
      { name: 'NIST CSF', count: 38, adoption: 65 },
      { name: 'GDPR', count: 32, adoption: 89 },
      { name: 'SOC 2', count: 28, adoption: 56 }
    ],
    qualityMetrics: {
      averageCompletionRate: assessments.reduce((sum, a) => sum + a.completionRate, 0) / assessments.length,
      averageCustomerSatisfaction: assessments.reduce((sum, a) => sum + a.customerSatisfaction, 0) / assessments.length,
      certifiedAssessments: assessments.filter(a => a.certifications.length > 0).length,
      communityRating: assessments.reduce((sum, a) => sum + a.communityRating, 0) / assessments.length
    },
    marketplaceTrends: {
      mostDownloaded: ['Cloud Security Posture Assessment', 'Cybersecurity Maturity Model'],
      trending: ['AI Risk Assessment Framework', 'ISO 27001 Readiness Assessment'],
      recentlyUpdated: ['AI Risk Assessment Framework', 'GDPR Compliance Audit'],
      highestRated: ['SOC 2 Type II Preparation', 'ISO 27001 Readiness Assessment']
    }
  };

  // Filter and sort assessments
  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assessment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           assessment.provider.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || assessment.category === selectedCategory;
      const matchesPrice = selectedPriceType === 'all' || assessment.priceType === selectedPriceType;
      const matchesFramework = selectedFramework === 'all' || assessment.framework.some(f => f.includes(selectedFramework));
      const matchesDifficulty = selectedDifficulty === 'all' || assessment.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesPrice && matchesFramework && matchesDifficulty;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'popular': return b.downloads - a.downloads;
        case 'rating': return b.rating - a.rating;
        case 'newest': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'trending': return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        case 'trust-points': return b.trustPoints - a.trustPoints;
        default: return 0;
      }
    });
  }, [assessments, searchTerm, selectedCategory, selectedPriceType, selectedFramework, selectedDifficulty, sortBy]);

  // Utility functions
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return Shield;
      case 'privacy': return Globe;
      case 'compliance': return FileText;
      case 'risk': return Target;
      case 'ai-governance': return Brain;
      case 'operational': return Settings;
      case 'quality': return Award;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'from-blue-600 to-blue-700';
      case 'privacy': return 'from-green-600 to-green-700';
      case 'compliance': return 'from-purple-600 to-purple-700';
      case 'risk': return 'from-red-600 to-red-700';
      case 'ai-governance': return 'from-orange-600 to-orange-700';
      case 'operational': return 'from-cyan-600 to-cyan-700';
      case 'quality': return 'from-yellow-600 to-yellow-700';
      default: return 'from-slate-600 to-slate-700';
    }
  };

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === 'free') return 'Free';
    if (priceType === 'subscription') return `€${price}/month`;
    if (priceType === 'usage-based') return `€${price}/use`;
    return `€${price}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'advanced': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'expert': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  // Enhanced quick stats for marketplace metrics
  const quickStats: StatCard[] = [
    {
      label: 'Total Assessments',
      value: stats.totalAssessments.toLocaleString(),
      change: '+15%',
      trend: 'up',
      icon: <Package className="h-5 w-5 text-blue-600" />,
      description: 'Growing assessment library',
      color: 'text-blue-600'
    },
    {
      label: 'Active Downloads',
      value: stats.totalDownloads.toLocaleString(),
      change: '+28%',
      trend: 'up',
      icon: <Download className="h-5 w-5 text-green-600" />,
      description: 'Monthly download activity',
      color: 'text-green-600'
    },
    {
      label: 'Verified Providers',
      value: stats.verifiedProviders.toString(),
      change: '+5',
      trend: 'up',
      icon: <Verified className="h-5 w-5 text-purple-600" />,
      description: 'Trusted assessment creators',
      color: 'text-purple-600'
    },
    {
      label: 'Trust Points Pool',
      value: `${(stats.totalTrustPointsDistributed / 1000).toFixed(1)}K`,
      change: '+18%',
      trend: 'up',
      icon: <Coins className="h-5 w-5 text-yellow-600" />,
      description: 'Distributed to community',
      color: 'text-yellow-600'
    },
    {
      label: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      change: '+0.2',
      trend: 'up',
      icon: <Star className="h-5 w-5 text-orange-600" />,
      description: 'Community satisfaction',
      color: 'text-orange-600'
    },
    {
      label: 'Free Assessments',
      value: `${((stats.freeAssessments / stats.totalAssessments) * 100).toFixed(0)}%`,
      change: 'stable',
      trend: 'neutral',
      icon: <Heart className="h-5 w-5 text-red-600" />,
      description: 'Open community resources',
      color: 'text-red-600'
    }
  ];

  // Enhanced tab configuration for comprehensive marketplace functionality
  const tabs: TabConfiguration[] = [
    {
      id: 'browse',
      label: 'Browse Marketplace',
      badge: filteredAssessments.length,
      content: (
        <div className="space-y-6">
          {/* Enhanced Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search assessments, providers, frameworks, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="security">Security</option>
                  <option value="privacy">Privacy</option>
                  <option value="compliance">Compliance</option>
                  <option value="ai-governance">AI Governance</option>
                  <option value="risk">Risk Management</option>
                  <option value="operational">Operational</option>
                  <option value="quality">Quality</option>
                </select>
                <select
                  value={selectedPriceType}
                  onChange={(e) => setSelectedPriceType(e.target.value)}
                  className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="free">Free</option>
                  <option value="one-time">One-time</option>
                  <option value="subscription">Subscription</option>
                  <option value="usage-based">Usage-based</option>
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Recently Updated</option>
                  <option value="trending">Trending</option>
                  <option value="trust-points">Trust Points</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assessment Results Summary */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  Showing {filteredAssessments.length} of {assessments.length} assessments
                </span>
                {searchTerm && (
                  <Badge variant="outline" className="text-xs">
                    Search: "{searchTerm}"
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {selectedCategory}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Assessment Grid */}
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {filteredAssessments.map((assessment) => {
              const IconComponent = getCategoryIcon(assessment.category);
              const categoryColor = getCategoryColor(assessment.category);
              return (
                <Card 
                  key={assessment.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-slate-200 relative overflow-hidden bg-gradient-to-br from-white to-slate-50"
                >
                  {/* Assessment badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    {assessment.trending && (
                      <Badge className="bg-orange-500 text-white border-0 shadow-md">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    {assessment.featured && (
                      <Badge className="bg-purple-500 text-white border-0 shadow-md">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {assessment.recommended && (
                      <Badge className="bg-blue-500 text-white border-0 shadow-md">
                        <Award className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${categoryColor} flex items-center justify-center shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              {assessment.category.replace('-', ' ')}
                            </span>
                            {assessment.provider.verified && (
                              <Verified className="h-3 w-3 text-blue-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {assessment.type.replace('-', ' ')}
                            </Badge>
                            <Badge className={`text-xs border ${getDifficultyColor(assessment.difficulty)}`}>
                              {assessment.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="hover:bg-red-50">
                          <Heart className={`h-4 w-4 ${assessment.isFavorite ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                          <Share2 className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-slate-50">
                          <Bookmark className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {assessment.title}
                    </CardTitle>
                    <p className="text-sm text-slate-600 line-clamp-2">{assessment.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-5">
                      {/* Provider Information */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm">
                            {assessment.provider.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-sm flex items-center gap-2">
                              {assessment.provider.name}
                              {assessment.provider.verified && (
                                <Verified className="h-3 w-3 text-blue-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span>{assessment.provider.rating}</span>
                              <span>•</span>
                              <span>{assessment.provider.assessmentsPublished} assessments</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Trust Score</div>
                          <div className="font-medium text-sm">{assessment.provider.trustScore}</div>
                        </div>
                      </div>

                      {/* Assessment Metrics */}
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-slate-500 text-xs">Questions</div>
                          <div className="font-bold text-lg">{assessment.questions}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-500 text-xs">Duration</div>
                          <div className="font-bold text-lg">{assessment.estimatedTime}m</div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-500 text-xs">Downloads</div>
                          <div className="font-bold text-lg">{(assessment.downloads / 1000).toFixed(1)}K</div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-500 text-xs">Completion</div>
                          <div className="font-bold text-lg">{assessment.completionRate}%</div>
                        </div>
                      </div>

                      {/* Rating and Community Metrics */}
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-4 w-4 ${star <= assessment.rating ? 'text-yellow-500 fill-current' : 'text-slate-300'}`} 
                              />
                            ))}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{assessment.rating}</span>
                            <span className="text-slate-500 ml-1">({assessment.reviews} reviews)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MessageSquare className="h-3 w-3" />
                          <span>{assessment.communityComments}</span>
                          <GitBranch className="h-3 w-3 ml-2" />
                          <span>{assessment.forkedCount}</span>
                        </div>
                      </div>

                      {/* Framework Tags */}
                      <div className="flex flex-wrap gap-1">
                        {assessment.framework.slice(0, 3).map((framework) => (
                          <Badge key={framework} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {framework}
                          </Badge>
                        ))}
                        {assessment.framework.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-slate-50 text-slate-600">
                            +{assessment.framework.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Key Features */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          Key Features
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {assessment.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Integration and Compatibility */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-slate-500 mb-1">Integrations</div>
                          <div className="font-medium">{assessment.integrations.length} available</div>
                        </div>
                        <div>
                          <div className="text-slate-500 mb-1">Languages</div>
                          <div className="font-medium">{assessment.languages.length} supported</div>
                        </div>
                      </div>

                      {/* Price and Trust Points */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatPrice(assessment.price, assessment.priceType)}
                          </div>
                          <TrustPointsDisplay points={assessment.trustPoints} size="sm" />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {assessment.previewAvailable && (
                            <Button variant="outline" size="sm" className="hover:bg-blue-50">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                          )}
                          {assessment.isOwned ? (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Owned
                            </Button>
                          ) : (
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              {assessment.priceType === 'free' ? 'Get Free' : 'Purchase'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load More / Pagination */}
          {filteredAssessments.length === 0 && (
            <div className="text-center py-12">
              <Database className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">No assessments found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search criteria or filters</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedPriceType('all');
                setSelectedFramework('all');
                setSelectedDifficulty('all');
              }}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'my-library',
      label: 'My Library',
      badge: assessments.filter(a => a.isOwned).length,
      content: (
        <div className="space-y-6">
          {/* Library Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 mb-1">Owned Assessments</p>
                    <p className="text-2xl font-bold text-blue-700">{assessments.filter(a => a.isOwned).length}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-700">24</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-orange-700">3</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 mb-1">Trust Points</p>
                    <p className="text-2xl font-bold text-purple-700">2,450</p>
                  </div>
                  <Coins className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Owned Assessments */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                My Assessments
              </h3>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Manage Library
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {assessments.filter(a => a.isOwned).map((assessment) => {
                const IconComponent = getCategoryIcon(assessment.category);
                const categoryColor = getCategoryColor(assessment.category);
                return (
                  <Card key={assessment.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${categoryColor} flex items-center justify-center`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Owned
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <p className="text-sm text-slate-600 line-clamp-2">{assessment.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Questions:</span>
                            <div className="font-medium">{assessment.questions}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Duration:</span>
                            <div className="font-medium">{assessment.estimatedTime} min</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Last attempt: 85%</span>
                            <span className="text-green-600 font-medium">Completed</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button className="flex-1" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Start Assessment
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'favorites',
      label: 'Favorites',
      badge: assessments.filter(a => a.isFavorite).length,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Favorite Assessments
            </h3>
            <Badge className="bg-red-100 text-red-800 border-red-200">
              <Heart className="h-3 w-3 mr-1" />
              {assessments.filter(a => a.isFavorite).length} Favorites
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assessments.filter(a => a.isFavorite).map((assessment) => {
              const IconComponent = getCategoryIcon(assessment.category);
              const categoryColor = getCategoryColor(assessment.category);
              return (
                <Card key={assessment.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${categoryColor} flex items-center justify-center`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <Badge variant="outline" className="capitalize">{assessment.category.replace('-', ' ')}</Badge>
                      </div>
                      <Heart className="h-5 w-5 text-red-500 fill-current" />
                    </div>
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                    <p className="text-sm text-slate-600 line-clamp-2">{assessment.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{assessment.rating}</span>
                          <span className="text-sm text-slate-500">({assessment.reviews})</span>
                        </div>
                        <TrustPointsDisplay points={assessment.trustPoints} size="sm" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(assessment.price, assessment.priceType)}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {assessment.priceType === 'free' ? 'Get Free' : 'Purchase'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      label: 'Marketplace Analytics',
      badge: 'Live',
      content: (
        <div className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Category Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.categories.map((category) => {
                    const percentage = (category.count / stats.totalAssessments) * 100;
                    return (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{category.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {category.count} assessments
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`text-xs ${category.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                              {category.growth > 0 ? '+' : ''}{category.growth}%
                            </Badge>
                            <span className="text-sm font-medium w-12 text-right">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.qualityMetrics.averageCompletionRate.toFixed(0)}%
                      </div>
                      <div className="text-sm text-blue-600">Avg Completion Rate</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.qualityMetrics.averageCustomerSatisfaction.toFixed(1)}
                      </div>
                      <div className="text-sm text-green-600">Customer Satisfaction</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Certified Assessments</span>
                      <span className="font-medium">{stats.qualityMetrics.certifiedAssessments}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Community Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{stats.qualityMetrics.communityRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Top Rated Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 5)
                    .map((assessment, index) => (
                      <div key={assessment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{assessment.title}</div>
                            <div className="text-xs text-slate-600">{assessment.provider.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{assessment.rating}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  Most Downloaded
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments
                    .sort((a, b) => b.downloads - a.downloads)
                    .slice(0, 5)
                    .map((assessment, index) => (
                      <div key={assessment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{assessment.title}</div>
                            <div className="text-xs text-slate-600">{assessment.category}</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {(assessment.downloads / 1000).toFixed(1)}K
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Framework Popularity */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Framework Adoption Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.topFrameworks.map((framework) => (
                  <div key={framework.name} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{framework.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {framework.count}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress value={framework.adoption} className="h-2" />
                      <div className="text-xs text-slate-500">
                        {framework.adoption}% adoption rate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'publish',
      label: 'Publish Assessment',
      content: (
        <div className="space-y-6">
          <div className="text-center py-12">
            <Upload className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">Share Your Assessment</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Join our community of assessment creators and help organizations improve their compliance posture
            </p>
            <div className="flex gap-3 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Create New Assessment
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Existing
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Create from Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Start with pre-built templates for common frameworks
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Browse Templates
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI-Assisted Creation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Let AI help you create assessments based on your requirements
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Start AI Builder
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Fork Existing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Customize existing assessments for your specific needs
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Browse to Fork
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <ComponentPageTemplate
      title="Assessment Marketplace"
      subtitle="Discover, Execute, and Share Compliance Assessments"
      description="Comprehensive marketplace for compliance assessments with community-driven content, verified providers, and integrated execution capabilities. Earn trust points by contributing to the compliance community."
      trustScore={95}
      trustPoints={2450}
      quickStats={quickStats}
      tabs={tabs}
      headerGradient="from-blue-50 via-purple-50 to-slate-50"
      actions={
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hover:bg-slate-50">
            <Package className="h-4 w-4 mr-2" />
            My Library
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Publish Assessment
          </Button>
        </div>
      }
      className="assessment-marketplace-page"
    />
  );
};