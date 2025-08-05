/**
 * Authentication API Integration Tests
 * Tests the complete authentication flow including Zero Trust components
 */

import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import { createMockResponse } from '../setup'

// Mock database connection
const mockDb = {
  query: vi.fn(),
  connect: vi.fn().mockReturnValue({
    query: vi.fn(),
    release: vi.fn()
  })
}

// Mock Redis connection
const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  setex: vi.fn(),
  del: vi.fn(),
  exists: vi.fn()
}

// Mock services
vi.mock('pg', () => ({
  Pool: vi.fn(() => mockDb)
}))

vi.mock('ioredis', () => ({
  default: vi.fn(() => mockRedis)
}))

describe('Authentication API Integration', () => {
  let app: any
  let server: any
  const testUser = {
    email: 'integration.test@velocity.com',
    password: 'SecurePassword123!',
    firstName: 'Integration',
    lastName: 'Test'
  }

  beforeAll(async () => {
    // Setup test server
    const { setupTestServer } = await import('../helpers/testServer')
    const result = await setupTestServer()
    app = result.app
    server = result.server
  })

  afterAll(async () => {
    if (server) {
      await server.close()
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock implementations
    mockDb.query.mockResolvedValue({ rows: [] })
    mockRedis.get.mockResolvedValue(null)
    mockRedis.set.mockResolvedValue('OK')
  })

  describe('User Registration', () => {
    it('successfully registers new user with organization', async () => {
      // Mock successful database operations
      mockDb.query
        .mockResolvedValueOnce({ rows: [] }) // Check if user exists
        .mockResolvedValueOnce({ rows: [{ id: 'user-123', ...testUser }] }) // Create user
        .mockResolvedValueOnce({ rows: [{ id: 'org-123', name: 'Test Corp' }] }) // Create organization

      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...testUser,
          organizationName: 'Test Corp',
          domain: 'testcorp.com'
        })
      })

      expect(response.status).toBe(201)
      const data = await response.json()
      
      expect(data.user).toBeDefined()
      expect(data.organization).toBeDefined()
      expect(data.token).toBeDefined()
      expect(mockDb.query).toHaveBeenCalledTimes(3)
    })

    it('prevents duplicate user registration', async () => {
      mockDb.query.mockResolvedValueOnce({ 
        rows: [{ id: 'existing-user', email: testUser.email }] 
      })

      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      })

      expect(response.status).toBe(409)
      const data = await response.json()
      expect(data.error).toContain('already exists')
    })

    it('validates password requirements', async () => {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...testUser,
          password: 'weak'
        })
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('password')
    })
  })

  describe('User Login with Zero Trust', () => {
    const mockSession = {
      id: 'session-123',
      userId: 'user-123',
      trustScore: 85,
      deviceId: 'device-123',
      ipAddress: '192.168.1.1'
    }

    it('successfully logs in user and creates trust session', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ id: 'user-123', ...testUser, password_hash: 'hashed' }] })
        .mockResolvedValueOnce({ rows: [mockSession] })

      mockRedis.setex.mockResolvedValue('OK')

      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          deviceId: 'device-123',
          ipAddress: '192.168.1.1',
          userAgent: 'Test Browser'
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.token).toBeDefined()
      expect(data.trustScore).toBe(85)
      expect(data.requiresMFA).toBeDefined()
      expect(mockRedis.setex).toHaveBeenCalledWith(
        expect.stringContaining('session:'),
        expect.any(Number),
        expect.any(String)
      )
    })

    it('requires MFA for suspicious login', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ id: 'user-123', ...testUser, password_hash: 'hashed' }] })
        .mockResolvedValueOnce({ rows: [{ ...mockSession, trustScore: 45 }] })

      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          deviceId: 'new-device',
          ipAddress: '203.0.113.1' // Different IP
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.requiresMFA).toBe(true)
      expect(data.mfaToken).toBeDefined()
      expect(data.trustScore).toBeLessThan(50)
    })

    it('blocks login from blacklisted IP', async () => {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          deviceId: 'device-123',
          ipAddress: '10.0.0.1' // Assumed blacklisted in test setup
        })
      })

      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data.error).toContain('blocked')
    })
  })

  describe('MFA Verification', () => {
    it('successfully verifies MFA code', async () => {
      const mfaToken = 'mfa-token-123'
      mockRedis.get.mockResolvedValue(JSON.stringify({
        userId: 'user-123',
        email: testUser.email,
        timestamp: Date.now()
      }))

      mockDb.query.mockResolvedValueOnce({ 
        rows: [{ id: 'user-123', mfa_secret: 'secret-key' }] 
      })

      const response = await fetch('http://localhost:3001/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mfaToken,
          code: '123456' // Mock TOTP code
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.token).toBeDefined()
      expect(data.user).toBeDefined()
      expect(mockRedis.del).toHaveBeenCalledWith(`mfa:${mfaToken}`)
    })

    it('rejects invalid MFA code', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({
        userId: 'user-123',
        email: testUser.email,
        timestamp: Date.now()
      }))

      const response = await fetch('http://localhost:3001/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mfaToken: 'mfa-token-123',
          code: '000000' // Invalid code
        })
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toContain('Invalid MFA code')
    })
  })

  describe('Token Validation', () => {
    it('validates active session token', async () => {
      const token = 'valid-jwt-token'
      mockRedis.get.mockResolvedValue(JSON.stringify({
        userId: 'user-123',
        sessionId: 'session-123',
        trustScore: 85
      }))

      const response = await fetch('http://localhost:3001/api/auth/validate', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.valid).toBe(true)
      expect(data.user).toBeDefined()
      expect(data.trustScore).toBe(85)
    })

    it('rejects expired token', async () => {
      mockRedis.get.mockResolvedValue(null) // Session not found

      const response = await fetch('http://localhost:3001/api/auth/validate', {
        method: 'GET',
        headers: { 
          'Authorization': 'Bearer expired-token',
          'Content-Type': 'application/json'
        }
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.valid).toBe(false)
    })
  })

  describe('Session Management', () => {
    it('updates trust score during session', async () => {
      const sessionId = 'session-123'
      mockRedis.get.mockResolvedValue(JSON.stringify({
        userId: 'user-123',
        sessionId,
        trustScore: 85
      }))

      const response = await fetch(`http://localhost:3001/api/sessions/${sessionId}/trust`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          behaviorData: {
            typingPatterns: [1, 2, 3],
            mouseMovements: [{ x: 100, y: 200 }],
            navigationEvents: ['click', 'scroll']
          }
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.trustScore).toBeDefined()
      expect(mockRedis.setex).toHaveBeenCalled()
    })

    it('handles session termination', async () => {
      const sessionId = 'session-123'
      
      const response = await fetch(`http://localhost:3001/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      expect(response.status).toBe(200)
      expect(mockRedis.del).toHaveBeenCalledWith(`session:${sessionId}`)
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE sessions'),
        expect.any(Array)
      )
    })
  })

  describe('Rate Limiting', () => {
    it('applies rate limits to login attempts', async () => {
      const email = 'ratelimit.test@velocity.com'
      
      // Make multiple requests rapidly
      const requests = Array(6).fill(null).map(() => 
        fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password: 'wrong-password',
            deviceId: 'device-123',
            ipAddress: '192.168.1.100'
          })
        })
      )

      const responses = await Promise.all(requests)
      
      // First 5 should return 401 (wrong password)
      // 6th should return 429 (rate limited)
      const statusCodes = responses.map(r => r.status)
      expect(statusCodes.filter(s => s === 401)).toHaveLength(5)
      expect(statusCodes.filter(s => s === 429)).toHaveLength(1)
    })
  })

  describe('Device Trust Management', () => {
    it('registers new trusted device', async () => {
      const deviceId = 'new-device-456'
      mockDb.query.mockResolvedValue({ 
        rows: [{ id: 'device-456', user_id: 'user-123', device_id: deviceId }] 
      })

      const response = await fetch('http://localhost:3001/api/devices/trust', {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deviceId,
          deviceName: 'iPhone 13',
          fingerprint: 'device-fingerprint-hash',
          userAgent: 'Mobile Safari'
        })
      })

      expect(response.status).toBe(201)
      const data = await response.json()
      
      expect(data.device).toBeDefined()
      expect(data.device.trusted).toBe(true)
    })

    it('revokes device trust', async () => {
      const deviceId = 'device-123'
      
      const response = await fetch(`http://localhost:3001/api/devices/${deviceId}/trust`, {
        method: 'DELETE',
        headers: { 
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json'
        }
      })

      expect(response.status).toBe(200)
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE trusted_devices'),
        expect.arrayContaining([false, deviceId])
      )
    })
  })
})