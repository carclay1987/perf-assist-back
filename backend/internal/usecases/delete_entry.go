package usecases

import (
	"github.com/inkuroshev/perf-assist-backend/internal/repositories"
)

// DeleteEntryCommand представляет команду для удаления записи
type DeleteEntryCommand struct {
	IDOrDate string
}

// DeleteEntryUsecase отвечает за удаление записи
type DeleteEntryUsecase struct {
	repo repositories.EntriesRepository
}

// NewDeleteEntryUsecase создает новый экземпляр DeleteEntryUsecase
func NewDeleteEntryUsecase(repo repositories.EntriesRepository) *DeleteEntryUsecase {
	return &DeleteEntryUsecase{
		repo: repo,
	}
}

// Execute выполняет удаление записи
func (u *DeleteEntryUsecase) Execute(cmd DeleteEntryCommand) error {
	// Проверяем, является ли cmd.IDOrDate датой (формат YYYY-MM-DD)
	if len(cmd.IDOrDate) == 10 {
		// Удаление по дате
		return u.repo.DeleteByDate(cmd.IDOrDate)
	} else {
		// Удаление по ID
		return u.repo.DeleteByID(cmd.IDOrDate)
	}
}
