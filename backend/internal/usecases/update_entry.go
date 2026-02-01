package usecases

import (
	"github.com/inkuroshev/perf-assist-backend/internal/repositories"
)

// UpdateEntryCommand представляет команду для обновления записи
type UpdateEntryCommand struct {
	ID      string
	RawText string
}

// UpdateEntryUsecase отвечает за обновление записи
type UpdateEntryUsecase struct {
	repo repositories.EntriesRepository
}

// NewUpdateEntryUsecase создает новый экземпляр UpdateEntryUsecase
func NewUpdateEntryUsecase(repo repositories.EntriesRepository) *UpdateEntryUsecase {
	return &UpdateEntryUsecase{
		repo: repo,
	}
}

// Execute выполняет обновление записи
func (u *UpdateEntryUsecase) Execute(cmd UpdateEntryCommand) (repositories.Entry, error) {
	// Получаем существующую запись
	// В данном случае мы просто обновляем запись напрямую, так как у нас нет отдельного метода получения по ID
	entry := repositories.Entry{
		ID:      cmd.ID,
		RawText: cmd.RawText,
	}

	err := u.repo.Update(entry)
	if err != nil {
		return repositories.Entry{}, err
	}

	// Возвращаем обновленную запись (в реальной реализации нужно было бы получить её из репозитория)
	return entry, nil
}
