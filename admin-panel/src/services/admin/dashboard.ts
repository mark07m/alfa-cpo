import { DashboardStats, ActivityItem, PaginatedResponse } from '@/types/admin'
import { apiService } from './api'

export interface DashboardService {
  getStats(): Promise<DashboardStats>
  getActivities(limit?: number): Promise<ActivityItem[]>
  getActivityChart(days?: number): Promise<any[]>
  getNotifications(): Promise<any[]>
}

class DashboardServiceImpl implements DashboardService {
  async getStats(): Promise<DashboardStats> {
    try {
      // Add request-level timeouts and use allSettled to avoid blocking on a single slow endpoint
      const req = (endpoint: string, params: any = {}) => apiService.get<any>(endpoint, { params: { page: 1, limit: 1, ...params } })
      const withTimeout = <T,>(p: Promise<T>, ms = 6000) => Promise.race<T>([
        p,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms)) as Promise<T>
      ])

      const results = await Promise.allSettled([
        withTimeout(req('/news')),
        withTimeout(req('/events')),
        withTimeout(req('/documents')),
        withTimeout(req('/users')),
        withTimeout(req('/inspections')),
        withTimeout(req('/disciplinary-measures'))
      ])

      const safe = (idx: number) => (results[idx].status === 'fulfilled' ? (results[idx] as PromiseFulfilledResult<any>).value : null)

      const newsRes = safe(0)
      const eventsRes = safe(1)
      const docsRes = safe(2)
      const usersRes = safe(3)
      const inspectionsRes = safe(4)
      const measuresRes = safe(5)

      const newsCount = (newsRes as any)?.pagination?.total ?? (Array.isArray((newsRes as any)?.data) ? (newsRes as any).data.length : 0)
      const eventsCount = (eventsRes as any)?.pagination?.total ?? (Array.isArray((eventsRes as any)?.data) ? (eventsRes as any).data.length : 0)
      const documentsCount = (docsRes as any)?.pagination?.total ?? (Array.isArray((docsRes as any)?.data) ? (docsRes as any).data.length : 0)
      const usersCount = (usersRes as any)?.pagination?.total ?? (Array.isArray((usersRes as any)?.data) ? (usersRes as any).data.length : 0)
      const inspectionsCount = (inspectionsRes as any)?.pagination?.total ?? (Array.isArray((inspectionsRes as any)?.data) ? (inspectionsRes as any).data.length : 0)
      const disciplinaryMeasuresCount = (measuresRes as any)?.pagination?.total ?? (Array.isArray((measuresRes as any)?.data) ? (measuresRes as any).data.length : 0)

      let compensationFundCount = 0
      try {
        const cfResult = await Promise.allSettled([withTimeout(req('/compensation-fund/history'))])
        const cfRes = cfResult[0].status === 'fulfilled' ? cfResult[0].value : null
        compensationFundCount = (cfRes as any)?.pagination?.total ?? (Array.isArray((cfRes as any)?.data) ? (cfRes as any).data.length : 0)
      } catch (e) {
        // ignore errors for optional metric
      }

