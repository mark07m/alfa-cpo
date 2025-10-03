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

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isOnline: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  organizer: User;
  imageUrl?: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  category: DocumentCategory;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  uploadedBy: User;
}

export interface DocumentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  template: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: string;
  updatedAt: string;
  author: User;
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

// Типы для настроек
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
  createdAt: string;
  updatedAt: string;
}

// Типы для навигации
export interface MenuItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
  parentId?: string;
  isVisible: boolean;
  children?: MenuItem[];
}

// Типы для статистики
export interface DashboardStats {
  totalNews: number;
  totalEvents: number;
  totalDocuments: number;
  totalArbitrators: number;
  activeArbitrators: number;
  pendingInspections: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'news' | 'event' | 'document' | 'arbitrator' | 'inspection';
  action: 'created' | 'updated' | 'deleted' | 'published';
  title: string;
  user: User;
  timestamp: string;
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
