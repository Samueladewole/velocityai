/**
 * ERIP Trust Equity Engine
 * 
 * Core calculation engine for Trust Points and Trust Scores using advanced algorithms
 * Implements the compound interest model for trust accumulation
 */

import { 
  TrustEquityTransaction, 
  TrustScore, 
  ERIPComponent, 
  TrustCategory,
  EntityType,
  TrustTier,
  Organization
} from '../data/models'
import { Logger } from '../logging/logger'
import { ERIPEventBus } from '../events/eventBus'
import { DatabaseService } from '../database/service'

export interface TrustCalculationParams {
  basePoints: number
  multiplier: number
  compoundingRate: number
  timeDecayFactor: number
  categoryWeight: number
  componentWeight: number
  evidenceBonus: number
  automationBonus: number
  freshnessPenalty: number
}

export interface TrustScoreBreakdown {
  compliance: number
  security: number
  riskManagement: number
  automation: number
  intelligence: number
  total: number
  tier: TrustTier
}

export interface TrustEquityMetrics {
  totalBalance: number
  totalEarned: number
  totalSpent: number
  averageMultiplier: number
  compoundingEffect: number
  categoryDistribution: Record<TrustCategory, number>
  sourceDistribution: Record<ERIPComponent, number>
  timeDistribution: Array<{ period: string; earned: number }>
}

// Trust calculation constants based on ERIP architecture
const TRUST_CALCULATION_CONSTANTS = {
  // Base point values per category
  BASE_POINTS: {
    compliance: 10,
    security: 15,
    risk_management: 20,
    automation: 25,
    intelligence: 30
  } as const,

  // Component multipliers (reflects component importance)
  COMPONENT_MULTIPLIERS: {
    compass: 1.0,    // Base regulatory intelligence
    atlas: 1.2,     // Security validation multiplier
    prism: 1.5,     // Risk quantification premium
    pulse: 1.1,     // Continuous monitoring bonus
    cipher: 1.3,    // Automation value multiplier
    nexus: 1.4,     // Intelligence premium
    beacon: 1.0,    // Value tracking (neutral)
    clearance: 1.2  // Decision speed bonus
  } as const,

  // Category weights for overall score calculation
  CATEGORY_WEIGHTS: {
    compliance: 0.25,      // 25% - Foundation requirement
    security: 0.30,       // 30% - Highest weight for security
    risk_management: 0.20, // 20% - Risk-based approach
    automation: 0.15,     // 15% - Efficiency multiplier
    intelligence: 0.10    // 10% - Advanced capabilities
  } as const,

  // Tier thresholds (compound scoring)
  TIER_THRESHOLDS: {
    bronze: 0,     // Starting tier
    silver: 200,   // Basic compliance achieved
    gold: 600,     // Advanced security posture
    platinum: 950  // Market leadership
  } as const,

  // Time-based decay factors
  TIME_DECAY: {
    freshness_threshold: 90,    // days - points start decaying after this
    max_age: 365,              // days - maximum age before significant penalty
    decay_rate: 0.02,          // 2% decay per month after freshness threshold
    freshness_bonus: 1.1       // 10% bonus for recent activities
  } as const,

  // Evidence and automation bonuses
  BONUSES: {
    evidence_attached: 1.2,     // 20% bonus for evidence
    automated_control: 1.3,     // 30% bonus for automation
    expert_validated: 1.25,     // 25% bonus for expert validation
    framework_mapped: 1.15,     // 15% bonus for framework compliance
    cross_component: 1.4        // 40% bonus for activities spanning multiple components
  } as const,

  // Compounding effects
  COMPOUNDING: {
    velocity_threshold: 100,    // Transactions per month for velocity bonus
    velocity_bonus: 1.25,      // 25% bonus for high activity
    consistency_threshold: 30,  // Days of consistent activity
    consistency_bonus: 1.15,   // 15% bonus for consistency
    compound_interest_rate: 0.05 // 5% monthly compound interest on sustained activity
  } as const
}

export class TrustEquityEngine {
  private static instance: TrustEquityEngine
  private logger: Logger
  private eventBus: ERIPEventBus
  private database: DatabaseService
  
  // In-memory caches for performance
  private scoreCache = new Map<string, { score: TrustScore; timestamp: number }>()
  private transactionCache = new Map<string, TrustEquityTransaction[]>()
  private metricsCache = new Map<string, { metrics: TrustEquityMetrics; timestamp: number }>()
  
  // Cache TTL (5 minutes)
  private readonly CACHE_TTL = 5 * 60 * 1000

  private constructor() {
    this.logger = new Logger('TrustEquityEngine')
    this.eventBus = ERIPEventBus.getInstance()
    this.database = DatabaseService.getInstance()
    
    this.setupEventHandlers()
    this.startBackgroundProcesses()
  }

  static getInstance(): TrustEquityEngine {
    if (!this.instance) {
      this.instance = new TrustEquityEngine()
    }
    return this.instance
  }

  /**
   * Process a points earning event and update Trust Equity
   */
  async processPointsEvent(eventData: {
    entityId: string
    entityType: EntityType
    points: number
    source: ERIPComponent
    category: TrustCategory
    description: string
    evidence?: string[]
    multiplier?: number
  }): Promise<TrustEquityTransaction> {
    
    const startTime = performance.now()
    
    try {
      // Calculate final points with all bonuses and multipliers
      const calculatedPoints = await this.calculateFinalPoints(eventData)
      
      // Get current balance
      const currentBalance = await this.getCurrentBalance(eventData.entityId, eventData.entityType)
      
      // Create transaction record
      const transaction: TrustEquityTransaction = {
        id: this.generateTransactionId(),
        entityId: eventData.entityId,
        entityType: eventData.entityType,
        type: 'earned',
        amount: calculatedPoints,
        balance_after: currentBalance + calculatedPoints,
        source: eventData.source,
        sourceId: this.generateSourceId(),
        category: eventData.category,
        description: eventData.description,
        evidence: eventData.evidence || [],
        multiplier: eventData.multiplier || 1.0,
        timestamp: new Date(),
        expiresAt: this.calculateExpiryDate(calculatedPoints, eventData.category),
        reversedAt: null,
        reversalReason: null
      }

      // Store transaction
      await this.storeTransaction(transaction)
      
      // Update cached score
      this.invalidateScoreCache(eventData.entityId, eventData.entityType)
      
      // Trigger score recalculation
      const updatedScore = await this.calculateTrustScore(eventData.entityId, eventData.entityType)
      
      // Emit trust score update event
      await this.eventBus.publish({
        eventId: this.generateEventId(),
        source: 'trust_engine',
        type: 'trust.score.updated',
        timestamp: new Date().toISOString(),
        data: {
          entityId: eventData.entityId,
          entityType: eventData.entityType,
          previousScore: currentBalance,
          newScore: updatedScore.totalScore,
          change: calculatedPoints,
          tier: updatedScore.tier,
          tierChange: await this.checkTierChange(eventData.entityId, eventData.entityType, updatedScore.tier),
          breakdown: {
            compliance: updatedScore.complianceScore,
            security: updatedScore.securityScore,
            risk_management: updatedScore.riskManagementScore,
            automation: updatedScore.automationScore,
            intelligence: updatedScore.intelligenceScore
          }
        }
      })

      const endTime = performance.now()
      this.logger.info('Trust points processed', {
        entityId: eventData.entityId,
        entityType: eventData.entityType,
        pointsEarned: calculatedPoints,
        newBalance: transaction.balance_after,
        processingTime: endTime - startTime
      })

      return transaction

    } catch (error) {
      this.logger.error('Failed to process trust points event', { eventData, error })
      throw error
    }
  }

