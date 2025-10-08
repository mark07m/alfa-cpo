'use client';

import { useAccreditedOrganizationStats } from '@/hooks/admin/useAccreditedOrganizations';
import { StatCard } from '@/components/admin/ui/StatCard';
import { 
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];

export default function AccreditedOrganizationsStatisticsPage() {
  const { stats, loading, error } = useAccreditedOrganizationStats();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-500">Загрузка статистики...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Ошибка загрузки</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Нет данных</h3>
        <p className="mt-1 text-sm text-gray-500">Статистика недоступна</p>
      </div>
    );
  }

  const statusData = [
    { name: 'Активные', value: stats.active, color: '#10B981' },
    { name: 'Приостановленные', value: stats.suspended, color: '#F59E0B' },
    { name: 'Отозванные', value: stats.revoked, color: '#EF4444' },
    { name: 'Истекшие', value: stats.expired, color: '#6B7280' }
  ];

  const typeData = [
    { name: 'Образовательные', value: stats.byType.educational },
    { name: 'Обучающие', value: stats.byType.training },
    { name: 'Оценочные', value: stats.byType.assessment },
    { name: 'Прочие', value: stats.byType.other }
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Статистика аккредитованных организаций</h1>
        <p className="text-sm text-gray-500 mt-1">
          Аналитика и отчеты по реестру аккредитованных организаций
        </p>
      </div>

        {/* Основная статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Всего организаций"
            value={stats.total}
            icon={BuildingOfficeIcon}
            color="blue"
          />
          <StatCard
            title="Активные"
            value={stats.active}
            icon={CheckCircleIcon}
            color="green"
          />
          <StatCard
            title="Приостановленные"
            value={stats.suspended}
            icon={ClockIcon}
            color="yellow"
          />
          <StatCard
            title="Отозванные"
            value={stats.revoked}
            icon={XCircleIcon}
            color="red"
          />
        </div>

        {/* Дополнительная статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Истекшие"
            value={stats.expired}
            icon={ExclamationTriangleIcon}
            color="gray"
          />
          <StatCard
            title="Добавлено недавно"
            value={stats.recentAdditions}
            icon={ChartBarIcon}
            color="blue"
          />
          <StatCard
            title="Истекают скоро"
            value={stats.expiringSoon}
            icon={ClockIcon}
            color="orange"
          />
        </div>

        {/* Графики */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Распределение по статусам */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Распределение по статусам
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Распределение по типам */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Распределение по типам
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Детальная статистика */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Детальная статистика
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.byType.educational}</div>
              <div className="text-sm text-gray-500">Образовательные</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.byType.training}</div>
              <div className="text-sm text-gray-500">Обучающие</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.byType.assessment}</div>
              <div className="text-sm text-gray-500">Оценочные</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.byType.other}</div>
              <div className="text-sm text-gray-500">Прочие</div>
            </div>
          </div>
        </div>
    </div>
  );
}
