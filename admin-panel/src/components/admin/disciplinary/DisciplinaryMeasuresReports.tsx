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
  Line
} from 'recharts';
import { Button } from '@/components/admin/ui/Button';
import { 
  DocumentArrowDownIcon,
  ChartBarIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface DisciplinaryMeasuresReportsProps {
  period: {
    from: string;
    to: string;
  };
}

export function DisciplinaryMeasuresReports({ period }: DisciplinaryMeasuresReportsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Моковые данные для отчетов
  const overviewData = {
    total: 28,
    active: 15,
    appealed: 5,
    cancelled: 6,
    expired: 2
  };

  const typeData = [
    { name: 'Предупреждения', value: 12, color: '#F59E0B' },
    { name: 'Выговоры', value: 8, color: '#EF4444' },
    { name: 'Приостановления', value: 5, color: '#DC2626' },
    { name: 'Исключения', value: 3, color: '#991B1B' }
  ];

  const monthlyData = [
    { month: 'Янв', warnings: 2, reprimands: 1, suspensions: 0, exclusions: 0 },
    { month: 'Фев', warnings: 3, reprimands: 2, suspensions: 1, exclusions: 0 },
    { month: 'Мар', warnings: 1, reprimands: 1, suspensions: 0, exclusions: 1 },
    { month: 'Апр', warnings: 2, reprimands: 2, suspensions: 1, exclusions: 0 },
    { month: 'Май', warnings: 3, reprimands: 1, suspensions: 2, exclusions: 1 },
    { month: 'Июн', warnings: 1, reprimands: 1, suspensions: 1, exclusions: 1 }
  ];

  const arbitratorData = [
    { name: 'Иванов И.И.', measures: 8, active: 5, cancelled: 3 },
    { name: 'Петров П.П.', measures: 6, active: 4, cancelled: 2 },
    { name: 'Сидоров С.С.', measures: 4, active: 3, cancelled: 1 },
    { name: 'Козлов К.К.', measures: 3, active: 2, cancelled: 1 },
    { name: 'Морозов М.М.', measures: 2, active: 1, cancelled: 1 }
  ];

  const statusData = [
    { name: 'Действуют', value: 15, color: '#EF4444' },
    { name: 'Обжалуются', value: 5, color: '#F59E0B' },
    { name: 'Отменены', value: 6, color: '#10B981' },
    { name: 'Истекли', value: 2, color: '#6B7280' }
  ];

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: ChartBarIcon },
    { id: 'monthly', name: 'По месяцам', icon: CalendarIcon },
    { id: 'arbitrators', name: 'По АУ', icon: ExclamationTriangleIcon },
    { id: 'types', name: 'По типам', icon: CheckCircleIcon }
  ];

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Экспорт отчета по дисциплинарным мерам в формате ${format}`);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Основные показатели */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Всего мер</p>
              <p className="text-2xl font-semibold text-gray-900">{overviewData.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Действуют</p>
              <p className="text-2xl font-semibold text-gray-900">{overviewData.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Обжалуются</p>
              <p className="text-2xl font-semibold text-gray-900">{overviewData.appealed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Отменены</p>
              <p className="text-2xl font-semibold text-gray-900">{overviewData.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Распределение по типам */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Распределение по типам мер</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Распределение по статусам */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Распределение по статусам</h3>
          <ResponsiveContainer width="100%" height={300}>
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderMonthly = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Динамика дисциплинарных мер по месяцам</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="warnings" fill="#F59E0B" name="Предупреждения" />
          <Bar dataKey="reprimands" fill="#EF4444" name="Выговоры" />
          <Bar dataKey="suspensions" fill="#DC2626" name="Приостановления" />
          <Bar dataKey="exclusions" fill="#991B1B" name="Исключения" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderArbitrators = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Дисциплинарные меры по арбитражным управляющим</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={arbitratorData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="measures" stackId="a" fill="#EF4444" name="Всего мер" />
          <Bar dataKey="active" stackId="a" fill="#F59E0B" name="Действуют" />
          <Bar dataKey="cancelled" stackId="a" fill="#10B981" name="Отменены" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderTypes = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Детальное распределение по типам мер</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {typeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-900">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Статистика по эффективности */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Статистика эффективности мер</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">71%</div>
            <div className="text-sm text-gray-500">Меры действуют</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">21%</div>
            <div className="text-sm text-gray-500">Отменены</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">18%</div>
            <div className="text-sm text-gray-500">Обжалуются</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Вкладки */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'monthly' && renderMonthly()}
          {activeTab === 'arbitrators' && renderArbitrators()}
          {activeTab === 'types' && renderTypes()}
        </div>
      </div>

      {/* Кнопки экспорта */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={() => handleExport('excel')}
          className="flex items-center space-x-2"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          <span>Экспорт в Excel</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => handleExport('pdf')}
          className="flex items-center space-x-2"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          <span>Экспорт в PDF</span>
        </Button>
      </div>
    </div>
  );
}
