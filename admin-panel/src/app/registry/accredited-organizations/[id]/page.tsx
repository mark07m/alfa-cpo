'use client';

import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { useAccreditedOrganization } from '@/hooks/admin/useAccreditedOrganizations';
import { Button } from '@/components/admin/ui/Button';
import { 
  ArrowLeftIcon,
  PencilIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function AccreditedOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const { organization, loading, error } = useAccreditedOrganization(params.id as string);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Активна' },
      suspended: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, label: 'Приостановлена' },
      revoked: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, label: 'Отозвана' },
      expired: { color: 'bg-gray-100 text-gray-800', icon: ExclamationTriangleIcon, label: 'Истекла' }
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

  if (loading) {
    return (
      <AdminLayout
        title="Загрузка..."
        breadcrumbs={[
          { label: 'Дашборд', href: '/' },
          { label: 'Реестр', href: '/registry' },
          { label: 'Аккредитованные организации', href: '/registry/accredited-organizations' }
        ]}
      >
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Загрузка организации...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !organization) {
    return (
      <AdminLayout
        title="Ошибка"
        breadcrumbs={[
          { label: 'Дашборд', href: '/' },
          { label: 'Реестр', href: '/registry' },
          { label: 'Аккредитованные организации', href: '/registry/accredited-organizations' }
        ]}
      >
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Ошибка загрузки</h3>
          <p className="mt-1 text-sm text-gray-500">{error || 'Организация не найдена'}</p>
          <div className="mt-6">
            <Button onClick={() => router.push('/registry/accredited-organizations')}>
              Вернуться к списку
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={organization.name}
      breadcrumbs={[
        { label: 'Дашборд', href: '/' },
        { label: 'Реестр', href: '/registry' },
        { label: 'Аккредитованные организации', href: '/registry/accredited-organizations' }
      ]}
    >
      <div className="space-y-6">
        {/* Действия */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/registry/accredited-organizations')}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Назад</span>
            </Button>
            <div>
              <p className="text-sm text-gray-500">
                Аккредитованная организация • {organization.accreditationNumber}
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/registry/accredited-organizations/${organization.id}/edit`)}
            className="flex items-center space-x-2"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Редактировать</span>
          </Button>
        </div>

        {/* Статус и предупреждения */}
        <div className="flex items-center space-x-4">
          {getStatusBadge(organization.status)}
          {isExpiringSoon(organization.accreditationExpiryDate) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              <ClockIcon className="h-4 w-4 mr-1" />
              Аккредитация истекает скоро
            </span>
          )}
        </div>

        {/* Основная информация */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2" />
              Основная информация
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Название</label>
                <p className="text-sm text-gray-900">{organization.name}</p>
                {organization.shortName && (
                  <p className="text-sm text-gray-500">({organization.shortName})</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">ИНН</label>
                <p className="text-sm text-gray-900">{organization.inn}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">КПП</label>
                <p className="text-sm text-gray-900">{organization.kpp || '—'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">ОГРН</label>
                <p className="text-sm text-gray-900">{organization.ogrn}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Телефон</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  {organization.phone}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-1" />
                  {organization.email}
                </p>
              </div>
              {organization.website && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Веб-сайт</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <GlobeAltIcon className="h-4 w-4 mr-1" />
                    <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {organization.website}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Адреса */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2" />
              Адреса
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Юридический адрес</label>
                <p className="text-sm text-gray-900">{organization.legalAddress}</p>
              </div>
              {organization.actualAddress && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Фактический адрес</label>
                  <p className="text-sm text-gray-900">{organization.actualAddress}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Руководство */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Руководство
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">ФИО руководителя</label>
                <p className="text-sm text-gray-900">{organization.directorName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Должность</label>
                <p className="text-sm text-gray-900">{organization.directorPosition}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Аккредитация */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Аккредитация
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Номер аккредитации</label>
                <p className="text-sm text-gray-900">{organization.accreditationNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Тип аккредитации</label>
                <p className="text-sm text-gray-900">{getTypeLabel(organization.accreditationType)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Дата аккредитации</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {formatDate(organization.accreditationDate)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Дата окончания</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {formatDate(organization.accreditationExpiryDate)}
                </p>
              </div>
            </div>
            {organization.description && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-1">Описание</label>
                <p className="text-sm text-gray-900">{organization.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Услуги */}
        {organization.services.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Услуги</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-2">
                {organization.services.map((service, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-900">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Контакты */}
        {organization.contacts.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Контактные лица</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {organization.contacts.map((contact, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{contact.position}</p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700 flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        {contact.phone}
                      </p>
                      <p className="text-sm text-gray-700 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        {contact.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
