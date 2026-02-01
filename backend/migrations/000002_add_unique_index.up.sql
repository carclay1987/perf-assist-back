-- Удаляем дубликаты, оставляя только последние записи по каждому типу
DELETE FROM entries
WHERE id NOT IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY user_id, date, type ORDER BY created_at DESC) as rn
    FROM entries
  ) t
  WHERE rn = 1
);

-- Создаем уникальный индекс
CREATE UNIQUE INDEX IF NOT EXISTS idx_entries_user_id_date_type ON entries(user_id, date, type);
