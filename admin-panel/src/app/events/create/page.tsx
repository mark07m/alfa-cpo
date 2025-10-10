'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { EventForm } from '@/components/admin/events/EventForm'
import { useEvents } from '@/hooks/admin/useEvents'
import { Event } from '@/types/admin'

export default function CreateEventPage() {
  const router = useRouter()
  const { createEvent, eventTypes, fetchEventTypes } = useEvents()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchEventTypes()
  }, [fetchEventTypes])

  const handleSubmit = async (eventData: Partial<Event>) => {
    setIsSubmitting(true)
    try {
      const result = await createEvent(eventData)
      if (result.success) {
        router.push('/events')
      } else {
        console.error('Failed to create event:', result.error)
      }
    } catch (error) {
      console.error('Error creating event:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/events')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Создание мероприятия"
          subtitle="Заполните форму для создания нового мероприятия"
          backUrl="/events"
          backLabel="К мероприятиям"
        />

        <EventForm
          eventTypes={eventTypes}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </AdminLayout>
  )
}
