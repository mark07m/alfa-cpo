const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testAuthFix() {
  console.log('🔍 Тестирование исправления авторизации...\n');

  try {
    // Шаг 1: Логин
    console.log('🔐 Шаг 1: Логин...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'aaadmin@sro-au.ru',
      password: 'Admin123!'
    });

    if (loginResponse.data.success) {
      const token = loginResponse.data.data.token;
      console.log('✅ Логин успешен');
      console.log(`   🎫 Токен: ${token.substring(0, 20)}...`);
      console.log(`   👤 Пользователь: ${loginResponse.data.data.user.name}`);

      // Шаг 2: Тест защищенного эндпоинта
      console.log('\n🔒 Шаг 2: Тест защищенного эндпоинта...');
      const protectedResponse = await axios.get(`${API_BASE_URL}/registry`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (protectedResponse.data.success) {
        console.log('✅ Защищенный эндпоинт работает');
        console.log(`   📊 Найдено записей: ${protectedResponse.data.data.length}`);
      } else {
        console.log('❌ Ошибка защищенного эндпоинта');
      }

      // Шаг 3: Тест обновления записи
      console.log('\n✏️ Шаг 3: Тест обновления записи...');
      const updateResponse = await axios.patch(`${API_BASE_URL}/registry/68e0542a6ef94ea45379b1a8`, {
        fullName: 'Тестовый Арбитражный Управляющий (Обновлено)'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (updateResponse.data.success) {
        console.log('✅ Обновление записи работает');
        console.log(`   📝 Новое ФИО: ${updateResponse.data.data.fullName}`);
      } else {
        console.log('❌ Ошибка обновления записи');
      }

    } else {
      console.log('❌ Ошибка логина:', loginResponse.data.message);
    }

  } catch (error) {
    console.log(`❌ Ошибка: ${error.response?.status || error.code} - ${error.message}`);
    if (error.response?.data) {
      console.log(`   📝 Детали: ${JSON.stringify(error.response.data)}`);
    }
  }

  console.log('\n🏁 Тестирование завершено!');
  console.log('\n💡 Если все тесты прошли успешно, проблема в админ панели.');
  console.log('   Проверьте, что токен сохраняется в localStorage браузера.');
}

testAuthFix().catch(console.error);
