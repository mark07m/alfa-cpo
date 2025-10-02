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
  },
  {
    id: '6',
    fullName: 'Волков Волк Волкович',
    inn: '678901234567',
    registryNumber: 'АУ-006',
    phone: '+7 (495) 678-90-12',
    email: 'volkov@example.com',
    region: 'Краснодарский край',
    status: 'active',
    joinDate: '2021-05-10',
  },
  {
    id: '7',
    fullName: 'Новиков Новик Новикович',
    inn: '789012345678',
    registryNumber: 'АУ-007',
    phone: '+7 (495) 789-01-23',
    email: 'novikov@example.com',
    region: 'Свердловская область',
    status: 'active',
    joinDate: '2021-08-15',
  },
  {
    id: '8',
    fullName: 'Соколов Сокол Соколович',
    inn: '890123456789',
    registryNumber: 'АУ-008',
    phone: '+7 (495) 890-12-34',
    email: 'sokolov@example.com',
    region: 'Новосибирская область',
    status: 'excluded',
    joinDate: '2020-12-01',
    excludeDate: '2023-10-20',
    excludeReason: 'Несоблюдение требований СРО'
  },
  {
    id: '9',
    fullName: 'Лебедев Лебедь Лебедевич',
    inn: '901234567890',
    registryNumber: 'АУ-009',
    phone: '+7 (495) 901-23-45',
    email: 'lebedev@example.com',
    region: 'Республика Татарстан',
    status: 'active',
    joinDate: '2022-01-20',
  },
  {
    id: '10',
    fullName: 'Орлов Орел Орлович',
    inn: '012345678901',
    registryNumber: 'АУ-010',
    phone: '+7 (495) 012-34-56',
    email: 'orlov@example.com',
    region: 'Нижегородская область',
    status: 'suspended',
    joinDate: '2021-11-30',
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
    // Открываем в новом окне
    const url = `/registry/${manager.id}`;
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
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
