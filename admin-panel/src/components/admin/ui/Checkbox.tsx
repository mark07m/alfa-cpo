'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      <div className="flex items-start space-x-3">
        <input
          id={checkboxId}
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border-neutral-300 text-beige-600 focus:ring-beige-500',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        
        {label && (
          <div className="flex-1">
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium text-neutral-700 cursor-pointer"
            >
              {label}
            </label>
            
            {helperText && !error && (
              <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
            )}
            
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkbox;