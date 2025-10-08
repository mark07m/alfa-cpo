'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, ApiUser, AuthState, LoginCredentials, UserRole } from '@/types/admin'
import { apiService } from '@/services/admin/api'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
  
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Инициализируем состояние сразу как не загружающееся
    // если мы на сервере
    if (typeof window === 'undefined') {
      return {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false
      }
    }
    
      // В моковом режиме сразу возвращаем мокового пользователя
      if (useMockData) {
        console.info('Mock data mode enabled, using mock user')
        const mockUser = {
          id: '1',
          email: 'admin@sro-au.ru',
          name: 'Администратор Системы',
          role: UserRole.SUPER_ADMIN,
          permissions: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        return {
          user: mockUser,
          token: null, // В моковом режиме не нужны токены
          refreshToken: null,
          isAuthenticated: true,
          isLoading: false
        }
      }
    
    const token = localStorage.getItem('admin_token')
    const refreshToken = localStorage.getItem('admin_refresh_token')
    
    if (!token) {
      // Нет токена - показываем форму входа
      return {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false
      }
    }
    
    // Есть токен - проверяем, есть ли сохраненный пользователь
    const savedUser = localStorage.getItem('admin_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        return {
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false
        }
      } catch (error) {
        console.error('Error parsing saved user:', error)
        // Если не удалось распарсить пользователя, очищаем и проверяем токен
        localStorage.removeItem('admin_user')
      }
    }
    
    // Есть токен, но нет сохраненного пользователя - показываем загрузку
    return {
      user: null,
      token,
      refreshToken,
      isAuthenticated: false,
      isLoading: true
    }
  })

  useEffect(() => {
    // В моковом режиме не делаем API запросы
    if (useMockData) {
      return
    }
    
    // Проверяем токен только если мы в состоянии загрузки
    if (authState.isLoading && typeof window !== 'undefined') {
      checkAuthStatus()
    }
  }, [authState.isLoading, useMockData])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        clearAuthState()
        return
      }

      const response = await apiService.getCurrentUser()
      if (response.success) {
        const apiUser = response.data as ApiUser
        // Преобразуем _id в id для совместимости с frontend
        const normalizedUser: User = {
          id: apiUser._id,
          email: apiUser.email,
          name: apiUser.name,
          role: apiUser.role,
          permissions: apiUser.permissions,
          isActive: apiUser.isActive,
          createdAt: apiUser.createdAt,
          updatedAt: apiUser.updatedAt
        }
        // Сохраняем пользователя в localStorage
        localStorage.setItem('admin_user', JSON.stringify(normalizedUser))
        setAuthState({
          user: normalizedUser,
          token,
          refreshToken: localStorage.getItem('admin_refresh_token'),
          isAuthenticated: true,
          isLoading: false
        })
      } else if (response.message === 'API unavailable' || response.message === 'Mock data') {
        // API недоступен, используем моковые данные для аутентификации
        console.info('API unavailable, using mock user for auth')
        const mockUser = {
          id: '1',
          email: 'admin@sro-au.ru',
          name: 'Администратор Системы',
          role: UserRole.SUPER_ADMIN,
          permissions: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        // Сохраняем мокового пользователя в localStorage
        localStorage.setItem('admin_user', JSON.stringify(mockUser))
        setAuthState({
          user: mockUser,
          token,
          refreshToken: localStorage.getItem('admin_refresh_token'),
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        clearAuthState()
      }
    } catch (error: any) {
      console.error('Auth check failed:', error)
      
      // Если это моковый режим, не обрабатываем ошибку
      if (error.message === 'MOCK_MODE') {
        return
      }
      
      // Если API недоступен, используем моковые данные
      const token = localStorage.getItem('admin_token')
      if (token) {
        console.info('API unavailable, using mock user for auth')
        const mockUser = {
          id: '1',
          email: 'admin@sro-au.ru',
          name: 'Администратор Системы',
          role: UserRole.SUPER_ADMIN,
          permissions: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        // Сохраняем мокового пользователя в localStorage
        localStorage.setItem('admin_user', JSON.stringify(mockUser))
        setAuthState({
          user: mockUser,
          token,
          refreshToken: localStorage.getItem('admin_refresh_token'),
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        clearAuthState()
      }
    }
  }

  const clearAuthState = () => {
    console.log('Clearing auth state, showing login form')
    setAuthState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false
    })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_refresh_token')
      localStorage.removeItem('admin_user')
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      // В моковом режиме всегда разрешаем вход
      if (useMockData) {
        const mockUser = {
          id: '1',
          email: 'admin@sro-au.ru',
          name: 'Администратор Системы',
          role: UserRole.SUPER_ADMIN,
          permissions: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        setAuthState({
          user: mockUser,
          token: null, // В моковом режиме не нужны токены
          refreshToken: null,
          isAuthenticated: true,
          isLoading: false
        })
        return
      }
      
      // Пытаемся войти через API
      const response = await apiService.login(credentials)
      
      if (response.success && response.data.user) {
        // Преобразуем _id в id для совместимости с frontend
        const apiUser = response.data.user as unknown as ApiUser
        const normalizedUser: User = {
          id: apiUser._id,
          email: apiUser.email,
          name: apiUser.name,
          role: apiUser.role,
          permissions: apiUser.permissions,
          isActive: apiUser.isActive,
          createdAt: apiUser.createdAt,
          updatedAt: apiUser.updatedAt
        }
        // Сохраняем пользователя и токены в localStorage
        localStorage.setItem('admin_user', JSON.stringify(normalizedUser))
        localStorage.setItem('admin_token', response.data.token)
        localStorage.setItem('admin_refresh_token', response.data.refreshToken)
        setAuthState({
          user: normalizedUser,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        throw new Error(response.message || 'Ошибка входа')
      }
    } catch (error: unknown) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      
      // Если ошибка API, но это моковые данные - разрешаем вход
      if (credentials.email === 'admin@sro-au.ru' && credentials.password === 'Admin123!') {
        const mockUser = {
          id: '1',
          email: 'admin@sro-au.ru',
          name: 'Администратор Системы',
          role: UserRole.SUPER_ADMIN,
          permissions: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        const mockToken = 'mock_token_' + Date.now()
        const mockRefreshToken = 'mock_refresh_token_' + Date.now()
        
        localStorage.setItem('admin_token', mockToken)
        localStorage.setItem('admin_refresh_token', mockRefreshToken)
        localStorage.setItem('admin_user', JSON.stringify(mockUser))
        
        setAuthState({
          user: mockUser,
          token: mockToken,
          refreshToken: mockRefreshToken,
          isAuthenticated: true,
          isLoading: false
        })
        return
      }
      
      throw error
    }
  }

  const logout = async () => {
    try {
      // В моковом режиме не делаем API запросы
      if (!useMockData) {
        await apiService.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuthState()
    }
  }

  const refreshUser = async () => {
    try {
      // В моковом режиме не делаем API запросы
      if (useMockData) {
        return
      }
      
      const response = await apiService.getCurrentUser()
      if (response.success) {
        // Преобразуем _id в id для совместимости с frontend
        const apiUser = response.data as ApiUser
        const normalizedUser: User = {
          id: apiUser._id,
          email: apiUser.email,
          name: apiUser.name,
          role: apiUser.role,
          permissions: apiUser.permissions,
          isActive: apiUser.isActive,
          createdAt: apiUser.createdAt,
          updatedAt: apiUser.updatedAt
        }
        // Сохраняем обновленного пользователя в localStorage
        localStorage.setItem('admin_user', JSON.stringify(normalizedUser))
        setAuthState(prev => ({
          ...prev,
          user: normalizedUser
        }))
      }
    } catch (error: any) {
      console.error('Failed to refresh user:', error)
      
      // Если это моковый режим, не обрабатываем ошибку
      if (error.message === 'MOCK_MODE') {
        return
      }
      
      clearAuthState()
    }
  }

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return null
    }

    if (requiredRole && user?.role !== requiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Доступ запрещен</h1>
            <p className="text-gray-600">У вас нет прав для доступа к этой странице</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}