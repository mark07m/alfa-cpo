/**
 * Утилиты для работы с датами
 * Обеспечивают консистентное форматирование на сервере и клиенте
 */

/**
 * Форматирует дату в российском формате (ДД.ММ.ГГГГ)
 * @param dateString - строка с датой в ISO формате
 * @returns отформатированная дата или "Неизвестно" при ошибке
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
      return 'Неизвестно';
    }
    
    // Форматируем вручную для избежания проблем с гидратацией
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Неизвестно';
  }
};

/**
 * Форматирует дату и время в российском формате
 * @param dateString - строка с датой в ISO формате
 * @returns отформатированная дата и время или "Неизвестно" при ошибке
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Неизвестно';
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  } catch (error) {
    console.warn('Error formatting datetime:', error);
    return 'Неизвестно';
  }
};

/**
 * Проверяет, является ли строка валидной датой
 * @param dateString - строка для проверки
 * @returns true, если строка является валидной датой
 */
export const isValidDate = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Получает относительное время (например, "2 дня назад")
 * @param dateString - строка с датой в ISO формате
 * @returns относительное время или "Неизвестно" при ошибке
 */
export const getRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Неизвестно';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'только что';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} мин. назад`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ч. назад`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} дн. назад`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} мес. назад`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} г. назад`;
  } catch (error) {
    console.warn('Error getting relative time:', error);
    return 'Неизвестно';
  }
};
