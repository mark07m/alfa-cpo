'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { Button } from '@/components/admin/ui/Button'
import { EventForm } from '@/components/admin/events/EventForm'
import { useEvents } from '@/hooks/admin/useEvents'
import { Event } from '@/types/admin'

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string
  
  const { 
    selectedEvent, 
    eventTypes, 
    fetchEvent, 
    updateEvent, 
    fetchEventTypes 
  } = useEvents()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([
          fetchEvent(eventId),
          fetchEventTypes()
        ])
      } catch (error) {
        console.error('Error loading event data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (eventId) {
      loadData()
    }
  }, [eventId, fetchEvent, fetchEventTypes])

  const handleSubmit = async (eventData: Partial<Event>) => {
    setIsSubmitting(true)
    try {
      const result = await updateEvent(eventId, eventData)
      if (result.success) {
        router.push('/events')
      } else {
        console.error('Failed to update event:', result.error)
      }
    } catch (error) {
      console.error('Error updating event:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/events')
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!selectedEvent) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Мероприятие не найдено</h2>
            <p className="text-gray-600 mb-8">
              Запрашиваемое мероприятие не существует или было удалено
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/events')}
            >
              Вернуться к списку
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Редактирование мероприятия"
          subtitle={selectedEvent.title}
          backUrl="/events"
          backLabel="К мероприятиям"
        />

        <EventForm
          event={selectedEvent}
          eventTypes={eventTypes}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </AdminLayout>
  )
}
