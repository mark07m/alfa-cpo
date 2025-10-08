const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
let authToken = null;
let testManagerId = null;
let testManagerInn = null;
let testManagerRegistryNumber = null;

// Функция для получения токена аутентификации
async function getAuthToken() {
  try {
    console.log('🔐 Получение токена аутентификации...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'aaadmin@sro-au.ru',
      password: 'Admin123!'
    });
    
    if (response.data.success && response.data.data.token) {
      authToken = response.data.data.token;
      console.log('✅ Токен получен:', authToken.substring(0, 20) + '...');
      return authToken;
    } else {
      throw new Error('Не удалось получить токен');
    }
  } catch (error) {
    console.error('❌ Ошибка получения токена:', error.response?.data || error.message);
    throw error;
  }
}

// Функция для создания заголовков с токеном
function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };
}

// 1. Тест получения списка арбитражных управляющих
async function testGetArbitrators() {
  try {
    console.log('\n📋 Тест 1: Получение списка арбитражных управляющих');
    const response = await axios.get(`${BASE_URL}/registry`);
    
    console.log('✅ Статус ответа:', response.status);
    console.log('📊 Данные ответа:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.data) {
      console.log(`✅ Найдено арбитражных управляющих: ${response.data.data.length}`);
      if (response.data.data.length > 0) {
        console.log('📝 Первый управляющий:', JSON.stringify(response.data.data[0], null, 2));
      }
    } else {
      console.log('⚠️ Проблема с форматом ответа');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка получения списка:', error.response?.data || error.message);
    throw error;
  }
}

// 2. Тест создания нового арбитражного управляющего
async function testCreateArbitrator() {
  try {
    console.log('\n➕ Тест 2: Создание нового арбитражного управляющего');
    
    const timestamp = Date.now();
    const newManager = {
      fullName: 'Тестовый Арбитражный Управляющий',
      inn: `${timestamp.toString().slice(-12)}`,
      registryNumber: `TEST-${timestamp}`,
      phone: '79991234567',
      email: `test-${timestamp}@arbitrator.ru`,
      region: 'Москва',
      city: 'Москва',
      status: 'active',
      joinDate: new Date().toISOString(),
      birthDate: '1980-01-01T00:00:00.000Z',
      birthPlace: 'г. Москва',
      registrationDate: new Date().toISOString(),
      decisionNumber: 'РЕШ-TEST-001',
      education: 'Высшее юридическое образование',
      workExperience: '5 лет работы в сфере банкротства',
      internship: 'Прохождение стажировки в арбитражном суде',
      examCertificate: 'СЕРТ-TEST-001',
      postalAddress: 'г. Москва, ул. Тестовая, д. 1, кв. 10'
    };
    
    const response = await axios.post(
      `${BASE_URL}/registry`,
      newManager,
      { headers: getAuthHeaders() }
    );
    
    console.log('✅ Статус ответа:', response.status);
    console.log('📊 Данные ответа:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.data) {
      testManagerId = response.data.data.id || response.data.data._id;
      testManagerInn = response.data.data.inn;
      console.log('✅ Арбитражный управляющий создан с ID:', testManagerId);
      console.log('✅ ИНН созданного управляющего:', testManagerInn);
    } else {
      console.log('⚠️ Проблема с созданием');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка создания:', error.response?.data || error.message);
    throw error;
  }
}

// 3. Тест получения конкретного арбитражного управляющего
async function testGetArbitratorById() {
  if (!testManagerId) {
    console.log('⚠️ Пропуск теста - нет ID управляющего');
    return;
  }
  
  try {
    console.log('\n🔍 Тест 3: Получение арбитражного управляющего по ID');
    const response = await axios.get(`${BASE_URL}/registry/${testManagerId}`);
    
    console.log('✅ Статус ответа:', response.status);
    console.log('📊 Данные ответа:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка получения по ID:', error.response?.data || error.message);
    throw error;
  }
}

// 4. Тест обновления арбитражного управляющего
async function testUpdateArbitrator() {
  if (!testManagerId) {
    console.log('⚠️ Пропуск теста - нет ID управляющего');
    return;
  }
  
  try {
    console.log('\n✏️ Тест 4: Обновление арбитражного управляющего');
    
    const updateData = {
      fullName: 'Обновленный Арбитражный Управляющий',
      status: 'suspended',
      phone: '79999999999',
      email: 'updated@arbitrator.ru',
      postalAddress: 'г. Москва, ул. Обновленная, д. 2, кв. 20',
      workExperience: '7 лет работы в сфере банкротства'
    };
    
    const response = await axios.patch(
      `${BASE_URL}/registry/${testManagerId}`,
      updateData,
      { headers: getAuthHeaders() }
    );
    
    console.log('✅ Статус ответа:', response.status);
    console.log('📊 Данные ответа:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка обновления:', error.response?.data || error.message);
    throw error;
  }
}

// 5. Тест поиска по ИНН
async function testFindByInn() {
  if (!testManagerInn) {
    console.log('⚠️ Пропуск теста - нет ИНН управляющего');
    return;
  }
  
  try {
    console.log('\n🔍 Тест 5: Поиск арбитражного управляющего по ИНН');
    const response = await axios.get(`${BASE_URL}/registry/inn/${testManagerInn}`);
    
    console.log('✅ Статус ответа:', response.status);
    console.log('📊 Данные ответа:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка поиска по ИНН:', error.response?.data || error.message);
    throw error;
  }
}

// 6. Тест поиска по номеру реестра
async function testFindByRegistryNumber() {
  try {
    console.log('\n🔍 Тест 6: Поиск арбитражного управляющего по номеру реестра');
    const response = await axios.get(`${BASE_URL}/registry/number/TEST-001`);
    
    console.log('✅ Статус ответа:', response.status);
    console.log('📊 Данные ответа:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка поиска по номеру реестра:', error.response?.data || error.message);
    throw error;
  }
}

// 7. Тест получения статистики
async function testGetStatistics() {
  try {
    console.log('\n📊 Тест 7: Получение статистики реестра');
    const response = await axios.get(`${BASE_URL}/registry/statistics`);
    
    console.log('✅ Статус ответа:', response.status);
    console.log('📊 Данные ответа:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка получения статистики:', error.response?.data || error.message);
    throw error;
  }
}

// 8. Тест удаления арбитражного управляющего
async function testDeleteArbitrator() {
  if (!testManagerId) {
    console.log('⚠️ Пропуск теста - нет ID управляющего');
    return;
  }
  
  try {
    console.log('\n🗑️ Тест 8: Удаление арбитражного управляющего');
    const response = await axios.delete(
      `${BASE_URL}/registry/${testManagerId}`,
      { headers: getAuthHeaders() }
    );
    
    console.log('✅ Статус ответа:', response.status);
    console.log('📊 Данные ответа:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка удаления:', error.response?.data || error.message);
    throw error;
  }
}

// 9. Тест без токена аутентификации
async function testWithoutAuth() {
  try {
    console.log('\n🔒 Тест 9: Попытка создания без токена аутентификации');
    const response = await axios.post(`${BASE_URL}/registry`, {
      fullName: 'Тест без токена',
      inn: '0000000000'
    });
    
    console.log('⚠️ Неожиданно успешный ответ:', response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Корректно отклонен запрос без токена (401)');
    } else {
      console.log('❌ Неожиданная ошибка:', error.response?.data || error.message);
    }
  }
}

// 10. Тест с неверным токеном
async function testWithInvalidToken() {
  try {
    console.log('\n🔒 Тест 10: Попытка создания с неверным токеном');
    const response = await axios.post(
      `${BASE_URL}/registry`,
      { fullName: 'Тест с неверным токеном' },
      { headers: { 'Authorization': 'Bearer invalid_token' } }
    );
    
    console.log('⚠️ Неожиданно успешный ответ:', response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Корректно отклонен запрос с неверным токеном (401)');
    } else {
      console.log('❌ Неожиданная ошибка:', error.response?.data || error.message);
    }
  }
}

// Основная функция тестирования
async function runAllTests() {
  console.log('🚀 Начинаем полное тестирование API арбитражных управляющих');
  console.log('=' * 60);
  
  try {
    // Получаем токен аутентификации
    await getAuthToken();
    
    // Запускаем все тесты
    await testGetArbitrators();
    await testCreateArbitrator();
    await testGetArbitratorById();
    await testUpdateArbitrator();
    await testFindByInn();
    await testFindByRegistryNumber();
    await testGetStatistics();
    await testDeleteArbitrator();
    
    // Тесты аутентификации
    await testWithoutAuth();
    await testWithInvalidToken();
    
    console.log('\n🎉 Все тесты завершены!');
    
  } catch (error) {
    console.error('\n💥 Критическая ошибка:', error.message);
  }
}

// Запускаем тесты
runAllTests();
