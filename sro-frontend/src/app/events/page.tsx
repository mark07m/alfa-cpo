'use client';

import Layout from '@/components/layout/Layout';
import { EventsList, EventCalendar } from '@/components/events';
import { Event, EventType, EventStatus, EventFilter as EventFilterType } from '@/types';
import { useState } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function EventsPage() {
  const [filters, setFilters] = useState<EventFilterType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const eventTypes: EventType[] = [
    { id: '1', name: 'Семинар', slug: 'seminar', order: 1, color: '#3B82F6' },
    { id: '2', name: 'Конференция', slug: 'conference', order: 2, color: '#10B981' },
    { id: '3', name: 'Тренинг', slug: 'training', order: 3, color: '#8B5CF6' },
    { id: '4', name: 'Совещание', slug: 'meeting', order: 4, color: '#F59E0B' }
  ];

  const eventStatuses: EventStatus[] = [
    { id: '1', name: 'Предстоящее', slug: 'upcoming', color: '#10B981' },
    { id: '2', name: 'Идет сейчас', slug: 'ongoing', color: '#3B82F6' },
    { id: '3', name: 'Завершено', slug: 'completed', color: '#6B7280' },
    { id: '4', name: 'Отменено', slug: 'cancelled', color: '#EF4444' }
  ];

  const events: Event[] = [
    {
      id: '1',
      title: 'Семинар "Новеллы в законодательстве о банкротстве"',
      description: 'Семинар для членов СРО по обсуждению последних изменений в законодательстве о несостоятельности.',
      content: '<p>15 февраля 2024 года состоится семинар для членов СРО по обсуждению последних изменений в законодательстве о несостоятельности.</p><p>В программе семинара:</p><ul><li>Обзор изменений в ФЗ "О несостоятельности (банкротстве)"</li><li>Практические аспекты применения новых норм</li><li>Ответы на вопросы участников</li></ul>',
      startDate: '2024-02-15T10:00:00Z',
      endDate: '2024-02-15T16:00:00Z',
      location: 'Конференц-зал СРО, г. Москва',
      type: eventTypes[0],
      status: eventStatuses[0],
      maxParticipants: 50,
      currentParticipants: 23,
      registrationRequired: true,
      registrationDeadline: '2024-02-10T18:00:00Z',
      featured: true,
      tags: ['семинар', 'обучение', 'законодательство'],
      organizer: 'Администрация СРО',
      contactEmail: 'events@sro-au.ru',
      contactPhone: '+7 (495) 123-45-67',
      price: 0,
      currency: '₽',
      requirements: 'Участники должны быть членами СРО',
      agenda: [
        { id: '1', time: '10:00', title: 'Регистрация участников', duration: 30 },
        { id: '2', time: '10:30', title: 'Открытие семинара', speaker: 'Председатель СРО', duration: 15 },
        { id: '3', time: '10:45', title: 'Обзор изменений в законодательстве', speaker: 'Юрист СРО', duration: 120 },
        { id: '4', time: '13:00', title: 'Обед', duration: 60 },
        { id: '5', time: '14:00', title: 'Практические аспекты применения', speaker: 'Эксперт', duration: 120 },
        { id: '6', time: '16:00', title: 'Вопросы и ответы', duration: 30 }
      ],
      cover: '/assets/news_cover_beige.png'
    },
    {
      id: '2',
      title: 'Конференция "Современные тенденции в банкротстве"',
      description: 'Ежегодная конференция для арбитражных управляющих по обсуждению актуальных вопросов развития института банкротства.',
      startDate: '2024-03-20T09:00:00Z',
      endDate: '2024-03-20T18:00:00Z',
      location: 'Гостиница "Метрополь", г. Москва',
      type: eventTypes[1],
      status: eventStatuses[0],
      maxParticipants: 200,
      currentParticipants: 156,
      registrationRequired: true,
      registrationDeadline: '2024-03-15T18:00:00Z',
      featured: true,
      tags: ['конференция', 'банкротство', 'тенденции'],
      organizer: 'СРО АУ',
      contactEmail: 'conference@sro-au.ru',
      contactPhone: '+7 (495) 123-45-67',
      price: 5000,
      currency: '₽',
      requirements: 'Участники должны быть членами СРО',
      cover: '/assets/news_cover_beige.png'
    },
    {
      id: '3',
      title: 'Тренинг "Эффективное управление процедурами банкротства"',
      description: 'Практический тренинг по повышению квалификации арбитражных управляющих.',
      startDate: '2024-02-28T14:00:00Z',
      endDate: '2024-02-28T17:00:00Z',
      location: 'Онлайн (Zoom)',
      type: eventTypes[2],
      status: eventStatuses[0],
      maxParticipants: 30,
      currentParticipants: 18,
      registrationRequired: true,
      registrationDeadline: '2024-02-25T18:00:00Z',
      featured: false,
      tags: ['тренинг', 'управление', 'практика'],
      organizer: 'Центр повышения квалификации',
      contactEmail: 'training@sro-au.ru',
      price: 2000,
      currency: '₽',
      cover: '/assets/news_cover_beige.png'
    },
    {
      id: '4',
      title: 'Совещание по вопросам контроля деятельности членов СРО',
      description: 'Внутреннее совещание для обсуждения вопросов контроля и надзора за деятельностью арбитражных управляющих.',
      startDate: '2024-01-25T15:00:00Z',
      endDate: '2024-01-25T17:00:00Z',
      location: 'Офис СРО, г. Москва',
      type: eventTypes[3],
      status: eventStatuses[2],
      maxParticipants: 20,
      currentParticipants: 15,
      registrationRequired: false,
      featured: false,
      tags: ['совещание', 'контроль', 'надзор'],
      organizer: 'Администрация СРО',
      cover: '/assets/news_cover_beige.png'
    },
    {
      id: '5',
      title: 'Курс повышения квалификации "Современные методы оценки имущества"',
      description: '40-часовой курс повышения квалификации для арбитражных управляющих.',
      startDate: '2024-04-01T09:00:00Z',
      endDate: '2024-04-05T18:00:00Z',
      location: 'Учебный центр СРО, г. Москва',
      type: eventTypes[2],
      status: eventStatuses[0],
      maxParticipants: 25,
      currentParticipants: 12,
      registrationRequired: true,
      registrationDeadline: '2024-03-25T18:00:00Z',
      featured: false,
      tags: ['курс', 'квалификация', 'оценка'],
      organizer: 'Учебный центр СРО',
      contactEmail: 'education@sro-au.ru',
      price: 15000,
      currency: '₽',
      requirements: 'Стаж работы арбитражным управляющим не менее 2 лет',
      cover: '/assets/news_cover_beige.png'
    },
    {
      id: '6',
      title: 'Вебинар "Изменения в налоговом законодательстве"',
      description: 'Онлайн-вебинар по изменениям в налоговом законодательстве, влияющим на процедуры банкротства.',
      startDate: '2024-02-10T16:00:00Z',
      endDate: '2024-02-10T18:00:00Z',
      location: 'Онлайн (YouTube)',
      type: eventTypes[0],
      status: eventStatuses[2],
      maxParticipants: 100,
      currentParticipants: 87,
      registrationRequired: false,
      featured: false,
      tags: ['вебинар', 'налоги', 'онлайн'],
      organizer: 'СРО АУ',
      cover: '/assets/news_cover_beige.png'
    }
  ];

  const handleFiltersChange = (newFilters: EventFilterType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEventClick = (event: Event) => {
    // Переход на детальную страницу мероприятия
    window.location.href = `/events/${event.id}`;
  };

  const handleDateSelect = (date: Date) => {
    // Фильтрация по выбранной дате
    setFilters({
      ...filters,
      dateFrom: date.toISOString().split('T')[0],
      dateTo: date.toISOString().split('T')[0]
    });
  };

  return (
    <Layout
      title="Мероприятия - СРО АУ"
      description="Актуальные мероприятия, семинары, конференции и тренинги для арбитражных управляющих."
      keywords="мероприятия, семинары, конференции, тренинги, обучение, СРО, арбитражные управляющие"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Мероприятия
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Семинары, конференции, тренинги и другие мероприятия для повышения 
            квалификации арбитражных управляющих.
          </p>
        </div>

        {/* Переключатель вида */}
        <div className="flex justify-center mb-8">
          <div className="flex border border-neutral-300 rounded-lg">
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              onClick={() => setView('list')}
              className="rounded-r-none"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Список
            </Button>
            <Button
              variant={view === 'calendar' ? 'default' : 'ghost'}
              onClick={() => setView('calendar')}
              className="rounded-l-none border-l-0"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Календарь
            </Button>
          </div>
        </div>

        {/* Фильтры */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Поиск и фильтрация
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Input
                label="Поиск по названию"
                placeholder="Введите название мероприятия"
                value={filters.query || ''}
                onChange={(e) => setFilters({...filters, query: e.target.value})}
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Тип мероприятия
                </label>
                <select 
                  value={filters.type || ''}
                  onChange={(e) => setFilters({...filters, type: e.target.value || undefined})}
                  className="form-input"
                >
                  <option value="">Все типы</option>
                  {eventTypes.map((type) => (
                    <option key={type.id} value={type.slug}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Статус
                </label>
                <select 
                  value={filters.status || ''}
                  onChange={(e) => setFilters({...filters, status: e.target.value || undefined})}
                  className="form-input"
                >
                  <option value="">Все статусы</option>
                  {eventStatuses.map((status) => (
                    <option key={status.id} value={status.slug}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Место проведения
                </label>
                <Input
                  placeholder="Город или место"
                  value={filters.location || ''}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  leftIcon={<MapPinIcon className="h-5 w-5" />}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1 sm:flex-none"
                onClick={() => setFilters(filters)}
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Найти
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none"
                onClick={handleResetFilters}
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Сбросить фильтры
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Контент */}
        {view === 'list' ? (
          <EventsList
            events={events}
            onEventClick={handleEventClick}
            showFeatured={true}
            showPagination={true}
            currentPage={currentPage}
            totalPages={Math.ceil(events.length / 9)}
            onPageChange={handlePageChange}
          />
        ) : (
          <EventCalendar
            events={events}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
            view="month"
          />
        )}
      </div>
    </Layout>
  );
}
