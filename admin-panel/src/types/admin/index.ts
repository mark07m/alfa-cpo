// Типы для админ панели СРО арбитражных управляющих

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  EDITOR = 'editor'
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Типы для контента
export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: NewsCategory;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: User;
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsFilters {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  content?: string;
  startDate: string;
  endDate?: string;
  location: string;
  type?: EventType;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  maxParticipants?: number;
  currentParticipants: number;
  registrationRequired: boolean;
  registrationDeadline?: string;
  materials?: Document[];
  imageUrl?: string;
  cover?: string;
  featured: boolean;
  tags: string[];
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  price?: number;
  currency: string;
  requirements?: string;
  agenda: EventAgendaItem[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export interface EventType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventAgendaItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  speaker?: string;
  duration?: number;
}

export interface EventParticipant {
  id: string;
  eventId: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  position?: string;
  registrationDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

export interface EventFilters {
  search?: string;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  featured?: boolean;
  registrationRequired?: boolean;
  location?: string;
  organizer?: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  fileUrl: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  uploadedAt: string;
  version?: string;
  isPublic: boolean;
  downloadCount: number;
  tags: string[];
  metadata?: DocumentMetadata;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export interface DocumentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentMetadata {
  author?: string;
  publisher?: string;
  language?: string;
  pages?: number;
}

export interface DocumentFilters {
  search?: string;
  category?: string;
  fileType?: string;
  isPublic?: boolean;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  author?: string;
  minSize?: number;
  maxSize?: number;
}

export interface DocumentUpload {
  file: File;
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  isPublic?: boolean;
  metadata?: DocumentMetadata;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: User;
  changeLog?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  template: PageTemplate;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  isHomePage: boolean;
  showInMenu: boolean;
  menuOrder: number;
  parentId?: string;
  children?: Page[];
  imageUrl?: string;
  featuredImage?: string;
  customFields?: Record<string, unknown>;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}

export enum PageTemplate {
  DEFAULT = 'default',
  HOME = 'home',
  ABOUT = 'about',
  CONTACTS = 'contacts',
  DOCUMENTS = 'documents',
  REGISTRY = 'registry',
  COMPENSATION_FUND = 'compensation_fund',
  ACCREDITATION = 'accreditation',
  LABOR_ACTIVITY = 'labor_activity',
  CONTROL = 'control',
  NEWS = 'news',
  EVENTS = 'events',
  CUSTOM = 'custom'
}

export interface PageFilters {
  search?: string;
  status?: string;
  template?: string;
  isHomePage?: boolean;
  showInMenu?: boolean;
  parentId?: string;
  dateFrom?: string;
  dateTo?: string;
  author?: string;
}

export interface PageFormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  template: PageTemplate;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  isHomePage: boolean;
  showInMenu: boolean;
  menuOrder: number;
  parentId?: string;
  imageUrl?: string;
  featuredImage?: string;
  customFields?: Record<string, unknown>;
  publishedAt?: string;
}

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
  parentId?: string;
  isVisible: boolean;
  pageId?: string;
  isExternal: boolean;
  children?: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuFormData {
  title: string;
  url: string;
  icon?: string;
  order: number;
  parentId?: string;
  isVisible: boolean;
  pageId?: string;
  isExternal: boolean;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoUrl?: string;
  faviconUrl?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  footerText?: string;
  copyrightText?: string;
  createdAt: string;
  updatedAt: string;
}

// Типы для реестра
export interface Arbitrator {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  inn: string;
  registryNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  status: 'active' | 'suspended' | 'excluded';
  joinedAt: string;
  excludedAt?: string;
  exclusionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Типы для контроля
export interface Inspection {
  id: string;
  arbitratorId: string;
  arbitrator: Arbitrator;
  type: 'planned' | 'unplanned';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  inspector: User;
  description: string;
  findings?: string;
  recommendations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DisciplinaryMeasure {
  id: string;
  arbitratorId: string;
  arbitrator: Arbitrator;
  type: 'warning' | 'reprimand' | 'exclusion';
  reason: string;
  description: string;
  issuedAt: string;
  issuedBy: User;
  status: 'active' | 'appealed' | 'cancelled';
  appealDeadline?: string;
  createdAt: string;
  updatedAt: string;
}


// Типы для статистики
export interface DashboardStats {
  newsCount: number;
  newsChange: { value: string; type: 'increase' | 'decrease' | 'neutral' };
  eventsCount: number;
  eventsChange: { value: string; type: 'increase' | 'decrease' | 'neutral' };
  documentsCount: number;
  documentsChange: { value: string; type: 'increase' | 'decrease' | 'neutral' };
  usersCount: number;
  usersChange: { value: string; type: 'increase' | 'decrease' | 'neutral' };
  inspectionsCount: number;
  disciplinaryMeasuresCount: number;
  compensationFundCount: number;
}

export interface ActivityItem {
  id: string;
  type: 'news' | 'event' | 'document' | 'arbitrator' | 'inspection';
  action: 'created' | 'updated' | 'deleted' | 'published';
  title: string;
  user: { name: string; id?: string };
  timestamp: string;
  details?: string;
}

// Типы для форм
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'file' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: any;
}

// Типы для таблиц
export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationParams;
  onSort?: (key: keyof T, order: 'asc' | 'desc') => void;
  onFilter?: (key: keyof T, value: any) => void;
  onRowClick?: (row: T) => void;
}

// Типы для уведомлений
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Типы для API ответов
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationResponse<T = any> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Типы для логирования
export interface AuditLog {
  id: string;
  userId: string;
  user: User;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}
