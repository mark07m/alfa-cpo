import { useState, useEffect, useCallback } from 'react'
import { newsService } from '@/services/admin/news'
import { News, NewsCategory, NewsFilters, PaginationParams, ApiResponse } from '@/types/admin'
import { mockNews, mockNewsCategories } from '@/data/mockData'

interface UseNewsReturn {
  // Данные
  news: News[]
  newsCategories: NewsCategory[]
  newsStats?: { total: number; published: number; draft: number; archived: number; byCategory: Array<{ id: string; name: string; count: number }> }
  selectedNews: News | null
  isLoading: boolean
  error: string | null
  
  // Пагинация
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  
  // Фильтры
  filters: NewsFilters
  
  // Методы для работы с новостями
  fetchNews: (newFilters?: NewsFilters & PaginationParams) => Promise<void>
  fetchNewsStats: () => Promise<void>
  fetchNewsItem: (id: string) => Promise<void>
  createNews: (newsData: Partial<News>) => Promise<{ success: boolean; data?: News; error?: string; message?: string }>
  updateNews: (id: string, newsData: Partial<News>) => Promise<{ success: boolean; data?: News; error?: string; message?: string }>
  deleteNews: (id: string) => Promise<{ success: boolean; error?: string; message?: string }>
  bulkDeleteNews: (ids: string[]) => Promise<{ success: boolean; error?: string; message?: string }>
  updateNewsStatus: (id: string, status: News['status']) => Promise<{ success: boolean; data?: News; error?: string; message?: string }>
  
  // Методы для работы с категориями новостей
  fetchNewsCategories: () => Promise<void>
  createNewsCategory: (categoryData: Partial<NewsCategory>) => Promise<{ success: boolean; data?: NewsCategory; error?: string }>
  updateNewsCategory: (id: string, categoryData: Partial<NewsCategory>) => Promise<{ success: boolean; data?: NewsCategory; error?: string }>
  deleteNewsCategory: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Специальные методы
  getPublicNews: (category?: string) => Promise<News[]>
  searchNews: (query: string) => Promise<News[]>
  getNewsByCategory: (category: string) => Promise<News[]>
  
  // Утилиты
  setFilters: (filters: Partial<NewsFilters>) => void
  setSelectedNews: (news: News | null) => void
  clearError: () => void
}

