### Аудит sro-frontend: вставки HTML, безопасность и качество кода

#### Резюме (важное)
- Использование raw HTML (`dangerouslySetInnerHTML`) встречается на многих страницах (контент из CMS). Это допустимо по назначению, но сейчас отсутствует санитизация HTML → риск XSS.
- Рекомендуется ввести единый компонент `SafeHtml` с санитизацией (`isomorphic-dompurify`) и автоправкой ссылок (`target="_blank"` + `rel="noopener noreferrer"`).
- Страницы с контентом загружаются на клиенте через `useEffect` → теряется SSR/SEO. Лучше конвертировать в серверные компоненты с server-side fetch и `generateMetadata`.
- В коде есть множественные `any` в сервисах, отключены проверки `eslint`/`typescript` на билде. Рекомендуется ужесточить типизацию и включить проверки.

---

### Где используется raw HTML и зачем
Контент страниц и сущностей (новости, мероприятия) приходит из backend/CMS в формате HTML. Для корректного отображения форматированного текста это ожидаемо. Однако необходимо:
- Санитизировать HTML перед вставкой.
- Принудительно добавлять безопасные атрибуты к внешним ссылкам.
- Опционально ограничить белый список тэгов и атрибутов.

Ниже — перечень мест с прямой вставкой HTML. Примеры из кода:

```46:51:/Users/levimordehay/Downloads/alfa-cpo.ru/sro-frontend/src/app/about/page.tsx
{page?.content ? (
  <div dangerouslySetInnerHTML={{ __html: page.content }} />
) : (
```

```262:267:/Users/levimordehay/Downloads/alfa-cpo.ru/sro-frontend/src/components/events/EventDetail.tsx
{event.content && (
  <div 
    className="prose prose-lg max-w-none mb-8"
    dangerouslySetInnerHTML={{ __html: event.content }}
  />
)}
```

Полный список (страница → файл → что сейчас):
- О нас → `src/app/about/page.tsx` → `<div dangerouslySetInnerHTML={{ __html: page.content }} />`
- История → `src/app/about/history/page.tsx` → `<div dangerouslySetInnerHTML={{ __html: page.content }} />`
- Руководство → `src/app/about/leadership/page.tsx` → `<div dangerouslySetInnerHTML={{ __html: page.content }} />`
- Структура → `src/app/about/structure/page.tsx` → `<div dangerouslySetInnerHTML={{ __html: page.content }} />`
- Аккредитация → `src/app/accreditation/page.tsx` → `<div className="prose" dangerouslySetInnerHTML={{ __html: page.content }} />`
- Контроль → `src/app/control/page.tsx` → `<div className="prose" dangerouslySetInnerHTML={{ __html: page?.content || '' }} />`
- Трудовая деятельность → `src/app/labor-activity/page.tsx` → `<div className="prose mb-12" dangerouslySetInnerHTML={{ __html: page.content }} />`
- Политика конфиденциальности → `src/app/privacy/page.tsx` → `<div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />`
- Условия использования → `src/app/terms/page.tsx` → `<div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />`
- Реквизиты → `src/app/requisites/page.tsx` → `<div className="prose" dangerouslySetInnerHTML={{ __html: page.content }} />`
- Новость (детальная) → `src/components/news/NewsDetail.tsx` → `<div className="prose ..." dangerouslySetInnerHTML={{ __html: news.content }} />`
- Мероприятие (детальная) → `src/components/events/EventDetail.tsx` → `<div className="prose ..." dangerouslySetInnerHTML={{ __html: event.content }} />`

Прямого `element.innerHTML = ...` в проекте не обнаружено. Библиотек для санитизации (DOMPurify/sanitize-html) также нет.

Вывод по необходимости: для страниц и сущностей, контент которых управляется из CMS, вставка HTML необходима. Но её нужно делать безопасно и единообразно.

---

### Что нужно исправить (по пунктам, по файлам)
Подход: заменить прямую вставку HTML на унифицированный компонент `SafeHtml` со встроенной санитизацией.

1) О нас — `src/app/about/page.tsx`
   - Было: `dangerouslySetInnerHTML={{ __html: page.content }}`
   - Стало: обернуть в `<SafeHtml html={page.content} className="prose" />`

