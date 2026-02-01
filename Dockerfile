FROM golang:1.25-alpine AS builder

# Установка зависимостей для сборки
RUN apk add --no-cache git

# Установка рабочей директории
WORKDIR /app

# Копирование go модулей и суммы
COPY go.mod go.sum ./

# Загрузка зависимостей
RUN go mod download

# Копирование исходного кода
COPY . .

# Сборка бинарного файла
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/api

# Установка migrate
RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Финальный этап
FROM alpine:latest

# Установка ca-certificates для HTTPS запросов
RUN apk --no-cache add ca-certificates wget

WORKDIR /root/

# Копирование бинарного файла из builder образа
COPY --from=builder /app/main .
COPY --from=builder /go/bin/migrate /usr/local/bin/migrate

# Копирование необходимых файлов (если есть)
COPY --from=builder /app/internal/prompts ./internal/prompts
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/scripts ./scripts

# Сделать скрипт исполняемым
RUN chmod +x ./scripts/init.sh

# Открытие порта
EXPOSE 8080

# Запуск приложения
CMD ["./scripts/init.sh"]
