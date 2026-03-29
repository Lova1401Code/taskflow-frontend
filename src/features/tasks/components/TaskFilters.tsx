import type { TaskStatus } from '@shared/types';
import { cn } from '@shared/utils';
import { TASK_STATUS, TASK_STATUS_LABELS } from '@shared/constants';
import { useTasksStore } from '../tasks.store';

const statusFilters: { value: TaskStatus | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: TASK_STATUS.TODO, label: TASK_STATUS_LABELS.todo },
  { value: TASK_STATUS.IN_PROGRESS, label: TASK_STATUS_LABELS['in-progress'] },
  { value: TASK_STATUS.DONE, label: TASK_STATUS_LABELS.done },
];

interface TaskFiltersProps {
  onFilterChange?: () => void;
}

export function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const { statusFilter, setStatusFilter } = useTasksStore();

  const handleFilterChange = (status: TaskStatus | null) => {
    setStatusFilter(status);
    onFilterChange?.();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statusFilters.map((filter) => (
        <button
          key={filter.value ?? 'all'}
          onClick={() => handleFilterChange(filter.value)}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            statusFilter === filter.value
              ? 'bg-brand-600 text-white'
              : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

