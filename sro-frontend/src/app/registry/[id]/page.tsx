'use client';

import { use } from 'react';
import { notFound, useRouter } from 'next/navigation';
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
  PrinterIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { ArbitraryManager } from '@/types';

// Моковые данные для демонстрации
const mockManagers: ArbitraryManager[] = [
  {
    id: '1',
    fullName: 'Александрова Алина Вячеславовна',
    inn: '470419750751',
    registryNumber: '22207',
    phone: '8-916-530-05-55',
    email: 'arbitr.aav@gmail.com',
    region: 'Ленинградская область',
    status: 'active',
    joinDate: '2023-04-20',
    birthDate: '1995-08-06',
    birthPlace: 'п. Перово, Выборгский р-н Ленинградская область',
    registrationDate: '2023-04-20',
    decisionNumber: 'Протокол №10',
    education: 'Санкт-Петербургский университет Государственной противопожарной службы МЧС России, диплом 107805 0617367 от 25.06.2020г., специальность "Правовое обеспечение национальной безопасности", квалификация юрист',
    workExperience: 'стаж более года справка от 10.03.2021г. ООО "РЕНКАР" (ИНН 5904102238)',
    internship: 'свидетельство №585 от 03.04.2023г. Выдано НПС СОПАУ "Альянс управляющих"',
    examCertificate: 'свидетельство №11/038406 от 29.03.2023г.',
    disqualification: 'Дисквалификации не имеет',
    criminalRecord: 'Судимости не имеет',
    insurance: 'Полис ОАУ №14909/700/25 ООО "Страховой дом "БСД" (17.04.2025 - 16.04.2026), страховая сумма 10 000 000 рублей',
    compensationFundContribution: 'взнос в размере 200 000 рублей внесен на счет компенсационного фонда',
    penalties: 'отсутствует',
    complianceStatus: 'соответствует',
    lastInspection: '01.12.2024 - декабрь 2024 (Нарушений не выявлено)',
    postalAddress: '121352, а/я 55'
  },
  {
    id: '2',
    fullName: 'Саргсян Левон Арменович',
    inn: '343002792470',
    registryNumber: '14090',
    phone: '624882673',
    email: 'sargsyanlevon12@gmail.com',
    region: 'Республика Татарстан',
    status: 'active',
    joinDate: '2020-12-16',
    birthDate: '1980-12-16',
    birthPlace: 'пос. Депутатский Усть-Янского р-на Якутской АССР',
    registrationDate: '2020-12-16',
    decisionNumber: 'Протокол заседания Совета от 15.04.2014г.',
    education: 'ГОУ ВПО "Волгоградский государственный университет" №РГ-001 31.07.2004 регионоведение, ФГБОУ ВО "Всероссийский государственный университет юстиции" №005572 29.11.2019',
    workExperience: 'Руководитель Юридического Лица ООО "Юридическая контора", с 10.01.2013г. по 10.01.2016г.',
    internship: 'в НП СРО АУ "СИНЕРГИЯ"',
    examCertificate: 'Росреестр №11/021340 17.02.2014',
    disqualification: 'Нет',
    criminalRecord: 'Нет',
    insurance: 'LG Club (16.12.2020 - 16.12.2020), сумма 123 руб.',
    compensationFundContribution: 'Build 16.12.2020 400 руб.',
    penalties: 'no',
    complianceStatus: 'соответствует',
    lastInspection: 'ok 16.12.2020 - 16.12.2020',
    postalAddress: '420012, Россия, Республика Татарстан, г. Казань, а/я 253'
  },
  {
    id: '3',
    fullName: 'Петров Петр Петрович',
    inn: '234567890123',
    registryNumber: 'АУ-002',
    phone: '+7 (812) 234-56-78',
    email: 'petrov@example.com',
    region: 'Санкт-Петербург',
    status: 'active',
    joinDate: '2020-03-20',
    birthDate: '1985-03-15',
    birthPlace: 'г. Санкт-Петербург',
    registrationDate: '2020-03-20',
    decisionNumber: 'Протокол №15',
    education: 'Санкт-Петербургский государственный университет, диплом 123456 от 15.06.2007г., специальность "Юриспруденция"',
    workExperience: 'стаж 3 года в ООО "Юридическая фирма"',
    internship: 'свидетельство №123 от 01.03.2020г.',
    examCertificate: 'свидетельство №12/045678 от 15.02.2020г.',
    disqualification: 'Дисквалификации не имеет',
    criminalRecord: 'Судимости не имеет',
    insurance: 'Полис №12345 от 01.01.2024, страховая сумма 5 000 000 рублей',
    compensationFundContribution: 'взнос в размере 150 000 рублей',
    penalties: 'отсутствует',
    complianceStatus: 'соответствует',
    lastInspection: '15.11.2024 (Нарушений не выявлено)',
    postalAddress: '191002, г. Санкт-Петербург, ул. Невский проспект, д. 1'
  },
  {
    id: '4',
    fullName: 'Сидоров Сидор Сидорович',
    inn: '345678901234',
    registryNumber: 'АУ-003',
    phone: '+7 (495) 345-67-89',
    email: 'sidorov@example.com',
    region: 'Московская область',
    status: 'excluded',
    joinDate: '2019-06-10',
    excludeDate: '2023-12-15',
    excludeReason: 'Нарушение профессиональной этики',
    birthDate: '1980-06-10',
    birthPlace: 'г. Москва',
    registrationDate: '2019-06-10',
    decisionNumber: 'Протокол №8',
    education: 'Московский государственный университет, диплом 789012 от 10.06.2002г., специальность "Право"',
    workExperience: 'стаж 5 лет в различных организациях',
    internship: 'свидетельство №456 от 01.05.2019г.',
    examCertificate: 'свидетельство №13/056789 от 20.04.2019г.',
    disqualification: 'Дисквалификации не имеет',
    criminalRecord: 'Судимости не имеет',
    insurance: 'Полис №67890 от 01.01.2023, страховая сумма 3 000 000 рублей',
    compensationFundContribution: 'взнос в размере 100 000 рублей',
    penalties: 'выговор от 15.12.2023',
    complianceStatus: 'не соответствует',
    lastInspection: '10.12.2023 (Выявлены нарушения)',
    postalAddress: '141000, Московская область, г. Мытищи, ул. Центральная, д. 10'
  },
  {
    id: '5',
    fullName: 'Козлов Козьма Козьмович',
    inn: '456789012345',
    registryNumber: 'АУ-004',
    phone: '+7 (495) 456-78-90',
    email: 'kozlov@example.com',
    region: 'Москва',
    status: 'suspended',
    joinDate: '2021-02-28',
    birthDate: '1975-02-28',
    birthPlace: 'г. Москва',
    registrationDate: '2021-02-28',
    decisionNumber: 'Протокол №12',
    education: 'Российская академия народного хозяйства и государственной службы, диплом 345678 от 28.02.1997г., специальность "Экономика"',
    workExperience: 'стаж 8 лет в финансовых организациях',
    internship: 'свидетельство №789 от 01.02.2021г.',
    examCertificate: 'свидетельство №14/067890 от 15.01.2021г.',
    disqualification: 'Дисквалификации не имеет',
    criminalRecord: 'Судимости не имеет',
    insurance: 'Полис №23456 от 01.01.2024, страховая сумма 7 000 000 рублей',
    compensationFundContribution: 'взнос в размере 180 000 рублей',
    penalties: 'отсутствует',
    complianceStatus: 'соответствует',
    lastInspection: '20.10.2024 (Нарушений не выявлено)',
    postalAddress: '101000, г. Москва, ул. Тверская, д. 15'
  }
];

