import { httpClient } from '@services/httpClient';
import { API_ENDPOINTS } from '@shared/constants';
import type { Task, ApiResponse, PaginatedResponse, TaskStatus } from '@shared/types';
import type { TaskFormData } from '../schemas/task.schema';

export interface TasksFilter {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  projectId?: string;
  search?: string;
}

export const tasksApi = {
  getAll: async (filters?: TasksFilter): Promise<PaginatedResponse<Task>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.status) params.append('status', filters.status);
    if (filters?.projectId) params.append('projectId', filters.projectId);
    if (filters?.search) params.append('search', filters.search);

    const response = await httpClient.get<PaginatedResponse<Task>>(
      `${API_ENDPOINTS.TASKS.BASE}?${params.toString()}`
    );
    return response.data;
  },

  getByProject: async (
    projectId: string,
    filters?: Omit<TasksFilter, 'projectId'>
  ): Promise<PaginatedResponse<Task>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.status) params.append('status', filters.status);

    const response = await httpClient.get<PaginatedResponse<Task>>(
      `${API_ENDPOINTS.TASKS.BY_PROJECT(projectId)}?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await httpClient.get<ApiResponse<Task>>(API_ENDPOINTS.TASKS.BY_ID(id));
    return response.data.data;
  },

  create: async (data: TaskFormData & { projectId: string }): Promise<Task> => {
    const response = await httpClient.post<ApiResponse<Task>>(API_ENDPOINTS.TASKS.BASE, data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<TaskFormData>): Promise<Task> => {
    const response = await httpClient.patch<ApiResponse<Task>>(
      API_ENDPOINTS.TASKS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.TASKS.BY_ID(id));
  },

  updateStatus: async (id: string, status: TaskStatus): Promise<Task> => {
    const response = await httpClient.patch<ApiResponse<Task>>(
      API_ENDPOINTS.TASKS.BY_ID(id),
      { status }
    );
    return response.data.data;
  },
};

