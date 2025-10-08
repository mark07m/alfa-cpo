'use client';

import { useRouter, useParams } from 'next/navigation';
import { useArbitrator } from '@/hooks/admin/useArbitrators';
import { arbitratorsService } from '@/services/admin/arbitrators';
import { Button } from '@/components/admin/ui/Button';
import { ArbitratorForm } from '@/components/admin/arbitrators/ArbitratorForm';
import { useState } from 'react';
import { 
  PencilIcon, 
  ArrowLeftIcon,
  UserIcon,
  IdentificationIcon,
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function ArbitratorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { arbitrator, loading, error, updateArbitrator } = useArbitrator(id);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy', { locale: ru });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Действительный' },
      excluded: { color: 'bg-red-100 text-red-800', label: 'Исключен' },
      suspended: { color: 'bg-yellow-100 text-yellow-800', label: 'Приостановлен' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async (data: any) => {
    try {
      setIsUpdating(true);
      await updateArbitrator(data);
      setIsEditing(false);
      // Показать уведомление об успешном сохранении
      alert('Арбитражный управляющий успешно обновлен');
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Ошибка при сохранении изменений');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!arbitrator) return;
    
    try {
      setIsDeleting(true);
      await arbitratorsService.deleteArbitrator(arbitrator.id);
      router.push('/registry/arbitrators');
    } catch (error) {
      console.error('Ошибка удаления арбитражного управляющего:', error);
      alert('Ошибка при удалении арбитражного управляющего');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/registry/arbitrators')}
            className="flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Назад</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Загрузка...</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !arbitrator) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/registry/arbitrators')}
            className="flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Назад</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Ошибка</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-red-600 mb-4">
            {error || 'Арбитражный управляющий не найден'}
          </p>
          <Button onClick={() => router.push('/registry/arbitrators')}>
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{arbitrator.fullName}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Арбитражный управляющий • {arbitrator.registryNumber}
        </p>
      </div>

      {/* Действия */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/registry/arbitrators')}
            className="flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Назад</span>
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleEdit}
            className="flex items-center space-x-2"
            disabled={isUpdating}
          >
            <PencilIcon className="h-4 w-4" />
            <span>{isEditing ? 'Отменить' : 'Редактировать'}</span>
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center space-x-2"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Удалить</span>
          </Button>
        </div>
      </div>

      {/* Форма редактирования или просмотр данных */}
      {isEditing ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-base font-medium text-gray-900 flex items-center">
              <PencilIcon className="h-4 w-4 mr-2" />
              Редактирование арбитражного управляющего
            </h2>
          </div>
          <div className="p-4">
            <ArbitratorForm
              initialData={arbitrator}
              onSubmit={handleSave}
              onCancel={handleCancelEdit}
              loading={isUpdating}
              isEdit={true}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Основная информация */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-base font-medium text-gray-900 flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                Основная информация
              </h2>
            </div>
            <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">ФИО</label>
              <p className="text-sm text-gray-900 truncate" title={arbitrator.fullName}>{arbitrator.fullName}</p>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">ИНН</label>
              <p className="text-sm text-gray-900 font-mono">{arbitrator.inn}</p>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">Номер в реестре СРО</label>
              <p className="text-sm text-gray-900 font-mono">{arbitrator.registryNumber}</p>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">СНИЛС</label>
              <p className="text-sm text-gray-900 font-mono">{arbitrator.snils || '—'}</p>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">Номер в Госреестре</label>
              <p className="text-sm text-gray-900 font-mono">{arbitrator.stateRegistryNumber || '—'}</p>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">Дата включения в Госреестр</label>
              <p className="text-sm text-gray-900">
                {arbitrator.stateRegistryDate ? formatDate(arbitrator.stateRegistryDate) : '—'}
              </p>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">Телефон</label>
              <p className="text-sm text-gray-900 font-mono">{arbitrator.phone}</p>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <p className="text-sm text-gray-900 truncate" title={arbitrator.email}>{arbitrator.email}</p>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">Статус</label>
              <div className="mt-1">{getStatusBadge(arbitrator.status)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Контактная информация */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base font-medium text-gray-900 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2" />
            Контактная информация
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">Регион</label>
              <p className="text-sm text-gray-900 truncate" title={arbitrator.region || '—'}>{arbitrator.region || '—'}</p>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">Населенный пункт</label>
              <p className="text-sm text-gray-900 truncate" title={arbitrator.city || '—'}>{arbitrator.city || '—'}</p>
            </div>
            <div className="min-w-0 sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Почтовый адрес</label>
              <p className="text-sm text-gray-900 break-words" title={arbitrator.postalAddress || '—'}>{arbitrator.postalAddress || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Личная информация */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <IdentificationIcon className="h-5 w-5 mr-2" />
            Личная информация
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Дата рождения</label>
              <p className="text-sm text-gray-900">
                {arbitrator.birthDate ? formatDate(arbitrator.birthDate) : '—'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Место рождения</label>
              <p className="text-sm text-gray-900">{arbitrator.birthPlace || '—'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Дата регистрации</label>
              <p className="text-sm text-gray-900">
                {arbitrator.registrationDate ? formatDate(arbitrator.registrationDate) : '—'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Номер решения</label>
              <p className="text-sm text-gray-900">{arbitrator.decisionNumber || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Профессиональная подготовка */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            Профессиональная подготовка
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Образование</label>
            <p className="text-sm text-gray-900 whitespace-pre-line">{arbitrator.education || '—'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Опыт работы</label>
            <p className="text-sm text-gray-900 whitespace-pre-line">{arbitrator.workExperience || '—'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Стажировка</label>
            <p className="text-sm text-gray-900 whitespace-pre-line">{arbitrator.internship || '—'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Сертификат о сдаче экзамена</label>
            <p className="text-sm text-gray-900">{arbitrator.examCertificate || '—'}</p>
          </div>
        </div>
      </div>

      {/* Дисквалификация и судимости */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Дисквалификация и судимости
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Дисквалификация</label>
            <p className="text-sm text-gray-900 whitespace-pre-line">{arbitrator.disqualification || '—'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Судимости</label>
            <p className="text-sm text-gray-900 whitespace-pre-line">{arbitrator.criminalRecord || '—'}</p>
          </div>
          {arbitrator.criminalRecordDate && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Дата судимости</label>
                <p className="text-sm text-gray-900">{formatDate(arbitrator.criminalRecordDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Номер судимости</label>
                <p className="text-sm text-gray-900">{arbitrator.criminalRecordNumber || '—'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Наименование</label>
                <p className="text-sm text-gray-900">{arbitrator.criminalRecordName || '—'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Страхование */}
      {arbitrator.insurance && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Сведения о страховании
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Начало</label>
                <p className="text-sm text-gray-900">
                  {arbitrator.insurance.startDate ? formatDate(arbitrator.insurance.startDate) : '—'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Окончание</label>
                <p className="text-sm text-gray-900">
                  {arbitrator.insurance.endDate ? formatDate(arbitrator.insurance.endDate) : '—'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Сумма договора (₽)</label>
                <p className="text-sm text-gray-900">
                  {arbitrator.insurance.amount ? arbitrator.insurance.amount.toLocaleString() : '—'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Номер договора</label>
                <p className="text-sm text-gray-900">{arbitrator.insurance.contractNumber || '—'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Дата договора</label>
                <p className="text-sm text-gray-900">
                  {arbitrator.insurance.contractDate ? formatDate(arbitrator.insurance.contractDate) : '—'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Страховая компания</label>
                <p className="text-sm text-gray-900">{arbitrator.insurance.insuranceCompany || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Компенсационный фонд */}
      {arbitrator.compensationFundContribution && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 mr-2" />
              Взнос в компенсационный фонд
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Общая сумма взносов (₽)</label>
                <p className="text-sm text-gray-900">
                  {arbitrator.compensationFundContribution.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Дополнительная информация */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
            Дополнительная информация
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Штрафы</label>
            <p className="text-sm text-gray-900 whitespace-pre-line">{arbitrator.penalties || '—'}</p>
          </div>
        </div>
      </div>

      {/* Метаданные */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Метаданные
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Дата включения в реестр СРО</label>
              <p className="text-sm text-gray-900">{formatDate(arbitrator.joinDate)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Дата исключения</label>
              <p className="text-sm text-gray-900">
                {arbitrator.excludeDate ? formatDate(arbitrator.excludeDate) : '—'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Причина исключения</label>
              <p className="text-sm text-gray-900">{arbitrator.excludeReason || '—'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Дата создания записи</label>
              <p className="text-sm text-gray-900">{formatDate(arbitrator.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Подтверждение удаления
                </h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Вы уверены, что хотите удалить арбитражного управляющего{' '}
                <span className="font-medium text-gray-900">{arbitrator.fullName}</span>?
              </p>
              <p className="text-sm text-red-600 mt-2">
                Это действие нельзя отменить.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Отмена
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                loading={isDeleting}
                disabled={isDeleting}
              >
                {isDeleting ? 'Удаление...' : 'Удалить'}
              </Button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
