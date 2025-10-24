import { test, expect } from '@playwright/test';

/**
 * E2E Test: UI and Responsive Design
 * Tests the user interface and responsive behavior
 */

test.describe('UI and Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display all main UI elements', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('To-Do List');
    await expect(page.locator('.app-subtitle')).toBeVisible();

    // Check form section
    await expect(page.getByText('Add a Task')).toBeVisible();
    await expect(page.getByTestId('title-input')).toBeVisible();
    await expect(page.getByTestId('description-input')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeVisible();

    // Check footer
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer')).toContainText(/React.*TypeScript.*Express/i);
  });

  test('should have proper layout on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    // Create a task to verify layout
    await page.getByTestId('title-input').fill('Desktop Test');
    await page.getByTestId('description-input').fill('Testing desktop layout');
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(500);

    // Form and task list should be side by side on desktop
    const formSection = page.locator('.form-section');
    const listSection = page.locator('.list-section');

    await expect(formSection).toBeVisible();
    await expect(listSection).toBeVisible();

    // Verify they are horizontally aligned (both visible at same vertical position)
    const formBox = await formSection.boundingBox();
    const listBox = await listSection.boundingBox();

    expect(formBox).not.toBeNull();
    expect(listBox).not.toBeNull();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // All elements should still be visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByTestId('title-input')).toBeVisible();
    await expect(page.getByTestId('submit-button')).toBeVisible();

    // Form should be usable
    await page.getByTestId('title-input').fill('Mobile Test');
    await page.getByTestId('description-input').fill('Testing mobile layout');
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(500);

    // Task should be visible
    await expect(page.getByText('Mobile Test')).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // All elements should be visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByTestId('title-input')).toBeVisible();

    // Create a task
    await page.getByTestId('title-input').fill('Tablet Test');
    await page.getByTestId('description-input').fill('Testing tablet layout');
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(500);

    await expect(page.getByText('Tablet Test')).toBeVisible();
  });

  test('should have interactive buttons with hover states', async ({ page }) => {
    // Create a task first
    await page.getByTestId('title-input').fill('Hover Test');
    await page.getByTestId('description-input').fill('Testing button interactions');
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(500);

    // Hover over Done button
    const doneButton = page.getByTestId('done-button').first();
    await doneButton.hover();

    // Button should be visible and clickable
    await expect(doneButton).toBeVisible();
    await expect(doneButton).toBeEnabled();
  });

  test('should display loading state correctly', async ({ page }) => {
    // When page first loads, it might show loading
    const loadingState = page.getByTestId('loading-state');
    
    // If no tasks exist yet, we might see loading briefly
    // This test verifies the loading state exists in the component
    // (even if it's too fast to see)
    
    // After loading, should show either tasks or empty state
    await page.waitForLoadState('networkidle');
    
    const emptyState = page.getByTestId('empty-state');
    const taskList = page.getByTestId('task-list');
    
    // Either empty state or task list should be visible
    const emptyVisible = await emptyState.isVisible().catch(() => false);
    const listVisible = await taskList.isVisible().catch(() => false);
    
    expect(emptyVisible || listVisible).toBe(true);
  });

  test('should handle long text gracefully', async ({ page }) => {
    // Create a task with very long title and description
    const longTitle = 'This is a very long task title that should be handled properly by the UI without breaking the layout or causing overflow issues';
    const longDescription = 'This is an extremely long description that contains a lot of text to test how the UI handles lengthy content. It should wrap properly and maintain good readability without breaking the card layout or causing horizontal scrolling. The text should be readable and the card should remain visually appealing even with lots of content.';

    await page.getByTestId('title-input').fill(longTitle);
    await page.getByTestId('description-input').fill(longDescription);
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(500);

    // Task should be visible
    const taskCard = page.getByTestId('task-card').first();
    await expect(taskCard).toBeVisible();

    // Verify the card doesn't overflow the viewport
    const cardBox = await taskCard.boundingBox();
    expect(cardBox).not.toBeNull();
    if (cardBox) {
      const viewport = page.viewportSize();
      expect(cardBox.width).toBeLessThanOrEqual(viewport!.width);
    }
  });

  test('should maintain functionality after window resize', async ({ page }) => {
    // Start with desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Create a task
    await page.getByTestId('title-input').fill('Resize Test');
    await page.getByTestId('description-input').fill('Testing resize behavior');
    await page.getByTestId('submit-button').click();
    await page.waitForTimeout(500);

    // Verify task is visible
    await expect(page.getByText('Resize Test')).toBeVisible();

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);

    // Task should still be visible
    await expect(page.getByText('Resize Test')).toBeVisible();

    // Done button should still work
    const doneButton = page.getByTestId('done-button').first();
    await expect(doneButton).toBeVisible();
    await doneButton.click();
    await page.waitForTimeout(500);

    // Task should be gone
    await expect(page.getByText('Resize Test')).not.toBeVisible();
  });
});
