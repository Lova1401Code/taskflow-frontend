import { Droppable } from '@hello-pangea/dnd';
import type { Task, TaskStatus } from '@shared/types';
import { cn } from '@shared/utils';
import { TASK_STATUS_LABELS } from '@shared/constants';
import { TaskKanbanCard } from './TaskKanbanCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const columnStyles: Record<TaskStatus, { header: string; bg: string; count: string }> = {
  'todo': { header: 'text-surface-700', bg: 'bg-surface-50', count: 'bg-surface-200 text-surface-700' },
  'in-progress': { header: 'text-warning-600', bg: 'bg-warning-50/50', count: 'bg-warning-100 text-warning-700' },
  'done': { header: 'text-success-600', bg: 'bg-success-50/50', count: 'bg-success-100 text-success-700' },
};

export function KanbanColumn({ status, tasks, onEdit, onDelete }: KanbanColumnProps) {
  const style = columnStyles[status];

  return (
    <div className={cn('flex min-h-[200px] w-full flex-col rounded-xl border border-surface-200', style.bg)}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className={cn('text-sm font-semibold', style.header)}>
            {TASK_STATUS_LABELS[status]}
          </h3>
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', style.count)}>
            {tasks.length}
          </span>
        </div>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 space-y-2 px-2 pb-3 transition-colors',
              snapshot.isDraggingOver && 'bg-brand-50/50'
            )}
          >
            {tasks.map((task, index) => (
              <TaskKanbanCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}