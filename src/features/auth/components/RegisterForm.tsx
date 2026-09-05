import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button, Input } from '@shared/components/ui';
import { ROUTES } from '@shared/constants';
import { useAuthStore } from '../auth.store';
import { registerSchema, type RegisterFormData } from '../schemas/auth.schema';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      navigate(ROUTES.DASHBOARD);
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-surface-900">Créer un compte ✨</h2>
        <p className="mt-2 text-surface-500">Commencez à gérer vos projets dès aujourd'hui</p>
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

      <Input
        label="Nom complet"
        type="text"
        placeholder="Jean Dupont"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Adresse email"
        type="email"
        placeholder="vous@exemple.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="relative">
        <Input
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          hint="8 caractères min. avec majuscule, minuscule et chiffre"
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

      <div className="relative">
        <Input
          label="Confirmer le mot de passe"
          type={showConfirm ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <button
          type="button"
          onClick={() => setShowConfirm((s) => !s)}
          className="absolute right-4 top-[42px] text-surface-400 transition-colors hover:text-surface-600"
          tabIndex={-1}
        >
          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
        <UserPlus className="h-4 w-4" />
        Créer mon compte
      </Button>

      <p className="text-center text-sm text-surface-500">
        Déjà un compte ?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:text-brand-700">
          Se connecter
        </Link>
      </p>
    </form>
  );
}