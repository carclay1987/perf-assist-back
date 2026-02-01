#!/bin/sh

# Ждем, пока база данных будет готова
until migrate -database "postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable" -path /root/migrations up; do
  echo "Waiting for database to be ready..."
  sleep 2
done

echo "Database migrations completed successfully"

# Запуск основного приложения
exec ./main
