'use client';

import React, { useState, useMemo } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { EventCalendarProps, Event } from '@/types';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function EventCalendar({
  events,
  currentDate = new Date(),
  onDateSelect,
  onEventClick,
  view = 'month',
  onViewChange
}: EventCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [calendarDate, setCalendarDate] = useState(currentDate);

  const monthStart = startOfMonth(calendarDate);
  const monthEnd = endOfMonth(calendarDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const eventsByDate = useMemo(() => {
    const eventsMap = new Map<string, Event[]>();
    
    events.forEach(event => {
      const eventDate = new Date(event.startDate);
      const dateKey = format(eventDate, 'yyyy-MM-dd');
      
      if (!eventsMap.has(dateKey)) {
        eventsMap.set(dateKey, []);
      }
      eventsMap.get(dateKey)!.push(event);
    });
    
    return eventsMap;
  }, [events]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCalendarDate(subMonths(calendarDate, 1));
    } else {
      setCalendarDate(addMonths(calendarDate, 1));
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCalendarDate(today);
    setSelectedDate(today);
    if (onDateSelect) {
      onDateSelect(today);
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return eventsByDate.get(dateKey) || [];
  };

  const getEventStatusColor = (event: Event) => {
    switch (event.status.slug) {
      case 'upcoming':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-900">
            Календарь мероприятий
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              Сегодня
            </Button>
            {onViewChange && (
              <div className="flex border border-neutral-300 rounded-lg">
                <Button
                  variant={view === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('month')}
                  className="rounded-r-none"
                >
                  Месяц
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('week')}
                  className="rounded-none border-l-0"
                >
                  Неделя
                </Button>
                <Button
                  variant={view === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('day')}
                  className="rounded-l-none border-l-0"
                >
                  День
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Навигация по месяцам */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          
          <h3 className="text-xl font-semibold text-neutral-900">
            {format(calendarDate, 'MMMM yyyy', { locale: ru })}
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Календарная сетка */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Заголовки дней недели */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-neutral-600 bg-neutral-50"
            >
              {day}
            </div>
          ))}
          
          {/* Дни месяца */}
          {calendarDays.map((day) => {
            const isCurrentMonth = isSameMonth(day, calendarDate);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const dayEvents = getEventsForDate(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[100px] p-2 border border-neutral-200 cursor-pointer hover:bg-neutral-50
                  ${isCurrentMonth ? 'bg-white' : 'bg-neutral-50 text-neutral-400'}
                  ${isSelected ? 'bg-beige-100 border-beige-300' : ''}
                  ${isToday ? 'ring-2 ring-amber-300' : ''}
                `}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isToday ? 'text-amber-700' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs text-neutral-500">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                
                {/* События на день */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`
                        text-xs p-1 rounded border truncate cursor-pointer
                        ${getEventStatusColor(event)}
                      `}
                      onClick={(e) => handleEventClick(event, e)}
                      title={event.title}
                    >
                      {format(new Date(event.startDate), 'HH:mm')} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-neutral-500 text-center">
                      +{dayEvents.length - 2} еще
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Легенда */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-2"></div>
            <span>Предстоящие</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded mr-2"></div>
            <span>Идут сейчас</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-2"></div>
            <span>Завершенные</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-2"></div>
            <span>Отмененные</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
