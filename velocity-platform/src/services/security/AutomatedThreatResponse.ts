/**
 * Automated Threat Response System
 * Automatically responds to security threats based on severity and context
 */

import { SessionRiskAssessment } from './SessionRiskScoring';
import { useSecurityNotifications } from '../../components/security/SecurityNotifications';

export interface ThreatEvent {
  id: string;
  timestamp: Date;
  type: 'behavior_anomaly' | 'location_threat' | 'device_mismatch' | 'brute_force' | 'privilege_escalation' | 'data_exfiltration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  sessionId: string;
  deviceId?: string;
  ipAddress: string;
  details: any;
  riskAssessment: SessionRiskAssessment;
  autoResponseEnabled: boolean;
}

export interface ResponseAction {
  id: string;
  type: 'notify' | 'challenge' | 'restrict' | 'block' | 'alert_admin' | 'log_security';
  description: string;
  parameters: any;
  executedAt?: Date;
  success?: boolean;
  error?: string;
}

export interface ThreatResponse {
  eventId: string;
  responseStrategy: 'passive' | 'active' | 'aggressive';
  actions: ResponseAction[];
  escalationLevel: number; // 0-3
  requiresHumanReview: boolean;
  executionResults: any[];
  notificationsSent: string[];
  timestamp: Date;
}

export interface ResponsePolicy {
  id: string;
  name: string;
  threatTypes: string[];
  severityThreshold: 'low' | 'medium' | 'high' | 'critical';
  conditions: any[];
  actions: ResponseAction[];
  enabled: boolean;
  autoExecute: boolean;
  escalationRules: any[];
}

export class AutomatedThreatResponse {
  private readonly responsePolicies: Map<string, ResponsePolicy> = new Map();
  private readonly executionQueue: ThreatEvent[] = [];
  private readonly responseHistory: Map<string, ThreatResponse[]> = new Map();
  private isProcessing = false;

  constructor() {
    this.initializeDefaultPolicies();
    this.startResponseProcessor();
  }

  /**
   * Process a threat event and execute appropriate response
   */
  async processThreatEvent(event: ThreatEvent): Promise<ThreatResponse> {
    try {
      console.log(`Processing threat event: ${event.type} (${event.severity})`);

      // Find applicable policies
      const applicablePolicies = this.findApplicablePolicies(event);
      
      if (applicablePolicies.length === 0) {
        return this.createMinimalResponse(event);
      }

      // Select best policy based on severity and context
      const selectedPolicy = this.selectOptimalPolicy(applicablePolicies, event);
      
      // Determine response strategy
      const responseStrategy = this.determineResponseStrategy(event, selectedPolicy);
      
      // Generate response actions
      const actions = this.generateResponseActions(event, selectedPolicy, responseStrategy);
      
      // Execute response if auto-execution is enabled
      const executionResults = selectedPolicy.autoExecute 
        ? await this.executeResponseActions(actions, event)
        : [];

      // Create response record
      const response: ThreatResponse = {
        eventId: event.id,
        responseStrategy,
        actions,
        escalationLevel: this.calculateEscalationLevel(event),
        requiresHumanReview: this.shouldRequireHumanReview(event, selectedPolicy),
        executionResults,
        notificationsSent: [],
        timestamp: new Date()
      };

      // Send notifications
      await this.sendThreatNotifications(event, response);

      // Store response history
      this.recordResponse(event.userId, response);

      // Log security event
      await this.logSecurityEvent(event, response);

      return response;

    } catch (error) {
      console.error('Threat response processing failed:', error);
      
      // Fallback response
      return {
        eventId: event.id,
        responseStrategy: 'passive',
        actions: [this.createLogAction(event, 'Error in threat response processing')],
        escalationLevel: 2,
        requiresHumanReview: true,
        executionResults: [],
        notificationsSent: [],
        timestamp: new Date()
      };
    }
  }

