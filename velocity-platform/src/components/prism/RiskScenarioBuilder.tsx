/**
 * PRISM Risk Scenario Builder
 * 
 * Visual scenario creation with industry templates, threat probability inputs,
 * and impact calculation for Monte Carlo simulation.
 */
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Plus,
  Trash2,
  Copy,
  Save,
  Download,
  Upload,
  Target,
  Shield,
  AlertTriangle,
  TrendingUp,
  Calculator,
  Building,
  Eye,
  Settings
} from 'lucide-react'
import { RiskScenario, RiskCategory, ThreatType, Industry, RiskTemplate, RiskMitigation } from '@/types/prism'
import { HubbardCalibrationWidget } from './HubbardCalibrationWidget'
import { HubbardEstimate } from '@/services/risk/hubbardCalibration'
import { useToast } from '@/hooks/use-toast'

interface RiskScenarioBuilderProps {
  onScenariosChange: (scenarios: RiskScenario[]) => void
  initialScenarios?: RiskScenario[]
}

const INDUSTRY_TEMPLATES: RiskTemplate[] = [
  {
    id: 'tech-startup',
    name: 'Technology Startup',
    description: 'Common risks for early-stage technology companies',
    industry: 'technology',
    category: 'cyber',
    scenarios: [
      {
        name: 'Data Breach - Customer Data',
        category: 'cyber',
        threatType: 'data_breach',
        probability: { annual: 0.15, confidence: 80, source: 'industry' },
        impact: {
          financial: { min: 500000, likely: 2000000, max: 8000000, currency: 'USD' },
          operational: { downtimeHours: 72, affectedUsers: 10000, productivityLoss: 0.3 },
          reputational: { customerChurn: 0.15, brandImpact: 60, recoveryTime: 180 }
        }
      }
    ],
    bestPractices: [
      'Implement zero-trust security architecture',
      'Regular security audits and penetration testing',
      'Employee security awareness training'
    ]
  },
  {
    id: 'healthcare-org',
    name: 'Healthcare Organization',
    description: 'HIPAA-compliant risk scenarios for healthcare',
    industry: 'healthcare',
    category: 'compliance',
    scenarios: [
      {
        name: 'HIPAA Violation - PHI Exposure',
        category: 'compliance',
        threatType: 'compliance_violation',
        probability: { annual: 0.08, confidence: 85, source: 'historical' },
        impact: {
          financial: { min: 100000, likely: 1500000, max: 10000000, currency: 'USD' },
          operational: { downtimeHours: 48, affectedUsers: 5000, productivityLoss: 0.25 },
          reputational: { customerChurn: 0.20, brandImpact: 80, recoveryTime: 365 }
        }
      }
    ],
    bestPractices: [
      'Implement comprehensive PHI access controls',
      'Regular HIPAA compliance audits',
      'Staff training on privacy requirements'
    ]
  },
  {
    id: 'fintech',
    name: 'Financial Services',
    description: 'Regulatory and operational risks for financial institutions',
    industry: 'finance',
    category: 'financial',
    scenarios: [
      {
        name: 'Regulatory Fine - AML Violation',
        category: 'compliance',
        threatType: 'compliance_violation',
        probability: { annual: 0.05, confidence: 90, source: 'industry' },
        impact: {
          financial: { min: 1000000, likely: 15000000, max: 100000000, currency: 'USD' },
          operational: { downtimeHours: 0, affectedUsers: 0, productivityLoss: 0.1 },
          reputational: { customerChurn: 0.25, brandImpact: 90, recoveryTime: 540 }
        }
      }
    ],
    bestPractices: [
      'Robust AML/KYC processes',
      'Regular regulatory compliance reviews',
      'Transaction monitoring systems'
    ]
  }
]

const THREAT_CATEGORIES = {
  data_breach: { label: 'Data Breach', icon: Shield, color: 'bg-red-100 text-red-800' },
  ransomware: { label: 'Ransomware', icon: AlertTriangle, color: 'bg-orange-100 text-orange-800' },
  service_outage: { label: 'Service Outage', icon: TrendingUp, color: 'bg-blue-100 text-blue-800' },
  compliance_violation: { label: 'Compliance Violation', icon: Building, color: 'bg-purple-100 text-purple-800' },
  supply_chain: { label: 'Supply Chain Risk', icon: Target, color: 'bg-green-100 text-green-800' },
  insider_threat: { label: 'Insider Threat', icon: Eye, color: 'bg-amber-100 text-amber-800' },
  natural_disaster: { label: 'Natural Disaster', icon: AlertTriangle, color: 'bg-gray-100 text-gray-800' }
}