  /**
   * Calculate final points with all applicable bonuses and multipliers
   */
  private async calculateFinalPoints(eventData: {
    entityId: string
    entityType: EntityType
    points: number
    source: ERIPComponent
    category: TrustCategory
    evidence?: string[]
    multiplier?: number
  }): Promise<number> {

    let finalPoints = eventData.points
    
    // Apply base category multiplier
    const baseMultiplier = TRUST_CALCULATION_CONSTANTS.BASE_POINTS[eventData.category] / 10
    finalPoints *= baseMultiplier

    // Apply component multiplier
    const componentMultiplier = TRUST_CALCULATION_CONSTANTS.COMPONENT_MULTIPLIERS[eventData.source]
    finalPoints *= componentMultiplier

    // Apply custom multiplier if provided
    if (eventData.multiplier) {
      finalPoints *= eventData.multiplier
    }

    // Apply evidence bonus
    if (eventData.evidence && eventData.evidence.length > 0) {
      finalPoints *= TRUST_CALCULATION_CONSTANTS.BONUSES.evidence_attached
    }

    // Apply freshness bonus (for recent activities)
    finalPoints *= TRUST_CALCULATION_CONSTANTS.BONUSES.freshness_bonus

    // Apply velocity bonus (if entity has high activity)
    const velocityBonus = await this.calculateVelocityBonus(eventData.entityId, eventData.entityType)
    finalPoints *= velocityBonus

    // Apply consistency bonus
    const consistencyBonus = await this.calculateConsistencyBonus(eventData.entityId, eventData.entityType)
    finalPoints *= consistencyBonus

    // Apply compound interest (for sustained activity)
    const compoundBonus = await this.calculateCompoundBonus(eventData.entityId, eventData.entityType, eventData.category)
    finalPoints *= compoundBonus

    // Round to integer
    return Math.round(finalPoints)
  }

  /**
   * Calculate comprehensive Trust Score with advanced algorithms
   */
  async calculateTrustScore(entityId: string, entityType: EntityType): Promise<TrustScore> {
    
    // Check cache first
    const cacheKey = `€{entityId}-€{entityType}`
    const cached = this.scoreCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.score
    }

