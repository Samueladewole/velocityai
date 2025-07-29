/**
 * ERIP MVP Dashboard
 * Complete user experience focused on Trust Score and actionable insights
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown,
  Share2,
  Upload,
  FileText,
  Users,
  DollarSign,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Award,
  Shield,
  BarChart3,
  Building2,
  Globe,
  Calendar,
  Star,
  Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProgressRing } from '@/components/ui/progress-ring'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface QuickWin {
  id: string
  title: string
  description: string
  value: string
  timeToComplete: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: 'Security' | 'Compliance' | 'Process' | 'Documentation'
  trustPointsGain: number
  completed: boolean
}

interface ActionItem {
  id: string
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  category: string
  impact: number
  effort: number
  deadline?: string
  assignee?: string
  completed: boolean
}

interface TrustMetric {
  name: string
  current: number
  target: number
  trend: 'up' | 'down' | 'stable'
  change: number
}

interface SalesMetric {
  name: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ComponentType<any>
}

export const MVPDashboard: React.FC = () => {
  const [trustScore, setTrustScore] = useState(658)
  const [previousScore, setPreviousScore] = useState(642)
  const [quickWins, setQuickWins] = useState<QuickWin[]>([])
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real implementation, this would come from APIs
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setQuickWins([
        {
          id: '1',
          title: 'Enable 2FA for Admin Accounts',
          description: 'Add two-factor authentication to all administrative accounts',
          value: '+15 Trust Points',
          timeToComplete: '30 minutes',
          difficulty: 'Easy',
          category: 'Security',
          trustPointsGain: 15,
          completed: false
        },
        {
          id: '2',
          title: 'Update Privacy Policy',
          description: 'Refresh privacy policy with latest GDPR requirements',
          value: '+10 Trust Points',
          timeToComplete: '2 hours',
          difficulty: 'Medium',
          category: 'Compliance',
          trustPointsGain: 10,
          completed: false
        },
        {
          id: '3',
          title: 'Document Incident Response',
          description: 'Create formal incident response procedures',
          value: '+20 Trust Points',
          timeToComplete: '4 hours',
          difficulty: 'Medium',
          category: 'Documentation',
          trustPointsGain: 20,
          completed: false
        },
        {
          id: '4',
          title: 'Employee Security Training',
          description: 'Complete mandatory security awareness training',
          value: '+12 Trust Points',
          timeToComplete: '1 hour',
          difficulty: 'Easy',
          category: 'Process',
          trustPointsGain: 12,
          completed: true
        }
      ])

      setActionItems([
        {
          id: '1',
          title: 'SOC 2 Type II Certification',
          description: 'Complete SOC 2 Type II audit and certification',
          priority: 'High',
          category: 'Compliance',
          impact: 95,
          effort: 85,
          deadline: '2025-12-15',
          completed: false
        },
        {
          id: '2',
          title: 'Penetration Testing',
          description: 'Annual third-party penetration testing',
          priority: 'High',
          category: 'Security',
          impact: 80,
          effort: 40,
          deadline: '2025-09-30',
          completed: false
        },
        {
          id: '3',
          title: 'Data Classification Program',
          description: 'Implement comprehensive data classification',
          priority: 'Medium',
          category: 'Governance',
          impact: 70,
          effort: 60,
          completed: false
        }
      ])

      setIsLoading(false)
    }

    loadDashboardData()
  }, [])

  const trustTrend = [
    { month: 'Jan', score: 580 },
    { month: 'Feb', score: 595 },
    { month: 'Mar', score: 615 },
    { month: 'Apr', score: 628 },
    { month: 'May', score: 642 },
    { month: 'Jun', score: 658 }
  ]

  const trustMetrics: TrustMetric[] = [
    { name: 'Security Posture', current: 82, target: 90, trend: 'up', change: 8 },
    { name: 'Compliance Coverage', current: 76, target: 85, trend: 'up', change: 12 },
    { name: 'Process Maturity', current: 68, target: 80, trend: 'up', change: 5 },
    { name: 'Documentation', current: 71, target: 85, trend: 'up', change: 15 }
  ]

  const salesMetrics: SalesMetric[] = [
    { name: 'Deals Accelerated', value: '12', change: '+3 this month', trend: 'up', icon: TrendingUp },
    { name: 'Time Saved', value: '156 hrs', change: '+23 hrs this month', trend: 'up', icon: Clock },
    { name: 'Questions Pre-answered', value: '89%', change: '+12% this month', trend: 'up', icon: CheckCircle2 },
    { name: 'Customer Trust Score', value: '4.8/5', change: '+0.3 this month', trend: 'up', icon: Star }
  ]

  const getTierInfo = (score: number) => {
    if (score >= 800) return { 
      name: 'Market Leader', 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      border: 'border-purple-200',
      nextTier: null,
      pointsToNext: 0
    }
    if (score >= 600) return { 
      name: 'Sales Accelerator', 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200',
      nextTier: 'Market Leader',
      pointsToNext: 800 - score
    }
    if (score >= 400) return { 
      name: 'Process Builder', 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      border: 'border-green-200',
      nextTier: 'Sales Accelerator',
      pointsToNext: 600 - score
    }
    return { 
      name: 'Foundation', 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      border: 'border-orange-200',
      nextTier: 'Process Builder',
      pointsToNext: 400 - score
    }
  }

  const tierInfo = getTierInfo(trustScore)
  const scoreChange = trustScore - previousScore
  const scoreProgress = ((trustScore - 400) / 400) * 100 // Assuming 400-800 range

  const completeQuickWin = (id: string) => {
    setQuickWins(prev => prev.map(win => 
      win.id === id ? { ...win, completed: true } : win
    ))
    // In real app, this would trigger trust score recalculation
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading your Trust Intelligence Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Trust Intelligence Dashboard</h1>
            <p className="text-slate-600">Monitor your Trust Equity™ and accelerate business growth</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Questionnaire
            </Button>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Share2 className="h-4 w-4" />
              Share Trust Score
            </Button>
          </div>
        </div>

        {/* Trust Score Hero Section */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Trust Score Display */}
              <div className="text-center">
                <ProgressRing
                  progress={scoreProgress}
                  size={180}
                  strokeWidth={12}
                  color={tierInfo.color.includes('purple') ? 'purple' : 
                         tierInfo.color.includes('blue') ? 'blue' : 
                         tierInfo.color.includes('green') ? 'green' : 'yellow'}
                  showValue={false}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center lg:relative lg:inset-auto lg:mt-4">
                  <div className="text-4xl font-bold text-slate-900">{trustScore}</div>
                  <div className="text-sm text-slate-600">Trust Score</div>
                  <div className={cn(
                    "flex items-center gap-1 mt-2 text-sm font-medium",
                    scoreChange >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {scoreChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {scoreChange >= 0 ? '+' : ''}{scoreChange} this month
                  </div>
                </div>
              </div>

              {/* Tier Information */}
              <div className="text-center lg:text-left">
                <Badge className={cn("text-lg px-4 py-2 mb-4", tierInfo.color, tierInfo.bg)}>
                  {tierInfo.name} Tier
                </Badge>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {tierInfo.nextTier ? `${tierInfo.pointsToNext} points to ${tierInfo.nextTier}` : 'Maximum Tier Achieved! 🎉'}
                </h3>
                <p className="text-slate-600 mb-4">
                  {tierInfo.nextTier 
                    ? "Complete quick wins below to reach the next tier and unlock more sales acceleration features."
                    : "You've achieved the highest Trust Equity™ tier. You're a market leader!"
                  }
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Trust Equity™ Progress</span>
                    <span>{Math.round(scoreProgress)}%</span>
                  </div>
                  <Progress value={scoreProgress} className="h-2" />
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Your Tier Benefits</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">Advanced security credibility</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">Sales process acceleration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">Industry recognition</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">Premium pricing capability</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quickwins">Quick Wins</TabsTrigger>
            <TabsTrigger value="sales">Sales Tools</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustMetrics.map((metric) => (
                <Card key={metric.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-slate-900">{metric.name}</h3>
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        metric.trend === 'up' ? "text-green-600" : "text-red-600"
                      )}>
                        {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        +{metric.change}%
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Current: {metric.current}%</span>
                        <span>Target: {metric.target}%</span>
                      </div>
                      <Progress value={(metric.current / metric.target) * 100} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trust Score Trend */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trust Score Trend</CardTitle>
                  <CardDescription>Your Trust Equity™ growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trustTrend}>
                        <defs>
                          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#3b82f6" 
                          fillOpacity={1} 
                          fill="url(#scoreGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Priority Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Priority Actions</CardTitle>
                  <CardDescription>High-impact items for Trust Score improvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {actionItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className={cn(
                          "w-3 h-3 rounded-full mt-2",
                          item.priority === 'High' ? "bg-red-500" :
                          item.priority === 'Medium' ? "bg-yellow-500" : "bg-green-500"
                        )} />
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{item.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              Impact: {item.impact}% | Effort: {item.effort}%
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quickwins" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Quick Wins</h2>
                <p className="text-slate-600">Easy actions to boost your Trust Score immediately</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  +{quickWins.filter(w => !w.completed).reduce((sum, w) => sum + w.trustPointsGain, 0)}
                </div>
                <div className="text-sm text-slate-600">Available points</div>
              </div>
            </div>

            <div className="grid gap-4">
              {quickWins.map((win) => (
                <Card key={win.id} className={cn(
                  "transition-all",
                  win.completed ? "opacity-60 bg-slate-50" : "hover:shadow-md"
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={cn(
                            "font-semibold",
                            win.completed ? "line-through text-slate-500" : "text-slate-900"
                          )}>
                            {win.title}
                          </h3>
                          {win.completed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                        </div>
                        <p className="text-slate-600 mb-4">{win.description}</p>
                        <div className="flex items-center gap-4">
                          <Badge variant={
                            win.difficulty === 'Easy' ? 'default' :
                            win.difficulty === 'Medium' ? 'secondary' : 'destructive'
                          }>
                            {win.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {win.category}
                          </Badge>
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {win.timeToComplete}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-lg font-bold text-green-600 mb-2">
                          {win.value}
                        </div>
                        {!win.completed ? (
                          <Button 
                            onClick={() => completeQuickWin(win.id)}
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            Complete <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Pro Tip</h4>
                    <p className="text-blue-800">
                      Completing all quick wins will increase your Trust Score by{' '}
                      <span className="font-bold">
                        +{quickWins.filter(w => !w.completed).reduce((sum, w) => sum + w.trustPointsGain, 0)} points
                      </span>
                      {' '}and move you closer to the next tier!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Sales Enablement Tools</h2>
              <p className="text-slate-600">Accelerate your sales process with Trust Equity™</p>
            </div>

            {/* Sales Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {salesMetrics.map((metric) => {
                const Icon = metric.icon
                return (
                  <Card key={metric.name}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <div className={cn(
                          "text-xs font-medium",
                          metric.trend === 'up' ? "text-green-600" : "text-red-600"
                        )}>
                          {metric.change}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-slate-600">{metric.name}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Sales Tools */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Trust Score Sharing
                  </CardTitle>
                  <CardDescription>
                    Share your Trust Score with prospects to accelerate deals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    Generate Shareable Link
                  </Button>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium mb-2">Recent Shares</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Acme Corp Security Review</span>
                        <span className="text-green-600">Viewed 3 times</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TechStart RFP Response</span>
                        <span className="text-blue-600">Shared 2 days ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Evidence Library
                  </CardTitle>
                  <CardDescription>
                    Instantly access compliance documents and certificates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm">SOC 2 Report</Button>
                    <Button variant="outline" size="sm">Pen Test Results</Button>
                    <Button variant="outline" size="sm">ISO Certificate</Button>
                    <Button variant="outline" size="sm">Security Policies</Button>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Full Library
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Value Analytics</h2>
              <p className="text-slate-600">Track ROI, time savings, and business impact</p>
            </div>

            {/* ROI Dashboard placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Trust Equity™ ROI Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive value tracking and business impact analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Advanced Analytics Coming Soon
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Get detailed insights into time saved, deals accelerated, 
                    risk reduction, and overall ROI from your Trust Equity™ investments.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default MVPDashboard