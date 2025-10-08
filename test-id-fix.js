const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testIdFix() {
  console.log('🔍 Тестирование исправления ID...\n');

  try {
    // Тест 1: Получение списка
    console.log('📋 Тест 1: Получение списка арбитражных управляющих...');
    const listResponse = await axios.get(`${API_BASE_URL}/registry?limit=1`);
    
    if (listResponse.data.data && listResponse.data.data.length > 0) {
      const item = listResponse.data.data[0];
      console.log('✅ Список получен успешно');
      console.log(`   📝 ФИО: ${item.fullName}`);
      console.log(`   🆔 _id: ${item._id}`);
      console.log(`   📊 Номер в реестре: ${item.registryNumber}`);
      
      // Тест 2: Получение конкретной карточки
      console.log('\n🔍 Тест 2: Получение конкретной карточки...');
      const cardResponse = await axios.get(`${API_BASE_URL}/registry/${item._id}`);
      
      if (cardResponse.data.data) {
        console.log('✅ Карточка получена успешно');
        console.log(`   📝 ФИО: ${cardResponse.data.data.fullName}`);
        console.log(`   🆔 _id: ${cardResponse.data.data._id}`);
        console.log(`   📧 Email: ${cardResponse.data.data.email}`);
        console.log(`   📞 Телефон: ${cardResponse.data.data.phone}`);
        
        console.log('\n✅ Все тесты прошли успешно!');
        console.log('🎯 Теперь можно тестировать в браузере:');
        console.log(`   http://localhost:3002/registry/arbitrators/${item._id}`);
      } else {
        console.log('❌ Ошибка: данные карточки не найдены');
      }
    } else {
      console.log('❌ Ошибка: список пуст');
    }
  } catch (error) {
    console.log(`❌ Ошибка: ${error.response?.status || error.code} - ${error.message}`);
    if (error.response?.data) {
      console.log(`   📝 Детали: ${JSON.stringify(error.response.data)}`);
    }
  }
}

testIdFix().catch(console.error);
