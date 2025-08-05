/**
 * Security Policy Engine
 * Manages and enforces dynamic security policies based on user context and risk
 */

import { SessionRiskAssessment } from './SessionRiskScoring';
import { ThreatEvent } from './AutomatedThreatResponse';

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  priority: number; // Higher numbers = higher priority
  
  // Policy conditions
  conditions: PolicyCondition[];
  
  // Policy actions
  actions: PolicyAction[];
  
  // Scope and applicability
  scope: {
    users?: string[]; // Specific user IDs
    userGroups?: string[]; // User groups/roles
    resources?: string[]; // Protected resources
    timeWindows?: TimeWindow[]; // When policy applies
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags: string[];
}

export interface PolicyCondition {
  id: string;
  type: 'risk_score' | 'location' | 'device' | 'behavior' | 'time' | 'resource' | 'user_attribute';
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'in' | 'not_in' | 'matches' | 'contains';
  value: any;
  field?: string; // Specific field to check
  description: string;
}

export interface PolicyAction {
  id: string;
  type: 'allow' | 'deny' | 'challenge' | 'restrict' | 'monitor' | 'notify' | 'redirect';
  parameters: any;
  description: string;
  priority: number;
}

export interface TimeWindow {
  days: number[]; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timezone: string;
}

export interface PolicyEvaluationContext {
  userId: string;
  sessionId: string;
  deviceId?: string;
  ipAddress: string;
  userAgent: string;
  requestedResource: string;
  requestMethod: string;
  userRoles: string[];
  userAttributes: Record<string, any>;
  riskAssessment: SessionRiskAssessment;
  timestamp: Date;
  location?: any;
  deviceTrust?: any;
}

export interface PolicyEvaluationResult {
  decision: 'allow' | 'deny' | 'challenge' | 'restrict';
  appliedPolicies: string[];
  requiredActions: PolicyAction[];
  riskAdjustment: number; // -1 to 1, adjustment to trust score
  restrictions: string[];
  challengeType?: string;
  message?: string;
  confidence: number;
  evaluationTime: number; // milliseconds
}

export interface PolicyViolation {
  id: string;
  policyId: string;
  userId: string;
  sessionId: string;
  violationType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  context: PolicyEvaluationContext;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export class SecurityPolicyEngine {
  private policies: Map<string, SecurityPolicy> = new Map();
  private violations: Map<string, PolicyViolation> = new Map();
  private evaluationCache: Map<string, { result: PolicyEvaluationResult; expires: number }> = new Map();

  constructor() {
    this.initializeDefaultPolicies();
    this.startPolicyMaintenanceTasks();
  }

  /**
   * Evaluate security policies for a given context
   */
  async evaluateRequest(context: PolicyEvaluationContext): Promise<PolicyEvaluationResult> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(context);
      const cached = this.evaluationCache.get(cacheKey);
      if (cached && cached.expires > Date.now()) {
        return cached.result;
      }

      // Get applicable policies
      const applicablePolicies = this.getApplicablePolicies(context);
      
      if (applicablePolicies.length === 0) {
        return this.createDefaultAllowResult(startTime);
      }

      // Sort policies by priority
      applicablePolicies.sort((a, b) => b.priority - a.priority);

      // Evaluate policies in priority order
      const evaluationResults = await Promise.all(
        applicablePolicies.map(policy => this.evaluatePolicy(policy, context))
      );

      // Combine results based on policy logic
      const finalResult = this.combineEvaluationResults(
        evaluationResults, 
        applicablePolicies, 
        startTime
      );

      // Cache result for 60 seconds
      this.evaluationCache.set(cacheKey, {
        result: finalResult,
        expires: Date.now() + 60000
      });

      // Log policy violations
      if (finalResult.decision === 'deny' || finalResult.decision === 'restrict') {
        await this.logPolicyViolation(context, finalResult, applicablePolicies);
      }

      return finalResult;

    } catch (error) {
      console.error('Policy evaluation failed:', error);
      return this.createFailsafeResult(startTime);
    }
  }

  /**
   * Evaluate a single policy against context
   */
  private async evaluatePolicy(
    policy: SecurityPolicy, 
    context: PolicyEvaluationContext
  ): Promise<{ policy: SecurityPolicy; matches: boolean; actions: PolicyAction[] }> {
    try {
      // Check all conditions
      const conditionResults = await Promise.all(
        policy.conditions.map(condition => this.evaluateCondition(condition, context))
      );

      // All conditions must be true for policy to match
      const matches = conditionResults.every(result => result);

      return {
        policy,
        matches,
        actions: matches ? policy.actions : []
      };

    } catch (error) {
      console.error(`Policy evaluation failed for ${policy.id}:`, error);
      return { policy, matches: false, actions: [] };
    }
  }

  /**
   * Evaluate a single policy condition
   */
  private async evaluateCondition(
    condition: PolicyCondition, 
    context: PolicyEvaluationContext
  ): Promise<boolean> {
    try {
      const contextValue = this.extractContextValue(condition, context);
      return this.compareValues(contextValue, condition.operator, condition.value);

    } catch (error) {
      console.error(`Condition evaluation failed for ${condition.id}:`, error);
      return false;
    }
  }

  /**
   * Extract value from context based on condition type
   */
  private extractContextValue(condition: PolicyCondition, context: PolicyEvaluationContext): any {
    switch (condition.type) {
      case 'risk_score':
        return context.riskAssessment.overallRiskScore;
        
      case 'location':
        if (condition.field === 'country') {
          return context.location?.country;
        } else if (condition.field === 'vpn_detected') {
          return context.location?.vpnDetected;
        }
        return context.ipAddress;
        
      case 'device':
        if (condition.field === 'trust_score') {
          return context.deviceTrust?.trustScore || 0.5;
        } else if (condition.field === 'new_device') {
          return context.deviceTrust?.isNew || false;
        }
        return context.deviceId;
        
      case 'behavior':
        if (condition.field === 'anomaly_count') {
          return context.riskAssessment.factors.behaviorAnomalies;
        } else if (condition.field === 'confidence') {
          return context.riskAssessment.factors.behaviorConfidence;
        }
        return context.riskAssessment.factors.behaviorAnomalies;
        
      case 'time':
        const now = context.timestamp;
        if (condition.field === 'hour') {
          return now.getHours();
        } else if (condition.field === 'day_of_week') {
          return now.getDay();
        }
        return now.getTime();
        
      case 'resource':
        return context.requestedResource;
        
      case 'user_attribute':
        if (condition.field) {
          return context.userAttributes[condition.field];
        }
        return context.userRoles;
        
      default:
        return null;
    }
  }

  /**
   * Compare values using specified operator
   */
  private compareValues(contextValue: any, operator: string, conditionValue: any): boolean {
    switch (operator) {
      case '>':
        return contextValue > conditionValue;
      case '<':
        return contextValue < conditionValue;
      case '>=':
        return contextValue >= conditionValue;
      case '<=':
        return contextValue <= conditionValue;
      case '==':
        return contextValue === conditionValue;
      case '!=':
        return contextValue !== conditionValue;
      case 'in':
        return Array.isArray(conditionValue) && conditionValue.includes(contextValue);
      case 'not_in':
        return Array.isArray(conditionValue) && !conditionValue.includes(contextValue);
      case 'matches':
        return new RegExp(conditionValue).test(String(contextValue));
      case 'contains':
        return String(contextValue).includes(String(conditionValue));
      default:
        return false;
    }
  }

  /**
   * Get policies that apply to the current context
   */
  private getApplicablePolicies(context: PolicyEvaluationContext): SecurityPolicy[] {
    const policies = Array.from(this.policies.values());
    
    return policies.filter(policy => {
      if (!policy.enabled) return false;
      
      // Check scope restrictions
      if (policy.scope.users && !policy.scope.users.includes(context.userId)) {
        return false;
      }
      
      if (policy.scope.userGroups) {
        const hasMatchingGroup = policy.scope.userGroups.some(group => 
          context.userRoles.includes(group)
        );
        if (!hasMatchingGroup) return false;
      }
      
      if (policy.scope.resources) {
        const resourceMatches = policy.scope.resources.some(resource =>
          context.requestedResource.includes(resource) || 
          new RegExp(resource).test(context.requestedResource)
        );
        if (!resourceMatches) return false;
      }
      
      if (policy.scope.timeWindows) {
        const isInTimeWindow = this.isInTimeWindow(context.timestamp, policy.scope.timeWindows);
        if (!isInTimeWindow) return false;
      }
      
      return true;
    });
  }

  /**
   * Check if current time is within any of the specified time windows
   */
  private isInTimeWindow(timestamp: Date, timeWindows: TimeWindow[]): boolean {
    return timeWindows.some(window => {
      const day = timestamp.getDay();
      if (!window.days.includes(day)) return false;
      
      const currentTime = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;
      return currentTime >= window.startTime && currentTime <= window.endTime;
    });
  }

  /**
   * Combine multiple policy evaluation results
   */
  private combineEvaluationResults(
    results: any[], 
    policies: SecurityPolicy[], 
    startTime: number
  ): PolicyEvaluationResult {
    const matchingResults = results.filter(r => r.matches);
    
    if (matchingResults.length === 0) {
      return this.createDefaultAllowResult(startTime);
    }

    // Determine overall decision based on most restrictive action
    let decision: 'allow' | 'deny' | 'challenge' | 'restrict' = 'allow';
    const allActions: PolicyAction[] = [];
    const appliedPolicies: string[] = [];
    const restrictions: string[] = [];
    let challengeType: string | undefined;
    let riskAdjustment = 0;

    for (const result of matchingResults) {
      appliedPolicies.push(result.policy.id);
      allActions.push(...result.actions);

      for (const action of result.actions) {
        switch (action.type) {
          case 'deny':
            decision = 'deny';
            break;
          case 'restrict':
            if (decision !== 'deny') decision = 'restrict';
            if (action.parameters.restrictions) {
              restrictions.push(...action.parameters.restrictions);
            }
            break;
          case 'challenge':
            if (decision !== 'deny' && decision !== 'restrict') {
              decision = 'challenge';
              challengeType = action.parameters.challengeType || 'push_notification';
            }
            break;
        }
        
        if (action.parameters.riskAdjustment) {
          riskAdjustment += action.parameters.riskAdjustment;
        }
      }
    }

    return {
      decision,
      appliedPolicies,
      requiredActions: allActions,
      riskAdjustment: Math.max(-1, Math.min(1, riskAdjustment)),
      restrictions: [...new Set(restrictions)],
      challengeType,
      confidence: 0.9,
      evaluationTime: Date.now() - startTime
    };
  }

  /**
   * Create policy and add to engine
   */
  createPolicy(policy: Omit<SecurityPolicy, 'id' | 'createdAt' | 'updatedAt'>): SecurityPolicy {
    const fullPolicy: SecurityPolicy = {
      ...policy,
      id: `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.policies.set(fullPolicy.id, fullPolicy);
    return fullPolicy;
  }

  /**
   * Update existing policy
   */
  updatePolicy(id: string, updates: Partial<SecurityPolicy>): SecurityPolicy | null {
    const policy = this.policies.get(id);
    if (!policy) return null;

    const updatedPolicy = {
      ...policy,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date()
    };

    this.policies.set(id, updatedPolicy);
    this.clearRelatedCache(id);
    
    return updatedPolicy;
  }

  /**
   * Delete policy
   */
  deletePolicy(id: string): boolean {
    const deleted = this.policies.delete(id);
    if (deleted) {
      this.clearRelatedCache(id);
    }
    return deleted;
  }

  /**
   * Get all policies
   */
  getAllPolicies(): SecurityPolicy[] {
    return Array.from(this.policies.values());
  }

  /**
   * Get policy by ID
   */
  getPolicy(id: string): SecurityPolicy | null {
    return this.policies.get(id) || null;
  }

  /**
   * Get policy violations
   */
  getPolicyViolations(userId?: string, limit: number = 100): PolicyViolation[] {
    const violations = Array.from(this.violations.values());
    
    const filtered = userId 
      ? violations.filter(v => v.userId === userId)
      : violations;
    
    return filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Initialize default security policies
   */
  private initializeDefaultPolicies(): void {
    // High-risk location policy
    this.createPolicy({
      name: 'High Risk Location Block',
      description: 'Block access from high-risk locations',
      version: '1.0',
      enabled: true,
      priority: 100,
      conditions: [
        {
          id: 'risk_location',
          type: 'location',
          field: 'threat_level',
          operator: 'in',
          value: ['high', 'critical'],
          description: 'Location has high threat level'
        }
      ],
      actions: [
        {
          id: 'block_high_risk',
          type: 'deny',
          parameters: { reason: 'Access denied from high-risk location' },
          description: 'Block access from high-risk location',
          priority: 1
        }
      ],
      scope: {},
      createdBy: 'system',
      tags: ['location', 'security', 'automated']
    });

    // VPN detection policy
    this.createPolicy({
      name: 'VPN Challenge Policy',
      description: 'Challenge users accessing via VPN',
      version: '1.0',
      enabled: true,
      priority: 50,
      conditions: [
        {
          id: 'vpn_detected',
          type: 'location',
          field: 'vpn_detected',
          operator: '==',
          value: true,
          description: 'VPN connection detected'
        }
      ],
      actions: [
        {
          id: 'challenge_vpn',
          type: 'challenge',
          parameters: { 
            challengeType: 'totp',
            reason: 'Additional verification required for VPN access'
          },
          description: 'Challenge VPN users with TOTP',
          priority: 1
        }
      ],
      scope: {},
      createdBy: 'system',
      tags: ['vpn', 'challenge', 'automated']
    });

    // High-risk score policy
    this.createPolicy({
      name: 'High Risk Score Restriction',
      description: 'Restrict access for high-risk sessions',
      version: '1.0',
      enabled: true,
      priority: 80,
      conditions: [
        {
          id: 'high_risk',
          type: 'risk_score',
          operator: '>=',
          value: 0.8,
          description: 'Session risk score is high'
        }
      ],
      actions: [
        {
          id: 'restrict_high_risk',
          type: 'restrict',
          parameters: { 
            restrictions: ['admin_access', 'sensitive_data'],
            reason: 'Access restricted due to high risk score'
          },
          description: 'Restrict access to sensitive resources',
          priority: 1
        }
      ],
      scope: {},
      createdBy: 'system',
      tags: ['risk', 'restriction', 'automated']
    });

    // Behavior anomaly policy
    this.createPolicy({
      name: 'Behavior Anomaly Challenge',
      description: 'Challenge users with behavior anomalies',
      version: '1.0',
      enabled: true,
      priority: 60,
      conditions: [
        {
          id: 'behavior_anomalies',
          type: 'behavior',
          field: 'anomaly_count',
          operator: '>=',
          value: 5,
          description: 'Multiple behavior anomalies detected'
        }
      ],
      actions: [
        {
          id: 'challenge_anomaly',
          type: 'challenge',
          parameters: { 
            challengeType: 'push_notification',
            reason: 'Unusual behavior detected - please verify your identity'
          },
          description: 'Challenge users with behavior anomalies',
          priority: 1
        }
      ],
      scope: {},
      createdBy: 'system',
      tags: ['behavior', 'anomaly', 'automated']
    });
  }

  // Utility methods
  private generateCacheKey(context: PolicyEvaluationContext): string {
    return `${context.userId}_${context.requestedResource}_${Math.floor(context.riskAssessment.overallRiskScore * 10)}`;
  }

  private clearRelatedCache(policyId: string): void {
    // Clear cache entries that might be affected by policy changes
    this.evaluationCache.clear();
  }

  private createDefaultAllowResult(startTime: number): PolicyEvaluationResult {
    return {
      decision: 'allow',
      appliedPolicies: [],
      requiredActions: [],
      riskAdjustment: 0,
      restrictions: [],
      confidence: 0.7,
      evaluationTime: Date.now() - startTime
    };
  }

  private createFailsafeResult(startTime: number): PolicyEvaluationResult {
    return {
      decision: 'challenge',
      appliedPolicies: ['failsafe'],
      requiredActions: [{
        id: 'failsafe_challenge',
        type: 'challenge',
        parameters: { challengeType: 'push_notification' },
        description: 'Failsafe challenge due to evaluation error',
        priority: 1
      }],
      riskAdjustment: -0.1,
      restrictions: [],
      challengeType: 'push_notification',
      message: 'Security verification required',
      confidence: 0.5,
      evaluationTime: Date.now() - startTime
    };
  }

  private async logPolicyViolation(
    context: PolicyEvaluationContext,
    result: PolicyEvaluationResult,
    policies: SecurityPolicy[]
  ): Promise<void> {
    const violation: PolicyViolation = {
      id: `violation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      policyId: result.appliedPolicies[0] || 'unknown',
      userId: context.userId,
      sessionId: context.sessionId,
      violationType: result.decision,
      severity: this.determineSeverity(result, context),
      description: `Policy violation: ${result.decision} decision for ${context.requestedResource}`,
      context,
      timestamp: new Date(),
      resolved: false
    };

    this.violations.set(violation.id, violation);

    // Cleanup old violations (keep last 1000)
    const allViolations = Array.from(this.violations.values());
    if (allViolations.length > 1000) {
      const sorted = allViolations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      const toKeep = sorted.slice(0, 1000);
      
      this.violations.clear();
      toKeep.forEach(v => this.violations.set(v.id, v));
    }
  }

  private determineSeverity(
    result: PolicyEvaluationResult, 
    context: PolicyEvaluationContext
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (result.decision === 'deny') return 'high';
    if (context.riskAssessment.overallRiskScore > 0.8) return 'high';
    if (context.riskAssessment.overallRiskScore > 0.6) return 'medium';
    return 'low';
  }

  private startPolicyMaintenanceTasks(): void {
    // Clean up cache every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, cached] of this.evaluationCache.entries()) {
        if (cached.expires <= now) {
          this.evaluationCache.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }
}

export const securityPolicyEngine = new SecurityPolicyEngine();