import { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import taskApi from '../services/api';
import type { Task } from '../types/task';
import './TaskList.css';

interface TaskListProps {
  refreshTrigger: number;
}

/**
 * TaskList Component
 * Displays list of incomplete tasks and handles task completion
 */
const TaskList = ({ refreshTrigger }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load tasks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on mount and when refreshTrigger changes
  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  // Handle task completion
  const handleComplete = async (taskId: number) => {
    try {
      await taskApi.completeTask(taskId);

      // Optimistically remove task from list
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to complete task';
      setError(errorMessage);

      // Refresh tasks to restore state on error
      fetchTasks();
    }
  };

  if (loading) {
    return (
      <div className="task-list-container">
        <div className="loading-state" data-testid="loading-state">
          Loading tasks...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list-container">
        <div className="error-state" data-testid="error-state" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-container">
        <div className="empty-state" data-testid="empty-state">
          <p>No tasks yet. Add your first task!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list" data-testid="task-list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onComplete={handleComplete} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
