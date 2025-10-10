'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    label,
    description,
    error,
    size = 'md',
    className,
    disabled,
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };
    
    const textSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
    
    const checkbox = (
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        className={cn(
          'rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-red-500 text-red-600 focus:ring-red-500',
          sizeClasses[size],
          !label && className
        )}
        {...props}
      />
    );
    
    if (!label && !description) {
      return checkbox;
    }
    
    return (
      <div className={cn('flex items-start', className)}>
        <div className="flex items-center h-5">
          {checkbox}
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={props.id}
                className={cn(
                  'font-medium text-gray-700',
                  textSizeClasses[size],
                  disabled && 'opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={cn(
                'text-gray-500',
                size === 'sm' ? 'text-xs' : 'text-xs',
                disabled && 'opacity-50'
              )}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
