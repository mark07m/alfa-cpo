import { apiService } from './api'

export interface DashboardSummary {
  inspections: any
  disciplinaryMeasures: any
  arbitrators: any
  financial: any
}

export interface ReportParams {
  from?: string
  to?: string
  type?: string
  [key: string]: any
}

async function fetchViaNextApi(path: string, params: Record<string, any> = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, String(v))
  })
  const url = `/api${path}${query.toString() ? `?${query.toString()}` : ''}`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  try {
    const resp = await fetch(url, { method: 'GET', headers, cache: 'no-store' })
    if (!resp.ok) {
      // Map gateway/service errors to a unified API_UNAVAILABLE signal for graceful fallbacks
      if (resp.status === 502 || resp.status === 503 || resp.status === 504) {
        const err: any = new Error('API unavailable')
        err.name = 'API_UNAVAILABLE'
        throw err
      }
      throw new Error(`NEXT_API_${resp.status}`)
    }
    return resp.json()
  } catch (error: any) {
    // Network-level failures (e.g., server down) should also surface as API_UNAVAILABLE
    if (
      error?.name === 'TypeError' ||
      error?.message === 'Failed to fetch' ||
      error?.code === 'ERR_NETWORK'
    ) {
      const err: any = new Error('API unavailable')
      err.name = 'API_UNAVAILABLE'
      throw err
    }
    throw error
  }
}

export const analyticsService = {
  async getDashboard(params: ReportParams = {}): Promise<any> {
    return fetchViaNextApi('/analytics/dashboard', params)
  },

  async getReports(params: ReportParams = {}): Promise<any> {
    return fetchViaNextApi('/analytics/reports', params)
  },

  async getInspectionsReports(params: ReportParams = {}): Promise<any> {
    return fetchViaNextApi('/analytics/inspections/reports', params)
  },

  async getDisciplinaryMeasuresReports(params: ReportParams = {}): Promise<any> {
    return fetchViaNextApi('/analytics/disciplinary-measures/reports', params)
  },
}
