import { httpClient } from '@services/httpClient';
import { API_ENDPOINTS } from '@shared/constants';
import type { User, ApiResponse, AuthTokens, LoginCredentials, RegisterCredentials } from '@shared/types';

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await httpClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data.data;
  },

  register: async (credentials: Omit<RegisterCredentials, 'confirmPassword'>): Promise<AuthResponse> => {
    const response = await httpClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials
    );
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await httpClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
    return response.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await httpClient.post<ApiResponse<{ accessToken: string }>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    return response.data.data;
  },
};

