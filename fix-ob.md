# Полный аудит проекта (Части 1–5/5)

Документ разбит на 5 частей из‑за объёма. В этой части: аудит `sro-frontend` с акцентом на вставки HTML, вёрстку, доступность и качество кода. В последующих частях будут: админ‑панель, API/безопасность, база данных/схема и сквозные практики/DevOps.

## Оглавление (всего 5 частей)
- Часть 1 — sro-frontend: HTML-вставки, вёрстка, доступность, качество кода (ниже)
- Часть 2 — admin-panel: функциональные пробелы, унификация UI/форм/таблиц (ниже)
- Часть 3 — API и безопасность: контракты, валидация, права, CORS/Headers (ниже)
- Часть 4 — База данных: схема, связи, индексы, целостность, миграции (ниже)
- Часть 5 — Сквозные темы: производительность, кеширование, логи, DevOps, тесты (в конце файла)

---

## 1) sro-frontend — Использование HTML-вставок (dangerouslySetInnerHTML)

### Вывод по необходимости
Во фронтенде активно используется `dangerouslySetInnerHTML` для отображения контента из CMS/БД (HTML-строки). Это допустимо, если:
- HTML гарантированно проходит санитизацию до рендеринга (лучше на бэкенде, допустимо на фронте);
- набор допустимых тегов/атрибутов ограничен; ссылки обезопасены (`rel="noopener noreferrer"`, `target="_blank"` по политике);
- запрещены скрипты/инлайновые обработчики/опасные URI.

Сейчас в проекте нет единого компонента‑обёртки для безопасного рендеринга HTML. Поэтому практику оставляем, но переводим на безопасный, унифицированный способ (см. задачи ниже).

### Найденные места использования
1. `sro-frontend/src/app/about/page.tsx` — блок основного контента рендерит `page.content` через `dangerouslySetInnerHTML`.
2. `sro-frontend/src/app/about/history/page.tsx` — таймлайн/контент из CMS рендерится через HTML.
3. `sro-frontend/src/app/about/leadership/page.tsx` — HTML из CMS.
4. `sro-frontend/src/app/about/structure/page.tsx` — HTML из CMS.
5. `sro-frontend/src/app/labor-activity/page.tsx` — HTML из CMS (с `prose`).
6. `sro-frontend/src/app/accreditation/page.tsx` — HTML из CMS (с `prose`).
7. `sro-frontend/src/app/professional-development/page.tsx` — HTML из CMS (с `prose`).
8. `sro-frontend/src/app/terms/page.tsx` — HTML из CMS (с `prose prose-neutral`).
9. `sro-frontend/src/app/requisites/page.tsx` — HTML из CMS (с `prose`).
10. `sro-frontend/src/app/privacy/page.tsx` — HTML из CMS (с `prose prose-neutral`).
11. `sro-frontend/src/components/news/NewsDetail.tsx` — `news.content` через HTML.
12. `sro-frontend/src/components/events/EventDetail.tsx` — `event.content` через HTML.

Прямого использования `element.innerHTML = ...` не выявлено, только декларативный рендер React через `dangerouslySetInnerHTML`.

### Риски текущего подхода
- XSS: возможна инъекция скриптов или вредных атрибутов, если не санитизировать.
- Недетерминированная вёрстка: произвольный HTML может ломать сетку/типографику, выходить за рамки дизайна.
- Непоследовательность стилей: где-то есть `prose`, где-то нет, что ведёт к разным визуальным результатам.
- Невозможность подменять `<img>` на `next/image` → потери в производительности и SEO.

### Рекомендуемый целевой подход
1) Ввести единый компонент `SanitizedHtml` (например, `sro-frontend/src/components/common/SanitizedHtml.tsx`) с настройками — выполнено:
   - Санитизация HTML (на фронте) через `isomorphic-dompurify` (или `dompurify`) с белым списком тегов/атрибутов.
   - Принудительное добавление `rel="noopener noreferrer"` для внешних ссылок, управление `target`.
   - Опционально: парсинг и замена `<img>` на `<Image>` из `next/image` через `html-react-parser` для улучшения LCP/оптимизации.
   - Стандартная типографика через Tailwind Typography (`prose`) + классы по умолчанию.

2) Параллельно (и предпочтительнее): добавить санитизацию на бэкенде при сохранении/обновлении контента (см. Часть 3 — API). Фронтовая санитизация остаётся дополнительным барьером.

