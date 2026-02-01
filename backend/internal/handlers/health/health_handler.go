package health

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthHandler отвечает за обработку health-check запроса
type HealthHandler struct{}

// NewHealthHandler создает новый экземпляр HealthHandler
func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

// Handle обрабатывает health-check запрос
func (h *HealthHandler) Handle(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
