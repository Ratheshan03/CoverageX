import { TaskService } from '../../src/services/task.service';
import { TaskModel } from '../../src/models/task.model';
import { Task } from '../../src/types/task.types';

// Mock the TaskModel
jest.mock('../../src/models/task.model');

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task with valid data', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (TaskModel.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.createTask({
        title: 'Test Task',
        description: 'Test Description',
      });

      expect(result).toEqual(mockTask);
      expect(TaskModel.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
      });
    });

    it('should throw error if title is empty', async () => {
      await expect(
        taskService.createTask({
          title: '',
          description: 'Test Description',
        })
      ).rejects.toThrow('Title is required');
    });

    it('should throw error if title exceeds 255 characters', async () => {
      const longTitle = 'a'.repeat(256);

      await expect(
        taskService.createTask({
          title: longTitle,
          description: 'Test Description',
        })
      ).rejects.toThrow('Title must not exceed 255 characters');
    });

    it('should throw error if description is empty', async () => {
      await expect(
        taskService.createTask({
          title: 'Test Task',
          description: '',
        })
      ).rejects.toThrow('Description is required');
    });

    it('should throw error if description exceeds 5000 characters', async () => {
      const longDescription = 'a'.repeat(5001);

      await expect(
        taskService.createTask({
          title: 'Test Task',
          description: longDescription,
        })
      ).rejects.toThrow('Description must not exceed 5000 characters');
    });

    it('should trim whitespace from title and description', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (TaskModel.create as jest.Mock).mockResolvedValue(mockTask);

      await taskService.createTask({
        title: '  Test Task  ',
        description: '  Test Description  ',
      });

      // Should not throw error even with whitespace
      expect(TaskModel.create).toHaveBeenCalled();
    });
  });

  describe('getRecentTasks', () => {
    it('should return array of tasks', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          completed: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (TaskModel.getRecentIncompleteTasks as jest.Mock).mockResolvedValue(mockTasks);

      const result = await taskService.getRecentTasks();

      expect(result).toEqual(mockTasks);
      expect(TaskModel.getRecentIncompleteTasks).toHaveBeenCalled();
    });

    it('should return empty array if no tasks', async () => {
      (TaskModel.getRecentIncompleteTasks as jest.Mock).mockResolvedValue([]);

      const result = await taskService.getRecentTasks();

      expect(result).toEqual([]);
    });
  });

  describe('completeTask', () => {
    it('should mark task as completed', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        completed: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (TaskModel.markAsCompleted as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.completeTask(1);

      expect(result).toEqual(mockTask);
      expect(TaskModel.markAsCompleted).toHaveBeenCalledWith(1);
    });

    it('should return null if task not found', async () => {
      (TaskModel.markAsCompleted as jest.Mock).mockResolvedValue(null);

      const result = await taskService.completeTask(999);

      expect(result).toBeNull();
    });

    it('should throw error for invalid task ID (0)', async () => {
      await expect(taskService.completeTask(0)).rejects.toThrow('Invalid task ID');
    });

    it('should throw error for negative task ID', async () => {
      await expect(taskService.completeTask(-1)).rejects.toThrow('Invalid task ID');
    });
  });
});
