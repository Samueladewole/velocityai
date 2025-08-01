/**
 * Customer Success Tools
 * 
 * Comprehensive customer success platform featuring:
 * - Customer onboarding tracking and guidance
 * - Success metrics and health scoring
 * - Customer support and help desk
 * - Feature adoption and usage analytics
 * - Customer feedback and survey management
 * - Account management and relationship tracking
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Users,
  TrendingUp,
  TrendingDown,
  Heart,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Award,
  BarChart3,
  Calendar,
  Mail,
  Phone,
  Star,
  Zap,
  BookOpen,
  HelpCircle,
  Send,
  Filter,
  Search,
  Download,
  Upload,
  Settings,
  Bell,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Lightbulb,
  Shield,
  Building2,
  Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Customer {
  id: string
  name: string
  company: string
  email: string
  plan: 'starter' | 'professional' | 'enterprise'
  status: 'onboarding' | 'active' | 'at-risk' | 'churned'
  joinDate: string
  lastActive: string
  trustScore: number
  healthScore: number
  onboardingProgress: number
  industry: string
  companySize: string
  primaryFramework: string
  csm: string
  revenue: number
  usageMetrics: {
    loginCount: number
    featuresUsed: number
    documentsUploaded: number
    integrationsConnected: number
  }
}

interface SupportTicket {
  id: string
  customerId: string
  customerName: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  category: 'technical' | 'billing' | 'feature-request' | 'training' | 'integration'
  createdAt: string
  updatedAt: string
  assignedTo: string
  tags: string[]
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  completedAt?: string
  estimatedTime: string
  category: 'setup' | 'configuration' | 'integration' | 'training'
}

interface HealthMetric {
  name: string
  value: number
  trend: 'up' | 'down' | 'stable'
  change: number
  color: string
}

const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'TechCorp Inc',
    email: 'john@techcorp.com',
    plan: 'enterprise',
    status: 'active',
    joinDate: '2025-11-15',
    lastActive: '2025-01-23T09:30:00Z',
    trustScore: 684,
    healthScore: 87,
    onboardingProgress: 100,
    industry: 'Technology',
    companySize: 'Enterprise',
    primaryFramework: 'SOC 2',
    csm: 'Sarah Johnson',
    revenue: 50000,
    usageMetrics: {
      loginCount: 156,
      featuresUsed: 12,
      documentsUploaded: 45,
      integrationsConnected: 3
    }
  },
  {
    id: '2',
    name: 'Maria Garcia',
    company: 'HealthTech Solutions',
    email: 'maria@healthtech.com',
    plan: 'professional',
    status: 'onboarding',
    joinDate: '2025-01-10',
    lastActive: '2025-01-22T16:45:00Z',
    trustScore: 425,
    healthScore: 72,
    onboardingProgress: 65,
    industry: 'Healthcare',
    companySize: 'Mid-market',
    primaryFramework: 'HIPAA',
    csm: 'Mike Thompson',
    revenue: 25000,
    usageMetrics: {
      loginCount: 23,
      featuresUsed: 6,
      documentsUploaded: 12,
      integrationsConnected: 1
    }
  },
  {
    id: '3',
    name: 'David Chen',
    company: 'FinanceFirst',
    email: 'david@financefirst.com',
    plan: 'enterprise',
    status: 'at-risk',
    joinDate: '2025-09-20',
    lastActive: '2025-01-15T11:20:00Z',
    trustScore: 562,
    healthScore: 45,
    onboardingProgress: 100,
    industry: 'Financial Services',
    companySize: 'Enterprise',
    primaryFramework: 'PCI DSS',
    csm: 'Sarah Johnson',
    revenue: 75000,
    usageMetrics: {
      loginCount: 89,
      featuresUsed: 8,
      documentsUploaded: 28,
      integrationsConnected: 2
    }
  }
]

const SAMPLE_TICKETS: SupportTicket[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Smith',
    title: 'Integration with Vanta not syncing',
    description: 'The Vanta integration was working fine but stopped syncing data yesterday. Need help troubleshooting.',
    priority: 'high',
    status: 'in-progress',
    category: 'integration',
    createdAt: '2025-01-22T14:30:00Z',
    updatedAt: '2025-01-22T16:15:00Z',
    assignedTo: 'Technical Support',
    tags: ['vanta', 'integration', 'sync-issue']
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Maria Garcia',
    title: 'Need training on HIPAA risk assessment',
    description: 'Our team needs guidance on how to properly conduct HIPAA risk assessments using the platform.',
    priority: 'medium',
    status: 'open',
    category: 'training',
    createdAt: '2025-01-23T09:15:00Z',
    updatedAt: '2025-01-23T09:15:00Z',
    assignedTo: 'Customer Success',
    tags: ['hipaa', 'training', 'risk-assessment']
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'David Chen',
    title: 'Billing question about enterprise features',
    description: 'Want to understand what additional features are included in our enterprise plan.',
    priority: 'low',
    status: 'resolved',
    category: 'billing',
    createdAt: '2025-01-20T10:45:00Z',
    updatedAt: '2025-01-21T14:20:00Z',
    assignedTo: 'Account Management',
    tags: ['billing', 'enterprise', 'features']
  }
]

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: '1',
    title: 'Complete Company Profile',
    description: 'Set up your organization details and compliance requirements',
    completed: true,
    completedAt: '2025-01-10T10:00:00Z',
    estimatedTime: '5 minutes',
    category: 'setup'
  },
  {
    id: '2',
    title: 'Select Primary Framework',
    description: 'Choose your main compliance framework (SOC 2, GDPR, HIPAA, etc.)',
    completed: true,
    completedAt: '2025-01-10T10:15:00Z',
    estimatedTime: '3 minutes',
    category: 'setup'
  },
  {
    id: '3',
    title: 'Upload Initial Documentation',
    description: 'Add your existing policies, procedures, and compliance documents',
    completed: true,
    completedAt: '2025-01-12T14:30:00Z',
    estimatedTime: '15 minutes',
    category: 'configuration'
  },
  {
    id: '4',
    title: 'Connect First Integration',
    description: 'Link your security tools (Vanta, OneTrust, AWS, etc.) for automated monitoring',
    completed: true,
    completedAt: '2025-01-15T09:45:00Z',
    estimatedTime: '10 minutes',
    category: 'integration'
  },
  {
    id: '5',
    title: 'Complete Initial Assessment',
    description: 'Run your first compliance assessment to establish baseline Trust Score',
    completed: false,
    estimatedTime: '20 minutes',
    category: 'configuration'
  },
  {
    id: '6',
    title: 'Schedule Kickoff Call',
    description: 'Book a session with your Customer Success Manager',
    completed: false,
    estimatedTime: '30 minutes',
    category: 'training'
  },
  {
    id: '7',
    title: 'Invite Team Members',
    description: 'Add your team and set up appropriate access permissions',
    completed: false,
    estimatedTime: '10 minutes',
    category: 'setup'
  },
  {
    id: '8',
    title: 'Configure Compliance Dashboard',
    description: 'Customize your dashboard and set up automated reports',
    completed: false,
    estimatedTime: '15 minutes',
    category: 'configuration'
  }
]

export const CustomerSuccess: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(SAMPLE_CUSTOMERS)
  const [tickets, setTickets] = useState<SupportTicket[]>(SAMPLE_TICKETS)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'technical' as const
  })
  const { toast } = useToast()

  const healthMetrics: HealthMetric[] = [
    { name: 'Customer Health Score', value: 78, trend: 'up', change: 5, color: '#10b981' },
    { name: 'Feature Adoption', value: 82, trend: 'up', change: 8, color: '#3b82f6' },
    { name: 'Support Satisfaction', value: 94, trend: 'stable', change: 0, color: '#8b5cf6' },
    { name: 'Onboarding Completion', value: 73, trend: 'up', change: 12, color: '#f59e0b' }
  ]

  const usageData = [
    { month: 'Jul', logins: 1240, features: 89, documents: 156 },
    { month: 'Aug', logins: 1456, features: 94, documents: 189 },
    { month: 'Sep', logins: 1623, features: 98, documents: 223 },
    { month: 'Oct', logins: 1789, features: 102, documents: 267 },
    { month: 'Nov', logins: 1934, features: 108, documents: 301 },
    { month: 'Dec', logins: 2156, features: 115, documents: 356 },
    { month: 'Jan', logins: 2387, features: 123, documents: 398 }
  ]

  const supportData = [
    { category: 'Technical', count: 45, resolved: 38 },
    { category: 'Training', count: 32, resolved: 29 },
    { category: 'Integration', count: 28, resolved: 25 },
    { category: 'Billing', count: 15, resolved: 14 },
    { category: 'Feature Request', count: 12, resolved: 8 }
  ]

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200'
      case 'onboarding': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'at-risk': return 'text-red-600 bg-red-50 border-red-200'
      case 'churned': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `€{diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `€{Math.floor(diffInMinutes / 60)}h ago`
    return `€{Math.floor(diffInMinutes / 1440)}d ago`
  }

  const completedSteps = ONBOARDING_STEPS.filter(step => step.completed).length
  const onboardingProgress = (completedSteps / ONBOARDING_STEPS.length) * 100

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Customer Success</h1>
          <p className="text-slate-600">
            Monitor customer health, track onboarding progress, and provide exceptional support
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {healthMetrics.map((metric) => (
            <Card key={metric.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{metric.name}</h3>
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    metric.trend === 'up' ? "text-green-600" :
                    metric.trend === 'down' ? "text-red-600" : "text-gray-600"
                  )}>
                    {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                     metric.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                     <div className="w-4 h-1 bg-gray-400 rounded"></div>}
                    {metric.change !== 0 && `€{metric.change > 0 ? '+' : ''}€{metric.change}%`}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-3" style={{ color: metric.color }}>
                  {metric.value}%
                </div>
                <Progress value={metric.value} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Customer Health Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Health Trends</CardTitle>
                  <CardDescription>Monthly customer engagement and usage metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={usageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="features" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Support Ticket Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Support Performance</CardTitle>
                  <CardDescription>Ticket categories and resolution rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={supportData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8b5cf6" />
                        <Bar dataKey="resolved" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Customer Activity</CardTitle>
                <CardDescription>Latest customer interactions and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">TechCorp Inc completed SOC 2 assessment</h4>
                        <p className="text-sm text-slate-600">Trust Score increased to 684 (+23 points)</p>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">HealthTech Solutions added 3 team members</h4>
                        <p className="text-sm text-slate-600">Onboarding progress: 65% complete</p>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">5 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">FinanceFirst hasn't logged in for 8 days</h4>
                        <p className="text-sm text-slate-600">Health score dropped to 45% - intervention needed</p>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers by name, company, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="onboarding">Onboarding</option>
                <option value="at-risk">At Risk</option>
                <option value="churned">Churned</option>
              </select>
            </div>

            {/* Customer List */}
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{customer.name}</h3>
                          <p className="text-slate-600">{customer.company}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                            <span>CSM: {customer.csm}</span>
                            <span>•</span>
                            <span>Last active: {formatLastActive(customer.lastActive)}</span>
                            <span>•</span>
                            <span className="capitalize">{customer.plan} plan</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900">{customer.trustScore}</div>
                          <div className="text-xs text-slate-500">Trust Score</div>
                        </div>
                        <div className="text-center">
                          <div className={cn("text-lg font-bold", getHealthScoreColor(customer.healthScore))}>
                            {customer.healthScore}%
                          </div>
                          <div className="text-xs text-slate-500">Health Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-slate-900">{customer.onboardingProgress}%</div>
                          <div className="text-xs text-slate-500">Onboarding</div>
                        </div>
                        <Badge className={cn("text-xs border", getStatusColor(customer.status))}>
                          {customer.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="onboarding" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Onboarding Progress */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Onboarding Progress</CardTitle>
                    <CardDescription>
                      Track customer onboarding completion across all steps
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm text-slate-600">{completedSteps}/{ONBOARDING_STEPS.length} steps complete</span>
                      </div>
                      <Progress value={onboardingProgress} className="h-3 mb-6" />
                      
                      <div className="space-y-3">
                        {ONBOARDING_STEPS.map((step, index) => (
                          <div key={step.id} className="flex items-center gap-4">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                              step.completed 
                                ? "bg-green-100 text-green-700" 
                                : "bg-slate-100 text-slate-500"
                            )}>
                              {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className={cn(
                                "font-medium",
                                step.completed ? "text-slate-900" : "text-slate-600"
                              )}>
                                {step.title}
                              </h4>
                              <p className="text-sm text-slate-500">{step.description}</p>
                            </div>
                            <div className="text-sm text-slate-500">
                              {step.estimatedTime}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {step.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Onboarding Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Onboarding Resources</CardTitle>
                  <CardDescription>Help customers get started quickly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Getting Started Guide
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Kickoff Call
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Invite Team Members
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuration Wizard
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Support Tickets</h2>
              <Button>
                <HelpCircle className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </div>

            {/* Support Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{tickets.filter(t => t.status === 'open').length}</div>
                      <div className="text-sm text-slate-600">Open Tickets</div>
                    </div>
                    <AlertCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{tickets.filter(t => t.status === 'in-progress').length}</div>
                      <div className="text-sm text-slate-600">In Progress</div>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{tickets.filter(t => t.status === 'resolved').length}</div>
                      <div className="text-sm text-slate-600">Resolved</div>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">4.8</div>
                      <div className="text-sm text-slate-600">Avg Rating</div>
                    </div>
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ticket List */}
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{ticket.title}</h3>
                          <Badge className={cn("text-xs border", getPriorityColor(ticket.priority))}>
                            {ticket.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {ticket.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{ticket.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>Customer: {ticket.customerName}</span>
                          <span>•</span>
                          <span>Assigned to: {ticket.assignedTo}</span>
                          <span>•</span>
                          <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {ticket.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge 
                          className={cn(
                            "text-xs",
                            ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                            ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          )}
                        >
                          {ticket.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Customer Growth */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Growth & Retention</CardTitle>
                  <CardDescription>Monthly new customers and churn rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { month: 'Jul', new: 12, churned: 2 },
                        { month: 'Aug', new: 18, churned: 1 },
                        { month: 'Sep', new: 25, churned: 3 },
                        { month: 'Oct', new: 31, churned: 2 },
                        { month: 'Nov', new: 28, churned: 4 },
                        { month: 'Dec', new: 35, churned: 2 },
                        { month: 'Jan', new: 42, churned: 1 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="new" fill="#10b981" />
                        <Bar dataKey="churned" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Success Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Success Metrics</CardTitle>
                  <CardDescription>Key performance indicators for customer success</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">94%</div>
                      <div className="text-sm text-green-800">Customer Satisfaction</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">73%</div>
                      <div className="text-sm text-blue-800">Onboarding Completion</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">2.3h</div>
                      <div className="text-sm text-purple-800">Avg Response Time</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">€2.3M</div>
                      <div className="text-sm text-orange-800">Annual Revenue</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Net Revenue Retention</span>
                        <span className="font-medium">142%</span>
                      </div>
                      <Progress value={142} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Customer Health Score</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Feature Adoption Rate</span>
                        <span className="font-medium">82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CustomerSuccess