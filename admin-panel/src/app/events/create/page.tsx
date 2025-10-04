'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
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
        {/* Заголовок страницы */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Создание мероприятия
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Заполните форму для создания нового мероприятия
            </p>
          </div>
        </div>

        {/* Форма */}
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
