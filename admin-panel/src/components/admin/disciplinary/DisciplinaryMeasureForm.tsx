'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Textarea } from '@/components/admin/ui/Textarea';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { arbitratorsService } from '@/services/admin/arbitrators';

interface DisciplinaryMeasureFormProps {
  measure?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isModal?: boolean;
}

export function DisciplinaryMeasureForm({ measure, onSave, onCancel, isModal = true }: DisciplinaryMeasureFormProps) {
  const [formData, setFormData] = useState({
    managerId: '',
    arbitratorName: '',
    arbitratorInn: '',
    type: 'warning',
    status: 'active',
    date: '',
    reason: '',
    decisionNumber: '',
    appealDeadline: '',
    appealStatus: 'none',
    appealNotes: '',
    appealDate: '',
    appealDecision: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [arbitratorOptions, setArbitratorOptions] = useState<{ value: string; label: string }[]>([
    { value: '', label: 'Выберите арбитражного управляющего' }
  ]);
  const [loadingArbitrators, setLoadingArbitrators] = useState(false);

  useEffect(() => {
    if (measure) {
      setFormData({
        managerId: measure.arbitratorId || '',
        arbitratorName: measure.arbitratorName || '',
        arbitratorInn: measure.arbitratorInn || '',
        type: measure.type || 'warning',
        status: measure.status || 'active',
        date: measure.date ? measure.date.split('T')[0] : '',
        reason: measure.reason || '',
        decisionNumber: (measure as any).decisionNumber || '',
        appealDeadline: (measure as any).appealDeadline ? (measure as any).appealDeadline.split('T')[0] : '',
        appealStatus: (measure as any).appealStatus || 'none',
        appealNotes: (measure as any).appealNotes || '',
        appealDate: measure.appealDate ? measure.appealDate.split('T')[0] : '',
        appealDecision: (measure as any).appealDecision || ''
      });
    }
  }, [measure]);

  useEffect(() => {
    const loadArbitrators = async () => {
      try {
        setLoadingArbitrators(true);
        const resp = await arbitratorsService.getArbitrators({ limit: 100 });
        const opts = [{ value: '', label: 'Выберите арбитражного управляющего' }].concat(
          resp.data.map((a: any) => ({ value: a.id || a._id, label: `${a.fullName} (ИНН: ${a.inn || '—'})` }))
        );
        setArbitratorOptions(opts);
      } catch (e) {
        // fallback: leave default
      } finally {
        setLoadingArbitrators(false);
      }
    };
    loadArbitrators();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.managerId) {
      newErrors.managerId = 'Выберите арбитражного управляющего';
    }
    if (!formData.arbitratorName.trim()) {
      newErrors.arbitratorName = 'ФИО арбитражного управляющего обязательно';
    }

    if (!formData.arbitratorInn.trim()) {
      newErrors.arbitratorInn = 'ИНН обязателен';
    } else if (!/^\d{12}$/.test(formData.arbitratorInn)) {
      newErrors.arbitratorInn = 'ИНН должен содержать 12 цифр';
    }

    if (!formData.date) {
      newErrors.date = 'Дата применения меры обязательна';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Основание для применения меры обязательно';
    }

    if (!formData.decisionNumber.trim()) {
      newErrors.decisionNumber = 'Номер решения обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      managerId: formData.managerId,
      type: formData.type,
      status: formData.status,
      reason: formData.reason,
      decisionNumber: formData.decisionNumber,
      date: new Date(formData.date).toISOString(),
      appealDeadline: formData.appealDeadline ? new Date(formData.appealDeadline).toISOString() : undefined,
      appealStatus: formData.appealStatus || 'none',
      appealNotes: formData.appealNotes || undefined,
      appealDate: formData.appealDate ? new Date(formData.appealDate).toISOString() : undefined,
      appealDecision: formData.appealDecision || undefined
    };

    onSave(submitData);
  };

  // arbitratorOptions now loaded from API

  const typeOptions = [
    { value: 'warning', label: 'Предупреждение' },
    { value: 'reprimand', label: 'Выговор' },
    { value: 'suspension', label: 'Приостановление' },
    { value: 'exclusion', label: 'Исключение' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Действует' },
    { value: 'cancelled', label: 'Отменена' },
    { value: 'expired', label: 'Истекла' }
  ];

  const appealStatusOptions = [
    { value: 'none', label: 'Нет' },
    { value: 'submitted', label: 'Подана' },
    { value: 'reviewed', label: 'Рассмотрена' },
    { value: 'approved', label: 'Удовлетворена' },
    { value: 'rejected', label: 'Отклонена' }
  ];

  const content = (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {measure ? 'Редактирование дисциплинарной меры' : 'Создание дисциплинарной меры'}
        </h2>
        {isModal && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="flex items-center space-x-1"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Закрыть</span>
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Арбитражный управляющий */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Арбитражный управляющий *
            </label>
            <Select
              value={formData.managerId}
              onChange={(e) => {
                const selected = arbitratorOptions.find(opt => opt.value === e.target.value);
                if (selected) {
                  const nameMatch = selected.label.match(/^(.+?)\s+\(ИНН:\s+(\d+|—)\)$/);
                  handleInputChange('managerId', e.target.value);
                  if (nameMatch) {
                    handleInputChange('arbitratorName', nameMatch[1] || '');
                    handleInputChange('arbitratorInn', nameMatch[2] && nameMatch[2] !== '—' ? nameMatch[2] : '');
                  }
                }
              }}
              options={arbitratorOptions}
              error={errors.managerId || errors.arbitratorName || errors.arbitratorInn}
              disabled={loadingArbitrators}
            />
          </div>

          {/* Тип меры */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип дисциплинарной меры *
            </label>
            <Select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              options={typeOptions}
            />
          </div>

          {/* Статус */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Статус
            </label>
            <Select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              options={statusOptions}
            />
          </div>

          {/* Дата применения */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата применения *
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              error={errors.date}
            />
          </div>

          {/* Номер решения */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Номер решения *
            </label>
            <Input
              type="text"
              value={formData.decisionNumber}
              onChange={(e) => handleInputChange('decisionNumber', e.target.value)}
              error={errors.decisionNumber}
            />
          </div>
        </div>

        {/* Основание */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Основание для применения меры *
          </label>
          <Textarea
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            placeholder="Укажите основание для применения дисциплинарной меры..."
            rows={3}
            error={errors.reason}
          />
        </div>

        {/* Апелляция */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Информация об апелляции</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дедлайн апелляции
              </label>
              <Input
                type="date"
                value={formData.appealDeadline}
                onChange={(e) => handleInputChange('appealDeadline', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус апелляции
              </label>
              <Select
                value={formData.appealStatus}
                onChange={(e) => handleInputChange('appealStatus', e.target.value)}
                options={appealStatusOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата подачи апелляции
              </label>
              <Input
                type="date"
                value={formData.appealDate}
                onChange={(e) => handleInputChange('appealDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Решение по апелляции
              </label>
              <Input
                type="text"
                value={formData.appealDecision}
                onChange={(e) => handleInputChange('appealDecision', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заметки по апелляции
              </label>
              <Textarea
                value={formData.appealNotes}
                onChange={(e) => handleInputChange('appealNotes', e.target.value)}
                placeholder="Дополнительная информация по апелляции..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700"
          >
            {measure ? 'Сохранить изменения' : 'Создать дисциплинарную меру'}
          </Button>
        </div>
      </form>
    </>
  );

  if (!isModal) {
    return (
      <div className="bg-white rounded-lg w-full max-w-4xl mx-auto">
        <div className="p-6">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {content}
        </div>
      </div>
    </div>
  );
}
