'use client';

import React from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import EventCard from './EventCard';
import { EventsListProps, Event } from '@/types';
import { 
  CalendarIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

export default function EventsList({
  events,
  loading = false,
  error,
  onEventClick,
  showFeatured = true,
  showCalendar = true,
  showPagination = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}: EventsListProps) {
  const featuredEvents = events.filter(event => event.featured);
  const regularEvents = events.filter(event => !event.featured);
  const upcomingEvents = events.filter(event => event.status.slug === 'upcoming');
  const ongoingEvents = events.filter(event => event.status.slug === 'ongoing');

  const handleEventClick = (event: Event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Ошибка загрузки мероприятий
          </h3>
          <p className="text-neutral-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CalendarIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Мероприятия не найдены
          </h3>
          <p className="text-neutral-600">
            Попробуйте изменить параметры поиска или фильтрации
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Текущие мероприятия */}
        {ongoingEvents.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center">
                <ClockIcon className="h-6 w-6 mr-2 text-blue-600" />
                Идут сейчас
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ongoingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    variant="featured"
                    onClick={handleEventClick}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Важные мероприятия */}
        {showFeatured && featuredEvents.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                Важные мероприятия
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    variant="featured"
                    onClick={handleEventClick}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Предстоящие мероприятия */}
        {upcomingEvents.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-neutral-900">
                  Предстоящие мероприятия
                </h2>
                <span className="text-sm text-neutral-600">
                  Найдено: {upcomingEvents.length} мероприятий
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={handleEventClick}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Все мероприятия */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-neutral-900">
                {upcomingEvents.length > 0 ? 'Все мероприятия' : 'Мероприятия'}
              </h2>
              <span className="text-sm text-neutral-600">
                Найдено: {events.length} мероприятий
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={handleEventClick}
                />
              ))}
            </div>

            {/* Пагинация */}
            {showPagination && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Предыдущая
                  </Button>

                  {/* Номера страниц */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          size="sm"
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Следующая
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </nav>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="text-center py-6">
              <CalendarIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Всего мероприятий
              </h3>
              <p className="text-2xl font-bold text-beige-700">{events.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <ClockIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Предстоящих
              </h3>
              <p className="text-2xl font-bold text-green-700">{upcomingEvents.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <MapPinIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Идут сейчас
              </h3>
              <p className="text-2xl font-bold text-blue-700">{ongoingEvents.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <CalendarIcon className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Важных
              </h3>
              <p className="text-2xl font-bold text-amber-700">{featuredEvents.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
}
