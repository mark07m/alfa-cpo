'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  MagnifyingGlassIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  ArrowDownTrayIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { SearchForm, RegistryTable, Pagination, FilterPanel, SearchFilters } from '@/components/registry';
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

export default function RegistryPage() {
  const router = useRouter();
  const [managers, setManagers] = useState<ArbitraryManager[]>(mockManagers);
  const [filteredManagers, setFilteredManagers] = useState<ArbitraryManager[]>(mockManagers);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    fullName: '',
    inn: '',
    registryNumber: '',
    region: '',
    status: 'active'
  });

  const itemsPerPage = 5;

  // Фильтрация и поиск
  const filteredData = useMemo(() => {
    let filtered = managers;

    if (searchFilters.fullName) {
      filtered = filtered.filter(manager =>
        manager.fullName.toLowerCase().includes(searchFilters.fullName!.toLowerCase())
      );
    }

    if (searchFilters.inn) {
      filtered = filtered.filter(manager =>
        manager.inn.includes(searchFilters.inn!)
      );
    }

    if (searchFilters.registryNumber) {
      filtered = filtered.filter(manager =>
        manager.registryNumber.toLowerCase().includes(searchFilters.registryNumber!.toLowerCase())
      );
    }

    if (searchFilters.region) {
      filtered = filtered.filter(manager =>
        manager.region === searchFilters.region
      );
    }

    if (searchFilters.status && searchFilters.status !== 'all') {
      filtered = filtered.filter(manager =>
        manager.status === searchFilters.status
      );
    }

    return filtered;
  }, [managers, searchFilters]);

  // Пагинация
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Статистика
  const stats = useMemo(() => {
    const active = managers.filter(m => m.status === 'active').length;
    const excluded = managers.filter(m => m.status === 'excluded').length;
    const suspended = managers.filter(m => m.status === 'suspended').length;
    
    return {
      total: managers.length,
      active,
      excluded,
      suspended
    };
  }, [managers]);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchFilters({
      fullName: '',
      inn: '',
      registryNumber: '',
      region: '',
      status: 'active'
    });
    setCurrentPage(1);
  };

  const handleManagerClick = (manager: ArbitraryManager) => {
    // Переходим на детальную страницу в том же окне
    router.push(`/registry/${manager.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    // Простой экспорт в CSV
    const csvContent = [
      ['ФИО', 'ИНН', 'Номер в реестре', 'Телефон', 'Email', 'Регион', 'Статус', 'Дата вступления'],
      ...filteredData.map(manager => [
        manager.fullName,
        manager.inn,
        manager.registryNumber,
        manager.phone,
        manager.email,
        manager.region || '',
        manager.status === 'active' ? 'Действующий' : 
        manager.status === 'excluded' ? 'Исключен' : 'Приостановлен',
        new Date(manager.joinDate).toLocaleDateString('ru-RU')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `реестр_арбитражных_управляющих_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout
      title="Реестр арбитражных управляющих - СРО АУ"
      description="Поиск арбитражных управляющих в реестре СРО. Поиск по ФИО, ИНН, номеру в реестре."
      keywords="реестр, арбитражные управляющие, поиск, ФИО, ИНН"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Реестр арбитражных управляющих
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Поиск арбитражных управляющих - членов саморегулируемой организации. 
            Используйте форму поиска для быстрого нахождения нужного специалиста.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-neutral-900">
                Поиск в реестре
              </h2>
              <Button
                variant="outline"
                onClick={handleExport}
                className="hidden sm:flex"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Экспорт в Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <SearchForm
              onSearch={handleSearch}
              onReset={handleReset}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-neutral-900">
                    Результаты поиска
                  </h2>
                  <span className="text-sm text-neutral-600">
                    Найдено: {filteredData.length} арбитражных управляющих
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <RegistryTable
                  managers={paginatedData}
                  onManagerClick={handleManagerClick}
                  loading={loading}
                />

                {filteredData.length > 0 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalItems={filteredData.length}
                      itemsPerPage={itemsPerPage}
                      loading={loading}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <FilterPanel
              onFilterChange={(filters) => {
                setSearchFilters(prev => ({ ...prev, ...filters }));
                setCurrentPage(1);
              }}
              activeFilters={searchFilters}
              stats={stats}
            />

            {/* Экспорт для мобильных */}
            <Card className="lg:hidden">
              <CardContent>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="w-full"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Экспорт в Excel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
