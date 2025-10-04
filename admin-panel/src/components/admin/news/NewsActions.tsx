'use client'

import React, { useState } from 'react'
import { TrashIcon, CheckCircleIcon, ClockIcon, ArchiveBoxIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface NewsActionsProps {
  selectedCount: number
  onBulkAction: (action: string) => void
  onClearSelection: () => void
}

export function NewsActions({
  selectedCount,
  onBulkAction,
  onClearSelection
}: NewsActionsProps) {
  const [showActions, setShowActions] = useState(false)

  const handleAction = (action: string) => {
    onBulkAction(action)
    setShowActions(false)
  }

  const actions = [
    {
      id: 'publish',
      label: 'Опубликовать',
      icon: CheckCircleIcon,
      color: 'text-green-600 hover:text-green-700',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      id: 'draft',
      label: 'В черновики',
      icon: ClockIcon,
      color: 'text-yellow-600 hover:text-yellow-700',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100'
    },
    {
      id: 'archive',
      label: 'Архивировать',
      icon: ArchiveBoxIcon,
      color: 'text-gray-600 hover:text-gray-700',
      bgColor: 'bg-gray-50 hover:bg-gray-100'
    },
    {
      id: 'delete',
      label: 'Удалить',
      icon: TrashIcon,
      color: 'text-red-600 hover:text-red-700',
      bgColor: 'bg-red-50 hover:bg-red-100'
    }
  ]

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium text-amber-800">
            Выбрано новостей: {selectedCount}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="inline-flex items-center px-3 py-2 border border-amber-300 shadow-sm text-sm leading-4 font-medium rounded-md text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Действия
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  {actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action.id)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center ${action.color} ${action.bgColor} hover:bg-opacity-75`}
                    >
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onClearSelection}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Отменить выбор
          </button>
        </div>
      </div>
      
      {showActions && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className={`inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${action.color} ${action.bgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
