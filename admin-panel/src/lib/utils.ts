import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatCurrency(amount: number, currency: string = 'RUB'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    super_admin: 'Супер администратор',
    admin: 'Администратор',
    moderator: 'Модератор',
    editor: 'Редактор'
  }
  return roleMap[role] || role
}

export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    active: 'text-green-600 bg-green-100',
    published: 'text-green-600 bg-green-100',
    draft: 'text-yellow-600 bg-yellow-100',
    archived: 'text-gray-600 bg-gray-100',
    suspended: 'text-orange-600 bg-orange-100',
    excluded: 'text-red-600 bg-red-100',
    cancelled: 'text-red-600 bg-red-100',
    completed: 'text-blue-600 bg-blue-100',
    in_progress: 'text-blue-600 bg-blue-100',
    scheduled: 'text-purple-600 bg-purple-100'
  }
  return statusMap[status] || 'text-gray-600 bg-gray-100'
}

export function getStatusDisplayName(status: string): string {
  const statusMap: Record<string, string> = {
    active: 'Активен',
    published: 'Опубликовано',
    draft: 'Черновик',
    archived: 'Архив',
    suspended: 'Приостановлен',
    excluded: 'Исключен',
    cancelled: 'Отменено',
    completed: 'Завершено',
    in_progress: 'В процессе',
    scheduled: 'Запланировано'
  }
  return statusMap[status] || status
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function validateINN(inn: string): boolean {
  const innRegex = /^\d{10}$|^\d{12}$/
  return innRegex.test(inn)
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return Promise.resolve()
  }
}

export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response: { data: { message?: string; error?: string } } }).response
    if (response?.data?.message) return response.data.message
    if (response?.data?.error) return response.data.error
  }
  return 'Произошла неизвестная ошибка'
}

// Build absolute URLs for files served from backend static '/uploads'
export function getBackendBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
  return apiUrl.replace(/\/api\/?$/, '')
}

export function toAbsoluteFileUrl(path?: string): string {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  if (path.startsWith('/uploads/')) return `${getBackendBaseUrl()}${path}`
  return path
}
