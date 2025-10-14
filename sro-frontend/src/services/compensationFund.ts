import api from '@/lib/api'
import { ApiResponse } from '@/types'

export interface CompensationFundResponse {
  amount: number
  currency: string
  lastUpdated: string
  bankDetails: {
    bankName: string
    accountNumber: string
    bik: string
    correspondentAccount: string
    inn: string
    kpp: string
  }
  documents?: string[]
}

export const compensationFundService = {
  async get(): Promise<ApiResponse<CompensationFundResponse>> {
    return api.get<CompensationFundResponse>('/compensation-fund')
  },
  async history(params: { page?: number; limit?: number } = {}): Promise<ApiResponse<any>> {
    return api.get<any>('/compensation-fund/history', { params })
  }
}

export type CompensationFundService = typeof compensationFundService


