# 🚀 Руководство по применению унификации

## Для быстрого обновления оставшихся страниц

---

## ✅ Шаблон для страницы просмотра

### 1. Импорты

```tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { ActionButtons } from '@/components/admin/ui/ActionButtons';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { Badge } from '@/components/admin/ui/Badge';
// ... другие импорты
```

### 2. State

```tsx
const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
```

### 3. Handlers

```tsx
const handleDelete = async () => {
  setIsDeleting(true);
  try {
    await deleteItem(id);
    router.push('/items');
  } catch (error) {
    console.error('Delete failed:', error);
  } finally {
    setIsDeleting(false);
    setShowDeleteDialog(false);
  }
};
```

### 4. Render

```tsx
return (
  <AdminLayout>
    <div className="space-y-6">
      <PageHeader
        title={item.title}
        subtitle="Описание или дополнительная информация"
        backUrl="/items"
        backLabel="К элементам"
        badge={<Badge color="green">Статус</Badge>}
        primaryAction={{
          label: 'Редактировать',
          onClick: () => router.push(`/items/${id}/edit`),
          variant: 'primary'
        }}
      />
      
      <ActionButtons
        actions={[
          { type: 'delete', onClick: () => setShowDeleteDialog(true) }
        ]}
      />
      
      {/* Контент страницы */}
      
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Удалить элемент?"
        message={`Вы уверены, что хотите удалить "${item.title}"?`}
        type="danger"
        loading={isDeleting}
      />
    </div>
  </AdminLayout>
);
```

---

## ✅ Шаблон для страницы списка

