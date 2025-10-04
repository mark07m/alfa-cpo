import { useState, useEffect } from 'react';
import { api } from '@/services/admin/api';

interface Inspection {
  id: string;
  arbitratorId: string;
  arbitratorName: string;
  arbitratorInn: string;
  inspectorName: string;
  type: 'planned' | 'unplanned';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  plannedDate: string;
  actualDate?: string;
  description: string;
  result?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateInspectionData {
  arbitratorId: string;
  arbitratorName: string;
  arbitratorInn: string;
  inspectorName: string;
  type: 'planned' | 'unplanned';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  plannedDate: string;
  actualDate?: string;
  description: string;
  result?: string;
  notes?: string;
}

interface UpdateInspectionData extends Partial<CreateInspectionData> {
  id: string;
}

export function useInspections() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Моковые данные для демонстрации
  const mockInspections: Inspection[] = [
    {
      id: '1',
      arbitratorId: '1',
      arbitratorName: 'Иванов Иван Иванович',
      arbitratorInn: '123456789012',
      inspectorName: 'Петров П.П.',
      type: 'planned',
      status: 'completed',
      plannedDate: '2024-01-15T10:00:00Z',
      actualDate: '2024-01-15T10:30:00Z',
      description: 'Плановая проверка деятельности арбитражного управляющего',
      result: 'Нарушений не выявлено',
      notes: 'Все документы в порядке',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-15T11:00:00Z'
    },
    {
      id: '2',
      arbitratorId: '2',
      arbitratorName: 'Петров Петр Петрович',
      arbitratorInn: '123456789013',
      inspectorName: 'Сидоров С.С.',
      type: 'unplanned',
      status: 'in_progress',
      plannedDate: '2024-01-20T14:00:00Z',
      description: 'Внеплановая проверка по жалобе',
      notes: 'Проверка документов по делу № А40-123456/2023',
      createdAt: '2024-01-18T16:00:00Z',
      updatedAt: '2024-01-18T16:00:00Z'
    },
    {
      id: '3',
      arbitratorId: '3',
      arbitratorName: 'Сидоров Сидор Сидорович',
      arbitratorInn: '123456789014',
      inspectorName: 'Иванов И.И.',
      type: 'planned',
      status: 'scheduled',
      plannedDate: '2024-01-25T09:00:00Z',
      description: 'Плановая проверка соблюдения требований',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    }
  ];

  const fetchInspections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // В реальном приложении здесь будет запрос к API
      // const response = await api.get('/inspections');
      // setInspections(response.data);
      
      // Пока используем моковые данные
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация загрузки
      setInspections(mockInspections);
    } catch (err) {
      setError('Ошибка загрузки проверок');
      console.error('Error fetching inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  const createInspection = async (data: CreateInspectionData): Promise<Inspection> => {
    try {
      // В реальном приложении здесь будет запрос к API
      // const response = await api.post('/inspections', data);
      // return response.data;
      
      // Пока используем моковые данные
      const newInspection: Inspection = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setInspections(prev => [newInspection, ...prev]);
      return newInspection;
    } catch (err) {
      console.error('Error creating inspection:', err);
      throw new Error('Ошибка создания проверки');
    }
  };

  const updateInspection = async (id: string, data: Partial<CreateInspectionData>): Promise<Inspection> => {
    try {
      // В реальном приложении здесь будет запрос к API
      // const response = await api.put(`/inspections/${id}`, data);
      // return response.data;
      
      // Пока используем моковые данные
      const updatedInspection = inspections.find(inspection => inspection.id === id);
      if (!updatedInspection) {
        throw new Error('Проверка не найдена');
      }
      
      const updated = {
        ...updatedInspection,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      setInspections(prev => prev.map(inspection => 
        inspection.id === id ? updated : inspection
      ));
      
      return updated;
    } catch (err) {
      console.error('Error updating inspection:', err);
      throw new Error('Ошибка обновления проверки');
    }
  };

  const deleteInspection = async (id: string): Promise<void> => {
    try {
      // В реальном приложении здесь будет запрос к API
      // await api.delete(`/inspections/${id}`);
      
      // Пока используем моковые данные
      setInspections(prev => prev.filter(inspection => inspection.id !== id));
    } catch (err) {
      console.error('Error deleting inspection:', err);
      throw new Error('Ошибка удаления проверки');
    }
  };

  const deleteInspections = async (ids: string[]): Promise<void> => {
    try {
      // В реальном приложении здесь будет запрос к API
      // await api.delete('/inspections/bulk', { data: { ids } });
      
      // Пока используем моковые данные
      setInspections(prev => prev.filter(inspection => !ids.includes(inspection.id)));
    } catch (err) {
      console.error('Error deleting inspections:', err);
      throw new Error('Ошибка массового удаления проверок');
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  return {
    inspections,
    loading,
    error,
    createInspection,
    updateInspection,
    deleteInspection,
    deleteInspections,
    refetch: fetchInspections
  };
}
