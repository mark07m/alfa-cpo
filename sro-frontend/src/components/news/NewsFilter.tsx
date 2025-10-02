'use client';

import React from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { NewsFilter as NewsFilterType, NewsCategory } from '@/types';

interface NewsFilterProps {
  filters: NewsFilterType;
  categories: NewsCategory[];
  onFiltersChange: (filters: NewsFilterType) => void;
  onReset: () => void;
  loading?: boolean;
}

export default function NewsFilter({
  filters,
  categories,
  onFiltersChange,
  onReset,
  loading = false
}: NewsFilterProps) {
  const handleInputChange = (field: keyof NewsFilterType, value: string | boolean | undefined) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const handleReset = () => {
    onReset();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== false
  );

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">
            Поиск и фильтрация
          </h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-red-600 hover:text-red-700"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Сбросить
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Поиск по тексту */}
          <div className="lg:col-span-2">
            <Input
              label="Поиск по тексту"
              placeholder="Введите ключевые слова"
              value={filters.query || ''}
              onChange={(e) => handleInputChange('query', e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              disabled={loading}
            />
          </div>

          {/* Категория */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Категория
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value || undefined)}
              className="form-input"
              disabled={loading}
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Период */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Период
            </label>
            <select
              value={filters.dateFrom || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  handleInputChange('dateFrom', undefined);
                  handleInputChange('dateTo', undefined);
                } else {
                  const now = new Date();
                  let dateFrom: string | undefined;
                  let dateTo: string | undefined;
                  
                  switch (value) {
                    case 'month':
                      dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                      break;
                    case 'quarter':
                      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                      dateFrom = quarterStart.toISOString().split('T')[0];
                      break;
                    case 'year':
                      dateFrom = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                      break;
                  }
                  
                  handleInputChange('dateFrom', dateFrom);
                  handleInputChange('dateTo', dateTo);
                }
              }}
              className="form-input"
              disabled={loading}
            >
              <option value="">За все время</option>
              <option value="month">За последний месяц</option>
              <option value="quarter">За последние 3 месяца</option>
              <option value="year">За последний год</option>
            </select>
          </div>
        </div>

        {/* Дополнительные фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Дата от */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Дата от
            </label>
            <Input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleInputChange('dateFrom', e.target.value || undefined)}
              disabled={loading}
            />
          </div>

          {/* Дата до */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Дата до
            </label>
            <Input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleInputChange('dateTo', e.target.value || undefined)}
              disabled={loading}
            />
          </div>

          {/* Только важные */}
          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.featured || false}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="form-checkbox"
                disabled={loading}
              />
              <span className="text-sm font-medium text-neutral-700">
                Только важные новости
              </span>
            </label>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            className="flex-1 sm:flex-none"
            disabled={loading}
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            {loading ? 'Поиск...' : 'Найти'}
          </Button>
          
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none"
              onClick={handleReset}
              disabled={loading}
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Сбросить фильтры
            </Button>
          )}
        </div>

        {/* Активные фильтры */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-neutral-600">Активные фильтры:</span>
              
              {filters.query && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-beige-100 text-beige-800">
                  Поиск: "{filters.query}"
                  <button
                    onClick={() => handleInputChange('query', undefined)}
                    className="ml-2 text-beige-600 hover:text-beige-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-beige-100 text-beige-800">
                  Категория: {categories.find(c => c.slug === filters.category)?.name}
                  <button
                    onClick={() => handleInputChange('category', undefined)}
                    className="ml-2 text-beige-600 hover:text-beige-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-beige-100 text-beige-800">
                  Важные новости
                  <button
                    onClick={() => handleInputChange('featured', false)}
                    className="ml-2 text-beige-600 hover:text-beige-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