    try {
      // Get all transactions for the entity (last 12 months for active scoring)
      const transactions = await this.getTransactionsForEntity(
        entityId, 
        entityType, 
        new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // 12 months ago
      )

      // Calculate category scores with time decay
      const categoryScores = this.calculateCategoryScores(transactions)
      
      // Apply category weights and calculate total
      const weightedTotal = Object.entries(categoryScores).reduce((total, [category, score]) => {
        const weight = TRUST_CALCULATION_CONSTANTS.CATEGORY_WEIGHTS[category as TrustCategory]
        return total + (score * weight)
      }, 0)

      // Determine tier based on weighted total
      const tier = this.calculateTier(weightedTotal)

      // Get previous score for trend calculation
      const previousScore = await this.getPreviousScore(entityId, entityType)

      const trustScore: TrustScore = {
        entityId,
        entityType,
        totalScore: Math.round(weightedTotal),
        tier,
        complianceScore: Math.round(categoryScores.compliance || 0),
        securityScore: Math.round(categoryScores.security || 0),
        riskManagementScore: Math.round(categoryScores.risk_management || 0),
        automationScore: Math.round(categoryScores.automation || 0),
        intelligenceScore: Math.round(categoryScores.intelligence || 0),
        previousScore: previousScore?.totalScore || 0,
        change: Math.round(weightedTotal) - (previousScore?.totalScore || 0),
        trend: this.calculateTrend(weightedTotal, previousScore?.totalScore || 0),
        lastCalculated: new Date(),
        calculationVersion: '2.0',
        industryPercentile: await this.calculateIndustryPercentile(entityId, entityType, weightedTotal),
        sizePercentile: await this.calculateSizePercentile(entityId, entityType, weightedTotal)
      }

      // Update cache
      this.scoreCache.set(cacheKey, { score: trustScore, timestamp: Date.now() })

      // Store in database
      await this.storeTrustScore(trustScore)

      return trustScore

    } catch (error) {
      this.logger.error('Failed to calculate trust score', { entityId, entityType, error })
      throw error
    }
  }

  /**
   * Calculate category scores with time decay and compounding effects
   */
  private calculateCategoryScores(transactions: TrustEquityTransaction[]): Record<string, number> {
    const scores: Record<string, number> = {
      compliance: 0,
      security: 0,
      risk_management: 0,
      automation: 0,
      intelligence: 0
    }

    const now = Date.now()
    
    // Group transactions by category
    const transactionsByCategory = transactions.reduce((groups, tx) => {
      if (!groups[tx.category]) {
        groups[tx.category] = []
      }
      groups[tx.category].push(tx)
      return groups
    }, {} as Record<TrustCategory, TrustEquityTransaction[]>)

    // Calculate score for each category
    Object.entries(transactionsByCategory).forEach(([category, categoryTransactions]) => {
      let categoryScore = 0

      categoryTransactions.forEach(tx => {
        if (tx.type === 'earned' || tx.type === 'adjusted') {
          let points = tx.amount
          
          // Apply time decay
          const ageInDays = (now - tx.timestamp.getTime()) / (1000 * 60 * 60 * 24)
          const timeDecayFactor = this.calculateTimeDecay(ageInDays)
          points *= timeDecayFactor

          // Apply multiplier from transaction
          points *= tx.multiplier

          categoryScore += points
        } else if (tx.type === 'spent') {
          categoryScore -= tx.amount
        }
      })

      // Apply compounding for categories with consistent activity
      const compoundingFactor = this.calculateCompoundingFactor(categoryTransactions)
      categoryScore *= compoundingFactor

      scores[category] = Math.max(0, categoryScore) // Prevent negative scores
    })

    return scores
  }

  /**
   * Calculate time decay factor based on transaction age
   */
  private calculateTimeDecay(ageInDays: number): number {
    const { freshness_threshold, max_age, decay_rate } = TRUST_CALCULATION_CONSTANTS.TIME_DECAY

    if (ageInDays <= freshness_threshold) {
      return 1.0 // No decay within freshness threshold
    }

    if (ageInDays >= max_age) {
      return 0.5 // Minimum 50% value for very old transactions
    }

    // Linear decay between thresholds
    const decayPeriod = ageInDays - freshness_threshold
    const decayMonths = decayPeriod / 30
    return Math.max(0.5, 1.0 - (decayMonths * decay_rate))
  }

  /**
   * Calculate compounding factor for sustained activity
   */
  private calculateCompoundingFactor(transactions: TrustEquityTransaction[]): number {
    if (transactions.length < 3) return 1.0 // Need minimum activity for compounding

    // Sort by timestamp
    const sortedTx = transactions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    
    // Calculate consistency (regular activity over time)
    const timeSpan = sortedTx[sortedTx.length - 1].timestamp.getTime() - sortedTx[0].timestamp.getTime()
    const timeSpanDays = timeSpan / (1000 * 60 * 60 * 24)
    const averageInterval = timeSpanDays / transactions.length

    // Reward consistent activity (transactions every 30 days or less)
    if (averageInterval <= 30 && transactions.length >= 5) {
      return TRUST_CALCULATION_CONSTANTS.COMPOUNDING.consistency_bonus
    }

    return 1.0
  }

  /**
   * Calculate velocity bonus based on recent transaction frequency
   */
  private async calculateVelocityBonus(entityId: string, entityType: EntityType): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentTransactions = await this.getTransactionsForEntity(entityId, entityType, thirtyDaysAgo)
    
    if (recentTransactions.length >= TRUST_CALCULATION_CONSTANTS.COMPOUNDING.velocity_threshold) {
      return TRUST_CALCULATION_CONSTANTS.COMPOUNDING.velocity_bonus
    }
    
    return 1.0
  }

  /**
   * Calculate consistency bonus for regular activity
   */
  private async calculateConsistencyBonus(entityId: string, entityType: EntityType): Promise<number> {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    const recentTransactions = await this.getTransactionsForEntity(entityId, entityType, ninetyDaysAgo)
    
    if (recentTransactions.length === 0) return 1.0

    // Check for activity in each of the last 3 months
    const now = Date.now()
    const months = [0, 1, 2].map(monthsBack => {
      const monthStart = new Date(now - (monthsBack + 1) * 30 * 24 * 60 * 60 * 1000)
      const monthEnd = new Date(now - monthsBack * 30 * 24 * 60 * 60 * 1000)
      
      return recentTransactions.some(tx => 
        tx.timestamp >= monthStart && tx.timestamp <= monthEnd
      )
    })

    const consistentMonths = months.filter(Boolean).length
    if (consistentMonths >= 3) {
      return TRUST_CALCULATION_CONSTANTS.COMPOUNDING.consistency_bonus
    }

    return 1.0
  }

  /**
   * Calculate compound bonus for category-specific sustained excellence
   */
  private async calculateCompoundBonus(
    entityId: string, 
    entityType: EntityType, 
    category: TrustCategory
  ): Promise<number> {
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    const transactions = await this.getTransactionsForEntity(entityId, entityType, sixMonthsAgo)
    
    const categoryTransactions = transactions.filter(tx => tx.category === category)
    
    if (categoryTransactions.length >= 10) { // Sustained activity threshold
      const monthlyCompound = 1 + TRUST_CALCULATION_CONSTANTS.COMPOUNDING.compound_interest_rate
      const months = Math.min(6, categoryTransactions.length / 2) // Conservative estimate
      return Math.pow(monthlyCompound, months)
    }
    
    return 1.0
  }

  /**
   * Determine trust tier based on total score
   */
  private calculateTier(totalScore: number): TrustTier {
    const thresholds = TRUST_CALCULATION_CONSTANTS.TIER_THRESHOLDS
    
    if (totalScore >= thresholds.platinum) return 'platinum'
    if (totalScore >= thresholds.gold) return 'gold'
    if (totalScore >= thresholds.silver) return 'silver'
    return 'bronze'
  }

  /**
   * Calculate trend direction
   */
  private calculateTrend(currentScore: number, previousScore: number): 'up' | 'down' | 'stable' {
    const change = currentScore - previousScore
    const changeThreshold = Math.max(10, previousScore * 0.05) // 5% or 10 points minimum
    
    if (Math.abs(change) < changeThreshold) return 'stable'
    return change > 0 ? 'up' : 'down'
  }

  /**
   * Calculate industry percentile ranking
   */
  private async calculateIndustryPercentile(
    entityId: string, 
    entityType: EntityType, 
    score: number
  ): Promise<number | undefined> {
    
    if (entityType !== 'organization') return undefined

    try {
      const organization = await this.database.findOrganization(entityId)
      if (!organization) return undefined

      // Get all organizations in the same industry
      const industryOrgs = await this.database.getOrganizationsByIndustry(organization.industry)
      const industryScores = await Promise.all(
        industryOrgs.map(org => this.getTrustScore(org.id, 'organization'))
      )

      const validScores = industryScores
        .filter(s => s !== null)
        .map(s => s!.totalScore)
        .sort((a, b) => a - b)

      if (validScores.length === 0) return undefined

      const rank = validScores.filter(s => s < score).length
      return Math.round((rank / validScores.length) * 100)

    } catch (error) {
      this.logger.error('Failed to calculate industry percentile', { entityId, error })
      return undefined
    }
  }

  /**
   * Calculate size percentile ranking
   */
  private async calculateSizePercentile(
    entityId: string, 
    entityType: EntityType, 
    score: number
  ): Promise<number | undefined> {
    
    if (entityType !== 'organization') return undefined

    try {
      const organization = await this.database.findOrganization(entityId)
      if (!organization) return undefined

      // Get all organizations of the same size
      const sizeOrgs = await this.database.getOrganizationsBySize(organization.size)
      const sizeScores = await Promise.all(
        sizeOrgs.map(org => this.getTrustScore(org.id, 'organization'))
      )

      const validScores = sizeScores
        .filter(s => s !== null)
        .map(s => s!.totalScore)
        .sort((a, b) => a - b)

      if (validScores.length === 0) return undefined

      const rank = validScores.filter(s => s < score).length
      return Math.round((rank / validScores.length) * 100)

    } catch (error) {
      this.logger.error('Failed to calculate size percentile', { entityId, error })
      return undefined
    }
  }

  /**
   * Get Trust Equity metrics for analytics
   */
  async getTrustEquityMetrics(
    entityId: string, 
    entityType: EntityType,
    timeframe?: { start: Date; end: Date }
  ): Promise<TrustEquityMetrics> {
    
    const cacheKey = `metrics-€{entityId}-€{entityType}-€{timeframe?.start}-€{timeframe?.end}`
    const cached = this.metricsCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.metrics
    }

    try {
      const transactions = await this.getTransactionsForEntity(
        entityId, 
        entityType, 
        timeframe?.start,
        timeframe?.end
      )

      const metrics: TrustEquityMetrics = {
        totalBalance: await this.getCurrentBalance(entityId, entityType),
        totalEarned: transactions.filter(tx => tx.type === 'earned').reduce((sum, tx) => sum + tx.amount, 0),
        totalSpent: transactions.filter(tx => tx.type === 'spent').reduce((sum, tx) => sum + tx.amount, 0),
        averageMultiplier: transactions.length > 0 
          ? transactions.reduce((sum, tx) => sum + tx.multiplier, 0) / transactions.length 
          : 1.0,
        compoundingEffect: this.calculateCompoundingEffect(transactions),
        categoryDistribution: this.calculateCategoryDistribution(transactions),
        sourceDistribution: this.calculateSourceDistribution(transactions),
        timeDistribution: this.calculateTimeDistribution(transactions)
      }

      // Cache the results
      this.metricsCache.set(cacheKey, { metrics, timestamp: Date.now() })

      return metrics

    } catch (error) {
      this.logger.error('Failed to calculate trust equity metrics', { entityId, entityType, error })
      throw error
    }
  }

  /**
   * Private helper methods
   */
  private async getCurrentBalance(entityId: string, entityType: EntityType): Promise<number> {
    const transactions = await this.getTransactionsForEntity(entityId, entityType)
    return transactions.reduce((balance, tx) => {
      switch (tx.type) {
        case 'earned':
        case 'adjusted':
          return balance + tx.amount
        case 'spent':
        case 'expired':
          return balance - tx.amount
        default:
          return balance
      }
    }, 0)
  }

  private async getTransactionsForEntity(
    entityId: string, 
    entityType: EntityType, 
    startDate?: Date,
    endDate?: Date
  ): Promise<TrustEquityTransaction[]> {
    const cacheKey = `tx-€{entityId}-€{entityType}-€{startDate}-€{endDate}`
    const cached = this.transactionCache.get(cacheKey)
    if (cached) return cached

    const transactions = await this.database.getTrustEquityTransactions({
      entityId,
      entityType,
      startDate,
      endDate
    })

    this.transactionCache.set(cacheKey, transactions)
    return transactions
  }

  private calculateExpiryDate(points: number, category: TrustCategory): Date | null {
    // High-value or security-related points don't expire
    if (points >= 100 || category === 'security' || category === 'risk_management') {
      return null
    }
    
    // Other points expire after 2 years
    return new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000)
  }

  private calculateCompoundingEffect(transactions: TrustEquityTransaction[]): number {
    if (transactions.length < 2) return 1.0
    
    const sortedTx = transactions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    const totalEarned = sortedTx.reduce((sum, tx) => 
      tx.type === 'earned' ? sum + tx.amount : sum, 0
    )
    const baseEarned = sortedTx.reduce((sum, tx) => 
      tx.type === 'earned' ? sum + (tx.amount / tx.multiplier) : sum, 0
    )
    
    return baseEarned > 0 ? totalEarned / baseEarned : 1.0
  }

  private calculateCategoryDistribution(transactions: TrustEquityTransaction[]): Record<TrustCategory, number> {
    const distribution = {
      compliance: 0,
      security: 0,
      risk_management: 0,
      automation: 0,
      intelligence: 0
    } as Record<TrustCategory, number>

    const earnedTx = transactions.filter(tx => tx.type === 'earned')
    const totalEarned = earnedTx.reduce((sum, tx) => sum + tx.amount, 0)

    if (totalEarned === 0) return distribution

    earnedTx.forEach(tx => {
      distribution[tx.category] += tx.amount
    })

    // Convert to percentages
    Object.keys(distribution).forEach(category => {
      distribution[category as TrustCategory] = 
        (distribution[category as TrustCategory] / totalEarned) * 100
    })

    return distribution
  }

  private calculateSourceDistribution(transactions: TrustEquityTransaction[]): Record<ERIPComponent, number> {
    const distribution = {
      compass: 0,
      atlas: 0,
      prism: 0,
      pulse: 0,
      cipher: 0,
      nexus: 0,
      beacon: 0,
      clearance: 0
    } as Record<ERIPComponent, number>

    const earnedTx = transactions.filter(tx => tx.type === 'earned')
    const totalEarned = earnedTx.reduce((sum, tx) => sum + tx.amount, 0)

    if (totalEarned === 0) return distribution

    earnedTx.forEach(tx => {
      distribution[tx.source] += tx.amount
    })

    // Convert to percentages
    Object.keys(distribution).forEach(source => {
      distribution[source as ERIPComponent] = 
        (distribution[source as ERIPComponent] / totalEarned) * 100
    })

    return distribution
  }

  private calculateTimeDistribution(transactions: TrustEquityTransaction[]): Array<{ period: string; earned: number }> {
    const now = new Date()
    const periods = []

    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const periodTransactions = transactions.filter(tx => 
        tx.type === 'earned' && 
        tx.timestamp >= periodStart && 
        tx.timestamp <= periodEnd
      )
      
      const earned = periodTransactions.reduce((sum, tx) => sum + tx.amount, 0)
      
      periods.push({
        period: periodStart.toISOString().slice(0, 7), // YYYY-MM format
        earned
      })
    }

    return periods
  }

  private async getPreviousScore(entityId: string, entityType: EntityType): Promise<TrustScore | null> {
    return await this.database.getPreviousTrustScore(entityId, entityType)
  }

  private async getTrustScore(entityId: string, entityType: EntityType): Promise<TrustScore | null> {
    return await this.database.getCurrentTrustScore(entityId, entityType)
  }

  private async checkTierChange(entityId: string, entityType: EntityType, newTier: TrustTier): Promise<boolean> {
    const previousScore = await this.getPreviousScore(entityId, entityType)
    return previousScore ? previousScore.tier !== newTier : true
  }

  private async storeTransaction(transaction: TrustEquityTransaction): Promise<void> {
    await this.database.storeTrustEquityTransaction(transaction)
    this.invalidateTransactionCache(transaction.entityId, transaction.entityType)
  }

  private async storeTrustScore(score: TrustScore): Promise<void> {
    await this.database.storeTrustScore(score)
  }

  private invalidateScoreCache(entityId: string, entityType: EntityType): void {
    const cacheKey = `€{entityId}-€{entityType}`
    this.scoreCache.delete(cacheKey)
  }

  private invalidateTransactionCache(entityId: string, entityType: EntityType): void {
    // Remove all cache entries for this entity
    const keysToDelete = Array.from(this.transactionCache.keys()).filter(key => 
      key.startsWith(`tx-€{entityId}-€{entityType}`)
    )
    keysToDelete.forEach(key => this.transactionCache.delete(key))
  }

  private setupEventHandlers(): void {
    // Listen for events that should generate trust equity
    this.eventBus.subscribe('*', async (event) => {
      try {
        const trustEquityEvents = this.mapEventToTrustEquity(event)
        await Promise.all(trustEquityEvents.map(te => this.processPointsEvent(te)))
      } catch (error) {
        this.logger.error('Failed to process event for trust equity', { event, error })
      }
    })
  }

  private mapEventToTrustEquity(event: any): Array<Parameters<typeof this.processPointsEvent>[0]> {
    // Map different event types to trust equity generation
    const mappings: Array<Parameters<typeof this.processPointsEvent>[0]> = []

    switch (event.type) {
      case 'questionnaire.completed':
        mappings.push({
          entityId: event.data.customerId,
          entityType: 'organization',
          points: event.data.trustEquityEarned || 50,
          source: 'compass',
          category: 'compliance',
          description: `Completed questionnaire: €{event.data.questionnaireId}`,
          evidence: [`questionnaire-€{event.data.questionnaireId}`],
          multiplier: event.data.averageConfidence / 100
        })
        break

      case 'vulnerability.discovered':
        // Negative impact for critical vulnerabilities found
        if (event.data.severity === 'critical') {
          mappings.push({
            entityId: event.data.organizationId,
            entityType: 'organization',
            points: -20,
            source: 'atlas',
            category: 'security',
            description: `Critical vulnerability discovered: €{event.data.vulnerabilityId}`,
            multiplier: 1.0
          })
        }
        break

      case 'security.posture.updated':
        mappings.push({
          entityId: event.data.organizationId,
          entityType: 'organization',
          points: event.data.trustEquityChange || 0,
          source: 'atlas',
          category: 'security',
          description: `Security posture updated: €{event.data.assessmentId}`,
          multiplier: event.data.overallScore / 100
        })
        break

      // Add more event mappings as needed
    }

    return mappings
  }

  private startBackgroundProcesses(): void {
    // Clean up expired points every hour
    setInterval(async () => {
      try {
        await this.processExpiredPoints()
      } catch (error) {
        this.logger.error('Failed to process expired points', error)
      }
    }, 60 * 60 * 1000) // 1 hour

    // Recalculate scores for active entities every 6 hours
    setInterval(async () => {
      try {
        await this.recalculateActiveScores()
      } catch (error) {
        this.logger.error('Failed to recalculate active scores', error)
      }
    }, 6 * 60 * 60 * 1000) // 6 hours

    // Clear caches every 30 minutes
    setInterval(() => {
      this.clearOldCacheEntries()
    }, 30 * 60 * 1000) // 30 minutes
  }

  private async processExpiredPoints(): Promise<void> {
    const expiredTransactions = await this.database.getExpiredTrustEquityTransactions()
    
    for (const tx of expiredTransactions) {
      await this.processPointsEvent({
        entityId: tx.entityId,
        entityType: tx.entityType,
        points: -tx.amount, // Negative to remove points
        source: tx.source,
        category: tx.category,
        description: `Expired points from: €{tx.description}`,
        multiplier: 1.0
      })
    }
  }

  private async recalculateActiveScores(): Promise<void> {
    const activeEntities = await this.database.getActiveEntitiesForTrustCalculation()
    
    await Promise.all(
      activeEntities.map(entity => 
        this.calculateTrustScore(entity.id, entity.type).catch(error => 
          this.logger.error('Failed to recalculate score', { entity, error })
        )
      )
    )
  }

  private clearOldCacheEntries(): void {
    const now = Date.now()
    
    // Clear score cache
    for (const [key, value] of this.scoreCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.scoreCache.delete(key)
      }
    }
    
    // Clear metrics cache
    for (const [key, value] of this.metricsCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.metricsCache.delete(key)
      }
    }
    
    // Clear transaction cache (longer TTL)
    if (this.transactionCache.size > 1000) {
      this.transactionCache.clear()
    }
  }

  // Utility methods for ID generation
  private generateTransactionId(): string {
    return `tx_€{Date.now()}_€{Math.random().toString(36).substr(2, 9)}`
  }

  private generateSourceId(): string {
    return `src_€{Date.now()}_€{Math.random().toString(36).substr(2, 9)}`
  }

  private generateEventId(): string {
    return `evt_€{Date.now()}_€{Math.random().toString(36).substr(2, 9)}`
  }
}