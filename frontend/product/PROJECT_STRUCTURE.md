# Perf Assist — фронтенд архитектура и правила для агентов

Этот документ описывает **жёсткие правила** для любых агентов/разработчиков, которые работают с фронтендом Perf Assist, Figma-макетами и UI-компонентами.

Цели:
- регулярно обновлять верстку из Figma **без потери** продуктовой логики;
- держать анимации, состояния и бизнес-логику **в кастомных файлах**;
- разнести код по **доменам**: view-экраны, UI-паттерны (inputs/buttons/feedback/...), продуктовые фичи (entries/goals/perf-summary).

---

## 1. Базовые понятия

### 1.1. Слои фронтенда

Во фронтенде есть три слоя:

1. **Design-слой (Figma)**
   - Компоненты, максимально близкие к макетам.
   - Можно перезатирать при обновлении макетов.
   - Никакой бизнес-логики, минимум состояния.

2. **UI-слой (доменные UI-паттерны)**
   - Компоненты уровня «input», «button», «card», «badge» и т.п.
   - Строятся поверх shadcn/ui и/или design-компонентов.
   - Не зависят от бизнес-сущностей (Entry, Goal и т.п.).

3. **Feature/View-слой (продукт)**
   - Фичи: entries, goals, perf-summary и т.д.
   - Экраны: Today, Feed, Summary, Settings.
   - Здесь живёт бизнес-логика, работа с API, стейт.

---

## 2. Целевая структура `src/`

> ВНИМАНИЕ: эта структура — целевая. При рефакторинге нужно постепенно приводить проект к ней.

```text
src/
├─ app/
│  ├─ App.tsx
│  │
│  ├─ routes/                 # View-слой (экраны)
│  │  ├─ today/
│  │  │  └─ TodayView.tsx
│  │  ├─ feed/
│  │  │  └─ FeedView.tsx
│  │  ├─ summary/
│  │  │  └─ SummaryView.tsx
│  │  └─ settings/
│  │     └─ SettingsView.tsx
│  │
│  ├─ design/                 # Design-слой (копипаста из Figma)
│  │  ├─ views/                # Крупные вьюхи/экраны из макетов
│  │  │  ├─ TodayDesign.tsx
│  │  │  ├─ FeedDesign.tsx
│  │  │  ├─ SummaryDesign.tsx
│  │  │  ├─ LoginDesign.tsx
│  │  │  └─ UIKitDesign.tsx
│  │  │
│  │  └─ components/           # Атомы/молекулы из макетов
│  │     ├─ layout/
│  │     │  ├─ LayoutDesign.tsx
│  │     │  └─ CardDesign.tsx
│  │     ├─ inputs/
│  │     │  ├─ InputDesign.tsx
│  │     │  └─ TextAreaDesign.tsx
│  │     ├─ buttons/
│  │     │  └─ ButtonDesign.tsx
│  │     ├─ feedback/
│  │     │  └─ BadgeDesign.tsx
│  │     └─ ...
│  │
│  ├─ ui/                     # Доменный UI-слой (поверх shadcn/ui)
│  │  ├─ inputs/               # Домен «inputs»
│  │  │  ├─ TextInput.tsx
│  │  │  ├─ TextArea.tsx
│  │  │  ├─ RichTextArea.tsx
│  │  │  ├─ Select.tsx
│  │  │  └─ Checkbox.tsx
│  │  │
│  │  ├─ buttons/              # Домен «buttons»
│  │  │  ├─ Button.tsx
│  │  │  ├─ IconButton.tsx
│  │  │  └─ ToggleButton.tsx
│  │  │
│  │  ├─ feedback/             # Домен «feedback»
│  │  │  ├─ Badge.tsx
│  │  │  ├─ Toast.tsx
│  │  │  ├─ Alert.tsx
│  │  │  └─ Tooltip.tsx
│  │  │
│  │  ├─ layout/               # Домен «layout»
│  │  │  ├─ Card.tsx
│  │  │  ├─ Page.tsx
│  │  │  ├─ Sidebar.tsx
│  │  │  └─ Toolbar.tsx
│  │  │
│  │  └─ data-display/         # Домен «data-display»
│  │     ├─ Table.tsx
│  │     ├─ Tag.tsx
│  │     └─ KeyValue.tsx
│  │
│  ├─ features/               # Продуктовые домены
│  │  ├─ entries/
│  │  │  ├─ components/
│  │  │  │  ├─ EntryCard.tsx
│  │  │  │  ├─ EntryList.tsx
│  │  │  │  └─ EntryEditor.tsx
│  │  │  ├─ hooks/
│  │  │  │  └─ useEntries.ts
│  │  │  └─ api/
│  │  │     └─ entriesApi.ts
│  │  │
│  │  ├─ goals/
│  │  │  ├─ components/
│  │  │  │  ├─ GoalCard.tsx
│  │  │  │  └─ GoalsList.tsx
│  │  │  ├─ hooks/
│  │  │  │  └─ useGoals.ts
│  │  │  └─ api/
│  │  │     └─ goalsApi.ts
│  │  │
│  │  └─ perf-summary/
│  │     ├─ components/
│  │     │  ├─ PerfSummaryView.tsx
│  │     │  └─ PerfGoalReview.tsx
│  │     ├─ hooks/
│  │     │  └─ usePerfSummary.ts
│  │     └─ api/
│  │        └─ perfSummaryApi.ts
│  │
│  ├─ lib/
│  │  ├─ animations/
│  │  ├─ hooks/
│  │  └─ utils/
│  │
│  └─ components/legacy/      # Временное место для старых компонентов до миграции
│
└─ ... (остальные корневые файлы проекта)
```

