const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testCardOperations() {
  console.log('🔍 Тестирование операций с карточкой арбитражного управляющего...\n');

  // Получаем ID первого арбитражного управляющего
  let testId = null;
  
  try {
    console.log('📋 Получение списка для выбора тестовой записи...');
    const listResponse = await axios.get(`${API_BASE_URL}/registry?limit=1`);
    if (listResponse.data.data && listResponse.data.data.length > 0) {
      testId = listResponse.data.data[0]._id;
      console.log(`✅ Найдена тестовая запись: ${testId}`);
      console.log(`   📝 ФИО: ${listResponse.data.data[0].fullName}`);
      console.log(`   📊 Номер в реестре: ${listResponse.data.data[0].registryNumber}`);
    } else {
      console.log('❌ Нет записей для тестирования');
      return;
    }
  } catch (error) {
    console.log(`❌ Ошибка получения списка: ${error.message}`);
    return;
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Тест 1: Получение карточки по ID
  try {
    console.log('🔍 Тест 1: Получение карточки по ID...');
    const getResponse = await axios.get(`${API_BASE_URL}/registry/${testId}`);
    console.log(`✅ Успешно получена карточка: ${getResponse.status} ${getResponse.statusText}`);
    console.log(`   📝 ФИО: ${getResponse.data.fullName}`);
    console.log(`   📊 Статус: ${getResponse.data.status}`);
    console.log(`   📧 Email: ${getResponse.data.email}`);
  } catch (error) {
    console.log(`❌ Ошибка получения карточки: ${error.response?.status || error.code} - ${error.message}`);
    if (error.response?.data) {
      console.log(`   📝 Детали: ${JSON.stringify(error.response.data)}`);
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Тест 2: Обновление карточки
  try {
    console.log('✏️ Тест 2: Обновление карточки...');
    const updateData = {
      fullName: 'Тестовый Арбитражный Управляющий (Обновлено)',
      phone: '+74951234567',
      email: 'test-updated@example.com'
    };
    
    const updateResponse = await axios.patch(`${API_BASE_URL}/registry/${testId}`, updateData);
    console.log(`✅ Успешно обновлена карточка: ${updateResponse.status} ${updateResponse.statusText}`);
    console.log(`   📝 Новое ФИО: ${updateResponse.data.fullName}`);
    console.log(`   📞 Новый телефон: ${updateResponse.data.phone}`);
    console.log(`   📧 Новый email: ${updateResponse.data.email}`);
  } catch (error) {
    console.log(`❌ Ошибка обновления карточки: ${error.response?.status || error.code} - ${error.message}`);
    if (error.response?.data) {
      console.log(`   📝 Детали: ${JSON.stringify(error.response.data)}`);
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Тест 3: Создание новой карточки для тестирования удаления
  let newTestId = null;
  try {
    console.log('➕ Тест 3: Создание новой карточки для тестирования удаления...');
    const createData = {
      fullName: 'Тестовый Управляющий Для Удаления',
      inn: '123456789012',
      registryNumber: 'АУ-ТЕСТ-001',
      phone: '+74951234567',
      email: 'test-delete@example.com',
      joinDate: '2024-01-01',
      status: 'active'
    };
    
    const createResponse = await axios.post(`${API_BASE_URL}/registry`, createData);
    newTestId = createResponse.data._id;
    console.log(`✅ Успешно создана новая карточка: ${createResponse.status} ${createResponse.statusText}`);
    console.log(`   🆔 ID: ${newTestId}`);
    console.log(`   📝 ФИО: ${createResponse.data.fullName}`);
  } catch (error) {
    console.log(`❌ Ошибка создания карточки: ${error.response?.status || error.code} - ${error.message}`);
    if (error.response?.data) {
      console.log(`   📝 Детали: ${JSON.stringify(error.response.data)}`);
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Тест 4: Удаление карточки (если создание прошло успешно)
  if (newTestId) {
    try {
      console.log('🗑️ Тест 4: Удаление карточки...');
      const deleteResponse = await axios.delete(`${API_BASE_URL}/registry/${newTestId}`);
      console.log(`✅ Успешно удалена карточка: ${deleteResponse.status} ${deleteResponse.statusText}`);
    } catch (error) {
      console.log(`❌ Ошибка удаления карточки: ${error.response?.status || error.code} - ${error.message}`);
      if (error.response?.data) {
        console.log(`   📝 Детали: ${JSON.stringify(error.response.data)}`);
      }
    }
  } else {
    console.log('⏭️ Тест 4: Пропущен (не удалось создать карточку для удаления)');
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Тест 5: Проверка, что карточка действительно удалена
  if (newTestId) {
    try {
      console.log('🔍 Тест 5: Проверка удаления карточки...');
      await axios.get(`${API_BASE_URL}/registry/${newTestId}`);
      console.log(`❌ Карточка не была удалена!`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`✅ Карточка успешно удалена (404 Not Found)`);
      } else {
        console.log(`❌ Неожиданная ошибка при проверке удаления: ${error.response?.status || error.code} - ${error.message}`);
      }
    }
  } else {
    console.log('⏭️ Тест 5: Пропущен (не было карточки для проверки)');
  }

  console.log('\n🏁 Тестирование завершено!');
}

testCardOperations().catch(console.error);
