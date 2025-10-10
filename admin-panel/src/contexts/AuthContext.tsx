'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, ApiUser, AuthState, LoginCredentials, UserRole, Permission } from '@/types/admin'
import { apiService } from '@/services/admin/api'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to get permissions based on role
function getPermissionsForRole(role: UserRole): string[] {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return Object.values(Permission) as string[]
    case UserRole.ADMIN:
      return [
        Permission.USERS_READ, Permission.USERS_CREATE, Permission.USERS_UPDATE,
        Permission.NEWS_READ, Permission.NEWS_CREATE, Permission.NEWS_UPDATE, Permission.NEWS_DELETE,
        Permission.NEWS_CATEGORY_CREATE, Permission.NEWS_CATEGORY_UPDATE, Permission.NEWS_CATEGORY_DELETE,
        Permission.DOCUMENTS_READ, Permission.DOCUMENTS_CREATE, Permission.DOCUMENTS_UPDATE, Permission.DOCUMENTS_DELETE,
        Permission.REGISTRY_READ, Permission.REGISTRY_CREATE, Permission.REGISTRY_UPDATE, Permission.REGISTRY_DELETE,
        Permission.EVENTS_READ, Permission.EVENTS_CREATE, Permission.EVENTS_UPDATE, Permission.EVENTS_DELETE,
        Permission.SETTINGS_READ, Permission.SETTINGS_UPDATE,
        Permission.FILE_READ, Permission.FILE_UPLOAD, Permission.FILE_UPDATE, Permission.FILE_DELETE
      ]
    case UserRole.MODERATOR:
      return [
        Permission.NEWS_READ, Permission.NEWS_CREATE, Permission.NEWS_UPDATE,
        Permission.NEWS_CATEGORY_CREATE, Permission.NEWS_CATEGORY_UPDATE,
        Permission.DOCUMENTS_READ, Permission.DOCUMENTS_CREATE, Permission.DOCUMENTS_UPDATE,
        Permission.REGISTRY_READ, Permission.REGISTRY_UPDATE,
        Permission.EVENTS_READ, Permission.EVENTS_CREATE, Permission.EVENTS_UPDATE,
        Permission.FILE_READ, Permission.FILE_UPLOAD
      ]
    case UserRole.EDITOR:
      return [
        Permission.NEWS_READ, Permission.NEWS_CREATE, Permission.NEWS_UPDATE,
        Permission.DOCUMENTS_READ, Permission.DOCUMENTS_CREATE, Permission.DOCUMENTS_UPDATE,
        Permission.REGISTRY_READ,
        Permission.EVENTS_READ, Permission.EVENTS_CREATE, Permission.EVENTS_UPDATE,
        Permission.FILE_READ, Permission.FILE_UPLOAD
      ]
    default:
      return []
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
  const autoLoginEnabled = process.env.NEXT_PUBLIC_AUTO_LOGIN === 'true'
  const autoLoginEmail = process.env.NEXT_PUBLIC_AUTO_LOGIN_EMAIL || ''
  const autoLoginPassword = process.env.NEXT_PUBLIC_AUTO_LOGIN_PASSWORD || ''
  
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
    
    // Проверяем, есть ли токен в localStorage
    const token = localStorage.getItem('admin_token')
    const refreshToken = localStorage.getItem('admin_refresh_token')
    
    console.log('🔍 AuthContext: Token from localStorage:', token ? token.substring(0, 20) + '...' : 'NOT FOUND')
    console.log('🔍 AuthContext: RefreshToken from localStorage:', refreshToken ? refreshToken.substring(0, 20) + '...' : 'NOT FOUND')
    
    if (!token) {
      // Нет токена - показываем форму входа
      console.log('🔍 AuthContext: No token found, returning unauthenticated state')
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
    // Проверяем токен только если мы в состоянии загрузки
    if (authState.isLoading && typeof window !== 'undefined') {
      checkAuthStatus()
    }
  }, [authState.isLoading])

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
          permissions: apiUser.permissions || getPermissionsForRole(apiUser.role), // Устанавливаем разрешения на основе роли
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
      } else {
        clearAuthState()
      }
    } catch (error: any) {
      console.error('Auth check failed:', error)
      clearAuthState()
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
      
      // Пытаемся войти через API
      console.log('🔐 Attempting API login with:', credentials.email);
      const response = await apiService.login(credentials)
      console.log('🔐 API login response:', response);
      
      if (response.success && response.data.user) {
        // Преобразуем _id в id для совместимости с frontend
        const apiUser = response.data.user as unknown as ApiUser
        const normalizedUser: User = {
          id: apiUser._id,
          email: apiUser.email,
          name: apiUser.name,
          role: apiUser.role,
          permissions: apiUser.permissions || getPermissionsForRole(apiUser.role), // Устанавливаем разрешения на основе роли
          isActive: apiUser.isActive,
          createdAt: apiUser.createdAt,
          updatedAt: apiUser.updatedAt
        }
        // Сохраняем пользователя и токены в localStorage
        localStorage.setItem('admin_user', JSON.stringify(normalizedUser))
        localStorage.setItem('admin_token', response.data.token || '')
        localStorage.setItem('admin_refresh_token', response.data.refreshToken || '')
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
      console.error('🔐 API login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  // (Опционально) автологин только при явном включении через env
  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('admin_token')
    console.log('🔍 AuthContext useEffect - token:', token ? token.substring(0, 20) + '...' : 'NOT FOUND')
    if (!token && autoLoginEnabled && autoLoginEmail && autoLoginPassword) {
      console.log('🔍 Auto-login enabled via env, attempting login for', autoLoginEmail)
      login({ email: autoLoginEmail, password: autoLoginPassword }).catch(err => {
        console.error('Auto-login failed:', err)
      })
    }
  }, [])

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
        // Преобразуем _id в id для совместимости с frontend
        const apiUser = response.data as ApiUser
        const normalizedUser: User = {
          id: apiUser._id,
          email: apiUser.email,
          name: apiUser.name,
          role: apiUser.role,
          permissions: apiUser.permissions || getPermissionsForRole(apiUser.role), // Устанавливаем разрешения на основе роли
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