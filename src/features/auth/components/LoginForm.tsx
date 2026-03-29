import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button, Input } from '@shared/components/ui';
import { ROUTES } from '@shared/constants';
import { useAuthStore } from '../auth.store';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-surface-900">Welcome back</h2>
        <p className="mt-1 text-surface-500">Sign in to your account</p>
      </div>

      {error && (
        <div
          className="rounded-lg bg-danger-50 p-4 text-sm text-danger-600"
          role="alert"
          onClick={clearError}
        >
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        <Mail className="h-4 w-4" />
        Sign In
      </Button>

      <p className="text-center text-sm text-surface-500">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-brand-600 hover:text-brand-700">
          Sign up
        </Link>
      </p>
    </form>
  );
}

