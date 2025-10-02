'use client';

import { useState } from 'react';
import { ArbitraryManager } from '@/types';
import Button from '@/components/ui/Button';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface RegistryTableProps {
  managers: ArbitraryManager[];
  onManagerClick: (manager: ArbitraryManager) => void;
  loading?: boolean;
}

type SortField = 'fullName' | 'inn' | 'registryNumber' | 'joinDate' | 'region';
type SortDirection = 'asc' | 'desc';

export default function RegistryTable({ managers, onManagerClick, loading = false }: RegistryTableProps) {
  const [sortField, setSortField] = useState<SortField>('fullName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: ArbitraryManager['status']) => {
    const statusConfig = {
      active: { label: 'Действующий', className: 'bg-green-100 text-green-800' },
      excluded: { label: 'Исключен', className: 'bg-red-100 text-red-800' },
      suspended: { label: 'Приостановлен', className: 'bg-yellow-100 text-yellow-800' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatPhone = (phone: string) => {
    // Простое форматирование телефона
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
    }
    return phone;
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-neutral-900 hover:text-beige-600 transition-colors"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? 
          <ChevronUpIcon className="h-4 w-4" /> : 
          <ChevronDownIcon className="h-4 w-4" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (managers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral-400 mb-4">
          <UserGroupIcon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          Арбитражные управляющие не найдены
        </h3>
        <p className="text-neutral-600">
          Попробуйте изменить параметры поиска или фильтры
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {managers.map((manager) => (
        <div 
          key={manager.id}
          className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-white"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {manager.fullName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-2 text-neutral-400" />
                  <span className="font-medium">ИНН:</span>
                  <span className="ml-1">{manager.inn}</span>
                </div>
                <div className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-2 text-neutral-400" />
                  <span className="font-medium">Номер в реестре:</span>
                  <span className="ml-1">{manager.registryNumber}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2 text-neutral-400" />
                  <span className="font-medium">Телефон:</span>
                  <span className="ml-1">{formatPhone(manager.phone)}</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-neutral-400" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-1">{manager.email}</span>
                </div>
                {manager.region && (
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2 text-neutral-400" />
                    <span className="font-medium">Регион:</span>
                    <span className="ml-1">{manager.region}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="font-medium">Дата вступления:</span>
                  <span className="ml-1">{formatDate(manager.joinDate)}</span>
                </div>
              </div>
            </div>
            <div className="ml-4 flex flex-col items-end space-y-2">
              {getStatusBadge(manager.status)}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onManagerClick(manager)}
                className="text-xs"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Подробнее
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
