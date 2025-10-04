'use client';

import { useState } from 'react';
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
  Line,
  Area,
  AreaChart
} from 'recharts';
import { Button } from '@/components/admin/ui/Button';
import { 
  DocumentArrowDownIcon,
  ChartBarIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface ReportsDashboardProps {
  period: {
    from: string;
    to: string;
  };
  reportType: string;
  onExport: (format: 'pdf' | 'excel', reportType: string) => void;
}

export function ReportsDashboard({ period, reportType, onExport }: ReportsDashboardProps) {
  const [activeSection, setActiveSection] = useState('summary');

  // Моковые данные для общего дашборда
  const summaryData = {
    inspections: {
      total: 45,
      completed: 32,
      inProgress: 8,
      cancelled: 5
    },
    disciplinaryMeasures: {
      total: 28,
      active: 15,
      appealed: 5,
      cancelled: 6
    },
    arbitrators: {
      total: 156,
      active: 142,
      suspended: 8,
      excluded: 6
    },
    financial: {
      totalIncome: 2450000,
      totalExpenses: 1890000,
      netIncome: 560000
    }
  };

  const monthlyTrends = [
    { month: 'Янв', inspections: 8, measures: 3, arbitrators: 2 },
    { month: 'Фев', inspections: 12, measures: 5, arbitrators: 1 },
    { month: 'Мар', inspections: 15, measures: 2, arbitrators: 3 },
    { month: 'Апр', inspections: 10, measures: 4, arbitrators: 1 },
    { month: 'Май', inspections: 18, measures: 6, arbitrators: 2 },
    { month: 'Июн', inspections: 14, measures: 8, arbitrators: 4 }
  ];

  const categoryData = [
    { name: 'Проверки', value: 45, color: '#3B82F6' },
    { name: 'Дисциплинарные меры', value: 28, color: '#EF4444' },
    { name: 'Арбитражные управляющие', value: 156, color: '#10B981' },
    { name: 'Финансовые операции', value: 12, color: '#F59E0B' }
  ];

  const financialData = [
    { month: 'Янв', income: 400000, expenses: 320000, net: 80000 },
    { month: 'Фев', income: 420000, expenses: 310000, net: 110000 },
    { month: 'Мар', income: 380000, expenses: 350000, net: 30000 },
    { month: 'Апр', income: 450000, expenses: 280000, net: 170000 },
    { month: 'Май', income: 500000, expenses: 400000, net: 100000 },
    { month: 'Июн', income: 300000, expenses: 230000, net: 70000 }
  ];

  const sections = [
    { id: 'summary', name: 'Сводка', icon: ChartBarIcon },
    { id: 'trends', name: 'Тренды', icon: CalendarIcon },
    { id: 'financial', name: 'Финансы', icon: CurrencyDollarIcon },
    { id: 'arbitrators', name: 'Реестр', icon: UserGroupIcon }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderSummary = () => (
    <div className="space-y-6">
      {/* Основные показатели */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Проверки</p>
              <p className="text-2xl font-semibold text-gray-900">{summaryData.inspections.total}</p>
              <p className="text-xs text-gray-500">
                Завершено: {summaryData.inspections.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Дисциплинарные меры</p>
              <p className="text-2xl font-semibold text-gray-900">{summaryData.disciplinaryMeasures.total}</p>
              <p className="text-xs text-gray-500">
                Действуют: {summaryData.disciplinaryMeasures.active}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Арбитражные управляющие</p>
              <p className="text-2xl font-semibold text-gray-900">{summaryData.arbitrators.total}</p>
              <p className="text-xs text-gray-500">
                Активные: {summaryData.arbitrators.active}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Финансы</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(summaryData.financial.netIncome)}
              </p>
              <p className="text-xs text-gray-500">
                Чистая прибыль
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Распределение по категориям */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Распределение по категориям</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Месячные тренды */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Месячные тренды</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="inspections" stroke="#3B82F6" name="Проверки" />
              <Line type="monotone" dataKey="measures" stroke="#EF4444" name="Дисциплинарные меры" />
              <Line type="monotone" dataKey="arbitrators" stroke="#10B981" name="Изменения в реестре" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Динамика активности по месяцам</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="inspections" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Проверки" />
            <Area type="monotone" dataKey="measures" stackId="1" stroke="#EF4444" fill="#EF4444" name="Дисциплинарные меры" />
            <Area type="monotone" dataKey="arbitrators" stackId="1" stroke="#10B981" fill="#10B981" name="Изменения в реестре" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderFinancial = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Финансовые показатели</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={financialData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="income" fill="#10B981" name="Доходы" />
            <Bar dataKey="expenses" fill="#EF4444" name="Расходы" />
            <Bar dataKey="net" fill="#3B82F6" name="Чистая прибыль" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(summaryData.financial.totalIncome)}
          </div>
          <div className="text-sm text-gray-500">Общие доходы</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(summaryData.financial.totalExpenses)}
          </div>
          <div className="text-sm text-gray-500">Общие расходы</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(summaryData.financial.netIncome)}
          </div>
          <div className="text-sm text-gray-500">Чистая прибыль</div>
        </div>
      </div>
    </div>
  );

  const renderArbitrators = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">
            {summaryData.arbitrators.active}
          </div>
          <div className="text-sm text-gray-500">Активные АУ</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {summaryData.arbitrators.suspended}
          </div>
          <div className="text-sm text-gray-500">Приостановлены</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-red-600">
            {summaryData.arbitrators.excluded}
          </div>
          <div className="text-sm text-gray-500">Исключены</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Статистика по реестру</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Всего в реестре</span>
            <span className="font-medium">{summaryData.arbitrators.total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Активные</span>
            <span className="font-medium text-green-600">{summaryData.arbitrators.active}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Приостановлены</span>
            <span className="font-medium text-yellow-600">{summaryData.arbitrators.suspended}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Исключены</span>
            <span className="font-medium text-red-600">{summaryData.arbitrators.excluded}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Навигация по разделам */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeSection === section.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeSection === 'summary' && renderSummary()}
          {activeSection === 'trends' && renderTrends()}
          {activeSection === 'financial' && renderFinancial()}
          {activeSection === 'arbitrators' && renderArbitrators()}
        </div>
      </div>

      {/* Кнопки экспорта */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={() => onExport('excel', reportType)}
          className="flex items-center space-x-2"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          <span>Экспорт в Excel</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => onExport('pdf', reportType)}
          className="flex items-center space-x-2"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          <span>Экспорт в PDF</span>
        </Button>
      </div>
    </div>
  );
}
