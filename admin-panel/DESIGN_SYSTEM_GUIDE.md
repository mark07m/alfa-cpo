# Руководство по дизайн-системе админ панели СРО АУ

## Дата: 10 октября 2025

---

## 🎨 Обзор

Это руководство описывает единую дизайн-систему для админ панели СРО Арбитражных управляющих. Все компоненты следуют этим правилам для обеспечения консистентности и удобства использования.

---

## 🎯 Принципы дизайна

### 1. Простота
- Минималистичный дизайн без излишеств
- Flat дизайн (убраны все градиенты)
- Чистые линии и формы

### 2. Консистентность
- Единые цвета для одинаковых элементов
- Единые размеры и отступы
- Единые hover и active состояния

### 3. Иерархия
- Четкое разделение важной и второстепенной информации
- Использование size, weight, color для создания иерархии
- Достаточно white space между элементами

### 4. Доступность
- Контрастность текста не менее 4.5:1
- Размер кликабельных элементов не менее 44x44px
- Понятные состояния фокуса для навигации с клавиатуры

### 5. Адаптивность
- Mobile-first подход
- Адаптивные компоненты для всех устройств
- Responsive типографика и spacing

---

## 🎨 Цветовая палитра

### Primary - Blue (основной цвет)
```css
primary-50:  #eff6ff
primary-100: #dbeafe
primary-200: #bfdbfe
primary-300: #93c5fd
primary-400: #60a5fa
primary-500: #3b82f6  /* Основной */
primary-600: #2563eb  /* Hover */
primary-700: #1d4ed8  /* Active */
primary-800: #1e40af
primary-900: #1e3a8a
```

**Использование:**
- Кнопки действий (primary buttons)
- Активные элементы навигации
- Ссылки
- Focus states
- Иконки важных элементов

### Gray (нейтральные цвета)
```css
gray-50:  #fafafa  /* Фон */
gray-100: #f5f5f5  /* Фон secondary */
gray-200: #e5e5e5  /* Borders */
gray-300: #d4d4d4  /* Borders hover */
gray-400: #a3a3a3  /* Иконки inactive */
gray-500: #737373  /* Текст secondary */
gray-600: #525252  /* Текст */
gray-700: #404040  /* Текст primary */
gray-800: #262626  /* Заголовки */
gray-900: #171717  /* Основной текст */
```

### Accent - Amber (акцентный цвет)
```css
accent-500: #f59e0b  /* Для важных уведомлений */
```

**Использование:**
- Важные уведомления
- Badge для критичных элементов
- Акценты в статистике

### Статусные цвета

#### Success - Green
```css
success-50:  #f0fdf4
success-100: #dcfce7
success-500: #10b981  /* Основной */
success-600: #16a34a  /* Hover */
```

#### Warning - Yellow
```css
warning-500: #f59e0b  /* Основной */
warning-600: #d97706  /* Hover */
```

#### Danger - Red
```css
danger-500: #ef4444  /* Основной */
danger-600: #dc2626  /* Hover */
```

#### Info - Sky Blue
```css
info-500: #0ea5e9  /* Основной */
info-600: #0284c7  /* Hover */
```

---

## 📐 Spacing (Отступы)

```css
xs:  4px  (0.25rem)
sm:  8px  (0.5rem)
md:  16px (1rem)
lg:  24px (1.5rem)
xl:  32px (2rem)
2xl: 48px (3rem)
```

### Использование:
- **Внутри компонентов:** `p-3` (12px), `p-4` (16px), `p-6` (24px)
- **Между компонентами:** `space-y-6` (24px)
- **Между секциями:** `space-y-8` (32px)

---

## 🔤 Типографика

### Шрифт
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Размеры

#### Заголовки
```css
h1: text-2xl (24px) font-bold
h2: text-xl (20px) font-semibold
h3: text-lg (18px) font-semibold
h4: text-base (16px) font-medium
```

#### Текст
```css
Large:  text-base (16px)
Normal: text-sm (14px)
Small:  text-xs (12px)
```

#### Font Weight
```css
Regular:  font-normal (400)
Medium:   font-medium (500)
Semibold: font-semibold (600)
Bold:     font-bold (700)
```

---

## 📦 Компоненты

### Button (Кнопка)

#### Варианты:
1. **Primary** - основные действия
```tsx
<Button variant="primary">Создать</Button>
```

2. **Secondary** - второстепенные действия
```tsx
<Button variant="secondary">Отмена</Button>
```

3. **Outline** - альтернативные действия
```tsx
<Button variant="outline">Экспорт</Button>
```

4. **Ghost** - минимальные действия
```tsx
<Button variant="ghost">Подробнее</Button>
```

5. **Danger** - опасные действия
```tsx
<Button variant="danger">Удалить</Button>
```

#### Размеры:
```tsx
xs - минимальная кнопка
sm - маленькая кнопка
md - стандартная (по умолчанию)
lg - большая кнопка
xl - очень большая кнопка
```

#### Особенности:
- Border radius: `rounded-lg` (12px)
- Transition: `200ms`
- Active state: `scale-95`
- Focus ring: `ring-2 ring-primary-500`
- Shadow на primary: `shadow-sm hover:shadow-md`

