import { apiService } from './api';
import {
  CompensationFund,
  CompensationFundStatistics,
  CompensationFundFormData,
  CompensationFundHistoryFormData,
  PaginatedResponse,
} from '@/types/admin';

// Backend statistics shape
interface BackendCompensationFundStatistics {
  currentAmount: number;
  currency: string;
  lastUpdated: string | Date;
  totalIncrease: number;
  totalDecrease: number;
  totalTransfers: number;
  lastMonthIncrease: number;
  lastMonthDecrease: number;
  totalOperations: number;
  lastMonthOperations: number;
}

export class CompensationFundService {
  private baseUrl = '/compensation-fund';

  // Получить информацию о компенсационном фонде
  async getFundInfo(): Promise<CompensationFund> {
    const response = await apiService.get<CompensationFund>(this.baseUrl);
    return response.data;
  }

  // Получить статистику компенсационного фонда (маппинг с backend-структуры)
  async getFundStatistics(): Promise<CompensationFundStatistics> {
    const response = await apiService.get<BackendCompensationFundStatistics>(`${this.baseUrl}/statistics`);
    const s = response.data;

    // Маппинг в формат UI
    const mapped: CompensationFundStatistics = {
      totalAmount: s.currentAmount,
      currency: s.currency,
      monthlyContributions: s.lastMonthIncrease,
      monthlyExpenses: s.lastMonthDecrease,
      netChange: s.lastMonthIncrease - s.lastMonthDecrease,
      contributionCount: s.lastMonthOperations, // недоступно разбиение по типам, показываем операции за месяц
      expenseCount: 0, // подробной разбивки по типам нет в API
      lastOperationDate: typeof s.lastUpdated === 'string' ? s.lastUpdated : new Date(s.lastUpdated).toISOString(),
      averageMonthlyContribution: s.lastMonthIncrease, // приблизительное значение
      averageMonthlyExpense: s.lastMonthDecrease, // приблизительное значение
    };
    return mapped;
  }

  // Обновить информацию о компенсационном фонде
  async updateFundInfo(data: CompensationFundFormData): Promise<CompensationFund> {
    const response = await apiService.put<CompensationFund>(this.baseUrl, data);
    return response.data;
  }

  // Получить историю операций
  async getFundHistory(params?: {
    page?: number;
    limit?: number;
    operation?: string;
    dateFrom?: string; // UI-параметр → startDate в backend
    dateTo?: string;   // UI-параметр → endDate в backend
  }): Promise<PaginatedResponse<CompensationFund['history'][0]>> {
    const mappedParams: Record<string, any> = {};
    if (params?.page) mappedParams.page = params.page;
    if (params?.limit) mappedParams.limit = params.limit;
    if (params?.operation) mappedParams.operation = params.operation;
    if (params?.dateFrom) mappedParams.startDate = params.dateFrom;
    if (params?.dateTo) mappedParams.endDate = params.dateTo;

    const response = await apiService.get<CompensationFund['history'][0][]>(
      `${this.baseUrl}/history`,
      { params: mappedParams }
    );

    const data = Array.isArray(response.data) ? response.data : [];
    const pagination = response.pagination || {
      page: mappedParams.page || 1,
      limit: mappedParams.limit || 10,
      total: data.length,
      totalPages: Math.max(1, Math.ceil(data.length / (mappedParams.limit || 10)))
    };

    return { data, pagination };
  }

  // Добавить запись в историю (backend возвращает обновленный фонд, нам достаточно факта успеха)
  async addHistoryEntry(data: CompensationFundHistoryFormData): Promise<void> {
    // Backend требует обязательное поле date (ISO string)
    if (!data.date) {
      data.date = new Date().toISOString();
    }
    await apiService.post(`${this.baseUrl}/history`, data);
  }

  // Обновление записи истории не поддерживается backend
  async updateHistoryEntry(_id: string, _data: CompensationFundHistoryFormData): Promise<never> {
    throw new Error('Обновление записей истории не поддерживается сервером');
  }

  // Удаление записи истории не поддерживается backend
  async deleteHistoryEntry(_id: string): Promise<never> {
    throw new Error('Удаление записей истории не поддерживается сервером');
  }

  // Экспорт истории не поддерживается backend
  async exportHistory(): Promise<never> {
    throw new Error('Экспорт истории не поддерживается сервером');
  }

  // Экспорт статистики не поддерживается backend
  async exportStatistics(): Promise<never> {
    throw new Error('Экспорт статистики не поддерживается сервером');
  }
}

export const compensationFundService = new CompensationFundService();
