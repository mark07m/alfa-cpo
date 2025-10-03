import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/admin/ui/Card'
import { cn, formatDateTime } from '@/lib/utils'
import {
  NewspaperIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface ActivityItem {
  id: string
  type: 'news' | 'event' | 'document' | 'arbitrator' | 'inspection' | 'disciplinary'
  action: 'created' | 'updated' | 'deleted' | 'published' | 'viewed'
  title: string
  user: {
    name: string
    avatar?: string
  }
  timestamp: string
  details?: string
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  title?: string
  maxItems?: number
  className?: string
}

const getActivityIcon = (type: string, action: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    news: NewspaperIcon,
    event: CalendarIcon,
    document: DocumentTextIcon,
    arbitrator: UserGroupIcon,
    inspection: ClipboardDocumentListIcon,
    disciplinary: ExclamationTriangleIcon
  }

  const Icon = iconMap[type] || DocumentTextIcon

  switch (action) {
    case 'created':
      return <PlusIcon className="h-4 w-4 text-green-600" />
    case 'updated':
      return <PencilIcon className="h-4 w-4 text-blue-600" />
    case 'deleted':
      return <TrashIcon className="h-4 w-4 text-red-600" />
    case 'published':
      return <EyeIcon className="h-4 w-4 text-purple-600" />
    case 'viewed':
      return <EyeIcon className="h-4 w-4 text-gray-600" />
    default:
      return <Icon className="h-4 w-4 text-amber-600" />
  }
}

const getActivityColor = (type: string) => {
  const colorMap: Record<string, string> = {
    news: 'bg-blue-100 text-blue-600',
    event: 'bg-green-100 text-green-600',
    document: 'bg-purple-100 text-purple-600',
    arbitrator: 'bg-amber-100 text-amber-600',
    inspection: 'bg-orange-100 text-orange-600',
    disciplinary: 'bg-red-100 text-red-600'
  }
  return colorMap[type] || 'bg-gray-100 text-gray-600'
}

const getActionText = (action: string) => {
  const actionMap: Record<string, string> = {
    created: 'создал',
    updated: 'обновил',
    deleted: 'удалил',
    published: 'опубликовал',
    viewed: 'просмотрел'
  }
  return actionMap[action] || 'выполнил'
}

const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    news: 'новость',
    event: 'мероприятие',
    document: 'документ',
    arbitrator: 'управляющего',
    inspection: 'проверку',
    disciplinary: 'дисциплинарную меру'
  }
  return typeMap[type] || 'элемент'
}

export function ActivityFeed({ 
  activities, 
  title = 'Последняя активность', 
  maxItems = 10,
  className 
}: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems)

  return (
    <Card className={className}>
      <CardHeader title={title} />
      <CardContent>
        <div className="flow-root">
          <ul className="-mb-8">
            {displayActivities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== displayActivities.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                        getActivityColor(activity.type)
                      )}>
                        {getActivityIcon(activity.type, activity.action)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            {activity.user.name}
                          </span>{' '}
                          {getActionText(activity.action)}{' '}
                          <span className="font-medium text-gray-900">
                            {activity.title}
                          </span>
                        </p>
                        {activity.details && (
                          <p className="text-xs text-gray-400 mt-1">
                            {activity.details}
                          </p>
                        )}
                        <div className="mt-1">
                          <span className={cn(
                            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                            getActivityColor(activity.type)
                          )}>
                            {getTypeText(activity.type)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {formatDateTime(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {activities.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <DocumentTextIcon className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500">Нет активности</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
