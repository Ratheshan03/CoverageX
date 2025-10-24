import type { Task } from '../types/task';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => void;
}

/**
 * TaskCard Component
 * Displays a single task with title, description, and Done button
 */
const TaskCard = ({ task, onComplete }: TaskCardProps) => {
  const handleComplete = () => {
    onComplete(task.id);
  };

  return (
    <div className="task-card" data-testid="task-card">
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description}</p>
      </div>
      <button
        className="task-done-btn"
        onClick={handleComplete}
        data-testid="done-button"
        aria-label={`Mark "${task.title}" as done`}
      >
        Done
      </button>
    </div>
  );
};

export default TaskCard;
