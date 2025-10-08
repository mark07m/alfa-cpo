'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArbitratorFormData } from '@/services/admin/arbitrators';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Textarea } from '@/components/admin/ui/Textarea';
import LegacyTabs from '@/components/admin/ui/Tabs';
import { Checkbox } from '@/components/admin/ui/Checkbox';
import { arbitratorsService } from '@/services/admin/arbitrators';

const arbitratorSchema = z.object({
  // Основная информация
  fullName: z.string().min(2, 'ФИО должно содержать минимум 2 символа').max(200, 'ФИО не должно превышать 200 символов'),
  inn: z.string().regex(/^\d{12}$/, 'ИНН должен содержать 12 цифр'),
  registryNumber: z.string().min(1, 'Номер в реестре обязателен').max(50, 'Номер в реестре не должен превышать 50 символов'),
  snils: z.string().regex(/^\d{11}$/, 'СНИЛС должен содержать 11 цифр').optional().or(z.literal('')),
  stateRegistryNumber: z.string().max(50, 'Номер в Госреестре не должен превышать 50 символов').optional().or(z.literal('')),
  stateRegistryDate: z.string().optional().or(z.literal('')),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Неверный формат телефона'),
  email: z.string().email('Неверный формат email'),
  region: z.string().max(100, 'Регион не должен превышать 100 символов').optional().or(z.literal('')),
  city: z.string().max(100, 'Населенный пункт не должен превышать 100 символов').optional().or(z.literal('')),
  status: z.enum(['active', 'excluded', 'suspended']).optional(),
  joinDate: z.string().min(1, 'Дата включения обязательна'),
  excludeDate: z.string().optional().or(z.literal('')),
  excludeReason: z.string().max(500, 'Причина исключения не должна превышать 500 символов').optional().or(z.literal('')),

  // Личная информация
  birthDate: z.string().optional().or(z.literal('')),
  birthPlace: z.string().max(200, 'Место рождения не должно превышать 200 символов').optional().or(z.literal('')),
  registrationDate: z.string().optional().or(z.literal('')),
  decisionNumber: z.string().max(100, 'Номер решения не должен превышать 100 символов').optional().or(z.literal('')),

  // Профессиональная подготовка
  education: z.string().max(500, 'Образование не должно превышать 500 символов').optional().or(z.literal('')),
  workExperience: z.string().max(500, 'Опыт работы не должен превышать 500 символов').optional().or(z.literal('')),
  internship: z.string().max(500, 'Стажировка не должна превышать 500 символов').optional().or(z.literal('')),
  examCertificate: z.string().max(200, 'Сертификат не должен превышать 200 символов').optional().or(z.literal('')),

  // Дисквалификация и судимости
  disqualification: z.string().max(500, 'Дисквалификация не должна превышать 500 символов').optional().or(z.literal('')),
  criminalRecord: z.string().max(500, 'Судимости не должны превышать 500 символов').optional().or(z.literal('')),
  criminalRecordDate: z.string().optional().or(z.literal('')),
  criminalRecordNumber: z.string().max(100, 'Номер судимости не должен превышать 100 символов').optional().or(z.literal('')),
  criminalRecordName: z.string().max(200, 'Наименование судимости не должно превышать 200 символов').optional().or(z.literal('')),

  // Страхование
  insuranceStartDate: z.string().optional().or(z.literal('')),
  insuranceEndDate: z.string().optional().or(z.literal('')),
  insuranceAmount: z.number().min(0, 'Сумма страхования не может быть отрицательной').optional(),
  insuranceContractNumber: z.string().max(100, 'Номер договора не должен превышать 100 символов').optional().or(z.literal('')),
  insuranceContractDate: z.string().optional().or(z.literal('')),
  insuranceCompany: z.string().max(200, 'Страховая компания не должна превышать 200 символов').optional().or(z.literal('')),

  // Компенсационный фонд
  compensationFundContribution: z.number().min(0, 'Взнос не может быть отрицательным').optional(),

  // Контактная информация
  postalAddress: z.string().max(500, 'Почтовый адрес не должен превышать 500 символов').optional().or(z.literal('')),

  // Дополнительные поля
  penalties: z.string().max(500, 'Штрафы не должны превышать 500 символов').optional().or(z.literal('')),
});

