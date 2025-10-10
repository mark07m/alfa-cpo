'use client';

import { useState } from 'react';
import { AccreditedOrganization } from '@/types/admin';
import { Button } from '@/components/admin/ui/Button';
import { Checkbox } from '@/components/admin/ui/Checkbox';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface AccreditedOrganizationsListProps {
  organizations: AccreditedOrganization[];
  selectedIds: string[];
  onSelectOne: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
}

export function AccreditedOrganizationsList({
  organizations,
  selectedIds,
  onSelectOne,
  onSelectAll,
  onEdit,
  onDelete,
  onView,
  onBulkDelete
}: AccreditedOrganizationsListProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleBulkDelete = () => {
    onBulkDelete(selectedIds);
    setShowDeleteConfirm(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckIcon, label: 'Активна' },
      suspended: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, label: 'Приостановлена' },
      revoked: { color: 'bg-red-100 text-red-800', icon: XMarkIcon, label: 'Отозвана' },
      expired: { color: 'bg-gray-100 text-gray-800', icon: XMarkIcon, label: 'Истекла' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.expired;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      educational: 'Образовательная',
      training: 'Обучающая',
      assessment: 'Оценочная',
      other: 'Прочая'
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  if (organizations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Нет аккредитованных организаций</h3>
        <p className="mt-1 text-sm text-gray-500">Начните с добавления новой организации.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {organizations.map((organization) => (
          <li key={organization.id}>
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  checked={selectedIds.includes(organization.id)}
                  onChange={(e) => onSelectOne(organization.id, (e.target as HTMLInputElement).checked)}
                  size="sm"
                  className="mr-4"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {organization.name}
                        </h3>
                        {getStatusBadge(organization.status)}
                        {isExpiringSoon(organization.accreditationExpiryDate) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Истекает скоро
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{organization.shortName && `(${organization.shortName})`}</span>
                        <span>ИНН: {organization.inn}</span>
                        <span>ОГРН: {organization.ogrn}</span>
                        <span>№ {organization.accreditationNumber}</span>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{getTypeLabel(organization.accreditationType)}</span>
                        <span>Аккредитована: {formatDate(organization.accreditationDate)}</span>
                        <span>Действует до: {formatDate(organization.accreditationExpiryDate)}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <span>Руководитель: {organization.directorName}</span>
                        <span className="ml-4">Телефон: {organization.phone}</span>
                        <span className="ml-4">Email: {organization.email}</span>
                      </div>
                      {organization.services.length > 0 && (
                        <div className="mt-1">
                          <span className="text-sm text-gray-500">Услуги: </span>
                          <span className="text-sm text-gray-700">
                            {organization.services.slice(0, 3).join(', ')}
                            {organization.services.length > 3 && ` и еще ${organization.services.length - 3}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(organization.id)}
                  className="flex items-center space-x-1"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>Просмотр</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(organization.id)}
                  className="flex items-center space-x-1"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>Редактировать</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(organization.id)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Удалить</span>
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Подтверждение массового удаления */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Подтверждение удаления
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Вы уверены, что хотите удалить выбранные организации? 
                  Это действие нельзя отменить.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                >
                  Удалить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
