import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Shield,
  Clock,
  Filter,
  Share2,
  Eye,
  Printer,
  Mail,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  PieChart,
  Activity
} from 'lucide-react';

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('executive');

  const executiveMetrics = [
    {
      label: 'Overall Trust Score',
      value: 87,
      change: '+5%',
      trend: 'up',
      period: 'vs last month'
    },
    {
      label: 'Compliance Coverage',
      value: 92,
      change: '+8%',
      trend: 'up',
      period: 'vs last quarter'
    },
    {
      label: 'Risk Reduction',
      value: 73,
      change: '-12%',
      trend: 'down',
      period: 'risks mitigated'
    },
    {
      label: 'ROI Generated',
      value: '€2.3M',
      change: '+23%',
      trend: 'up',
      period: 'this year'
    }
  ];

  const recentReports = [
    {
      name: 'Q4 2025 Executive Summary',
      type: 'Executive',
      generated: '2 days ago',
      status: 'Ready',
      size: '2.4 MB'
    },
    {
      name: 'ISO 27001 Compliance Report',
      type: 'Compliance',
      generated: '1 week ago',
      status: 'Ready',
      size: '5.1 MB'
    },
    {
      name: 'December Risk Assessment',
      type: 'Risk',
      generated: '2 weeks ago',
      status: 'Ready',
      size: '3.8 MB'
    },
    {
      name: 'GDPR Audit Trail',
      type: 'Audit',
      generated: '3 weeks ago',
      status: 'Ready',
      size: '1.9 MB'
    }
  ];

  const reportTemplates = [
    {
      name: 'Executive Dashboard',
      description: 'High-level metrics and KPIs for leadership',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      frequency: 'Monthly'
    },
    {
      name: 'Compliance Status',
      description: 'Framework compliance and gap analysis',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      frequency: 'Quarterly'
    },
    {
      name: 'Risk Register',
      description: 'Current risks and mitigation status',
      icon: AlertTriangle,
      color: 'from-orange-500 to-orange-600',
      frequency: 'Weekly'
    },
    {
      name: 'Trust Score Analysis',
      description: 'Detailed trust metrics breakdown',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      frequency: 'Monthly'
    }
  ];

  const scheduledReports = [
    {
      name: 'Weekly Risk Digest',
      recipients: ['ciso@company.com', 'cfo@company.com'],
      frequency: 'Every Monday',
      nextRun: 'In 3 days',
      status: 'Active'
    },
    {
      name: 'Monthly Compliance Report',
      recipients: ['compliance@company.com'],
      frequency: 'First day of month',
      nextRun: 'In 5 days',
      status: 'Active'
    },
    {
      name: 'Quarterly Board Report',
      recipients: ['board@company.com'],
      frequency: 'Quarterly',
      nextRun: 'In 2 weeks',
      status: 'Active'
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
            <p className="text-slate-600">Generate insights and track your security posture over time</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {executiveMetrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {typeof metric.value === 'number' ? `€{metric.value}%` : metric.value}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {metric.trend === 'up' ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-medium €{
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-xs text-slate-500">{metric.period}</span>
                    </div>
                  </div>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-8 w-8 text-green-600 opacity-20" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-red-600 opacity-20" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="executive">Executive Summary</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-6">
          {/* Executive Dashboard Preview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Executive Dashboard</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trust Score Trend */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900">Trust Score Trend</h3>
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <Activity className="h-12 w-12 text-blue-600 opacity-50" />
                  </div>
                </div>

                {/* Risk Distribution */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900">Risk Distribution</h3>
                  <div className="h-48 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center">
                    <PieChart className="h-12 w-12 text-orange-600 opacity-50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Templates */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Generate Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <div key={template.name} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className={`p-3 rounded-lg bg-gradient-to-r €{template.color} text-white`}>
                      <template.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-slate-900">{template.name}</h3>
                      <p className="text-sm text-slate-600">{template.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary">{template.frequency}</Badge>
                        <Button size="sm" variant="ghost">
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Recent Reports */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Reports</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.name} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-slate-400" />
                      <div>
                        <h3 className="font-semibold text-slate-900">{report.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>{report.type}</span>
                          <span>•</span>
                          <span>{report.generated}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-600">
                        {report.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          {/* Scheduled Reports */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.name} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-4">
                      <Clock className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-slate-900">{report.name}</h3>
                        <p className="text-sm text-slate-600">
                          To: {report.recipients.join(', ')}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                          <span>{report.frequency}</span>
                          <span>•</span>
                          <span>Next: {report.nextRun}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-600">
                        {report.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Calendar className="h-4 w-4 mr-2" />
                Create New Schedule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Custom Analytics Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Advanced Analytics Coming Soon
                </h3>
                <p className="text-slate-600 mb-6">
                  Build custom reports with drag-and-drop analytics builder
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Request Early Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card className="mt-8 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Export Options</h3>
              <p className="text-sm text-slate-600">
                Export reports in multiple formats for different stakeholders
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};