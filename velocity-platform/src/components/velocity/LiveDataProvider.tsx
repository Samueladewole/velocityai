import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import velocityApi from '@/services/velocity/api.service';
import velocityWebSocket from '@/services/velocity/websocket.service';

interface Agent {
  id: string;
  name: string;
  platform: string;
  framework: string;
  status: 'idle' | 'running' | 'paused' | 'error' | 'completed';
  evidence_collected: number;
  success_rate: number;
  last_run?: string;
  next_run?: string;
}

interface Evidence {
  id: string;
  title: string;
  evidence_type: string;
  status: string;
  framework: string;
  control_id: string;
  confidence_score: number;
  trust_points: number;
  created_at: string;
}

interface TrustScore {
  total_score: number;
  framework_scores: Record<string, number>;
  score_change: number;
  evidence_count: number;
  automation_rate: number;
  coverage_percentage: number;
  last_updated: string;
}

interface Integration {
  id: string;
  name: string;
  platform: string;
  status: string;
  last_sync?: string;
  error_count: number;
}

interface PerformanceMetrics {
  evidence_collected: number;
  active_agents: number;
  automation_rate: number;
  avg_collection_time: number;
  cost_savings: number;
  time_savings: number;
  framework_coverage: Record<string, number>;
}

interface LiveMetrics {
  lastUpdated: string;
  activeAgents: number;
  totalEvidence: number;
  totalTrustPoints: number;
  automationRate: number;
  collectionsToday: number;
  avgCollectionTime: number;
  successRate: number;
  trendsData: {
    evidenceOverTime: Array<{ time: string; value: number }>;
    trustPointsOverTime: Array<{ time: string; value: number }>;
  };
}

interface LiveDataContextType {
  // Data (compatible with LiveVelocityDashboard)
  agents: Agent[];
  evidence: Evidence[];
  evidenceStream: Evidence[]; // Alias for evidence
  trustScore: TrustScore | null;
  integrations: Integration[];
  performanceMetrics: PerformanceMetrics | null;
  metrics: LiveMetrics; // Dashboard-compatible metrics
  
  // Loading states
  loading: {
    agents: boolean;
    evidence: boolean;
    trustScore: boolean;
    integrations: boolean;
    metrics: boolean;
  };
  
  // Error states
  errors: {
    agents?: string;
    evidence?: string;
    trustScore?: string;
    integrations?: string;
    metrics?: string;
  };
  
  // Actions
  refreshAgents: () => Promise<void>;
  refreshEvidence: () => Promise<void>;
  refreshTrustScore: () => Promise<void>;
  refreshIntegrations: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  refreshAll: () => Promise<void>;
  refreshData: () => Promise<void>; // Alias for refreshAll
  
  // Agent control actions
  pauseAgent: (id: string) => Promise<void>;
  resumeAgent: (id: string) => Promise<void>;
  triggerCollection: (id: string) => Promise<void>;
  
  // Real-time status
  isConnected: boolean;
  connectionStatus: string;
  lastUpdate: string | null;
}

const LiveDataContext = createContext<LiveDataContextType | undefined>(undefined);

interface LiveDataProviderProps {
  children: ReactNode;
}

