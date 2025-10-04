import { Event, EventType, EventParticipant, Document, DocumentCategory, News, NewsCategory, User, UserRole } from '@/types/admin'

// Моковые пользователи
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@sro-au.ru',
    firstName: 'Администратор',
    lastName: 'Системы',
    role: 'SUPER_ADMIN' as UserRole,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'editor@sro-au.ru',
    firstName: 'Редактор',
    lastName: 'Контента',
    role: 'EDITOR' as UserRole,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Моковые типы мероприятий
export const mockEventTypes: EventType[] = [
  {
    id: '1',
    name: 'Семинар',
    slug: 'seminar',
    description: 'Обучающие семинары',
    color: '#3B82F6',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Конференция',
    slug: 'conference',
    description: 'Профессиональные конференции',
    color: '#10B981',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Встреча',
    slug: 'meeting',
    description: 'Рабочие встречи',
    color: '#F59E0B',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Моковые мероприятия
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Семинар по новым стандартам СРО',
    description: 'Обсуждение новых требований и стандартов саморегулируемых организаций',
    type: mockEventTypes[0],
    status: 'published',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // через неделю
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    location: 'Москва, ул. Тверская, 1',
    maxParticipants: 50,
    currentParticipants: 23,
    registrationRequired: true,
    isPublic: true,
    isFeatured: true,
    imageUrl: '/images/events/seminar.jpg',
    agenda: [
      {
        id: '1',
        title: 'Регистрация участников',
        startTime: '09:00',
        endTime: '09:30',
        description: 'Встреча и регистрация участников'
      },
      {
        id: '2',
        title: 'Вступительное слово',
        startTime: '09:30',
        endTime: '10:00',
        description: 'Приветствие и обзор программы'
      },
      {
        id: '3',
        title: 'Новые стандарты СРО',
        startTime: '10:00',
        endTime: '12:00',
        description: 'Презентация новых требований'
      }
    ],
    tags: ['СРО', 'стандарты', 'обучение'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: mockUsers[0],
    updatedBy: mockUsers[0]
  },
  {
    id: '2',
    title: 'Конференция по строительному аудиту',
    description: 'Ежегодная конференция по вопросам строительного аудита и контроля качества',
    type: mockEventTypes[1],
    status: 'published',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // через 2 недели
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    location: 'Санкт-Петербург, Невский проспект, 28',
    maxParticipants: 100,
    currentParticipants: 67,
    registrationRequired: true,
    isPublic: true,
    isFeatured: false,
    imageUrl: '/images/events/conference.jpg',
    agenda: [
      {
        id: '1',
        title: 'Открытие конференции',
        startTime: '10:00',
        endTime: '10:30',
        description: 'Приветственное слово организаторов'
      },
      {
        id: '2',
        title: 'Ключевые доклады',
        startTime: '10:30',
        endTime: '12:30',
        description: 'Основные выступления спикеров'
      }
    ],
    tags: ['аудит', 'строительство', 'контроль'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: mockUsers[0],
    updatedBy: mockUsers[0]
  },
  {
    id: '3',
    title: 'Рабочая встреча по проектам',
    description: 'Внутренняя встреча по обсуждению текущих проектов',
    type: mockEventTypes[2],
    status: 'draft',
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // через 3 дня
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: 'Онлайн',
    maxParticipants: 20,
    currentParticipants: 0,
    registrationRequired: false,
    isPublic: false,
    isFeatured: false,
    imageUrl: null,
    agenda: [],
    tags: ['встреча', 'проекты'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: mockUsers[1],
    updatedBy: mockUsers[1]
  }
]

// Моковые категории документов
export const mockDocumentCategories: DocumentCategory[] = [
  {
    id: '1',
    name: 'Нормативные документы',
    slug: 'regulatory',
    description: 'Официальные нормативные акты и положения',
    color: '#EF4444',
    icon: 'document-text',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Методические материалы',
    slug: 'methodological',
    description: 'Руководства и методические указания',
    color: '#3B82F6',
    icon: 'academic-cap',
    isActive: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Отчеты',
    slug: 'reports',
    description: 'Отчеты о деятельности и результатах',
    color: '#10B981',
    icon: 'chart-bar',
    isActive: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Формы документов',
    slug: 'forms',
    description: 'Шаблоны и формы для заполнения',
    color: '#F59E0B',
    icon: 'clipboard-document-list',
    isActive: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Моковые документы
export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Положение о СРО',
    description: 'Основной документ, регламентирующий деятельность саморегулируемой организации',
    category: mockDocumentCategories[0],
    fileUrl: '/documents/sro-regulation.pdf',
    fileName: 'sro-regulation.pdf',
    originalName: 'Положение о СРО.pdf',
    fileSize: 2048576, // 2MB
    fileType: 'pdf',
    mimeType: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    version: '1.0',
    isPublic: true,
    downloadCount: 156,
    tags: ['СРО', 'положение', 'основной'],
    metadata: {
      author: 'Правовой отдел',
      publisher: 'СРО АУ',
      language: 'ru',
      pages: 45
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: mockUsers[0],
    updatedBy: mockUsers[0]
  },
  {
    id: '2',
    title: 'Методические указания по аудиту',
    description: 'Подробное руководство по проведению строительного аудита',
    category: mockDocumentCategories[1],
    fileUrl: '/documents/audit-guidelines.pdf',
    fileName: 'audit-guidelines.pdf',
    originalName: 'Методические указания по аудиту.pdf',
    fileSize: 5242880, // 5MB
    fileType: 'pdf',
    mimeType: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    version: '2.1',
    isPublic: true,
    downloadCount: 89,
    tags: ['аудит', 'методика', 'руководство'],
    metadata: {
      author: 'Экспертный совет',
      publisher: 'СРО АУ',
      language: 'ru',
      pages: 120
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: mockUsers[0],
    updatedBy: mockUsers[0]
  },
  {
    id: '3',
    title: 'Годовой отчет 2023',
    description: 'Отчет о деятельности СРО за 2023 год',
    category: mockDocumentCategories[2],
    fileUrl: '/documents/annual-report-2023.pdf',
    fileName: 'annual-report-2023.pdf',
    originalName: 'Годовой отчет 2023.pdf',
    fileSize: 10485760, // 10MB
    fileType: 'pdf',
    mimeType: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    version: '1.0',
    isPublic: true,
    downloadCount: 234,
    tags: ['отчет', '2023', 'деятельность'],
    metadata: {
      author: 'Аналитический отдел',
      publisher: 'СРО АУ',
      language: 'ru',
      pages: 85
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: mockUsers[0],
    updatedBy: mockUsers[0]
  },
  {
    id: '4',
    title: 'Заявка на вступление в СРО',
    description: 'Форма заявки для вступления в саморегулируемую организацию',
    category: mockDocumentCategories[3],
    fileUrl: '/documents/membership-application.docx',
    fileName: 'membership-application.docx',
    originalName: 'Заявка на вступление в СРО.docx',
    fileSize: 51200, // 50KB
    fileType: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedAt: new Date().toISOString(),
    version: '3.2',
    isPublic: true,
    downloadCount: 445,
    tags: ['заявка', 'вступление', 'форма'],
    metadata: {
      author: 'Отдел по работе с членами',
      publisher: 'СРО АУ',
      language: 'ru',
      pages: 3
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: mockUsers[1],
    updatedBy: mockUsers[1]
  }
]

// Моковые участники мероприятий
export const mockEventParticipants: EventParticipant[] = [
  {
    id: '1',
    eventId: '1',
    user: {
      id: '3',
      email: 'participant1@example.com',
      firstName: 'Иван',
      lastName: 'Петров',
      role: 'MEMBER' as UserRole,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    registeredAt: new Date().toISOString(),
    status: 'confirmed',
    notes: 'Заинтересован в новых стандартах'
  },
  {
    id: '2',
    eventId: '1',
    user: {
      id: '4',
      email: 'participant2@example.com',
      firstName: 'Мария',
      lastName: 'Сидорова',
      role: 'MEMBER' as UserRole,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    registeredAt: new Date().toISOString(),
    status: 'confirmed',
    notes: 'Опытный аудитор'
  }
]

// Моковые категории новостей
export const mockNewsCategories: NewsCategory[] = [
  {
    id: '1',
    name: 'Законодательство',
    slug: 'legislation',
    color: '#3B82F6',
    icon: 'document-text',
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Мероприятия',
    slug: 'events',
    color: '#10B981',
    icon: 'calendar',
    sortOrder: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Реестр',
    slug: 'registry',
    color: '#F59E0B',
    icon: 'users',
    sortOrder: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Объявления',
    slug: 'announcements',
    color: '#EF4444',
    icon: 'megaphone',
    sortOrder: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Моковые новости
export const mockNews: News[] = [
  {
    id: '1',
    title: 'Новые требования к арбитражным управляющим в 2024 году',
    content: 'Полный текст новости о новых требованиях...',
    excerpt: 'С 1 января 2024 года вступают в силу новые требования к арбитражным управляющим...',
    category: mockNewsCategories[0],
    status: 'published',
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    author: mockUsers[0],
    imageUrl: '/images/news-1.jpg',
    seoTitle: 'Новые требования к арбитражным управляющим 2024',
    seoDescription: 'Обзор новых требований к арбитражным управляющим с 1 января 2024 года',
    seoKeywords: 'арбитражные управляющие, требования, 2024, СРО'
  },
  {
    id: '2',
    title: 'Семинар по повышению квалификации',
    content: 'Полный текст новости о семинаре...',
    excerpt: 'Приглашаем всех членов СРО на семинар по повышению квалификации...',
    category: mockNewsCategories[1],
    status: 'published',
    publishedAt: '2024-01-20T14:00:00Z',
    createdAt: '2024-01-20T13:00:00Z',
    updatedAt: '2024-01-20T13:00:00Z',
    author: mockUsers[0],
    imageUrl: '/images/news-2.jpg'
  },
  {
    id: '3',
    title: 'Изменения в реестре арбитражных управляющих',
    content: 'Полный текст новости об изменениях в реестре...',
    excerpt: 'В реестр арбитражных управляющих внесены изменения...',
    category: mockNewsCategories[2],
    status: 'draft',
    publishedAt: null,
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-01-25T11:00:00Z',
    author: mockUsers[0]
  },
  {
    id: '4',
    title: 'Важное объявление для всех членов СРО',
    content: 'Полный текст объявления...',
    excerpt: 'Уважаемые члены СРО, обращаем ваше внимание на важные изменения...',
    category: mockNewsCategories[3],
    status: 'published',
    publishedAt: '2024-01-30T09:00:00Z',
    createdAt: '2024-01-30T08:00:00Z',
    updatedAt: '2024-01-30T08:00:00Z',
    author: mockUsers[0]
  }
]
