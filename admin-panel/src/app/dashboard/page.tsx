'use client'

import React from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { StatCard } from '@/components/admin/ui/StatCard'
import { ActivityChart } from '@/components/admin/charts/ActivityChart'
import { ActivityFeed } from '@/components/admin/ui/ActivityFeed'
import { QuickActions } from '@/components/admin/ui/QuickActions'
import { LoadingCard } from '@/components/admin/ui/LoadingSpinner'
import { Alert } from '@/components/admin/ui/Alert'
import { useDashboard, useActivityData } from '@/hooks/admin/useDashboard'
import {
  NewspaperIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  UsersIcon,
  CogIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { stats, activities, isLoading, error, isStale } = useDashboard()
  const { data: activityData, isLoading: activityLoading } = useActivityData(30)

  // Показываем спиннер только на самый первый загрузочный рендер (когда ещё нет данных)
  if (isLoading && !stats) {
    return (
      <AdminLayout title="Дашборд">
        <LoadingCard text="Загрузка дашборда..." />
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Дашборд">
        <Alert variant="error" title="Ошибка загрузки дашборда">
          {error}
        </Alert>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Дашборд">
      <div className="space-y-6">
        {/* Контент дашборда */}
        {/* Предупреждение о устаревших данных */}
        {isStale && (
          <Alert variant="warning" title="Данные могут быть устаревшими">
            Последнее обновление было более 2 минут назад. Данные могут не отражать текущее состояние.
          </Alert>
        )}

        {/* Статистика */}
        {stats && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Новости"
              value={stats.newsCount}
              change={stats.newsChange}
              icon={NewspaperIcon}
            />
            <StatCard
              title="Мероприятия"
              value={stats.eventsCount}
              change={stats.eventsChange}
              icon={CalendarIcon}
            />
            <StatCard
              title="Документы"
              value={stats.documentsCount}
              change={stats.documentsChange}
              icon={DocumentTextIcon}
            />
            <StatCard
              title="Пользователи"
              value={stats.usersCount}
              change={stats.usersChange}
              icon={UserGroupIcon}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* График активности */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Активность за последние 30 дней</h3>
              {activityLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <ActivityChart data={activityData} />
              )}
            </div>
          </div>

          {/* Быстрые действия */}
          <div className="space-y-6">
            <QuickActions variant="compact" />
            
            {/* Дополнительные быстрые действия */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Управление</h3>
              <div className="space-y-3">
                <Link
                  href="/settings/users"
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <UsersIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Пользователи</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  href="/settings"
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CogIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Настройки</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Лента активности */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Последняя активность</h3>
          </div>
          <div className="p-6">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}