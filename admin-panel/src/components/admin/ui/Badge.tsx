'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'soft';
  className?: string;
}

export function Badge({ 
  children, 
  color = 'gray', 
  size = 'md', 
  variant = 'solid',
  className 
}: BadgeProps) {
  const colorClasses = {
    gray: {
      solid: 'bg-gray-100 text-gray-800',
      outline: 'border-gray-200 text-gray-800',
      soft: 'bg-gray-50 text-gray-700'
    },
    red: {
      solid: 'bg-red-100 text-red-800',
      outline: 'border-red-200 text-red-800',
      soft: 'bg-red-50 text-red-700'
    },
    yellow: {
      solid: 'bg-yellow-100 text-yellow-800',
      outline: 'border-yellow-200 text-yellow-800',
      soft: 'bg-yellow-50 text-yellow-700'
    },
    green: {
      solid: 'bg-green-100 text-green-800',
      outline: 'border-green-200 text-green-800',
      soft: 'bg-green-50 text-green-700'
    },
    blue: {
      solid: 'bg-blue-100 text-blue-800',
      outline: 'border-blue-200 text-blue-800',
      soft: 'bg-blue-50 text-blue-700'
    },
    purple: {
      solid: 'bg-purple-100 text-purple-800',
      outline: 'border-purple-200 text-purple-800',
      soft: 'bg-purple-50 text-purple-700'
    },
    pink: {
      solid: 'bg-pink-100 text-pink-800',
      outline: 'border-pink-200 text-pink-800',
      soft: 'bg-pink-50 text-pink-700'
    },
    indigo: {
      solid: 'bg-indigo-100 text-indigo-800',
      outline: 'border-indigo-200 text-indigo-800',
      soft: 'bg-indigo-50 text-indigo-700'
    }
  };

  // Убеждаемся, что цвет поддерживается
  const validColor = colorClasses[color] ? color : 'gray';

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  };

  const variantClasses = {
    solid: 'border-0',
    outline: 'border',
    soft: 'border-0'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        colorClasses[validColor][variant],
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
