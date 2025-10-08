import React from 'react';
import { cn } from '@/lib/utils';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export function Label({ children, required, className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'block text-sm font-medium text-gray-700 mb-1',
        required && "after:content-['*'] after:ml-0.5 after:text-red-500",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
