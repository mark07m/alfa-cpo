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
  iconColor = 'text-amber-600',
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
        return <ArrowUpIcon className="h-4 w-4 text-green-500" />
      case 'negative':
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />
      case 'neutral':
        return <MinusIcon className="h-4 w-4 text-gray-500" />
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
        'hover:shadow-md transition-all duration-200 cursor-pointer group',
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={cn('p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors')}>
              <Icon className={cn('h-6 w-6 text-blue-600')} />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {change && (
                  <div className={cn('ml-2 flex items-baseline text-sm font-medium', getChangeColor())}>
                    {getChangeIcon()}
                    <span className="ml-1">{change.value}</span>
                    {change.period && (
                      <span className="ml-1 text-gray-500">за {change.period}</span>
                    )}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
