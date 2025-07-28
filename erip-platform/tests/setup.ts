/**
 * Test Setup Configuration for ERIP Velocity Tier
 * Provides comprehensive testing infrastructure including:
 * - Unit tests for AI agents
 * - Integration tests for evidence collection
 * - Security tests for OWASP compliance
 * - Performance tests for real-time features
 */

import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';

// Setup DOM environment for testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock WebSocket for real-time testing
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  url: string;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 100);
  }

  send = vi.fn();
  close = vi.fn(() => {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  });

  // Helper method for testing
  mockMessage(data: any) {
    if (this.onmessage) {
      this.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
    }
  }
}

Object.defineProperty(global, 'WebSocket', {
  writable: true,
  configurable: true,
  value: MockWebSocket,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock fetch for API testing
global.fetch = vi.fn();

// Setup and teardown
beforeAll(() => {
  // Any global setup
  console.log('🧪 Setting up ERIP Velocity test environment...');
});

afterEach(() => {
  // Clean up after each test
  cleanup();
  vi.clearAllMocks();
});

afterAll(() => {
  // Clean up after all tests
  console.log('✅ ERIP Velocity tests completed');
});

// Export test utilities
export {
  MockWebSocket,
  localStorageMock,
  sessionStorageMock,
};

// Test data factories
export const createMockAgent = (overrides = {}) => ({
  id: 'test-agent-1',
  name: 'Test AWS Agent',
  status: 'running' as const,
  framework: 'SOC2',
  platform: 'AWS',
  evidenceCollected: 150,
  lastRun: '2 minutes ago',
  nextRun: 'In 3h 24m',
  trustPoints: 450,
  progress: 75,
  ...overrides,
});

export const createMockMetrics = (overrides = {}) => ({
  activeAgents: 3,
  totalEvidence: 350,
  totalTrustPoints: 1200,
  automationRate: 95.2,
  lastUpdated: new Date().toISOString(),
  ...overrides,
});

export const createMockEvidenceItem = (overrides = {}) => ({
  id: 'evidence-1',
  agentId: 'test-agent-1',
  framework: 'SOC2',
  control: 'CC6.1',
  type: 'screenshot',
  status: 'validated' as const,
  confidence: 95,
  collectedAt: new Date().toISOString(),
  validatedAt: new Date().toISOString(),
  trustPoints: 25,
  ...overrides,
});