export type EntryType = 'plan' | 'fact';

export interface Entry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  type: EntryType;
  raw_text: string;
  created_at: string; // ISO string
}

// Базовый URL бэкенда
// В контейнеризированной среде API доступен по пути /api
const API_BASE = '/api';

export function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const CURRENT_USER_ID = 'mock-user';

export async function fetchEntriesForDate(date: string, userId: string = CURRENT_USER_ID): Promise<Entry[]> {
  const url = `${API_BASE}/entries?from=${date}&to=${date}&user_id=${encodeURIComponent(userId)}`;

  const response = await fetch(url, { method: 'GET' });

  // Ошибку показываем только для 5xx (ошибка сервиса/сервера)
  if (response.status >= 500 && response.status <= 599) {
    throw new Error(`Failed to fetch entries: ${response.status} ${response.statusText}`);
  }

  // Для остальных статусов (включая 200 с null/пустым телом) просто возвращаем пустой список
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    // Если тело не JSON или пустое — считаем, что записей нет
    return [];
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data as Entry[];
}

export async function fetchEntriesForToday(userId: string = CURRENT_USER_ID): Promise<Entry[]> {
  const today = getTodayDate();
  return fetchEntriesForDate(today, userId);
}

export async function createEntryForDate(input: {
  userId?: string;
  date: string;
  type: EntryType;
  rawText: string;
}): Promise<Entry> {
  const body = {
    user_id: input.userId ?? CURRENT_USER_ID,
    date: input.date,
    type: input.type,
    raw_text: input.rawText,
  };

  const response = await fetch(`${API_BASE}/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to create entry: ${response.status} ${response.statusText}`);
  }

  const data: Entry = await response.json();
  return data;
}

export async function createEntryForToday(input: {
  userId?: string;
  type: EntryType;
  rawText: string;
}): Promise<Entry> {
  const today = getTodayDate();
  return createEntryForDate({
    userId: input.userId,
    date: today,
    type: input.type,
    rawText: input.rawText,
  });
}
