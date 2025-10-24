import { test, expect } from '@playwright/test';

/**
 * E2E Test: Task Limit
 * Tests that only 5 most recent incomplete tasks are displayed
 */

test.describe('Task Limit (5 Tasks Maximum)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display maximum of 5 tasks', async ({ page }) => {
    // Create 7 tasks
    const tasks = [
      { title: 'Task 1', description: 'First task' },
      { title: 'Task 2', description: 'Second task' },
      { title: 'Task 3', description: 'Third task' },
      { title: 'Task 4', description: 'Fourth task' },
      { title: 'Task 5', description: 'Fifth task' },
      { title: 'Task 6', description: 'Sixth task' },
      { title: 'Task 7', description: 'Seventh task' },
    ];

    // Create all tasks
    for (const task of tasks) {
      await page.getByTestId('title-input').fill(task.title);
      await page.getByTestId('description-input').fill(task.description);
      await page.getByTestId('submit-button').click();
      await page.waitForTimeout(300); // Wait for task to be created
    }

    // Wait for final update
    await page.waitForTimeout(500);

    // Verify only 5 tasks are displayed
    const taskCards = page.getByTestId('task-card');
    await expect(taskCards).toHaveCount(5);

    // Verify the 5 most recent tasks are shown (Tasks 3-7)
    await expect(page.getByText('Task 7')).toBeVisible();
    await expect(page.getByText('Task 6')).toBeVisible();
    await expect(page.getByText('Task 5')).toBeVisible();
    await expect(page.getByText('Task 4')).toBeVisible();
    await expect(page.getByText('Task 3')).toBeVisible();

    // Verify oldest tasks are NOT visible (Tasks 1-2)
    await expect(page.getByText('Task 1')).not.toBeVisible();
    await expect(page.getByText('Task 2')).not.toBeVisible();
  });

  test('should show newest tasks first', async ({ page }) => {
    // Create 5 tasks
    for (let i = 1; i <= 5; i++) {
      await page.getByTestId('title-input').fill(`Task ${i}`);
      await page.getByTestId('description-input').fill(`Task number ${i}`);
      await page.getByTestId('submit-button').click();
      await page.waitForTimeout(300);
    }

    // Wait for all tasks to be created
    await page.waitForTimeout(500);

    // Get all task titles
    const taskTitles = await page.getByTestId('task-card').locator('h3').allTextContents();

    // Verify order (newest first)
    expect(taskTitles[0]).toBe('Task 5');
    expect(taskTitles[1]).toBe('Task 4');
    expect(taskTitles[2]).toBe('Task 3');
    expect(taskTitles[3]).toBe('Task 2');
    expect(taskTitles[4]).toBe('Task 1');
  });

  test('should update list when task is completed', async ({ page }) => {
    // Create 6 tasks
    for (let i = 1; i <= 6; i++) {
      await page.getByTestId('title-input').fill(`Task ${i}`);
      await page.getByTestId('description-input').fill(`Description ${i}`);
      await page.getByTestId('submit-button').click();
      await page.waitForTimeout(300);
    }

    // Wait for tasks
    await page.waitForTimeout(500);

    // Initially, only tasks 2-6 should be visible (5 most recent)
    await expect(page.getByTestId('task-card')).toHaveCount(5);
    await expect(page.getByText('Task 6')).toBeVisible();
    await expect(page.getByText('Task 1')).not.toBeVisible();

    // Complete Task 6 (the newest)
    const task6 = page.getByText('Task 6').locator('..').locator('..');
    await task6.getByTestId('done-button').click();

    // Wait for update
    await page.waitForTimeout(500);

    // Now Task 1 should become visible (as we now have only 4 visible tasks)
    // and the system should fetch more
    const taskCards = page.getByTestId('task-card');
    const count = await taskCards.count();

    // Should have 4 or 5 tasks visible
    expect(count).toBeGreaterThanOrEqual(4);
    expect(count).toBeLessThanOrEqual(5);

    // Task 6 should be gone
    await expect(page.getByText('Task 6')).not.toBeVisible();
  });

  test('should show empty state when no tasks exist', async ({ page }) => {
    // Check for empty state message
    const emptyState = page.getByTestId('empty-state');
    
    // If there are existing tasks, complete them all first
    const taskCards = page.getByTestId('task-card');
    const count = await taskCards.count();
    
    if (count > 0) {
      // Complete all visible tasks
      for (let i = 0; i < count; i++) {
        const firstTask = taskCards.first();
        await firstTask.getByTestId('done-button').click();
        await page.waitForTimeout(300);
      }
    }

    // Wait for update
    await page.waitForTimeout(500);

    // Verify empty state is shown
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText(/no tasks/i);
  });

  test('should handle rapid task creation', async ({ page }) => {
    // Rapidly create 10 tasks
    for (let i = 1; i <= 10; i++) {
      await page.getByTestId('title-input').fill(`Rapid Task ${i}`);
      await page.getByTestId('description-input').fill(`Description ${i}`);
      await page.getByTestId('submit-button').click();
      await page.waitForTimeout(100); // Very short wait
    }

    // Wait for all requests to complete
    await page.waitForTimeout(2000);

    // Should still only show 5 tasks
    const taskCards = page.getByTestId('task-card');
    await expect(taskCards).toHaveCount(5);

    // Should show the 5 most recent (6-10)
    await expect(page.getByText('Rapid Task 10')).toBeVisible();
    await expect(page.getByText('Rapid Task 6')).toBeVisible();
  });
});