---

## 3. Жёсткие правила для агентов

### 3.1. Что считается design-слоем

**Design-слой** — это всё, что лежит в:
- `src/app/design/**/*`
- `src/app/components/figma/**/*`

Правила:
1. Эти файлы можно **перезаписывать целиком** при обновлении макетов из Figma.
2. В design-компонентах **запрещено**:
   - импортировать что-либо из `src/app/features/**/*`;
   - импортировать что-либо из `src/app/routes/**/*`;
   - писать бизнес-логику (работа с API, сложный стейт, доменные типы Entry/Goal и т.п.).
3. В design-компонентах **разрешено**:
   - импортировать shadcn/ui-компоненты из `src/app/components/ui/*`;
   - импортировать другие design-компоненты;
   - использовать простые пропсы для проброса событий (`onClick`, `onChange` и т.п.).

**Если агенту нужно изменить поведение экрана — он НЕ трогает design-файлы.**

### 3.2. Что считается custom-слоем

**Custom-слой** — это всё, что лежит в:
- `src/app/ui/**/*`
- `src/app/features/**/*`
- `src/app/routes/**/*`
- `src/app/lib/**/*`

Правила:
1. Эти файлы **нельзя перезаписывать автоматически** при обновлении Figma.
2. Здесь живут:
   - анимации;
   - стейт и бизнес-логика;
   - работа с API;
   - доменные типы и модели.
3. Если нужно изменить поведение — изменения вносятся **только здесь**.

### 3.3. Связка Design ↔ View

Для каждого экрана должна быть пара:
- `XxxDesign.tsx` — в `src/app/design/views/` (верстка из Figma);
- `XxxView.tsx` — в `src/app/routes/<screen>/` (наш код).

Пример (упрощённый):

```tsx
// Design-слой: TodayDesign.tsx
export function TodayDesign(props: { onAddEntryClick?: () => void }) {
  return (
    <div className="today-layout">
      {/* верстка из Figma */}
      <button onClick={props.onAddEntryClick}>Add entry</button>
    </div>
  );
}

// Custom-слой: TodayView.tsx
import { TodayDesign } from "../../design/views/TodayDesign";
import { useEntries } from "../../features/entries/hooks/useEntries";

export function TodayView() {
  const { addEntry } = useEntries();

  return <TodayDesign onAddEntryClick={() => addEntry(/* ... */)} />;
}
```

