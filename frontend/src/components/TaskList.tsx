import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import TaskCard from './TaskCard';
import taskApi from '../services/api';
import type { Task } from '../types/task';

interface TaskListProps {
  refreshTrigger: number;
}

/**
 * TaskList Component
 * Displays list of incomplete tasks with modern glassmorphism design
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
      toast.error('Failed to load tasks', {
        description: errorMessage,
      });
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
    // Find the task before removing it
    const task = tasks.find((t) => t.id === taskId);

    try {
      // Optimistically remove task from list
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));

      await taskApi.completeTask(taskId);

      // Show success toast
      toast.success('Task completed!', {
        description: task ? `"${task.title}" marked as done` : 'Task has been completed',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to complete task';

      toast.error('Failed to complete task', {
        description: errorMessage,
      });

      // Refresh tasks to restore state on error
      fetchTasks();
    }
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center justify-center py-12" data-testid="loading-state">
          <svg className="animate-spin h-10 w-10 text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center justify-center py-12" data-testid="error-state" role="alert">
          <svg className="w-12 h-12 text-red-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-400 text-center">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center justify-center py-12 text-center" data-testid="empty-state">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No tasks yet</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            Get started by creating your first task using the form on the left
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Active Tasks
        </h2>
        <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full">
          <span className="text-orange-400 text-sm font-medium">{tasks.length}/5</span>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3 scrollbar-thin max-h-[450px] overflow-y-auto pr-1" data-testid="task-list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onComplete={handleComplete} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
