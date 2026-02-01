package http

import (
	"encoding/json"
	"log"
	"net/http"
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

type PerfGoal struct {
	ID       string   `json:"id"`
	Title    string   `json:"title"`
	Context  string   `json:"context"`
	Outputs  []string `json:"outputs"`
	Outcomes []string `json:"outcomes"`
}

type PerfSummaryResponse struct {
	ID          string     `json:"id"`
	PeriodStart string     `json:"period_start"`
	PeriodEnd   string     `json:"period_end"`
	SummaryText string     `json:"summary_text"`
	Goals       []PerfGoal `json:"goals"`
}

type Server struct {
	entriesByUserDate map[string]map[string][]Entry
}

func NewServer() *Server {
	return &Server{
		entriesByUserDate: make(map[string]map[string][]Entry),
	}
}

func (s *Server) Register(mux *http.ServeMux) {
	mux.HandleFunc("/health", s.handleHealth)
	mux.HandleFunc("/entries", s.handleEntries)
	mux.HandleFunc("/entries/", s.handleEntryByIDOrDate)
	mux.HandleFunc("/perf/summary:mock", s.handlePerfSummaryMock)
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"status":"ok"}`))
}

func (s *Server) handleEntries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Поддерживаем только POST и GET на /entries без идентификатора
	if r.URL.Path != "/entries" {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "not found"})
		return
	}

	switch r.Method {
	case http.MethodPost:
		var req CreateEntryRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid JSON"})
			return
		}

		log.Printf("/entries POST received: user_id=%s date=%s type=%s len(raw_text)=%d", req.UserID, req.Date, req.Type, len(req.RawText))

		entry := Entry{
			ID:        time.Now().UTC().Format("20060102150405.000000000"),
			UserID:    req.UserID,
			Date:      req.Date,
			Type:      req.Type,
			RawText:   req.RawText,
			CreatedAt: time.Now().UTC(),
		}

		if _, ok := s.entriesByUserDate[req.UserID]; !ok {
			s.entriesByUserDate[req.UserID] = make(map[string][]Entry)
		}

		// Для сценария "Сегодня" нам важно хранить только актуальную версию
		// записей за конкретную дату и пользователя. Сейчас у нас два типа записей:
		// plan (план на день) и fact (факт по итогам дня). Раньше мы перезаписывали
		// весь список записей за (user_id, date) одной записью, из-за чего сохранение
		// плана перетирало факт и наоборот. Теперь мы храним по одной записи
		// на каждый тип отдельно и при сохранении обновляем только соответствующий тип.

		existing := s.entriesByUserDate[req.UserID][req.Date]
		var updated []Entry
		foundSameType := false
		for _, e := range existing {
			if e.Type == req.Type {
				// Обновляем запись того же типа (plan или fact)
				updated = append(updated, entry)
				foundSameType = true
			} else {
				// Сохраняем записи другого типа (например, факт при обновлении плана)
				updated = append(updated, e)
			}
		}

		if !foundSameType {
			// Если записи такого типа ещё не было, просто добавляем её
			updated = append(updated, entry)
		}

		s.entriesByUserDate[req.UserID][req.Date] = updated

		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(entry)

	case http.MethodGet:
		from := r.URL.Query().Get("from")
		to := r.URL.Query().Get("to")
		userID := r.URL.Query().Get("user_id")
		log.Printf("/entries GET received: from=%s to=%s user_id=%s", from, to, userID)

		var result []Entry

		// Если указан user_id и from/to для одного дня — возвращаем записи за этот день
		if userID != "" && from != "" && to != "" && from == to {
			if byDate, ok := s.entriesByUserDate[userID]; ok {
				if entries, ok := byDate[from]; ok {
					result = append(result, entries...)
				}
			}
		} else {
			// Фоллбек для страницы "Лента" и старых клиентов:
			// если параметры не заданы, возвращаем все записи всех пользователей и дат.
			for uid, byDate := range s.entriesByUserDate {
				for d, entries := range byDate {
					log.Printf("/entries feed include user_id=%s date=%s count=%d", uid, d, len(entries))
					result = append(result, entries...)
				}
			}
		}

		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(result)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

// handleEntryByIDOrDate обрабатывает:
// - PUT /entries/{id}
// - DELETE /entries/{date}
func (s *Server) handleEntryByIDOrDate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Ожидаем путь вида /entries/{idOrDate}
	path := r.URL.Path
	const prefix = "/entries/"
	if len(path) <= len(prefix) || path[:len(prefix)] != prefix {
		w.WriteHeader(http.StatusNotFound)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "not found"})
		return
	}

	key := path[len(prefix):]
	log.Printf("/entries/%s %s received", key, r.Method)

	switch r.Method {
	case http.MethodPut:
		// Обновление записи по ID. В текущей in-memory модели ID не индексируется,
		// поэтому ищем запись линейным проходом по всем пользователям и датам.
		var req Entry
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid JSON"})
			return
		}

		if req.ID != "" && req.ID != key {
			// Если в теле указан ID, он должен совпадать с path-параметром
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "id in path and body mismatch"})
			return
		}

		found := false
		for userID, byDate := range s.entriesByUserDate {
			for date, entries := range byDate {
				for i, e := range entries {
					if e.ID == key {
						// Обновляем только raw_text, остальные поля оставляем как есть
						log.Printf("Updating entry id=%s user_id=%s date=%s type=%s len(raw_text)=%d", e.ID, e.UserID, e.Date, e.Type, len(req.RawText))
						e.RawText = req.RawText
						entries[i] = e
						// Если после обновления raw_text стал пустым, удаляем запись этого типа
						if e.RawText == "" {
							log.Printf("Entry id=%s became empty, removing it from user_id=%s date=%s", e.ID, e.UserID, e.Date)
							entries = append(entries[:i], entries[i+1:]...)
						}
						// Если после удаления не осталось записей на эту дату — удаляем саму дату
						if len(entries) == 0 {
							log.Printf("No entries left for user_id=%s date=%s, removing date bucket", userID, date)
							delete(byDate, date)
						} else {
							byDate[date] = entries
						}
						s.entriesByUserDate[userID] = byDate
						found = true
						w.WriteHeader(http.StatusOK)
						_ = json.NewEncoder(w).Encode(e)
						return
					}
				}
			}
		}

		if !found {
			w.WriteHeader(http.StatusNotFound)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "entry not found"})
		}

	case http.MethodDelete:
		// Удаление всех записей (план и факт) на дату key (формат YYYY-MM-DD)
		date := key
		if len(date) != 10 {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid date format, expected YYYY-MM-DD"})
			return
		}

		// В in-memory модели дата хранится как строка, поэтому просто удаляем ключ
		for userID, byDate := range s.entriesByUserDate {
			if _, ok := byDate[date]; ok {
				log.Printf("Deleting entries for user_id=%s date=%s count=%d", userID, date, len(byDate[date]))
				delete(byDate, date)
				s.entriesByUserDate[userID] = byDate
			}
		}

		// Даже если записей не было, операция считается успешной
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func (s *Server) handlePerfSummaryMock(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	var body map[string]any
	_ = json.NewDecoder(r.Body).Decode(&body)
	log.Printf("/perf/summary:mock POST received: %+v", body)

	resp := PerfSummaryResponse{
		ID:          "mock-summary-1",
		PeriodStart: "2025-07-01",
		PeriodEnd:   "2025-12-31",
		SummaryText: "Черновик перф-саммари на основе нескольких развернутых примеров целей.",
		Goals: []PerfGoal{
			{
				ID:      "goal-1",
				Title:   "Оптимизация производительности критических сервисов",
				Context: "В середине перф-цикла мы столкнулись с деградацией производительности нескольких ключевых API. Время отклика выросло до 800–1000 мс, участились таймауты, пользователи жаловались на медленную работу приложения. Параллельно рос трафик, и стало понятно, что текущая архитектура и настройки БД не выдерживают нагрузку. Я инициировал и возглавил работу по комплексной оптимизации производительности.",
				Outputs: []string{
					"Провёл профилирование 5 критических сервисов (tracing, pprof, анализ логов) и составил карту узких мест.",
					"Оптимизировал SQL-запросы: убрал N+1, добавил недостающие индексы, переписал несколько тяжёлых join-ов.",
					"Внедрил кэширование для часто запрашиваемых данных (Redis), добавил инвалидацию по ключевым событиям.",
					"Переписал часть бизнес-логики на более эффективные алгоритмы, убрал лишние синхронные вызовы.",
					"Настроил дашборды и алерты по latency, error rate и нагрузке на БД в Grafana/Prometheus.",
				},
				Outcomes: []string{
					"Снизил среднее время отклика API с ~850 мс до 140–180 мс (в 4–6 раз быстрее) под пиковой нагрузкой.",
					"Уменьшил нагрузку на основную БД на 60–70% за счёт оптимизаций и кэширования.",
					"Сократил долю запросов с таймаутами с 5% до <0.5%, что заметно улучшило UX.",
					"Команда получила набор best practices по профилированию и оптимизации, которые теперь используем в новых сервисах.",
				},
			},
			{
				ID:      "goal-2",
				Title:   "Перезапуск процесса планирования и синхронизации команды",
				Context: "Команда застряла в режиме постоянного 'пожаротушения': задачи приходили хаотично, приоритеты часто менялись, часть работы терялась между спринтами. Это приводило к выгоранию и ощущению, что мы много делаем, но мало завершаем. Я взял на себя инициативу перезапустить процесс планирования и синхронизации, чтобы вернуть предсказуемость и прозрачность.",
				Outputs: []string{
					"Провёл серию 1:1 и ретроспектив, чтобы собрать болевые точки текущего процесса у команды и стейкхолдеров.",
					"Совместно с продуктом пересобрал бэклог: выделили 3 ключевых направления и выкинули/объединили устаревшие задачи.",
					"Внедрил еженедельный planning с явным capacity и ограничением WIP по основным потокам работы.",
					"Настроил визуализацию прогресса (канбан-доска, дашборд по статусам задач и блокерам).",
					"Запустил короткие ежедневные синки с фокусом на блокерах и приоритетах, а не на отчётах 'что делал вчера'.",
				},
				Outcomes: []string{
					"Доля задач, не доведённых до конца в рамках спринта, снизилась с ~40% до 10–15%.",
					"Команда стала лучше понимать приоритеты: по результатам опроса, ясность целей выросла с 3.1 до 4.4 из 5.",
					"Снизилось количество незапланированных 'пожаров' за счёт более прозрачной коммуникации с продуктом.",
					"На ретроспективах команда отмечает, что стало проще говорить 'нет' лишним задачам и защищать фокус.",
				},
			},
			{
				ID:      "goal-3",
				Title:   "Внедрение системы фичефлагов и безопасных релизов",
				Context: "До начала периода релизы проходили по схеме 'big bang': крупные изменения выкатывались сразу на всех пользователей, что создавало высокий риск инцидентов и откатов. Не было единого подхода к фичефлагам, каждый сервис решал это по-своему или не решал вовсе. Я предложил и реализовал единый подход к фичефлагам, чтобы сделать релизы более управляемыми и безопасными.",
				Outputs: []string{
					"Исследовал существующие решения и подготовил RFC с предложением архитектуры.",
					"Реализовал базовую библиотеку для работы с фичефлагами для нашего стека (backend + frontend).",
					"Настроил хранение конфигурации флагов и интеграцию с CI/CD для включения/выключения фич без релиза.",
					"Провёл воркшоп для команды по паттернам и анти-паттернам использования фичефлагов.",
					"Помог нескольким продуктовым командам перевести новые фичи на поэтапные выкаты (canary rollout, процент пользователей).",
				},
				Outcomes: []string{
					"Количество инцидентов, связанных с релизами новых фич, снизилось примерно в 2 раза за перф-период.",
					"Время отката проблемной фичи сократилось с часов до минут за счёт возможности быстро выключить флаг.",
					"Команды стали чаще использовать поэтапные выкаты и A/B-тесты, что улучшило качество релизов.",
					"Практики фичефлагов были задокументированы и включены в стандарт онбординга новых инженеров.",
				},
			},
			{
				ID:      "goal-4",
				Title:   "Развитие junior-инженеров и рост автономности команды",
				Context: "В начале периода в команде было два junior-инженера, которые испытывали сложности с самостоятельной работой: частые блокеры, неуверенность в решениях, высокая нагрузка на сеньоров. Это замедляло команду и создавало ощущение 'бутылочного горлышка'. Я сфокусировался на системном развитии ребят и повышении автономности команды.",
				Outputs: []string{
					"Сформировал для каждого junior-а индивидуальный план развития с конкретными целями на 3–6 месяцев.",
					"Вёл регулярные 1:1 встречи, помогал разбирать сложные задачи и давал обратную связь по прогрессу.",
					"Организовал практику парного программирования и ревью с фокусом на объяснении 'почему', а не только 'что исправить'.",
					"Делегировал постепенно усложняющиеся задачи: от багфиксов до небольших фич под полную ответственность.",
					"Помог ребятам подготовить и провести внутренние мини-доклады по темам, в которых они прокачались.",
				},
				Outcomes: []string{
					"Оба junior-инженера стали закрывать задачи end-to-end с минимальной поддержкой, время менторинга сократилось.",
					"Один из ребят взял на себя ответственность за небольшой сервис и стал точкой контакта по нему.",
					"Команда отмечает, что стало проще распределять задачи и меньше 'узких мест' вокруг отдельных людей.",
					"На перф-цикле у обоих junior-ов зафиксирован рост уровня и расширение зоны ответственности.",
				},
			},
			{
				ID:      "goal-5",
				Title:   "Улучшение наблюдаемости и работы с инцидентами",
				Context: "С ростом нагрузки и количества сервисов стало сложнее быстро понимать, что именно сломалось и где искать причину. Инциденты разбирались долго, часть метрик и логов была разрознена, алерты часто либо молчали, либо шумели. Я взялся за улучшение наблюдаемости и процесса работы с инцидентами.",
				Outputs: []string{
					"Провёл аудит текущих метрик, логов и алертов по основным сервисам, собрал карту 'что мы видим, а чего не видим'.",
					"Добавил ключевые бизнес- и технические метрики (latency, error rate, throughput, SLA по основным флоу).",
					"Внедрил структурированное логирование и корреляцию запросов (trace_id) между сервисами.",
					"Пересобрал алерты: убрал шумные, добавил пороговые и трендовые алерты по критичным показателям.",
					"Запустил практику postmortem-ов с фокусом на системных улучшениях, а не поиске виноватых.",
				},
				Outcomes: []string{
					"Среднее время обнаружения инцидентов (MTTD) сократилось с ~30 минут до 5–10 минут.",
					"Среднее время восстановления (MTTR) сократилось примерно в 2 раза за счёт лучшей видимости и чек-листов.",
					"Количество ложных/шумных алертов снизилось, дежурные стали реже просыпаться ночью 'впустую'.",
					"Команда стала увереннее относиться к релизам, так как лучше 'видит' систему и быстрее находит корень проблем.",
				},
			},
		},
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(resp)
}
