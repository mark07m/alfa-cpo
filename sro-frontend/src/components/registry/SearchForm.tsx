'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  MagnifyingGlassIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ArbitraryManager } from '@/types';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  loading?: boolean;
}

export interface SearchFilters {
  fullName?: string;
  inn?: string;
  registryNumber?: string;
  region?: string;
  status?: 'active' | 'excluded' | 'suspended' | 'all';
}

export default function SearchForm({ onSearch, onReset, loading = false }: SearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    fullName: '',
    inn: '',
    registryNumber: '',
    region: '',
    status: 'active'
  });

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      fullName: '',
      inn: '',
      registryNumber: '',
      region: '',
      status: 'active'
    });
    onReset();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== '' && value !== 'active'
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          label="ФИО арбитражного управляющего"
          placeholder="Введите ФИО"
          value={filters.fullName || ''}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          leftIcon={<UserGroupIcon className="h-5 w-5" />}
        />
        
        <Input
          label="ИНН"
          placeholder="Введите ИНН (12 цифр)"
          value={filters.inn || ''}
          onChange={(e) => handleInputChange('inn', e.target.value)}
          leftIcon={<DocumentTextIcon className="h-5 w-5" />}
          maxLength={12}
        />
        
        <Input
          label="Номер в реестре"
          placeholder="Введите номер"
          value={filters.registryNumber || ''}
          onChange={(e) => handleInputChange('registryNumber', e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Регион
          </label>
          <select
            value={filters.region || ''}
            onChange={(e) => handleInputChange('region', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-beige-500 focus:border-beige-500"
          >
            <option value="">Все регионы</option>
            <option value="Москва">Москва</option>
            <option value="Санкт-Петербург">Санкт-Петербург</option>
            <option value="Московская область">Московская область</option>
            <option value="Ленинградская область">Ленинградская область</option>
            <option value="Краснодарский край">Краснодарский край</option>
            <option value="Свердловская область">Свердловская область</option>
            <option value="Новосибирская область">Новосибирская область</option>
            <option value="Республика Татарстан">Республика Татарстан</option>
            <option value="Нижегородская область">Нижегородская область</option>
            <option value="Челябинская область">Челябинская область</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Статус
          </label>
          <select
            value={filters.status || 'active'}
            onChange={(e) => handleInputChange('status', e.target.value as SearchFilters['status'])}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-beige-500 focus:border-beige-500"
          >
            <option value="all">Все статусы</option>
            <option value="active">Действующие</option>
            <option value="excluded">Исключенные</option>
            <option value="suspended">Приостановленные</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          type="submit" 
          className="flex-1 sm:flex-none"
          disabled={loading}
        >
          <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
          {loading ? 'Поиск...' : 'Найти'}
        </Button>
        
        {hasActiveFilters && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            className="flex-1 sm:flex-none"
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            Сбросить фильтры
          </Button>
        )}
      </div>
    </form>
  );
}
