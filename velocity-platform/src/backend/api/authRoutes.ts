/**
 * Authentication API Routes
 * Handles user registration, login, SSO, and authentication flows
 */

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import Redis from 'ioredis';
import { OrganizationService } from '../services/OrganizationService';
import { IdentityProviderService } from '../services/IdentityProviderService';
import { SessionManager } from '../services/SessionManager';
import { MFAService } from '../services/MFAService';

const router = express.Router();

// Initialize services
const db = new Pool({
  connectionString: process.env.DATABASE_URL
});

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
});

const organizationService = new OrganizationService();
const identityProviderService = new IdentityProviderService();
const sessionManager = new SessionManager();
const mfaService = new MFAService();

/**
 * POST /api/auth/register
 * Register new user with organization
 */
router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      organizationName,
      domain,
      plan = 'professional',
      acceptTerms,
      acceptMarketing
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !organizationName) {
      return res.status(400).json({
        error: 'Missing required fields: firstName, lastName, email, password, organizationName'
      });
    }

    if (!acceptTerms) {
      return res.status(400).json({
        error: 'You must accept the terms of service'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Check if organization domain already exists
    const existingOrg = await db.query(
      'SELECT id FROM organizations WHERE domain = $1',
      [domain]
    );

    if (existingOrg.rows.length > 0) {
      return res.status(409).json({
        error: 'Organization with this domain already exists'
      });
    }

    // Begin transaction
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const userResult = await client.query(
        `INSERT INTO users (id, email, first_name, last_name, password_hash, email_verified, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, false, NOW())
         RETURNING id, email, first_name, last_name, created_at`,
        [email.toLowerCase(), firstName, lastName, passwordHash]
      );

      const user = userResult.rows[0];

      // Create organization
      const organization = await organizationService.createOrganization({
        name: organizationName,
        domain: domain,
        ownerId: user.id,
        plan: plan as 'starter' | 'professional' | 'enterprise'
      });

      await client.query('COMMIT');

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          organizationId: organization.id,
          role: 'owner'
        },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '7d' }
      );

      // Create initial session
      const sessionData = await sessionManager.createSession({
        userId: user.id,
        deviceId: req.headers['x-device-id'] as string || 'web-browser',
        deviceFingerprint: req.headers['x-device-fingerprint'] as string || '',
        ipAddress: req.ip || req.connection.remoteAddress || '',
        userAgent: req.headers['user-agent'] || '',
        initialTrustScore: 75, // Starting trust score for new users
        metadata: {
          registrationFlow: true,
          acceptedTerms: acceptTerms,
          acceptedMarketing: acceptMarketing
        }
      });

      // Track registration event
      await redis.lpush('analytics_events', JSON.stringify({
        event: 'user_registered',
        userId: user.id,
        organizationId: organization.id,
        timestamp: new Date().toISOString(),
        metadata: {
          plan,
          domain,
          referrer: req.headers.referer
        }
      }));

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        },
        organization: {
          id: organization.id,
          name: organization.name,
          domain: organization.domain,
          plan: organization.plan
        },
        token,
        sessionId: sessionData.id,
        trustScore: sessionData.trustScore
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed. Please try again.'
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user with Zero Trust scoring
 */
router.post('/login', async (req, res) => {
  try {
    const {
      email,
      password,
      deviceId,
      deviceFingerprint,
      rememberMe = false
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Get user with organization info
    const userResult = await db.query(
      `SELECT u.*, o.id as organization_id, o.name as organization_name, o.plan
       FROM users u
       LEFT JOIN organization_members om ON u.id = om.user_id
       LEFT JOIN organizations o ON om.organization_id = o.id
       WHERE u.email = $1 AND om.status = 'active'`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Create session with trust scoring
    const sessionData = await sessionManager.createSession({
      userId: user.id,
      deviceId: deviceId || 'web-browser',
      deviceFingerprint: deviceFingerprint || '',
      ipAddress: req.ip || req.connection.remoteAddress || '',
      userAgent: req.headers['user-agent'] || '',
      initialTrustScore: 85, // Base score for returning users
      geolocation: req.headers['x-geolocation'] ? JSON.parse(req.headers['x-geolocation'] as string) : undefined
    });

    // Check if MFA is required
    const mfaRequired = await mfaService.isMFARequired(user.id, 'login', {
      trustScore: sessionData.trustScore,
      deviceTrusted: sessionData.deviceTrusted,
      riskLevel: sessionData.riskLevel
    });

    if (mfaRequired.required) {
      // Generate MFA token
      const mfaToken = jwt.sign(
        { userId: user.id, sessionId: sessionData.id },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '10m' }
      );

      await redis.setex(`mfa:${mfaToken}`, 600, JSON.stringify({
        userId: user.id,
        sessionId: sessionData.id,
        email: user.email
      }));

      return res.json({
        requiresMFA: true,
        mfaToken,
        trustScore: sessionData.trustScore,
        reason: mfaRequired.reason,
        preferredMethod: mfaRequired.preferredMethod
      });
    }

    // Generate full access token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        organizationId: user.organization_id,
        sessionId: sessionData.id,
        role: 'user'
      },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: rememberMe ? '30d' : '7d' }
    );

    // Track login event
    await redis.lpush('analytics_events', JSON.stringify({
      event: 'user_login',
      userId: user.id,
      organizationId: user.organization_id,
      timestamp: new Date().toISOString(),
      metadata: {
        trustScore: sessionData.trustScore,
        deviceId,
        ipAddress: req.ip
      }
    }));

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        organizationId: user.organization_id,
        organizationName: user.organization_name,
        plan: user.plan
      },
      token,
      sessionId: sessionData.id,
      trustScore: sessionData.trustScore,
      requiresMFA: false
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed. Please try again.'
    });
  }
});