type ArbitratorFormValues = z.infer<typeof arbitratorSchema>;

interface ArbitratorFormProps {
  initialData?: Partial<ArbitratorFormData>;
  onSubmit: (data: ArbitratorFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function ArbitratorForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false,
  isEdit = false 
}: ArbitratorFormProps) {
  const [innUnique, setInnUnique] = useState<boolean | null>(null);
  const [registryNumberUnique, setRegistryNumberUnique] = useState<boolean | null>(null);
  const [checkingUniqueness, setCheckingUniqueness] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ArbitratorFormValues>({
    resolver: zodResolver(arbitratorSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      inn: initialData?.inn || '',
      registryNumber: initialData?.registryNumber || '',
      snils: initialData?.snils || '',
      stateRegistryNumber: initialData?.stateRegistryNumber || '',
      stateRegistryDate: initialData?.stateRegistryDate || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      region: initialData?.region || '',
      city: initialData?.city || '',
      status: initialData?.status || 'active',
      joinDate: initialData?.joinDate || '',
      excludeDate: initialData?.excludeDate || '',
      excludeReason: initialData?.excludeReason || '',
      birthDate: initialData?.birthDate || '',
      birthPlace: initialData?.birthPlace || '',
      registrationDate: initialData?.registrationDate || '',
      decisionNumber: initialData?.decisionNumber || '',
      education: initialData?.education || '',
      workExperience: initialData?.workExperience || '',
      internship: initialData?.internship || '',
      examCertificate: initialData?.examCertificate || '',
      disqualification: initialData?.disqualification || '',
      criminalRecord: initialData?.criminalRecord || '',
      criminalRecordDate: initialData?.criminalRecordDate || '',
      criminalRecordNumber: initialData?.criminalRecordNumber || '',
      criminalRecordName: initialData?.criminalRecordName || '',
      insuranceStartDate: initialData?.insurance?.startDate || '',
      insuranceEndDate: initialData?.insurance?.endDate || '',
      insuranceAmount: initialData?.insurance?.amount || undefined,
      insuranceContractNumber: initialData?.insurance?.contractNumber || '',
      insuranceContractDate: initialData?.insurance?.contractDate || '',
      insuranceCompany: initialData?.insurance?.insuranceCompany || '',
      compensationFundContribution: initialData?.compensationFundContribution || undefined,
      postalAddress: initialData?.postalAddress || '',
      penalties: initialData?.penalties || '',
    },
  });

  const watchedInn = watch('inn');
  const watchedRegistryNumber = watch('registryNumber');

  // Проверка уникальности ИНН
  useEffect(() => {
    if (watchedInn && watchedInn.length === 12) {
      setCheckingUniqueness(true);
      arbitratorsService.checkInnUnique(watchedInn, isEdit && initialData?.id ? initialData.id : undefined)
        .then(setInnUnique)
        .catch(() => setInnUnique(null))
        .finally(() => setCheckingUniqueness(false));
    } else {
      setInnUnique(null);
    }
  }, [watchedInn, isEdit, initialData?.id]);

  // Проверка уникальности номера в реестре
  useEffect(() => {
    if (watchedRegistryNumber) {
      setCheckingUniqueness(true);
      arbitratorsService.checkRegistryNumberUnique(watchedRegistryNumber, isEdit && initialData?.id ? initialData.id : undefined)
        .then(setRegistryNumberUnique)
        .catch(() => setRegistryNumberUnique(null))
        .finally(() => setCheckingUniqueness(false));
    } else {
      setRegistryNumberUnique(null);
    }
  }, [watchedRegistryNumber, isEdit, initialData?.id]);

  const onFormSubmit = async (data: ArbitratorFormValues) => {
    try {
      const formData: ArbitratorFormData = {
        fullName: data.fullName,
        inn: data.inn,
        registryNumber: data.registryNumber,
        snils: data.snils || undefined,
        stateRegistryNumber: data.stateRegistryNumber || undefined,
        stateRegistryDate: data.stateRegistryDate || undefined,
        phone: data.phone,
        email: data.email,
        region: data.region || undefined,
        city: data.city || undefined,
        status: data.status || 'active',
        joinDate: data.joinDate,
        excludeDate: data.excludeDate || undefined,
        excludeReason: data.excludeReason || undefined,
        birthDate: data.birthDate || undefined,
        birthPlace: data.birthPlace || undefined,
        registrationDate: data.registrationDate || undefined,
        decisionNumber: data.decisionNumber || undefined,
        education: data.education || undefined,
        workExperience: data.workExperience || undefined,
        internship: data.internship || undefined,
        examCertificate: data.examCertificate || undefined,
        disqualification: data.disqualification || undefined,
        criminalRecord: data.criminalRecord || undefined,
        criminalRecordDate: data.criminalRecordDate || undefined,
        criminalRecordNumber: data.criminalRecordNumber || undefined,
        criminalRecordName: data.criminalRecordName || undefined,
        insurance: data.insuranceStartDate || data.insuranceEndDate || data.insuranceAmount || data.insuranceContractNumber || data.insuranceContractDate || data.insuranceCompany ? {
          startDate: data.insuranceStartDate || undefined,
          endDate: data.insuranceEndDate || undefined,
          amount: data.insuranceAmount || undefined,
          contractNumber: data.insuranceContractNumber || undefined,
          contractDate: data.insuranceContractDate || undefined,
          insuranceCompany: data.insuranceCompany || undefined,
        } : undefined,
        compensationFundContribution: data.compensationFundContribution || undefined,
        postalAddress: data.postalAddress || undefined,
        penalties: data.penalties || undefined,
      };

      await onSubmit(formData);
    } catch (error: any) {
      console.error('Ошибка отправки формы:', error);
      
      // Если это 403 ошибка, показываем более информативное сообщение
      if (error.response?.status === 403) {
        console.error('403 Forbidden error - возможно, токен истек или нет прав доступа');
        // Можно добавить уведомление пользователю
      }
    }
  };

  const tabItems = [
    {
      id: 'basic',
      label: 'Основная информация',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ФИО <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('fullName')}
                placeholder="Введите ФИО"
                error={errors.fullName?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ИНН <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('inn')}
                placeholder="12 цифр"
                maxLength={12}
                error={errors.inn?.message || (innUnique === false ? 'ИНН уже используется' : '')}
                className={innUnique === false ? 'border-red-300' : innUnique === true ? 'border-green-300' : ''}
              />
              {checkingUniqueness && (
                <p className="mt-1 text-sm text-gray-500">Проверка уникальности...</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Номер в реестре СРО <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('registryNumber')}
                placeholder="Введите номер"
                error={errors.registryNumber?.message || (registryNumberUnique === false ? 'Номер уже используется' : '')}
                className={registryNumberUnique === false ? 'border-red-300' : registryNumberUnique === true ? 'border-green-300' : ''}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                СНИЛС
              </label>
              <Input
                {...register('snils')}
                placeholder="11 цифр"
                maxLength={11}
                error={errors.snils?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Номер в Госреестре
              </label>
              <Input
                {...register('stateRegistryNumber')}
                placeholder="Введите номер"
                error={errors.stateRegistryNumber?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Дата включения в Госреестр
              </label>
              <Input
                type="date"
                {...register('stateRegistryDate')}
                error={errors.stateRegistryDate?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Телефон <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('phone')}
                placeholder="+7 (999) 123-45-67"
                error={errors.phone?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                {...register('email')}
                placeholder="example@email.com"
                error={errors.email?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Регион
              </label>
              <Input
                {...register('region')}
                placeholder="Введите регион"
                error={errors.region?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Населенный пункт
              </label>
              <Input
                {...register('city')}
                placeholder="Введите город"
                error={errors.city?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Статус
              </label>
              <Select {...register('status')} error={errors.status?.message}>
                <option value="active">Действительный</option>
                <option value="excluded">Исключен</option>
                <option value="suspended">Приостановлен</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Дата включения в реестр СРО <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register('joinDate')}
                error={errors.joinDate?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Дата исключения
              </label>
              <Input
                type="date"
                {...register('excludeDate')}
                error={errors.excludeDate?.message}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Причина исключения
              </label>
              <Textarea
                {...register('excludeReason')}
                placeholder="Введите причину исключения"
                rows={3}
                error={errors.excludeReason?.message}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'personal',
      label: 'Личная информация',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Дата рождения
              </label>
              <Input
                type="date"
                {...register('birthDate')}
                error={errors.birthDate?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Место рождения
              </label>
              <Input
                {...register('birthPlace')}
                placeholder="Введите место рождения"
                error={errors.birthPlace?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Дата регистрации
              </label>
              <Input
                type="date"
                {...register('registrationDate')}
                error={errors.registrationDate?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Номер решения
              </label>
              <Input
                {...register('decisionNumber')}
                placeholder="Введите номер решения"
                error={errors.decisionNumber?.message}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'professional',
      label: 'Профессиональная подготовка',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Образование
            </label>
            <Textarea
              {...register('education')}
              placeholder="Введите информацию об образовании"
              rows={4}
              error={errors.education?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Опыт работы
            </label>
            <Textarea
              {...register('workExperience')}
              placeholder="Введите информацию об опыте работы"
              rows={4}
              error={errors.workExperience?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Стажировка
            </label>
            <Textarea
              {...register('internship')}
              placeholder="Введите информацию о стажировке"
              rows={4}
              error={errors.internship?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сертификат о сдаче экзамена
            </label>
            <Input
              {...register('examCertificate')}
              placeholder="Введите информацию о сертификате"
              error={errors.examCertificate?.message}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'legal',
      label: 'Дисквалификация и судимости',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дисквалификация
            </label>
            <Textarea
              {...register('disqualification')}
              placeholder="Введите информацию о дисквалификации"
              rows={3}
              error={errors.disqualification?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Судимости
            </label>
            <Textarea
              {...register('criminalRecord')}
              placeholder="Введите информацию о судимостях"
              rows={3}
              error={errors.criminalRecord?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Дата судимости
              </label>
              <Input
                type="date"
                {...register('criminalRecordDate')}
                error={errors.criminalRecordDate?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Номер судимости
              </label>
              <Input
                {...register('criminalRecordNumber')}
                placeholder="Введите номер"
                error={errors.criminalRecordNumber?.message}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Наименование судимости
              </label>
              <Input
                {...register('criminalRecordName')}
                placeholder="Введите наименование"
                error={errors.criminalRecordName?.message}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'insurance',
      label: 'Страхование',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Начало страхования
              </label>
              <Input
                type="date"
                {...register('insuranceStartDate')}
                error={errors.insuranceStartDate?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Окончание страхования
              </label>
              <Input
                type="date"
                {...register('insuranceEndDate')}
                error={errors.insuranceEndDate?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Сумма договора (₽)
              </label>
              <Input
                type="number"
                {...register('insuranceAmount', { valueAsNumber: true })}
                placeholder="Введите сумму"
                error={errors.insuranceAmount?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Номер договора
              </label>
              <Input
                {...register('insuranceContractNumber')}
                placeholder="Введите номер договора"
                error={errors.insuranceContractNumber?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Дата договора
              </label>
              <Input
                type="date"
                {...register('insuranceContractDate')}
                error={errors.insuranceContractDate?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Страховая компания
              </label>
              <Input
                {...register('insuranceCompany')}
                placeholder="Введите название компании"
                error={errors.insuranceCompany?.message}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'additional',
      label: 'Дополнительно',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Взнос в компенсационный фонд (₽)
            </label>
            <Input
              type="number"
              {...register('compensationFundContribution', { valueAsNumber: true })}
              placeholder="Введите сумму взноса"
              error={errors.compensationFundContribution?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Почтовый адрес
            </label>
            <Textarea
              {...register('postalAddress')}
              placeholder="Введите почтовый адрес"
              rows={3}
              error={errors.postalAddress?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Штрафы
            </label>
            <Textarea
              {...register('penalties')}
              placeholder="Введите информацию о штрафах"
              rows={3}
              error={errors.penalties?.message}
            />
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
          disabled={isSubmitting || loading || innUnique === false || registryNumberUnique === false}
        >
          {isSubmitting || loading ? 'Сохранение...' : isEdit ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
}
