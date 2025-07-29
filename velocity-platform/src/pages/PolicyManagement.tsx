import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TrustPointsDisplay } from '@/components/shared/TrustPointsDisplay';
import { StatCard } from '@/components/shared/StatCard';
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
  Brain
} from 'lucide-react';

interface Policy {
  id: string;
  title: string;
  description: string;
  category: 'security' | 'privacy' | 'operational' | 'compliance' | 'hr';
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  priority: 'critical' | 'high' | 'medium' | 'low';
  owner: string;
  reviewers: string[];
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
}

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
}

export const PolicyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('policies');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  const policies: Policy[] = [
    {
      id: 'pol-001',
      title: 'Information Security Policy',
      description: 'Comprehensive information security governance and control framework',
      category: 'security',
      status: 'published',
      priority: 'critical',
      owner: 'Sarah Chen',
      reviewers: ['Mike Johnson', 'Lisa Wang'],
      version: '2.1',
      effectiveDate: '2024-01-15',
      nextReview: '2024-07-15',
      lastUpdated: '2024-01-10',
      compliance: ['ISO 27001', 'SOC 2', 'GDPR'],
      trustPoints: 250,
      readCount: 156,
      acknowledgments: 142,
      totalUsers: 165,
      tags: ['security', 'governance', 'iso27001'],
      riskLevel: 'high'
    },
    {
      id: 'pol-002',
      title: 'Data Privacy Policy',
      description: 'GDPR and CCPA compliant data protection and privacy procedures',
      category: 'privacy',
      status: 'review',
      priority: 'critical',
      owner: 'Tom Rodriguez',
      reviewers: ['Sarah Chen', 'Alex Kim'],
      version: '1.3',
      effectiveDate: '2024-02-01',
      nextReview: '2024-08-01',
      lastUpdated: '2024-01-20',
      compliance: ['GDPR', 'CCPA', 'ISO 27701'],
      trustPoints: 200,
      readCount: 134,
      acknowledgments: 128,
      totalUsers: 165,
      tags: ['privacy', 'gdpr', 'ccpa'],
      riskLevel: 'high'
    },
    {
      id: 'pol-003',
      title: 'AI Ethics and Governance',
      description: 'Responsible AI development and deployment guidelines',
      category: 'operational',
      status: 'draft',
      priority: 'high',
      owner: 'Dr. Emma Wilson',
      reviewers: ['Sarah Chen', 'Mike Johnson'],
      version: '1.0',
      effectiveDate: '2024-03-01',
      nextReview: '2024-09-01',
      lastUpdated: '2024-01-22',
      compliance: ['EU AI Act', 'ISO 42001'],
      trustPoints: 180,
      readCount: 45,
      acknowledgments: 12,
      totalUsers: 165,
      tags: ['ai', 'ethics', 'governance'],
      riskLevel: 'medium'
    },
    {
      id: 'pol-004',
      title: 'Remote Work Security',
      description: 'Security controls and procedures for remote workforce',
      category: 'security',
      status: 'approved',
      priority: 'high',
      owner: 'Mike Johnson',
      reviewers: ['Sarah Chen'],
      version: '1.2',
      effectiveDate: '2024-01-30',
      nextReview: '2024-07-30',
      lastUpdated: '2024-01-25',
      compliance: ['ISO 27001', 'NIST'],
      trustPoints: 150,
      readCount: 98,
      acknowledgments: 89,
      totalUsers: 165,
      tags: ['remote', 'security', 'workforce'],
      riskLevel: 'medium'
    },
    {
      id: 'pol-005',
      title: 'Incident Response Procedure',
      description: 'Comprehensive incident response and crisis management procedures',
      category: 'security',
      status: 'published',
      priority: 'critical',
      owner: 'Alex Kim',
      reviewers: ['Sarah Chen', 'Mike Johnson'],
      version: '3.0',
      effectiveDate: '2023-12-01',
      nextReview: '2024-06-01',
      lastUpdated: '2023-11-28',
      compliance: ['ISO 27001', 'SOC 2', 'NIST'],
      trustPoints: 220,
      readCount: 187,
      acknowledgments: 165,
      totalUsers: 165,
      tags: ['incident', 'response', 'crisis'],
      riskLevel: 'critical'
    }
  ];

  const policyTemplates: PolicyTemplate[] = [
    {
      id: 'tpl-001',
      name: 'ISO 27001 Security Policy',
      description: 'Complete ISO 27001 compliant security policy template',
      category: 'Security',
      frameworks: ['ISO 27001', 'SOC 2'],
      sections: 12,
      estimatedTime: '4 hours',
      trustPoints: 300,
      icon: Shield,
      color: 'from-blue-600 to-blue-700',
      popularity: 95
    },
    {
      id: 'tpl-002',
      name: 'GDPR Privacy Policy',
      description: 'GDPR Article 13 & 14 compliant privacy policy',
      category: 'Privacy',
      frameworks: ['GDPR', 'ISO 27701'],
      sections: 8,
      estimatedTime: '3 hours',
      trustPoints: 250,
      icon: Globe,
      color: 'from-green-600 to-green-700',
      popularity: 88
    },
    {
      id: 'tpl-003',
      name: 'AI Governance Policy',
      description: 'EU AI Act and ISO 42001 compliant AI governance',
      category: 'Operational',
      frameworks: ['EU AI Act', 'ISO 42001'],
      sections: 10,
      estimatedTime: '5 hours',
      trustPoints: 280,
      icon: Brain,
      color: 'from-purple-600 to-purple-700',
      popularity: 72
    },
    {
      id: 'tpl-004',
      name: 'Cloud Security Policy',
      description: 'Multi-cloud security governance and controls',
      category: 'Security',
      frameworks: ['CSA CCM', 'NIST', 'ISO 27001'],
      sections: 9,
      estimatedTime: '3.5 hours',
      trustPoints: 200,
      icon: Building2,
      color: 'from-orange-600 to-orange-700',
      popularity: 81
    },
    {
      id: 'tpl-005',
      name: 'Incident Response Policy',
      description: 'Comprehensive incident response and crisis management',
      category: 'Security',
      frameworks: ['NIST', 'ISO 27035'],
      sections: 7,
      estimatedTime: '2.5 hours',
      trustPoints: 220,
      icon: AlertTriangle,
      color: 'from-red-600 to-red-700',
      popularity: 90
    },
    {
      id: 'tpl-006',
      name: 'Remote Work Policy',
      description: 'Secure remote work guidelines and procedures',
      category: 'HR',
      frameworks: ['ISO 27001', 'NIST'],
      sections: 6,
      estimatedTime: '2 hours',
      trustPoints: 150,
      icon: Users,
      color: 'from-teal-600 to-teal-700',
      popularity: 76
    }
  ];

  const totalPolicies = policies.length;
  const publishedPolicies = policies.filter(p => p.status === 'published').length;
  const averageAcknowledgment = Math.round(
    policies.reduce((sum, p) => sum + (p.acknowledgments / p.totalUsers * 100), 0) / policies.length
  );
  const totalTrustPoints = policies.reduce((sum, p) => sum + p.trustPoints, 0);

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return Shield;
      case 'privacy': return Globe;
      case 'operational': return Settings;
      case 'compliance': return FileText;
      case 'hr': return Users;
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
      default: return 'from-slate-600 to-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Policy Management 2.0</h1>
            <p className="text-slate-600">
              AI-powered policy lifecycle management with automated compliance tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TrustPointsDisplay points={totalTrustPoints} size="lg" />
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Policy
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Policies"
            value={totalPolicies.toString()}
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
          />
          <StatCard
            title="Published"
            value={`${publishedPolicies}/${totalPolicies}`}
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
            className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
          />
          <StatCard
            title="Acknowledgment Rate"
            value={`${averageAcknowledgment}%`}
            icon={Users}
            trend={{ value: 5, isPositive: true }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
          />
          <StatCard
            title="Trust Points"
            value={totalTrustPoints.toLocaleString()}
            icon={Award}
            trend={{ value: 15, isPositive: true }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="policies">Policy Library</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Mapping</TabsTrigger>
          </TabsList>

          {/* Policy Library Tab */}
          <TabsContent value="policies" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search policies, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="security">Security</option>
                <option value="privacy">Privacy</option>
                <option value="operational">Operational</option>
                <option value="compliance">Compliance</option>
                <option value="hr">HR</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            {/* Policy Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPolicies.map((policy) => {
                const IconComponent = getCategoryIcon(policy.category);
                const categoryColor = getCategoryColor(policy.category);
                return (
                  <Card 
                    key={policy.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-slate-200"
                    onClick={() => setSelectedPolicy(policy.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${categoryColor} flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                          <RiskBadge riskLevel={policy.riskLevel} />
                          <StatusBadge status={policy.status} />
                        </div>
                      </div>
                      <CardTitle className="text-lg">{policy.title}</CardTitle>
                      <p className="text-sm text-slate-600">{policy.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Policy Metadata */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Version:</span>
                            <div className="font-medium">{policy.version}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Owner:</span>
                            <div className="font-medium">{policy.owner}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Next Review:</span>
                            <div className="font-medium">{new Date(policy.nextReview).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Acknowledgments:</span>
                            <div className="font-medium">{policy.acknowledgments}/{policy.totalUsers}</div>
                          </div>
                        </div>

                        {/* Acknowledgment Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Acknowledgment Rate</span>
                            <span className="font-medium">{Math.round((policy.acknowledgments / policy.totalUsers) * 100)}%</span>
                          </div>
                          <Progress value={(policy.acknowledgments / policy.totalUsers) * 100} className="h-2" />
                        </div>

                        {/* Compliance Frameworks */}
                        <div className="flex flex-wrap gap-1">
                          {policy.compliance.map((framework) => (
                            <Badge key={framework} variant="outline" className="text-xs">
                              {framework}
                            </Badge>
                          ))}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {policy.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Actions and Trust Points */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                          <TrustPointsDisplay points={policy.trustPoints} size="sm" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Policy Templates</h3>
              <Badge className="bg-green-100 text-green-800">
                <Target className="h-3 w-3 mr-1" />
                6 AI-Powered Templates
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {policyTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <Card key={template.id} className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-slate-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${template.color} flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {template.popularity}% popular
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-slate-600">{template.description}</p>
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
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {template.frameworks.map((framework) => (
                            <Badge key={framework} variant="outline" className="text-xs">
                              {framework}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <Button className="flex-1" size="sm">
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
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Policy Adoption Trends
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
                          <span className="text-sm font-medium">
                            {Math.round((policy.acknowledgments / policy.totalUsers) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
                        return (
                          <div key={policy.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <div className="font-medium">{policy.title}</div>
                              <div className="text-sm text-slate-600">v{policy.version}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {daysUntilReview > 0 ? `${daysUntilReview} days` : 'Overdue'}
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
            </div>
          </TabsContent>

          {/* Compliance Mapping Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Framework Coverage Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {['ISO 27001', 'GDPR', 'SOC 2', 'NIST', 'EU AI Act'].map((framework) => {
                    const frameworkPolicies = policies.filter(p => p.compliance.includes(framework));
                    const coverage = (frameworkPolicies.length / totalPolicies) * 100;
                    return (
                      <div key={framework} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{framework}</h4>
                          <Badge variant="outline">
                            {frameworkPolicies.length} policies
                          </Badge>
                        </div>
                        <Progress value={coverage} className="h-2" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {frameworkPolicies.slice(0, 4).map((policy) => (
                            <div key={policy.id} className="text-xs p-2 bg-slate-50 rounded border">
                              {policy.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};