CREATE TABLE IF NOT EXISTS entries (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('plan', 'fact')),
    raw_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
CREATE INDEX IF NOT EXISTS idx_entries_user_id_date ON entries(user_id, date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_entries_user_id_date_type ON entries(user_id, date, type);
