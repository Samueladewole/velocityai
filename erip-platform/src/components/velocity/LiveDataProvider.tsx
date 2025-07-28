/**
 * Live Data Provider for Velocity Platform
 * Provides real-time data updates, WebSocket connections, and live metrics
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface LiveMetrics {
  activeAgents: number;
  totalEvidence: number;
  totalTrustPoints: number;
  automationRate: number;
  collectionsToday: number;
  avgCollectionTime: number;
  successRate: number;
  lastUpdated: string;
  trendsData: {
    evidenceOverTime: Array<{ time: string; count: number }>;
    trustPointsOverTime: Array<{ time: string; points: number }>;
    automationRateOverTime: Array<{ time: string; rate: number }>;
  };
}

interface AgentStatus {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'error' | 'completed';
  platform: string;
  framework: string;
  progress: number;
  evidenceCollected: number;
  trustPoints: number;
  lastRun: string;
  nextRun: string;
  currentActivity: string;
  errorMessage?: string;
}

interface EvidenceStream {
  id: string;
  agentId: string;
  type: 'screenshot' | 'api_response' | 'configuration' | 'log_entry';
  control: string;
  confidence: number;
  status: 'collecting' | 'validating' | 'validated' | 'failed';
  timestamp: string;
  platform: string;
  framework: string;
  trustPoints: number;
  description: string;
}

interface LiveDataContextType {
  metrics: LiveMetrics;
  agents: AgentStatus[];
  evidenceStream: EvidenceStream[];
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  subscribeToAgent: (agentId: string) => void;
  unsubscribeFromAgent: (agentId: string) => void;
  pauseAgent: (agentId: string) => Promise<boolean>;
  resumeAgent: (agentId: string) => Promise<boolean>;
  triggerCollection: (agentId: string) => Promise<boolean>;
  refreshData: () => void;
}

const LiveDataContext = createContext<LiveDataContextType | null>(null);

export const useLiveData = () => {
  const context = useContext(LiveDataContext);
  if (!context) {
    throw new Error('useLiveData must be used within a LiveDataProvider');
  }
  return context;
};

interface LiveDataProviderProps {
  children: React.ReactNode;
}

export const LiveDataProvider: React.FC<LiveDataProviderProps> = ({ children }) => {
  const [metrics, setMetrics] = useState<LiveMetrics>({
    activeAgents: 0,
    totalEvidence: 0,
    totalTrustPoints: 0,
    automationRate: 0,
    collectionsToday: 0,
    avgCollectionTime: 0,
    successRate: 0,
    lastUpdated: new Date().toISOString(),
    trendsData: {
      evidenceOverTime: [],
      trustPointsOverTime: [],
      automationRateOverTime: []
    }
  });

  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [evidenceStream, setEvidenceStream] = useState<EvidenceStream[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [subscribedAgents, setSubscribedAgents] = useState<Set<string>>(new Set());

  // Simulate WebSocket connection
  const connectWebSocket = useCallback(() => {
    setConnectionStatus('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      console.log('🔗 Live data connection established');
    }, 1000);
  }, []);

  // Generate realistic live data
  const generateLiveMetrics = useCallback(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    
    // Simulate realistic fluctuations
    const baseEvidence = 850;
    const evidenceVariation = Math.floor(Math.random() * 100) - 50;
    const newEvidenceCount = Math.max(0, baseEvidence + evidenceVariation + Math.floor(now.getMinutes() * 2.3));
    
    const baseTrustPoints = 2340;
    const trustPointsVariation = Math.floor(Math.random() * 200) - 100;
    const newTrustPoints = Math.max(0, baseTrustPoints + trustPointsVariation + Math.floor(now.getSeconds() * 8.7));
    
    const automationRate = 94.2 + (Math.random() * 2.6); // 94.2% - 96.8%
    
    setMetrics(prev => {
      const newMetrics = {
        activeAgents: 3 + Math.floor(Math.random() * 3), // 3-5 agents
        totalEvidence: newEvidenceCount,
        totalTrustPoints: newTrustPoints,
        automationRate: Math.round(automationRate * 10) / 10,
        collectionsToday: 47 + Math.floor(Math.random() * 10),
        avgCollectionTime: 12 + Math.random() * 8, // 12-20 minutes
        successRate: 96.5 + Math.random() * 2.5, // 96.5% - 99%
        lastUpdated: now.toISOString(),
        trendsData: {
          evidenceOverTime: [
            ...prev.trendsData.evidenceOverTime.slice(-23), // Keep last 23 points
            { time: timeStr, count: newEvidenceCount }
          ],
          trustPointsOverTime: [
            ...prev.trendsData.trustPointsOverTime.slice(-23),
            { time: timeStr, points: newTrustPoints }
          ],
          automationRateOverTime: [
            ...prev.trendsData.automationRateOverTime.slice(-23),
            { time: timeStr, rate: automationRate }
          ]
        }
      };
      return newMetrics;
    });
  }, []);

  // Generate live agent statuses
  const generateLiveAgents = useCallback(() => {
    const agentTemplates = [
      {
        id: 'aws-soc2-prod',
        name: 'AWS SOC2 Production Agent',
        platform: 'AWS',
        framework: 'SOC2',
        activities: ['Scanning IAM policies', 'Analyzing CloudTrail logs', 'Validating MFA settings', 'Checking access controls']
      },
      {
        id: 'gcp-iso27001-dev', 
        name: 'GCP ISO27001 Development Agent',
        platform: 'GCP',
        framework: 'ISO27001',
        activities: ['Reviewing security configurations', 'Analyzing audit logs', 'Scanning network policies', 'Validating encryption']
      },
      {
        id: 'azure-gdpr-staging',
        name: 'Azure GDPR Staging Agent',
        platform: 'Azure',
        framework: 'GDPR',
        activities: ['Scanning data processing', 'Reviewing privacy settings', 'Analyzing access logs', 'Validating retention policies']
      },
      {
        id: 'github-cis-main',
        name: 'GitHub CIS Controls Agent',
        platform: 'GitHub',
        framework: 'CIS',
        activities: ['Scanning repository security', 'Analyzing branch protection', 'Checking secret scanning', 'Validating workflows']
      }
    ];

    const newAgents = agentTemplates.map(template => {
      const isRunning = Math.random() > 0.2; // 80% chance of running
      const progress = isRunning ? 20 + Math.random() * 70 : 0; // 20-90% if running
      const evidenceBase = Math.floor(Math.random() * 150) + 50; // 50-200
      const trustPointsBase = evidenceBase * (2 + Math.random() * 2); // 2-4x evidence count
      
      return {
        id: template.id,
        name: template.name,
        status: isRunning ? 'running' : (Math.random() > 0.5 ? 'paused' : 'completed') as AgentStatus['status'],
        platform: template.platform,
        framework: template.framework,
        progress: Math.round(progress),
        evidenceCollected: evidenceBase,
        trustPoints: Math.floor(trustPointsBase),
        lastRun: isRunning ? 'Running now' : `${Math.floor(Math.random() * 60) + 1} minutes ago`,
        nextRun: isRunning ? 'In progress' : `In ${Math.floor(Math.random() * 180) + 60} minutes`,
        currentActivity: template.activities[Math.floor(Math.random() * template.activities.length)]
      };
    });

    setAgents(newAgents);
  }, []);

  // Generate live evidence stream
  const generateEvidenceStream = useCallback(() => {
    const evidenceTypes = ['screenshot', 'api_response', 'configuration', 'log_entry'] as const;
    const platforms = ['AWS', 'GCP', 'Azure', 'GitHub'];
    const frameworks = ['SOC2', 'ISO27001', 'GDPR', 'CIS'];
    const controls = [
      'CC6.1 - Access Controls',
      'CC7.1 - System Monitoring', 
      'A.9.1.1 - Access Control Policy',
      'Art. 32 - Security Measures',
      'CIS 1.1 - Root Access Keys'
    ];

    // Add new evidence items periodically
    if (Math.random() > 0.7) { // 30% chance each update
      const newEvidence: EvidenceStream = {
        id: `evidence-${Date.now()}`,
        agentId: agents.length > 0 ? agents[Math.floor(Math.random() * agents.length)].id : 'unknown',
        type: evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)],
        control: controls[Math.floor(Math.random() * controls.length)],
        confidence: 85 + Math.random() * 15, // 85-100%
        status: 'collecting',
        timestamp: new Date().toISOString(),
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        framework: frameworks[Math.floor(Math.random() * frameworks.length)],
        trustPoints: Math.floor(Math.random() * 30) + 10, // 10-40 points
        description: `Collecting evidence for ${controls[Math.floor(Math.random() * controls.length)]}`
      };

      setEvidenceStream(prev => [newEvidence, ...prev.slice(0, 49)]); // Keep last 50 items

      // Simulate evidence processing lifecycle
      setTimeout(() => {
        setEvidenceStream(prev => 
          prev.map(item => 
            item.id === newEvidence.id 
              ? { ...item, status: 'validating' as const, description: 'Validating evidence with AI...' }
              : item
          )
        );
      }, 2000);

      setTimeout(() => {
        setEvidenceStream(prev => 
          prev.map(item => 
            item.id === newEvidence.id 
              ? { 
                  ...item, 
                  status: 'validated' as const, 
                  confidence: Math.round(item.confidence * 10) / 10,
                  description: `Evidence validated with ${Math.round(item.confidence)}% confidence`
                }
              : item
          )
        );
      }, 5000);
    }
  }, [agents]);

  // API simulation functions
  const pauseAgent = useCallback(async (agentId: string): Promise<boolean> => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: 'paused', currentActivity: 'Paused by user' }
          : agent
      )
    );
    return true;
  }, []);

  const resumeAgent = useCallback(async (agentId: string): Promise<boolean> => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: 'running', currentActivity: 'Resuming collection...' }
          : agent
      )
    );
    return true;
  }, []);

  const triggerCollection = useCallback(async (agentId: string): Promise<boolean> => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, status: 'running', progress: 5, currentActivity: 'Starting immediate collection...' }
          : agent
      )
    );
    return true;
  }, []);

  const subscribeToAgent = useCallback((agentId: string) => {
    setSubscribedAgents(prev => new Set([...prev, agentId]));
    console.log(`📡 Subscribed to agent: ${agentId}`);
  }, []);

  const unsubscribeFromAgent = useCallback((agentId: string) => {
    setSubscribedAgents(prev => {
      const newSet = new Set(prev);
      newSet.delete(agentId);
      return newSet;
    });
    console.log(`📡 Unsubscribed from agent: ${agentId}`);
  }, []);

  const refreshData = useCallback(() => {
    generateLiveMetrics();
    generateLiveAgents();
    console.log('🔄 Data refreshed manually');
  }, [generateLiveMetrics, generateLiveAgents]);

  // Initialize connection and data
  useEffect(() => {
    connectWebSocket();
    generateLiveMetrics();
    generateLiveAgents();
  }, [connectWebSocket, generateLiveMetrics, generateLiveAgents]);

  // Set up real-time updates
  useEffect(() => {
    if (!isConnected) return;

    // Update metrics every 15 seconds
    const metricsInterval = setInterval(generateLiveMetrics, 15000);
    
    // Update agents every 10 seconds
    const agentsInterval = setInterval(generateLiveAgents, 10000);
    
    // Generate evidence stream every 5 seconds
    const evidenceInterval = setInterval(generateEvidenceStream, 5000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(agentsInterval);
      clearInterval(evidenceInterval);
    };
  }, [isConnected, generateLiveMetrics, generateLiveAgents, generateEvidenceStream]);

  // Simulate connection status changes
  useEffect(() => {
    const statusInterval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance of temporary disconnection
        setConnectionStatus('error');
        setIsConnected(false);
        
        setTimeout(() => {
          setConnectionStatus('connecting');
          setTimeout(() => {
            setConnectionStatus('connected');
            setIsConnected(true);
          }, 2000);
        }, 1000);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(statusInterval);
  }, []);

  const value: LiveDataContextType = {
    metrics,
    agents,
    evidenceStream,
    isConnected,
    connectionStatus,
    subscribeToAgent,
    unsubscribeFromAgent,
    pauseAgent,
    resumeAgent,
    triggerCollection,
    refreshData
  };

  return (
    <LiveDataContext.Provider value={value}>
      {children}
    </LiveDataContext.Provider>
  );
};