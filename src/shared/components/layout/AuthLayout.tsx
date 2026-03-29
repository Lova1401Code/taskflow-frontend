import { Outlet } from 'react-router-dom';
import { APP_CONFIG } from '@shared/constants';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-surface-50">
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-600">{APP_CONFIG.name}</h1>
          <p className="mt-2 text-surface-500">Project & Task Management</p>
        </div>
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-surface-200 bg-white p-8 shadow-elevated animate-slide-up">
            <Outlet />
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-surface-400">
          © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
        </p>
      </div>
    </div>
  );
}

