package usecases

import (
	"time"

	"github.com/inkuroshev/perf-assist-backend/internal/repositories"
)

// CreateEntryCommand представляет команду для создания записи
type CreateEntryCommand struct {
	UserID  string
	Date    string
	Type    repositories.EntryType
	RawText string
}

// CreateEntryUsecase отвечает за создание записей
type CreateEntryUsecase struct {
	repo repositories.EntriesRepository
}

// NewCreateEntryUsecase создает новый экземпляр CreateEntryUsecase
func NewCreateEntryUsecase(repo repositories.EntriesRepository) *CreateEntryUsecase {
	return &CreateEntryUsecase{
		repo: repo,
	}
}

// Execute выполняет создание записи
func (u *CreateEntryUsecase) Execute(cmd CreateEntryCommand) (repositories.Entry, error) {
	entry := repositories.Entry{
		ID:        time.Now().UTC().Format("20060102150405.000000000"),
		UserID:    cmd.UserID,
		Date:      cmd.Date,
		Type:      cmd.Type,
		RawText:   cmd.RawText,
		CreatedAt: time.Now().UTC(),
	}

	err := u.repo.Create(entry)
	if err != nil {
		return repositories.Entry{}, err
	}

	return entry, nil
}
