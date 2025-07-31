/**
 * Real-time Dashboard API Service
 * Provides live data feeds for executive dashboards and compliance monitoring
 */

import { EventEmitter } from 'events';
import { Observable, Subject, interval, merge } from 'rxjs';
import { map, filter, scan, startWith } from 'rxjs/operators';
import WebSocket from 'ws';

export interface DashboardMetrics {
  timestamp: Date;
  complianceScore: number;
  activeAgents: number;
  evidenceCollected: number;
  questionnairesProcessed: number;
  automationRate: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  alerts: Alert[];
  frameworks: FrameworkStatus[];
  industries: IndustryMetrics[];
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  source: string;
  acknowledged: boolean;
  category: 'compliance' | 'security' | 'performance' | 'system';
}

export interface FrameworkStatus {
  framework: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'unknown';
  score: number;
  lastAssessment: Date;
  nextReview: Date;
  controlsTotal: number;
  controlsPassed: number;
  evidenceItems: number;
  trends: TrendData[];
}

export interface IndustryMetrics {
  industry: string;
  clientCount: number;
  complianceScore: number;
  automationLevel: number;
  costSavings: number;
  implementationTime: number;
  satisfaction: number;
}

export interface TrendData {
  timestamp: Date;
  value: number;
  metric: string;
}

export interface RealtimeUpdate {
  type: 'metrics' | 'alert' | 'framework' | 'industry' | 'agent';
  timestamp: Date;
  data: any;
  source: string;
}

export interface DashboardConfig {
  refreshInterval: number; // milliseconds
  enableRealtime: boolean;
  alertThresholds: {
    complianceScore: number;
    systemHealth: number;
    responseTime: number;
  };
  frameworks: string[];
  industries: string[];
}

class DashboardAPI extends EventEmitter {
  private static instance: DashboardAPI;
  private metricsSubject: Subject<DashboardMetrics> = new Subject();
  private alertsSubject: Subject<Alert> = new Subject();
  private realtimeUpdates: Subject<RealtimeUpdate> = new Subject();
  private wsServer: WebSocket.Server | null = null;
  private connectedClients: Set<WebSocket> = new Set();
  
  // Dashboard state
  private currentMetrics: DashboardMetrics;
  private historicalData: DashboardMetrics[] = [];
  private activeAlerts: Map<string, Alert> = new Map();
  private config: DashboardConfig;

  private constructor() {
    super();
    
    this.config = {
      refreshInterval: 5000, // 5 seconds
      enableRealtime: true,
      alertThresholds: {
        complianceScore: 90,
        systemHealth: 95,
        responseTime: 2000
      },
      frameworks: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA', 'ISAE3000'],
      industries: ['Banking', 'Healthcare', 'Technology', 'Manufacturing']
    };
    
    this.currentMetrics = this.initializeMetrics();
    this.setupRealtimeFeeds();
    this.setupWebSocketServer();
  }

  public static getInstance(): DashboardAPI {
    if (!DashboardAPI.instance) {
      DashboardAPI.instance = new DashboardAPI();
    }
    return DashboardAPI.instance;
  }