interface ManagerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ManagerDetailPage({ params }: ManagerDetailPageProps) {
  const router = useRouter();
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

  const formatDateLongLong = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Неизвестно';
      }
      
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];
      
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${day} ${month} ${year} г.`;
    } catch (error) {
      return 'Неизвестно';
    }
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
    router.back();
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
              К реестру
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
                    <p className="text-neutral-900">{formatDateLong(manager.joinDate)}</p>
                  </div>
                  {manager.registrationDate && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Дата регистрации в реестре
                      </label>
                      <p className="text-neutral-900">{formatDateLong(manager.registrationDate)}</p>
                    </div>
                  )}
                  {manager.decisionNumber && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Номер решения о приеме
                      </label>
                      <p className="text-neutral-900">{manager.decisionNumber}</p>
                    </div>
                  )}
                  {manager.excludeDate && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Дата исключения
                      </label>
                      <p className="text-neutral-900">{formatDateLong(manager.excludeDate)}</p>
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

            {/* Личные данные */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Личные данные
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {manager.birthDate && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Дата рождения
                      </label>
                      <p className="text-neutral-900">{formatDateLong(manager.birthDate)}</p>
                    </div>
                  )}
                  {manager.birthPlace && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Место рождения
                      </label>
                      <p className="text-neutral-900">{manager.birthPlace}</p>
                    </div>
                  )}
                  {manager.postalAddress && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Почтовый адрес
                      </label>
                      <p className="text-neutral-900">{manager.postalAddress}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Образование и опыт */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Образование и опыт
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {manager.education && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Образование
                      </label>
                      <p className="text-neutral-900 text-sm">{manager.education}</p>
                    </div>
                  )}
                  {manager.workExperience && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Стаж руководящей работы
                      </label>
                      <p className="text-neutral-900 text-sm">{manager.workExperience}</p>
                    </div>
                  )}
                  {manager.internship && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Стажировка помощником АУ
                      </label>
                      <p className="text-neutral-900 text-sm">{manager.internship}</p>
                    </div>
                  )}
                  {manager.examCertificate && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Сведения об экзамене
                      </label>
                      <p className="text-neutral-900 text-sm">{manager.examCertificate}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Правовые сведения */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Правовые сведения
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {manager.disqualification && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Дисквалификация
                      </label>
                      <p className="text-neutral-900 text-sm">{manager.disqualification}</p>
                    </div>
                  )}
                  {manager.criminalRecord && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Судимость
                      </label>
                      <p className="text-neutral-900 text-sm">{manager.criminalRecord}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Страхование и взносы */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Страхование и взносы
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {manager.insurance && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Сведения о страховании
                      </label>
                      <p className="text-neutral-900 text-sm">{manager.insurance}</p>
                    </div>
                  )}
                  {manager.compensationFundContribution && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Взносы в компенсационный фонд
                      </label>
                      <p className="text-neutral-900 text-sm">{manager.compensationFundContribution}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Проверки и соответствие */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Проверки и соответствие
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {manager.complianceStatus && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Соответствие условиям членства
                      </label>
                      <p className="text-neutral-900 text-sm">{manager.complianceStatus}</p>
                    </div>
                  )}
                  {manager.lastInspection && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Последняя проверка
                      </label>
                      <p className="text-neutral-900 text-sm">{manager.lastInspection}</p>
                    </div>
                  )}
                  {manager.penalties && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Дисциплинарные взыскания
                      </label>
                      <p className="text-neutral-900 text-sm">{manager.penalties}</p>
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
                    <p className="text-neutral-600">{formatDateLong(new Date().toISOString())}</p>
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
