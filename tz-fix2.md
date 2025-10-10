# ТЗ-фикс 2: Полный анализ и план поэтапного внедрения

Дата: 2025-10-09

Цель: выявить недостающие элементы в backend (`sro-backend`), админ-панели (`admin-panel`) и БД (MongoDB/Mongoose), а также составить пошаговый план работ так, чтобы после каждого этапа можно было запустить и проверить изменения. Эталон фронта — `sro-frontend` (не редактируем).

---

## 1) Резюме текущего состояния

- Backend (NestJS + Mongoose): реализованы модули `auth, users, news(+categories), documents, events(+types), registry(ArbitraryManager), pages, files, inspections, disciplinary-measures, settings`; глобальный префикс `/api`; единый формат ответов через `ResponseUtil`; JWT + роли/permissions; индексы создаются в `DatabaseModule` через `createIndexes`.
- Admin-panel (Next 15 / React 19 / Tailwind 3): сервисы вызывают реальные эндпоинты, но часть модулей все еще опирается на моковый fallback; базовый `apiService` с перехватчиками и единым контрактом; есть proxy-роуты в `src/app/api/*` (например, `registry`).
- БД (MongoDB/Mongoose): схемы для основных сущностей; `ArbitraryManager` содержит `unique` на `inn` и `registryNumber`.
- Эталон фронта (`sro-frontend`): современная структура и Tailwind v4 — эталон визуала/архитектуры, без требований к правкам сейчас.

---

## 2) Выявленные пробелы по слоям

### 2.1 Backend — отсутствующие/расходящиеся эндпоинты

- Новости (`news.controller.ts`) — соответствует ожиданиям админки, включая:
  - `GET /news/public`, `GET /news/search`, `GET /news/category/:category`, `PATCH /news/:id/status`, `DELETE /news/bulk` — есть.
- Документы (`documents.controller.ts`) — основной CRUD и публичные маршруты присутствуют:
  - `GET /documents/public`, `GET /documents/category/:category`, загрузка `/documents/upload`, bulk delete — есть.
  - Нет версионирования документов: админка ожидает:
    - `GET /documents/:id/versions`
    - `POST /documents/:id/versions`
    - `DELETE /documents/:id/versions/:versionId`
- Мероприятия (`events.controller.ts`) — основные маршруты есть (`GET list`, `GET :id`, `upcoming`, `featured`, `calendar`, `types`, `create/update/delete`). Нет маршрутов для участников, которые ожидает админка:
  - `GET /events/:eventId/participants`
  - `POST /events/:eventId/participants`
  - `PUT /events/:eventId/participants/:participantId`
  - `DELETE /events/:eventId/participants/:participantId`
  - `GET /events/:eventId/participants/export` (выгрузка CSV/XLSX)
- Реестр (`registry`) — покрыты поиск, статистика, экспорт/импорт; уникальные ключи в схеме есть.
- Аккредитованные организации — отсутствует модуль на бэке, тогда как админка вызывает:
  - `GET /accredited-organizations` (+ фильтры и пагинация)
  - `GET /accredited-organizations/:id`
  - `POST /accredited-organizations`
  - `PUT /accredited-organizations/:id`
  - `DELETE /accredited-organizations/:id`
  - `POST /accredited-organizations/bulk-delete`
  - `GET /accredited-organizations/stats`
  - `GET /accredited-organizations/check-inn?inn=...`
  - `GET /accredited-organizations/check-ogrn?ogrn=...`
  - `GET /accredited-organizations/check-accreditation-number?...`
  - `GET /accredited-organizations/export` (blob)
  - `GET /accredited-organizations/expiring-soon?days=30`
- Настройки (`settings.controller.ts`) — базовые `GET/PUT /settings`, `GET/PUT theme`, `GET seo`, `GET contact`, `PUT reset`, `GET history` — есть. Админ-сервис уже маппит структуру (`mapFromBackend`).

### 2.2 Admin-panel — несоответствия и заглушки

- `accreditedOrganizations.ts` — реализует вызовы к несуществующему сейчас бэкенд-модулю (см. список выше). В хук `useAccreditedOrganizations` в дев-режиме работает мок.
- `events.ts` — ожидает эндпоинты для участников и массового удаления событий (`DELETE /events/bulk`, `PATCH /events/:id/status`), которых нет в бэке.
- `documents.ts` — ожидает версионирование документов (`/versions` маршруты), отсутствующее в бэке.
- `menu.ts` — полностью моковый модуль, серверной реализации нет.
- Proxy-роуты Next (`src/app/api/registry/*`) есть для `registry`; аналогичных прокси для других модулей можно добавить по необходимости для dev.

