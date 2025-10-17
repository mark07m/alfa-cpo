"use client";
import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useEffect, useState } from 'react'
import { settingsService } from '@/services/settings'
import type { SiteSettings } from '@/types'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';

export default function ContactsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await settingsService.get()
        if (!cancelled && res.success) setSettings(res.data)
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <Layout
      title="Контакты - СРО Арбитражных Управляющих"
      description="Контактная информация СРО: адрес, телефон, email, часы работы."
      keywords="контакты, адрес, телефон, email, СРО"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Контакты
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Свяжитесь с нами для получения дополнительной информации о деятельности 
            саморегулируемой организации арбитражных управляющих.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                  Контактная информация
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPinIcon className="h-6 w-6 text-beige-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Адрес</h3>
                      <p className="text-neutral-700">
                        {settings?.address || (
                          <>
                            101000, г. Москва, ул. Тверская, д. 12, стр. 1<br />
                            Бизнес-центр "Тверской", офис 501
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <PhoneIcon className="h-6 w-6 text-beige-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Телефон</h3>
                      <p className="text-neutral-700">
                        <a
                          href={`tel:${(settings?.contactPhone || '+7 (495) 123-45-67').replace(/[^+\d]/g, '')}`}
                          className="hover:text-beige-600 transition-colors"
                        >
                          {settings?.contactPhone || '+7 (495) 123-45-67'}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <EnvelopeIcon className="h-6 w-6 text-beige-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                      <p className="text-neutral-700">
                        <a
                          href={`mailto:${settings?.contactEmail || 'info@sro-au.ru'}`}
                          className="hover:text-beige-600 transition-colors"
                        >
                          {settings?.contactEmail || 'info@sro-au.ru'}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <ClockIcon className="h-6 w-6 text-beige-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">Часы работы</h3>
                      <p className="text-neutral-700">
                        {settings?.workingHours || (
                          <>
                            Понедельник - Пятница: 9:00 - 18:00<br />
                            Суббота - Воскресенье: выходной
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                  Реквизиты организации
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-700">Полное наименование:</span>
                    <span className="text-neutral-900 text-right">
                      Саморегулируемая организация арбитражных управляющих
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-700">ОГРН:</span>
                    <span className="text-neutral-900">1234567890123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-700">ИНН:</span>
                    <span className="text-neutral-900">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-700">КПП:</span>
                    <span className="text-neutral-900">123456789</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                  Написать нам
                </h2>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Имя"
                      placeholder="Введите ваше имя"
                      required
                    />
                    <Input
                      label="Фамилия"
                      placeholder="Введите вашу фамилию"
                      required
                    />
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />

                  <Input
                    label="Телефон"
                    placeholder="+7 (999) 123-45-67"
                  />

                  <div>
                    <label className="form-label">Тема обращения</label>
                    <select className="form-input">
                      <option>Общая информация</option>
                      <option>Вопросы по реестру</option>
                      <option>Документооборот</option>
                      <option>Техническая поддержка</option>
                      <option>Другое</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Сообщение</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      placeholder="Опишите ваш вопрос или предложение"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Отправить сообщение
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                Как нас найти
              </h2>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <BuildingOfficeIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600">
                    Здесь будет карта с расположением офиса
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
