'use client';

import { useState } from 'react';
import { Card } from '@/components/admin/ui/Card';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Textarea } from '@/components/admin/ui/Textarea';
import { Tabs } from '@/components/admin/ui/Tabs';
import { Checkbox } from '@/components/admin/ui/Checkbox';
import { ImageUpload } from '@/components/admin/ui/ImageUpload';
import { AdminBreadcrumbs } from '@/components/admin/layout/AdminBreadcrumbs';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { useSiteSettings } from '@/hooks/admin/useSiteSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const { settings, updateSettings, isLoading, error } = useSiteSettings();

  const handleSave = async (section: string) => {
    try {
      await updateSettings(section, settings);
      // Показать уведомление об успешном сохранении
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  };

  const tabs = [
    { id: 'general', label: 'Общие настройки' },
    { id: 'contacts', label: 'Контакты' },
    { id: 'seo', label: 'SEO настройки' },
    { id: 'theme', label: 'Тема и дизайн' },
    { id: 'social', label: 'Социальные сети' },
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Настройки сайта">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Загрузка настроек...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Настройки сайта"
      breadcrumbs={[
        { label: 'Главная', href: '/dashboard' },
        { label: 'Настройки', href: '/settings' },
      ]}
    >
      <div className="space-y-6">

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Ошибка загрузки настроек: {error}</p>
        </div>
      )}

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        {/* Общие настройки */}
        {activeTab === 'general' && (
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Основная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название сайта
                    </label>
                    <Input
                      value={settings?.siteName || ''}
                      onChange={(e) => updateSettings('general', { ...settings, siteName: e.target.value })}
                      placeholder="Введите название сайта"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Краткое описание
                    </label>
                    <Input
                      value={settings?.siteDescription || ''}
                      onChange={(e) => updateSettings('general', { ...settings, siteDescription: e.target.value })}
                      placeholder="Краткое описание сайта"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Логотип
                </h3>
                <div className="space-y-4">
                  <ImageUpload
                    value={settings?.logo || ''}
                    onChange={(url) => updateSettings('general', { ...settings, logo: url })}
                    accept="image/*"
                    maxSize={2 * 1024 * 1024} // 2MB
                  />
                  <p className="text-sm text-gray-500">
                    Рекомендуемый размер: 200x60 пикселей. Максимальный размер файла: 2MB
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Дополнительные настройки
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="maintenanceMode"
                      checked={settings?.maintenanceMode || false}
                      onChange={(checked) => updateSettings('general', { ...settings, maintenanceMode: checked })}
                    />
                    <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">
                      Режим технического обслуживания
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="allowRegistration"
                      checked={settings?.allowRegistration || false}
                      onChange={(checked) => updateSettings('general', { ...settings, allowRegistration: checked })}
                    />
                    <label htmlFor="allowRegistration" className="text-sm font-medium text-gray-700">
                      Разрешить регистрацию новых пользователей
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('general')}>
                  Сохранить общие настройки
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Контакты */}
        {activeTab === 'contacts' && (
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Контактная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название организации
                    </label>
                    <Input
                      value={settings?.organizationName || ''}
                      onChange={(e) => updateSettings('contacts', { ...settings, organizationName: e.target.value })}
                      placeholder="Полное название организации"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ОГРН
                    </label>
                    <Input
                      value={settings?.ogrn || ''}
                      onChange={(e) => updateSettings('contacts', { ...settings, ogrn: e.target.value })}
                      placeholder="Основной государственный регистрационный номер"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ИНН
                    </label>
                    <Input
                      value={settings?.inn || ''}
                      onChange={(e) => updateSettings('contacts', { ...settings, inn: e.target.value })}
                      placeholder="Идентификационный номер налогоплательщика"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      КПП
                    </label>
                    <Input
                      value={settings?.kpp || ''}
                      onChange={(e) => updateSettings('contacts', { ...settings, kpp: e.target.value })}
                      placeholder="Код причины постановки на учет"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Адрес и контакты
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Юридический адрес
                    </label>
                    <Textarea
                      value={settings?.legalAddress || ''}
                      onChange={(e) => updateSettings('contacts', { ...settings, legalAddress: e.target.value })}
                      placeholder="Полный юридический адрес"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон
                    </label>
                    <Input
                      value={settings?.phone || ''}
                      onChange={(e) => updateSettings('contacts', { ...settings, phone: e.target.value })}
                      placeholder="+7 (XXX) XXX-XX-XX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={settings?.email || ''}
                      onChange={(e) => updateSettings('contacts', { ...settings, email: e.target.value })}
                      placeholder="info@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Время работы
                    </label>
                    <Input
                      value={settings?.workingHours || ''}
                      onChange={(e) => updateSettings('contacts', { ...settings, workingHours: e.target.value })}
                      placeholder="Пн-Пт: 9:00-18:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Веб-сайт
                    </label>
                    <Input
                      value={settings?.website || ''}
                      onChange={(e) => updateSettings('contacts', { ...settings, website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('contacts')}>
                  Сохранить контакты
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* SEO настройки */}
        {activeTab === 'seo' && (
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Мета-теги по умолчанию
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title (заголовок страницы)
                    </label>
                    <Input
                      value={settings?.seoTitle || ''}
                      onChange={(e) => updateSettings('seo', { ...settings, seoTitle: e.target.value })}
                      placeholder="Заголовок страницы по умолчанию"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (описание)
                    </label>
                    <Textarea
                      value={settings?.seoDescription || ''}
                      onChange={(e) => updateSettings('seo', { ...settings, seoDescription: e.target.value })}
                      placeholder="Описание страницы по умолчанию"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords (ключевые слова)
                    </label>
                    <Input
                      value={settings?.seoKeywords || ''}
                      onChange={(e) => updateSettings('seo', { ...settings, seoKeywords: e.target.value })}
                      placeholder="ключевые, слова, через, запятую"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Open Graph настройки
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Title
                    </label>
                    <Input
                      value={settings?.ogTitle || ''}
                      onChange={(e) => updateSettings('seo', { ...settings, ogTitle: e.target.value })}
                      placeholder="Заголовок для социальных сетей"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Description
                    </label>
                    <Textarea
                      value={settings?.ogDescription || ''}
                      onChange={(e) => updateSettings('seo', { ...settings, ogDescription: e.target.value })}
                      placeholder="Описание для социальных сетей"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Image URL
                    </label>
                    <Input
                      value={settings?.ogImage || ''}
                      onChange={(e) => updateSettings('seo', { ...settings, ogImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Аналитика
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Analytics ID
                    </label>
                    <Input
                      value={settings?.googleAnalyticsId || ''}
                      onChange={(e) => updateSettings('seo', { ...settings, googleAnalyticsId: e.target.value })}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Яндекс.Метрика ID
                    </label>
                    <Input
                      value={settings?.yandexMetrikaId || ''}
                      onChange={(e) => updateSettings('seo', { ...settings, yandexMetrikaId: e.target.value })}
                      placeholder="12345678"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('seo')}>
                  Сохранить SEO настройки
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Тема и дизайн */}
        {activeTab === 'theme' && (
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Цветовая схема
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Основной цвет
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings?.primaryColor || '#D4C4A8'}
                        onChange={(e) => updateSettings('theme', { ...settings, primaryColor: e.target.value })}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <Input
                        value={settings?.primaryColor || '#D4C4A8'}
                        onChange={(e) => updateSettings('theme', { ...settings, primaryColor: e.target.value })}
                        placeholder="#D4C4A8"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Вторичный цвет
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings?.secondaryColor || '#8B7355'}
                        onChange={(e) => updateSettings('theme', { ...settings, secondaryColor: e.target.value })}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <Input
                        value={settings?.secondaryColor || '#8B7355'}
                        onChange={(e) => updateSettings('theme', { ...settings, secondaryColor: e.target.value })}
                        placeholder="#8B7355"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Шрифты
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Основной шрифт
                    </label>
                    <select
                      value={settings?.primaryFont || 'Inter'}
                      onChange={(e) => updateSettings('theme', { ...settings, primaryFont: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                      <option value="Montserrat">Montserrat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Размер основного шрифта
                    </label>
                    <select
                      value={settings?.fontSize || '16px'}
                      onChange={(e) => updateSettings('theme', { ...settings, fontSize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="14px">14px</option>
                      <option value="16px">16px</option>
                      <option value="18px">18px</option>
                      <option value="20px">20px</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Favicon
                </h3>
                <div className="space-y-4">
                  <ImageUpload
                    value={settings?.favicon || ''}
                    onChange={(url) => updateSettings('theme', { ...settings, favicon: url })}
                    accept="image/*"
                    maxSize={512 * 1024} // 512KB
                  />
                  <p className="text-sm text-gray-500">
                    Рекомендуемый размер: 32x32 пикселей. Максимальный размер файла: 512KB
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('theme')}>
                  Сохранить настройки темы
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Социальные сети */}
        {activeTab === 'social' && (
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Социальные сети
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      VKontakte
                    </label>
                    <Input
                      value={settings?.socialVk || ''}
                      onChange={(e) => updateSettings('social', { ...settings, socialVk: e.target.value })}
                      placeholder="https://vk.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telegram
                    </label>
                    <Input
                      value={settings?.socialTelegram || ''}
                      onChange={(e) => updateSettings('social', { ...settings, socialTelegram: e.target.value })}
                      placeholder="https://t.me/yourchannel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube
                    </label>
                    <Input
                      value={settings?.socialYoutube || ''}
                      onChange={(e) => updateSettings('social', { ...settings, socialYoutube: e.target.value })}
                      placeholder="https://youtube.com/@yourchannel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Одноклассники
                    </label>
                    <Input
                      value={settings?.socialOdnoklassniki || ''}
                      onChange={(e) => updateSettings('social', { ...settings, socialOdnoklassniki: e.target.value })}
                      placeholder="https://ok.ru/yourpage"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('social')}>
                  Сохранить социальные сети
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Tabs>
      </div>
    </AdminLayout>
  );
}
