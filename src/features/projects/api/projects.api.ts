import { httpClient } from '@services/httpClient';
import { API_ENDPOINTS } from '@shared/constants';
import type { Project, ApiResponse, PaginatedResponse } from '@shared/types';
import type { ProjectFormData } from '../schemas/project.schema';

export interface ProjectsFilter {
  page?: number;
  limit?: number;
  search?: string;
}

export const projectsApi = {
  getAll: async (filters?: ProjectsFilter): Promise<PaginatedResponse<Project>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.search) params.append('search', filters.search);

    const response = await httpClient.get<PaginatedResponse<Project>>(
      `${API_ENDPOINTS.PROJECTS.BASE}?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await httpClient.get<ApiResponse<Project>>(
      API_ENDPOINTS.PROJECTS.BY_ID(id)
    );
    return response.data.data;
  },

  create: async (data: ProjectFormData): Promise<Project> => {
    const response = await httpClient.post<ApiResponse<Project>>(
      API_ENDPOINTS.PROJECTS.BASE,
      data
    );
    return response.data.data;
  },

  update: async (id: string, data: Partial<ProjectFormData>): Promise<Project> => {
    const response = await httpClient.patch<ApiResponse<Project>>(
      API_ENDPOINTS.PROJECTS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(API_ENDPOINTS.PROJECTS.BY_ID(id));
  },
};