**Агент никогда не добавляет бизнес-логику в `TodayDesign.tsx`.**

---

## 4. Домены UI-компонентов

UI-компоненты делятся на технические домены. Каждый новый компонент должен быть отнесён к одному из них.

### 4.1. Домен `inputs`

Сюда попадает всё, что принимает ввод пользователя:
- текстовые поля (input, textarea, rich text);
- select, combobox;
- checkbox, radio;
- slider, otp и т.п.

Примеры файлов:
- `src/app/ui/inputs/TextInput.tsx`
- `src/app/ui/inputs/TextArea.tsx`
- `src/app/ui/inputs/RichTextArea.tsx`
- `src/app/ui/inputs/Select.tsx`

### 4.2. Домен `buttons`

Сюда попадают все кнопки и action-контролы:
- обычные кнопки;
- иконкокнопки;
- toggle-кнопки.

Примеры файлов:
- `src/app/ui/buttons/Button.tsx`
- `src/app/ui/buttons/IconButton.tsx`
- `src/app/ui/buttons/ToggleButton.tsx`

### 4.3. Домен `feedback`

Компоненты, которые дают пользователю обратную связь:
- badge, tag;
- toast, alert, dialog;
- tooltip;
- progress, skeleton.

Примеры файлов:
- `src/app/ui/feedback/Badge.tsx`
- `src/app/ui/feedback/Toast.tsx`
- `src/app/ui/feedback/Alert.tsx`

### 4.4. Домен `layout`

Компоненты, отвечающие за расположение и структуру:
- card, page, sidebar;
- toolbar, header, footer;
- grid, stack.

Примеры файлов:
- `src/app/ui/layout/Card.tsx`
- `src/app/ui/layout/Page.tsx`
- `src/app/ui/layout/Sidebar.tsx`

### 4.5. Домен `data-display`

Компоненты, которые отображают данные без ввода:
- таблицы;
- списки;
- key-value блоки;
- теги/чипсы.

Примеры файлов:
- `src/app/ui/data-display/Table.tsx`
- `src/app/ui/data-display/KeyValue.tsx`

**Правило для агентов:**
> Если компонент описывает **UI-паттерн** (кнопка, инпут, карточка без доменной логики) — он идёт в `src/app/ui/<domain>/...`.

---

## 5. Продуктовые домены (features)

Продуктовые домены отражают сущности из `product/` и backend API:

- `entries` — записи пользователя (план/факт);
- `goals` — цели и их ревью;
- `perf-summary` — итоговые саммари за период.

Структура каждого домена:

```text
src/app/features/<domain>/
├─ components/
├─ hooks/
└─ api/
```

Примеры:
- `src/app/features/entries/components/EntryCard.tsx`
- `src/app/features/entries/hooks/useEntries.ts`
- `src/app/features/entries/api/entriesApi.ts`

**Правило для агентов:**
> Если компонент описывает **бизнес-сущность** (EntryCard, GoalCard, PerfSummaryView) — он идёт в `src/app/features/<domain>/components`.

---

## 6. View-слой (экраны)

Экраны — это композиция фич и UI-компонентов.

Расположение:
- `src/app/routes/today/TodayView.tsx`
- `src/app/routes/feed/FeedView.tsx`
- `src/app/routes/summary/SummaryView.tsx`

Правила:
1. View-компонент **не реализует низкоуровневый UI** (input, button и т.п.) — он использует `ui/*` и `features/*`.
2. View-компонент может содержать лёгкий стейт (фильтры, локальные переключатели), но основная логика должна быть в `features/*/hooks`.
3. View-компонент всегда опирается на соответствующий `XxxDesign` из `design/views`.

---

## 7. Анимации и сложное поведение

Анимации и сложное поведение должны быть изолированы:

