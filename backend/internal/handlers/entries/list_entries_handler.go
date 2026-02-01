package entries

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/inkuroshev/perf-assist-backend/internal/usecases"
)

// ListEntriesHandler отвечает за обработку запроса на получение списка записей
type ListEntriesHandler struct {
	usecase *usecases.ListEntriesUsecase
}

// NewListEntriesHandler создает новый экземпляр ListEntriesHandler
func NewListEntriesHandler(usecase *usecases.ListEntriesUsecase) *ListEntriesHandler {
	return &ListEntriesHandler{
		usecase: usecase,
	}
}

// Handle обрабатывает запрос на получение списка записей
func (h *ListEntriesHandler) Handle(c *gin.Context) {
	query := usecases.ListEntriesQuery{
		From:   c.Query("from"),
		To:     c.Query("to"),
		UserID: c.Query("user_id"),
	}

	entries, err := h.usecase.Execute(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list entries"})
		return
	}

	c.JSON(http.StatusOK, entries)
}
