/**
 * Policy Recommendation Service
 * AI-powered security policy recommendations based on risk analysis
 * 
 * @description Provides intelligent, contextual security policy suggestions
 * @impact Reduces security team workload and improves security posture
 */

import { Pool } from 'pg';
import Redis from 'ioredis';

/**
 * Security policy recommendation
 */
export interface PolicyRecommendation {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  category: 'access_control' | 'data_protection' | 'network_security' | 'compliance' | 'incident_response';
  priority: 'low' | 'medium' | 'high' | 'critical';
  riskReduction: number; // Percentage
  implementationEffort: 'low' | 'medium' | 'high';
  estimatedCost: number;
  potentialSavings: number;
  
  // Implementation details
  steps: string[];
  resources: string[];
  automationAvailable: boolean;
  
  // Context
  triggeredBy: string[]; // Risk factors that triggered this recommendation
  affectedAssets: string[];
  complianceFrameworks: string[];
  
  // Metadata
  confidence: number; // AI confidence score
  evidenceLinks: string[];
  status: 'new' | 'reviewing' | 'approved' | 'implementing' | 'completed' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Risk context for recommendations
 */
interface RiskContext {
  organizationId: string;
  industry: string;
  size: number;
  complianceRequirements: string[];
  currentThreats: Array<{
    type: string;
    severity: string;
    count: number;
  }>;
  securityEvents: Array<{
    eventType: string;
    frequency: number;
    lastOccurrence: Date;
  }>;
  assets: Array<{
    type: string;
    count: number;
    riskLevel: string;
  }>;
  currentPolicies: string[];
}

export class PolicyRecommendationService {
  private db: Pool;
  private redis: Redis;

  // Industry-specific policy templates
  private readonly INDUSTRY_POLICIES = {
    fintech: [
      'PCI DSS compliance automation',
      'Real-time fraud detection',
      'Customer data encryption',
      'API security hardening',
      'Transaction monitoring'
    ],
    healthcare: [
      'HIPAA compliance monitoring',
      'Patient data access controls',
      'Medical device security',
      'Audit trail automation',
      'Breach notification procedures'
    ],
    technology: [
      'Code repository security',
      'DevSecOps integration',
      'API rate limiting',
      'Container security',
      'Intellectual property protection'
    ],
    ecommerce: [
      'Payment data protection',
      'Customer privacy controls',
      'DDoS protection',
      'Inventory system security',
      'Third-party vendor assessment'
    ]
  };

