'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AccreditedOrganizationsList } from '@/components/admin/accreditedOrganizations/AccreditedOrganizationsList';
import { AccreditedOrganizationsFilters } from '@/components/admin/accreditedOrganizations/AccreditedOrganizationsFilters';
import { AccreditedOrganizationsActions } from '@/components/admin/accreditedOrganizations/AccreditedOrganizationsActions';
import { useAccreditedOrganizations } from '@/hooks/admin/useAccreditedOrganizations';
import { AccreditedOrganizationFilters } from '@/types/admin';
import { Button } from '@/components/admin/ui/Button';
import { 
  BuildingOfficeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function AccreditedOrganizationsPage() {
  const router = useRouter();
  const {
    organizations,
    loading,
    error,
    pagination,
    fetchOrganizations,
    deleteOrganization,
    deleteOrganizations
  } = useAccreditedOrganizations();

  const [filters, setFilters] = useState<AccreditedOrganizationFilters>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Загрузка данных при изменении фильтров или страницы
  useEffect(() => {
    fetchOrganizations(filters, { page: currentPage, limit: 10 });
  }, [filters, currentPage, fetchOrganizations]);

  const handleFiltersChange = (newFilters: AccreditedOrganizationFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSelectOne = (id: string, selected: boolean) => {
    setSelectedIds(prev => 
      selected 
        ? [...prev, id]
        : prev.filter(selectedId => selectedId !== id)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(organizations.map(org => org.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/registry/accredited-organizations/${id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/registry/accredited-organizations/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту организацию?')) {
      try {
        await deleteOrganization(id);
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      } catch (error) {
        console.error('Ошибка удаления организации:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`Вы уверены, что хотите удалить ${selectedIds.length} организаций?`)) {
      try {
        await deleteOrganizations(selectedIds);
        setSelectedIds([]);
      } catch (error) {
        console.error('Ошибка массового удаления:', error);
      }
    }
  };

  const handleAdd = () => {
    router.push('/registry/accredited-organizations/create');
  };

  const handleExport = () => {
    // TODO: Реализовать экспорт в PDF
    console.log('Экспорт в PDF');
  };

  const handleExportExcel = () => {
    // TODO: Реализовать экспорт в Excel
    console.log('Экспорт в Excel');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Ошибка загрузки</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <div className="mt-6">
          <Button onClick={() => fetchOrganizations(filters, { page: currentPage })}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Аккредитованные организации</h1>
        <p className="text-sm text-gray-500 mt-1">
          Управление реестром аккредитованных организаций
        </p>
      </div>

      {/* Статистика */}
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
          <span>Всего: {pagination.total}</span>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center text-blue-600">
            <span>Выбрано: {selectedIds.length}</span>
          </div>
        )}
      </div>

        {/* Фильтры */}
        <AccreditedOrganizationsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {/* Действия */}
        <AccreditedOrganizationsActions
          selectedCount={selectedIds.length}
          onAdd={handleAdd}
          onBulkDelete={handleBulkDelete}
          onExport={handleExport}
          onExportExcel={handleExportExcel}
        />

        {/* Список организаций */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-500">Загрузка...</p>
          </div>
        ) : (
          <AccreditedOrganizationsList
            organizations={organizations}
            selectedIds={selectedIds}
            onSelectOne={handleSelectOne}
            onSelectAll={handleSelectAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onBulkDelete={handleBulkDelete}
          />
        )}

        {/* Пагинация */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Предыдущая
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
              >
                Следующая
              </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Показано{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * pagination.limit + 1}
                  </span>{' '}
                  -{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pagination.limit, pagination.total)}
                  </span>{' '}
                  из{' '}
                  <span className="font-medium">{pagination.total}</span>{' '}
                  результатов
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    Предыдущая
                  </Button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      onClick={() => handlePageChange(page)}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    Следующая
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
