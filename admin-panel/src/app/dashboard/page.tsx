'use client'

import React from 'react'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { StatCard } from '@/components/admin/ui/StatCard'
import { ActivityChart } from '@/components/admin/charts/ActivityChart'
import { ActivityFeed } from '@/components/admin/ui/ActivityFeed'
import { QuickActions } from '@/components/admin/ui/QuickActions'
import { useDashboard, useActivityData } from '@/hooks/admin/useDashboard'
import {
  NewspaperIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  CogIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { stats, activities, isLoading, error } = useDashboard()
  const { data: activityData } = useActivityData(30)

  if (isLoading) {
    return (
      <AdminLayout title="Дашборд">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Дашборд">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Ошибка загрузки данных</p>
            <p className="text-gray-500 text-sm mt-2">{error}</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Дашборд">
      <div className="space-y-6">
        {/* Статистические карточки */}
        <div className="flex flex-wrap gap-4">
          <StatCard
            title="Новости"
            value={stats?.newsCount || 0}
            change={stats?.newsChange}
            icon={NewspaperIcon}
            color="blue"
          />
          <StatCard
            title="Мероприятия"
            value={stats?.eventsCount || 0}
            change={stats?.eventsChange}
            icon={CalendarIcon}
            color="green"
          />
          <StatCard
            title="Документы"
            value={stats?.documentsCount || 0}
            change={stats?.documentsChange}
            icon={DocumentTextIcon}
            color="purple"
          />
          <StatCard
            title="Пользователи"
            value={stats?.usersCount || 0}
            change={stats?.usersChange}
            icon={UserGroupIcon}
            color="orange"
          />
        </div>

        {/* Быстрые действия */}
        <div className="bg-white rounded-lg shadow p-6">
          <QuickActions variant="compact" />
        </div>

        {/* График активности и статус системы */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityChart 
              data={activityData} 
              title="Активность за 30 дней"
              className="h-80"
            />
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Статус системы</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Проверки</span>
                  <span className="text-sm font-medium text-green-600">{stats?.inspectionsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Дисциплинарные меры</span>
                  <span className="text-sm font-medium text-red-600">{stats?.disciplinaryMeasuresCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Компенсационный фонд</span>
                  <span className="text-sm font-medium text-blue-600">{stats?.compensationFundCount || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Дополнительные быстрые действия для узкой колонки */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Управление</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/users'}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <UsersIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Пользователи</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </button>
                <button
                  onClick={() => window.location.href = '/settings/site'}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CogIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Настройки</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Лента активности */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Последняя активность</h3>
          </div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </AdminLayout>
  )
}
