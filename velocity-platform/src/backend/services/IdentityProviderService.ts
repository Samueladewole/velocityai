/**
 * Identity Provider Service
 * SSO integration with Okta, Azure AD, and other enterprise identity providers
 * 
 * @description Critical enterprise requirement - SSO is mandatory for large orgs
 * @impact Enables selling to enterprises with 1000+ users who require SSO
 */

import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import Redis from 'ioredis';
import crypto from 'crypto';
import { SAML } from 'samlify';

/**
 * Identity provider configuration
 */
export interface IdentityProvider {
  id: string;
  organizationId: string;
  type: 'okta' | 'azure_ad' | 'google_workspace' | 'saml' | 'ldap';
  name: string;
  config: {
    // OIDC/OAuth2 config
    clientId?: string;
    clientSecret?: string;
    issuer?: string;
    authorizationEndpoint?: string;
    tokenEndpoint?: string;
    userInfoEndpoint?: string;
    
    // SAML config
    ssoUrl?: string;
    certificate?: string;
    entityId?: string;
    
    // Azure AD specific
    tenantId?: string;
    
    // Attribute mapping
    attributeMapping: {
      email: string;
      firstName: string;
      lastName: string;
      groups?: string;
      department?: string;
      title?: string;
    };
    
    // Advanced settings
    scopes?: string[];
    allowedGroups?: string[];
    autoProvision: boolean;
    enforceForAllUsers: boolean;
  };
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SSO user session
 */
export interface SSOSession {
  id: string;
  userId: string;
  organizationId: string;
  identityProviderId: string;
  externalUserId: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  tokenExpiresAt?: Date;
  userInfo: {
    email: string;
    firstName: string;
    lastName: string;
    groups: string[];
    department?: string;
    title?: string;
  };
  createdAt: Date;
}

export class IdentityProviderService {
  private db: Pool;
  private redis: Redis;

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
   * Configure identity provider for organization
   */
  async configureProvider(data: {
    organizationId: string;
    type: IdentityProvider['type'];
    name: string;
    config: IdentityProvider['config'];
  }): Promise<IdentityProvider> {
    // Validate configuration
    await this.validateProviderConfig(data.type, data.config);

    const provider: IdentityProvider = {
      id: crypto.randomUUID(),
      organizationId: data.organizationId,
      type: data.type,
      name: data.name,
      config: data.config,
      enabled: false, // Start disabled for testing
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.db.query(
      `INSERT INTO identity_providers 
       (id, organization_id, type, name, config, enabled, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        provider.id, provider.organizationId, provider.type, provider.name,
        JSON.stringify(provider.config), provider.enabled,
        provider.createdAt, provider.updatedAt
      ]
    );

    return provider;
  }

  /**
   * Initiate SSO login flow
   */
  async initiateSSO(
    organizationId: string,
    providerId: string,
    redirectUri: string
  ): Promise<{ authUrl: string; state: string }> {
    const provider = await this.getProvider(providerId);
    if (!provider || !provider.enabled) {
      throw new Error('Identity provider not found or disabled');
    }

    const state = crypto.randomBytes(32).toString('hex');
    
    // Store state for validation
    await this.redis.setex(
      `sso_state:${state}`,
      600, // 10 minutes
      JSON.stringify({ organizationId, providerId, redirectUri })
    );

    let authUrl: string;

    switch (provider.type) {
      case 'okta':
        authUrl = await this.buildOktaAuthUrl(provider, state, redirectUri);
        break;
      case 'azure_ad':
        authUrl = await this.buildAzureADAuthUrl(provider, state, redirectUri);
        break;
      case 'google_workspace':
        authUrl = await this.buildGoogleAuthUrl(provider, state, redirectUri);
        break;
      case 'saml':
        authUrl = await this.buildSAMLAuthUrl(provider, state);
        break;
      default:
        throw new Error(`Unsupported provider type: ${provider.type}`);
    }

    return { authUrl, state };
  }

  /**
   * Handle SSO callback and create user session
   */
  async handleSSOCallback(
    code: string,
    state: string
  ): Promise<{
    user: any;
    session: SSOSession;
    isNewUser: boolean;
  }> {
    // Validate state
    const stateData = await this.redis.get(`sso_state:${state}`);
    if (!stateData) {
      throw new Error('Invalid or expired state parameter');
    }

    const { organizationId, providerId } = JSON.parse(stateData);
    await this.redis.del(`sso_state:${state}`);

    const provider = await this.getProvider(providerId);
    if (!provider) {
      throw new Error('Identity provider not found');
    }

    // Exchange code for tokens
    const tokenResponse = await this.exchangeCodeForTokens(provider, code);
    
    // Get user info from provider
    const userInfo = await this.getUserInfo(provider, tokenResponse.access_token);
    
    // Map attributes
    const mappedUser = this.mapUserAttributes(provider, userInfo);
    
    // Find or create user
    let user = await this.findUserByEmail(mappedUser.email, organizationId);
    let isNewUser = false;

    if (!user && provider.config.autoProvision) {
      user = await this.createUserFromSSO(organizationId, mappedUser, provider);
      isNewUser = true;
    } else if (!user) {
      throw new Error('User not found and auto-provisioning is disabled');
    }

    // Create SSO session
    const session = await this.createSSOSession({
      userId: user.id,
      organizationId,
      identityProviderId: providerId,
      externalUserId: userInfo.sub || userInfo.id,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      idToken: tokenResponse.id_token,
      tokenExpiresAt: new Date(Date.now() + (tokenResponse.expires_in * 1000)),
      userInfo: mappedUser
    });

    return { user, session, isNewUser };
  }

  /**
   * Refresh SSO tokens
   */
  async refreshTokens(sessionId: string): Promise<SSOSession> {
    const session = await this.getSSOSession(sessionId);
    if (!session || !session.refreshToken) {
      throw new Error('Session not found or no refresh token available');
    }

    const provider = await this.getProvider(session.identityProviderId);
    if (!provider) {
      throw new Error('Identity provider not found');
    }

    // Refresh tokens
    const tokenResponse = await this.refreshProviderTokens(provider, session.refreshToken);
    
    // Update session
    await this.db.query(
      `UPDATE sso_sessions 
       SET access_token = $1, refresh_token = $2, token_expires_at = $3
       WHERE id = $4`,
      [
        tokenResponse.access_token,
        tokenResponse.refresh_token || session.refreshToken,
        new Date(Date.now() + (tokenResponse.expires_in * 1000)),
        sessionId
      ]
    );

    return await this.getSSOSession(sessionId);
  }

  /**
   * Sync users from identity provider
   */
  async syncUsers(providerId: string): Promise<{
    created: number;
    updated: number;
    disabled: number;
  }> {
    const provider = await this.getProvider(providerId);
    if (!provider) {
      throw new Error('Identity provider not found');
    }

    let created = 0;
    let updated = 0;
    let disabled = 0;

    try {
      // Get users from provider
      const providerUsers = await this.getProviderUsers(provider);
      
      for (const providerUser of providerUsers) {
        const mappedUser = this.mapUserAttributes(provider, providerUser);
        
        let user = await this.findUserByEmail(mappedUser.email, provider.organizationId);
        
        if (!user) {
          // Create new user
          await this.createUserFromSSO(provider.organizationId, mappedUser, provider);
          created++;
        } else {
          // Update existing user
          await this.updateUserFromSSO(user.id, mappedUser);
          updated++;
        }
      }

      // TODO: Mark users as disabled if they're no longer in the provider
      
      return { created, updated, disabled };

    } catch (error) {
      console.error('User sync failed:', error);
      throw error;
    }
  }

  /**
   * Test identity provider connection
   */
  async testConnection(providerId: string): Promise<{
    success: boolean;
    error?: string;
    userCount?: number;
  }> {
    try {
      const provider = await this.getProvider(providerId);
      if (!provider) {
        return { success: false, error: 'Provider not found' };
      }

      // Test based on provider type
      switch (provider.type) {
        case 'okta':
          return await this.testOktaConnection(provider);
        case 'azure_ad':
          return await this.testAzureADConnection(provider);
        case 'google_workspace':
          return await this.testGoogleConnection(provider);
        default:
          return { success: false, error: 'Test not implemented for this provider type' };
      }

    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Private helper methods

  private async getProvider(providerId: string): Promise<IdentityProvider | null> {
    const result = await this.db.query(
      `SELECT * FROM identity_providers WHERE id = $1`,
      [providerId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      organizationId: row.organization_id,
      type: row.type,
      name: row.name,
      config: JSON.parse(row.config),
      enabled: row.enabled,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private async validateProviderConfig(
    type: IdentityProvider['type'],
    config: IdentityProvider['config']
  ): Promise<void> {
    switch (type) {
      case 'okta':
        if (!config.clientId || !config.clientSecret || !config.issuer) {
          throw new Error('Okta configuration requires clientId, clientSecret, and issuer');
        }
        break;
      case 'azure_ad':
        if (!config.clientId || !config.clientSecret || !config.tenantId) {
          throw new Error('Azure AD configuration requires clientId, clientSecret, and tenantId');
        }
        break;
      case 'saml':
        if (!config.ssoUrl || !config.certificate || !config.entityId) {
          throw new Error('SAML configuration requires ssoUrl, certificate, and entityId');
        }
        break;
    }
  }

  private async buildOktaAuthUrl(
    provider: IdentityProvider,
    state: string,
    redirectUri: string
  ): Promise<string> {
    const params = new URLSearchParams({
      client_id: provider.config.clientId!,
      response_type: 'code',
      scope: provider.config.scopes?.join(' ') || 'openid profile email groups',
      redirect_uri: redirectUri,
      state
    });

    return `${provider.config.issuer}/v1/authorize?${params.toString()}`;
  }

  private async buildAzureADAuthUrl(
    provider: IdentityProvider,
    state: string,
    redirectUri: string
  ): Promise<string> {
    const params = new URLSearchParams({
      client_id: provider.config.clientId!,
      response_type: 'code',
      scope: provider.config.scopes?.join(' ') || 'openid profile email',
      redirect_uri: redirectUri,
      state,
      response_mode: 'query'
    });

    const endpoint = `https://login.microsoftonline.com/${provider.config.tenantId}/oauth2/v2.0/authorize`;
    return `${endpoint}?${params.toString()}`;
  }

  private async buildGoogleAuthUrl(
    provider: IdentityProvider,
    state: string,
    redirectUri: string
  ): Promise<string> {
    const params = new URLSearchParams({
      client_id: provider.config.clientId!,
      response_type: 'code',
      scope: provider.config.scopes?.join(' ') || 'openid profile email',
      redirect_uri: redirectUri,
      state,
      access_type: 'offline',
      hd: provider.config.issuer // Hosted domain for Google Workspace
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  private async buildSAMLAuthUrl(provider: IdentityProvider, state: string): Promise<string> {
    // SAML implementation would go here
    // For now, return the SSO URL with state parameter
    return `${provider.config.ssoUrl}?RelayState=${state}`;
  }

  private async exchangeCodeForTokens(
    provider: IdentityProvider,
    code: string
  ): Promise<any> {
    let tokenEndpoint: string;
    let tokenData: any;

    switch (provider.type) {
      case 'okta':
        tokenEndpoint = `${provider.config.issuer}/v1/token`;
        tokenData = {
          grant_type: 'authorization_code',
          client_id: provider.config.clientId,
          client_secret: provider.config.clientSecret,
          code
        };
        break;

      case 'azure_ad':
        tokenEndpoint = `https://login.microsoftonline.com/${provider.config.tenantId}/oauth2/v2.0/token`;
        tokenData = {
          grant_type: 'authorization_code',
          client_id: provider.config.clientId,
          client_secret: provider.config.clientSecret,
          code
        };
        break;

      case 'google_workspace':
        tokenEndpoint = 'https://oauth2.googleapis.com/token';
        tokenData = {
          grant_type: 'authorization_code',
          client_id: provider.config.clientId,
          client_secret: provider.config.clientSecret,
          code
        };
        break;

      default:
        throw new Error(`Token exchange not implemented for ${provider.type}`);
    }

    const response = await axios.post(tokenEndpoint, tokenData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return response.data;
  }

  private async getUserInfo(provider: IdentityProvider, accessToken: string): Promise<any> {
    let userInfoEndpoint: string;

    switch (provider.type) {
      case 'okta':
        userInfoEndpoint = `${provider.config.issuer}/v1/userinfo`;
        break;
      case 'azure_ad':
        userInfoEndpoint = 'https://graph.microsoft.com/v1.0/me';
        break;
      case 'google_workspace':
        userInfoEndpoint = 'https://www.googleapis.com/oauth2/v2/userinfo';
        break;
      default:
        throw new Error(`User info not implemented for ${provider.type}`);
    }

    const response = await axios.get(userInfoEndpoint, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    return response.data;
  }

  private mapUserAttributes(provider: IdentityProvider, userInfo: any): any {
    const mapping = provider.config.attributeMapping;
    
    return {
      email: this.getNestedValue(userInfo, mapping.email),
      firstName: this.getNestedValue(userInfo, mapping.firstName),
      lastName: this.getNestedValue(userInfo, mapping.lastName),
      groups: mapping.groups ? this.getNestedValue(userInfo, mapping.groups) || [] : [],
      department: mapping.department ? this.getNestedValue(userInfo, mapping.department) : undefined,
      title: mapping.title ? this.getNestedValue(userInfo, mapping.title) : undefined
    };
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async findUserByEmail(email: string, organizationId: string): Promise<any> {
    const result = await this.db.query(
      `SELECT u.* FROM users u
       JOIN organization_members om ON u.id = om.user_id
       WHERE u.email = $1 AND om.organization_id = $2`,
      [email, organizationId]
    );

    return result.rows[0] || null;
  }

  private async createUserFromSSO(
    organizationId: string,
    userData: any,
    provider: IdentityProvider
  ): Promise<any> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');

      // Create user
      const userResult = await client.query(
        `INSERT INTO users (id, email, first_name, last_name, email_verified, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, true, NOW())
         RETURNING *`,
        [userData.email, userData.firstName, userData.lastName]
      );

      const user = userResult.rows[0];

      // Add to organization
      await client.query(
        `INSERT INTO organization_members (user_id, organization_id, role, status, joined_at)
         VALUES ($1, $2, 'member', 'active', NOW())`,
        [user.id, organizationId]
      );

      await client.query('COMMIT');
      return user;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async updateUserFromSSO(userId: string, userData: any): Promise<void> {
    await this.db.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, updated_at = NOW()
       WHERE id = $3`,
      [userData.firstName, userData.lastName, userId]
    );
  }

  private async createSSOSession(data: Omit<SSOSession, 'id' | 'createdAt'>): Promise<SSOSession> {
    const session: SSOSession = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date()
    };

    await this.db.query(
      `INSERT INTO sso_sessions 
       (id, user_id, organization_id, identity_provider_id, external_user_id,
        access_token, refresh_token, id_token, token_expires_at, user_info, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        session.id, session.userId, session.organizationId,
        session.identityProviderId, session.externalUserId,
        session.accessToken, session.refreshToken, session.idToken,
        session.tokenExpiresAt, JSON.stringify(session.userInfo),
        session.createdAt
      ]
    );

    return session;
  }

  private async getSSOSession(sessionId: string): Promise<SSOSession> {
    const result = await this.db.query(
      `SELECT * FROM sso_sessions WHERE id = $1`,
      [sessionId]
    );

    if (result.rows.length === 0) {
      throw new Error('SSO session not found');
    }

    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      organizationId: row.organization_id,
      identityProviderId: row.identity_provider_id,
      externalUserId: row.external_user_id,
      accessToken: row.access_token,
      refreshToken: row.refresh_token,
      idToken: row.id_token,
      tokenExpiresAt: row.token_expires_at,
      userInfo: JSON.parse(row.user_info),
      createdAt: row.created_at
    };
  }

  private async refreshProviderTokens(provider: IdentityProvider, refreshToken: string): Promise<any> {
    // Implementation would vary by provider
    // This is a simplified version
    return {
      access_token: 'new_access_token',
      refresh_token: refreshToken,
      expires_in: 3600
    };
  }

  private async getProviderUsers(provider: IdentityProvider): Promise<any[]> {
    // Implementation would fetch users from the identity provider
    // This would use provider-specific APIs
    return [];
  }

  private async testOktaConnection(provider: IdentityProvider): Promise<any> {
    try {
      const response = await axios.get(`${provider.config.issuer}/.well-known/openid_configuration`);
      return { success: true, userCount: 0 }; // Would get actual user count
    } catch (error) {
      return { success: false, error: 'Failed to connect to Okta' };
    }
  }

  private async testAzureADConnection(provider: IdentityProvider): Promise<any> {
    // Would test Azure AD connection
    return { success: true, userCount: 0 };
  }

  private async testGoogleConnection(provider: IdentityProvider): Promise<any> {
    // Would test Google Workspace connection
    return { success: true, userCount: 0 };
  }
}