3) В долгосрочной перспективе для статических страниц — рассмотреть хранение в Markdown/MDX и рендер через `react-markdown` + remark плагины, чтобы минимизировать произвольный HTML.

### Задачи «что на что заменить» по файлам
Шаблон замены:
- Было: `(<div className="..." dangerouslySetInnerHTML={{ __html: content }} />)`
- Стало: `<SanitizedHtml html={content} className="..." />`

Список файлов:
- `sro-frontend/src/app/about/page.tsx`: заменить блок с `dangerouslySetInnerHTML` на `SanitizedHtml`. — выполнено
- `sro-frontend/src/app/about/history/page.tsx`: заменить на `SanitizedHtml`. — выполнено
- `sro-frontend/src/app/about/leadership/page.tsx`: заменить на `SanitizedHtml`. — выполнено
- `sro-frontend/src/app/about/structure/page.tsx`: заменить на `SanitizedHtml`. — выполнено
- `sro-frontend/src/app/labor-activity/page.tsx`: заменить на `SanitizedHtml` (сохранить класс `prose`). — выполнено
- `sro-frontend/src/app/accreditation/page.tsx`: заменить на `SanitizedHtml` (сохранить класс `prose`). — выполнено
- `sro-frontend/src/app/professional-development/page.tsx`: заменить на `SanitizedHtml` (сохранить класс `prose`). — выполнено
- `sro-frontend/src/app/terms/page.tsx`: заменить на `SanitizedHtml` (сохранить `prose prose-neutral max-w-none`). — выполнено
- `sro-frontend/src/app/requisites/page.tsx`: заменить на `SanitizedHtml` (сохранить `prose`). — выполнено
- `sro-frontend/src/app/privacy/page.tsx`: заменить на `SanitizedHtml` (сохранить `prose prose-neutral max-w-none`). — выполнено
- `sro-frontend/src/components/news/NewsDetail.tsx`: заменить на `SanitizedHtml` (класс `prose-lg max-w-none`). — выполнено
- `sro-frontend/src/components/events/EventDetail.tsx`: заменить на `SanitizedHtml` (класс `prose-lg max-w-none`). — выполнено

Дополнительно (опционально):
- Если контент содержит таблицы/цитаты/заголовки — расширить белый список тегов в `SanitizedHtml`.
- Если встречаются картинки в контенте — добавить трансформацию `<img>` → `<Image>` (через парсер), с ограничением размеров и `loading="lazy"`.

### Сопутствующие задачи по безопасности и политике
- Добавить CSP в `next.config.ts` (headers): запрет `unsafe-inline`, ограничение источников скриптов/изображений/шрифтов. — выполнено
- Включить `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (если нет потребности в iframe), `Referrer-Policy: strict-origin-when-cross-origin`. — выполнено
- Проверить, что `next-safe` или собственные заголовки применяются ко всем страницам. — выполнено

---

## 2) sro-frontend — Вёрстка и унификация интерфейса

### Наблюдения
- Использование Tailwind и типографики (`prose`) присутствует, но не везде последовательно.
- На разных страницах разная структура контента (header/lead/aside), что усложняет сопровождение и даёт визуальные расхождения.

### Рекомендации
1) Ввести стандартный шаблон «контентной страницы» (`ContentPageLayout`):
   - Заголовок/подзаголовок, хлебные крошки (если нужны), метаданные страницы.
   - Основной контейнер с `prose` и типографическими настройками.
   - Опциональные боковые панели (TOC/ссылки/акции).

2) Единая система отступов/сеток:
   - Базовые отступы секций: `py-8 md:py-12`, контейнер `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
   - Сетка для «контент + сайдбар»: `grid grid-cols-1 lg:grid-cols-3 gap-8`, где контент `lg:col-span-2`.

3) Типографика:
   - Настроить `tailwind.config.ts` для плагина `@tailwindcss/typography` (если ещё не включён) и определить тему `prose` (размеры h2/h3, цвета ссылок, список и т.д.).
   - На всех страницах с HTML‑контентом использовать единый класс `prose`/`prose-lg` + модификаторы `max-w-none`, `prose-neutral` при необходимости.

4) Компоненты карточек/секций:
   - Везде, где верстаются «карточки» с заголовком и контентом, использовать унифицированные `Card`, `CardHeader`, `CardContent` (уже применяются, но стоит стандартизировать порядок и отступы).

