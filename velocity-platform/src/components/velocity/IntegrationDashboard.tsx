import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Shield, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  TrendingUp,
  Activity,
  Database,
  Clock
} from 'lucide-react';
import { dateUtils } from '@/components/shared/DateProvider';

interface ComponentStatus {
  status: 'healthy' | 'warning' | 'error';
  last_sync: string;
  records_synced: number;
  errors: number;
}

interface SyncStatus {
  customer_id: string;
  last_full_sync: string;
  sync_frequency_minutes: number;
  components: {
    trust_equity: ComponentStatus;
    compass: ComponentStatus;
    atlas: ComponentStatus;
  };
  overall_health: string;
  next_scheduled_sync: string;
}

interface PerformanceReport {
  evidence_collection: {
    total_items: number;
    ai_collected: number;
    automation_rate: number;
  };
  trust_score_impact: {
    starting_score: number;
    ending_score: number;
    improvement: number;
    ai_contribution_points: number;
  };
  framework_coverage: Record<string, {
    controls: number;
    automated: number;
    coverage: number;
  }>;
  time_savings: {
    manual_hours_saved: number;
    cost_savings_usd: number;
    onboarding_time_reduction: string;
  };
}

const IntegrationDashboard: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockSyncStatus: SyncStatus = {
        customer_id: 'demo_customer',
        last_full_sync: dateUtils.getRecentTimestamp(30),
        sync_frequency_minutes: 15,
        components: {
          trust_equity: {
            status: 'healthy',
            last_sync: dateUtils.getRecentTimestamp(30),
            records_synced: 1547,
            errors: 0
          },
          compass: {
            status: 'healthy',
            last_sync: dateUtils.getRecentTimestamp(30),
            records_synced: 64,
            errors: 0
          },
          atlas: {
            status: 'warning',
            last_sync: dateUtils.getRecentTimestamp(35),
            records_synced: 23,
            errors: 1
          }
        },
        overall_health: 'healthy',
        next_scheduled_sync: dateUtils.getTimestamp(15)
      };

      const mockPerformanceReport: PerformanceReport = {
        evidence_collection: {
          total_items: 1547,
          ai_collected: 1471,
          automation_rate: 95.1
        },
        trust_score_impact: {
          starting_score: 67.3,
          ending_score: 89.7,
          improvement: 22.4,
          ai_contribution_points: 3847
        },
        framework_coverage: {
          'SOC2': { controls: 64, automated: 61, coverage: 95.3 },
          'ISO27001': { controls: 114, automated: 108, coverage: 94.7 },
          'GDPR': { controls: 23, automated: 22, coverage: 95.7 }
        },
        time_savings: {
          manual_hours_saved: 387.5,
          cost_savings_usd: 15500,
          onboarding_time_reduction: '92%'
        }
      };

      setSyncStatus(mockSyncStatus);
      setPerformanceReport(mockPerformanceReport);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setLoading(false);
    }
  };

  const handleFullSync = async () => {
    setSyncing(true);
    try {
      // Mock sync - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      await loadDashboardData();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ERIP Integration Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                AI Agents sync status with Trust Equity, Compass, and Atlas
              </p>
            </div>
            <button
              onClick={handleFullSync}
              disabled={syncing}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 €{syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Force Sync'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Integration Status</h2>
            <div className="flex items-center">
              {getStatusIcon(syncStatus?.overall_health || 'unknown')}
              <span className="ml-2 text-sm font-medium text-gray-700">
                {syncStatus?.overall_health?.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {syncStatus?.sync_frequency_minutes}min
              </div>
              <div className="text-sm text-gray-600">Sync Frequency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {syncStatus ? formatDateTime(syncStatus.last_full_sync) : '-'}
              </div>
              <div className="text-sm text-gray-600">Last Full Sync</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {syncStatus ? formatDateTime(syncStatus.next_scheduled_sync) : '-'}
              </div>
              <div className="text-sm text-gray-600">Next Sync</div>
            </div>
          </div>
        </div>

        {/* Component Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {syncStatus && Object.entries(syncStatus.components).map(([component, status]) => {
            const icons = {
              trust_equity: <Zap className="w-8 h-8 text-blue-600" />,
              compass: <Shield className="w-8 h-8 text-green-600" />,
              atlas: <Target className="w-8 h-8 text-purple-600" />
            };

            const names = {
              trust_equity: 'Trust Equity',
              compass: 'Compass',
              atlas: 'Atlas'
            };

            return (
              <div
                key={component}
                className={`bg-white rounded-lg shadow border-2 €{getStatusColor(status.status)} p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {icons[component as keyof typeof icons]}
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">
                      {names[component as keyof typeof names]}
                    </h3>
                  </div>
                  {getStatusIcon(status.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Records Synced:</span>
                    <span className="text-sm font-medium">{status.records_synced.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Errors:</span>
                    <span className={`text-sm font-medium €{status.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {status.errors}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Sync:</span>
                    <span className="text-sm font-medium">
                      {formatDateTime(status.last_sync)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Metrics */}
        {performanceReport && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Evidence Collection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                Evidence Collection (30 days)
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {performanceReport.evidence_collection.total_items.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">AI Collected:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {performanceReport.evidence_collection.ai_collected.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Automation Rate:</span>
                  <span className="text-xl font-bold text-green-600">
                    {performanceReport.evidence_collection.automation_rate}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `€{performanceReport.evidence_collection.automation_rate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Trust Score Impact */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Trust Score Impact
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Starting Score:</span>
                  <span className="text-xl font-bold text-gray-600">
                    {performanceReport.trust_score_impact.starting_score}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Score:</span>
                  <span className="text-xl font-bold text-green-600">
                    {performanceReport.trust_score_impact.ending_score}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Improvement:</span>
                  <span className="text-xl font-bold text-blue-600">
                    +{performanceReport.trust_score_impact.improvement}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">AI Contribution:</span>
                  <span className="text-xl font-bold text-purple-600">
                    {performanceReport.trust_score_impact.ai_contribution_points.toLocaleString()} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Framework Coverage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Framework Coverage
              </h3>
              
              <div className="space-y-3">
                {Object.entries(performanceReport.framework_coverage).map(([framework, data]) => (
                  <div key={framework}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{framework}</span>
                      <span className="text-green-600">{data.coverage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `€{data.coverage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {data.automated}/{data.controls} controls automated
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Savings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                Time & Cost Savings
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {performanceReport.time_savings.manual_hours_saved}h
                  </div>
                  <div className="text-sm text-gray-600">Manual Hours Saved</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    €{performanceReport.time_savings.cost_savings_usd.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Cost Savings</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {performanceReport.time_savings.onboarding_time_reduction}
                  </div>
                  <div className="text-sm text-gray-600">Onboarding Time Reduction</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationDashboard;