import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth.store';
import { ROUTES } from '@shared/constants';

export function useAuth() {
  const { user, isAuthenticated, isLoading, hasCheckedAuth, error, checkAuth, clearError } =
    useAuthStore();

  useEffect(() => {
    if (!hasCheckedAuth) {
      void checkAuth();
    }
  }, [checkAuth, hasCheckedAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    clearError,
  };
}

export function useRequireAuth() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, hasCheckedAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    if (!hasCheckedAuth) {
      void checkAuth();
    }
  }, [checkAuth, hasCheckedAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
}

export function useRedirectAuthenticated(redirectTo: string = ROUTES.DASHBOARD) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, hasCheckedAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    if (!hasCheckedAuth) {
      void checkAuth();
    }
  }, [checkAuth, hasCheckedAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);
}

