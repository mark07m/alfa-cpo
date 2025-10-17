'use client';

import React from 'react';
import Image from 'next/image';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import SanitizedHtml from '@/components/common/SanitizedHtml';
import Button from '@/components/ui/Button';
import EventCard from './EventCard';
import { EventDetailProps } from '@/types';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  TagIcon,
  StarIcon,
  ShareIcon,
  PrinterIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function EventDetail({
  event,
  relatedEvents = [],
  onBack,
  onShare,
  onRegister,
  onAddToCalendar
}: EventDetailProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: ru });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: ru });
    } catch {
      return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Предстоящее';
      case 'ongoing':
        return 'Идет сейчас';
      case 'completed':
        return 'Завершено';
      case 'cancelled':
        return 'Отменено';
      default:
        return status;
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(event);
    } else if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister(event);
    }
  };

  const handleAddToCalendar = () => {
    if (onAddToCalendar) {
      onAddToCalendar(event);
    } else {
      // Создаем ссылку для добавления в календарь
      const startDate = new Date(event.startDate);
      const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // +2 часа по умолчанию
      
      const formatDateForCalendar = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
      
      window.open(calendarUrl, '_blank');
    }
  };

  const isRegistrationOpen = event.registrationRequired && 
    event.registrationDeadline && 
    new Date(event.registrationDeadline) > new Date();

  const coverImage = event.cover || event.imageUrl || '/assets/news_cover_beige.png';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Навигация */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Назад к мероприятиям
        </Button>
      </div>

      {/* Основной контент */}
      <Card className="mb-8">
        {/* Заголовок и метаданные */}
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status.slug)}`}>
                  {getStatusText(event.status.slug)}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-beige-100 text-beige-800">
                  <TagIcon className="h-3 w-3 mr-1" />
                  {event.type.name}
                </span>
                {event.featured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <StarIcon className="h-3 w-3 mr-1" />
                    Важное мероприятие
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                {event.title}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600 mb-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <div>
                    <div>Начало: {formatDateTime(event.startDate)}</div>
                    {event.endDate && (
                      <div>Окончание: {formatDateTime(event.endDate)}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
                
                {event.maxParticipants && (
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>
                      {event.currentParticipants || 0} / {event.maxParticipants} участников
                    </span>
                  </div>
                )}
                
                {event.price && (
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>
                      {event.price} {event.currency || '₽'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Действия */}
            <div className="flex flex-col space-y-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <ShareIcon className="h-4 w-4 mr-1" />
                Поделиться
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToCalendar}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                В календарь
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <PrinterIcon className="h-4 w-4 mr-1" />
                Печать
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Обложка */}
        <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-beige-100 to-amber-50 mb-6">
          <Image
            src={coverImage}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 border-2 border-white/50"></div>
        </div>

        {/* Контент */}
        <CardContent>
          {/* Описание */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-neutral-700 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Основной текст */}
          {event.content && (
            <SanitizedHtml html={event.content} className="prose prose-lg max-w-none mb-8" />
          )}

          {/* Программа мероприятия */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="border-t border-neutral-200 pt-6 mb-8">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Программа мероприятия
              </h3>
              <div className="space-y-4">
                {event.agenda.map((item, index) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-20 text-sm font-medium text-neutral-600">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900">{item.title}</h4>
                      {item.description && (
                        <p className="text-sm text-neutral-600 mt-1">{item.description}</p>
                      )}
                      {item.speaker && (
                        <p className="text-sm text-neutral-500 mt-1">Спикер: {item.speaker}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Требования */}
          {event.requirements && (
            <div className="border-t border-neutral-200 pt-6 mb-8">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Требования к участникам
              </h3>
              <div className="prose prose-sm max-w-none">
                <p>{event.requirements}</p>
              </div>
            </div>
          )}

          {/* Контактная информация */}
          {(event.contactEmail || event.contactPhone || event.organizer) && (
            <div className="border-t border-neutral-200 pt-6 mb-8">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Контактная информация
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.organizer && (
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-2 text-neutral-500" />
                    <span className="text-sm text-neutral-700">Организатор: {event.organizer}</span>
                  </div>
                )}
                {event.contactEmail && (
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-neutral-500" />
                    <a href={`mailto:${event.contactEmail}`} className="text-sm text-beige-600 hover:text-beige-700">
                      {event.contactEmail}
                    </a>
                  </div>
                )}
                {event.contactPhone && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2 text-neutral-500" />
                    <a href={`tel:${event.contactPhone}`} className="text-sm text-beige-600 hover:text-beige-700">
                      {event.contactPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Материалы */}
          {event.materials && event.materials.length > 0 && (
            <div className="border-t border-neutral-200 pt-6 mb-8">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Материалы мероприятия
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.materials.map((material) => (
                  <div key={material.id} className="flex items-center p-3 border border-neutral-200 rounded-lg">
                    <DocumentTextIcon className="h-8 w-8 text-neutral-400 mr-3" />
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900">{material.title}</h4>
                      <p className="text-sm text-neutral-600">{material.fileType.toUpperCase()} • {Math.round(material.fileSize / 1024)} КБ</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Скачать
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Регистрация */}
          {event.registrationRequired && (
            <div className="border-t border-neutral-200 pt-6 mb-8">
              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Регистрация на мероприятие
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-700 mb-2">
                      {isRegistrationOpen ? 'Регистрация открыта' : 'Регистрация закрыта'}
                    </p>
                    {event.registrationDeadline && (
                      <p className="text-sm text-neutral-600">
                        {isRegistrationOpen ? 'До' : 'Закрыта'} {formatDate(event.registrationDeadline)}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleRegister}
                    disabled={!isRegistrationOpen}
                    className={isRegistrationOpen ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    {isRegistrationOpen ? 'Зарегистрироваться' : 'Регистрация закрыта'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Теги */}
          {event.tags && event.tags.length > 0 && (
            <div className="border-t border-neutral-200 pt-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Теги
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Похожие мероприятия */}
      {relatedEvents.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900">
              Похожие мероприятия
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.slice(0, 3).map((relatedEvent) => (
                <EventCard
                  key={relatedEvent.id}
                  event={relatedEvent}
                  variant="compact"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
