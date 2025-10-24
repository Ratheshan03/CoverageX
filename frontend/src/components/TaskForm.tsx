import { useState } from 'react';
import type { FormEvent } from 'react';
import taskApi from '../services/api';
import './TaskForm.css';

interface TaskFormProps {
  onTaskCreated: () => void;
}

/**
 * TaskForm Component
 * Form for creating new tasks with validation
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
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (title.length > 255) {
      setError('Title must not exceed 255 characters');
      return;
    }

    if (description.length > 5000) {
      setError('Description must not exceed 5000 characters');
      return;
    }

    setLoading(true);

    try {
      await taskApi.createTask({
        title: title.trim(),
        description: description.trim(),
      });

      // Clear form on success
      setTitle('');
      setDescription('');
      setError(null);

      // Notify parent to refresh task list
      onTaskCreated();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create task';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2 className="form-title">Add a Task</h2>
      <form onSubmit={handleSubmit} className="task-form" data-testid="task-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="form-input"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            data-testid="title-input"
            maxLength={255}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className="form-textarea"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            data-testid="description-input"
            rows={4}
            maxLength={5000}
          />
        </div>

        {error && (
          <div className="error-message" data-testid="error-message" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
          data-testid="submit-button"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
