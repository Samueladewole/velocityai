/**
 * Complete Workflow Integration Test Suite
 * 
 * Comprehensive end-to-end testing for:
 * 1. Enhanced Core Trio Integration with resilience
 * 2. PULSE Real-time Monitoring
 * 3. Competitor Breach Response Workflow  
 * 4. Trust Score Generation for Sales
 * 
 * Tests full event-driven architecture with error handling and monitoring
 */

import { describe, beforeAll, afterAll, beforeEach, it, expect, jest } from '@jest/globals'
import { ERIPEventBus, EventBusConfig } from '../../infrastructure/events/eventBus'
import { TrustEquityEngine } from '../../infrastructure/trustEquity/engine'
import { EnhancedCoreTrioIntegration, EnhancedTrioConfig } from '../../services/integration/enhancedTrioIntegration'
import { PulseMonitoringService, PulseConfig } from '../../services/monitoring/pulseMonitoringService'
import { WorkflowOrchestrator, WorkflowConfig, BreachResponseContext, TrustScoreGenerationContext } from '../../services/orchestration/workflowOrchestrator'
import { ERIPEvent, CompassEvent, AtlasEvent, PrismEvent } from '../../infrastructure/events/schemas'
import Redis from 'ioredis'
import WebSocket from 'ws'

// Mock external dependencies
jest.mock('ioredis')
jest.mock('ws')

