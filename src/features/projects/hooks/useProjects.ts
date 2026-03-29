import { useEffect, useCallback, useMemo } from 'react';
import { useProjectsStore } from '../projects.store';
import type { ProjectsFilter } from '../api/projects.api';

export function useProjects(filters?: ProjectsFilter) {
  const { projects, isLoading, error, meta, fetchProjects } = useProjectsStore();
  const normalizedFilters = useMemo(
    () =>
      filters
        ? {
            page: filters.page,
            limit: filters.limit,
            search: filters.search,
          }
        : undefined,
    [filters?.page, filters?.limit, filters?.search]
  );

  const refetch = useCallback(() => {
    fetchProjects(normalizedFilters);
  }, [fetchProjects, normalizedFilters]);

  useEffect(() => {
    fetchProjects(normalizedFilters);
  }, [fetchProjects, normalizedFilters]);

  return {
    projects,
    isLoading,
    error,
    meta,
    refetch,
  };
}

export function useProject(id: string | undefined) {
  const { currentProject, isLoading, error, fetchProject, clearCurrentProject } =
    useProjectsStore();

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }

    return () => {
      clearCurrentProject();
    };
  }, [id, fetchProject, clearCurrentProject]);

  return {
    project: currentProject,
    isLoading,
    error,
  };
}

