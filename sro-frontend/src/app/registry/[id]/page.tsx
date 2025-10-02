'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  UserIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { ArbitraryManager } from '@/types';

// Моковые данные для демонстрации
const mockManagers: ArbitraryManager[] = [
  {
    id: '1',
    fullName: 'Иванов Иван Иванович',
    inn: '123456789012',
    registryNumber: 'АУ-001',
    phone: '+7 (495) 123-45-67',
    email: 'ivanov@example.com',
    region: 'Москва',
    status: 'active',
    joinDate: '2020-01-15',
  },
  {
    id: '2',
    fullName: 'Петров Петр Петрович',
    inn: '234567890123',
    registryNumber: 'АУ-002',
    phone: '+7 (812) 234-56-78',
    email: 'petrov@example.com',
    region: 'Санкт-Петербург',
    status: 'active',
    joinDate: '2020-03-20',
  },
  {
    id: '3',
    fullName: 'Сидоров Сидор Сидорович',
    inn: '345678901234',
    registryNumber: 'АУ-003',
    phone: '+7 (495) 345-67-89',
    email: 'sidorov@example.com',
    region: 'Московская область',
    status: 'excluded',
    joinDate: '2019-06-10',
    excludeDate: '2023-12-15',
    excludeReason: 'Нарушение профессиональной этики'
  },
  {
    id: '4',
    fullName: 'Козлов Козьма Козьмович',
    inn: '456789012345',
    registryNumber: 'АУ-004',
    phone: '+7 (495) 456-78-90',
    email: 'kozlov@example.com',
    region: 'Москва',
    status: 'suspended',
    joinDate: '2021-02-28',
  },
  {
    id: '5',
    fullName: 'Морозов Мороз Морозович',
    inn: '567890123456',
    registryNumber: 'АУ-005',
    phone: '+7 (495) 567-89-01',
    email: 'morozov@example.com',
    region: 'Москва',
    status: 'active',
    joinDate: '2020-11-05',
  }
];

interface ManagerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ManagerDetailPage({ params }: ManagerDetailPageProps) {
  const { id } = use(params);
  const manager = mockManagers.find(m => m.id === id);

  if (!manager) {
    notFound();
  }

  const getStatusConfig = (status: ArbitraryManager['status']) => {
    const configs = {
      active: { 
        label: 'Действующий', 
        className: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon
      },
      excluded: { 
        label: 'Исключен', 
        className: 'bg-red-100 text-red-800',
        icon: XCircleIcon
      },
      suspended: { 
        label: 'Приостановлен', 
        className: 'bg-yellow-100 text-yellow-800',
        icon: ExclamationTriangleIcon
      }
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(manager.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
    }
    return phone;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.close();
  };

  return (
    <Layout
      title={`${manager.fullName} - Реестр арбитражных управляющих`}
      description={`Информация об арбитражном управляющем ${manager.fullName} в реестре СРО`}
      showBreadcrumbs={false}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок и действия */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Button
              variant="outline"
              onClick={handleBack}
              className="hidden print:hidden"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                {manager.fullName}
              </h1>
              <p className="text-lg text-neutral-600">
                Арбитражный управляющий
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="hidden print:hidden"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Печать
            </Button>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.className}`}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {statusConfig.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Личные данные */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Личные данные
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Полное имя
                    </label>
                    <p className="text-neutral-900 font-medium">{manager.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      ИНН
                    </label>
                    <p className="text-neutral-900 font-mono">{manager.inn}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Номер в реестре
                    </label>
                    <p className="text-neutral-900 font-mono">{manager.registryNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Регион
                    </label>
                    <p className="text-neutral-900">{manager.region}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Контактная информация */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Контактная информация
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-neutral-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Телефон</p>
                      <p className="text-neutral-900">{formatPhone(manager.phone)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 text-neutral-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Email</p>
                      <p className="text-neutral-900">{manager.email}</p>
                    </div>
                  </div>
                  {manager.region && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-neutral-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-neutral-700">Регион</p>
                        <p className="text-neutral-900">{manager.region}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Статус и даты */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Статус и даты
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Статус
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusConfig.className}`}>
                      <StatusIcon className="h-4 w-4 mr-1" />
                      {statusConfig.label}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Дата вступления в СРО
                    </label>
                    <p className="text-neutral-900">{formatDate(manager.joinDate)}</p>
                  </div>
                  {manager.excludeDate && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Дата исключения
                      </label>
                      <p className="text-neutral-900">{formatDate(manager.excludeDate)}</p>
                    </div>
                  )}
                  {manager.excludeReason && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Причина исключения
                      </label>
                      <p className="text-neutral-900">{manager.excludeReason}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Быстрые действия */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Быстрые действия
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(`tel:${manager.phone}`)}
                  >
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Позвонить
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(`mailto:${manager.email}`)}
                  >
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Написать email
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handlePrint}
                  >
                    <PrinterIcon className="h-4 w-4 mr-2" />
                    Печать
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Дополнительная информация */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Дополнительная информация
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-neutral-700">ID в системе:</span>
                    <p className="text-neutral-600 font-mono">{manager.id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Последнее обновление:</span>
                    <p className="text-neutral-600">{formatDate(new Date().toISOString())}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </Layout>
  );
}
