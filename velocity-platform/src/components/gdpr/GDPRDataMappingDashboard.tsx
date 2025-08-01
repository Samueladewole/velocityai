import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Shield, 
  Users, 
  Globe, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Download, 
  RefreshCw,
  Search,
  Filter,
  Settings,
  Building,
  Lock,
  Activity,
  Clock,
  Target,
  Zap,
  ArrowRight,
  MapPin,
  UserCheck
} from 'lucide-react';
import GDPRComplianceService, { 
  DataProcessingActivity, 
  GDPRMetrics,
  BankingGDPRContext 
} from '@/services/gdpr/GDPRComplianceService';

interface GDPRDataMappingDashboardProps {
  className?: string;
}

const GDPRDataMappingDashboard: React.FC<GDPRDataMappingDashboardProps> = ({ className = '' }) => {
  const [processingActivities, setProcessingActivities] = useState<DataProcessingActivity[]>([]);
  const [metrics, setMetrics] = useState<GDPRMetrics | null>(null);
  const [bankingContext, setBankingContext] = useState<BankingGDPRContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'mapping' | 'compliance'>('overview');
  const [selectedActivity, setSelectedActivity] = useState<DataProcessingActivity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const gdprService = GDPRComplianceService.getInstance();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const activities = gdprService.getAllProcessingActivities();
      const metricsData = gdprService.getMetrics();
      const contextData = gdprService.getBankingContext();

      setProcessingActivities(activities);
      setMetrics(metricsData);
      setBankingContext(contextData);
    } catch (error) {
      console.error('Failed to load GDPR data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'very-high':
        return 'text-red-700 bg-red-100 border-red-300';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 bg-emerald-50';
      case 'under-review':
        return 'text-amber-600 bg-amber-50';
      case 'inactive':
        return 'text-slate-600 bg-slate-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getLegalBasisIcon = (basis: string) => {
    switch (basis) {
      case 'consent':
        return <UserCheck className="w-4 h-4 text-blue-500" />;
      case 'contract':
        return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'legal-obligation':
        return <Shield className="w-4 h-4 text-purple-500" />;
      case 'legitimate-interests':
        return <Target className="w-4 h-4 text-amber-500" />;
      default:
        return <Database className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredActivities = processingActivities.filter(activity => {
    if (riskFilter !== 'all' && activity.riskAssessment.overallRisk !== riskFilter) return false;
    if (searchQuery && !activity.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-12 €{className}`}>
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-600">Loading GDPR data mapping...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 €{className}`}>
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">GDPR Data Mapping Center</h1>
            <p className="text-slate-600 mt-1">Comprehensive view of personal data processing activities and compliance status</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors">
              <Download className="w-4 h-4" />
              Export RoPA
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
            { id: 'activities', label: 'Processing Activities', icon: Database },
            { id: 'mapping', label: 'Data Flow Mapping', icon: MapPin },
            { id: 'compliance', label: 'Compliance Status', icon: Shield }
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
      {activeTab === 'overview' && metrics && bankingContext && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{metrics.totalProcessingActivities}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Processing Activities</h3>
              <p className="text-xs text-slate-500 mt-1">{metrics.highRiskActivities} high risk</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{bankingContext.customerAccounts.toLocaleString()}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Customer Accounts</h3>
              <p className="text-xs text-emerald-600 mt-1">Data subjects covered</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{metrics.complianceScore}%</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Compliance Score</h3>
              <p className="text-xs text-slate-500 mt-1">Overall GDPR compliance</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Globe className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{bankingContext.internationalTransfers.toLocaleString()}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">International Transfers</h3>
              <p className="text-xs text-slate-500 mt-1">Cross-border data flows</p>
            </div>
          </div>

          {/* Banking Context Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Banking Data Profile</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">Customer Accounts</span>
                  </div>
                  <span className="font-medium text-slate-900">{bankingContext.customerAccounts.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">Monthly Transactions</span>
                  </div>
                  <span className="font-medium text-slate-900">{bankingContext.transactionVolume.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">Third Party Processors</span>
                  </div>
                  <span className="font-medium text-slate-900">{bankingContext.thirdPartyProcessors}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Regulatory Compliance</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Key Requirements</h4>
                  <div className="space-y-1">
                    {bankingContext.regulatoryRequirements.slice(0, 3).map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-slate-600">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Supervisory Authorities</h4>
                  <div className="space-y-1">
                    {bankingContext.supervisoryAuthorities.map((authority, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-slate-600">{authority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button 
                onClick={() => setActiveTab('activities')}
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <Database className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-slate-900">Review Activities</div>
                  <div className="text-sm text-slate-600">Manage processing activities</div>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('mapping')}
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <MapPin className="w-5 h-5 text-emerald-600" />
                <div className="text-left">
                  <div className="font-medium text-slate-900">View Data Flows</div>
                  <div className="text-sm text-slate-600">Visualize data mapping</div>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('compliance')}
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <Shield className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium text-slate-900">Check Compliance</div>
                  <div className="text-sm text-slate-600">Review compliance status</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Activities Tab */}
      {activeTab === 'activities' && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Data Processing Activities</h2>
                <p className="text-sm text-slate-600 mt-1">Comprehensive records of all personal data processing</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="very-high">Very High Risk</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-slate-900">{activity.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium border €{getRiskColor(activity.riskAssessment.overallRisk)}`}>
                        {activity.riskAssessment.overallRisk.toUpperCase()} RISK
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium €{getStatusColor(activity.status)}`}>
                        {activity.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3">{activity.description}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-slate-500 font-medium mb-1">Legal Bases:</div>
                        <div className="flex flex-wrap gap-1">
                          {activity.legalBases.map((basis, idx) => (
                            <div key={idx} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                              {getLegalBasisIcon(basis)}
                              {basis.replace('-', ' ')}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-slate-500 font-medium mb-1">Data Categories:</div>
                        <div className="text-sm text-slate-700">{activity.categories.length} categories, {activity.categories.reduce((sum, cat) => sum + cat.volume, 0).toLocaleString()} records</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 font-medium">Controller:</span> {activity.controller}
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Retention:</span> {activity.retentionPeriod}
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Next Review:</span> {activity.nextReview.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedActivity(activity)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Flow Mapping Tab */}
      {activeTab === 'mapping' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Interactive Data Flow Mapping</h2>
            <p className="text-slate-600">Visual representation of personal data flows across banking systems</p>
          </div>

          {/* Data Flow Visualization */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-8 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Data Sources */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 text-center">Data Sources</h3>
                {[
                  { name: 'Customer Onboarding', icon: Users, count: '2.5M records' },
                  { name: 'Transaction Systems', icon: Activity, count: '50M records' },
                  { name: 'Digital Banking', icon: Globe, count: '15M records' }
                ].map((source, index) => {
                  const Icon = source.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{source.name}</div>
                        <div className="text-xs text-slate-500">{source.count}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Processing Center */}
              <div className="text-center">
                <div className="relative">
                  <div className="p-4 bg-emerald-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900">GDPR Processing Engine</h3>
                <p className="text-sm text-slate-600">AI-powered compliance automation</p>
              </div>

              {/* Data Recipients */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 text-center">Recipients & Transfers</h3>
                {[
                  { name: 'Regulatory Authorities', icon: Shield, location: 'EU' },
                  { name: 'Credit Agencies', icon: FileText, location: 'EU/UK' },
                  { name: 'Payment Processors', icon: Globe, location: 'EU/US' }
                ].map((recipient, index) => {
                  const Icon = recipient.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="p-2 bg-purple-100 rounded">
                        <Icon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{recipient.name}</div>
                        <div className="text-xs text-slate-500">{recipient.location}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Flow Arrows */}
            <div className="flex items-center justify-center mt-6 space-x-4">
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <div className="text-sm font-medium text-slate-600">Automated Data Flow Processing</div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* Flow Statistics */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-slate-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">67.5M</div>
              <div className="text-sm text-slate-600">Total Records</div>
            </div>
            <div className="text-center p-4 border border-slate-200 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">15</div>
              <div className="text-sm text-slate-600">Processing Activities</div>
            </div>
            <div className="text-center p-4 border border-slate-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-slate-600">Third Party Recipients</div>
            </div>
            <div className="text-center p-4 border border-slate-200 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">3</div>
              <div className="text-sm text-slate-600">Cross-Border Transfers</div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Status Tab */}
      {activeTab === 'compliance' && metrics && (
        <div className="space-y-6">
          {/* Compliance Score */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Overall Compliance Status</h2>
              <div className="text-right">
                <div className="text-3xl font-bold text-emerald-600">{metrics.complianceScore}%</div>
                <div className="text-sm text-slate-600">Compliance Score</div>
              </div>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-3 mb-6">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `€{metrics.complianceScore}%` }}
              ></div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="font-semibold text-emerald-900">Compliant Activities</div>
                <div className="text-2xl font-bold text-emerald-600">{metrics.totalProcessingActivities - metrics.highRiskActivities}</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="font-semibold text-amber-900">Requires Review</div>
                <div className="text-2xl font-bold text-amber-600">{metrics.highRiskActivities}</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-blue-900">PIAs Completed</div>
                <div className="text-2xl font-bold text-blue-600">{metrics.completedPIAs}</div>
              </div>
            </div>
          </div>

          {/* Compliance Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Data Subject Rights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Total Requests</span>
                  <span className="font-medium text-slate-900">{metrics.dataSubjectRequests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Completed on Time</span>
                  <span className="font-medium text-emerald-600">{metrics.requestsWithinDeadline}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Average Response Time</span>
                  <span className="font-medium text-slate-900">5.2 days</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `€{(metrics.requestsWithinDeadline / Math.max(1, metrics.dataSubjectRequests)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Data Protection Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Breach Incidents</span>
                  <span className="font-medium text-slate-900">{metrics.breachIncidents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Notifiable Breaches</span>
                  <span className="font-medium text-amber-600">{metrics.notifiableBreaches}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Active Consents</span>
                  <span className="font-medium text-emerald-600">{metrics.activeConsents.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `€{(metrics.activeConsents / Math.max(1, metrics.consentRecords)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">{selectedActivity.name}</h2>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Processing Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-slate-500">Controller:</span> {selectedActivity.controller}</div>
                    <div><span className="text-slate-500">DPO:</span> {selectedActivity.dpo}</div>
                    <div><span className="text-slate-500">Status:</span> {selectedActivity.status}</div>
                    <div><span className="text-slate-500">Risk Level:</span> {selectedActivity.riskAssessment.overallRisk}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Data Categories</h3>
                  <div className="space-y-2">
                    {selectedActivity.categories.map((category, index) => (
                      <div key={index} className="p-2 bg-slate-50 rounded text-sm">
                        <div className="font-medium">{category.category}</div>
                        <div className="text-slate-600">{category.volume.toLocaleString()} records</div>
                      </div>
                    ))}
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

export default GDPRDataMappingDashboard;