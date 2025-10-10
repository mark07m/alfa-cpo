'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { InspectionsList } from '@/components/admin/inspections/InspectionsList';
import { InspectionsFilters } from '@/components/admin/inspections/InspectionsFilters';
import { InspectionsActions } from '@/components/admin/inspections/InspectionsActions';
import { InspectionForm } from '@/components/admin/inspections/InspectionForm';
import { Button } from '@/components/admin/ui/Button';
import { PlusIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useInspections } from '@/hooks/admin/useInspections';

export default function InspectionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingInspection, setEditingInspection] = useState(null);
  const [selectedInspections, setSelectedInspections] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    inspector: '',
    dateFrom: '',
    dateTo: ''
  });

  const {
    inspections,
    loading,
    error,
    createInspection,
    updateInspection,
    deleteInspection,
    deleteInspections,
    refetch
  } = useInspections();

  const handleCreate = () => {
    setEditingInspection(null);
    setShowForm(true);
  };

  const handleEdit = (inspection: any) => {
    setEditingInspection(inspection);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingInspection(null);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingInspection) {
        await updateInspection(editingInspection.id, data);
      } else {
        await createInspection(data);
      }
      handleCloseForm();
      refetch();
    } catch (error) {
      console.error('Ошибка при сохранении проверки:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту проверку?')) {
      try {
        await deleteInspection(id);
        refetch();
      } catch (error) {
        console.error('Ошибка при удалении проверки:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedInspections.length === 0) return;
    if (confirm(`Вы уверены, что хотите удалить ${selectedInspections.length} проверок?`)) {
      try {
        await deleteInspections(selectedInspections);
        setSelectedInspections([]);
        refetch();
      } catch (error) {
        console.error('Ошибка при массовом удалении:', error);
      }
    }
  };

  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = !filters.search || 
      inspection.arbitratorName.toLowerCase().includes(filters.search.toLowerCase()) ||
      inspection.inspectorName.toLowerCase().includes(filters.search.toLowerCase()) ||
      inspection.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || inspection.status === filters.status;
    const matchesType = !filters.type || inspection.type === filters.type;
    const matchesInspector = !filters.inspector || inspection.inspectorName === filters.inspector;
    
    const matchesDateFrom = !filters.dateFrom || new Date(inspection.plannedDate) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(inspection.plannedDate) <= new Date(filters.dateTo);
    
    return matchesSearch && matchesStatus && matchesType && matchesInspector && matchesDateFrom && matchesDateTo;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Заголовок */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-primary-50 rounded-lg shadow-sm">
                  <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Управление проверками</h1>
                  <p className="text-base text-gray-600 mt-1">Планирование и учет проверок арбитражных управляющих</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className="bg-gray-50 px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm text-gray-500">Всего проверок:</span>
                  <span className="ml-2 text-lg font-bold text-gray-900">{inspections.length}</span>
                </div>
                <div className="bg-primary-50 px-4 py-2 rounded-lg shadow-sm border border-primary-200">
                  <span className="text-sm text-primary-600">Найдено:</span>
                  <span className="ml-2 text-lg font-bold text-primary-700">{filteredInspections.length}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                onClick={() => window.open('/inspections/calendar', '_blank')}
                className="flex items-center space-x-2 justify-start"
              >
                <CalendarIcon className="h-5 w-5" />
                <span className="font-medium">Календарь</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('/inspections/reports', '_blank')}
                className="flex items-center space-x-2 justify-start"
              >
                <ChartBarIcon className="h-5 w-5" />
                <span className="font-medium">Отчеты</span>
              </Button>
              <Button 
                variant="primary"
                onClick={handleCreate} 
                className="flex items-center space-x-2 justify-center"
              >
                <PlusIcon className="h-5 w-5" />
                <span className="font-semibold">Создать проверку</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <InspectionsFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={() => setFilters({
            search: '',
            status: '',
            type: '',
            inspector: '',
            dateFrom: '',
            dateTo: ''
          })}
        />

        {/* Массовые действия */}
        {selectedInspections.length > 0 && (
          <InspectionsActions
            selectedCount={selectedInspections.length}
            onBulkDelete={handleBulkDelete}
            onClearSelection={() => setSelectedInspections([])}
          />
        )}

        {/* Список проверок */}
        <InspectionsList
          inspections={filteredInspections}
          loading={loading}
          error={error}
          selectedInspections={selectedInspections}
          onSelectionChange={setSelectedInspections}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Форма создания/редактирования */}
        {showForm && (
          <InspectionForm
            inspection={editingInspection}
            onSave={handleSave}
            onCancel={handleCloseForm}
          />
        )}
      </div>
    </AdminLayout>
  );
}
