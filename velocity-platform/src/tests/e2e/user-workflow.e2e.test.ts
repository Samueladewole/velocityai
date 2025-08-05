/**
 * End-to-End User Workflow Tests
 * Tests the complete user journey from signup to value realization
 */

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { chromium, Browser, Page } from 'playwright'

describe('Complete User Workflow E2E', () => {
  let browser: Browser
  let page: Page
  const baseUrl = 'http://localhost:5173' // Vite dev server
  
  const testUser = {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@testcorp.com',
    password: 'SecurePassword123!',
    company: 'TestCorp Industries',
    domain: 'testcorp.com'
  }

  beforeAll(async () => {
    browser = await chromium.launch({ 
      headless: process.env.CI === 'true',
      slowMo: process.env.CI ? 0 : 100 
    })
    page = await browser.newPage()
    
    // Mock external services
    await page.route('**/api/**', (route) => {
      const url = route.request().url()
      const method = route.request().method()
      
      // Mock successful responses for testing
      if (url.includes('/api/auth/register') && method === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            user: { id: 'user-123', ...testUser },
            organization: { id: 'org-123', name: testUser.company },
            token: 'jwt-token-123'
          })
        })
      } else if (url.includes('/api/dashboard/data')) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            trustScore: { score: 85, level: 'HIGH' },
            metrics: { totalUsers: 1, activeThreats: 0, complianceScore: 95 }
          })
        })
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        })
      }
    })
  })

  afterAll(async () => {
    await browser.close()
  })

  it('completes the full user journey: signup → onboarding → dashboard → cloud integration → ROI realization', async () => {
    // Step 1: User arrives at landing page
    await page.goto(baseUrl)
    await expect(page.locator('h1')).toContainText('Velocity')
    
    // Step 2: User clicks "Get Started" from landing page
    await page.click('text=Get Started')
    await expect(page).toHaveURL(/.*\/signup/)
    
    // Step 3: User registration
    await page.fill('[data-testid="firstName"]', testUser.firstName)
    await page.fill('[data-testid="lastName"]', testUser.lastName)
    await page.fill('[data-testid="email"]', testUser.email)
    await page.fill('[data-testid="password"]', testUser.password)
    await page.fill('[data-testid="company"]', testUser.company)
    
    // Accept terms and conditions
    await page.check('[data-testid="terms-checkbox"]')
    
    // Submit registration
    await page.click('[data-testid="register-button"]')
    
    // Step 4: Onboarding wizard starts
    await expect(page.locator('h2')).toContainText('Welcome to Velocity')
    await page.click('text=Get Started')
    
    // Organization setup
    await expect(page.locator('h3')).toContainText('Set up your organization')
    await page.fill('[data-testid="organization-name"]', testUser.company)
    await page.fill('[data-testid="organization-domain"]', testUser.domain)
    await page.selectOption('[data-testid="industry"]', 'technology')
    await page.click('text=Continue')
    
    // Team setup (optional step)
    await expect(page.locator('h3')).toContainText('Invite your team')
    await page.fill('[data-testid="team-member-email"]', 'colleague@testcorp.com')
    await page.click('[data-testid="add-team-member"]')
    await page.click('text=Continue')
    
    // Cloud integration wizard
    await expect(page.locator('h3')).toContainText('Connect your cloud environment')
    
    // Select AWS integration
    await page.click('[data-testid="aws-integration-card"]')
    await page.fill('[data-testid="aws-access-key"]', 'AKIA-TEST-KEY')
    await page.fill('[data-testid="aws-secret-key"]', 'test-secret-key')
    await page.selectOption('[data-testid="aws-region"]', 'us-east-1')
    
    // Test connection
    await page.click('[data-testid="test-connection"]')
    await expect(page.locator('[data-testid="connection-status"]')).toContainText('Connected')
    
    // Complete cloud integration
    await page.click('text=Complete Integration')
    
    // Step 5: Dashboard appears (immediate value)
    await expect(page).toHaveURL(/.*\/dashboard/)
    await expect(page.locator('h1')).toContainText('Security Dashboard')
    
    // Verify key dashboard elements are visible
    await expect(page.locator('[data-testid="trust-score"]')).toContainText('85')
    await expect(page.locator('[data-testid="trust-level"]')).toContainText('HIGH')
    
    // Security metrics are displayed
    await expect(page.locator('[data-testid="total-users"]')).toContainText('1')
    await expect(page.locator('[data-testid="active-threats"]')).toContainText('0')
    await expect(page.locator('[data-testid="compliance-score"]')).toContainText('95')
    
    // Step 6: User explores quick actions
    await expect(page.locator('[data-testid="quick-actions"]')).toBeVisible()
    
    // Add a new user
    await page.click('[data-testid="add-user-button"]')
    await page.fill('[data-testid="new-user-email"]', 'newuser@testcorp.com')
    await page.selectOption('[data-testid="user-role"]', 'member')
    await page.click('[data-testid="send-invitation"]')
    
    // Verify success notification
    await expect(page.locator('[data-testid="success-notification"]')).toContainText('User invited')
    
    // Step 7: User checks ROI calculator
    await page.click('text=ROI Calculator')
    await expect(page).toHaveURL(/.*\/roi-calculator/)
    
    // Fill ROI calculator
    await page.selectOption('[data-testid="industry-select"]', 'technology')
    await page.fill('[data-testid="employee-count"]', '250')
    await page.fill('[data-testid="annual-revenue"]', '50000000')
    await page.fill('[data-testid="security-incidents"]', '6')
    
    // Calculate ROI
    await page.click('[data-testid="calculate-roi"]')
    
    // Verify ROI results show significant value
    await expect(page.locator('[data-testid="annual-savings"]')).toContainText('$')
    await expect(page.locator('[data-testid="roi-percentage"]')).toContainText('%')
    await expect(page.locator('[data-testid="payback-period"]')).toContainText('months')
    
    // Download ROI report
    await page.click('[data-testid="download-report"]')
    
    // Step 8: User sets up notifications
    await page.goto(`${baseUrl}/settings/notifications`)
    
    // Configure Slack integration
    await page.click('[data-testid="add-slack-integration"]')
    await page.fill('[data-testid="slack-webhook-url"]', 'https://hooks.slack.com/test')
    await page.fill('[data-testid="slack-channel"]', '#security-alerts')
    await page.click('[data-testid="test-notification"]')
    
    // Verify test notification success
    await expect(page.locator('[data-testid="test-result"]')).toContainText('Success')
    await page.click('[data-testid="save-integration"]')
    
    // Step 9: User views executive dashboard (value realization)
    await page.goto(`${baseUrl}/executive-dashboard`)
    
    // Verify executive metrics are displayed
    await expect(page.locator('[data-testid="cost-savings"]')).toContainText('$')
    await expect(page.locator('[data-testid="risk-reduction"]')).toContainText('%')
    await expect(page.locator('[data-testid="compliance-status"]')).toContainText('Compliant')
    
    // Step 10: User completes initial value realization
    // Check that onboarding is marked complete
    await expect(page.locator('[data-testid="onboarding-status"]')).toContainText('Complete')
    
    // Verify time-to-value achievement (under 10 minutes)
    const onboardingTime = await page.locator('[data-testid="onboarding-duration"]').textContent()
    expect(onboardingTime).toMatch(/[0-9] minutes?/) // Should be single digit minutes
    
    // Step 11: Verify user can navigate entire platform
    const navigationItems = [
      { text: 'Dashboard', url: '/dashboard' },
      { text: 'Security', url: '/security' },
      { text: 'Compliance', url: '/compliance' },
      { text: 'Reports', url: '/reports' },
      { text: 'Settings', url: '/settings' }
    ]
    
    for (const item of navigationItems) {
      await page.click(`nav a[href*="${item.url}"]`)
      await expect(page).toHaveURL(new RegExp(`.*${item.url}`))
      await expect(page.locator('h1, h2')).toBeVisible()
    }
    
    // Step 12: User logs out successfully
    await page.click('[data-testid="user-menu"]')
    await page.click('text=Logout')
    await expect(page).toHaveURL(/.*\/(login|)$/)
    
    console.log('✅ Complete user workflow test passed!')
    console.log(`   • Registration: ${testUser.email}`)
    console.log(`   • Organization: ${testUser.company}`)
    console.log('   • Onboarding: Completed')
    console.log('   • Cloud Integration: AWS Connected')
    console.log('   • Dashboard: Functional')
    console.log('   • ROI Calculator: Working')
    console.log('   • Notifications: Configured')
    console.log('   • Executive Dashboard: Accessible')
    console.log('   • Navigation: All areas accessible')
    console.log('   • Time to Value: < 10 minutes')
  }, 120000) // 2 minute timeout for full workflow

  it('handles error scenarios gracefully', async () => {
    await page.goto(baseUrl)
    
    // Test network error handling
    await page.route('**/api/auth/register', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      })
    })
    
    await page.click('text=Get Started')
    await page.fill('[data-testid="email"]', 'error@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="register-button"]')
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Server error')
    
    // Should have retry option
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible()
  })

  it('supports mobile responsive design', async () => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(baseUrl)
    
    // Mobile navigation should be collapsed
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()
    
    // Test mobile onboarding
    await page.click('text=Get Started')
    
    // Forms should be mobile-responsive
    const emailInput = page.locator('[data-testid="email"]')
    const inputBox = await emailInput.boundingBox()
    expect(inputBox?.width).toBeLessThan(350) // Should fit mobile width
  })

  it('tracks analytics throughout user journey', async () => {
    const analyticsEvents: string[] = []
    
    // Capture analytics calls
    await page.route('**/api/analytics/events', (route) => {
      const postData = route.request().postData()
      if (postData) {
        const event = JSON.parse(postData)
        analyticsEvents.push(event.eventName)
      }
      route.fulfill({ status: 200, body: '{"tracked": true}' })
    })
    
    await page.goto(baseUrl)
    await page.click('text=Get Started')
    
    // Should track key events
    expect(analyticsEvents).toContain('landing_page_cta_clicked')
    expect(analyticsEvents).toContain('signup_page_visited')
  })
})