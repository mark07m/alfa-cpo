# Отчет об исправлении ошибки 403 при обновлении статуса новости

## Статус: ✅ ИСПРАВЛЕНО

Ошибка 403 (Forbidden) при попытке обновить статус новости успешно устранена.

## Анализ проблемы

### Симптомы
- При попытке обновить статус новости через админку возникала ошибка 403 (Forbidden)
- Ошибка происходила при запросе `PATCH /api/news/{id}/status`
- Токен авторизации передавался корректно

### Причина
Проблема была в backend коде в файле `sro-backend/src/content/news.controller.ts`:

1. **Отсутствие роли SUPER_ADMIN**: В декораторах `@Roles()` не была указана роль `SUPER_ADMIN`
2. **Неправильная логика авторизации**: Пользователи с ролью `SUPER_ADMIN` не могли выполнять операции с новостями, хотя у них есть все необходимые разрешения

### Детали исправления

#### 1. Исправление AuthContext (Frontend)
**Файл**: `admin-panel/src/contexts/AuthContext.tsx`
**Проблема**: Токены не сохранялись в localStorage при успешном логине
**Исправление**: Добавлено сохранение токенов в localStorage:

```typescript
// Сохраняем пользователя и токены в localStorage
localStorage.setItem('admin_user', JSON.stringify(normalizedUser))
localStorage.setItem('admin_token', response.data.token)
localStorage.setItem('admin_refresh_token', response.data.refreshToken)
```

#### 2. Исправление NewsController (Backend)
**Файл**: `sro-backend/src/content/news.controller.ts`
**Проблема**: Роль `SUPER_ADMIN` не была включена в список разрешенных ролей
**Исправление**: Добавлена роль `SUPER_ADMIN` во все защищенные endpoints:

```typescript
// До исправления
@Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)

// После исправления
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
```

**Исправленные endpoints**:
- `POST /api/news/categories` - создание категории новостей
- `PUT /api/news/categories/:id` - обновление категории новостей
- `DELETE /api/news/categories/:id` - удаление категории новостей
- `PATCH /api/news/:id` - обновление новости
- `PATCH /api/news/:id/status` - обновление статуса новости

## Результат

### ✅ Успешное тестирование
```bash
curl -X PATCH "http://localhost:3002/api/news/68e5c20c10fef872b0c32fef/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"status":"published"}'

# Ответ:
{
  "success": true,
  "data": {
    "_id": "68e5c20c10fef872b0c32fef",
    "status": "published",
    "updatedAt": "2025-10-08T02:28:04.206Z"
  },
  "message": "Статус новости успешно обновлен"
}
```

### ✅ Функциональность восстановлена
- Обновление статуса новостей работает корректно
- Все CRUD операции с новостями доступны для пользователей с ролью SUPER_ADMIN
- Токены авторизации сохраняются и передаются правильно

## Технические детали

### Роли и разрешения
- `SUPER_ADMIN`: Имеет все разрешения (включая `Permission.NEWS_UPDATE`)
- `ADMIN`: Имеет разрешения на управление новостями
- `MODERATOR`: Имеет ограниченные разрешения на новости
- `EDITOR`: Имеет базовые разрешения на новости

### Архитектура исправления
1. **Frontend**: Исправлена передача токенов авторизации
2. **Backend**: Исправлена логика проверки ролей в контроллерах
3. **API**: Все endpoints теперь корректно обрабатывают роль SUPER_ADMIN

## Заключение

Проблема была успешно устранена путем исправления логики авторизации как на frontend, так и на backend. Теперь админка полностью функциональна и позволяет пользователям с ролью SUPER_ADMIN выполнять все необходимые операции с новостями.

**Дата исправления**: 8 октября 2025 г.
**Статус**: Готово к использованию