### Card (Карточка)

#### Варианты:
```tsx
<Card variant="default" padding="md">
  <CardHeader title="Заголовок" />
  <CardContent>Содержимое</CardContent>
  <CardFooter>Футер</CardFooter>
</Card>
```

#### Особенности:
- Border radius: `rounded-lg` (12px)
- Border: `border border-gray-200`
- Shadow: `shadow-sm`
- Background: `bg-white`

### Badge (Бейдж)

#### Варианты:
```tsx
<Badge color="blue" variant="solid">Активен</Badge>
<Badge color="red" variant="soft">Ошибка</Badge>
<Badge color="green" variant="outline">Успешно</Badge>
```

#### Особенности:
- Border radius: `rounded-full`
- NO градиенты (flat design)
- Hover: `scale-102` (уменьшен с 105)
- Font: `font-medium`

### Input (Поле ввода)

#### Типы:
```tsx
<Input
  label="Email"
  type="email"
  placeholder="example@email.com"
  error="Ошибка валидации"
  helperText="Подсказка"
/>
```

#### Особенности:
- Border radius: `rounded-lg` (12px)
- Focus: `border-primary-500 ring-primary-500`
- Error: `border-red-500 ring-red-500`
- Transition: `200ms`

### Table (Таблица)

#### Особенности:
- Header: `bg-gray-50` (БЕЗ градиента)
- Hover row: `hover:bg-blue-50/50`
- Border radius: `rounded-lg`
- Border: `border border-gray-200`
- Shadow: `shadow-sm`
- Padding cells: `px-3 py-3`

#### Пример:
```tsx
<Table
  data={data}
  columns={columns}
  loading={isLoading}
  pagination={pagination}
  onSort={handleSort}
/>
```

### Modal (Модальное окно)

#### Размеры:
```tsx
sm - маленькое (max-w-md)
md - стандартное (max-w-lg) - по умолчанию
lg - большое (max-w-2xl)
xl - очень большое (max-w-4xl)
```

#### Особенности:
- Border radius: `rounded-xl` (16px)
- Shadow: `shadow-2xl`
- Backdrop: `bg-black/50`
- Animation: fade + scale

---

## 🎯 Layout (Макет)

### AdminLayout

Основной layout с sidebar и header:

```tsx
<AdminLayout title="Заголовок" breadcrumbs={breadcrumbs}>
  {/* Содержимое */}
</AdminLayout>
```

#### Структура:
- Sidebar: 256px (w-64) на desktop
- Header: 64px (h-16) sticky
- Content padding: px-4 sm:px-6 lg:px-8

### AdminSidebar

#### Особенности:
- Active item: `bg-primary-50 text-primary-900 shadow-sm`
- Hover: `hover:bg-gray-50`
- Icon active: `text-primary-600`
- Icon inactive: `text-gray-400`
- Logo: градиент `from-primary-500 to-primary-600`

### AdminHeader

#### Особенности:
- Height: `h-16` (64px)
- Backdrop: `backdrop-blur-sm bg-white/95`
- Avatar: `bg-primary-100 ring-2 ring-primary-200`
- Mobile menu: `hover:bg-gray-100 rounded-lg`

---

## 📱 Адаптивность

### Breakpoints:
```css
sm:  640px  - Телефон горизонтально
md:  768px  - Планшет вертикально
lg:  1024px - Планшет горизонтально / маленький desktop
xl:  1280px - Desktop
2xl: 1536px - Большой desktop
```

### Mobile (< 640px)
- Sidebar: drawer с overlay
- Padding: px-4
- Font sizes: уменьшены
- Tables: horizontal scroll
- Cards: 1 колонка

### Tablet (640px - 1024px)
- Sidebar: drawer (скрыт по умолчанию)
- Padding: px-6
- Cards: 2 колонки

### Desktop (> 1024px)
- Sidebar: фиксированный
- Padding: px-8
- Cards: 3-4 колонки
- Full функциональность

---

## 🎨 Состояния

### Hover
```css
transition-colors duration-200
hover:bg-gray-50
hover:text-gray-900
hover:scale-102
hover:shadow-md
```

### Active
```css
active:scale-95
active:bg-primary-800
```

### Focus
```css
focus:outline-none
focus-visible:ring-2
focus-visible:ring-primary-500
focus-visible:ring-offset-2
```

### Disabled
```css
disabled:opacity-50
disabled:pointer-events-none
disabled:cursor-not-allowed
```

---

## 🎬 Анимации

### Transitions
```css
/* Стандартный */
transition-all duration-200

/* Только цвет */
transition-colors duration-200

/* Transform */
transition-transform duration-200
```

### Анимации
```css
/* Fade in */
.animate-fade-in

/* Slide in */
.animate-slide-in

/* Scale up */
.animate-scale-up

/* Spin (loading) */
.animate-spin
```

---

## 📏 Shadows

