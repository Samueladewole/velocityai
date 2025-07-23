/**
 * Trust Equity™ Dashboard
 * 
 * Interactive dashboard showing real-time Trust Score, ROI calculations,
 * industry benchmarking, and growth analytics.
 */

import React, { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ProgressRing } from '../ui/progress-ring'
import { MetricCard } from '../ui/metric-card'
import { Chart } from '../ui/chart'
import { 
  TrendingUp, 
  Award, 
  Share2, 
  Download, 
  Eye, 
  Target,
  BarChart3,
  DollarSign,
  Users,
  Clock,
  Shield,
  Zap
} from 'lucide-react'

interface TrustScoreData {
  total: number
  tier: {
    level: string
    color: string
    minPoints: number
    maxPoints: number
    benefits: string[]
  }
  byCategory: Record<string, number>
  byActivity: Record<string, number>
  trend: {
    direction: 'up' | 'down' | 'stable'
    percentageChange: number
    timeframe: string
  }
  nextTier?: {
    level: string
    minPoints: number
    pointsNeeded: number
  }
}

interface TrustROIData {
  estimatedValue: number
  salesAcceleration: number
  riskReduction: number
  complianceCostSavings: number
  brandValue: number
  methodology: string
}

interface BenchmarkData {
  averageScore: number
  percentileRanks: {
    p25: number
    p50: number
    p75: number
    p90: number
  }
  yourPercentile: number
  industryRank: number
  totalCompanies: number
}

interface ActivitySummary {
  totalActivities: number
  thisMonth: number
  streakDays: number
  lastActivity: Date
  topCategories: Array<{
    category: string
    count: number
    points: number
  }>
}

