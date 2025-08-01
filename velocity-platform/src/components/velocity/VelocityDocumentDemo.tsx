/**
 * Velocity AI Document Management Demo
 * Showcases advanced export, upload, and email capabilities
 */
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  Upload,
  Mail,
  FileText,
  Table,
  Image,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Settings,
  Zap,
  Brain,
  Shield,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  Globe,
  Eye,
  Star
} from 'lucide-react';

import { ExportSystem } from '@/components/templates/ExportSystem';
import { QuestionnaireUpload } from '@/components/qie/QuestionnaireUpload';

interface DocumentDemoProps {
  className?: string;
}

const DEMO_DATA = {
  organization_name: "Velocity Demo Corp",
  trust_score: {
    current: 89,
    target: 95,
    trend: "+5.2",
    last_updated: new Date().toISOString()
  },
  agents: {
    total: 12,
    active: 10,
    success_rate: 94,
    agents_list: [
      {
        id: "agent_1",
        name: "AWS Security Scanner",
        platform: "aws",
        framework: "soc2",
        status: "active",
        success_rate: 97,
        evidence_collected: 145,
        last_run: new Date().toISOString()
      },
      {
        id: "agent_2", 
        name: "Azure Compliance Monitor",
        platform: "azure",
        framework: "iso27001",
        status: "active",
        success_rate: 92,
        evidence_collected: 98,
        last_run: new Date().toISOString()
      }
    ]
  },
  evidence: {
    total_collected: 1247,
    today_collected: 23,
    automation_rate: 87
  },
  frameworks: {
    soc2: {
      evidence_count: 456,
      verified_count: 398,
      progress: 87,
      active_agents: 4
    },
    iso27001: {
      evidence_count: 321,
      verified_count: 267,
      progress: 83,
      active_agents: 3
    },
    gdpr: {
      evidence_count: 234,
      verified_count: 201,
      progress: 86,
      active_agents: 2
    }
  }
};

const EXPORT_FORMATS = [
  {
    format: 'pdf',
    name: 'PDF Report',
    description: 'Professional compliance report with charts and executive summary',
    icon: FileText,
    color: 'bg-red-100 text-red-700',
    features: ['Executive Summary', 'Charts & Graphs', 'Professional Layout', 'Print Ready']
  },
  {
    format: 'xlsx',
    name: 'Excel Workbook',
    description: 'Interactive spreadsheet with multiple worksheets and analysis',
    icon: Table,
    color: 'bg-green-100 text-green-700',
    features: ['Multiple Sheets', 'Data Analysis', 'Charts', 'Formulas']
  },
  {
    format: 'docx',
    name: 'Word Document',
    description: 'Formatted document with professional styling',
    icon: FileText,
    color: 'bg-blue-100 text-blue-700',
    features: ['Professional Layout', 'Table of Contents', 'Headers/Footers', 'Rich Formatting']
  },
  {
    format: 'pptx',
    name: 'PowerPoint Slides',
    description: 'Executive presentation with key metrics and insights',
    icon: Image,
    color: 'bg-orange-100 text-orange-700',
    features: ['Executive Slides', 'Visual Charts', 'Brand Consistent', 'Presentation Ready']
  },
  {
    format: 'html',
    name: 'Interactive Report',
    description: 'Web-based report with interactive elements',
    icon: Globe,
    color: 'bg-purple-100 text-purple-700',
    features: ['Interactive', 'Web-based', 'Responsive', 'Shareable Links']
  }
];

const EMAIL_TEMPLATES = [
  {
    id: 'compliance_report',
    name: 'Compliance Report',
    description: 'Professional compliance report email with key metrics',
    preview: 'Executive summary with trust score, evidence count, and automation metrics'
  },
  {
    id: 'assessment_complete',
    name: 'Assessment Complete',
    description: 'Notification when compliance assessment is finished',
    preview: 'Congratulations message with assessment results and next steps'
  },
  {
    id: 'monthly_summary',
    name: 'Monthly Summary',
    description: 'Monthly compliance status update',
    preview: 'Monthly progress report with key achievements and upcoming tasks'
  }
];

