// Task type definitions

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
}

export interface TaskRow {
  id: number;
  title: string;
  description: string;
  completed: number; // MySQL returns BOOLEAN as 0 or 1
  created_at: Date;
  updated_at: Date;
}
