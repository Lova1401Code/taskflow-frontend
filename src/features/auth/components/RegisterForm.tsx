import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button, Input } from '@shared/components/ui';
import { ROUTES } from '@shared/constants';
import { useAuthStore } from '../auth.store';
import { registerSchema, type RegisterFormData } from '../schemas/auth.schema';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();

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
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-surface-900">Create account</h2>
        <p className="mt-1 text-surface-500">Start managing your projects today</p>
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
        label="Full Name"
        type="text"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name')}
      />

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
        hint="Must be at least 8 characters with uppercase, lowercase, and number"
        {...register('password')}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        <UserPlus className="h-4 w-4" />
        Create Account
      </Button>

      <p className="text-center text-sm text-surface-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </form>
  );
}

