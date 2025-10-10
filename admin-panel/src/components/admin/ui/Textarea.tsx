'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    error, 
    variant = 'default',
    resize = 'vertical',
    className, 
    disabled,
    rows = 4,
    ...props 
  }, ref) => {
    const baseClasses = 'block w-full rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      default: 'bg-white border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
      filled: 'bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
      outlined: 'bg-transparent border-2 border-gray-300 focus:border-primary-500 focus:ring-0'
    };
    
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };
    
    const errorClasses = error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : '';
    
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        rows={rows}
        className={cn(
          baseClasses,
          variantClasses[variant],
          resizeClasses[resize],
          errorClasses,
          'px-3 py-2.5 text-sm text-gray-900',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
