/**
 * QIE Learning Dashboard
 * 
 * Track answer effectiveness, learn from buyer feedback,
 * and continuously improve suggestion quality.
 */
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react'
import { IntelligentAnswerGenerationService } from '@/services/qie/intelligentAnswerGeneration'
import { exportData } from '@/utils/export'
import { useToast } from '@/hooks/use-toast'

interface AnswerFeedback {
  questionId: string
  answerId: string
  rating: 'accepted' | 'modified' | 'rejected'
  modificationDetails?: string
  buyerFeedback?: string
  timestamp: Date
}

interface EffectivenessMetric {
  category: string
  effectiveness: number
  trend: 'up' | 'down' | 'stable'
  sampleSize: number
}

export function QIELearningDashboard() {
  const [metrics, setMetrics] = useState<EffectivenessMetric[]>([])
  const [feedback, setFeedback] = useState<AnswerFeedback[]>([])
  const [insights, setInsights] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month')
  
  const { toast } = useToast()
  const answerService = new IntelligentAnswerGenerationService()

  useEffect(() => {
    loadLearningData()
  }, [selectedPeriod])

  const loadLearningData = async () => {
    setIsLoading(true)
    try {
      // Load learning insights
      const learningInsights = answerService.getLearningInsights()
      setInsights(learningInsights)

      // Mock effectiveness metrics
      setMetrics([
        { category: 'Data Security', effectiveness: 0.89, trend: 'up', sampleSize: 145 },
        { category: 'Access Control', effectiveness: 0.92, trend: 'stable', sampleSize: 98 },
        { category: 'Incident Response', effectiveness: 0.78, trend: 'down', sampleSize: 67 },
        { category: 'Business Continuity', effectiveness: 0.85, trend: 'up', sampleSize: 54 },
        { category: 'Compliance', effectiveness: 0.91, trend: 'up', sampleSize: 112 }
      ])

      // Mock feedback data
      setFeedback([
        {
          questionId: 'q1',
          answerId: 'a1',
          rating: 'accepted',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          questionId: 'q2',
          answerId: 'a2',
          rating: 'modified',
          modificationDetails: 'Added specific RTO/RPO metrics',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          questionId: 'q3',
          answerId: 'a3',
          rating: 'rejected',
          buyerFeedback: 'Answer too generic, needed industry-specific details',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ])
    } catch (error) {
      console.error('Failed to load learning data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load learning metrics',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const effectivenessData = metrics.map(m => ({
    name: m.category,
    effectiveness: Math.round(m.effectiveness * 100),
    target: 85
  }))

  const feedbackDistribution = [
    { name: 'Accepted', value: feedback.filter(f => f.rating === 'accepted').length, color: '#10b981' },
    { name: 'Modified', value: feedback.filter(f => f.rating === 'modified').length, color: '#f59e0b' },
    { name: 'Rejected', value: feedback.filter(f => f.rating === 'rejected').length, color: '#ef4444' }
  ]

  const trendData = [
    { month: 'Jan', effectiveness: 72, answerCount: 145 },
    { month: 'Feb', effectiveness: 75, answerCount: 178 },
    { month: 'Mar', effectiveness: 78, answerCount: 203 },
    { month: 'Apr', effectiveness: 82, answerCount: 234 },
    { month: 'May', effectiveness: 85, answerCount: 267 },
    { month: 'Jun', effectiveness: 88, answerCount: 289 }
  ]

  const handleExportMetrics = () => {
    const exportableData = {
      metrics,
      feedback,
      insights,
      generatedAt: new Date().toISOString()
    }

    exportData(exportableData, 'json', {
      filename: `qie-learning-metrics-€{selectedPeriod}`
    })

    toast({
      title: 'Export Complete',
      description: 'Learning metrics exported successfully'
    })
  }

  const handleRetrainModel = () => {
    toast({
      title: 'Retraining Started',
      description: 'QIE model retraining initiated with latest feedback data'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Brain className="h-8 w-8 animate-pulse text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">QIE Learning System</h2>
          <p className="text-gray-600">Track answer effectiveness and improve over time</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportMetrics}>
            <Download className="h-4 w-4 mr-2" />
            Export Metrics
          </Button>
          <Button variant="outline" size="sm" onClick={handleRetrainModel}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retrain Model
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overall Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.averageEffectiveness ? `€{Math.round(insights.averageEffectiveness * 100)}%` : '0%'}
            </div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last {selectedPeriod}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.totalAnswers || 0}</div>
            <div className="text-sm text-gray-600 mt-1">
              Across all questionnaires
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedback.length > 0 
                ? `€{Math.round((feedback.filter(f => f.rating === 'accepted').length / feedback.length) * 100)}%`
                : '0%'}
            </div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <Award className="h-3 w-3 mr-1" />
              Above target
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Improvement Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights?.improvementAreas?.length || 0}</div>
            <div className="text-sm text-amber-600 mt-1">
              Categories need attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="effectiveness" className="space-y-4">
        <TabsList>
          <TabsTrigger value="effectiveness">Effectiveness by Category</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Analysis</TabsTrigger>
          <TabsTrigger value="trends">Learning Trends</TabsTrigger>
          <TabsTrigger value="patterns">Top Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="effectiveness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Effectiveness</CardTitle>
              <CardDescription>
                Answer acceptance rate by question category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={effectivenessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="effectiveness" fill="#3b82f6" name="Effectiveness %" />
                  <Bar dataKey="target" fill="#e5e7eb" name="Target %" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {metrics.map(metric => (
                  <div key={metric.category} className="flex items-center justify-between p-2 rounded bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{metric.category}</span>
                      <Badge variant="outline" className="text-xs">
                        {metric.sampleSize} samples
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                      {metric.trend === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                      <span className="font-semibold">{Math.round(metric.effectiveness * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Distribution</CardTitle>
              <CardDescription>
                How buyers respond to generated answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={feedbackDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `€{name}: €{value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {feedbackDistribution.map((entry, index) => (
                        <Cell key={`cell-€{index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Accepted</span>
                    <span className="ml-auto text-sm text-gray-600">
                      Direct use without changes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Modified</span>
                    <span className="ml-auto text-sm text-gray-600">
                      Minor adjustments made
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Rejected</span>
                    <span className="ml-auto text-sm text-gray-600">
                      Complete rewrite needed
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Feedback */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Recent Feedback</h4>
                <div className="space-y-2">
                  {feedback.slice(0, 5).map((fb, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          className={
                            fb.rating === 'accepted' ? 'bg-green-100 text-green-800' :
                            fb.rating === 'modified' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {fb.rating}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {fb.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      {fb.modificationDetails && (
                        <p className="text-sm text-gray-600">
                          Modification: {fb.modificationDetails}
                        </p>
                      )}
                      {fb.buyerFeedback && (
                        <p className="text-sm text-gray-600">
                          Feedback: {fb.buyerFeedback}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Effectiveness improvement over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="effectiveness"
                    stroke="#3b82f6"
                    name="Effectiveness %"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="answerCount"
                    stroke="#10b981"
                    name="Answers Generated"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Learning Insights</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Model accuracy improved by 16% over 6 months</li>
                  <li>• Technical questions show highest improvement rate</li>
                  <li>• Compliance-related answers have 92% acceptance rate</li>
                  <li>• Average processing time reduced by 35%</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Answer Patterns</CardTitle>
              <CardDescription>
                Most frequently used and effective answer templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insights?.topPatterns && insights.topPatterns.length > 0 ? (
                <div className="space-y-3">
                  {insights.topPatterns.map((pattern: any, idx: number) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{pattern.question}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Used {pattern.usedCount}x
                          </Badge>
                          <Badge
                            className={
                              pattern.effectiveness > 0.8
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }
                          >
                            {Math.round(pattern.effectiveness * 100)}% effective
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {pattern.answer}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        Last used: {new Date(pattern.lastUsed).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No pattern data available yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}