2) История — `src/app/about/history/page.tsx`
   - Было: `dangerouslySetInnerHTML={{ __html: page.content }}`
   - Стало: `<SafeHtml html={page.content} className="prose" />`

3) Руководство — `src/app/about/leadership/page.tsx`
   - Было: `dangerouslySetInnerHTML={{ __html: page.content }}`
   - Стало: `<SafeHtml html={page.content} className="prose" />`

4) Структура — `src/app/about/structure/page.tsx`
   - Было: `dangerouslySetInnerHTML={{ __html: page.content }}`
   - Стало: `<SafeHtml html={page.content} className="prose" />`

5) Аккредитация — `src/app/accreditation/page.tsx`
   - Было: `<div className="prose" dangerouslySetInnerHTML={{ __html: page.content }} />`
   - Стало: `<SafeHtml html={page.content} className="prose" />`

6) Контроль — `src/app/control/page.tsx`
   - Было: `<div className="prose" dangerouslySetInnerHTML={{ __html: page?.content || '' }} />`
   - Стало: `<SafeHtml html={page?.content || ''} className="prose" />`

7) Трудовая деятельность — `src/app/labor-activity/page.tsx`
   - Было: `<div className="prose mb-12" dangerouslySetInnerHTML={{ __html: page.content }} />`
   - Стало: `<SafeHtml html={page.content} className="prose mb-12" />`

8) Политика конфиденциальности — `src/app/privacy/page.tsx`
   - Было: `<div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />`
   - Стало: `<SafeHtml html={page.content} className="prose prose-neutral max-w-none" />`

9) Условия использования — `src/app/terms/page.tsx`
   - Было: `<div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />`
   - Стало: `<SafeHtml html={page.content} className="prose prose-neutral max-w-none" />`

10) Реквизиты — `src/app/requisites/page.tsx`
    - Было: `<div className="prose" dangerouslySetInnerHTML={{ __html: page.content }} />`
    - Стало: `<SafeHtml html={page.content} className="prose" />`

11) Новость (детальная) — `src/components/news/NewsDetail.tsx`
    - Было: `<div className="prose ..." dangerouslySetInnerHTML={{ __html: news.content }} />`
    - Стало: `<SafeHtml html={news.content} className="prose prose-lg max-w-none mb-8" />`

12) Мероприятие (детальная) — `src/components/events/EventDetail.tsx`
    - Было: `<div className="prose ..." dangerouslySetInnerHTML={{ __html: event.content }} />`
    - Стало: `<SafeHtml html={event.content} className="prose prose-lg max-w-none mb-8" />`

Дополнительно: везде, где контент статичен (не из CMS), следует писать его в JSX, а не генерировать HTML строкой.

---

### Предлагаемый компонент SafeHtml (санитизация + улучшения)
Цели: безопасная отрисовка HTML, автообработка ссылок, единый стиль через Tailwind Typography.

Ключевые требования к реализации:
- Пакет: `isomorphic-dompurify` (работает на сервере и в браузере).
- Белый список тэгов: `p, a, strong, em, ul, ol, li, h1-h6, blockquote, table, thead, tbody, tr, th, td, img, figure, figcaption, code, pre, hr, br`.
- Разрешённые атрибуты: `href, target, rel, title, src, alt, width, height, loading`.
- Для всех ссылок с внешним хостом — выставлять `target="_blank"` и `rel="noopener noreferrer"`.
- Опционально: запретить inline-обработчики (`on*`), `<script>`, `<style>`, iframes.

Пример интерфейса компонента:

```tsx
type SafeHtmlProps = {
  html: string;
  className?: string;
};
```

Идея реализации:
1) Санитизировать HTML через DOMPurify с настройками (белые списки тэгов/атрибутов).
2) Выполнить пост-обработку ссылок: внешним — `target/_blank + rel`.
3) Отдать результат через `dangerouslySetInnerHTML` внутри одного места (централизация риска).

Это позволит убрать прямое использование `dangerouslySetInnerHTML` по коду, сосредоточив риск в одном компоненте с тестами.

---

### SSR/SEO: перейти с useEffect на серверные компоненты
Сейчас многие страницы с контентом помечены `"use client"` и загружают данные в `useEffect` через `pagesService` (Axios). Это делает первую отрисовку пустой для SEO и ухудшает TTFB. Рекомендации:
- Сделать страницы серверными компонентами (не указывать `"use client"`).
- Получать данные на сервере (в самом `page.tsx` как `async`), используя `fetch`/`api` и `next` кэширование (`revalidate`/`cache`).
- Метаданные формировать через `export async function generateMetadata(...)` на основе полученных данных.

