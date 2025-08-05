/**
 * SecurityDashboard Component Tests
 * Tests the main security dashboard - core user experience after onboarding
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SecurityDashboard } from '@/components/dashboard/SecurityDashboard'
import { mockUser, mockTrustScore, createMockResponse } from '../../../setup'

// Mock child components
vi.mock('@/components/shared/StatCard', () => ({
  StatCard: ({ title, value, trend }: any) => (
    <div data-testid="stat-card">
      <h3>{title}</h3>
      <span>{value}</span>
      {trend && <span data-testid="trend">{trend}</span>}
    </div>
  )
}))

vi.mock('@/components/charts/RiskCharts', () => ({
  RiskCharts: () => <div data-testid="risk-charts">Risk Charts</div>
}))

describe('SecurityDashboard', () => {
  const mockDashboardData = {
    trustScore: mockTrustScore,
    securityEvents: [
      {
        id: '1',
        type: 'login_success',
        timestamp: new Date().toISOString(),
        severity: 'low',
        message: 'Successful login from trusted device'
      },
      {
        id: '2',
        type: 'unusual_location',
        timestamp: new Date().toISOString(),
        severity: 'medium',
        message: 'Login from new location'
      }
    ],
    metrics: {
      totalUsers: 156,
      activeThreats: 3,
      policyViolations: 8,
      complianceScore: 94
    },
    recentActivities: [
      {
        id: '1',
        action: 'User added',
        user: 'john.doe@test.com',
        timestamp: new Date().toISOString()
      }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn().mockResolvedValue(
      createMockResponse(mockDashboardData)
    )
  })

  it('renders dashboard with loading state initially', () => {
    render(<SecurityDashboard />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('displays trust score prominently', async () => {
    render(<SecurityDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Trust Score')).toBeInTheDocument()
      expect(screen.getByText('85')).toBeInTheDocument()
      expect(screen.getByText('HIGH')).toBeInTheDocument()
    })
  })

  it('shows security metrics in stat cards', async () => {
    render(<SecurityDashboard />)
    
    await waitFor(() => {
      const statCards = screen.getAllByTestId('stat-card')
      expect(statCards).toHaveLength(4)
      
      expect(screen.getByText('Total Users')).toBeInTheDocument()
      expect(screen.getByText('156')).toBeInTheDocument()
      
      expect(screen.getByText('Active Threats')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      
      expect(screen.getByText('Compliance Score')).toBeInTheDocument()
      expect(screen.getByText('94%')).toBeInTheDocument()
    })
  })

  it('displays recent security events', async () => {
    render(<SecurityDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Recent Security Events')).toBeInTheDocument()
      expect(screen.getByText('Successful login from trusted device')).toBeInTheDocument()
      expect(screen.getByText('Login from new location')).toBeInTheDocument()
    })
  })

  it('shows risk charts component', async () => {
    render(<SecurityDashboard />)
    
    await waitFor(() => {
      expect(screen.getByTestId('risk-charts')).toBeInTheDocument()
    })
  })

  it('displays quick actions for common tasks', async () => {
    render(<SecurityDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create policy/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /view reports/i })).toBeInTheDocument()
    })
  })

  it('handles real-time updates via WebSocket', async () => {
    const mockWebSocket = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      send: vi.fn(),
      close: vi.fn(),
      readyState: 1
    }
    
    global.WebSocket = vi.fn(() => mockWebSocket) as any
    
    render(<SecurityDashboard />)
    
    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalledWith(expect.stringContaining('ws://'))
      expect(mockWebSocket.addEventListener).toHaveBeenCalledWith('message', expect.any(Function))
    })
  })

  it('shows appropriate alerts for high-risk events', async () => {
    const highRiskData = {
      ...mockDashboardData,
      securityEvents: [
        {
          id: '3',
          type: 'breach_attempt',
          timestamp: new Date().toISOString(),
          severity: 'critical',
          message: 'Potential security breach detected'
        }
      ]
    }
    
    global.fetch = vi.fn().mockResolvedValue(createMockResponse(highRiskData))
    
    render(<SecurityDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Potential security breach detected')).toBeInTheDocument()
      expect(screen.getByText('CRITICAL')).toBeInTheDocument()
    })
  })

  it('allows filtering events by severity', async () => {
    const user = userEvent.setup()
    render(<SecurityDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Recent Security Events')).toBeInTheDocument()
    })
    
    // Filter by high severity
    const severityFilter = screen.getByRole('combobox', { name: /filter by severity/i })
    await user.click(severityFilter)
    await user.click(screen.getByText('High'))
    
    // Should update the events list
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/dashboard/events'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })
  })

  it('refreshes data automatically every 30 seconds', async () => {
    vi.useFakeTimers()
    
    render(<SecurityDashboard />)
    
    // Initial load
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
    
    // Fast-forward 30 seconds
    vi.advanceTimersByTime(30000)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
    
    vi.useRealTimers()
  })

  it('handles dashboard API errors gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      createMockResponse({ error: 'Dashboard data unavailable' }, false)
    )
    
    render(<SecurityDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/error loading dashboard/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })
  })

  it('tracks user interactions for analytics', async () => {
    const user = userEvent.setup()
    render(<SecurityDashboard />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument()
    })
    
    await user.click(screen.getByRole('button', { name: /add user/i }))
    
    expect(global.fetch).toHaveBeenCalledWith('/api/analytics/events', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('dashboard_action_add_user')
    }))
  })

  it('displays contextual help tooltips', async () => {
    const user = userEvent.setup()
    render(<SecurityDashboard />)
    
    await waitFor(() => {
      expect(screen.getByTestId('trust-score-help')).toBeInTheDocument()
    })
    
    await user.hover(screen.getByTestId('trust-score-help'))
    
    await waitFor(() => {
      expect(screen.getByText(/trust score measures/i)).toBeInTheDocument()
    })
  })
})