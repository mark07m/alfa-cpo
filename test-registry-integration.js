#!/usr/bin/env node

/**
 * Тестирование интеграции модуля реестра арбитражных управляющих
 * Проверяет все CRUD операции, импорт/экспорт и статистику
 */

const API_BASE_URL = 'http://localhost:3001/api';

// Тестовые данные
const testArbitrator = {
  fullName: 'Иванов Иван Иванович',
  inn: '123456789012',
  registryNumber: 'TEST-001',
  phone: '+7 (999) 123-45-67',
  email: 'test@example.com',
  region: 'Москва',
  city: 'Москва',
  status: 'active',
  joinDate: '2024-01-01',
  birthDate: '1980-01-01',
  birthPlace: 'Москва',
  education: 'Высшее юридическое',
  workExperience: '10 лет',
  insurance: {
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    amount: 1000000,
    contractNumber: 'INS-001',
    contractDate: '2024-01-01',
    insuranceCompany: 'Страховая компания'
  }
};

let createdArbitratorId = null;

// Функция для выполнения HTTP запросов
async function makeRequest(method, endpoint, data = null, headers = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    console.log(`${method} ${endpoint}:`, response.status, responseData);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseData.message || 'Unknown error'}`);
    }
    
    return responseData;
  } catch (error) {
    console.error(`Error ${method} ${endpoint}:`, error.message);
    throw error;
  }
}

// Тест 1: Получение списка арбитражных управляющих
async function testGetArbitrators() {
  console.log('\n=== Тест 1: Получение списка арбитражных управляющих ===');
  
  try {
    const response = await makeRequest('GET', '/registry');
    console.log('✅ Список получен успешно');
    console.log(`📊 Найдено записей: ${response.data?.length || 0}`);
    console.log(`📄 Пагинация:`, response.pagination);
    return true;
  } catch (error) {
    console.error('❌ Ошибка получения списка:', error.message);
    return false;
  }
}

// Тест 2: Создание арбитражного управляющего
async function testCreateArbitrator() {
  console.log('\n=== Тест 2: Создание арбитражного управляющего ===');
  
  try {
    const response = await makeRequest('POST', '/registry', testArbitrator);
    console.log('✅ Арбитражный управляющий создан успешно');
    console.log('🆔 ID созданной записи:', response.data?._id || response.data?.id);
    createdArbitratorId = response.data?._id || response.data?.id;
    return true;
  } catch (error) {
    console.error('❌ Ошибка создания:', error.message);
    return false;
  }
}

// Тест 3: Получение арбитражного управляющего по ID
async function testGetArbitratorById() {
  if (!createdArbitratorId) {
    console.log('⚠️ Пропуск теста: нет ID созданной записи');
    return false;
  }

  console.log('\n=== Тест 3: Получение арбитражного управляющего по ID ===');
  
  try {
    const response = await makeRequest('GET', `/registry/${createdArbitratorId}`);
    console.log('✅ Арбитражный управляющий получен успешно');
    console.log('👤 Данные:', {
      fullName: response.data?.fullName,
      inn: response.data?.inn,
      registryNumber: response.data?.registryNumber
    });
    return true;
  } catch (error) {
    console.error('❌ Ошибка получения по ID:', error.message);
    return false;
  }
}

// Тест 4: Обновление арбитражного управляющего
async function testUpdateArbitrator() {
  if (!createdArbitratorId) {
    console.log('⚠️ Пропуск теста: нет ID созданной записи');
    return false;
  }

  console.log('\n=== Тест 4: Обновление арбитражного управляющего ===');
  
  const updateData = {
    fullName: 'Иванов Иван Иванович (обновлено)',
    city: 'Санкт-Петербург',
    workExperience: '15 лет'
  };

  try {
    const response = await makeRequest('PATCH', `/registry/${createdArbitratorId}`, updateData);
    console.log('✅ Арбитражный управляющий обновлен успешно');
    console.log('🔄 Обновленные данные:', {
      fullName: response.data?.fullName,
      city: response.data?.city,
      workExperience: response.data?.workExperience
    });
    return true;
  } catch (error) {
    console.error('❌ Ошибка обновления:', error.message);
    return false;
  }
}

// Тест 5: Поиск по ИНН
async function testFindByInn() {
  console.log('\n=== Тест 5: Поиск по ИНН ===');
  
  try {
    const response = await makeRequest('GET', `/registry/inn/${testArbitrator.inn}`);
    console.log('✅ Поиск по ИНН выполнен успешно');
    console.log('🔍 Найденный арбитражный управляющий:', {
      fullName: response.data?.fullName,
      inn: response.data?.inn
    });
    return true;
  } catch (error) {
    console.error('❌ Ошибка поиска по ИНН:', error.message);
    return false;
  }
}

// Тест 6: Поиск по номеру реестра
async function testFindByRegistryNumber() {
  console.log('\n=== Тест 6: Поиск по номеру реестра ===');
  
  try {
    const response = await makeRequest('GET', `/registry/number/${testArbitrator.registryNumber}`);
    console.log('✅ Поиск по номеру реестра выполнен успешно');
    console.log('🔍 Найденный арбитражный управляющий:', {
      fullName: response.data?.fullName,
      registryNumber: response.data?.registryNumber
    });
    return true;
  } catch (error) {
    console.error('❌ Ошибка поиска по номеру реестра:', error.message);
    return false;
  }
}

// Тест 7: Получение статистики
async function testGetStatistics() {
  console.log('\n=== Тест 7: Получение статистики реестра ===');
  
  try {
    const response = await makeRequest('GET', '/registry/statistics');
    console.log('✅ Статистика получена успешно');
    console.log('📊 Статистика:', {
      total: response.data?.total,
      active: response.data?.active,
      excluded: response.data?.excluded,
      suspended: response.data?.suspended
    });
    return true;
  } catch (error) {
    console.error('❌ Ошибка получения статистики:', error.message);
    return false;
  }
}

// Тест 8: Экспорт в Excel
async function testExportExcel() {
  console.log('\n=== Тест 8: Экспорт в Excel ===');
  
  try {
    const response = await fetch(`${API_BASE_URL}/registry/export/excel`);
    if (response.ok) {
      console.log('✅ Экспорт в Excel выполнен успешно');
      console.log('📄 Размер файла:', response.headers.get('content-length'), 'байт');
      return true;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Ошибка экспорта в Excel:', error.message);
    return false;
  }
}

// Тест 9: Экспорт в CSV
async function testExportCsv() {
  console.log('\n=== Тест 9: Экспорт в CSV ===');
  
  try {
    const response = await fetch(`${API_BASE_URL}/registry/export/csv`);
    if (response.ok) {
      console.log('✅ Экспорт в CSV выполнен успешно');
      console.log('📄 Размер файла:', response.headers.get('content-length'), 'байт');
      return true;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Ошибка экспорта в CSV:', error.message);
    return false;
  }
}

// Тест 10: Удаление арбитражного управляющего
async function testDeleteArbitrator() {
  if (!createdArbitratorId) {
    console.log('⚠️ Пропуск теста: нет ID созданной записи');
    return false;
  }

  console.log('\n=== Тест 10: Удаление арбитражного управляющего ===');
  
  try {
    await makeRequest('DELETE', `/registry/${createdArbitratorId}`);
    console.log('✅ Арбитражный управляющий удален успешно');
    return true;
  } catch (error) {
    console.error('❌ Ошибка удаления:', error.message);
    return false;
  }
}

// Тест фильтрации
async function testFiltering() {
  console.log('\n=== Тест 11: Фильтрация и поиск ===');
  
  const filters = [
    { name: 'Поиск по имени', params: '?search=Иванов' },
    { name: 'Фильтр по статусу', params: '?status=active' },
    { name: 'Фильтр по региону', params: '?region=Москва' },
    { name: 'Сортировка по имени', params: '?sortBy=fullName&sortOrder=asc' },
    { name: 'Пагинация', params: '?page=1&limit=5' }
  ];

  let successCount = 0;

  for (const filter of filters) {
    try {
      const response = await makeRequest('GET', `/registry${filter.params}`);
      console.log(`✅ ${filter.name}: найдено ${response.data?.length || 0} записей`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${filter.name}:`, error.message);
    }
  }

  return successCount === filters.length;
}

