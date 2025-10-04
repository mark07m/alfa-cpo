'use client';

import { useState } from 'react';
import { useArbitrators } from '@/hooks/admin/useArbitrators';
import { ArbitratorFilters } from '@/types/admin';
import { ArbitratorsList } from '@/components/admin/arbitrators/ArbitratorsList';
import { ArbitratorsFilters } from '@/components/admin/arbitrators/ArbitratorsFilters';
import { ArbitratorsActions } from '@/components/admin/arbitrators/ArbitratorsActions';
import { Button } from '@/components/admin/ui/Button';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PlusIcon, DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function ArbitratorsPage() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  
  const {
    arbitrators,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    resetFilters,
    deleteArbitrator,
    bulkUpdateStatus,
    bulkDelete,
    exportArbitrators,
    importArbitrators,
  } = useArbitrators();

  console.log('ArbitratorsPage - arbitrators:', arbitrators);
  console.log('ArbitratorsPage - loading:', loading);
  console.log('ArbitratorsPage - error:', error);

  const handleCreate = () => {
    router.push('/registry/arbitrators/create');
  };

  const handleEdit = (id: string) => {
    router.push(`/registry/arbitrators/${id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/registry/arbitrators/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этого арбитражного управляющего?')) {
      try {
        await deleteArbitrator(id);
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const handleBulkStatusUpdate = async (status: 'active' | 'excluded' | 'suspended') => {
    if (selectedIds.length === 0) return;
    
    if (confirm(`Вы уверены, что хотите изменить статус ${selectedIds.length} арбитражных управляющих на "${status}"?`)) {
      try {
        await bulkUpdateStatus(selectedIds, status);
        setSelectedIds([]);
      } catch (error) {
        console.error('Ошибка массового обновления статуса:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    if (confirm(`Вы уверены, что хотите удалить ${selectedIds.length} арбитражных управляющих?`)) {
      try {
        await bulkDelete(selectedIds);
        setSelectedIds([]);
      } catch (error) {
        console.error('Ошибка массового удаления:', error);
      }
    }
  };

  const handleExport = async () => {
    try {
      await exportArbitrators();
    } catch (error) {
      console.error('Ошибка экспорта:', error);
    }
  };

  const handleImport = async (file: File) => {
    try {
      const result = await importArbitrators(file);
      setShowImportModal(false);
      
      if (result.errors.length > 0) {
        alert(`Импорт завершен с ошибками:\n${result.errors.join('\n')}`);
      } else {
        alert(`Успешно импортировано ${result.success} записей`);
      }
    } catch (error) {
      console.error('Ошибка импорта:', error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(arbitrators.map(arbitrator => arbitrator.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  return (
    <AdminLayout
      title="Арбитражные управляющие"
    >
      <div className="space-y-6">
        {/* Описание и действия */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Управление реестром арбитражных управляющих
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowImportModal(true)}
              className="flex items-center space-x-2"
            >
              <DocumentArrowUpIcon className="h-4 w-4" />
              <span>Импорт</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span>Экспорт</span>
            </Button>
            <Button
              onClick={handleCreate}
              className="flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Добавить</span>
            </Button>
          </div>
        </div>

        {/* Фильтры */}
        <ArbitratorsFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
        />

        {/* Массовые действия */}
        {selectedIds.length > 0 && (
          <ArbitratorsActions
            selectedCount={selectedIds.length}
            onStatusUpdate={handleBulkStatusUpdate}
            onDelete={handleBulkDelete}
            onClearSelection={() => setSelectedIds([])}
          />
        )}

        {/* Список */}
        <ArbitratorsList
          arbitrators={arbitrators}
          loading={loading}
          error={error}
          pagination={pagination}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onFiltersChange={updateFilters}
        />

        {/* Модальное окно импорта */}
        {showImportModal && (
          <ImportModal
            onClose={() => setShowImportModal(false)}
            onImport={handleImport}
          />
        )}
      </div>
    </AdminLayout>
  );
}

// Компонент модального окна импорта
function ImportModal({ onClose, onImport }: { onClose: () => void; onImport: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      await onImport(file);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Импорт арбитражных управляющих</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Выберите файл Excel или CSV
              </label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={!file || loading}
              >
                {loading ? 'Импорт...' : 'Импортировать'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
