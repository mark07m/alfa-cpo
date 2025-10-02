'use client';

import React from 'react';
import Image from 'next/image';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { EventCardProps } from '@/types';
import { 
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  TagIcon,
  StarIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function EventCard({
  event,
  onClick,
  variant = 'default',
  showRegistration = true,
  onRegister
}: EventCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRegister) {
      onRegister(event);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
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
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const getCardClasses = () => {
    const baseClasses = "hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-amber-200";
    
    switch (variant) {
      case 'featured':
        return `${baseClasses} border-amber-200 bg-gradient-to-br from-amber-50 to-beige-50`;
      case 'compact':
        return `${baseClasses} hover:shadow-lg`;
      default:
        return baseClasses;
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case 'featured':
        return 'h-64';
      case 'compact':
        return 'h-32';
      default:
        return 'h-48';
    }
  };

  const getTitleSize = () => {
    switch (variant) {
      case 'featured':
        return 'text-xl';
      case 'compact':
        return 'text-base';
      default:
        return 'text-lg';
    }
  };

  const getDescriptionLines = () => {
    switch (variant) {
      case 'featured':
        return 'line-clamp-4';
      case 'compact':
        return 'line-clamp-2';
      default:
        return 'line-clamp-3';
    }
  };

  const coverImage = event.cover || event.imageUrl || '/assets/news_cover_beige.png';
  const isRegistrationOpen = event.registrationRequired && 
    event.registrationDeadline && 
    new Date(event.registrationDeadline) > new Date();

  return (
    <Card 
      className={`${getCardClasses()} cursor-pointer`}
      onClick={handleClick}
    >
      {/* Обложка мероприятия */}
      <div className={`relative w-full ${getImageHeight()} bg-gradient-to-br from-beige-100 to-amber-50`}>
        <Image
          src={coverImage}
          alt={event.title}
          fill
          className="object-cover"
          loading="lazy"
        />
        
        {/* Декоративная рамка */}
        <div className="absolute inset-0 border-2 border-white/50"></div>
        
        {/* Статус */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status.slug)}`}>
            {getStatusText(event.status.slug)}
          </span>
        </div>
        
        {/* Важное мероприятие - звездочка */}
        {event.featured && (
          <div className="absolute top-2 right-2">
            <div className="bg-amber-500 text-white p-1 rounded-full">
              <StarIcon className="h-4 w-4" />
            </div>
          </div>
        )}
        
        {/* Тип мероприятия */}
        <div className="absolute bottom-2 left-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-neutral-700">
            <TagIcon className="h-3 w-3 mr-1" />
            {event.type.name}
          </span>
        </div>
      </div>
      
      <CardHeader>
        <h3 className={`font-semibold text-neutral-900 mb-2 line-clamp-2 ${getTitleSize()}`}>
          {event.title}
        </h3>
        
        <div className="space-y-2 text-sm text-neutral-600">
          {/* Дата и время */}
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatDate(event.startDate)}</span>
            {formatTime(event.startDate) && (
              <span className="ml-2">в {formatTime(event.startDate)}</span>
            )}
          </div>
          
          {/* Место проведения */}
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          {/* Участники */}
          {event.maxParticipants && (
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {event.currentParticipants || 0} / {event.maxParticipants} участников
              </span>
            </div>
          )}
          
          {/* Цена */}
          {event.price && (
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {event.price} {event.currency || '₽'}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className={`text-neutral-600 mb-4 ${getDescriptionLines()}`}>
          {event.description}
        </p>
        
        {/* Теги */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-600"
              >
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-600">
                +{event.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm">
            Подробнее
          </Button>
          
          {/* Регистрация */}
          {showRegistration && event.registrationRequired && (
            <div className="flex flex-col items-end space-y-2">
              {isRegistrationOpen ? (
                <Button 
                  size="sm"
                  onClick={handleRegister}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  Зарегистрироваться
                </Button>
              ) : (
                <span className="text-xs text-red-600 font-medium">
                  Регистрация закрыта
                </span>
              )}
              
              {event.registrationDeadline && (
                <span className="text-xs text-neutral-500">
                  До: {formatDate(event.registrationDeadline)}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
