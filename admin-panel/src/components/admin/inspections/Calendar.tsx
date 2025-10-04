'use client';

import { useState } from 'react';
import { Button } from '@/components/admin/ui/Button';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Inspection {
  id: string;
  arbitratorName: string;
  inspectorName: string;
  type: 'planned' | 'unplanned';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  plannedDate: string;
  description: string;
}

interface CalendarProps {
  inspections: Inspection[];
  loading: boolean;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onInspectionSelect: (inspection: Inspection) => void;
}

export function Calendar({
  inspections,
  loading,
  selectedDate,
  onDateSelect,
  onInspectionSelect
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Добавляем пустые ячейки для начала месяца
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getInspectionsForDate = (date: Date) => {
    return inspections.filter(inspection => {
      const inspectionDate = new Date(inspection.plannedDate);
      return inspectionDate.toDateString() === date.toDateString();
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <ClockIcon className="h-3 w-3 text-blue-500" />;
      case 'in_progress':
        return <ClockIcon className="h-3 w-3 text-yellow-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-3 w-3 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-3 w-3 text-red-500" />;
      default:
        return <ClockIcon className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Заголовок календаря */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              Сегодня
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Календарная сетка */}
      <div className="p-6">
        {/* Дни недели */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Дни месяца */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-20"></div>;
            }

            const dayInspections = getInspectionsForDate(date);
            const isCurrentDay = isToday(date);
            const isSelectedDay = isSelected(date);

            return (
              <div
                key={date.toISOString()}
                className={`
                  h-20 border border-gray-200 rounded-lg p-2 cursor-pointer transition-colors
                  ${isCurrentDay ? 'bg-blue-50 border-blue-300' : ''}
                  ${isSelectedDay ? 'bg-blue-100 border-blue-400' : ''}
                  hover:bg-gray-50
                `}
                onClick={() => onDateSelect(date)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`
                    text-sm font-medium
                    ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}
                    ${isSelectedDay ? 'text-blue-800' : ''}
                  `}>
                    {date.getDate()}
                  </span>
                  {dayInspections.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {dayInspections.length}
                    </span>
                  )}
                </div>
                
                {/* Инспекции на этот день */}
                <div className="space-y-1">
                  {dayInspections.slice(0, 2).map(inspection => (
                    <div
                      key={inspection.id}
                      className={`
                        text-xs px-1 py-0.5 rounded truncate cursor-pointer
                        ${getStatusColor(inspection.status)}
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectionSelect(inspection);
                      }}
                      title={`${inspection.arbitratorName} - ${inspection.description}`}
                    >
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(inspection.status)}
                        <span className="truncate">
                          {inspection.arbitratorName.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                  {dayInspections.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayInspections.length - 2} еще
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
