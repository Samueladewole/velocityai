/**
 * Multi-Factor Authentication Service
 * Progressive MFA implementation with multiple methods
 */

import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { Pool } from 'pg';
import Redis from 'ioredis';
import crypto from 'crypto';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

export interface MFAMethod {
  type: 'totp' | 'sms' | 'email' | 'push' | 'backup_codes';
  enabled: boolean;
  verified: boolean;
  metadata?: any;
}

export interface MFASetupResponse {
  method: string;
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
  setupToken: string;
}

export interface MFAVerificationRequest {
  userId: string;
  method: string;
  code: string;
  sessionId?: string;
  trustDevice?: boolean;
}

export class MFAService {
  private db: Pool;
  private redis: Redis;
  private twilioClient?: twilio.Twilio;
  private emailTransporter?: nodemailer.Transporter;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });

    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });

    // Initialize Twilio for SMS
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }

    // Initialize email transporter
    if (process.env.SMTP_HOST) {
      this.emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
  }

  /**
   * Setup MFA for a user - Progressive approach
   */
  async setupMFA(
    userId: string,
    method: string,
    context?: { action?: string; deviceId?: string }
  ): Promise<MFASetupResponse> {
    try {
      // Get user info
      const userResult = await this.db.query(
        `SELECT email, phone_number, mfa_methods FROM users WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];
      const response: MFASetupResponse = {
        method,
        setupToken: crypto.randomBytes(32).toString('hex')
      };

      switch (method) {
        case 'totp':
          const totpSetup = await this.setupTOTP(userId, user.email);
          response.secret = totpSetup.secret;
          response.qrCode = totpSetup.qrCode;
          break;

        case 'sms':
          if (!user.phone_number) {
            throw new Error('Phone number required for SMS MFA');
          }
          await this.setupSMS(userId, user.phone_number);
          break;

        case 'email':
          await this.setupEmail(userId, user.email);
          break;

        case 'backup_codes':
          const backupCodes = await this.generateBackupCodes(userId);
          response.backupCodes = backupCodes;
          break;

        default:
          throw new Error(`Unsupported MFA method: ${method}`);
      }

      // Store setup token in Redis for verification
      await this.redis.setex(
        `mfa_setup:${response.setupToken}`,
        600, // 10 minutes
        JSON.stringify({ userId, method, context })
      );

      // Log MFA setup attempt
      await this.logMFAEvent(userId, 'setup_initiated', method, context);

      return response;

    } catch (error) {
      console.error('MFA setup failed:', error);
      throw error;
    }
  }

  /**
   * Verify MFA code
   */
  async verifyMFA(request: MFAVerificationRequest): Promise<{
    success: boolean;
    trustToken?: string;
    backupCodesRemaining?: number;
  }> {
    try {
      const { userId, method, code, sessionId, trustDevice } = request;

      // Get user MFA settings
      const userResult = await this.db.query(
        `SELECT mfa_secret, mfa_methods, backup_codes FROM users WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];
      let verified = false;
      let backupCodesRemaining: number | undefined;

      switch (method) {
        case 'totp':
          verified = this.verifyTOTP(code, user.mfa_secret);
          break;

        case 'sms':
        case 'email':
          verified = await this.verifyOTP(userId, method, code);
          break;

        case 'backup_codes':
          const result = await this.verifyBackupCode(userId, code);
          verified = result.verified;
          backupCodesRemaining = result.remaining;
          break;

        default:
          throw new Error(`Unsupported MFA method: ${method}`);
      }

      if (verified) {
        // Generate trust token if device should be trusted
        let trustToken: string | undefined;
        if (trustDevice && sessionId) {
          trustToken = await this.trustDevice(userId, sessionId);
        }

        // Mark session as MFA verified
        if (sessionId) {
          await this.redis.setex(
            `mfa:${sessionId}`,
            3600, // 1 hour
            JSON.stringify({ verified: true, method, timestamp: Date.now() })
          );
        }

        // Log successful verification
        await this.logMFAEvent(userId, 'verification_success', method, { sessionId });

        return { success: true, trustToken, backupCodesRemaining };
      } else {
        // Log failed verification
        await this.logMFAEvent(userId, 'verification_failed', method, { sessionId });

        // Increment failed attempts
        await this.incrementFailedAttempts(userId, method);

        return { success: false };
      }

    } catch (error) {
      console.error('MFA verification failed:', error);
      throw error;
    }
  }

  /**
   * Send MFA challenge
   */
  async sendChallenge(
    userId: string,
    method: string,
    context?: any
  ): Promise<{ sent: boolean; expiresIn: number }> {
    try {
      const userResult = await this.db.query(
        `SELECT email, phone_number FROM users WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];
      const otp = this.generateOTP();
      const expiresIn = 300; // 5 minutes

      // Store OTP in Redis
      await this.redis.setex(
        `otp:${userId}:${method}`,
        expiresIn,
        otp
      );

      switch (method) {
        case 'sms':
          if (!user.phone_number) {
            throw new Error('Phone number not configured');
          }
          await this.sendSMSOTP(user.phone_number, otp);
          break;

        case 'email':
          await this.sendEmailOTP(user.email, otp);
          break;

        default:
          throw new Error(`Cannot send challenge for method: ${method}`);
      }

      // Log challenge sent
      await this.logMFAEvent(userId, 'challenge_sent', method, context);

      return { sent: true, expiresIn };

    } catch (error) {
      console.error('Failed to send MFA challenge:', error);
      throw error;
    }
  }

  /**
   * Check if MFA is required for action
   */
  async isMFARequired(
    userId: string,
    action: string,
    context: {
      trustScore?: number;
      deviceTrusted?: boolean;
      riskLevel?: string;
    }
  ): Promise<{
    required: boolean;
    reason?: string;
    preferredMethod?: string;
    allowSkip?: boolean;
  }> {
    try {
      // Get user MFA settings
      const userResult = await this.db.query(
        `SELECT mfa_enabled, mfa_methods, created_at FROM users WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];
      const accountAge = Date.now() - new Date(user.created_at).getTime();
      const gracePeriod = 7 * 24 * 60 * 60 * 1000; // 7 days

      // Cloud connection always requires MFA
      if (action === 'connect_cloud_environment') {
        return {
          required: true,
          reason: 'Cloud environments require MFA for security',
          preferredMethod: this.getPreferredMethod(user.mfa_methods),
          allowSkip: false
        };
      }

      // High-risk actions require MFA
      const highRiskActions = [
        'delete_data',
        'export_sensitive_data',
        'modify_security_settings',
        'add_team_member',
        'change_permissions'
      ];

      if (highRiskActions.includes(action)) {
        return {
          required: true,
          reason: 'This action requires additional verification',
          preferredMethod: this.getPreferredMethod(user.mfa_methods),
          allowSkip: false
        };
      }

      // Risk-based MFA
      if (context.riskLevel === 'high' || (context.trustScore && context.trustScore < 0.5)) {
        return {
          required: true,
          reason: 'Unusual activity detected',
          preferredMethod: this.getPreferredMethod(user.mfa_methods),
          allowSkip: false
        };
      }

      // Progressive MFA - encourage after grace period
      if (!user.mfa_enabled && accountAge > gracePeriod) {
        return {
          required: true,
          reason: 'Please set up MFA to secure your account',
          preferredMethod: 'totp',
          allowSkip: true
        };
      }

      // Device trust can bypass MFA for low-risk actions
      if (context.deviceTrusted && context.trustScore && context.trustScore > 0.8) {
        return {
          required: false
        };
      }

      return {
        required: false
      };

    } catch (error) {
      console.error('Failed to check MFA requirement:', error);
      // Fail secure - require MFA on error
      return {
        required: true,
        reason: 'Security check required',
        allowSkip: false
      };
    }
  }

  /**
   * Get user's MFA status
   */
  async getMFAStatus(userId: string): Promise<{
    enabled: boolean;
    methods: MFAMethod[];
    backupCodesCount: number;
    lastVerified?: Date;
  }> {
    try {
      const userResult = await this.db.query(
        `SELECT mfa_enabled, mfa_methods, backup_codes FROM users WHERE id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];
      const methods = user.mfa_methods || {};
      const backupCodes = user.backup_codes || [];

      // Get last verification from logs
      const lastVerifiedResult = await this.db.query(
        `SELECT created_at FROM mfa_logs 
         WHERE user_id = $1 AND event_type = 'verification_success'
         ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      return {
        enabled: user.mfa_enabled || false,
        methods: Object.keys(methods).map(type => ({
          type: type as any,
          enabled: methods[type].enabled || false,
          verified: methods[type].verified || false,
          metadata: methods[type].metadata
        })),
        backupCodesCount: backupCodes.filter((c: any) => !c.used).length,
        lastVerified: lastVerifiedResult.rows[0]?.created_at
      };

    } catch (error) {
      console.error('Failed to get MFA status:', error);
      throw error;
    }
  }

  // Private helper methods

  private async setupTOTP(userId: string, email: string): Promise<{
    secret: string;
    qrCode: string;
  }> {
    const secret = speakeasy.generateSecret({
      name: `Velocity Platform (${email})`,
      issuer: 'Velocity',
      length: 32
    });

    // Store secret temporarily (not yet verified)
    await this.redis.setex(
      `totp_setup:${userId}`,
      600, // 10 minutes to complete setup
      secret.base32
    );

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      qrCode
    };
  }

  private async setupSMS(userId: string, phoneNumber: string): Promise<void> {
    // Validate phone number format
    if (!phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      throw new Error('Invalid phone number format');
    }

    // Store phone number
    await this.db.query(
      `UPDATE users SET phone_number = $1 WHERE id = $2`,
      [phoneNumber, userId]
    );
  }

  private async setupEmail(userId: string, email: string): Promise<void> {
    // Email is already stored, just mark as MFA method
    await this.db.query(
      `UPDATE users 
       SET mfa_methods = jsonb_set(
         COALESCE(mfa_methods, '{}'), 
         '{email}', 
         '{"enabled": true, "verified": false}'
       )
       WHERE id = $1`,
      [userId]
    );
  }

  private async generateBackupCodes(userId: string): Promise<string[]> {
    const codes: string[] = [];
    
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }

    // Hash codes before storing
    const hashedCodes = codes.map(code => ({
      hash: crypto.createHash('sha256').update(code).digest('hex'),
      used: false,
      created_at: new Date()
    }));

    // Store backup codes
    await this.db.query(
      `UPDATE users SET backup_codes = $1 WHERE id = $2`,
      [JSON.stringify(hashedCodes), userId]
    );

    return codes;
  }

  private verifyTOTP(code: string, secret: string): boolean {
    if (!secret) return false;

    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 2 // Allow 2 time steps for clock skew
    });
  }

  private async verifyOTP(userId: string, method: string, code: string): Promise<boolean> {
    const storedOTP = await this.redis.get(`otp:${userId}:${method}`);
    
    if (!storedOTP) return false;

    if (storedOTP === code) {
      // Delete OTP after successful verification
      await this.redis.del(`otp:${userId}:${method}`);
      return true;
    }

    return false;
  }

  private async verifyBackupCode(
    userId: string, 
    code: string
  ): Promise<{ verified: boolean; remaining: number }> {
    const userResult = await this.db.query(
      `SELECT backup_codes FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return { verified: false, remaining: 0 };
    }

    const backupCodes = userResult.rows[0].backup_codes || [];
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    let verified = false;
    let remaining = 0;

    for (const storedCode of backupCodes) {
      if (!storedCode.used && storedCode.hash === codeHash) {
        storedCode.used = true;
        storedCode.used_at = new Date();
        verified = true;
      }
      if (!storedCode.used) {
        remaining++;
      }
    }

    if (verified) {
      // Update backup codes
      await this.db.query(
        `UPDATE users SET backup_codes = $1 WHERE id = $2`,
        [JSON.stringify(backupCodes), userId]
      );
    }

    return { verified, remaining: remaining - (verified ? 1 : 0) };
  }

  private generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private async sendSMSOTP(phoneNumber: string, otp: string): Promise<void> {
    if (!this.twilioClient) {
      throw new Error('SMS service not configured');
    }

    await this.twilioClient.messages.create({
      body: `Your Velocity verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
  }

  private async sendEmailOTP(email: string, otp: string): Promise<void> {
    if (!this.emailTransporter) {
      throw new Error('Email service not configured');
    }

    await this.emailTransporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@velocity.com',
      to: email,
      subject: 'Velocity Security Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Security Verification</h2>
          <p>Your verification code is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
            ${otp}
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });
  }

  private async trustDevice(userId: string, sessionId: string): Promise<string> {
    const trustToken = crypto.randomBytes(32).toString('hex');
    
    // Store trust token
    await this.redis.setex(
      `device_trust:${trustToken}`,
      30 * 24 * 60 * 60, // 30 days
      JSON.stringify({ userId, sessionId, created: Date.now() })
    );

    return trustToken;
  }

  private getPreferredMethod(mfaMethods: any): string {
    if (!mfaMethods) return 'totp';

    const enabledMethods = Object.keys(mfaMethods).filter(
      method => mfaMethods[method].enabled
    );

    // Preference order
    const preferenceOrder = ['totp', 'push', 'sms', 'email'];
    
    for (const preferred of preferenceOrder) {
      if (enabledMethods.includes(preferred)) {
        return preferred;
      }
    }

    return enabledMethods[0] || 'totp';
  }

  private async logMFAEvent(
    userId: string,
    eventType: string,
    method: string,
    metadata?: any
  ): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO mfa_logs 
         (user_id, event_type, method, metadata, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [userId, eventType, method, JSON.stringify(metadata || {})]
      );
    } catch (error) {
      console.error('Failed to log MFA event:', error);
    }
  }

  private async incrementFailedAttempts(userId: string, method: string): Promise<void> {
    const key = `mfa_failures:${userId}:${method}`;
    const failures = await this.redis.incr(key);
    
    if (failures === 1) {
      // Set expiry on first failure
      await this.redis.expire(key, 900); // 15 minutes
    }

    // Lock account after 5 failures
    if (failures >= 5) {
      await this.redis.setex(
        `mfa_locked:${userId}`,
        900, // 15 minute lockout
        'true'
      );
    }
  }
}