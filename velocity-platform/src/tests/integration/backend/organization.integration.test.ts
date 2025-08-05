/**
 * Organization Service Integration Tests
 * Tests multi-tenant organization management and enterprise features
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OrganizationService } from '@/backend/services/OrganizationService'
import { createMockResponse } from '../setup'

// Mock dependencies
const mockDb = {
  query: vi.fn(),
  connect: vi.fn().mockReturnValue({
    query: vi.fn(),
    release: vi.fn()
  })
}

const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  setex: vi.fn(),
  del: vi.fn(),
  exists: vi.fn()
}

vi.mock('pg', () => ({
  Pool: vi.fn(() => mockDb)
}))

vi.mock('ioredis', () => ({
  default: vi.fn(() => mockRedis)
}))

describe('Organization Service Integration', () => {
  let organizationService: OrganizationService

  beforeEach(() => {
    vi.clearAllMocks()
    organizationService = new OrganizationService()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Organization Creation', () => {
    it('creates organization with owner user', async () => {
      const orgData = {
        name: 'Test Corporation',
        domain: 'testcorp.com',
        ownerId: 'user-123',
        plan: 'enterprise' as const
      }

      mockDb.query
        .mockResolvedValueOnce({ rows: [] }) // Check domain availability
        .mockResolvedValueOnce({ rows: [{ id: 'org-123', ...orgData }] }) // Create org
        .mockResolvedValueOnce({ rows: [{ id: 'member-123' }] }) // Add owner as member

      const result = await organizationService.createOrganization(orgData)

      expect(result).toEqual(expect.objectContaining({
        id: 'org-123',
        name: 'Test Corporation',
        domain: 'testcorp.com',
        plan: 'enterprise'
      }))

      expect(mockDb.query).toHaveBeenCalledTimes(3)
      expect(mockDb.query).toHaveBeenNthCalledWith(1, 
        expect.stringContaining('SELECT * FROM organizations WHERE domain = $1'),
        ['testcorp.com']
      )
    })

    it('prevents duplicate domain registration', async () => {
      mockDb.query.mockResolvedValueOnce({ 
        rows: [{ id: 'existing-org', domain: 'testcorp.com' }] 
      })

      await expect(organizationService.createOrganization({
        name: 'Duplicate Corp',
        domain: 'testcorp.com',
        ownerId: 'user-456'
      })).rejects.toThrow('Domain already registered')
    })

    it('sets plan-specific limits correctly', async () => {
      const enterpriseData = {
        name: 'Enterprise Corp',
        domain: 'enterprise.com',
        ownerId: 'user-123',
        plan: 'enterprise' as const
      }

      mockDb.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ id: 'org-123', ...enterpriseData }] })
        .mockResolvedValueOnce({ rows: [{ id: 'member-123' }] })

      const result = await organizationService.createOrganization(enterpriseData)

      expect(mockDb.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('INSERT INTO organizations'),
        expect.arrayContaining([
          expect.any(String), // id
          'Enterprise Corp',
          'enterprise.com',
          'user-123',
          'enterprise',
          expect.stringContaining('max_users'),
          expect.any(Date),
          expect.any(Date)
        ])
      )
    })
  })

  describe('Member Management', () => {
    it('adds team member with appropriate role', async () => {
      const memberData = {
        organizationId: 'org-123',
        userId: 'user-456',
        role: 'admin' as const,
        invitedBy: 'user-123'
      }

      mockDb.query
        .mockResolvedValueOnce({ rows: [{ max_users: 500 }] }) // Check limits
        .mockResolvedValueOnce({ rows: [{ count: '10' }] }) // Current member count
        .mockResolvedValueOnce({ rows: [] }) // Check existing membership
        .mockResolvedValueOnce({ rows: [{ id: 'member-456', ...memberData }] }) // Add member

      const result = await organizationService.addMember(memberData)

      expect(result).toEqual(expect.objectContaining({
        id: 'member-456',
        organizationId: 'org-123',
        userId: 'user-456',
        role: 'admin'
      }))

      expect(mockDb.query).toHaveBeenCalledTimes(4)
    })

    it('enforces plan member limits', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ max_users: 10, plan: 'starter' }] })
        .mockResolvedValueOnce({ rows: [{ count: '10' }] }) // At limit

      await expect(organizationService.addMember({
        organizationId: 'org-123',
        userId: 'user-999',
        role: 'member',
        invitedBy: 'user-123'
      })).rejects.toThrow('Organization has reached member limit')
    })

    it('prevents duplicate memberships', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ max_users: 500 }] })
        .mockResolvedValueOnce({ rows: [{ count: '5' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'existing-member' }] })

      await expect(organizationService.addMember({
        organizationId: 'org-123',
        userId: 'user-456',
        role: 'member',
        invitedBy: 'user-123'
      })).rejects.toThrow('User is already a member')
    })

    it('updates member role successfully', async () => {
      mockDb.query.mockResolvedValueOnce({ 
        rows: [{ id: 'member-456', role: 'admin' }] 
      })

      const result = await organizationService.updateMemberRole(
        'org-123',
        'user-456',
        'security_admin'
      )

      expect(result.role).toBe('security_admin')
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE organization_members'),
        ['security_admin', expect.any(Date), 'org-123', 'user-456']
      )
    })

    it('removes member and handles cleanup', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ id: 'member-456' }] }) // Find member
        .mockResolvedValueOnce({ rows: [] }) // Remove member

      await organizationService.removeMember('org-123', 'user-456')

      expect(mockDb.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('DELETE FROM organization_members'),
        ['org-123', 'user-456']
      )
    })
  })

  describe('Role-Based Access Control', () => {
    it('creates custom role with permissions', async () => {
      const roleData = {
        organizationId: 'org-123',
        name: 'compliance_auditor',
        description: 'Compliance team with audit access',
        permissions: [
          'compliance.view',
          'audit_logs.read',
          'reports.generate'
        ]
      }

      mockDb.query.mockResolvedValueOnce({ 
        rows: [{ id: 'role-123', ...roleData }] 
      })

      const result = await organizationService.createCustomRole(roleData)

      expect(result).toEqual(expect.objectContaining({
        name: 'compliance_auditor',
        permissions: expect.arrayContaining(['compliance.view'])
      }))
    })

    it('validates role permissions against organization plan', async () => {
      mockDb.query.mockResolvedValueOnce({ 
        rows: [{ plan: 'starter' }] 
      })

      await expect(organizationService.createCustomRole({
        organizationId: 'org-123',
        name: 'advanced_role',
        description: 'Advanced role',
        permissions: ['admin.full_access'] // Not available in starter
      })).rejects.toThrow('Permission not available in current plan')
    })

    it('assigns custom role to user', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ id: 'role-123' }] }) // Validate role exists
        .mockResolvedValueOnce({ rows: [{ id: 'member-456' }] }) // Update member

      await organizationService.assignCustomRole('org-123', 'user-456', 'role-123')

      expect(mockDb.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('UPDATE organization_members'),
        expect.arrayContaining(['role-123'])
      )
    })
  })

  describe('Organization Settings', () => {
    it('updates security settings', async () => {
      const settings = {
        mfaRequired: true,
        passwordPolicy: 'strict',
        sessionTimeout: 3600,
        allowedDomains: ['testcorp.com', 'subsidiary.com'],
        ipWhitelist: ['192.168.1.0/24']
      }

      mockDb.query.mockResolvedValueOnce({ 
        rows: [{ id: 'org-123', settings: JSON.stringify(settings) }] 
      })

      const result = await organizationService.updateSettings('org-123', settings)

      expect(result.settings).toEqual(settings)
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE organizations SET settings'),
        [JSON.stringify(settings), expect.any(Date), 'org-123']
      )
    })

    it('validates setting constraints by plan', async () => {
      mockDb.query.mockResolvedValueOnce({ 
        rows: [{ plan: 'professional' }] 
      })

      await expect(organizationService.updateSettings('org-123', {
        maxApiCalls: 10000000 // Exceeds professional plan limit
      })).rejects.toThrow('Setting exceeds plan limits')
    })

    it('handles domain verification', async () => {
      mockDb.query.mockResolvedValueOnce({ 
        rows: [{ id: 'org-123', domain_verified: false }] 
      })

      await organizationService.verifyDomain('org-123', 'verification-token-123')

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE organizations SET domain_verified'),
        [true, expect.any(Date), 'org-123']
      )
    })
  })

  describe('Billing and Subscription', () => {
    it('upgrades organization plan', async () => {
      mockDb.query
        .mockResolvedValueOnce({ rows: [{ plan: 'professional' }] })
        .mockResolvedValueOnce({ rows: [{ id: 'org-123', plan: 'enterprise' }] })

      const result = await organizationService.upgradePlan('org-123', 'enterprise')

      expect(result.plan).toBe('enterprise')
      expect(mockDb.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('UPDATE organizations SET plan'),
        ['enterprise', expect.stringContaining('max_users'), expect.any(Date), 'org-123']
      )
    })

    it('tracks usage metrics', async () => {
      const usage = {
        apiCalls: 150000,
        storageUsed: 2.5, // GB
        activeUsers: 45,
        integrationsActive: 8
      }

      mockRedis.setex.mockResolvedValue('OK')

      await organizationService.updateUsageMetrics('org-123', usage)

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'org:org-123:usage',
        3600,
        JSON.stringify(usage)
      )
    })

    it('enforces usage limits by plan', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({
        apiCalls: 500000 // Exceeds starter plan limit
      }))

      mockDb.query.mockResolvedValueOnce({ 
        rows: [{ plan: 'starter' }] 
      })

      const result = await organizationService.checkUsageLimits('org-123')

      expect(result.withinLimits).toBe(false)
      expect(result.exceededLimits).toContain('apiCalls')
    })
  })

  describe('Multi-Tenancy Isolation', () => {
    it('ensures data isolation between organizations', async () => {
      const org1Data = { organizationId: 'org-123', data: 'sensitive-org1' }
      const org2Data = { organizationId: 'org-456', data: 'sensitive-org2' }

      // Simulate cross-tenant query attempt
      mockDb.query.mockResolvedValueOnce({ rows: [] }) // No cross-tenant data

      const result = await organizationService.getOrganizationData(
        'org-123',
        'user-from-org-456' // User from different org
      )

      expect(result).toBeNull()
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE organization_id = $1 AND user_id IN'),
        expect.arrayContaining(['org-123'])
      )
    })

    it('handles organization deletion with complete cleanup', async () => {
      const client = {
        query: vi.fn(),
        release: vi.fn()
      }
      mockDb.connect.mockResolvedValue(client)

      client.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // Delete members
        .mockResolvedValueOnce({ rows: [] }) // Delete sessions
        .mockResolvedValueOnce({ rows: [] }) // Delete data
        .mockResolvedValueOnce({ rows: [] }) // Delete organization
        .mockResolvedValueOnce({ rows: [] }) // COMMIT

      await organizationService.deleteOrganization('org-123')

      expect(client.query).toHaveBeenCalledWith('BEGIN')
      expect(client.query).toHaveBeenCalledWith('COMMIT')
      expect(client.query).toHaveBeenCalledTimes(6)
    })
  })

  describe('Organization Analytics', () => {
    it('generates organization metrics', async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [{
          total_members: 25,
          active_sessions: 18,
          api_calls_today: 1500,
          storage_used: 1.2,
          compliance_score: 94
        }]
      })

      const metrics = await organizationService.getOrganizationMetrics('org-123')

      expect(metrics).toEqual(expect.objectContaining({
        totalMembers: 25,
        activeSessions: 18,
        apiCallsToday: 1500,
        complianceScore: 94
      }))
    })

    it('tracks organization activity trends', async () => {
      mockDb.query.mockResolvedValueOnce({
        rows: [
          { date: '2024-01-01', active_users: 20, api_calls: 1000 },
          { date: '2024-01-02', active_users: 22, api_calls: 1200 },
          { date: '2024-01-03', active_users: 25, api_calls: 1500 }
        ]
      })

      const trends = await organizationService.getActivityTrends('org-123', '7d')

      expect(trends).toHaveLength(3)
      expect(trends[2]).toEqual(expect.objectContaining({
        date: '2024-01-03',
        activeUsers: 25,
        apiCalls: 1500
      }))
    })
  })

  describe('Error Handling and Resilience', () => {
    it('handles database connection failures gracefully', async () => {
      mockDb.query.mockRejectedValue(new Error('Connection failed'))

      await expect(organizationService.getOrganization('org-123'))
        .rejects.toThrow('Connection failed')
    })

    it('implements retry logic for transient failures', async () => {
      mockDb.query
        .mockRejectedValueOnce(new Error('Timeout'))
        .mockRejectedValueOnce(new Error('Timeout'))
        .mockResolvedValueOnce({ rows: [{ id: 'org-123' }] })

      const result = await organizationService.getOrganization('org-123')

      expect(result).toBeDefined()
      expect(mockDb.query).toHaveBeenCalledTimes(3)
    })

    it('maintains data consistency during failures', async () => {
      const client = {
        query: vi.fn(),
        release: vi.fn()
      }
      mockDb.connect.mockResolvedValue(client)

      client.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: 'org-123' }] }) // Create org
        .mockRejectedValueOnce(new Error('Member creation failed')) // Fail on member
        .mockResolvedValueOnce({ rows: [] }) // ROLLBACK

      await expect(organizationService.createOrganization({
        name: 'Test Corp',
        domain: 'test.com',
        ownerId: 'user-123'
      })).rejects.toThrow('Member creation failed')

      expect(client.query).toHaveBeenCalledWith('ROLLBACK')
    })
  })
})