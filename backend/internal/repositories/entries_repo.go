package repositories

import (
	"time"
)

type EntryType string

const (
	EntryTypePlan EntryType = "plan"
	EntryTypeFact EntryType = "fact"
)

type Entry struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Date      string    `json:"date"`
	Type      EntryType `json:"type"`
	RawText   string    `json:"raw_text"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateEntryRequest struct {
	UserID  string    `json:"user_id"`
	Date    string    `json:"date"`
	Type    EntryType `json:"type"`
	RawText string    `json:"raw_text"`
}

// EntriesRepository определяет интерфейс для работы с entries
type EntriesRepository interface {
	Create(entry Entry) error
	ListByUserAndDate(userID, date string) ([]Entry, error)
	ListByUserAndPeriod(userID, from, to string) ([]Entry, error)
	ListAll() ([]Entry, error)
	Update(entry Entry) error
	DeleteByID(id string) error
	DeleteByDate(date string) error
}

// InMemoryEntriesRepository реализует EntriesRepository с использованием in-memory хранилища
type InMemoryEntriesRepository struct {
	entriesByUserDate map[string]map[string][]Entry
}

// NewInMemoryEntriesRepository создает новый экземпляр InMemoryEntriesRepository
func NewInMemoryEntriesRepository() *InMemoryEntriesRepository {
	return &InMemoryEntriesRepository{
		entriesByUserDate: make(map[string]map[string][]Entry),
	}
}

// Create добавляет новую запись
func (r *InMemoryEntriesRepository) Create(entry Entry) error {
	if _, ok := r.entriesByUserDate[entry.UserID]; !ok {
		r.entriesByUserDate[entry.UserID] = make(map[string][]Entry)
	}

	existing := r.entriesByUserDate[entry.UserID][entry.Date]
	var updated []Entry
	foundSameType := false
	for _, e := range existing {
		if e.Type == entry.Type {
			updated = append(updated, entry)
			foundSameType = true
		} else {
			updated = append(updated, e)
		}
	}
	if !foundSameType {
		updated = append(updated, entry)
	}

	r.entriesByUserDate[entry.UserID][entry.Date] = updated
	return nil
}

// ListByUserAndDate возвращает записи для конкретного пользователя и даты
func (r *InMemoryEntriesRepository) ListByUserAndDate(userID, date string) ([]Entry, error) {
	if byDate, ok := r.entriesByUserDate[userID]; ok {
		if entries, ok := byDate[date]; ok {
			return entries, nil
		}
	}
	return []Entry{}, nil
}

// ListByUserAndPeriod возвращает записи для пользователя за период
func (r *InMemoryEntriesRepository) ListByUserAndPeriod(userID, from, to string) ([]Entry, error) {
	var result []Entry
	if byDate, ok := r.entriesByUserDate[userID]; ok {
		for date, entries := range byDate {
			if date >= from && date <= to {
				result = append(result, entries...)
			}
		}
	}
	return result, nil
}

// ListAll возвращает все записи
func (r *InMemoryEntriesRepository) ListAll() ([]Entry, error) {
	var result []Entry
	for _, byDate := range r.entriesByUserDate {
		for _, entries := range byDate {
			result = append(result, entries...)
		}
	}
	return result, nil
}

// Update обновляет запись
func (r *InMemoryEntriesRepository) Update(entry Entry) error {
	for userID, byDate := range r.entriesByUserDate {
		for date, entries := range byDate {
			for i, e := range entries {
				if e.ID == entry.ID {
					e.RawText = entry.RawText
					entries[i] = e
					if e.RawText == "" {
						entries = append(entries[:i], entries[i+1:]...)
					}
					if len(entries) == 0 {
						delete(byDate, date)
					} else {
						byDate[date] = entries
					}
					r.entriesByUserDate[userID] = byDate
					return nil
				}
			}
		}
	}
	return nil
}

// DeleteByID удаляет запись по ID
func (r *InMemoryEntriesRepository) DeleteByID(id string) error {
	for userID, byDate := range r.entriesByUserDate {
		for date, entries := range byDate {
			for i, e := range entries {
				if e.ID == id {
					entries = append(entries[:i], entries[i+1:]...)
					if len(entries) == 0 {
						delete(byDate, date)
					} else {
						byDate[date] = entries
					}
					r.entriesByUserDate[userID] = byDate
					return nil
				}
			}
		}
	}
	return nil
}

// DeleteByDate удаляет все записи по дате
func (r *InMemoryEntriesRepository) DeleteByDate(date string) error {
	if len(date) != 10 {
		return nil // Неверный формат даты
	}

	for userID, byDate := range r.entriesByUserDate {
		if _, ok := byDate[date]; ok {
			delete(byDate, date)
			r.entriesByUserDate[userID] = byDate
		}
	}
	return nil
}
