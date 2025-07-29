/**
 * Hubbard 5-Point Calibration Widget
 * 
 * Interactive interface for creating calibrated estimates using
 * the Hubbard methodology with proper training and validation.
 */
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Target,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Award,
  BarChart3,
  HelpCircle,
  BookOpen,
  Calculator
} from 'lucide-react'
import { 
  HubbardEstimate, 
  ExpertiseLevel, 
  HubbardCalibrationEngine,
  CalibrationSession
} from '@/services/risk/hubbardCalibration'
import { useToast } from '@/hooks/use-toast'

interface HubbardCalibrationWidgetProps {
  parameter: string
  estimator: string
  onEstimateComplete: (estimate: HubbardEstimate) => void
  existingEstimate?: HubbardEstimate
}

export function HubbardCalibrationWidget({
  parameter,
  estimator,
  onEstimateComplete,
  existingEstimate
}: HubbardCalibrationWidgetProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'calibration' | 'estimation' | 'validation'>('intro')
  const [expertise, setExpertise] = useState<ExpertiseLevel>('experienced')
  const [estimate, setEstimate] = useState<Partial<HubbardEstimate>>(
    existingEstimate || {
      p10: undefined,
      p30: undefined,
      p50: undefined,
      p70: undefined,
      p90: undefined,
      confidence: 0.8,
      basisOfEstimate: '',
      assumptions: []
    }
  )
  const [calibrationSession, setCalibrationSession] = useState<CalibrationSession | null>(null)
  const [validationResults, setValidationResults] = useState<any>(null)
  const { toast } = useToast()

  const calibrationEngine = new HubbardCalibrationEngine()

  const handleCalibrationTraining = async () => {
    setCurrentStep('calibration')
    try {
      const session = await calibrationEngine.runCalibrationTraining(estimator, 5)
      setCalibrationSession(session)
      
      const score = session.calibrationExercises.filter(e => e.wasCorrect).length / session.calibrationExercises.length
      
      toast({
        title: 'Calibration Training Complete',
        description: `You achieved ${Math.round(score * 100)}% accuracy. ${score >= 0.8 ? 'Excellent calibration!' : 'Consider wider ranges for better accuracy.'}`
      })
    } catch (error) {
      toast({
        title: 'Calibration Failed',
        description: 'Unable to complete calibration training',
        variant: 'destructive'
      })
    }
  }

  const handleEstimateChange = (field: keyof HubbardEstimate, value: any) => {
    setEstimate(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateAndSubmit = () => {
    if (!estimate.p10 || !estimate.p30 || !estimate.p50 || !estimate.p70 || !estimate.p90) {
      toast({
        title: 'Incomplete Estimate',
        description: 'Please provide all 5 percentile values',
        variant: 'destructive'
      })
      return
    }

    const fullEstimate: HubbardEstimate = {
      id: `hubbard_${Date.now()}`,
      parameter,
      estimator,
      timestamp: new Date(),
      p10: estimate.p10!,
      p30: estimate.p30!,
      p50: estimate.p50!,
      p70: estimate.p70!,
      p90: estimate.p90!,
      confidence: estimate.confidence || 0.8,
      expertise,
      basisOfEstimate: estimate.basisOfEstimate || '',
      assumptions: estimate.assumptions || [],
      rangeWidth: estimate.p90! - estimate.p10!,
      asymmetryRatio: (estimate.p50! - estimate.p10!) / (estimate.p90! - estimate.p50!)
    }

    const validation = calibrationEngine.validateEstimate(fullEstimate)
    setValidationResults(validation)

    if (validation.isValid) {
      setCurrentStep('validation')
      onEstimateComplete(fullEstimate)
      toast({
        title: 'Estimate Complete',
        description: 'Calibrated estimate has been created successfully'
      })
    } else {
      toast({
        title: 'Invalid Estimate',
        description: validation.errors[0],
        variant: 'destructive'
      })
    }
  }

  const formatNumber = (num: number | undefined) => {
    if (!num) return ''
    return num.toLocaleString()
  }

  const getCalibrationScore = () => {
    if (!calibrationSession) return null
    const correct = calibrationSession.calibrationExercises.filter(e => e.wasCorrect).length
    return correct / calibrationSession.calibrationExercises.length
  }

  const getExpertiseColor = (level: ExpertiseLevel) => {
    const colors = {
      novice: 'bg-orange-100 text-orange-800',
      experienced: 'bg-blue-100 text-blue-800',
      expert: 'bg-green-100 text-green-800',
      world_class: 'bg-purple-100 text-purple-800'
    }
    return colors[level]
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Hubbard 5-Point Calibrated Estimation
        </CardTitle>
        <CardDescription>
          Create precise quantitative estimates using the Hubbard calibration methodology
        </CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">Parameter: {parameter}</Badge>
          <Badge className={getExpertiseColor(expertise)} variant="secondary">
            {expertise.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={currentStep} className="space-y-6">
          {/* Introduction */}
          {currentStep === 'intro' && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <BookOpen className="h-16 w-16 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Hubbard Calibrated Estimation</h3>
                <p className="text-gray-600 max-w-2xl">
                  This method uses your calibrated judgment to create precise probability ranges. 
                  The key is to think in terms of confidence ranges, not point estimates.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg">The 5-Point Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">P10:</span>
                        <span>90% confident it's higher than this</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">P30:</span>
                        <span>70% confident it's higher than this</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">P50:</span>
                        <span>50% confident (most likely value)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">P70:</span>
                        <span>70% confident it's lower than this</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">P90:</span>
                        <span>90% confident it's lower than this</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Expertise Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={expertise} onValueChange={(value: ExpertiseLevel) => setExpertise(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="novice">Novice - Limited domain knowledge</SelectItem>
                        <SelectItem value="experienced">Experienced - Good domain knowledge</SelectItem>
                        <SelectItem value="expert">Expert - Deep domain expertise</SelectItem>
                        <SelectItem value="world_class">World Class - Leading expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600 mt-2">
                      Be honest about your expertise level for better calibration.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={handleCalibrationTraining}>
                  <Brain className="h-4 w-4 mr-2" />
                  Start Calibration Training
                </Button>
                <Button onClick={() => setCurrentStep('estimation')}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Skip to Estimation
                </Button>
              </div>
            </div>
          )}

          {/* Calibration Training */}
          {currentStep === 'calibration' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Calibration Training Results</h3>
                <p className="text-gray-600">
                  Review your calibration performance before making estimates
                </p>
              </div>

              {calibrationSession && (
                <div className="space-y-4">
                  {/* Overall Score */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold text-blue-600">
                            {Math.round(getCalibrationScore()! * 100)}%
                          </div>
                          <div className="text-sm text-gray-600">Accuracy Score</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-green-600">
                            {calibrationSession.calibrationExercises.filter(e => e.wasCorrect).length}
                          </div>
                          <div className="text-sm text-gray-600">Correct Estimates</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-orange-600">
                            {calibrationSession.calibrationExercises.filter(e => e.overconfident).length}
                          </div>
                          <div className="text-sm text-gray-600">Overconfident</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Individual Results */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Question Results:</h4>
                    {calibrationSession.calibrationExercises.map((exercise, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${exercise.wasCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {exercise.wasCorrect ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> :
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            }
                            <span className="text-sm font-medium">{exercise.question}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Actual: {exercise.trueValue.toLocaleString()}</span>
                            {exercise.overconfident && (
                              <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-800">
                                Overconfident
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={() => setCurrentStep('estimation')}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Proceed to Estimation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Estimation Interface */}
          {currentStep === 'estimation' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Create Your 5-Point Estimate</h3>
                <p className="text-gray-600">For parameter: <strong>{parameter}</strong></p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="p10">P10 - 90% confident it's higher than this</Label>
                      <Input
                        id="p10"
                        type="number"
                        value={estimate.p10 || ''}
                        onChange={(e) => handleEstimateChange('p10', parseFloat(e.target.value) || undefined)}
                        placeholder="Enter P10 value"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="p30">P30 - 70% confident it's higher than this</Label>
                      <Input
                        id="p30"
                        type="number"
                        value={estimate.p30 || ''}
                        onChange={(e) => handleEstimateChange('p30', parseFloat(e.target.value) || undefined)}
                        placeholder="Enter P30 value"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="p50">P50 - Most likely value (median)</Label>
                      <Input
                        id="p50"
                        type="number"
                        value={estimate.p50 || ''}
                        onChange={(e) => handleEstimateChange('p50', parseFloat(e.target.value) || undefined)}
                        placeholder="Enter P50 value"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="p70">P70 - 70% confident it's lower than this</Label>
                      <Input
                        id="p70"
                        type="number"
                        value={estimate.p70 || ''}
                        onChange={(e) => handleEstimateChange('p70', parseFloat(e.target.value) || undefined)}
                        placeholder="Enter P70 value"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="p90">P90 - 90% confident it's lower than this</Label>
                      <Input
                        id="p90"
                        type="number"
                        value={estimate.p90 || ''}
                        onChange={(e) => handleEstimateChange('p90', parseFloat(e.target.value) || undefined)}
                        placeholder="Enter P90 value"
                      />
                    </div>
                  </div>
                </div>

                {/* Visualization */}
                <div className="space-y-4">
                  <div>
                    <Label>Estimate Visualization</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      {estimate.p10 && estimate.p50 && estimate.p90 ? (
                        <div className="space-y-3">
                          <div className="text-center text-sm font-medium">Range Visualization</div>
                          <div className="relative h-8 bg-gray-200 rounded">
                            <div 
                              className="absolute h-full bg-blue-500 rounded"
                              style={{
                                left: '10%',
                                width: '80%'
                              }}
                            />
                            <div 
                              className="absolute h-full w-1 bg-blue-900"
                              style={{ left: '50%' }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>P10: {formatNumber(estimate.p10)}</span>
                            <span>P50: {formatNumber(estimate.p50)}</span>
                            <span>P90: {formatNumber(estimate.p90)}</span>
                          </div>
                          <div className="text-sm text-center">
                            Range Width: {formatNumber((estimate.p90 || 0) - (estimate.p10 || 0))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          Enter values to see visualization
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="basis">Basis of Estimate</Label>
                    <Textarea
                      id="basis"
                      value={estimate.basisOfEstimate || ''}
                      onChange={(e) => handleEstimateChange('basisOfEstimate', e.target.value)}
                      placeholder="Describe the data sources, experience, and reasoning behind your estimate..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button onClick={validateAndSubmit} disabled={!estimate.p10 || !estimate.p50 || !estimate.p90}>
                  <Award className="h-4 w-4 mr-2" />
                  Validate & Submit Estimate
                </Button>
              </div>
            </div>
          )}

          {/* Validation Results */}
          {currentStep === 'validation' && validationResults && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Estimate Validated</h3>
                <p className="text-gray-600">Your calibrated estimate has been created successfully</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Validation Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatNumber(validationResults.derivedMetrics.rangeWidth)}
                      </div>
                      <div className="text-sm text-gray-600">Range Width</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {validationResults.derivedMetrics.asymmetryRatio.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Asymmetry Ratio</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {validationResults.derivedMetrics.impliedDistribution}
                      </div>
                      <div className="text-sm text-gray-600">Distribution Type</div>
                    </div>
                  </div>

                  {validationResults.warnings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-amber-700">Warnings:</h4>
                      {validationResults.warnings.map((warning: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-amber-700">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{warning}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}