'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Textarea } from '@/components/admin/ui/Textarea';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface InspectionFormProps {
  inspection?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function InspectionForm({ inspection, onSave, onCancel }: InspectionFormProps) {
  const [formData, setFormData] = useState({
    arbitratorId: '',
    arbitratorName: '',
    arbitratorInn: '',
    inspectorName: '',
    type: 'planned',
    status: 'scheduled',
    plannedDate: '',
    actualDate: '',
    description: '',
    result: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (inspection) {
      setFormData({
        arbitratorId: inspection.arbitratorId || '',
        arbitratorName: inspection.arbitratorName || '',
        arbitratorInn: inspection.arbitratorInn || '',
        inspectorName: inspection.inspectorName || '',
        type: inspection.type || 'planned',
        status: inspection.status || 'scheduled',
        plannedDate: inspection.plannedDate ? inspection.plannedDate.split('T')[0] : '',
        actualDate: inspection.actualDate ? inspection.actualDate.split('T')[0] : '',
        description: inspection.description || '',
        result: inspection.result || '',
        notes: inspection.notes || ''
      });
    }
  }, [inspection]);

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

    if (!formData.inspectorName.trim()) {
      newErrors.inspectorName = 'ФИО инспектора обязательно';
    }

    if (!formData.plannedDate) {
      newErrors.plannedDate = 'Дата проверки обязательна';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание проверки обязательно';
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
      plannedDate: new Date(formData.plannedDate).toISOString(),
      actualDate: formData.actualDate ? new Date(formData.actualDate).toISOString() : null
    };

    onSave(submitData);
  };

  const arbitratorOptions = [
    { value: '', label: 'Выберите арбитражного управляющего' },
    { value: '1', label: 'Иванов Иван Иванович (ИНН: 123456789012)' },
    { value: '2', label: 'Петров Петр Петрович (ИНН: 123456789013)' },
    { value: '3', label: 'Сидоров Сидор Сидорович (ИНН: 123456789014)' }
  ];

  const inspectorOptions = [
    { value: '', label: 'Выберите инспектора' },
    { value: 'Иванов И.И.', label: 'Иванов И.И.' },
    { value: 'Петров П.П.', label: 'Петров П.П.' },
    { value: 'Сидоров С.С.', label: 'Сидоров С.С.' }
  ];

  const typeOptions = [
    { value: 'planned', label: 'Плановая' },
    { value: 'unplanned', label: 'Внеплановая' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Запланирована' },
    { value: 'in_progress', label: 'В процессе' },
    { value: 'completed', label: 'Завершена' },
    { value: 'cancelled', label: 'Отменена' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {inspection ? 'Редактирование проверки' : 'Создание проверки'}
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

              {/* Инспектор */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Инспектор *
                </label>
                <Select
                  value={formData.inspectorName}
                  onChange={(e) => handleInputChange('inspectorName', e.target.value)}
                  options={inspectorOptions}
                  error={errors.inspectorName}
                />
              </div>

              {/* Тип проверки */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип проверки
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

              {/* Дата проверки */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Планируемая дата *
                </label>
                <Input
                  type="date"
                  value={formData.plannedDate}
                  onChange={(e) => handleInputChange('plannedDate', e.target.value)}
                  error={errors.plannedDate}
                />
              </div>

              {/* Фактическая дата */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фактическая дата
                </label>
                <Input
                  type="date"
                  value={formData.actualDate}
                  onChange={(e) => handleInputChange('actualDate', e.target.value)}
                />
              </div>
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание проверки *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Опишите цель и задачи проверки..."
                rows={3}
                error={errors.description}
              />
            </div>

            {/* Результат */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Результат проверки
              </label>
              <Textarea
                value={formData.result}
                onChange={(e) => handleInputChange('result', e.target.value)}
                placeholder="Опишите результаты проверки..."
                rows={3}
              />
            </div>

            {/* Примечания */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Примечания
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Дополнительные примечания..."
                rows={2}
              />
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                {inspection ? 'Сохранить изменения' : 'Создать проверку'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
