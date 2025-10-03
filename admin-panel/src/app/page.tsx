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
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { stats, activities, isLoading, error } = useDashboard()
  const { data: activityData, isLoading: isActivityLoading } = useActivityData(30)

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
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <ExclamationTriangleIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки данных</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </AdminLayout>
    )
  }

  const statCards = [
    {
      title: 'Новости',
      value: stats?.totalNews || 0,
      change: {
        value: '+12%',
        type: 'positive' as const,
        period: 'месяц'
      },
      icon: NewspaperIcon,
      href: '/news'
    },
    {
      title: 'Мероприятия',
      value: stats?.totalEvents || 0,
      change: {
        value: '+2',
        type: 'positive' as const,
        period: 'неделя'
      },
      icon: CalendarIcon,
      href: '/events'
    },
    {
      title: 'Документы',
      value: stats?.totalDocuments || 0,
      change: {
        value: '+23',
        type: 'positive' as const,
        period: 'месяц'
      },
      icon: DocumentTextIcon,
      href: '/documents'
    },
    {
      title: 'Арбитражные управляющие',
      value: stats?.totalArbitrators || 0,
      change: {
        value: `+${(stats?.totalArbitrators || 0) - (stats?.activeArbitrators || 0)}`,
        type: 'positive' as const,
        period: 'месяц'
      },
      icon: UserGroupIcon,
      href: '/registry/arbitrators'
    },
    {
      title: 'Проверки',
      value: stats?.pendingInspections || 0,
      change: {
        value: '3 в процессе',
        type: 'neutral' as const
      },
      icon: ClipboardDocumentListIcon,
      href: '/inspections'
    },
    {
      title: 'Дисциплинарные меры',
      value: '2',
      change: {
        value: '1 новое',
        type: 'negative' as const
      },
      icon: ExclamationTriangleIcon,
      href: '/disciplinary-measures'
    }
  ]

  return (
    <AdminLayout title="Дашборд">
      <div className="space-y-8">
        {/* Статистические карточки */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              href={stat.href}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* График активности */}
          <ActivityChart
            data={activityData}
            title="Активность за 30 дней"
            className="lg:col-span-1"
          />

          {/* Последняя активность */}
          <ActivityFeed
            activities={activities}
            title="Последняя активность"
            maxItems={8}
            className="lg:col-span-1"
          />
        </div>

        {/* Быстрые действия */}
        <QuickActions
          title="Быстрые действия"
          columns={4}
        />
      </div>
    </AdminLayout>
  )
}