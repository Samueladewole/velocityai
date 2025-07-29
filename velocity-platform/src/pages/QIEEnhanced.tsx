import React, { useState, useCallback } from 'react';
import { ComponentPageTemplate, StatCard, TabConfiguration } from '@/components/templates/ComponentPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
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
  Sparkles,
  Settings,
  BarChart3,
  Activity,
  RefreshCw,
  Search,
  Filter,
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
  evidence: string[];
  needsReview: boolean;
  lastModified: string;
}

export const QIEEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const questionnaires: Questionnaire[] = [
    {
      id: '1',
      name: 'SOC 2 Type II Assessment',
      type: 'pdf',
      uploadDate: '2024-01-15',
      status: 'completed',
      questionsTotal: 156,
      questionsAnswered: 156,
      confidenceScore: 94,
      industry: 'Technology',
      framework: ['SOC 2', 'ISO 27001']
    },
    {
      id: '2', 
      name: 'ISO 27001 Pre-Assessment',
      type: 'excel',
      uploadDate: '2024-01-10',
      status: 'pending_review',
      questionsTotal: 89,
      questionsAnswered: 76,
      confidenceScore: 87,
      industry: 'Healthcare',
      framework: ['ISO 27001', 'HIPAA']
    },
    {
      id: '3',
      name: 'GDPR Compliance Checklist',
      type: 'word',
      uploadDate: '2024-01-08',
      status: 'processing',
      questionsTotal: 112,
      questionsAnswered: 45,
      confidenceScore: 0,
      industry: 'Financial Services',
      framework: ['GDPR', 'PCI DSS']
    }
  ];

  const sampleAnswers: QuestionnaireAnswer[] = [
    {
      id: '1',
      question: 'Does your organization have a documented information security policy?',
      answer: 'Yes, we maintain a comprehensive information security policy that is reviewed annually and approved by senior management. The policy covers all aspects of information security including access controls, incident response, and risk management.',
      confidence: 95,
      evidence: ['Policy Document v2.1', 'Board Approval Minutes', 'Annual Review Log'],
      needsReview: false,
      lastModified: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      question: 'Are security awareness training programs conducted for all employees?',
      answer: 'We conduct quarterly security awareness training for all employees with specialized training for privileged users. Training completion rates are tracked and reported to management.',
      confidence: 88,
      evidence: ['Training Records 2024', 'Completion Reports', 'Specialized Training Materials'],
      needsReview: true,
      lastModified: '2024-01-15T09:15:00Z'
    }
  ];

  // Quick stats for the header
  const quickStats: StatCard[] = [
    {
      label: 'Processing Speed',
      value: '95%',
      change: '+15%',
      trend: 'up',
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      description: 'Time reduction vs manual',
      color: 'text-yellow-600'
    },
    {
      label: 'Confidence Score',
      value: '94%',
      change: '+8%',
      trend: 'up',
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      description: 'AI accuracy rating',
      color: 'text-purple-600'
    },
    {
      label: 'Active Questionnaires',
      value: 12,
      change: '+3',
      trend: 'up',
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      description: 'Currently processing',
      color: 'text-blue-600'
    },
    {
      label: 'Questions Processed',
      value: '2,847',
      change: '+421',
      trend: 'up',
      icon: <Target className="h-6 w-6 text-green-600" />,
      description: 'This month',
      color: 'text-green-600'
    }
  ];

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleProcessStart = useCallback(() => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  }, [selectedFile]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'processing': return 'bg-blue-600';
      case 'pending_review': return 'bg-yellow-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-600" />;
      case 'excel': return <File className="h-5 w-5 text-green-600" />;
      case 'word': return <FileText className="h-5 w-5 text-blue-600" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  // Tab configurations
  const tabs: TabConfiguration[] = [
    {
      id: 'upload',
      label: 'Upload & Process',
      badge: selectedFile ? '1' : undefined,
      content: (
        <div className="space-y-6">
          {/* Upload Section */}
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Questionnaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.xlsx,.xls,.docx,.doc"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-slate-700 mb-2">
                    Drop your questionnaire here or click to browse
                  </p>
                  <p className="text-sm text-slate-500">
                    Supports PDF, Excel, and Word documents up to 10MB
                  </p>
                </label>
              </div>
              
              {selectedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(selectedFile.type)}
                      <div>
                        <p className="font-semibold text-slate-900">{selectedFile.name}</p>
                        <p className="text-sm text-slate-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleProcessStart}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Process with AI
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {isProcessing && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Processing questionnaire...</span>
                        <span>{processingProgress}%</span>
                      </div>
                      <Progress value={processingProgress} className="h-2" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processing Tips */}
          <Card className="card-professional">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">AI-Powered Processing Tips</h3>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Clear, structured documents process faster</li>
                    <li>• Include evidence references for higher confidence scores</li>
                    <li>• Use standard industry frameworks for best results</li>
                    <li>• Review AI-generated answers for accuracy</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'questionnaires',
      label: 'My Questionnaires',
      badge: questionnaires.length,
      content: (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>

          {/* Questionnaires List */}
          <div className="space-y-4">
            {questionnaires.map((q) => (
              <Card key={q.id} className="card-professional hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {getFileIcon(q.type)}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">{q.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                          <span>Uploaded {new Date(q.uploadDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{q.industry}</span>
                          <span>•</span>
                          <span>{q.questionsTotal} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {q.framework.map((framework) => (
                            <Badge key={framework} variant="secondary" className="text-xs">
                              {framework}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(q.status)}>
                          {q.status.replace('_', ' ')}
                        </Badge>
                        {q.status === 'completed' && (
                          <p className="text-sm text-green-600 mt-1">
                            {q.confidenceScore}% confidence
                          </p>
                        )}
                        {q.status === 'processing' && (
                          <div className="mt-2 w-24">
                            <Progress value={(q.questionsAnswered / q.questionsTotal) * 100} className="h-1" />
                            <p className="text-xs text-slate-500 mt-1">
                              {q.questionsAnswered}/{q.questionsTotal}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'review',
      label: 'Review Answers',
      badge: '2',
      content: (
        <div className="space-y-6">
          {/* Review Header */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              2 answers require your review for accuracy and completeness.
            </AlertDescription>
          </Alert>

          {/* Answers to Review */}
          <div className="space-y-4">
            {sampleAnswers.map((answer) => (
              <Card key={answer.id} className="card-professional">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-slate-900 pr-4">{answer.question}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={answer.needsReview ? "destructive" : "default"}>
                          {answer.confidence}% confidence
                        </Badge>
                        {answer.needsReview && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Needs Review
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700">{answer.answer}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Supporting Evidence:</h4>
                      <div className="flex flex-wrap gap-2">
                        {answer.evidence.map((evidence, idx) => (
                          <Badge key={idx} variant="outline" className="text-blue-600 border-blue-600">
                            {evidence}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-500">
                        Last modified: {new Date(answer.lastModified).toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Answer
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: (
        <div className="space-y-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="card-professional">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-slate-900 mb-2">156</div>
                <div className="text-sm text-slate-600">Questions Processed Today</div>
              </CardContent>
            </Card>
            
            <Card className="card-professional">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-slate-900 mb-2">2.3 hrs</div>
                <div className="text-sm text-slate-600">Average Processing Time</div>
              </CardContent>
            </Card>
            
            <Card className="card-professional">
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-slate-900 mb-2">94%</div>
                <div className="text-sm text-slate-600">Average Confidence Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart Placeholder */}
          <Card className="card-professional">
            <CardHeader>
              <CardTitle>Processing Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-600">Performance analytics chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
      <Button 
        onClick={() => navigate('/tools/prism')}
        className="bg-gradient-to-r from-purple-600 to-blue-600"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        AI Process New
      </Button>
    </>
  );

  return (
    <ComponentPageTemplate
      title="QIE - Questionnaire Intelligence Engine"
      subtitle="AI-Powered Questionnaire Automation"
      description="Transform tedious questionnaire completion into an intelligent, automated process with 95% time reduction and industry-leading accuracy."
      trustScore={94}
      trustPoints={2450}
      quickStats={quickStats}
      tabs={tabs}
      actions={headerActions}
      headerGradient="from-purple-50 to-blue-50"
    />
  );
};