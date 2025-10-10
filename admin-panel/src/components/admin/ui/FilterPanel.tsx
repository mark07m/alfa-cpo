'use client';

import React from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select, SelectOption } from './Select';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export interface FilterConfig {
  type: 'search' | 'select' | 'date' | 'daterange' | 'custom';
  key: string;
  label: string;
  placeholder?: string;
  options?: SelectOption[];
  component?: React.ReactNode;
  width?: 'full' | 'half' | 'third' | 'quarter';
}

interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset?: () => void;
  onApply?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
  showToggle?: boolean;
  className?: string;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onReset,
  onApply,
  isOpen = true,
  onToggle,
  showToggle = true,
  className
}: FilterPanelProps) {
  const widthClasses = {
    full: 'col-span-full',
    half: 'col-span-full md:col-span-6',
    third: 'col-span-full md:col-span-4',
    quarter: 'col-span-full md:col-span-3'
  };
  
  const hasActiveFilters = Object.values(values).some(v => 
    v !== '' && v !== null && v !== undefined
  );
  
  const renderFilter = (filter: FilterConfig) => {
    const commonProps = {
      value: values[filter.key] || '',
      onChange: (e: any) => onChange(filter.key, e.target.value)
    };
    
    switch (filter.type) {
      case 'search':
        return (
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              {...commonProps}
              placeholder={filter.placeholder || 'Поиск...'}
              className="pl-10"
            />
          </div>
        );
        
      case 'select':
        return (
          <Select
            {...commonProps}
            options={filter.options || []}
            placeholder={filter.placeholder || 'Выберите...'}
          />
        );
        
      case 'date':
        return (
          <Input
            {...commonProps}
            type="date"
            placeholder={filter.placeholder}
          />
        );
        
      case 'daterange':
        return (
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={values[`${filter.key}_from`] || ''}
              onChange={(e) => onChange(`${filter.key}_from`, e.target.value)}
              placeholder="От"
            />
            <Input
              type="date"
              value={values[`${filter.key}_to`] || ''}
              onChange={(e) => onChange(`${filter.key}_to`, e.target.value)}
              placeholder="До"
            />
          </div>
        );
        
      case 'custom':
        return filter.component;
        
      default:
        return null;
    }
  };
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Toggle button */}
      {showToggle && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onToggle}
            className={cn(
              'flex items-center gap-2',
              hasActiveFilters && 'border-primary-500 text-primary-700 bg-primary-50'
            )}
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Фильтры</span>
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                {Object.values(values).filter(v => v !== '' && v !== null && v !== undefined).length}
              </span>
            )}
          </Button>
        </div>
      )}
      
      {/* Filter content */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-12 gap-4">
            {filters.map((filter) => (
              <div 
                key={filter.key}
                className={cn(widthClasses[filter.width || 'quarter'])}
              >
                {filter.label && (
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {filter.label}
                  </label>
                )}
                {renderFilter(filter)}
              </div>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
            {onReset && (
              <Button
                variant="ghost"
                onClick={onReset}
                disabled={!hasActiveFilters}
                className="flex items-center gap-2"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Сбросить</span>
              </Button>
            )}
            {onApply && (
              <Button
                variant="primary"
                onClick={onApply}
              >
                Применить
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

