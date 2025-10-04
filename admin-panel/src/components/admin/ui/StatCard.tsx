import React from 'react'
import { Card, CardContent } from '@/components/admin/ui/Card'
import { cn } from '@/lib/utils'
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/outline'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: string | number
    type: 'positive' | 'negative' | 'neutral'
    period?: string
  }
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  href?: string
  onClick?: () => void
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-gray-600',
  href,
  onClick,
  className
}: StatCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      window.location.href = href
    }
  }

  const getChangeIcon = () => {
    if (!change) return null
    
    switch (change.type) {
      case 'positive':
        return <ArrowUpIcon className="h-3 w-3 text-success-500" />
      case 'negative':
        return <ArrowDownIcon className="h-3 w-3 text-danger-500" />
      case 'neutral':
        return <MinusIcon className="h-3 w-3 text-gray-500" />
      default:
        return null
    }
  }

  const getChangeColor = () => {
    if (!change) return ''
    
    switch (change.type) {
      case 'positive':
        return 'text-success-600'
      case 'negative':
        return 'text-danger-600'
      case 'neutral':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card 
      className={cn(
        'hover:shadow-sm transition-all duration-150 cursor-pointer group border-gray-200 flex-1 min-w-0',
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn('p-2 rounded-md bg-gray-50 group-hover:bg-gray-100 transition-colors')}>
              <Icon className={cn('h-5 w-5', iconColor)} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">
                {title}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {value}
              </div>
            </div>
          </div>
          {change && (
            <div className={cn('flex items-center space-x-1 text-xs font-medium', getChangeColor())}>
              {getChangeIcon()}
              <span>{change.value}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
