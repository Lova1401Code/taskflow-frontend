import { useState } from 'react';
import {
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import type { Task, TaskStatus } from '@shared/types';
import { Badge } from '@shared/components/ui';
import { cn, formatDate } from '@shared/utils';
import { TASK_STATUS_LABELS, TASK_STATUS } from '@shared/constants';
import { useTasksStore } from '../tasks.store';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: TASK_STATUS.TODO, label: TASK_STATUS_LABELS.todo },
  { value: TASK_STATUS.IN_PROGRESS, label: TASK_STATUS_LABELS['in-progress'] },
  { value: TASK_STATUS.DONE, label: TASK_STATUS_LABELS.done },
];

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const { updateTaskStatus } = useTasksStore();

  const handleStatusChange = async (status: TaskStatus) => {
    await updateTaskStatus(task.id, status);
    setShowStatusMenu(false);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-surface-200 bg-white transition-shadow hover:shadow-card">
      {task.coverImage && (
        <div className="h-28 w-full overflow-hidden">
          <img
            src={task.coverImage}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
      <div className="flex items-start gap-4 p-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              'font-medium text-surface-900',
              task.status === 'done' && 'line-through text-surface-400'
            )}
          >
            {task.title}
          </h3>

          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
              >
                <ChevronDown className="h-4 w-4" />
              </button>

              {showStatusMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowStatusMenu(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-surface-200 bg-white py-1 shadow-float">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={cn(
                          'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-surface-50',
                          task.status === option.value
                            ? 'bg-surface-50 font-medium'
                            : 'text-surface-600'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-lg p-1.5 text-surface-400 opacity-0 transition-all hover:bg-surface-100 hover:text-surface-600 group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-surface-200 bg-white py-1 shadow-float">
                  <button
                    onClick={() => {
                      onEdit?.(task);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-surface-600 hover:bg-surface-50"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(task);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {task.description && (
          <p className="mt-1 text-sm text-surface-500 line-clamp-2">{task.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant={task.status as 'todo' | 'in-progress' | 'done'}>
            {TASK_STATUS_LABELS[task.status]}
          </Badge>
          <Badge variant={task.priority as 'low' | 'medium' | 'high'}>
            {task.priority}
          </Badge>
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-surface-500">
              <Calendar className="h-3 w-3" />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

