import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@shared/utils';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'input min-h-[100px] resize-y',
            error && 'input-error',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-danger-500">
            {error}
          </p>
        )}
        {hint && !error && <p className="mt-1.5 text-xs text-surface-500">{hint}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

