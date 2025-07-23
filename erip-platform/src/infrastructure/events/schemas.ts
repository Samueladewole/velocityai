/**
 * ERIP Event Bus Schemas
 * 
 * Defines all event types and schemas for inter-component communication
 * following the ERIP orchestra integration patterns
 */

import { z } from 'zod'

// ===============================
// Core Component Events
// ===============================

// COMPASS Events
export const CompassEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('regulation.detected'),
    source: z.literal('compass'),
    data: z.object({
      regulationId: z.string(),
      title: z.string(),
      source: z.string(),
      impact: z.enum(['high', 'medium', 'low']),
      effectiveDate: z.string(),
      affectedFrameworks: z.array(z.string()),
      estimatedImplementationCost: z.number(),
      trustEquityImpact: z.number()
    })
  }),
  z.object({
    type: z.literal('questionnaire.completed'),
    source: z.literal('compass.qie'),
    data: z.object({
      questionnaireId: z.string(),
      customerId: z.string(),
      completionTime: z.number(), // minutes
      questionsTotal: z.number(),
      questionsAnswered: z.number(),
      averageConfidence: z.number(),
      trustEquityEarned: z.number(),
      frameworksMapped: z.array(z.string())
    })
  }),
  z.object({
    type: z.literal('compliance.gap.identified'),
    source: z.literal('compass'),
    data: z.object({
      gapId: z.string(),
      framework: z.string(),
      requirement: z.string(),
      severity: z.enum(['critical', 'high', 'medium', 'low']),
      estimatedRemediationCost: z.number(),
      trustEquityLoss: z.number(),
      recommendedActions: z.array(z.string())
    })
  })
])

// ATLAS Events
export const AtlasEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('vulnerability.discovered'),
    source: z.literal('atlas'),
    data: z.object({
      vulnerabilityId: z.string(),
      assetId: z.string(),
      severity: z.enum(['critical', 'high', 'medium', 'low']),
      cvssScore: z.number().min(0).max(10),
      description: z.string(),
      affectedSystems: z.array(z.string()),
      remediationSteps: z.array(z.string()),
      complianceFrameworksAffected: z.array(z.string()),
      trustEquityImpact: z.number()
    })
  }),
  z.object({
    type: z.literal('security.posture.updated'),
    source: z.literal('atlas'),
    data: z.object({
      assessmentId: z.string(),
      overallScore: z.number().min(0).max(100),
      controlsAssessed: z.number(),
      controlsPassed: z.number(),
      controlsFailed: z.number(),
      riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
      trustEquityChange: z.number(),
      recommendations: z.array(z.string())
    })
  }),
  z.object({
    type: z.literal('asset.scanned'),
    source: z.literal('atlas'),
    data: z.object({
      assetId: z.string(),
      assetType: z.enum(['server', 'application', 'database', 'network']),
      scanType: z.enum(['vulnerability', 'configuration', 'compliance']),
      findings: z.array(z.object({
        id: z.string(),
        severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
        title: z.string(),
        description: z.string()
      })),
      scanDuration: z.number(),
      nextScanDue: z.string()
    })
  })
])

// PRISM Events
export const PrismEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('risk.quantified'),
    source: z.literal('prism'),
    data: z.object({
      riskId: z.string(),
      scenario: z.string(),
      probability: z.number().min(0).max(1),
      impact: z.number(), // dollar amount
      ale: z.number(), // Annual Loss Expectancy
      sle: z.number(), // Single Loss Expectancy
      aro: z.number(), // Annual Rate of Occurrence
      confidenceInterval: z.object({
        lower: z.number(),
        upper: z.number()
      }),
      mitigationCost: z.number(),
      residualRisk: z.number(),
      trustEquityRequired: z.number()
    })
  }),
  z.object({
    type: z.literal('monte.carlo.completed'),
    source: z.literal('prism'),
    data: z.object({
      simulationId: z.string(),
      iterations: z.number(),
      scenarios: z.array(z.object({
        name: z.string(),
        probability: z.number(),
        impact: z.number()
      })),
      results: z.object({
        meanLoss: z.number(),
        medianLoss: z.number(),
        percentile95: z.number(),
        percentile99: z.number(),
        standardDeviation: z.number()
      }),
      recommendations: z.array(z.string())
    })
  })
])

// PULSE Events  
export const PulseEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('monitoring.alert'),
    source: z.literal('pulse'),
    data: z.object({
      alertId: z.string(),
      severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
      title: z.string(),
      description: z.string(),
      source: z.string(),
      timestamp: z.string(),
      affectedAssets: z.array(z.string()),
      correlatedEvents: z.array(z.string()),
      autoRemediationTriggered: z.boolean(),
      trustEquityImpact: z.number()
    })
  }),
  z.object({
    type: z.literal('metrics.collected'),
    source: z.literal('pulse'),
    data: z.object({
      collectionId: z.string(),
      timestamp: z.string(),
      metrics: z.record(z.string(), z.number()),
      healthScore: z.number().min(0).max(100),
      trends: z.array(z.object({
        metric: z.string(),
        direction: z.enum(['up', 'down', 'stable']),
        changePercent: z.number()
      }))
    })
  })
])

