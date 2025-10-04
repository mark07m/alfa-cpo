'use client'

import React from 'react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ApiErrorBannerProps {
  error: string | null
  onClose: () => void
  onRetry?: () => void
}

export function ApiErrorBanner({ error, onClose, onRetry }: ApiErrorBannerProps) {
  if (!error) return null

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            API недоступен
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Сервер API не отвечает. Приложение работает в режиме демонстрации с тестовыми данными.
            </p>
            <p className="mt-1">
              Ошибка: {error}
            </p>
          </div>
          <div className="mt-4 flex space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-yellow-100 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200"
              >
                Повторить попытку
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-yellow-100 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200"
            >
              Закрыть
            </button>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100"
            >
              <span className="sr-only">Закрыть</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
