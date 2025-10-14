'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { EventDetail } from '@/components/events';
import { Event } from '@/types';
import { eventsService } from '@/services/events';
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

  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const id = params.id as string;
        setEventId(id);
        const res = await eventsService.getById(id)
        if (!res.success || !res.data) {
          setError('Мероприятие не найдено');
          return;
        }
        setEvent(res.data)
        const typeSlug = (res.data.type as any)?.slug
        if (typeSlug) {
          const relatedRes = await eventsService.byType(typeSlug, 3, res.data.id)
          if (relatedRes.success) setRelatedEvents(relatedRes.data || [])
        } else {
          setRelatedEvents([])
        }
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

  const handleRegister = async (eventItem: Event) => {
    try {
      const payload = { fullName: 'Гость', email: 'guest@example.com' }
      const res = await eventsService.register(eventItem.id, payload)
      if (res.success) alert(res.data?.message || 'Регистрация успешна')
      else alert('Не удалось зарегистрироваться')
    } catch (e) {
      alert('Ошибка регистрации')
    }
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