export const VelocityDocumentDemo: React.FC<DocumentDemoProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [exportProgress, setExportProgress] = useState<Record<string, number>>({});
  const [emailStatus, setEmailStatus] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState('compliance_report');
  const [emailAddresses, setEmailAddresses] = useState('demo@velocity.ai');

  const handleExport = useCallback(async (format: string) => {
    setExportProgress(prev => ({ ...prev, [format]: 0 }));
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        const current = prev[format] || 0;
        if (current >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [format]: Math.min(current + 20, 100) };
      });
    }, 500);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      console.log(`Export completed: €{format}`);
    } catch (error) {
      console.error(`Export failed: €{format}`, error);
    }
  }, []);

  const handleEmailSend = useCallback(async () => {
    setEmailStatus('sending');
    
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailStatus('sent');
      setTimeout(() => setEmailStatus(''), 3000);
    } catch (error) {
      setEmailStatus('error');
      setTimeout(() => setEmailStatus(''), 3000);
    }
  }, []);

  const exportConfig = {
    enabled: true,
    formats: ['pdf', 'xlsx', 'docx', 'pptx', 'html', 'csv', 'json'] as const,
    filename: 'velocity-compliance-report'
  };

  const sharingConfig = {
    enabled: true,
    publicUrl: 'https://app.velocity.ai/shared/demo-report',
    qrCode: true,
    socialMedia: ['linkedin', 'twitter', 'email'] as const,
    accessControls: {
      requireAuth: false,
      expiration: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }
  };

  return (
    <div className={`max-w-7xl mx-auto space-y-8 €{className || ''}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Advanced Document Management
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Experience Velocity's comprehensive document management capabilities including professional exports, 
          intelligent uploads, and automated email delivery.
        </p>
      </div>

      {/* Feature Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Professional Exports</CardTitle>
            <CardDescription>
              Generate professional documents in multiple formats with charts, branding, and executive summaries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">PDF Reports</Badge>
              <Badge variant="secondary">Excel Workbooks</Badge>
              <Badge variant="secondary">Word Docs</Badge>
              <Badge variant="secondary">PowerPoint</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Brain className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">AI-Powered Upload</CardTitle>
            <CardDescription>
              Upload questionnaires and let AI extract questions, categorize by framework, and detect duplicates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">99% Accuracy</Badge>
              <Badge variant="secondary">Auto-Categorize</Badge>
              <Badge variant="secondary">Duplicate Detection</Badge>
              <Badge variant="secondary">Smart Mapping</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Email Automation</CardTitle>
            <CardDescription>
              Send professional emails with templates, attachments, and automated delivery to stakeholders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Templates</Badge>
              <Badge variant="secondary">Bulk Send</Badge>
              <Badge variant="secondary">Attachments</Badge>
              <Badge variant="secondary">Tracking</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Documents
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload & Process
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Delivery
          </TabsTrigger>
        </TabsList>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Professional Document Export
              </CardTitle>
              <CardDescription>
                Generate professional compliance documents with advanced formatting, charts, and executive summaries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {EXPORT_FORMATS.map((format) => {
                  const Icon = format.icon;
                  const progress = exportProgress[format.format] || 0;
                  const isExporting = progress > 0 && progress < 100;
                  const isCompleted = progress === 100;

                  return (
                    <div
                      key={format.format}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center €{format.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{format.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{format.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {format.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {isExporting && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Generating...</span>
                            <span className="text-blue-600">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `€{progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <Button
                        className="w-full"
                        variant={isCompleted ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleExport(format.format)}
                        disabled={isExporting}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Download Ready
                          </>
                        ) : isExporting ? (
                          <>
                            <Clock className="h-4 w-4 mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Export {format.name}
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Export All Button */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Export All Formats</h3>
                    <p className="text-sm text-gray-600">Generate all document formats simultaneously</p>
                  </div>
                  <Button
                    onClick={() => EXPORT_FORMATS.forEach(f => handleExport(f.format))}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Export System */}
          <ExportSystem
            title="Velocity Compliance Report"
            data={DEMO_DATA}
            exportConfig={exportConfig}
            sharingConfig={sharingConfig}
            onExport={(format, success) => console.log(`Export €{format}: €{success ? 'success' : 'failed'}`)}
            onShare={(platform, url) => console.log(`Shared on €{platform}: €{url}`)}
          />
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <QuestionnaireUpload
            onUploadComplete={(questionnaire) => {
              console.log('Questionnaire uploaded:', questionnaire);
            }}
            onEvent={(event) => {
              console.log('QIE Event:', event);
            }}
            maxFiles={10}
            maxSize={100}
          />

          {/* Upload Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                AI Processing Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Advanced Question Extraction</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      99% accuracy using advanced NLP models
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Supports PDF, Word, Excel, and CSV formats
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Intelligent question parsing and cleanup
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Multi-language support (English, Spanish, French)
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Smart Categorization</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      Auto-map to compliance frameworks (SOC2, ISO27001, GDPR)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      Detect and merge duplicate questions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      Generate evidence requirements automatically
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      Create intelligent answer suggestions
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Email Composition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Email Composition
                </CardTitle>
                <CardDescription>
                  Send professional compliance reports with customizable templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template">Email Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EMAIL_TEMPLATES.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    {EMAIL_TEMPLATES.find(t => t.id === selectedTemplate)?.preview}
                  </p>
                </div>

                <div>
                  <Label htmlFor="recipients">Recipients</Label>
                  <Textarea
                    id="recipients"
                    placeholder="Enter email addresses separated by commas"
                    value={emailAddresses}
                    onChange={(e) => setEmailAddresses(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="attach-pdf" defaultChecked />
                      <Label htmlFor="attach-pdf" className="text-sm">PDF Report</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="attach-excel" />
                      <Label htmlFor="attach-excel" className="text-sm">Excel Data</Label>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleEmailSend}
                  disabled={emailStatus === 'sending'}
                  className="w-full"
                >
                  {emailStatus === 'sending' ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Sending...
                    </>
                  ) : emailStatus === 'sent' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Email Sent!
                    </>
                  ) : emailStatus === 'error' ? (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Failed to Send
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Template Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Template Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded">
                    <h2 className="text-xl font-bold">Velocity AI Compliance Report</h2>
                    <p className="opacity-90">Velocity Demo Corp - {new Date().toLocaleDateString()}</p>
                  </div>
                  
                  <div className="p-4 bg-white rounded">
                    <h3 className="font-semibold mb-2">Executive Summary</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your compliance assessment has been completed. Here are the key highlights:
                    </p>
                    
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">89</div>
                        <div className="text-xs text-gray-600">Trust Score</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">1,247</div>
                        <div className="text-xs text-gray-600">Evidence Items</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">87%</div>
                        <div className="text-xs text-gray-600">Automation</div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Advanced Email Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">Bulk Sending</h3>
                  <p className="text-sm text-gray-600">
                    Send to multiple recipient groups with personalized content and variables.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-2">Delivery Tracking</h3>
                  <p className="text-sm text-gray-600">
                    Track opens, clicks, and engagement with detailed analytics and reporting.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-2">Enterprise Security</h3>
                  <p className="text-sm text-gray-600">
                    Encrypted delivery, access controls, and compliance with data protection regulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VelocityDocumentDemo;