import { useState } from 'react';
import { User, Bell, Palette, Shield } from 'lucide-react';
import { PageHeader } from '@shared/components/layout';
import { Card, CardHeader, CardContent, Input, Button } from '@shared/components/ui';
import { cn } from '@shared/utils';
import { useAuthStore } from '@features/auth/auth.store';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const user = useAuthStore((state) => state.user);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Settings" description="Manage your account settings and preferences" />

      <div className="flex flex-col gap-6 lg:flex-row">
        <nav className="w-full lg:w-64 flex-shrink-0">
          <Card className="p-2">
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-surface-600 hover:bg-surface-100'
                    )}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </nav>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader title="Profile Information" description="Update your personal details" />
              <CardContent className="space-y-4">
                <Input label="Full Name" defaultValue={user?.name || ''} />
                <Input label="Email" type="email" defaultValue={user?.email || ''} disabled />
                <div className="pt-2">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader
                title="Notification Preferences"
                description="Control how you receive notifications"
              />
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Email notifications', description: 'Receive email updates about your projects' },
                    { label: 'Task reminders', description: 'Get notified about upcoming due dates' },
                    { label: 'Project updates', description: 'Stay informed about project changes' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-surface-900">{item.label}</p>
                        <p className="text-sm text-surface-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-surface-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-surface-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardHeader title="Appearance" description="Customize the look and feel" />
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="label">Theme</label>
                    <div className="mt-2 flex gap-3">
                      {['Light', 'Dark', 'System'].map((theme) => (
                        <button
                          key={theme}
                          className={cn(
                            'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                            theme === 'Light'
                              ? 'border-brand-500 bg-brand-50 text-brand-600'
                              : 'border-surface-200 text-surface-600 hover:border-surface-300'
                          )}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader title="Security" description="Manage your password and security settings" />
              <CardContent className="space-y-4">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="••••••••" />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                <div className="pt-2">
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

