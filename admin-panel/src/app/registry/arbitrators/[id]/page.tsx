'use client';

import { useRouter, useParams } from 'next/navigation';
import { useArbitrator } from '@/hooks/admin/useArbitrators';
import { Button } from '@/components/admin/ui/Button';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
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
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function ArbitratorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { arbitrator, loading, error } = useArbitrator(id);

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

  if (loading) {
    return (
      <AdminLayout
        title="Загрузка..."
        breadcrumbs={[
          { label: 'Дашборд', href: '/' },
          { label: 'Реестр', href: '/registry' },
          { label: 'Арбитражные управляющие', href: '/registry/arbitrators' },
          { label: 'Просмотр' }
        ]}
      >
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
      </AdminLayout>
    );
  }

  if (error || !arbitrator) {
    return (
      <AdminLayout
        title="Ошибка"
        breadcrumbs={[
          { label: 'Дашборд', href: '/' },
          { label: 'Реестр', href: '/registry' },
          { label: 'Арбитражные управляющие', href: '/registry/arbitrators' },
          { label: 'Просмотр' }
        ]}
      >
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={arbitrator.fullName}
      breadcrumbs={[
        { label: 'Дашборд', href: '/' },
        { label: 'Реестр', href: '/registry' },
        { label: 'Арбитражные управляющие', href: '/registry/arbitrators' }
      ]}
    >
      <div className="space-y-6">
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
          <div>
            <p className="text-sm text-gray-500">
              Арбитражный управляющий • {arbitrator.registryNumber}
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/registry/arbitrators/${arbitrator.id}/edit`)}
          className="flex items-center space-x-2"
        >
          <PencilIcon className="h-4 w-4" />
          <span>Редактировать</span>
        </Button>
      </div>

      {/* Основная информация */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <UserIcon className="h-5 w-5 mr-2" />
            Основная информация
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ФИО</label>
              <p className="text-sm text-gray-900">{arbitrator.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ИНН</label>
              <p className="text-sm text-gray-900">{arbitrator.inn}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Номер в реестре СРО</label>
              <p className="text-sm text-gray-900">{arbitrator.registryNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">СНИЛС</label>
              <p className="text-sm text-gray-900">{arbitrator.snils || '—'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Номер в Госреестре</label>
              <p className="text-sm text-gray-900">{arbitrator.stateRegistryNumber || '—'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Дата включения в Госреестр</label>
              <p className="text-sm text-gray-900">
                {arbitrator.stateRegistryDate ? formatDate(arbitrator.stateRegistryDate) : '—'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Телефон</label>
              <p className="text-sm text-gray-900">{arbitrator.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-sm text-gray-900">{arbitrator.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Статус</label>
              <div className="mt-1">{getStatusBadge(arbitrator.status)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Контактная информация */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2" />
            Контактная информация
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Регион</label>
              <p className="text-sm text-gray-900">{arbitrator.region || '—'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Населенный пункт</label>
              <p className="text-sm text-gray-900">{arbitrator.city || '—'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Почтовый адрес</label>
              <p className="text-sm text-gray-900">{arbitrator.postalAddress || '—'}</p>
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
      </div>
    </AdminLayout>
  );
}