// CIPHER Events
export const CipherEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('policy.deployed'),
    source: z.literal('cipher'),
    data: z.object({
      policyId: z.string(),
      policyName: z.string(),
      version: z.string(),
      deploymentScope: z.array(z.string()),
      affectedAssets: z.number(),
      complianceFrameworks: z.array(z.string()),
      automationLevel: z.number().min(0).max(100),
      expectedCompliance: z.number().min(0).max(100),
      trustEquityGenerated: z.number()
    })
  }),
  z.object({
    type: z.literal('control.automated'),
    source: z.literal('cipher'),
    data: z.object({
      controlId: z.string(),
      controlType: z.enum(['preventive', 'detective', 'corrective']),
      framework: z.string(),
      requirement: z.string(),
      automationSuccess: z.boolean(),
      implementationTime: z.number(), // seconds
      coveragePercent: z.number().min(0).max(100),
      trustEquityEarned: z.number()
    })
  })
])

// NEXUS Events
export const NexusEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('threat.intelligence.updated'),
    source: z.literal('nexus'),
    data: z.object({
      threatId: z.string(),
      threatType: z.enum(['malware', 'phishing', 'vulnerability', 'data_breach', 'insider_threat']),
      severity: z.enum(['critical', 'high', 'medium', 'low']),
      indicators: z.array(z.object({
        type: z.enum(['ip', 'domain', 'hash', 'email', 'url']),
        value: z.string(),
        confidence: z.number().min(0).max(100)
      })),
      affectedIndustries: z.array(z.string()),
      mitigation: z.array(z.string()),
      source: z.string(),
      trustEquityProtected: z.number()
    })
  }),
  z.object({
    type: z.literal('correlation.identified'),
    source: z.literal('nexus'),
    data: z.object({
      correlationId: z.string(),
      events: z.array(z.string()),
      pattern: z.string(),
      confidence: z.number().min(0).max(100),
      riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
      recommendedActions: z.array(z.string()),
      aiInsights: z.string()
    })
  })
])

// BEACON Events
export const BeaconEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('value.calculated'),
    source: z.literal('beacon'),
    data: z.object({
      calculationId: z.string(),
      period: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annual']),
      valueMetrics: z.object({
        costAvoidance: z.number(),
        timesSaved: z.number(), // hours
        riskReduced: z.number(), // dollar amount
        complianceImproved: z.number(), // percentage
        dealAcceleration: z.number(), // days faster
        premiumCapture: z.number() // percentage
      }),
      totalValue: z.number(),
      roi: z.number(), // return on investment percentage
      trustEquityGenerated: z.number()
    })
  }),
  z.object({
    type: z.literal('dashboard.requested'),
    source: z.literal('beacon'),
    data: z.object({
      dashboardId: z.string(),
      requestor: z.string(),
      stakeholderType: z.enum(['board', 'executive', 'manager', 'technical']),
      metrics: z.array(z.string()),
      timeRange: z.object({
        start: z.string(),
        end: z.string()
      })
    })
  })
])

// CLEARANCE Events
export const ClearanceEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('decision.routed'),
    source: z.literal('clearance'),
    data: z.object({
      decisionId: z.string(),
      riskAmount: z.number(),
      riskAppetite: z.enum(['conservative', 'moderate', 'aggressive']),
      routedTo: z.enum(['auto_approve', 'manager', 'executive', 'board']),
      urgency: z.enum(['low', 'medium', 'high', 'critical']),
      context: z.string(),
      requiredApprovals: z.number(),
      sla: z.number(), // hours
      trustEquityStake: z.number()
    })
  }),
  z.object({
    type: z.literal('approval.completed'),
    source: z.literal('clearance'),
    data: z.object({
      decisionId: z.string(),
      approved: z.boolean(),
      approver: z.string(),
      approverLevel: z.enum(['manager', 'executive', 'board', 'automated']),
      processingTime: z.number(), // minutes
      conditions: z.array(z.string()),
      trustEquityAllocated: z.number()
    })
  })
])

// ===============================
// Trust Equity Events
// ===============================

