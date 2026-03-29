import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, TextArea, Select } from '@shared/components/ui';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '@shared/constants';
import { taskSchema, type TaskFormData } from '../schemas/task.schema';
import type { Task } from '@shared/types';

interface TaskFormProps {
  task?: Task;
  projectId: string;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusOptions = Object.entries(TASK_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const priorityOptions = Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function TaskForm({ task, projectId, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate || null,
      projectId: task?.projectId || projectId,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Task Title"
        placeholder="Enter task title"
        error={errors.title?.message}
        {...register('title')}
      />

      <TextArea
        label="Description"
        placeholder="What needs to be done?"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />

        <Select
          label="Priority"
          options={priorityOptions}
          error={errors.priority?.message}
          {...register('priority')}
        />
      </div>

      <Input
        label="Due Date"
        type="date"
        error={errors.dueDate?.message}
        {...register('dueDate')}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}

