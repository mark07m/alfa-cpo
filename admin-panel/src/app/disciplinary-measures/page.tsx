'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { DisciplinaryMeasuresList } from '@/components/admin/disciplinary/DisciplinaryMeasuresList';
import { DisciplinaryMeasuresFilters } from '@/components/admin/disciplinary/DisciplinaryMeasuresFilters';
import { DisciplinaryMeasuresActions } from '@/components/admin/disciplinary/DisciplinaryMeasuresActions';
import { DisciplinaryMeasureForm } from '@/components/admin/disciplinary/DisciplinaryMeasureForm';
import { Button } from '@/components/admin/ui/Button';
import { PlusIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useDisciplinaryMeasures } from '@/hooks/admin/useDisciplinaryMeasures';

export default function DisciplinaryMeasuresPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingMeasure, setEditingMeasure] = useState(null);
  const [selectedMeasures, setSelectedMeasures] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    arbitrator: '',
    dateFrom: '',
    dateTo: ''
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
    setEditingMeasure(null);
    setShowForm(true);
  };

  const handleEdit = (measure: any) => {
    setEditingMeasure(measure);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMeasure(null);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingMeasure) {
        await updateMeasure(editingMeasure.id, data);
      } else {
        await createMeasure(data);
      }
      handleCloseForm();
      refetch();
    } catch (error) {
      console.error('Ошибка при сохранении дисциплинарной меры:', error);
    }
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
      measure.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      measure.reason.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = !filters.type || measure.type === filters.type;
    const matchesStatus = !filters.status || measure.status === filters.status;
    const matchesArbitrator = !filters.arbitrator || measure.arbitratorName === filters.arbitrator;
    
    const matchesDateFrom = !filters.dateFrom || new Date(measure.date) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(measure.date) <= new Date(filters.dateTo);
    
    return matchesSearch && matchesType && matchesStatus && matchesArbitrator && matchesDateFrom && matchesDateTo;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Дисциплинарные меры</h1>
            <p className="text-gray-600">Учет и управление дисциплинарными мерами</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => window.open('/disciplinary-measures/reports', '_blank')}
              className="flex items-center space-x-2"
            >
              <ChartBarIcon className="h-5 w-5" />
              <span>Отчеты</span>
            </Button>
            <Button onClick={handleCreate} className="flex items-center space-x-2">
              <PlusIcon className="h-5 w-5" />
              <span>Создать меру</span>
            </Button>
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
            dateTo: ''
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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Форма создания/редактирования */}
        {showForm && (
          <DisciplinaryMeasureForm
            measure={editingMeasure}
            onSave={handleSave}
            onCancel={handleCloseForm}
          />
        )}
      </div>
    </AdminLayout>
  );
}
