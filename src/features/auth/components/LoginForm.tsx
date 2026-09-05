import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, LogIn, UserRound } from 'lucide-react';
import { Button, Input } from '@shared/components/ui';
import { ROUTES } from '@shared/constants';
import { useAuthStore } from '../auth.store';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate(ROUTES.DASHBOARD);
    } catch {
      // Error is handled by the store
    }
  };

  const fillGuestCredentials = () => {
    clearError();
    setValue('email', 'guest@taskflow.com');
    setValue('password', 'guest123');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-surface-900">Bon retour 👋</h2>
        <p className="mt-2 text-surface-500">Connectez-vous à votre compte pour continuer</p>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 rounded-lg bg-danger-50 p-3.5 text-sm text-danger-600"
          role="alert"
          onClick={clearError}
        >
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-danger-500 text-xs font-bold text-white">!</div>
          {error}
        </div>
      )}

      <div className="relative">
        <Input
          label="Adresse email"
          type="email"
          placeholder="vous@exemple.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Mail className="pointer-events-none absolute right-4 top-[42px] h-4 w-4 text-surface-400" />
      </div>

      <div className="relative">
        <Input
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-4 top-[42px] text-surface-400 transition-colors hover:text-surface-600"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
        <LogIn className="h-4 w-4" />
        Se connecter
      </Button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-surface-400">ou</span>
        </div>
      </div>

      <button
        type="button"
        onClick={fillGuestCredentials}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700 transition-all hover:bg-brand-100 hover:border-brand-300"
      >
        <UserRound className="h-4 w-4" />
        Essayer en tant qu'invité
      </button>

      <p className="text-center text-sm text-surface-500">
        Pas encore de compte ?{' '}
        <Link to={ROUTES.REGISTER} className="font-semibold text-brand-600 hover:text-brand-700">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}