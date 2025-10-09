import { apiService } from './api';

// UI-facing shape used by the inspections pages/components
export interface UiInspection {
  id: string;
  arbitratorId: string;
  arbitratorName: string;
  arbitratorInn: string;
  inspectorName: string;
  type: 'planned' | 'unplanned';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  plannedDate: string; // maps to scheduledDate
  actualDate?: string | null; // maps to completedDate
  description: string; // maps to notes
  result?: 'passed' | 'failed' | 'needs_improvement' | '';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UiCreateInspectionData {
  arbitratorId: string;
  arbitratorName?: string; // not sent to backend
  arbitratorInn?: string; // not sent to backend
  inspectorName: string;
  type: 'planned' | 'unplanned';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  plannedDate: string; // ISO
  actualDate?: string | null; // ISO or null
  description: string; // maps to notes
  result?: 'passed' | 'failed' | 'needs_improvement' | '';
  notes?: string;
}

type ListParams = {
  type?: 'planned' | 'unplanned';
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  inspector?: string;
  dateFrom?: string; // maps to scheduledDateFrom
  dateTo?: string;   // maps to scheduledDateTo
  page?: number;
  limit?: number;
};

function mapBackendToUi(item: any): UiInspection {
  const manager = item.managerId || {};
  return {
    id: item._id || item.id,
    arbitratorId: typeof item.managerId === 'string' ? item.managerId : (item.managerId?._id || ''),
    arbitratorName: manager.fullName || '',
    arbitratorInn: manager.inn || '',
    inspectorName: item.inspector || '',
    type: item.type,
    status: item.status,
    plannedDate: item.scheduledDate,
    actualDate: item.completedDate || null,
    description: item.notes || '',
    result: item.result || '',
    notes: item.notes || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function mapUiToBackend(data: UiCreateInspectionData) {
  const payload: any = {
    managerId: data.arbitratorId,
    type: data.type,
    status: data.status,
    scheduledDate: data.plannedDate,
    inspector: data.inspectorName,
  };

  if (data.actualDate) payload.completedDate = data.actualDate;
  if (data.result) payload.result = data.result;
  if (data.description || data.notes) payload.notes = data.description || data.notes;

  return payload;
}

export const inspectionsService = {
  async list(params: ListParams = {}): Promise<{ data: UiInspection[]; pagination?: any }> {
    const mappedParams: Record<string, any> = {};
    if (params.type) mappedParams.type = params.type;
    if (params.status) mappedParams.status = params.status;
    if (params.inspector) mappedParams.inspector = params.inspector;
    if (params.dateFrom) mappedParams.scheduledDateFrom = params.dateFrom;
    if (params.dateTo) mappedParams.scheduledDateTo = params.dateTo;
    if (params.page) mappedParams.page = params.page;
    if (params.limit) mappedParams.limit = params.limit;

    const response = await apiService.get<any>('/inspections', { params: mappedParams });
    const rawData: any[] = (response.data as unknown as any[]) || [];
    const pagination = (response as any).pagination;
    return {
      data: rawData.map(mapBackendToUi),
      pagination,
    };
  },

  async getById(id: string): Promise<UiInspection> {
    const response = await apiService.get<any>(`/inspections/${id}`);
    const raw = (response.data as any) || {};
    return mapBackendToUi(raw);
  },

  async create(data: UiCreateInspectionData): Promise<UiInspection> {
    const payload = mapUiToBackend(data);
    const response = await apiService.post<any>('/inspections', payload);
    const raw = (response.data as any) || {};
    return mapBackendToUi(raw);
  },

  async update(id: string, data: Partial<UiCreateInspectionData>): Promise<UiInspection> {
    const payload = mapUiToBackend({
      // Provide sensible defaults; only send fields present
      arbitratorId: data.arbitratorId || '',
      inspectorName: data.inspectorName || '',
      type: (data.type as any) || 'planned',
      status: (data.status as any) || 'scheduled',
      plannedDate: data.plannedDate || new Date().toISOString(),
      actualDate: data.actualDate ?? undefined,
      description: data.description || '',
      result: data.result,
      notes: data.notes,
    });

    // Remove potentially empty values for partial update
    Object.keys(payload).forEach((k) => {
      if (payload[k] === '' || payload[k] === undefined) delete payload[k];
    });

    const response = await apiService.patch<any>(`/inspections/${id}`, payload);
    const raw = (response.data as any) || {};
    return mapBackendToUi(raw);
  },

  async remove(id: string): Promise<void> {
    await apiService.delete(`/inspections/${id}`);
  },

  async removeMany(ids: string[]): Promise<number> {
    let deleted = 0;
    for (const id of ids) {
      try {
        await this.remove(id);
        deleted += 1;
      } catch (e) {
        // continue deleting others
      }
    }
    return deleted;
  },
};


