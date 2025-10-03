import React from 'react'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const statusClasses = {
    success: 'status-success',
    warning: 'status-warning',
    danger: 'status-danger',
    info: 'status-info',
    neutral: 'bg-gray-100 text-gray-800'
  }

  return (
    <span className={cn('status-badge', statusClasses[status], className)}>
      {children}
    </span>
  )
}
