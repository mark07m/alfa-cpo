const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function debugJwtPayload() {
  try {
    console.log('🔍 Отладка JWT payload...\n');

    // Шаг 1: Логин
    console.log('🔐 Шаг 1: Логин...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@sro-au.ru',
      password: 'Admin123!'
    });

    const token = loginResponse.data.data.token;
    const user = loginResponse.data.data.user;
    
    console.log('✅ Логин успешен');
    console.log(`   👤 Пользователь: ${user.name}`);
    console.log(`   🎭 Роль: ${user.role}`);
    console.log(`   🔑 Разрешения: ${JSON.stringify(user.permissions || [])}`);

    // Шаг 2: Проверить профиль с исходным токеном
    console.log('\n🔍 Шаг 2: Проверка профиля с исходным токеном...');
    try {
      const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const profile = profileResponse.data.data;
      console.log('✅ Профиль получен');
      console.log(`   👤 Пользователь: ${profile.name}`);
      console.log(`   🎭 Роль: ${profile.role}`);
      console.log(`   🔑 Разрешения: ${JSON.stringify(profile.permissions || [])}`);
    } catch (profileError) {
      console.log('❌ Ошибка получения профиля:');
      console.log('   Статус:', profileError.response?.status);
      console.log('   Сообщение:', profileError.response?.data?.message);
      console.log('   Детали:', JSON.stringify(profileError.response?.data, null, 2));
    }

    // Шаг 3: Обновить токен
    console.log('\n🔄 Шаг 3: Обновление токена...');
    try {
      const refreshResponse = await axios.post(`${API_BASE}/auth/refresh`, {
        refreshToken: loginResponse.data.data.refreshToken
      });

      const newToken = refreshResponse.data.data.token;
      
      console.log('✅ Токен обновлен');
      console.log(`   Новый токен: ${newToken.substring(0, 20)}...`);

      // Шаг 4: Проверить профиль с новым токеном
      console.log('\n🔍 Шаг 4: Проверка профиля с новым токеном...');
      try {
        const newProfileResponse = await axios.get(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${newToken}` }
        });

        const newProfile = newProfileResponse.data.data;
        console.log('✅ Профиль с новым токеном получен');
        console.log(`   👤 Пользователь: ${newProfile.name}`);
        console.log(`   🎭 Роль: ${newProfile.role}`);
        console.log(`   🔑 Разрешения: ${JSON.stringify(newProfile.permissions || [])}`);
      } catch (newProfileError) {
        console.log('❌ Ошибка получения профиля с новым токеном:');
        console.log('   Статус:', newProfileError.response?.status);
        console.log('   Сообщение:', newProfileError.response?.data?.message);
        console.log('   Детали:', JSON.stringify(newProfileError.response?.data, null, 2));
      }

    } catch (refreshError) {
      console.log('❌ Ошибка обновления токена:');
      console.log('   Статус:', refreshError.response?.status);
      console.log('   Сообщение:', refreshError.response?.data?.message);
    }

    console.log('\n🎉 Отладка завершена!');

  } catch (error) {
    console.error('❌ Ошибка отладки:', error.response?.data?.message || error.message);
  }
}

debugJwtPayload();