### Задачи
- Создать `src/components/layout/ContentPageLayout.tsx` и внедрить на контентных страницах (`about/*`, `labor-activity`, `accreditation`, `professional-development`, `terms`, `privacy`, `requisites`).
- Привести все контентные страницы к единому контейнеру и сетке (см. рекомендации выше).
- Настроить `tailwind.config.ts` для консистентной `prose`-темы.

---

## 3) sro-frontend — Доступность (a11y) и SEO-заметки

### Рекомендации
- Заголовочная иерархия: гарантировать единичный H1 на страницу, далее H2/H3 по семантике. В шаблоне `ContentPageLayout` зафиксировать H1.
- Ссылки в HTML‑контенте: принудительно добавлять `rel="noopener noreferrer"` и `target` по политике (через `SanitizedHtml`).
- Картинки из контента: нормализовать `alt`. Если используем парсер → подставлять безопасный `alt`/плейсхолдер.
- Цвета контраста и фокусы: проверить интерактивные элементы на контраст и наличие focus-стилей.
- Метаданные Next.js: использовать `generateMetadata`/`metadata` для title/description/og в страницах с контентом.

### Задачи
- В `SanitizedHtml` реализовать обработку ссылок и картинок.
- Проверить и исправить заголовочную иерархию на страницах `about/*`, `terms`, `privacy`, `requisites`.
- Добавить/уточнить `metadata` для ключевых страниц (title/description/og:image).

---

## 4) sro-frontend — Работа с API/сервисы (поверхностно)

Предварительный осмотр `src/services` показал корректную декомпозицию, но обычно не хватает:
- Единых перехватчиков ошибок и стандартных сообщений пользователю.
- Централизованной обработки токенов/401/403 (если не закрыто на уровне `axios` инстанса).
- Строгих типов ответов API (DTO типы, Zod-схемы для рантайм‑валидации, особенно для HTML‑контента).

### Задачи
- Ввести единый HTTP‑клиент с перехватчиками и обработкой 401/403/429.
- Для сервисов, возвращающих HTML‑контент, описать типы и санитизировать на стороне бэка (см. Часть 3) + фронтовая защита.
- Для публичных страниц добавить graceful‑fallback (скелетоны/плейсхолдеры) при ошибках сети.

---

## 5) sro-frontend — Контроль качества и тесты

### Рекомендации
- ESLint плагины: `eslint-plugin-security`, `eslint-plugin-jsx-a11y` — добавить/включить правила для a11y и безопасности.
- E2E‑тесты контента: проверить, что `<script>`/опасные атрибуты отбрасываются, ссылки получают `rel`, изображения не выходят за контейнер.
- Визуальные скриншот‑тесты для ключевых контентных страниц (Chromatic/Storybook или Playwright screenshots).

### Задачи
- Настроить a11y/security линтеры и исправить выявленные предупреждения.
- Добавить Playwright тесты для страниц, где рендерится HTML‑контент (проверка XSS/верстки/ссылок/таблиц).

---

## Итог по Часть 1/5
- Вставки HTML оправданы из‑за CMS, но должны быть строго санитизированы и унифицированы через общий компонент `SanitizedHtml` + CSP/заголовки безопасности.
- Контентные страницы привести к общему шаблону и типографике.
- Усилить a11y/SEO практики и добавить тесты/линтеры.

Далее (Часть 2/5): аудит админ‑панели — недостающие элементы, унификация форм/таблиц, Feature‑gap анализ по существующим отчётам и коду.

---

## Часть 2/5 — Admin Panel: функциональность, унификация, качество

Исходные материалы: код из `admin-panel/` и внутренние отчёты (`UNIFICATION_PROGRESS.md`, `SESSION_PROGRESS_REPORT.md`, `COMPLETE_UNIFICATION_SUMMARY.md`).

### 1) Использование HTML и WYSIWYG

Найдены места прямого рендера HTML и манипуляции DOM в редакторе:
- `admin-panel/src/app/events/[id]/page.tsx` — `dangerouslySetInnerHTML` для `selectedEvent.content`.
- `admin-panel/src/app/news/[id]/page.tsx` — предпросмотр содержит `dangerouslySetInnerHTML` для `news.content`.
- `admin-panel/src/components/admin/pages/PagePreview.tsx` — предпросмотр рендерит `page.content` через HTML.
- `admin-panel/src/components/admin/ui/WysiwygEditor.tsx` — прямые присваивания `innerHTML` в `editorRef` и в утилитарной функции.