export const LiveDataProvider: React.FC<LiveDataProviderProps> = ({ children }) => {
  // Data state
  const [agents, setAgents] = useState<Agent[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  
  // Dashboard-compatible metrics
  const [metrics, setMetrics] = useState<LiveMetrics>({
    lastUpdated: new Date().toISOString(),
    activeAgents: 0,
    totalEvidence: 0,
    totalTrustPoints: 0,
    automationRate: 0,
    collectionsToday: 0,
    avgCollectionTime: 0,
    successRate: 0,
    trendsData: {
      evidenceOverTime: [],
      trustPointsOverTime: []
    }
  });
  
  // Loading states
  const [loading, setLoading] = useState({
    agents: false,
    evidence: false,
    trustScore: false,
    integrations: false,
    metrics: false,
  });
  
  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // WebSocket status
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  // API call wrapper with error handling
  const apiCall = async <T,>(
    call: () => Promise<{ data: T; success: boolean; error?: string }>,
    loadingKey: keyof typeof loading,
    setter: (data: T) => void
  ) => {
    setLoading(prev => ({ ...prev, [loadingKey]: true }));
    setErrors(prev => ({ ...prev, [loadingKey]: undefined }));
    
    try {
      const response = await call();
      if (response.success) {
        setter(response.data);
        setLastUpdate(new Date().toISOString());
      } else {
        throw new Error(response.error || 'API call failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({ ...prev, [loadingKey]: errorMessage }));
      console.error(`Error loading €{loadingKey}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Data fetching functions
  const refreshAgents = async () => {
    await apiCall(
      () => velocityApi.getAgents(),
      'agents',
      setAgents
    );
  };

  const refreshEvidence = async () => {
    await apiCall(
      () => velocityApi.getEvidence(),
      'evidence',
      setEvidence
    );
  };

  const refreshTrustScore = async () => {
    await apiCall(
      () => velocityApi.getTrustScore(),
      'trustScore',
      setTrustScore
    );
  };

  const refreshIntegrations = async () => {
    await apiCall(
      () => velocityApi.getIntegrations(),
      'integrations',
      setIntegrations
    );
  };

  const refreshMetrics = async () => {
    await apiCall(
      () => velocityApi.getPerformanceMetrics('week'),
      'metrics',
      setPerformanceMetrics
    );
  };

  const refreshAll = async () => {
    await Promise.all([
      refreshAgents(),
      refreshEvidence(),
      refreshTrustScore(),
      refreshIntegrations(),
      refreshMetrics(),
    ]);
    updateDashboardMetrics();
  };

  // Alias for dashboard compatibility
  const refreshData = refreshAll;

  // Agent control functions
  const pauseAgent = async (id: string) => {
    // Implementation would call API to pause agent
    console.log('Pausing agent:', id);
  };

  const resumeAgent = async (id: string) => {
    // Implementation would call API to resume agent
    console.log('Resuming agent:', id);
  };

  const triggerCollection = async (id: string) => {
    try {
      await velocityApi.runAgent(id);
      refreshAgents(); // Refresh to get updated status
    } catch (error) {
      console.error('Error triggering collection:', error);
    }
  };

  // Update dashboard metrics based on current data
  const updateDashboardMetrics = () => {
    const now = new Date().toISOString();
    const runningAgents = agents.filter(a => a.status === 'running').length;
    const totalEvidence = evidence.length;
    const totalTrustPoints = trustScore?.total_score || 0;
    const automationRate = performanceMetrics?.automation_rate || 0;
    
    // Generate mock trend data for demo
    const generateTrendData = (baseValue: number) => {
      return Array.from({ length: 24 }, (_, i) => ({
        time: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
        value: Math.max(0, baseValue + Math.random() * 20 - 10)
      }));
    };

    setMetrics({
      lastUpdated: now,
      activeAgents: agents.length,
      totalEvidence,
      totalTrustPoints,
      automationRate,
      collectionsToday: Math.floor(totalEvidence * 0.1), // Mock: 10% collected today
      avgCollectionTime: 2.5, // Mock average
      successRate: 95.2, // Mock success rate
      trendsData: {
        evidenceOverTime: generateTrendData(totalEvidence),
        trustPointsOverTime: generateTrendData(totalTrustPoints)
      }
    });
  };

  // WebSocket event handlers
  useEffect(() => {
    const handleConnectionEstablished = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    const handleAgentStatusUpdate = (message: any) => {
      const agentData = message.data;
      setAgents(prev => prev.map(agent => 
        agent.id === agentData.agent_id 
          ? { ...agent, ...agentData }
          : agent
      ));
      setLastUpdate(new Date().toISOString());
    };

    const handleEvidenceCollected = (message: any) => {
      const evidenceData = message.data;
      // Add new evidence to the beginning of the list
      setEvidence(prev => [evidenceData, ...prev]);
      setLastUpdate(new Date().toISOString());
      
      // Refresh trust score when new evidence is collected
      refreshTrustScore();
    };

    const handleTrustScoreUpdate = (message: any) => {
      const scoreData = message.data;
      setTrustScore(prev => prev ? { ...prev, ...scoreData } : null);
      setLastUpdate(new Date().toISOString());
    };

    const handleIntegrationStatus = (message: any) => {
      const integrationData = message.data;
      setIntegrations(prev => prev.map(integration =>
        integration.id === integrationData.integration_id
          ? { ...integration, ...integrationData }
          : integration
      ));
      setLastUpdate(new Date().toISOString());
    };

    const handleError = (message: any) => {
      console.error('WebSocket error:', message.data);
    };

    // Set up WebSocket event listeners
    const unsubscribeConnection = velocityWebSocket.on('connection_established', handleConnectionEstablished);
    const unsubscribeAgentStatus = velocityWebSocket.on('agent_status_update', handleAgentStatusUpdate);
    const unsubscribeEvidence = velocityWebSocket.on('evidence_collected', handleEvidenceCollected);
    const unsubscribeTrustScore = velocityWebSocket.on('trust_score_update', handleTrustScoreUpdate);
    const unsubscribeIntegration = velocityWebSocket.on('integration_status', handleIntegrationStatus);
    const unsubscribeError = velocityWebSocket.on('error', handleError);

    // Connect WebSocket if authenticated
    if (velocityApi.isAuthenticated()) {
      velocityWebSocket.connect();
    }

    // Periodic connection check
    const connectionInterval = setInterval(() => {
      setIsConnected(velocityWebSocket.isConnected());
    }, 5000);

    return () => {
      // Clean up event listeners
      unsubscribeConnection();
      unsubscribeAgentStatus();
      unsubscribeEvidence();
      unsubscribeTrustScore();
      unsubscribeIntegration();
      unsubscribeError();
      
      clearInterval(connectionInterval);
    };
  }, []);

  // Initial data load
  useEffect(() => {
    if (velocityApi.isAuthenticated()) {
      refreshAll();
    }
  }, []);

  // Update metrics when data changes
  useEffect(() => {
    updateDashboardMetrics();
  }, [agents, evidence, trustScore, performanceMetrics]);

  // Periodic data refresh (fallback for WebSocket)
  useEffect(() => {
    if (!velocityApi.isAuthenticated()) return;

    const refreshInterval = setInterval(() => {
      // Only refresh if WebSocket is not connected
      if (!isConnected) {
        refreshAll();
      } else {
        // Just refresh metrics periodically even with WebSocket
        refreshMetrics();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [isConnected]);

  // Connection status string
  const connectionStatus = isConnected ? 'Connected' : 'Disconnected';

  const contextValue: LiveDataContextType = {
    // Data
    agents,
    evidence,
    evidenceStream: evidence, // Alias for compatibility
    trustScore,
    integrations,
    performanceMetrics,
    metrics,
    
    // Loading states
    loading,
    
    // Error states
    errors,
    
    // Actions
    refreshAgents,
    refreshEvidence,
    refreshTrustScore,
    refreshIntegrations,
    refreshMetrics,
    refreshAll,
    refreshData,
    
    // Agent control actions
    pauseAgent,
    resumeAgent,
    triggerCollection,
    
    // Real-time status
    isConnected,
    connectionStatus,
    lastUpdate,
  };

  return (
    <LiveDataContext.Provider value={contextValue}>
      {children}
    </LiveDataContext.Provider>
  );
};

export const useLiveData = (): LiveDataContextType => {
  const context = useContext(LiveDataContext);
  if (context === undefined) {
    throw new Error('useLiveData must be used within a LiveDataProvider');
  }
  return context;
};

export default LiveDataProvider;