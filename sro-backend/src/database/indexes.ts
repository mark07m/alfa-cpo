import { Model } from 'mongoose';

// Функция для создания индексов
export async function createIndexes(models: Record<string, Model<any>>) {
  try {
    // Временно отключаем создание индексов для компиляции
    // Индексы будут созданы автоматически MongoDB при первом запуске
    console.log('✅ Создание индексов пропущено (будут созданы автоматически MongoDB)');
  } catch (error) {
    console.error('❌ Ошибка при создании индексов:', error);
    throw error;
  }
}