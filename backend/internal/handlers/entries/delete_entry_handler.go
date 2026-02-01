package entries

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/inkuroshev/perf-assist-backend/internal/usecases"
)

// DeleteEntryHandler отвечает за обработку запроса на удаление записи
type DeleteEntryHandler struct {
	usecase *usecases.DeleteEntryUsecase
}

// NewDeleteEntryHandler создает новый экземпляр DeleteEntryHandler
func NewDeleteEntryHandler(usecase *usecases.DeleteEntryUsecase) *DeleteEntryHandler {
	return &DeleteEntryHandler{
		usecase: usecase,
	}
}

// Handle обрабатывает запрос на удаление записи
func (h *DeleteEntryHandler) Handle(c *gin.Context) {
	idOrDate := c.Param("idOrDate")

	// Проверяем формат даты
	if len(idOrDate) == 10 && idOrDate[4] == '-' && idOrDate[7] == '-' {
		// Это может быть дата, проверим формат более точно
		// В реальной реализации можно добавить более строгую проверку формата даты
	} else if len(idOrDate) != 10 {
		// Это не дата, значит ID
	} else {
		// Неверный формат
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id or date format"})
		return
	}

	cmd := usecases.DeleteEntryCommand{
		IDOrDate: idOrDate,
	}

	err := h.usecase.Execute(cmd)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete entry"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}