### 2.3 БД — недостающие сущности/схемы

- Нет схемы и коллекции для аккредитованных организаций (AccreditedOrganization) и связанных справочников.
- Нет схемы участников мероприятия (если участников хранить отдельно) или структуры массива участников внутри `Event` с CRUD-операциями.
- Нет схемы версий документов (DocumentVersion) и связанного сервиса.

---

## 3) Поэтапный план работ с возможностью запуска после каждого этапа

Каждый этап заканчивается блоком проверки «Запустить и проверить».

### Этап 1. Модуль аккредитованных организаций (Backend + минимальная интеграция)
Статус: ✅ Выполнено (Backend) · ✅ Подключено в admin-panel (реальный API, id-маппинг)

Задачи:
- Создать модуль `accredited-organizations` на бэке:
  - Схема `AccreditedOrganization` (ключевые поля: `name, shortName?, inn(unique), kpp?, ogrn(unique), addresses, phone, email, website, directorName, accreditationNumber(unique), accreditationDate, accreditationExpiryDate, status(enum: active/suspended/revoked/expired), accreditationType(enum), services[], documents[], contacts[], createdBy, updatedBy, timestamps`).
  - DTO: `Create/Update`, `Query` с фильтрами (search, status, accreditationType, dateFrom/dateTo, region, pagination/sort).
  - Контроллер: маршруты как в админке (см. 2.1), единый `ResponseUtil` формат, guards/roles по аналогии с `registry`.
  - Сервис: выдача, фильтрация, пагинация; статистика; проверки уникальности; экспорт (CSV/XLSX); `expiring-soon`.
  - Индексы: `inn`, `ogrn`, `accreditationNumber` — уникальные; композитные индексы под поиск.
- Admin-panel: оставить текущий сервис, убрать жесткий dev-only путь в хук при наличии доступного API.

Запустить и проверить:
- Backend: `cd sro-backend && npm run start:dev` — проверить `GET /api/accredited-organizations` и CRUD через Postman; статусы 200/201/204.
- Admin-panel: `cd admin-panel && npm run dev` — открыть страницу организаций, убедиться, что данные приходят из API (без mock).

### Этап 2. Версионирование документов (Backend + частичная интеграция)
Статус: ✅ Выполнено (Backend) · ⏳ UI-проверка в процессе

Задачи:
- БД: ввести поддокументы или отдельную коллекцию `document_versions`:
  - Вариант A (поддокументы в `DocumentModel`): поле `versions: [{ version, fileUrl, fileName, mimeType, fileSize, changeLog?, createdAt, createdBy }]`.
  - Вариант B (отдельная коллекция): `DocumentVersion` с `documentId` (ref), плюс индексы.
- Контроллер `documents` добавить маршруты:
  - `GET /documents/:id/versions`
  - `POST /documents/:id/versions` (multipart upload версии)
  - `DELETE /documents/:id/versions/:versionId`
- Сервис: хранение версии, инкремент версии по умолчанию, валидация и ограничения.
- Admin-panel: `documents.ts` уже ожидает эти маршруты — просто проверить интеграцию.

Запустить и проверить:
- Backend: протестировать 3 новых маршрута для версий.
- Admin-panel: загрузка новой версии, список версий, удаление версии.

### Этап 3. Участники мероприятий и экспорт (Backend + интеграция в admin-panel)
Статус: ✅ Выполнено (Backend) · ⏳ UI-проверка в процессе

Задачи:
- БД: расширить `Event` или создать `EventParticipant`:
  - Вариант A: поддокументы внутри `Event.participants: [{ fullName, email, phone, registeredAt, status }]` + счетчики.
  - Вариант B: отдельная коллекция `event_participants` с ref на `Event`, индексы и ограничения.
- Контроллер `events` добавить маршруты:
  - `GET /events/:eventId/participants`
  - `POST /events/:eventId/participants`
  - `PUT /events/:eventId/participants/:participantId`
  - `DELETE /events/:eventId/participants/:participantId`
  - `GET /events/:eventId/participants/export` (CSV/XLSX)
- Сервис: CRUD участников, проверка `maxParticipants`, бизнес-правила регистрации/отмены.
- Admin-panel: маршруты уже ожидаются в `events.ts` — проверить работу.

