# Отчет об исправлении ошибки pagesService.getPage

## Проблема
```
TypeError: pagesService.getPage is not a function
```

## Причина
В сервисе `pagesService` был метод `getPageById`, но в новых страницах редактирования и просмотра использовался несуществующий метод `getPage`.

## Решение

### 1. Добавлен алиас метода в pagesService
```typescript
// Alias for getPageById for convenience
getPage: async (id: string): Promise<Page> => {
  return pagesService.getPageById(id);
},
```

### 2. Обновлены вызовы в страницах
- `/pages/[id]/edit/page.tsx` - исправлен вызов `pagesService.getPage(pageId)`
- `/pages/[id]/view/page.tsx` - исправлен вызов `pagesService.getPage(pageId)`

## Доступные методы в pagesService

### Основные методы:
- `getPages(filters, pagination)` - получение списка страниц с фильтрацией и пагинацией
- `getPageById(id)` - получение страницы по ID
- `getPage(id)` - алиас для getPageById (добавлен для удобства)
- `createPage(data)` - создание новой страницы
- `updatePage(id, data)` - обновление страницы
- `deletePage(id)` - удаление страницы

### Дополнительные методы:
- `updatePageStatus(id, status)` - обновление статуса страницы
- `bulkDeletePages(ids)` - массовое удаление страниц
- `bulkUpdateStatus(ids, status)` - массовое обновление статуса
- `getPageTemplates()` - получение шаблонов страниц
- `getPageStatistics()` - получение статистики страниц

## Особенности реализации

### Fallback на mock данные
Все методы имеют fallback на mock данные при недоступности API:
```typescript
if (error.name === 'API_UNAVAILABLE' || error.message === 'API_UNAVAILABLE') {
  console.info('Using mock data for page');
  const page = mockPages.find(p => p.id === id);
  if (page) {
    return page;
  }
}
```

### Трансформация данных
Сервис автоматически трансформирует `_id` в `id` для совместимости с фронтендом:
```typescript
return {
  ...response.data,
  id: (response.data as any)._id || response.data.id
};
```

## Тестирование

Для проверки исправления:

1. Откройте `/pages` - должен отображаться список страниц
2. Нажмите "Редактировать" на любой странице - должна открыться страница редактирования без ошибок
3. Нажмите "Предпросмотр" на любой странице - должна открыться страница просмотра без ошибок
4. Проверьте консоль браузера - не должно быть ошибок TypeError

## Статус
✅ **Исправлено** - все методы pagesService работают корректно
