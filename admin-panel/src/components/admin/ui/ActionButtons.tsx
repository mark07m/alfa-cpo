'use client';

import React from 'react';
import { Button } from './Button';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  XMarkIcon,
  ArchiveBoxIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface ActionButton {
  type: 'view' | 'edit' | 'delete' | 'duplicate' | 'download' | 'upload' | 'approve' | 'reject' | 'archive' | 'restore' | 'custom';
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode | React.ComponentType<any>;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  showLabel?: boolean;
  tooltip?: string;
}

interface ActionButtonsProps {
  actions: ActionButton[];
  size?: 'xs' | 'sm' | 'md';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const defaultIcons = {
  view: EyeIcon,
  edit: PencilIcon,
  delete: TrashIcon,
  duplicate: DocumentDuplicateIcon,
  download: ArrowDownTrayIcon,
  upload: ArrowUpTrayIcon,
  approve: CheckIcon,
  reject: XMarkIcon,
  archive: ArchiveBoxIcon,
  restore: ArrowPathIcon
};

const defaultLabels = {
  view: 'Просмотр',
  edit: 'Редактировать',
  delete: 'Удалить',
  duplicate: 'Дублировать',
  download: 'Скачать',
  upload: 'Загрузить',
  approve: 'Одобрить',
  reject: 'Отклонить',
  archive: 'Архивировать',
  restore: 'Восстановить'
};

const defaultVariants = {
  view: 'outline' as const,
  edit: 'outline' as const,
  delete: 'danger' as const,
  duplicate: 'outline' as const,
  download: 'outline' as const,
  upload: 'primary' as const,
  approve: 'success' as const,
  reject: 'danger' as const,
  archive: 'outline' as const,
  restore: 'primary' as const
};

export function ActionButtons({
  actions,
  size = 'sm',
  orientation = 'horizontal',
  className
}: ActionButtonsProps) {
  const renderIcon = (icon: any) => {
    if (!icon) return null;
    // If icon is already a React element, clone to apply sizing
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as any, { className: cn('h-4 w-4', (icon as any).props?.className) });
    }
    // Otherwise treat as a component type (including forwardRef objects)
    try {
      return React.createElement(icon as any, { className: 'h-4 w-4' });
    } catch {
      return null;
    }
  };
  return (
    <div
      className={cn(
        'flex items-center',
        orientation === 'horizontal' ? 'flex-row gap-2' : 'flex-col gap-2',
        className
      )}
    >
      {actions.map((action, index) => {
        const IconCandidate = action.type !== 'custom' 
          ? (action.icon || defaultIcons[action.type])
          : action.icon;
        
        const label = action.label || (action.type !== 'custom' ? defaultLabels[action.type] : '');
        const variant = action.variant || (action.type !== 'custom' ? defaultVariants[action.type] : 'outline');
        const showLabel = action.showLabel !== undefined ? action.showLabel : true;
        
        return (
          <Button
            key={index}
            variant={variant}
            size={size}
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            className={cn(
              'flex items-center gap-2',
              !showLabel && 'aspect-square p-2'
            )}
            title={action.tooltip || label}
          >
            {action.loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            ) : (
              renderIcon(IconCandidate)
            )}
            {showLabel && <span>{label}</span>}
          </Button>
        );
      })}
    </div>
  );
}

// Готовые наборы действий для типовых случаев
export const commonActionSets = {
  listItem: (handlers: {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
  }): ActionButton[] => {
    const actions: ActionButton[] = [];
    
    if (handlers.onView) {
      actions.push({ type: 'view', onClick: handlers.onView, showLabel: false });
    }
    if (handlers.onEdit) {
      actions.push({ type: 'edit', onClick: handlers.onEdit, showLabel: false });
    }
    if (handlers.onDelete) {
      actions.push({ type: 'delete', onClick: handlers.onDelete, showLabel: false });
    }
    
    return actions;
  },
  
  detailPage: (handlers: {
    onEdit?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
  }): ActionButton[] => {
    const actions: ActionButton[] = [];
    
    if (handlers.onEdit) {
      actions.push({ type: 'edit', onClick: handlers.onEdit });
    }
    if (handlers.onDuplicate) {
      actions.push({ type: 'duplicate', onClick: handlers.onDuplicate });
    }
    if (handlers.onDelete) {
      actions.push({ type: 'delete', onClick: handlers.onDelete });
    }
    
    return actions;
  },
  
  approval: (handlers: {
    onApprove: () => void;
    onReject: () => void;
  }): ActionButton[] => [
    { type: 'approve', onClick: handlers.onApprove },
    { type: 'reject', onClick: handlers.onReject }
  ]
};

