import { Bell, Search } from 'lucide-react';
import { Avatar } from '@shared/components/ui';
import { useAuthStore } from '@features/auth/auth.store';

export function Topbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-200 bg-white/80 px-6 backdrop-blur-sm">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input
            type="search"
            placeholder="Search projects, tasks..."
            className="w-full rounded-lg border border-surface-200 bg-surface-50 py-2 pl-10 pr-4 text-sm placeholder:text-surface-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>

        <div className="flex items-center gap-3">
          <Avatar name={user?.name || 'User'} size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-surface-900">{user?.name}</p>
            <p className="text-xs text-surface-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