```css
xs:      0 1px 2px 0 rgb(0 0 0 / 0.05)
sm:      0 1px 3px 0 rgb(0 0 0 / 0.1)
DEFAULT: 0 4px 6px -1px rgb(0 0 0 / 0.1)
md:      0 10px 15px -3px rgb(0 0 0 / 0.1)
lg:      0 20px 25px -5px rgb(0 0 0 / 0.1)
xl:      0 25px 50px -12px rgb(0 0 0 / 0.25)

/* Кастомные */
soft:    0 2px 15px -3px rgba(0, 0, 0, 0.07)
card:    0 1px 3px 0 rgb(0 0 0 / 0.1)
```

---

## 🔨 Утилиты

### Кастомные классы

```css
/* Hover scale */
.hover-scale
/* transition-transform duration-200 hover:scale-102 */

/* Card hover */
.card-hover
/* transition-all duration-200 hover:shadow-md */

/* Link */
.link
/* text-primary-600 hover:text-primary-700 */

/* Focus ring */
.focus-ring
/* focus:outline-none focus-visible:ring-2 */

/* Gradient primary */
.gradient-primary
/* bg-gradient-to-r from-primary-500 to-primary-600 */
```

---

## 📋 Примеры использования

### Страница с таблицей

```tsx
export default function ExamplePage() {
  return (
    <AdminLayout
      title="Заголовок страницы"
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Текущая страница' }
      ]}
    >
      {/* Заголовок с действиями */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Заголовок
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Описание страницы
          </p>
        </div>
        <Button variant="primary" icon={<PlusIcon />}>
          Создать
        </Button>
      </div>

      {/* Фильтры */}
      <div className="flex items-center justify-between mb-6">
        <Input
          placeholder="Поиск..."
          icon={<SearchIcon />}
        />
        <Button variant="outline">
          <FunnelIcon /> Фильтры
        </Button>
      </div>

      {/* Таблица */}
      <Table
        data={data}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
      />
    </AdminLayout>
  )
}
```

### Форма

```tsx
<Card padding="lg">
  <CardHeader title="Создание записи" />
  <CardContent>
    <form className="space-y-6">
      <Input
        label="Название"
        required
        placeholder="Введите название"
      />
      <Input
        label="Email"
        type="email"
        required
      />
      <Textarea
        label="Описание"
        rows={4}
      />
      <Select
        label="Категория"
        options={categories}
      />
    </form>
  </CardContent>
  <CardFooter justify="between">
    <Button variant="secondary">Отмена</Button>
    <Button variant="primary">Сохранить</Button>
  </CardFooter>
</Card>
```

### Статистические карточки

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard
    title="Всего записей"
    value={1234}
    change={+12}
    icon={DocumentIcon}
    color="blue"
  />
  <StatCard
    title="Активных"
    value={890}
    change={+5}
    icon={CheckIcon}
    color="green"
  />
  <StatCard
    title="В ожидании"
    value={234}
    change={-3}
    icon={ClockIcon}
    color="yellow"
  />
  <StatCard
    title="Ошибки"
    value={10}
    change={-2}
    icon={XMarkIcon}
    color="red"
  />
</div>
```

---

## ✅ Checklist для новых компонентов

При создании нового компонента проверьте:

- [ ] Использует primary цвет (blue) для активных элементов
- [ ] Border radius: `rounded-lg` или `rounded-xl`
- [ ] Transition: `duration-200`
- [ ] Focus state с `ring-2 ring-primary-500`
- [ ] Hover эффекты плавные
- [ ] Active state `scale-95` для кнопок
- [ ] Disabled state правильно отображается
- [ ] Адаптивен на всех устройствах
- [ ] Accessibility (a11y) соблюдена
- [ ] Нет градиентов (flat design)
- [ ] Консистентен с другими компонентами

---

## 🚫 Что НЕ делать

1. ❌ **НЕ использовать amber** как primary цвет
2. ❌ **НЕ использовать градиенты** (кроме logo)
3. ❌ **НЕ использовать** `hover:scale-105` (слишком агрессивно)
4. ❌ **НЕ использовать** разные цвета для одинаковых элементов
5. ❌ **НЕ делать** слишком плотный spacing
6. ❌ **НЕ забывать** про mobile адаптивность
7. ❌ **НЕ использовать** слишком яркие цвета
8. ❌ **НЕ игнорировать** accessibility

---

## 📚 Дополнительные ресурсы

### Документация
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Heroicons](https://heroicons.com/)
- [Next.js](https://nextjs.org/docs)

### Инструменты
- [Figma для дизайна](https://figma.com)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 🔄 История изменений

### 10 октября 2025
- ✅ Создана единая дизайн-система
- ✅ Обновлена цветовая палитра (Blue primary вместо Amber)
- ✅ Убраны все градиенты из компонентов
- ✅ Унифицированы все UI компоненты
- ✅ Обновлены все основные страницы
- ✅ Улучшена адаптивность
- ✅ Создана документация

---

## 📞 Контакты

Если у вас есть вопросы по дизайн-системе, обращайтесь к команде разработки.

---

**Версия:** 1.0.0  
**Дата:** 10 октября 2025  
**Статус:** ✅ Активна