Запустить и проверить:
- Backend: CRUD участников, ограничение по `maxParticipants`, экспорт.
- Admin-panel: список/добавление/редактирование/удаление участника, выгрузка.

### Этап 4. Массовые операции событий и статус
Статус: ✅ Выполнено (Backend) · ⏳ UI-проверка в процессе

Задачи:
- Контроллер `events` добавить:
  - `DELETE /events/bulk` — массовое удаление
  - `PATCH /events/:id/status` — смена статуса
- Сервис: валидация статусов (`draft|published|cancelled|completed`).
- Admin-panel: `events.ts` уже ожидает эти маршруты — проверить работу.

Запустить и проверить:
- Backend: Postman сценарии `bulk delete`, `update status`.
- Admin-panel: массовое удаление в UI, изменение статуса.

### Этап 5. Прокси-роуты Next (опционально для dev)
Статус: ⏳ Не требуется (опционально)

Задачи:
- Добавить в `admin-panel/src/app/api` прокси-роуты для проблемных модулей (по аналогии с `registry`), если требуется обходить CORS/куки в dev.
- Убедиться, что `NEXT_PUBLIC_API_URL` корректно задан в `.env.local`.

Запустить и проверить:
- `npm run dev` в `admin-panel`, убедиться в корректной проксификации и заголовках авторизации.

### Этап 6. Меню (опционально)
Статус: ⏳ Не выполнялось (опционально)

Задачи:
- Если требуется управление меню из админки: создать бэкенд-модуль `menu` (иерархия, порядок, публичное дерево). Иначе оставить мок для будущей итерации.

Запустить и проверить:
- CRUD меню, отображение дерева на фронте (при подключении).

---

## 4) Требуемые изменения БД (Модели/Индексы)

- `AccreditedOrganization` — новая коллекция; уникальные индексы: `inn`, `ogrn`, `accreditationNumber`.
- `DocumentVersion` — поддокументы или отдельная коллекция; индексы по `documentId`, `version`.
- `EventParticipant` — поддокументы или отдельная коллекция; индексы по `eventId`, `email/phone`.
- Проверить составные индексы для фильтров и поиска (search по имени/ИНН/ОГРН/номеру аккредитации в организациях).

---

## 5) Согласование контрактов и типизации в admin-panel

- Сервисы уже используют единый формат ответов через `apiService`; убедиться, что адаптеры корректно маппят `data`, `pagination`.
- `documents.ts`: проверить маппинг категорий из `GET /documents/categories` (сейчас конвертирует в UI-модель).
- `siteSettings.ts`: маппинг в `mapFromBackend` актуален к текущему бэку.

---

## 6) Окружение и запуск

- Backend: `.env` с `MONGODB_URI`, `JWT_SECRET`, `APP_PORT=3001`, `APP_API_PREFIX=api`, `CORS_ORIGIN`.
- Admin-panel: `.env.local` с `NEXT_PUBLIC_API_URL=http://localhost:3001/api` и `NEXT_PUBLIC_USE_MOCK_DATA=false` для модулей, которые готовы.
- При необходимости включить прокси `/app/api/*`.

Проверка:
- Backend: `cd sro-backend && npm run start:dev` — проверки здоровья `/api/health` и основных модулей.
- Admin-panel: `cd admin-panel && npm run dev` — визуальная проверка модулей после каждого этапа.

---

## 7) Критерии готовности по этапам

- Этап 1: ✅ Backend готов; UI подключён к API, проверки уникальности/экспорт работают.
- Этап 2: ✅ Backend готов; ⏳ UI-проверка.
- Этап 3: ✅ Backend готов; ⏳ UI-проверка.
- Этап 4: ✅ Backend готов; ⏳ UI-проверка.
- Этап 5: ⏳ Опционально, по необходимости.
- Этап 6: ⏳ Опционально, не выполнялось.

---

## 8) Краткий чек-лист «Запустить и проверить»

- Настроены `.env` в `sro-backend` и `.env.local` в `admin-panel`.
- `npm i` в корне модулей; запуск: `sro-backend` на 3001, `admin-panel` на 3000/3002.
- Для каждого этапа: пройти UI-скрины админки и ручки Postman согласно списку маршрутов.

---

## 9) Примечания

- Эталон `sro-frontend` остаётся неизменным.
- Формат ответов backend оставить унифицированным (`ResponseUtil`), не смешивать сырой ответ и обёртки.
- Если нужно, добавим Swagger/OpenAPI описание и сгенерируем актуальные Postman-коллекции после этапов 1–4.