Риски: XSS в предпросмотре/просмотре, расхождение разметки с фронтом, отсутствующая санитизация.

Задачи (что на что заменить):
- Ввести общий `SanitizedHtml` (см. Часть 1) и использовать его в предпросмотрах и страницах просмотра:
  - `admin-panel/src/app/events/[id]/page.tsx`: заменить блок `dangerouslySetInnerHTML` на `<SanitizedHtml html={selectedEvent.content} className="prose max-w-none" />`. — выполнено
  - `admin-panel/src/app/news/[id]/page.tsx`: аналогично заменить предпросмотр `news.content`. — выполнено
  - `admin-panel/src/components/admin/pages/PagePreview.tsx`: заменить `dangerouslySetInnerHTML` на `SanitizedHtml`. — выполнено
- Для `WysiwygEditor.tsx`:
  - Запретить прямые `innerHTML = ...` для внешнего ввода; использовать контролируемую модель данных + санитизацию при импорте/вставке HTML (если требуется).
  - Добавить кнопки вставки «очищенного» HTML, запрещая `<script>`, инлайновые обработчики, опасные URI.

### 2) Формы и валидация (React Hook Form + Zod)

Позитивно: формы широко используют `react-hook-form` и `zod` с `zodResolver` — это плюс к качеству.

Недочёты/задачи:
- Унифицировать оболочку полей: использовать общий `FormField`/`Input`/`Select`/`Textarea` для всех форм.
- Для полей типа «телефон», «ИНН/КПП/ОГРН», «даты» — добавить маски/подсказки и валидацию формата на UI, синхронизированную с бэкендом.
- В `PageForm`, `NewsForm`, `EventForm` — для поля `content` обеспечить санитизацию при сохранении (бэкенд) и безопасный предпросмотр (фронт).
- Добавить единый компонент отображения ошибок и статусов в формах, чтобы не дублировать разметку.

Конкретные файлы:
- `admin-panel/src/components/admin/news/NewsForm.tsx`: привести поля к `FormField` + добавить маски/ограничения длины в UI, предпросмотр с `SanitizedHtml`.
- `admin-panel/src/components/admin/events/EventForm.tsx`: унифицировать поля и массив `agenda` с `FormField` и валидацией времени/даты.
- `admin-panel/src/components/admin/pages/PageForm.tsx`: унифицировать поля, добавить предпросмотр через `SanitizedHtml`.
- `admin-panel/src/components/admin/accreditedOrganizations/AccreditedOrganizationForm.tsx`: добавить маски для ИНН/КПП/ОГРН, подсказки, единый компонент ошибок.
- `admin-panel/src/components/admin/arbitrators/ArbitratorForm.tsx`: маски и подсказки для ИНН/телефона/дат.

### 3) Таблицы, списки, фильтры

По отчётам, унификация в процессе. Требуется:
- Везде использовать единые компоненты `Table`, `FilterPanel`, `Pagination`.
- Убрать кастомные таблицы (`NewsList`, `InspectionsList`, и др.) в пользу общего интерфейса.
- Стандартизировать фильтры: поиск, селекты, диапазон дат, сброс.

Конкретные задачи:
- Переподключить страницы списков: `/news`, `/events`, `/documents`, `/inspections`, `/pages`, `/disciplinary-measures`, `/registry/*` к общим компонентам.
- Для каждой таблицы: зафиксировать колонки, сортировку, пустые состояния, скелетоны.

### 4) Авторизация/сессии/обновление токенов

Найдены механизмы `axios.create`, request/response interceptors, `refreshToken` хранится в `localStorage` (`admin-panel/src/services/admin/api.ts`, `AuthContext.tsx`).

Риски/замечания:
- Хранение `refreshToken` в `localStorage` уязвимо для XSS. Лучше использовать HttpOnly secure cookie.
- Нужна централизованная обработка 401/403/429, дебаунс рефреш‑запросов (single‑flight), очереди повторов.

Задачи:
- Перевести `refreshToken` на HttpOnly cookie (бэкенд + фронт), оставить в памяти только `accessToken`.
- В `AuthContext` убрать логи с фрагментами токенов и сократить экспонирование `refreshToken` в состояние.
- Обеспечить лог‑аут на всех вкладках (BroadcastChannel) при неуспешном рефреше.

### 5) Предпросмотры/детальные страницы

Страницы `/events/[id]`, `/news/[id]`, `PagePreview` используют raw HTML. Задачи по замене — см. «Использование HTML» выше.
Дополнительно:
- Стандартизировать `PageHeader`/`ActionButtons`/`ConfirmDialog` на всех страницах просмотра.
- Проверить, что все детальные страницы имеют единый макет, единые отступы и типографику.

### 6) Доступность и SEO

Задачи:
- Единая иерархия заголовков, aria‑атрибуты для кнопок табличных действий, фокус‑видимость.
- Метаданные страниц админки (title) и понятные заголовки разделов.

### 7) Перечень конкретных задач (по файлам)

- `admin-panel/src/app/events/[id]/page.tsx`: заменить предпросмотр контента на `SanitizedHtml`; применить `PageHeader`, унифицировать кнопки.
- `admin-panel/src/app/news/[id]/page.tsx`: аналогично.
- `admin-panel/src/components/admin/pages/PagePreview.tsx`: заменить на `SanitizedHtml` и добавить типографику.
- `admin-panel/src/components/admin/ui/WysiwygEditor.tsx`: убрать прямые `innerHTML`, добавить санитизацию импорта/вставки HTML, контролируемую модель.
- `admin-panel/src/components/admin/news/NewsForm.tsx`: унифицировать поля, предпросмотр контента, единый вывод ошибок, маски.
- `admin-panel/src/components/admin/events/EventForm.tsx`: унифицировать поля, валидацию дат/времени, предпросмотр.
- `admin-panel/src/components/admin/pages/PageForm.tsx`: унифицировать поля, предпросмотр.
- `admin-panel/src/components/admin/accreditedOrganizations/AccreditedOrganizationForm.tsx`: маски ИНН/КПП/ОГРН, подсказки.
- `admin-panel/src/components/admin/arbitrators/ArbitratorForm.tsx`: маски ИНН/телефон/даты, подсказки.
- Список страниц: `/news`, `/events`, `/documents`, `/inspections`, `/pages`, `/disciplinary-measures`, `/registry/*` — подключить `FilterPanel`/`Table`/`Pagination`.

### 8) Метрики качества и тесты

- Линт a11y/security для админки (аналогично фронту).
- E2E для форм: успешное сохранение/ошибка валидации/предпросмотр контента.
- Снапшот‑тесты таблиц (колонки/сортировка/пагинация) и визуальные тесты ключевых страниц.

---

## Часть 3/5 — API и безопасность (NestJS)

### 1) Глобальная валидация, CORS, префикс
В `sro-backend/src/main.ts` уже включены:
- `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` — хорошо.
- `enableCors` с `origin` по окружению, `credentials: true`, заголовки — корректно.
- `setGlobalPrefix('api')` — единый префикс.

Задачи:
- Уточнить список `allowedHeaders` (добавить `X-Request-Id` при необходимости) и `exposedHeaders` (например, `Content-Length`).
- Добавить глобальные security‑middleware: `helmet` (CSP, frameguard, noSniff), rate limit для публичных endpoint.

### 2) Аутентификация и refresh токены
Найдено:
- `AuthController` (`/auth/login`, `/auth/refresh`, `/auth/logout`) и `AuthService.refreshTokens` с отзывом старого refresh токена.
- `RefreshTokenService` хранит refresh токены в коллекции Mongo (`refresh-token.schema.ts`) с `expiresAt`, `isRevoked`, `ipAddress`, `userAgent`.
- В админке сейчас `refreshToken` хранится в `localStorage` — это риск XSS (см. Часть 2).

Задачи (API + фронт вместе):
- Перейти на HttpOnly Secure SameSite=Lax/Strict cookie для `refreshToken`:
  - В `AuthController.login` и `refresh` — выставлять/обновлять cookie; тело ответа не возвращать refresh токен.
  - В `logout` — стирать cookie на клиенте и отзывать токен в БД.
  - В админке — убрать хранение `refreshToken` в `localStorage`.
- В `RefreshTokenService.generateRefreshToken` сократить срок жизни до 3–7 дней и добавить ротацию при каждом refresh (уже есть отзыв старого — оставить).
- Защититься от параллельных refresh запросов: серверная дедупликация (single‑flight) по паре `(userId, userAgent)`, ответ 409 при гонках.

