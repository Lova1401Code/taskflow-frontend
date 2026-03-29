import { create } from 'zustand';
import type { Project } from '@shared/types';
import { projectsApi, type ProjectsFilter } from './api/projects.api';
import type { ProjectFormData } from './schemas/project.schema';

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ProjectsActions {
  fetchProjects: (filters?: ProjectsFilter) => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (data: ProjectFormData) => Promise<Project>;
  updateProject: (id: string, data: Partial<ProjectFormData>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  clearCurrentProject: () => void;
  clearError: () => void;
}

type ProjectsStore = ProjectsState & ProjectsActions;

export const useProjectsStore = create<ProjectsStore>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },

  fetchProjects: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectsApi.getAll(filters);
      set({
        projects: response.data,
        meta: response.meta,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch projects';
      set({ error: message, isLoading: false });
    }
  },

  fetchProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectsApi.getById(id);
      set({ currentProject: project, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch project';
      set({ error: message, isLoading: false });
    }
  },

  createProject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectsApi.create(data);
      set((state) => ({
        projects: [project, ...state.projects],
        isLoading: false,
      }));
      return project;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create project';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateProject: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await projectsApi.update(id, data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
        currentProject: state.currentProject?.id === id ? updatedProject : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update project';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await projectsApi.delete(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete project';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearCurrentProject: () => set({ currentProject: null }),
  clearError: () => set({ error: null }),
}));

