'use client'

import React, { useState } from 'react'
import { Event } from '@/types/admin'
import { 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon,
  DocumentArrowDownIcon,
  EyeSlashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface EventsActionsProps {
  selectedEvents: Event[]
  onBulkAction: (action: string, eventIds: string[]) => Promise<void>
  onClearSelection: () => void
  isProcessing: boolean
}

export function EventsActions({
  selectedEvents,
  onBulkAction,
  onClearSelection,
  isProcessing
}: EventsActionsProps) {
  const [showActions, setShowActions] = useState(false)

  if (selectedEvents.length === 0) {
    return null
  }

  const handleBulkAction = async (action: string) => {
    const eventIds = selectedEvents.map(event => event.id)
    await onBulkAction(action, eventIds)
    setShowActions(false)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'delete':
        return <TrashIcon className="h-4 w-4" />
      case 'publish':
        return <EyeIcon className="h-4 w-4" />
      case 'unpublish':
        return <EyeSlashIcon className="h-4 w-4" />
      case 'complete':
        return <CheckIcon className="h-4 w-4" />
      case 'cancel':
        return <XMarkIcon className="h-4 w-4" />
      case 'export':
        return <DocumentArrowDownIcon className="h-4 w-4" />
      default:
        return null
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'delete':
        return 'Удалить'
      case 'publish':
        return 'Опубликовать'
      case 'unpublish':
        return 'Снять с публикации'
      case 'complete':
        return 'Завершить'
      case 'cancel':
        return 'Отменить'
      case 'export':
        return 'Экспортировать'
      default:
        return action
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'delete':
        return 'text-red-600 hover:text-red-700 hover:bg-red-50'
      case 'publish':
        return 'text-green-600 hover:text-green-700 hover:bg-green-50'
      case 'unpublish':
        return 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
      case 'complete':
        return 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
      case 'cancel':
        return 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
      case 'export':
        return 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
      default:
        return 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
    }
  }

  const availableActions = [
    { id: 'publish', label: 'Опубликовать', icon: 'publish' },
    { id: 'unpublish', label: 'Снять с публикации', icon: 'unpublish' },
    { id: 'complete', label: 'Завершить', icon: 'complete' },
    { id: 'cancel', label: 'Отменить', icon: 'cancel' },
    { id: 'export', label: 'Экспортировать', icon: 'export' },
    { id: 'delete', label: 'Удалить', icon: 'delete' }
  ]

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium text-blue-900">
            Выбрано мероприятий: {selectedEvents.length}
          </span>
          <button
            onClick={onClearSelection}
            className="ml-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Очистить выбор
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowActions(!showActions)}
            disabled={isProcessing}
            className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Действия
          </button>
        </div>
      </div>

      {showActions && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex flex-wrap gap-2">
            {availableActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleBulkAction(action.id)}
                disabled={isProcessing}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${getActionColor(action.id)} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {getActionIcon(action.id)}
                <span className="ml-2">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Дополнительная информация о выбранных мероприятиях */}
          <div className="mt-3 text-xs text-blue-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <span className="font-medium">Статусы:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Array.from(new Set(selectedEvents.map(e => e.status))).map(status => (
                    <span key={status} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {status === 'draft' ? 'Черновик' :
                       status === 'published' ? 'Опубликовано' :
                       status === 'cancelled' ? 'Отменено' :
                       status === 'completed' ? 'Завершено' : status}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="font-medium">С регистрацией:</span>
                <div className="mt-1">
                  {selectedEvents.filter(e => e.registrationRequired).length} из {selectedEvents.length}
                </div>
              </div>
              
              <div>
                <span className="font-medium">Рекомендуемые:</span>
                <div className="mt-1">
                  {selectedEvents.filter(e => e.featured).length} из {selectedEvents.length}
                </div>
              </div>
              
              <div>
                <span className="font-medium">Участники:</span>
                <div className="mt-1">
                  {selectedEvents.reduce((sum, e) => sum + e.currentParticipants, 0)} / {selectedEvents.reduce((sum, e) => sum + (e.maxParticipants || 0), 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
