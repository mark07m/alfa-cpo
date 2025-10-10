import React from 'react';
import { PageWithTable } from './PageWithTable';

interface PageWithTableSimpleProps<T> {
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
  
  // Действия (без заголовков)
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

export function PageWithTableSimple<T extends { id: string }>(props: PageWithTableSimpleProps<T>) {
  // Тонкая обертка, полностью прокидывает пропсы в унифицированный компонент
  return <PageWithTable<T> {...props} />;
}

