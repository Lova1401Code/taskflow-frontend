import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG, API_ENDPOINTS } from '@shared/constants';
import { tokenService } from './token.service';
import type { ApiError } from '@shared/types';

interface ServerStatusCallbacks {
  onWarn: () => void;
  onRetry: (attempt: number, max: number) => void;
  onError: () => void;
  onRequestStart: () => void;
  onRequestEnd: () => void;
}

let serverStatusCallbacks: ServerStatusCallbacks | null = null;

export function configureServerStatusCallbacks(callbacks: ServerStatusCallbacks): void {
  serverStatusCallbacks = callbacks;
}

const WARN_AFTER = 3000;
const MAX_RETRIES = 2;
const RETRY_DELAYS = [2000, 5000];

const httpClient: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
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
    if (serverStatusCallbacks) {
      serverStatusCallbacks.onRequestStart();
      const warnTimer = setTimeout(() => serverStatusCallbacks?.onWarn(), WARN_AFTER);
      (config as InternalAxiosRequestConfig & { _warnTimer?: ReturnType<typeof setTimeout> })._warnTimer = warnTimer;
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
  (response) => {
    const config = response.config as InternalAxiosRequestConfig & { _warnTimer?: ReturnType<typeof setTimeout> };
    if (config._warnTimer) clearTimeout(config._warnTimer);
    if (serverStatusCallbacks) serverStatusCallbacks.onRequestEnd();
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
      _warnTimer?: ReturnType<typeof setTimeout>;
    }) | undefined;

    if (originalRequest?._warnTimer) clearTimeout(originalRequest._warnTimer);

    if (!originalRequest) {
      if (serverStatusCallbacks) serverStatusCallbacks.onError();
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Network error',
        errors: error.response?.data?.errors,
        statusCode: error.response?.status || 500,
      };
      return Promise.reject(apiError);
    }

    const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
    const isNetworkError = !error.response && (error.code === 'ERR_NETWORK' || error.message?.includes('Network'));
    const shouldRetry = (isTimeout || isNetworkError) && !originalRequest._retry;
    const retryCount = originalRequest._retryCount || 0;

    if (shouldRetry && retryCount < MAX_RETRIES) {
      originalRequest._retryCount = retryCount + 1;
      if (serverStatusCallbacks) serverStatusCallbacks.onRetry(retryCount + 1, MAX_RETRIES);
      await new Promise((r) => setTimeout(r, RETRY_DELAYS[retryCount] || 5000));
      return httpClient(originalRequest);
    }

    if ((isTimeout || isNetworkError) && retryCount >= MAX_RETRIES) {
      if (serverStatusCallbacks) serverStatusCallbacks.onError();
    }

    if (serverStatusCallbacks) serverStatusCallbacks.onRequestEnd();

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

