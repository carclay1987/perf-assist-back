package entries

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/inkuroshev/perf-assist-backend/internal/usecases"
)

// UpdateEntryHandler отвечает за обработку запроса на обновление записи
type UpdateEntryHandler struct {
	usecase *usecases.UpdateEntryUsecase
}

// NewUpdateEntryHandler создает новый экземпляр UpdateEntryHandler
func NewUpdateEntryHandler(usecase *usecases.UpdateEntryUsecase) *UpdateEntryHandler {
	return &UpdateEntryHandler{
		usecase: usecase,
	}
}

// Handle обрабатывает запрос на обновление записи
func (h *UpdateEntryHandler) Handle(c *gin.Context) {
	id := c.Param("idOrDate")

	var req updateEntryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
		return
	}

	if req.ID != "" && req.ID != id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id in path and body mismatch"})
		return
	}

	cmd := usecases.UpdateEntryCommand{
		ID:      id,
		RawText: req.RawText,
	}

	entry, err := h.usecase.Execute(cmd)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update entry"})
		return
	}

	c.JSON(http.StatusOK, entry)
}

// updateEntryRequest представляет структуру запроса для обновления записи
type updateEntryRequest struct {
	ID      string `json:"id"`
	RawText string `json:"raw_text"`
}