export function RiskScenarioBuilder({ onScenariosChange, initialScenarios = [] }: RiskScenarioBuilderProps) {
  const [scenarios, setScenarios] = useState<RiskScenario[]>(initialScenarios)
  const [selectedScenario, setSelectedScenario] = useState<RiskScenario | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    onScenariosChange(scenarios)
  }, [scenarios, onScenariosChange])

  const createNewScenario = (): RiskScenario => ({
    id: `scenario_${Date.now()}`,
    name: 'New Risk Scenario',
    description: '',
    category: 'cyber',
    threatType: 'data_breach',
    createdAt: new Date(),
    updatedAt: new Date(),
    probability: {
      annual: 0.1,
      confidence: 70,
      source: 'expert'
    },
    impact: {
      financial: {
        min: 100000,
        likely: 500000,
        max: 2000000,
        currency: 'USD'
      },
      operational: {
        downtimeHours: 24,
        affectedUsers: 1000,
        productivityLoss: 0.2
      },
      reputational: {
        customerChurn: 0.1,
        brandImpact: 50,
        recoveryTime: 90
      }
    },
    mitigations: []
  })

  const addScenario = () => {
    const newScenario = createNewScenario()
    setScenarios([...scenarios, newScenario])
    setSelectedScenario(newScenario)
    setIsEditing(true)
  }

  const duplicateScenario = (scenario: RiskScenario) => {
    const duplicated = {
      ...scenario,
      id: `scenario_${Date.now()}`,
      name: `${scenario.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setScenarios([...scenarios, duplicated])
    toast({
      title: 'Scenario Duplicated',
      description: `Created copy of "${scenario.name}"`
    })
  }

  const deleteScenario = (scenarioId: string) => {
    setScenarios(scenarios.filter(s => s.id !== scenarioId))
    if (selectedScenario?.id === scenarioId) {
      setSelectedScenario(null)
      setIsEditing(false)
    }
    toast({
      title: 'Scenario Deleted',
      description: 'Risk scenario has been removed'
    })
  }

  const updateScenario = (updatedScenario: RiskScenario) => {
    updatedScenario.updatedAt = new Date()
    setScenarios(scenarios.map(s => s.id === updatedScenario.id ? updatedScenario : s))
    setSelectedScenario(updatedScenario)
  }

  const applyTemplate = (template: RiskTemplate) => {
    if (!template.scenarios.length) return

    const newScenarios = template.scenarios.map((templateScenario, index) => {
      const scenario: RiskScenario = {
        id: `scenario_${Date.now()}_${index}`,
        name: templateScenario.name || 'Template Scenario',
        description: templateScenario.description || `Risk scenario from ${template.name} template`,
        category: templateScenario.category || template.category,
        threatType: templateScenario.threatType || 'data_breach',
        industry: template.industry,
        createdAt: new Date(),
        updatedAt: new Date(),
        probability: templateScenario.probability || {
          annual: 0.1,
          confidence: 70,
          source: 'expert'
        },
        impact: templateScenario.impact || {
          financial: { min: 100000, likely: 500000, max: 2000000, currency: 'USD' },
          operational: { downtimeHours: 24, affectedUsers: 1000, productivityLoss: 0.2 },
          reputational: { customerChurn: 0.1, brandImpact: 50, recoveryTime: 90 }
        },
        mitigations: []
      }
      return scenario
    })

    setScenarios([...scenarios, ...newScenarios])
    toast({
      title: 'Template Applied',
      description: `Added ${newScenarios.length} scenarios from ${template.name}`
    })
  }

  const calculateAnnualizedLoss = (scenario: RiskScenario) => {
    return scenario.probability.annual * scenario.impact.financial.likely
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Risk Scenario Builder</h2>
          <p className="text-gray-600">Create and manage risk scenarios for Monte Carlo analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={addScenario}>
            <Plus className="h-4 w-4 mr-2" />
            New Scenario
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Scenarios List */}
        <div className="col-span-4 space-y-4">
          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Industry Templates</CardTitle>
              <CardDescription>Quick-start templates for common risk scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry template" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_TEMPLATES.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <div className="mt-3">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      const template = INDUSTRY_TEMPLATES.find(t => t.id === selectedTemplate)
                      if (template) applyTemplate(template)
                    }}
                  >
                    Apply Template
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scenarios List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scenarios ({scenarios.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {scenarios.map(scenario => {
                  const threatInfo = THREAT_CATEGORIES[scenario.threatType]
                  const Icon = threatInfo.icon
                  const isSelected = selectedScenario?.id === scenario.id
                  
                  return (
                    <div
                      key={scenario.id}
                      className={`p-4 border-b cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedScenario(scenario)
                        setIsEditing(false)
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="h-4 w-4 text-gray-500" />
                            <h4 className="font-medium text-sm">{scenario.name}</h4>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={threatInfo.color} variant="secondary">
                              {threatInfo.label}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {Math.round(scenario.probability.annual * 100)}% annually
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            ALE: {formatCurrency(calculateAnnualizedLoss(scenario))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              duplicateScenario(scenario)
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteScenario(scenario.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scenario Editor */}
        <div className="col-span-8">
          {selectedScenario ? (
            <ScenarioEditor
              scenario={selectedScenario}
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={(updatedScenario) => {
                updateScenario(updatedScenario)
                setIsEditing(false)
                toast({
                  title: 'Scenario Saved',
                  description: `"${updatedScenario.name}" has been updated`
                })
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Scenario Selected</h3>
                <p className="text-gray-500 mb-4">
                  Select a scenario from the list or create a new one to get started
                </p>
                <Button onClick={addScenario}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Scenario
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

interface ScenarioEditorProps {
  scenario: RiskScenario
  isEditing: boolean
  onEdit: () => void
  onSave: (scenario: RiskScenario) => void
  onCancel: () => void
}

function ScenarioEditor({ scenario, isEditing, onEdit, onSave, onCancel }: ScenarioEditorProps) {
  const [editedScenario, setEditedScenario] = useState<RiskScenario>(scenario)

  useEffect(() => {
    setEditedScenario(scenario)
  }, [scenario])

  const handleSave = () => {
    onSave(editedScenario)
  }

  const threatInfo = THREAT_CATEGORIES[editedScenario.threatType]
  const Icon = threatInfo.icon

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-gray-500" />
            <div>
              <CardTitle>{editedScenario.name}</CardTitle>
              <CardDescription>{editedScenario.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button variant="outline" onClick={onEdit}>
                <Settings className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="probability">Probability</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="mitigations">Mitigations</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Scenario Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedScenario.name}
                    onChange={(e) => setEditedScenario({
                      ...editedScenario,
                      name: e.target.value
                    })}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">{editedScenario.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Risk Category</Label>
                {isEditing ? (
                  <Select
                    value={editedScenario.category}
                    onValueChange={(value: RiskCategory) => 
                      setEditedScenario({ ...editedScenario, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cyber">Cyber Security</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="reputational">Reputational</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="strategic">Strategic</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-gray-50 rounded capitalize">{editedScenario.category}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={editedScenario.description}
                  onChange={(e) => setEditedScenario({
                    ...editedScenario,
                    description: e.target.value
                  })}
                  rows={3}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded min-h-[80px]">{editedScenario.description}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Threat Type</Label>
              {isEditing ? (
                <Select
                  value={editedScenario.threatType}
                  onValueChange={(value: ThreatType) => 
                    setEditedScenario({ ...editedScenario, threatType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(THREAT_CATEGORIES).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={threatInfo.color} variant="secondary">
                  {threatInfo.label}
                </Badge>
              )}
            </div>
          </TabsContent>

          <TabsContent value="probability" className="space-y-4">
            {/* Hubbard Calibration Widget */}
            {isEditing && (
              <Card className="border-blue-200 bg-blue-50 mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Hubbard Calibrated Estimation
                  </CardTitle>
                  <CardDescription>
                    Use the Hubbard 5-point method for precise probability estimation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HubbardCalibrationWidget
                    parameter={`Annual probability of ${editedScenario.name} (%)`}
                    estimator="Risk Analyst"
                    onEstimateComplete={(estimate: HubbardEstimate) => {
                      // Convert Hubbard estimate to scenario probability
                      setEditedScenario({
                        ...editedScenario,
                        probability: {
                          ...editedScenario.probability,
                          annual: estimate.p50 / 100, // Convert percentage to decimal
                          confidence: estimate.confidence * 100,
                          source: 'expert'
                        },
                        metadata: {
                          hubbardEstimate: estimate,
                          calibrationMethod: '5-point'
                        }
                      })
                      toast({
                        title: 'Calibrated Estimate Applied',
                        description: 'Probability updated with Hubbard methodology'
                      })
                    }}
                  />
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Annual Probability: {Math.round(editedScenario.probability.annual * 100)}%</Label>
                {isEditing ? (
                  <Slider
                    value={[editedScenario.probability.annual * 100]}
                    onValueChange={(value) => 
                      setEditedScenario({
                        ...editedScenario,
                        probability: {
                          ...editedScenario.probability,
                          annual: value[0] / 100
                        }
                      })
                    }
                    max={100}
                    step={1}
                    className="w-full"
                  />
                ) : (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${editedScenario.probability.annual * 100}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Confidence Level: {editedScenario.probability.confidence}%</Label>
                {isEditing ? (
                  <Slider
                    value={[editedScenario.probability.confidence]}
                    onValueChange={(value) => 
                      setEditedScenario({
                        ...editedScenario,
                        probability: {
                          ...editedScenario.probability,
                          confidence: value[0]
                        }
                      })
                    }
                    max={100}
                    step={5}
                    className="w-full"
                  />
                ) : (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${editedScenario.probability.confidence}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Data Source</Label>
                {isEditing ? (
                  <Select
                    value={editedScenario.probability.source}
                    onValueChange={(value: 'historical' | 'industry' | 'expert' | 'custom') => 
                      setEditedScenario({
                        ...editedScenario,
                        probability: {
                          ...editedScenario.probability,
                          source: value
                        }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="historical">Historical Data</SelectItem>
                      <SelectItem value="industry">Industry Benchmarks</SelectItem>
                      <SelectItem value="expert">Expert Judgment</SelectItem>
                      <SelectItem value="custom">Custom Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-gray-50 rounded capitalize">{editedScenario.probability.source}</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Financial Impact (USD)</h4>
                <div className="grid grid-cols-3 gap-4">
                  {(['min', 'likely', 'max'] as const).map(type => (
                    <div key={type} className="space-y-2">
                      <Label className="capitalize">{type === 'likely' ? 'Most Likely' : type}</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedScenario.impact.financial[type]}
                          onChange={(e) => 
                            setEditedScenario({
                              ...editedScenario,
                              impact: {
                                ...editedScenario.impact,
                                financial: {
                                  ...editedScenario.impact.financial,
                                  [type]: Number(e.target.value)
                                }
                              }
                            })
                          }
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">
                          ${editedScenario.impact.financial[type].toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Operational Impact</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Downtime (hours)</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedScenario.impact.operational.downtimeHours}
                        onChange={(e) => 
                          setEditedScenario({
                            ...editedScenario,
                            impact: {
                              ...editedScenario.impact,
                              operational: {
                                ...editedScenario.impact.operational,
                                downtimeHours: Number(e.target.value)
                              }
                            }
                          })
                        }
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{editedScenario.impact.operational.downtimeHours}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Affected Users</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedScenario.impact.operational.affectedUsers}
                        onChange={(e) => 
                          setEditedScenario({
                            ...editedScenario,
                            impact: {
                              ...editedScenario.impact,
                              operational: {
                                ...editedScenario.impact.operational,
                                affectedUsers: Number(e.target.value)
                              }
                            }
                          })
                        }
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{editedScenario.impact.operational.affectedUsers.toLocaleString()}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Productivity Loss</Label>
                    {isEditing ? (
                      <div className="space-y-1">
                        <Slider
                          value={[editedScenario.impact.operational.productivityLoss * 100]}
                          onValueChange={(value) => 
                            setEditedScenario({
                              ...editedScenario,
                              impact: {
                                ...editedScenario.impact,
                                operational: {
                                  ...editedScenario.impact.operational,
                                  productivityLoss: value[0] / 100
                                }
                              }
                            })
                          }
                          max={100}
                          step={5}
                        />
                        <div className="text-sm text-gray-500 text-center">
                          {Math.round(editedScenario.impact.operational.productivityLoss * 100)}%
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">
                        {Math.round(editedScenario.impact.operational.productivityLoss * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Reputational Impact</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Churn</Label>
                    {isEditing ? (
                      <div className="space-y-1">
                        <Slider
                          value={[editedScenario.impact.reputational.customerChurn * 100]}
                          onValueChange={(value) => 
                            setEditedScenario({
                              ...editedScenario,
                              impact: {
                                ...editedScenario.impact,
                                reputational: {
                                  ...editedScenario.impact.reputational,
                                  customerChurn: value[0] / 100
                                }
                              }
                            })
                          }
                          max={100}
                          step={1}
                        />
                        <div className="text-sm text-gray-500 text-center">
                          {Math.round(editedScenario.impact.reputational.customerChurn * 100)}%
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">
                        {Math.round(editedScenario.impact.reputational.customerChurn * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Brand Impact</Label>
                    {isEditing ? (
                      <div className="space-y-1">
                        <Slider
                          value={[editedScenario.impact.reputational.brandImpact]}
                          onValueChange={(value) => 
                            setEditedScenario({
                              ...editedScenario,
                              impact: {
                                ...editedScenario.impact,
                                reputational: {
                                  ...editedScenario.impact.reputational,
                                  brandImpact: value[0]
                                }
                              }
                            })
                          }
                          max={100}
                          step={5}
                        />
                        <div className="text-sm text-gray-500 text-center">
                          {editedScenario.impact.reputational.brandImpact}/100
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">
                        {editedScenario.impact.reputational.brandImpact}/100
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Recovery Time (days)</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedScenario.impact.reputational.recoveryTime}
                        onChange={(e) => 
                          setEditedScenario({
                            ...editedScenario,
                            impact: {
                              ...editedScenario.impact,
                              reputational: {
                                ...editedScenario.impact.reputational,
                                recoveryTime: Number(e.target.value)
                              }
                            }
                          })
                        }
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded">{editedScenario.impact.reputational.recoveryTime}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mitigations" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Risk Mitigations</h4>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newMitigation: RiskMitigation = {
                      id: `mitigation_${Date.now()}`,
                      name: 'New Mitigation',
                      description: '',
                      cost: 10000,
                      effectiveness: 0.2,
                      implementationTime: 30,
                      roi: 0
                    }
                    setEditedScenario({
                      ...editedScenario,
                      mitigations: [...editedScenario.mitigations, newMitigation]
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mitigation
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {editedScenario.mitigations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No mitigations defined yet
                </div>
              ) : (
                editedScenario.mitigations.map((mitigation, index) => (
                  <Card key={mitigation.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        {isEditing ? (
                          <Input
                            value={mitigation.name}
                            onChange={(e) => {
                              const updated = [...editedScenario.mitigations]
                              updated[index] = { ...mitigation, name: e.target.value }
                              setEditedScenario({ ...editedScenario, mitigations: updated })
                            }}
                            className="font-medium"
                          />
                        ) : (
                          <h5 className="font-medium">{mitigation.name}</h5>
                        )}
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditedScenario({
                              ...editedScenario,
                              mitigations: editedScenario.mitigations.filter((_, i) => i !== index)
                            })
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs">Cost</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={mitigation.cost}
                            onChange={(e) => {
                              const updated = [...editedScenario.mitigations]
                              updated[index] = { ...mitigation, cost: Number(e.target.value) }
                              setEditedScenario({ ...editedScenario, mitigations: updated })
                            }}
                            size="sm"
                          />
                        ) : (
                          <div className="text-sm">${mitigation.cost.toLocaleString()}</div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Effectiveness</Label>
                        {isEditing ? (
                          <div>
                            <Slider
                              value={[mitigation.effectiveness * 100]}
                              onValueChange={(value) => {
                                const updated = [...editedScenario.mitigations]
                                updated[index] = { ...mitigation, effectiveness: value[0] / 100 }
                                setEditedScenario({ ...editedScenario, mitigations: updated })
                              }}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                            <div className="text-xs text-center text-gray-500 mt-1">
                              {Math.round(mitigation.effectiveness * 100)}%
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm">{Math.round(mitigation.effectiveness * 100)}%</div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Implementation (days)</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={mitigation.implementationTime}
                            onChange={(e) => {
                              const updated = [...editedScenario.mitigations]
                              updated[index] = { ...mitigation, implementationTime: Number(e.target.value) }
                              setEditedScenario({ ...editedScenario, mitigations: updated })
                            }}
                            size="sm"
                          />
                        ) : (
                          <div className="text-sm">{mitigation.implementationTime} days</div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}