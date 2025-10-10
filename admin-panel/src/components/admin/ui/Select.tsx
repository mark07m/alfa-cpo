'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    options, 
    placeholder, 
    error, 
    variant = 'outlined',
    size = 'md',
    className, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'block w-full rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-right pr-10';
    
    const variantClasses = {
      default: 'bg-white border border-gray-200 hover:border-gray-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none',
      filled: 'bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none',
      outlined: 'bg-transparent border border-gray-200 hover:border-gray-300 focus:border-primary-400 focus:ring-0 focus:outline-none'
    };
    
    const sizeClasses = {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-3.5 py-2.5 text-base'
    };
    
    const errorClasses = error 
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100' 
      : '';
    
    return (
      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            errorClasses,
            'text-gray-700',
            className
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.5em 1.5em'
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';
