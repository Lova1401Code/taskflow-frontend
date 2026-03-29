import { useEffect, useCallback, useMemo } from 'react';
import { useTasksStore } from '../tasks.store';
import type { TasksFilter } from '../api/tasks.api';

export function useTasks(filters?: TasksFilter) {
  const { tasks, isLoading, error, meta, statusFilter, fetchTasks, fetchTasksByProject } =
    useTasksStore();
  const normalizedFilters = useMemo(
    () =>
      filters
        ? {
            page: filters.page,
            limit: filters.limit,
            status: filters.status,
            projectId: filters.projectId,
            search: filters.search,
          }
        : undefined,
    [filters?.page, filters?.limit, filters?.status, filters?.projectId, filters?.search]
  );

  const refetch = useCallback(() => {
    const appliedFilters = {
      ...normalizedFilters,
      status: statusFilter || normalizedFilters?.status,
    };

    if (normalizedFilters?.projectId) {
      fetchTasksByProject(normalizedFilters.projectId, appliedFilters);
    } else {
      fetchTasks(appliedFilters);
    }
  }, [fetchTasks, fetchTasksByProject, normalizedFilters, statusFilter]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    tasks,
    isLoading,
    error,
    meta,
    refetch,
  };
}

export function useTask(id: string | undefined) {
  const { currentTask, isLoading, error, fetchTask, clearCurrentTask } = useTasksStore();

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }

    return () => {
      clearCurrentTask();
    };
  }, [id, fetchTask, clearCurrentTask]);

  return {
    task: currentTask,
    isLoading,
    error,
  };
}

