import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database';
import { Task, CreateTaskDTO, TaskRow } from '../types/task.types';

/**
 * Task Model - Handles database operations for tasks
 * Following Repository pattern for clean separation of concerns
 */
export class TaskModel {
  /**
   * Create a new task
   */
  static async create(taskData: CreateTaskDTO): Promise<Task> {
    const query = `
      INSERT INTO task (title, description)
      VALUES (?, ?)
    `;

    const [result] = await pool.execute<ResultSetHeader>(
      query,
      [taskData.title, taskData.description]
    );

    // Fetch and return the created task
    const createdTask = await this.findById(result.insertId);
    if (!createdTask) {
      throw new Error('Failed to create task');
    }

    return createdTask;
  }

  /**
   * Get most recent 5 incomplete tasks
   */
  static async getRecentIncompleteTasks(): Promise<Task[]> {
    const query = `
      SELECT * FROM task
      WHERE completed = FALSE
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const [rows] = await pool.execute<TaskRow[] & RowDataPacket[]>(query);

    return rows.map(this.rowToTask);
  }

  /**
   * Find task by ID
   */
  static async findById(id: number): Promise<Task | null> {
    const query = 'SELECT * FROM task WHERE id = ?';
    const [rows] = await pool.execute<TaskRow[] & RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      return null;
    }

    return this.rowToTask(rows[0]);
  }

  /**
   * Mark task as completed
   */
  static async markAsCompleted(id: number): Promise<Task | null> {
    const query = `
      UPDATE task
      SET completed = TRUE
      WHERE id = ?
    `;

    const [result] = await pool.execute<ResultSetHeader>(query, [id]);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  /**
   * Convert database row to Task object
   * Handles type conversion from MySQL to TypeScript
   */
  private static rowToTask(row: TaskRow): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: Boolean(row.completed), // Convert 0/1 to boolean
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
