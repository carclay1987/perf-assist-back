package config

import (
	"os"
	"strconv"
)

// Config содержит конфигурацию приложения
type Config struct {
	ServerPort string
	DBHost     string
	DBPort     int
	DBUser     string
	DBPassword string
	DBName     string
}

// New создает новый экземпляр Config с значениями по умолчанию или из environment variables
func New() *Config {
	cfg := &Config{
		ServerPort: getEnv("PORT", "8080"),
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnvAsInt("DB_PORT", 5432),
		DBUser:     getEnv("DB_USER", "perfassist"),
		DBPassword: getEnv("DB_PASSWORD", "perfassist"),
		DBName:     getEnv("DB_NAME", "perfassist"),
	}

	// Если порт не начинается с двоеточия, добавим его
	if cfg.ServerPort[0] != ':' {
		cfg.ServerPort = ":" + cfg.ServerPort
	}

	return cfg
}

// getEnv возвращает значение переменной окружения или значение по умолчанию
func getEnv(key, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}

// getEnvAsInt возвращает значение переменной окружения как int или значение по умолчанию
func getEnvAsInt(name string, defaultVal int) int {
	valueStr := getEnv(name, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultVal
}
