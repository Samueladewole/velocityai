/**
 * ERIP Integration Hub
 * 
 * Seamless connections to popular compliance and security tools:
 * - Vanta integration for automated compliance monitoring
 * - OneTrust connector for privacy management
 * - Slack notifications for real-time alerts
 * - Calendar integration for compliance deadlines
 * - Popular security tools integration
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Shield,
  MessageSquare,
  Calendar,
  Database,
  Bell,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Play,
  Pause,
  RefreshCw,
  BarChart3,
  Users,
  Lock,
  Eye,
  Download,
  Upload,
  Globe,
  Server,
  Webhook,
  Key,
  Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface Integration {
  id: string
  name: string
  category: 'Compliance' | 'Security' | 'Communication' | 'Productivity' | 'Monitoring'
  description: string
  status: 'connected' | 'available' | 'configured' | 'error'
  icon: React.ComponentType<any>
  features: string[]
  setupSteps: string[]
  isPopular: boolean
  lastSync?: string
  syncFrequency?: string
  dataPoints?: number
  errorMessage?: string
}

interface ConnectionConfig {
  apiKey?: string
  webhookUrl?: string
  syncEnabled?: boolean
  syncFrequency?: string
  notifications?: {
    slack?: boolean
    email?: boolean
    webhook?: boolean
  }
  dataMapping?: Record<string, string>
}

const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    id: 'vanta',
    name: 'Vanta',
    category: 'Compliance',
    description: 'Automated compliance monitoring and SOC 2 preparation',
    status: 'connected',
    icon: Shield,
    features: [
      'Automated evidence collection',
      'SOC 2 & ISO 27001 monitoring',
      'Real-time compliance scoring',
      'Risk assessment automation'
    ],
    setupSteps: [
      'Connect Vanta API',
      'Configure data mapping',
      'Set sync frequency',
      'Test connection'
    ],
    isPopular: true,
    lastSync: '2025-01-23T10:30:00Z',
    syncFrequency: 'Daily',
    dataPoints: 247
  },
  {
    id: 'onetrust',
    name: 'OneTrust',
    category: 'Compliance',
    description: 'Privacy management and GDPR compliance platform',
    status: 'configured',
    icon: Lock,
    features: [
      'Privacy impact assessments',
      'Data mapping automation',
      'Consent management',
      'Breach notification workflows'
    ],
    setupSteps: [
      'Authenticate OneTrust account',
      'Select data sources',
      'Configure privacy workflows',
      'Enable notifications'
    ],
    isPopular: true,
    lastSync: '2025-01-23T09:15:00Z',
    syncFrequency: 'Real-time',
    dataPoints: 156
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Real-time compliance alerts and team notifications',
    status: 'connected',
    icon: MessageSquare,
    features: [
      'Instant compliance alerts',
      'Risk notification channels',
      'Team collaboration',
      'Custom alert rules'
    ],
    setupSteps: [
      'Install ERIP Slack app',
      'Select notification channels',
      'Configure alert types',
      'Test notifications'
    ],
    isPopular: true,
    lastSync: '2025-01-23T11:45:00Z',
    syncFrequency: 'Real-time',
    dataPoints: 89
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    category: 'Productivity',
    description: 'Compliance deadline tracking and audit scheduling',
    status: 'available',
    icon: Calendar,
    features: [
      'Automated deadline reminders',
      'Audit scheduling',
      'Compliance milestone tracking',
      'Team calendar integration'
    ],
    setupSteps: [
      'Connect Google account',
      'Grant calendar permissions',
      'Select compliance calendars',
      'Configure reminder settings'
    ],
    isPopular: false
  },
  {
    id: 'aws-security-hub',
    name: 'AWS Security Hub',
    category: 'Security',
    description: 'Cloud security posture and findings management',
    status: 'available',
    icon: Server,
    features: [
      'Security findings aggregation',
      'Compliance standard mapping',
      'Automated remediation',
      'Multi-account visibility'
    ],
    setupSteps: [
      'Configure AWS credentials',
      'Enable Security Hub',
      'Set up cross-account access',
      'Configure finding filters'
    ],
    isPopular: true
  },
  {
    id: 'okta',
    name: 'Okta',
    category: 'Security',
    description: 'Identity and access management integration',
    status: 'configured',
    icon: Users,
    features: [
      'User access monitoring',
      'Privileged account tracking',
      'SSO compliance reporting',
      'Identity governance'
    ],
    setupSteps: [
      'Connect Okta org',
      'Configure SCIM provisioning',
      'Set up audit logging',
      'Enable compliance reports'
    ],
    isPopular: true,
    lastSync: '2025-01-23T08:20:00Z',
    syncFrequency: 'Every 4 hours',
    dataPoints: 1247
  },
  {
    id: 'splunk',
    name: 'Splunk',
    category: 'Monitoring',
    description: 'Security information and event management (SIEM)',
    status: 'error',
    icon: BarChart3,
    features: [
      'Log analysis and correlation',
      'Security event monitoring',
      'Compliance reporting',
      'Threat detection'
    ],
    setupSteps: [
      'Configure Splunk forwarder',
      'Set up data inputs',
      'Create compliance dashboards',
      'Configure alerting'
    ],
    isPopular: true,
    errorMessage: 'Connection timeout - check network settings'
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    category: 'Productivity',
    description: 'Office 365 compliance and security monitoring',
    status: 'available',
    icon: Globe,
    features: [
      'Email security monitoring',
      'SharePoint compliance',
      'Teams governance',
      'Compliance center integration'
    ],
    setupSteps: [
      'Register Azure app',
      'Grant admin consent',
      'Configure permissions',
      'Test API access'
    ],
    isPopular: true
  }
]

export const IntegrationHub: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(AVAILABLE_INTEGRATIONS)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig>({})
  const { toast } = useToast()

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || integration.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categoryCounts = {
    all: integrations.length,
    Compliance: integrations.filter(i => i.category === 'Compliance').length,
    Security: integrations.filter(i => i.category === 'Security').length,
    Communication: integrations.filter(i => i.category === 'Communication').length,
    Productivity: integrations.filter(i => i.category === 'Productivity').length,
    Monitoring: integrations.filter(i => i.category === 'Monitoring').length
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const configuredCount = integrations.filter(i => i.status === 'configured').length
  const errorCount = integrations.filter(i => i.status === 'error').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200'
      case 'configured': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />
      case 'configured': return <Settings className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return <Plus className="h-4 w-4" />
    }
  }

  const handleConnect = async (integration: Integration) => {
    setIsConnecting(true)
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIntegrations(prev => 
        prev.map(i => 
          i.id === integration.id 
            ? { 
                ...i, 
                status: 'connected',
                lastSync: new Date().toISOString(),
                syncFrequency: 'Real-time',
                dataPoints: Math.floor(Math.random() * 500) + 50
              }
            : i
        )
      )
      
      toast({
        title: 'Integration Connected',
        description: `Successfully connected ${integration.name}`
      })
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: `Failed to connect to ${integration.name}`,
        variant: 'destructive'
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = (integration: Integration) => {
    setIntegrations(prev =>
      prev.map(i =>
        i.id === integration.id
          ? { ...i, status: 'available', lastSync: undefined, dataPoints: undefined }
          : i
      )
    )
    
    toast({
      title: 'Integration Disconnected',
      description: `${integration.name} has been disconnected`
    })
  }

  const formatLastSync = (timestamp?: string) => {
    if (!timestamp) return 'Never'
    
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Integration Hub</h1>
          <p className="text-slate-600">
            Connect your existing tools to ERIP for seamless compliance automation
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
                  <div className="text-sm text-slate-600">Connected</div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{configuredCount}</div>
                  <div className="text-sm text-slate-600">Configured</div>
                </div>
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{integrations.length}</div>
                  <div className="text-sm text-slate-600">Available</div>
                </div>
                <Database className="h-8 w-8 text-slate-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                  <div className="text-sm text-slate-600">Errors</div>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">All Integrations</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search integrations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category === 'all' ? 'All' : category} ({count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Integration Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => {
                const Icon = integration.icon
                return (
                  <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {integration.category}
                              </Badge>
                              {integration.isPopular && (
                                <Badge className="text-xs bg-yellow-100 text-yellow-800">
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge className={cn("text-xs border", getStatusColor(integration.status))}>
                          {getStatusIcon(integration.status)}
                          <span className="ml-1 capitalize">{integration.status}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">{integration.description}</p>
                      
                      {integration.status === 'error' && (
                        <div className="bg-red-50 p-3 rounded-lg mb-4">
                          <div className="flex items-center gap-2 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Connection Error</span>
                          </div>
                          <p className="text-xs text-red-700 mt-1">{integration.errorMessage}</p>
                        </div>
                      )}

                      {(integration.status === 'connected' || integration.status === 'configured') && (
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Last sync:</span>
                            <span className="font-medium">{formatLastSync(integration.lastSync)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Frequency:</span>
                            <span className="font-medium">{integration.syncFrequency}</span>
                          </div>
                          {integration.dataPoints && (
                            <div className="flex justify-between text-sm">
                              <span>Data points:</span>
                              <span className="font-medium">{integration.dataPoints.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        {integration.status === 'available' && (
                          <Button 
                            className="w-full" 
                            onClick={() => handleConnect(integration)}
                            disabled={isConnecting}
                          >
                            {isConnecting ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Connect
                              </>
                            )}
                          </Button>
                        )}

                        {integration.status === 'error' && (
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleConnect(integration)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Retry
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedIntegration(integration)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                        )}

                        {(integration.status === 'connected' || integration.status === 'configured') && (
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedIntegration(integration)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDisconnect(integration)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Disconnect
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="connected">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Connected Integrations</h2>
              <div className="grid gap-4">
                {integrations
                  .filter(i => i.status === 'connected' || i.status === 'configured')
                  .map((integration) => {
                    const Icon = integration.icon
                    return (
                      <Card key={integration.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Icon className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900">{integration.name}</h3>
                                <p className="text-sm text-slate-600">{integration.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <span>Last sync: {formatLastSync(integration.lastSync)}</span>
                                  <span>•</span>
                                  <span>{integration.dataPoints?.toLocaleString()} data points</span>
                                  <span>•</span>
                                  <span>{integration.syncFrequency}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Data
                              </Button>
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Configure
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="marketplace">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Integration Marketplace</h2>
                <p className="text-slate-600">
                  Coming soon: Browse and install integrations from our marketplace
                </p>
              </div>
              
              <Card className="border-dashed border-2 border-slate-200">
                <CardContent className="p-12 text-center">
                  <Database className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Marketplace Coming Soon
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto mb-6">
                    We're building a comprehensive marketplace with 100+ integrations 
                    including custom connectors, API tools, and enterprise platforms.
                  </p>
                  <Button>
                    <Bell className="h-4 w-4 mr-2" />
                    Notify Me When Available
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Integration Configuration Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <selectedIntegration.icon className="h-6 w-6 text-blue-600" />
                    <CardTitle>Configure {selectedIntegration.name}</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedIntegration(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Setup Steps</h3>
                  <div className="space-y-2">
                    {selectedIntegration.setupSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Features</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedIntegration.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Documentation
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedIntegration(null)}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default IntegrationHub