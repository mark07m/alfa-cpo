import { NavigationItem } from '@/types';

export const navigationConfig: NavigationItem[] = [
  { 
    name: 'Об Ассоциации', 
    href: '/about'
  },
  { 
    name: 'Компенсационный фонд', 
    href: '/compensation-fund'
  },
  { 
    name: 'Реестр АУ', 
    href: '/registry'
  },
  { 
    name: 'Аккредитация', 
    href: '/accreditation'
  },
  { 
    name: 'Трудовая деятельность', 
    href: '/labor-activity'
  },
];

// Дополнительные пункты для мобильного меню
export const mobileMenuItems: NavigationItem[] = [
  { name: 'Нормативные документы СРО', href: '/documents/regulatory' },
  { name: 'Правила профессиональной деятельности', href: '/documents/rules' },
  { name: 'Повышение уровня профессиональной подготовки', href: '/professional-development' },
  { name: 'Контроль деятельности членов СРО', href: '/control' },
  { name: 'Текущая деятельность', href: '/news' },
  { name: 'Информация о размещении и обновлении сведений', href: '/control/information-updates' },
];

// Конфигурация для футера
export const footerNavigation = {
  about: [
    { name: 'Об Ассоциации', href: '/about' },
    { name: 'Руководство', href: '/about/leadership' },
    { name: 'История', href: '/about/history' },
  ],
  activity: [
    { name: 'Компенсационный фонд', href: '/compensation-fund' },
    { name: 'Аккредитация', href: '/accreditation' },
    { name: 'Трудовая деятельность', href: '/labor-activity' },
  ],
  documents: [
    { name: 'Нормативные документы', href: '/documents/regulatory' },
    { name: 'Правила деятельности', href: '/documents/rules' },
    { name: 'Реестр АУ', href: '/registry' },
  ],
  legal: [
    { name: 'Политика конфиденциальности', href: '/privacy' },
    { name: 'Условия использования', href: '/terms' },
  ],
};

// SEO конфигурация для страниц
export const seoConfig = {
  '/': {
    title: 'СРО Арбитражных Управляющих - Главная',
    description: 'Официальный сайт саморегулируемой организации арбитражных управляющих. Реестр членов, нормативные документы, компенсационный фонд.',
    keywords: 'СРО, арбитражные управляющие, банкротство, реестр, компенсационный фонд',
  },
  '/about': {
    title: 'Об Ассоциации - СРО Арбитражных Управляющих',
    description: 'Информация о саморегулируемой организации арбитражных управляющих: история, руководство, структура управления.',
    keywords: 'СРО, ассоциация, арбитражные управляющие, руководство, история',
  },
  '/registry': {
    title: 'Реестр арбитражных управляющих - СРО АУ',
    description: 'Поиск арбитражных управляющих в реестре СРО. Поиск по ФИО, ИНН, номеру в реестре.',
    keywords: 'реестр, арбитражные управляющие, поиск, ФИО, ИНН',
  },
  '/compensation-fund': {
    title: 'Компенсационный фонд - СРО АУ',
    description: 'Информация о компенсационном фонде СРО: размер, реквизиты, документы.',
    keywords: 'компенсационный фонд, реквизиты, размер фонда',
  },
  '/documents': {
    title: 'Документы - СРО Арбитражных Управляющих',
    description: 'Нормативные документы, правила деятельности, учредительные документы СРО.',
    keywords: 'документы, нормативные акты, правила, устав',
  },
  '/news': {
    title: 'Новости - СРО Арбитражных Управляющих',
    description: 'Актуальные новости, мероприятия и объявления СРО арбитражных управляющих.',
    keywords: 'новости, мероприятия, объявления, СРО',
  },
  '/contacts': {
    title: 'Контакты - СРО Арбитражных Управляющих',
    description: 'Контактная информация СРО: адрес, телефон, email, часы работы.',
    keywords: 'контакты, адрес, телефон, email, СРО',
  },
};

// Функция для получения SEO конфигурации по пути
export const getSeoConfig = (pathname: string) => {
  return seoConfig[pathname as keyof typeof seoConfig] || {
    title: 'СРО Арбитражных Управляющих',
    description: 'Официальный сайт саморегулируемой организации арбитражных управляющих',
    keywords: 'СРО, арбитражные управляющие, банкротство',
  };
};
