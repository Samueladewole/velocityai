/**
 * Organization Service
 * Multi-tenant organization management with team hierarchies and RBAC
 * 
 * @description Essential for enterprise adoption - supports complex org structures
 * @impact Enables selling to Fortune 500 companies with thousands of users
 */

import { Pool } from 'pg';
import Redis from 'ioredis';
import crypto from 'crypto';

/**
 * Organization structure for multi-tenancy
 */
export interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: 'starter' | 'professional' | 'enterprise' | 'custom';
  status: 'active' | 'suspended' | 'trial' | 'cancelled';
  settings: {
    enforceSSO: boolean;
    requireMFA: boolean;
    allowedAuthMethods: string[];
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
      expirationDays: number;
    };
    sessionTimeout: number;
    ipWhitelist: string[];
  };
  limits: {
    maxUsers: number;
    maxTeams: number;
    maxApiCalls: number;
    dataRetentionDays: number;
    maxCloudAccounts: number;
  };
  billing: {
    customerId: string;
    subscriptionId: string;
    plan: string;
    seats: number;
    amount: number;
    currency: string;
    nextBillingDate: Date;
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Team within organization
 */
export interface Team {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  parentTeamId?: string; // For hierarchical teams
  permissions: string[];
  members: string[]; // User IDs
  managers: string[]; // User IDs with management rights
  settings: {
    autoJoinOnInvite: boolean;
    requireApproval: boolean;
    visibility: 'public' | 'private';
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User role within organization/team
 */
export interface OrganizationRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean; // Built-in roles can't be deleted
  priority: number; // For role hierarchy
}

/**
 * User membership in organization
 */
export interface OrganizationMember {
  userId: string;
  organizationId: string;
  role: string;
  teams: string[];
  status: 'active' | 'invited' | 'suspended' | 'removed';
  joinedAt: Date;
  lastActiveAt: Date;
  permissions: string[]; // Computed from role + team permissions
}

export class OrganizationService {
  private db: Pool;
  private redis: Redis;
  
  // Built-in roles
  private readonly SYSTEM_ROLES = {
    OWNER: {
      name: 'owner',
      description: 'Organization owner with full access',
      permissions: ['*'],
      priority: 100
    },
    ADMIN: {
      name: 'admin',
      description: 'Administrator with management access',
      permissions: [
        'users.manage',
        'teams.manage',
        'settings.manage',
        'billing.view',
        'security.manage',
        'integrations.manage'
      ],
      priority: 90
    },
    SECURITY_ADMIN: {
      name: 'security_admin',
      description: 'Security administrator',
      permissions: [
        'security.*',
        'users.view',
        'teams.view',
        'alerts.manage',
        'policies.manage'
      ],
      priority: 80
    },
    DEVELOPER: {
      name: 'developer',
      description: 'Developer with API access',
      permissions: [
        'api.access',
        'integrations.use',
        'alerts.view',
        'dashboard.view'
      ],
      priority: 50
    },
    MEMBER: {
      name: 'member',
      description: 'Regular member with basic access',
      permissions: [
        'dashboard.view',
        'alerts.view',
        'profile.manage'
      ],
      priority: 10
    }
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
   * Create new organization
   */
  async createOrganization(data: {
    name: string;
    domain: string;
    ownerId: string;
    plan?: Organization['plan'];
  }): Promise<Organization> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');

      // Create organization
      const org: Organization = {
        id: crypto.randomUUID(),
        name: data.name,
        domain: data.domain,
        plan: data.plan || 'trial',
        status: 'active',
        settings: {
          enforceSSO: false,
          requireMFA: true,
          allowedAuthMethods: ['password', 'google', 'github'],
          passwordPolicy: {
            minLength: 12,
            requireUppercase: true,
            requireNumbers: true,
            requireSymbols: true,
            expirationDays: 90
          },
          sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
          ipWhitelist: []
        },
        limits: this.getPlanLimits(data.plan || 'trial'),
        billing: {
          customerId: '',
          subscriptionId: '',
          plan: data.plan || 'trial',
          seats: 5,
          amount: 0,
          currency: 'USD',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        },
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Insert organization
      await client.query(
        `INSERT INTO organizations 
         (id, name, domain, plan, status, settings, limits, billing, metadata, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          org.id, org.name, org.domain, org.plan, org.status,
          JSON.stringify(org.settings), JSON.stringify(org.limits),
          JSON.stringify(org.billing), JSON.stringify(org.metadata),
          org.createdAt, org.updatedAt
        ]
      );

      // Create default roles
      await this.createDefaultRoles(org.id, client);

      // Add owner as first member
      await client.query(
        `INSERT INTO organization_members 
         (user_id, organization_id, role, status, joined_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [data.ownerId, org.id, 'owner', 'active', new Date()]
      );

      // Create default team
      await client.query(
        `INSERT INTO teams 
         (id, organization_id, name, description, permissions, settings, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          crypto.randomUUID(),
          org.id,
          'Everyone',
          'Default team for all members',
          JSON.stringify(['dashboard.view', 'alerts.view']),
          JSON.stringify({
            autoJoinOnInvite: true,
            requireApproval: false,
            visibility: 'public'
          }),
          new Date()
        ]
      );

      await client.query('COMMIT');

      // Cache organization data
      await this.cacheOrganization(org);

      return org;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get organization by ID or domain
   */
  async getOrganization(identifier: string): Promise<Organization | null> {
    // Check cache first
    const cached = await this.redis.get(`org:${identifier}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Query database
    const result = await this.db.query(
      `SELECT * FROM organizations WHERE id = $1 OR domain = $2`,
      [identifier, identifier]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const org = this.mapRowToOrganization(result.rows[0]);
    
    // Cache for 5 minutes
    await this.cacheOrganization(org);

    return org;
  }

  /**
   * Update organization settings
   */
  async updateOrganization(
    orgId: string,
    updates: Partial<Organization>
  ): Promise<Organization> {
    const result = await this.db.query(
      `UPDATE organizations 
       SET name = COALESCE($2, name),
           settings = COALESCE($3, settings),
           metadata = COALESCE($4, metadata),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [
        orgId,
        updates.name,
        updates.settings ? JSON.stringify(updates.settings) : null,
        updates.metadata ? JSON.stringify(updates.metadata) : null
      ]
    );

    if (result.rows.length === 0) {
      throw new Error('Organization not found');
    }

    const org = this.mapRowToOrganization(result.rows[0]);
    
    // Update cache
    await this.cacheOrganization(org);

    return org;
  }

  /**
   * Create team within organization
   */
  async createTeam(data: {
    organizationId: string;
    name: string;
    description?: string;
    parentTeamId?: string;
    permissions?: string[];
  }): Promise<Team> {
    const team: Team = {
      id: crypto.randomUUID(),
      organizationId: data.organizationId,
      name: data.name,
      description: data.description,
      parentTeamId: data.parentTeamId,
      permissions: data.permissions || [],
      members: [],
      managers: [],
      settings: {
        autoJoinOnInvite: false,
        requireApproval: true,
        visibility: 'private'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.db.query(
      `INSERT INTO teams 
       (id, organization_id, name, description, parent_team_id, permissions, settings, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        team.id, team.organizationId, team.name, team.description,
        team.parentTeamId, JSON.stringify(team.permissions),
        JSON.stringify(team.settings), team.createdAt, team.updatedAt
      ]
    );

    return team;
  }

  /**
   * Add user to organization
   */
  async addMember(data: {
    organizationId: string;
    userId: string;
    role: string;
    teams?: string[];
    invitedBy: string;
  }): Promise<OrganizationMember> {
    // Verify organization limits
    const memberCount = await this.getMemberCount(data.organizationId);
    const org = await this.getOrganization(data.organizationId);
    
    if (org && memberCount >= org.limits.maxUsers) {
      throw new Error('Organization user limit reached');
    }

    // Add member
    await this.db.query(
      `INSERT INTO organization_members 
       (user_id, organization_id, role, status, joined_at, invited_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, organization_id) 
       DO UPDATE SET role = $3, status = $4, joined_at = $5`,
      [
        data.userId,
        data.organizationId,
        data.role,
        'active',
        new Date(),
        data.invitedBy
      ]
    );

    // Add to teams
    if (data.teams && data.teams.length > 0) {
      for (const teamId of data.teams) {
        await this.addTeamMember(teamId, data.userId);
      }
    }

    // Get computed permissions
    const permissions = await this.getUserPermissions(data.userId, data.organizationId);

    return {
      userId: data.userId,
      organizationId: data.organizationId,
      role: data.role,
      teams: data.teams || [],
      status: 'active',
      joinedAt: new Date(),
      lastActiveAt: new Date(),
      permissions
    };
  }

  /**
   * Remove user from organization
   */
  async removeMember(organizationId: string, userId: string): Promise<void> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');

      // Remove from organization
      await client.query(
        `UPDATE organization_members 
         SET status = 'removed', removed_at = NOW()
         WHERE organization_id = $1 AND user_id = $2`,
        [organizationId, userId]
      );

      // Remove from all teams
      await client.query(
        `DELETE FROM team_members 
         WHERE team_id IN (SELECT id FROM teams WHERE organization_id = $1)
         AND user_id = $2`,
        [organizationId, userId]
      );

      // Revoke all sessions
      await this.revokeUserSessions(userId, organizationId);

      await client.query('COMMIT');

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get user's permissions in organization
   */
  async getUserPermissions(
    userId: string,
    organizationId: string
  ): Promise<string[]> {
    // Get user's role
    const memberResult = await this.db.query(
      `SELECT role FROM organization_members 
       WHERE user_id = $1 AND organization_id = $2 AND status = 'active'`,
      [userId, organizationId]
    );

    if (memberResult.rows.length === 0) {
      return [];
    }

    const rolePermissions = await this.getRolePermissions(
      organizationId,
      memberResult.rows[0].role
    );

    // Get team permissions
    const teamResult = await this.db.query(
      `SELECT t.permissions 
       FROM teams t
       JOIN team_members tm ON t.id = tm.team_id
       WHERE tm.user_id = $1 AND t.organization_id = $2`,
      [userId, organizationId]
    );

    const teamPermissions = teamResult.rows.flatMap(row => 
      JSON.parse(row.permissions || '[]')
    );

    // Combine and deduplicate
    const allPermissions = new Set([...rolePermissions, ...teamPermissions]);
    
    return Array.from(allPermissions);
  }

  /**
   * Check if user has permission
   */
  async hasPermission(
    userId: string,
    organizationId: string,
    permission: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, organizationId);
    
    // Check for wildcard permissions
    if (permissions.includes('*')) {
      return true;
    }

    // Check for exact match
    if (permissions.includes(permission)) {
      return true;
    }

    // Check for wildcard in permission namespace
    const namespace = permission.split('.')[0];
    if (permissions.includes(`${namespace}.*`)) {
      return true;
    }

    return false;
  }

  /**
   * Get organization usage statistics
   */
  async getOrganizationStats(organizationId: string): Promise<{
    users: { total: number; active: number; invited: number };
    teams: { total: number; activeTeams: number };
    security: { incidents: number; threatsBlocked: number; complianceScore: number };
    usage: { apiCalls: number; storageGB: number; bandwidthGB: number };
  }> {
    // Get user stats
    const userStats = await this.db.query(
      `SELECT 
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE status = 'active') as active,
         COUNT(*) FILTER (WHERE status = 'invited') as invited
       FROM organization_members 
       WHERE organization_id = $1`,
      [organizationId]
    );

    // Get team stats
    const teamStats = await this.db.query(
      `SELECT COUNT(*) as total FROM teams WHERE organization_id = $1`,
      [organizationId]
    );

    // Get security stats (mock data for now)
    const securityStats = {
      incidents: 3,
      threatsBlocked: 47,
      complianceScore: 94
    };

    // Get usage stats from Redis
    const apiCalls = await this.redis.get(`org:${organizationId}:api_calls`) || '0';

    return {
      users: {
        total: parseInt(userStats.rows[0].total),
        active: parseInt(userStats.rows[0].active),
        invited: parseInt(userStats.rows[0].invited)
      },
      teams: {
        total: parseInt(teamStats.rows[0].total),
        activeTeams: parseInt(teamStats.rows[0].total) // Would calculate based on activity
      },
      security: securityStats,
      usage: {
        apiCalls: parseInt(apiCalls),
        storageGB: 2.4, // Mock data
        bandwidthGB: 12.7 // Mock data
      }
    };
  }

  // Private helper methods

  private async createDefaultRoles(organizationId: string, client: any): Promise<void> {
    for (const [key, role] of Object.entries(this.SYSTEM_ROLES)) {
      await client.query(
        `INSERT INTO organization_roles 
         (organization_id, name, description, permissions, is_system, priority)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          organizationId,
          role.name,
          role.description,
          JSON.stringify(role.permissions),
          true,
          role.priority
        ]
      );
    }
  }

  private getPlanLimits(plan: Organization['plan']): Organization['limits'] {
    const limits = {
      starter: {
        maxUsers: 10,
        maxTeams: 3,
        maxApiCalls: 10000,
        dataRetentionDays: 30,
        maxCloudAccounts: 1
      },
      professional: {
        maxUsers: 50,
        maxTeams: 10,
        maxApiCalls: 100000,
        dataRetentionDays: 90,
        maxCloudAccounts: 5
      },
      enterprise: {
        maxUsers: 500,
        maxTeams: 50,
        maxApiCalls: 1000000,
        dataRetentionDays: 365,
        maxCloudAccounts: 25
      },
      custom: {
        maxUsers: 10000,
        maxTeams: 500,
        maxApiCalls: 10000000,
        dataRetentionDays: 730,
        maxCloudAccounts: 100
      },
      trial: {
        maxUsers: 5,
        maxTeams: 2,
        maxApiCalls: 5000,
        dataRetentionDays: 14,
        maxCloudAccounts: 1
      }
    };

    return limits[plan] || limits.trial;
  }

  private async cacheOrganization(org: Organization): Promise<void> {
    await this.redis.setex(
      `org:${org.id}`,
      300, // 5 minutes
      JSON.stringify(org)
    );
    await this.redis.setex(
      `org:${org.domain}`,
      300,
      JSON.stringify(org)
    );
  }

  private mapRowToOrganization(row: any): Organization {
    return {
      id: row.id,
      name: row.name,
      domain: row.domain,
      plan: row.plan,
      status: row.status,
      settings: JSON.parse(row.settings || '{}'),
      limits: JSON.parse(row.limits || '{}'),
      billing: JSON.parse(row.billing || '{}'),
      metadata: JSON.parse(row.metadata || '{}'),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private async getMemberCount(organizationId: string): Promise<number> {
    const result = await this.db.query(
      `SELECT COUNT(*) as count FROM organization_members 
       WHERE organization_id = $1 AND status = 'active'`,
      [organizationId]
    );
    return parseInt(result.rows[0].count);
  }

  private async addTeamMember(teamId: string, userId: string): Promise<void> {
    await this.db.query(
      `INSERT INTO team_members (team_id, user_id, joined_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (team_id, user_id) DO NOTHING`,
      [teamId, userId]
    );
  }

  private async getRolePermissions(
    organizationId: string,
    roleName: string
  ): Promise<string[]> {
    const result = await this.db.query(
      `SELECT permissions FROM organization_roles 
       WHERE organization_id = $1 AND name = $2`,
      [organizationId, roleName]
    );

    if (result.rows.length === 0) {
      return [];
    }

    return JSON.parse(result.rows[0].permissions || '[]');
  }

  private async revokeUserSessions(userId: string, organizationId: string): Promise<void> {
    // Implementation would revoke all active sessions
    await this.redis.del(`sessions:${userId}:${organizationId}`);
  }
}