- Общие анимации: `src/app/lib/animations/*`.
- Подключение анимаций — только в custom-слое (`ui/*`, `features/*`, `routes/*`).
- В design-слое допускаются только **простые** анимации, жёстко зашитые в макет и не зависящие от данных.

Пример:

```tsx
// lib/animations/useFadeIn.tsx
export function useFadeIn() {
  // возвращает props для анимируемого контейнера
}

// ui/layout/Card.tsx
import { useFadeIn } from "../../lib/animations/useFadeIn";

export function Card(props: React.PropsWithChildren) {
  const fadeInProps = useFadeIn();
  return (
    <div {...fadeInProps} className="card-root">
      {props.children}
    </div>
  );
}
```

---

## 8. Процесс обновления макетов из Figma

1. **Экспорт/копипаста из Figma**
   - Новый/обновлённый код кладём только в `src/app/design/**/*`.
   - Существующие файлы design-слоя можно перезаписать целиком.

2. **Запрет на изменения custom-слоя**
   - Во время обновления макетов **запрещено** трогать файлы в `ui/*`, `features/*`, `routes/*`, `lib/*`.

3. **Синхронизация пропсов**
   - Если в design-компоненте меняется структура, агент обязан:
     - сохранить/восстановить публичный интерфейс (пропсы), который использует View;
     - либо аккуратно обновить View-компонент, не ломая бизнес-логику.

4. **Проверка после обновления**
   - Прогнать основные сценарии: Today, Feed, Summary.
   - Убедиться, что View-компоненты компилируются и работают.

---

## 9. Пошаговый план миграции текущего проекта

1. Создать каркас директорий:

```text
src/app/
├─ design/
│  ├─ views/
│  └─ components/
│     ├─ layout/
│     ├─ inputs/
│     ├─ buttons/
│     └─ feedback/
│
├─ ui/
│  ├─ inputs/
│  ├─ buttons/
│  ├─ feedback/
│  ├─ layout/
│  └─ data-display/
│
├─ features/
│  ├─ entries/
│  ├─ goals/
│  └─ perf-summary/
│
├─ routes/
│  ├─ today/
│  ├─ feed/
│  ├─ summary/
│  └─ settings/
│
└─ lib/
   ├─ animations/
   ├─ hooks/
   └─ utils/
```

2. Переместить существующие Figma-подобные компоненты в design-слой:
   - `src/app/components/FeedView.tsx` → `src/app/design/views/FeedDesign.tsx`;
   - `src/app/components/TodayView.tsx` → `src/app/design/views/TodayDesign.tsx`;
   - `src/app/components/SummaryView.tsx` → `src/app/design/views/SummaryDesign.tsx`;
   - и т.п.

3. Создать View-компоненты, которые оборачивают design:
   - `src/app/routes/today/TodayView.tsx` использует `TodayDesign`;
   - `src/app/routes/feed/FeedView.tsx` использует `FeedDesign`;
   - `src/app/routes/summary/SummaryView.tsx` использует `SummaryDesign`.

4. Постепенно выносить UI-паттерны в `src/app/ui/*`:
   - обёртки над shadcn `Input`, `Textarea`, `Button`, `Badge` и т.п.

5. Постепенно выносить бизнес-логику в `features/*`:
   - `entries` — работа с записями;
   - `goals` — цели;
   - `perf-summary` — саммари.

6. Удалить/очистить `components/legacy` после полной миграции.

---

## 10. TL;DR для агентов

1. **Никогда не добавляй бизнес-логику в `src/app/design/**/*`.**
2. **Никогда не перезаписывай автоматически файлы в `ui/*`, `features/*`, `routes/*`, `lib/*`.**
3. **Все новые UI-паттерны клади в `src/app/ui/<domain>/...`.**
4. **Все новые бизнес-компоненты клади в `src/app/features/<domain>/components`.**
5. **Каждый экран = `XxxDesign` (design-слой) + `XxxView` (view-слой).**

Эти правила обязательны для всех будущих изменений фронтенда Perf Assist.