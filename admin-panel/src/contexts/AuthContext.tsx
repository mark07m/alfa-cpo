'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthState, LoginCredentials, UserRole } from '@/types/admin'
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
    
    const token = localStorage.getItem('admin_token')
    const refreshToken = localStorage.getItem('admin_refresh_token')
    
    if (!token) {
      // Нет токена - автоматически входим в демо режим
      console.info('No token found, entering demo mode')
      const mockUser = {
        id: '1',
        email: 'admin@sro-au.ru',
        firstName: 'Администратор',
        lastName: 'Системы',
        role: 'SUPER_ADMIN' as UserRole,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const mockToken = 'demo_token_' + Date.now()
      const mockRefreshToken = 'demo_refresh_token_' + Date.now()
      
      // Сохраняем в localStorage
      localStorage.setItem('admin_token', mockToken)
      localStorage.setItem('admin_refresh_token', mockRefreshToken)
      localStorage.setItem('admin_user', JSON.stringify(mockUser))
      
      return {
        user: mockUser,
        token: mockToken,
        refreshToken: mockRefreshToken,
        isAuthenticated: true,
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
    // Проверяем токен только если мы в состоянии загрузки
    if (authState.isLoading && typeof window !== 'undefined') {
      checkAuthStatus()
    }
  }, [authState.isLoading])

  // Автоматическая моковая аутентификация на клиенте
  useEffect(() => {
    if (typeof window !== 'undefined' && !authState.isAuthenticated && !authState.isLoading) {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        console.info('No token found, entering demo mode')
        const mockUser = {
          id: '1',
          email: 'admin@sro-au.ru',
          firstName: 'Администратор',
          lastName: 'Системы',
          role: 'SUPER_ADMIN' as UserRole,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        const mockToken = 'demo_token_' + Date.now()
        const mockRefreshToken = 'demo_refresh_token_' + Date.now()
        
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
      }
    }
  }, [authState.isAuthenticated, authState.isLoading])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        clearAuthState()
        return
      }

      const response = await apiService.getCurrentUser()
      if (response.success) {
        const user = response.data
        // Сохраняем пользователя в localStorage
        localStorage.setItem('admin_user', JSON.stringify(user))
        setAuthState({
          user,
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
          firstName: 'Администратор',
          lastName: 'Системы',
          role: 'SUPER_ADMIN' as UserRole,
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
    } catch (error) {
      console.error('Auth check failed:', error)
      // Если API недоступен, используем моковые данные
      const token = localStorage.getItem('admin_token')
      if (token) {
        console.info('API unavailable, using mock user for auth')
        const mockUser = {
          id: '1',
          email: 'admin@sro-au.ru',
          firstName: 'Администратор',
          lastName: 'Системы',
          role: 'SUPER_ADMIN' as UserRole,
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
      
      // Проверяем моковые данные для входа
      if (credentials.email === 'admin@sro-au.ru' && credentials.password === 'Admin123!') {
        const mockUser = {
          id: '1',
          email: 'admin@sro-au.ru',
          firstName: 'Администратор',
          lastName: 'Системы',
          role: 'SUPER_ADMIN' as UserRole,
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
      
      // Пытаемся войти через API
      const response = await apiService.login(credentials)
      
      if (response.success) {
        // Сохраняем пользователя в localStorage
        localStorage.setItem('admin_user', JSON.stringify(response.data.user))
        setAuthState({
          user: response.data.user,
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
          firstName: 'Администратор',
          lastName: 'Системы',
          role: 'SUPER_ADMIN' as UserRole,
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
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuthState()
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser()
      if (response.success) {
        // Сохраняем обновленного пользователя в localStorage
        localStorage.setItem('admin_user', JSON.stringify(response.data))
        setAuthState(prev => ({
          ...prev,
          user: response.data
        }))
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
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