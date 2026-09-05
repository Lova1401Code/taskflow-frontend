import { useState } from 'react';
import { Plus, List, Columns3 } from 'lucide-react';
import { PageHeader } from '@shared/components/layout';
import { Button, Modal, Select } from '@shared/components/ui';
import { cn } from '@shared/utils';
import { useTasks } from '../hooks/useTasks';
import { useTasksStore } from '../tasks.store';
import { TaskList } from '../components/TaskList';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskForm } from '../components/TaskForm';
import { TaskFilters } from '../components/TaskFilters';
import type { Task } from '@shared/types';
import type { TaskFormData } from '../schemas/task.schema';
import { useProjects } from '@features/projects/hooks/useProjects';

type ViewMode = 'list' | 'kanban';

export function TasksPage() {
  const { tasks, isLoading, error, refetch } = useTasks({ limit: 100 });
  const { projects } = useProjects();
  const { createTask, updateTask, deleteTask } = useTasksStore();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

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

  const closeFormModal = () => {
    setIsFormOpen(false);
    setSelectedProjectId('');
  };

  const closeEditModal = () => setEditingTask(null);

  const closeDeleteModal = () => setDeletingTask(null);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Tâches"
        description="Gérez et organisez toutes vos tâches"
        action={
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-surface-200 bg-white p-1">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-surface-600 hover:bg-surface-100'
                )}
              >
                <List className="h-4 w-4" />
                Liste
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  viewMode === 'kanban' ? 'bg-brand-600 text-white' : 'text-surface-600 hover:bg-surface-100'
                )}
              >
                <Columns3 className="h-4 w-4" />
                Kanban
              </button>
            </div>
            <Button onClick={() => setIsFormOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Nouvelle tâche
            </Button>
          </div>
        }
      />

      {viewMode === 'list' && (
        <div className="mb-6">
          <TaskFilters onFilterChange={refetch} />
        </div>
      )}

      {viewMode === 'list' ? (
        <TaskList tasks={tasks} isLoading={isLoading} error={error} onRetry={refetch} />
      ) : (
        <>
          {isLoading && tasks.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-surface-100" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-300 py-20 text-center">
              <p className="text-surface-500">Aucune tâche pour le moment.</p>
              <Button className="mt-4" onClick={() => setIsFormOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
                Créer une tâche
              </Button>
            </div>
          ) : (
            <KanbanBoard
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={setDeletingTask}
            />
          )}
        </>
      )}

      <Modal isOpen={isFormOpen} onClose={closeFormModal} title="Créer une tâche">
        <div className="space-y-5">
          {!selectedProjectId ? (
            <>
              <Select
                label="Choisir un projet"
                options={projectOptions}
                placeholder="Sélectionner..."
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              />
              {projectOptions.length === 0 && (
                <p className="text-sm text-surface-500">
                  Vous devez d'abord créer un projet avant d'ajouter des tâches.
                </p>
              )}
            </>
          ) : (
            <TaskForm
              projectId={selectedProjectId}
              onSubmit={handleCreateTask}
              onCancel={closeFormModal}
              isLoading={isSubmitting}
            />
          )}
        </div>
      </Modal>

      <Modal isOpen={!!editingTask} onClose={closeEditModal} title="Modifier la tâche">
        {editingTask && (
          <TaskForm
            task={editingTask}
            projectId={editingTask.projectId}
            onSubmit={handleUpdateTask}
            onCancel={closeEditModal}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      <Modal isOpen={!!deletingTask} onClose={closeDeleteModal} title="Supprimer la tâche" size="sm">
        <div className="space-y-4">
          <p className="text-surface-600">
            Êtes-vous sûr de vouloir supprimer{' '}
            <span className="font-semibold">{deletingTask?.title}</span> ? Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={closeDeleteModal}>Annuler</Button>
            <Button variant="danger" onClick={handleDeleteTask} isLoading={isSubmitting}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}