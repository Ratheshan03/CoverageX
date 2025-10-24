import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import taskApi from '../services/api';

interface TaskFormProps {
  onTaskCreated: () => void;
}

/**
 * TaskForm Component
 * Form for creating new tasks with validation - Modern glassmorphism design
 */
const TaskForm = ({ onTaskCreated }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (title.length > 255) {
      toast.error('Title must not exceed 255 characters');
      return;
    }

    if (description.length > 5000) {
      toast.error('Description must not exceed 5000 characters');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Creating task...');

    try {
      const newTask = await taskApi.createTask({
        title: title.trim(),
        description: description.trim(),
      });

      // Clear form on success
      setTitle('');
      setDescription('');
      setError(null);

      // Show success toast
      toast.success('Task created successfully!', {
        id: loadingToast,
        description: `"${newTask.title}" has been added to your list`,
      });

      // Notify parent to refresh task list
      onTaskCreated();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create task';
      toast.error('Failed to create task', {
        id: loadingToast,
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Task
        </h2>
      </div>

      <form onSubmit={handleSubmit} data-testid="task-form" className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="e.g., Complete project documentation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            data-testid="title-input"
            maxLength={255}
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed scrollbar-thin"
            placeholder="Add details about your task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            data-testid="description-input"
            rows={4}
            maxLength={5000}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm animate-in fade-in duration-200"
            data-testid="error-message"
            role="alert"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-orange-500 disabled:hover:to-orange-600 flex items-center justify-center gap-2"
          disabled={loading}
          data-testid="submit-button"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Task</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
