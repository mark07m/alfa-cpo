'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Textarea } from '@/components/admin/ui/Textarea';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DisciplinaryMeasureFormProps {
  measure?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function DisciplinaryMeasureForm({ measure, onSave, onCancel }: DisciplinaryMeasureFormProps) {
  const [formData, setFormData] = useState({
    arbitratorId: '',
    arbitratorName: '',
    arbitratorInn: '',
    type: 'warning',
    status: 'active',
    date: '',
    reason: '',
    description: '',
    duration: '',
    appealDate: '',
    appealResult: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (measure) {
      setFormData({
        arbitratorId: measure.arbitratorId || '',
        arbitratorName: measure.arbitratorName || '',
        arbitratorInn: measure.arbitratorInn || '',
        type: measure.type || 'warning',
        status: measure.status || 'active',
        date: measure.date ? measure.date.split('T')[0] : '',
        reason: measure.reason || '',
        description: measure.description || '',
        duration: measure.duration || '',
        appealDate: measure.appealDate ? measure.appealDate.split('T')[0] : '',
        appealResult: measure.appealResult || ''
      });
    }
  }, [measure]);

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

    if (!formData.description.trim()) {
      newErrors.description = 'Описание меры обязательно';
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
      ...formData,
      date: new Date(formData.date).toISOString(),
      appealDate: formData.appealDate ? new Date(formData.appealDate).toISOString() : null
    };

    onSave(submitData);
  };

  const arbitratorOptions = [
    { value: '', label: 'Выберите арбитражного управляющего' },
    { value: '1', label: 'Иванов Иван Иванович (ИНН: 123456789012)' },
    { value: '2', label: 'Петров Петр Петрович (ИНН: 123456789013)' },
    { value: '3', label: 'Сидоров Сидор Сидорович (ИНН: 123456789014)' }
  ];

  const typeOptions = [
    { value: 'warning', label: 'Предупреждение' },
    { value: 'reprimand', label: 'Выговор' },
    { value: 'suspension', label: 'Приостановление' },
    { value: 'exclusion', label: 'Исключение' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Действует' },
    { value: 'appealed', label: 'Обжалуется' },
    { value: 'cancelled', label: 'Отменена' },
    { value: 'expired', label: 'Истекла' }
  ];

  const durationOptions = [
    { value: '', label: 'Без срока' },
    { value: '1 месяц', label: '1 месяц' },
    { value: '3 месяца', label: '3 месяца' },
    { value: '6 месяцев', label: '6 месяцев' },
    { value: '1 год', label: '1 год' },
    { value: '2 года', label: '2 года' },
    { value: 'Постоянно', label: 'Постоянно' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {measure ? 'Редактирование дисциплинарной меры' : 'Создание дисциплинарной меры'}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="flex items-center space-x-1"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Закрыть</span>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Арбитражный управляющий */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Арбитражный управляющий *
                </label>
                <Select
                  value={formData.arbitratorId}
                  onChange={(e) => {
                    const selectedArbitrator = arbitratorOptions.find(opt => opt.value === e.target.value);
                    if (selectedArbitrator) {
                      const nameMatch = selectedArbitrator.label.match(/^(.+?)\s+\(ИНН:\s+(\d+)\)$/);
                      if (nameMatch) {
                        handleInputChange('arbitratorId', e.target.value);
                        handleInputChange('arbitratorName', nameMatch[1]);
                        handleInputChange('arbitratorInn', nameMatch[2]);
                      }
                    }
                  }}
                  options={arbitratorOptions}
                  error={errors.arbitratorName || errors.arbitratorInn}
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

              {/* Срок действия */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Срок действия
                </label>
                <Select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  options={durationOptions}
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

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание меры *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Опишите применяемую дисциплинарную меру..."
                rows={3}
                error={errors.description}
              />
            </div>

            {/* Апелляция */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Информация об апелляции</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Результат апелляции
                  </label>
                  <Select
                    value={formData.appealResult}
                    onChange={(e) => handleInputChange('appealResult', e.target.value)}
                    options={[
                      { value: '', label: 'Не выбрано' },
                      { value: 'pending', label: 'На рассмотрении' },
                      { value: 'approved', label: 'Удовлетворена' },
                      { value: 'rejected', label: 'Отклонена' }
                    ]}
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
        </div>
      </div>
    </div>
  );
}
