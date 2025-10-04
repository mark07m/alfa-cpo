'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Page, PageFormData, PageTemplate } from '@/types/admin';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Textarea } from '@/components/admin/ui/Textarea';
import { Select } from '@/components/admin/ui/Select';
import { Checkbox } from '@/components/admin/ui/Checkbox';
import { Card, CardContent, CardHeader } from '@/components/admin/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/ui/Tabs';
import { WysiwygEditor } from '@/components/admin/ui/WysiwygEditor';
import { ImageUpload } from '@/components/admin/ui/ImageUpload';
import { pagesService } from '@/services/admin/pages';
import { toast } from 'react-toastify';
import { 
  DocumentTextIcon, 
  EyeIcon, 
  CogIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const pageSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  slug: z.string().min(1, 'URL обязательно'),
  content: z.string().min(1, 'Содержимое обязательно'),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  template: z.nativeEnum(PageTemplate),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  isHomePage: z.boolean().default(false),
  showInMenu: z.boolean().default(true),
  menuOrder: z.number().int().min(0).default(0),
  parentId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  customFields: z.record(z.any()).optional(),
  publishedAt: z.string().optional().nullable(),
});

interface PageFormProps {
  page?: Page | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PageForm: React.FC<PageFormProps> = ({ page, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      status: 'draft',
      template: PageTemplate.DEFAULT,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      isHomePage: false,
      showInMenu: true,
      menuOrder: 0,
      parentId: null,
      imageUrl: null,
      featuredImage: null,
      customFields: {},
      publishedAt: null,
    }
  });

  useEffect(() => {
    if (page) {
      reset({
        ...page,
        parentId: page.parentId || null,
        imageUrl: page.imageUrl || null,
        featuredImage: page.featuredImage || null,
        publishedAt: page.publishedAt ? new Date(page.publishedAt).toISOString().split('T')[0] : null,
      });
    } else {
      reset();
    }
  }, [page, reset]);

  const onSubmit = async (data: PageFormData) => {
    setIsSubmitting(true);
    try {
      if (page) {
        // Update existing page
        await pagesService.updatePage(page.id, data);
        toast.success('Страница успешно обновлена!');
      } else {
        // Create new page
        await pagesService.createPage(data);
        toast.success('Страница успешно создана!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting page:', error);
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при сохранении страницы';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title);
    
    // Auto-generate slug if it's empty or matches the old title
    const currentSlug = watch('slug');
    if (!currentSlug || currentSlug === generateSlug(watch('title'))) {
      setValue('slug', generateSlug(title));
    }
  };

  const templateOptions = Object.values(PageTemplate).map(template => ({
    value: template,
    label: template
  }));

  const statusOptions = [
    { value: 'draft', label: 'Черновик' },
    { value: 'published', label: 'Опубликовано' },
    { value: 'archived', label: 'Архив' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Контент
          </TabsTrigger>
          <TabsTrigger value="seo">
            <EyeIcon className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="settings">
            <CogIcon className="h-4 w-4 mr-2" />
            Настройки
          </TabsTrigger>
          <TabsTrigger value="media">
            <PhotoIcon className="h-4 w-4 mr-2" />
            Медиа
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Основная информация</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Название страницы"
                {...register('title')}
                onChange={handleTitleChange}
                error={errors.title?.message}
                placeholder="Введите название страницы"
              />
              
              <Input
                label="URL (slug)"
                {...register('slug')}
                error={errors.slug?.message}
                placeholder="url-stranicy"
                helperText="Человекочитаемый URL для страницы"
              />
              
              <Textarea
                label="Краткое описание"
                {...register('excerpt')}
                error={errors.excerpt?.message}
                placeholder="Краткое описание страницы"
                rows={3}
                helperText="Краткое описание для превью и SEO"
              />
              
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <WysiwygEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Введите содержимое страницы..."
                  />
                )}
              />
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content.message}</p>
              )}
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
                label="SEO Title"
                {...register('seoTitle')}
                error={errors.seoTitle?.message}
                placeholder="Заголовок для поисковых систем"
                helperText="Рекомендуется 50-60 символов"
              />
              
              <Textarea
                label="SEO Description"
                {...register('seoDescription')}
                error={errors.seoDescription?.message}
                placeholder="Описание для поисковых систем"
                rows={3}
                helperText="Рекомендуется 150-160 символов"
              />
              
              <Input
                label="SEO Keywords"
                {...register('seoKeywords')}
                error={errors.seoKeywords?.message}
                placeholder="ключевые, слова, через, запятую"
                helperText="Ключевые слова через запятую"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Настройки страницы</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Статус"
                {...register('status')}
                options={statusOptions}
                error={errors.status?.message}
              />
              
              <Select
                label="Шаблон"
                {...register('template')}
                options={templateOptions}
                error={errors.template?.message}
              />
              
              <Input
                label="Дата публикации"
                type="date"
                {...register('publishedAt')}
                error={errors.publishedAt?.message}
              />
              
              <div className="space-y-3">
                <Checkbox
                  label="Сделать главной страницей"
                  {...register('isHomePage')}
                  error={errors.isHomePage?.message}
                />
                
                <Checkbox
                  label="Показывать в меню"
                  {...register('showInMenu')}
                  error={errors.showInMenu?.message}
                />
                
                {watch('showInMenu') && (
                  <Input
                    label="Порядок в меню"
                    type="number"
                    {...register('menuOrder', { valueAsNumber: true })}
                    error={errors.menuOrder?.message}
                    helperText="Чем меньше число, тем выше в меню"
                  />
                )}
              </div>
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
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Загрузить изображение страницы"
                  />
                )}
              />
              
              <Controller
                name="featuredImage"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Загрузить изображение для превью"
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
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? 'Сохранение...' : page ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};

export default PageForm;