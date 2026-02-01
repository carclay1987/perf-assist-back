package repositories

import (
	"database/sql"
	"fmt"
	"time"
)

// PostgresEntriesRepository реализует EntriesRepository с использованием PostgreSQL
type PostgresEntriesRepository struct {
	db *sql.DB
}

// NewPostgresEntriesRepository создает новый экземпляр PostgresEntriesRepository
func NewPostgresEntriesRepository(db *sql.DB) *PostgresEntriesRepository {
	return &PostgresEntriesRepository{
		db: db,
	}
}

// Create добавляет новую запись или обновляет существующую с тем же типом для той же даты
func (r *PostgresEntriesRepository) Create(entry Entry) error {
	query := `
		INSERT INTO entries (id, user_id, date, type, raw_text, created_at) 
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (user_id, date, type) 
		DO UPDATE SET raw_text = EXCLUDED.raw_text, created_at = EXCLUDED.created_at`
	_, err := r.db.Exec(query, entry.ID, entry.UserID, entry.Date, entry.Type, entry.RawText, entry.CreatedAt)
	if err != nil {
		// Логирование ошибки для отладки
		fmt.Printf("Error creating entry: %v\n", err)
		fmt.Printf("Entry data: %+v\n", entry)
		return err
	}
	return nil
}

// ListByUserAndDate возвращает записи для конкретного пользователя и даты
func (r *PostgresEntriesRepository) ListByUserAndDate(userID, date string) ([]Entry, error) {
	query := `SELECT id, user_id, date, type, raw_text, created_at FROM entries WHERE user_id = $1 AND date = $2`
	rows, err := r.db.Query(query, userID, date)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []Entry
	for rows.Next() {
		var entry Entry
		var createdAt time.Time
		err := rows.Scan(&entry.ID, &entry.UserID, &entry.Date, &entry.Type, &entry.RawText, &createdAt)
		if err != nil {
			return nil, err
		}
		entry.CreatedAt = createdAt
		entries = append(entries, entry)
	}

	return entries, nil
}

// ListByUserAndPeriod возвращает записи для пользователя за период
func (r *PostgresEntriesRepository) ListByUserAndPeriod(userID, from, to string) ([]Entry, error) {
	query := `SELECT id, user_id, date, type, raw_text, created_at FROM entries WHERE user_id = $1 AND date >= $2 AND date <= $3 ORDER BY date`
	rows, err := r.db.Query(query, userID, from, to)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []Entry
	for rows.Next() {
		var entry Entry
		var createdAt time.Time
		err := rows.Scan(&entry.ID, &entry.UserID, &entry.Date, &entry.Type, &entry.RawText, &createdAt)
		if err != nil {
			return nil, err
		}
		entry.CreatedAt = createdAt
		entries = append(entries, entry)
	}

	return entries, nil
}

// ListAll возвращает все записи
func (r *PostgresEntriesRepository) ListAll() ([]Entry, error) {
	query := `SELECT id, user_id, date, type, raw_text, created_at FROM entries ORDER BY date`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []Entry
	for rows.Next() {
		var entry Entry
		var createdAt time.Time
		err := rows.Scan(&entry.ID, &entry.UserID, &entry.Date, &entry.Type, &entry.RawText, &createdAt)
		if err != nil {
			return nil, err
		}
		entry.CreatedAt = createdAt
		entries = append(entries, entry)
	}

	return entries, nil
}

// Update обновляет запись
func (r *PostgresEntriesRepository) Update(entry Entry) error {
	query := `UPDATE entries SET raw_text = $1 WHERE id = $2`
	_, err := r.db.Exec(query, entry.RawText, entry.ID)
	return err
}

// DeleteByID удаляет запись по ID
func (r *PostgresEntriesRepository) DeleteByID(id string) error {
	query := `DELETE FROM entries WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

// DeleteByDate удаляет все записи по дате
func (r *PostgresEntriesRepository) DeleteByDate(date string) error {
	query := `DELETE FROM entries WHERE date = $1`
	_, err := r.db.Exec(query, date)
	return err
}
