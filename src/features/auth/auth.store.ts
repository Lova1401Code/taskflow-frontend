import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@shared/types';
import { tokenService } from '@services/token.service';
import { authApi } from './api/auth.api';
import type { LoginFormData, RegisterFormData } from './schemas/auth.schema';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCheckedAuth: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginFormData) => Promise<void>;
  register: (credentials: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasCheckedAuth: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, tokens } = await authApi.login(credentials);
          tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
          set({ user, isAuthenticated: true, isLoading: false, hasCheckedAuth: true });
        } catch (error) {
          const message = getErrorMessage(error, 'Login failed');
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { name, email, password } = credentials;
          const { user, tokens } = await authApi.register({ name, email, password });
          tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
          set({ user, isAuthenticated: true, isLoading: false, hasCheckedAuth: true });
        } catch (error) {
          const message = getErrorMessage(error, 'Registration failed');
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Continue with logout even if API call fails
        } finally {
          tokenService.clearTokens();
          set({ user: null, isAuthenticated: false, isLoading: false, hasCheckedAuth: true });
        }
      },

      checkAuth: async () => {
        if (get().isLoading) {
          return;
        }

        if (!tokenService.isAuthenticated()) {
          set({ user: null, isAuthenticated: false, isLoading: false, hasCheckedAuth: true });
          return;
        }

        const currentUser = get().user;
        if (currentUser) {
          set({ isAuthenticated: true, isLoading: false, hasCheckedAuth: true });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const user = await authApi.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false, hasCheckedAuth: true });
        } catch {
          tokenService.clearTokens();
          set({ user: null, isAuthenticated: false, isLoading: false, hasCheckedAuth: true, error: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