Примерно:
- Было (упрощённо): клиентский компонент + `useEffect` → `setPage(res.data)`.
- Стало: `export default async function Page()` → `const page = await fetchPage('slug')` → вернуть отрендеренный контент сразу на сервере.

Плюсы: индексируемость, лучшая производительность, меньше JS на клиенте.

---

### Общий аудит качества кода

1) Типизация
- Найдены множественные `any` в сервисах/нормализаторах: 
  - `src/services/accreditedOrganizations.ts` (normalizeItem/raw params)
  - `src/services/documents.ts` (params/data mapping)
  - `src/services/events.ts` (normalizeEvent/params)
  - `src/services/news.ts` (normalizeAuthor/normalizeCategory/normalizeNews/params)
  - `src/services/registry.ts` (toIso/normalizeManagerDetail/params)
  - В отдельных местах страниц (`app/registry/page.tsx`, `components/news/NewsDetail.tsx`, `app/news/[id]/page.tsx`).
- Рекомендации: ввести точные интерфейсы DTO ответов API и заменить `any` на строгие типы. Это повысит надёжность маппинга и снизит количество runtime-ошибок.

2) Линтинг и сборка
- В `next.config.ts` включены `eslint.ignoreDuringBuilds: true` и `typescript.ignoreBuildErrors: true`. Это скрывает проблемы.
- Рекомендации: включить проверки в CI и на проде; локально можно оставить мягкий режим. Также добавить правило на запрет `any` (или контролируемый `@typescript-eslint/no-explicit-any`).

3) "use client"
- Найдены десятки клиентских компонентов (в т.ч. страницы). Часть из них не взаимодействует с состоянием/DOM напрямую.
- Рекомендации: по умолчанию держать страницы серверными. Переносить интерактив в дочерние клиентские компоненты.

4) API-слой
- Сейчас используется Axios-обёртка с единым форматом ответа — это хорошо. Для серверных компонентов стоит рассмотреть `fetch` с `next` кэшированием и SSG/ISR.
- В `images.remotePatterns` разрешён только `localhost:3001`. Для продакшена добавить боевые домены.

5) Безопасность
- Санитизация HTML (см. выше) — must have.
- Для внешних ссылок гарантированно ставить `rel="noopener noreferrer"` (в проекте соблюдается в обнаруженном месте, но нужно централизовать в `SafeHtml`).

6) Логи и шум
- В `components/control/ControlPage.tsx` есть `console.log` (mock). Рекомендация: убрать или обернуть в `if (process.env.NODE_ENV !== 'production')`.

7) Доступность и UX
- Tailwind Typography (`prose`) уже используется — хорошо. Проверить иерархию `h1-h6` на страницах после перехода на SSR, чтобы сохранить семантику.

---

### План внедрения (пошагово)
1) Добавить `isomorphic-dompurify` в фронтенд и подготовить `SafeHtml`.
2) Заменить все вхождения `dangerouslySetInnerHTML` на `SafeHtml` (список файлов выше).
3) Перевести контентные страницы на серверные компоненты (убрать `"use client"`, заменить `useEffect` на серверный fetch, добавить `generateMetadata`).
4) Включить проверки: убрать `ignoreDuringBuilds/ignoreBuildErrors` в `next.config.ts` для CI, добавить правило на `no-explicit-any` и устранить текущие `any` в сервисах.
5) Добавить домены картинок в `next.config.ts` для продакшена.
6) Пройтись по логам/дебагу и очистить `console.log`.
7) Написать базовые тесты `SafeHtml` (фильтрация `<script>`/`onerror` и автопроставление `rel`).

---

### Критерии готовности (DoD)
- Все вхождения `dangerouslySetInnerHTML` заменены на `SafeHtml`.
- `SafeHtml` имеет тесты на XSS-кейсы и ссылки.
- Контентные страницы серверные, метаданные генерируются на сервере.
- В CI включены строгие проверки, `any` устранены в сервисах.
- Прод-домены изображений добавлены.

Если нужно — подготовлю PR с реализацией `SafeHtml`, миграцией страниц на SSR и правками типизации.


