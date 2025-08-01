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
  Bookmark
} from 'lucide-react';

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: 'security' | 'privacy' | 'compliance' | 'risk' | 'ai-governance';
  type: 'questionnaire' | 'checklist' | 'audit' | 'maturity' | 'gap-analysis';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  framework: string[];
  price: number;
  priceType: 'free' | 'one-time' | 'subscription';
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
  };
  tags: string[];
  lastUpdated: string;
  features: string[];
  isFavorite: boolean;
  isOwned: boolean;
  previewAvailable: boolean;
}

interface MarketplaceStats {
  totalAssessments: number;
  freeAssessments: number;
  verifiedProviders: number;
  totalDownloads: number;
  averageRating: number;
  categories: { name: string; count: number }[];
}

export const AssessmentMarketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceType, setSelectedPriceType] = useState('all');
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const assessments: Assessment[] = [
    {
      id: 'ass-001',
      title: 'ISO 27001 Readiness Assessment',
      description: 'Comprehensive readiness evaluation for ISO 27001 certification with detailed gap analysis',
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
        rating: 4.9
      },
      tags: ['iso27001', 'security', 'certification', 'gap-analysis'],
      lastUpdated: '2025-01-15',
      features: ['Automated scoring', 'Gap analysis', 'Remediation plan', 'Trust Points rewards'],
      isFavorite: false,
      isOwned: false,
      previewAvailable: true
    },
    {
      id: 'ass-002',
      title: 'GDPR Compliance Audit',
      description: 'Complete GDPR compliance assessment with privacy impact analysis',
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
        rating: 4.7
      },
      tags: ['gdpr', 'privacy', 'compliance', 'audit'],
      lastUpdated: '2025-01-20',
      features: ['DPIA templates', 'Legal guidance', 'Compliance dashboard', 'Action items'],
      isFavorite: true,
      isOwned: false,
      previewAvailable: true
    },
    {
      id: 'ass-003',
      title: 'SOC 2 Type II Preparation',
      description: 'Comprehensive SOC 2 Type II readiness assessment with control validation',
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
        rating: 4.8
      },
      tags: ['soc2', 'audit', 'compliance', 'controls'],
      lastUpdated: '2025-01-18',
      features: ['Control testing', 'Evidence collection', 'Audit preparation', 'Continuous monitoring'],
      isFavorite: false,
      isOwned: true,
      previewAvailable: true
    },
    {
      id: 'ass-004',
      title: 'AI Risk Assessment Framework',
      description: 'EU AI Act compliance assessment with risk categorization and mitigation planning',
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
        rating: 4.6
      },
      tags: ['ai', 'risk', 'governance', 'eu-ai-act'],
      lastUpdated: '2025-01-22',
      features: ['Risk categorization', 'Mitigation planning', 'Compliance mapping', 'AI system registry'],
      isFavorite: false,
      isOwned: false,
      previewAvailable: true
    },
    {
      id: 'ass-005',
      title: 'Cloud Security Posture Assessment',
      description: 'Multi-cloud security assessment covering AWS, Azure, and GCP best practices',
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
        rating: 4.4
      },
      tags: ['cloud', 'security', 'aws', 'azure', 'gcp'],
      lastUpdated: '2025-01-12',
      features: ['Multi-cloud support', 'Best practices', 'Automated checks', 'Remediation guides'],
      isFavorite: true,
      isOwned: false,
      previewAvailable: true
    },
    {
      id: 'ass-006',
      title: 'Cybersecurity Maturity Model',
      description: 'NIST Cybersecurity Framework maturity assessment with roadmap planning',
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
        rating: 4.2
      },
      tags: ['nist', 'maturity', 'cybersecurity', 'framework'],
      lastUpdated: '2025-01-10',
      features: ['Maturity scoring', 'Roadmap planning', 'Benchmark comparison', 'Progress tracking'],
      isFavorite: false,
      isOwned: false,
      previewAvailable: false
    }
  ];

  const stats: MarketplaceStats = {
    totalAssessments: assessments.length,
    freeAssessments: assessments.filter(a => a.priceType === 'free').length,
    verifiedProviders: [...new Set(assessments.filter(a => a.provider.verified).map(a => a.provider.name))].length,
    totalDownloads: assessments.reduce((sum, a) => sum + a.downloads, 0),
    averageRating: assessments.reduce((sum, a) => sum + a.rating, 0) / assessments.length,
    categories: [
      { name: 'Security', count: assessments.filter(a => a.category === 'security').length },
      { name: 'Privacy', count: assessments.filter(a => a.category === 'privacy').length },
      { name: 'Compliance', count: assessments.filter(a => a.category === 'compliance').length },
      { name: 'AI Governance', count: assessments.filter(a => a.category === 'ai-governance').length },
      { name: 'Risk', count: assessments.filter(a => a.category === 'risk').length }
    ]
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || assessment.category === selectedCategory;
    const matchesPrice = selectedPriceType === 'all' || assessment.priceType === selectedPriceType;
    const matchesFramework = selectedFramework === 'all' || assessment.framework.includes(selectedFramework);
    return matchesSearch && matchesCategory && matchesPrice && matchesFramework;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular': return b.downloads - a.downloads;
      case 'rating': return b.rating - a.rating;
      case 'newest': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      default: return 0;
    }
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return Shield;
      case 'privacy': return Globe;
      case 'compliance': return FileText;
      case 'risk': return Target;
      case 'ai-governance': return Brain;
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
      default: return 'from-slate-600 to-slate-700';
    }
  };

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === 'free') return 'Free';
    if (priceType === 'subscription') return `€€{price}/month`;
    return `€€{price}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Assessment Marketplace</h1>
            <p className="text-slate-600">
              Discover, share, and monetize compliance assessments with the community
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              My Assessments
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Publish Assessment
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard
            title="Total Assessments"
            value={stats.totalAssessments.toString()}
            icon={Package}
            trend={{ value: 12, isPositive: true }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
          />
          <StatCard
            title="Free Assessments"
            value={stats.freeAssessments.toString()}
            icon={Download}
            trend={{ value: 8, isPositive: true }}
            className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
          />
          <StatCard
            title="Verified Providers"
            value={stats.verifiedProviders.toString()}
            icon={Verified}
            trend={{ value: 5, isPositive: true }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
          />
          <StatCard
            title="Total Downloads"
            value={stats.totalDownloads.toLocaleString()}
            icon={TrendingUp}
            trend={{ value: 25, isPositive: true }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
          />
          <StatCard
            title="Avg Rating"
            value={stats.averageRating.toFixed(1)}
            icon={Star}
            trend={{ value: 3, isPositive: true }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Assessments</TabsTrigger>
            <TabsTrigger value="my-library">My Library</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Browse Assessments Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search assessments, descriptions, or tags..."
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
                <option value="compliance">Compliance</option>
                <option value="ai-governance">AI Governance</option>
                <option value="risk">Risk</option>
              </select>
              <select
                value={selectedPriceType}
                onChange={(e) => setSelectedPriceType(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="free">Free</option>
                <option value="one-time">One-time</option>
                <option value="subscription">Subscription</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Assessment Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAssessments.map((assessment) => {
                const IconComponent = getCategoryIcon(assessment.category);
                const categoryColor = getCategoryColor(assessment.category);
                return (
                  <Card 
                    key={assessment.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-slate-200 relative overflow-hidden"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r €{categoryColor} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                {assessment.category}
                              </span>
                              {assessment.provider.verified && (
                                <Verified className="h-3 w-3 text-blue-500" />
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {assessment.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className={`h-4 w-4 €{assessment.isFavorite ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 text-slate-400" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <p className="text-sm text-slate-600">{assessment.description}</p>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Provider Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm">
                            {assessment.provider.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{assessment.provider.name}</div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span>{assessment.provider.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Assessment Stats */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Questions:</span>
                            <div className="font-medium">{assessment.questions}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Time:</span>
                            <div className="font-medium">{assessment.estimatedTime} min</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Downloads:</span>
                            <div className="font-medium">{assessment.downloads.toLocaleString()}</div>
                          </div>
                        </div>

                        {/* Rating and Reviews */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-3 w-3 €{star <= assessment.rating ? 'text-yellow-500 fill-current' : 'text-slate-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{assessment.rating}</span>
                            <span className="text-sm text-slate-500">({assessment.reviews} reviews)</span>
                          </div>
                        </div>

                        {/* Frameworks */}
                        <div className="flex flex-wrap gap-1">
                          {assessment.framework.map((framework) => (
                            <Badge key={framework} variant="secondary" className="text-xs">
                              {framework}
                            </Badge>
                          ))}
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-slate-700">Key Features:</div>
                          <div className="flex flex-wrap gap-1">
                            {assessment.features.slice(0, 3).map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatPrice(assessment.price, assessment.priceType)}
                            </div>
                            <TrustPointsDisplay points={assessment.trustPoints} size="sm" />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {assessment.previewAvailable && (
                              <Button variant="outline" size="sm">
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
                              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
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
          </TabsContent>

          {/* My Library Tab */}
          <TabsContent value="my-library" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">My Assessment Library</h3>
              <Badge className="bg-blue-100 text-blue-800">
                <Package className="h-3 w-3 mr-1" />
                {assessments.filter(a => a.isOwned).length} Owned
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {assessments.filter(a => a.isOwned).map((assessment) => {
                const IconComponent = getCategoryIcon(assessment.category);
                const categoryColor = getCategoryColor(assessment.category);
                return (
                  <Card key={assessment.id} className="border-slate-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r €{categoryColor} flex items-center justify-center`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Owned
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-slate-600">
                          {assessment.questions} questions • {assessment.estimatedTime} min
                        </div>
                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Start Assessment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Favorite Assessments</h3>
              <Badge className="bg-red-100 text-red-800">
                <Heart className="h-3 w-3 mr-1" />
                {assessments.filter(a => a.isFavorite).length} Favorites
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessments.filter(a => a.isFavorite).map((assessment) => {
                const IconComponent = getCategoryIcon(assessment.category);
                const categoryColor = getCategoryColor(assessment.category);
                return (
                  <Card key={assessment.id} className="border-slate-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r €{categoryColor} flex items-center justify-center`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <Badge variant="outline">{assessment.category}</Badge>
                        </div>
                        <Heart className="h-5 w-5 text-red-500 fill-current" />
                      </div>
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <p className="text-sm text-slate-600">{assessment.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(assessment.price, assessment.priceType)}
                        </div>
                        <Button size="sm">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {assessment.priceType === 'free' ? 'Get Free' : 'Purchase'}
                        </Button>
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
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.categories.map((category) => {
                      const percentage = (category.count / stats.totalAssessments) * 100;
                      return (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-sm text-slate-500">{category.count} assessments</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={percentage} className="w-24 h-2" />
                            <span className="text-sm font-medium w-12 text-right">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Top Rated Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assessments
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 5)
                      .map((assessment) => (
                        <div key={assessment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <div className="font-medium">{assessment.title}</div>
                            <div className="text-sm text-slate-600">{assessment.provider.name}</div>
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};