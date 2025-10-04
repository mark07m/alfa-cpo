'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { ReportsDashboard } from '@/components/admin/reports/ReportsDashboard';
import { Button } from '@/components/admin/ui/Button';
import { DocumentArrowDownIcon, ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const [selectedReportType, setSelectedReportType] = useState('all');

  const handleExport = (format: 'pdf' | 'excel', reportType: string) => {
    console.log(`Экспорт отчета ${reportType} в формате ${format} за период ${selectedPeriod.from} - ${selectedPeriod.to}`);
    // Здесь будет логика экспорта
  };

  const reportTypes = [
    { id: 'all', name: 'Все отчеты', icon: ChartBarIcon },
    { id: 'inspections', name: 'Отчеты по проверкам', icon: CalendarIcon },
    { id: 'disciplinary', name: 'Отчеты по дисциплинарным мерам', icon: DocumentArrowDownIcon },
    { id: 'registry', name: 'Отчеты по реестру', icon: ChartBarIcon },
    { id: 'financial', name: 'Финансовые отчеты', icon: DocumentArrowDownIcon }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Отчеты и аналитика</h1>
            <p className="text-gray-600">Создание отчетов и аналитика по всем разделам</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => handleExport('excel', selectedReportType)}
              className="flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Excel</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('pdf', selectedReportType)}
              className="flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>PDF</span>
            </Button>
          </div>
        </div>

        {/* Фильтры */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Параметры отчета</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип отчета
              </label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата начала
              </label>
              <input
                type="date"
                value={selectedPeriod.from}
                onChange={(e) => setSelectedPeriod(prev => ({ ...prev, from: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата окончания
              </label>
              <input
                type="date"
                value={selectedPeriod.to}
                onChange={(e) => setSelectedPeriod(prev => ({ ...prev, to: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Дашборд отчетов */}
        <ReportsDashboard 
          period={selectedPeriod} 
          reportType={selectedReportType}
          onExport={handleExport}
        />
      </div>
    </AdminLayout>
  );
}
