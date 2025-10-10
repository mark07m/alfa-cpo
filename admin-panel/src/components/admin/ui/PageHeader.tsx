'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  // Основное
  title: string;
  subtitle?: string;
  
  // Навигация назад
  backUrl?: string;
  backLabel?: string;
  onBack?: () => void;
  
  // Actions
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
    disabled?: boolean;
    loading?: boolean;
  };
  
  secondaryActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
    disabled?: boolean;
  }>;
  
  // Badge/статус
  badge?: React.ReactNode;
  
  // Кастомизация
  className?: string;
  withDivider?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  backUrl,
  backLabel = 'Назад',
  onBack,
  primaryAction,
  secondaryActions,
  badge,
  className,
  withDivider = true
}: PageHeaderProps) {
  const router = useRouter();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Left side: Back button + Title */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {(backUrl || onBack) && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2 shrink-0"
              aria-label={backLabel}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{backLabel}</span>
            </Button>
          )}
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                {title}
              </h1>
              {badge && <div className="shrink-0">{badge}</div>}
            </div>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {/* Right side: Actions */}
        {(primaryAction || secondaryActions) && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {secondaryActions?.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                onClick={action.onClick}
                disabled={action.disabled}
                className="flex items-center gap-2"
              >
                {action.icon}
                <span>{action.label}</span>
              </Button>
            ))}
            
            {primaryAction && (
              <Button
                variant={primaryAction.variant || 'primary'}
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled || primaryAction.loading}
                className="flex items-center gap-2"
              >
                {primaryAction.loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : primaryAction.icon}
                <span>{primaryAction.label}</span>
              </Button>
            )}
          </div>
        )}
      </div>
      
      {withDivider && <div className="border-t border-gray-200" />}
    </div>
  );
}

