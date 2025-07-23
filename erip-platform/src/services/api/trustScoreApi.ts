/**
 * Trust Score API
 * 
 * RESTful API for Trust Equity™ system including shareable URLs,
 * public profiles, and real-time trust score management.
 */

import { Router, Request, Response } from 'express'
import { Logger } from '../../infrastructure/logging/logger'
import { TrustScoreCalculator, TrustActivity, OrganizationTrustProfile } from '../trustEquity/trustScoreCalculator'
import { MetricsCollector } from '../monitoring/metricsCollector'
import crypto from 'crypto'

export interface ShareableTrustUrl {
  id: string
  organizationId: string
  url: string
  shortUrl: string
  publicUrl: string
  createdBy: string
  createdAt: Date
  expiresAt?: Date
  accessCount: number
  isActive: boolean
  customizations: {
    title?: string
    description?: string
    logoUrl?: string
    brandColors?: {
      primary: string
      secondary: string
    }
    hideDetails?: boolean
    showContactInfo?: boolean
  }
  accessLog: Array<{
    timestamp: Date
    ip: string
    userAgent: string
    referrer?: string
  }>
}

export interface TrustBadgeConfig {
  organizationId: string
  badgeType: 'score' | 'tier' | 'verification'
  style: 'minimal' | 'detailed' | 'compact'
  theme: 'light' | 'dark' | 'auto'
  showScore: boolean
  showTier: boolean
  animateUpdates: boolean
  customColors?: {
    background: string
    text: string
    accent: string
  }
}

export interface PublicTrustProfile {
  organizationId: string
  displayName: string
  industry: string
  trustScore: number
  tier: string
  badgeUrl: string
  lastUpdated: Date
  achievements: Array<{
    title: string
    description: string
    achievedAt: Date
    badgeUrl: string
  }>
  verifications: Array<{
    type: string
    verifier: string
    verifiedAt: Date
    status: 'active' | 'expired'
  }>
  publicMetrics: {
    totalActivities: number
    frameworksCovered: number
    consecutiveDays: number
    peerValidations: number
  }
  customizations: {
    description?: string
    website?: string
    logoUrl?: string
    contactInfo?: string
    brandColors?: Record<string, string>
  }
}

export class TrustScoreApiService {
  private logger: Logger
  private metricsCollector: MetricsCollector
  private shareableUrls: Map<string, ShareableTrustUrl> = new Map()
  private publicProfiles: Map<string, PublicTrustProfile> = new Map()
  private router: Router

  constructor(
    private trustCalculator: TrustScoreCalculator,
    private baseUrl: string = 'https://trust.erip.platform'
  ) {
    this.logger = new Logger('TrustScoreApiService')
    this.metricsCollector = new MetricsCollector({
      enabled: true,
      exportInterval: 60000,
      labels: { component: 'trust_score_api' }
    })

    this.router = Router()
    this.setupRoutes()
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Trust Score endpoints
    this.router.get('/organizations/:orgId/trust-score', this.getTrustScore.bind(this))
    this.router.post('/organizations/:orgId/activities', this.recordActivity.bind(this))
    this.router.get('/organizations/:orgId/breakdown', this.getTrustScoreBreakdown.bind(this))
    this.router.get('/organizations/:orgId/profile', this.getProfile.bind(this))
    this.router.put('/organizations/:orgId/profile', this.updateProfile.bind(this))

    // Shareable URLs
    this.router.post('/organizations/:orgId/share-url', this.createShareableUrl.bind(this))
    this.router.get('/organizations/:orgId/share-urls', this.getShareableUrls.bind(this))
    this.router.put('/share/:shareId', this.updateShareableUrl.bind(this))
    this.router.delete('/share/:shareId', this.deactivateShareableUrl.bind(this))

    // Public profile endpoints
    this.router.get('/public/:orgId', this.getPublicProfile.bind(this))
    this.router.get('/share/:shareId', this.getSharedProfile.bind(this))

    // Trust badge endpoints
    this.router.get('/badge/:orgId/svg', this.getTrustBadgeSvg.bind(this))
    this.router.get('/badge/:orgId/embed.js', this.getTrustBadgeEmbed.bind(this))

    // Industry benchmarking
    this.router.get('/benchmarks/:industry', this.getIndustryBenchmarks.bind(this))

    // Trust ROI calculator
    this.router.get('/organizations/:orgId/roi', this.getTrustROI.bind(this))

    // Tiers and configuration
    this.router.get('/tiers', this.getTiers.bind(this))
    this.router.get('/activity-types', this.getActivityTypes.bind(this))
  }

  /**
   * Route handlers
   */
  private async getTrustScore(req: Request, res: Response): Promise<void> {
    try {
      const { orgId } = req.params
      const score = this.trustCalculator.getCurrentScore(orgId)
      
      this.metricsCollector.incrementCounter('trust_score_api_requests', {
        endpoint: 'get_trust_score',
        organization: orgId
      })

      res.json({
        organizationId: orgId,
        trustScore: score,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      this.handleError(res, error, 'Failed to get trust score')
    }
  }

  private async recordActivity(req: Request, res: Response): Promise<void> {
    try {
      const { orgId } = req.params
      const activityData = req.body

      const activity = await this.trustCalculator.recordActivity({
        ...activityData,
        organizationId: orgId
      })

      this.metricsCollector.incrementCounter('trust_activities_via_api', {
        type: activity.type,
        organization: orgId
      })

      res.status(201).json({
        success: true,
        activity,
        newScore: this.trustCalculator.getCurrentScore(orgId)
      })
    } catch (error) {
      this.handleError(res, error, 'Failed to record activity')
    }
  }

  private async getTrustScoreBreakdown(req: Request, res: Response): Promise<void> {
    try {
      const { orgId } = req.params
      const breakdown = await this.trustCalculator.calculateTrustScore(orgId)
      
      res.json({
        organizationId: orgId,
        breakdown,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      this.handleError(res, error, 'Failed to get trust score breakdown')
    }
  }

  private async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const { orgId } = req.params
      const profile = this.trustCalculator.getProfile(orgId)
      
      if (!profile) {
        res.status(404).json({ error: 'Organization profile not found' })
        return
      }

      res.json(profile)
    } catch (error) {
      this.handleError(res, error, 'Failed to get profile')
    }
  }

  private async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { orgId } = req.params
      const updates = req.body

      const profile = await this.trustCalculator.updateProfile(orgId, updates)
      
      // Update public profile if public
      if (profile.publicProfile) {
        await this.updatePublicProfile(profile)
      }

      res.json(profile)
    } catch (error) {
      this.handleError(res, error, 'Failed to update profile')
    }
  }

  /**
   * Create shareable trust score URL
   */
  private async createShareableUrl(req: Request, res: Response): Promise<void> {
    try {
      const { orgId } = req.params
      const { 
        expiresIn, 
        customizations = {}, 
        createdBy 
      } = req.body

      const profile = this.trustCalculator.getProfile(orgId)
      if (!profile) {
        res.status(404).json({ error: 'Organization not found' })
        return
      }

      const shareId = this.generateShareId()
      const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined

      const shareableUrl: ShareableTrustUrl = {
        id: shareId,
        organizationId: orgId,
        url: `${this.baseUrl}/share/${shareId}`,
        shortUrl: `${this.baseUrl}/s/${shareId}`,
        publicUrl: `${this.baseUrl}/public/${orgId}`,
        createdBy: createdBy || 'system',
        createdAt: new Date(),
        expiresAt,
        accessCount: 0,
        isActive: true,
        customizations,
        accessLog: []
      }

      this.shareableUrls.set(shareId, shareableUrl)

      this.metricsCollector.incrementCounter('shareable_urls_created', {
        organization: orgId
      })

      this.logger.info('Shareable URL created', {
        shareId,
        organizationId: orgId,
        expiresAt
      })

      res.status(201).json({
        success: true,
        shareId,
        url: shareableUrl.url,
        shortUrl: shareableUrl.shortUrl,
        publicUrl: shareableUrl.publicUrl,
        expiresAt: shareableUrl.expiresAt
      })
    } catch (error) {
      this.handleError(res, error, 'Failed to create shareable URL')
    }
  }

  private async getShareableUrls(req: Request, res: Response): Promise<void> {
    try {
      const { orgId } = req.params
      
      const urls = Array.from(this.shareableUrls.values())
        .filter(url => url.organizationId === orgId && url.isActive)
        .map(url => ({
          id: url.id,
          url: url.url,
          shortUrl: url.shortUrl,
          createdAt: url.createdAt,
          expiresAt: url.expiresAt,
          accessCount: url.accessCount,
          customizations: url.customizations
        }))

      res.json({ urls })
    } catch (error) {
      this.handleError(res, error, 'Failed to get shareable URLs')
    }
  }

  /**
   * Get shared trust profile
   */
  private async getSharedProfile(req: Request, res: Response): Promise<void> {
    try {
      const { shareId } = req.params
      const shareableUrl = this.shareableUrls.get(shareId)

      if (!shareableUrl || !shareableUrl.isActive) {
        res.status(404).json({ error: 'Share link not found or expired' })
        return
      }

      // Check expiration
      if (shareableUrl.expiresAt && shareableUrl.expiresAt < new Date()) {
        shareableUrl.isActive = false
        res.status(410).json({ error: 'Share link has expired' })
        return
      }

      // Log access
      shareableUrl.accessCount++
      shareableUrl.accessLog.push({
        timestamp: new Date(),
        ip: req.ip || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        referrer: req.get('Referer')
      })

      // Get organization data
      const orgId = shareableUrl.organizationId
      const profile = this.trustCalculator.getProfile(orgId)
      const breakdown = await this.trustCalculator.calculateTrustScore(orgId)

      if (!profile) {
        res.status(404).json({ error: 'Organization profile not found' })
        return
      }

      // Build shared profile response
      const sharedProfile = {
        organizationId: orgId,
        displayName: shareableUrl.customizations.title || profile.organizationName,
        description: shareableUrl.customizations.description,
        logoUrl: shareableUrl.customizations.logoUrl,
        trustScore: breakdown.total,
        tier: breakdown.tier,
        lastUpdated: profile.lastUpdated,
        customizations: shareableUrl.customizations,
        breakdown: shareableUrl.customizations.hideDetails ? undefined : {
          byCategory: breakdown.byCategory,
          trend: breakdown.trend,
          recentActivities: breakdown.recentActivities.slice(0, 5) // Limit for privacy
        }
      }

      this.metricsCollector.incrementCounter('shared_profiles_viewed', {
        organization: orgId,
        shareId
      })

      res.json(sharedProfile)
    } catch (error) {
      this.handleError(res, error, 'Failed to get shared profile')
    }
  }

  /**
   * Generate trust badge SVG
   */
  private async getTrustBadgeSvg(req: Request, res: Response): Promise<void> {
    try {
      const { orgId } = req.params
      const { 
        style = 'minimal',
        theme = 'light',
        showScore = 'true',
        showTier = 'true'
      } = req.query

      const profile = this.trustCalculator.getProfile(orgId)
      const score = this.trustCalculator.getCurrentScore(orgId)
      const breakdown = await this.trustCalculator.calculateTrustScore(orgId)

      if (!profile || !profile.publicProfile) {
        res.status(404).json({ error: 'Public profile not found' })
        return
      }

      const svg = this.generateTrustBadgeSvg({
        score,
        tier: breakdown.tier,
        style: style as string,
        theme: theme as string,
        showScore: showScore === 'true',
        showTier: showTier === 'true'
      })

      this.metricsCollector.incrementCounter('trust_badges_generated', {
        organization: orgId,
        style: style as string
      })

      res.setHeader('Content-Type', 'image/svg+xml')
      res.setHeader('Cache-Control', 'public, max-age=300') // 5 minutes
      res.send(svg)
    } catch (error) {
      this.handleError(res, error, 'Failed to generate trust badge')
    }
  }

  /**
   * Get industry benchmarks
   */
  private async getIndustryBenchmarks(req: Request, res: Response): Promise<void> {
    try {
      const { industry } = req.params
      const benchmarks = this.trustCalculator.getIndustryBenchmarks(industry)
      
      this.metricsCollector.incrementCounter('benchmark_requests', {
        industry
      })

      res.json(benchmarks)
    } catch (error) {
      this.handleError(res, error, 'Failed to get industry benchmarks')
    }
  }

  /**
   * Calculate Trust ROI
   */
  private async getTrustROI(req: Request, res: Response): Promise<void> {
    try {
      const { orgId } = req.params
      const roi = this.trustCalculator.calculateTrustROI(orgId)
      
      this.metricsCollector.incrementCounter('trust_roi_calculations', {
        organization: orgId
      })

      res.json({
        organizationId: orgId,
        roi,
        calculatedAt: new Date().toISOString()
      })
    } catch (error) {
      this.handleError(res, error, 'Failed to calculate Trust ROI')
    }
  }

  /**
   * Get available tiers
   */
  private async getTiers(req: Request, res: Response): Promise<void> {
    try {
      const tiers = this.trustCalculator.getAllTiers()
      res.json({ tiers })
    } catch (error) {
      this.handleError(res, error, 'Failed to get tiers')
    }
  }

  /**
   * Get activity types and point values
   */
  private async getActivityTypes(req: Request, res: Response): Promise<void> {
    try {
      const activityTypes = this.trustCalculator.getActivityTypes()
      const pointValues = activityTypes.map(type => ({
        type,
        basePoints: this.trustCalculator.getPointValue(type, 'general')
      }))

      res.json({ activityTypes: pointValues })
    } catch (error) {
      this.handleError(res, error, 'Failed to get activity types')
    }
  }

  /**
   * Helper methods
   */
  private async updatePublicProfile(profile: OrganizationTrustProfile): Promise<void> {
    const breakdown = await this.trustCalculator.calculateTrustScore(profile.organizationId)
    
    const publicProfile: PublicTrustProfile = {
      organizationId: profile.organizationId,
      displayName: profile.customizations.displayName || profile.organizationName,
      industry: profile.industry,
      trustScore: breakdown.total,
      tier: breakdown.tier.level,
      badgeUrl: breakdown.tier.badgeUrl,
      lastUpdated: profile.lastUpdated,
      achievements: [], // Would be populated from activity history
      verifications: [], // Would be populated from validated activities
      publicMetrics: {
        totalActivities: profile.totalActivities,
        frameworksCovered: Object.keys(breakdown.byCategory).length,
        consecutiveDays: 0, // Would be calculated
        peerValidations: 0 // Would be calculated
      },
      customizations: profile.customizations
    }

    this.publicProfiles.set(profile.organizationId, publicProfile)
  }

  private generateTrustBadgeSvg(config: {
    score: number
    tier: any
    style: string
    theme: string
    showScore: boolean
    showTier: boolean
  }): string {
    const { score, tier, style, theme, showScore, showTier } = config
    
    // Simplified SVG badge generation
    const width = style === 'minimal' ? 120 : 200
    const height = 40
    
    const backgroundColor = theme === 'dark' ? '#2d3748' : '#ffffff'
    const textColor = theme === 'dark' ? '#ffffff' : '#2d3748'
    const tierColor = tier.color

    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" rx="6" fill="${backgroundColor}" stroke="${tierColor}" stroke-width="2"/>
        <text x="10" y="15" fill="${textColor}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">
          Trust Score
        </text>
        ${showScore ? `<text x="10" y="30" fill="${tierColor}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${score}</text>` : ''}
        ${showTier ? `<text x="${width - 10}" y="25" fill="${tierColor}" font-family="Arial, sans-serif" font-size="12" text-anchor="end">${tier.level}</text>` : ''}
      </svg>
    `.trim()
  }

  private generateShareId(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  private handleError(res: Response, error: any, message: string): void {
    this.logger.error(message, { error })
    this.metricsCollector.incrementCounter('api_errors', {
      endpoint: res.req.route?.path || 'unknown'
    })

    res.status(500).json({
      error: message,
      details: error.message
    })
  }

  /**
   * Get Express router
   */
  public getRouter(): Router {
    return this.router
  }

  /**
   * Cleanup method
   */
  public cleanup(): void {
    // Clean up expired shareable URLs
    const now = new Date()
    for (const [id, url] of this.shareableUrls.entries()) {
      if (url.expiresAt && url.expiresAt < now) {
        url.isActive = false
        this.logger.info('Shareable URL expired', { shareId: id })
      }
    }
  }
}

/**
 * Factory function to create Trust Score API service
 */
export function createTrustScoreApi(
  trustCalculator: TrustScoreCalculator,
  baseUrl?: string
): TrustScoreApiService {
  return new TrustScoreApiService(trustCalculator, baseUrl)
}

/**
 * Factory function to create Trust Score API router
 */
export function createTrustScoreRouter(): Router {
  const router = Router()
  const trustCalculator = new TrustScoreCalculator()
  const api = createTrustScoreApi(trustCalculator)

  // Organization endpoints
  router.get('/organization/:id', async (req, res) => {
    await api.getTrustScore(req, res)
  })

  router.post('/organization/:id/activities', async (req, res) => {
    await api.logTrustActivity(req, res)
  })

  router.get('/organization/:id/activities', async (req, res) => {
    await api.getActivityHistory(req, res)
  })

  router.get('/organization/:id/roi', async (req, res) => {
    await api.calculateROI(req, res)
  })

  router.get('/organization/:id/benchmarks', async (req, res) => {
    await api.getBenchmarks(req, res)
  })

  // Shareable URL endpoints
  router.post('/share', async (req, res) => {
    await api.createShareableUrl(req, res)
  })

  router.get('/share/:shareId', async (req, res) => {
    await api.getSharedProfile(req, res)
  })

  router.put('/share/:shareId', async (req, res) => {
    await api.updateShareableUrl(req, res)
  })

  router.delete('/share/:shareId', async (req, res) => {
    await api.revokeShareableUrl(req, res)
  })

  // Public profile endpoints
  router.get('/public/:orgId', async (req, res) => {
    await api.getPublicProfile(req, res)
  })

  router.get('/public/:orgId/badge', async (req, res) => {
    await api.getTrustBadge(req, res)
  })

  // Activity types endpoint
  router.get('/activity-types', async (req, res) => {
    await api.getActivityTypes(req, res)
  })

  return router
}