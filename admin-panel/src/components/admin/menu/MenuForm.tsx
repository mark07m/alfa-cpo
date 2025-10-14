'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MenuItem, MenuFormData, Page, PageFilters } from '@/types/admin';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Checkbox } from '@/components/admin/ui/Checkbox';
import { Card, CardContent, CardHeader } from '@/components/admin/ui/Card';
import { 
  LinkIcon, 
  CogIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { pagesService } from '@/services/admin/pages';

const menuSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  url: z.string().min(1, 'URL обязателен'),
  icon: z.string().optional().nullable(),
  order: z.number().int().min(0).default(0),
  parentId: z.string().optional().nullable(),
  isVisible: z.boolean().default(true),
  pageId: z.string().optional().nullable(),
  isExternal: z.boolean().default(false),
});

interface MenuFormProps {
  menuItem?: MenuItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const MenuForm: React.FC<MenuFormProps> = ({ menuItem, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availablePages, setAvailablePages] = useState<Page[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      title: '',
      url: '',
      icon: null,
      order: 0,
      parentId: null,
      isVisible: true,
      pageId: null,
      isExternal: false,
    }
  });

  useEffect(() => {
    if (menuItem) {
      reset({
        ...menuItem,
        parentId: menuItem.parentId || null,
        icon: menuItem.icon || null,
        pageId: menuItem.pageId || null,
      });
    } else {
      reset();
    }
  }, [menuItem, reset]);

  useEffect(() => {
    const loadPages = async () => {
      setLoadingPages(true);
      try {
        const filters: PageFilters = { status: 'published', excludeMain: true } as any;
        const { data } = await pagesService.getPages(filters, { page: 1, limit: 100 });
        setAvailablePages(data);
      } catch (e) {
        setAvailablePages([]);
      } finally {
        setLoadingPages(false);
      }
    };
    loadPages();
  }, []);

  const onSubmit = async (data: MenuFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would call the API to create/update the menu item
      console.log('Submitting menu item data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting menu item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExternal = watch('isExternal');
  const selectedPageId = watch('pageId');

  useEffect(() => {
    if (selectedPageId && !isExternal) {
      const p = availablePages.find(p => p.id === selectedPageId);
      if (p?.slug) {
        const url = p.slug.startsWith('/') ? p.slug : `/${p.slug}`;
        setValue('url', url, { shouldDirty: true });
        setValue('isExternal', false, { shouldDirty: true });
      }
    }
  }, [selectedPageId, isExternal, availablePages, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Основная информация</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Название пункта меню"
            {...register('title')}
            error={errors.title?.message}
            placeholder="Введите название пункта меню"
          />
          
          <Select
            label="Связать со страницей"
            {...register('pageId')}
            options={[
              { value: '', label: loadingPages ? 'Загрузка...' : 'Не связывать' },
              ...availablePages.map((p) => ({ value: p.id, label: `${p.title} (${p.slug})` }))
            ]}
            helperText="Только опубликованные страницы, кроме главных в своей категории"
          />

          <Input
            label="URL"
            {...register('url')}
            error={errors.url?.message}
            placeholder="/about или https://example.com"
            helperText={isExternal ? 'Внешняя ссылка' : 'Внутренняя ссылка (начинается с /)'}
          />
          
          <Input
            label="Иконка (название Heroicon)"
            {...register('icon')}
            error={errors.icon?.message}
            placeholder="HomeIcon, DocumentTextIcon, etc."
            helperText="Название иконки из Heroicons (например: HomeIcon)"
          />
          
          <Input
            label="Порядок"
            type="number"
            {...register('order', { valueAsNumber: true })}
            error={errors.order?.message}
            helperText="Чем меньше число, тем выше в меню"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Настройки</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Checkbox
              label="Видимый в меню"
              {...register('isVisible')}
              error={errors.isVisible?.message}
            />
            
            <Checkbox
              label="Внешняя ссылка"
              {...register('isExternal')}
              error={errors.isExternal?.message}
              helperText="Если ссылка ведет на другой сайт"
            />
          </div>
        </CardContent>
      </Card>

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
          {isSubmitting ? 'Сохранение...' : menuItem ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};

export default MenuForm;