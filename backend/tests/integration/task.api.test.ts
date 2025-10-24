import request from 'supertest';
import app from '../../src/app';
import { TaskModel } from '../../src/models/task.model';
import { Task } from '../../src/types/task.types';

// Mock the TaskModel to avoid database dependency
jest.mock('../../src/models/task.model');
jest.mock('../../src/config/database', () => ({
  testConnection: jest.fn().mockResolvedValue(undefined),
  default: {},
}));

describe('Task API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with valid data', async () => {
      const newTask = {
        title: 'Buy books',
        description: 'Buy books for the next school year',
      };

      const mockCreatedTask: Task = {
        id: 1,
        ...newTask,
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (TaskModel.create as jest.Mock).mockResolvedValue(mockCreatedTask);

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body).toMatchObject({
        id: 1,
        title: newTask.title,
        description: newTask.description,
        completed: false,
      });
    });

    it('should return 400 if title is missing', async () => {
      const invalidTask = {
        description: 'Description without title',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
          }),
        ])
      );
    });

    it('should return 400 if description is missing', async () => {
      const invalidTask = {
        title: 'Title without description',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'description',
          }),
        ])
      );
    });

    it('should return 400 if title exceeds 255 characters', async () => {
      const invalidTask = {
        title: 'a'.repeat(256),
        description: 'Valid description',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 if description exceeds 5000 characters', async () => {
      const invalidTask = {
        title: 'Valid title',
        description: 'a'.repeat(5001),
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return list of recent incomplete tasks', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          created_at: new Date('2025-10-24T10:00:00Z'),
          updated_at: new Date('2025-10-24T10:00:00Z'),
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          completed: false,
          created_at: new Date('2025-10-24T09:00:00Z'),
          updated_at: new Date('2025-10-24T09:00:00Z'),
        },
      ];

      (TaskModel.getRecentIncompleteTasks as jest.Mock).mockResolvedValue(mockTasks);

      const response = await request(app).get('/api/tasks').expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        id: 1,
        title: 'Task 1',
        completed: false,
      });
    });

    it('should return empty array if no tasks exist', async () => {
      (TaskModel.getRecentIncompleteTasks as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/api/tasks').expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return maximum 5 tasks', async () => {
      const mockTasks: Task[] = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: `Task ${i + 1}`,
        description: `Description ${i + 1}`,
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      (TaskModel.getRecentIncompleteTasks as jest.Mock).mockResolvedValue(mockTasks);

      const response = await request(app).get('/api/tasks').expect(200);

      expect(response.body).toHaveLength(5);
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should mark task as completed', async () => {
      const mockCompletedTask: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        completed: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (TaskModel.markAsCompleted as jest.Mock).mockResolvedValue(mockCompletedTask);

      const response = await request(app).patch('/api/tasks/1/complete').expect(200);

      expect(response.body).toMatchObject({
        id: 1,
        completed: true,
      });
      expect(TaskModel.markAsCompleted).toHaveBeenCalledWith(1);
    });

    it('should return 404 if task not found', async () => {
      (TaskModel.markAsCompleted as jest.Mock).mockResolvedValue(null);

      const response = await request(app).patch('/api/tasks/999/complete').expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid task ID', async () => {
      const response = await request(app).patch('/api/tasks/invalid/complete').expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid task ID');
    });
  });

  describe('Health Check', () => {
    it('should return 200 for health check endpoint', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/api/unknown').expect(404);

      expect(response.body).toHaveProperty('error', 'Endpoint not found');
    });
  });
});
