import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Activity,
  RefreshCw,
  Download,
  Plus,
  Eye,
  Settings,
  BarChart3,
  Zap,
  Building,
  Award,
  Search,
  Filter
} from 'lucide-react';
import SOXCoordinationService, { 
  SOXControl, 
  ControlMapping, 
  ComplianceGap, 
  CoordinationMetrics,
  DualComplianceReport 
} from '@/services/sox404/SOXCoordinationService';

interface SOXCoordinationDashboardProps {
  className?: string;
}

const SOXCoordinationDashboard: React.FC<SOXCoordinationDashboardProps> = ({ className = '' }) => {
  const [metrics, setMetrics] = useState<CoordinationMetrics | null>(null);
  const [soxControls, setSOXControls] = useState<SOXControl[]>([]);
  const [controlMappings, setControlMappings] = useState<ControlMapping[]>([]);
  const [complianceGaps, setComplianceGaps] = useState<ComplianceGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'mappings' | 'gaps' | 'reports'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');

  const soxService = SOXCoordinationService.getInstance();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const metricsData = soxService.getMetrics();
      const controlsData = soxService.getAllSOXControls();
      const mappingsData = await soxService.analyzeControlMappings();
      const gapsData = await soxService.identifyComplianceGaps();

      setMetrics(metricsData);
      setSOXControls(controlsData);
      setControlMappings(mappingsData);
      setComplianceGaps(gapsData);
    } catch (error) {
      console.error('Failed to load SOX coordination data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionIcon = (section: string) => {
    const icons: Record<string, React.ElementType> = {
      '302': Users,
      '404': Shield,
      '906': FileText,
      '409': AlertTriangle
    };
    return icons[section] || FileText;
  };

  const getMappingTypeColor = (mappingType: ControlMapping['mappingType']) => {
    switch (mappingType) {
      case 'direct':
        return 'text-emerald-600 bg-emerald-50';
      case 'partial':
        return 'text-amber-600 bg-amber-50';
      case 'complementary':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getGapSeverityColor = (severity: ComplianceGap['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getGapStatusIcon = (status: ComplianceGap['status']) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'identified':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredControls = soxControls.filter(control => {
    if (sectionFilter !== 'all' && control.section !== sectionFilter) return false;
    if (searchQuery && !control.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredGaps = complianceGaps.filter(gap => {
    if (searchQuery && !gap.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-12 €{className}`}>
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-600">Loading SOX coordination data...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 €{className}`}>
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">SOX 404 Coordination Center</h1>
            <p className="text-slate-600 mt-1">Unified SOX 404 and ISAE 3000 compliance management</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
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
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'mappings', label: 'Control Mappings', icon: Target },
            { id: 'gaps', label: 'Compliance Gaps', icon: AlertTriangle },
            { id: 'reports', label: 'Dual Reports', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors €{
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

      {/* Overview Tab */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{metrics.mappedControls}/{metrics.totalSOXControls}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Mapped Controls</h3>
              <p className="text-xs text-slate-500 mt-1">
                {((metrics.mappedControls / metrics.totalSOXControls) * 100).toFixed(1)}% coordination rate
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">€{(metrics.costSavings / 1000).toFixed(0)}K</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Cost Savings</h3>
              <p className="text-xs text-emerald-600 mt-1">Annual coordination benefit</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{metrics.timeReduction.toFixed(0)}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Days Saved</h3>
              <p className="text-xs text-slate-500 mt-1">Time reduction benefit</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{metrics.coordinationEfficiency.toFixed(1)}%</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Efficiency Gain</h3>
              <p className="text-xs text-slate-500 mt-1">Overall coordination efficiency</p>
            </div>
          </div>

          {/* SOX Controls Overview */}
          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">SOX 404 Controls Overview</h2>
                  <p className="text-sm text-slate-600 mt-1">Banking-specific SOX controls with ISAE mappings</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Sections</option>
                    <option value="302">Section 302</option>
                    <option value="404">Section 404</option>
                    <option value="906">Section 906</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredControls.slice(0, 5).map((control) => {
                const IconComponent = getSectionIcon(control.section);
                const mapping = controlMappings.find(m => m.soxControlId === control.id);
                
                return (
                  <div key={control.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <IconComponent className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-slate-900">{control.id}</h3>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              Section {control.section}
                            </span>
                            {control.bankingSpecific && (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                                Banking Specific
                              </span>
                            )}
                          </div>
                          <h4 className="font-medium text-slate-900 mb-2">{control.title}</h4>
                          <p className="text-sm text-slate-600 mb-3">{control.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>Risk: {control.riskLevel.toUpperCase()}</span>
                            <span>•</span>
                            <span>Frequency: {control.frequency}</span>
                            <span>•</span>
                            <span>Automation: {control.automationLevel}%</span>
                            {mapping && (
                              <>
                                <span>•</span>
                                <span>ISAE Mapping: {mapping.isaeControlId}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {mapping && (
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium €{getMappingTypeColor(mapping.mappingType)}`}>
                            {mapping.overlapPercentage}% Overlap
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Control Mappings Tab */}
      {activeTab === 'mappings' && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">SOX-ISAE Control Mappings</h2>
                <p className="text-sm text-slate-600 mt-1">Coordination between SOX 404 and ISAE 3000 controls</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors">
                <Plus className="w-4 h-4" />
                Create Mapping
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {controlMappings.map((mapping, index) => (
              <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{mapping.soxControlId}</span>
                        <span className="text-slate-400">↔</span>
                        <span className="font-medium text-slate-900">{mapping.isaeControlId}</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium €{getMappingTypeColor(mapping.mappingType)}`}>
                        {mapping.mappingType.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{mapping.coordinationPlan}</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-slate-700 mb-1">Shared Evidence</h5>
                        <div className="flex flex-wrap gap-1">
                          {mapping.sharedEvidence.map((evidence, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                              {evidence}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-700 mb-1">Gap Analysis</h5>
                        <ul className="text-xs text-slate-600 space-y-1">
                          {mapping.gapAnalysis.map((gap, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-amber-500 mt-0.5">•</span>
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 mb-1">{mapping.overlapPercentage}%</div>
                    <div className="text-xs text-slate-500">Overlap</div>
                    <div className="mt-3 w-20 h-2 bg-slate-200 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                        style={{ width: `€{mapping.overlapPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Gaps Tab */}
      {activeTab === 'gaps' && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Compliance Gaps Analysis</h2>
                <p className="text-sm text-slate-600 mt-1">Identified gaps and remediation plans</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600">{complianceGaps.filter(g => g.status !== 'resolved').length} Active Gaps</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredGaps.map((gap) => (
              <div key={gap.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-slate-100 rounded">
                      {getGapStatusIcon(gap.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-slate-900">Gap in {gap.controlId}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium border €{getGapSeverityColor(gap.severity)}`}>
                          {gap.severity.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                          {gap.gapType.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{gap.description}</p>
                      <p className="text-sm text-slate-700 mb-3"><strong>Impact:</strong> {gap.impact}</p>
                      <p className="text-sm text-emerald-700 mb-3"><strong>Remediation:</strong> {gap.remediation}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Assigned: {gap.assignedTo}</span>
                        <span>•</span>
                        <span>Target: {gap.targetDate.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Framework: {gap.framework}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium €{
                      gap.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' :
                      gap.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      <span className="capitalize">{gap.status.replace('-', ' ')}</span>
                    </div>
                    <div className="mt-2">
                      <button className="text-xs text-blue-600 hover:text-blue-700">
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Dual Compliance Reports</h2>
                <p className="text-sm text-slate-600 mt-1">Integrated SOX 404 and ISAE 3000 reporting</p>
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
                  title: 'Coordination Effectiveness Report',
                  description: 'Analysis of SOX-ISAE coordination efficiency and benefits',
                  icon: TrendingUp,
                  color: 'blue',
                  metrics: ['42% efficiency gain', '38% cost reduction', '15 shared controls']
                },
                {
                  title: 'Management Certification Support',
                  description: 'Documentation supporting SOX 302/404 management certifications',
                  icon: Users,
                  color: 'emerald',
                  metrics: ['94% SOX compliance', '96% ISAE coverage', '2 open findings']
                },
                {
                  title: 'Dual Framework Assessment',
                  description: 'Comprehensive assessment of both compliance frameworks',
                  icon: Shield,
                  color: 'purple',
                  metrics: ['25 SOX controls', '10 ISAE controls', '85% mapping rate']
                },
                {
                  title: 'Gap Analysis Report',
                  description: 'Identified gaps and remediation progress tracking',
                  icon: AlertTriangle,
                  color: 'amber',
                  metrics: [`€{complianceGaps.length} gaps identified`, `€{complianceGaps.filter(g => g.status === 'resolved').length} resolved`, `€{complianceGaps.filter(g => g.status !== 'resolved').length} remaining`]
                },
                {
                  title: 'Cost Benefit Analysis',
                  description: 'Financial impact of coordinated compliance approach',
                  icon: DollarSign,
                  color: 'green',
                  metrics: [`€€{(metrics?.costSavings || 0 / 1000).toFixed(0)}K saved`, `€{(metrics?.timeReduction || 0).toFixed(0)} days reduced`, '35% ROI improvement']
                },
                {
                  title: 'Auditor Coordination Report',
                  description: 'Status and coordination with external auditors',
                  icon: FileText,
                  color: 'indigo',
                  metrics: ['2 audit firms', '98% evidence sharing', '6 weeks timeline']
                }
              ].map((report, index) => {
                const IconComponent = report.icon;
                return (
                  <div key={index} className="border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors cursor-pointer">
                    <div className={`p-3 rounded-lg mb-4 bg-€{report.color}-100`}>
                      <IconComponent className={`w-6 h-6 text-€{report.color}-600`} />
                    </div>
                    <h3 className="font-medium text-slate-900 mb-2">{report.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                    <div className="space-y-1 mb-4">
                      {report.metrics.map((metric, idx) => (
                        <div key={idx} className="text-xs text-slate-700 flex items-center gap-1">
                          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                          {metric}
                        </div>
                      ))}
                    </div>
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
    </div>
  );
};

export default SOXCoordinationDashboard;