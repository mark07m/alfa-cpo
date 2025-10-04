import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Table } from '@/components/admin/ui/Table';
import { LoadingCard } from '@/components/admin/ui/LoadingSpinner';
import { EmptyTableState } from '@/components/admin/ui/EmptyState';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

interface PageWithTableProps<T> {
  // Данные
  data: T[];
  loading: boolean;
  error: string | null;
  
  // Таблица
  columns: Array<{
    key: keyof T | 'actions' | 'select';
    title: string | React.ReactNode;
    sortable?: boolean;
    render?: (value: unknown, row: T) => React.ReactNode;
    width?: string;
    className?: string;
  }>;
  
  // Пагинация
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
  
  // Сортировка
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
  
  // Поиск и фильтры
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  filters?: React.ReactNode;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  
  // Действия
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  }>;
  
  // Пустое состояние
  emptyState?: {
    title?: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  
  // Обновление
  onRefresh?: () => void;
  refreshing?: boolean;
  
  className?: string;
}

export function PageWithTable<T extends { id: string }>({
  data,
  loading,
  error,
  columns,
  pagination,
  onSort,
  sortKey,
  sortDirection,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Поиск...',
  filters,
  showFilters = false,
  onToggleFilters,
  title,
  description,
  primaryAction,
  secondaryActions,
  emptyState,
  onRefresh,
  refreshing = false,
  className
}: PageWithTableProps<T>) {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  if (loading) {
    return <LoadingCard text="Загрузка данных..." />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Заголовок и действия */}
      {(title || primaryAction || secondaryActions) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {title && (
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {secondaryActions?.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                  icon={action.icon}
                >
                  {action.label}
                </Button>
              ))}
              
              {primaryAction && (
                <Button
                  variant="primary"
                  onClick={primaryAction.onClick}
                  icon={primaryAction.icon}
                >
                  {primaryAction.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Поиск и фильтры */}
      {(onSearchChange || filters) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {onSearchChange && (
              <div className="flex-1">
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-4 w-4" />}
                />
              </div>
            )}
            
            {filters && (
              <div className="flex gap-2">
                {onToggleFilters && (
                  <Button
                    variant="outline"
                    onClick={onToggleFilters}
                    className={showFilters ? 'bg-gray-100' : ''}
                  >
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    Фильтры
                  </Button>
                )}
                {filters}
              </div>
            )}
            
            {onRefresh && (
              <Button
                variant="ghost"
                onClick={handleRefresh}
                loading={refreshing}
                icon={<ArrowPathIcon className="h-4 w-4" />}
              >
                Обновить
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Таблица */}
      <div className="bg-white rounded-lg border border-gray-200">
        {data.length === 0 ? (
          <EmptyTableState
            title={emptyState?.title}
            description={emptyState?.description}
            action={emptyState?.action}
          />
        ) : (
          <Table
            data={data}
            columns={columns}
            pagination={pagination}
            onSort={onSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
          />
        )}
      </div>
    </div>
  );
}
