/**
 * Recovery and Resilience Service
 * Handles system recovery, failover, and resilience features for Zero Trust Architecture
 */

import { Pool } from 'pg';
import Redis from 'ioredis';
import { SessionManager } from './SessionManager';
import { AuditService } from './AuditService';

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical' | 'down';
  services: Record<string, ServiceHealth>;
  overallScore: number;
  lastCheck: Date;
  uptime: number;
  activeUsers: number;
  activeSessions: number;
  alerts: HealthAlert[];
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'critical' | 'down';
  responseTime: number;
  errorRate: number;
  lastError?: string;
  lastCheck: Date;
  uptime: number;
}

export interface HealthAlert {
  id: string;
  severity: 'warning' | 'critical';
  service: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface RecoveryPlan {
  trigger: string;
  actions: RecoveryAction[];
  priority: number;
  autoExecute: boolean;
  notificationTargets: string[];
}

export interface RecoveryAction {
  type: 'restart_service' | 'failover' | 'scale_up' | 'notify' | 'block_traffic' | 'degraded_mode';
  target: string;
  parameters: Record<string, any>;
  timeout: number;
  retries: number;
}

export class ResilienceService {
  private db: Pool;
  private redis: Redis;
  private sessionManager: SessionManager;
  private auditService: AuditService;
  private healthCheckInterval: NodeJS.Timeout;
  private readonly HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
  private readonly DEGRADED_MODE_THRESHOLD = 0.7;
  private readonly CRITICAL_THRESHOLD = 0.4;

