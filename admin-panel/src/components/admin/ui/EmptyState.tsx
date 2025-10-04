import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className,
  size = 'md'
}: EmptyStateProps) {
  const sizes = {
    sm: {
      icon: 'h-8 w-8',
      title: 'text-base',
      description: 'text-sm',
      spacing: 'space-y-2'
    },
    md: {
      icon: 'h-12 w-12',
      title: 'text-lg',
      description: 'text-base',
      spacing: 'space-y-3'
    },
    lg: {
      icon: 'h-16 w-16',
      title: 'text-xl',
      description: 'text-lg',
      spacing: 'space-y-4'
    }
  };

  const sizeClasses = sizes[size];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      sizeClasses.spacing,
      className
    )}>
      {icon && (
        <div className={cn(
          'text-gray-400',
          sizeClasses.icon
        )}>
          {icon}
        </div>
      )}
      
      <div className={cn(
        'font-medium text-gray-900',
        sizeClasses.title
      )}>
        {title}
      </div>
      
      {description && (
        <div className={cn(
          'text-gray-500 max-w-sm',
          sizeClasses.description
        )}>
          {description}
        </div>
      )}
      
      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function EmptyTableState({ 
  title = 'Нет данных для отображения',
  description = 'Попробуйте изменить фильтры или добавить новые записи',
  action,
  className
}: Omit<EmptyStateProps, 'icon' | 'size'>) {
  return (
    <div className="py-12">
      <EmptyState
        icon={
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
        title={title}
        description={description}
        action={action}
        className={className}
      />
    </div>
  );
}

export function EmptySearchState({ 
  title = 'Ничего не найдено',
  description = 'Попробуйте изменить поисковый запрос',
  action,
  className
}: Omit<EmptyStateProps, 'icon' | 'size'>) {
  return (
    <EmptyState
      icon={
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
}
