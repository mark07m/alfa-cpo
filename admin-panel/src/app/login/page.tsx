'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      await login(formData)
      router.push('/')
    } catch (error: unknown) {
      setErrors({
        general: (error instanceof Error ? error.message : 'Ошибка входа. Проверьте данные и попробуйте снова.')
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-white">А</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Админ панель</h1>
            <p className="text-xl text-blue-100 mb-2">СРО арбитражных управляющих</p>
            <p className="text-blue-200">Система управления контентом и реестром</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span className="text-blue-100">Управление новостями и событиями</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span className="text-blue-100">Контроль реестра арбитражных управляющих</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span className="text-blue-100">Мониторинг проверок и дисциплинарных мер</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">А</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Вход в админ панель</h2>
            <p className="text-gray-600">СРО арбитражных управляющих</p>
            
            {/* Mobile demo credentials info */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-blue-900">Данные для входа</h3>
              </div>
              <div className="text-xs text-blue-800 space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="font-mono bg-blue-100 px-1 py-0.5 rounded text-xs">aaadmin@sro-au.ru</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Пароль:</span>
                  <span className="font-mono bg-blue-100 px-1 py-0.5 rounded text-xs">Admin123!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block text-center">
            <h2 className="text-3xl font-bold text-gray-900">Добро пожаловать</h2>
            <p className="mt-2 text-gray-600">Войдите в свою учетную запись</p>
            
            {/* Demo credentials info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-blue-900">Данные для входа</h3>
              </div>
              <div className="text-sm text-blue-800 space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="font-mono bg-blue-100 px-2 py-1 rounded">aaadmin@sro-au.ru</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Пароль:</span>
                  <span className="font-mono bg-blue-100 px-2 py-1 rounded">Admin123!</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-red-500 mr-3">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-sm text-red-700">{errors.general}</div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email адрес
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, email: 'aaadmin@sro-au.ru' }))}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Заполнить
                    </button>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="aaadmin@sro-au.ru"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Пароль
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, password: 'Admin123!' }))}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Заполнить
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Введите пароль"
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.password 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'aaadmin@sro-au.ru', password: 'Admin123!' })}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Заполнить все поля
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Вход...
                    </div>
                  ) : (
                    'Войти'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Только для авторизованных администраторов
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
