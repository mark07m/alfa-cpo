# Инструкция по подключению к базе данных MongoDB

## Варианты подключения

### 1. Локальная установка MongoDB

#### Установка MongoDB на macOS (через Homebrew):
```bash
# Установка MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# Запуск MongoDB
brew services start mongodb/brew/mongodb-community

# Проверка статуса
brew services list | grep mongodb
```

#### Установка MongoDB на Ubuntu/Debian:
```bash
# Импорт ключа MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Добавление репозитория
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Обновление пакетов и установка
sudo apt-get update
sudo apt-get install -y mongodb-org

# Запуск MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Установка MongoDB на Windows:
1. Скачайте MongoDB Community Server с [официального сайта](https://www.mongodb.com/try/download/community)
2. Запустите установщик и следуйте инструкциям
3. MongoDB будет установлен как служба Windows

### 2. MongoDB Atlas (Облачная база данных)

1. Зарегистрируйтесь на [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Создайте новый кластер (бесплатный tier M0)
3. Создайте пользователя базы данных
4. Получите строку подключения

### 3. Docker (Рекомендуется для разработки)

#### Запуск MongoDB в Docker:
```bash
# Запуск MongoDB в контейнере
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7.0

# Проверка статуса
docker ps | grep mongodb
```

#### Docker Compose (рекомендуется):
Создайте файл `docker-compose.yml` в корне проекта:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    container_name: sro-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: sro-au
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro

volumes:
  mongodb_data:
```

Запуск:
```bash
docker-compose up -d
```

## Настройка переменных окружения

### 1. Создайте файл `.env` в папке `sro-backend/`:

```env
# База данных
MONGODB_URI=mongodb://localhost:27017/sro-au
MONGODB_TEST_URI=mongodb://localhost:27017/sro-au-test

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRES_IN=7d

# Приложение
PORT=3001
NODE_ENV=development
API_PREFIX=api
CORS_ORIGIN=http://localhost:3000

# Файлы
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# Email (опционально)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AWS S3 (опционально)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Мониторинг
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

### 2. Для MongoDB Atlas используйте:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sro-au?retryWrites=true&w=majority
```

### 3. Для Docker с аутентификацией:
```env
MONGODB_URI=mongodb://admin:password@localhost:27017/sro-au?authSource=admin
```

## Инициализация базы данных

### 1. Установка зависимостей:
```bash
cd sro-backend
npm install
```

### 2. Запуск в режиме разработки:
```bash
npm run start:dev
```

### 3. Проверка подключения:
В логах должно появиться:
```
✅ DatabaseModule инициализирован успешно
Application is running on: http://localhost:3001/api
```

## Создание первого пользователя

### Через MongoDB Compass:
1. Установите [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Подключитесь к базе данных
3. Перейдите в коллекцию `users`
4. Создайте документ:

```json
{
  "email": "admin@sro.ru",
  "password": "$2b$10$rQZ8k9vX8k9vX8k9vX8k9e", // хеш пароля "admin123"
  "name": "Администратор",
  "role": "SUPER_ADMIN",
  "permissions": ["*"],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Через скрипт инициализации:
Создайте файл `sro-backend/scripts/init-db.js`:

```javascript
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sro-au');

// Схема пользователя
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR'], required: true },
  permissions: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    // Проверяем, есть ли уже админ
    const existingAdmin = await User.findOne({ email: 'admin@sro.ru' });
    if (existingAdmin) {
      console.log('✅ Администратор уже существует');
      return;
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Создаем админа
    const admin = new User({
      email: 'admin@sro.ru',
      password: hashedPassword,
      name: 'Администратор',
      role: 'SUPER_ADMIN',
      permissions: ['*'],
      isActive: true
    });

    await admin.save();
    console.log('✅ Администратор создан успешно');
    console.log('📧 Email: admin@sro.ru');
    console.log('🔑 Пароль: admin123');
  } catch (error) {
    console.error('❌ Ошибка при создании администратора:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();
```

Запуск скрипта:
```bash
cd sro-backend
node scripts/init-db.js
```

## Проверка подключения

### 1. Через API:
```bash
# Проверка health check
curl http://localhost:3001/api

# Попытка входа
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@sro.ru", "password": "admin123"}'
```

### 2. Через MongoDB Compass:
- Подключитесь к `mongodb://localhost:27017`
- Перейдите в базу данных `sro-au`
- Проверьте наличие коллекций

### 3. Через командную строку MongoDB:
```bash
# Подключение к MongoDB
mongosh

# Переключение на базу данных
use sro-au

# Просмотр коллекций
show collections

# Просмотр пользователей
db.users.find()
```

## Устранение проблем

### Ошибка подключения:
1. Проверьте, что MongoDB запущен
2. Проверьте правильность строки подключения
3. Проверьте права доступа к базе данных

### Ошибка аутентификации:
1. Проверьте правильность логина и пароля
2. Убедитесь, что пользователь активен
3. Проверьте хеш пароля

### Ошибка создания индексов:
1. Проверьте права на запись в базу данных
2. Убедитесь, что база данных не заблокирована
3. Проверьте логи приложения

## Резервное копирование

### Создание бэкапа:
```bash
# Создание дампа
mongodump --uri="mongodb://localhost:27017/sro-au" --out=./backup

# Восстановление из бэкапа
mongorestore --uri="mongodb://localhost:27017/sro-au" ./backup/sro-au
```

### Автоматический бэкап (cron):
```bash
# Добавьте в crontab
0 2 * * * /usr/bin/mongodump --uri="mongodb://localhost:27017/sro-au" --out=/backup/$(date +\%Y\%m\%d)
```

---

## Готово! 🎉

После выполнения этих шагов у вас будет:
- ✅ Работающая база данных MongoDB
- ✅ Настроенное приложение NestJS
- ✅ Созданный администратор
- ✅ Готовые API эндпоинты

Теперь можно запускать фронтенд и тестировать админ панель!