      return {
        newsCount,
        newsChange: { value: '0%', type: 'neutral' },
        eventsCount,
        eventsChange: { value: '0%', type: 'neutral' },
        documentsCount,
        documentsChange: { value: '0%', type: 'neutral' },
        usersCount,
        usersChange: { value: '0%', type: 'neutral' },
        inspectionsCount,
        disciplinaryMeasuresCount,
        compensationFundCount
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      throw error
    }
  }

  async getActivities(limit: number = 10): Promise<ActivityItem[]> {
    try {
      const req = (endpoint: string, params: any = {}) => apiService.get<any>(endpoint, { params })
      const withTimeout = <T,>(p: Promise<T>, ms = 6000) => Promise.race<T>([
        p,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms)) as Promise<T>
      ])

      const results = await Promise.allSettled([
        withTimeout(req('/news/latest', { limit })),
        withTimeout(req('/events', { page: 1, limit })),
        withTimeout(req('/documents', { page: 1, limit })),
        withTimeout(req('/registry', { page: 1, limit })),
        withTimeout(req('/inspections', { page: 1, limit })),
        withTimeout(req('/disciplinary-measures', { page: 1, limit }))
      ])

      const safe = (idx: number) => (results[idx].status === 'fulfilled' ? (results[idx] as PromiseFulfilledResult<any>).value : { data: [] })

      const newsLatest = safe(0)
      const eventsList = safe(1)
      const docsList = safe(2)
      const registryList = safe(3)
      const inspectionsList = safe(4)
      const measuresList = safe(5)

      const items: ActivityItem[] = []

      const pushSafe = (arr: any[], mapFn: (it: any) => ActivityItem | null) => {
        if (Array.isArray(arr)) {
          arr.forEach((it) => {
            const mapped = mapFn(it)
            if (mapped) items.push(mapped)
          })
        }
      }

      pushSafe((newsLatest as any)?.data || [], (n) => ({
        id: String(n.id || n._id || Math.random()),
        type: 'news',
        action: 'created',
        title: n.title || 'Новость',
        user: { name: (n.author && (n.author.name || n.author.email)) || 'Система' },
        timestamp: n.publishedAt || n.createdAt || n.updatedAt || new Date().toISOString(),
        details: n.excerpt || undefined
      }))

      pushSafe((eventsList as any)?.data || [], (e) => ({
        id: String(e.id || e._id || Math.random()),
        type: 'event',
        action: 'created',
        title: e.title || 'Мероприятие',
        user: { name: (e.createdBy && (e.createdBy.name || e.createdBy.email)) || 'Система' },
        timestamp: e.createdAt || e.updatedAt || new Date().toISOString(),
        details: e.location || undefined
      }))

      pushSafe((docsList as any)?.data || [], (d) => ({
        id: String(d.id || d._id || Math.random()),
        type: 'document',
        action: 'published',
        title: d.title || d.fileName || 'Документ',
        user: { name: (d.createdBy && (d.createdBy.name || d.createdBy.email)) || 'Система' },
        timestamp: d.uploadedAt || d.createdAt || d.updatedAt || new Date().toISOString(),
        details: d.description || undefined
      }))

      pushSafe((registryList as any)?.data || [], (r) => ({
        id: String(r.id || r._id || Math.random()),
        type: 'arbitrator',
        action: 'created',
        title: r.fullName || 'Арбитражный управляющий',
        user: { name: r.createdBy || 'Система' },
        timestamp: r.createdAt || r.updatedAt || new Date().toISOString(),
        details: r.region || undefined
      }))

      pushSafe((inspectionsList as any)?.data || [], (i) => ({
        id: String(i.id || i._id || Math.random()),
        type: 'inspection',
        action: 'created',
        title: i.type ? `Проверка: ${i.type}` : 'Проверка',
        user: { name: (i.inspector && (i.inspector.name || i.inspector.email)) || 'Система' },
        timestamp: i.createdAt || i.updatedAt || new Date().toISOString(),
        details: i.status || undefined
      }))

      pushSafe((measuresList as any)?.data || [], (m) => ({
        id: String(m.id || m._id || Math.random()),
        type: 'inspection',
        action: 'created',
        title: m.penalty || 'Дисциплинарная мера',
        user: { name: (m.issuedBy && (m.issuedBy.name || m.issuedBy.email)) || 'Система' },
        timestamp: m.issuedAt || m.createdAt || m.updatedAt || new Date().toISOString(),
        details: m.reason || undefined
      }))

      // Sort by timestamp desc and return requested limit
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      return items.slice(0, limit)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
      throw error
    }
  }

  async getActivityChart(days: number = 30): Promise<any[]> {
    try {
      const end = new Date()
      const start = new Date()
      start.setDate(end.getDate() - (days - 1))

      const startDateFrom = start.toISOString().split('T')[0]
      const startDateTo = end.toISOString().split('T')[0]

      const withTimeout = <T,>(p: Promise<T>, ms = 6000) => Promise.race<T>([
        p,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms)) as Promise<T>
      ])

      const results = await Promise.allSettled([
        withTimeout(apiService.get<any>('/news', { params: { page: 1, limit: 100 } })),
        withTimeout(apiService.get<any>('/events', { params: { page: 1, limit: 100, startDateFrom, startDateTo } })),
        withTimeout(apiService.get<any>('/documents', { params: { page: 1, limit: 100 } })),
        withTimeout(apiService.get<any>('/users', { params: { page: 1, limit: 100 } }))
      ])

      const safe = (idx: number) => (results[idx].status === 'fulfilled' ? (results[idx] as PromiseFulfilledResult<any>).value : { data: [] })

      const newsRes = safe(0)
      const eventsRes = safe(1)
      const docsRes = safe(2)
      const usersRes = safe(3)

      const toArray = (res: any) => (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [])
      const news = toArray(newsRes)
      const events = toArray(eventsRes)
      const documents = toArray(docsRes)
      const users = toArray(usersRes)

      const byDate = (dateStr: string) => dateStr?.split('T')[0]
      const inRange = (d: string) => {
        const t = new Date(d).getTime()
        return t >= start.getTime() && t <= end.getTime()
      }

      const countsByDay = new Map<string, { news: number; events: number; documents: number; users: number }>()
      // Initialize map with all days
      for (let i = 0; i < days; i++) {
        const dt = new Date(start)
        dt.setDate(start.getDate() + i)
        const key = dt.toISOString().split('T')[0]
        countsByDay.set(key, { news: 0, events: 0, documents: 0, users: 0 })
      }

      const inc = (map: Map<string, any>, d: string, key: keyof { news: number; events: number; documents: number; users: number }) => {
        if (!d) return
        const ds = byDate(d)
        if (!ds || !countsByDay.has(ds)) return
        const row = countsByDay.get(ds)!
        row[key] = (row[key] || 0) + 1
      }

      news.forEach((n: any) => {
        const d = n.publishedAt || n.createdAt || n.updatedAt
        if (d && inRange(d)) inc(countsByDay, d, 'news')
      })
      events.forEach((e: any) => {
        const d = e.createdAt || e.updatedAt || e.startDate
        if (d && inRange(d)) inc(countsByDay, d, 'events')
      })
      documents.forEach((d: any) => {
        const dd = d.uploadedAt || d.createdAt || d.updatedAt
        if (dd && inRange(dd)) inc(countsByDay, dd, 'documents')
      })
      users.forEach((u: any) => {
        const d = u.createdAt || u.updatedAt
        if (d && inRange(d)) inc(countsByDay, d, 'users')
      })

      const result: any[] = []
      countsByDay.forEach((val, key) => {
        result.push({ date: key, ...val })
      })
      // Ensure chronological order
      result.sort((a, b) => (a.date < b.date ? -1 : 1))
      return result
    } catch (error) {
      console.error('Failed to fetch activity chart data:', error)
      throw error
    }
  }

  async getNotifications(): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>('/notifications')
      return response.data
    } catch (error) {
      // Check if it's API unavailable error (expected when server is down)
      if (error instanceof Error && error.name === 'API_UNAVAILABLE') {
        console.info('Using mock data for notifications')
      } else {
        console.error('Failed to fetch notifications:', error)
      }
      // Возвращаем моковые уведомления
      return [
        {
          id: '1',
          type: 'warning',
          title: 'Требуется внимание',
          message: '3 проверки ожидают завершения',
          isRead: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          actionUrl: '/inspections'
        },
        {
          id: '2',
          type: 'info',
          title: 'Новая заявка',
          message: 'Поступила заявка на вступление в СРО',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          actionUrl: '/registry/applications'
        }
      ]
    }
  }

  private generateMockActivityData(days: number): any[] {
    const data = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 20) + 5
      })
    }
    
    return data
  }
}

export const dashboardService = new DashboardServiceImpl()
export default dashboardService