/**
 * GET /api/auth/sso/:provider
 * Initiate SSO login flow
 */
router.get('/sso/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const { organizationId, redirectUri = '/dashboard' } = req.query;

    if (!['okta', 'azure', 'google'].includes(provider)) {
      return res.status(400).json({
        error: 'Unsupported SSO provider'
      });
    }

    // For demo purposes, redirect to a demo SSO flow
    // In production, this would initiate actual SSO with the provider
    const ssoUrl = `/api/auth/sso/${provider}/callback?demo=true&redirectUri=${encodeURIComponent(redirectUri as string)}`;
    
    res.redirect(ssoUrl);

  } catch (error) {
    console.error('SSO initiation error:', error);
    res.status(500).json({
      error: 'SSO initiation failed'
    });
  }
});

/**
 * GET /api/auth/sso/:provider/callback
 * Handle SSO callback
 */
router.get('/sso/:provider/callback', async (req, res) => {
  try {
    const { provider } = req.params;
    const { demo, redirectUri = '/dashboard' } = req.query;

    if (demo === 'true') {
      // Demo SSO flow - create a demo user
      const demoUser = {
        id: 'demo-sso-user',
        email: `demo.user@${provider}sso.com`,
        firstName: 'Demo',
        lastName: 'User',
        organizationId: 'demo-org'
      };

      const token = jwt.sign(
        {
          userId: demoUser.id,
          email: demoUser.email,
          organizationId: demoUser.organizationId,
          role: 'user',
          ssoProvider: provider
        },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '7d' }
      );

      // Set token as cookie and redirect
      res.cookie('velocity_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.redirect(`${redirectUri}?sso=success&provider=${provider}`);
    }

    // Real SSO implementation would handle actual provider callbacks here
    res.status(501).json({
      error: 'Real SSO implementation not yet configured. Please use demo flow.'
    });

  } catch (error) {
    console.error('SSO callback error:', error);
    res.status(500).json({
      error: 'SSO authentication failed'
    });
  }
});

/**
 * POST /api/auth/mfa/verify
 * Verify MFA code and complete authentication
 */
router.post('/mfa/verify', async (req, res) => {
  try {
    const { mfaToken, code } = req.body;

    if (!mfaToken || !code) {
      return res.status(400).json({
        error: 'MFA token and code are required'
      });
    }

    // Get MFA session data
    const mfaData = await redis.get(`mfa:${mfaToken}`);
    if (!mfaData) {
      return res.status(401).json({
        error: 'Invalid or expired MFA token'
      });
    }

    const { userId, sessionId } = JSON.parse(mfaData);

    // Verify MFA code
    const isValid = await mfaService.verifyCode(userId, code);
    if (!isValid) {
      return res.status(401).json({
        error: 'Invalid MFA code'
      });
    }

    // Get user data
    const userResult = await db.query(
      `SELECT u.*, o.id as organization_id, o.name as organization_name, o.plan
       FROM users u
       LEFT JOIN organization_members om ON u.id = om.user_id
       LEFT JOIN organizations o ON om.organization_id = o.id
       WHERE u.id = $1`,
      [userId]
    );

    const user = userResult.rows[0];

    // Generate full access token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        organizationId: user.organization_id,
        sessionId,
        role: 'user',
        mfaVerified: true
      },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    // Clean up MFA token
    await redis.del(`mfa:${mfaToken}`);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        organizationId: user.organization_id,
        organizationName: user.organization_name,
        plan: user.plan
      },
      token,
      sessionId
    });

  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({
      error: 'MFA verification failed'
    });
  }
});

/**
 * GET /api/auth/validate
 * Validate authentication token
 */
router.get('/validate', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ valid: false, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    
    // Check if session is still valid
    const sessionExists = await redis.exists(`session:${decoded.sessionId}`);
    if (!sessionExists) {
      return res.status(401).json({ valid: false, error: 'Session expired' });
    }

    res.json({
      valid: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        organizationId: decoded.organizationId,
        role: decoded.role
      }
    });

  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user and invalidate session
 */
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
      
      // Invalidate session
      if (decoded.sessionId) {
        await sessionManager.terminateSession(decoded.sessionId);
      }
    }

    res.json({ success: true, message: 'Logged out successfully' });

  } catch (error) {
    // Even if token validation fails, consider logout successful
    res.json({ success: true, message: 'Logged out successfully' });
  }
});

export default router;