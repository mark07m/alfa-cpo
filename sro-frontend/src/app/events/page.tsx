'use client';

import Layout from '@/components/layout/Layout';
import { EventsList, EventCalendar } from '@/components/events';
import { Event, EventType, EventStatus, EventFilter as EventFilterType } from '@/types';
import { useEffect, useState } from 'react';
import { eventsService } from '@/services/events';
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

  const [eventTypes, setEventTypes] = useState<EventType[]>([])

  const eventStatuses: EventStatus[] = [
    { id: '1', name: 'Предстоящее', slug: 'upcoming', color: '#10B981' },
    { id: '2', name: 'Идет сейчас', slug: 'ongoing', color: '#3B82F6' },
    { id: '3', name: 'Завершено', slug: 'completed', color: '#6B7280' },
    { id: '4', name: 'Отменено', slug: 'cancelled', color: '#EF4444' }
  ];

  const [events, setEvents] = useState<Event[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const res = await eventsService.types()
        if (res.success) setEventTypes(res.data || [])
      } catch {}
    }
    loadTypes()
  }, [])

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      try {
        const res = await eventsService.list({
          query: filters.query,
          type: filters.type,
          status: filters.status,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          location: filters.location,
          featured: filters.featured,
          registrationRequired: filters.registrationRequired,
          page: currentPage,
          limit: 9,
          sortBy: 'startDate',
          sortOrder: 'desc'
        })
        if (res.success) {
          setEvents(res.data.data)
          setTotalPages(res.data.pagination.totalPages)
        }
      } catch (e) {
        setEvents([])
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [filters, currentPage])

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
            totalPages={totalPages}
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
