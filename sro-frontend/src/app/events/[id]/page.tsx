'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { EventDetail } from '@/components/events';
import { Event, EventType, EventStatus } from '@/types';
import Loading from '@/components/ui/Loading';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const allEvents: Event[] = [
    {
      id: '1',
      title: 'Семинар "Новеллы в законодательстве о банкротстве"',
      description: 'Семинар для членов СРО по обсуждению последних изменений в законодательстве о несостоятельности.',
      content: '<p>15 февраля 2024 года состоится семинар для членов СРО по обсуждению последних изменений в законодательстве о несостоятельности.</p><p>В программе семинара:</p><ul><li>Обзор изменений в ФЗ "О несостоятельности (банкротстве)"</li><li>Практические аспекты применения новых норм</li><li>Ответы на вопросы участников</li></ul><h3>Программа мероприятия</h3><p><strong>10:00 - 10:30</strong> Регистрация участников</p><p><strong>10:30 - 12:00</strong> Обзор изменений в законодательстве (докладчик: Иванов И.И.)</p><p><strong>12:00 - 12:30</strong> Кофе-брейк</p><p><strong>12:30 - 14:00</strong> Практические аспекты применения (докладчик: Петров П.П.)</p><p><strong>14:00 - 15:00</strong> Обед</p><p><strong>15:00 - 16:30</strong> Вопросы и ответы</p><h3>Регистрация</h3><p>Для участия в семинаре необходимо зарегистрироваться до 10 февраля 2024 года по телефону +7 (495) 123-45-67 или по электронной почте events@sro-au.ru</p>',
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

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const eventId = params.id as string;
        
        // Имитация загрузки
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundEvent = allEvents.find(item => item.id === eventId);
        
        if (!foundEvent) {
          setError('Мероприятие не найдено');
          return;
        }
        
        setEvent(foundEvent);
        
        // Находим похожие мероприятия (того же типа, исключая текущее)
        const related = allEvents
          .filter(item => 
            item.id !== eventId && 
            item.type.id === foundEvent.type.id
          )
          .slice(0, 3);
        
        setRelatedEvents(related);
      } catch (err) {
        setError('Ошибка загрузки мероприятия');
        console.error('Error loading event:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadEvent();
    }
  }, [params.id]);

  const handleBack = () => {
    router.push('/events');
  };

  const handleShare = (eventItem: Event) => {
    if (navigator.share) {
      navigator.share({
        title: eventItem.title,
        text: eventItem.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleRegister = (eventItem: Event) => {
    // Здесь можно добавить логику регистрации
    alert(`Регистрация на мероприятие: ${eventItem.title}`);
  };

  const handleAddToCalendar = (eventItem: Event) => {
    const startDate = new Date(eventItem.startDate);
    const endDate = eventItem.endDate ? new Date(eventItem.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventItem.title)}&dates=${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}&details=${encodeURIComponent(eventItem.description)}&location=${encodeURIComponent(eventItem.location)}`;
    
    window.open(calendarUrl, '_blank');
  };

  if (loading) {
    return (
      <Layout
        title="Загрузка мероприятия - СРО АУ"
        description="Загрузка мероприятия..."
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout
        title="Мероприятие не найдено - СРО АУ"
        description="Запрашиваемое мероприятие не найдено"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="text-center py-12">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-neutral-900 mb-4">
                Мероприятие не найдено
              </h1>
              <p className="text-neutral-600 mb-6">
                Запрашиваемое мероприятие не существует или было удалено.
              </p>
              <Button onClick={handleBack}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Вернуться к мероприятиям
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${event.title} - СРО АУ`}
      description={event.description}
      keywords={event.tags?.join(', ') || ''}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EventDetail
          event={event}
          relatedEvents={relatedEvents}
          onBack={handleBack}
          onShare={handleShare}
          onRegister={handleRegister}
          onAddToCalendar={handleAddToCalendar}
        />
      </div>
    </Layout>
  );
}
