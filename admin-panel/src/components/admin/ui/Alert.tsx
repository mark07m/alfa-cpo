import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface AlertProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Alert({ 
  variant = 'info', 
  title, 
  children, 
  onClose,
  className,
  size = 'md'
}: AlertProps) {
  const variants = {
    success: {
      container: 'bg-green-50 border-green-200',
      icon: 'text-green-400',
      title: 'text-green-800',
      content: 'text-green-700'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
      content: 'text-yellow-700'
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-400',
      title: 'text-red-800',
      content: 'text-red-700'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      content: 'text-blue-700'
    }
  };

  const sizes = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const icons = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon
  };

  const Icon = icons[variant];
  const variantStyles = variants[variant];

  return (
    <div className={cn(
      'rounded-md border',
      variantStyles.container,
      sizes[size],
      className
    )}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', variantStyles.icon)} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={cn('text-sm font-medium', variantStyles.title)}>
              {title}
            </h3>
          )}
          <div className={cn(
            'text-sm',
            title ? 'mt-1' : '',
            variantStyles.content
          )}>
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={cn(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  variantStyles.container,
                  variantStyles.content,
                  'hover:opacity-75'
                )}
                onClick={onClose}
              >
                <span className="sr-only">Закрыть</span>
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AlertSuccess({ title, children, onClose, className, size }: Omit<AlertProps, 'variant'>) {
  return (
    <Alert variant="success" title={title} onClose={onClose} className={className} size={size}>
      {children}
    </Alert>
  );
}

export function AlertWarning({ title, children, onClose, className, size }: Omit<AlertProps, 'variant'>) {
  return (
    <Alert variant="warning" title={title} onClose={onClose} className={className} size={size}>
      {children}
    </Alert>
  );
}

export function AlertError({ title, children, onClose, className, size }: Omit<AlertProps, 'variant'>) {
  return (
    <Alert variant="error" title={title} onClose={onClose} className={className} size={size}>
      {children}
    </Alert>
  );
}

export function AlertInfo({ title, children, onClose, className, size }: Omit<AlertProps, 'variant'>) {
  return (
    <Alert variant="info" title={title} onClose={onClose} className={className} size={size}>
      {children}
    </Alert>
  );
}
