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
  category: NewsCategory;
  tags?: string[];
  featured?: boolean;
  imageUrl?: string;
  cover?: string;
  views?: number;
  status: 'published' | 'draft' | 'archived';
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  order: number;
}

export interface NewsFilter {
  query?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  featured?: boolean;
  status?: string;
  tags?: string[];
}

export interface NewsListProps {
  news: NewsItem[];
  loading?: boolean;
  error?: string;
  onNewsClick?: (news: NewsItem) => void;
  showFeatured?: boolean;
  showCategories?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export interface NewsDetailProps {
  news: NewsItem;
  relatedNews?: NewsItem[];
  onBack?: () => void;
  onShare?: (news: NewsItem) => void;
  onPrint?: (news: NewsItem) => void;
}

export interface NewsFilterProps {
  filters: NewsFilter;
  categories: NewsCategory[];
  onFiltersChange: (filters: NewsFilter) => void;
  onReset: () => void;
  loading?: boolean;
}

// Типы для документов
export interface Document {
  id: string;
  title: string;
  description?: string;
  category: 'regulatory' | 'rules' | 'reports' | 'compensation-fund' | 'labor-activity' | 'accreditation' | 'other';
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  updatedAt: string;
  version?: string;
}

// Расширенные типы для системы документов
export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  documents: Document[];
  order: number;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  order: number;
  parentId?: string;
}

export interface DocumentRule {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  size: string;
  sections: DocumentSection[];
  fileUrl: string;
  version: string;
}

export interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
  showDownload?: boolean;
  showPrint?: boolean;
}

export interface DocumentSearchFilters {
  query: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  fileType?: string;
}

// Типы для мероприятий
export interface Event {
  id: string;
  title: string;
  description: string;
  content?: string;
  startDate: string;
  endDate?: string;
  location: string;
  type: EventType;
  status: EventStatus;
  maxParticipants?: number;
  currentParticipants?: number;
  registrationRequired: boolean;
  registrationDeadline?: string;
  materials?: Document[];
  imageUrl?: string;
  cover?: string;
  featured?: boolean;
  tags?: string[];
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  price?: number;
  currency?: string;
  requirements?: string;
  agenda?: EventAgendaItem[];
}

export interface EventType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  order: number;
}

export interface EventStatus {
  id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
}

export interface EventAgendaItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  speaker?: string;
  duration?: number;
}

export interface EventFilter {
  query?: string;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  featured?: boolean;
  registrationRequired?: boolean;
  tags?: string[];
}

export interface EventsListProps {
  events: Event[];
  loading?: boolean;
  error?: string;
  onEventClick?: (event: Event) => void;
  showFeatured?: boolean;
  showCalendar?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export interface EventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
  variant?: 'default' | 'compact' | 'featured';
  showRegistration?: boolean;
  onRegister?: (event: Event) => void;
}

export interface EventDetailProps {
  event: Event;
  relatedEvents?: Event[];
  onBack?: () => void;
  onShare?: (event: Event) => void;
  onRegister?: (event: Event) => void;
  onAddToCalendar?: (event: Event) => void;
}

export interface EventCalendarProps {
  events: Event[];
  currentDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
  view?: 'month' | 'week' | 'day';
  onViewChange?: (view: 'month' | 'week' | 'day') => void;
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
  value: string | number | boolean | Date;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
}
