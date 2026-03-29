import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@shared/components/layout';
import { Button, Modal, Select } from '@shared/components/ui';
import { useTasks } from '../hooks/useTasks';
import { useTasksStore } from '../tasks.store';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { TaskFilters } from '../components/TaskFilters';
import type { TaskFormData } from '../schemas/task.schema';
import { useProjects } from '@features/projects/hooks/useProjects';

export function TasksPage() {
  const { tasks, isLoading, error, refetch } = useTasks();
  const { projects } = useProjects();
  const { createTask } = useTasksStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectOptions = projects.map((p) => ({ value: p.id, label: p.name }));

  const handleCreateTask = async (data: TaskFormData) => {
    if (!selectedProjectId) return;
    setIsSubmitting(true);
    try {
      await createTask({ ...data, projectId: selectedProjectId });
      setIsFormOpen(false);
      setSelectedProjectId('');
      refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Tasks"
        description="View and manage all your tasks"
        action={
          <Button onClick={() => setIsFormOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
            New Task
          </Button>
        }
      />

      <div className="mb-6">
        <TaskFilters onFilterChange={refetch} />
      </div>

      <TaskList tasks={tasks} isLoading={isLoading} error={error} onRetry={refetch} />

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProjectId('');
        }}
        title="Create Task"
      >
        <div className="space-y-5">
          {!selectedProjectId ? (
            <>
              <Select
                label="Select Project"
                options={projectOptions}
                placeholder="Choose a project..."
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              />
              {projectOptions.length === 0 && (
                <p className="text-sm text-surface-500">
                  You need to create a project first before adding tasks.
                </p>
              )}
            </>
          ) : (
            <TaskForm
              projectId={selectedProjectId}
              onSubmit={handleCreateTask}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedProjectId('');
              }}
              isLoading={isSubmitting}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}

