/**
 * ROI Calculator Component Tests
 * Tests the enterprise sales ROI calculator - critical for sales conversion
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ROICalculator } from '@/components/sales/ROICalculator'
import { createMockResponse } from '../../../setup'

describe('ROICalculator', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('renders industry selection initially', () => {
    render(<ROICalculator />)
    
    expect(screen.getByText('Calculate Your ROI')).toBeInTheDocument()
    expect(screen.getByText('Select your industry')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /industry/i })).toBeInTheDocument()
  })

  it('shows organization size input after industry selection', async () => {
    render(<ROICalculator />)
    
    const industrySelect = screen.getByRole('combobox', { name: /industry/i })
    await user.click(industrySelect)
    await user.click(screen.getByText('Financial Services'))
    
    expect(screen.getByLabelText(/number of employees/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/annual revenue/i)).toBeInTheDocument()
  })

  it('calculates ROI for financial services industry', async () => {
    render(<ROICalculator />)
    
    // Select industry
    await user.click(screen.getByRole('combobox', { name: /industry/i }))
    await user.click(screen.getByText('Financial Services'))
    
    // Enter organization details
    await user.type(screen.getByLabelText(/number of employees/i), '1000')
    await user.type(screen.getByLabelText(/annual revenue/i), '500000000')
    await user.type(screen.getByLabelText(/security incidents per year/i), '12')
    await user.type(screen.getByLabelText(/average incident cost/i), '150000')
    
    // Calculate ROI
    await user.click(screen.getByRole('button', { name: /calculate roi/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/annual savings/i)).toBeInTheDocument()
      expect(screen.getByText(/roi percentage/i)).toBeInTheDocument()
      expect(screen.getByText(/payback period/i)).toBeInTheDocument()
    })
    
    // Should show significant savings for financial services
    expect(screen.getByText(/\$1,.*,.*0/)).toBeInTheDocument() // Matches formatted currency
  })

  it('shows industry-specific compliance savings', async () => {
    render(<ROICalculator />)
    
    await user.click(screen.getByRole('combobox', { name: /industry/i }))
    await user.click(screen.getByText('Healthcare'))
    
    await user.type(screen.getByLabelText(/number of employees/i), '500')
    await user.click(screen.getByRole('button', { name: /calculate roi/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/hipaa compliance automation/i)).toBeInTheDocument()
      expect(screen.getByText(/audit preparation savings/i)).toBeInTheDocument()
    })
  })

  it('displays detailed cost breakdown', async () => {
    render(<ROICalculator />)
    
    await user.click(screen.getByRole('combobox', { name: /industry/i }))
    await user.click(screen.getByText('Technology'))
    await user.type(screen.getByLabelText(/number of employees/i), '250')
    await user.click(screen.getByRole('button', { name: /calculate roi/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Cost Breakdown')).toBeInTheDocument()
      expect(screen.getByText(/manual security processes/i)).toBeInTheDocument()
      expect(screen.getByText(/compliance reporting/i)).toBeInTheDocument()
      expect(screen.getByText(/incident response/i)).toBeInTheDocument()
    })
  })

  it('allows customizing calculation assumptions', async () => {
    render(<ROICalculator />)
    
    await user.click(screen.getByRole('combobox', { name: /industry/i }))
    await user.click(screen.getByText('Financial Services'))
    
    // Open advanced settings
    await user.click(screen.getByRole('button', { name: /advanced settings/i }))
    
    expect(screen.getByLabelText(/hourly security team rate/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/compliance hours per month/i)).toBeInTheDocument()
    
    // Customize values
    await user.clear(screen.getByLabelText(/hourly security team rate/i))
    await user.type(screen.getByLabelText(/hourly security team rate/i), '150')
    
    await user.type(screen.getByLabelText(/number of employees/i), '1000')
    await user.click(screen.getByRole('button', { name: /calculate roi/i }))
    
    // Should recalculate with custom rates
    await waitFor(() => {
      expect(screen.getByText(/annual savings/i)).toBeInTheDocument()
    })
  })

  it('generates downloadable ROI report', async () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' })
    global.fetch = vi.fn().mockResolvedValue(
      createMockResponse(mockBlob)
    )
    
    render(<ROICalculator />)
    
    await user.click(screen.getByRole('combobox', { name: /industry/i }))
    await user.click(screen.getByText('Financial Services'))
    await user.type(screen.getByLabelText(/number of employees/i), '1000')
    await user.click(screen.getByRole('button', { name: /calculate roi/i }))
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download report/i })).toBeInTheDocument()
    })
    
    await user.click(screen.getByRole('button', { name: /download report/i }))
    
    expect(global.fetch).toHaveBeenCalledWith('/api/roi/generate-report', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('Financial Services')
    }))
  })

  it('shows comparison with competitors', async () => {
    render(<ROICalculator />)
    
    await user.click(screen.getByRole('combobox', { name: /industry/i }))
    await user.click(screen.getByText('Technology'))
    await user.type(screen.getByLabelText(/number of employees/i), '500')
    await user.click(screen.getByRole('button', { name: /calculate roi/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Competitive Comparison')).toBeInTheDocument()
      expect(screen.getByText(/vs traditional solutions/i)).toBeInTheDocument()
      expect(screen.getByText(/50% lower tco/i)).toBeInTheDocument()
    })
  })

  it('validates input ranges and shows errors', async () => {
    render(<ROICalculator />)
    
    await user.click(screen.getByRole('combobox', { name: /industry/i }))
    await user.click(screen.getByText('Financial Services'))
    
    // Enter invalid data
    await user.type(screen.getByLabelText(/number of employees/i), '0')
    await user.click(screen.getByRole('button', { name: /calculate roi/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/employees must be greater than 0/i)).toBeInTheDocument()
    })
  })

  it('saves calculation for lead generation', async () => {
    global.fetch = vi.fn().mockResolvedValue(createMockResponse({ saved: true }))
    
    render(<ROICalculator />)
    
    await user.click(screen.getByRole('combobox', { name: /industry/i }))
    await user.click(screen.getByText('Healthcare'))
    await user.type(screen.getByLabelText(/number of employees/i), '300')
    
    // Enter contact information
    await user.type(screen.getByLabelText(/company name/i), 'Test Healthcare Corp')
    await user.type(screen.getByLabelText(/email address/i), 'cio@testhealthcare.com')
    
    await user.click(screen.getByRole('button', { name: /calculate roi/i }))
    
    expect(global.fetch).toHaveBeenCalledWith('/api/leads', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('Test Healthcare Corp')
    }))
  })

  it('displays time-to-value calculations', async () => {
    render(<ROICalculator />)
    
    await user.click(screen.getByRole('combobox', { name: /industry/i }))
    await user.click(screen.getByText('Financial Services'))
    await user.type(screen.getByLabelText(/number of employees/i), '1500')
    await user.click(screen.getByRole('button', { name: /calculate roi/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Time to Value')).toBeInTheDocument()
      expect(screen.getByText(/immediate benefits/i)).toBeInTheDocument()
      expect(screen.getByText(/3 months: full roi/i)).toBeInTheDocument()
      expect(screen.getByText(/6 months: strategic value/i)).toBeInTheDocument()
    })
  })

  it('shows mobile-responsive design', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 375 })
    Object.defineProperty(window, 'innerHeight', { value: 667 })
    
    render(<ROICalculator />)
    
    const container = screen.getByTestId('roi-calculator-container')
    expect(container).toHaveClass('mobile-responsive')
  })

  it('tracks analytics events for sales funnel', async () => {
    global.fetch = vi.fn().mockResolvedValue(createMockResponse({}))
    
    render(<ROICalculator />)
    
    await user.click(screen.getByRole('combobox', { name: /industry/i }))
    await user.click(screen.getByText('Financial Services'))
    
    expect(global.fetch).toHaveBeenCalledWith('/api/analytics/events', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('roi_calculator_industry_selected')
    }))
    
    await user.type(screen.getByLabelText(/number of employees/i), '1000')
    await user.click(screen.getByRole('button', { name: /calculate roi/i }))
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/analytics/events', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('roi_calculator_completed')
      }))
    })
  })
})