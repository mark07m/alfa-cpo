// Типы для админ панели СРО арбитражных управляющих

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Интерфейс для API ответа пользователя (с _id)
export interface ApiUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  EDITOR = 'EDITOR'
}

export enum Permission {
  // Пользователи
  USERS_READ = 'users:read',
  USERS_CREATE = 'users:create',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  
  // Новости
  NEWS_READ = 'news:read',
  NEWS_CREATE = 'news:create',
  NEWS_UPDATE = 'news:update',
  NEWS_DELETE = 'news:delete',
  NEWS_CATEGORY_CREATE = 'news:category:create',
  NEWS_CATEGORY_UPDATE = 'news:category:update',
  NEWS_CATEGORY_DELETE = 'news:category:delete',
  
  // Документы
  DOCUMENTS_READ = 'documents:read',
  DOCUMENTS_CREATE = 'documents:create',
  DOCUMENTS_UPDATE = 'documents:update',
  DOCUMENTS_DELETE = 'documents:delete',
  
  // Арбитражные управляющие
  REGISTRY_READ = 'registry:read',
  REGISTRY_CREATE = 'registry:create',
  REGISTRY_UPDATE = 'registry:update',
  REGISTRY_DELETE = 'registry:delete',
  
  // Мероприятия
  EVENTS_READ = 'events:read',
  EVENTS_CREATE = 'events:create',
  EVENTS_UPDATE = 'events:update',
  EVENTS_DELETE = 'events:delete',
  
  // Настройки
  SETTINGS_READ = 'settings:read',
  SETTINGS_UPDATE = 'settings:update',
  
  // Файлы
  FILE_READ = 'file:read',
  FILE_UPLOAD = 'file:upload',
  FILE_UPDATE = 'file:update',
  FILE_DELETE = 'file:delete',
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
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
  featured?: boolean;
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

// Формат категорий, возвращаемый backend API
export interface ApiDocumentCategory {
  value: string;
  label: string;
  count: number;
}

export interface DocumentMetadata {
  author?: string;
  publisher?: string;
  language?: string;
  pages?: number;
}

export interface DocumentFilters {
  search?: string;
  category?: 'regulatory' | 'rules' | 'reports' | 'compensation-fund' | 'labor-activity' | 'accreditation' | 'other';
  tag?: string; // Backend поддерживает только один тег
  isPublic?: boolean;
  sortBy?: 'title' | 'uploadedAt' | 'downloadCount' | 'fileSize';
  sortOrder?: 'asc' | 'desc';
  // Дополнительные фильтры для UI (не поддерживаются backend)
  fileType?: string;
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
  category: 'regulatory' | 'rules' | 'reports' | 'compensation-fund' | 'labor-activity' | 'accreditation' | 'other';
  tags?: string[];
  isPublic?: boolean;
  version?: string;
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
  template?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isHomePage?: boolean;
  showInMenu?: boolean;
  menuOrder?: number;
  parentId?: string;
  children?: Page[];
  imageUrl?: string;
  featuredImage?: string;
  customFields?: Record<string, unknown>;
  metadata?: Record<string, any>;
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
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
  isHomePage?: boolean;
  showInMenu?: boolean;
  menuOrder?: number;
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
  workingHours: string;
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
  fullName: string;
  inn: string;
  registryNumber: string;
  snils?: string;
  stateRegistryNumber?: string;
  stateRegistryDate?: string;
  phone: string;
  email: string;
  region?: string;
  city?: string;
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
  criminalRecordDate?: string;
  criminalRecordNumber?: string;
  criminalRecordName?: string;
  insurance?: {
    startDate?: string;
    endDate?: string;
    amount?: number;
    contractNumber?: string;
    contractDate?: string;
    insuranceCompany?: string;
  };
  compensationFundContributions?: {
    purpose: string;
    date: string;
    amount: number;
  }[];
  compensationFundContribution?: number;
  inspections?: {
    type: string;
    startDate: string;
    endDate: string;
    result: string;
  }[];
  lastInspection?: string;
  disciplinaryMeasures?: {
    startDate: string;
    endDate: string;
    decisionNumber: string;
    penalty: string;
  }[];
  otherSroParticipation?: {
    sroName: string;
    joinDate: string;
    leaveDate?: string;
    status: string;
  }[];
  complianceStatus?: string;
  complianceDate?: string;
  complianceNumber?: string;
  postalAddress?: string;
  penalties?: string;
  documents?: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArbitratorFilters {
  search?: string;
  status?: 'active' | 'excluded' | 'suspended';
  region?: string;
  city?: string;
  inn?: string;
  registryNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'fullName' | 'joinDate' | 'status' | 'region' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ArbitratorStats {
  total: number;
  active: number;
  excluded: number;
  suspended: number;
  byRegion: { region: string; count: number }[];
  byStatus: { status: string; count: number }[];
  recentAdditions: number;
  recentExclusions: number;
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

// Типы для API ответов (дубликат удален - используется выше)

export interface PaginationResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// PaginationParams дубликат удален - используется выше

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

// Типы для аккредитованных организаций
export interface AccreditedOrganization {
  id: string;
  name: string;
  shortName?: string;
  inn: string;
  kpp?: string;
  ogrn: string;
  legalAddress: string;
  actualAddress?: string;
  phone: string;
  email: string;
  website?: string;
  directorName: string;
  directorPosition: string;
  accreditationNumber: string;
  accreditationDate: string;
  accreditationExpiryDate: string;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  accreditationType: 'educational' | 'training' | 'assessment' | 'other';
  description?: string;
  services: string[];
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  contacts: {
    name: string;
    position: string;
    phone: string;
    email: string;
  }[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccreditedOrganizationFilters {
  search?: string;
  status?: string;
  accreditationType?: string;
  dateFrom?: string;
  dateTo?: string;
  region?: string;
}

export interface AccreditedOrganizationStats {
  total: number;
  active: number;
  suspended: number;
  revoked: number;
  expired: number;
  byType: {
    educational: number;
    training: number;
    assessment: number;
    other: number;
  };
  recentAdditions: number;
  expiringSoon: number;
}

export interface AccreditedOrganizationFormData {
  id?: string;
  name: string;
  shortName?: string;
  inn: string;
  kpp?: string;
  ogrn: string;
  legalAddress: string;
  actualAddress?: string;
  phone: string;
  email: string;
  website?: string;
  directorName: string;
  directorPosition: string;
  accreditationNumber: string;
  accreditationDate: string;
  accreditationExpiryDate: string;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  accreditationType: 'educational' | 'training' | 'assessment' | 'other';
  description?: string;
  services: string[];
  contacts: {
    name: string;
    position: string;
    phone: string;
    email: string;
  }[];
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
    inn: string;
    kpp: string;
  };
  documents?: string[];
  history: CompensationFundHistory[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompensationFundHistory {
  date: string;
  operation: 'increase' | 'decrease' | 'transfer';
  amount: number;
  description: string;
  documentUrl?: string;
}

export interface CompensationFundStatistics {
  totalAmount: number;
  currency: string;
  monthlyContributions: number;
  monthlyExpenses: number;
  netChange: number;
  contributionCount: number;
  expenseCount: number;
  lastOperationDate: string;
  averageMonthlyContribution: number;
  averageMonthlyExpense: number;
}

export interface CompensationFundFormData {
  amount: number;
  currency: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    bik: string;
    correspondentAccount: string;
    inn: string;
    kpp: string;
  };
}

export interface CompensationFundHistoryFormData {
  date: string;
  operation: 'increase' | 'decrease' | 'transfer';
  amount: number;
  description: string;
  documentUrl?: string;
}
