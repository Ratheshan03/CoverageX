import { test, expect } from '@playwright/test';

/**
 * E2E Test: Complete User Flow
 * Tests the entire user journey from creating tasks to completing them
 */

test.describe('Complete User Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should allow user to create and complete tasks', async ({ page }) => {
    // Verify page loaded correctly
    await expect(page.locator('h1')).toContainText('To-Do List');

    // Create first task
    await page.getByTestId('title-input').fill('Task 1: Buy groceries');
    await page.getByTestId('description-input').fill('Get milk, bread, and eggs from the store');
    await page.getByTestId('submit-button').click();

    // Wait for task to appear
    await expect(page.getByTestId('task-card').first()).toBeVisible();
    await expect(page.getByText('Task 1: Buy groceries')).toBeVisible();

    // Create second task
    await page.getByTestId('title-input').fill('Task 2: Exercise');
    await page.getByTestId('description-input').fill('30 minutes running in the park');
    await page.getByTestId('submit-button').click();

    // Wait for second task to appear
    await page.waitForTimeout(500);
    await expect(page.getByText('Task 2: Exercise')).toBeVisible();

    // Create third task
    await page.getByTestId('title-input').fill('Task 3: Read book');
    await page.getByTestId('description-input').fill('Finish Chapter 5 of Clean Code');
    await page.getByTestId('submit-button').click();

    // Wait for third task to appear
    await page.waitForTimeout(500);
    await expect(page.getByText('Task 3: Read book')).toBeVisible();

    // Verify all 3 tasks are displayed
    const taskCards = page.getByTestId('task-card');
    await expect(taskCards).toHaveCount(3);

    // Complete the second task
    const secondTask = page.getByText('Task 2: Exercise').locator('..').locator('..');
    await secondTask.getByTestId('done-button').click();

    // Wait for task to disappear
    await page.waitForTimeout(500);

    // Verify the task is no longer visible
    await expect(page.getByText('Task 2: Exercise')).not.toBeVisible();

    // Verify only 2 tasks remain
    await expect(taskCards).toHaveCount(2);

    // Verify remaining tasks are still visible
    await expect(page.getByText('Task 1: Buy groceries')).toBeVisible();
    await expect(page.getByText('Task 3: Read book')).toBeVisible();
  });

  test('should display tasks in reverse chronological order (newest first)', async ({ page }) => {
    // Create three tasks
    const tasks = [
      { title: 'First Task', description: 'Created first' },
      { title: 'Second Task', description: 'Created second' },
      { title: 'Third Task', description: 'Created third' },
    ];

    for (const task of tasks) {
      await page.getByTestId('title-input').fill(task.title);
      await page.getByTestId('description-input').fill(task.description);
      await page.getByTestId('submit-button').click();
      await page.waitForTimeout(500);
    }

    // Get all task titles
    const taskTitles = await page.getByTestId('task-card').locator('h3').allTextContents();

    // Verify newest task is first
    expect(taskTitles[0]).toBe('Third Task');
    expect(taskTitles[1]).toBe('Second Task');
    expect(taskTitles[2]).toBe('First Task');
  });

  test('should persist tasks after page refresh', async ({ page }) => {
    // Create a task
    await page.getByTestId('title-input').fill('Persistent Task');
    await page.getByTestId('description-input').fill('This task should persist after refresh');
    await page.getByTestId('submit-button').click();

    // Wait for task to appear
    await expect(page.getByText('Persistent Task')).toBeVisible();

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify task is still visible
    await expect(page.getByText('Persistent Task')).toBeVisible();
  });
});
