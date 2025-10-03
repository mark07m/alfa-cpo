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
  actions: QuickAction[]
  title?: string
  columns?: 1 | 2 | 3 | 4
  className?: string
}

const defaultActions: QuickAction[] = [
  {
    id: 'create-news',
    title: 'Создать новость',
    description: 'Добавить новую статью на сайт',
    href: '/news/create',
    icon: NewspaperIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    category: 'Контент'
  },
  {
    id: 'create-event',
    title: 'Добавить мероприятие',
    description: 'Создать новое мероприятие',
    href: '/events/create',
    icon: CalendarIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    category: 'Контент'
  },
  {
    id: 'upload-document',
    title: 'Загрузить документ',
    description: 'Добавить новый документ',
    href: '/documents/upload',
    icon: DocumentTextIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
    category: 'Контент'
  },
  {
    id: 'add-arbitrator',
    title: 'Добавить управляющего',
    description: 'Внести в реестр нового управляющего',
    href: '/registry/arbitrators/create',
    icon: UserGroupIcon,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500',
    category: 'Реестр'
  },
  {
    id: 'create-inspection',
    title: 'Запланировать проверку',
    description: 'Создать новую проверку',
    href: '/inspections/create',
    icon: ClipboardDocumentListIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
    category: 'Контроль'
  },
  {
    id: 'create-disciplinary',
    title: 'Добавить дисциплинарную меру',
    description: 'Применить дисциплинарную меру',
    href: '/disciplinary-measures/create',
    icon: ExclamationTriangleIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-500',
    category: 'Контроль'
  },
  {
    id: 'manage-users',
    title: 'Управление пользователями',
    description: 'Добавить или изменить пользователей',
    href: '/users',
    icon: UsersIcon,
    color: 'text-gray-600',
    bgColor: 'bg-gray-500',
    category: 'Настройки'
  },
  {
    id: 'site-settings',
    title: 'Настройки сайта',
    description: 'Изменить основные настройки',
    href: '/settings/site',
    icon: CogIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-500',
    category: 'Настройки'
  }
]

export function QuickActions({ 
  actions = defaultActions, 
  title = 'Быстрые действия',
  columns = 2,
  className 
}: QuickActionsProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }

  const handleActionClick = (href: string) => {
    window.location.href = href
  }

  // Группируем действия по категориям
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
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedActions).map(([category, categoryActions]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-gray-900 mb-3">{category}</h4>
              <div className={cn('grid gap-4', gridCols[columns])}>
                {categoryActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="h-auto p-4 flex-col items-start text-left hover:shadow-md transition-all duration-200"
                    onClick={() => handleActionClick(action.href)}
                  >
                    <div className="flex items-center w-full">
                      <div className={cn(
                        'rounded-lg p-2 mr-3 flex-shrink-0',
                        action.bgColor
                      )}>
                        <action.icon className={cn('h-5 w-5 text-white')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {action.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {action.description}
                        </div>
                      </div>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
