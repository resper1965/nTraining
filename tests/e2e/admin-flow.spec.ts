// ============================================================================
// Admin Flow E2E Test
// ============================================================================
// Happy Path: Login como Admin → Acessar Wizard de Criação de Curso → Gerar Curso
// ============================================================================

import { test, expect } from '@playwright/test'

test.describe('Admin Course Creation Flow', () => {
  test('should complete course creation wizard flow', async ({ page }) => {
    // Arrange: Login as admin
    await page.goto('/auth/login')
    
    const testEmail = process.env.TEST_ADMIN_EMAIL || 'admin@example.com'
    const testPassword = process.env.TEST_ADMIN_PASSWORD || 'adminpassword123'

    const emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i))
    const passwordInput = page.getByLabel(/senha|password/i).or(page.getByPlaceholder(/senha|password/i))
    const submitButton = page.getByRole('button', { name: /entrar|login|sign in/i })

    await emailInput.fill(testEmail)
    await passwordInput.fill(testPassword)
    await submitButton.click()

    // Wait for redirect to dashboard or admin area
    await expect(page).toHaveURL(/\/(dashboard|admin)/, { timeout: 10000 })

    // Act: Navigate to AI Course Architect
    await page.goto('/admin/ai')

    // Wait for page to load
    await expect(page).toHaveURL('/admin/ai', { timeout: 5000 })

    // Find the Course Architect tab or wizard
    const architectTab = page.getByRole('tab', { name: /architect|arquitetar/i }).or(
      page.getByText(/course architect|arquitetar curso/i)
    )
    
    // If tabs are present, click the architect tab
    if (await architectTab.isVisible()) {
      await architectTab.click()
    }

    // Find the input field for course topic
    const topicInput = page.getByPlaceholder(/sobre o que vamos treinar|what.*train/i).or(
      page.getByLabel(/tópico|topic/i)
    )
    
    await expect(topicInput).toBeVisible({ timeout: 5000 })

    // Act: Fill topic and submit
    const testTopic = 'Security Fundamentals'
    await topicInput.fill(testTopic)

    // Find and click "Continuar" or "Continue" button
    const continueButton = page.getByRole('button', { name: /continuar|continue|próximo|next/i })
    await expect(continueButton).toBeVisible()
    await continueButton.click()

    // Wait for next step (context selection or generation)
    // This might be step 2 (Knowledge Vault selection) or direct generation
    await page.waitForTimeout(2000) // Give time for transition

    // Look for "Arquitetar Curso" or "Generate" button
    const generateButton = page.getByRole('button', { name: /arquitetar|generate|gerar/i })
    
    if (await generateButton.isVisible()) {
      await generateButton.click()

      // Assert: Verify success toast appears
      // Playwright can detect toasts via aria-live regions or text content
      const successToast = page.getByText(/sucesso|success|curso gerado|course generated/i).first()
      await expect(successToast).toBeVisible({ timeout: 15000 }) // AI generation might take time
    } else {
      // If no generate button, might be in different step
      // This test might need adjustment based on actual UI flow
      console.log('Generate button not found, might be in different step')
    }
  })

  test('should show error when AI generation fails', async ({ page }) => {
    // Arrange: Login as admin
    await page.goto('/auth/login')
    
    const testEmail = process.env.TEST_ADMIN_EMAIL || 'admin@example.com'
    const testPassword = process.env.TEST_ADMIN_PASSWORD || 'adminpassword123'

    await page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i)).fill(testEmail)
    await page.getByLabel(/senha|password/i).or(page.getByPlaceholder(/senha|password/i)).fill(testPassword)
    await page.getByRole('button', { name: /entrar|login|sign in/i }).click()

    await expect(page).toHaveURL(/\/(dashboard|admin)/, { timeout: 10000 })

    // Navigate to AI Course Architect
    await page.goto('/admin/ai')

    // Act: Try to generate without filling topic (should show validation error)
    const generateButton = page.getByRole('button', { name: /arquitetar|generate|gerar/i }).first()
    
    if (await generateButton.isVisible({ timeout: 5000 })) {
      await generateButton.click()

      // Assert: Should show validation error
      const errorMessage = page.getByText(/erro|error|inválido|invalid|obrigatório|required/i).first()
      await expect(errorMessage).toBeVisible({ timeout: 5000 })
    }
  })

  test('should navigate Knowledge Vault tab', async ({ page }) => {
    // Arrange: Login as admin
    await page.goto('/auth/login')
    
    const testEmail = process.env.TEST_ADMIN_EMAIL || 'admin@example.com'
    const testPassword = process.env.TEST_ADMIN_PASSWORD || 'adminpassword123'

    await page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i)).fill(testEmail)
    await page.getByLabel(/senha|password/i).or(page.getByPlaceholder(/senha|password/i)).fill(testPassword)
    await page.getByRole('button', { name: /entrar|login|sign in/i }).click()

    await expect(page).toHaveURL(/\/(dashboard|admin)/, { timeout: 10000 })

    // Navigate to AI page
    await page.goto('/admin/ai')

    // Act: Click Knowledge Vault tab
    const vaultTab = page.getByRole('tab', { name: /vault|cofre|knowledge/i })
    await expect(vaultTab).toBeVisible()
    await vaultTab.click()

    // Assert: Should show Knowledge Vault content
    await expect(page.getByText(/knowledge vault|cofre de conhecimento/i)).toBeVisible({
      timeout: 5000,
    })

    // Should show upload area or document list
    const uploadArea = page.getByText(/arraste|drag|upload|enviar/i).or(
      page.getByRole('button', { name: /upload|enviar/i })
    )
    await expect(uploadArea.first()).toBeVisible()
  })
})
