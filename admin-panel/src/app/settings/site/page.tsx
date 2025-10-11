'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SiteSettings } from '@/types/admin';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Textarea } from '@/components/admin/ui/Textarea';
import { Card, CardContent, CardHeader } from '@/components/admin/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/ui/Tabs';
import { ImageUpload } from '@/components/admin/ui/ImageUpload';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { 
  PaintBrushIcon, 
  GlobeAltIcon, 
  ShareIcon, 
  DocumentTextIcon,
  CogIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { useSiteSettings } from '@/hooks/admin/useSiteSettings';
import { toast } from 'react-toastify';
import apiService from '@/services/admin/api';
import { toAbsoluteFileUrl } from '@/lib/utils';

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Название сайта обязательно'),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email('Некорректный формат email').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  workingHours: z.string().optional(),
  logoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  theme: z.object({
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Некорректный формат цвета (HEX)').default('#D4B89A'),
    secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Некорректный формат цвета (HEX)').default('#F5F5DC'),
    accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Некорректный формат цвета (HEX)').default('#8B4513'),
  }).default({ primaryColor: '#D4B89A', secondaryColor: '#F5F5DC', accentColor: '#8B4513' }),
  socialMedia: z.object({
    facebook: z.string().url('Некорректный URL').optional().or(z.literal('')),
    twitter: z.string().url('Некорректный URL').optional().or(z.literal('')),
    linkedin: z.string().url('Некорректный URL').optional().or(z.literal('')),
    instagram: z.string().url('Некорректный URL').optional().or(z.literal('')),
  }).optional().default({}),
  footerText: z.string().optional(),
  copyrightText: z.string().optional(),
});

type FormValues = z.infer<typeof siteSettingsSchema>;

export default function AdminSiteSettingsPage() {
  const { settings, loading, error, updateSettings, fetchSettings } = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty }
  } = useForm<FormValues>({
    resolver: zodResolver(siteSettingsSchema) as unknown as any,
    defaultValues: {
      siteName: '',
      siteDescription: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      workingHours: '',
      logoUrl: '',
      faviconUrl: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      theme: { primaryColor: '#D4B89A', secondaryColor: '#F5F5DC', accentColor: '#8B4513' },
      socialMedia: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
      },
      footerText: '',
      copyrightText: '',
    }
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      reset({
        siteName: settings.siteName || '',
        siteDescription: settings.siteDescription || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        address: settings.address || '',
        workingHours: settings.workingHours || '',
        logoUrl: settings.logoUrl || '',
        faviconUrl: settings.faviconUrl || '',
        seoTitle: settings.seoTitle || '',
        seoDescription: settings.seoDescription || '',
        seoKeywords: settings.seoKeywords || '',
        theme: settings.theme ?? { primaryColor: '#D4B89A', secondaryColor: '#F5F5DC', accentColor: '#8B4513' },
        socialMedia: settings.socialMedia ?? { facebook: '', twitter: '', linkedin: '', instagram: '' },
        footerText: settings.footerText || '',
        copyrightText: settings.copyrightText || '',
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await updateSettings(data as unknown as Partial<SiteSettings>);
    } catch (err) {
      console.error('Error updating settings:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Настройки сайта">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige-600 mx-auto"></div>
          <p className="mt-2 text-sm text-neutral-600">Загрузка настроек...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Настройки сайта">
        <div className="text-center py-10 text-red-500">
          <p>Ошибка загрузки настроек: {error}</p>
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
        { label: 'Сайт', href: '/settings/site' },
      ]}
    >
      <div className="space-y-6">
        <p className="text-neutral-600">Управление основными параметрами и внешним видом сайта</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">
              <GlobeAltIcon className="h-4 w-4 mr-2" />
              Общие
            </TabsTrigger>
            <TabsTrigger value="seo">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="contact">
              <CogIcon className="h-4 w-4 mr-2" />
              Контакты
            </TabsTrigger>
            <TabsTrigger value="theme">
              <PaintBrushIcon className="h-4 w-4 mr-2" />
              Тема
            </TabsTrigger>
            <TabsTrigger value="social">
              <ShareIcon className="h-4 w-4 mr-2" />
              Соцсети
            </TabsTrigger>
            <TabsTrigger value="media">
              <PhotoIcon className="h-4 w-4 mr-2" />
              Медиа
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Основная информация</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Название сайта"
                  {...register('siteName')}
                  error={errors.siteName?.message}
                  placeholder="Введите название сайта"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Описание сайта</label>
                  <Textarea
                    {...register('siteDescription')}
                    error={!!errors.siteDescription}
                    placeholder="Краткое описание сайта"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">SEO настройки</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="SEO Title по умолчанию"
                  {...register('seoTitle')}
                  error={errors.seoTitle?.message}
                  placeholder="Заголовок для главной страницы"
                  helperText="Заголовок для главной страницы и страниц без специфичного SEO"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description по умолчанию</label>
                  <Textarea
                    {...register('seoDescription')}
                    error={!!errors.seoDescription}
                    placeholder="Описание для поисковых систем"
                    rows={3}
                  />
                </div>
                
                <Input
                  label="SEO Keywords по умолчанию"
                  {...register('seoKeywords')}
                  error={errors.seoKeywords?.message}
                  placeholder="ключевые, слова, через, запятую"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Контактная информация</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                  <Input
                  label="Email для связи"
                  type="email"
                  {...register('contactEmail')}
                  error={errors.contactEmail?.message}
                  placeholder="info@example.com"
                />
                
                  <Input
                  label="Телефон для связи"
                  {...register('contactPhone')}
                  error={errors.contactPhone?.message}
                  placeholder="+7 (495) 123-45-67"
                />
                
                <Input
                  label="Время работы"
                  {...register('workingHours')}
                  error={errors.workingHours?.message as any}
                  placeholder="Пн-Пт: 9:00-18:00"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Адрес</label>
                  <Textarea
                    {...register('address')}
                    error={!!errors.address}
                    placeholder="г. Москва, ул. Примерная, д. 1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Цветовая схема</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Основной цвет"
                    type="color"
                    {...register('theme.primaryColor')}
                    error={errors.theme?.primaryColor?.message}
                  />
                  
                  <Input
                    label="Вторичный цвет"
                    type="color"
                    {...register('theme.secondaryColor')}
                    error={errors.theme?.secondaryColor?.message}
                  />
                  
                  <Input
                    label="Акцентный цвет"
                    type="color"
                    {...register('theme.accentColor')}
                    error={errors.theme?.accentColor?.message}
                  />
                </div>
                
                <p className="text-sm text-neutral-500">
                  Изменение цветов повлияет на внешний вид всего сайта
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Социальные сети</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Facebook URL"
                  {...register('socialMedia.facebook')}
                  error={errors.socialMedia?.facebook?.message}
                  placeholder="https://facebook.com/yourpage"
                />
                
                <Input
                  label="Twitter URL"
                  {...register('socialMedia.twitter')}
                  error={errors.socialMedia?.twitter?.message}
                  placeholder="https://twitter.com/yourpage"
                />
                
                <Input
                  label="LinkedIn URL"
                  {...register('socialMedia.linkedin')}
                  error={errors.socialMedia?.linkedin?.message}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
                
                <Input
                  label="Instagram URL"
                  {...register('socialMedia.instagram')}
                  error={errors.socialMedia?.instagram?.message}
                  placeholder="https://instagram.com/yourpage"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Медиафайлы</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Controller
                  name="logoUrl"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={toAbsoluteFileUrl(field.value || '')}
                      onChange={field.onChange}
                      onFileSelected={async (file) => {
                        const resp = await apiService.uploadFile(file, '/files/upload');
                        const url = (resp?.data as any)?.fileUrl || (resp as any)?.data?.url;
                        return toAbsoluteFileUrl(url);
                      }}
                      placeholder="Загрузить логотип сайта"
                      helperText="Основной логотип, отображаемый в шапке сайта"
                    />
                  )}
                />
                
                <Controller
                  name="faviconUrl"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={toAbsoluteFileUrl(field.value || '')}
                      onChange={field.onChange}
                      onFileSelected={async (file) => {
                        const resp = await apiService.uploadFile(file, '/files/upload');
                        const url = (resp?.data as any)?.fileUrl || (resp as any)?.data?.url;
                        return toAbsoluteFileUrl(url);
                      }}
                      placeholder="Загрузить фавикон"
                      helperText="Иконка сайта для вкладки браузера (16x16, 32x32)"
                    />
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isSubmitting || !isDirty}
          >
            Сбросить
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить настройки'}
          </Button>
        </div>
      </form>
      </div>
    </AdminLayout>
  );
}