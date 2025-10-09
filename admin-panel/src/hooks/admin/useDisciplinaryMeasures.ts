import { useState, useEffect } from 'react';
import { disciplinaryMeasuresService } from '@/services/admin/disciplinaryMeasures';

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
  managerId: string;
  type: 'warning' | 'reprimand' | 'exclusion' | 'suspension' | 'other';
  status?: 'active' | 'cancelled' | 'expired';
  date: string;
  reason: string;
  decisionNumber: string;
  documents?: string[];
  appealDeadline?: string;
  appealStatus?: 'none' | 'submitted' | 'reviewed' | 'approved' | 'rejected';
  appealNotes?: string;
  appealDate?: string;
  appealDecision?: string;
}

interface UpdateDisciplinaryMeasureData extends Partial<CreateDisciplinaryMeasureData> {
  id: string;
}

export function useDisciplinaryMeasures() {
  const [measures, setMeasures] = useState<DisciplinaryMeasure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeasures = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await disciplinaryMeasuresService.list();
      const mapped = result.data.map(item => ({
        id: item.id,
        arbitratorId: '',
        arbitratorName: item.arbitratorName,
        arbitratorInn: item.arbitratorInn,
        type: item.type,
        status: (item.status as any),
        date: item.date,
        reason: item.reason,
        description: '',
        duration: undefined,
        appealDate: item.appealDate,
        appealResult: item.appealStatus,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
      setMeasures(mapped);
    } catch (err) {
      setError('Ошибка загрузки дисциплинарных мер');
      console.error('Error fetching disciplinary measures:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMeasure = async (data: CreateDisciplinaryMeasureData): Promise<DisciplinaryMeasure> => {
    try {
      const created = await disciplinaryMeasuresService.create({
        managerId: data.managerId,
        type: data.type,
        reason: data.reason,
        date: data.date,
        decisionNumber: data.decisionNumber,
        status: data.status,
        documents: data.documents,
        appealDeadline: data.appealDeadline,
        appealStatus: data.appealStatus,
        appealNotes: data.appealNotes,
        appealDate: data.appealDate,
        appealDecision: data.appealDecision,
      });
      const mapped: DisciplinaryMeasure = {
        id: created.id,
        arbitratorId: data.managerId,
        arbitratorName: created.arbitratorName,
        arbitratorInn: created.arbitratorInn,
        type: created.type,
        status: (created.status as any),
        date: created.date,
        reason: created.reason,
        description: '',
        duration: undefined,
        appealDate: created.appealDate,
        appealResult: created.appealStatus,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt
      };
      setMeasures(prev => [mapped, ...prev]);
      return mapped;
    } catch (err) {
      console.error('Error creating disciplinary measure:', err);
      throw new Error('Ошибка создания дисциплинарной меры');
    }
  };

  const updateMeasure = async (id: string, data: Partial<CreateDisciplinaryMeasureData>): Promise<DisciplinaryMeasure> => {
    try {
      const updated = await disciplinaryMeasuresService.update(id, {
        managerId: data.managerId,
        type: data.type,
        reason: data.reason,
        date: data.date,
        decisionNumber: data.decisionNumber,
        status: data.status,
        documents: data.documents,
        appealDeadline: data.appealDeadline,
        appealStatus: data.appealStatus,
        appealNotes: data.appealNotes,
        appealDate: data.appealDate,
        appealDecision: data.appealDecision,
      });
      const mapped: DisciplinaryMeasure = {
        id: updated.id,
        arbitratorId: data.managerId || '',
        arbitratorName: updated.arbitratorName,
        arbitratorInn: updated.arbitratorInn,
        type: updated.type,
        status: (updated.status as any),
        date: updated.date,
        reason: updated.reason,
        description: '',
        duration: undefined,
        appealDate: updated.appealDate,
        appealResult: updated.appealStatus,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
      };
      setMeasures(prev => prev.map(measure => measure.id === id ? mapped : measure));
      return mapped;
    } catch (err) {
      console.error('Error updating disciplinary measure:', err);
      throw new Error('Ошибка обновления дисциплинарной меры');
    }
  };

  const deleteMeasure = async (id: string): Promise<void> => {
    try {
      await disciplinaryMeasuresService.remove(id);
      setMeasures(prev => prev.filter(measure => measure.id !== id));
    } catch (err) {
      console.error('Error deleting disciplinary measure:', err);
      throw new Error('Ошибка удаления дисциплинарной меры');
    }
  };

  const deleteMeasures = async (ids: string[]): Promise<void> => {
    try {
      // Backend не имеет batch удаления — удаляем по одному
      await Promise.all(ids.map(id => disciplinaryMeasuresService.remove(id)));
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
