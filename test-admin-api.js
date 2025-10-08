const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testAdminAPI() {
  console.log('🔍 Тестирование API для админ панели...\n');

  const tests = [
    {
      name: 'Получение списка арбитражных управляющих',
      endpoint: '/registry',
      method: 'GET'
    },
    {
      name: 'Получение статистики реестра',
      endpoint: '/registry/statistics',
      method: 'GET'
    },
    {
      name: 'Экспорт в Excel',
      endpoint: '/registry/export/excel',
      method: 'GET'
    },
    {
      name: 'Экспорт в CSV',
      endpoint: '/registry/export/csv',
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`📋 ${test.name}...`);
      
      const response = await axios({
        method: test.method,
        url: `${API_BASE_URL}${test.endpoint}`,
        timeout: 5000
      });

      console.log(`✅ Успешно: ${response.status} ${response.statusText}`);
      
      if (test.endpoint === '/registry') {
        console.log(`   📊 Найдено записей: ${response.data.data?.length || 0}`);
        console.log(`   📄 Пагинация: ${JSON.stringify(response.data.pagination || {})}`);
      } else if (test.endpoint === '/registry/statistics') {
        console.log(`   📈 Статистика: ${JSON.stringify(response.data.data || {})}`);
      } else if (test.endpoint.includes('/export/')) {
        console.log(`   📁 Размер файла: ${response.data.length || 0} байт`);
      }
      
    } catch (error) {
      console.log(`❌ Ошибка: ${error.response?.status || error.code} - ${error.message}`);
      if (error.response?.data) {
        console.log(`   📝 Детали: ${JSON.stringify(error.response.data)}`);
      }
    }
    console.log('');
  }

  console.log('🏁 Тестирование завершено!');
}

testAdminAPI().catch(console.error);
