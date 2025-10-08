const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function debugTokenRefresh() {
  try {
    console.log('🔍 Отладка обновления токена и прав...\n');

    // Шаг 1: Логин
    console.log('🔐 Шаг 1: Логин...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@sro-au.ru',
      password: 'Admin123!'
    });

    const token = loginResponse.data.data.token;
    const refreshToken = loginResponse.data.data.refreshToken;
    const user = loginResponse.data.data.user;
    
    console.log('✅ Логин успешен');
    console.log(`   👤 Пользователь: ${user.name}`);
    console.log(`   🎭 Роль: ${user.role}`);
    console.log(`   🔑 Разрешения: ${JSON.stringify(user.permissions || [])}`);

    // Шаг 2: Обновить токен
    console.log('\n🔄 Шаг 2: Обновление токена...');
    try {
      const refreshResponse = await axios.post(`${API_BASE}/auth/refresh`, {
        refreshToken: refreshToken
      });

      const newToken = refreshResponse.data.data.token;
      const newRefreshToken = refreshResponse.data.data.refreshToken;
      
      console.log('✅ Токен обновлен');
      console.log(`   Новый токен: ${newToken.substring(0, 20)}...`);
      console.log(`   Новый refresh токен: ${newRefreshToken.substring(0, 20)}...`);

      // Шаг 3: Проверить профиль с новым токеном
      console.log('\n🔒 Шаг 3: Проверка профиля с новым токеном...');
      const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${newToken}` }
      });

      const profile = profileResponse.data.data;
      console.log('✅ Профиль получен');
      console.log(`   👤 Пользователь: ${profile.name}`);
      console.log(`   🎭 Роль: ${profile.role}`);
      console.log(`   🔑 Разрешения: ${JSON.stringify(profile.permissions || [])}`);

      // Шаг 4: Попробовать обновить арбитражного управляющего с новым токеном
      console.log('\n✏️ Шаг 4: Попытка обновления с новым токеном...');
      try {
        const updateData = {
          fullName: 'Тест с новым токеном',
          inn: '111111074121',
          registryNumber: 'АУ-100-121',
          phone: '74999999999',
          email: 'test-new-token@example.com',
          status: 'active',
          joinDate: '2020-01-15'
        };

        const updateResponse = await axios.patch(`${API_BASE}/registry/68e0542a6ef94ea45379b1a8`, updateData, {
          headers: { Authorization: `Bearer ${newToken}` }
        });

        console.log('✅ Обновление успешно');
        console.log('   Результат:', updateResponse.data.data.fullName);
      } catch (updateError) {
        console.log('❌ Ошибка обновления:');
        console.log('   Статус:', updateError.response?.status);
        console.log('   Сообщение:', updateError.response?.data?.message);
        console.log('   Детали:', JSON.stringify(updateError.response?.data, null, 2));
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

debugTokenRefresh();
