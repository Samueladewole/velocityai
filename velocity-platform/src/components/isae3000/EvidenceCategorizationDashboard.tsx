import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  Eye,
  Settings,
  Download,
  RefreshCw,
  Activity,
  Target,
  Award,
  Zap,
  Filter,
  Search,
  ChevronDown,
  Building,
  Server,
  Users
} from 'lucide-react';
import EvidenceCategorizationService, { 
  ISAE3000Control, 
  EvidenceClassification, 
  CategorizationMetrics 
} from '@/services/isae3000/EvidenceCategorizationService';

interface EvidenceCategorizationDashboardProps {
  className?: string;
}

const EvidenceCategorizationDashboard: React.FC<EvidenceCategorizationDashboardProps> = ({ className = '' }) => {
  const [metrics, setMetrics] = useState<CategorizationMetrics | null>(null);
  const [controls, setControls] = useState<ISAE3000Control[]>([]);
  const [classifications, setClassifications] = useState<EvidenceClassification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categorizationService = EvidenceCategorizationService.getInstance();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    try {
      const metricsData = categorizationService.getMetrics();
      const controlsData = categorizationService.getAllControls();
      const classificationsData = categorizationService.getAllClassifications();

      setMetrics(metricsData);
      setControls(controlsData);
      setClassifications(classificationsData);
    } catch (error) {
      console.error('Failed to load categorization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ElementType> = {
      'CC1': Users,
      'CC2': Shield,
      'CC3': Activity,
      'CC4': Target,
      'CC5': TrendingUp,
      'CC6': Server,
      'CC7': Settings,
      'CC8': RefreshCw,
      'CC9': Eye
    };
    return icons[category] || FileText;
  };

  const getCoverageColor = (count: number): string => {
    if (count >= 5) return 'text-emerald-600 bg-emerald-50';
    if (count >= 3) return 'text-blue-600 bg-blue-50';
    if (count >= 1) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceColor = (score: number): string => {
    if (score >= 0.8) return 'text-emerald-600 bg-emerald-50';
    if (score >= 0.6) return 'text-blue-600 bg-blue-50';
    if (score >= 0.4) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getAuditReadinessIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'requires-review':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'incomplete':
        return <Clock className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredControls = controls.filter(control => {
    if (selectedCategory !== 'all' && control.category !== selectedCategory) return false;
    if (searchQuery && !control.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredClassifications = classifications.filter(classification => {
    if (searchQuery && !classification.evidenceId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-12 €{className}`}>
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-600">Loading categorization data...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 €{className}`}>
      {/* Header with Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ISAE 3000 Evidence Categorization</h1>
            <p className="text-slate-600 mt-1">AI-powered evidence classification and control mapping</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search controls or evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {showFilters && (
            <div className="flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="CC1">CC1 - Control Environment</option>
                <option value="CC2">CC2 - Risk Assessment</option>
                <option value="CC5">CC5 - Control Activities</option>
                <option value="CC6">CC6 - Logical Access</option>
                <option value="CC7">CC7 - System Operations</option>
                <option value="CC8">CC8 - Change Management</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{metrics.categorizedEvidence}/{metrics.totalEvidence}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Categorized Evidence</h3>
            <p className="text-xs text-slate-500 mt-1">
              {metrics.totalEvidence > 0 ? Math.round((metrics.categorizedEvidence / metrics.totalEvidence) * 100) : 0}% completion rate
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{metrics.auditReadyEvidence}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Audit Ready Evidence</h3>
            <p className="text-xs text-emerald-600 mt-1">High confidence classification</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{metrics.bankingSpecificEvidence}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Banking Specific</h3>
            <p className="text-xs text-slate-500 mt-1">Industry-relevant evidence</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{(metrics.averageConfidence * 100).toFixed(1)}%</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Avg Confidence</h3>
            <p className="text-xs text-slate-500 mt-1">AI classification accuracy</p>
          </div>
        </div>
      )}

      {/* Control Coverage Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">ISAE 3000 Control Coverage</h2>
              <p className="text-sm text-slate-600 mt-1">Evidence mapping across control categories</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-4">
            {filteredControls.map((control) => {
              const Icon = getCategoryIcon(control.category);
              const evidenceCount = metrics?.controlCoverage[control.id] || 0;
              const coverageLevel = evidenceCount >= 5 ? 'excellent' : evidenceCount >= 3 ? 'good' : evidenceCount >= 1 ? 'fair' : 'poor';
              
              return (
                <div key={control.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Icon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-slate-900">{control.id}</h3>
                          {control.bankingSpecific && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              Banking Specific
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full font-medium €{
                            control.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                            control.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {control.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>
                        <h4 className="font-medium text-slate-900 mb-2">{control.title}</h4>
                        <p className="text-sm text-slate-600 mb-3">{control.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Category: {control.category}</span>
                          <span>•</span>
                          <span>Automation: {control.automationLevel}%</span>
                          <span>•</span>
                          <span>{control.evidenceTypes.length} Evidence Types</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium €{getCoverageColor(evidenceCount)}`}>
                        {evidenceCount} Evidence Items
                      </div>
                      <p className="text-xs text-slate-500 mt-1 capitalize">{coverageLevel} Coverage</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Evidence Classifications */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Evidence Classifications</h2>
              <p className="text-sm text-slate-600 mt-1">Latest AI-categorized evidence items</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">Live Updates</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
          {filteredClassifications.length > 0 ? (
            filteredClassifications.slice(0, 10).map((classification) => (
              <div key={classification.evidenceId} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-slate-900">{classification.evidenceId}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium €{getConfidenceColor(classification.confidenceScore)}`}>
                        {(classification.confidenceScore * 100).toFixed(0)}% Confidence
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm text-slate-600">Category: {classification.primaryCategory}</span>
                      {classification.bankingRelevance > 50 && (
                        <span className="text-sm text-blue-600">Banking Relevant: {classification.bankingRelevance}%</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-500">Controls:</span>
                      {classification.isaeControls.slice(0, 3).map((controlId) => (
                        <span key={controlId} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                          {controlId}
                        </span>
                      ))}
                      {classification.isaeControls.length > 3 && (
                        <span className="text-xs text-slate-500">+{classification.isaeControls.length - 3} more</span>
                      )}
                    </div>
                    {classification.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {classification.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-2">
                      {getAuditReadinessIcon(classification.auditReadiness)}
                      <span className="text-sm text-slate-600 capitalize">{classification.auditReadiness.replace('-', ' ')}</span>
                    </div>
                    {classification.recommendations.length > 0 && (
                      <button className="text-xs text-blue-600 hover:text-blue-700">
                        View Recommendations
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No evidence classifications found</p>
              <p className="text-sm mt-1">Evidence will appear here as it gets categorized</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvidenceCategorizationDashboard;