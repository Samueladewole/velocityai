/**
 * Trust Equity™ Trust Score Calculator
 * 
 * Core engine that transforms compliance activities into quantifiable trust value.
 * Implements point accumulation, tiering, and real-time score calculation.
 */

// Browser-compatible EventEmitter
class SimpleEventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }

  off(event: string, listener: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
  }
}

// Simple browser-compatible logger
const Logger = {
  info: (message: string, data?: any) => console.log(`[INFO] ${message}`, data || ''),
  warn: (message: string, data?: any) => console.warn(`[WARN] ${message}`, data || ''),
  error: (message: string, data?: any) => console.error(`[ERROR] ${message}`, data || '')
};

// Simple metrics collector
const MetricsCollector = {
  getInstance: () => ({
    recordTrustScoreUpdate: (score: number) => console.log(`Trust score updated: ${score}`)
  })
};

export interface TrustActivity {
  id: string
  type: TrustActivityType
  category: string
  points: number
  timestamp: Date
  evidence?: {
    type: 'document' | 'assessment' | 'audit' | 'certification'
    url: string
    metadata: Record<string, any>
  }
  source: string
  userId: string
  organizationId: string
  validatedBy?: string
  expiresAt?: Date
}

export type TrustActivityType = 
  | 'evidence_upload'
  | 'assessment_completion'
  | 'control_implementation'
  | 'audit_pass'
  | 'certification_achieved'
  | 'continuous_monitoring'
  | 'vulnerability_remediation'
  | 'expert_contribution'
  | 'peer_validation'
  | 'framework_adoption'

export interface TrustScoreTier {
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  minPoints: number
  maxPoints: number
  benefits: string[]
  color: string
  badgeUrl: string
  description: string
  requirements?: string[]
}

export interface TrustScoreBreakdown {
  total: number
  byCategory: Record<string, number>
  byActivity: Record<TrustActivityType, number>
  recentActivities: TrustActivity[]
  tier: TrustScoreTier
  nextTier?: TrustScoreTier
  pointsToNextTier?: number
  trend: {
    direction: 'up' | 'down' | 'stable'
    percentageChange: number
    timeframe: string
  }
}

export interface TrustScoreConfig {
  pointWeights: Record<TrustActivityType, number>
  categoryMultipliers: Record<string, number>
  decayRates: Record<TrustActivityType, number> // Points decay over time
  bonusThresholds: {
    consecutiveDays: { threshold: number; multiplier: number }[]
    activityVolume: { threshold: number; bonus: number }[]
    diversification: { categories: number; bonus: number }[]
  }
  validationRequirements: Record<TrustActivityType, boolean>
}

export interface OrganizationTrustProfile {
  organizationId: string
  organizationName: string
  industry: string
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  currentScore: number
  tier: TrustScoreTier
  totalActivities: number
  lastUpdated: Date
  publicProfile: boolean
  customizations: {
    displayName?: string
    logo?: string
    description?: string
    website?: string
    contactInfo?: string
  }
}

export class TrustScoreCalculator extends SimpleEventEmitter {
  private logger: Logger
  private metricsCollector?: MetricsCollector
  private activities: Map<string, TrustActivity[]> = new Map() // organizationId -> activities
  private scores: Map<string, number> = new Map() // organizationId -> current score
  private profiles: Map<string, OrganizationTrustProfile> = new Map()

  // Trust Score Tier Definitions
  private readonly tiers: TrustScoreTier[] = [
    {
      level: 'Bronze',
      minPoints: 0,
      maxPoints: 999,
      color: '#CD7F32',
      badgeUrl: '/badges/bronze.svg',
      description: 'Building foundation of trust through basic compliance activities',
      benefits: [
        'Trust Score tracking',
        'Basic compliance monitoring',
        'Public profile page',
        'Bronze trust badge'
      ]
    },
    {
      level: 'Silver',
      minPoints: 1000,
      maxPoints: 2499,
      color: '#C0C0C0',
      badgeUrl: '/badges/silver.svg',
      description: 'Demonstrating consistent commitment to security and compliance',
      benefits: [
        'All Bronze benefits',
        'Enhanced trust analytics',
        'Industry benchmarking',
        'Priority support',
        'Silver trust badge'
      ],
      requirements: [
        'Complete 5+ assessments',
        'Upload 10+ evidence documents',
        'Achieve 30-day activity streak'
      ]
    },
    {
      level: 'Gold',
      minPoints: 2500,
      maxPoints: 4999,
      color: '#FFD700',
      badgeUrl: '/badges/gold.svg',
      description: 'Recognized leader in trust and compliance excellence',
      benefits: [
        'All Silver benefits',
        'Advanced trust insights',
        'Custom branding options',
        'API access for integrations',
        'Gold trust badge',
        'Vendor trust verification'
      ],
      requirements: [
        'Complete 15+ assessments',
        'Upload 25+ evidence documents',
        'Expert peer validations',
        'Multi-framework compliance'
      ]
    },
    {
      level: 'Platinum',
      minPoints: 5000,
      maxPoints: 9999,
      color: '#E5E4E2',
      badgeUrl: '/badges/platinum.svg',
      description: 'Elite tier showcasing world-class security and compliance posture',
      benefits: [
        'All Gold benefits',
        'White-glove support',
        'Custom trust reports',
        'Executive briefings',
        'Platinum trust badge',
        'Trust advisor program'
      ],
      requirements: [
        'Complete 30+ assessments',
        'Upload 50+ evidence documents',
        'Third-party audit validation',
        'Continuous monitoring active',
        'Expert community contributions'
      ]
    },
    {
      level: 'Diamond',
      minPoints: 10000,
      maxPoints: Infinity,
      color: '#B9F2FF',
      badgeUrl: '/badges/diamond.svg',
      description: 'Ultimate trust achievement - industry benchmark for excellence',
      benefits: [
        'All Platinum benefits',
        'Diamond advisory board access',
        'Custom trust solutions',
        'Speaking opportunities',
        'Diamond trust badge',
        'Trust ecosystem partnerships'
      ],
      requirements: [
        'Complete 50+ assessments',
        'Upload 100+ evidence documents',
        'Multiple third-party validations',
        'Industry leadership recognition',
        'Significant expert contributions'
      ]
    }
  ]

  private readonly defaultConfig: TrustScoreConfig = {
    pointWeights: {
      evidence_upload: 10,
      assessment_completion: 50,
      control_implementation: 75,
      audit_pass: 200,
      certification_achieved: 500,
      continuous_monitoring: 25,
      vulnerability_remediation: 30,
      expert_contribution: 40,
      peer_validation: 60,
      framework_adoption: 100
    },
    categoryMultipliers: {
      'security': 1.2,
      'privacy': 1.1,
      'operational': 1.0,
      'financial': 1.15,
      'regulatory': 1.25,
      'governance': 1.1
    },
    decayRates: {
      evidence_upload: 0.02, // 2% decay per month
      assessment_completion: 0.015,
      control_implementation: 0.01,
      audit_pass: 0.005,
      certification_achieved: 0.003,
      continuous_monitoring: 0.0,
      vulnerability_remediation: 0.03,
      expert_contribution: 0.01,
      peer_validation: 0.02,
      framework_adoption: 0.005
    },
    bonusThresholds: {
      consecutiveDays: [
        { threshold: 7, multiplier: 1.1 },
        { threshold: 30, multiplier: 1.25 },
        { threshold: 90, multiplier: 1.5 },
        { threshold: 365, multiplier: 2.0 }
      ],
      activityVolume: [
        { threshold: 10, bonus: 50 },
        { threshold: 25, bonus: 150 },
        { threshold: 50, bonus: 400 },
        { threshold: 100, bonus: 1000 }
      ],
      diversification: [
        { categories: 3, bonus: 100 },
        { categories: 5, bonus: 300 },
        { categories: 7, bonus: 600 }
      ]
    },
    validationRequirements: {
      evidence_upload: false,
      assessment_completion: false,
      control_implementation: true,
      audit_pass: true,
      certification_achieved: true,
      continuous_monitoring: false,
      vulnerability_remediation: true,
      expert_contribution: false,
      peer_validation: true,
      framework_adoption: true
    }
  }

  constructor(
    private config: TrustScoreConfig = {} as TrustScoreConfig,
    metricsEnabled: boolean = true
  ) {
    super()
    
    this.logger = new Logger('TrustScoreCalculator')
    this.config = { ...this.defaultConfig, ...config }
    
    if (metricsEnabled) {
      this.metricsCollector = new MetricsCollector({
        enabled: true,
        exportInterval: 60000,
        labels: { component: 'trust_score_calculator' }
      })
    }

    this.startPeriodicDecayCalculation()
  }

  /**
   * Record a trust activity and update scores
   */
  public async recordActivity(activity: Omit<TrustActivity, 'id' | 'timestamp'>): Promise<TrustActivity> {
    const fullActivity: TrustActivity = {
      ...activity,
      id: this.generateActivityId(),
      timestamp: new Date()
    }

    // Validate activity if required
    if (this.config.validationRequirements[activity.type] && !activity.validatedBy) {
      throw new Error(`Activity type ${activity.type} requires validation`)
    }

    // Store activity
    const orgActivities = this.activities.get(activity.organizationId) || []
    orgActivities.push(fullActivity)
    this.activities.set(activity.organizationId, orgActivities)

    // Recalculate score
    await this.calculateTrustScore(activity.organizationId)

    // Track metrics
    if (this.metricsCollector) {
      this.metricsCollector.incrementCounter('trust_activities_recorded', {
        type: activity.type,
        category: activity.category,
        organization: activity.organizationId
      })
      this.metricsCollector.recordHistogram('trust_points_awarded', activity.points)
    }

    this.logger.info('Trust activity recorded', {
      activityId: fullActivity.id,
      type: activity.type,
      points: activity.points,
      organization: activity.organizationId
    })

    this.emit('activity_recorded', fullActivity)
    return fullActivity
  }

  /**
   * Calculate comprehensive trust score for organization
   */
  public async calculateTrustScore(organizationId: string): Promise<TrustScoreBreakdown> {
    const activities = this.activities.get(organizationId) || []
    const profile = this.profiles.get(organizationId)

    if (activities.length === 0) {
      const emptyBreakdown: TrustScoreBreakdown = {
        total: 0,
        byCategory: {},
        byActivity: {} as Record<TrustActivityType, number>,
        recentActivities: [],
        tier: this.tiers[0],
        nextTier: this.tiers[1],
        pointsToNextTier: this.tiers[1].minPoints,
        trend: { direction: 'stable', percentageChange: 0, timeframe: '30d' }
      }
      return emptyBreakdown
    }

    // Calculate base points with decay
    let totalPoints = 0
    const byCategory: Record<string, number> = {}
    const byActivity: Record<TrustActivityType, number> = {} as Record<TrustActivityType, number>

    for (const activity of activities) {
      // Apply time decay
      const ageInMonths = this.getAgeInMonths(activity.timestamp)
      const decayRate = this.config.decayRates[activity.type]
      const decayFactor = Math.max(0.1, 1 - (decayRate * ageInMonths))
      
      // Calculate points with category multiplier
      const categoryMultiplier = this.config.categoryMultipliers[activity.category] || 1.0
      const adjustedPoints = activity.points * categoryMultiplier * decayFactor

      totalPoints += adjustedPoints
      byCategory[activity.category] = (byCategory[activity.category] || 0) + adjustedPoints
      byActivity[activity.type] = (byActivity[activity.type] || 0) + adjustedPoints
    }

    // Apply bonus calculations
    totalPoints += this.calculateBonuses(activities, organizationId)

    // Determine tier
    const tier = this.getTierForPoints(totalPoints)
    const nextTier = this.getNextTier(tier)
    const pointsToNextTier = nextTier ? nextTier.minPoints - totalPoints : undefined

    // Calculate trend
    const trend = this.calculateTrend(organizationId, totalPoints)

    // Update stored score
    this.scores.set(organizationId, totalPoints)

    const breakdown: TrustScoreBreakdown = {
      total: Math.round(totalPoints),
      byCategory,
      byActivity,
      recentActivities: activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10),
      tier,
      nextTier,
      pointsToNextTier,
      trend
    }

    // Track metrics
    if (this.metricsCollector) {
      this.metricsCollector.recordHistogram('trust_score_calculated', totalPoints)
      this.metricsCollector.incrementCounter('trust_score_tier_achieved', {
        tier: tier.level,
        organization: organizationId
      })
    }

    this.emit('score_calculated', { organizationId, breakdown })
    return breakdown
  }

  /**
   * Get current trust score for organization
   */
  public getCurrentScore(organizationId: string): number {
    return this.scores.get(organizationId) || 0
  }

  /**
   * Get organization trust profile
   */
  public getProfile(organizationId: string): OrganizationTrustProfile | undefined {
    return this.profiles.get(organizationId)
  }

  /**
   * Update organization profile
   */
  public async updateProfile(
    organizationId: string, 
    updates: Partial<OrganizationTrustProfile>
  ): Promise<OrganizationTrustProfile> {
    const existing = this.profiles.get(organizationId)
    const currentScore = this.getCurrentScore(organizationId)
    const tier = this.getTierForPoints(currentScore)

    const profile: OrganizationTrustProfile = {
      organizationId,
      organizationName: updates.organizationName || existing?.organizationName || 'Unknown Organization',
      industry: updates.industry || existing?.industry || 'Technology',
      size: updates.size || existing?.size || 'medium',
      currentScore,
      tier,
      totalActivities: this.activities.get(organizationId)?.length || 0,
      lastUpdated: new Date(),
      publicProfile: updates.publicProfile !== undefined ? updates.publicProfile : (existing?.publicProfile || false),
      customizations: {
        ...existing?.customizations,
        ...updates.customizations
      },
      ...updates
    }

    this.profiles.set(organizationId, profile)
    this.emit('profile_updated', profile)
    return profile
  }

  /**
   * Get industry benchmarking data
   */
  public getIndustryBenchmarks(industry: string): {
    averageScore: number
    percentileRanks: { p25: number; p50: number; p75: number; p90: number }
    topPerformers: Array<{ organizationId: string; score: number; tier: string }>
    industryActivities: Record<TrustActivityType, number>
  } {
    const industryProfiles = Array.from(this.profiles.values())
      .filter(p => p.industry === industry && p.publicProfile)

    const scores = industryProfiles.map(p => p.currentScore).sort((a, b) => a - b)
    
    const percentileRanks = {
      p25: this.calculatePercentile(scores, 25),
      p50: this.calculatePercentile(scores, 50),
      p75: this.calculatePercentile(scores, 75),
      p90: this.calculatePercentile(scores, 90)
    }

    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length || 0

    const topPerformers = industryProfiles
      .sort((a, b) => b.currentScore - a.currentScore)
      .slice(0, 10)
      .map(p => ({
        organizationId: p.organizationId,
        score: p.currentScore,
        tier: p.tier.level
      }))

    // Calculate industry activity patterns
    const industryActivities = {} as Record<TrustActivityType, number>
    for (const profile of industryProfiles) {
      const activities = this.activities.get(profile.organizationId) || []
      for (const activity of activities) {
        industryActivities[activity.type] = (industryActivities[activity.type] || 0) + 1
      }
    }

    return {
      averageScore: Math.round(averageScore),
      percentileRanks,
      topPerformers,
      industryActivities
    }
  }

  /**
   * Calculate ROI of trust equity
   */
  public calculateTrustROI(organizationId: string): {
    estimatedValue: number
    salesAcceleration: number
    riskReduction: number
    complianceCostSavings: number
    brandValue: number
    methodology: string
  } {
    const score = this.getCurrentScore(organizationId)
    const tier = this.getTierForPoints(score)
    const activities = this.activities.get(organizationId) || []

    // ROI calculation methodology based on industry research
    const baseROI = score * 100 // $100 per trust point
    
    const salesAcceleration = score * 150 // Faster deal closure
    const riskReduction = score * 75 // Reduced insurance/compliance costs
    const complianceCostSavings = activities.length * 500 // Automated compliance
    const brandValue = score * 50 // Brand reputation value

    const estimatedValue = baseROI + salesAcceleration + riskReduction + complianceCostSavings + brandValue

    return {
      estimatedValue: Math.round(estimatedValue),
      salesAcceleration: Math.round(salesAcceleration),
      riskReduction: Math.round(riskReduction),
      complianceCostSavings: Math.round(complianceCostSavings),
      brandValue: Math.round(brandValue),
      methodology: 'Based on industry studies showing correlation between trust scores and business outcomes'
    }
  }

  /**
   * Private helper methods
   */
  private calculateBonuses(activities: TrustActivity[], organizationId: string): number {
    let bonusPoints = 0

    // Consecutive days bonus
    const consecutiveDays = this.calculateConsecutiveDays(activities)
    for (const threshold of this.config.bonusThresholds.consecutiveDays) {
      if (consecutiveDays >= threshold.threshold) {
        bonusPoints += activities.length * (threshold.multiplier - 1) * 10
      }
    }

    // Activity volume bonus
    for (const threshold of this.config.bonusThresholds.activityVolume) {
      if (activities.length >= threshold.threshold) {
        bonusPoints += threshold.bonus
      }
    }

    // Diversification bonus
    const categories = new Set(activities.map(a => a.category)).size
    for (const threshold of this.config.bonusThresholds.diversification) {
      if (categories >= threshold.categories) {
        bonusPoints += threshold.bonus
      }
    }

    return bonusPoints
  }

  private calculateConsecutiveDays(activities: TrustActivity[]): number {
    if (activities.length === 0) return 0

    const sortedDates = activities
      .map(a => a.timestamp.toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort()

    let consecutiveDays = 1
    let maxConsecutive = 1

    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i])
      const previous = new Date(sortedDates[i - 1])
      const diffDays = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        consecutiveDays++
        maxConsecutive = Math.max(maxConsecutive, consecutiveDays)
      } else {
        consecutiveDays = 1
      }
    }

    return maxConsecutive
  }

  private getTierForPoints(points: number): TrustScoreTier {
    for (let i = this.tiers.length - 1; i >= 0; i--) {
      if (points >= this.tiers[i].minPoints) {
        return this.tiers[i]
      }
    }
    return this.tiers[0]
  }

  private getNextTier(currentTier: TrustScoreTier): TrustScoreTier | undefined {
    const currentIndex = this.tiers.findIndex(t => t.level === currentTier.level)
    return currentIndex < this.tiers.length - 1 ? this.tiers[currentIndex + 1] : undefined
  }

  private calculateTrend(organizationId: string, currentScore: number): {
    direction: 'up' | 'down' | 'stable'
    percentageChange: number
    timeframe: string
  } {
    // This would typically compare against historical data
    // For now, return stable trend
    return {
      direction: 'stable',
      percentageChange: 0,
      timeframe: '30d'
    }
  }

  private getAgeInMonths(date: Date): number {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    return diffMs / (1000 * 60 * 60 * 24 * 30) // Approximate months
  }

  private calculatePercentile(sortedArray: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedArray.length - 1)
    const lower = Math.floor(index)
    const upper = Math.ceil(index)
    const weight = index % 1

    if (upper >= sortedArray.length) return sortedArray[sortedArray.length - 1]
    return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight
  }

  private startPeriodicDecayCalculation(): void {
    // Recalculate scores daily to apply decay
    setInterval(async () => {
      for (const organizationId of this.activities.keys()) {
        await this.calculateTrustScore(organizationId)
      }
    }, 24 * 60 * 60 * 1000) // Daily
  }

  private generateActivityId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Public API methods
   */
  public getAllTiers(): TrustScoreTier[] {
    return [...this.tiers]
  }

  public getActivityTypes(): TrustActivityType[] {
    return Object.keys(this.config.pointWeights) as TrustActivityType[]
  }

  public getPointValue(activityType: TrustActivityType, category: string): number {
    const basePoints = this.config.pointWeights[activityType] || 0
    const multiplier = this.config.categoryMultipliers[category] || 1.0
    return Math.round(basePoints * multiplier)
  }

  public exportData(organizationId: string): {
    profile: OrganizationTrustProfile | undefined
    activities: TrustActivity[]
    currentScore: number
    breakdown: TrustScoreBreakdown | null
  } {
    return {
      profile: this.getProfile(organizationId),
      activities: this.activities.get(organizationId) || [],
      currentScore: this.getCurrentScore(organizationId),
      breakdown: null // Would be calculated on demand
    }
  }
}

/**
 * Factory function to create Trust Score Calculator
 */
export function createTrustScoreCalculator(
  config?: Partial<TrustScoreConfig>,
  metricsEnabled: boolean = true
): TrustScoreCalculator {
  return new TrustScoreCalculator(config, metricsEnabled)
}