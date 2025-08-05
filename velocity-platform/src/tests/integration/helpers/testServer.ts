/**
 * Test Server Setup
 * Creates test instance of the Velocity platform for integration testing
 */

import express from 'express'
import cors from 'cors'
import { vi } from 'vitest'

export async function setupTestServer() {
  const app = express()
  
  // Middleware
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Mock authentication routes
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, firstName, lastName, organizationName } = req.body
    
    // Simulate validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }
    
    // Simulate duplicate check
    if (email === 'existing@velocity.com') {
      return res.status(409).json({ error: 'User already exists' })
    }
    
    // Simulate successful registration
    res.status(201).json({
      user: {
        id: 'user-123',
        email,
        firstName,
        lastName
      },
      organization: organizationName ? {
        id: 'org-123',
        name: organizationName
      } : null,
      token: 'jwt-token-123'
    })
  })

  app.post('/api/auth/login', async (req, res) => {
    const { email, password, ipAddress, deviceId } = req.body
    
    // Simulate blacklisted IP
    if (ipAddress === '10.0.0.1') {
      return res.status(403).json({ error: 'IP address blocked' })
    }
    
    // Simulate invalid credentials
    if (password === 'wrong-password') {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Simulate trust scoring
    const isNewDevice = deviceId === 'new-device'
    const isSuspiciousIP = ipAddress?.startsWith('203.')
    
    let trustScore = 85
    let requiresMFA = false
    
    if (isNewDevice || isSuspiciousIP) {
      trustScore = 45
      requiresMFA = true
    }
    
    const response: any = {
      token: 'jwt-token-123',
      trustScore,
      requiresMFA
    }
    
    if (requiresMFA) {
      response.mfaToken = 'mfa-token-123'
    } else {
      response.user = {
        id: 'user-123',
        email,
        firstName: 'Test',
        lastName: 'User'
      }
    }
    
    res.json(response)
  })

  app.post('/api/auth/mfa/verify', async (req, res) => {
    const { mfaToken, code } = req.body
    
    if (code === '000000') {
      return res.status(401).json({ error: 'Invalid MFA code' })
    }
    
    res.json({
      token: 'jwt-token-after-mfa',
      user: {
        id: 'user-123',
        email: 'test@velocity.com',
        firstName: 'Test',
        lastName: 'User'
      }
    })
  })

  app.get('/api/auth/validate', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (token === 'expired-token' || !token) {
      return res.status(401).json({ valid: false })
    }
    
    res.json({
      valid: true,
      user: {
        id: 'user-123',
        email: 'test@velocity.com'
      },
      trustScore: 85
    })
  })

  // Session management
  app.put('/api/sessions/:sessionId/trust', async (req, res) => {
    const { sessionId } = req.params
    const { behaviorData } = req.body
    
    // Simulate trust score calculation
    const newTrustScore = Math.min(95, 85 + Math.random() * 10)
    
    res.json({
      sessionId,
      trustScore: newTrustScore,
      updated: true
    })
  })

  app.delete('/api/sessions/:sessionId', async (req, res) => {
    res.json({ success: true })
  })

  // Device management
  app.post('/api/devices/trust', async (req, res) => {
    const { deviceId, deviceName } = req.body
    
    res.status(201).json({
      device: {
        id: deviceId,
        name: deviceName,
        trusted: true,
        createdAt: new Date().toISOString()
      }
    })
  })

  app.delete('/api/devices/:deviceId/trust', async (req, res) => {
    res.json({ success: true })
  })

  // Organization management
  app.post('/api/organizations', async (req, res) => {
    const { name, domain } = req.body
    
    res.status(201).json({
      organization: {
        id: 'org-123',
        name,
        domain,
        plan: 'professional'
      }
    })
  })

  app.get('/api/organizations/:orgId', async (req, res) => {
    res.json({
      id: req.params.orgId,
      name: 'Test Organization',
      domain: 'test.com',
      plan: 'enterprise',
      members: 156,
      settings: {
        mfaRequired: false,
        passwordPolicy: 'strict'
      }
    })
  })

  // Dashboard API
  app.get('/api/dashboard/data', async (req, res) => {
    res.json({
      trustScore: {
        score: 85,
        level: 'HIGH',
        factors: {
          behavior: 90,
          device: 80,
          location: 85,
          time: 75
        }
      },
      securityEvents: [
        {
          id: '1',
          type: 'login_success',
          timestamp: new Date().toISOString(),
          severity: 'low',
          message: 'Successful login from trusted device'
        }
      ],
      metrics: {
        totalUsers: 156,
        activeThreats: 3,
        policyViolations: 8,
        complianceScore: 94
      }
    })
  })

  // ROI Calculator
  app.post('/api/roi/calculate', async (req, res) => {
    const { industry, employees, revenue } = req.body
    
    // Simulate ROI calculation
    const baseSavings = employees * 1000
    const industrySavings = industry === 'Financial Services' ? baseSavings * 2 : baseSavings
    
    res.json({
      annualSavings: industrySavings,
      roiPercentage: 340,
      paybackPeriod: '3 months',
      breakdown: {
        complianceAutomation: industrySavings * 0.4,
        incidentPrevention: industrySavings * 0.3,
        operationalEfficiency: industrySavings * 0.3
      }
    })
  })

  app.post('/api/roi/generate-report', async (req, res) => {
    res.setHeader('Content-Type', 'application/pdf')
    res.send(Buffer.from('Mock PDF Report'))
  })

  // Analytics
  app.post('/api/analytics/events', async (req, res) => {
    res.json({ tracked: true })
  })

  // Lead generation
  app.post('/api/leads', async (req, res) => {
    res.json({ saved: true })
  })

  // SSO endpoints
  app.post('/api/sso/providers', async (req, res) => {
    const { type, name } = req.body
    
    res.status(201).json({
      provider: {
        id: 'provider-123',
        type,
        name,
        enabled: false
      }
    })
  })

  app.get('/api/sso/providers/:providerId/test', async (req, res) => {
    res.json({
      success: true,
      userCount: 42
    })
  })

  // Notifications
  app.post('/api/notifications/channels', async (req, res) => {
    const { type, name } = req.body
    
    res.status(201).json({
      channel: {
        id: 'channel-123',
        type,
        name,
        enabled: true
      }
    })
  })

  app.post('/api/notifications/send', async (req, res) => {
    res.json({ sent: true })
  })

  // Error handling
  app.use((error: any, req: any, res: any, next: any) => {
    console.error('Test server error:', error)
    res.status(500).json({ error: 'Internal server error' })
  })

  // Start test server
  const server = app.listen(3001, () => {
    console.log('Test server running on port 3001')
  })

  return { app, server }
}