export const TrustEquityDashboard: React.FC<{
  organizationId: string
}> = ({ organizationId }) => {
  const [trustScore, setTrustScore] = useState<TrustScoreData | null>(null)
  const [trustROI, setTrustROI] = useState<TrustROIData | null>(null)
  const [benchmarks, setBenchmarks] = useState<BenchmarkData | null>(null)
  const [activities, setActivities] = useState<ActivitySummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [showROIDetails, setShowROIDetails] = useState(false)

  useEffect(() => {
    loadDashboardData()
    
    // Set up real-time updates
    const interval = setInterval(loadDashboardData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [organizationId, selectedTimeframe])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load all dashboard data in parallel
      const [scoreRes, roiRes, benchmarkRes, activityRes] = await Promise.all([
        fetch(`/api/trust-score/organizations/${organizationId}/breakdown`),
        fetch(`/api/trust-score/organizations/${organizationId}/roi`),
        fetch(`/api/trust-score/benchmarks/technology`), // Would be dynamic based on org industry
        fetch(`/api/trust-score/organizations/${organizationId}/activity-summary`)
      ])

      const [scoreData, roiData, benchmarkData, activityData] = await Promise.all([
        scoreRes.json(),
        roiRes.json(),
        benchmarkRes.json(),
        activityRes.json()
      ])

      setTrustScore(scoreData.breakdown)
      setTrustROI(roiData.roi)
      setBenchmarks({
        ...benchmarkData,
        yourPercentile: calculatePercentile(scoreData.breakdown.total, benchmarkData.percentileRanks),
        industryRank: 1, // Would be calculated
        totalCompanies: 250 // Would be actual count
      })
      setActivities(activityData)
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePercentile = (score: number, percentiles: any): number => {
    if (score >= percentiles.p90) return 90
    if (score >= percentiles.p75) return 75
    if (score >= percentiles.p50) return 50
    if (score >= percentiles.p25) return 25
    return 10
  }

  const handleShareTrustScore = async () => {
    try {
      const response = await fetch(`/api/trust-score/organizations/${organizationId}/share-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expiresIn: 30 * 24 * 60 * 60, // 30 days
          customizations: {
            title: 'Our Trust Score',
            description: 'Demonstrating our commitment to security and compliance excellence'
          }
        })
      })
      
      const { url } = await response.json()
      
      // Copy to clipboard
      await navigator.clipboard.writeText(url)
      
      // Show success notification
      // Would implement toast notification here
      alert('Shareable link copied to clipboard!')
      
    } catch (error) {
      console.error('Failed to create shareable URL:', error)
    }
  }

  const exportTrustReport = async () => {
    try {
      const response = await fetch(`/api/trust-score/organizations/${organizationId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'pdf', includeROI: true })
      })
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `trust-equity-report-${organizationId}.pdf`
      a.click()
      
    } catch (error) {
      console.error('Failed to export report:', error)
    }
  }

  if (isLoading || !trustScore) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse bg-gray-200" />
          ))}
        </div>
        <Card className="h-96 animate-pulse bg-gray-200" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trust Equity™ Dashboard</h1>
          <p className="text-gray-600 mt-1">Transform compliance into competitive advantage</p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={handleShareTrustScore} className="flex items-center gap-2">
            <Share2 size={16} />
            Share Trust Score
          </Button>
          <Button variant="outline" onClick={exportTrustReport} className="flex items-center gap-2">
            <Download size={16} />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key metrics overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Trust Score"
          value={trustScore.total.toLocaleString()}
          icon={<Award className="text-blue-600" />}
          trend={trustScore.trend}
          suffix={
            <Badge 
              style={{ backgroundColor: trustScore.tier.color, color: 'white' }}
              className="ml-2"
            >
              {trustScore.tier.level}
            </Badge>
          }
        />
        
        <MetricCard
          title="Trust ROI"
          value={`$${trustROI?.estimatedValue.toLocaleString() || '0'}`}
          icon={<DollarSign className="text-green-600" />}
          trend={{ direction: 'up', percentageChange: 15.2, timeframe: '30d' }}
          subtitle="Estimated annual value"
        />
        
        <MetricCard
          title="Industry Rank"
          value={`${benchmarks?.industryRank || 1}`}
          icon={<Target className="text-purple-600" />}
          subtitle={`Top ${benchmarks?.yourPercentile || 90}th percentile`}
          trend={{ direction: 'up', percentageChange: 5, timeframe: '30d' }}
        />
        
        <MetricCard
          title="Activity Streak"
          value={`${activities?.streakDays || 0}`}
          icon={<Zap className="text-orange-600" />}
          subtitle="Consecutive days"
          trend={{ direction: 'up', percentageChange: 12, timeframe: '7d' }}
        />
      </div>

      {/* Trust Score Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Trust Score Progress</h2>
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map((period) => (
              <Button
                key={period}
                variant={selectedTimeframe === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe(period as any)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trust Score Ring */}
          <div className="flex flex-col items-center">
            <ProgressRing
              value={trustScore.total}
              max={trustScore.nextTier?.minPoints || 10000}
              size={200}
              strokeWidth={20}
              color={trustScore.tier.color}
            />
            
            <div className="text-center mt-4">
              <div className="text-3xl font-bold" style={{ color: trustScore.tier.color }}>
                {trustScore.total}
              </div>
              <div className="text-sm text-gray-600">
                {trustScore.nextTier && (
                  <>
                    {trustScore.nextTier.pointsNeeded} points to {trustScore.nextTier.level}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4">Points by Category</h3>
            <div className="space-y-3">
              {Object.entries(trustScore.byCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, points]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-blue-500`} />
                      <span className="capitalize">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{Math.round(points)}</span>
                      <div 
                        className="h-2 bg-blue-500 rounded"
                        style={{ 
                          width: `${(points / Math.max(...Object.values(trustScore.byCategory))) * 100}px` 
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ROI Analysis & Industry Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Analysis */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Trust ROI Analysis</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowROIDetails(!showROIDetails)}
            >
              <Eye size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ${trustROI?.estimatedValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Estimated Annual Value</div>
            </div>

            {showROIDetails && trustROI && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm">Sales Acceleration</span>
                  <span className="text-sm font-medium">${trustROI.salesAcceleration.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Risk Reduction</span>
                  <span className="text-sm font-medium">${trustROI.riskReduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Compliance Savings</span>
                  <span className="text-sm font-medium">${trustROI.complianceCostSavings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Brand Value</span>
                  <span className="text-sm font-medium">${trustROI.brandValue.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="mt-4">
              <Chart
                type="doughnut"
                data={{
                  labels: ['Sales Acceleration', 'Risk Reduction', 'Compliance Savings', 'Brand Value'],
                  datasets: [{
                    data: trustROI ? [
                      trustROI.salesAcceleration,
                      trustROI.riskReduction,
                      trustROI.complianceCostSavings,
                      trustROI.brandValue
                    ] : [],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
                  }]
                }}
                options={{
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
                className="h-48"
              />
            </div>
          </div>
        </Card>

        {/* Industry Benchmarks */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Industry Benchmarks</h2>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {benchmarks?.yourPercentile}th
              </div>
              <div className="text-sm text-gray-600">Percentile</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Your Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600"
                      style={{ width: `${(trustScore.total / (benchmarks?.percentileRanks.p90 || 1000)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{trustScore.total}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Industry Average</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-400"
                      style={{ width: `${((benchmarks?.averageScore || 0) / (benchmarks?.percentileRanks.p90 || 1000)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{benchmarks?.averageScore}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">90th Percentile</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600"
                      style={{ width: '90%' }}
                    />
                  </div>
                  <span className="text-sm font-medium">{benchmarks?.percentileRanks.p90}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                <span>Compared to {benchmarks?.totalCompanies} companies in Technology</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activities & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activities</h2>
            <Badge variant="secondary">
              {activities?.thisMonth || 0} this month
            </Badge>
          </div>

          <div className="space-y-3">
            {trustScore.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm capitalize">
                      {activity.type.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.category}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">+{activity.points}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {trustScore.recentActivities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <div>No recent activities</div>
              <div className="text-sm">Complete assessments to earn Trust Points</div>
            </div>
          )}
        </Card>

        {/* Next Steps to Improve */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Improve Your Trust Score</h2>
          
          <div className="space-y-4">
            {trustScore.nextTier && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={16} className="text-blue-600" />
                  <span className="font-medium">Next Tier: {trustScore.nextTier.level}</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {trustScore.nextTier.pointsNeeded} more points needed
                </div>
                <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ 
                      width: `${((trustScore.total - trustScore.tier.minPoints) / 
                        (trustScore.nextTier.minPoints - trustScore.tier.minPoints)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-medium">Quick Wins</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Upload security policy document</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">+10 pts</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Complete SOC 2 assessment</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">+50 pts</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span className="text-sm">Enable continuous monitoring</span>
                  </div>
                  <span className="text-sm font-medium text-purple-600">+25 pts/month</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TrustEquityDashboard