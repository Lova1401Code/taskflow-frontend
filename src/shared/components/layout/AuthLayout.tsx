import { Outlet, useLocation } from 'react-router-dom';
import { CheckSquare, TrendingUp, Users } from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@shared/constants';
import loginIllustration from '@/assets/illustrations/undraw_to-do-list.svg';
import registerIllustration from '@/assets/illustrations/undraw_morning-plans.svg';

const features = [
  { icon: CheckSquare, title: 'Gestion des tâches', desc: 'Organisez et priorisez vos tâches en un coup d\'œil' },
  { icon: TrendingUp, title: 'Suivi de progression', desc: 'Visualisez l\'avancement de vos projets en temps réel' },
  { icon: Users, title: 'Collaboration', desc: 'Travaillez efficacement seul ou en équipe' },
];

export function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname === ROUTES.REGISTER;
  const illustration = isRegister ? registerIllustration : loginIllustration;
  const tagline = isRegister
    ? 'Nouveau départ, nouvelles habitudes'
    : 'Retrouvez vos projets où vous les aviez laissés';

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-12 lg:flex">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-brand-300 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{APP_CONFIG.name}</h1>
              <p className="text-sm text-brand-200">Project & Task Management</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <img
            src={illustration}
            alt={isRegister ? 'Morning plans illustration' : 'To-do list illustration'}
            className="w-full max-w-lg drop-shadow-2xl"
          />
          <p className="mt-6 max-w-sm text-center text-lg font-medium text-brand-100">
            {tagline}
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">{f.title}</p>
                <p className="text-sm text-brand-200">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative z-10 text-sm text-brand-200">
          © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-brand-600">{APP_CONFIG.name}</h1>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          <Outlet />
        </div>

        <p className="mt-8 text-center text-sm text-surface-400 lg:hidden">
          © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
        </p>
      </div>
    </div>
  );
}