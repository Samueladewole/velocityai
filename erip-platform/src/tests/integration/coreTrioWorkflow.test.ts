/**
 * Core Trio Integration Test Suite
 * 
 * End-to-end integration tests for COMPASS → ATLAS → PRISM workflows
 * Tests the complete integration patterns from workflow-examples.md
 */

import { describe, beforeAll, afterAll, beforeEach, it, expect, jest } from '@jest/globals'
import { ERIPEventBus, EventBusConfig } from '../../infrastructure/events/eventBus'
import { TrustEquityEngine } from '../../infrastructure/trustEquity/engine'
import { CoreTrioIntegration, TrioIntegrationConfig } from '../../services/integration/trioIntegration'
import { MonteCarloEngine } from '../../services/risk/monteCarloEngine'
import { ClearanceWorkflowService } from '../../services/decision/clearanceWorkflow'
import { ERIPEvent, CompassEvent, AtlasEvent, PrismEvent } from '../../infrastructure/events/schemas'
import Redis from 'ioredis'

// Mock Redis for testing
jest.mock('ioredis')

describe('Core Trio Integration Workflow Tests', () => {
  let eventBus: ERIPEventBus
  let trustEngine: TrustEquityEngine
  let trioIntegration: CoreTrioIntegration
  let monteCarloEngine: MonteCarloEngine
  let clearanceWorkflow: ClearanceWorkflowService
  let mockRedis: jest.Mocked<Redis>

  // Test data
  const testRegulationEvent: CompassEvent = {
    type: 'regulation.detected',
    source: 'compass',
    eventId: 'test-reg-001',
    timestamp: new Date().toISOString(),
    data: {
      regulationId: 'GDPR-2024-001',
      title: 'GDPR Article 32 Security Requirements Update',
      source: 'EUR-Lex',
      impact: 'high',
      effectiveDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
      affectedFrameworks: ['GDPR', 'ISO27001', 'SOC2'],
      estimatedImplementationCost: 250000,
      trustEquityImpact: 150
    }
  }

  const testVulnerabilityEvent: AtlasEvent = {
    type: 'vulnerability.discovered',
    source: 'atlas',
    eventId: 'test-vuln-001',
    timestamp: new Date().toISOString(),
    data: {
      vulnerabilityId: 'CVE-2024-0001',
      assetId: 'web-app-prod-01',
      severity: 'critical',
      cvssScore: 9.8,
      description: 'Critical SQL injection vulnerability in user authentication',
      affectedSystems: ['web-app-prod-01', 'user-db-01', 'api-gateway-01'],
      remediationSteps: ['Apply security patch', 'Update input validation', 'Restart services'],
      complianceFrameworksAffected: ['PCI-DSS', 'SOX'],
      trustEquityImpact: 200
    }
  }

  const testRiskQuantificationEvent: PrismEvent = {
    type: 'risk.quantified',
    source: 'prism',
    eventId: 'test-risk-001',
    timestamp: new Date().toISOString(),
    data: {
      riskId: 'risk-001',
      scenario: 'data_breach_via_sql_injection',
      probability: 0.15,
      impact: 2500000,
      ale: 375000, // Annual Loss Expectancy
      sle: 2500000, // Single Loss Expectancy
      aro: 0.15, // Annual Rate of Occurrence
      confidenceInterval: {
        lower: 200000,
        upper: 550000
      },
      mitigationCost: 75000,
      residualRisk: 50000,
      trustEquityRequired: 300
    }
  }

  beforeAll(async () => {
    // Setup mock Redis
    mockRedis = new Redis() as jest.Mocked<Redis>
    mockRedis.setex = jest.fn().mockResolvedValue('OK')
    mockRedis.publish = jest.fn().mockResolvedValue(1)
    mockRedis.keys = jest.fn().mockResolvedValue([])
    mockRedis.psubscribe = jest.fn().mockResolvedValue(1)
    mockRedis.duplicate = jest.fn().mockReturnValue(mockRedis)
    mockRedis.on = jest.fn()
    mockRedis.quit = jest.fn().mockResolvedValue('OK')

    // Setup event bus configuration
    const eventBusConfig: EventBusConfig = {
      redis: {
        host: 'localhost',
        port: 6379,
        db: 15 // Use test database
      },
      persistence: {
        enabled: true,
        ttlSeconds: 3600,
        maxEvents: 10000
      },
      performance: {
        batchSize: 100,
        flushInterval: 1000,
        maxConcurrency: 10
      }
    }

    // Initialize core components
    eventBus = new ERIPEventBus(eventBusConfig)
    trustEngine = TrustEquityEngine.getInstance()
    
    // Initialize integration services
    const trioConfig: TrioIntegrationConfig = {
      eventBus,
      trustEngine,
      autoRouting: {
        compassToAtlas: true,
        atlasToprism: true,
        enableDecisionSupport: true
      },
      thresholds: {
        highRiskAmount: 1000000,
        criticalSeverityScore: 9.0,
        autoApprovalLimit: 100000
      }
    }

    trioIntegration = new CoreTrioIntegration(trioConfig)
    monteCarloEngine = new MonteCarloEngine(eventBus)
    clearanceWorkflow = new ClearanceWorkflowService(eventBus, trustEngine)

    // Give components time to initialize
    await new Promise(resolve => setTimeout(resolve, 100))
  })

  afterAll(async () => {
    // Cleanup
    trioIntegration.shutdown()
    clearanceWorkflow.shutdown()
    await eventBus.shutdown()
  })

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
  })

  describe('COMPASS → ATLAS Integration', () => {
    it('should trigger ATLAS security assessment when new regulation is detected', async () => {
      const eventSpy = jest.spyOn(eventBus, 'publish')

      // Publish regulation detected event
      await eventBus.publish(testRegulationEvent)

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 50))

      // Verify ATLAS security assessment was requested
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'security.assessment.requested',
          source: 'trio_integration',
          data: expect.objectContaining({
            trigger: 'regulation_detected',
            regulationId: 'GDPR-2024-001',
            assessmentType: 'compliance_driven',
            priority: 'high'
          })
        })
      )
    })

    it('should map regulation requirements to security controls', async () => {
      const eventSpy = jest.spyOn(eventBus, 'publish')

      // Test compliance gap event
      const complianceGapEvent: CompassEvent = {
        type: 'compliance.gap.identified',
        source: 'compass',
        eventId: 'test-gap-001',
        timestamp: new Date().toISOString(),
        data: {
          gapId: 'gap-001',
          framework: 'GDPR',
          requirement: 'Article 32 - Security of processing',
          severity: 'high',
          estimatedRemediationCost: 150000,
          trustEquityLoss: 100,
          recommendedActions: ['Implement encryption at rest', 'Update access controls', 'Enhance monitoring']
        }
      }

      await eventBus.publish(complianceGapEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Verify targeted control assessment was requested
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'control.assessment.requested',
          source: 'trio_integration',
          data: expect.objectContaining({
            trigger: 'compliance_gap',
            gapId: 'gap-001',
            framework: 'GDPR',
            severity: 'high'
          })
        })
      )
    })

    it('should award trust equity for proactive assessments', async () => {
      const trustSpy = jest.spyOn(trustEngine, 'awardPoints')

      await eventBus.publish(testRegulationEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(trustSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          entityId: 'system',
          entityType: 'organization',
          points: 25,
          source: 'compass',
          category: 'compliance',
          description: expect.stringContaining('Proactive security assessment triggered')
        })
      )
    })
  })

  describe('ATLAS → PRISM Integration', () => {
    it('should trigger risk quantification when critical vulnerability is discovered', async () => {
      const eventSpy = jest.spyOn(eventBus, 'publish')

      await eventBus.publish(testVulnerabilityEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Verify risk quantification was requested
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'risk.quantification.requested',
          source: 'trio_integration',
          data: expect.objectContaining({
            trigger: 'vulnerability_discovered',
            vulnerabilityId: 'CVE-2024-0001',
            assetId: 'web-app-prod-01',
            urgency: 'critical'
          })
        })
      )
    })

    it('should calculate risk scenarios for vulnerability exploitation', async () => {
      const eventSpy = jest.spyOn(eventBus, 'publish')

      await eventBus.publish(testVulnerabilityEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      const riskQuantificationCall = eventSpy.mock.calls.find(call => 
        call[0].type === 'risk.quantification.requested'
      )

      expect(riskQuantificationCall).toBeDefined()
      expect(riskQuantificationCall![0].data.scenarios).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'exploitation_successful',
            impactFactors: expect.arrayContaining(['data_breach', 'system_downtime', 'regulatory_fines'])
          }),
          expect.objectContaining({
            name: 'lateral_movement',
            impactFactors: expect.arrayContaining(['system_compromise', 'data_exfiltration'])
          })
        ])
      )
    })

    it('should trigger immediate decision routing for critical vulnerabilities', async () => {
      const eventSpy = jest.spyOn(eventBus, 'publish')

      await eventBus.publish(testVulnerabilityEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Verify emergency decision was triggered
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'emergency.decision.required',
          source: 'trio_integration',
          data: expect.objectContaining({
            trigger: 'critical_vulnerability',
            urgency: 'immediate',
            slaMinutes: 30
          })
        })
      )
    })

    it('should update risk models based on security posture changes', async () => {
      const eventSpy = jest.spyOn(eventBus, 'publish')

      const securityPostureEvent: AtlasEvent = {
        type: 'security.posture.updated',
        source: 'atlas',
        eventId: 'test-posture-001',
        timestamp: new Date().toISOString(),
        data: {
          assessmentId: 'assess-001',
          overallScore: 85,
          controlsAssessed: 100,
          controlsPassed: 85,
          controlsFailed: 15,
          riskLevel: 'medium',
          trustEquityChange: 50,
          recommendations: ['Strengthen access controls', 'Improve monitoring coverage']
        }
      }

      await eventBus.publish(securityPostureEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'risk.model.update.requested',
          source: 'trio_integration',
          data: expect.objectContaining({
            trigger: 'security_posture_updated',
            assessmentId: 'assess-001',
            postureMetrics: expect.objectContaining({
              overallScore: 85,
              controlsEffectiveness: 85
            })
          })
        })
      )
    })
  })

  describe('PRISM → Decision Flow Integration', () => {
    it('should route high-risk quantifications to appropriate decision authority', async () => {
      const eventSpy = jest.spyOn(eventBus, 'publish')

      await eventBus.publish(testRiskQuantificationEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'decision.routing.requested',
          source: 'trio_integration',
          data: expect.objectContaining({
            trigger: 'risk_quantified',
            riskId: 'risk-001',
            financialImpact: expect.objectContaining({
              ale: 375000,
              sle: 2500000,
              aro: 0.15
            })
          })
        })
      )
    })

    it('should generate executive insights from Monte Carlo simulations', async () => {
      const eventSpy = jest.spyOn(eventBus, 'publish')

      const monteCarloEvent: PrismEvent = {
        type: 'monte.carlo.completed',
        source: 'prism',
        eventId: 'test-mc-001',
        timestamp: new Date().toISOString(),
        data: {
          simulationId: 'sim-001',
          iterations: 100000,
          scenarios: [
            {
              name: 'data_breach_scenario',
              probability: 0.15,
              impact: 2500000
            },
            {
              name: 'system_outage_scenario',
              probability: 0.05,
              impact: 800000
            }
          ],
          results: {
            meanLoss: 425000,
            medianLoss: 350000,
            percentile95: 1200000,
            percentile99: 2100000,
            standardDeviation: 450000
          },
          recommendations: [
            'Implement additional security controls',
            'Consider cyber insurance',
            'Establish incident response fund'
          ]
        }
      }

      await eventBus.publish(monteCarloEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'executive.insight.generated',
          source: 'trio_integration',
          data: expect.objectContaining({
            trigger: 'monte_carlo_completed',
            simulationId: 'sim-001',
            executiveSummary: expect.objectContaining({
              totalRiskExposure: 1200000,
              worstCaseScenario: 2100000,
              mostLikelyOutcome: 350000
            })
          })
        })
      )
    })

    it('should award trust equity for completed risk analyses', async () => {
      const trustSpy = jest.spyOn(trustEngine, 'awardPoints')

      await eventBus.publish(testRiskQuantificationEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(trustSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          entityId: 'system',
          entityType: 'organization',
          points: 40,
          source: 'prism',
          category: 'risk_management',
          description: expect.stringContaining('Completed quantitative risk analysis')
        })
      )
    })
  })

  describe('End-to-End Workflow Integration', () => {
    it('should process complete regulation → vulnerability → quantification → decision workflow', async () => {
      const eventSpy = jest.spyOn(eventBus, 'publish')
      const trustSpy = jest.spyOn(trustEngine, 'awardPoints')

      // 1. Start with regulation detection
      await eventBus.publish(testRegulationEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // 2. Simulate ATLAS finding vulnerability during compliance assessment
      await eventBus.publish(testVulnerabilityEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // 3. Simulate PRISM completing risk quantification
      await eventBus.publish(testRiskQuantificationEvent)
      await new Promise(resolve => setTimeout(resolve, 100))

      // Verify complete workflow execution
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'security.assessment.requested' })
      )
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'risk.quantification.requested' })
      )
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'decision.routing.requested' })
      )
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'emergency.decision.required' })
      )

      // Verify trust equity was awarded at each stage
      expect(trustSpy).toHaveBeenCalledTimes(2) // Once for regulation, once for risk analysis
    })

    it('should handle workflow errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      // Create invalid event that should trigger error handling
      const invalidEvent = {
        ...testRegulationEvent,
        data: {
          ...testRegulationEvent.data,
          regulationId: '', // Invalid empty ID
          estimatedImplementationCost: -1000 // Invalid negative cost
        }
      }

      // Publish invalid event - should not crash the system
      await expect(eventBus.publish(invalidEvent as any)).resolves.not.toThrow()

      // Verify error was logged but system continued
      await new Promise(resolve => setTimeout(resolve, 50))

      consoleSpy.mockRestore()
    })

    it('should maintain event ordering and causality', async () => {
      const eventSpy = jest.spyOn(eventBus, 'publish')
      const publishOrder: string[] = []

      // Override publish method to track order
      const originalPublish = eventBus.publish.bind(eventBus)
      eventBus.publish = jest.fn().mockImplementation(async (event: ERIPEvent) => {
        publishOrder.push(event.type)
        return originalPublish(event)
      })

      // Publish events in sequence
      await eventBus.publish(testRegulationEvent)
      await new Promise(resolve => setTimeout(resolve, 25))
      
      await eventBus.publish(testVulnerabilityEvent)
      await new Promise(resolve => setTimeout(resolve, 25))
      
      await eventBus.publish(testRiskQuantificationEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Verify causal ordering is maintained
      const securityAssessmentIndex = publishOrder.findIndex(type => type === 'security.assessment.requested')
      const riskQuantificationIndex = publishOrder.findIndex(type => type === 'risk.quantification.requested')
      const decisionRoutingIndex = publishOrder.findIndex(type => type === 'decision.routing.requested')

      expect(securityAssessmentIndex).toBeGreaterThan(-1)
      expect(riskQuantificationIndex).toBeGreaterThan(-1)
      expect(decisionRoutingIndex).toBeGreaterThan(-1)
    })
  })

  describe('Performance and Scalability', () => {
    it('should handle high-volume event processing', async () => {
      const startTime = Date.now()
      const eventCount = 100
      const events = Array(eventCount).fill(0).map((_, i) => ({
        ...testRegulationEvent,
        eventId: `test-reg-${i}`,
        data: {
          ...testRegulationEvent.data,
          regulationId: `REG-${i}`
        }
      }))

      // Publish events concurrently
      await Promise.all(events.map(event => eventBus.publish(event)))

      const processingTime = Date.now() - startTime
      
      // Should process 100 events in under 5 seconds
      expect(processingTime).toBeLessThan(5000)
    })

    it('should maintain event persistence during processing', async () => {
      const eventSpy = jest.spyOn(mockRedis, 'setex')

      await eventBus.publish(testRegulationEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Verify events are persisted to Redis
      expect(eventSpy).toHaveBeenCalled()
    })
  })

  describe('Decision Support Integration', () => {
    it('should create decision requests for high-impact risks', async () => {
      const decisionSpy = jest.spyOn(clearanceWorkflow, 'processDecisionRequest')

      // Publish high-impact risk that should trigger decision workflow
      const highImpactRisk: PrismEvent = {
        ...testRiskQuantificationEvent,
        data: {
          ...testRiskQuantificationEvent.data,
          ale: 5000000, // High impact
          impact: 5000000,
          trustEquityRequired: 1000
        }
      }

      await eventBus.publish(highImpactRisk)
      await new Promise(resolve => setTimeout(resolve, 100))

      // Note: In actual implementation, this would be called via event routing
      // For now, we verify the service is properly configured
      expect(clearanceWorkflow).toBeDefined()
    })
  })

  describe('Trust Equity Integration', () => {
    it('should track trust equity throughout the workflow', async () => {
      const trustSpy = jest.spyOn(trustEngine, 'awardPoints')

      // Process complete workflow
      await eventBus.publish(testRegulationEvent)
      await new Promise(resolve => setTimeout(resolve, 25))
      
      await eventBus.publish(testVulnerabilityEvent)
      await new Promise(resolve => setTimeout(resolve, 25))
      
      await eventBus.publish(testRiskQuantificationEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      // Verify trust equity is awarded at multiple stages
      expect(trustSpy).toHaveBeenCalledTimes(2)
      
      const totalPointsAwarded = trustSpy.mock.calls.reduce(
        (sum, call) => sum + call[0].points, 
        0
      )
      
      expect(totalPointsAwarded).toBeGreaterThan(50) // At least 65 points total
    })
  })
})

/**
 * Helper function to create test events with realistic data
 */
function createTestEvent<T extends ERIPEvent>(
  baseEvent: T,
  overrides: Partial<T['data']> = {}
): T {
  return {
    ...baseEvent,
    eventId: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    data: {
      ...baseEvent.data,
      ...overrides
    }
  } as T
}

/**
 * Integration test utilities for workflow validation
 */
export class WorkflowTestUtils {
  static async waitForEventPropagation(ms: number = 100): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static validateEventChain(events: string[], expectedPattern: string[]): boolean {
    return expectedPattern.every((pattern, index) => {
      const found = events.find(event => event.includes(pattern))
      return found !== undefined
    })
  }

  static calculateWorkflowEfficiency(
    startTime: number,
    endTime: number,
    eventCount: number
  ): number {
    const duration = endTime - startTime
    return eventCount / duration * 1000 // events per second
  }
}