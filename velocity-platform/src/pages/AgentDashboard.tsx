import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AgentGrid } from '@/components/agents/AgentGrid';
import { EvidenceStream } from '@/components/agents/EvidenceStream';
import { 
  Activity, 
  Database, 
  Settings, 
  TrendingUp,
  Zap,
  Shield,
  Play,
  Pause,
  AlertCircle
} from 'lucide-react';

const AgentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agents');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">
                  Velocity AI Dashboard
                </h1>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">
                  10 Agents Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Deploy All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">
                    🤖 AI Agent Automation Center
                  </h2>
                  <p className="text-emerald-100 text-lg">
                    10 AI agents collecting evidence automatically from your cloud infrastructure
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      <span>Cryptographically Verified</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      <span>Real-time Monitoring</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Database className="h-4 w-4" />
                      <span>Multi-Framework Support</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="text-right">
                    <div className="text-4xl font-bold">2,831</div>
                    <div className="text-emerald-100">Evidence Items</div>
                    <div className="text-sm text-emerald-200 mt-2">
                      Collected automatically
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Agent Monitoring
            </TabsTrigger>
            <TabsTrigger value="evidence" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Evidence Stream
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Deployment
            </TabsTrigger>
          </TabsList>

          {/* Agent Monitoring Tab */}
          <TabsContent value="agents" className="space-y-6">
            <AgentGrid />
          </TabsContent>

          {/* Evidence Stream Tab */}
          <TabsContent value="evidence" className="space-y-6">
            <EvidenceStream />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Agent Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 font-medium">Performance Analytics</p>
                      <p className="text-slate-500 text-sm">Coming soon - Real-time agent metrics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Evidence Quality Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Average Confidence Score</span>
                      <span className="font-bold text-emerald-600">96.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Evidence Validated</span>
                      <span className="font-bold text-blue-600">2,431</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Auto-Approved</span>
                      <span className="font-bold text-purple-600">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Manual Review Required</span>
                      <span className="font-bold text-amber-600">5.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    Framework Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>SOC 2</span>
                        <span className="font-medium">98.4%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '98.4%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ISO 27001</span>
                        <span className="font-medium">94.7%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94.7%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>GDPR</span>
                        <span className="font-medium">91.2%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91.2%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>HIPAA</span>
                        <span className="font-medium">87.9%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '87.9%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm font-medium">Agent Health</span>
                      </div>
                      <span className="text-emerald-600 font-bold">Excellent</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">Cloud Connections</span>
                      </div>
                      <span className="text-blue-600 font-bold">All Online</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium">Evidence Processing</span>
                      </div>
                      <span className="text-purple-600 font-bold">Real-time</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Deployment Tab */}
          <TabsContent value="deployment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Deployment Strategies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full h-auto p-4 flex flex-col items-start"
                    variant="outline"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-emerald-600" />
                      <span className="font-semibold">SOC 2 Audit Ready</span>
                    </div>
                    <p className="text-sm text-slate-600 text-left">
                      Deploy 6 agents focused on SOC 2 compliance requirements
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        45 min setup
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        800+ evidence
                      </span>
                    </div>
                  </Button>

                  <Button 
                    className="w-full h-auto p-4 flex flex-col items-start"
                    variant="outline"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Full Automation</span>
                    </div>
                    <p className="text-sm text-slate-600 text-left">
                      Deploy all 10 agents for comprehensive coverage
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        60 min setup
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        1500+ evidence
                      </span>
                    </div>
                  </Button>

                  <Button 
                    className="w-full h-auto p-4 flex flex-col items-start"
                    variant="outline"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold">QIE Focus</span>
                    </div>
                    <p className="text-sm text-slate-600 text-left">
                      Deploy questionnaire processing agents for fast responses
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        15 min setup
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        300+ evidence
                      </span>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cloud Platform Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="font-medium">AWS</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Connected</div>
                        <div className="text-xs text-slate-500">247 evidence items</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">Google Cloud</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Connected</div>
                        <div className="text-xs text-slate-500">156 evidence items</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="font-medium">Microsoft Azure</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Connecting</div>
                        <div className="text-xs text-slate-500">Setup required</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="font-medium">GitHub</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Connected</div>
                        <div className="text-xs text-slate-500">89 evidence items</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentDashboard;