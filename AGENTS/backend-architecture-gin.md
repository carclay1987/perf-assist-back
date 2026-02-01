# Backend API: правила для агента (Gin)

Этот документ задаёт **жёсткие правила** для любого агента, который изменяет бэкенд Perf Assist на Go.

## 1. HTTP-фреймворк

1. Использовать **только Gin** как HTTP-фреймворк.
2. Все HTTP-ручки реализуются через `*gin.Engine`, `*gin.RouterGroup` и middleware Gin.
3. Не добавлять другие веб-фреймворки или роутеры.

## 2. Структура каталогов бэкенда

Бэкенд организован по слоям. Агенты обязаны соблюдать эту структуру.

```text
cmd/api/main.go          # точка входа HTTP-сервера

internal/
  config/                # конфигурация (env, файлы)
  logger/                # логгер и middleware логирования
  db/                    # инициализация подключения к БД

  repositories/          # доступ к данным (интерфейсы + реализации)
    entries_repo.go
    goals_repo.go
    ...

  usecases/              # бизнес-логика (application layer)
    create_entry.go
    list_entries.go
    generate_perf_summary.go
    ...

  handlers/              # HTTP-ручки (по ресурсам)
    entries/
      create_entry_handler.go
      list_entries_handler.go
      routes.go
    goals/
      ...
    perf/
      ...

  server/                # сборка Gin-роутера и middleware
    router.go

migrations/              # SQL-миграции

docs/
  openapi.yaml           # контракт API
```

Правила:
- Новый код HTTP-ручек добавлять **только** в `internal/handlers/**`.
- Новые usecases добавлять **только** в `internal/usecases/**`.
- Доступ к БД реализовывать **только** через `internal/repositories/**`.

## 3. Правила для main.go

Файл [`cmd/api/main.go`](cmd/api/main.go:1) выполняет только инициализацию и запуск сервера.

Обязательные шаги в `main()`:
1. Загрузка конфигурации из `internal/config`.
2. Инициализация логгера из `internal/logger`.
3. Инициализация подключения к БД через `internal/db`.
4. Создание репозиториев (`internal/repositories`).
5. Создание usecases (`internal/usecases`).
6. Создание Gin-роутера через `internal/server`.
7. Запуск HTTP-сервера.

Запрещено в `main.go`:
- реализовывать бизнес-логику;
- описывать SQL-запросы;
- напрямую работать с Gin-роутами (роуты регистрируются в `internal/server` и `internal/handlers`).

## 4. Правила для handlers (HTTP-ручки)

Расположение: `internal/handlers/<resource>/`.

1. Каждая группа ручек (entries, goals, perf и т.п.) живёт в отдельном подкаталоге.
2. Для каждой ручки создаётся отдельный handler-тип с методом `Handle`.
3. Handler **не содержит бизнес-логики**. Он:
   - парсит вход (JSON, query, path);
   - вызывает соответствующий usecase;
   - маппит результат/ошибки в HTTP-ответ.
4. Handler не обращается к БД напрямую. Только через usecases.
5. Регистрация роутов для ресурса делается в файле `routes.go` внутри каталога ресурса.

Пример структуры для ресурса `entries`:

```text
internal/handlers/entries/
  create_entry_handler.go
  list_entries_handler.go
  routes.go
```

В `routes.go` обязательно должна быть функция вида:

```go
func RegisterRoutes(r *gin.RouterGroup, deps Deps)
```

где `Deps` содержит ссылки на нужные usecases.

## 5. Правила для usecases (бизнес-логика)

Расположение: `internal/usecases/`.

1. Каждый usecase — отдельный тип с методом `Execute(ctx, cmd)` или аналогичным.
2. Usecase **не знает** о Gin, HTTP, JSON и т.п.
3. Usecase работает только с:
   - доменными моделями;
   - интерфейсами репозиториев из `internal/repositories`;
   - при необходимости — интерфейсом LLM-клиента.
4. Валидация бизнес-правил и основная логика выполняются в usecase, а не в handler.
5. Usecases не должны импортировать пакеты из `internal/handlers`.

## 6. Правила для repositories (доступ к данным)

Расположение: `internal/repositories/`.

1. Для каждой доменной сущности (Entry, Goal, PerfSummary и т.п.) описывается интерфейс репозитория.
2. Реализации репозиториев используют только слой `internal/db` для подключения к БД.
3. Usecases зависят от интерфейсов репозиториев, а не от конкретных реализаций.
4. Репозитории не должны импортировать `handlers` или Gin.

## 7. Правила для server/router

Расположение: `internal/server/router.go`.

1. В `router.go` создаётся и настраивается `*gin.Engine`.
2. Подключаются глобальные middleware (логирование, recovery, CORS и т.п.).
3. Создаётся корневой `RouterGroup` (например, `/api`).
4. Для каждой группы ручек вызывается `RegisterRoutes` из соответствующего пакета `internal/handlers/...`.

Запрещено в `server/router.go`:
- реализовывать бизнес-логику;
- напрямую работать с БД.

## 8. OpenAPI и контракт

1. Контракт API описывается в [`docs/openapi.yaml`](docs/openapi.yaml:1).
2. Любое изменение HTTP-ручек должно быть отражено в `openapi.yaml`.
3. Структуры запросов/ответов в handlers должны соответствовать описанию в `openapi.yaml`.

## 9. Запрещено

1. Использовать DI-фреймворки (wire, fx, dig и т.п.).
2. Добавлять новые HTTP-фреймворки или роутеры.
3. Писать бизнес-логику в:
   - `cmd/api/main.go`;
   - `internal/handlers/**`;
   - `internal/server/**`.
4. Обращаться к БД из handlers или server.

## 10. Обязательные принципы

1. **Gin только в HTTP-слое** (`internal/handlers`, `internal/server`).
2. **Usecases — единственное место бизнес-логики.**
3. **Repositories — единственное место работы с БД.**
4. **main.go — только сборка и запуск.**

Агент обязан строго следовать этим правилам при любых изменениях бэкенда Perf Assist.