import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/admin/ui/Card'
import { Button } from '@/components/admin/ui/Button'
import { cn } from '@/lib/utils'
import {
  PlusIcon,
  ArrowRightIcon,
  NewspaperIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CogIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

interface QuickAction {
  id: string
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  category?: string
}

interface QuickActionsProps {
  actions?: QuickAction[]
  title?: string
  variant?: 'compact' | 'detailed' | 'grid'
  className?: string
}

const defaultActions: QuickAction[] = [
  {
    id: 'create-news',
    title: 'Новость',
    description: 'Создать статью',
    href: '/news/create',
    icon: NewspaperIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    category: 'Контент'
  },
  {
    id: 'create-event',
    title: 'Мероприятие',
    description: 'Добавить событие',
    href: '/events/create',
    icon: CalendarIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    category: 'Контент'
  },
  {
    id: 'upload-document',
    title: 'Документ',
    description: 'Загрузить файл',
    href: '/documents/upload',
    icon: DocumentTextIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    category: 'Контент'
  },
  {
    id: 'add-arbitrator',
    title: 'Управляющий',
    description: 'Внести в реестр',
    href: '/registry/arbitrators/create',
    icon: UserGroupIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    category: 'Реестр'
  },
  {
    id: 'create-inspection',
    title: 'Проверка',
    description: 'Запланировать',
    href: '/inspections/create',
    icon: ClipboardDocumentListIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    category: 'Контроль'
  },
  {
    id: 'create-disciplinary',
    title: 'Дисциплинарная мера',
    description: 'Применить меру',
    href: '/disciplinary-measures/create',
    icon: ExclamationTriangleIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    category: 'Контроль'
  },
  {
    id: 'manage-users',
    title: 'Пользователи',
    description: 'Управление',
    href: '/users',
    icon: UsersIcon,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    category: 'Настройки'
  },
  {
    id: 'site-settings',
    title: 'Настройки',
    description: 'Конфигурация',
    href: '/settings/site',
    icon: CogIcon,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    category: 'Настройки'
  }
]

export function QuickActions({ 
  actions = defaultActions, 
  title = 'Быстрые действия',
  variant = 'compact',
  className 
}: QuickActionsProps) {
  const handleActionClick = (href: string) => {
    window.location.href = href
  }

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-4', className)}>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actions.slice(0, 8).map((action) => (
            <button
              key={action.id}
              className="group relative p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-150 text-center"
              onClick={() => handleActionClick(action.href)}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  action.bgColor
                )}>
                  <action.icon className={cn('h-4 w-4', action.color)} />
                </div>
                <div className="text-xs font-medium text-gray-900 group-hover:text-gray-700">
                  {action.title}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <div className={cn('space-y-4', className)}>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              className="group relative p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-150 text-left"
              onClick={() => handleActionClick(action.href)}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                  action.bgColor
                )}>
                  <action.icon className={cn('h-5 w-5', action.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {action.description}
                  </div>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Detailed variant (original)
  const groupedActions = actions.reduce((acc, action) => {
    const category = action.category || 'Другие'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(action)
    return acc
  }, {} as Record<string, QuickAction[]>)

  return (
    <Card className={className}>
      <CardHeader title={title} />
      <CardContent className="p-6">
        <div className="space-y-6">
          {Object.entries(groupedActions).map(([category, categoryActions]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                {category}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {categoryActions.map((action) => (
                  <button
                    key={action.id}
                    className="group relative p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-150 text-left"
                    onClick={() => handleActionClick(action.href)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                        action.bgColor
                      )}>
                        <action.icon className={cn('h-4 w-4', action.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                          {action.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {action.description}
                        </div>
                      </div>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}