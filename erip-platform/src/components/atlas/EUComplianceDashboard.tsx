/**
 * EU Compliance Dashboard for ATLAS
 * Comprehensive visualization of EU regulatory compliance status
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
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  FileText,
  Languages,
  Share2,
  Building,
  Scale,
  Eye,
  TrendingUp,
  Download,
  Settings,
  Bell,
  MapPin,
  Users,
  BookOpen,
  Flag,
  Gavel,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react'

import { EUComplianceOrchestrator, EUComplianceDashboard as DashboardData } from '@/services/atlas/euComplianceOrchestrator'

interface EUComplianceDashboardProps {
  organizationName?: string
  timeframe?: string
}

const FRAMEWORK_COLORS = {
  NIS2: '#3b82f6',
  DORA: '#ef4444', 
  GDPR: '#10b981',
  CRA: '#f59e0b',
  ENISA: '#8b5cf6'
}

const COUNTRY_FLAGS = {
  DE: '🇩🇪',
  FR: '🇫🇷',
  NL: '🇳🇱',
  IT: '🇮🇹',
  ES: '🇪🇸',
  PL: '🇵🇱'
}

export function EUComplianceDashboard({ 
  organizationName = "Your Organization",
  timeframe = "last_30_days" 
}: EUComplianceDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')
  
  const orchestrator = new EUComplianceOrchestrator()

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        const data = orchestrator.generateComplianceDashboard(organizationName, timeframe)
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [organizationName, timeframe])

  const getRiskColor = (riskLevel: string) => {
    const colors = {
      'LOW': 'text-green-700 bg-green-50 border-green-200',
      'MEDIUM': 'text-yellow-700 bg-yellow-50 border-yellow-200',
      'HIGH': 'text-orange-700 bg-orange-50 border-orange-200',
      'CRITICAL': 'text-red-700 bg-red-50 border-red-200'
    }
    return colors[riskLevel as keyof typeof colors] || colors.MEDIUM
  }

  const formatPercentage = (value: number) => `${Math.round(value)}%`

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600">Unable to load compliance dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">EU Compliance Dashboard</h1>
          <p className="text-gray-600 mt-1">{organizationName} • {dashboardData.reportDate.toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Set Alerts
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatPercentage(dashboardData.summary.compliancePercentage)}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4">
              <Progress value={dashboardData.summary.compliancePercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliant Vulnerabilities</p>
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData.summary.compliantVulnerabilities}/{dashboardData.summary.totalVulnerabilities}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-700 border-green-200">
                {formatPercentage((dashboardData.summary.compliantVulnerabilities / dashboardData.summary.totalVulnerabilities) * 100)} compliant
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Level</p>
                <div className="mt-1">
                  <Badge className={getRiskColor(dashboardData.summary.overallRiskLevel)}>
                    {dashboardData.summary.overallRiskLevel}
                  </Badge>
                </div>
              </div>
              <Activity className="h-8 w-8 text-amber-500" />
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Based on {dashboardData.summary.totalVulnerabilities} assessments
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Actions</p>
                <p className="text-3xl font-bold text-red-600">
                  {dashboardData.summary.urgentActions}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-2">
              <p className="text-sm text-red-600">
                Immediate attention required
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Framework Compliance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Framework Compliance
                </CardTitle>
                <CardDescription>
                  Compliance status across EU regulatory frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.frameworks}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Compliance']} />
                    <Bar dataKey="compliance" fill="#3b82f6" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Compliance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Compliance Trends
                </CardTitle>
                <CardDescription>
                  Monthly compliance performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="compliance" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Compliance %"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="violations" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Violations"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Priority Action Items
              </CardTitle>
              <CardDescription>
                Immediate actions required for compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recommendations.strategic.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="w-6 h-6 rounded-full bg-orange-600 text-white text-sm flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-orange-900 font-medium">{recommendation}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-orange-700 border-orange-300">
                          Strategic
                        </Badge>
                        <span className="text-sm text-orange-700">
                          Due: {new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-6">
          <div className="grid gap-6">
            {dashboardData.frameworks.map((framework) => (
              <Card key={framework.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: FRAMEWORK_COLORS[framework.name as keyof typeof FRAMEWORK_COLORS] }}
                        />
                        {framework.name}
                      </CardTitle>
                      <CardDescription>
                        Compliance: {formatPercentage(framework.compliance)} • 
                        Next deadline: {framework.nextDeadline.toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getRiskColor(framework.violations > 3 ? 'HIGH' : framework.violations > 1 ? 'MEDIUM' : 'LOW')}>
                      {framework.violations} violations
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Compliance Progress</span>
                        <span>{formatPercentage(framework.compliance)}</span>
                      </div>
                      <Progress value={framework.compliance} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Active Actions</p>
                        <p className="font-semibold">{framework.actions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Violations</p>
                        <p className="font-semibold text-red-600">{framework.violations}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Next Deadline</p>
                        <p className="font-semibold">{framework.nextDeadline.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Geographic Compliance
                </CardTitle>
                <CardDescription>
                  Compliance status by EU member state
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.geographicCompliance.map((country) => (
                    <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {COUNTRY_FLAGS[country.country as keyof typeof COUNTRY_FLAGS] || '🇪🇺'}
                        </span>
                        <div>
                          <p className="font-medium">{country.country}</p>
                          <p className="text-sm text-gray-600">
                            Next action: {country.nextAction.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatPercentage(country.compliance)}</p>
                        <Badge 
                          variant="outline" 
                          className={country.issues.length > 2 ? 'border-red-300 text-red-700' : 'border-green-300 text-green-700'}
                        >
                          {country.issues.length} issues
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Multi-language Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-purple-600" />
                  Multi-language Compliance
                </CardTitle>
                <CardDescription>
                  Advisory translations and cultural adaptations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Languages className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-900">7</p>
                      <p className="text-sm text-purple-700">Languages Supported</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-900">15</p>
                      <p className="text-sm text-blue-700">Cultural Adaptations</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {['German', 'French', 'Spanish', 'Italian', 'Dutch'].map((language, index) => (
                      <div key={language} className="flex items-center justify-between">
                        <span className="text-sm">{language}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85 + Math.random() * 15} className="w-20 h-2" />
                          <span className="text-sm text-gray-600">
                            {Math.round(85 + Math.random() * 15)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6">
          <div className="grid gap-6">
            {dashboardData.sectorCompliance.map((sector) => (
              <Card key={sector.sector}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-indigo-600" />
                      {sector.sector.charAt(0).toUpperCase() + sector.sector.slice(1)} Sector
                    </CardTitle>
                    <Badge className={getRiskColor(sector.riskLevel)}>
                      {sector.riskLevel} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Sector Compliance</span>
                        <span>{formatPercentage(sector.compliance)}</span>
                      </div>
                      <Progress value={sector.compliance} className="h-3" />
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Specific Requirements:</p>
                      <div className="space-y-1">
                        {sector.specificRequirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6">
            {/* Detailed Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Compliance Trends Analysis
                </CardTitle>
                <CardDescription>
                  Historical compliance performance and projections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={dashboardData.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="compliance" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Compliance %"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="violations" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Violations"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="penalties" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Penalties (€)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Flag className="h-5 w-5" />
                    Strategic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.recommendations.strategic.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Users className="h-5 w-5" />
                    Operational
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.recommendations.operational.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600">
                    <Zap className="h-5 w-5" />
                    Technical
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.recommendations.technical.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}