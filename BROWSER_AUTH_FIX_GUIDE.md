# 🔧 ИНСТРУКЦИЯ: Исправление ошибок аутентификации в браузере

## ❌ Проблема
В браузере возникают ошибки:
- `401 Unauthorized` - токен истек или отсутствует
- `403 Forbidden` - недостаточно прав доступа

## ✅ Решение

### Шаг 1: Очистите localStorage
1. Откройте **DevTools** (F12)
2. Перейдите на вкладку **Application** (или **Приложение**)
3. В левом меню выберите **Local Storage** → **http://localhost:3002**
4. Удалите следующие ключи:
   - `admin_token`
   - `admin_user`
   - `admin_refresh_token`

### Шаг 2: Перелогиньтесь
1. Перейдите на страницу входа: `http://localhost:3002/login`
2. Войдите с учетными данными:
   - **Email**: `testuser2@example.com`
   - **Password**: `test123`

### Шаг 3: Проверьте работу
1. Перейдите на страницу новостей: `http://localhost:3002/news`
2. Попробуйте изменить статус новости
3. Попробуйте отредактировать новость

## 🔍 Диагностика

### Проверка токена в DevTools
1. Откройте **Console** (F12)
2. Выполните команду:
   ```javascript
   console.log('Token:', localStorage.getItem('admin_token'));
   console.log('User:', localStorage.getItem('admin_user'));
   ```

### Проверка API запросов
1. Откройте **Network** (F12)
2. Попробуйте изменить статус новости
3. Проверьте, что запросы идут на `http://localhost:3002/api/news/...` (не на 3001)

## 🚨 Если проблемы сохраняются

### Вариант 1: Перезапуск серверов
```bash
# Остановить все процессы
pkill -f "nest start"
pkill -f "next dev"

# Запустить backend
cd sro-backend && npm run start:dev

# Запустить frontend (в новом терминале)
cd admin-panel && NEXT_PUBLIC_API_URL=http://localhost:3001/api NEXT_PUBLIC_FRONTEND_API_URL=/api NEXT_PUBLIC_USE_MOCK_DATA=false npm run dev -- -p 3002
```

### Вариант 2: Проверка переменных окружения
Убедитесь, что frontend запущен с правильными переменными:
- `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
- `NEXT_PUBLIC_FRONTEND_API_URL=/api`
- `NEXT_PUBLIC_USE_MOCK_DATA=false`

### Вариант 3: Проверка портов
- Backend должен работать на порту **3001**
- Frontend должен работать на порту **3002**
- API запросы должны идти через frontend API routes

## ✅ Ожидаемый результат

После выполнения инструкции:
- ✅ Вход в систему работает
- ✅ Токен сохраняется в localStorage
- ✅ API запросы идут через frontend API routes
- ✅ Обновление статуса новостей работает
- ✅ Редактирование новостей работает

## 📞 Поддержка

Если проблемы сохраняются, проверьте:
1. **Backend запущен** на порту 3001
2. **Frontend запущен** на порту 3002
3. **Переменные окружения** настроены правильно
4. **localStorage очищен** и пользователь перелогинен
