import { apiService } from './api';

// Backend DTO-compatible filters
export interface DisciplinaryMeasuresQuery {
  managerId?: string;
  type?: 'warning' | 'reprimand' | 'exclusion' | 'suspension' | 'other';
  status?: 'active' | 'cancelled' | 'expired';
  appealStatus?: 'none' | 'submitted' | 'reviewed' | 'approved' | 'rejected';
  decisionNumber?: string;
  dateFrom?: string; // ISO
  dateTo?: string; // ISO
  appealDeadlineFrom?: string; // ISO
  appealDeadlineTo?: string; // ISO
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// UI-facing item used by admin components
export interface UIDisciplinaryMeasure {
  id: string;
  managerId?: string;
  arbitratorName: string;
  arbitratorInn: string;
  type: 'warning' | 'reprimand' | 'exclusion' | 'suspension' | 'other';
  status: 'active' | 'cancelled' | 'expired';
  date: string;
  reason: string;
  decisionNumber: string;
  appealStatus?: 'none' | 'submitted' | 'reviewed' | 'approved' | 'rejected';
  appealDeadline?: string;
  appealDate?: string;
  appealDecision?: string;
  createdAt: string;
  updatedAt: string;
}

// Backend item minimal shape (populated manager/document fields)
interface BackendMeasure {
  _id: string;
  managerId: { _id: string; fullName?: string; inn?: string; registryNumber?: string } | string;
  type: UIDisciplinaryMeasure['type'];
  reason: string;
  date: string;
  decisionNumber: string;
  status: UIDisciplinaryMeasure['status'];
  documents?: Array<{ _id: string; name: string; url: string; type: string } | string>;
  appealDeadline?: string;
  appealStatus?: UIDisciplinaryMeasure['appealStatus'];
  appealNotes?: string;
  appealDate?: string;
  appealDecision?: string;
  createdAt: string;
  updatedAt: string;
}

function mapBackendToUI(item: BackendMeasure): UIDisciplinaryMeasure {
  const manager: any = item.managerId as any;
  return {
    id: (item as any)._id || (item as any).id,
    managerId: typeof item.managerId === 'string' ? (item.managerId as string) : (manager?._id || ''),
    arbitratorName: manager?.fullName || '',
    arbitratorInn: manager?.inn || '',
    type: item.type,
    status: item.status,
    date: item.date,
    reason: item.reason,
    decisionNumber: item.decisionNumber,
    appealStatus: item.appealStatus,
    appealDeadline: item.appealDeadline,
    appealDate: item.appealDate,
    appealDecision: item.appealDecision,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function cleanPayload<T extends Record<string, any>>(data: T): T {
  const cleaned = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  ) as T;
  return cleaned;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const disciplinaryMeasuresService = {
  async list(params: DisciplinaryMeasuresQuery = {}): Promise<PaginatedResult<UIDisciplinaryMeasure>> {
    const response = await apiService.get<BackendMeasure[]>('/disciplinary-measures', { params });
    const backendData: BackendMeasure[] = Array.isArray(response.data) ? (response.data as BackendMeasure[]) : (((response as any).data?.data) as BackendMeasure[]) || [];
    const pagination = (response as any).pagination || (response as any).data?.pagination || {
      page: params.page || 1,
      limit: params.limit || 10,
      total: backendData.length,
      totalPages: Math.max(1, Math.ceil(backendData.length / (params.limit || 10)))
    };
    return {
      data: backendData.map(mapBackendToUI),
      pagination,
    };
  },

  async get(id: string): Promise<UIDisciplinaryMeasure> {
    const response = await apiService.get<BackendMeasure>(`/disciplinary-measures/${id}`);
    // backend may return { success, data }
    const item = ((response as any).data?.data || response.data) as BackendMeasure;
    return mapBackendToUI(item);
  },

  async create(data: {
    managerId: string;
    type: UIDisciplinaryMeasure['type'];
    reason: string;
    date: string; // ISO
    decisionNumber: string;
    status?: UIDisciplinaryMeasure['status'];
    documents?: string[];
    appealDeadline?: string; // ISO
    appealStatus?: UIDisciplinaryMeasure['appealStatus'];
    appealNotes?: string;
    appealDate?: string; // ISO
    appealDecision?: string;
  }): Promise<UIDisciplinaryMeasure> {
    const payload = cleanPayload(data);
    const response = await apiService.post<BackendMeasure>('/disciplinary-measures', payload);
    const item = ((response as any).data?.data || response.data) as BackendMeasure;
    return mapBackendToUI(item);
  },

  async update(id: string, data: Partial<{
    managerId: string;
    type: UIDisciplinaryMeasure['type'];
    reason: string;
    date: string;
    decisionNumber: string;
    status: UIDisciplinaryMeasure['status'];
    documents: string[];
    appealDeadline: string;
    appealStatus: UIDisciplinaryMeasure['appealStatus'];
    appealNotes: string;
    appealDate: string;
    appealDecision: string;
  }>): Promise<UIDisciplinaryMeasure> {
    const payload = cleanPayload(data);
    const response = await apiService.patch<BackendMeasure>(`/disciplinary-measures/${id}`, payload);
    const item = ((response as any).data?.data || response.data) as BackendMeasure;
    return mapBackendToUI(item);
  },

  async remove(id: string): Promise<void> {
    await apiService.delete(`/disciplinary-measures/${id}`);
  },

  async statistics(): Promise<any> {
    const response = await apiService.get<any>('/disciplinary-measures/statistics');
    return (response as any).data?.data || response.data;
  }
};


