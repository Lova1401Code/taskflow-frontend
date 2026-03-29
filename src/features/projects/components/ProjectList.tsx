import { FolderPlus } from 'lucide-react';
import type { Project } from '@shared/types';
import { EmptyState, ErrorState, CardSkeleton } from '@shared/components/feedback';
import { Button } from '@shared/components/ui';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  onCreateNew: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onRetry: () => void;
}

export function ProjectList({
  projects,
  isLoading,
  error,
  onCreateNew,
  onEdit,
  onDelete,
  onRetry,
}: ProjectListProps) {
  if (isLoading && projects.length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderPlus className="h-8 w-8" />}
        title="No projects yet"
        description="Create your first project to start organizing your tasks."
        action={
          <Button onClick={onCreateNew} leftIcon={<FolderPlus className="h-4 w-4" />}>
            Create Project
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

