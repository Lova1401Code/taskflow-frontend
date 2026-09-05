import { create } from 'zustand';
import type { Task, TaskStatus } from '@shared/types';
import { tasksApi, type TasksFilter } from './api/tasks.api';
import type { TaskFormData } from './schemas/task.schema';

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  statusFilter: TaskStatus | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface TasksActions {
  fetchTasks: (filters?: TasksFilter) => Promise<void>;
  fetchTasksByProject: (projectId: string, filters?: Omit<TasksFilter, 'projectId'>) => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createTask: (data: TaskFormData & { projectId: string }) => Promise<Task>;
  updateTask: (id: string, data: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  updateTaskStatusOptimistic: (id: string, status: TaskStatus) => void;
  setStatusFilter: (status: TaskStatus | null) => void;
  clearCurrentTask: () => void;
  clearError: () => void;
}

type TasksStore = TasksState & TasksActions;

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  statusFilter: null,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },

  fetchTasks: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tasksApi.getAll(filters);
      set({
        tasks: response.data,
        meta: response.meta,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
      set({ error: message, isLoading: false });
    }
  },

  fetchTasksByProject: async (projectId, filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tasksApi.getByProject(projectId, filters);
      set({
        tasks: response.data,
        meta: response.meta,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
      set({ error: message, isLoading: false });
    }
  },

  fetchTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const task = await tasksApi.getById(id);
      set({ currentTask: task, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch task';
      set({ error: message, isLoading: false });
    }
  },

  createTask: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const task = await tasksApi.create(data);
      set((state) => ({
        tasks: [task, ...state.tasks],
        isLoading: false,
      }));
      return task;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create task';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateTask: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await tasksApi.update(id, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        currentTask: state.currentTask?.id === id ? updatedTask : state.currentTask,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update task';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await tasksApi.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        currentTask: state.currentTask?.id === id ? null : state.currentTask,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete task';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateTaskStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await tasksApi.updateStatus(id, status);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        currentTask: state.currentTask?.id === id ? updatedTask : state.currentTask,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update task status';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  setStatusFilter: (status) => set({ statusFilter: status }),

  updateTaskStatusOptimistic: (id, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    }));
  },

  clearCurrentTask: () => set({ currentTask: null }),
  clearError: () => set({ error: null }),
}));

