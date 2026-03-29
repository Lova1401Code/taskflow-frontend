import { Link } from 'react-router-dom';
import { FolderKanban, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '@shared/types';
import { Card } from '@shared/components/ui';
import { formatRelativeDate } from '@shared/utils';
import { ROUTES } from '@shared/constants';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const progress =
    project.tasksCount > 0
      ? Math.round((project.completedTasksCount / project.tasksCount) * 100)
      : 0;

  return (
    <Card hoverable className="group relative">
      <div className="absolute right-4 top-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-lg p-1.5 text-surface-400 opacity-0 transition-all hover:bg-surface-100 hover:text-surface-600 group-hover:opacity-100"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-surface-200 bg-white py-1 shadow-float">
              <button
                onClick={() => {
                  onEdit?.(project);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-surface-600 hover:bg-surface-50"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete?.(project);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      <Link to={ROUTES.PROJECT_DETAILS.replace(':id', project.id)}>
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${project.color}20` }}
          >
            <FolderKanban className="h-6 w-6" style={{ color: project.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-surface-900 truncate">{project.name}</h3>
            <p className="mt-1 text-sm text-surface-500 line-clamp-2">
              {project.description || 'No description'}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-500">
              {project.completedTasksCount}/{project.tasksCount} tasks
            </span>
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

        <p className="mt-4 text-xs text-surface-400">
          Updated {formatRelativeDate(project.updatedAt)}
        </p>
      </Link>
    </Card>
  );
}

