import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  IntelligentAssessmentEngine
} from '@/services/assessmentEngine';
import type { 
  OrganizationProfile, 
  AssessmentQuestion, 
  AssessmentResponse, 
  AssessmentResult
} from '@/services/assessmentEngine';
import {
  Brain,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Download,
  ArrowRight,
  ArrowLeft,
  Target,
  Shield,
  Clock,
  Zap,
  Eye,
  BarChart3
} from 'lucide-react';

interface IntelligentAssessmentProps {
  onComplete?: (result: AssessmentResult) => void;
  initialProfile?: Partial<OrganizationProfile>;
}

const IntelligentAssessment: React.FC<IntelligentAssessmentProps> = ({
  onComplete,
  initialProfile
}) => {
  const [engine] = useState(() => new IntelligentAssessmentEngine());
  const [sessionId, setSessionId] = useState<string>('');
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(null);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [confidence, setConfidence] = useState<number>(80);
  const [progress, setProgress] = useState<number>(0);
  const [stage, setStage] = useState<'setup' | 'assessment' | 'results'>('setup');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [intermediateResults, setIntermediateResults] = useState<Partial<AssessmentResult> | null>(null);

  // Organization setup form state
  const [orgData, setOrgData] = useState({
    industry: initialProfile?.industry || '',
    size: initialProfile?.size || 'medium',
    geography: initialProfile?.geography || ['US'],
    businessModel: initialProfile?.businessModel || '',
    dataHandling: initialProfile?.dataHandling || [],
    riskAppetite: initialProfile?.riskAppetite || 'medium',
    complianceMaturity: initialProfile?.complianceMaturity || 50,
    existingFrameworks: initialProfile?.existingFrameworks || []
  });

  const startAssessment = () => {
    setIsLoading(true);
    try {
      const { sessionId: newSessionId, profile: newProfile, firstQuestion } = 
        engine.startAssessment(orgData);
      
      setSessionId(newSessionId);
      setProfile(newProfile);
      setCurrentQuestion(firstQuestion);
      setStage('assessment');
      setProgress(0);
    } catch (error) {
      console.error('Failed to start assessment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitResponse = () => {
    if (!currentQuestion || !profile || currentAnswer === null) return;

    setIsLoading(true);
    try {
      const response: AssessmentResponse = {
        questionId: currentQuestion.id,
        answer: currentAnswer,
        confidence,
        timestamp: new Date(),
        context: {}
      };

      const { nextQuestion, progress: newProgress, intermediateResults: intermediate } = 
        engine.processResponse(sessionId, profile, responses, response);

      setResponses(prev => [...prev, response]);
      setCurrentQuestion(nextQuestion);
      setProgress(newProgress);
      setCurrentAnswer(null);
      setConfidence(80);

      if (intermediate) {
        setIntermediateResults(intermediate);
      }

      // Complete assessment if no more questions
      if (!nextQuestion) {
        completeAssessment([...responses, response]);
      }
    } catch (error) {
      console.error('Failed to process response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeAssessment = (allResponses: AssessmentResponse[]) => {
    if (!profile) return;

    setIsLoading(true);
    try {
      const finalResult = engine.completeAssessment(sessionId, profile, allResponses);
      setResult(finalResult);
      setStage('results');
      setProgress(100);
      
      if (onComplete) {
        onComplete(finalResult);
      }
    } catch (error) {
      console.error('Failed to complete assessment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (answer: any) => {
    setCurrentAnswer(answer);
  };

  const renderSetupForm = () => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100">
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Intelligent Compliance Assessment</CardTitle>
            <CardDescription className="text-lg">
              AI-powered regulatory analysis tailored to your organization
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Organization Profile Form */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <select
              value={orgData.industry}
              onChange={(e) => setOrgData(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Industry</option>
              <option value="financial">Financial Services</option>
              <option value="healthcare">Healthcare</option>
              <option value="technology">Technology</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="education">Education</option>
              <option value="government">Government</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Organization Size</label>
            <select
              value={orgData.size}
              onChange={(e) => setOrgData(prev => ({ ...prev, size: e.target.value as any }))}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="startup">Startup (1-10 employees)</option>
              <option value="small">Small (11-50 employees)</option>
              <option value="medium">Medium (51-250 employees)</option>
              <option value="large">Large (251-1000 employees)</option>
              <option value="enterprise">Enterprise (1000+ employees)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Geographic Presence</label>
            <div className="space-y-2">
              {['US', 'EU', 'UK', 'Canada', 'APAC', 'Global'].map(region => (
                <label key={region} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={orgData.geography.includes(region)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOrgData(prev => ({ 
                          ...prev, 
                          geography: [...prev.geography, region] 
                        }));
                      } else {
                        setOrgData(prev => ({ 
                          ...prev, 
                          geography: prev.geography.filter(g => g !== region) 
                        }));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{region}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Data Handling</label>
            <div className="space-y-2">
              {['personal', 'financial', 'health', 'payment', 'sensitive'].map(type => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={orgData.dataHandling.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOrgData(prev => ({ 
                          ...prev, 
                          dataHandling: [...prev.dataHandling, type] 
                        }));
                      } else {
                        setOrgData(prev => ({ 
                          ...prev, 
                          dataHandling: prev.dataHandling.filter(d => d !== type) 
                        }));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm capitalize">{type} Data</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Compliance Maturity Level: {orgData.complianceMaturity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={orgData.complianceMaturity}
            onChange={(e) => setOrgData(prev => ({ 
              ...prev, 
              complianceMaturity: parseInt(e.target.value) 
            }))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Minimal</span>
            <span>Developing</span>
            <span>Managed</span>
            <span>Optimized</span>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={startAssessment}
            disabled={!orgData.industry || orgData.geography.length === 0 || isLoading}
            className="px-8 py-3 text-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5 mr-2" />
                Start Assessment
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                {currentQuestion.framework} Assessment
              </CardTitle>
              <CardDescription>
                Domain: {currentQuestion.domain.replace('-', ' ').toUpperCase()}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">Progress</div>
              <div className="text-lg font-bold">{Math.round(progress)}%</div>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Question */}
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg €{
                currentQuestion.criticality === 'critical' ? 'bg-red-100 text-red-600' :
                currentQuestion.criticality === 'high' ? 'bg-orange-100 text-orange-600' :
                currentQuestion.criticality === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                {currentQuestion.criticality === 'critical' ? <AlertTriangle className="h-4 w-4" /> :
                 currentQuestion.criticality === 'high' ? <TrendingUp className="h-4 w-4" /> :
                 <CheckCircle className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  {currentQuestion.text}
                </h3>
                {currentQuestion.helpText && (
                  <p className="text-sm text-blue-700 mb-2">{currentQuestion.helpText}</p>
                )}
                {currentQuestion.regulatoryReference && (
                  <p className="text-xs text-blue-600 font-medium">
                    Reference: {currentQuestion.regulatoryReference}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            {currentQuestion.type === 'yes-no' && (
              <div className="flex gap-4">
                <Button
                  variant={currentAnswer === true ? 'default' : 'outline'}
                  onClick={() => handleAnswerChange(true)}
                  className="flex-1 py-6"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Yes
                </Button>
                <Button
                  variant={currentAnswer === false ? 'default' : 'outline'}
                  onClick={() => handleAnswerChange(false)}
                  className="flex-1 py-6"
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  No
                </Button>
              </div>
            )}

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={currentAnswer === option ? 'default' : 'outline'}
                    onClick={() => handleAnswerChange(option)}
                    className="w-full py-4 text-left justify-start"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'scale' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rating: {currentAnswer || 50}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentAnswer || 50}
                    onChange={(e) => handleAnswerChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Poor</span>
                    <span>Fair</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <textarea
                value={currentAnswer || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Please provide details..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            )}
          </div>

          {/* Confidence Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Confidence in Answer: {confidence}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Uncertain</span>
              <span>Confident</span>
              <span>Very Confident</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStage('setup')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Setup
            </Button>
            
            <Button
              onClick={submitResponse}
              disabled={currentAnswer === null || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Next Question
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderResults = () => {
    if (!result) return null;

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Results Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              Assessment Complete
            </CardTitle>
            <CardDescription className="text-lg">
              Comprehensive regulatory compliance analysis for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{result.overallScore}%</div>
                <div className="text-sm text-green-700">Overall Compliance Score</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{result.gaps.length}</div>
                <div className="text-sm text-blue-700">Compliance Gaps Identified</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{result.recommendations.length}</div>
                <div className="text-sm text-purple-700">Actionable Recommendations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Framework Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Framework Compliance Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(result.frameworkScores).map(([framework, score]) => (
                <div key={framework} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{framework}</span>
                    <span className="font-bold">{Math.round(score)}%</span>
                  </div>
                  <Progress value={score} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Gaps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Priority Compliance Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.gaps.slice(0, 5).map((gap, index) => (
                <div key={gap.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{gap.framework}</h4>
                      <p className="text-sm text-slate-600">{gap.requirement}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium €{
                      gap.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      gap.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      gap.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {gap.severity}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>Effort: {gap.effort}</span>
                    <span>Timeline: {gap.timeline}</span>
                    <span>Risk Level: {gap.riskLevel}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Implementation Roadmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Implementation Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {result.roadmap.map((phase, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    {index < result.roadmap.length - 1 && (
                      <div className="w-px h-16 bg-slate-300 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="font-semibold text-slate-900 mb-1">{phase.phase}</h4>
                    <p className="text-sm text-slate-600 mb-3">Timeline: {phase.timeline}</p>
                    <ul className="text-sm text-slate-700 space-y-1">
                      {phase.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center gap-4">
              <Button onClick={() => window.print()}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" onClick={() => setStage('setup')}>
                <Zap className="h-4 w-4 mr-2" />
                New Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderIntermediateResults = () => {
    if (!intermediateResults || stage === 'results') return null;

    return (
      <Card className="mt-6 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            Preliminary Insights
          </CardTitle>
          <CardDescription>
            Based on {responses.length} responses so far
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(intermediateResults.overallScore || 0)}%
              </div>
              <div className="text-sm text-blue-700">Current Compliance Score</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {intermediateResults.gaps?.length || 0}
              </div>
              <div className="text-sm text-red-700">Gaps Identified</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {stage === 'setup' && renderSetupForm()}
      {stage === 'assessment' && (
        <>
          {renderQuestion()}
          {renderIntermediateResults()}
        </>
      )}
      {stage === 'results' && renderResults()}
    </div>
  );
};

export default IntelligentAssessment;