Конкретные файлы:
- `sro-backend/src/auth/auth.controller.ts`: добавить установку/удаление HttpOnly cookie; скрыть refresh в ответе.
- `sro-backend/src/auth/auth.service.ts`: без изменений по логике, но учесть отсутствие refresh в теле ответа.
- `admin-panel/src/services/admin/api.ts`: обновить интерактор для refresh по cookie (без тела с токеном).
- `admin-panel/src/contexts/AuthContext.tsx`: убрать чтение refresh из `localStorage`.

### 3) Санитизация HTML на бэкенде
Найдено: `PagesService`/`CreatePageDto`/`News`/`Event` хранят `content` как строку. Санитизация отсутствует (по grep `sanitize` не найдено).

Задачи:
- Ввести серверную санитизацию HTML при сохранении/обновлении в модулях `pages`, `news`, `events`:
  - Добавить утилиту `sanitizeHtml(content: string): string` с `sanitize-html` или `isomorphic-dompurify` в `sro-backend/src/common/utils/sanitize.util.ts`.
  - В `pages.service.ts` при `create`/`update` пропускать `dto.content` через санитайзер.
  - Аналогично в сервисах `news`, `events` (если `content` используется).
- Опционально: ввести белый список тегов/атрибутов и запрет `<script>`, `on*`‑атрибутов, `javascript:` URI.

Конкретные файлы:
- `sro-backend/src/pages/pages.service.ts`: санитизировать `createPageDto.content` и `updatePageDto.content`.
- `sro-backend/src/news/news.service.ts` (если есть): санитизировать `content`.
- `sro-backend/src/events/events.service.ts`: санитизировать `content`.

### 4) Гварды/Роли/Права
Найдено: `JwtAuthGuard`, `RolesGuard` с проверкой `UserRole` и `ROLE_PERMISSIONS`.

Задачи:
- Проверить применение `@UseGuards(JwtAuthGuard, RolesGuard)` на административных маршрутах (`files`, `documents`, `pages` CRUD). Убедиться, что чтение публичных ресурсов без гвардов действительно публичное.
- Логирование отказов (403/401) и интеграция с `LoginAttempt`/`BlockedIp` при брутфорсах.

### 5) Upload/Files
`FilesController` и `FilesService` используют memory storage, валидируют mimetype, лимит размера. Хорошо.

Задачи:
- Вынести список поддерживаемых типов в конфиг и переиспользовать в `documents`/`files`.
- Включить обработку изображений (sharp) с try/catch и опцией отключения через конфиг.
- Добавить проверку вирусов/сканер (опционально, по инфраструктуре).

---

## Часть 4/5 — База данных (Mongoose)

### 1) Индексы и целостность
Сейчас `createIndexes` отключен (лог: «создание индексов пропущено»). Полезные индексы есть в схемах (`unique`, частичные индексы PageSchema).

Риски:
- При больших объёмах коллекций производительность деградирует без явного создания индексов.

Задачи:
- Включить создание индексов на старте: заменить `createIndexes` на вызовы `model.syncIndexes()` или по месту `Schema.index(...)` + `Model.createIndexes()` один раз на инициализации.
- Проверить/добавить индексы:
  - `Page.slug` — уже `unique` (ок).
  - `PageSchema` частичный индекс по `template` + `isCategoryMain` (ок).
  - `AccreditedOrganization.inn`, `ogrn`, `accreditationNumber` — уже `unique, index` (ок).
  - `News.publishedAt` — добавить индекс `{ publishedAt: -1 }` для списков.
  - `Event.startDate`, `Event.status` — добавить составные индексы по дате/статусу.
  - `DocumentModel.category`, `isPublic`, `uploadedAt` — добавить индексы для публичных списков/фильтров.
  - `RefreshToken.token` — `unique` (ок), добавить TTL‑индекс по `expiresAt`.
  - `PasswordResetToken.token` — `unique` (ок), TTL по `expiresAt`.
  - `LoginAttempt` — индексы по `createdAt`, `ipAddress` уже есть.

### 2) Схемы и связи
- Все ссылки `createdBy`/`updatedBy` — есть, требуется единая политика каскадного удаления/чистки связанных данных (по операциям из админки).
- Для вложенных массивов (версии документов, участники событий) — рассмотреть вынесение в отдельные коллекции при росте объёма.

