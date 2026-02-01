package perf

import (
	"github.com/gin-gonic/gin"
)

// Deps содержит зависимости для perf handlers
type Deps struct{}

// RegisterRoutes регистрирует mock-ручку для перф-саммари.
func RegisterRoutes(r *gin.RouterGroup, deps Deps) {
	handler := NewPerfSummaryHandler()
	r.POST("/perf/summary:mock", handler.Handle)
}
