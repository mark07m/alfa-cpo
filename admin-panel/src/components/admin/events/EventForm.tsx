'use client'

import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Event, EventType, EventAgendaItem } from '@/types/admin'
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  ClockIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Input } from '@/components/admin/ui/Input'
import { Select } from '@/components/admin/ui/Select'
import { Textarea } from '@/components/admin/ui/Textarea'
import { Button } from '@/components/admin/ui/Button'
import { Checkbox } from '@/components/admin/ui/Checkbox'

interface EventFormProps {
  event?: Event
  eventTypes: EventType[]
  onSubmit: (data: Partial<Event>) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

interface EventFormData {
  title: string
  description: string
  content?: string
  startDate: string
  endDate?: string
  location: string
  type?: string
  status: Event['status']
  maxParticipants?: number
  registrationRequired: boolean
  registrationDeadline?: string
  imageUrl?: string
  cover?: string
  featured: boolean
  tags: string[]
  organizer?: string
  contactEmail?: string
  contactPhone?: string
  price?: number
  currency: string
  requirements?: string
  agenda: EventAgendaItem[]
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

export function EventForm({
  event,
  eventTypes,
  onSubmit,
  onCancel,
  isSubmitting
}: EventFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'agenda' | 'seo'>('basic')

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<EventFormData>({
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      content: event?.content || '',
      startDate: event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
      endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      location: event?.location || '',
      type: event?.type?.id || '',
      status: event?.status || 'draft',
      maxParticipants: event?.maxParticipants || undefined,
      registrationRequired: event?.registrationRequired || false,
      registrationDeadline: event?.registrationDeadline ? new Date(event.registrationDeadline).toISOString().slice(0, 16) : '',
      imageUrl: event?.imageUrl || '',
      cover: event?.cover || '',
      featured: event?.featured || false,
      tags: event?.tags || [],
      organizer: event?.organizer || '',
      contactEmail: event?.contactEmail || '',
      contactPhone: event?.contactPhone || '',
      price: event?.price || undefined,
      currency: event?.currency || 'RUB',
      requirements: event?.requirements || '',
      agenda: event?.agenda || [],
      seoTitle: event?.seoTitle || '',
      seoDescription: event?.seoDescription || '',
      seoKeywords: event?.seoKeywords || []
    }
  })

  const { fields: agendaFields, append: appendAgenda, remove: removeAgenda } = useFieldArray({
    control,
    name: 'agenda'
  })

  const watchedTags = watch('tags')
  const watchedImageUrl = watch('imageUrl')
  const watchedRegistrationRequired = watch('registrationRequired')

