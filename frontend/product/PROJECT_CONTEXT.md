# Контекст проекта `perf-assist`

Проект `perf-assist` — это интерфейс и продуктовый прототип ассистента по производительности (Perf Assist) для разработчика. В репозитории совмещены несколько уровней: рабочее фронтенд‑приложение, эталонный дизайн‑проект, продуктовая спецификация и дизайн‑артефакты.

---

## 1. Основное приложение (боевой фронтенд)

- Стек: Vite + React + TypeScript, SPA.
- Точка входа: [`src/main.tsx`](src/main.tsx:1).
- Корневой компонент приложения: [`src/app/App.tsx`](src/app/App.tsx:1).

### Основные экранные компоненты

Расположены в [`src/app/components`](src/app/components/Layout.tsx:1):

- [`Layout.tsx`](src/app/components/Layout.tsx:1) — общий каркас интерфейса (shell, навигация, базовый layout).
- [`TodayView.tsx`](src/app/components/TodayView.tsx:1) — экран «Сегодня» с текущим фокусом/задачами.
- [`FeedView.tsx`](src/app/components/FeedView.tsx:1) — лента событий/подсказок ассистента.
- [`SummaryView.tsx`](src/app/components/SummaryView.tsx:1) — сводка производительности (итоги за период).
- [`SettingsView.tsx`](src/app/components/SettingsView.tsx:1) — настройки ассистента и интерфейса.
- [`UiKitView.tsx`](src/app/components/UiKitView.tsx:1) — витрина/песочница UI‑компонентов.

Базовые атомарные компоненты:

- [`Button.tsx`](src/app/components/Button.tsx:1)
- [`Card.tsx`](src/app/components/Card.tsx:1)
- [`Badge.tsx`](src/app/components/Badge.tsx:1)
- [`TextArea.tsx`](src/app/components/TextArea.tsx:1)
- и другие в той же директории.

### UI‑библиотека

В [`src/app/components/ui`](src/app/components/ui/button.tsx:1) находится набор переиспользуемых компонентов (форк/порт shadcn/ui):

- кнопки, карточки, формы, диалоги, таблицы, навигация, тултипы и т.п.;
- примеры файлов: [`button.tsx`](src/app/components/ui/button.tsx:1), [`card.tsx`](src/app/components/ui/card.tsx:1), [`dialog.tsx`](src/app/components/ui/dialog.tsx:1), [`table.tsx`](src/app/components/ui/table.tsx:1) и др.

### Стили

Tailwind + кастомные темы и шрифты в [`src/styles`](src/styles/index.css:1):

- [`tailwind.css`](src/styles/tailwind.css:1)
- [`theme.css`](src/styles/theme.css:1)
- [`fonts.css`](src/styles/fonts.css:1)
- [`index.css`](src/styles/index.css:1)

**Назначение:** это основная реализация интерфейса Perf Assist, с которой нужно работать при доработке продукта (новые фичи, интеграция с бэкендом/LLM, изменение UX).

---

## 2. Каталог `Perf Assist Interface Design/` — эталонный дизайн‑проект

Отдельный Vite + React + TypeScript проект, служащий как «design reference».

- Точка входа: [`Perf Assist Interface Design/src/main.tsx`](Perf%20Assist%20Interface%20Design/src/main.tsx:1).
- Корневой компонент: [`Perf Assist Interface Design/src/app/App.tsx`](Perf%20Assist%20Interface%20Design/src/app/App.tsx:1).
- Набор компонентов и UI‑кита в [`Perf Assist Interface Design/src/app/components`](Perf%20Assist%20Interface%20Design/src/app/components/Layout.tsx:1), по структуре очень близкий к основному приложению.
- Стили и темы в [`Perf Assist Interface Design/src/styles`](Perf%20Assist%20Interface%20Design/src/styles/index.css:1).
- Доп. документация по визуальным и UX‑гайдлайнам: [`Perf Assist Interface Design/guidelines/Guidelines.md`](Perf%20Assist%20Interface%20Design/guidelines/Guidelines.md:1).

**Назначение:** эталон визуального и UX‑поведения. При сомнениях, «как должно выглядеть/вести себя» — сверяться с этим подпроектом и переносить решения в основной `src/`.

---

## 3. Продуктовая документация (`product/`)

- [`01-product-vision.md`](product/01-product-vision.md:1) — видение продукта Perf Assist: для кого, какие проблемы решает, ключевые сценарии.
- [`02-data-and-llm-design.md`](product/02-data-and-llm-design.md:1) — модель данных, источники сигналов, дизайн взаимодействия с LLM (какие контексты, какие подсказки, какие ответы).
- [`03-architecture-and-prompts.md`](product/03-architecture-and-prompts.md:1) — архитектура системы, high‑level компоненты, принципы построения промптов и цепочек запросов к модели.

**Назначение:** это источник правды о том, что именно должен уметь Perf Assist, как он мыслит о производительности и как использовать LLM. Любые фичи фронтенда должны соотноситься с этими документами.

---

## 4. Дизайн‑артефакты (`design/`)

PNG‑макеты ключевых экранов:

- [`Feed.png`](design/Feed.png:1)
- [`Performance Summary.png`](design/Performance%20Summary.png:1)
- [`Today.png`](design/Today.png:1)

**Назначение:** быстрый визуальный ориентир по ключевым экранам без запуска проекта.

---

## 5. Инфраструктура и конфигурация

- Корневой [`package.json`](package.json:1) и [`vite.config.mts`](vite.config.mts:1) — конфигурация основного фронтенда.
- [`postcss.config.mjs`](postcss.config.mjs:1) — PostCSS/Tailwind пайплайн.
- Внутри `Perf Assist Interface Design/` свой [`package.json`](Perf%20Assist%20Interface%20Design/package.json:1), [`vite.config.ts`](Perf%20Assist%20Interface%20Design/vite.config.ts:1), [`postcss.config.mjs`](Perf%20Assist%20Interface%20Design/postcss.config.mjs:1) для дизайн‑проекта.
- Корневой [`index.html`](index.html:1) — HTML‑шаблон для основного Vite‑приложения.

---

## 6. Как использовать это описание в новых контекстах модели

- Если задача про **UI/фронтенд** — смотреть в первую очередь в `src/` (боевой интерфейс) и при необходимости сверяться с `Perf Assist Interface Design/` и `design/*.png`.
- Если задача про **продукт, поведение ассистента, логику LLM** — опираться на документы в `product/`.
- Если нужно понять **как всё собрано технически** — смотреть `package.json`, `vite.config.mts`, структуру `src/app/components` и `src/app/components/ui`.

Кратко: это монорепозиторий для Perf Assist, где `src/` — текущая реализация интерфейса ассистента по производительности, `Perf Assist Interface Design/` — эталонный дизайн‑проект, `product/` — продуктовая и LLM‑архитектурная спецификация, а `design/` — статичные макеты ключевых экранов.