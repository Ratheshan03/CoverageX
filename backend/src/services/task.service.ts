import { TaskModel } from '../models/task.model';
import { Task, CreateTaskDTO } from '../types/task.types';

/**
 * Task Service - Contains business logic for task operations
 * Following Single Responsibility Principle
 */
export class TaskService {
  /**
   * Create a new task
   * Validates input and delegates to model layer
   */
  async createTask(taskData: CreateTaskDTO): Promise<Task> {
    // Validate input
    this.validateTaskData(taskData);

    // Create task through model
    const task = await TaskModel.create(taskData);
    return task;
  }

  /**
   * Get recent incomplete tasks (max 5)
   */
  async getRecentTasks(): Promise<Task[]> {
    const tasks = await TaskModel.getRecentIncompleteTasks();
    return tasks;
  }

  /**
   * Mark a task as completed
   * Returns null if task not found
   */
  async completeTask(taskId: number): Promise<Task | null> {
    // Validate task ID
    if (!taskId || taskId <= 0) {
      throw new Error('Invalid task ID');
    }

    const task = await TaskModel.markAsCompleted(taskId);
    return task;
  }

  /**
   * Validate task data
   * Throws error if validation fails
   */
  private validateTaskData(taskData: CreateTaskDTO): void {
    if (!taskData.title || taskData.title.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (taskData.title.length > 255) {
      throw new Error('Title must not exceed 255 characters');
    }

    if (!taskData.description || taskData.description.trim().length === 0) {
      throw new Error('Description is required');
    }

    if (taskData.description.length > 5000) {
      throw new Error('Description must not exceed 5000 characters');
    }
  }
}

// Export singleton instance
export default new TaskService();
