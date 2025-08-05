/**
 * Notification Service
 * Handles Slack, Teams, email, and webhook notifications for security alerts
 * 
 * @description Critical for enterprise adoption - alerts go where teams work
 * @impact Reduces incident response time from hours to minutes
 */

import axios from 'axios';
import { Pool } from 'pg';
import Redis from 'ioredis';
import nodemailer from 'nodemailer';

/**
 * Notification channel configuration
 */
export interface NotificationChannel {
  id: string;
  type: 'slack' | 'teams' | 'email' | 'webhook' | 'pagerduty';
  name: string;
  config: {
    webhookUrl?: string;
    channel?: string;
    recipients?: string[];
    apiKey?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
  };
  enabled: boolean;
  filters: {
    severities: string[];
    eventTypes: string[];
    resources?: string[];
  };
}

/**
 * Security alert for notification
 */
export interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  eventType: string;
  timestamp: Date;
  source: string;
  affectedResources: string[];
  userId?: string;
  organizationId: string;
  details: Record<string, any>;
  actions?: {
    label: string;
    url: string;
    type: 'primary' | 'secondary';
  }[];
}

export class NotificationService {
  private db: Pool;
  private redis: Redis;
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
   * Send security alert to all configured channels
   */
  async sendSecurityAlert(alert: SecurityAlert): Promise<{
    sent: number;
    failed: number;
    channels: string[];
  }> {
    try {
      // Get organization's notification channels
      const channels = await this.getOrganizationChannels(alert.organizationId);
      
      let sent = 0;
      let failed = 0;
      const sentChannels: string[] = [];

      // Filter channels based on alert criteria
      const applicableChannels = channels.filter(channel => 
        this.shouldNotifyChannel(channel, alert)
      );

      // Send to each applicable channel
      for (const channel of applicableChannels) {
        try {
          await this.sendToChannel(channel, alert);
          sent++;
          sentChannels.push(channel.name);
        } catch (error) {
          console.error(`Failed to send to ${channel.name}:`, error);
          failed++;
        }
      }

      // Log notification event
      await this.logNotificationEvent(alert, sentChannels);

      return { sent, failed, channels: sentChannels };

    } catch (error) {
      console.error('Failed to send security alert:', error);
      throw error;
    }
  }

  /**
   * Send to Slack channel
   */
  async sendToSlack(webhookUrl: string, alert: SecurityAlert): Promise<void> {
    const color = this.getSeverityColor(alert.severity);
    
    const slackMessage = {
      attachments: [{
        color,
        title: `🚨 ${alert.title}`,
        text: alert.description,
        fields: [
          {
            title: 'Severity',
            value: alert.severity.toUpperCase(),
            short: true
          },
          {
            title: 'Source',
            value: alert.source,
            short: true
          },
          {
            title: 'Time',
            value: new Date(alert.timestamp).toLocaleString(),
            short: true
          },
          {
            title: 'Affected Resources',
            value: alert.affectedResources.join(', ') || 'None',
            short: true
          }
        ],
        footer: 'Velocity Security',
        ts: Math.floor(Date.now() / 1000),
        actions: alert.actions?.map(action => ({
          type: 'button',
          text: action.label,
          url: action.url,
          style: action.type === 'primary' ? 'primary' : 'default'
        }))
      }]
    };

    await axios.post(webhookUrl, slackMessage);
  }

  /**
   * Send to Microsoft Teams
   */
  async sendToTeams(webhookUrl: string, alert: SecurityAlert): Promise<void> {
    const color = this.getSeverityColor(alert.severity);
    
    const teamsMessage = {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      themeColor: color.replace('#', ''),
      summary: alert.title,
      sections: [{
        activityTitle: alert.title,
        activitySubtitle: `Security Alert - ${alert.severity.toUpperCase()}`,
        activityImage: 'https://velocity.com/icon.png',
        facts: [
          {
            name: 'Description',
            value: alert.description
          },
          {
            name: 'Severity',
            value: alert.severity.toUpperCase()
          },
          {
            name: 'Source',
            value: alert.source
          },
          {
            name: 'Time',
            value: new Date(alert.timestamp).toLocaleString()
          },
          {
            name: 'Affected Resources',
            value: alert.affectedResources.join(', ') || 'None'
          }
        ],
        markdown: true
      }],
      potentialAction: alert.actions?.map(action => ({
        '@type': 'OpenUri',
        name: action.label,
        targets: [{
          os: 'default',
          uri: action.url
        }]
      }))
    };

    await axios.post(webhookUrl, teamsMessage);
  }

  /**
   * Send email notification
   */
  async sendEmail(recipients: string[], alert: SecurityAlert): Promise<void> {
    if (!this.emailTransporter) {
      throw new Error('Email service not configured');
    }

    const html = this.generateEmailHTML(alert);

    await this.emailTransporter.sendMail({
      from: process.env.SMTP_FROM || 'security@velocity.com',
      to: recipients.join(', '),
      subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
      html
    });
  }

  /**
   * Configure notification channel for organization
   */
  async configureChannel(
    organizationId: string,
    channel: Omit<NotificationChannel, 'id'>
  ): Promise<NotificationChannel> {
    try {
      // Validate channel configuration
      await this.validateChannelConfig(channel);

      const result = await this.db.query(
        `INSERT INTO notification_channels 
         (organization_id, type, name, config, enabled, filters, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id`,
        [
          organizationId,
          channel.type,
          channel.name,
          JSON.stringify(channel.config),
          channel.enabled,
          JSON.stringify(channel.filters)
        ]
      );

      const newChannel: NotificationChannel = {
        id: result.rows[0].id,
        ...channel
      };

      // Test the channel
      await this.testChannel(newChannel);

      return newChannel;

    } catch (error) {
      console.error('Failed to configure channel:', error);
      throw error;
    }
  }

  /**
   * Test notification channel
   */
  async testChannel(channel: NotificationChannel): Promise<boolean> {
    const testAlert: SecurityAlert = {
      id: 'test-' + Date.now(),
      title: 'Test Alert from Velocity',
      description: 'This is a test alert to verify your notification channel is working correctly.',
      severity: 'low',
      eventType: 'test',
      timestamp: new Date(),
      source: 'Velocity Test',
      affectedResources: [],
      organizationId: 'test',
      details: {},
      actions: [{
        label: 'View Dashboard',
        url: 'https://velocity.com/dashboard',
        type: 'primary'
      }]
    };

    try {
      await this.sendToChannel(channel, testAlert);
      return true;
    } catch (error) {
      console.error('Channel test failed:', error);
      return false;
    }
  }

