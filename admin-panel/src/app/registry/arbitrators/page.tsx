'use client';

import { useState, useCallback, useMemo } from 'react';
import { useArbitrators } from '@/hooks/admin/useArbitrators';
import { arbitratorsService } from '@/services/admin/arbitrators';
import { ArbitratorFilters, Arbitrator } from '@/types/admin';
import { PageWithTableSimple } from '@/components/admin/layout/PageWithTableSimple';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { ArbitratorsImportExport } from '@/components/admin/arbitrators/ArbitratorsImportExport';
import { 
  PlusIcon, 
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function ArbitratorsPage() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
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
    refetch
  } = useArbitrators();

  // Мемоизированные обработчики
  const handleCreate = useCallback(() => {
    router.push('/registry/arbitrators/create');
  }, [router]);

  const handleEdit = useCallback((id: string) => {
    router.push(`/registry/arbitrators/${id}/edit`);
  }, [router]);

  const handleView = useCallback((id: string) => {
    router.push(`/registry/arbitrators/${id}`);
  }, [router]);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этого арбитражного управляющего?')) {
      try {
        await deleteArbitrator(id);
        refetch();
      } catch (error) {
        console.error('Error deleting arbitrator:', error);
      }
    }
  }, [deleteArbitrator, refetch]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    
    if (confirm(`Вы уверены, что хотите удалить ${selectedIds.length} арбитражных управляющих?`)) {
      try {
        await bulkDelete(selectedIds);
        setSelectedIds([]);
        refetch();
      } catch (error) {
        console.error('Error bulk deleting arbitrators:', error);
      }
    }
  }, [selectedIds, bulkDelete, refetch]);

  const handleExport = useCallback(async () => {
    try {
      await exportArbitrators(filters);
    } catch (error) {
      console.error('Error exporting arbitrators:', error);
    }
  }, [exportArbitrators, filters]);

  const handleExportCsv = useCallback(async () => {
    try {
      const blob = await arbitratorsService.exportArbitratorsCsv(filters);
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `arbitrators-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export CSV error:', error);
    }
  }, [filters]);

  const handleImport = useCallback(async (file: File) => {
    try {
      const result = await importArbitrators(file);
      return result;
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  }, [importArbitrators]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    updateFilters({ search: value, page: 1 });
  }, [updateFilters]);

  const handleSort = useCallback((key: keyof Arbitrator, direction: 'asc' | 'desc') => {
    updateFilters({ 
      sortBy: key as string, 
      sortOrder: direction,
      page: 1 
    });
  }, [updateFilters]);

  const handlePageChange = useCallback((page: number) => {
    updateFilters({ page });
  }, [updateFilters]);

  // Мемоизированные колонки таблицы
  const columns = useMemo(() => [
    {
      key: 'select' as const,
      title: (
        <input
          type="checkbox"
          checked={selectedIds.length === arbitrators.length && arbitrators.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(arbitrators.map(a => a.id));
            } else {
              setSelectedIds([]);
            }
          }}
          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
        />
      ),
      width: 'w-12',
      className: 'text-center'
    },
    {
      key: 'fullName' as keyof Arbitrator,
      title: 'ФИО',
      sortable: true,
      render: (value: unknown, row: Arbitrator) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
            <UserIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.fullName}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status' as keyof Arbitrator,
      title: 'Статус',
      sortable: true,
      render: (value: unknown, row: Arbitrator) => {
        const statusColors = {
          active: 'green',
          inactive: 'gray',
          suspended: 'red',
          pending: 'yellow'
        } as const;
        
        return (
          <Badge 
            color={statusColors[row.status as keyof typeof statusColors] || 'gray'}
            variant="soft"
          >
            {row.status === 'active' ? 'Активен' : 
             row.status === 'inactive' ? 'Неактивен' :
             row.status === 'suspended' ? 'Приостановлен' : 'Ожидает'}
          </Badge>
        );
      }
    },
    {
      key: 'registrationNumber' as keyof Arbitrator,
      title: 'Регистрационный номер',
      sortable: true,
      render: (value: unknown) => (
        <span className="font-mono text-sm">{value as string}</span>
      )
    },
    {
      key: 'specializations' as keyof Arbitrator,
      title: 'Специализации',
      render: (value: unknown, row: Arbitrator) => (
        <div className="flex flex-wrap gap-1">
          {(row.specializations || []).slice(0, 2).map((spec, index) => (
            <Badge key={index} color="blue" size="sm" variant="outline">
              {spec}
            </Badge>
          ))}
          {(row.specializations || []).length > 2 && (
            <Badge color="gray" size="sm" variant="outline">
              +{(row.specializations || []).length - 2}
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'createdAt' as keyof Arbitrator,
      title: 'Дата регистрации',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-gray-500">
          {new Date(value as string).toLocaleDateString('ru-RU')}
        </span>
      )
    },
    {
      key: 'actions' as const,
      title: 'Действия',
      width: 'w-32',
      render: (value: unknown, row: Arbitrator) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(row.id)}
            icon={<EyeIcon className="h-4 w-4" />}
          >
            Просмотр
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.id)}
            icon={<PencilIcon className="h-4 w-4" />}
          >
            Редактировать
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
            icon={<TrashIcon className="h-4 w-4" />}
            className="text-red-600 hover:text-red-700"
          >
            Удалить
          </Button>
        </div>
      )
    }
  ], [arbitrators, selectedIds, handleView, handleEdit, handleDelete]);

  // Фильтры
  const filtersComponent = showFilters && (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <select
          value={filters.status || ''}
          onChange={(e) => updateFilters({ status: e.target.value || undefined, page: 1 })}
          className="rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        >
          <option value="">Все статусы</option>
          <option value="active">Активен</option>
          <option value="inactive">Неактивен</option>
          <option value="suspended">Приостановлен</option>
          <option value="pending">Ожидает</option>
        </select>
        
        <select
          value={filters.specialization || ''}
          onChange={(e) => updateFilters({ specialization: e.target.value || undefined, page: 1 })}
          className="rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        >
          <option value="">Все специализации</option>
          <option value="bankruptcy">Банкротство</option>
          <option value="reorganization">Реорганизация</option>
          <option value="liquidation">Ликвидация</option>
        </select>
        
        <input
          type="date"
          placeholder="Дата с"
          value={filters.dateFrom || ''}
          onChange={(e) => updateFilters({ dateFrom: e.target.value || undefined, page: 1 })}
          className="rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        />
        
        <input
          type="date"
          placeholder="Дата по"
          value={filters.dateTo || ''}
          onChange={(e) => updateFilters({ dateTo: e.target.value || undefined, page: 1 })}
          className="rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
        />
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={resetFilters}
          size="sm"
        >
          Сбросить фильтры
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(false)}
          size="sm"
        >
          Скрыть фильтры
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Арбитражные управляющие</h1>
        <p className="text-sm text-gray-500 mt-1">
          Управление реестром арбитражных управляющих
        </p>
      </div>

      <PageWithTableSimple
        data={arbitrators}
        loading={loading}
        error={error}
        columns={columns}
        pagination={pagination ? {
          currentPage: pagination.page,
          totalPages: pagination.pages,
          totalItems: pagination.total,
          itemsPerPage: pagination.limit,
          onPageChange: handlePageChange
        } : undefined}
        onSort={handleSort}
        sortKey={filters.sortBy as keyof Arbitrator}
        sortDirection={filters.sortOrder as 'asc' | 'desc'}
        searchValue={searchValue}
        onSearchChange={handleSearch}
        searchPlaceholder="Поиск по ФИО, email или номеру..."
        filters={filtersComponent}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        primaryAction={{
          label: 'Добавить управляющего',
          onClick: handleCreate,
          icon: <PlusIcon className="h-4 w-4" />
        }}
        secondaryActions={[
          <ArbitratorsImportExport
            key="import-export"
            onImport={handleImport}
            onExport={handleExport}
            onExportCsv={handleExportCsv}
            loading={loading}
          />,
          ...(selectedIds.length > 0 ? [{
            label: `Удалить выбранные (${selectedIds.length})`,
            onClick: handleBulkDelete,
            icon: <TrashIcon className="h-4 w-4" />,
            variant: 'danger' as const
          }] : [])
        ]}
        emptyState={{
          title: 'Нет арбитражных управляющих',
          description: 'Добавьте первого арбитражного управляющего в реестр',
          action: {
            label: 'Добавить управляющего',
            onClick: handleCreate
          }
        }}
        onRefresh={refetch}
      />
    </div>
  );
}