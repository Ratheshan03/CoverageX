import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';
import taskApi from '../services/api';

// Mock the API service
vi.mock('../services/api', () => ({
  default: {
    createTask: vi.fn(),
  },
}));

describe('TaskForm', () => {
  const mockOnTaskCreated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with title and description inputs', () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('shows error when title is empty', async () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const submitButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(taskApi.createTask).not.toHaveBeenCalled();
  });

  it('shows error when description is empty', async () => {
    const user = userEvent.setup();
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'Test Task');

    const submitButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });

    expect(taskApi.createTask).not.toHaveBeenCalled();
  });

  it('successfully creates task with valid data', async () => {
    const user = userEvent.setup();
    const mockTask = {
      id: 1,
      title: 'New Task',
      description: 'Task description',
      completed: false,
      created_at: '2025-10-24T10:00:00.000Z',
      updated_at: '2025-10-24T10:00:00.000Z',
    };

    (taskApi.createTask as any).mockResolvedValue(mockTask);

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add/i });

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'Task description');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(taskApi.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Task description',
      });
    });

    expect(mockOnTaskCreated).toHaveBeenCalled();
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    const mockTask = {
      id: 1,
      title: 'New Task',
      description: 'Task description',
      completed: false,
      created_at: '2025-10-24T10:00:00.000Z',
      updated_at: '2025-10-24T10:00:00.000Z',
    };

    (taskApi.createTask as any).mockResolvedValue(mockTask);

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /add/i });

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'Task description');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });
  });

  it('shows error message when API call fails', async () => {
    const user = userEvent.setup();
    (taskApi.createTask as any).mockRejectedValue({
      response: {
        data: {
          error: 'Server error',
        },
      },
    });

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add/i });

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'Task description');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });

    expect(mockOnTaskCreated).not.toHaveBeenCalled();
  });

  it('disables form while submitting', async () => {
    const user = userEvent.setup();
    (taskApi.createTask as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add/i });

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'Task description');
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Adding...')).toBeInTheDocument();
  });
});
