#!/bin/bash

# Скрипт для добавления записи в /etc/hosts для локального домена perf-assist.local

HOSTS_FILE="/etc/hosts"
DOMAIN="perf-assist.local"
IP="127.0.0.1"

# Проверяем, существует ли уже запись в файле hosts
if grep -q "$DOMAIN" "$HOSTS_FILE"; then
    echo "Запись для $DOMAIN уже существует в $HOSTS_FILE"
    exit 0
fi

# Добавляем запись в файл hosts
if echo "$IP $DOMAIN" | sudo tee -a "$HOSTS_FILE" > /dev/null; then
    echo "Успешно добавлена запись для $DOMAIN в $HOSTS_FILE"
    echo "Теперь вы можете открыть приложение по адресу: http://$DOMAIN:3001"
else
    echo "Ошибка при добавлении записи в $HOSTS_FILE"
    echo "Пожалуйста, добавьте вручную строку '$IP $DOMAIN' в файл $HOSTS_FILE"
    exit 1
fi
