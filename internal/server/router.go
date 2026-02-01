package server

import (
	"github.com/gin-gonic/gin"

	"github.com/inkuroshev/perf-assist-backend/internal/handlers/entries"
	"github.com/inkuroshev/perf-assist-backend/internal/handlers/health"
	perfhandlers "github.com/inkuroshev/perf-assist-backend/internal/handlers/perf"
	"github.com/inkuroshev/perf-assist-backend/internal/repositories"
	"github.com/inkuroshev/perf-assist-backend/internal/usecases"
)

// NewRouter создаёт и настраивает Gin-роутер.
// Здесь подключаются глобальные middleware и регистрируются все HTTP-ручки.
func NewRouter() *gin.Engine {
	r := gin.New()

	// базовые middleware
	r.Use(gin.Recovery())

	// Создание репозиториев
	entriesRepo := repositories.NewInMemoryEntriesRepository()

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