  /**
   * Get notification preferences for user
   */
  async getUserPreferences(userId: string): Promise<{
    channels: string[];
    severities: string[];
    quiet_hours?: { start: string; end: string };
    summary_frequency?: 'realtime' | 'hourly' | 'daily';
  }> {
    const result = await this.db.query(
      `SELECT notification_preferences FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return {
        channels: ['email'],
        severities: ['critical', 'high'],
        summary_frequency: 'realtime'
      };
    }

    return result.rows[0].notification_preferences || {
      channels: ['email'],
      severities: ['critical', 'high'],
      summary_frequency: 'realtime'
    };
  }

  /**
   * Update user notification preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: any
  ): Promise<void> {
    await this.db.query(
      `UPDATE users SET notification_preferences = $1 WHERE id = $2`,
      [JSON.stringify(preferences), userId]
    );
  }

  // Private helper methods

  private async getOrganizationChannels(
    organizationId: string
  ): Promise<NotificationChannel[]> {
    const result = await this.db.query(
      `SELECT * FROM notification_channels 
       WHERE organization_id = $1 AND enabled = true`,
      [organizationId]
    );

    return result.rows.map(row => ({
      id: row.id,
      type: row.type,
      name: row.name,
      config: JSON.parse(row.config),
      enabled: row.enabled,
      filters: JSON.parse(row.filters)
    }));
  }

  private shouldNotifyChannel(
    channel: NotificationChannel,
    alert: SecurityAlert
  ): boolean {
    // Check severity filter
    if (channel.filters.severities.length > 0 &&
        !channel.filters.severities.includes(alert.severity)) {
      return false;
    }

    // Check event type filter
    if (channel.filters.eventTypes.length > 0 &&
        !channel.filters.eventTypes.includes(alert.eventType)) {
      return false;
    }

    // Check resource filter
    if (channel.filters.resources && channel.filters.resources.length > 0) {
      const hasMatchingResource = alert.affectedResources.some(resource =>
        channel.filters.resources!.some(filter => 
          resource.toLowerCase().includes(filter.toLowerCase())
        )
      );
      if (!hasMatchingResource) {
        return false;
      }
    }

    return true;
  }

  private async sendToChannel(
    channel: NotificationChannel,
    alert: SecurityAlert
  ): Promise<void> {
    switch (channel.type) {
      case 'slack':
        if (!channel.config.webhookUrl) {
          throw new Error('Slack webhook URL not configured');
        }
        await this.sendToSlack(channel.config.webhookUrl, alert);
        break;

      case 'teams':
        if (!channel.config.webhookUrl) {
          throw new Error('Teams webhook URL not configured');
        }
        await this.sendToTeams(channel.config.webhookUrl, alert);
        break;

      case 'email':
        if (!channel.config.recipients || channel.config.recipients.length === 0) {
          throw new Error('Email recipients not configured');
        }
        await this.sendEmail(channel.config.recipients, alert);
        break;

      case 'webhook':
        if (!channel.config.webhookUrl) {
          throw new Error('Webhook URL not configured');
        }
        await axios.post(channel.config.webhookUrl, alert);
        break;

      case 'pagerduty':
        await this.sendToPagerDuty(channel.config, alert);
        break;

      default:
        throw new Error(`Unsupported channel type: ${channel.type}`);
    }
  }

  private async sendToPagerDuty(config: any, alert: SecurityAlert): Promise<void> {
    const event = {
      routing_key: config.apiKey,
      event_action: 'trigger',
      payload: {
        summary: alert.title,
        severity: this.mapSeverityToPagerDuty(alert.severity),
        source: alert.source,
        timestamp: alert.timestamp,
        custom_details: alert.details
      }
    };

    await axios.post('https://events.pagerduty.com/v2/enqueue', event);
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#0dcaf0';
      default: return '#6c757d';
    }
  }

  private mapSeverityToPagerDuty(severity: string): string {
    switch (severity) {
      case 'critical': return 'critical';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'info';
    }
  }

  private generateEmailHTML(alert: SecurityAlert): string {
    const color = this.getSeverityColor(alert.severity);
    
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f4f4f4; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; }
    .header { background: ${color}; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #666; }
    .value { color: #333; margin-top: 5px; }
    .actions { margin-top: 20px; text-align: center; }
    .button { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 0 5px; }
    .footer { background: #f8f9fa; padding: 15px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🚨 Security Alert</h1>
      <h2 style="margin: 10px 0 0 0; font-weight: normal;">${alert.title}</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Description</div>
        <div class="value">${alert.description}</div>
      </div>
      <div class="field">
        <div class="label">Severity</div>
        <div class="value" style="color: ${color}; font-weight: bold;">
          ${alert.severity.toUpperCase()}
        </div>
      </div>
      <div class="field">
        <div class="label">Source</div>
        <div class="value">${alert.source}</div>
      </div>
      <div class="field">
        <div class="label">Time</div>
        <div class="value">${new Date(alert.timestamp).toLocaleString()}</div>
      </div>
      <div class="field">
        <div class="label">Affected Resources</div>
        <div class="value">${alert.affectedResources.join(', ') || 'None'}</div>
      </div>
      ${alert.actions && alert.actions.length > 0 ? `
      <div class="actions">
        ${alert.actions.map(action => 
          `<a href="${action.url}" class="button">${action.label}</a>`
        ).join('')}
      </div>
      ` : ''}
    </div>
    <div class="footer">
      Velocity Security Platform - Intelligent Zero Trust Protection
    </div>
  </div>
</body>
</html>
    `;
  }

  private async validateChannelConfig(channel: any): Promise<void> {
    switch (channel.type) {
      case 'slack':
      case 'teams':
        if (!channel.config.webhookUrl) {
          throw new Error('Webhook URL is required');
        }
        if (!channel.config.webhookUrl.startsWith('https://')) {
          throw new Error('Webhook URL must use HTTPS');
        }
        break;

      case 'email':
        if (!channel.config.recipients || channel.config.recipients.length === 0) {
          throw new Error('At least one email recipient is required');
        }
        break;
    }
  }

  private async logNotificationEvent(
    alert: SecurityAlert,
    channels: string[]
  ): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO notification_logs 
         (alert_id, organization_id, channels, sent_at)
         VALUES ($1, $2, $3, NOW())`,
        [alert.id, alert.organizationId, JSON.stringify(channels)]
      );
    } catch (error) {
      console.error('Failed to log notification event:', error);
    }
  }
}