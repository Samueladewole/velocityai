import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload,
  FileText,
  File,
  Download,
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Target,
  ArrowRight,
  Sparkles,
  Settings,
  BarChart3,
  Activity,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit3,
  Share,
  Trash2
} from 'lucide-react';

interface Questionnaire {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'word';
  uploadDate: string;
  status: 'processing' | 'completed' | 'failed' | 'pending_review';
  questionsTotal: number;
  questionsAnswered: number;
  confidenceScore: number;
  industry: string;
  framework: string[];
}

interface QuestionnaireAnswer {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  evidenceAttached: boolean;
  reviewRequired: boolean;
  category: string;
}

export const QIEEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [dragOver, setDragOver] = useState(false);
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<string | null>(null);

  // Sample data
  const questionnaires: Questionnaire[] = [
    {
      id: 'q1',
      name: 'TISAX Security Assessment',
      type: 'pdf',
      uploadDate: '2024-01-15',
      status: 'completed',
      questionsTotal: 247,
      questionsAnswered: 238,
      confidenceScore: 94,
      industry: 'Automotive',
      framework: ['TISAX', 'ISO 27001']
    },
    {
      id: 'q2',
      name: 'SOC 2 Vendor Assessment',
      type: 'excel',
      uploadDate: '2024-01-14',
      status: 'processing',
      questionsTotal: 156,
      questionsAnswered: 89,
      confidenceScore: 87,
      industry: 'Technology',
      framework: ['SOC 2', 'NIST']
    },
    {
      id: 'q3',
      name: 'GDPR Privacy Questionnaire',
      type: 'word',
      uploadDate: '2024-01-13',
      status: 'pending_review',
      questionsTotal: 89,
      questionsAnswered: 89,
      confidenceScore: 96,
      industry: 'Financial Services',
      framework: ['GDPR', 'ISO 27701']
    }
  ];

  const sampleAnswers: QuestionnaireAnswer[] = [
    {
      id: 'a1',
      question: 'Does your organization have a documented information security policy?',
      answer: 'Yes, we maintain a comprehensive information security policy that is reviewed annually and approved by senior management. The policy covers all aspects of information security including access control, data classification, and incident response.',
      confidence: 98,
      evidenceAttached: true,
      reviewRequired: false,
      category: 'Policy & Governance'
    },
    {
      id: 'a2',
      question: 'How do you ensure secure software development practices?',
      answer: 'We implement secure coding practices including code reviews, static analysis, dependency scanning, and security testing in our CI/CD pipeline. All developers receive secure coding training annually.',
      confidence: 92,
      evidenceAttached: true,
      reviewRequired: false,
      category: 'Development Security'
    },
    {
      id: 'a3',
      question: 'What encryption standards do you use for data at rest?',
      answer: 'We use AES-256 encryption for all data at rest, with encryption keys managed through AWS KMS with automatic rotation. Database encryption is enabled for all production systems.',
      confidence: 85,
      evidenceAttached: false,
      reviewRequired: true,
      category: 'Data Protection'
    }
  ];

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  }, []);

  const processFiles = (files: File[]) => {
    files.forEach(file => {
      const fileId = Math.random().toString(36).substr(2, 9);
      setProcessingFiles(prev => [...prev, fileId]);
      
      // Simulate AI processing
      setTimeout(() => {
        setProcessingFiles(prev => prev.filter(id => id !== fileId));
      }, 3000 + Math.random() * 2000);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'pending_review':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'pending_review':
        return <AlertTriangle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'excel':
        return <File className="h-5 w-5 text-green-500" />;
      case 'word':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              QIE - Questionnaire Intelligence Engine
            </h1>
            <p className="text-slate-600">
              AI-powered questionnaire automation with 95% time reduction and intelligent evidence matching
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold erip-text-gradient mb-1">
              96%
            </div>
            <div className="text-sm text-slate-600">AI Confidence</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Questionnaires Processed</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-xs text-slate-500 mt-2">
                This month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Time Saved</p>
                  <p className="text-2xl font-bold">847h</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-xs text-slate-500 mt-2">
                95% reduction
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Auto-Answers</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <Progress value={92} className="mt-2 h-1" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Accuracy Rate</p>
                  <p className="text-2xl font-bold">98.5%</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Expert validated
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="upload">Upload & Process</TabsTrigger>
          <TabsTrigger value="questionnaires">My Questionnaires</TabsTrigger>
          <TabsTrigger value="answers">Review Answers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload">
          <div className="space-y-6">
            {/* File Upload Zone */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Upload Security Questionnaire
                </CardTitle>
                <p className="text-sm text-slate-600">
                  Supported formats: PDF, Excel (.xlsx, .xls), Word (.docx, .doc)
                </p>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                >
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-slate-900">
                        Drop your questionnaire here
                      </h3>
                      <p className="text-slate-600">
                        or click to browse your files
                      </p>
                    </div>

                    <div>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.xlsx,.xls,.docx,.doc"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button className="erip-gradient-primary cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Files
                        </Button>
                      </label>
                    </div>

                    <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        PDF
                      </div>
                      <div className="flex items-center gap-1">
                        <File className="h-4 w-4" />
                        Excel
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Word
                      </div>
                    </div>
                  </div>
                </div>

                {/* Processing Files */}
                {processingFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-slate-900">Processing Files</h4>
                    {processingFiles.map((fileId) => (
                      <div key={fileId} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">Analyzing questionnaire...</div>
                          <div className="text-xs text-slate-600">
                            Extracting questions, mapping to Trust Equity data, generating answers
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">
                          Processing
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Powered Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                    <Search className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-medium mb-2">Question Extraction</h4>
                    <p className="text-sm text-slate-600">
                      Advanced OCR and NLP to identify questions across any format
                    </p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-medium mb-2">Smart Matching</h4>
                    <p className="text-sm text-slate-600">
                      Matches questions to existing Trust Equity evidence and policies
                    </p>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <Zap className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-medium mb-2">Auto-Generation</h4>
                    <p className="text-sm text-slate-600">
                      Generates contextual answers with supporting evidence links
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Questionnaires Tab */}
        <TabsContent value="questionnaires">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Questionnaires</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {questionnaires.map((questionnaire) => (
                <Card key={questionnaire.id} className="card-professional">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                          {getFileIcon(questionnaire.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 mb-1">
                            {questionnaire.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                            <span>Uploaded: {questionnaire.uploadDate}</span>
                            <span>•</span>
                            <span>{questionnaire.industry}</span>
                            <span>•</span>
                            <span>{questionnaire.questionsTotal} questions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {questionnaire.framework.map((fw) => (
                              <Badge key={fw} variant="outline" className="text-xs">
                                {fw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge className={getStatusColor(questionnaire.status)}>
                          {getStatusIcon(questionnaire.status)}
                          <span className="ml-1 capitalize">
                            {questionnaire.status.replace('_', ' ')}
                          </span>
                        </Badge>
                        <div className="mt-2 text-sm text-slate-600">
                          {questionnaire.questionsAnswered}/{questionnaire.questionsTotal} answered
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                          {questionnaire.confidenceScore}% confidence
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Progress 
                              value={(questionnaire.questionsAnswered / questionnaire.questionsTotal) * 100} 
                              className="w-20 h-2" 
                            />
                            <span className="text-slate-600">Progress</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedQuestionnaire(questionnaire.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Answers Tab */}
        <TabsContent value="answers">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Generated Answers - TISAX Security Assessment</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter by Category
                </Button>
                <Button className="erip-gradient-primary" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Responses
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {sampleAnswers.map((answer) => (
                <Card key={answer.id} className="card-professional">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {answer.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm">
                              <span className="text-slate-600">Confidence:</span>
                              <span className="font-medium text-blue-600">{answer.confidence}%</span>
                            </div>
                          </div>
                          <h4 className="font-medium text-slate-900 mb-3">
                            {answer.question}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {answer.evidenceAttached && (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Evidence
                            </Badge>
                          )}
                          {answer.reviewRequired && (
                            <Badge className="bg-yellow-100 text-yellow-700">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Review
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-slate-700 leading-relaxed">
                          {answer.answer}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4">
                          <Progress value={answer.confidence} className="w-24 h-2" />
                          <span className="text-sm text-slate-600">
                            AI Confidence: {answer.confidence}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-lg">Processing Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Average Processing Time</span>
                      <span className="font-medium">4.2 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Manual Time Saved</span>
                      <span className="font-medium text-green-600">95%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Questions per Hour</span>
                      <span className="font-medium">847</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-lg">Accuracy Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Overall Accuracy</span>
                      <span className="font-medium">98.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Expert Validation Rate</span>
                      <span className="font-medium text-blue-600">96.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Auto-Approval Rate</span>
                      <span className="font-medium">89%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-lg">Trust Equity Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Trust Score Boost</span>
                      <span className="font-medium text-blue-600">+23%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Evidence Coverage</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Compliance Acceleration</span>
                      <span className="font-medium text-green-600">7.2x</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                QIE has processed 2,847 questionnaires this quarter, saving an estimated 8,450 hours 
                of manual work and accelerating compliance activities by 720%.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};