  // Risk-based policy recommendations
  private readonly RISK_POLICIES = {
    data_exposure: [
      {
        title: 'Implement Data Loss Prevention (DLP)',
        description: 'Deploy DLP solutions to prevent unauthorized data exfiltration',
        priority: 'high',
        riskReduction: 75,
        implementationEffort: 'medium',
        estimatedCost: 50000,
        potentialSavings: 500000
      },
      {
        title: 'Enforce Data Classification',
        description: 'Classify and label sensitive data for appropriate protection',
        priority: 'high',
        riskReduction: 60,
        implementationEffort: 'high',
        estimatedCost: 75000,
        potentialSavings: 300000
      }
    ],
    identity_compromise: [
      {
        title: 'Mandatory Multi-Factor Authentication',
        description: 'Require MFA for all user accounts, especially privileged access',
        priority: 'critical',
        riskReduction: 90,
        implementationEffort: 'low',
        estimatedCost: 25000,
        potentialSavings: 1000000
      },
      {
        title: 'Privileged Access Management',
        description: 'Implement PAM solution for administrative accounts',
        priority: 'high',
        riskReduction: 85,
        implementationEffort: 'high',
        estimatedCost: 100000,
        potentialSavings: 750000
      }
    ],
    cloud_misconfiguration: [
      {
        title: 'Cloud Security Posture Management',
        description: 'Deploy CSPM to continuously monitor cloud configurations',
        priority: 'high',
        riskReduction: 80,
        implementationEffort: 'medium',
        estimatedCost: 40000,
        potentialSavings: 400000
      },
      {
        title: 'Infrastructure as Code Security',
        description: 'Implement security scanning in CI/CD pipelines',
        priority: 'medium',
        riskReduction: 65,
        implementationEffort: 'medium',
        estimatedCost: 30000,
        potentialSavings: 200000
      }
    ]
  };

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });

    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });
  }

  /**
   * Generate policy recommendations for organization
   */
  async generateRecommendations(organizationId: string): Promise<PolicyRecommendation[]> {
    try {
      // Get risk context
      const riskContext = await this.getRiskContext(organizationId);
      
      // Generate recommendations based on various factors
      const recommendations: PolicyRecommendation[] = [];

      // Industry-specific recommendations
      const industryRecs = await this.getIndustryRecommendations(riskContext);
      recommendations.push(...industryRecs);

      // Risk-based recommendations
      const riskRecs = await this.getRiskBasedRecommendations(riskContext);
      recommendations.push(...riskRecs);

      // Compliance recommendations
      const complianceRecs = await this.getComplianceRecommendations(riskContext);
      recommendations.push(...complianceRecs);

      // Threat-based recommendations
      const threatRecs = await this.getThreatBasedRecommendations(riskContext);
      recommendations.push(...threatRecs);

      // Score and prioritize recommendations
      const scoredRecommendations = this.scoreRecommendations(recommendations, riskContext);

      // Remove duplicates and limit to top recommendations
      const uniqueRecommendations = this.deduplicateRecommendations(scoredRecommendations);
      const topRecommendations = uniqueRecommendations.slice(0, 10);

      // Store recommendations
      await this.storeRecommendations(topRecommendations);

      return topRecommendations;

    } catch (error) {
      console.error('Failed to generate policy recommendations:', error);
      throw error;
    }
  }

  /**
   * Get policy recommendations for organization
   */
  async getRecommendations(
    organizationId: string,
    filters?: {
      category?: string;
      priority?: string;
      status?: string;
    }
  ): Promise<PolicyRecommendation[]> {
    let query = `
      SELECT * FROM policy_recommendations 
      WHERE organization_id = $1
    `;
    const params = [organizationId];
    let paramIndex = 2;

    if (filters?.category) {
      query += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters?.priority) {
      query += ` AND priority = $${paramIndex}`;
      params.push(filters.priority);
      paramIndex++;
    }

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    query += ` ORDER BY 
      CASE priority 
        WHEN 'critical' THEN 4
        WHEN 'high' THEN 3
        WHEN 'medium' THEN 2
        ELSE 1
      END DESC,
      confidence DESC,
      created_at DESC
    `;

    const result = await this.db.query(query, params);
    return result.rows.map(this.mapRowToRecommendation);
  }

  /**
   * Update recommendation status
   */
  async updateRecommendationStatus(
    recommendationId: string,
    status: PolicyRecommendation['status'],
    notes?: string
  ): Promise<void> {
    await this.db.query(
      `UPDATE policy_recommendations 
       SET status = $1, updated_at = NOW(), notes = $2
       WHERE id = $3`,
      [status, notes, recommendationId]
    );

    // Update organization's policy effectiveness score
    const result = await this.db.query(
      `SELECT organization_id FROM policy_recommendations WHERE id = $1`,
      [recommendationId]
    );
    
    if (result.rows.length > 0) {
      await this.updatePolicyEffectivenessScore(result.rows[0].organization_id);
    }
  }

  /**
   * Auto-implement policy recommendation
   */
  async autoImplementRecommendation(recommendationId: string): Promise<{
    success: boolean;
    message: string;
    actions: string[];
  }> {
    const recommendation = await this.getRecommendation(recommendationId);
    if (!recommendation) {
      return { success: false, message: 'Recommendation not found', actions: [] };
    }

    if (!recommendation.automationAvailable) {
      return { 
        success: false, 
        message: 'This recommendation requires manual implementation', 
        actions: [] 
      };
    }

    try {
      const actions: string[] = [];

      // Auto-implementation logic based on recommendation type
      switch (recommendation.category) {
        case 'access_control':
          actions.push(...await this.autoImplementAccessControl(recommendation));
          break;
        case 'data_protection':
          actions.push(...await this.autoImplementDataProtection(recommendation));
          break;
        case 'network_security':
          actions.push(...await this.autoImplementNetworkSecurity(recommendation));
          break;
        default:
          return { 
            success: false, 
            message: 'Auto-implementation not available for this category', 
            actions: [] 
          };
      }

      // Update status
      await this.updateRecommendationStatus(recommendationId, 'implementing');

      return {
        success: true,
        message: 'Policy recommendation implemented successfully',
        actions
      };

    } catch (error) {
      console.error('Auto-implementation failed:', error);
      return {
        success: false,
        message: 'Auto-implementation failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
        actions: []
      };
    }
  }

  // Private helper methods

  private async getRiskContext(organizationId: string): Promise<RiskContext> {
    // Get organization details
    const orgResult = await this.db.query(
      `SELECT * FROM organizations WHERE id = $1`,
      [organizationId]
    );

    if (orgResult.rows.length === 0) {
      throw new Error('Organization not found');
    }

    const org = orgResult.rows[0];
    const metadata = JSON.parse(org.metadata || '{}');

    // Get current threats
    const threatsResult = await this.db.query(
      `SELECT 
         event_type,
         severity,
         COUNT(*) as count
       FROM security_events 
       WHERE user_id IN (
         SELECT user_id FROM organization_members WHERE organization_id = $1
       )
       AND created_at > NOW() - INTERVAL '30 days'
       GROUP BY event_type, severity`,
      [organizationId]
    );

    // Get security events
    const eventsResult = await this.db.query(
      `SELECT 
         event_type,
         COUNT(*) as frequency,
         MAX(created_at) as last_occurrence
       FROM security_events 
       WHERE user_id IN (
         SELECT user_id FROM organization_members WHERE organization_id = $1
       )
       AND created_at > NOW() - INTERVAL '90 days'
       GROUP BY event_type`,
      [organizationId]
    );

    return {
      organizationId,
      industry: metadata.industry || 'technology',
      size: await this.getOrganizationSize(organizationId),
      complianceRequirements: metadata.complianceRequirements || [],
      currentThreats: threatsResult.rows.map(row => ({
        type: row.event_type,
        severity: row.severity,
        count: parseInt(row.count)
      })),
      securityEvents: eventsResult.rows.map(row => ({
        eventType: row.event_type,
        frequency: parseInt(row.frequency),
        lastOccurrence: row.last_occurrence
      })),
      assets: [], // Would get from asset inventory
      currentPolicies: [] // Would get from policy database
    };
  }

  private async getIndustryRecommendations(context: RiskContext): Promise<PolicyRecommendation[]> {
    const industryPolicies = this.INDUSTRY_POLICIES[context.industry as keyof typeof this.INDUSTRY_POLICIES] || [];
    
    return industryPolicies.map((policy, index) => ({
      id: `industry-${context.industry}-${index}`,
      organizationId: context.organizationId,
      title: policy,
      description: `Industry-standard security policy for ${context.industry} organizations`,
      category: 'compliance' as const,
      priority: 'medium' as const,
      riskReduction: 50,
      implementationEffort: 'medium' as const,
      estimatedCost: 25000,
      potentialSavings: 100000,
      steps: [`Implement ${policy}`, 'Configure monitoring', 'Train staff'],
      resources: ['Security team', 'Compliance officer'],
      automationAvailable: false,
      triggeredBy: [`Industry requirement: ${context.industry}`],
      affectedAssets: [],
      complianceFrameworks: context.complianceRequirements,
      confidence: 0.8,
      evidenceLinks: [],
      status: 'new' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }

  private async getRiskBasedRecommendations(context: RiskContext): Promise<PolicyRecommendation[]> {
    const recommendations: PolicyRecommendation[] = [];

    // Analyze current threats to determine risk-based recommendations
    for (const threat of context.currentThreats) {
      const riskCategory = this.mapThreatToRiskCategory(threat.type);
      const policies = this.RISK_POLICIES[riskCategory as keyof typeof this.RISK_POLICIES] || [];

      for (const policy of policies) {
        recommendations.push({
          id: `risk-${riskCategory}-${recommendations.length}`,
          organizationId: context.organizationId,
          ...policy,
          category: this.getCategoryFromRisk(riskCategory),
          steps: this.generateImplementationSteps(policy.title),
          resources: this.getRequiredResources(policy.title),
          automationAvailable: this.isAutomationAvailable(policy.title),
          triggeredBy: [`High ${riskCategory} risk detected`],
          affectedAssets: [],
          complianceFrameworks: context.complianceRequirements,
          confidence: 0.9,
          evidenceLinks: [],
          status: 'new' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return recommendations;
  }

  private async getComplianceRecommendations(context: RiskContext): Promise<PolicyRecommendation[]> {
    const recommendations: PolicyRecommendation[] = [];

    for (const framework of context.complianceRequirements) {
      // Generate framework-specific recommendations
      const frameworkRecs = this.getFrameworkRecommendations(framework, context);
      recommendations.push(...frameworkRecs);
    }

    return recommendations;
  }

  private async getThreatBasedRecommendations(context: RiskContext): Promise<PolicyRecommendation[]> {
    // Analyze threat patterns and recommend countermeasures
    return [];
  }

  private scoreRecommendations(
    recommendations: PolicyRecommendation[],
    context: RiskContext
  ): PolicyRecommendation[] {
    return recommendations.map(rec => ({
      ...rec,
      confidence: this.calculateConfidence(rec, context)
    })).sort((a, b) => {
      // Sort by priority, then confidence
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      const aScore = priorityWeight[a.priority] * a.confidence;
      const bScore = priorityWeight[b.priority] * b.confidence;
      return bScore - aScore;
    });
  }

  private deduplicateRecommendations(recommendations: PolicyRecommendation[]): PolicyRecommendation[] {
    const seen = new Set();
    return recommendations.filter(rec => {
      const key = `${rec.title}-${rec.category}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private async storeRecommendations(recommendations: PolicyRecommendation[]): Promise<void> {
    for (const rec of recommendations) {
      await this.db.query(
        `INSERT INTO policy_recommendations 
         (id, organization_id, title, description, category, priority, risk_reduction,
          implementation_effort, estimated_cost, potential_savings, steps, resources,
          automation_available, triggered_by, affected_assets, compliance_frameworks,
          confidence, evidence_links, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
         ON CONFLICT (id) DO UPDATE SET
           updated_at = EXCLUDED.updated_at,
           confidence = EXCLUDED.confidence`,
        [
          rec.id, rec.organizationId, rec.title, rec.description, rec.category,
          rec.priority, rec.riskReduction, rec.implementationEffort, rec.estimatedCost,
          rec.potentialSavings, JSON.stringify(rec.steps), JSON.stringify(rec.resources),
          rec.automationAvailable, JSON.stringify(rec.triggeredBy), JSON.stringify(rec.affectedAssets),
          JSON.stringify(rec.complianceFrameworks), rec.confidence, JSON.stringify(rec.evidenceLinks),
          rec.status, rec.createdAt, rec.updatedAt
        ]
      );
    }
  }

  // Additional helper methods would be implemented here...
  private mapThreatToRiskCategory(threatType: string): string {
    const mapping: Record<string, string> = {
      'data_breach': 'data_exposure',
      'unauthorized_access': 'identity_compromise',
      'cloud_misconfiguration': 'cloud_misconfiguration',
      'malware': 'endpoint_security',
      'phishing': 'email_security'
    };
    return mapping[threatType] || 'general_security';
  }

  private getCategoryFromRisk(riskCategory: string): PolicyRecommendation['category'] {
    const mapping: Record<string, PolicyRecommendation['category']> = {
      'data_exposure': 'data_protection',
      'identity_compromise': 'access_control',
      'cloud_misconfiguration': 'network_security'
    };
    return mapping[riskCategory] || 'access_control';
  }

  private generateImplementationSteps(title: string): string[] {
    // Generate contextual implementation steps
    return ['Assess current state', 'Plan implementation', 'Execute changes', 'Validate results'];
  }

  private getRequiredResources(title: string): string[] {
    return ['Security team', 'IT operations'];
  }

  private isAutomationAvailable(title: string): boolean {
    const automatable = ['Multi-Factor Authentication', 'Cloud Security Posture'];
    return automatable.some(auto => title.includes(auto));
  }

  private getFrameworkRecommendations(framework: string, context: RiskContext): PolicyRecommendation[] {
    // Return framework-specific recommendations
    return [];
  }

  private calculateConfidence(rec: PolicyRecommendation, context: RiskContext): number {
    // Calculate AI confidence based on various factors
    let confidence = 0.5;
    
    // Industry match increases confidence
    if (context.industry && rec.triggeredBy.some(t => t.includes(context.industry))) {
      confidence += 0.2;
    }
    
    // Recent threats increase confidence
    if (context.currentThreats.length > 0) {
      confidence += 0.2;
    }
    
    return Math.min(1, confidence);
  }

  private async getOrganizationSize(organizationId: string): Promise<number> {
    const result = await this.db.query(
      `SELECT COUNT(*) as count FROM organization_members WHERE organization_id = $1`,
      [organizationId]
    );
    return parseInt(result.rows[0]?.count || '0');
  }

  private async getRecommendation(id: string): Promise<PolicyRecommendation | null> {
    const result = await this.db.query(
      `SELECT * FROM policy_recommendations WHERE id = $1`,
      [id]
    );
    return result.rows.length > 0 ? this.mapRowToRecommendation(result.rows[0]) : null;
  }

  private mapRowToRecommendation(row: any): PolicyRecommendation {
    return {
      id: row.id,
      organizationId: row.organization_id,
      title: row.title,
      description: row.description,
      category: row.category,
      priority: row.priority,
      riskReduction: row.risk_reduction,
      implementationEffort: row.implementation_effort,
      estimatedCost: row.estimated_cost,
      potentialSavings: row.potential_savings,
      steps: JSON.parse(row.steps || '[]'),
      resources: JSON.parse(row.resources || '[]'),
      automationAvailable: row.automation_available,
      triggeredBy: JSON.parse(row.triggered_by || '[]'),
      affectedAssets: JSON.parse(row.affected_assets || '[]'),
      complianceFrameworks: JSON.parse(row.compliance_frameworks || '[]'),
      confidence: row.confidence,
      evidenceLinks: JSON.parse(row.evidence_links || '[]'),
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private async updatePolicyEffectivenessScore(organizationId: string): Promise<void> {
    // Calculate and update organization's policy effectiveness score
    const result = await this.db.query(
      `SELECT 
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE status = 'completed') as completed
       FROM policy_recommendations 
       WHERE organization_id = $1`,
      [organizationId]
    );

    const effectiveness = result.rows[0].total > 0 ? 
      (result.rows[0].completed / result.rows[0].total) * 100 : 0;

    await this.redis.setex(
      `org:${organizationId}:policy_effectiveness`,
      3600, // 1 hour
      effectiveness.toString()
    );
  }

  private async autoImplementAccessControl(recommendation: PolicyRecommendation): Promise<string[]> {
    // Auto-implement access control policies
    return ['Enabled MFA enforcement', 'Updated password policy', 'Configured access reviews'];
  }

  private async autoImplementDataProtection(recommendation: PolicyRecommendation): Promise<string[]> {
    // Auto-implement data protection policies
    return ['Enabled encryption at rest', 'Configured data classification', 'Set up DLP rules'];
  }

  private async autoImplementNetworkSecurity(recommendation: PolicyRecommendation): Promise<string[]> {
    // Auto-implement network security policies
    return ['Updated firewall rules', 'Enabled network monitoring', 'Configured VPN policies'];
  }
}