### 3) Миграции
- Зафиксировать миграции индексов и новых полей через инструмент (например, `migrate-mongo` или скрипты `scripts/`), чтобы деплой был повторяемым.

### 4) Данные для поиска
- Для `News`/`Pages` с HTML контентом — сохранить plain‑text версию для полнотекстового поиска (отдельное поле), либо использовать `text`‑индексы с осторожностью.

---

## Часть 5/5 — Сквозные темы: производительность, кеш, логи, DevOps, тесты

### 1) Производительность фронта (Next.js)
- В `sro-frontend/next.config.ts` включены `ignoreDuringBuilds` для ESLint/TS — ускоряет билд, но скрывает ошибки. Рекомендация: включить проверки в CI, а локально оставить флаг.
- Добавить `headers()` в `next.config.ts` для security‑заголовков (CSP, frameguard) и кеширования статических ассетов (long‑term cache с `immutable`).
- Проверить использование `next/image` везде, где возможно, и домены изображений.
- Включить `react cache`/RTK‑кеш или SWR для публичных списков; мемоизация тяжёлых компонентов.

Задачи:
- `sro-frontend/next.config.ts`: добавить `async headers()` с CSP, `Strict-Transport-Security`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`.
- Аудит изображений и переход на `next/image` там, где ещё нет.
- Включить автоматический prefetch критичных маршрутов и lazy‑load для второстепенных блоков.

### 2) Производительность и кеш API (NestJS)
- Не найдено подключения `CacheModule`/`CacheInterceptor`. Публичные эндпоинты (новости, страницы, список документов) можно кешировать на 30–120 сек с инвалидацией по событиям.

Задачи:
- Подключить `CacheModule.register` (in‑memory или Redis) и `APP_INTERCEPTOR: CacheInterceptor` для публичных GET.
- Добавить ручную инвалидацию кеша при изменениях контента (создание/обновление/удаление).

### 3) Безопасность серверной платформы
- Не найдено `helmet`, глобального rate‑limit (есть кастомный guard для логина). Рекомендуется `helmet` (+CSP), общий rate‑limiting (IP+route), `express-rate-limit` или Nest Throttler.

Задачи:
- В `main.ts`: подключить `helmet()` c настройками CSP; подключить `ThrottlerModule` (или middleware) для /auth/* и публичных GET.
- Логи 4xx/5xx вынести в централизованный логгер (см. ниже).

### 4) Логирование и трассировка
- Есть `LoginLoggerService` и `FileLoggerService`. Нет централизованного структурированного логгера (winston/pino), трассировки запросов, корелляции `X-Request-Id`.

Задачи:
- Ввести `nestjs-pino` или `nestjs-winston` с JSON‑логами; добавить middleware для `X-Request-Id` и логирования начала/окончания запросов.
- Протоколировать медленные запросы (>1s), таймауты, ошибки с контекстом пользователя/маршрута.

### 5) CI/CD и качество
- Включить линтер/тайпчекеры в CI (отключены в next.config локально); запуск unit/E2E тестов.
- Артефакты: сборка докер‑образов для фронта/бэка, .env шаблоны, секреты в CI.

Задачи:
- GitHub Actions/GitLab CI: job'ы для lint/typecheck/test/build, docker build/push, деплой.
- Генерация `.env.example` и проверок наличия обязательных переменных.

### 6) Мониторинг и алерты
- Добавить health‑чек (`/api/health`) и метрики (Prometheus) на бэке.
- Веб‑виталии (Core Web Vitals) — подключить отчётность (например, `next/web-vitals` + отправка на бэкенд).

Задачи:
- Nest: контроллер `/health` + интеграция `@godaddy/terminus` или `@nestjs/terminus`.
- Экспорт метрик `/metrics` (если допустимо), алерты по SLA.

### 7) Тестирование
- Unit: сервисы (`pages`, `news`, `events`, `files`, `documents`).
- E2E: сценарии авторизации, CRUD админки, публичные страницы и XSS‑контент.
- Визуальные: скриншоты ключевых страниц (фронт + админка).

Задачи:
- Настроить Playwright E2E (публичные маршруты, админ логин/редактирование);
- Jest unit для сервисов, моков БД;
- Визуальные сравнения для лендингов и карточек контента.