### 1. Импорты

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FilterPanel } from '@/components/admin/ui/FilterPanel';
import { Table } from '@/components/admin/ui/Table';
import { PlusIcon } from '@heroicons/react/24/outline';
```

### 2. State & Filters

```tsx
const [filters, setFilters] = useState({
  search: '',
  status: '',
  dateFrom: '',
  dateTo: ''
});
const [showFilters, setShowFilters] = useState(false);
```

### 3. Filter Config

```tsx
const filterConfig = [
  {
    type: 'search' as const,
    key: 'search',
    label: 'Поиск',
    placeholder: 'Поиск по названию...',
    width: 'half' as const
  },
  {
    type: 'select' as const,
    key: 'status',
    label: 'Статус',
    options: [
      { value: 'active', label: 'Активные' },
      { value: 'inactive', label: 'Неактивные' }
    ],
    width: 'quarter' as const
  },
  {
    type: 'daterange' as const,
    key: 'date',
    label: 'Период',
    width: 'half' as const
  }
];
```

### 4. Render

```tsx
return (
  <AdminLayout>
    <div className="space-y-6">
      <PageHeader
        title="Управление элементами"
        subtitle="Просмотр и управление всеми элементами"
        primaryAction={{
          label: 'Создать элемент',
          onClick: () => router.push('/items/create'),
          icon: <PlusIcon className="h-4 w-4" />,
          variant: 'primary'
        }}
      />
      
      <FilterPanel
        filters={filterConfig}
        values={filters}
        onChange={(key, value) => setFilters({...filters, [key]: value})}
        onReset={() => setFilters({ search: '', status: '', dateFrom: '', dateTo: '' })}
        isOpen={showFilters}
        onToggle={() => setShowFilters(!showFilters)}
      />
      
      <Table
        data={items}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
      />
    </div>
  </AdminLayout>
);
```

---

## ✅ Шаблон для формы редактирования

### 1. Импорты

```tsx
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FormField } from '@/components/admin/ui/FormField';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Textarea } from '@/components/admin/ui/Textarea';
import { Checkbox } from '@/components/admin/ui/Checkbox';
import { Button } from '@/components/admin/ui/Button';
```

### 2. State

```tsx
const [formData, setFormData] = useState({
  title: '',
  description: '',
  status: 'draft',
  isPublished: false
});
const [errors, setErrors] = useState({});
const [isSaving, setIsSaving] = useState(false);
```

### 3. Handlers

```tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSaving(true);
  try {
    await saveItem(formData);
    router.push('/items');
  } catch (error) {
    console.error('Save failed:', error);
  } finally {
    setIsSaving(false);
  }
};
```

### 4. Render

```tsx
return (
  <AdminLayout>
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Редактирование' : 'Создание'}
        subtitle={isEdit ? item.title : 'Создайте новый элемент'}
        backUrl="/items"
        backLabel="К элементам"
      />
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <FormField
          label="Название"
          htmlFor="title"
          required
          error={errors.title}
        >
          <Input
            id="title"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            error={!!errors.title}
          />
        </FormField>
        
        <FormField
          label="Описание"
          htmlFor="description"
        >
          <Textarea
            id="description"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            rows={4}
          />
        </FormField>
        
        <FormField
          label="Статус"
          htmlFor="status"
        >
          <Select
            id="status"
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}
            options={[
              { value: 'draft', label: 'Черновик' },
              { value: 'published', label: 'Опубликовано' }
            ]}
          />
        </FormField>
        
        <Checkbox
          checked={formData.isPublished}
          onChange={e => setFormData({...formData, isPublished: e.target.checked})}
          label="Опубликовать сразу"
        />
        
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/items')}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </div>
  </AdminLayout>
);
```

---

## 📋 Checklist обновления страницы

### Просмотр (Detail Page)

- [ ] Импортировать PageHeader, ActionButtons, ConfirmDialog
- [ ] Заменить кастомный заголовок на `<PageHeader>`
- [ ] Добавить `backUrl` и `backLabel`
- [ ] Переместить кнопки в `primaryAction` / `secondaryActions`
- [ ] Заменить inline Edit/Delete на `<ActionButtons>`
- [ ] Заменить `window.confirm()` на `<ConfirmDialog>`
- [ ] Добавить loading states для delete
- [ ] Убрать неиспользуемые импорты (ArrowLeftIcon, PencilIcon, TrashIcon)
- [ ] Проверить линтер
- [ ] Протестировать API

### Список (List Page)

- [ ] Импортировать PageHeader, FilterPanel, Table
- [ ] Заменить заголовок на `<PageHeader>`
- [ ] Создать конфигурацию фильтров
- [ ] Заменить кастомные фильтры на `<FilterPanel>`
- [ ] Убедиться что используется единый `<Table>`
- [ ] Добавить primaryAction для создания
- [ ] Проверить pagination
- [ ] Протестировать фильтрацию

### Форма (Edit Page)

- [ ] Импортировать FormField, Input, Select, Textarea, Checkbox
- [ ] Обернуть каждое поле в `<FormField>`
- [ ] Заменить нативные input на `<Input>`
- [ ] Заменить нативные select на `<Select>`
- [ ] Заменить нативные textarea на `<Textarea>`
- [ ] Заменить нативные checkbox на `<Checkbox>`
- [ ] Добавить error states
- [ ] Проверить validation
- [ ] Протестировать сохранение

---

## 🎯 Приоритеты

### Высокий приоритет (сделать сначала)

1. ✅ Страницы просмотра (8/20 готово)
2. ⏳ Оставшиеся страницы просмотра (12 шт)
3. ⏳ Страницы списков (15 шт)
4. ⏳ Формы создания/редактирования (20 шт)

### Средний приоритет

5. ⏳ Settings pages
6. ⏳ Reports pages
7. ⏳ Специальные страницы

### Низкий приоритет

8. ⏳ Создание Storybook
9. ⏳ Unit тесты для компонентов
10. ⏳ E2E тесты

---

## 🚀 Быстрые команды

### Найти страницы для обновления

```bash
# Найти все страницы просмотра
find admin-panel/src/app -name "page.tsx" -path "*/[id]/*"

# Найти использование window.confirm
grep -r "window.confirm" admin-panel/src/app

# Найти ArrowLeftIcon (старые back buttons)
grep -r "ArrowLeftIcon" admin-panel/src/app --include="*.tsx"

# Найти inline кнопки удаления
grep -r "TrashIcon.*onClick" admin-panel/src/app
```

### Проверить линтер

```bash
cd admin-panel
npm run lint
```

---

## 💡 Советы

### 1. Начинайте с простых страниц

Сначала обновите простые страницы просмотра без сложной логики.

### 2. Используйте готовые примеры

Копируйте структуру из уже обновленных страниц:
- `/documents/[id]`
- `/events/[id]`
- `/news/[id]`

### 3. Тестируйте API сразу

После каждого обновления проверяйте что:
- Страница загружается
- Delete работает
- Navigation работает

### 4. Не трогайте логику

Меняйте только UI слой, не трогайте:
- API calls
- Hooks
- Services
- State management

### 5. Batch updates

Обновляйте по 3-5 страниц, затем commit:
```bash
git add .
git commit -m "refactor: унификация страниц просмотра (batch 1)"
```

---

## 📚 Документация

Полная документация в:
- `DEEP_UNIFICATION_REPORT.md` - Полное руководство
- `FINAL_UNIFICATION_SUMMARY.md` - Итоговая сводка
- `UNIFICATION_PROGRESS.md` - Трекер прогресса

---

**Удачи в унификации! 🎨**

