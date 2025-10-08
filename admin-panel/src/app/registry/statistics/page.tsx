'use client';

import { useArbitratorStats } from '@/hooks/admin/useArbitrators';
import { StatCard } from '@/components/admin/ui/StatCard';
import { 
  UserGroupIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  MapIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'];

export default function RegistryStatisticsPage() {
  const { stats, loading, error } = useArbitratorStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">Загрузка данных...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">Ошибка загрузки данных</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">Нет данных для отображения</p>
        </div>
      </div>
    );
  }

  // Дополнительная проверка структуры данных
  if (!stats || typeof stats !== 'object') {
    console.error('Invalid stats object:', stats);
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-red-500">Ошибка: некорректные данные статистики</p>
        </div>
      </div>
    );
  }

  // Подготовка данных для графиков с проверкой на существование массивов
  console.log('Stats object:', stats);
  console.log('byStatus:', stats.byStatus, 'type:', typeof stats.byStatus, 'isArray:', Array.isArray(stats.byStatus));
  console.log('byRegion:', stats.byRegion, 'type:', typeof stats.byRegion, 'isArray:', Array.isArray(stats.byRegion));
  
  const statusData = Array.isArray(stats.byStatus) ? stats.byStatus.map((item, index) => ({
    name: item.status === 'active' ? 'Действительные' : 
          item.status === 'excluded' ? 'Исключенные' : 'Приостановленные',
    value: item.count || 0,
    color: COLORS[index % COLORS.length]
  })) : [];

  const regionData = Array.isArray(stats.byRegion) ? stats.byRegion.slice(0, 10).map((item, index) => ({
    name: item.region || 'Неизвестно',
    count: item.count || 0,
    color: COLORS[index % COLORS.length]
  })) : [];

  // Моковые данные для динамики (в реальном приложении будут из API)
  const dynamicsData = [
    { month: 'Янв', additions: 5, exclusions: 1 },
    { month: 'Фев', additions: 8, exclusions: 2 },
    { month: 'Мар', additions: 12, exclusions: 1 },
    { month: 'Апр', additions: 6, exclusions: 3 },
    { month: 'Май', additions: 15, exclusions: 2 },
    { month: 'Июн', additions: 10, exclusions: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Статистика реестра</h1>
        <p className="text-sm text-gray-500 mt-1">
          Аналитика и отчеты по реестру арбитражных управляющих
        </p>
      </div>

      {/* Основные показатели */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Всего в реестре"
          value={stats.total || 0}
          icon={UserGroupIcon}
          change={{
            value: `+${stats.recentAdditions || 0}`,
            type: 'positive',
            period: 'за месяц'
          }}
        />
        <StatCard
          title="Действительные"
          value={stats.active || 0}
          icon={CheckCircleIcon}
          change={{
            value: `${Math.round(((stats.active || 0) / (stats.total || 1)) * 100)}%`,
            type: 'positive',
            period: 'от общего числа'
          }}
        />
        <StatCard
          title="Исключенные"
          value={stats.excluded || 0}
          icon={XCircleIcon}
          change={{
            value: `+${stats.recentExclusions || 0}`,
            type: 'negative',
            period: 'за месяц'
          }}
        />
        <StatCard
          title="Приостановленные"
          value={stats.suspended || 0}
          icon={ExclamationTriangleIcon}
          change={{
            value: `${Math.round(((stats.suspended || 0) / (stats.total || 1)) * 100)}%`,
            type: 'neutral',
            period: 'от общего числа'
          }}
        />
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Распределение по статусам */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Распределение по статусам
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value, 'человек']}
                  labelFormatter={(label: string) => `Статус: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Топ регионов */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MapIcon className="h-5 w-5 mr-2" />
            Топ регионов
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip 
                  formatter={(value: number) => [value, 'человек']}
                  labelFormatter={(label: string) => `Регион: ${label}`}
                />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Динамика изменений */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Динамика изменений за последние 6 месяцев
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dynamicsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  value, 
                  name === 'additions' ? 'Добавлено' : 'Исключено'
                ]}
                labelFormatter={(label: string) => `Месяц: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="additions" 
                stroke="#10B981" 
                strokeWidth={2}
                name="additions"
              />
              <Line 
                type="monotone" 
                dataKey="exclusions" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="exclusions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Добавлено</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Исключено</span>
          </div>
        </div>
      </div>

      {/* Дополнительная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Средний возраст в реестре</h4>
          <div className="text-2xl font-bold text-blue-600">42 года</div>
          <p className="text-sm text-gray-500 mt-1">Средний возраст арбитражных управляющих</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Средний стаж</h4>
          <div className="text-2xl font-bold text-green-600">8.5 лет</div>
          <p className="text-sm text-gray-500 mt-1">Средний стаж работы в качестве АУ</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Активность</h4>
          <div className="text-2xl font-bold text-purple-600">94%</div>
          <p className="text-sm text-gray-500 mt-1">Процент действующих управляющих</p>
        </div>
      </div>
    </div>
  );
}
