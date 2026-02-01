package server

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"

	"github.com/inkuroshev/perf-assist-backend/internal/config"
	"github.com/inkuroshev/perf-assist-backend/internal/handlers/entries"
	"github.com/inkuroshev/perf-assist-backend/internal/handlers/health"
	perfhandlers "github.com/inkuroshev/perf-assist-backend/internal/handlers/perf"
	"github.com/inkuroshev/perf-assist-backend/internal/repositories"
	"github.com/inkuroshev/perf-assist-backend/internal/usecases"
)

// NewRouter создаёт и настраивает Gin-роутер.
// Здесь подключаются глобальные middleware и регистрируются все HTTP-ручки.
func NewRouter(cfg *config.Config) *gin.Engine {
	r := gin.New()

	// базовые middleware
	r.Use(gin.Recovery())

	// Подключение к базе данных
	db, err := sql.Open("postgres", getDBConnectionString(cfg))
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Проверка подключения к базе данных
	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	// Создание репозиториев
	// Используем PostgreSQL репозиторий
	entriesRepo := repositories.NewPostgresEntriesRepository(db)

	// Создание usecases
	createEntryUsecase := usecases.NewCreateEntryUsecase(entriesRepo)
	listEntriesUsecase := usecases.NewListEntriesUsecase(entriesRepo)
	updateEntryUsecase := usecases.NewUpdateEntryUsecase(entriesRepo)
	deleteEntryUsecase := usecases.NewDeleteEntryUsecase(entriesRepo)

	api := r.Group("/api")

	// регистрация health-ручки
	health.RegisterRoutes(api, health.Deps{})

	// регистрация ручек для entries
	entries.RegisterRoutes(api, entries.Deps{
		CreateEntryUsecase: createEntryUsecase,
		ListEntriesUsecase: listEntriesUsecase,
		UpdateEntryUsecase: updateEntryUsecase,
		DeleteEntryUsecase: deleteEntryUsecase,
	})

	// регистрация ручек для perf summary (mock)
	perfhandlers.RegisterRoutes(api, perfhandlers.Deps{})

	return r
}

// getDBConnectionString формирует строку подключения к базе данных
func getDBConnectionString(cfg *config.Config) string {
	return "host=" + cfg.DBHost +
		" port=" + fmt.Sprintf("%d", cfg.DBPort) +
		" user=" + cfg.DBUser +
		" password=" + cfg.DBPassword +
		" dbname=" + cfg.DBName +
		" sslmode=disable"
}
