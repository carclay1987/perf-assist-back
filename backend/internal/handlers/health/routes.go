package health

import "github.com/gin-gonic/gin"

// Deps содержит зависимости для health handlers
type Deps struct{}

// RegisterRoutes регистрирует health-check ручку.
func RegisterRoutes(r *gin.RouterGroup, deps Deps) {
	handler := NewHealthHandler()
	r.GET("/health", handler.Handle)
}