  /**
   * Execute automated response actions
   */
  private async executeResponseActions(
    actions: ResponseAction[], 
    event: ThreatEvent
  ): Promise<any[]> {
    const results = [];

    for (const action of actions) {
      try {
        const result = await this.executeAction(action, event);
        results.push({ actionId: action.id, success: true, result });
        
        action.executedAt = new Date();
        action.success = true;
        
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error);
        results.push({ actionId: action.id, success: false, error: error.message });
        
        action.executedAt = new Date();
        action.success = false;
        action.error = error.message;
      }
    }

    return results;
  }

  /**
   * Execute individual response action
   */
  private async executeAction(action: ResponseAction, event: ThreatEvent): Promise<any> {
    switch (action.type) {
      case 'notify':
        return this.executeNotificationAction(action, event);
        
      case 'challenge':
        return this.executeChallengeAction(action, event);
        
      case 'restrict':
        return this.executeRestrictionAction(action, event);
        
      case 'block':
        return this.executeBlockAction(action, event);
        
      case 'alert_admin':
        return this.executeAdminAlertAction(action, event);
        
      case 'log_security':
        return this.executeLogAction(action, event);
        
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Send security notification to user
   */
  private async executeNotificationAction(action: ResponseAction, event: ThreatEvent): Promise<any> {
    const notification = {
      type: 'warning' as const,
      title: action.parameters.title || 'Security Alert',
      message: action.parameters.message || `Unusual activity detected from ${event.ipAddress}`,
      userId: event.userId,
      timestamp: new Date(),
      metadata: {
        eventId: event.id,
        severity: event.severity,
        type: 'security_alert'
      }
    };

    // Send notification through the security notification system
    window.dispatchEvent(new CustomEvent('securityNotification', {
      detail: notification
    }));

    return { notificationSent: true, notificationId: `notif_${Date.now()}` };
  }

  /**
   * Execute authentication challenge
   */
  private async executeChallengeAction(action: ResponseAction, event: ThreatEvent): Promise<any> {
    const challengeType = action.parameters.challengeType || 'push_notification';
    
    // Dispatch challenge request
    window.dispatchEvent(new CustomEvent('authChallengeRequired', {
      detail: {
        userId: event.userId,
        sessionId: event.sessionId,
        challengeType,
        reason: `Security verification required due to ${event.type}`,
        severity: event.severity
      }
    }));

    return { challengeRequested: true, challengeType };
  }

  /**
   * Execute access restriction
   */
  private async executeRestrictionAction(action: ResponseAction, event: ThreatEvent): Promise<any> {
    const restrictions = action.parameters.restrictions || ['admin_access', 'sensitive_data'];
    
    // Apply session restrictions
    window.dispatchEvent(new CustomEvent('sessionRestricted', {
      detail: {
        userId: event.userId,
        sessionId: event.sessionId,
        restrictions,
        reason: `Access restricted due to ${event.type}`,
        duration: action.parameters.duration || 3600000 // 1 hour default
      }
    }));

    return { restrictionsApplied: restrictions };
  }

  /**
   * Execute session/IP block
   */
  private async executeBlockAction(action: ResponseAction, event: ThreatEvent): Promise<any> {
    const blockType = action.parameters.blockType || 'session';
    
    if (blockType === 'session') {
      // Terminate session
      window.dispatchEvent(new CustomEvent('sessionTerminated', {
        detail: {
          userId: event.userId,
          sessionId: event.sessionId,
          reason: `Session terminated due to ${event.type}`,
          severity: event.severity
        }
      }));
    } else if (blockType === 'ip') {
      // Block IP address
      window.dispatchEvent(new CustomEvent('ipBlocked', {
        detail: {
          ipAddress: event.ipAddress,
          reason: `IP blocked due to ${event.type}`,
          duration: action.parameters.duration || 86400000 // 24 hours default
        }
      }));
    }

    return { blocked: true, blockType };
  }

  /**
   * Execute admin alert
   */
  private async executeAdminAlertAction(action: ResponseAction, event: ThreatEvent): Promise<any> {
    const alert = {
      id: `alert_${Date.now()}`,
      timestamp: new Date(),
      priority: event.severity === 'critical' ? 'urgent' : 'high',
      title: `Security Threat: ${event.type}`,
      message: action.parameters.message || `Critical security event requires immediate attention`,
      eventDetails: event,
      userId: event.userId,
      ipAddress: event.ipAddress
    };

    // Send to admin notification system
    window.dispatchEvent(new CustomEvent('adminSecurityAlert', {
      detail: alert
    }));

    return { alertSent: true, alertId: alert.id };
  }

  /**
   * Execute security logging
   */
  private async executeLogAction(action: ResponseAction, event: ThreatEvent): Promise<any> {
    const logEntry = {
      timestamp: new Date(),
      eventId: event.id,
      eventType: event.type,
      severity: event.severity,
      userId: event.userId,
      sessionId: event.sessionId,
      ipAddress: event.ipAddress,
      action: action.description,
      details: event.details,
      riskScore: event.riskAssessment.overallRiskScore
    };

    // Log to security system
    console.log('Security Event:', logEntry);
    
    // In real implementation, would send to SIEM or security logging service
    try {
      await fetch('/api/security/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      console.warn('Failed to send security log:', error);
    }

    return { logged: true, logId: `log_${Date.now()}` };
  }

  /**
   * Find policies that apply to the threat event
   */
  private findApplicablePolicies(event: ThreatEvent): ResponsePolicy[] {
    const policies = Array.from(this.responsePolicies.values());
    
    return policies.filter(policy => {
      if (!policy.enabled) return false;
      if (!policy.threatTypes.includes(event.type)) return false;
      if (!this.meetsSeverityThreshold(event.severity, policy.severityThreshold)) return false;
      if (!policy.autoExecute && !event.autoResponseEnabled) return false;
      
      return this.evaluatePolicyConditions(policy, event);
    });
  }

  /**
   * Select the most appropriate policy for the event
   */
  private selectOptimalPolicy(policies: ResponsePolicy[], event: ThreatEvent): ResponsePolicy {
    // Sort by severity threshold and specificity
    policies.sort((a, b) => {
      const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
      const aSeverity = severityOrder[a.severityThreshold];
      const bSeverity = severityOrder[b.severityThreshold];
      
      if (aSeverity !== bSeverity) return bSeverity - aSeverity;
      
      // Prefer more specific policies
      return b.conditions.length - a.conditions.length;
    });

    return policies[0];
  }

  /**
   * Determine response strategy based on event and policy
   */
  private determineResponseStrategy(
    event: ThreatEvent, 
    policy: ResponsePolicy
  ): 'passive' | 'active' | 'aggressive' {
    if (event.severity === 'critical') return 'aggressive';
    if (event.severity === 'high') return 'active';
    if (event.riskAssessment.overallRiskScore > 0.8) return 'aggressive';
    if (event.riskAssessment.overallRiskScore > 0.6) return 'active';
    return 'passive';
  }

  /**
   * Generate response actions based on policy and strategy
   */
  private generateResponseActions(
    event: ThreatEvent,
    policy: ResponsePolicy,
    strategy: string
  ): ResponseAction[] {
    const actions: ResponseAction[] = [];

    // Base actions from policy
    actions.push(...policy.actions.map(action => ({
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })));

    // Strategy-specific additional actions
    if (strategy === 'aggressive') {
      if (event.severity === 'critical') {
        actions.push(this.createBlockAction(event, 'session'));
        actions.push(this.createAdminAlertAction(event));
      }
    } else if (strategy === 'active') {
      if (event.type === 'brute_force' || event.type === 'privilege_escalation') {
        actions.push(this.createChallengeAction(event));
      }
    }

    // Always log high and critical events
    if (event.severity === 'high' || event.severity === 'critical') {
      actions.push(this.createLogAction(event, `${event.type} detected - ${strategy} response`));
    }

    return actions;
  }

  /**
   * Initialize default response policies
   */
  private initializeDefaultPolicies(): void {
    // Critical threat policy
    this.responsePolicies.set('critical_threats', {
      id: 'critical_threats',
      name: 'Critical Threat Response',
      threatTypes: ['privilege_escalation', 'data_exfiltration'],
      severityThreshold: 'critical',
      conditions: [],
      actions: [
        this.createBlockAction({ type: 'session' }),
        this.createAdminAlertAction({ priority: 'urgent' }),
        this.createLogAction({ level: 'critical' })
      ],
      enabled: true,
      autoExecute: true,
      escalationRules: []
    });

    // Brute force policy
    this.responsePolicies.set('brute_force', {
      id: 'brute_force',
      name: 'Brute Force Protection',
      threatTypes: ['brute_force'],
      severityThreshold: 'medium',
      conditions: [{ field: 'failedAttempts', operator: '>', value: 5 }],
      actions: [
        this.createChallengeAction({ challengeType: 'totp' }),
        this.createRestrictionAction({ restrictions: ['login'] }),
        this.createLogAction({ level: 'high' })
      ],
      enabled: true,
      autoExecute: true,
      escalationRules: []
    });

    // Behavior anomaly policy
    this.responsePolicies.set('behavior_anomaly', {
      id: 'behavior_anomaly',
      name: 'Behavior Anomaly Response',
      threatTypes: ['behavior_anomaly'],
      severityThreshold: 'medium',
      conditions: [],
      actions: [
        this.createNotificationAction({ 
          title: 'Unusual Activity Detected',
          message: 'We noticed some unusual activity on your account. Please verify this was you.'
        }),
        this.createLogAction({ level: 'medium' })
      ],
      enabled: true,
      autoExecute: true,
      escalationRules: []
    });
  }

  // Helper methods for creating actions
  private createNotificationAction(params: any = {}): ResponseAction {
    return {
      id: `notify_${Date.now()}`,
      type: 'notify',
      description: 'Send security notification to user',
      parameters: params
    };
  }

  private createChallengeAction(params: any = {}): ResponseAction {
    return {
      id: `challenge_${Date.now()}`,
      type: 'challenge',
      description: 'Require additional authentication',
      parameters: { challengeType: 'push_notification', ...params }
    };
  }

  private createRestrictionAction(params: any = {}): ResponseAction {
    return {
      id: `restrict_${Date.now()}`,
      type: 'restrict',
      description: 'Apply access restrictions',
      parameters: { restrictions: ['admin_access'], duration: 3600000, ...params }
    };
  }

  private createBlockAction(params: any = {}, blockType: string = 'session'): ResponseAction {
    return {
      id: `block_${Date.now()}`,
      type: 'block',
      description: `Block ${blockType}`,
      parameters: { blockType, ...params }
    };
  }

  private createAdminAlertAction(params: any = {}): ResponseAction {
    return {
      id: `alert_${Date.now()}`,
      type: 'alert_admin',
      description: 'Alert security administrators',
      parameters: { priority: 'high', ...params }
    };
  }

  private createLogAction(event?: any, description: string = 'Security event logged'): ResponseAction {
    return {
      id: `log_${Date.now()}`,
      type: 'log_security',
      description,
      parameters: { level: event?.severity || 'medium', event }
    };
  }

  // Utility methods
  private meetsSeverityThreshold(eventSeverity: string, policyThreshold: string): boolean {
    const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
    return severityOrder[eventSeverity as keyof typeof severityOrder] >= 
           severityOrder[policyThreshold as keyof typeof severityOrder];
  }

  private evaluatePolicyConditions(policy: ResponsePolicy, event: ThreatEvent): boolean {
    // Simple condition evaluation - in real implementation would be more sophisticated
    return policy.conditions.every(condition => {
      const eventValue = this.getEventFieldValue(event, condition.field);
      return this.evaluateCondition(eventValue, condition.operator, condition.value);
    });
  }

  private getEventFieldValue(event: ThreatEvent, field: string): any {
    // Extract field value from event object
    if (field.includes('.')) {
      const parts = field.split('.');
      let value: any = event;
      for (const part of parts) {
        value = value?.[part];
      }
      return value;
    }
    return (event as any)[field];
  }

  private evaluateCondition(eventValue: any, operator: string, conditionValue: any): boolean {
    switch (operator) {
      case '>': return eventValue > conditionValue;
      case '<': return eventValue < conditionValue;
      case '>=': return eventValue >= conditionValue;
      case '<=': return eventValue <= conditionValue;
      case '==': return eventValue === conditionValue;
      case '!=': return eventValue !== conditionValue;
      case 'contains': return eventValue?.includes?.(conditionValue);
      default: return false;
    }
  }

  private calculateEscalationLevel(event: ThreatEvent): number {
    if (event.severity === 'critical') return 3;
    if (event.severity === 'high') return 2;
    if (event.severity === 'medium') return 1;
    return 0;
  }

  private shouldRequireHumanReview(event: ThreatEvent, policy: ResponsePolicy): boolean {
    return event.severity === 'critical' || 
           event.riskAssessment.overallRiskScore > 0.9 ||
           policy.actions.some(a => a.type === 'block');
  }

  private createMinimalResponse(event: ThreatEvent): ThreatResponse {
    return {
      eventId: event.id,
      responseStrategy: 'passive',
      actions: [this.createLogAction(event, 'Threat event logged - no applicable policy')],
      escalationLevel: 0,
      requiresHumanReview: false,
      executionResults: [],
      notificationsSent: [],
      timestamp: new Date()
    };
  }

  private async sendThreatNotifications(event: ThreatEvent, response: ThreatResponse): Promise<void> {
    // Implementation would send various notifications based on response
    console.log(`Threat notifications sent for event ${event.id}`);
  }

  private recordResponse(userId: string, response: ThreatResponse): void {
    if (!this.responseHistory.has(userId)) {
      this.responseHistory.set(userId, []);
    }
    
    const userHistory = this.responseHistory.get(userId)!;
    userHistory.push(response);
    
    // Keep only last 100 responses per user
    if (userHistory.length > 100) {
      userHistory.splice(0, userHistory.length - 100);
    }
  }

  private async logSecurityEvent(event: ThreatEvent, response: ThreatResponse): Promise<void> {
    const logEntry = {
      timestamp: new Date(),
      eventId: event.id,
      eventType: event.type,
      severity: event.severity,
      userId: event.userId,
      responseStrategy: response.responseStrategy,
      actionsExecuted: response.actions.length,
      escalationLevel: response.escalationLevel,
      humanReviewRequired: response.requiresHumanReview
    };

    console.log('Security Event Response:', logEntry);
  }

  private startResponseProcessor(): void {
    // Process queued threat events
    setInterval(() => {
      if (this.executionQueue.length > 0 && !this.isProcessing) {
        this.processQueuedEvents();
      }
    }, 5000); // Process every 5 seconds
  }

  private async processQueuedEvents(): Promise<void> {
    this.isProcessing = true;
    
    try {
      while (this.executionQueue.length > 0) {
        const event = this.executionQueue.shift()!;
        await this.processThreatEvent(event);
      }
    } catch (error) {
      console.error('Error processing queued events:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Add threat event to processing queue
   */
  queueThreatEvent(event: ThreatEvent): void {
    this.executionQueue.push(event);
  }

  /**
   * Get response history for a user
   */
  getResponseHistory(userId: string): ThreatResponse[] {
    return this.responseHistory.get(userId) || [];
  }

  /**
   * Update response policy
   */
  updatePolicy(policy: ResponsePolicy): void {
    this.responsePolicies.set(policy.id, policy);
  }

  /**
   * Get all response policies
   */
  getPolicies(): ResponsePolicy[] {
    return Array.from(this.responsePolicies.values());
  }
}

export const automatedThreatResponse = new AutomatedThreatResponse();