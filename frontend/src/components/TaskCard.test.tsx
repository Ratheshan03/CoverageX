import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';
import type { Task } from '../types/task';

describe('TaskCard', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'This is a test task description',
    completed: false,
    created_at: '2025-10-24T10:00:00.000Z',
    updated_at: '2025-10-24T10:00:00.000Z',
  };

  it('renders task title and description', () => {
    const mockOnComplete = vi.fn();

    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task description')).toBeInTheDocument();
  });

  it('renders Done button', () => {
    const mockOnComplete = vi.fn();

    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

    const doneButton = screen.getByRole('button', { name: /done/i });
    expect(doneButton).toBeInTheDocument();
  });

  it('calls onComplete when Done button is clicked', () => {
    const mockOnComplete = vi.fn();

    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
    expect(mockOnComplete).toHaveBeenCalledWith(1);
  });

  it('has proper aria-label on Done button', () => {
    const mockOnComplete = vi.fn();

    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

    const doneButton = screen.getByTestId('done-button');
    expect(doneButton).toHaveAttribute('aria-label', 'Mark "Test Task" as done');
  });
});
