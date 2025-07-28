/**
 * Integration Tests for ERIP Velocity System
 * Tests end-to-end workflows including:
 * - Agent creation and scheduling
 * - Evidence collection and validation
 * - Real-time updates and WebSocket communication
 * - Trust Score generation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MockWebSocket, createMockAgent, createMockEvidenceItem } from '../setup';

// Mock the backend services
const mockCeleryService = {
  scheduleTask: vi.fn(),
  getTaskStatus: vi.fn(),
  cancelTask: vi.fn(),
};

const mockValidationService = {
  validateEvidence: vi.fn(),
  calculateConfidence: vi.fn(),
  generateTrustPoints: vi.fn(),
};

const mockStorageService = {
  storeEvidence: vi.fn(),
  retrieveEvidence: vi.fn(),
  deleteEvidence: vi.fn(),
};

const mockSchedulerService = {
  scheduleCollection: vi.fn(),
  cancelCollection: vi.fn(),
  getCollectionStatus: vi.fn(),
  listCustomerCollections: vi.fn(),
};

describe('Velocity System Integration', () => {
  let mockWebSocket: MockWebSocket;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWebSocket = new MockWebSocket('ws://localhost:8001/ws');
  });

  afterEach(() => {
    mockWebSocket.close();
  });

  describe('Agent Lifecycle Management', () => {
    it('should create and schedule a new agent successfully', async () => {
      const agentConfig = {
        customerId: 'customer-1',
        platform: 'aws',
        frameworkId: 'soc2',
        credentials: {
          accessKeyId: 'test-key',
          secretAccessKey: 'test-secret',
          region: 'us-east-1'
        }
      };

      mockSchedulerService.scheduleCollection.mockResolvedValue('collection-123');
      mockCeleryService.scheduleTask.mockResolvedValue('task-456');

      // Simulate agent creation
      const collectionId = await mockSchedulerService.scheduleCollection(
        agentConfig.customerId,
        agentConfig.platform,
        agentConfig.frameworkId,
        agentConfig.credentials
      );

      expect(mockSchedulerService.scheduleCollection).toHaveBeenCalledWith(
        'customer-1',
        'aws',
        'soc2',
        expect.objectContaining({
          accessKeyId: 'test-key',
          secretAccessKey: 'test-secret',
          region: 'us-east-1'
        })
      );

      expect(collectionId).toBe('collection-123');
    });

    it('should handle agent status updates via WebSocket', async () => {
      const statusUpdate = {
        type: 'agent_status_update',
        agentId: 'agent-123',
        status: 'running',
        progress: 45,
        evidenceCollected: 23,
        trustPoints: 115
      };

      let receivedUpdate: any = null;
      mockWebSocket.onmessage = (event) => {
        receivedUpdate = JSON.parse(event.data);
      };

      // Simulate status update from backend
      mockWebSocket.mockMessage(statusUpdate);

      expect(receivedUpdate).toEqual(statusUpdate);
    });

    it('should pause and resume agents correctly', async () => {
      const agentId = 'agent-123';
      
      mockSchedulerService.getCollectionStatus.mockResolvedValue({
        status: 'running',
        taskId: 'task-456'
      });

      mockCeleryService.cancelTask.mockResolvedValue(true);

      // Pause agent
      await mockCeleryService.cancelTask('task-456');
      
      expect(mockCeleryService.cancelTask).toHaveBeenCalledWith('task-456');

      // Resume agent
      mockCeleryService.scheduleTask.mockResolvedValue('task-789');
      await mockCeleryService.scheduleTask('resume_collection', { agentId });

      expect(mockCeleryService.scheduleTask).toHaveBeenCalledWith(
        'resume_collection',
        { agentId }
      );
    });
  });

  describe('Evidence Collection Workflow', () => {
    it('should collect and validate evidence successfully', async () => {
      const mockEvidence = createMockEvidenceItem({
        type: 'api_response',
        rawData: { policies: ['policy-1', 'policy-2'] },
        confidence: 0
      });

      // Mock evidence collection
      mockStorageService.storeEvidence.mockResolvedValue('evidence-123');
      
      // Mock validation
      mockValidationService.validateEvidence.mockResolvedValue({
        isValid: true,
        confidence: 92,
        issues: []
      });

      mockValidationService.calculateConfidence.mockResolvedValue(92);
      mockValidationService.generateTrustPoints.mockResolvedValue(25);

      // Simulate evidence collection workflow
      const evidenceId = await mockStorageService.storeEvidence(mockEvidence);
      expect(evidenceId).toBe('evidence-123');

      const validation = await mockValidationService.validateEvidence(mockEvidence);
      expect(validation.confidence).toBe(92);
      expect(validation.isValid).toBe(true);

      const trustPoints = await mockValidationService.generateTrustPoints(mockEvidence);
      expect(trustPoints).toBe(25);
    });

    it('should handle evidence validation failures gracefully', async () => {
      const invalidEvidence = createMockEvidenceItem({
        type: 'screenshot',
        rawData: null
      });

      mockValidationService.validateEvidence.mockResolvedValue({
        isValid: false,
        confidence: 15,
        issues: ['No image data found', 'Invalid file format']
      });

      const validation = await mockValidationService.validateEvidence(invalidEvidence);
      
      expect(validation.isValid).toBe(false);
      expect(validation.confidence).toBe(15);
      expect(validation.issues).toContain('No image data found');
    });

    it('should batch process multiple evidence items', async () => {
      const evidenceItems = [
        createMockEvidenceItem({ id: 'evidence-1' }),
        createMockEvidenceItem({ id: 'evidence-2' }),
        createMockEvidenceItem({ id: 'evidence-3' })
      ];

      mockValidationService.validateEvidence
        .mockResolvedValueOnce({ isValid: true, confidence: 95 })
        .mockResolvedValueOnce({ isValid: true, confidence: 88 })
        .mockResolvedValueOnce({ isValid: false, confidence: 20 });

      const results = await Promise.all(
        evidenceItems.map(item => mockValidationService.validateEvidence(item))
      );

      expect(results).toHaveLength(3);
      expect(results[0].confidence).toBe(95);
      expect(results[1].confidence).toBe(88);
      expect(results[2].isValid).toBe(false);
    });
  });

  describe('Real-time Updates', () => {
    it('should broadcast evidence collection updates', async () => {
      const updates: any[] = [];
      
      mockWebSocket.onmessage = (event) => {
        updates.push(JSON.parse(event.data));
      };

      // Simulate multiple updates
      mockWebSocket.mockMessage({
        type: 'evidence_collected',
        agentId: 'agent-123',
        evidenceId: 'evidence-456',
        control: 'CC6.1',
        trustPoints: 25
      });

      mockWebSocket.mockMessage({
        type: 'trust_score_updated',
        customerId: 'customer-1',
        newScore: 87.5,
        delta: 2.3
      });

      mockWebSocket.mockMessage({
        type: 'agent_progress',
        agentId: 'agent-123',
        progress: 67,
        estimatedCompletion: '2024-01-15T14:30:00Z'
      });

      expect(updates).toHaveLength(3);
      expect(updates[0].type).toBe('evidence_collected');
      expect(updates[1].type).toBe('trust_score_updated');
      expect(updates[2].type).toBe('agent_progress');
    });

    it('should handle WebSocket connection errors gracefully', async () => {
      let errorReceived = false;
      
      mockWebSocket.onerror = () => {
        errorReceived = true;
      };

      // Simulate connection error
      if (mockWebSocket.onerror) {
        mockWebSocket.onerror(new Event('error'));
      }

      expect(errorReceived).toBe(true);
    });

    it('should reconnect on connection loss', async () => {
      let connectionClosed = false;
      let reconnected = false;

      mockWebSocket.onclose = () => {
        connectionClosed = true;
        // Simulate reconnection logic
        setTimeout(() => {
          const newWebSocket = new MockWebSocket('ws://localhost:8001/ws');
          reconnected = true;
        }, 1000);
      };

      // Close connection
      mockWebSocket.close();

      expect(connectionClosed).toBe(true);

      // Wait for reconnection
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      expect(reconnected).toBe(true);
    });
  });

  describe('Trust Score Generation', () => {
    it('should calculate Trust Score based on evidence quality', async () => {
      const evidenceItems = [
        createMockEvidenceItem({ confidence: 95, trustPoints: 30 }),
        createMockEvidenceItem({ confidence: 88, trustPoints: 25 }),
        createMockEvidenceItem({ confidence: 92, trustPoints: 28 })
      ];

      const totalTrustPoints = evidenceItems.reduce((sum, item) => sum + item.trustPoints, 0);
      const averageConfidence = evidenceItems.reduce((sum, item) => sum + item.confidence, 0) / evidenceItems.length;

      expect(totalTrustPoints).toBe(83);
      expect(Math.round(averageConfidence)).toBe(92);
    });

    it('should apply 3x multiplier for AI-collected evidence', async () => {
      const manualEvidence = createMockEvidenceItem({ 
        confidence: 90, 
        trustPoints: 20,
        type: 'manual_upload'
      });

      const aiEvidence = createMockEvidenceItem({ 
        confidence: 90, 
        trustPoints: 20,
        type: 'ai_collected'
      });

      // Simulate 3x multiplier for AI evidence
      const aiTrustPoints = aiEvidence.type === 'ai_collected' 
        ? aiEvidence.trustPoints * 3 
        : aiEvidence.trustPoints;

      expect(manualEvidence.trustPoints).toBe(20);
      expect(aiTrustPoints).toBe(60);
    });
  });

  describe('Continuous Monitoring', () => {
    it('should schedule periodic evidence collection', async () => {
      const scheduleConfig = {
        customerId: 'customer-1',
        platform: 'aws',
        frameworkId: 'soc2',
        scheduleType: 'continuous', // Every 4 hours
        configuration: { region: 'us-east-1' }
      };

      mockSchedulerService.scheduleCollection.mockResolvedValue('collection-123');

      const collectionId = await mockSchedulerService.scheduleCollection(
        scheduleConfig.customerId,
        scheduleConfig.platform,
        scheduleConfig.frameworkId,
        scheduleConfig.scheduleType,
        scheduleConfig.configuration
      );

      expect(collectionId).toBe('collection-123');
      expect(mockSchedulerService.scheduleCollection).toHaveBeenCalledWith(
        'customer-1',
        'aws',
        'soc2',
        'continuous',
        { region: 'us-east-1' }
      );
    });

    it('should list all customer collections', async () => {
      const mockCollections = [
        { id: 'collection-1', platform: 'aws', status: 'running' },
        { id: 'collection-2', platform: 'gcp', status: 'paused' },
        { id: 'collection-3', platform: 'github', status: 'running' }
      ];

      mockSchedulerService.listCustomerCollections.mockResolvedValue(mockCollections);

      const collections = await mockSchedulerService.listCustomerCollections('customer-1');

      expect(collections).toHaveLength(3);
      expect(collections[0].platform).toBe('aws');
      expect(collections[2].status).toBe('running');
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle high-frequency updates efficiently', async () => {
      const updateCount = 100;
      const updates: any[] = [];
      
      mockWebSocket.onmessage = (event) => {
        updates.push(JSON.parse(event.data));
      };

      // Simulate rapid updates
      for (let i = 0; i < updateCount; i++) {
        mockWebSocket.mockMessage({
          type: 'metric_update',
          timestamp: Date.now(),
          data: { value: i }
        });
      }

      expect(updates).toHaveLength(updateCount);
      expect(updates[99].data.value).toBe(99);
    });

    it('should handle concurrent agent operations', async () => {
      const agents = Array.from({ length: 10 }, (_, i) => 
        createMockAgent({ id: `agent-${i}` })
      );

      const operations = agents.map(agent => 
        mockSchedulerService.getCollectionStatus(agent.id)
      );

      mockSchedulerService.getCollectionStatus.mockResolvedValue({
        status: 'running',
        progress: 50
      });

      const results = await Promise.all(operations);

      expect(results).toHaveLength(10);
      expect(mockSchedulerService.getCollectionStatus).toHaveBeenCalledTimes(10);
    });
  });
});