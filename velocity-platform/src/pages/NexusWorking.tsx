import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Network, 
  Search,
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
  Database,
  TrendingUp,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  Brain,
  Layers,
  Link,
  Workflow
} from 'lucide-react';

export const NexusWorking: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  
  const intelligenceSources = [
    {
      id: 'threat-feeds',
      name: 'Global Threat Intelligence',
      category: 'External',
      status: 'active',
      sources: 15,
      reliability: 94,
      lastUpdate: '2025-07-20T14:32:00Z',
      coverage: 'Global',
      indicators: 2847593,
      newThreats: 347,
      provider: 'Multiple Vendors'
    },
    {
      id: 'internal-logs',
      name: 'Internal Security Logs',
      category: 'Internal',
      status: 'active',
      sources: 8,
      reliability: 98,
      lastUpdate: '2025-07-20T14:30:00Z',
      coverage: 'Enterprise',
      indicators: 156789,
      newThreats: 23,
      provider: 'SIEM/SOAR'
    },
    {
      id: 'dark-web',
      name: 'Dark Web Monitoring',
      category: 'OSINT',
      status: 'active',
      sources: 12,
      reliability: 87,
      lastUpdate: '2025-07-20T13:45:00Z',
      coverage: 'Dark Web',
      indicators: 45892,
      newThreats: 78,
      provider: 'DarkWeb Intelligence'
    },
    {
      id: 'vulnerability-db',
      name: 'Vulnerability Intelligence',
      category: 'Technical',
      status: 'active',
      sources: 6,
      reliability: 96,
      lastUpdate: '2025-07-20T12:15:00Z',
      coverage: 'CVE/NVD',
      indicators: 234567,
      newThreats: 156,
      provider: 'NVD/MITRE'
    }
  ];

  const insights = [
    {
      id: 'apt-campaign',
      title: 'Emerging APT Campaign Targeting Financial Services',
      severity: 'high',
      confidence: 85,
      category: 'Campaign Analysis',
      created: '2025-07-20',
      sources: ['threat-feeds', 'dark-web'],
      indicators: 234,
      affectedSectors: ['Financial', 'Healthcare'],
      summary: 'New APT group using novel malware variants targeting financial institutions across North America and Europe.',
      recommendations: ['Enhanced monitoring', 'Network segmentation', 'User awareness training']
    },
    {
      id: 'zero-day',
      title: 'Zero-Day Vulnerability in Popular Web Framework',
      severity: 'critical',
      confidence: 92,
      category: 'Vulnerability',
      created: '2025-07-19',
      sources: ['vulnerability-db', 'internal-logs'],
      indicators: 45,
      affectedSectors: ['Technology', 'E-commerce'],
      summary: 'Critical RCE vulnerability discovered in widely-used web framework affecting millions of applications.',
      recommendations: ['Immediate patching', 'WAF rules update', 'Asset inventory review']
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain Compromise in Software Distribution',
      severity: 'medium',
      confidence: 78,
      category: 'Supply Chain',
      created: '2025-07-18',
      sources: ['threat-feeds', 'internal-logs'],
      indicators: 89,
      affectedSectors: ['Manufacturing', 'Technology'],
      summary: 'Evidence of supply chain compromise affecting software distribution channels in Asia-Pacific region.',
      recommendations: ['Vendor assessment', 'Code signing verification', 'Enhanced monitoring']
    }
  ];

  const platformMetrics = {
    totalSources: intelligenceSources.length,
    activeFeeds: intelligenceSources.filter(s => s.status === 'active').length,
    totalIndicators: intelligenceSources.reduce((sum, s) => sum + s.indicators, 0),
    newThreats: intelligenceSources.reduce((sum, s) => sum + s.newThreats, 0),
    averageReliability: Math.round(intelligenceSources.reduce((sum, s) => sum + s.reliability, 0) / intelligenceSources.length),
    lastUpdated: '2025-07-20'
  };

  const correlationEngine = {
    activeRules: 156,
    matchedEvents: 2847,
    falsePositives: 23,
    accuracy: 94.2,
    processingTime: '1.3s',
    lastOptimization: '2025-07-19'
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `€{(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `€{(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'External':
        return <Globe className="h-4 w-4 text-blue-600" />;
      case 'Internal':
        return <Database className="h-4 w-4 text-green-600" />;
      case 'OSINT':
        return <Search className="h-4 w-4 text-purple-600" />;
      case 'Technical':
        return <Settings className="h-4 w-4 text-orange-600" />;
      default:
        return <Network className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-xl" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Network className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">NEXUS</h1>
              <p className="text-xl text-cyan-100 mt-1">Intelligence Platform</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-100">AI Correlation Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-cyan-200" />
                  <span className="text-cyan-100">{formatNumber(platformMetrics.totalIndicators)} indicators processed</span>
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
            <Button className="bg-white text-cyan-900 hover:bg-white/90">
              <Brain className="h-4 w-4 mr-2" />
              AI Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Platform Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Intelligence Sources</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-600 group-hover:from-cyan-200 group-hover:to-cyan-300 transition-all duration-300">
              <Network className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{platformMetrics.activeFeeds}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <ArrowUpRight className="h-4 w-4" />
              <span>+3 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Total Indicators</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
              <Database className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{formatNumber(platformMetrics.totalIndicators)}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-blue-700">
              <span>Real-time processing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">New Threats</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-red-200 text-red-600 group-hover:from-red-200 group-hover:to-red-300 transition-all duration-300">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{platformMetrics.newThreats}</div>
            <div className="flex items-center gap-1 text-sm font-medium text-red-700">
              <span>Last 24 hours</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/30" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Reliability Score</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900 mb-2">{platformMetrics.averageReliability}%</div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <ArrowUpRight className="h-4 w-4" />
              <span>+2% this week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Intelligence Sources */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Layers className="h-5 w-5 text-cyan-600" />
                  Intelligence Sources
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Multi-source threat intelligence aggregation
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {intelligenceSources.map((source) => (
                <div
                  key={source.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedSource(source.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(source.category)}
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{source.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Category: {source.category}</span>
                          <span>Provider: {source.provider}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          Last update: {new Date(source.lastUpdate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {source.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Indicators</div>
                      <div className="text-xl font-bold text-slate-900">{formatNumber(source.indicators)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">New Threats</div>
                      <div className="text-xl font-bold text-red-700">{source.newThreats}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Reliability</div>
                      <div className="text-xl font-bold text-emerald-700">{source.reliability}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Coverage:</span>
                      <span className="font-medium text-slate-900">{source.coverage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Sources:</span>
                      <span className="font-medium text-blue-700">{source.sources}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Insights */}
        <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Intelligence Insights
                </CardTitle>
                <CardDescription className="text-slate-600">
                  AI-powered threat analysis and correlation
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Investigate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{insight.title}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border €{getSeverityColor(insight.severity)}`}>
                          {insight.severity}
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {insight.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{insight.summary}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                        <span>Category: {insight.category}</span>
                        <span>Indicators: {insight.indicators}</span>
                        <span>Created: {new Date(insight.created).toLocaleDateString()}</span>
                      </div>
                      <div className="mb-3">
                        <div className="text-xs text-slate-600 mb-1">Affected Sectors:</div>
                        <div className="flex gap-1">
                          {insight.affectedSectors.map((sector, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200"
                            >
                              {sector}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                        <strong>Recommendations:</strong> {insight.recommendations.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Correlation Engine Status */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Workflow className="h-5 w-5 text-purple-600" />
                AI Correlation Engine
              </CardTitle>
              <CardDescription className="text-slate-600">
                Real-time threat correlation and pattern detection
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              Optimal Performance
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900">Processing Performance</span>
                  <span className="text-sm font-mono text-slate-700">{correlationEngine.processingTime}</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full shadow-sm transition-all duration-1000 w-full" />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Real-time</span>
                  <span>Target: &lt;2s</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700 mb-1">{correlationEngine.accuracy}%</div>
                <div className="text-sm text-slate-600">Correlation Accuracy</div>
                <div className="text-xs text-purple-600 mt-1">✓ Above 90% target</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-700 mb-1">{formatNumber(correlationEngine.matchedEvents)}</div>
                <div className="text-sm text-slate-600">Events Correlated</div>
                <div className="text-xs text-cyan-600 mt-1">Last 24 hours</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Zap className="h-5 w-5 text-amber-600" />
            Intelligence Operations
          </CardTitle>
          <CardDescription className="text-slate-600">
            Advanced threat intelligence analysis and investigation tools
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-cyan-50/50 border-cyan-200"
            >
              <Search className="h-8 w-8 text-cyan-600" />
              <span className="font-medium">Threat Hunting</span>
              <span className="text-xs text-slate-500">Proactive search</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-purple-50/50 border-purple-200"
            >
              <Brain className="h-8 w-8 text-purple-600" />
              <span className="font-medium">AI Analysis</span>
              <span className="text-xs text-slate-500">Pattern detection</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-blue-50/50 border-blue-200"
            >
              <Network className="h-8 w-8 text-blue-600" />
              <span className="font-medium">IOC Management</span>
              <span className="text-xs text-slate-500">Indicator tracking</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-emerald-50/50 border-emerald-200"
            >
              <BarChart3 className="h-8 w-8 text-emerald-600" />
              <span className="font-medium">Intel Report</span>
              <span className="text-xs text-slate-500">Executive briefing</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};