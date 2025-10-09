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
      solid: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300 shadow-sm',
      outline: 'border-2 border-gray-300 text-gray-800 bg-white',
      soft: 'bg-gray-50 text-gray-700 border border-gray-200'
    },
    red: {
      solid: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300 shadow-sm',
      outline: 'border-2 border-red-300 text-red-800 bg-white',
      soft: 'bg-red-50 text-red-700 border border-red-200'
    },
    yellow: {
      solid: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300 shadow-sm',
      outline: 'border-2 border-yellow-300 text-yellow-800 bg-white',
      soft: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    },
    green: {
      solid: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300 shadow-sm',
      outline: 'border-2 border-green-300 text-green-800 bg-white',
      soft: 'bg-green-50 text-green-700 border border-green-200'
    },
    blue: {
      solid: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 shadow-sm',
      outline: 'border-2 border-blue-300 text-blue-800 bg-white',
      soft: 'bg-blue-50 text-blue-700 border border-blue-200'
    },
    purple: {
      solid: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300 shadow-sm',
      outline: 'border-2 border-purple-300 text-purple-800 bg-white',
      soft: 'bg-purple-50 text-purple-700 border border-purple-200'
    },
    pink: {
      solid: 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border border-pink-300 shadow-sm',
      outline: 'border-2 border-pink-300 text-pink-800 bg-white',
      soft: 'bg-pink-50 text-pink-700 border border-pink-200'
    },
    indigo: {
      solid: 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-300 shadow-sm',
      outline: 'border-2 border-indigo-300 text-indigo-800 bg-white',
      soft: 'bg-indigo-50 text-indigo-700 border border-indigo-200'
    }
  };

  // Убеждаемся, что цвет поддерживается
  const validColor = colorClasses[color] ? color : 'gray';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-semibold transition-all duration-200 hover:scale-105',
        colorClasses[validColor][variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
