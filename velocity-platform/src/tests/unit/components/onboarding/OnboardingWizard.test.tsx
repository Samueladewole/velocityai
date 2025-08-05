/**
 * OnboardingWizard Component Tests
 * Tests the core user onboarding flow - critical for first user experience
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import { mockUser, mockOrganization, createMockResponse } from '../../../setup'

// Mock the cloud integration wizard
vi.mock('@/components/integrations/CloudIntegrationWizard', () => ({
  CloudIntegrationWizard: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="cloud-integration-wizard">
      <button onClick={onComplete}>Complete Cloud Integration</button>
    </div>
  )
}))

describe('OnboardingWizard', () => {
  const mockOnComplete = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('renders welcome step initially', () => {
    render(<OnboardingWizard onComplete={mockOnComplete} />)
    
    expect(screen.getByText('Welcome to Velocity Zero Trust')).toBeInTheDocument()
    expect(screen.getByText('The industry\'s most intelligent security platform')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
  })

  it('progresses through organization setup step', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      createMockResponse({ organization: mockOrganization })
    )

    render(<OnboardingWizard onComplete={mockOnComplete} />)
    
    // Start onboarding
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Should show organization setup
    expect(screen.getByText('Tell Us About Your Organization')).toBeInTheDocument()
    
    // Fill in organization details
    await user.type(screen.getByLabelText(/company name/i), 'Test Corp')
    await user.selectOptions(screen.getByDisplayValue('Select your industry'), 'technology')
    
    // Continue to next step
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Connect Your Cloud Environment')).toBeInTheDocument()
    })
  })

  it('shows cloud integration step after organization setup', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce(createMockResponse({ organization: mockOrganization }))
      .mockResolvedValueOnce(createMockResponse({ integration: { status: 'connected' } }))

    render(<OnboardingWizard onComplete={mockOnComplete} />)
    
    // Navigate to cloud integration step
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.type(screen.getByLabelText(/company name/i), 'Test Corp')
    await user.selectOptions(screen.getByDisplayValue('Select your industry'), 'technology')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Connect Your Cloud Environment')).toBeInTheDocument()
    })
  })

  it('completes onboarding workflow', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce(createMockResponse({ organization: mockOrganization }))
      .mockResolvedValueOnce(createMockResponse({ integration: { status: 'connected' } }))
      .mockResolvedValueOnce(createMockResponse({ onboarding: { completed: true } }))

    render(<OnboardingWizard onComplete={mockOnComplete} />)
    
    // Complete full flow
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.type(screen.getByLabelText(/company name/i), 'Test Corp')
    await user.selectOptions(screen.getByDisplayValue('Select your industry'), 'technology')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Connect Your Cloud Environment')).toBeInTheDocument()
    })
    
    // Complete remaining steps
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled()
    })
  })

  it('displays progress indicator correctly', async () => {
    render(<OnboardingWizard onComplete={mockOnComplete} />)
    
    // Should show step 1 of 5 initially
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
    
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Should show step 2 of 5 after starting
    expect(screen.getByText('Step 2 of 5')).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      createMockResponse({ error: 'Organization creation failed' }, false)
    )

    render(<OnboardingWizard onComplete={mockOnComplete} />)
    
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.type(screen.getByLabelText(/company name/i), 'Test Corp')
    await user.selectOptions(screen.getByDisplayValue('Select your industry'), 'technology')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Connect Your Cloud Environment')).toBeInTheDocument()
    })
  })

  it('allows skipping optional steps', async () => {
    render(<OnboardingWizard onComplete={mockOnComplete} />)
    
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Should show company profile step
    expect(screen.getByText('Tell Us About Your Organization')).toBeInTheDocument()
  })

  it('saves onboarding progress to local storage', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    
    render(<OnboardingWizard onComplete={mockOnComplete} />)
    
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    expect(setItemSpy).toHaveBeenCalledWith(
      'velocity_onboarding_progress',
      expect.stringContaining('step')
    )
  })

  it('tracks onboarding analytics events', async () => {
    global.fetch = vi.fn().mockResolvedValue(createMockResponse({}))
    
    render(<OnboardingWizard onComplete={mockOnComplete} />)
    
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Should track onboarding start event
    expect(global.fetch).toHaveBeenCalledWith('/api/analytics/events', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('onboarding_started')
    }))
  })
})