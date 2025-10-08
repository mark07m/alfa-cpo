'use client'

import React, { useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Card, CardContent, CardHeader } from '@/components/admin/ui/Card'
import { Button } from '@/components/admin/ui/Button'
import { cn, formatDateTime } from '@/lib/utils'
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

interface NotificationDropdownProps {
  notifications?: Notification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  className?: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Требуется внимание',
    message: '3 проверки ожидают завершения',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actionUrl: '/inspections'
  },
  {
    id: '2',
    type: 'info',
    title: 'Новая заявка',
    message: 'Поступила заявка на вступление в СРО',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/registry/applications'
  },
  {
    id: '3',
    type: 'success',
    title: 'Документ загружен',
    message: 'Положение о компенсационном фонде успешно обновлено',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    type: 'error',
    title: 'Ошибка синхронизации',
    message: 'Не удалось синхронизировать данные с внешней системой',
    isRead: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
]

export function NotificationDropdown({ 
  notifications = mockNotifications, 
  onMarkAsRead,
  onMarkAllAsRead,
  className 
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localNotifications, setLocalNotifications] = useState(notifications)

  const unreadCount = localNotifications.filter(n => !n.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'error':
        return 'border-l-red-500'
      default:
        return 'border-l-blue-500'
    }
  }

  const handleMarkAsRead = (id: string) => {
    setLocalNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
    onMarkAsRead?.(id)
  }

  const handleMarkAllAsRead = () => {
    setLocalNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    )
    onMarkAllAsRead?.()
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
        <span className="sr-only">Просмотр уведомлений</span>
        <BellIcon className="h-6 w-6" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Уведомления</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Прочитать все
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {localNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <BellIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Нет уведомлений</p>
              </div>
            ) : (
              localNotifications.map((notification) => (
                <Menu.Item key={notification.id}>
                  {({ active }) => (
                    <div
                      className={cn(
                        'px-4 py-3 border-l-4 cursor-pointer transition-colors',
                        getNotificationColor(notification.type),
                        !notification.isRead ? 'bg-amber-50' : 'bg-white',
                        active && 'bg-gray-50'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={cn(
                              'text-sm font-medium',
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            )}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDateTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Menu.Item>
              ))
            )}
          </div>

          {localNotifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-center"
                onClick={() => window.location.href = '/notifications'}
              >
                Просмотреть все уведомления
              </Button>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
