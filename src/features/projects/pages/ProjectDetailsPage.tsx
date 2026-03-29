import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@shared/components/layout';
import { Button, Badge } from '@shared/components/ui';
import { PageLoader, ErrorState } from '@shared/components/feedback';
import { ROUTES } from '@shared/constants';
import { useProject } from '../hooks/useProjects';
import { TaskList } from '@features/tasks/components/TaskList';
import { TaskForm } from '@features/tasks/components/TaskForm';
import { Modal } from '@shared/components/ui';
import { useTasks } from '@features/tasks/hooks/useTasks';
import { useTasksStore } from '@features/tasks/tasks.store';
import type { TaskFormData } from '@features/tasks/schemas/task.schema';

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { project, isLoading, error } = useProject(id);
  const { tasks, isLoading: tasksLoading, error: tasksError, refetch } = useTasks({ projectId: id });
  const { createTask } = useTasksStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTask = async (data: TaskFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await createTask({ ...data, projectId: id });
      setIsFormOpen(false);
      refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !project) {
    return <ErrorState message={error || 'Project not found'} />;
  }

  const progress =
    project.tasksCount > 0
      ? Math.round((project.completedTasksCount / project.tasksCount) * 100)
      : 0;

  return (
    <div className="animate-fade-in">
      <Link
        to={ROUTES.PROJECTS}
        className="mb-4 inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <PageHeader
        title={project.name}
        description={project.description}
        action={
          <Button onClick={() => setIsFormOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
            Add Task
          </Button>
        }
      />

      <div className="mb-8 rounded-xl border border-surface-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <span className="text-sm font-medium text-surface-700">Project Color</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default">{project.tasksCount} Tasks</Badge>
            <Badge variant="done">{project.completedTasksCount} Completed</Badge>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-500">Progress</span>
              <span className="font-medium" style={{ color: project.color }}>
                {progress}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-100">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: project.color }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-surface-900">Tasks</h2>
      </div>

      <TaskList
        tasks={tasks}
        isLoading={tasksLoading}
        error={tasksError}
        onRetry={refetch}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Task"
      >
        <TaskForm
          projectId={id!}
          onSubmit={handleCreateTask}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}

