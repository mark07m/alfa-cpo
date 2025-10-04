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
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface InspectionsReportsProps {
  period: {
    from: string;
    to: string;
  };
}

export function InspectionsReports({ period }: InspectionsReportsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Моковые данные для отчетов
  const overviewData = {
    total: 45,
    completed: 32,
    inProgress: 8,
    cancelled: 5,
    planned: 12
  };

  const statusData = [
    { name: 'Завершены', value: 32, color: '#10B981' },
    { name: 'В процессе', value: 8, color: '#F59E0B' },
    { name: 'Отменены', value: 5, color: '#EF4444' }
  ];

  const monthlyData = [
    { month: 'Янв', planned: 8, completed: 6, cancelled: 1 },
    { month: 'Фев', planned: 12, completed: 10, cancelled: 1 },
    { month: 'Мар', planned: 15, completed: 12, cancelled: 2 },
    { month: 'Апр', planned: 10, completed: 8, cancelled: 1 },
    { month: 'Май', planned: 18, completed: 15, cancelled: 1 },
    { month: 'Июн', planned: 14, completed: 11, cancelled: 2 }
  ];

  const inspectorData = [
    { name: 'Иванов И.И.', completed: 15, inProgress: 3, cancelled: 1 },
    { name: 'Петров П.П.', completed: 12, inProgress: 2, cancelled: 2 },
    { name: 'Сидоров С.С.', completed: 5, inProgress: 3, cancelled: 2 }
  ];

  const typeData = [
    { name: 'Плановые', value: 35, color: '#3B82F6' },
    { name: 'Внеплановые', value: 10, color: '#F59E0B' }
  ];

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: ChartBarIcon },
    { id: 'monthly', name: 'По месяцам', icon: CalendarIcon },
    { id: 'inspectors', name: 'По инспекторам', icon: CheckCircleIcon },
    { id: 'types', name: 'По типам', icon: ClockIcon }
  ];

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Экспорт отчета по проверкам в формате ${format}`);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Основные показатели */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Всего проверок</p>
              <p className="text-2xl font-semibold text-gray-900">{overviewData.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Завершены</p>
              <p className="text-2xl font-semibold text-gray-900">{overviewData.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">В процессе</p>
              <p className="text-2xl font-semibold text-gray-900">{overviewData.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-red-600" />
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

        {/* Распределение по типам */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Распределение по типам</h3>
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
      </div>
    </div>
  );

  const renderMonthly = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Динамика проверок по месяцам</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="planned" fill="#3B82F6" name="Запланировано" />
          <Bar dataKey="completed" fill="#10B981" name="Завершено" />
          <Bar dataKey="cancelled" fill="#EF4444" name="Отменено" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderInspectors = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Проверки по инспекторам</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={inspectorData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="completed" stackId="a" fill="#10B981" name="Завершены" />
          <Bar dataKey="inProgress" stackId="a" fill="#F59E0B" name="В процессе" />
          <Bar dataKey="cancelled" stackId="a" fill="#EF4444" name="Отменены" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderTypes = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Соотношение плановых и внеплановых проверок</h3>
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
                      ? 'border-blue-500 text-blue-600'
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
          {activeTab === 'inspectors' && renderInspectors()}
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
