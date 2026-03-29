import type { ReactNode } from 'react';
import { cn } from '@shared/utils';

type BadgeVariant = 'default' | 'todo' | 'in-progress' | 'done' | 'low' | 'medium' | 'high';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-100 text-surface-600',
  todo: 'bg-surface-100 text-surface-600',
  'in-progress': 'bg-warning-50 text-warning-600',
  done: 'bg-success-50 text-success-600',
  low: 'bg-surface-100 text-surface-500',
  medium: 'bg-warning-50 text-warning-600',
  high: 'bg-danger-50 text-danger-600',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

