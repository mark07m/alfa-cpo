// API константы
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Константы для пагинации
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  MAX_PAGE_SIZE: 100,
} as const;

// Константы для статусов
export const STATUSES = {
  MANAGER: {
    ACTIVE: 'active',
    EXCLUDED: 'excluded',
    SUSPENDED: 'suspended',
  },
  EVENT: {
    UPCOMING: 'upcoming',
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },
  INSPECTION: {
    SCHEDULED: 'scheduled',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },
  DISCIPLINARY: {
    ACTIVE: 'active',
    CANCELLED: 'cancelled',
  },
} as const;

// Константы для категорий документов
export const DOCUMENT_CATEGORIES = {
  REGULATORY: 'regulatory',
  RULES: 'rules',
  REPORTS: 'reports',
  OTHER: 'other',
} as const;

// Константы для типов мероприятий
export const EVENT_TYPES = {
  SEMINAR: 'seminar',
  CONFERENCE: 'conference',
  TRAINING: 'training',
  MEETING: 'meeting',
} as const;

// Константы для типов проверок
export const INSPECTION_TYPES = {
  PLANNED: 'planned',
  UNPLANNED: 'unplanned',
} as const;

// Константы для дисциплинарных мер
export const DISCIPLINARY_TYPES = {
  WARNING: 'warning',
  REPRIMAND: 'reprimand',
  EXCLUSION: 'exclusion',
  OTHER: 'other',
} as const;

// Константы для ролей пользователей
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

// Константы для валидации
export const VALIDATION = {
  INN_LENGTH: 12,
  PHONE_REGEX: /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
} as const;

// Константы для размеров файлов
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
  ],
} as const;

// Константы для кэширования
export const CACHE_KEYS = {
  NEWS: 'news',
  DOCUMENTS: 'documents',
  MANAGERS: 'managers',
  EVENTS: 'events',
  SETTINGS: 'settings',
} as const;

// Константы для времени кэширования (в секундах)
export const CACHE_DURATION = {
  SHORT: 300, // 5 минут
  MEDIUM: 1800, // 30 минут
  LONG: 3600, // 1 час
  VERY_LONG: 86400, // 24 часа
} as const;

// Константы для уведомлений
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Константы для анимаций
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Константы для брейкпоинтов
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Константы для цветов
export const COLORS = {
  PRIMARY: 'beige-600',
  PRIMARY_HOVER: 'beige-700',
  SECONDARY: 'neutral-200',
  SECONDARY_HOVER: 'neutral-300',
  SUCCESS: 'green-600',
  WARNING: 'yellow-600',
  ERROR: 'red-600',
  INFO: 'blue-600',
} as const;

// Константы для иконок
export const ICONS = {
  SIZE: {
    SM: 'h-4 w-4',
    MD: 'h-5 w-5',
    LG: 'h-6 w-6',
    XL: 'h-8 w-8',
  },
} as const;

// Константы для форм
export const FORM_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  AUTO_SAVE_DELAY: 2000,
  MAX_RETRIES: 3,
} as const;

// Константы для SEO
export const SEO = {
  DEFAULT_TITLE: 'СРО Арбитражных Управляющих',
  DEFAULT_DESCRIPTION: 'Официальный сайт саморегулируемой организации арбитражных управляющих. Реестр членов, нормативные документы, компенсационный фонд.',
  DEFAULT_KEYWORDS: 'СРО, арбитражные управляющие, банкротство, реестр, компенсационный фонд',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;

// Константы для навигации
export const NAVIGATION = {
  MAIN_MENU: 'main',
  FOOTER_MENU: 'footer',
  MOBILE_MENU: 'mobile',
} as const;

// Константы для таблиц
export const TABLE = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  SORT_DIRECTIONS: {
    ASC: 'asc',
    DESC: 'desc',
  },
} as const;

// Константы для модальных окон
export const MODAL = {
  SIZES: {
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
  },
  ANIMATION_DURATION: 300,
} as const;
