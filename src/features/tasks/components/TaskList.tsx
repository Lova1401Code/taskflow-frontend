import { useState } from 'react';
import { ListTodo } from 'lucide-react';
import type { Task } from '@shared/types';
import { EmptyState, ErrorState, TableRowSkeleton } from '@shared/components/feedback';
import { Modal, Button } from '@shared/components/ui';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { useTasksStore } from '../tasks.store';
import type { TaskFormData } from '../schemas/task.schema';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function TaskList({ tasks, isLoading, error, onRetry }: TaskListProps) {
  const { updateTask, deleteTask } = useTasksStore();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    setIsSubmitting(true);
    try {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    setIsSubmitting(true);
    try {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRowSkeleton key={i} columns={4} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<ListTodo className="h-8 w-8" />}
        title="No tasks yet"
        description="Create your first task to get started."
      />
    );
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={setEditingTask}
            onDelete={setDeletingTask}
          />
        ))}
      </div>

      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            task={editingTask}
            projectId={editingTask.projectId}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-surface-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{deletingTask?.title}</span>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeletingTask(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteTask}
              isLoading={isSubmitting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

