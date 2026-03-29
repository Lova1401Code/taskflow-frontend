import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG, API_ENDPOINTS } from '@shared/constants';
import { tokenService } from './token.service';
import type { ApiError } from '@shared/types';

const httpClient: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const AUTH_EXCLUDED_ENDPOINTS = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REGISTER,
  API_ENDPOINTS.AUTH.REFRESH,
];

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!originalRequest) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Network error',
        errors: error.response?.data?.errors,
        statusCode: error.response?.status || 500,
      };
      return Promise.reject(apiError);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      const requestUrl = originalRequest.url || '';
      const shouldSkipRefresh = AUTH_EXCLUDED_ENDPOINTS.some((endpoint) =>
        requestUrl.includes(endpoint)
      );

      if (shouldSkipRefresh) {
        tokenService.clearTokens();
        const apiError: ApiError = {
          message: error.response?.data?.message || 'Unauthorized',
          errors: error.response?.data?.errors,
          statusCode: 401,
        };
        return Promise.reject(apiError);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenService.getRefreshToken();

      if (!refreshToken) {
        tokenService.clearTokens();
        const apiError: ApiError = {
          message: 'Session expired. Please log in again.',
          errors: error.response?.data?.errors,
          statusCode: 401,
        };
        return Promise.reject(apiError);
      }

      try {
        const response = await axios.post(
          `${APP_CONFIG.apiBaseUrl}${API_ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken }
        );

        const { accessToken } = response.data.data;
        tokenService.setAccessToken(accessToken);
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenService.clearTokens();
        const apiError: ApiError = {
          message: 'Session expired. Please log in again.',
          errors: undefined,
          statusCode: 401,
        };
        return Promise.reject(apiError);
      } finally {
        isRefreshing = false;
      }
    }

    const apiError: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors,
      statusCode: error.response?.status || 500,
    };

    return Promise.reject(apiError);
  }
);

export { httpClient };

