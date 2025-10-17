'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { ActionButtons } from '@/components/admin/ui/ActionButtons'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { Badge } from '@/components/admin/ui/Badge'
import { useEvents } from '@/hooks/admin/useEvents'
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  ClockIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import Image from 'next/image'
import SanitizedHtml from '@/components/admin/ui/sanitizers/SanitizedHtml'

export default function EventViewPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string
  
  const { 
    selectedEvent, 
    fetchEvent, 
    deleteEvent, 
    updateEventStatus 
  } = useEvents()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true)
      try {
        await fetchEvent(eventId)
      } catch (error) {
        console.error('Error loading event:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (eventId) {
      loadEvent()
    }
  }, [eventId, fetchEvent])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteEvent(eventId)
      if (result.success) {
        router.push('/events')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleStatusChange = async (status: 'draft' | 'published' | 'cancelled' | 'completed') => {
    try {
      await updateEventStatus(eventId, status)
    } catch (error) {
      console.error('Error updating event status:', error)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru })
    } catch {
      return dateString
    }
  }

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = format(new Date(startDate), 'dd.MM.yyyy', { locale: ru })
    if (!endDate) return start
    
    const end = format(new Date(endDate), 'dd.MM.yyyy', { locale: ru })
    return start === end ? start : `${start} - ${end}`
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Черновик' },
      published: { color: 'bg-green-100 text-green-800', label: 'Опубликовано' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Отменено' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Завершено' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
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
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
            <Link
              href="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-all duration-150"
            >
              Вернуться к списку
            </Link>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <PageHeader
          title={selectedEvent.title}
          subtitle={formatDateRange(selectedEvent.startDate, selectedEvent.endDate)}
          backUrl="/events"
          backLabel="К мероприятиям"
          badge={
            <div className="flex items-center gap-2">
              {getStatusBadge(selectedEvent.status)}
              {selectedEvent.featured && (
                <Badge color="yellow" size="sm">Рекомендуемое</Badge>
              )}
            </div>
          }
          secondaryActions={[
            {
              label: selectedEvent.status === 'published' ? 'Снять с публикации' : 'Опубликовать',
              onClick: () => handleStatusChange(selectedEvent.status === 'published' ? 'draft' : 'published'),
              icon: selectedEvent.status === 'published' ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />,
              variant: selectedEvent.status === 'published' ? 'outline' : 'success'
            }
          ]}
          primaryAction={{
            label: 'Редактировать',
            onClick: () => router.push(`/events/${selectedEvent.id}/edit`),
            variant: 'primary'
          }}
        />
        
        {/* Delete Button */}
        <div className="flex justify-end">
          <ActionButtons
            actions={[
              {
                type: 'delete',
                onClick: () => setShowDeleteDialog(true),
                disabled: isDeleting
              }
            ]}
          />
        </div>

        {/* Основная информация */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Изображение */}
          {selectedEvent.imageUrl && (
            <div className="h-64 w-full relative">
              <Image
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="px-6 py-8">
            {/* Описание */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Описание</h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            {/* Полное содержание */}
            {selectedEvent.content && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Подробное описание</h3>
                <SanitizedHtml html={selectedEvent.content} className="text-gray-700 leading-relaxed prose max-w-none" />
              </div>
            )}

            {/* Детали мероприятия */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о мероприятии</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Дата и время</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDateRange(selectedEvent.startDate, selectedEvent.endDate)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Место проведения</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedEvent.location}
                    </dd>
                  </div>

                  {selectedEvent.maxParticipants && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Участники</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <UsersIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedEvent.currentParticipants} / {selectedEvent.maxParticipants}
                      </dd>
                    </div>
                  )}

                  {selectedEvent.registrationRequired && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Регистрация</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedEvent.registrationDeadline 
                          ? `До ${formatDate(selectedEvent.registrationDeadline)}`
                          : 'Требуется'
                        }
                      </dd>
                    </div>
                  )}

                  {selectedEvent.price !== undefined && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Стоимость</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedEvent.price === 0 ? 'Бесплатно' : `${selectedEvent.price} ${selectedEvent.currency}`}
                      </dd>
                    </div>
                  )}

                  {selectedEvent.organizer && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Организатор</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedEvent.organizer}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Контактная информация</h3>
                <dl className="space-y-4">
                  {selectedEvent.contactEmail && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a 
                          href={`mailto:${selectedEvent.contactEmail}`}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          {selectedEvent.contactEmail}
                        </a>
                      </dd>
                    </div>
                  )}

                  {selectedEvent.contactPhone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Телефон</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a 
                          href={`tel:${selectedEvent.contactPhone}`}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          {selectedEvent.contactPhone}
                        </a>
                      </dd>
                    </div>
                  )}

                  {selectedEvent.requirements && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Требования к участникам</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedEvent.requirements}</dd>
                    </div>
                  )}
                </dl>

                {/* Теги */}
                {selectedEvent.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Теги</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Программа мероприятия */}
            {selectedEvent.agenda && selectedEvent.agenda.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Программа мероприятия</h3>
                <div className="space-y-4">
                  {selectedEvent.agenda.map((item, index) => (
                    <div key={item.id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <span className="text-sm font-medium text-primary-600">
                              {item.time}
                            </span>
                            {item.duration && (
                              <span className="text-sm text-gray-500">
                                {item.duration} мин.
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {item.title}
                          </h4>
                          {item.speaker && (
                            <p className="text-sm text-gray-600 mb-2">
                              Докладчик: {item.speaker}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-sm text-gray-700">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEO информация */}
            {(selectedEvent.seoTitle || selectedEvent.seoDescription || selectedEvent.seoKeywords) && (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO информация</h3>
                <dl className="space-y-4">
                  {selectedEvent.seoTitle && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">SEO заголовок</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedEvent.seoTitle}</dd>
                    </div>
                  )}
                  {selectedEvent.seoDescription && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">SEO описание</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedEvent.seoDescription}</dd>
                    </div>
                  )}
                  {selectedEvent.seoKeywords && selectedEvent.seoKeywords.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">SEO ключевые слова</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedEvent.seoKeywords.join(', ')}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
        
        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Удалить мероприятие?"
          message={`Вы уверены, что хотите удалить мероприятие "${selectedEvent.title}"? Это действие нельзя отменить.`}
          confirmLabel="Удалить"
          cancelLabel="Отмена"
          type="danger"
          loading={isDeleting}
        />
      </div>
    </AdminLayout>
  )
}
