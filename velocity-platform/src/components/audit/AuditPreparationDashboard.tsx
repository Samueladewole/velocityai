import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Download,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Shield,
  Target,
  TrendingUp,
  Users,
  Calendar,
  Search,
  Filter,
  Award,
  Activity,
  Building,
  Zap
} from 'lucide-react';
import AuditPreparationService, { 
  AuditPackage, 
  AuditFinding, 
  ManagementReport, 
  AuditMetrics 
} from '@/services/audit/AuditPreparationService';

interface AuditPreparationDashboardProps {
  className?: string;
}

const AuditPreparationDashboard: React.FC<AuditPreparationDashboardProps> = ({ className = '' }) => {
  const [auditPackages, setAuditPackages] = useState<AuditPackage[]>([]);
  const [metrics, setMetrics] = useState<AuditMetrics | null>(null);
  const [recentFindings, setRecentFindings] = useState<AuditFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<AuditPackage | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'findings' | 'reports'>('overview');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const auditService = AuditPreparationService.getInstance();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    try {
      const packages = auditService.getAllAuditPackages();
      const metricsData = auditService.getMetrics();
      const openFindings = auditService.getAuditFindingsByStatus('open');
      const inProgressFindings = auditService.getAuditFindingsByStatus('in-progress');
      const recentFindingsData = [...openFindings, ...inProgressFindings]
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 10);

      setAuditPackages(packages);
      setMetrics(metricsData);
      setRecentFindings(recentFindingsData);
    } catch (error) {
      console.error('Failed to load audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: AuditPackage['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'preparing':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'under-review':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <Award className="w-4 h-4 text-purple-500" />;
      case 'archived':
        return <FileText className="w-4 h-4 text-slate-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: AuditPackage['status']) => {
    switch (status) {
      case 'ready':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'preparing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'under-review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'archived':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getRiskColor = (risk: AuditPackage['riskAssessment']) => {
    switch (risk) {
      case 'low':
        return 'text-emerald-600 bg-emerald-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getSeverityIcon = (severity: AuditFinding['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const filteredPackages = auditPackages.filter(pkg => {
    if (statusFilter !== 'all' && pkg.status !== statusFilter) return false;
    if (typeFilter !== 'all' && pkg.auditType !== typeFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-12 ${className}`}>
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-600">Loading audit preparation data...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Audit Preparation Center</h1>
            <p className="text-slate-600 mt-1">Real-time audit preparation and management dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors">
              <Plus className="w-4 h-4" />
              New Audit Package
            </button>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'packages', label: 'Audit Packages', icon: FileText },
            { id: 'findings', label: 'Findings', icon: AlertTriangle },
            { id: 'reports', label: 'Reports', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{metrics.totalPackages}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Total Audit Packages</h3>
            <p className="text-xs text-slate-500 mt-1">{metrics.readyPackages} ready for audit</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{metrics.auditPassRate}%</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Audit Pass Rate</h3>
            <p className="text-xs text-emerald-600 mt-1">Industry-leading success rate</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{metrics.averagePreparationTime.toFixed(0)}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Avg Prep Time (Days)</h3>
            <p className="text-xs text-slate-500 mt-1">Faster than industry average</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{metrics.findingsResolved}/{metrics.findingsResolved + metrics.findingsOpen}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Findings Resolved</h3>
            <p className="text-xs text-slate-500 mt-1">{metrics.findingsOpen} still open</p>
          </div>
        </div>
      )}

      {/* Audit Packages Tab */}
      {activeTab === 'packages' && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Audit Packages</h2>
                <p className="text-sm text-slate-600 mt-1">Manage and monitor audit preparation packages</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="under-review">Under Review</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="ISAE3000">ISAE 3000</option>
                  <option value="SOC2">SOC 2</option>
                  <option value="ISO27001">ISO 27001</option>
                  <option value="PCI-DSS">PCI-DSS</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredPackages.map((auditPackage) => (
              <div key={auditPackage.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-slate-900">{auditPackage.id}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {auditPackage.auditType}
                        </span>
                        <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium border ${getStatusColor(auditPackage.status)}`}>
                          {getStatusIcon(auditPackage.status)}
                          <span className="capitalize">{auditPackage.status.replace('-', ' ')}</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm text-slate-600">
                        <div>
                          <span className="text-slate-500">Auditor:</span> {auditPackage.auditor.firm}
                        </div>
                        <div>
                          <span className="text-slate-500">Period:</span> {auditPackage.auditPeriod.startDate.getFullYear()}
                        </div>
                        <div>
                          <span className="text-slate-500">Evidence:</span> {auditPackage.evidenceItems.length} items
                        </div>
                        <div>
                          <span className="text-slate-500">Updated:</span> {formatTimeAgo(auditPackage.lastUpdated)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-600">Completion</span>
                            <span className="font-medium text-slate-900">{auditPackage.completionPercentage}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${auditPackage.completionPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className={`px-2 py-1 text-xs rounded-full font-medium ${getRiskColor(auditPackage.riskAssessment)}`}>
                          {auditPackage.riskAssessment.toUpperCase()} RISK
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPackage(auditPackage)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Findings Tab */}
      {activeTab === 'findings' && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Audit Findings</h2>
                <p className="text-sm text-slate-600 mt-1">Track and resolve audit findings and recommendations</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600">Real-time Updates</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {recentFindings.length > 0 ? (
              recentFindings.map((finding) => (
                <div key={finding.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-slate-100 rounded">
                        {getSeverityIcon(finding.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-slate-900">{finding.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            finding.severity === 'critical' ? 'bg-red-100 text-red-700' :
                            finding.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                            finding.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {finding.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{finding.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Control: {finding.controlId}</span>
                          <span>•</span>
                          <span>Assigned: {finding.assignedTo || 'Unassigned'}</span>
                          <span>•</span>
                          <span>Target: {finding.targetDate?.toLocaleDateString() || 'TBD'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        finding.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' :
                        finding.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        <span className="capitalize">{finding.status.replace('-', ' ')}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{formatTimeAgo(finding.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No findings to display</p>
                <p className="text-sm mt-1">All audit findings have been resolved</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Management Reports</h2>
                <p className="text-sm text-slate-600 mt-1">Generate and manage audit reports for stakeholders</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                <Plus className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Executive Summary',
                  description: 'High-level overview for C-suite and board members',
                  icon: Users,
                  color: 'blue'
                },
                {
                  title: 'Detailed Findings Report',
                  description: 'Comprehensive analysis of all audit findings',
                  icon: FileText,
                  color: 'emerald'
                },
                {
                  title: 'Compliance Status Report',
                  description: 'Current compliance posture and control effectiveness',
                  icon: Shield,
                  color: 'purple'
                },
                {
                  title: 'Management Letter',
                  description: 'Formal communication to management and auditors',
                  icon: TrendingUp,
                  color: 'amber'
                },
                {
                  title: 'Remediation Plan',
                  description: 'Action items and timelines for addressing findings',
                  icon: Target,
                  color: 'red'
                },
                {
                  title: 'Audit Readiness Report',
                  description: 'Assessment of preparation status and gaps',
                  icon: CheckCircle,
                  color: 'green'
                }
              ].map((report, index) => {
                const IconComponent = report.icon;
                return (
                  <div key={index} className="border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors cursor-pointer">
                    <div className={`p-3 rounded-lg mb-4 bg-${report.color}-100`}>
                      <IconComponent className={`w-6 h-6 text-${report.color}-600`} />
                    </div>
                    <h3 className="font-medium text-slate-900 mb-2">{report.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Generate Report →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Package Detail Modal (simplified) */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">{selectedPackage.id}</h2>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Package Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-slate-500">Type:</span> {selectedPackage.auditType}</div>
                    <div><span className="text-slate-500">Status:</span> {selectedPackage.status}</div>
                    <div><span className="text-slate-500">Completion:</span> {selectedPackage.completionPercentage}%</div>
                    <div><span className="text-slate-500">Risk:</span> {selectedPackage.riskAssessment}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Auditor Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-slate-500">Firm:</span> {selectedPackage.auditor.firm}</div>
                    <div><span className="text-slate-500">Lead Auditor:</span> {selectedPackage.auditor.leadAuditor}</div>
                    <div><span className="text-slate-500">Email:</span> {selectedPackage.auditor.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditPreparationDashboard;