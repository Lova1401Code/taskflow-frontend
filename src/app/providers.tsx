import { type ReactNode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

interface AppProvidersProps {
  children?: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      <RouterProvider router={router} />
      {children}
    </>
  );
}

