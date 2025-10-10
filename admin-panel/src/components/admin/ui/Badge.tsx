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
      solid: 'bg-gray-100 text-gray-800 border border-gray-300',
      outline: 'border border-gray-300 text-gray-800 bg-white',
      soft: 'bg-gray-50 text-gray-700 border border-gray-200'
    },
    red: {
      solid: 'bg-red-100 text-red-800 border border-red-300',
      outline: 'border border-red-300 text-red-800 bg-white',
      soft: 'bg-red-50 text-red-700 border border-red-200'
    },
    yellow: {
      solid: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      outline: 'border border-yellow-300 text-yellow-800 bg-white',
      soft: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    },
    green: {
      solid: 'bg-green-100 text-green-800 border border-green-300',
      outline: 'border border-green-300 text-green-800 bg-white',
      soft: 'bg-green-50 text-green-700 border border-green-200'
    },
    blue: {
      solid: 'bg-blue-100 text-blue-800 border border-blue-300',
      outline: 'border border-blue-300 text-blue-800 bg-white',
      soft: 'bg-blue-50 text-blue-700 border border-blue-200'
    },
    purple: {
      solid: 'bg-purple-100 text-purple-800 border border-purple-300',
      outline: 'border border-purple-300 text-purple-800 bg-white',
      soft: 'bg-purple-50 text-purple-700 border border-purple-200'
    },
    pink: {
      solid: 'bg-pink-100 text-pink-800 border border-pink-300',
      outline: 'border border-pink-300 text-pink-800 bg-white',
      soft: 'bg-pink-50 text-pink-700 border border-pink-200'
    },
    indigo: {
      solid: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
      outline: 'border border-indigo-300 text-indigo-800 bg-white',
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
        'inline-flex items-center rounded-full font-medium transition-all duration-200 hover:scale-102',
        colorClasses[validColor][variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