export function useNews(): UseNewsReturn {
  const [news, setNews] = useState<News[]>([])
  const [newsCategories, setNewsCategories] = useState<NewsCategory[]>([])
  const [newsStats, setNewsStats] = useState<UseNewsReturn['newsStats']>()
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [filters, setFiltersState] = useState<NewsFilters>({})

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchNews = useCallback(async (newFilters?: NewsFilters & PaginationParams) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const currentFilters = newFilters || filters
      const response = await newsService.getNews({
        ...currentFilters,
        page: newFilters?.page || pagination?.page || 1,
        limit: newFilters?.limit || pagination?.limit || 10
      })
      
      console.log('News response:', response) // Debug log
      
      if (response && response.success) {
        setNews(response.data.news)
        setPagination(response.data.pagination)
        setError(null)
      } else if (!response || response.message === 'API unavailable') {
        // API недоступен, используем моковые данные
        console.info('Using mock data for news')
        setNews(mockNews)
        setPagination({ page: 1, limit: 10, total: mockNews.length, totalPages: 1 })
        setError(null)
      } else {
        setError('Не удалось загрузить новости')
      }
    } catch (err: unknown) {
      console.error('Error fetching news:', err)
      if (err instanceof Error && (err.message === 'API_UNAVAILABLE' || err.message === 'API unavailable')) {
        // API недоступен, используем моковые данные
        console.info('Using mock data for news')
        setNews(mockNews)
        setPagination({ page: 1, limit: 10, total: mockNews.length, totalPages: 1 })
        setError(null)
      } else {
        setError('Ошибка при загрузке новостей')
      }
    } finally {
      setIsLoading(false)
    }
  }, [filters, pagination?.page, pagination?.limit])

  const fetchNewsStats = useCallback(async () => {
    try {
      const statsRes = await newsService.getStats()
      if (statsRes && statsRes.success) {
        setNewsStats(statsRes.data)
      }
    } catch (err) {
      // ignore errors; stats are non-critical
    }
  }, [])

  const fetchNewsItem = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await newsService.getNewsItem(id)
      
      if (response && response.success) {
        setSelectedNews(response.data)
        setError(null)
      } else if (response && response.message === 'API unavailable') {
        // API недоступен, используем моковые данные
        console.info('Using mock data for news item')
        setSelectedNews(null)
        setError(null)
      } else {
        setError('Не удалось загрузить новость')
      }
    } catch (err) {
      console.error('Error fetching news item:', err)
      setError('Ошибка при загрузке новости')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createNews = useCallback(async (newsData: Partial<News>) => {
    setError(null)
    
    try {
      const response = await newsService.createNews(newsData)
      
      if (response && response.success) {
        await fetchNews() // Обновляем список
        return { success: true, data: response.data }
      } else {
        return { success: false, error: response?.message || 'Не удалось создать новость', message: response?.message }
      }
    } catch (err) {
      console.error('Error creating news:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Ошибка при создании новости', message: err instanceof Error ? err.message : undefined }
    }
  }, [fetchNews])

  const updateNews = useCallback(async (id: string, newsData: Partial<News>) => {
    setError(null)
    
    try {
      const response = await newsService.updateNews(id, newsData)
      
      if (response && response.success) {
        await fetchNews() // Обновляем список
        if (selectedNews?.id === id) {
          setSelectedNews(response.data)
        }
        return { success: true, data: response.data }
      } else {
        return { success: false, error: response?.message || 'Не удалось обновить новость', message: response?.message }
      }
    } catch (err) {
      console.error('Error updating news:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Ошибка при обновлении новости', message: err instanceof Error ? err.message : undefined }
    }
  }, [fetchNews, selectedNews])

  const deleteNews = useCallback(async (id: string) => {
    setError(null)
    
    try {
      const response = await newsService.deleteNews(id)
      
      if (response && response.success) {
        await fetchNews() // Обновляем список
        if (selectedNews?.id === id) {
          setSelectedNews(null)
        }
        return { success: true }
      } else {
        return { success: false, error: 'Не удалось удалить новость' }
      }
    } catch (err) {
      console.error('Error deleting news:', err)
      return { success: false, error: 'Ошибка при удалении новости' }
    }
  }, [fetchNews, selectedNews])

  const bulkDeleteNews = useCallback(async (ids: string[]) => {
    setError(null)
    
    try {
      const response = await newsService.bulkDeleteNews(ids)
      
      if (response && response.success) {
        await fetchNews() // Обновляем список
        return { success: true }
      } else {
        return { success: false, error: 'Не удалось удалить новости' }
      }
    } catch (err) {
      console.error('Error bulk deleting news:', err)
      return { success: false, error: 'Ошибка при удалении новостей' }
    }
  }, [fetchNews])

  const updateNewsStatus = useCallback(async (id: string, status: News['status']) => {
    setError(null)
    
    try {
      const response = await newsService.updateNewsStatus(id, status)
      
      if (response && response.success) {
        await fetchNews() // Обновляем список
        if (selectedNews?.id === id) {
          setSelectedNews(response.data)
        }
        return { success: true, data: response.data }
      } else {
        return { success: false, error: response?.message || 'Не удалось обновить статус новости', message: response?.message }
      }
    } catch (err) {
      console.error('Error updating news status:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Ошибка при обновлении статуса новости', message: err instanceof Error ? err.message : undefined }
    }
  }, [fetchNews, selectedNews])

  const fetchNewsCategories = useCallback(async () => {
    try {
      const response = await newsService.getNewsCategories()
      
      if (response && response.success) {
        setNewsCategories(response.data)
      } else if (response && response.message === 'API unavailable') {
        // API недоступен, используем моковые данные
        console.info('Using mock data for news categories')
        setNewsCategories(mockNewsCategories)
      }
    } catch (err) {
      console.error('Error fetching news categories:', err)
      // Используем моковые данные при ошибке
      setNewsCategories(mockNewsCategories)
    }
  }, [])

  const createNewsCategory = useCallback(async (categoryData: Partial<NewsCategory>) => {
    setError(null)
    
    try {
      const response = await newsService.createNewsCategory(categoryData)
      
      if (response && response.success) {
        await fetchNewsCategories() // Обновляем список
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось создать категорию новостей' }
      }
    } catch (err) {
      console.error('Error creating news category:', err)
      return { success: false, error: 'Ошибка при создании категории новостей' }
    }
  }, [fetchNewsCategories])

  const updateNewsCategory = useCallback(async (id: string, categoryData: Partial<NewsCategory>) => {
    setError(null)
    
    try {
      const response = await newsService.updateNewsCategory(id, categoryData)
      
      if (response && response.success) {
        await fetchNewsCategories() // Обновляем список
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось обновить категорию новостей' }
      }
    } catch (err) {
      console.error('Error updating news category:', err)
      return { success: false, error: 'Ошибка при обновлении категории новостей' }
    }
  }, [fetchNewsCategories])

  const deleteNewsCategory = useCallback(async (id: string) => {
    setError(null)
    
    try {
      const response = await newsService.deleteNewsCategory(id)
      
      if (response && response.success) {
        await fetchNewsCategories() // Обновляем список
        return { success: true }
      } else {
        return { success: false, error: 'Не удалось удалить категорию новостей' }
      }
    } catch (err) {
      console.error('Error deleting news category:', err)
      return { success: false, error: 'Ошибка при удалении категории новостей' }
    }
  }, [fetchNewsCategories])

  const getPublicNews = useCallback(async (category?: string) => {
    try {
      const response = await newsService.getPublicNews(category)
      return response && response.success ? response.data : []
    } catch (err) {
      console.error('Error fetching public news:', err)
      return []
    }
  }, [])

  const searchNews = useCallback(async (query: string) => {
    try {
      const response = await newsService.searchNews(query)
      return response && response.success ? response.data : []
    } catch (err) {
      console.error('Error searching news:', err)
      return []
    }
  }, [])

  const getNewsByCategory = useCallback(async (category: string) => {
    try {
      const response = await newsService.getNewsByCategory(category)
      return response && response.success ? response.data : []
    } catch (err) {
      console.error('Error fetching news by category:', err)
      return []
    }
  }, [])

  const setFilters = useCallback((newFilters: Partial<NewsFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Загружаем данные при монтировании
  useEffect(() => {
    fetchNews()
    fetchNewsCategories()
  }, []) // Убираем зависимости, чтобы избежать бесконечных циклов

  return {
    // Данные
    news,
    newsCategories,
    newsStats,
    selectedNews,
    
    // Состояние загрузки
    isLoading,
    error,
    
    // Пагинация
    pagination,
    
    // Фильтры
    filters,
    
    // Методы для работы с новостями
    fetchNews,
    fetchNewsStats,
    fetchNewsItem,
    createNews,
    updateNews,
    deleteNews,
    bulkDeleteNews,
    updateNewsStatus,
    
    // Методы для работы с категориями новостей
    fetchNewsCategories,
    createNewsCategory,
    updateNewsCategory,
    deleteNewsCategory,
    
    // Специальные методы
    getPublicNews,
    searchNews,
    getNewsByCategory,
    
    // Утилиты
    setFilters,
    setSelectedNews,
    clearError
  }
}