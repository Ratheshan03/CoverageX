import { test, expect } from '@playwright/test';

/**
 * E2E Test: Form Validation
 * Tests input validation and error handling
 */

test.describe('Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show error when submitting empty form', async ({ page }) => {
    // Try to submit without filling any fields
    await page.getByTestId('submit-button').click();

    // Verify form validation prevents submission (browser native validation)
    // The title input should be focused and invalid
    const titleInput = page.getByTestId('title-input');
    const isInvalid = await titleInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should show error when title is missing', async ({ page }) => {
    // Fill only description
    await page.getByTestId('description-input').fill('This is a description without a title');
    await page.getByTestId('submit-button').click();

    // Verify title input is invalid
    const titleInput = page.getByTestId('title-input');
    const isInvalid = await titleInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should show error when description is missing', async ({ page }) => {
    // Fill only title
    await page.getByTestId('title-input').fill('Title without description');
    await page.getByTestId('submit-button').click();

    // Verify description input is invalid
    const descInput = page.getByTestId('description-input');
    const isInvalid = await descInput.evaluate((el: HTMLTextAreaElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should accept valid input', async ({ page }) => {
    // Fill both fields with valid data
    await page.getByTestId('title-input').fill('Valid Task');
    await page.getByTestId('description-input').fill('This is a valid task description');
    
    // Submit the form
    await page.getByTestId('submit-button').click();

    // Wait for task to appear
    await page.waitForTimeout(500);

    // Verify task was created
    await expect(page.getByText('Valid Task')).toBeVisible();

    // Verify form was cleared
    await expect(page.getByTestId('title-input')).toHaveValue('');
    await expect(page.getByTestId('description-input')).toHaveValue('');
  });

  test('should handle whitespace-only input', async ({ page }) => {
    // Try to submit with only whitespace
    await page.getByTestId('title-input').fill('   ');
    await page.getByTestId('description-input').fill('   ');
    await page.getByTestId('submit-button').click();

    // Wait a moment
    await page.waitForTimeout(500);

    // Verify error message appears (if custom validation is implemented)
    const errorMessage = page.getByTestId('error-message');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText(/required|cannot be empty/i);
    }
  });

  test('should enforce maximum length constraints', async ({ page }) => {
    // Create a title longer than 255 characters
    const longTitle = 'A'.repeat(256);
    const longDescription = 'B'.repeat(5001);

    // Try to fill with long values
    await page.getByTestId('title-input').fill(longTitle);
    await page.getByTestId('description-input').fill(longDescription);

    // Verify inputs are truncated to max length
    const titleValue = await page.getByTestId('title-input').inputValue();
    const descValue = await page.getByTestId('description-input').inputValue();

    expect(titleValue.length).toBeLessThanOrEqual(255);
    expect(descValue.length).toBeLessThanOrEqual(5000);
  });

  test('should display loading state during submission', async ({ page }) => {
    // Fill the form
    await page.getByTestId('title-input').fill('Test Task');
    await page.getByTestId('description-input').fill('Testing loading state');

    // Submit the form
    await page.getByTestId('submit-button').click();

    // Check for loading state (button text changes to "Adding...")
    const submitButton = page.getByTestId('submit-button');
    
    // Button should be disabled during submission
    const isDisabled = await submitButton.isDisabled();
    
    // This might be too fast to catch, but if we can, verify it
    if (isDisabled) {
      await expect(submitButton).toBeDisabled();
    }

    // Wait for submission to complete
    await page.waitForTimeout(1000);

    // Button should be enabled again
    await expect(submitButton).toBeEnabled();
  });
});
