'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { cn, getInitials, getRoleDisplayName } from '@/lib/utils'
import { Button } from '@/components/admin/ui/Button'
import { NotificationDropdown } from '@/components/admin/ui/NotificationDropdown'
import { ApiStatusIndicator } from '@/components/admin/ui/ApiStatusIndicator'
import {
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface AdminHeaderProps {
  onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 backdrop-blur-sm bg-white/95">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Открыть меню</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* API Status */}
          <ApiStatusIndicator />
          
          {/* Notifications */}
          <NotificationDropdown />

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5 rounded-lg hover:bg-gray-50/80 transition-all duration-150">
              <span className="sr-only">Открыть меню пользователя</span>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center ring-1 ring-primary-200/50">
                {user?.firstName && user?.lastName ? (
                  <span className="text-xs font-semibold text-primary-700">
                    {getInitials(user.firstName, user.lastName)}
                  </span>
                ) : (
                  <UserCircleIcon className="h-4 w-4 text-primary-600" />
                )}
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-3 text-sm font-medium leading-6 text-gray-700" aria-hidden="true">
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Администратор Системы'}
                </span>
                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400" aria-hidden="true" />
              </span>
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="px-3 py-2.5 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Администратор Системы'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@sro-au.ru'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {getRoleDisplayName(user?.role || '')}
                  </p>
                </div>
                
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        'w-full flex items-center px-3 py-2 text-sm text-gray-700 transition-colors',
                        active && 'bg-gray-50'
                      )}
                    >
                      <UserCircleIcon className="mr-2.5 h-4 w-4 text-gray-400" />
                      Профиль
                    </button>
                  )}
                </Menu.Item>
                
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={cn(
                        'w-full flex items-center px-3 py-2 text-sm text-gray-700 transition-colors',
                        active && 'bg-gray-50'
                      )}
                    >
                      <BellIcon className="mr-2.5 h-4 w-4 text-gray-400" />
                      Настройки
                    </button>
                  )}
                </Menu.Item>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={cn(
                        'w-full flex items-center px-3 py-2 text-sm text-red-600 transition-colors',
                        active && 'bg-red-50'
                      )}
                    >
                      <ArrowRightOnRectangleIcon className="mr-2.5 h-4 w-4" />
                      Выйти
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
}
