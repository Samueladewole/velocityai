import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  Loader, 
  Clock,
  Shield,
  Activity,
  TrendingUp,
  Download,
  RefreshCw,
  Server,
  Eye,
  FileText,
  Building,
  Zap
} from 'lucide-react';
import BankingIntegrationService, { BankingSystem, EvidenceItem, BankingIntegrationMetrics } from '@/services/banking/BankingIntegrationService';

interface BankingSystemsDashboardProps {
  className?: string;
}

const BankingSystemsDashboard: React.FC<BankingSystemsDashboardProps> = ({ className = '' }) => {
  const [systems, setSystems] = useState<BankingSystem[]>([]);
  const [metrics, setMetrics] = useState<BankingIntegrationMetrics | null>(null);
  const [recentEvidence, setRecentEvidence] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [collecting, setCollecting] = useState<Set<string>>(new Set());

  const integrationService = BankingIntegrationService.getInstance();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const allSystems = integrationService.getAllSystems();
      const systemMetrics = integrationService.getMetrics();
      
      // Get recent evidence from all systems
      const allEvidence: EvidenceItem[] = [];
      allSystems.forEach(system => {
        const systemEvidence = integrationService.getEvidenceBySystemId(system.id);
        allEvidence.push(...systemEvidence);
      });
      
      // Sort by timestamp and take the 10 most recent
      const sortedEvidence = allEvidence
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10);

      setSystems(allSystems);
      setMetrics(systemMetrics);
      setRecentEvidence(sortedEvidence);
    } catch (error) {
      console.error('Failed to load banking systems data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (systemId: string) => {
    try {
      setCollecting(prev => new Set(prev).add(systemId));
      await integrationService.connectToSystem(systemId);
      await loadData();
    } catch (error) {
      console.error('Failed to connect to system:', error);
    } finally {
      setCollecting(prev => {
        const newSet = new Set(prev);
        newSet.delete(systemId);
        return newSet;
      });
    }
  };

  const handleCollectEvidence = async (systemId: string) => {
    try {
      setCollecting(prev => new Set(prev).add(systemId));
      await integrationService.collectEvidence(systemId);
      await loadData();
    } catch (error) {
      console.error('Failed to collect evidence:', error);
    } finally {
      setCollecting(prev => {
        const newSet = new Set(prev);
        newSet.delete(systemId);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status: BankingSystem['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'connecting':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'disconnected':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: BankingSystem['status']) => {
    switch (status) {
      case 'connected':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'connecting':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'disconnected':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getConnectionTypeIcon = (connectionType: BankingSystem['connectionType']) => {
    switch (connectionType) {
      case 'real-time-api':
        return <Zap className="w-4 h-4 text-emerald-500" />;
      case 'database-sync':
        return <Database className="w-4 h-4 text-blue-500" />;
      case 'direct-connect':
        return <Server className="w-4 h-4 text-purple-500" />;
      case 'event-streaming':
        return <Activity className="w-4 h-4 text-orange-500" />;
      case 'batch-sync':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'scheduled-extract':
        return <RefreshCw className="w-4 h-4 text-slate-500" />;
      default:
        return <Database className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `€{seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `€{minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `€{hours}h ago`;
    const days = Math.floor(hours / 24);
    return `€{days}d ago`;
  };

  const getCategoryIcon = (category: EvidenceItem['category']) => {
    switch (category) {
      case 'subject-matter':
        return <Building className="w-4 h-4 text-blue-500" />;
      case 'it-general':
        return <Server className="w-4 h-4 text-green-500" />;
      case 'management':
        return <Eye className="w-4 h-4 text-purple-500" />;
      case 'regulatory':
        return <Shield className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-12 €{className}`}>
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-slate-600">Loading banking systems...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 €{className}`}>
      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{metrics.connectedSystems}/{metrics.totalSystems}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Connected Systems</h3>
            <p className="text-xs text-slate-500 mt-1">Real-time banking integration</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{metrics.totalEvidence.toLocaleString()}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Evidence Items</h3>
            <p className="text-xs text-emerald-600 mt-1">+{metrics.todaysCollection} today</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{metrics.verificationRate.toFixed(1)}%</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Verification Rate</h3>
            <p className="text-xs text-slate-500 mt-1">Cryptographic validation</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900">{metrics.complianceCoverage.toFixed(1)}%</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">ISAE 3000 Coverage</h3>
            <p className="text-xs text-slate-500 mt-1">Control mapping progress</p>
          </div>
        </div>
      )}

      {/* Banking Systems Grid */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Banking System Integrations</h2>
              <p className="text-sm text-slate-600 mt-1">Real-time evidence collection from core banking platforms</p>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {systems.map((system) => (
            <div key={system.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {getConnectionTypeIcon(system.connectionType)}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{system.name}</h3>
                    <p className="text-sm text-slate-600">{system.vendor} • v{system.version}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 capitalize">{system.type.replace('-', ' ')}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 capitalize">{system.connectionType.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium €{getStatusColor(system.status)}`}>
                  {getStatusIcon(system.status)}
                  <span className="capitalize">{system.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <p className="text-lg font-bold text-slate-900">{system.controlsMapped}</p>
                  <p className="text-xs text-slate-600">Controls Mapped</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{system.evidenceTypes.length}</p>
                  <p className="text-xs text-slate-600">Evidence Types</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{formatTimeAgo(system.lastSync)}</p>
                  <p className="text-xs text-slate-600">Last Sync</p>
                </div>
              </div>

              <div className="flex gap-2">
                {system.status === 'disconnected' && (
                  <button
                    onClick={() => handleConnect(system.id)}
                    disabled={collecting.has(system.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {collecting.has(system.id) ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Connect
                  </button>
                )}
                {system.status === 'connected' && (
                  <button
                    onClick={() => handleCollectEvidence(system.id)}
                    disabled={collecting.has(system.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {collecting.has(system.id) ? <Loader className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                    Collect Evidence
                  </button>
                )}
                <button className="px-3 py-2 bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Evidence Stream */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Evidence Collection</h2>
              <p className="text-sm text-slate-600 mt-1">Latest ISAE 3000 evidence items from banking systems</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {recentEvidence.length > 0 ? (
            recentEvidence.map((evidence) => (
              <div key={evidence.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-slate-100 rounded">
                      {getCategoryIcon(evidence.category)}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 text-sm">{evidence.description}</h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-600">
                        <span>Type: {evidence.type.replace('-', ' ')}</span>
                        <span>•</span>
                        <span>Control: {evidence.isaeControlId}</span>
                        <span>•</span>
                        <span className="capitalize">{evidence.category.replace('-', ' ')} Control</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium €{
                      evidence.verificationStatus === 'verified' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : evidence.verificationStatus === 'pending'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {evidence.verificationStatus === 'verified' && <CheckCircle className="w-3 h-3" />}
                      {evidence.verificationStatus === 'pending' && <Clock className="w-3 h-3" />}
                      {evidence.verificationStatus === 'failed' && <AlertTriangle className="w-3 h-3" />}
                      <span className="capitalize">{evidence.verificationStatus}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{formatTimeAgo(evidence.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No evidence collected yet</p>
              <p className="text-sm mt-1">Connect to banking systems to start collecting evidence</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankingSystemsDashboard;