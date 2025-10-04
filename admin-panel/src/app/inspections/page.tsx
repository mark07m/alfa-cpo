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
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление проверками</h1>
            <p className="text-gray-600">Планирование и учет проверок арбитражных управляющих</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => window.open('/inspections/calendar', '_blank')}
              className="flex items-center space-x-2"
            >
              <CalendarIcon className="h-5 w-5" />
              <span>Календарь</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('/inspections/reports', '_blank')}
              className="flex items-center space-x-2"
            >
              <ChartBarIcon className="h-5 w-5" />
              <span>Отчеты</span>
            </Button>
            <Button onClick={handleCreate} className="flex items-center space-x-2">
              <PlusIcon className="h-5 w-5" />
              <span>Создать проверку</span>
            </Button>
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
