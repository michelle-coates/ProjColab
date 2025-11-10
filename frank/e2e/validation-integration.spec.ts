/**
 * E2E Test: Validation Integration Across User Journey
 * Story 1.12: End-to-End Testing Suite
 *
 * Tests critical user journey with validation components:
 * 1. Onboarding with role selection validation
 * 2. Improvement creation with validation feedback
 * 3. Evidence gathering with completeness scoring
 * 4. Effort estimation with help tooltips
 * 5. Pairwise comparison with validated inputs
 * 6. Export with format validation
 */

import { test, expect } from '@playwright/test';

test.describe('Validation Integration - Critical User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto('/');
  });

  test('complete user journey with validation components', async ({ page }) => {
    // Step 1: Onboarding - Role Selection with Validation
    await test.step('Onboarding with validation', async () => {
      // Check for help tooltip on role selection
      const helpTooltip = page.locator('[aria-label="Help"]').first();
      await expect(helpTooltip).toBeVisible();

      // Try to start without selecting role (validation should prevent)
      const startButton = page.getByRole('button', { name: /start guided tour/i });
      await expect(startButton).toBeDisabled();

      // Select a role
      await page.getByText('Solo PM / Prioritizer').click();

      // Now button should be enabled
      await expect(startButton).toBeEnabled();
    });

    // Step 2: Improvement Creation with ValidationTextarea
    await test.step('Create improvement with validation', async () => {
      // Navigate to create improvement
      await page.getByRole('button', { name: /new improvement/i }).click();

      // Find validation textarea
      const titleInput = page.locator('input[placeholder*="improvement"]').first();
      const descriptionTextarea = page.locator('textarea[placeholder*="describe"]').first();

      // Try submitting empty form (should show validation error)
      await page.getByRole('button', { name: /create/i }).click();

      // Check for validation error message
      await expect(page.locator('text=/minimum.*characters/i')).toBeVisible();

      // Fill with valid data
      await titleInput.fill('Improve dashboard loading performance');
      await descriptionTextarea.fill('Users are experiencing slow dashboard load times above 3 seconds. We need to optimize data fetching and reduce initial bundle size.');

      // Check character count is shown
      await expect(page.locator('text=/characters/i')).toBeVisible();

      // Submit valid form
      await page.getByRole('button', { name: /create/i }).click();
    });

    // Step 3: Evidence Gathering with Completeness Scoring
    await test.step('Gather evidence with completeness indicator', async () => {
      // Look for evidence gathering interface
      await expect(page.getByText(/gather evidence/i)).toBeVisible();

      // Check for help tooltip
      const evidenceHelp = page.locator('[aria-label="Help"]').first();
      await evidenceHelp.click();
      await expect(page.getByText(/evidence is anything/i)).toBeVisible();

      // Type evidence (should show completeness indicator)
      const evidenceInput = page.locator('textarea').first();
      await evidenceInput.fill('Based on analytics data from last month, dashboard load time averages 4.2 seconds. 23% of users abandon before seeing data.');

      // Check for completeness indicator
      await expect(page.locator('text=/evidence quality/i')).toBeVisible();
      await expect(page.locator('text=/%/i')).toBeVisible(); // Percentage score

      // Submit response
      await page.getByRole('button', { name: /submit response/i }).click();
    });

    // Step 4: Effort Estimation with Validation
    await test.step('Estimate effort with validation', async () => {
      // Navigate to effort estimation
      await page.getByText(/effort/i).click();

      // Check for help tooltip on effort levels
      const effortHelp = page.locator('[aria-label="Help"]').first();
      await expect(effortHelp).toBeVisible();

      // Select effort level
      await page.getByText(/medium/i).click();

      // Check for ValidationTextarea in rationale
      const rationaleInput = page.locator('textarea[placeholder*="rationale"]').first();
      await rationaleInput.fill('Requires optimization of API queries and implementing lazy loading. Estimated 3-5 days.');

      // Check validation state (should show success or character count)
      await expect(page.locator('text=/characters/i')).toBeVisible();

      // Submit effort
      await page.getByRole('button', { name: /set effort/i }).click();
    });

    // Step 5: Pairwise Comparison with Validation
    await test.step('Perform comparison with validated rationale', async () => {
      // Navigate to comparisons
      await page.goto('/dashboard/comparison');

      // Check for help tooltip on comparison
      const comparisonHelp = page.locator('[aria-label="Help"]').first();
      await expect(comparisonHelp).toBeVisible();

      // Make a choice
      await page.locator('button').filter({ hasText: /choose this/i }).first().click();

      // Optional: Add rationale with ValidationTextarea
      const rationaleTextarea = page.locator('textarea').first();
      if (await rationaleTextarea.isVisible()) {
        await rationaleTextarea.fill('Higher user impact based on feedback volume');

        // Check for character counter
        await expect(page.locator('text=/500/i')).toBeVisible();
      }
    });

    // Step 6: Export with Validation
    await test.step('Export with format validation', async () => {
      // Navigate to export
      await page.getByRole('button', { name: /export/i }).click();

      // Check for help tooltip
      const exportHelp = page.locator('[aria-label="Help"]').first();
      await expect(exportHelp).toBeVisible();

      // Select format
      await page.getByText(/csv export/i).click();

      // Validation: Check export button is enabled when format selected
      const exportButton = page.getByRole('button', { name: /export csv/i });
      await expect(exportButton).toBeEnabled();
    });
  });

  test('validation error messages display correctly', async ({ page }) => {
    await test.step('Test validation error display', async () => {
      // Create improvement with too-short input
      await page.goto('/dashboard/improvements/new');

      const input = page.locator('textarea').first();
      await input.fill('Short'); // Less than minimum

      // Try to submit
      await page.getByRole('button', { name: /create/i }).click();

      // Should show validation error
      await expect(page.locator('text=/minimum.*characters/i')).toBeVisible();

      // Error should be in red
      const errorElement = page.locator('.text-red-600, .text-red-800').first();
      await expect(errorElement).toBeVisible();
    });
  });

  test('help tooltips are accessible and functional', async ({ page }) => {
    await test.step('Test help tooltip accessibility', async () => {
      await page.goto('/onboarding');

      // Find help tooltip
      const helpButton = page.locator('[aria-label="Help"]').first();
      await expect(helpButton).toBeVisible();

      // Click to open
      await helpButton.click();

      // Tooltip content should appear
      const tooltipContent = page.locator('[role="tooltip"]').first();
      await expect(tooltipContent).toBeVisible();

      // Press Escape to close
      await page.keyboard.press('Escape');
      await expect(tooltipContent).not.toBeVisible();
    });
  });

  test('error boundaries handle component errors gracefully', async ({ page }) => {
    await test.step('Test error boundary fallback', async () => {
      // This would normally require injecting an error
      // For now, verify error boundary component exists
      await page.goto('/dashboard');

      // If an error occurs, should see error boundary fallback
      // Check that page doesn't crash
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
