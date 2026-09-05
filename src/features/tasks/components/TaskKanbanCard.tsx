import { Draggable } from '@hello-pangea/dnd';
import { Calendar, GripVertical } from 'lucide-react';
import type { Task } from '@shared/types';
import { Badge } from '@shared/components/ui';
import { cn, formatDate } from '@shared/utils';

interface TaskKanbanCardProps {
  task: Task;
  index: number;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskKanbanCard({ task, index, onEdit, onDelete }: TaskKanbanCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onEdit?.(task)}
          className={cn(
            'group cursor-pointer rounded-lg border border-surface-200 bg-white p-3 shadow-sm transition-all hover:shadow-card',
            snapshot.isDragging && 'rotate-2 shadow-float border-brand-300'
          )}
        >
          {task.coverImage && (
            <div className="mb-2 overflow-hidden rounded-md">
              <img
                src={task.coverImage}
                alt=""
                className="h-20 w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                'text-sm font-medium text-surface-900',
                task.status === 'done' && 'line-through text-surface-400'
              )}
            >
              {task.title}
            </h4>
            <GripVertical className="h-4 w-4 flex-shrink-0 text-surface-300 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          {task.description && (
            <p className="mt-1 text-xs text-surface-500 line-clamp-2">{task.description}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
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

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              className="mt-2 text-xs text-surface-400 opacity-0 transition-opacity hover:text-danger-600 group-hover:opacity-100"
            >
              Supprimer
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
}