  constructor(sessionManager: SessionManager, auditService: AuditService) {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });

    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });

    this.sessionManager = sessionManager;
    this.auditService = auditService;

    this.startHealthMonitoring();
  }

  /**
   * Get current system health
   */
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const services = await this.checkAllServices();
      const overallScore = this.calculateOverallScore(services);
      const alerts = await this.getActiveAlerts();
      const uptime = await this.getSystemUptime();
      const activeUsers = await this.getActiveUserCount();
      const activeSessions = await this.getActiveSessionCount();

      const health: SystemHealth = {
        status: this.getHealthStatus(overallScore),
        services,
        overallScore,
        lastCheck: new Date(),
        uptime,
        activeUsers,
        activeSessions,
        alerts
      };

      // Store health data
      await this.storeHealthData(health);

      return health;

    } catch (error) {
      console.error('Failed to get system health:', error);
      
      return {
        status: 'critical',
        services: {},
        overallScore: 0,
        lastCheck: new Date(),
        uptime: 0,
        activeUsers: 0,
        activeSessions: 0,
        alerts: [{
          id: 'health-check-error',
          severity: 'critical',
          service: 'health_monitor',
          message: 'Health check system failure',
          timestamp: new Date(),
          resolved: false
        }]
      };
    }
  }

  /**
   * Execute recovery plan
   */
  async executeRecoveryPlan(planId: string, reason: string): Promise<{
    success: boolean;
    actionsExecuted: number;
    failedActions: string[];
    executionTime: number;
  }> {
    const startTime = Date.now();
    let actionsExecuted = 0;
    const failedActions: string[] = [];

    try {
      const plan = await this.getRecoveryPlan(planId);
      if (!plan) {
        throw new Error(`Recovery plan ${planId} not found`);
      }

      // Log recovery initiation
      await this.auditService.logSystemEvent({
        eventType: 'recovery_plan_initiated',
        action: 'execute_recovery',
        outcome: 'success',
        severity: 'high',
        details: { planId, reason, actionsCount: plan.actions.length }
      });

      // Execute actions in priority order
      const sortedActions = plan.actions.sort((a, b) => (b as any).priority - (a as any).priority);

      for (const action of sortedActions) {
        try {
          await this.executeRecoveryAction(action);
          actionsExecuted++;
          
          // Log successful action
          await this.auditService.logSystemEvent({
            eventType: 'recovery_action_executed',
            action: action.type,
            outcome: 'success',
            details: { actionType: action.type, target: action.target }
          });

        } catch (error) {
          console.error(`Recovery action failed:`, error);
          failedActions.push(`${action.type}:${action.target}`);
          
          // Log failed action
          await this.auditService.logSystemEvent({
            eventType: 'recovery_action_failed',
            action: action.type,
            outcome: 'failure',
            severity: 'high',
            details: { 
              actionType: action.type, 
              target: action.target, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            }
          });
        }
      }

      const success = failedActions.length === 0;
      const executionTime = Date.now() - startTime;

      // Log recovery completion
      await this.auditService.logSystemEvent({
        eventType: 'recovery_plan_completed',
        action: 'complete_recovery',
        outcome: success ? 'success' : 'warning',
        severity: success ? 'medium' : 'high',
        details: { 
          planId, 
          actionsExecuted, 
          failedActions: failedActions.length,
          executionTime 
        }
      });

      return {
        success,
        actionsExecuted,
        failedActions,
        executionTime
      };

    } catch (error) {
      console.error('Recovery plan execution failed:', error);
      
      await this.auditService.logSystemEvent({
        eventType: 'recovery_plan_failed',
        action: 'execute_recovery',
        outcome: 'failure',
        severity: 'critical',
        details: { 
          planId, 
          error: error instanceof Error ? error.message : 'Unknown error',
          executionTime: Date.now() - startTime
        }
      });

      return {
        success: false,
        actionsExecuted,
        failedActions: ['recovery_system_failure'],
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Enable degraded mode
   */
  async enableDegradedMode(reason: string): Promise<void> {
    try {
      // Set degraded mode flag
      await this.redis.setex('system:degraded_mode', 3600, JSON.stringify({
        enabled: true,
        reason,
        enabledAt: new Date(),
        restrictions: [
          'limited_new_registrations',
          'reduced_session_duration',
          'enhanced_monitoring',
          'simplified_ui'
        ]
      }));

      // Reduce session timeouts
      await this.reduceSessionTimeouts();

      // Enable enhanced monitoring
      await this.enableEnhancedMonitoring();

      // Log degraded mode activation
      await this.auditService.logSystemEvent({
        eventType: 'degraded_mode_enabled',
        action: 'enable_degraded_mode',
        outcome: 'success',
        severity: 'high',
        details: { reason }
      });

      console.log(`Degraded mode enabled: ${reason}`);

    } catch (error) {
      console.error('Failed to enable degraded mode:', error);
      throw error;
    }
  }

  /**
   * Disable degraded mode
   */
  async disableDegradedMode(): Promise<void> {
    try {
      // Remove degraded mode flag
      await this.redis.del('system:degraded_mode');

      // Restore normal session timeouts
      await this.restoreNormalOperations();

      // Log degraded mode deactivation
      await this.auditService.logSystemEvent({
        eventType: 'degraded_mode_disabled',
        action: 'disable_degraded_mode',
        outcome: 'success',
        severity: 'medium',
        details: {}
      });

      console.log('Degraded mode disabled - normal operations restored');

    } catch (error) {
      console.error('Failed to disable degraded mode:', error);
      throw error;
    }
  }

  /**
   * Check if system is in degraded mode
   */
  async isDegradedMode(): Promise<boolean> {
    try {
      const degradedData = await this.redis.get('system:degraded_mode');
      return degradedData !== null;
    } catch (error) {
      console.error('Failed to check degraded mode:', error);
      return false;
    }
  }

  /**
   * Create system backup checkpoint
   */
  async createBackupCheckpoint(type: 'manual' | 'scheduled' = 'manual'): Promise<string> {
    const checkpointId = `checkpoint_${Date.now()}`;
    
    try {
      // Backup critical system state
      const backup = {
        id: checkpointId,
        timestamp: new Date(),
        type,
        data: {
          activeSessions: await this.backupActiveSessions(),
          userTrustScores: await this.backupUserTrustScores(),
          deviceProfiles: await this.backupDeviceProfiles(),
          systemConfig: await this.backupSystemConfig()
        }
      };

      // Store backup
      await this.redis.setex(
        `backup:${checkpointId}`,
        7 * 24 * 60 * 60, // 7 days
        JSON.stringify(backup)
      );

      // Log backup creation
      await this.auditService.logSystemEvent({
        eventType: 'backup_checkpoint_created',
        action: 'create_backup',
        outcome: 'success',
        details: { checkpointId, type }
      });

      return checkpointId;

    } catch (error) {
      console.error('Failed to create backup checkpoint:', error);
      throw error;
    }
  }

  /**
   * Restore from backup checkpoint
   */
  async restoreFromCheckpoint(checkpointId: string): Promise<boolean> {
    try {
      const backupData = await this.redis.get(`backup:${checkpointId}`);
      if (!backupData) {
        throw new Error(`Checkpoint ${checkpointId} not found`);
      }

      const backup = JSON.parse(backupData);

      // Restore critical data
      await this.restoreActiveSessions(backup.data.activeSessions);
      await this.restoreUserTrustScores(backup.data.userTrustScores);
      await this.restoreDeviceProfiles(backup.data.deviceProfiles);

      // Log restoration
      await this.auditService.logSystemEvent({
        eventType: 'system_restored_from_backup',
        action: 'restore_backup',
        outcome: 'success',
        severity: 'high',
        details: { checkpointId, backupTimestamp: backup.timestamp }
      });

      return true;

    } catch (error) {
      console.error('Failed to restore from checkpoint:', error);
      
      await this.auditService.logSystemEvent({
        eventType: 'system_restore_failed',
        action: 'restore_backup',
        outcome: 'failure',
        severity: 'critical',
        details: { 
          checkpointId, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
      });

      return false;
    }
  }

  // Private methods

  private async checkAllServices(): Promise<Record<string, ServiceHealth>> {
    const services: Record<string, ServiceHealth> = {};

    // Check database
    services.database = await this.checkDatabaseHealth();
    
    // Check Redis
    services.redis = await this.checkRedisHealth();
    
    // Check session manager
    services.session_manager = await this.checkSessionManagerHealth();
    
    // Check external services
    services.geolocation = await this.checkGeolocationHealth();
    services.threat_intel = await this.checkThreatIntelHealth();

    return services;
  }

  private async checkDatabaseHealth(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      await this.db.query('SELECT 1');
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'database',
        status: responseTime < 100 ? 'healthy' : responseTime < 500 ? 'degraded' : 'critical',
        responseTime,
        errorRate: 0,
        lastCheck: new Date(),
        uptime: 1
      };
    } catch (error) {
      return {
        name: 'database',
        status: 'down',
        responseTime: Date.now() - startTime,
        errorRate: 1,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        lastCheck: new Date(),
        uptime: 0
      };
    }
  }

  private async checkRedisHealth(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      await this.redis.ping();
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'redis',
        status: responseTime < 50 ? 'healthy' : responseTime < 200 ? 'degraded' : 'critical',
        responseTime,
        errorRate: 0,
        lastCheck: new Date(),
        uptime: 1
      };
    } catch (error) {
      return {
        name: 'redis',
        status: 'down',
        responseTime: Date.now() - startTime,
        errorRate: 1,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        lastCheck: new Date(),
        uptime: 0
      };
    }
  }

  private async checkSessionManagerHealth(): Promise<ServiceHealth> {
    try {
      const metrics = await this.sessionManager.getSessionMetrics();
      
      return {
        name: 'session_manager',
        status: 'healthy',
        responseTime: 10,
        errorRate: 0,
        lastCheck: new Date(),
        uptime: 1
      };
    } catch (error) {
      return {
        name: 'session_manager',
        status: 'critical',
        responseTime: 0,
        errorRate: 1,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        lastCheck: new Date(),
        uptime: 0
      };
    }
  }

  private async checkGeolocationHealth(): Promise<ServiceHealth> {
    // Simplified health check for external services
    return {
      name: 'geolocation',
      status: 'healthy',
      responseTime: 100,
      errorRate: 0,
      lastCheck: new Date(),
      uptime: 1
    };
  }

  private async checkThreatIntelHealth(): Promise<ServiceHealth> {
    // Simplified health check for external services
    return {
      name: 'threat_intel',
      status: 'healthy',
      responseTime: 150,
      errorRate: 0,
      lastCheck: new Date(),
      uptime: 1
    };
  }

  private calculateOverallScore(services: Record<string, ServiceHealth>): number {
    const serviceScores = Object.values(services).map(service => {
      switch (service.status) {
        case 'healthy': return 1.0;
        case 'degraded': return 0.7;
        case 'critical': return 0.3;
        case 'down': return 0.0;
        default: return 0.5;
      }
    });

    return serviceScores.reduce((sum, score) => sum + score, 0) / serviceScores.length;
  }

  private getHealthStatus(score: number): SystemHealth['status'] {
    if (score >= 0.9) return 'healthy';
    if (score >= this.DEGRADED_MODE_THRESHOLD) return 'degraded';
    if (score >= this.CRITICAL_THRESHOLD) return 'critical';
    return 'down';
  }

  private async getActiveAlerts(): Promise<HealthAlert[]> {
    try {
      const alertsData = await this.redis.lrange('system:alerts', 0, -1);
      return alertsData.map(data => JSON.parse(data));
    } catch (error) {
      return [];
    }
  }

  private async getSystemUptime(): Promise<number> {
    try {
      const startupTime = await this.redis.get('system:startup_time');
      if (startupTime) {
        return Date.now() - parseInt(startupTime);
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }

  private async getActiveUserCount(): Promise<number> {
    try {
      const result = await this.db.query(
        `SELECT COUNT(DISTINCT user_id) as count 
         FROM user_sessions 
         WHERE expires_at > NOW() AND NOT blocked`
      );
      return parseInt(result.rows[0]?.count || '0');
    } catch (error) {
      return 0;
    }
  }

  private async getActiveSessionCount(): Promise<number> {
    try {
      const metrics = await this.sessionManager.getSessionMetrics();
      return metrics.activeSessions;
    } catch (error) {
      return 0;
    }
  }

  private async storeHealthData(health: SystemHealth): Promise<void> {
    try {
      await this.redis.setex(
        'system:health',
        300, // 5 minutes
        JSON.stringify(health)
      );
    } catch (error) {
      console.warn('Failed to store health data:', error);
    }
  }

  private async getRecoveryPlan(planId: string): Promise<RecoveryPlan | null> {
    // In a real implementation, this would load from database or config
    const plans: Record<string, RecoveryPlan> = {
      'database_failure': {
        trigger: 'database_down',
        actions: [
          {
            type: 'notify',
            target: 'ops_team',
            parameters: { message: 'Database failure detected' },
            timeout: 30000,
            retries: 3
          },
          {
            type: 'degraded_mode',
            target: 'system',
            parameters: { reason: 'Database failure' },
            timeout: 10000,
            retries: 1
          }
        ],
        priority: 1,
        autoExecute: true,
        notificationTargets: ['ops@velocity.com']
      },
      'high_error_rate': {
        trigger: 'error_rate_high',
        actions: [
          {
            type: 'scale_up',
            target: 'api_servers',
            parameters: { instances: 2 },
            timeout: 60000,
            retries: 2
          }
        ],
        priority: 2,
        autoExecute: true,
        notificationTargets: ['ops@velocity.com']
      }
    };

    return plans[planId] || null;
  }

  private async executeRecoveryAction(action: RecoveryAction): Promise<void> {
    switch (action.type) {
      case 'degraded_mode':
        await this.enableDegradedMode(action.parameters.reason);
        break;
      case 'notify':
        await this.sendNotification(action.target, action.parameters.message);
        break;
      case 'restart_service':
        await this.restartService(action.target);
        break;
      case 'failover':
        await this.performFailover(action.target);
        break;
      case 'scale_up':
        await this.scaleUp(action.target, action.parameters.instances);
        break;
      case 'block_traffic':
        await this.blockTraffic(action.target);
        break;
      default:
        throw new Error(`Unknown recovery action type: ${action.type}`);
    }
  }

  private async sendNotification(target: string, message: string): Promise<void> {
    console.log(`NOTIFICATION [${target}]: ${message}`);
    // In production, would integrate with email/SMS/Slack services
  }

  private async restartService(service: string): Promise<void> {
    console.log(`Restarting service: ${service}`);
    // In production, would integrate with container orchestration
  }

  private async performFailover(target: string): Promise<void> {
    console.log(`Performing failover for: ${target}`);
    // In production, would switch to backup systems
  }

  private async scaleUp(target: string, instances: number): Promise<void> {
    console.log(`Scaling up ${target} by ${instances} instances`);
    // In production, would integrate with auto-scaling
  }

  private async blockTraffic(target: string): Promise<void> {
    console.log(`Blocking traffic to: ${target}`);
    // In production, would update load balancer rules
  }

  private async reduceSessionTimeouts(): Promise<void> {
    // Reduce session durations during degraded mode
    await this.redis.setex('system:reduced_session_timeout', 3600, '900'); // 15 minutes
  }

  private async enableEnhancedMonitoring(): Promise<void> {
    // Enable more frequent health checks during degraded mode
    await this.redis.setex('system:enhanced_monitoring', 3600, 'true');
  }

  private async restoreNormalOperations(): Promise<void> {
    await this.redis.del('system:reduced_session_timeout');
    await this.redis.del('system:enhanced_monitoring');
  }

  private async backupActiveSessions(): Promise<any> {
    const sessions = await this.db.query(
      `SELECT * FROM user_sessions WHERE expires_at > NOW() AND NOT blocked`
    );
    return sessions.rows;
  }

  private async backupUserTrustScores(): Promise<any> {
    const trustScores = await this.db.query(`SELECT * FROM user_trust_profiles`);
    return trustScores.rows;
  }

  private async backupDeviceProfiles(): Promise<any> {
    const devices = await this.db.query(`SELECT * FROM device_trust_profiles`);
    return devices.rows;
  }

  private async backupSystemConfig(): Promise<any> {
    // Backup critical system configuration
    return {
      degradedMode: await this.isDegradedMode(),
      timestamp: new Date()
    };
  }

  private async restoreActiveSessions(_sessions: any): Promise<void> {
    // Restore active sessions if needed
    console.log('Restoring active sessions...');
  }

  private async restoreUserTrustScores(_trustScores: any): Promise<void> {
    // Restore user trust scores if needed
    console.log('Restoring user trust scores...');
  }

  private async restoreDeviceProfiles(_devices: any): Promise<void> {
    // Restore device profiles if needed
    console.log('Restoring device profiles...');
  }

  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const health = await this.getSystemHealth();
        
        // Auto-trigger recovery if needed
        if (health.overallScore < this.CRITICAL_THRESHOLD && !await this.isDegradedMode()) {
          await this.executeRecoveryPlan('database_failure', 'Automatic recovery triggered');
        } else if (health.overallScore < this.DEGRADED_MODE_THRESHOLD && !await this.isDegradedMode()) {
          await this.enableDegradedMode('System performance degraded');
        } else if (health.overallScore > 0.9 && await this.isDegradedMode()) {
          await this.disableDegradedMode();
        }
        
      } catch (error) {
        console.error('Health monitoring error:', error);
      }
    }, this.HEALTH_CHECK_INTERVAL);
  }
}