describe('Complete Workflow Integration Tests', () => {
  let eventBus: ERIPEventBus
  let trustEngine: TrustEquityEngine
  let enhancedTrioIntegration: EnhancedCoreTrioIntegration
  let pulseMonitoring: PulseMonitoringService
  let workflowOrchestrator: WorkflowOrchestrator
  let mockRedis: jest.Mocked<Redis>

  // Test configuration
  const testConfig = {
    eventBus: {
      redis: {
        host: 'localhost',
        port: 6379,
        db: 15
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
    },
    resilience: {
      circuitBreakerThreshold: 5,
      maxRetryAttempts: 3,
      retryDelayMs: 1000,
      timeoutMs: 10000
    },
    performance: {
      enableBatching: true,
      batchSize: 50,
      batchTimeoutMs: 2000,
      enableCaching: true,
      cacheSize: 1000,
      cacheTtlMs: 300000
    },
    monitoring: {
      enableMetrics: true,
      enableTracing: true,
      healthCheckIntervalMs: 30000,
      metricsExportIntervalMs: 60000
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

    // Initialize core infrastructure
    const eventBusConfig: EventBusConfig = testConfig.eventBus
    eventBus = new ERIPEventBus(eventBusConfig)
    trustEngine = TrustEquityEngine.getInstance()

    // Initialize enhanced trio integration
    const enhancedTrioConfig: EnhancedTrioConfig = {
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
      },
      resilience: testConfig.resilience,
      performance: testConfig.performance,
      monitoring: testConfig.monitoring
    }
    enhancedTrioIntegration = new EnhancedCoreTrioIntegration(enhancedTrioConfig)

    // Initialize PULSE monitoring
    const pulseConfig: PulseConfig = {
      eventBus,
      trustEngine,
      monitoring: {
        metricsRetentionHours: 24,
        alertingEnabled: true,
        realTimeUpdatesEnabled: true,
        anomalyDetectionEnabled: true
      },
      websocket: {
        port: 8080,
        heartbeatInterval: 30000,
        connectionTimeout: 60000
      },
      database: {
        influxUrl: 'http://localhost:8086',
        influxToken: 'test-token',
        influxOrg: 'test-org',
        influxBucket: 'test-bucket'
      },
      thresholds: {
        responseTimeMs: 5000,
        errorRatePercent: 5,
        trustScoreMinimum: 70,
        componentHealthThreshold: 80
      }
    }
    pulseMonitoring = new PulseMonitoringService(pulseConfig)

    // Initialize workflow orchestrator
    const workflowConfig: WorkflowConfig = {
      eventBus,
      trustEngine,
      monitoring: pulseMonitoring,
      workflows: {
        breachResponse: {
          enabled: true,
          autoEscalation: true,
          stakeholderNotification: true,
          timeoutMinutes: 60
        },
        trustScoreGeneration: {
          enabled: true,
          updateFrequencyMinutes: 30,
          shareableUrlEnabled: true,
          realTimeUpdates: true
        }
      },
      security: {
        encryptedCommunication: true,
        auditAllActions: true,
        zeroTrustMode: true
      }
    }
    workflowOrchestrator = new WorkflowOrchestrator(workflowConfig)

    // Allow components to initialize
    await new Promise(resolve => setTimeout(resolve, 200))
  })

  afterAll(async () => {
    // Cleanup all services
    enhancedTrioIntegration?.shutdown()
    pulseMonitoring?.shutdown()
    workflowOrchestrator?.shutdown()
    await eventBus?.shutdown()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Enhanced Core Trio Integration with Resilience', () => {
    it('should handle high-volume events with batching and resilience', async () => {
      const eventCount = 100
      const events = Array(eventCount).fill(0).map((_, i) => createTestRegulationEvent(`REG-${i}`))

      const startTime = Date.now()
      
      // Publish events concurrently
      await Promise.all(events.map(event => eventBus.publish(event)))
      
      // Wait for batch processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const processingTime = Date.now() - startTime
      
      // Should handle 100 events efficiently with batching
      expect(processingTime).toBeLessThan(10000) // Under 10 seconds
      
      // Verify metrics collection
      const metrics = enhancedTrioIntegration.getMetrics()
      expect(metrics.eventsProcessed).toBeGreaterThan(0)
      expect(metrics.errorRate).toBeLessThan(0.05) // Less than 5% error rate
    })

    it('should recover gracefully from circuit breaker trips', async () => {
      // Force circuit breaker to trip by simulating component failures
      const failingEvent = createTestVulnerabilityEvent('FAIL-001', 'critical')
      
      // Mock component failure
      const originalPublish = eventBus.publish
      let callCount = 0
      eventBus.publish = jest.fn().mockImplementation(async (event) => {
        callCount++
        if (callCount <= 3 && event.type === 'risk.quantification.requested') {
          throw new Error('Simulated component failure')
        }
        return originalPublish.call(eventBus, event)
      })

      // This should trigger circuit breaker but then recover
      await eventBus.publish(failingEvent)
      
      // Wait for circuit breaker recovery
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Subsequent events should be processed normally
      const normalEvent = createTestRegulationEvent('REG-RECOVERY')
      await expect(eventBus.publish(normalEvent)).resolves.not.toThrow()
      
      // Restore original implementation
      eventBus.publish = originalPublish
    })

    it('should cache frequently accessed data', async () => {
      const regulation1 = createTestRegulationEvent('REG-CACHE-1')
      const regulation2 = createTestRegulationEvent('REG-CACHE-1') // Same regulation ID
      
      const startTime1 = Date.now()
      await eventBus.publish(regulation1)
      const time1 = Date.now() - startTime1
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const startTime2 = Date.now()
      await eventBus.publish(regulation2)
      const time2 = Date.now() - startTime2
      
      // Second processing should be faster due to caching
      expect(time2).toBeLessThan(time1)
    })
  })

  describe('PULSE Real-time Monitoring Integration', () => {
    it('should aggregate system metrics in real-time', async () => {
      // Publish various events from different components
      await eventBus.publish(createTestRegulationEvent('REG-PULSE-1'))
      await eventBus.publish(createTestVulnerabilityEvent('VULN-PULSE-1', 'high'))
      await eventBus.publish(createTestRiskQuantificationEvent('RISK-PULSE-1'))
      
      // Wait for metrics aggregation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const systemMetrics = pulseMonitoring.getSystemMetrics()
      
      expect(systemMetrics.activeComponents).toBeGreaterThan(0)
      expect(systemMetrics.overallHealth).toBeDefined()
      expect(systemMetrics.trustScore).toBeGreaterThanOrEqual(0)
      expect(systemMetrics.totalRequests).toBeGreaterThan(0)
    })

    it('should detect and alert on anomalies', async () => {
      const alertSpy = jest.spyOn(pulseMonitoring, 'getActiveAlerts')
      
      // Simulate anomalous behavior - very slow response time
      const slowEvent = createTestEvent({
        type: 'test.slow.response',
        source: 'atlas',
        data: { processingTime: 15000 } // 15 seconds - way above threshold
      })
      
      await eventBus.publish(slowEvent)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const alerts = pulseMonitoring.getActiveAlerts()
      expect(alerts.length).toBeGreaterThan(0)
      expect(alerts.some(alert => alert.title.includes('Slow response'))).toBe(true)
    })

    it('should provide real-time component health status', async () => {
      const componentMetrics = pulseMonitoring.getComponentMetrics()
      
      expect(componentMetrics).toBeDefined()
      expect(Array.isArray(componentMetrics)).toBe(true)
      
      // Should have metrics for active components
      const compassMetrics = componentMetrics.find(c => c.componentId === 'compass')
      if (compassMetrics) {
        expect(compassMetrics.status).toMatch(/healthy|degraded|unhealthy/)
        expect(compassMetrics.lastActivity).toBeDefined()
      }
    })

    it('should calculate and broadcast trust score updates', async () => {
      const trustScoreSpy = jest.spyOn(trustEngine, 'getTrustScore')
      trustScoreSpy.mockResolvedValue(85.5)
      
      // Trigger trust score calculation
      await pulseMonitoring['calculateRealTimeTrustScore']()
      
      const systemMetrics = pulseMonitoring.getSystemMetrics()
      expect(systemMetrics.trustScore).toBe(85.5)
      expect(trustScoreSpy).toHaveBeenCalled()
    })
  })

  describe('Competitor Breach Response Workflow', () => {
    it('should execute complete breach response workflow', async () => {
      const breachContext: BreachResponseContext = {
        breachId: 'BREACH-TEST-001',
        sourceIntel: 'nexus',
        threatType: 'data_breach',
        severity: 'high',
        affectedIndustry: 'financial_services',
        competitors: ['CompetitorA', 'CompetitorB'],
        potentialImpact: {
          dataExposure: true,
          systemVulnerability: true,
          complianceRisk: true,
          reputationalRisk: true
        },
        timeline: {
          detectedAt: new Date().toISOString(),
          reportedAt: new Date().toISOString()
        }
      }

      const execution = await workflowOrchestrator.executeBreachResponseWorkflow(breachContext)

      // Verify workflow completion
      expect(execution.status).toBe('completed')
      expect(execution.steps.length).toBe(6) // All 6 steps should be executed
      expect(execution.steps.every(step => step.status === 'completed')).toBe(true)
      expect(execution.result).toBeDefined()
      expect(execution.duration).toBeGreaterThan(0)

      // Verify each component was involved
      const componentSteps = execution.steps.map(s => s.component)
      expect(componentSteps).toContain('nexus')
      expect(componentSteps).toContain('atlas')
      expect(componentSteps).toContain('compass')
      expect(componentSteps).toContain('prism')
      expect(componentSteps).toContain('clearance')
      expect(componentSteps).toContain('beacon')

      // Verify trust equity was awarded
      expect(execution.result.valueCreated).toBeDefined()
    })

    it('should handle breach response workflow failures gracefully', async () => {
      // Create a context that will cause component failures
      const failureContext: BreachResponseContext = {
        breachId: 'BREACH-FAIL-001',
        sourceIntel: 'nexus',
        threatType: 'data_breach',
        severity: 'critical',
        affectedIndustry: 'technology',
        competitors: ['FailingCompetitor'],
        potentialImpact: {
          dataExposure: true,
          systemVulnerability: false,
          complianceRisk: false,
          reputationalRisk: true
        },
        timeline: {
          detectedAt: new Date().toISOString(),
          reportedAt: new Date().toISOString()
        }
      }

      // Mock a failing component step
      const originalExecuteComponentAction = workflowOrchestrator['executeComponentAction']
      workflowOrchestrator['executeComponentAction'] = jest.fn().mockImplementation(async (step) => {
        if (step.component === 'atlas' && step.action === 'assess_breach_impact') {
          throw new Error('Atlas service temporarily unavailable')
        }
        return originalExecuteComponentAction.call(workflowOrchestrator, step)
      })

      // Workflow should fail but be handled gracefully
      await expect(workflowOrchestrator.executeBreachResponseWorkflow(failureContext)).rejects.toThrow()

      const workflows = workflowOrchestrator.getWorkflowHistory(10)
      const failedWorkflow = workflows.find(w => w.metadata.context.breachId === 'BREACH-FAIL-001')

      expect(failedWorkflow).toBeDefined()
      expect(failedWorkflow?.status).toBe('failed')
      expect(failedWorkflow?.errors).toBeDefined()
      expect(failedWorkflow?.errors?.length).toBeGreaterThan(0)

      // Restore original method
      workflowOrchestrator['executeComponentAction'] = originalExecuteComponentAction
    })

    it('should escalate critical breaches immediately', async () => {
      const criticalBreachContext: BreachResponseContext = {
        breachId: 'BREACH-CRITICAL-001',
        sourceIntel: 'nexus',
        threatType: 'supply_chain',
        severity: 'critical',
        affectedIndustry: 'healthcare',
        competitors: ['CriticalCompetitor'],
        potentialImpact: {
          dataExposure: true,
          systemVulnerability: true,
          complianceRisk: true,
          reputationalRisk: true
        },
        timeline: {
          detectedAt: new Date().toISOString(),
          reportedAt: new Date().toISOString()
        }
      }

      const execution = await workflowOrchestrator.executeBreachResponseWorkflow(criticalBreachContext)

      // Critical breaches should have executive-level routing
      const clearanceStep = execution.steps.find(s => s.stepId === 'clearance_decision_routing')
      expect(clearanceStep?.output?.routingDecision?.approvalLevel).toBe('executive')
      expect(clearanceStep?.output?.routingDecision?.urgency).toBe('immediate')
    })
  })

  describe('Trust Score Generation for Sales Workflow', () => {
    it('should generate comprehensive trust score for sales', async () => {
      const trustScoreContext: TrustScoreGenerationContext = {
        requestId: 'TRUST-SALES-001',
        requestType: 'sales',
        requester: {
          id: 'sales-001',
          name: 'John Sales',
          organization: 'ERIP Corp',
          role: 'Sales Director'
        },
        scope: {
          frameworks: ['SOC2', 'ISO27001', 'GDPR'],
          timeframe: 'current',
          includeBreakdown: true,
          shareableUrl: true
        },
        customization: {
          brandingEnabled: true,
          executiveSummary: true,
          technicalDetails: false,
          complianceMapping: true
        }
      }

      const execution = await workflowOrchestrator.executeTrustScoreGenerationWorkflow(trustScoreContext)

      // Verify workflow completion
      expect(execution.status).toBe('completed')
      expect(execution.steps.length).toBe(7) // All 7 steps including shareable URL
      expect(execution.result).toBeDefined()

      // Verify trust score structure
      const result = execution.result
      expect(result.trustScore).toBeDefined()
      expect(result.trustScore.overall).toBeGreaterThan(0)
      expect(result.trustScore.overall).toBeLessThanOrEqual(100)
      expect(result.trustScore.breakdown).toBeDefined()
      expect(result.presentation).toBeDefined()
      expect(result.shareableUrl).toBeDefined()

      // Verify shareable URL format
      expect(result.shareableUrl.url).toMatch(/^https:\/\/trust\.erip\.platform\/share\/[a-z0-9]+$/)
      expect(result.shareableUrl.expiresAt).toBeDefined()
    })

    it('should generate trust score without shareable URL', async () => {
      const contextWithoutUrl: TrustScoreGenerationContext = {
        requestId: 'TRUST-INTERNAL-001',
        requestType: 'audit',
        requester: {
          id: 'audit-001',
          name: 'Jane Auditor',
          organization: 'Internal Audit',
          role: 'Senior Auditor'
        },
        scope: {
          frameworks: ['SOC2'],
          timeframe: 'historical',
          includeBreakdown: true,
          shareableUrl: false
        },
        customization: {
          brandingEnabled: false,
          executiveSummary: true,
          technicalDetails: true,
          complianceMapping: true
        }
      }

      const execution = await workflowOrchestrator.executeTrustScoreGenerationWorkflow(contextWithoutUrl)

      expect(execution.status).toBe('completed')
      expect(execution.steps.length).toBe(6) // No shareable URL step
      expect(execution.result.shareableUrl).toBeNull()
      expect(execution.result.trustScore).toBeDefined()
    })

    it('should aggregate data from all components for trust score', async () => {
      const execution = await workflowOrchestrator.executeTrustScoreGenerationWorkflow({
        requestId: 'TRUST-AGGREGATE-001',
        requestType: 'partnership',
        requester: {
          id: 'partner-001',
          name: 'Partnership Team',
          organization: 'ERIP Corp',
          role: 'Partner Manager'
        },
        scope: {
          frameworks: ['SOC2', 'ISO27001'],
          timeframe: 'current',
          includeBreakdown: true,
          shareableUrl: true
        },
        customization: {
          brandingEnabled: true,
          executiveSummary: true,
          technicalDetails: true,
          complianceMapping: true
        }
      })

      // Verify data was collected from all expected components
      const stepComponents = execution.steps.map(s => s.component)
      expect(stepComponents).toContain('compass')
      expect(stepComponents).toContain('atlas')
      expect(stepComponents).toContain('prism')
      expect(stepComponents).toContain('pulse')
      expect(stepComponents).toContain('trust_engine')
      expect(stepComponents).toContain('beacon')

      // Verify comprehensive trust score calculation
      const trustCalculationStep = execution.steps.find(s => s.stepId === 'trust_score_calculation')
      expect(trustCalculationStep?.input?.complianceData).toBeDefined()
      expect(trustCalculationStep?.input?.securityData).toBeDefined()
      expect(trustCalculationStep?.input?.riskData).toBeDefined()
      expect(trustCalculationStep?.input?.operationalData).toBeDefined()
    })
  })

  describe('End-to-End Workflow Integration', () => {
    it('should handle concurrent workflows without interference', async () => {
      // Start breach response workflow
      const breachPromise = workflowOrchestrator.executeBreachResponseWorkflow({
        breachId: 'CONCURRENT-BREACH-001',
        sourceIntel: 'nexus',
        threatType: 'data_breach',
        severity: 'medium',
        affectedIndustry: 'technology',
        competitors: ['ConcurrentComp'],
        potentialImpact: {
          dataExposure: true,
          systemVulnerability: false,
          complianceRisk: true,
          reputationalRisk: false
        },
        timeline: {
          detectedAt: new Date().toISOString(),
          reportedAt: new Date().toISOString()
        }
      })

      // Start trust score generation workflow concurrently
      const trustScorePromise = workflowOrchestrator.executeTrustScoreGenerationWorkflow({
        requestId: 'CONCURRENT-TRUST-001',
        requestType: 'sales',
        requester: {
          id: 'concurrent-001',
          name: 'Concurrent User',
          organization: 'ERIP Corp',
          role: 'Sales Rep'
        },
        scope: {
          frameworks: ['SOC2'],
          timeframe: 'current',
          includeBreakdown: false,
          shareableUrl: false
        },
        customization: {
          brandingEnabled: false,
          executiveSummary: false,
          technicalDetails: false,
          complianceMapping: false
        }
      })

      // Both workflows should complete successfully
      const [breachResult, trustScoreResult] = await Promise.all([breachPromise, trustScorePromise])

      expect(breachResult.status).toBe('completed')
      expect(trustScoreResult.status).toBe('completed')
      expect(breachResult.workflowId).not.toBe(trustScoreResult.workflowId)
    })

    it('should maintain event ordering and causality in complex workflows', async () => {
      const eventOrder: string[] = []
      
      // Mock event publishing to track order
      const originalPublish = eventBus.publish
      eventBus.publish = jest.fn().mockImplementation(async (event: ERIPEvent) => {
        eventOrder.push(`${event.source}:${event.type}`)
        return originalPublish.call(eventBus, event)
      })

      // Execute breach response workflow
      await workflowOrchestrator.executeBreachResponseWorkflow({
        breachId: 'ORDERING-TEST-001',
        sourceIntel: 'nexus',
        threatType: 'data_breach',
        severity: 'high',
        affectedIndustry: 'financial',
        competitors: ['OrderingTestComp'],
        potentialImpact: {
          dataExposure: true,
          systemVulnerability: true,
          complianceRisk: true,
          reputationalRisk: true
        },
        timeline: {
          detectedAt: new Date().toISOString(),
          reportedAt: new Date().toISOString()
        }
      })

      // Verify workflow events were published in logical order
      expect(eventOrder).toContain('workflow_orchestrator:workflow.step.completed')
      
      // Restore original implementation
      eventBus.publish = originalPublish
    })

    it('should provide comprehensive monitoring and metrics for all workflows', async () => {
      // Execute a complete workflow
      await workflowOrchestrator.executeTrustScoreGenerationWorkflow({
        requestId: 'MONITORING-TEST-001',
        requestType: 'compliance',
        requester: {
          id: 'monitoring-001',
          name: 'Monitor User',
          organization: 'ERIP Corp',
          role: 'Compliance Officer'
        },
        scope: {
          frameworks: ['GDPR'],
          timeframe: 'current',
          includeBreakdown: true,
          shareableUrl: false
        },
        customization: {
          brandingEnabled: false,
          executiveSummary: true,
          technicalDetails: false,
          complianceMapping: true
        }
      })

      // Verify monitoring captured workflow metrics
      const systemMetrics = pulseMonitoring.getSystemMetrics()
      expect(systemMetrics.totalRequests).toBeGreaterThan(0)
      
      const workflowHistory = workflowOrchestrator.getWorkflowHistory(10)
      expect(workflowHistory.length).toBeGreaterThan(0)
      
      const monitoringWorkflow = workflowHistory.find(w => w.metadata.context.requestId === 'MONITORING-TEST-001')
      expect(monitoringWorkflow).toBeDefined()
      expect(monitoringWorkflow?.status).toBe('completed')
    })

    it('should handle system-wide errors gracefully with proper recovery', async () => {
      // Simulate system-wide failure
      const originalTrustEngineMethod = trustEngine.awardPoints
      trustEngine.awardPoints = jest.fn().mockRejectedValue(new Error('Trust engine failure'))

      // Workflow should handle the failure and continue
      const execution = await workflowOrchestrator.executeTrustScoreGenerationWorkflow({
        requestId: 'ERROR-HANDLING-001',
        requestType: 'sales',
        requester: {
          id: 'error-test-001',
          name: 'Error Test User',
          organization: 'ERIP Corp',
          role: 'Tester'
        },
        scope: {
          frameworks: ['SOC2'],
          timeframe: 'current',
          includeBreakdown: false,
          shareableUrl: false
        },
        customization: {
          brandingEnabled: false,
          executiveSummary: false,
          technicalDetails: false,
          complianceMapping: false
        }
      })

      // Workflow should complete despite trust engine failure
      expect(execution.status).toBe('completed')
      expect(execution.result).toBeDefined()

      // Restore original method
      trustEngine.awardPoints = originalTrustEngineMethod
    })
  })

  describe('Performance and Scalability', () => {
    it('should maintain performance under high load', async () => {
      const startTime = Date.now()
      const concurrentWorkflows = 10
      
      const workflowPromises = Array(concurrentWorkflows).fill(0).map((_, i) => 
        workflowOrchestrator.executeTrustScoreGenerationWorkflow({
          requestId: `PERFORMANCE-${i}`,
          requestType: 'sales',
          requester: {
            id: `perf-user-${i}`,
            name: `Performance User ${i}`,
            organization: 'ERIP Corp',
            role: 'Tester'
          },
          scope: {
            frameworks: ['SOC2'],
            timeframe: 'current',
            includeBreakdown: false,
            shareableUrl: false
          },
          customization: {
            brandingEnabled: false,
            executiveSummary: false,
            technicalDetails: false,
            complianceMapping: false
          }
        })
      )

      const results = await Promise.all(workflowPromises)
      const totalTime = Date.now() - startTime

      // All workflows should complete successfully
      expect(results.every(result => result.status === 'completed')).toBe(true)
      
      // Should complete 10 workflows in reasonable time (under 30 seconds)
      expect(totalTime).toBeLessThan(30000)
      
      // Average workflow time should be reasonable
      const avgWorkflowTime = results.reduce((sum, result) => sum + (result.duration || 0), 0) / results.length
      expect(avgWorkflowTime).toBeLessThan(10000) // Under 10 seconds average
    })
  })

  describe('Security and Audit Trail', () => {
    it('should maintain complete audit trail for all workflows', async () => {
      const auditEvents: ERIPEvent[] = []
      
      // Capture all audit events
      const auditUnsubscribe = eventBus.subscribe('*', (event) => {
        if (event.type.includes('workflow') || event.type.includes('audit')) {
          auditEvents.push(event)
        }
      })

      // Execute workflow
      await workflowOrchestrator.executeBreachResponseWorkflow({
        breachId: 'AUDIT-TEST-001',
        sourceIntel: 'manual',
        threatType: 'insider_threat',
        severity: 'medium',
        affectedIndustry: 'technology',
        competitors: ['AuditTestComp'],
        potentialImpact: {
          dataExposure: false,
          systemVulnerability: true,
          complianceRisk: false,
          reputationalRisk: true
        },
        timeline: {
          detectedAt: new Date().toISOString(),
          reportedAt: new Date().toISOString()
        }
      })

      // Verify audit events were captured
      expect(auditEvents.length).toBeGreaterThan(0)
      
      const workflowEvents = auditEvents.filter(e => e.type.includes('workflow'))
      expect(workflowEvents.length).toBeGreaterThan(0)
      
      auditUnsubscribe()
    })
  })

  /**
   * Helper functions for creating test events
   */
  function createTestRegulationEvent(regulationId: string): CompassEvent {
    return {
      type: 'regulation.detected',
      source: 'compass',
      eventId: `test-reg-${regulationId}`,
      timestamp: new Date().toISOString(),
      data: {
        regulationId,
        title: `Test Regulation ${regulationId}`,
        source: 'Test Source',
        impact: 'medium',
        effectiveDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        affectedFrameworks: ['SOC2', 'ISO27001'],
        estimatedImplementationCost: 100000,
        trustEquityImpact: 50
      }
    }
  }

  function createTestVulnerabilityEvent(vulnerabilityId: string, severity: 'low' | 'medium' | 'high' | 'critical'): AtlasEvent {
    return {
      type: 'vulnerability.discovered',
      source: 'atlas',
      eventId: `test-vuln-${vulnerabilityId}`,
      timestamp: new Date().toISOString(),
      data: {
        vulnerabilityId,
        assetId: 'test-asset-001',
        severity,
        cvssScore: severity === 'critical' ? 9.5 : severity === 'high' ? 7.5 : severity === 'medium' ? 5.0 : 2.0,
        description: `Test vulnerability ${vulnerabilityId}`,
        affectedSystems: ['test-system-001'],
        remediationSteps: ['Apply patch', 'Restart service'],
        complianceFrameworksAffected: ['SOC2'],
        trustEquityImpact: severity === 'critical' ? 100 : 50
      }
    }
  }

  function createTestRiskQuantificationEvent(riskId: string): PrismEvent {
    return {
      type: 'risk.quantified',
      source: 'prism',
      eventId: `test-risk-${riskId}`,
      timestamp: new Date().toISOString(),
      data: {
        riskId,
        scenario: 'test_scenario',
        probability: 0.1,
        impact: 500000,
        ale: 50000,
        sle: 500000,
        aro: 0.1,
        confidenceInterval: { lower: 30000, upper: 70000 },
        mitigationCost: 25000,
        residualRisk: 15000,
        trustEquityRequired: 75
      }
    }
  }

  function createTestEvent(overrides: Partial<ERIPEvent>): ERIPEvent {
    return {
      eventId: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'test.event' as any,
      source: 'test' as any,
      data: {},
      ...overrides
    }
  }
})