  /**
   * Initialize default metrics
   */
  private initializeMetrics(): DashboardMetrics {
    return {
      timestamp: new Date(),
      complianceScore: 94.2,
      activeAgents: 12,
      evidenceCollected: 15420,
      questionnairesProcessed: 89,
      automationRate: 87.5,
      systemHealth: 'healthy',
      alerts: [],
      frameworks: [
        {
          framework: 'SOC2',
          status: 'compliant',
          score: 96.8,
          lastAssessment: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          nextReview: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000),
          controlsTotal: 64,
          controlsPassed: 62,
          evidenceItems: 342,
          trends: []
        },
        {
          framework: 'ISO27001',
          status: 'compliant',
          score: 94.5,
          lastAssessment: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          nextReview: new Date(Date.now() + 351 * 24 * 60 * 60 * 1000),
          controlsTotal: 114,
          controlsPassed: 108,
          evidenceItems: 567,
          trends: []
        },
        {
          framework: 'GDPR',
          status: 'compliant',
          score: 91.3,
          lastAssessment: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          nextReview: new Date(Date.now() + 362 * 24 * 60 * 60 * 1000),
          controlsTotal: 24,
          controlsPassed: 22,
          evidenceItems: 189,
          trends: []
        },
        {
          framework: 'ISAE3000',
          status: 'partial',
          score: 87.9,
          lastAssessment: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          nextReview: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
          controlsTotal: 42,
          controlsPassed: 37,
          evidenceItems: 298,
          trends: []
        }
      ],
      industries: [
        {
          industry: 'Banking',
          clientCount: 23,
          complianceScore: 93.7,
          automationLevel: 91.2,
          costSavings: 1850000,
          implementationTime: 6.2,
          satisfaction: 4.8
        },
        {
          industry: 'Healthcare',
          clientCount: 18,
          complianceScore: 89.4,
          automationLevel: 86.8,
          costSavings: 1240000,
          implementationTime: 8.1,
          satisfaction: 4.6
        },
        {
          industry: 'Technology',
          clientCount: 31,
          complianceScore: 95.1,
          automationLevel: 93.5,
          costSavings: 2100000,
          implementationTime: 5.4,
          satisfaction: 4.9
        }
      ]
    };
  }

  /**
   * Setup real-time data feeds
   */
  private setupRealtimeFeeds() {
    if (!this.config.enableRealtime) return;

    // Metrics update feed
    interval(this.config.refreshInterval).subscribe(() => {
      this.updateMetrics();
    });

    // Alert monitoring feed
    interval(10000).subscribe(() => {
      this.checkForAlerts();
    });

    // System health monitoring
    interval(15000).subscribe(() => {
      this.updateSystemHealth();
    });

    // Framework status updates
    interval(30000).subscribe(() => {
      this.updateFrameworkStatus();
    });
  }

  /**
   * Setup WebSocket server for real-time updates
   */
  private setupWebSocketServer() {
    try {
      this.wsServer = new WebSocket.Server({ port: 8081 });
      
      this.wsServer.on('connection', (ws: WebSocket) => {
        this.connectedClients.add(ws);
        console.log(`📊 Dashboard client connected. Total clients: ${this.connectedClients.size}`);

        // Send current metrics to new client
        ws.send(JSON.stringify({
          type: 'initial-metrics',
          data: this.currentMetrics,
          timestamp: new Date()
        }));

        ws.on('close', () => {
          this.connectedClients.delete(ws);
          console.log(`📊 Dashboard client disconnected. Total clients: ${this.connectedClients.size}`);
        });

        ws.on('message', (data: WebSocket.Data) => {
          try {
            const message = JSON.parse(data.toString());
            this.handleClientMessage(ws, message);
          } catch (error) {
            console.error('❌ Invalid WebSocket message:', error);
          }
        });
      });

      console.log('🌐 Dashboard WebSocket server listening on port 8081');
    } catch (error) {
      console.error('❌ Failed to setup WebSocket server:', error);
    }
  }

  /**
   * Handle client messages
   */
  private handleClientMessage(ws: WebSocket, message: any) {
    switch (message.type) {
      case 'subscribe':
        // Client subscribing to specific data feeds
        break;
      
      case 'acknowledge-alert':
        this.acknowledgeAlert(message.alertId);
        break;
      
      case 'get-historical':
        ws.send(JSON.stringify({
          type: 'historical-data',
          data: this.getHistoricalData(message.period),
          timestamp: new Date()
        }));
        break;
      
      case 'ping':
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: new Date()
        }));
        break;
    }
  }

  /**
   * Update metrics with simulated real-time data
   */
  private updateMetrics() {
    // Simulate realistic metric changes
    const variations = {
      complianceScore: (Math.random() - 0.5) * 0.5,
      evidenceCollected: Math.floor(Math.random() * 25) + 10,
      questionnairesProcessed: Math.floor(Math.random() * 3),
      automationRate: (Math.random() - 0.5) * 0.3
    };

    this.currentMetrics = {
      ...this.currentMetrics,
      timestamp: new Date(),
      complianceScore: Math.max(85, Math.min(100, this.currentMetrics.complianceScore + variations.complianceScore)),
      evidenceCollected: this.currentMetrics.evidenceCollected + variations.evidenceCollected,
      questionnairesProcessed: this.currentMetrics.questionnairesProcessed + variations.questionnairesProcessed,
      automationRate: Math.max(80, Math.min(100, this.currentMetrics.automationRate + variations.automationRate))
    };

    // Store historical data (keep last 1000 points)
    this.historicalData.push({ ...this.currentMetrics });
    if (this.historicalData.length > 1000) {
      this.historicalData.shift();
    }

    // Broadcast to connected clients
    this.broadcast({
      type: 'metrics',
      timestamp: new Date(),
      data: this.currentMetrics,
      source: 'dashboard-api'
    });

    // Emit to event listeners
    this.metricsSubject.next(this.currentMetrics);
    this.emit('metrics-updated', this.currentMetrics);
  }

  /**
   * Check for alerts based on thresholds
   */
  private checkForAlerts() {
    const alerts: Alert[] = [];

    // Compliance score alert
    if (this.currentMetrics.complianceScore < this.config.alertThresholds.complianceScore) {
      alerts.push({
        id: `compliance-${Date.now()}`,
        severity: 'warning',
        title: 'Compliance Score Below Threshold',
        message: `Overall compliance score (${this.currentMetrics.complianceScore.toFixed(1)}%) is below threshold (${this.config.alertThresholds.complianceScore}%)`,
        timestamp: new Date(),
        source: 'compliance-monitor',
        acknowledged: false,
        category: 'compliance'
      });
    }

    // Framework-specific alerts
    this.currentMetrics.frameworks.forEach(framework => {
      if (framework.status === 'non-compliant') {
        alerts.push({
          id: `framework-${framework.framework}-${Date.now()}`,
          severity: 'error',
          title: `${framework.framework} Non-Compliant`,
          message: `${framework.framework} framework is not compliant (${framework.score.toFixed(1)}%)`,
          timestamp: new Date(),
          source: `${framework.framework}-monitor`,
          acknowledged: false,
          category: 'compliance'
        });
      }
    });

    // Process new alerts
    alerts.forEach(alert => {
      if (!this.activeAlerts.has(alert.id)) {
        this.activeAlerts.set(alert.id, alert);
        this.alertsSubject.next(alert);
        this.broadcast({
          type: 'alert',
          timestamp: new Date(),
          data: alert,
          source: 'alert-system'
        });
      }
    });

    // Clean up old alerts (older than 24 hours)
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    for (const [alertId, alert] of this.activeAlerts) {
      if (alert.timestamp < cutoff) {
        this.activeAlerts.delete(alertId);
      }
    }

    // Update current metrics with active alerts
    this.currentMetrics.alerts = Array.from(this.activeAlerts.values());
  }

  /**
   * Update system health status
   */
  private updateSystemHealth() {
    // Simulate system health based on various factors
    const factors = {
      agentHealth: this.currentMetrics.activeAgents >= 10,
      complianceHealth: this.currentMetrics.complianceScore >= 90,
      performanceHealth: Math.random() > 0.1, // 90% chance of good performance
      alertHealth: this.currentMetrics.alerts.filter(a => a.severity === 'critical').length === 0
    };

    const healthyFactors = Object.values(factors).filter(Boolean).length;
    const totalFactors = Object.values(factors).length;
    const healthPercentage = (healthyFactors / totalFactors) * 100;

    let systemHealth: 'healthy' | 'warning' | 'critical';
    if (healthPercentage >= 95) {
      systemHealth = 'healthy';
    } else if (healthPercentage >= 70) {
      systemHealth = 'warning';
    } else {
      systemHealth = 'critical';
    }

    if (this.currentMetrics.systemHealth !== systemHealth) {
      this.currentMetrics.systemHealth = systemHealth;
      
      this.broadcast({
        type: 'system_health',
        timestamp: new Date(),
        data: { systemHealth, healthPercentage },
        source: 'health-monitor'
      });
    }
  }

  /**
   * Update framework status with trends
   */
  private updateFrameworkStatus() {
    this.currentMetrics.frameworks.forEach(framework => {
      // Add trend data point
      framework.trends.push({
        timestamp: new Date(),
        value: framework.score,
        metric: 'compliance_score'
      });

      // Keep only last 100 trend points
      if (framework.trends.length > 100) {
        framework.trends.shift();
      }

      // Simulate slight variations in scores
      const variation = (Math.random() - 0.5) * 0.8;
      framework.score = Math.max(70, Math.min(100, framework.score + variation));
      
      // Update status based on score
      if (framework.score >= 95) {
        framework.status = 'compliant';
      } else if (framework.score >= 85) {
        framework.status = 'partial';
      } else {
        framework.status = 'non-compliant';
      }
    });

    this.broadcast({
      type: 'framework',
      timestamp: new Date(),
      data: this.currentMetrics.frameworks,
      source: 'framework-monitor'
    });
  }

  /**
   * Broadcast update to all connected clients
   */
  private broadcast(update: RealtimeUpdate) {
    const message = JSON.stringify(update);
    
    this.connectedClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    this.realtimeUpdates.next(update);
  }

  /**
   * Acknowledge an alert
   */
  public acknowledgeAlert(alertId: string): boolean {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      this.activeAlerts.set(alertId, alert);
      
      this.broadcast({
        type: 'alert',
        timestamp: new Date(),
        data: { ...alert, acknowledged: true },
        source: 'alert-system'
      });
      
      return true;
    }
    return false;
  }

  /**
   * Get current dashboard metrics
   */
  public getCurrentMetrics(): DashboardMetrics {
    return { ...this.currentMetrics };
  }

  /**
   * Get historical data for specified period
   */
  public getHistoricalData(period: 'hour' | 'day' | 'week' | 'month' = 'day'): DashboardMetrics[] {
    const now = new Date();
    let cutoff: Date;

    switch (period) {
      case 'hour':
        cutoff = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'day':
        cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    return this.historicalData.filter(metric => metric.timestamp >= cutoff);
  }

  /**
   * Get active alerts
   */
  public getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values()).filter(alert => !alert.acknowledged);
  }

  /**
   * Get metrics observable for reactive components
   */  
  public getMetricsObservable(): Observable<DashboardMetrics> {
    return this.metricsSubject.asObservable().pipe(
      startWith(this.currentMetrics)
    );
  }

  /**
   * Get alerts observable
   */
  public getAlertsObservable(): Observable<Alert> {
    return this.alertsSubject.asObservable();
  }

  /**
   * Get real-time updates observable
   */
  public getRealtimeUpdatesObservable(): Observable<RealtimeUpdate> {
    return this.realtimeUpdates.asObservable();
  }

  /**
   * Create custom alert
   */
  public createAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>): Alert {
    const newAlert: Alert = {
      ...alert,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      acknowledged: false
    };

    this.activeAlerts.set(newAlert.id, newAlert);
    this.alertsSubject.next(newAlert);
    
    this.broadcast({
      type: 'alert',
      timestamp: new Date(),
      data: newAlert,
      source: 'custom-alert'
    });

    return newAlert;
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<DashboardConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.emit('config-updated', this.config);
  }

  /**
   * Get current configuration
   */
  public getConfig(): DashboardConfig {
    return { ...this.config };
  }

  /**
   * Get dashboard statistics
   */
  public getStatistics(): {
    connectedClients: number;
    totalMetricsPoints: number;
    activeAlerts: number;
    uptime: number;
    updateFrequency: number;
  } {
    return {
      connectedClients: this.connectedClients.size,
      totalMetricsPoints: this.historicalData.length,
      activeAlerts: this.activeAlerts.size,
      uptime: Date.now(), // Simplified
      updateFrequency: this.config.refreshInterval
    };
  }

  /**
   * Generate dashboard URL for embedding
   */
  public generateEmbedUrl(config?: { 
    theme?: 'light' | 'dark';
    modules?: string[];
    autoRefresh?: boolean;
  }): string {
    const baseUrl = 'https://dashboard.velocity.ai/embed';
    const params = new URLSearchParams();
    
    if (config?.theme) params.set('theme', config.theme);
    if (config?.modules) params.set('modules', config.modules.join(','));
    if (config?.autoRefresh !== undefined) params.set('autoRefresh', config.autoRefresh.toString());
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Shutdown dashboard service
   */
  public shutdown() {
    if (this.wsServer) {
      this.wsServer.close();
    }
    
    this.connectedClients.clear();
    this.metricsSubject.complete();
    this.alertsSubject.complete();
    this.realtimeUpdates.complete();
  }
}

export default DashboardAPI;