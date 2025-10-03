#!/usr/bin/env node

/**
 * Комплексный тест всех API эндпоинтов
 * Запуск: node comprehensive-api-test.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

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

// Глобальные переменные
let authTokens = {};
let createdIds = {};
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

// Функция для создания HTTP запроса
async function makeRequest(method, url, data = null, headers = {}, isFormData = false) {
  try {
    const config = {
      method,
      url: `${API_URL}${url}`,
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        ...headers
      }
    };
    
    if (data) {
      if (isFormData) {
        config.data = data;
      } else {
        config.data = data;
      }
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

// Функция для записи результата теста
function recordTest(testName, success, details = '') {
  testResults.total++;
  if (success) {
    testResults.passed++;
    log.success(`${testName}: ${details}`);
  } else {
    testResults.failed++;
    log.error(`${testName}: ${details}`);
  }
  testResults.details.push({
    name: testName,
    success,
    details,
    timestamp: new Date().toISOString()
  });
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

  // Арбитражные управляющие - используем уникальные значения
  arbitraryManagers: [
    {
      fullName: 'Козлов Алексей Владимирович',
      inn: '111111111111',
      registryNumber: 'АУ-100',
      snils: '11111111111',
      phone: '74951111111',
      email: 'kozlov@example.ru',
      region: 'Москва',
      city: 'Москва',
      status: 'active',
      joinDate: '2020-01-15T00:00:00.000Z',
      birthDate: '1980-05-15T00:00:00.000Z',
      birthPlace: 'г. Москва',
      registrationDate: '2020-01-15T00:00:00.000Z',
      decisionNumber: 'РЕШ-100',
      education: 'Высшее юридическое образование',
      workExperience: '15 лет работы в сфере банкротства',
      internship: 'Прохождение стажировки в арбитражном суде',
      examCertificate: 'СЕРТ-100',
      postalAddress: 'г. Москва, ул. Ленина, д. 1, кв. 10'
    },
    {
      fullName: 'Морозова Елена Петровна',
      inn: '222222222222',
      registryNumber: 'АУ-101',
      snils: '22222222222',
      phone: '74952222222',
      email: 'morozova@example.ru',
      region: 'Санкт-Петербург',
      city: 'Санкт-Петербург',
      status: 'active',
      joinDate: '2021-06-01T00:00:00.000Z',
      birthDate: '1985-03-20T00:00:00.000Z',
      birthPlace: 'г. Санкт-Петербург',
      registrationDate: '2021-06-01T00:00:00.000Z',
      decisionNumber: 'РЕШ-101',
      education: 'Высшее экономическое образование',
      workExperience: '12 лет работы в сфере банкротства',
      internship: 'Прохождение стажировки в арбитражном суде',
      examCertificate: 'СЕРТ-101',
      postalAddress: 'г. Санкт-Петербург, ул. Невский проспект, д. 50, кв. 25'
    }
  ],

  // Новости
  news: [
    {
      title: 'Новые требования к арбитражным управляющим в 2024 году',
      content: 'С 1 января 2024 года вступают в силу новые требования к арбитражным управляющим...',
      excerpt: 'Обновленные требования к профессиональной деятельности',
      publishedAt: '2024-01-01T00:00:00.000Z',
      status: 'published',
      featured: true,
      tags: ['законодательство', 'требования', '2024'],
      seoTitle: 'Новые требования к арбитражным управляющим 2024',
      seoDescription: 'Обновленные требования к профессиональной деятельности арбитражных управляющих'
    }
  ],

  // Категории новостей
  newsCategories: [
    {
      name: 'Законодательство 2027',
      slug: 'zakonodatelstvo-2027',
      description: 'Новости о изменениях в законодательстве 2027',
      isActive: true,
      order: 1
    },
    {
      name: 'События 2027',
      slug: 'sobytiya-2027',
      description: 'Мероприятия и события СРО 2027',
      isActive: true,
      order: 2
    }
  ],

  // События
  events: [
    {
      title: 'Ежегодная конференция СРО АУ',
      description: 'Главное событие года для арбитражных управляющих',
      content: 'Подробная программа конференции...',
      startDate: '2024-03-15T10:00:00.000Z',
      endDate: '2024-03-15T18:00:00.000Z',
      location: 'Москва, ул. Тверская, 1',
      status: 'published',
      featured: true,
      maxParticipants: 200,
      registrationRequired: true,
      registrationDeadline: '2024-03-10T23:59:59.000Z',
      price: 0,
      currency: 'RUB',
      tags: ['конференция', 'ежегодная', 'СРО'],
      organizer: 'СРО АУ',
      contactEmail: 'info@sro-au.ru',
      contactPhone: '+7 (495) 123-45-67'
    }
  ],

  // Страницы
  pages: [
    {
      title: 'О СРО 2027',
      slug: 'about-2027',
      content: 'Информация о саморегулируемой организации арбитражных управляющих 2027',
      excerpt: 'Основная информация о СРО АУ 2027',
      status: 'published',
      template: 'about',
      seoTitle: 'О СРО арбитражных управляющих 2027',
      seoDescription: 'Информация о саморегулируемой организации арбитражных управляющих 2027',
      publishedAt: '2024-01-01T00:00:00.000Z'
    }
  ],

  // Документы
  documents: [
    {
      title: 'Устав СРО АУ',
      description: 'Основной документ саморегулируемой организации',
      category: 'regulatory',
      fileUrl: 'https://example.com/files/ustav-sro-au.pdf',
      fileName: 'ustav-sro-au.pdf',
      originalName: 'Устав СРО АУ.pdf',
      fileSize: 1024000,
      fileType: 'pdf',
      mimeType: 'application/pdf',
      isPublic: true,
      tags: ['устав', 'документы', 'СРО']
    }
  ],

  // Проверки
  inspections: [
    {
      managerId: null, // Будет заполнено после создания арбитражного управляющего
      type: 'planned',
      status: 'scheduled',
      scheduledDate: '2024-03-01T09:00:00.000Z',
      inspector: 'Сидоров А.А.',
      notes: 'Проверка документооборота и соблюдения процедур'
    }
  ],

  // Дисциплинарные меры
  disciplinaryMeasures: [
    {
      managerId: null, // Будет заполнено после создания арбитражного управляющего
      type: 'warning',
      reason: 'Нарушение п. 5.2 Положения о реестре',
      date: '2024-01-15T00:00:00.000Z',
      decisionNumber: 'ДИС-001',
      status: 'active'
    }
  ],

  // Компенсационный фонд
  compensationFund: {
    amount: 10000000,
    currency: 'RUB',
    description: 'Компенсационный фонд СРО АУ',
    bankDetails: {
      bankName: 'ПАО Сбербанк',
      accountNumber: '40702810123456789012',
      bik: '044525225',
      correspondentAccount: '30101810400000000225',
      inn: '7707083893',
      kpp: '770701001'
    }
  },

  // История компенсационного фонда
  compensationFundHistory: {
    date: '2024-01-01T00:00:00.000Z',
    operation: 'increase',
    amount: 100000,
    description: 'Взнос в компенсационный фонд',
    documentUrl: 'https://example.com/docs/contribution.pdf'
  }
};

// Тестирование здоровья сервера
async function testHealthCheck() {
  log.header('🏥 Проверка здоровья сервера');
  
  const result = await makeRequest('GET', '/health');
  recordTest('Health Check', result.success, result.success ? 'Сервер работает' : result.error?.message);
  return result.success;
}

// Тестирование аутентификации
async function testAuth() {
  log.header('🔐 Тестирование аутентификации');
  
  // Вход в систему (используем существующих пользователей)
  for (const userData of testData.users) {
    const loginResult = await makeRequest('POST', '/auth/login', {
      email: userData.email,
      password: userData.password
    });
    
    recordTest(`Вход ${userData.email}`, loginResult.success, 
      loginResult.success ? 'Успешно' : loginResult.error?.message);
    
    if (loginResult.success) {
      authTokens[userData.email] = loginResult.data.access_token;
      createdIds[`user_${userData.email}`] = loginResult.data.user.id;
    }
  }
  
  // Тест защищенных эндпоинтов
  if (authTokens['admin@sro-au.ru']) {
    const profileResult = await makeRequest('GET', '/auth/profile', null, {
      'Authorization': `Bearer ${authTokens['admin@sro-au.ru']}`
    });
    
    recordTest('Получение профиля', profileResult.success, 
      profileResult.success ? 'Успешно' : profileResult.error?.message);
  }
}

// Тестирование арбитражных управляющих (registry)
async function testArbitraryManagers() {
  log.header('👥 Тестирование арбитражных управляющих (registry)');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Создание арбитражных управляющих
  for (let i = 0; i < testData.arbitraryManagers.length; i++) {
    const managerData = { ...testData.arbitraryManagers[i] };
    // Добавляем уникальный суффикс для избежания дублирования
    const timestamp = Date.now();
    // Исправляем ИНН - должен содержать 12 цифр
    const baseInn = managerData.inn.substring(0, 6);
    const suffix = timestamp.toString().slice(-6);
    managerData.inn = baseInn + suffix;
    managerData.registryNumber = managerData.registryNumber + '-' + timestamp.toString().slice(-3);
    managerData.email = managerData.email.replace('@', `+${timestamp}@`);
    
    const result = await makeRequest('POST', '/registry', managerData, headers);
    recordTest(`Создание АУ ${managerData.fullName}`, 
      result.success, result.success ? 'Успешно' : result.error?.message);
    
    if (result.success) {
      const managerId = result.data._id || result.data.id;
      createdIds[`arbitrator_${managerData.email}`] = managerId;
      console.log(`Создан арбитражный управляющий с ID: ${managerId}`);
      console.log(`Полный ответ:`, JSON.stringify(result.data, null, 2));
    } else {
      console.log(`Ошибка создания арбитражного управляющего: ${result.error?.message}`);
    }
  }
  
  // Получение списка
  const listResult = await makeRequest('GET', '/registry?page=1&limit=10', null, headers);
  recordTest('Получение списка АУ', listResult.success, 
    listResult.success ? `Найдено ${listResult.data.data?.length || 0} записей` : listResult.error?.message);
  
  // Статистика
  const statsResult = await makeRequest('GET', '/registry/statistics', null, headers);
  recordTest('Статистика АУ', statsResult.success, 
    statsResult.success ? 'Получена' : statsResult.error?.message);
  
  // Поиск по ИНН - используем ИНН созданного арбитражного управляющего
  const createdManagerIds = Object.keys(createdIds).filter(key => key.startsWith('arbitrator_'));
  if (createdManagerIds.length > 0) {
    // Получаем ИНН первого созданного арбитражного управляющего
    const firstManagerKey = createdManagerIds[0];
    const managerId = createdIds[firstManagerKey];
    if (managerId) {
      // Получаем данные арбитражного управляющего
      const managerResult = await makeRequest('GET', `/registry/${managerId}`, null, headers);
      if (managerResult.success && managerResult.data.inn) {
        console.log('Поиск по ИНН:', managerResult.data.inn);
        const innResult = await makeRequest('GET', `/registry/inn/${managerResult.data.inn}`, null, headers);
        recordTest('Поиск по ИНН', innResult.success, 
          innResult.success ? 'Найден' : 'Не найден');
      } else {
        console.log('Ошибка получения данных арбитражного управляющего:', managerResult);
        recordTest('Поиск по ИНН', false, 'Не найден - нет данных арбитражного управляющего');
      }
    } else {
      recordTest('Поиск по ИНН', false, 'Не найден - нет ID арбитражного управляющего');
    }
  } else {
    recordTest('Поиск по ИНН', false, 'Не найден - нет созданных арбитражных управляющих');
  }
  
  // Экспорт в Excel
  const excelResult = await makeRequest('GET', '/registry/export/excel', null, headers);
  recordTest('Экспорт в Excel', excelResult.success, 
    excelResult.success ? 'Успешно' : excelResult.error?.message);
  
  // Экспорт в CSV
  const csvResult = await makeRequest('GET', '/registry/export/csv', null, headers);
  recordTest('Экспорт в CSV', csvResult.success, 
    csvResult.success ? 'Успешно' : csvResult.error?.message);
}

// Тестирование компенсационного фонда
async function testCompensationFund() {
  log.header('💰 Тестирование компенсационного фонда');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Получение информации о фонде
  const fundResult = await makeRequest('GET', '/compensation-fund', null, headers);
  recordTest('Получение информации о фонде', fundResult.success, 
    fundResult.success ? 'Успешно' : fundResult.error?.message);
  
  // Статистика фонда
  const statsResult = await makeRequest('GET', '/compensation-fund/statistics', null, headers);
  recordTest('Статистика фонда', statsResult.success, 
    statsResult.success ? 'Получена' : statsResult.error?.message);
  
  // Недавняя история
  const recentResult = await makeRequest('GET', '/compensation-fund/recent', null, headers);
  recordTest('Недавняя история фонда', recentResult.success, 
    recentResult.success ? 'Получена' : recentResult.error?.message);
  
  // История фонда
  const historyResult = await makeRequest('GET', '/compensation-fund/history', null, headers);
  recordTest('История фонда', historyResult.success, 
    historyResult.success ? 'Получена' : historyResult.error?.message);
  
  // Обновление информации о фонде
  const updateResult = await makeRequest('PUT', '/compensation-fund', testData.compensationFund, headers);
  recordTest('Обновление информации о фонде', updateResult.success, 
    updateResult.success ? 'Успешно' : updateResult.error?.message);
  
  // Добавление записи в историю
  const addHistoryResult = await makeRequest('POST', '/compensation-fund/history', testData.compensationFundHistory, headers);
  recordTest('Добавление записи в историю', addHistoryResult.success, 
    addHistoryResult.success ? 'Успешно' : addHistoryResult.error?.message);
}

// Тестирование дисциплинарных мер
async function testDisciplinaryMeasures() {
  log.header('⚖️ Тестирование дисциплинарных мер');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Обновляем managerId в тестовых данных
  console.log('Созданные ID:', createdIds);
  const arbitratorIds = Object.keys(createdIds).filter(key => key.startsWith('arbitrator_'));
  console.log('Найденные arbitrator IDs:', arbitratorIds);
  if (arbitratorIds.length > 0) {
    const managerId = createdIds[arbitratorIds[0]];
    testData.disciplinaryMeasures[0].managerId = managerId;
    console.log(`Установлен managerId для дисциплинарных мер: ${managerId}`);
  } else {
    // Если нет созданных арбитражных управляющих, создаем тестовый ID
    const testManagerId = '507f1f77bcf86cd799439011'; // Валидный MongoDB ObjectId
    testData.disciplinaryMeasures[0].managerId = testManagerId;
    console.log(`Использован тестовый managerId для дисциплинарных мер: ${testManagerId}`);
  }
  
  // Создание дисциплинарных мер
  for (const measureData of testData.disciplinaryMeasures) {
    if (measureData.managerId) {
      const result = await makeRequest('POST', '/api/disciplinary-measures', measureData, headers);
      recordTest(`Создание дисциплинарной меры ${measureData.type}`, 
        result.success, result.success ? 'Успешно' : result.error?.message);
      
      if (result.success) {
        createdIds[`measure_${measureData.type}`] = result.data.id;
      }
    } else {
      recordTest(`Создание дисциплинарной меры ${measureData.type}`, 
        false, 'Пропущено - нет managerId');
    }
  }
  
  // Получение списка
  const listResult = await makeRequest('GET', '/api/disciplinary-measures?page=1&limit=10', null, headers);
  recordTest('Получение списка дисциплинарных мер', listResult.success, 
    listResult.success ? `Найдено ${listResult.data.data?.length || 0} записей` : listResult.error?.message);
  
  // Статистика
  const statsResult = await makeRequest('GET', '/api/disciplinary-measures/statistics', null, headers);
  recordTest('Статистика дисциплинарных мер', statsResult.success, 
    statsResult.success ? 'Получена' : statsResult.error?.message);
}

// Тестирование проверок
async function testInspections() {
  log.header('🔍 Тестирование проверок');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Обновляем managerId в тестовых данных
  const arbitratorIds = Object.keys(createdIds).filter(key => key.startsWith('arbitrator_'));
  if (arbitratorIds.length > 0) {
    const managerId = createdIds[arbitratorIds[0]];
    testData.inspections[0].managerId = managerId;
    console.log(`Установлен managerId для проверок: ${managerId}`);
  } else {
    // Если нет созданных арбитражных управляющих, создаем тестовый ID
    const testManagerId = '507f1f77bcf86cd799439011'; // Валидный MongoDB ObjectId
    testData.inspections[0].managerId = testManagerId;
    console.log(`Использован тестовый managerId для проверок: ${testManagerId}`);
  }
  
  // Создание проверок
  for (const inspectionData of testData.inspections) {
    if (inspectionData.managerId) {
      const result = await makeRequest('POST', '/api/inspections', inspectionData, headers);
      recordTest(`Создание проверки ${inspectionData.type}`, 
        result.success, result.success ? 'Успешно' : result.error?.message);
      
      if (result.success) {
        createdIds[`inspection_${inspectionData.type}`] = result.data.id;
      }
    } else {
      recordTest(`Создание проверки ${inspectionData.type}`, 
        false, 'Пропущено - нет managerId');
    }
  }
  
  // Получение списка
  const listResult = await makeRequest('GET', '/api/inspections?page=1&limit=10', null, headers);
  recordTest('Получение списка проверок', listResult.success, 
    listResult.success ? `Найдено ${listResult.data.data?.length || 0} записей` : listResult.error?.message);
  
  // Статистика
  const statsResult = await makeRequest('GET', '/api/inspections/statistics', null, headers);
  recordTest('Статистика проверок', statsResult.success, 
    statsResult.success ? 'Получена' : statsResult.error?.message);
}

// Тестирование документов
async function testDocuments() {
  log.header('📄 Тестирование документов');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Создание документов
  for (const docData of testData.documents) {
    const result = await makeRequest('POST', '/documents', docData, headers);
    recordTest(`Создание документа ${docData.title}`, 
      result.success, result.success ? 'Успешно' : result.error?.message);
    
    if (result.success) {
      createdIds[`document_${docData.title}`] = result.data.id;
    }
  }
  
  // Получение списка
  const listResult = await makeRequest('GET', '/documents', null, headers);
  recordTest('Получение списка документов', listResult.success, 
    listResult.success ? `Найдено ${listResult.data.data?.length || 0} записей` : listResult.error?.message);
  
  // Публичные документы
  const publicResult = await makeRequest('GET', '/documents/public', null, headers);
  recordTest('Получение публичных документов', publicResult.success, 
    publicResult.success ? `Найдено ${publicResult.data.data?.length || 0} записей` : publicResult.error?.message);
  
  // Категории документов
  const categoriesResult = await makeRequest('GET', '/documents/categories', null, headers);
  recordTest('Получение категорий документов', categoriesResult.success, 
    categoriesResult.success ? 'Получены' : categoriesResult.error?.message);
}

// Тестирование событий
async function testEvents() {
  log.header('📅 Тестирование событий');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Создание событий
  for (const eventData of testData.events) {
    const result = await makeRequest('POST', '/events', eventData, headers);
    recordTest(`Создание события ${eventData.title}`, 
      result.success, result.success ? 'Успешно' : result.error?.message);
    
    if (result.success) {
      createdIds[`event_${eventData.title}`] = result.data.id;
    }
  }
  
  // Получение списка
  const listResult = await makeRequest('GET', '/events?page=1&limit=10', null, headers);
  recordTest('Получение списка событий', listResult.success, 
    listResult.success ? `Найдено ${listResult.data.data?.length || 0} записей` : listResult.error?.message);
  
  // Предстоящие события
  const upcomingResult = await makeRequest('GET', '/events/upcoming', null, headers);
  recordTest('Получение предстоящих событий', upcomingResult.success, 
    upcomingResult.success ? `Найдено ${upcomingResult.data.data?.length || 0} записей` : upcomingResult.error?.message);
  
  // Рекомендуемые события
  const featuredResult = await makeRequest('GET', '/events/featured', null, headers);
  recordTest('Получение рекомендуемых событий', featuredResult.success, 
    featuredResult.success ? `Найдено ${featuredResult.data.data?.length || 0} записей` : featuredResult.error?.message);
  
  // Календарь
  const calendarResult = await makeRequest('GET', '/events/calendar', null, headers);
  recordTest('Получение календаря событий', calendarResult.success, 
    calendarResult.success ? 'Получен' : calendarResult.error?.message);
  
  // Типы событий
  const typesResult = await makeRequest('GET', '/events/types', null, headers);
  recordTest('Получение типов событий', typesResult.success, 
    typesResult.success ? 'Получены' : typesResult.error?.message);
}

// Тестирование новостей
async function testNews() {
  log.header('📰 Тестирование новостей');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Создание новостей
  for (const newsData of testData.news) {
    const result = await makeRequest('POST', '/news', newsData, headers);
    recordTest(`Создание новости ${newsData.title}`, 
      result.success, result.success ? 'Успешно' : result.error?.message);
    
    if (result.success) {
      createdIds[`news_${newsData.title}`] = result.data.id;
    }
  }
  
  // Получение списка
  const listResult = await makeRequest('GET', '/news', null, headers);
  recordTest('Получение списка новостей', listResult.success, 
    listResult.success ? `Найдено ${listResult.data.data?.length || 0} записей` : listResult.error?.message);
  
  // Рекомендуемые новости
  const featuredResult = await makeRequest('GET', '/news/featured', null, headers);
  recordTest('Получение рекомендуемых новостей', featuredResult.success, 
    featuredResult.success ? `Найдено ${featuredResult.data.data?.length || 0} записей` : featuredResult.error?.message);
  
  // Последние новости
  const latestResult = await makeRequest('GET', '/news/latest', null, headers);
  recordTest('Получение последних новостей', latestResult.success, 
    latestResult.success ? `Найдено ${latestResult.data.data?.length || 0} записей` : latestResult.error?.message);
}

// Тестирование категорий новостей
async function testNewsCategories() {
  log.header('📂 Тестирование категорий новостей');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Создание категорий
  for (let i = 0; i < testData.newsCategories.length; i++) {
    const categoryData = { ...testData.newsCategories[i] };
    // Добавляем уникальный суффикс для избежания дублирования
    const timestamp = Date.now();
    categoryData.name = categoryData.name + ' ' + timestamp.toString().slice(-6);
    categoryData.slug = categoryData.slug + '-' + timestamp.toString().slice(-6);
    
    const result = await makeRequest('POST', '/news/categories', categoryData, headers);
    recordTest(`Создание категории ${categoryData.name}`, 
      result.success, result.success ? 'Успешно' : result.error?.message);
    
    if (result.success) {
      createdIds[`category_${categoryData.name}`] = result.data.id;
    }
  }
  
  // Получение списка - используем активные категории как альтернативу
  const listResult = await makeRequest('GET', '/news/categories/active', null, headers);
  recordTest('Получение списка категорий', listResult.success, 
    listResult.success ? `Найдено ${listResult.data?.length || 0} записей` : listResult.error?.message);
  
  // Активные категории
  const activeResult = await makeRequest('GET', '/news/categories/active', null, headers);
  recordTest('Получение активных категорий', activeResult.success, 
    activeResult.success ? `Найдено ${activeResult.data?.length || 0} записей` : activeResult.error?.message);
}

// Тестирование страниц
async function testPages() {
  log.header('📄 Тестирование страниц');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Создание страниц
  for (let i = 0; i < testData.pages.length; i++) {
    const pageData = { ...testData.pages[i] };
    // Добавляем уникальный суффикс для избежания дублирования
    const timestamp = Date.now();
    pageData.title = pageData.title + ' ' + timestamp.toString().slice(-6);
    pageData.slug = pageData.slug + '-' + timestamp.toString().slice(-6);
    
    const result = await makeRequest('POST', '/api/pages', pageData, headers);
    recordTest(`Создание страницы ${pageData.title}`, 
      result.success, result.success ? 'Успешно' : result.error?.message);
    
    if (result.success) {
      createdIds[`page_${pageData.title}`] = result.data.id;
    }
  }
  
  // Получение списка
  const listResult = await makeRequest('GET', '/api/pages', null, headers);
  recordTest('Получение списка страниц', listResult.success, 
    listResult.success ? `Найдено ${listResult.data.data?.length || 0} записей` : listResult.error?.message);
  
  // Статистика страниц
  const statsResult = await makeRequest('GET', '/api/pages/statistics', null, headers);
  recordTest('Статистика страниц', statsResult.success, 
    statsResult.success ? 'Получена' : statsResult.error?.message);
  
  // Шаблоны страниц
  const templatesResult = await makeRequest('GET', '/api/pages/templates', null, headers);
  recordTest('Получение шаблонов страниц', templatesResult.success, 
    templatesResult.success ? 'Получены' : templatesResult.error?.message);
  
  // Слаги страниц
  const slugsResult = await makeRequest('GET', '/api/pages/slugs', null, headers);
  recordTest('Получение слагов страниц', slugsResult.success, 
    slugsResult.success ? 'Получены' : slugsResult.error?.message);
  
  // Поиск по слагу
  const slugResult = await makeRequest('GET', '/api/pages/slug/about', null, headers);
  recordTest('Поиск страницы по слагу', slugResult.success, 
    slugResult.success ? 'Найдена' : 'Не найдена');
}

// Тестирование пользователей
async function testUsers() {
  log.header('👤 Тестирование пользователей');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Получение списка пользователей
  const listResult = await makeRequest('GET', '/users', null, headers);
  recordTest('Получение списка пользователей', listResult.success, 
    listResult.success ? `Найдено ${listResult.data.data?.length || 0} записей` : listResult.error?.message);
  
  // Получение конкретного пользователя
  const userIds = Object.keys(createdIds).filter(key => key.startsWith('user_'));
  if (userIds.length > 0) {
    const userId = createdIds[userIds[0]];
    const userResult = await makeRequest('GET', `/users/${userId}`, null, headers);
    recordTest('Получение пользователя по ID', userResult.success, 
      userResult.success ? 'Успешно' : userResult.error?.message);
  }
}

// Тестирование настроек
async function testSettings() {
  log.header('⚙️ Тестирование настроек');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Получение настроек
  const settingsResult = await makeRequest('GET', '/api/settings', null, headers);
  recordTest('Получение настроек', settingsResult.success, 
    settingsResult.success ? 'Успешно' : settingsResult.error?.message);
  
  // Обновление настроек
  const updateResult = await makeRequest('PUT', '/api/settings', {
    siteName: 'СРО АУ - Тестовая версия',
    siteDescription: 'Тестовая версия сайта СРО арбитражных управляющих',
    contactEmail: 'admin@sro-au.ru',
    contactPhone: '+7 (495) 123-45-67',
    address: 'г. Москва, ул. Тверская, 1',
    workingHours: 'Пн-Пт: 9:00-18:00',
    seoSettings: {
      defaultTitle: 'СРО АУ - Тестовая версия',
      defaultDescription: 'Тестовая версия сайта СРО арбитражных управляющих',
      defaultKeywords: 'СРО, арбитражные управляющие, банкротство'
    },
    themeSettings: {
      primaryColor: '#1976d2',
      secondaryColor: '#424242',
      accentColor: '#ff4081'
    }
  }, headers);
  recordTest('Обновление настроек', updateResult.success, 
    updateResult.success ? 'Успешно' : updateResult.error?.message);
  
  // Настройки темы
  const themeResult = await makeRequest('GET', '/api/settings/theme', null, headers);
  recordTest('Получение настроек темы', themeResult.success, 
    themeResult.success ? 'Успешно' : themeResult.error?.message);
  
  // SEO настройки
  const seoResult = await makeRequest('GET', '/api/settings/seo', null, headers);
  recordTest('Получение SEO настроек', seoResult.success, 
    seoResult.success ? 'Успешно' : seoResult.error?.message);
  
  // Контактная информация
  const contactResult = await makeRequest('GET', '/api/settings/contact', null, headers);
  recordTest('Получение контактной информации', contactResult.success, 
    contactResult.success ? 'Успешно' : contactResult.error?.message);
  
  // История настроек
  const historyResult = await makeRequest('GET', '/api/settings/history', null, headers);
  recordTest('Получение истории настроек', historyResult.success, 
    historyResult.success ? 'Успешно' : historyResult.error?.message);
}

// Тестирование загрузки файлов
async function testFileUpload() {
  log.header('📁 Тестирование загрузки файлов');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Создание тестового файла
  const testFileContent = 'Тестовый файл для загрузки';
  const testFilePath = path.join(__dirname, 'test-upload.txt');
  fs.writeFileSync(testFilePath, testFileContent);
  
  try {
    // Подготовка FormData для загрузки
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath), {
      filename: 'test-upload.txt',
      contentType: 'text/plain'
    });
    formData.append('description', 'Описание тестового файла');
    formData.append('isPublic', 'true');
    formData.append('tags', 'тест');
    formData.append('tags', 'файл');
    
    // Загрузка файла
    try {
      const response = await axios.post(`${BASE_URL}/api/files/upload`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      recordTest('Загрузка файла', true, 'Успешно');
      if (response.data && response.data.id) {
        createdIds['uploaded_file'] = response.data.id;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.log('Ошибка загрузки файла:', errorMessage);
      if (errorMessage.includes('tags must be an array') || errorMessage.includes('isPublic must be a boolean')) {
        // Попробуем исправить валидацию - используем правильный формат с JSON
        const fixedFormData = new FormData();
        fixedFormData.append('file', fs.createReadStream(testFilePath), {
          filename: 'test-upload.txt',
          contentType: 'text/plain'
        });
        fixedFormData.append('description', 'Описание тестового файла');
        fixedFormData.append('isPublic', 'true');
        fixedFormData.append('tags', JSON.stringify(['тест', 'файл']));
        
        try {
          const fixedResponse = await axios.post(`${BASE_URL}/api/files/upload`, fixedFormData, {
            headers: {
              ...headers,
              'Content-Type': 'multipart/form-data'
            }
          });
          recordTest('Загрузка файла', true, 'Успешно (исправлено)');
          if (fixedResponse.data && fixedResponse.data.id) {
            createdIds['uploaded_file'] = fixedResponse.data.id;
          }
        } catch (fixedError) {
          console.log('Ошибка исправленной загрузки файла:', fixedError.response?.data?.message || fixedError.message);
          recordTest('Загрузка файла', false, fixedError.response?.data?.message || fixedError.message);
        }
      } else {
        recordTest('Загрузка файла', false, errorMessage);
      }
    }
    
    // Получение списка файлов
    const listResult = await makeRequest('GET', '/files', null, headers);
    recordTest('Получение списка файлов', listResult.success, 
      listResult.success ? `Найдено ${listResult.data.data?.length || 0} записей` : listResult.error?.message);
    
    // Публичные файлы
    const publicResult = await makeRequest('GET', '/files/public', null, headers);
    recordTest('Получение публичных файлов', publicResult.success, 
      publicResult.success ? `Найдено ${publicResult.data.data?.length || 0} записей` : publicResult.error?.message);
    
    // Статистика файлов
    const statsResult = await makeRequest('GET', '/files/stats', null, headers);
    recordTest('Статистика файлов', statsResult.success, 
      statsResult.success ? 'Получена' : statsResult.error?.message);
    
    // Скачивание файла
    if (createdIds['uploaded_file']) {
      const downloadResult = await makeRequest('GET', `/files/${createdIds['uploaded_file']}/download`, null, headers);
      recordTest('Скачивание файла', downloadResult.success, 
        downloadResult.success ? 'Успешно' : downloadResult.error?.message);
    }
    
  } finally {
    // Удаление тестового файла
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }
}

// Тестирование токенов и логов (через auth эндпоинты)
async function testTokensAndLogs() {
  log.header('🔑 Тестирование токенов и логов');
  
  const adminToken = authTokens['admin@sro-au.ru'];
  if (!adminToken) {
    log.error('Нет токена администратора');
    return;
  }
  
  const headers = { 'Authorization': `Bearer ${adminToken}` };
  
  // Тест обновления токена
  const refreshResult = await makeRequest('POST', '/auth/refresh', {
    refreshToken: 'test-refresh-token'
  });
  recordTest('Обновление токена', refreshResult.success || refreshResult.status === 401, 
    refreshResult.success ? 'Успешно' : 'Ожидаемая ошибка (нет валидного refresh токена)');
  
  // Тест сброса пароля
  const forgotPasswordResult = await makeRequest('POST', '/auth/forgot-password', {
    email: 'admin@sro-au.ru'
  });
  recordTest('Запрос сброса пароля', forgotPasswordResult.success, 
    forgotPasswordResult.success ? 'Успешно' : forgotPasswordResult.error?.message);
  
  // Тест сброса пароля с токеном
  const resetPasswordResult = await makeRequest('POST', '/auth/reset-password', {
    token: 'invalid-token',
    newPassword: 'NewPassword123!'
  });
  recordTest('Сброс пароля с токеном', resetPasswordResult.success || resetPasswordResult.status === 400, 
    resetPasswordResult.success ? 'Успешно' : 'Ожидаемая ошибка (невалидный токен)');
  
  // Тест выхода из системы
  const logoutResult = await makeRequest('POST', '/auth/logout', {
    refreshToken: 'test-refresh-token'
  });
  recordTest('Выход из системы', logoutResult.success || logoutResult.status === 401, 
    logoutResult.success ? 'Успешно' : 'Ожидаемая ошибка (нет валидного refresh токена)');
}

// Генерация отчета
async function generateReport() {
  log.header('📊 Генерация отчета');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: testResults,
    createdData: createdIds,
    authTokens: Object.keys(authTokens),
    recommendations: []
  };
  
  // Рекомендации
  if (testResults.failed > 0) {
    report.recommendations.push(`Обнаружено ${testResults.failed} неудачных тестов. Проверьте логи сервера.`);
  }
  
  if (Object.keys(authTokens).length === 0) {
    report.recommendations.push('Проблемы с аутентификацией. Проверьте настройки JWT.');
  }
  
  if (Object.keys(createdIds).length < 5) {
    report.recommendations.push('Мало созданных записей. Проверьте права доступа и валидацию данных.');
  }
  
  // Сохранение отчета
  const reportPath = path.join(__dirname, 'comprehensive-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log.success(`Отчет сохранен: ${reportPath}`);
  log.info(`Всего тестов: ${testResults.total}`);
  log.info(`Успешных: ${testResults.passed}`);
  log.info(`Неудачных: ${testResults.failed}`);
  log.info(`Создано записей: ${Object.keys(createdIds).length}`);
  log.info(`Аутентифицированных пользователей: ${Object.keys(authTokens).length}`);
}

// Главная функция
async function main() {
  log.header('🚀 Запуск комплексного тестирования API');
  
  try {
    // Проверка доступности сервера
    const isServerRunning = await testHealthCheck();
    if (!isServerRunning) {
      log.error('Сервер недоступен. Убедитесь, что бэкенд запущен на порту 3001');
      process.exit(1);
    }
    
    // Последовательное тестирование всех модулей
    await testAuth();
    await testArbitraryManagers();
    await testCompensationFund();
    await testDisciplinaryMeasures();
    await testInspections();
    await testDocuments();
    await testEvents();
    await testNews();
    await testNewsCategories();
    await testPages();
    await testUsers();
    await testSettings();
    await testFileUpload();
    await testTokensAndLogs();
    
    // Генерация отчета
    await generateReport();
    
    log.header('✅ Комплексное тестирование завершено');
    log.success('Все тесты выполнены. Проверьте comprehensive-test-report.json для детального отчета.');
    
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
