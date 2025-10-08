// Тест API подключения для админ панели
const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function testApiConnection() {
  console.log('🔍 Тестируем подключение к API...');
  
  try {
    // Тест 1: Health check
    console.log('1. Проверяем health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health:', healthResponse.data);
    
    // Тест 2: Аутентификация
    console.log('2. Тестируем аутентификацию...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'aaadmin@sro-au.ru',
      password: 'Admin123!'
    });
    console.log('✅ Login:', loginResponse.data.success ? 'Успешно' : 'Ошибка');
    
    const token = loginResponse.data.data.token;
    console.log('Token:', token ? token.substring(0, 20) + '...' : 'Нет токена');
    
    // Тест 3: Получение списка арбитражных управляющих
    console.log('3. Получаем список арбитражных управляющих...');
    const arbitratorsResponse = await axios.get(`${API_URL}/registry`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    console.log('✅ Arbitrators:', arbitratorsResponse.data.success ? 'Успешно' : 'Ошибка');
    console.log('Количество записей:', arbitratorsResponse.data.data?.length || 0);
    
    // Тест 4: Создание нового арбитражного управляющего
    console.log('4. Тестируем создание...');
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
    
    const createResponse = await axios.post(`${API_URL}/registry`, newManager, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    console.log('✅ Create:', createResponse.data.success ? 'Успешно' : 'Ошибка');
    
    console.log('🎉 Все тесты прошли успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testApiConnection();