export const TrustEquityEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('trust.points.earned'),
    data: z.object({
      entityId: z.string(),
      entityType: z.enum(['organization', 'user', 'asset']),
      points: z.number(),
      source: z.enum(['compass', 'atlas', 'prism', 'pulse', 'cipher', 'nexus', 'beacon', 'clearance']),
      category: z.enum(['compliance', 'security', 'risk_management', 'automation', 'intelligence']),
      description: z.string(),
      evidence: z.array(z.string()),
      multiplier: z.number().default(1),
      timestamp: z.string()
    })
  }),
  z.object({
    type: z.literal('trust.score.updated'),
    data: z.object({
      entityId: z.string(),
      entityType: z.enum(['organization', 'user', 'asset']),
      previousScore: z.number(),
      newScore: z.number(),
      change: z.number(),
      tier: z.enum(['bronze', 'silver', 'gold', 'platinum']),
      tierChange: z.boolean(),
      breakdown: z.object({
        compliance: z.number(),
        security: z.number(),
        risk_management: z.number(),
        automation: z.number(),
        intelligence: z.number()
      })
    })
  })
])

// ===============================
// Union of All Events
// ===============================

export const ERIPEventSchema = z.discriminatedUnion('source', [
  ...CompassEventSchema.options.map(schema => schema.extend({ eventId: z.string(), timestamp: z.string() })),
  ...AtlasEventSchema.options.map(schema => schema.extend({ eventId: z.string(), timestamp: z.string() })),
  ...PrismEventSchema.options.map(schema => schema.extend({ eventId: z.string(), timestamp: z.string() })),
  ...PulseEventSchema.options.map(schema => schema.extend({ eventId: z.string(), timestamp: z.string() })),
  ...CipherEventSchema.options.map(schema => schema.extend({ eventId: z.string(), timestamp: z.string() })),
  ...NexusEventSchema.options.map(schema => schema.extend({ eventId: z.string(), timestamp: z.string() })),
  ...BeaconEventSchema.options.map(schema => schema.extend({ eventId: z.string(), timestamp: z.string() })),
  ...ClearanceEventSchema.options.map(schema => schema.extend({ eventId: z.string(), timestamp: z.string() })),
  ...TrustEquityEventSchema.options.map(schema => schema.extend({ eventId: z.string(), timestamp: z.string(), source: z.literal('trust_engine') }))
])

export type ERIPEvent = z.infer<typeof ERIPEventSchema>
export type CompassEvent = z.infer<typeof CompassEventSchema>
export type AtlasEvent = z.infer<typeof AtlasEventSchema>
export type PrismEvent = z.infer<typeof PrismEventSchema>
export type PulseEvent = z.infer<typeof PulseEventSchema>
export type CipherEvent = z.infer<typeof CipherEventSchema>
export type NexusEvent = z.infer<typeof NexusEventSchema>
export type BeaconEvent = z.infer<typeof BeaconEventSchema>
export type ClearanceEvent = z.infer<typeof ClearanceEventSchema>
export type TrustEquityEvent = z.infer<typeof TrustEquityEventSchema>

// ===============================
// Event Routing Rules
// ===============================

export interface EventRoutingRule {
  eventType: string
  sources: string[]
  targets: string[]
  transformation?: string
  conditions?: Record<string, any>
  priority: number
}

export const EVENT_ROUTING_RULES: EventRoutingRule[] = [
  // COMPASS feeds to ATLAS and PRISM
  {
    eventType: 'regulation.detected',
    sources: ['compass'],
    targets: ['atlas', 'prism'],
    priority: 1
  },
  {
    eventType: 'compliance.gap.identified',
    sources: ['compass'],
    targets: ['atlas', 'prism', 'cipher'],
    priority: 1
  },
  
  // ATLAS validates COMPASS requirements, quantifies with PRISM
  {
    eventType: 'vulnerability.discovered',
    sources: ['atlas'],
    targets: ['prism', 'pulse', 'cipher'],
    priority: 1
  },
  {
    eventType: 'security.posture.updated',
    sources: ['atlas'],
    targets: ['beacon', 'compass'],
    priority: 2
  },
  
  // PRISM quantifies ATLAS findings, informs CLEARANCE
  {
    eventType: 'risk.quantified',
    sources: ['prism'],
    targets: ['clearance', 'beacon'],
    priority: 1
  },
  
  // PULSE monitors and feeds data to other components
  {
    eventType: 'monitoring.alert',
    sources: ['pulse'],
    targets: ['atlas', 'nexus', 'clearance'],
    priority: 1
  },
  {
    eventType: 'metrics.collected',
    sources: ['pulse'],
    targets: ['beacon', 'compass', 'atlas'],
    priority: 3
  },
  
  // NEXUS correlates with threat intelligence
  {
    eventType: 'threat.intelligence.updated',
    sources: ['nexus'],
    targets: ['atlas', 'pulse', 'cipher'],
    priority: 1
  },
  
  // All components can generate trust equity
  {
    eventType: 'trust.points.earned',
    sources: ['compass', 'atlas', 'prism', 'pulse', 'cipher', 'nexus', 'beacon', 'clearance'],
    targets: ['trust_engine', 'beacon'],
    priority: 2
  }
]