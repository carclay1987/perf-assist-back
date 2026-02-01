package usecases

import (
	"github.com/inkuroshev/perf-assist-backend/internal/repositories"
)

// ListEntriesQuery представляет запрос для получения списка записей
type ListEntriesQuery struct {
	From   string
	To     string
	UserID string
}

// ListEntriesUsecase отвечает за получение списка записей
type ListEntriesUsecase struct {
	repo repositories.EntriesRepository
}

// NewListEntriesUsecase создает новый экземпляр ListEntriesUsecase
func NewListEntriesUsecase(repo repositories.EntriesRepository) *ListEntriesUsecase {
	return &ListEntriesUsecase{
		repo: repo,
	}
}

// Execute выполняет получение списка записей
func (u *ListEntriesUsecase) Execute(query ListEntriesQuery) ([]repositories.Entry, error) {
	// Если заданы все три параметра и from == to — это запрос за один день
	if query.UserID != "" && query.From != "" && query.To != "" && query.From == query.To {
		return u.repo.ListByUserAndDate(query.UserID, query.From)
	} else if query.UserID != "" && query.From != "" && query.To != "" {
		// Запрос за период [from, to] для конкретного пользователя
		return u.repo.ListByUserAndPeriod(query.UserID, query.From, query.To)
	} else {
		// Фоллбек: если параметры не заданы, возвращаем все записи
		return u.repo.ListAll()
	}
}
