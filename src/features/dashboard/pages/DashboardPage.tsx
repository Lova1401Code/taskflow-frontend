import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { PageHeader } from '@shared/components/layout';
import { Card, CardHeader, CardContent, Button, Badge } from '@shared/components/ui';
import { ROUTES, TASK_STATUS_LABELS } from '@shared/constants';
import { formatRelativeDate } from '@shared/utils';
import { useProjects } from '@features/projects/hooks/useProjects';
import { useTasks } from '@features/tasks/hooks/useTasks';
import { useAuthStore } from '@features/auth/auth.store';

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { projects, isLoading: projectsLoading } = useProjects({ limit: 4 });
  const { tasks, isLoading: tasksLoading } = useTasks({ limit: 5 });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: FolderKanban,
      color: 'text-brand-600 bg-brand-50',
    },
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: CheckSquare,
      color: 'text-success-600 bg-success-50',
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      color: 'text-warning-600 bg-warning-50',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: TrendingUp,
      color: 'text-brand-600 bg-brand-50',
    },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`${greeting()}, ${user?.name?.split(' ')[0] || 'there'}!`}
        description="Here's what's happening with your projects today."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-surface-500">{stat.label}</p>
                <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-5">
              <stat.icon className="h-24 w-24" />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Recent Projects"
            action={
              <Link
                to={ROUTES.PROJECTS}
                className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="shimmer h-16 rounded-lg" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="py-8 text-center">
                <FolderKanban className="mx-auto h-12 w-12 text-surface-300" />
                <p className="mt-2 text-surface-500">No projects yet</p>
                <Link to={ROUTES.PROJECTS}>
                  <Button size="sm" className="mt-4" leftIcon={<Plus className="h-4 w-4" />}>
                    Create Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => {
                  const progress =
                    project.tasksCount > 0
                      ? Math.round((project.completedTasksCount / project.tasksCount) * 100)
                      : 0;

                  return (
                    <Link
                      key={project.id}
                      to={ROUTES.PROJECT_DETAILS.replace(':id', project.id)}
                      className="flex items-center gap-4 rounded-lg border border-surface-100 p-4 transition-colors hover:bg-surface-50"
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${project.color}20` }}
                      >
                        <FolderKanban className="h-5 w-5" style={{ color: project.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-surface-900 truncate">
                          {project.name}
                        </h4>
                        <p className="text-sm text-surface-500">
                          {project.completedTasksCount}/{project.tasksCount} tasks completed
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className="text-sm font-medium"
                          style={{ color: project.color }}
                        >
                          {progress}%
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Recent Tasks"
            action={
              <Link
                to={ROUTES.TASKS}
                className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <CardContent>
            {tasksLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="shimmer h-14 rounded-lg" />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-8 text-center">
                <CheckSquare className="mx-auto h-12 w-12 text-surface-300" />
                <p className="mt-2 text-surface-500">No tasks yet</p>
                <Link to={ROUTES.TASKS}>
                  <Button size="sm" className="mt-4" leftIcon={<Plus className="h-4 w-4" />}>
                    Create Task
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 rounded-lg border border-surface-100 p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-surface-900 truncate">{task.title}</h4>
                      <p className="text-sm text-surface-500">
                        {formatRelativeDate(task.createdAt)}
                      </p>
                    </div>
                    <Badge variant={task.status as 'todo' | 'in-progress' | 'done'}>
                      {TASK_STATUS_LABELS[task.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

