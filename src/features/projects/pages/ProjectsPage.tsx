import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@shared/components/layout';
import { Button, Modal } from '@shared/components/ui';
import type { Project } from '@shared/types';
import { useProjects } from '../hooks/useProjects';
import { useProjectsStore } from '../projects.store';
import { ProjectList } from '../components/ProjectList';
import { ProjectForm } from '../components/ProjectForm';
import type { ProjectFormData } from '../schemas/project.schema';

export function ProjectsPage() {
  const { projects, isLoading, error, refetch } = useProjects();
  const { createProject, updateProject, deleteProject } = useProjectsStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProject = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      await createProject(data);
      setIsFormOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = async (data: ProjectFormData) => {
    if (!editingProject) return;
    setIsSubmitting(true);
    try {
      await updateProject(editingProject.id, data);
      setEditingProject(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deletingProject) return;
    setIsSubmitting(true);
    try {
      await deleteProject(deletingProject.id);
      setDeletingProject(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Projects"
        description="Manage and organize your projects"
        action={
          <Button onClick={() => setIsFormOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
            New Project
          </Button>
        }
      />

      <ProjectList
        projects={projects}
        isLoading={isLoading}
        error={error}
        onCreateNew={() => setIsFormOpen(true)}
        onEdit={setEditingProject}
        onDelete={setDeletingProject}
        onRetry={refetch}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Create Project"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title="Edit Project"
      >
        {editingProject && (
          <ProjectForm
            project={editingProject}
            onSubmit={handleUpdateProject}
            onCancel={() => setEditingProject(null)}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        title="Delete Project"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-surface-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{deletingProject?.name}</span>? This action
            cannot be undone and all tasks in this project will be deleted.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeletingProject(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteProject}
              isLoading={isSubmitting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

