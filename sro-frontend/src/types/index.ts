// Базовые типы для UI компонентов
export interface BaseComponent {
  className?: string;
  children?: React.ReactNode;
}

// Типы для навигации
export interface NavigationItem {
  name: string;
  href: string;
  children?: NavigationItem[];
  external?: boolean;
}

// Типы для арбитражных управляющих
export interface ArbitraryManager {
  id: string;
  fullName: string;
  inn: string;
  registryNumber: string;
  phone: string;
  email: string;
  region?: string;
  status: 'active' | 'excluded' | 'suspended';
  joinDate: string;
  excludeDate?: string;
  excludeReason?: string;
  birthDate?: string;
  birthPlace?: string;
  registrationDate?: string;
  decisionNumber?: string;
  education?: string;
  workExperience?: string;
  internship?: string;
  examCertificate?: string;
  disqualification?: string;
  criminalRecord?: string;
  insurance?: string;
  compensationFundContribution?: string;
  penalties?: string;
  complianceStatus?: string;
  lastInspection?: string;
  postalAddress?: string;
}

// Типы для новостей
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  imageUrl?: string;
}

// Типы для документов
export interface Document {
  id: string;
  title: string;
  description?: string;
  category: 'regulatory' | 'rules' | 'reports' | 'other';
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  updatedAt: string;
  version?: string;
}

// Типы для мероприятий
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  type: 'seminar' | 'conference' | 'training' | 'meeting';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  maxParticipants?: number;
  currentParticipants?: number;
  registrationRequired: boolean;
  materials?: Document[];
}

// Типы для компенсационного фонда
export interface CompensationFund {
  id: string;
  amount: number;
  currency: string;
  lastUpdated: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    bik: string;
    correspondentAccount: string;
  };
  documents: Document[];
}

// Типы для проверок
export interface Inspection {
  id: string;
  managerId: string;
  managerName: string;
  type: 'planned' | 'unplanned';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  inspector: string;
  result?: 'passed' | 'failed' | 'needs_improvement';
  notes?: string;
  documents: Document[];
}

// Типы для дисциплинарных мер
export interface DisciplinaryMeasure {
  id: string;
  managerId: string;
  managerName: string;
  type: 'warning' | 'reprimand' | 'exclusion' | 'other';
  reason: string;
  date: string;
  decisionNumber: string;
  status: 'active' | 'cancelled';
  documents: Document[];
}

// Типы для API ответов
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message?: string;
}

// Типы для форм
export interface SearchFormData {
  query: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Типы для настроек сайта
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  workingHours: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    telegram?: string;
  };
  seoSettings: {
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string;
  };
}

// Типы для пользователей админки
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  lastLogin?: string;
  createdAt: string;
  isActive: boolean;
}

// Типы для статистики
export interface SiteStats {
  totalManagers: number;
  activeManagers: number;
  excludedManagers: number;
  totalNews: number;
  totalDocuments: number;
  totalEvents: number;
  lastUpdated: string;
}

// Утилитарные типы
export type Status = 'loading' | 'success' | 'error' | 'idle';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface FilterConfig {
  key: string;
  value: any;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
}
