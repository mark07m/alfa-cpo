'use client';

import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | boolean;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label,
    error, 
    helperText,
    variant = 'default',
    resize = 'vertical',
    className, 
    disabled,
    rows = 4,
    id,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    const baseClasses = 'block w-full rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      default: 'bg-white border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
      filled: 'bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
      outlined: 'bg-transparent border-2 border-gray-300 focus:border-primary-500 focus:ring-0'
    } as const;
    
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    } as const;
    
    const errorClasses = error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : '';
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          id={textareaId}
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

        {typeof error === 'string' && error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
