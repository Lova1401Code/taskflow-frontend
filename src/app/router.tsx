import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants';

import { AuthLayout, DashboardLayout } from '@shared/components/layout';
import { ProtectedRoute } from '@features/auth/components/ProtectedRoute';

import { LoginPage, RegisterPage } from '@features/auth/pages';
import { DashboardPage } from '@features/dashboard/pages';
import { ProjectsPage, ProjectDetailsPage } from '@features/projects/pages';
import { TasksPage } from '@features/tasks/pages';
import { SettingsPage } from '@features/settings/pages';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.PROJECTS,
        element: <ProjectsPage />,
      },
      {
        path: ROUTES.PROJECT_DETAILS,
        element: <ProjectDetailsPage />,
      },
      {
        path: ROUTES.TASKS,
        element: <TasksPage />,
      },
      {
        path: ROUTES.SETTINGS,
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);

