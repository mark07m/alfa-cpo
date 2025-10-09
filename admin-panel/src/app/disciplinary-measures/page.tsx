'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { DisciplinaryMeasuresList } from '@/components/admin/disciplinary/DisciplinaryMeasuresList';
import { DisciplinaryMeasuresFilters } from '@/components/admin/disciplinary/DisciplinaryMeasuresFilters';
import { DisciplinaryMeasuresActions } from '@/components/admin/disciplinary/DisciplinaryMeasuresActions';
import { DisciplinaryMeasureForm } from '@/components/admin/disciplinary/DisciplinaryMeasureForm';
import { Button } from '@/components/admin/ui/Button';
import { PlusIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useDisciplinaryMeasures } from '@/hooks/admin/useDisciplinaryMeasures';

export default function DisciplinaryMeasuresPage() {
  const router = useRouter();
  const [selectedMeasures, setSelectedMeasures] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    arbitrator: '',
    dateFrom: '',
    dateTo: '',
    appealStatus: '',
    managerId: ''
  });

  const {
    measures,
    loading,
    error,
    createMeasure,
    updateMeasure,
    deleteMeasure,
    deleteMeasures,
    refetch
  } = useDisciplinaryMeasures();

  const handleCreate = () => {
    router.push('/disciplinary-measures/new');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту дисциплинарную меру?')) {
      try {
        await deleteMeasure(id);
        refetch();
      } catch (error) {
        console.error('Ошибка при удалении дисциплинарной меры:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMeasures.length === 0) return;
    if (confirm(`Вы уверены, что хотите удалить ${selectedMeasures.length} дисциплинарных мер?`)) {
      try {
        await deleteMeasures(selectedMeasures);
        setSelectedMeasures([]);
        refetch();
      } catch (error) {
        console.error('Ошибка при массовом удалении:', error);
      }
    }
  };

  const filteredMeasures = measures.filter(measure => {
    const matchesSearch = !filters.search || 
      measure.arbitratorName.toLowerCase().includes(filters.search.toLowerCase()) ||
      measure.reason.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = !filters.type || measure.type === filters.type;
    const matchesStatus = !filters.status || measure.status === filters.status;
    const matchesAppealStatus = !filters.appealStatus || (measure as any).appealResult === filters.appealStatus || (measure as any).appealStatus === filters.appealStatus;
    const matchesArbitrator = !filters.arbitrator || measure.arbitratorName === filters.arbitrator;
    const matchesManagerId = !filters.managerId || measure.arbitratorId === filters.managerId;
    
    const matchesDateFrom = !filters.dateFrom || new Date(measure.date) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(measure.date) <= new Date(filters.dateTo);
    
    return matchesSearch && matchesType && matchesStatus && matchesAppealStatus && matchesArbitrator && matchesManagerId && matchesDateFrom && matchesDateTo;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border border-red-100 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Дисциплинарные меры</h1>
                  <p className="text-base text-gray-600 mt-1">Учет и управление дисциплинарными мерами</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm text-gray-500">Всего мер:</span>
                  <span className="ml-2 text-lg font-bold text-gray-900">{measures.length}</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm text-gray-500">Найдено:</span>
                  <span className="ml-2 text-lg font-bold text-red-600">{filteredMeasures.length}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                onClick={() => window.open('/disciplinary-measures/reports', '_blank')}
                className="flex items-center space-x-2 justify-start hover:bg-white hover:border-red-300 hover:shadow-md transition-all duration-200"
              >
                <ChartBarIcon className="h-5 w-5 text-red-600" />
                <span className="font-medium">Отчеты</span>
              </Button>
              <Button 
                onClick={handleCreate} 
                className="flex items-center space-x-2 justify-center bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <PlusIcon className="h-5 w-5" />
                <span className="font-semibold">Создать меру</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <DisciplinaryMeasuresFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={() => setFilters({
            search: '',
            type: '',
            status: '',
            arbitrator: '',
            dateFrom: '',
            dateTo: '',
            appealStatus: '',
            managerId: ''
          })}
        />

        {/* Массовые действия */}
        {selectedMeasures.length > 0 && (
          <DisciplinaryMeasuresActions
            selectedCount={selectedMeasures.length}
            onBulkDelete={handleBulkDelete}
            onClearSelection={() => setSelectedMeasures([])}
          />
        )}

        {/* Список дисциплинарных мер */}
        <DisciplinaryMeasuresList
          measures={filteredMeasures}
          loading={loading}
          error={error}
          selectedMeasures={selectedMeasures}
          onSelectionChange={setSelectedMeasures}
          onEdit={() => {}}
          onDelete={handleDelete}
        />

        {/* Форма создания перенесена на отдельную страницу */}
      </div>
    </AdminLayout>
  );
}
