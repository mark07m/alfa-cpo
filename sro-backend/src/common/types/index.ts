export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  EDITOR = 'EDITOR',
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

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.ADMIN]: [
    Permission.USERS_READ,
    Permission.USERS_CREATE,
    Permission.USERS_UPDATE,
    Permission.NEWS_READ,
    Permission.NEWS_CREATE,
    Permission.NEWS_UPDATE,
    Permission.NEWS_DELETE,
    Permission.NEWS_CATEGORY_CREATE,
    Permission.NEWS_CATEGORY_UPDATE,
    Permission.NEWS_CATEGORY_DELETE,
    Permission.DOCUMENTS_READ,
    Permission.DOCUMENTS_CREATE,
    Permission.DOCUMENTS_UPDATE,
    Permission.DOCUMENTS_DELETE,
    Permission.REGISTRY_READ,
    Permission.REGISTRY_CREATE,
    Permission.REGISTRY_UPDATE,
    Permission.REGISTRY_DELETE,
    Permission.EVENTS_READ,
    Permission.EVENTS_CREATE,
    Permission.EVENTS_UPDATE,
    Permission.EVENTS_DELETE,
    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,
    Permission.FILE_READ,
    Permission.FILE_UPLOAD,
    Permission.FILE_UPDATE,
    Permission.FILE_DELETE,
  ],
  [UserRole.MODERATOR]: [
    Permission.NEWS_READ,
    Permission.NEWS_CREATE,
    Permission.NEWS_UPDATE,
    Permission.NEWS_CATEGORY_CREATE,
    Permission.NEWS_CATEGORY_UPDATE,
    Permission.DOCUMENTS_READ,
    Permission.DOCUMENTS_CREATE,
    Permission.DOCUMENTS_UPDATE,
    Permission.REGISTRY_READ,
    Permission.REGISTRY_UPDATE,
    Permission.EVENTS_READ,
    Permission.EVENTS_CREATE,
    Permission.EVENTS_UPDATE,
    Permission.FILE_READ,
    Permission.FILE_UPLOAD,
  ],
  [UserRole.EDITOR]: [
    Permission.NEWS_READ,
    Permission.NEWS_CREATE,
    Permission.NEWS_UPDATE,
    Permission.DOCUMENTS_READ,
    Permission.DOCUMENTS_CREATE,
    Permission.DOCUMENTS_UPDATE,
    Permission.REGISTRY_READ,
    Permission.EVENTS_READ,
    Permission.EVENTS_CREATE,
    Permission.EVENTS_UPDATE,
    Permission.FILE_READ,
    Permission.FILE_UPLOAD,
  ],
};
