'use client';

import React from 'react';
import { Modal } from './Modal';
import { ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  
  title: string;
  message: string;
  
  confirmLabel?: string;
  cancelLabel?: string;
  
  type?: 'danger' | 'warning' | 'info' | 'success';
  
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  type = 'danger',
  loading
}: ConfirmDialogProps) {
  const icons = {
    danger: <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />,
    warning: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />,
    info: <InformationCircleIcon className="h-6 w-6 text-blue-600" />,
    success: <CheckCircleIcon className="h-6 w-6 text-green-600" />
  };
  
  const bgColors = {
    danger: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100',
    success: 'bg-green-100'
  };
  
  const variants = {
    danger: 'danger' as const,
    warning: 'warning' as const,
    info: 'primary' as const,
    success: 'success' as const
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      primaryAction={{
        label: confirmLabel,
        onClick: onConfirm,
        variant: variants[type],
        loading
      }}
      secondaryAction={{
        label: cancelLabel,
        onClick: onClose
      }}
    >
      <div className="flex gap-4">
        <div className={cn('flex-shrink-0 rounded-full p-3', bgColors[type])}>
          {icons[type]}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}

