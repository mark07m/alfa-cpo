'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AccreditedOrganizationFormData } from '@/types/admin';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Textarea } from '@/components/admin/ui/Textarea';
import LegacyTabs from '@/components/admin/ui/Tabs';
import { Checkbox } from '@/components/admin/ui/Checkbox';
import { accreditedOrganizationsService } from '@/services/admin/accreditedOrganizations';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const organizationSchema = z.object({
  // Основная информация
  name: z.string().min(2, 'Название должно содержать минимум 2 символа').max(200, 'Название не должно превышать 200 символов'),
  shortName: z.string().max(50, 'Краткое название не должно превышать 50 символов').optional().or(z.literal('')),
  inn: z.string().regex(/^\d{10}$/, 'ИНН должен содержать 10 цифр'),
  kpp: z.string().regex(/^\d{9}$/, 'КПП должен содержать 9 цифр').optional().or(z.literal('')),
  ogrn: z.string().regex(/^\d{13}$/, 'ОГРН должен содержать 13 цифр'),
  legalAddress: z.string().min(10, 'Юридический адрес должен содержать минимум 10 символов').max(500, 'Адрес не должен превышать 500 символов'),
  actualAddress: z.string().max(500, 'Фактический адрес не должен превышать 500 символов').optional().or(z.literal('')),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Неверный формат телефона'),
  email: z.string().email('Неверный формат email'),
  website: z.string().url('Неверный формат URL').optional().or(z.literal('')),
  
  // Руководство
  directorName: z.string().min(2, 'ФИО руководителя должно содержать минимум 2 символа').max(200, 'ФИО не должно превышать 200 символов'),
  directorPosition: z.string().min(2, 'Должность должна содержать минимум 2 символа').max(100, 'Должность не должна превышать 100 символов'),
  
  // Аккредитация
  accreditationNumber: z.string().min(1, 'Номер аккредитации обязателен').max(50, 'Номер не должен превышать 50 символов'),
  accreditationDate: z.string().min(1, 'Дата аккредитации обязательна'),
  accreditationExpiryDate: z.string().min(1, 'Дата окончания аккредитации обязательна'),
  status: z.enum(['active', 'suspended', 'revoked', 'expired']),
  accreditationType: z.enum(['educational', 'training', 'assessment', 'other']),
  description: z.string().max(1000, 'Описание не должно превышать 1000 символов').optional().or(z.literal('')),
  
  // Услуги
  services: z.array(z.string()).min(1, 'Необходимо указать хотя бы одну услугу'),
  
  // Контакты
  contacts: z.array(z.object({
    name: z.string().min(1, 'Имя контакта обязательно'),
    position: z.string().min(1, 'Должность контакта обязательна'),
    phone: z.string().min(1, 'Телефон контакта обязателен'),
    email: z.string().email('Неверный формат email контакта')
  })).min(1, 'Необходимо указать хотя бы один контакт')
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

interface AccreditedOrganizationFormProps {
  initialData?: Partial<AccreditedOrganizationFormData>;
  onSubmit: (data: AccreditedOrganizationFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function AccreditedOrganizationForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false,
  isEdit = false 
}: AccreditedOrganizationFormProps) {
  const [innUnique, setInnUnique] = useState<boolean | null>(null);
  const [ogrnUnique, setOgrnUnique] = useState<boolean | null>(null);
  const [accreditationNumberUnique, setAccreditationNumberUnique] = useState<boolean | null>(null);
  const [checkingUniqueness, setCheckingUniqueness] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: initialData?.name || '',
      shortName: initialData?.shortName || '',
      inn: initialData?.inn || '',
      kpp: initialData?.kpp || '',
      ogrn: initialData?.ogrn || '',
      legalAddress: initialData?.legalAddress || '',
      actualAddress: initialData?.actualAddress || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      website: initialData?.website || '',
      directorName: initialData?.directorName || '',
      directorPosition: initialData?.directorPosition || '',
      accreditationNumber: initialData?.accreditationNumber || '',
      accreditationDate: initialData?.accreditationDate || '',
      accreditationExpiryDate: initialData?.accreditationExpiryDate || '',
      status: initialData?.status || 'active',
      accreditationType: initialData?.accreditationType || 'educational',
      description: initialData?.description || '',
      services: initialData?.services || [''],
      contacts: initialData?.contacts || [{ name: '', position: '', phone: '', email: '' }]
    },
  });

  const watchedInn = watch('inn');
  const watchedOgrn = watch('ogrn');
  const watchedAccreditationNumber = watch('accreditationNumber');

  // Проверка уникальности ИНН
  useEffect(() => {
    if (watchedInn && watchedInn.length === 10) {
      setCheckingUniqueness(true);
      accreditedOrganizationsService.checkInnUnique(watchedInn, isEdit && initialData?.id ? initialData.id : undefined)
        .then(setInnUnique)
        .catch(() => setInnUnique(null))
        .finally(() => setCheckingUniqueness(false));
    } else {
      setInnUnique(null);
    }
  }, [watchedInn, isEdit, initialData?.id]);

  // Проверка уникальности ОГРН
  useEffect(() => {
    if (watchedOgrn && watchedOgrn.length === 13) {
      setCheckingUniqueness(true);
      accreditedOrganizationsService.checkOgrnUnique(watchedOgrn, isEdit && initialData?.id ? initialData.id : undefined)
        .then(setOgrnUnique)
        .catch(() => setOgrnUnique(null))
        .finally(() => setCheckingUniqueness(false));
    } else {
      setOgrnUnique(null);
    }
  }, [watchedOgrn, isEdit, initialData?.id]);

  // Проверка уникальности номера аккредитации
  useEffect(() => {
    if (watchedAccreditationNumber) {
      setCheckingUniqueness(true);
      accreditedOrganizationsService.checkAccreditationNumberUnique(watchedAccreditationNumber, isEdit && initialData?.id ? initialData.id : undefined)
        .then(setAccreditationNumberUnique)
        .catch(() => setAccreditationNumberUnique(null))
        .finally(() => setCheckingUniqueness(false));
    } else {
      setAccreditationNumberUnique(null);
    }
  }, [watchedAccreditationNumber, isEdit, initialData?.id]);

  const onFormSubmit = async (data: OrganizationFormValues) => {
    try {
      const formData: AccreditedOrganizationFormData = {
        ...data,
        services: data.services.filter(service => service.trim() !== ''),
        contacts: data.contacts.filter(contact => 
          contact.name.trim() !== '' && 
          contact.position.trim() !== '' && 
          contact.phone.trim() !== '' && 
          contact.email.trim() !== ''
        )
      };

      await onSubmit(formData);
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
    }
  };

  const addService = () => {
    const currentServices = watch('services');
    setValue('services', [...currentServices, '']);
  };

  const removeService = (index: number) => {
    const currentServices = watch('services');
    if (currentServices.length > 1) {
      setValue('services', currentServices.filter((_, i) => i !== index));
    }
  };

  const addContact = () => {
    const currentContacts = watch('contacts');
    setValue('contacts', [...currentContacts, { name: '', position: '', phone: '', email: '' }]);
  };

  const removeContact = (index: number) => {
    const currentContacts = watch('contacts');
    if (currentContacts.length > 1) {
      setValue('contacts', currentContacts.filter((_, i) => i !== index));
    }
  };

  const tabItems = [
    {
      id: 'basic',
      label: 'Основная информация',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название организации <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('name')}
                placeholder="Введите название организации"
                error={errors.name?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Краткое название
              </label>
              <Input
                {...register('shortName')}
                placeholder="Краткое название"
                error={errors.shortName?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ИНН <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('inn')}
                placeholder="10 цифр"
                maxLength={10}
                error={errors.inn?.message || (innUnique === false ? 'ИНН уже используется' : '')}
                className={innUnique === false ? 'border-red-300' : innUnique === true ? 'border-green-300' : ''}
              />
              {checkingUniqueness && (
                <p className="mt-1 text-sm text-gray-500">Проверка уникальности...</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                КПП
              </label>
              <Input
                {...register('kpp')}
                placeholder="9 цифр"
                maxLength={9}
                error={errors.kpp?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ОГРН <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('ogrn')}
                placeholder="13 цифр"
                maxLength={13}
                error={errors.ogrn?.message || (ogrnUnique === false ? 'ОГРН уже используется' : '')}
                className={ogrnUnique === false ? 'border-red-300' : ogrnUnique === true ? 'border-green-300' : ''}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('phone')}
                placeholder="+7 (495) 123-45-67"
                error={errors.phone?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="info@organization.ru"
                error={errors.email?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Веб-сайт
              </label>
              <Input
                {...register('website')}
                placeholder="https://organization.ru"
                error={errors.website?.message}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Юридический адрес <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register('legalAddress')}
              placeholder="Введите юридический адрес"
              rows={3}
              error={errors.legalAddress?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фактический адрес
            </label>
            <Textarea
              {...register('actualAddress')}
              placeholder="Введите фактический адрес (если отличается от юридического)"
              rows={3}
              error={errors.actualAddress?.message}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'leadership',
      label: 'Руководство',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ФИО руководителя <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('directorName')}
                placeholder="Иванов Иван Иванович"
                error={errors.directorName?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Должность <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('directorPosition')}
                placeholder="Генеральный директор"
                error={errors.directorPosition?.message}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'accreditation',
      label: 'Аккредитация',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер аккредитации <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('accreditationNumber')}
                placeholder="АКК-001-2024"
                error={errors.accreditationNumber?.message || (accreditationNumberUnique === false ? 'Номер уже используется' : '')}
                className={accreditationNumberUnique === false ? 'border-red-300' : accreditationNumberUnique === true ? 'border-green-300' : ''}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип аккредитации <span className="text-red-500">*</span>
              </label>
              <Select
                {...register('accreditationType')}
                options={[
                  { value: 'educational', label: 'Образовательная' },
                  { value: 'training', label: 'Обучающая' },
                  { value: 'assessment', label: 'Оценочная' },
                  { value: 'other', label: 'Прочая' }
                ]}
                error={errors.accreditationType?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата аккредитации <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register('accreditationDate')}
                error={errors.accreditationDate?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата окончания <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register('accreditationExpiryDate')}
                error={errors.accreditationExpiryDate?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус <span className="text-red-500">*</span>
              </label>
              <Select
                {...register('status')}
                options={[
                  { value: 'active', label: 'Активна' },
                  { value: 'suspended', label: 'Приостановлена' },
                  { value: 'revoked', label: 'Отозвана' },
                  { value: 'expired', label: 'Истекла' }
                ]}
                error={errors.status?.message}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <Textarea
              {...register('description')}
              placeholder="Описание деятельности организации"
              rows={4}
              error={errors.description?.message}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'services',
      label: 'Услуги',
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Услуги <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Укажите услуги, которые предоставляет организация
            </p>
            
            {watch('services').map((service, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  {...register(`services.${index}`)}
                  placeholder="Название услуги"
                  error={errors.services?.[index]?.message}
                />
                {watch('services').length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeService(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addService}
              className="flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Добавить услугу</span>
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'contacts',
      label: 'Контакты',
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Контактные лица <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Укажите контактных лиц организации
            </p>
            
            {watch('contacts').map((contact, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ФИО <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register(`contacts.${index}.name`)}
                      placeholder="Иванов Иван Иванович"
                      error={errors.contacts?.[index]?.name?.message}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Должность <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register(`contacts.${index}.position`)}
                      placeholder="Руководитель отдела"
                      error={errors.contacts?.[index]?.position?.message}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register(`contacts.${index}.phone`)}
                      placeholder="+7 (495) 123-45-67"
                      error={errors.contacts?.[index]?.phone?.message}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register(`contacts.${index}.email`)}
                      type="email"
                      placeholder="contact@organization.ru"
                      error={errors.contacts?.[index]?.email?.message}
                    />
                  </div>
                </div>
                
                {watch('contacts').length > 1 && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeContact(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Удалить контакт
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addContact}
              className="flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Добавить контакт</span>
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <LegacyTabs 
        tabs={tabItems.map(item => ({ id: item.id, label: item.label }))}
        initialTab={tabItems[0]?.id}
      >
        {(activeTabId) => {
          const activeTab = tabItems.find(tab => tab.id === activeTabId);
          return activeTab ? activeTab.content : null;
        }}
      </LegacyTabs>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || loading}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || loading || innUnique === false || ogrnUnique === false || accreditationNumberUnique === false}
        >
          {isSubmitting || loading ? 'Сохранение...' : isEdit ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
}
