import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import taskService from '../services/task.service';

/**
 * Task Controller - Handles HTTP requests and responses
 * Following Controller pattern for separation of concerns
 */
export class TaskController {
  /**
   * Create a new task
   * POST /api/tasks
   */
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors.array().map((err) => ({
            field: err.type === 'field' ? err.path : 'unknown',
            message: err.msg,
          })),
        });
        return;
      }

      const { title, description } = req.body;

      const task = await taskService.createTask({ title, description });

      res.status(201).json(task);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * Get recent incomplete tasks (max 5)
   * GET /api/tasks
   */
  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await taskService.getRecentTasks();
      res.status(200).json(tasks);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * Mark task as completed
   * PATCH /api/tasks/:id/complete
   */
  async completeTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = parseInt(req.params.id);

      if (isNaN(taskId)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      const task = await taskService.completeTask(taskId);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * Centralized error handling
   */
  private handleError(res: Response, error: unknown): void {
    console.error('Error:', error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new TaskController();
