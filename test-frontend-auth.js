const axios = require('axios');

const FRONTEND_URL = 'http://localhost:3002';
const BACKEND_URL = 'http://localhost:3001/api';

async function testFrontendAuth() {
  console.log('🔐 Тестирование аутентификации через frontend API...\n');

  try {
    // 1. Регистрация пользователя через backend
    console.log('1. Регистрация пользователя...');
    const registerResponse = await axios.post(`${BACKEND_URL}/auth/register`, {
      email: `testuser${Date.now()}@example.com`,
      password: 'test123',
      firstName: 'Test',
      lastName: 'User'
    });
    
    const token = registerResponse.data.data.token;
    console.log('✅ Пользователь зарегистрирован, токен получен');

    // 2. Тестирование обновления новости через frontend API
    console.log('\n2. Тестирование обновления новости через frontend API...');
    
    // Сначала получим ID новости
    const newsResponse = await axios.get(`${BACKEND_URL}/news`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const newsId = newsResponse.data.data[0]._id;
    console.log(`📰 Найдена новость с ID: ${newsId}`);

    // Тестируем PUT запрос (обновление новости)
    console.log('\n3. Тестирование PUT запроса...');
    const putResponse = await axios.put(`${FRONTEND_URL}/api/news/${newsId}`, {
      title: 'Updated via Frontend PUT',
      status: 'published'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ PUT запрос успешен:', putResponse.data.success);

    // Тестируем PATCH запрос (обновление статуса)
    console.log('\n4. Тестирование PATCH запроса...');
    const patchResponse = await axios.patch(`${FRONTEND_URL}/api/news/${newsId}/status`, {
      status: 'draft'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ PATCH запрос успешен:', patchResponse.data.success);

    console.log('\n🎉 Все тесты прошли успешно!');

  } catch (error) {
    console.error('❌ Ошибка:', error.response?.data || error.message);
  }
}

testFrontendAuth();
