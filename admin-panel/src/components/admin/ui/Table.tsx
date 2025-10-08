'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

interface TableColumn<T> {
  key: keyof T | 'actions' | 'select';
  title: string | React.ReactNode;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
  className?: string;
}

interface TablePagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  pagination?: TablePagination;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

export const Table = <T extends { id: string }>({
  data,
  columns,
  pagination,
  loading = false,
  emptyMessage = 'Нет данных для отображения',
  className,
  onSort,
  sortKey,
  sortDirection
}: TableProps<T>) => {
  const handleSort = (key: keyof T | 'select' | 'actions') => {
    if (!onSort || key === 'select' || key === 'actions') return;
    
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key as keyof T, direction);
  };

  const renderSortIcon = (key: keyof T | 'select' | 'actions') => {
    if (key === 'select' || key === 'actions' || sortKey !== key) {
      return <ChevronUpIcon className="h-4 w-4 text-neutral-400" />;
    }
    
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="h-4 w-4 text-neutral-600" />
      : <ChevronDownIcon className="h-4 w-4 text-neutral-600" />;
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { currentPage, totalPages, onPageChange } = pagination;
    
    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-neutral-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            Предыдущая
          </Button>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            Следующая
          </Button>
        </div>
        
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-700">
              Показано{' '}
              <span className="font-medium">
                {Math.min((currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems)}
              </span>{' '}
              до{' '}
              <span className="font-medium">
                {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)}
              </span>{' '}
              из{' '}
              <span className="font-medium">{pagination.totalItems}</span>{' '}
              результатов
            </p>
          </div>
          
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>
              
              {getVisiblePages().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-700">
                      ...
                    </span>
                  ) : (
                    <Button
                      onClick={() => onPageChange(page as number)}
                      variant={currentPage === page ? 'primary' : 'outline'}
                      size="sm"
                      className={cn(
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                        currentPage === page
                          ? 'z-10 bg-beige-50 border-beige-500 text-beige-600'
                          : 'bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50'
                      )}
                    >
                      {page}
                    </Button>
                  )}
                </React.Fragment>
              ))}
              
              <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </Button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={cn('bg-white rounded-lg border border-neutral-200', className)}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-2 text-sm text-neutral-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg border border-neutral-200 overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-neutral-200 table-responsive">
          <thead className="bg-neutral-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={cn(
                    'px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider',
                    column.width || 'w-auto',
                    column.sortable && 'cursor-pointer hover:bg-neutral-100',
                    column.className
                  )}
                  onClick={() => column.sortable && onSort && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span className="truncate">{column.title}</span>
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-neutral-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-neutral-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        'px-3 py-4 text-sm text-neutral-900',
                        column.className
                      )}
                    >
                      <div className={cn(
                        'truncate',
                        column.key === 'actions' && 'action-buttons'
                      )}>
                        {column.render
                          ? column.render(row[column.key as keyof T], row)
                          : String(row[column.key as keyof T] || '')}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {renderPagination()}
    </div>
  );
};

export default Table;