// Основная функция тестирования
async function runTests() {
  console.log('🚀 Запуск тестирования интеграции модуля реестра арбитражных управляющих');
  console.log(`🌐 API Base URL: ${API_BASE_URL}`);
  console.log('=' * 80);

  const tests = [
    { name: 'Получение списка', fn: testGetArbitrators },
    { name: 'Создание записи', fn: testCreateArbitrator },
    { name: 'Получение по ID', fn: testGetArbitratorById },
    { name: 'Обновление записи', fn: testUpdateArbitrator },
    { name: 'Поиск по ИНН', fn: testFindByInn },
    { name: 'Поиск по номеру реестра', fn: testFindByRegistryNumber },
    { name: 'Получение статистики', fn: testGetStatistics },
    { name: 'Экспорт в Excel', fn: testExportExcel },
    { name: 'Экспорт в CSV', fn: testExportCsv },
    { name: 'Фильтрация и поиск', fn: testFiltering },
    { name: 'Удаление записи', fn: testDeleteArbitrator }
  ];

  const results = [];
  let passedTests = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
      if (result) passedTests++;
    } catch (error) {
      console.error(`❌ Критическая ошибка в тесте "${test.name}":`, error.message);
      results.push({ name: test.name, passed: false });
    }
  }

  // Итоговый отчет
  console.log('\n' + '=' * 80);
  console.log('📊 ИТОГОВЫЙ ОТЧЕТ');
  console.log('=' * 80);
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });

  console.log('\n📈 Результаты:');
  console.log(`✅ Пройдено: ${passedTests}/${tests.length}`);
  console.log(`❌ Провалено: ${tests.length - passedTests}/${tests.length}`);
  console.log(`📊 Процент успеха: ${Math.round((passedTests / tests.length) * 100)}%`);

  if (passedTests === tests.length) {
    console.log('\n🎉 Все тесты пройдены успешно! Интеграция модуля реестра работает корректно.');
  } else {
    console.log('\n⚠️ Некоторые тесты провалены. Проверьте настройки API и исправьте ошибки.');
  }

  return passedTests === tests.length;
}

// Запуск тестов
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Критическая ошибка:', error);
      process.exit(1);
    });
}

module.exports = { runTests };
