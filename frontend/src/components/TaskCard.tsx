import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => void;
}

/**
 * TaskCard Component
 * Displays a single task with modern glassmorphism card design
 */
const TaskCard = ({ task, onComplete }: TaskCardProps) => {
  const handleComplete = () => {
    onComplete(task.id);
  };

  return (
    <div
      className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200"
      data-testid="task-card"
    >
      <div className="relative flex items-start justify-between gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            {/* Checkbox Icon */}
            <div className="mt-1 w-5 h-5 flex-shrink-0 rounded border-2 border-gray-500 group-hover:border-orange-500 transition-colors" />

            {/* Title */}
            <h3 className="text-base font-semibold text-white leading-snug break-words">
              {task.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed ml-8 break-words line-clamp-2">
            {task.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-2 mt-2.5 ml-8 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={handleComplete}
          data-testid="done-button"
          aria-label={`Mark "${task.title}" as done`}
          className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-r from-orange-500/15 to-orange-600/15 hover:from-orange-500/25 hover:to-orange-600/25 border border-orange-500/30 hover:border-orange-500/50 text-orange-400 hover:text-orange-300 rounded-lg text-sm font-medium transition-all duration-200"
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Done
          </span>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
