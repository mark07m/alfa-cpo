'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { DisciplinaryMeasuresReports } from '@/components/admin/disciplinary/DisciplinaryMeasuresReports';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function DisciplinaryMeasuresReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Экспорт отчетов по дисциплинарным мерам в формате ${format} за период ${selectedPeriod.from} - ${selectedPeriod.to}`);
    // Здесь будет логика экспорта
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Назад</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Отчеты по дисциплинарным мерам</h1>
              <p className="text-gray-600">Аналитика и отчетность по дисциплинарным мерам</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => handleExport('excel')}
              className="flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Excel</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>PDF</span>
            </Button>
          </div>
        </div>

        {/* Фильтры периода */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Период отчета</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата начала
              </label>
              <Input
                type="date"
                value={selectedPeriod.from}
                onChange={(e) => setSelectedPeriod(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата окончания
              </label>
              <Input
                type="date"
                value={selectedPeriod.to}
                onChange={(e) => setSelectedPeriod(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Отчеты */}
        <DisciplinaryMeasuresReports period={selectedPeriod} />
      </div>
    </AdminLayout>
  );
}
