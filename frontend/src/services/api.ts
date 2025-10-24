import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Task, CreateTaskRequest } from '../types/task';

/**
 * API Service for backend communication
 * Handles all HTTP requests to the backend REST API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * Task API Service
 */
export const taskApi = {
  /**
   * Get all incomplete tasks (max 5 most recent)
   */
  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get<Task[]>('/tasks');
    return response.data;
  },

  /**
   * Create a new task
   */
  async createTask(task: CreateTaskRequest): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', task);
    return response.data;
  },

  /**
   * Mark a task as completed
   */
  async completeTask(taskId: number): Promise<Task> {
    const response = await apiClient.patch<Task>(`/tasks/${taskId}/complete`);
    return response.data;
  },
};

export default taskApi;
