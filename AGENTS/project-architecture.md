# Архитектура проекта Perf Assist

## 1. Общий обзор

Perf Assist — self-hosted сервис для подготовки к performance review. Он помогает разработчику из ежедневных записей (планы/факты) собирать цели/проекты и формировать перф-саммари в формате **Context / Outputs / Outcomes**, с учётом роли пользователя (инженер, тимлид, менеджер).

Система логически разделена на два уровня:

1. **Фронтенд-монорепо** (`/Users/inkuroshev/personal/perf-assist`):
   - боевой фронтенд (Vite + React + TS) — интерфейс ассистента;
   - дизайн‑проект (отдельный Vite-подпроект) — эталон UI/UX;
   - продуктовая спецификация (`product/*`) — источник правды по модели данных и LLM‑логике.
2. **Бэкенд на Go** (`perf-assist-backend`, этот репозиторий):
   - HTTP API, хранящее данные пользователя и orchestrating LLM;
   - единый контракт с фронтендом через OpenAPI/JSON Schema.

## 2. Цели архитектуры

- Чёткое разделение **фронта** и **бэка** (разные репозитории/модули).
- Единый источник правды по модели данных и LLM‑контексту — файлы `product/*` во фронтенд‑репо.
- Синхронизация фронта и бэка через **формализованный контракт** (OpenAPI/JSON Schema).
- Простое self-hosted развёртывание через `docker-compose`.

## 3. Архитектура фронтенда (high-level)

Фронтенд описан в [`product/PROJECT_STRUCTURE.md`](/Users/inkuroshev/personal/perf-assist/product/PROJECT_STRUCTURE.md:1) и реализован как Vite + React + TS SPA.

Ключевые идеи:

- Слои:
  - **Design-слой** (`src/app/design/**/*`) — копипаста из Figma, можно перезатирать, без бизнес-логики.
  - **UI-слой** (`src/app/ui/**/*`) — доменные UI-паттерны (inputs, buttons, layout, feedback, data-display).
  - **Feature/View-слой** (`src/app/features/**/*`, `src/app/routes/**/*`) — бизнес-логика, работа с API, экраны.
- Продуктовые домены:
  - `entries` — ежедневные записи (планы/факты);
  - `goals` — цели/проекты;
  - `perf-summary` — перф-саммари за период.
- Экраны:
  - Today, Feed, Summary, Settings.

Фронтенд общается с бэкендом через тонкий клиент [`src/app/api/client.ts`](src/app/api/client.ts:1), сгенерированный или написанный по OpenAPI.

## 4. Архитектура бэкенда (Go)

### 4.1. Структура репозитория

Рекомендуемая структура (частично уже реализована в этом репо):

```text
perf-assist-backend/
├─ cmd/
│  └─ api/
│     └─ main.go          # точка входа HTTP-сервера
│
├─ internal/
│  ├─ http/               # HTTP-слой: роутинг, хендлеры, маппинг DTO
│  ├─ core/               # доменная логика (use-cases)
│  ├─ store/              # доступ к БД (Postgres/SQLite)
│  └─ llmcontext/         # сборка контекста для LLM
│
├─ docs/
│  └─ openapi.yaml        # контракт API фронт↔бэк
│
├─ migrations/            # SQL-миграции схемы БД
├─ go.mod
└─ BACKEND_RECOMMENDATIONS.md
```

### 4.2. Доменная модель (MVP)

На основе [`product/02-data-and-llm-design.md`](/Users/inkuroshev/personal/perf-assist/product/02-data-and-llm-design.md:1) и [`product/03-architecture-and-prompts.md`](/Users/inkuroshev/personal/perf-assist/product/03-architecture-and-prompts.md:1) бэкенд оперирует следующими сущностями:

- `User`
  - id
  - name (опционально)
  - role_hint (engineer / lead / manager / mixed)
  - perf_cycle_length_months
  - created_at

- `Entry`
  - id
  - user_id
  - date
  - type: plan | fact
  - raw_text
  - llm_enriched (JSON, опционально)
  - created_at, updated_at

- `Goal`
  - id
  - user_id
  - title
  - description
  - status: draft | active | archived
  - created_at, updated_at

- `GoalEntryLink`
  - id
  - goal_id
  - entry_id
  - relevance_score
  - note

- `GoalReview`
  - id
  - goal_id
  - period_start, period_end
  - context_text
  - outputs_text
  - outcomes_text
  - role_view
  - generated_by_llm
  - created_at, updated_at

- `PerfSummary`
  - id
  - user_id
  - period_start, period_end
  - raw_goals (список goal_id)
  - summary_text
  - bullets (JSON)
  - created_at, updated_at

### 4.3. Основные use-cases бэкенда

1. **CRUD по записям (Entries)**
   - Создание/редактирование планов и фактов.
   - Получение ленты записей за период.

2. **Генерация перф-саммари за период**
   - По запросу фронта бэкенд:
     - достаёт `Entry` за период;
     - формирует контекст для LLM (через `internal/llmcontext`);
     - вызывает LLM (внешний провайдер);
     - сохраняет `PerfSummary` и связанные `GoalReview`/`Goal`;
     - возвращает результат фронту.

3. **Локальное саммари по дню/неделе**
   - Быстрый вызов LLM для краткого саммари и кандидатов в цели.

4. **Редактирование и полировка формулировок**
   - Эндпоинт, принимающий черновой текст и возвращающий отредактированный вариант от LLM.

### 4.4. Слои внутри бэкенда

- `internal/http`
  - Определяет маршруты (`/entries`, `/goals`, `/perf/summary`, ...).
  - Валидирует входные данные, маппит DTO ↔ доменные модели.

- `internal/core`
  - Реализует бизнес-правила и use-cases (сервисы/интеркторы).
  - Не знает о HTTP, работает с абстракциями репозиториев и LLM-клиента.

- `internal/store`
  - Конкретные реализации репозиториев (Postgres/SQLite).
  - Маппинг доменных моделей в SQL-структуры.

- `internal/llmcontext`
  - Собирает данные из БД в структуры, соответствующие `product/02-data-and-llm-design.md`.
  - Формирует payload и промпты для LLM.

## 5. Контракт фронт ↔ бэк

Контракт описывается в [`docs/openapi.yaml`](docs/openapi.yaml:1) и служит:

- источником правды для HTTP-эндпоинтов бэкенда;
- основой для генерации TS-клиента на фронте (`src/app/api/client.ts`);
- документацией для агентов, работающих с интеграцией.

Ключевые группы эндпоинтов:

- `/entries` — CRUD по ежедневным записям.
- `/goals` — управление целями/проектами.
- `/perf/summary` — генерация и получение перф-саммари.
- `/perf/daily-summary` — локальные саммари по дню/неделе.

## 6. Развёртывание (MVP)

Цель — self-hosted сценарий через `docker-compose`:

- сервис `frontend` — Vite/React приложение из монорепо `perf-assist`;
- сервис `backend` — Go API из `perf-assist-backend`;
- сервис `db` — PostgreSQL или SQLite (через volume);
- опционально сервис `llm-proxy`, если используется локальная модель.

## 7. Роль AGENTS в этом репозитории

Раздел `AGENTS/` хранит инструкции для специализированных агентов:

- архитектурные правила фронта и бэка;
- контекст из `product/*` и `BACKEND_RECOMMENDATIONS.md`;
- договорённости по структуре каталогов и API.

Этот файл даёт high-level картину проекта Perf Assist и служит отправной точкой для всех агентов, которые проектируют или изменяют архитектуру системы.