# 🔧 Массовое обновление старых select'ов и input'ов

**Задача**: Заменить старый стиль `focus:ring-blue-500 focus:border-blue-500` на новый минималистичный

---

## Старый стиль:

```css
border border-gray-300 
rounded-md 
shadow-sm
focus:ring-blue-500 
focus:border-blue-500
```

## Новый минималистичный стиль:

```css
border border-gray-200      /* Тоньше */
rounded-lg                   /* Более современный */
hover:border-gray-300        /* Subtle hover */
focus:outline-none
focus:ring-2                 /* Заметнее, но subtle */
focus:ring-primary-100       /* Светлое кольцо */
focus:border-primary-400     /* Primary цвет */
text-sm
transition-all duration-150  /* Быстрая анимация */
```

---

## Файлы для обновления:

✅ Обновлено:
1. ✅ Select.tsx - основной компонент
2. ✅ NotificationDropdown.tsx - меню уведомлений
3. ✅ AdminHeader.tsx - профиль dropdown
4. ✅ DocumentsFilters.tsx - частично
5. ✅ EventsFilters.tsx - частично

⏳ Осталось (~8 файлов):
1. CompensationFundHistory.tsx
2. CompensationFundForm.tsx
3. DocumentsList.tsx
4. EventsList.tsx
5. AccreditedOrganizationsList.tsx
6. ArbitratorsList.tsx
7. EventForm.tsx
8. DocumentUpload.tsx

---

## Команда для массовой замены:

```bash
# Найти все файлы со старым стилем
find src/components -name "*.tsx" -exec grep -l "focus:ring-blue-500" {} \;

# Заменить в каждом файле (осторожно!)
# Используйте replace_all в search_replace
```

---

**Статус**: В процессе обновления

