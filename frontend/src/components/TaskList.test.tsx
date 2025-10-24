import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskList from './TaskList';
import taskApi from '../services/api';
import type { Task } from '../types/task';

// Mock the API service
vi.mock('../services/api', () => ({
  default: {
    getTasks: vi.fn(),
    completeTask: vi.fn(),
  },
}));

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      created_at: '2025-10-24T10:00:00.000Z',
      updated_at: '2025-10-24T10:00:00.000Z',
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      completed: false,
      created_at: '2025-10-24T09:00:00.000Z',
      updated_at: '2025-10-24T09:00:00.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (taskApi.getTasks as any).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<TaskList refreshTrigger={0} />);

    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('renders list of tasks after loading', async () => {
    (taskApi.getTasks as any).mockResolvedValue(mockTasks);

    render(<TaskList refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('shows empty state when no tasks', async () => {
    (taskApi.getTasks as any).mockResolvedValue([]);

    render(<TaskList refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('No tasks yet. Add your first task!')).toBeInTheDocument();
    });
  });

  it('shows error state when API call fails', async () => {
    (taskApi.getTasks as any).mockRejectedValue({
      response: {
        data: {
          error: 'Failed to load tasks',
        },
      },
    });

    render(<TaskList refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
      expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
    });
  });

  it('removes task from list when completed', async () => {
    (taskApi.getTasks as any).mockResolvedValue(mockTasks);
    (taskApi.completeTask as any).mockResolvedValue({
      ...mockTasks[0],
      completed: true,
    });

    render(<TaskList refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const doneButtons = screen.getAllByRole('button', { name: /done/i });
    fireEvent.click(doneButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    });

    expect(taskApi.completeTask).toHaveBeenCalledWith(1);
  });

  it('refreshes tasks when refreshTrigger changes', async () => {
    (taskApi.getTasks as any).mockResolvedValue(mockTasks);

    const { rerender } = render(<TaskList refreshTrigger={0} />);

    await waitFor(() => {
      expect(taskApi.getTasks).toHaveBeenCalledTimes(1);
    });

    rerender(<TaskList refreshTrigger={1} />);

    await waitFor(() => {
      expect(taskApi.getTasks).toHaveBeenCalledTimes(2);
    });
  });

  it('handles complete task API error gracefully', async () => {
    (taskApi.getTasks as any).mockResolvedValue(mockTasks);
    (taskApi.completeTask as any).mockRejectedValue({
      response: {
        data: {
          error: 'Failed to complete task',
        },
      },
    });

    render(<TaskList refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const doneButtons = screen.getAllByRole('button', { name: /done/i });
    fireEvent.click(doneButtons[0]);

    // Verify API was called
    await waitFor(() => {
      expect(taskApi.completeTask).toHaveBeenCalledWith(1);
    });

    // Task should be refetched after error (refreshes list)
    await waitFor(() => {
      expect(taskApi.getTasks).toHaveBeenCalledTimes(2);
    });
  });
});
