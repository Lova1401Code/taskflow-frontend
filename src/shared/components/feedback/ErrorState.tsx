import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@shared/components/ui';
import { cn } from '@shared/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-danger-50 p-4 text-danger-500">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-medium text-surface-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-surface-500">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-4 w-4" />}
          className="mt-4"
        >
          Try again
        </Button>
      )}
    </div>
  );
}

