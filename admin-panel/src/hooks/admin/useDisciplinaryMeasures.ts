import { useState, useEffect } from 'react';
import { api } from '@/services/admin/api';

interface DisciplinaryMeasure {
  id: string;
  arbitratorId: string;
  arbitratorName: string;
  arbitratorInn: string;
  type: 'warning' | 'reprimand' | 'exclusion' | 'suspension';
  status: 'active' | 'appealed' | 'cancelled' | 'expired';
  date: string;
  reason: string;
  description: string;
  duration?: string;
  appealDate?: string;
  appealResult?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateDisciplinaryMeasureData {
  arbitratorId: string;
  arbitratorName: string;
  arbitratorInn: string;
  type: 'warning' | 'reprimand' | 'exclusion' | 'suspension';
  status: 'active' | 'appealed' | 'cancelled' | 'expired';
  date: string;
  reason: string;
  description: string;
  duration?: string;
  appealDate?: string;
  appealResult?: string;
}

interface UpdateDisciplinaryMeasureData extends Partial<CreateDisciplinaryMeasureData> {
  id: string;
}

export function useDisciplinaryMeasures() {
  const [measures, setMeasures] = useState<DisciplinaryMeasure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Моковые данные для демонстрации
  const mockMeasures: DisciplinaryMeasure[] = [
    {
      id: '1',
      arbitratorId: '1',
      arbitratorName: 'Иванов Иван Иванович',
      arbitratorInn: '123456789012',
      type: 'warning',
      status: 'active',
      date: '2024-01-10T00:00:00Z',
      reason: 'Нарушение сроков подачи документов',
      description: 'Предупреждение о недопустимости нарушения сроков подачи документов в арбитражный суд',
      duration: '1 год',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z'
    },
    {
      id: '2',
      arbitratorId: '2',
      arbitratorName: 'Петров Петр Петрович',
      arbitratorInn: '123456789013',
      type: 'reprimand',
      status: 'appealed',
      date: '2024-01-15T00:00:00Z',
      reason: 'Несоблюдение профессиональных стандартов',
      description: 'Выговор за несоблюдение профессиональных стандартов при проведении процедуры банкротства',
      duration: '6 месяцев',
      appealDate: '2024-01-20T00:00:00Z',
      appealResult: 'pending',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:00:00Z'
    },
    {
      id: '3',
      arbitratorId: '3',
      arbitratorName: 'Сидоров Сидор Сидорович',
      arbitratorInn: '123456789014',
      type: 'suspension',
      status: 'active',
      date: '2024-01-20T00:00:00Z',
      reason: 'Грубое нарушение требований законодательства',
      description: 'Приостановление членства в СРО на 3 месяца за грубое нарушение требований законодательства о несостоятельности',
      duration: '3 месяца',
      createdAt: '2024-01-20T11:00:00Z',
      updatedAt: '2024-01-20T11:00:00Z'
    },
    {
      id: '4',
      arbitratorId: '4',
      arbitratorName: 'Козлов Козел Козлович',
      arbitratorInn: '123456789015',
      type: 'exclusion',
      status: 'cancelled',
      date: '2023-12-01T00:00:00Z',
      reason: 'Систематические нарушения',
      description: 'Исключение из СРО за систематические нарушения требований законодательства',
      duration: 'Постоянно',
      appealDate: '2023-12-05T00:00:00Z',
      appealResult: 'approved',
      createdAt: '2023-12-01T09:00:00Z',
      updatedAt: '2023-12-10T15:00:00Z'
    }
  ];

  const fetchMeasures = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // В реальном приложении здесь будет запрос к API
      // const response = await api.get('/disciplinary-measures');
      // setMeasures(response.data);
      
      // Пока используем моковые данные
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация загрузки
      setMeasures(mockMeasures);
    } catch (err) {
      setError('Ошибка загрузки дисциплинарных мер');
      console.error('Error fetching disciplinary measures:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMeasure = async (data: CreateDisciplinaryMeasureData): Promise<DisciplinaryMeasure> => {
    try {
      // В реальном приложении здесь будет запрос к API
      // const response = await api.post('/disciplinary-measures', data);
      // return response.data;
      
      // Пока используем моковые данные
      const newMeasure: DisciplinaryMeasure = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setMeasures(prev => [newMeasure, ...prev]);
      return newMeasure;
    } catch (err) {
      console.error('Error creating disciplinary measure:', err);
      throw new Error('Ошибка создания дисциплинарной меры');
    }
  };

  const updateMeasure = async (id: string, data: Partial<CreateDisciplinaryMeasureData>): Promise<DisciplinaryMeasure> => {
    try {
      // В реальном приложении здесь будет запрос к API
      // const response = await api.put(`/disciplinary-measures/${id}`, data);
      // return response.data;
      
      // Пока используем моковые данные
      const updatedMeasure = measures.find(measure => measure.id === id);
      if (!updatedMeasure) {
        throw new Error('Дисциплинарная мера не найдена');
      }
      
      const updated = {
        ...updatedMeasure,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      setMeasures(prev => prev.map(measure => 
        measure.id === id ? updated : measure
      ));
      
      return updated;
    } catch (err) {
      console.error('Error updating disciplinary measure:', err);
      throw new Error('Ошибка обновления дисциплинарной меры');
    }
  };

  const deleteMeasure = async (id: string): Promise<void> => {
    try {
      // В реальном приложении здесь будет запрос к API
      // await api.delete(`/disciplinary-measures/${id}`);
      
      // Пока используем моковые данные
      setMeasures(prev => prev.filter(measure => measure.id !== id));
    } catch (err) {
      console.error('Error deleting disciplinary measure:', err);
      throw new Error('Ошибка удаления дисциплинарной меры');
    }
  };

  const deleteMeasures = async (ids: string[]): Promise<void> => {
    try {
      // В реальном приложении здесь будет запрос к API
      // await api.delete('/disciplinary-measures/bulk', { data: { ids } });
      
      // Пока используем моковые данные
      setMeasures(prev => prev.filter(measure => !ids.includes(measure.id)));
    } catch (err) {
      console.error('Error deleting disciplinary measures:', err);
      throw new Error('Ошибка массового удаления дисциплинарных мер');
    }
  };

  useEffect(() => {
    fetchMeasures();
  }, []);

  return {
    measures,
    loading,
    error,
    createMeasure,
    updateMeasure,
    deleteMeasure,
    deleteMeasures,
    refetch: fetchMeasures
  };
}