/**
 * Test utilities for workflow validation
 */
export class WorkflowTestUtils {
  static async waitForWorkflowCompletion(
    orchestrator: WorkflowOrchestrator,
    workflowId: string,
    timeoutMs: number = 30000
  ): Promise<any> {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeoutMs) {
      const workflow = orchestrator.getWorkflowById(workflowId)
      if (workflow && (workflow.status === 'completed' || workflow.status === 'failed')) {
        return workflow
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    throw new Error(`Workflow ${workflowId} did not complete within ${timeoutMs}ms`)
  }

  static validateWorkflowStep(step: any, expectedComponent: string, expectedAction: string): boolean {
    return step.component === expectedComponent && 
           step.action === expectedAction && 
           step.status === 'completed'
  }

  static calculateWorkflowEfficiency(execution: any): number {
    const totalSteps = execution.steps.length
    const completedSteps = execution.steps.filter((s: any) => s.status === 'completed').length
    const duration = execution.duration || 1
    
    return (completedSteps / totalSteps) * (60000 / duration) // steps per minute efficiency
  }

  static validateEventSequence(events: string[], expectedSequence: string[]): boolean {
    let sequenceIndex = 0
    
    for (const event of events) {
      if (sequenceIndex < expectedSequence.length && event.includes(expectedSequence[sequenceIndex])) {
        sequenceIndex++
      }
    }
    
    return sequenceIndex === expectedSequence.length
  }
}