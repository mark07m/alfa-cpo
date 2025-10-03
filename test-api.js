#!/usr/bin/env node

/**
 * Скрипт для тестирования всех API эндпоинтов и заполнения БД тестовыми данными
 * Запуск: node test-api.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Конфигурация
const BASE_URL = 'http://localhost:3001';
const API_URL = `${BASE_URL}/api`;

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Утилиты для логирования
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.magenta}→${colors.reset} ${msg}`)
};

// Глобальные переменные для хранения токенов и ID
let authTokens = {};
let createdIds = {};

// Функция для создания HTTP запроса
async function makeRequest(method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status || 500 
    };
  }
}

// Тестовые данные
const testData = {
  // Пользователи
  users: [
    {
      email: 'admin@sro-au.ru',
      password: 'Admin123!',
      firstName: 'Администратор',
      lastName: 'Системы',
      role: 'ADMIN',
      phone: '+7 (495) 123-45-67',
      isActive: true
    },
    {
      email: 'moderator@sro-au.ru',
      password: 'Moder123!',
      firstName: 'Модератор',
      lastName: 'Контента',
      role: 'MODERATOR',
      phone: '+7 (495) 123-45-68',
      isActive: true
    },
    {
      email: 'editor@sro-au.ru',
      password: 'Editor123!',
      firstName: 'Редактор',
      lastName: 'Новостей',
      role: 'EDITOR',
      phone: '+7 (495) 123-45-69',
      isActive: true
    }
  ],

  // Новости
  news: [
    {
      title: 'Новые требования к арбитражным управляющим в 2024 году',
      content: 'С 1 января 2024 года вступают в силу новые требования к арбитражным управляющим...',
      excerpt: 'Обновленные требования к профессиональной деятельности',
      status: 'PUBLISHED',
      isFeatured: true,
      tags: ['законодательство', 'требования', '2024'],
      metaTitle: 'Новые требования к арбитражным управляющим 2024',
      metaDescription: 'Обновленные требования к профессиональной деятельности арбитражных управляющих'
    },
    {
      title: 'Семинар по банкротству физических лиц',
      content: 'Приглашаем арбитражных управляющих на семинар по особенностям банкротства физических лиц...',
      excerpt: 'Практические аспекты работы с банкротством физлиц',
      status: 'PUBLISHED',
      isFeatured: false,
      tags: ['семинар', 'банкротство', 'физлица'],
      metaTitle: 'Семинар по банкротству физических лиц',
      metaDescription: 'Практические аспекты работы с банкротством физических лиц'
    },
    {
      title: 'Изменения в порядке проведения торгов',
      content: 'Внесены изменения в порядок проведения торгов в рамках процедур банкротства...',
      excerpt: 'Обновленный регламент проведения торгов',
      status: 'DRAFT',
      isFeatured: false,
      tags: ['торги', 'банкротство', 'изменения'],
      metaTitle: 'Изменения в порядке проведения торгов',
      metaDescription: 'Обновленный регламент проведения торгов в процедурах банкротства'
    }
  ],

  // События
  events: [
    {
      title: 'Ежегодная конференция СРО АУ',
      description: 'Главное событие года для арбитражных управляющих',
      content: 'Подробная программа конференции...',
      startDate: new Date('2024-03-15T10:00:00Z'),
      endDate: new Date('2024-03-15T18:00:00Z'),
      location: 'Москва, ул. Тверская, 1',
      type: 'CONFERENCE',
      status: 'PUBLISHED',
      isFeatured: true,
      maxParticipants: 200,
      registrationDeadline: new Date('2024-03-10T23:59:59Z'),
      price: 0,
      tags: ['конференция', 'ежегодная', 'СРО']
    },
    {
      title: 'Семинар по новому законодательству',
      description: 'Обсуждение изменений в законодательстве о банкротстве',
      content: 'Детальный разбор новых норм...',
      startDate: new Date('2024-02-20T14:00:00Z'),
      endDate: new Date('2024-02-20T17:00:00Z'),
      location: 'Онлайн',
      type: 'SEMINAR',
      status: 'PUBLISHED',
      isFeatured: false,
      maxParticipants: 100,
      registrationDeadline: new Date('2024-02-18T23:59:59Z'),
      price: 5000,
      tags: ['семинар', 'законодательство', 'онлайн']
    }
  ],

  // Страницы
  pages: [
    {
      title: 'О СРО',
      slug: 'about',
      content: 'Информация о саморегулируемой организации арбитражных управляющих',
      excerpt: 'Основная информация о СРО АУ',
      status: 'PUBLISHED',
      template: 'about',
      metaTitle: 'О СРО арбитражных управляющих',
      metaDescription: 'Информация о саморегулируемой организации арбитражных управляющих',
      isInMenu: true,
      menuOrder: 1
    },
    {
      title: 'Услуги',
      slug: 'services',
      content: 'Перечень услуг, предоставляемых СРО АУ',
      excerpt: 'Услуги для арбитражных управляющих',
      status: 'PUBLISHED',
      template: 'services',
      metaTitle: 'Услуги СРО АУ',
      metaDescription: 'Перечень услуг, предоставляемых СРО АУ',
      isInMenu: true,
      menuOrder: 2
    }
  ],

  // Арбитражные управляющие
  arbitrators: [
    {
      firstName: 'Иван',
      lastName: 'Петров',
      middleName: 'Сергеевич',
      email: 'petrov@example.ru',
      phone: '+7 (495) 111-11-11',
      inn: '123456789012',
      snils: '123-456-789 00',
      passportSeries: '1234',
      passportNumber: '567890',
      passportIssuedBy: 'ОУФМС России по г. Москве',
      passportIssuedDate: new Date('2010-01-15'),
      address: 'г. Москва, ул. Ленина, д. 1, кв. 10',
      education: 'Высшее юридическое',
      workExperience: 15,
      specialization: 'Банкротство юридических лиц',
      status: 'ACTIVE',
      registrationDate: new Date('2020-01-15'),
      licenseNumber: 'АУ-001',
      licenseDate: new Date('2020-01-15'),
      licenseExpiryDate: new Date('2025-01-15')
    },
    {
      firstName: 'Мария',
      lastName: 'Сидорова',
      middleName: 'Александровна',
      email: 'sidorova@example.ru',
      phone: '+7 (495) 222-22-22',
      inn: '987654321098',
      snils: '987-654-321 00',
      passportSeries: '5678',
      passportNumber: '123456',
      passportIssuedBy: 'ОУФМС России по г. Санкт-Петербургу',
      passportIssuedDate: new Date('2012-03-20'),
      address: 'г. Санкт-Петербург, ул. Невский проспект, д. 50, кв. 25',
      education: 'Высшее экономическое',
      workExperience: 12,
      specialization: 'Банкротство физических лиц',
      status: 'ACTIVE',
      registrationDate: new Date('2021-06-01'),
      licenseNumber: 'АУ-002',
      licenseDate: new Date('2021-06-01'),
      licenseExpiryDate: new Date('2026-06-01')
    }
  ],

  // Документы
  documents: [
    {
      title: 'Устав СРО АУ',
      description: 'Основной документ саморегулируемой организации',
      category: 'LEGAL',
      type: 'PDF',
      size: 1024000,
      filename: 'ustav-sro-au.pdf',
      originalName: 'Устав СРО АУ.pdf',
      status: 'PUBLISHED',
      isPublic: true,
      tags: ['устав', 'документы', 'СРО']
    },
    {
      title: 'Положение о реестре',
      description: 'Правила ведения реестра арбитражных управляющих',
      category: 'REGULATORY',
      type: 'PDF',
      size: 512000,
      filename: 'polozhenie-reestr.pdf',
      originalName: 'Положение о реестре.pdf',
      status: 'PUBLISHED',
      isPublic: true,
      tags: ['положение', 'реестр', 'правила']
    }
  ],

  // Проверки
  inspections: [
    {
      title: 'Плановая проверка деятельности АУ Петрова И.С.',
      description: 'Плановая проверка соответствия деятельности требованиям СРО',
      type: 'PLANNED',
      status: 'SCHEDULED',
      startDate: new Date('2024-03-01T09:00:00Z'),
      endDate: new Date('2024-03-01T17:00:00Z'),
      inspector: 'Сидоров А.А.',
      arbitratorId: null, // Будет заполнено после создания арбитражного управляющего
      result: null,
      notes: 'Проверка документооборота и соблюдения процедур'
    }
  ],

  // Дисциплинарные меры
  disciplinaryMeasures: [
    {
      title: 'Предупреждение за нарушение сроков',
      description: 'Нарушение сроков подачи отчетности',
      type: 'WARNING',
      status: 'ACTIVE',
      arbitratorId: null, // Будет заполнено после создания арбитражного управляющего
      issueDate: new Date('2024-01-15'),
      expiryDate: new Date('2024-07-15'),
      reason: 'Нарушение п. 5.2 Положения о реестре',
      decision: 'Вынести предупреждение',
      notes: 'Повторное нарушение влечет более строгие меры'
    }
  ]
};

// Функции тестирования
async function testHealthCheck() {
  log.header('🏥 Проверка здоровья сервера');
  
  const result = await makeRequest('GET', '/health');
  if (result.success) {
    log.success('Сервер работает');
    return true;
  } else {
    log.error(`Сервер недоступен: ${result.error}`);
    return false;
  }
}

async function testAuth() {
  log.header('🔐 Тестирование аутентификации');
  
  // Регистрация пользователей
  for (const userData of testData.users) {
    log.step(`Регистрация пользователя: ${userData.email}`);
    
    const registerResult = await makeRequest('POST', '/auth/register', {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone
    });
    
    if (registerResult.success) {
      log.success(`Пользователь ${userData.email} зарегистрирован`);
      createdIds[`user_${userData.email}`] = registerResult.data.user.id;
    } else {
      log.warning(`Регистрация ${userData.email} пропущена: ${registerResult.error?.message || 'Пользователь уже существует'}`);
    }
  }
  
  // Вход в систему
  for (const userData of testData.users) {
    log.step(`Вход в систему: ${userData.email}`);
    
    const loginResult = await makeRequest('POST', '/auth/login', {
      email: userData.email,
      password: userData.password
    });
    
    if (loginResult.success) {
      log.success(`Вход выполнен: ${userData.email}`);
      authTokens[userData.email] = loginResult.data.accessToken;
    } else {
      log.error(`Ошибка входа ${userData.email}: ${loginResult.error?.message}`);
    }
  }
  
  // Тест защищенных эндпоинтов
  log.step('Тест защищенных эндпоинтов');
  const profileResult = await makeRequest('GET', '/auth/profile', null, {
    'Authorization': `Bearer ${authTokens['admin@sro-au.ru']}`
  });
  
  if (profileResult.success) {
    log.success('Получение профиля работает');
  } else {
    log.error(`Ошибка получения профиля: ${profileResult.error?.message}`);
  }
}

async function testContent() {
  log.header('📰 Тестирование контента');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора для тестирования контента');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Тест новостей
  log.step('Тестирование новостей');
  for (const newsData of testData.news) {
    const result = await makeRequest('POST', '/news', newsData, headers);
    if (result.success) {
      log.success(`Новость создана: ${newsData.title}`);
      createdIds[`news_${newsData.title}`] = result.data.id;
    } else {
      log.error(`Ошибка создания новости: ${result.error?.message}`);
    }
  }
  
  // Тест событий
  log.step('Тестирование событий');
  for (const eventData of testData.events) {
    const result = await makeRequest('POST', '/events', eventData, headers);
    if (result.success) {
      log.success(`Событие создано: ${eventData.title}`);
      createdIds[`event_${eventData.title}`] = result.data.id;
    } else {
      log.error(`Ошибка создания события: ${result.error?.message}`);
    }
  }
  
  // Тест страниц
  log.step('Тестирование страниц');
  for (const pageData of testData.pages) {
    const result = await makeRequest('POST', '/pages', pageData, headers);
    if (result.success) {
      log.success(`Страница создана: ${pageData.title}`);
      createdIds[`page_${pageData.title}`] = result.data.id;
    } else {
      log.error(`Ошибка создания страницы: ${result.error?.message}`);
    }
  }
  
  // Тест получения списков
  const newsList = await makeRequest('GET', '/news', null, headers);
  if (newsList.success) {
    log.success(`Получен список новостей: ${newsList.data.data?.length || 0} записей`);
  }
  
  const eventsList = await makeRequest('GET', '/events', null, headers);
  if (eventsList.success) {
    log.success(`Получен список событий: ${eventsList.data.data?.length || 0} записей`);
  }
}

async function testRegistry() {
  log.header('👥 Тестирование реестра');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора для тестирования реестра');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Создание арбитражных управляющих
  log.step('Создание арбитражных управляющих');
  for (const arbitratorData of testData.arbitrators) {
    const result = await makeRequest('POST', '/registry', arbitratorData, headers);
    if (result.success) {
      log.success(`Арбитражный управляющий создан: ${arbitratorData.firstName} ${arbitratorData.lastName}`);
      createdIds[`arbitrator_${arbitratorData.email}`] = result.data.id;
    } else {
      log.error(`Ошибка создания АУ: ${result.error?.message}`);
    }
  }
  
  // Обновление ID в связанных данных
  const arbitratorIds = Object.keys(createdIds).filter(key => key.startsWith('arbitrator_'));
  if (arbitratorIds.length > 0) {
    const firstArbitratorId = createdIds[arbitratorIds[0]];
    
    // Обновляем проверки
    testData.inspections[0].arbitratorId = firstArbitratorId;
    
    // Обновляем дисциплинарные меры
    testData.disciplinaryMeasures[0].arbitratorId = firstArbitratorId;
  }
  
  // Тест получения списка
  const registryList = await makeRequest('GET', '/registry', null, headers);
  if (registryList.success) {
    log.success(`Получен список АУ: ${registryList.data.data?.length || 0} записей`);
  }
}

async function testControl() {
  log.header('🔍 Тестирование контроля');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора для тестирования контроля');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Тест проверок
  log.step('Создание проверок');
  for (const inspectionData of testData.inspections) {
    const result = await makeRequest('POST', '/inspections', inspectionData, headers);
    if (result.success) {
      log.success(`Проверка создана: ${inspectionData.title}`);
      createdIds[`inspection_${inspectionData.title}`] = result.data.id;
    } else {
      log.error(`Ошибка создания проверки: ${result.error?.message}`);
    }
  }
  
  // Тест дисциплинарных мер
  log.step('Создание дисциплинарных мер');
  for (const measureData of testData.disciplinaryMeasures) {
    const result = await makeRequest('POST', '/disciplinary-measures', measureData, headers);
    if (result.success) {
      log.success(`Дисциплинарная мера создана: ${measureData.title}`);
      createdIds[`measure_${measureData.title}`] = result.data.id;
    } else {
      log.error(`Ошибка создания дисциплинарной меры: ${result.error?.message}`);
    }
  }
  
  // Тест получения списков
  const inspectionsList = await makeRequest('GET', '/inspections', null, headers);
  if (inspectionsList.success) {
    log.success(`Получен список проверок: ${inspectionsList.data.data?.length || 0} записей`);
  }
  
  const measuresList = await makeRequest('GET', '/disciplinary-measures', null, headers);
  if (measuresList.success) {
    log.success(`Получен список дисциплинарных мер: ${measuresList.data.data?.length || 0} записей`);
  }
}

async function testDocuments() {
  log.header('📄 Тестирование документов');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора для тестирования документов');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Создание документов
  log.step('Создание документов');
  for (const docData of testData.documents) {
    const result = await makeRequest('POST', '/documents', docData, headers);
    if (result.success) {
      log.success(`Документ создан: ${docData.title}`);
      createdIds[`document_${docData.title}`] = result.data.id;
    } else {
      log.error(`Ошибка создания документа: ${result.error?.message}`);
    }
  }
  
  // Тест получения списка
  const docsList = await makeRequest('GET', '/documents', null, headers);
  if (docsList.success) {
    log.success(`Получен список документов: ${docsList.data.data?.length || 0} записей`);
  }
}

async function testSettings() {
  log.header('⚙️ Тестирование настроек');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора для тестирования настроек');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Получение настроек
  const settingsResult = await makeRequest('GET', '/settings', null, headers);
  if (settingsResult.success) {
    log.success('Настройки получены');
  } else {
    log.error(`Ошибка получения настроек: ${settingsResult.error?.message}`);
  }
  
  // Обновление настроек
  const updateResult = await makeRequest('PATCH', '/settings', {
    siteName: 'СРО АУ - Тестовая версия',
    siteDescription: 'Тестовая версия сайта СРО арбитражных управляющих'
  }, headers);
  
  if (updateResult.success) {
    log.success('Настройки обновлены');
  } else {
    log.error(`Ошибка обновления настроек: ${updateResult.error?.message}`);
  }
}

async function generateReport() {
  log.header('📊 Генерация отчета');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0
    },
    createdData: createdIds,
    authTokens: Object.keys(authTokens),
    recommendations: []
  };
  
  // Сохранение отчета
  const reportPath = path.join(__dirname, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log.success(`Отчет сохранен: ${reportPath}`);
  log.info(`Создано записей: ${Object.keys(createdIds).length}`);
  log.info(`Аутентифицированных пользователей: ${Object.keys(authTokens).length}`);
  
  // Рекомендации
  if (Object.keys(authTokens).length === 0) {
    log.warning('Рекомендация: Проверьте настройки аутентификации');
  }
  
  if (Object.keys(createdIds).length < 5) {
    log.warning('Рекомендация: Проверьте права доступа и валидацию данных');
  }
}

// Главная функция
async function main() {
  log.header('🚀 Запуск тестирования API и заполнения БД');
  
  try {
    // Проверка доступности сервера
    const isServerRunning = await testHealthCheck();
    if (!isServerRunning) {
      log.error('Сервер недоступен. Убедитесь, что бэкенд запущен на порту 3001');
      process.exit(1);
    }
    
    // Последовательное тестирование всех модулей
    await testAuth();
    await testContent();
    await testRegistry();
    await testControl();
    await testDocuments();
    await testSettings();
    
    // Генерация отчета
    await generateReport();
    
    log.header('✅ Тестирование завершено');
    log.success('Все тесты выполнены. Проверьте MongoDB Compass для просмотра созданных данных.');
    
  } catch (error) {
    log.error(`Критическая ошибка: ${error.message}`);
    process.exit(1);
  }
}

// Запуск скрипта
if (require.main === module) {
  main();
}

module.exports = { testData, makeRequest, log };
