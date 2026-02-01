package entries

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/inkuroshev/perf-assist-backend/internal/repositories"
	"github.com/inkuroshev/perf-assist-backend/internal/usecases"
)

// CreateEntryHandler отвечает за обработку запроса на создание записи
type CreateEntryHandler struct {
	usecase *usecases.CreateEntryUsecase
}

// NewCreateEntryHandler создает новый экземпляр CreateEntryHandler
func NewCreateEntryHandler(usecase *usecases.CreateEntryUsecase) *CreateEntryHandler {
	return &CreateEntryHandler{
		usecase: usecase,
	}
}

// Handle обрабатывает запрос на создание записи
func (h *CreateEntryHandler) Handle(c *gin.Context) {
	var req createEntryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
		return
	}

	cmd := usecases.CreateEntryCommand{
		UserID:  req.UserID,
		Date:    req.Date,
		Type:    req.Type,
		RawText: req.RawText,
	}

	entry, err := h.usecase.Execute(cmd)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create entry"})
		return
	}

	c.JSON(http.StatusCreated, entry)
}

// createEntryRequest представляет структуру запроса для создания записи
type createEntryRequest struct {
	UserID  string                 `json:"user_id"`
	Date    string                 `json:"date"`
	Type    repositories.EntryType `json:"type"`
	RawText string                 `json:"raw_text"`
}
