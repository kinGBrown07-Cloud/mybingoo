import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'destructive';
}

export function Alert({ children, className, variant = 'default' }: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4 flex items-center gap-2',
        {
          'bg-red-50 border-red-200 text-red-700': variant === 'destructive',
          'bg-blue-50 border-blue-200 text-blue-700': variant === 'default',
        },
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
}
