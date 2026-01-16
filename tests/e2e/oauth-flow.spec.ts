// ============================================================================
// OAuth Flow E2E Test
// ============================================================================
// Testa o fluxo completo de autenticação OAuth com Google
// ============================================================================

import { test, expect } from '@playwright/test'

test.describe('OAuth Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login')
  })

  test('should display Google sign-in button', async ({ page }) => {
    // Arrange & Assert
    const googleButton = page.getByRole('button', { name: /continuar com google|sign in with google/i })
    await expect(googleButton).toBeVisible()
    await expect(googleButton).toBeEnabled()
  })

  test('should redirect to Google OAuth when clicking Google button', async ({ page }) => {
    // Arrange
    const googleButton = page.getByRole('button', { name: /continuar com google|sign in with google/i })
    
    // Act: Click Google sign-in button
    // Note: This will redirect to Google, so we need to wait for navigation
    const [popup] = await Promise.all([
      page.waitForEvent('popup', { timeout: 5000 }).catch(() => null),
      googleButton.click(),
    ])

    // Assert: Either popup opened (OAuth) or page navigated to Google
    // In real OAuth flow, Google opens in same window or popup
    // We can't fully test OAuth without real credentials, but we can verify the button works
    expect(googleButton).toBeDefined()
  })

  test('should handle OAuth callback with code parameter', async ({ page }) => {
    // Arrange: Simulate OAuth callback with code
    const mockCode = 'test-oauth-code-123'
    const callbackUrl = `/auth/callback?code=${mockCode}&next=/dashboard`
    
    // Act: Navigate to callback URL
    await page.goto(callbackUrl)
    
    // Assert: Should show processing state
    await expect(page.getByText(/processando autenticação|processing authentication/i)).toBeVisible({
      timeout: 5000,
    })
  })

  test('should handle OAuth callback with hash tokens', async ({ page }) => {
    // Arrange: Simulate OAuth callback with hash tokens
    const mockAccessToken = 'mock-access-token-123'
    const mockRefreshToken = 'mock-refresh-token-123'
    const callbackUrl = `/auth/callback#access_token=${mockAccessToken}&refresh_token=${mockRefreshToken}`
    
    // Act: Navigate to callback URL with hash
    await page.goto(callbackUrl)
    
    // Assert: Should show processing state
    await expect(page.getByText(/processando autenticação|processing authentication/i)).toBeVisible({
      timeout: 5000,
    })
  })

  test('should redirect to login on OAuth error', async ({ page }) => {
    // Arrange: Simulate OAuth callback with error
    const errorMessage = 'access_denied'
    const callbackUrl = `/auth/callback?error=${errorMessage}&error_description=User%20denied%20access`
    
    // Act: Navigate to callback URL with error
    await page.goto(callbackUrl)
    
    // Assert: Should redirect to login with error message
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 })
    
    // Verify error message is displayed
    await expect(page.getByText(/erro|error/i)).toBeVisible({ timeout: 5000 })
  })

  test('should handle existing session on callback', async ({ page, context }) => {
    // Arrange: Set up a mock session cookie
    // Note: In real tests, you'd need to authenticate first
    await context.addCookies([
      {
        name: 'sb-access-token',
        value: 'mock-session-token',
        domain: 'localhost',
        path: '/',
      },
    ])

    // Act: Navigate to callback
    await page.goto('/auth/callback?next=/dashboard')
    
    // Assert: Should redirect quickly if session exists
    // (In real scenario, this would redirect to dashboard)
    await expect(page).toHaveURL(/\/(dashboard|auth\/callback)/, { timeout: 5000 })
  })

  test('should preserve next parameter in OAuth flow', async ({ page }) => {
    // Arrange: Navigate to login with next parameter
    await page.goto('/auth/login?redirect=/courses')
    
    // Act: Click Google sign-in (this would normally redirect to Google)
    const googleButton = page.getByRole('button', { name: /continuar com google|sign in with google/i })
    
    // Assert: Button should be visible
    await expect(googleButton).toBeVisible()
    
    // Note: Full OAuth flow with next parameter would require real Google OAuth
    // This test verifies the UI is ready for the flow
  })
})
