package entries

import (
	"github.com/gin-gonic/gin"

	"github.com/inkuroshev/perf-assist-backend/internal/usecases"
)

// Deps содержит зависимости для entries handlers
type Deps struct {
	CreateEntryUsecase *usecases.CreateEntryUsecase
	ListEntriesUsecase *usecases.ListEntriesUsecase
	UpdateEntryUsecase *usecases.UpdateEntryUsecase
	DeleteEntryUsecase *usecases.DeleteEntryUsecase
}

// RegisterRoutes регистрирует ручки /entries и /entries/:idOrDate.
func RegisterRoutes(r *gin.RouterGroup, deps Deps) {
	createHandler := NewCreateEntryHandler(deps.CreateEntryUsecase)
	listHandler := NewListEntriesHandler(deps.ListEntriesUsecase)
	updateHandler := NewUpdateEntryHandler(deps.UpdateEntryUsecase)
	deleteHandler := NewDeleteEntryHandler(deps.DeleteEntryUsecase)

	r.POST("/entries", createHandler.Handle)
	r.GET("/entries", listHandler.Handle)
	r.PUT("/entries/:idOrDate", updateHandler.Handle)
	r.DELETE("/entries/:idOrDate", deleteHandler.Handle)
}