  useEffect(() => {
    if (watchedImageUrl) {
      setPreviewImage(watchedImageUrl)
    }
  }, [watchedImageUrl])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setValue('imageUrl', result)
        setPreviewImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !watchedTags.includes(tag)) {
      setValue('tags', [...watchedTags, tag])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove))
  }

  const addAgendaItem = () => {
    appendAgenda({
      id: Date.now().toString(),
      time: '',
      title: '',
      description: '',
      speaker: '',
      duration: undefined
    })
  }

  const onFormSubmit = async (data: EventFormData) => {
    const eventData: Partial<Event> = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline).toISOString() : undefined,
      type: data.type ? { id: data.type } as EventType : undefined,
      tags: data.tags.filter(tag => tag.trim() !== ''),
      agenda: data.agenda.filter(item => item.title.trim() !== ''),
      seoKeywords: data.seoKeywords?.filter(keyword => keyword.trim() !== '')
    }

    await onSubmit(eventData)
  }

  const tabs = [
    { id: 'basic', name: 'Основная информация', icon: CalendarIcon },
    { id: 'details', name: 'Детали', icon: UsersIcon },
    { id: 'agenda', name: 'Программа', icon: ClockIcon },
    { id: 'seo', name: 'SEO', icon: EyeIcon }
  ]

  return (
    <div className="bg-white shadow rounded-lg">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Вкладки */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'basic' | 'details' | 'agenda' | 'seo')}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-6 py-4">
          {/* Основная информация */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название мероприятия *
                  </label>
                  <Input
                    {...register('title', { required: 'Название обязательно' })}
                    placeholder="Введите название мероприятия"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Краткое описание *
                  </label>
                  <Textarea
                    {...register('description', { required: 'Описание обязательно' })}
                    rows={3}
                    placeholder="Краткое описание мероприятия"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Полное описание
                  </label>
                  <Textarea
                    {...register('content')}
                    rows={6}
                    placeholder="Подробное описание мероприятия"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата и время начала *
                  </label>
                  <Input
                    type="datetime-local"
                    {...register('startDate', { required: 'Дата начала обязательна' })}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата и время окончания
                  </label>
                  <Input
                    type="datetime-local"
                    {...register('endDate')}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Место проведения *
                  </label>
                  <Input
                    {...register('location', { required: 'Место проведения обязательно' })}
                    placeholder="Адрес или название места проведения"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип мероприятия
                  </label>
                  <Select
                    {...register('type')}
                    placeholder="Выберите тип"
                    options={eventTypes.map((type) => ({ value: type.id, label: type.name }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Статус
                  </label>
                  <Select
                    {...register('status')}
                    options={[
                      { value: 'draft', label: 'Черновик' },
                      { value: 'published', label: 'Опубликовано' },
                      { value: 'cancelled', label: 'Отменено' },
                      { value: 'completed', label: 'Завершено' }
                    ]}
                  />
                </div>
              </div>

              {/* Изображение */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Изображение мероприятия
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Предварительный просмотр"
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setValue('imageUrl', '')
                            setPreviewImage(null)
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                        <span>Загрузить изображение</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">или перетащите сюда</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF до 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Детали */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Максимальное количество участников
                  </label>
                  <Input
                    type="number"
                    {...register('maxParticipants', { min: 1 })}
                    placeholder="Неограниченно"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цена (руб.)
                  </label>
                  <Input
                    type="number"
                    {...register('price', { min: 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <Checkbox
                    {...register('registrationRequired')}
                    label="Требуется регистрация"
                    size="sm"
                  />
                </div>

                {watchedRegistrationRequired && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Срок регистрации
                    </label>
                    <Input
                      type="datetime-local"
                      {...register('registrationDeadline')}
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <Checkbox
                    {...register('featured')}
                    label="Рекомендуемое мероприятие"
                    size="sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Организатор
                  </label>
                  <Input
                    {...register('organizer')}
                    placeholder="Название организации"
                  />
                </div>

                <div>
                  <label className="block text.sm font-medium text-gray-700 mb-1">
                    Контактный email
                  </label>
                  <Input
                    type="email"
                    {...register('contactEmail')}
                    placeholder="contact@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Контактный телефон
                  </label>
                  <Input
                    type="tel"
                    {...register('contactPhone')}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Требования к участникам
                  </label>
                  <Textarea
                    {...register('requirements')}
                    rows={3}
                    placeholder="Опишите требования к участникам"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Теги
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {watchedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    placeholder="Введите тег и нажмите Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = e.target as HTMLInputElement
                        addTag(input.value.trim())
                        input.value = ''
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Программа */}
          {activeTab === 'agenda' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Программа мероприятия</h3>
                <Button type="button" variant="outline" size="sm" onClick={addAgendaItem} icon={<PlusIcon className="h-4 w-4" />}>
                  Добавить пункт
                </Button>
              </div>

              <div className="space-y-4">
                {agendaFields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        Пункт программы {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeAgenda(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Время
                        </label>
                        <Input
                          {...register(`agenda.${index}.time`)}
                          placeholder="10:00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Длительность (мин.)
                        </label>
                        <Input
                          type="number"
                          {...register(`agenda.${index}.duration`)}
                          placeholder="60"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Название *
                        </label>
                        <Input
                          {...register(`agenda.${index}.title`, { required: 'Название обязательно' })}
                          placeholder="Название доклада или мероприятия"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Докладчик
                        </label>
                        <Input
                          {...register(`agenda.${index}.speaker`)}
                          placeholder="ФИО докладчика"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Описание
                        </label>
                        <Textarea
                          {...register(`agenda.${index}.description`)}
                          rows={2}
                          placeholder="Краткое описание доклада"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {agendaFields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Программа мероприятия пуста</p>
                    <p className="text-sm">Добавьте пункты программы для структурирования мероприятия</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO заголовок
                  </label>
                  <Input
                    {...register('seoTitle')}
                    placeholder="Заголовок для поисковых систем"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Рекомендуется 50-60 символов
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO описание
                  </label>
                  <Textarea
                    {...register('seoDescription')}
                    rows={3}
                    placeholder="Описание для поисковых систем"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Рекомендуется 150-160 символов
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO ключевые слова
                  </label>
                  <Input
                    {...register('seoKeywords')}
                    placeholder="Ключевые слова через запятую"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Введите ключевые слова через запятую
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение...' : event ? 'Обновить' : 'Создать'}
          </Button>
        </div>
      </form>
    </div>
  )
}
