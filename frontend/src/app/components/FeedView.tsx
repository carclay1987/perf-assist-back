import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Calendar, Edit2, X, Search, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { TiptapRichTextArea } from './TiptapRichTextArea';
import { createEntryForDate, getTodayDate } from '../api/entries';

import { Entry as ApiEntry } from '../api/entries';

type Entry = ApiEntry & {
  text: string; // Добавляем поле text для совместимости с существующим кодом
};

export function FeedView() {
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'quarter' | 'custom'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [editedText, setEditedText] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [entriesToDelete, setEntriesToDelete] = useState<{[key: string]: Entry[]}>({});
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [deletingEntries, setDeletingEntries] = useState<{[key: string]: {plan?: boolean, fact?: boolean}}>({});
  const [deletingDates, setDeletingDates] = useState<{[key: string]: boolean}>({});
  const [emptyDates, setEmptyDates] = useState<{[key: string]: boolean}>({});
  const [deletingCardText, setDeletingCardText] = useState<{[key: string]: {plan?: boolean, fact?: boolean}}>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        // Определяем диапазон дат в зависимости от выбранного периода и текущей опорной даты
        const base = new Date(currentDate);
        const fromDate = new Date(base);
        const toDate = new Date(base);

        if (filterPeriod === 'week') {
          // Неделя: с понедельника по воскресенье
          const day = base.getDay() || 7; // 1-7, где 1 — понедельник
          fromDate.setDate(base.getDate() - day + 1);
          toDate.setDate(fromDate.getDate() + 6);
        } else if (filterPeriod === 'month') {
          // Месяц: с первого по последний день месяца
          fromDate.setDate(1);
          toDate.setMonth(fromDate.getMonth() + 1, 0); // последний день месяца
        } else if (filterPeriod === 'quarter') {
          // Квартал: 3 месяца, начиная с начала квартала
          const quarter = Math.floor(fromDate.getMonth() / 3); // 0,1,2,3
          fromDate.setMonth(quarter * 3, 1);
          const endMonth = quarter * 3 + 3;
          toDate.setMonth(endMonth, 0); // последний день квартала
        } else {
          // custom или неизвестный — по умолчанию один день
          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(0, 0, 0, 0);
        }

        const format = (d: Date) => d.toISOString().split('T')[0];

        const params = new URLSearchParams({
          from: format(fromDate),
          to: format(toDate),
          user_id: 'mock-user',
        });

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/entries?${params.toString()}`);
        if (!response.ok) {
          console.error('Ошибка при загрузке ленты:', response.status, response.statusText);
          return;
        }
        const data = await response.json();

        // Бэкенд может вернуть null/undefined или не-массив — в этом случае считаем, что записей нет
        const safeArray = Array.isArray(data) ? data : [];

        const mapped: Entry[] = safeArray.map((entry: any) => ({
          ...entry,
          text: entry.raw_text,
        }));
        setEntries(mapped);
      } catch (error) {
        console.error('Ошибка сети при загрузке ленты:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [filterPeriod, currentDate]);

  useEffect(() => {
    const deleteEntries = async () => {
      for (const [date, entries] of Object.entries(entriesToDelete)) {
        if (entries.length === 2) {
          // Удалить все записи на этот день
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL || '/api'}/entries/${date}`,
              {
                method: 'DELETE',
              }
            );
            if (!response.ok) {
              console.error('Ошибка при удалении записей:', response.status, response.statusText);
              continue;
            }
            // Обновляем список записей
            setEntries(prev => prev.filter(entry => entry.date !== date));
          } catch (error) {
            console.error('Ошибка сети при удалении записей:', error);
          }
        } else if (entries.length === 1) {
          // Сохранить пустоту в запись
          const entry = entries[0];
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL || '/api'}/entries/${entry.id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...entry,
                  raw_text: '',
                }),
              }
            );
            if (!response.ok) {
              console.error('Ошибка при обновлении записи:', response.status, response.statusText);
              continue;
            }
            // Обновляем список записей: оставляем запись, но делаем её "пустой"
            setEntries(prev => prev.map(e =>
              e.id === entry.id
                ? { ...e, raw_text: '', text: '' }
                : e
            ));
          } catch (error) {
            console.error('Ошибка сети при обновлении записи:', error);
          }
        }
      }
      // Очищаем список записей для удаления
      setEntriesToDelete({});
      // Сбрасываем состояние анимации удаления
      setDeletingEntries({});
      setDeletingDates({});
    };

    if (Object.keys(entriesToDelete).length > 0) {
      deleteEntries();
    }
  }, [entriesToDelete]);

  const groupByWeek = (entries: Entry[]) => {
    const grouped: { [key: string]: Entry[] } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay() + 1);
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = [];
      }
      grouped[weekKey].push(entry);
    });
    
    return grouped;
  };

  const groupByDate = (entries: Entry[]) => {
    const grouped: { [key: string]: { plan?: Entry; fact?: Entry } } = {};

    entries.forEach(entry => {
      if (!grouped[entry.date]) {
        grouped[entry.date] = {};
      }
      grouped[entry.date][entry.type] = entry;
    });

    return grouped;
  };

  const groupedEntries = groupByWeek(entries);

  // Отслеживаем пустые даты и применяем к ним анимацию исчезновения
  useEffect(() => {
    const dateGroups = groupByDate(entries);
    const newEmptyDates: {[key: string]: boolean} = {};
    
    Object.entries(dateGroups).forEach(([date, { plan, fact }]) => {
      // Если нет ни плана, ни факта, помечаем дату как пустую
      if (!plan && !fact) {
        newEmptyDates[date] = true;
      }
    });
    
    setEmptyDates(newEmptyDates);
    
    // Применяем анимацию исчезновения к пустым датам
    Object.keys(newEmptyDates).forEach(date => {
      setTimeout(() => {
        setEmptyDates(prev => ({ ...prev, [date]: false })); // Сбрасываем флаг после анимации
      }, 300); // Задержка в 300 мс для анимации
    });
  }, [entries]);

  const formatWeekRange = (weekStart: string) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('ru-RU', options)} - ${end.toLocaleDateString('ru-RU', options)}`;
  };

  // Навигация по периодам (вперёд/назад) — аналогично дизайн-проекту
  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);

    if (filterPeriod === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (filterPeriod === 'month') {
      // Используем setMonth с установкой дня в 1, чтобы избежать пропуска месяцев
      // при переходе с конца месяца (например, с 31 января на март, пропуская февраль)
      newDate.setDate(1);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (filterPeriod === 'quarter') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 3 : -3));
    }

    setCurrentDate(newDate);
  };

  const getPeriodTitle = () => {
    if (filterPeriod === 'week') {
      const weekStart = new Date(currentDate);
      const day = weekStart.getDay() || 7;
      weekStart.setDate(currentDate.getDate() - day + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
      return `${weekStart.toLocaleDateString('ru-RU', options)} - ${weekEnd.toLocaleDateString('ru-RU', options)}`;
    } else if (filterPeriod === 'month') {
      return currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    } else if (filterPeriod === 'quarter') {
      const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
      return `Q${quarter} ${currentDate.getFullYear()}`;
    }
    return '';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short' 
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  const openEntry = (entry: Entry) => {
    setSelectedEntry(entry);
    setEditedText(entry.raw_text || entry.text);
    setIsPanelVisible(true);
  };

  const closeEntry = () => {
    setIsPanelVisible(false);
    // Задержка перед сбросом selectedEntry, чтобы анимация успела завершиться
    setTimeout(() => {
      setSelectedEntry(null);
      setEditedText('');
    }, 300);
  };

  const handleDeleteEntry = (entry: Entry) => {
    const date = entry.date;
    const type = entry.type;
    
    // Помечаем текст в карточке как удаляемый для анимации
    setDeletingCardText(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [type]: true
      }
    }));
    
    // Добавляем небольшую задержку перед фактическим удалением текста, чтобы анимация успела воспроизвестись
    setTimeout(() => {
      setEntriesToDelete(prev => {
        const currentEntries = prev[date] || [];
        const existingEntryIndex = currentEntries.findIndex(e => e.type === type);
        
        let updatedEntries;
        if (existingEntryIndex >= 0) {
          // Если запись уже помечена для удаления, удаляем её из списка
          updatedEntries = [...currentEntries];
          updatedEntries.splice(existingEntryIndex, 1);
        } else {
          // Добавляем запись в список для удаления
          updatedEntries = [...currentEntries, entry];
        }
        
        // Проверяем, если для этой даты помечены обе записи (план и факт) для удаления
        if (updatedEntries.length === 2) {
          // Помечаем всю дату как удаляемую для анимации
          setDeletingDates(prevDates => ({
            ...prevDates,
            [date]: true
          }));
          
          // Добавляем небольшую задержку перед фактическим удалением, чтобы анимация успела воспроизвестись
          setTimeout(() => {
            setEntriesToDelete(prevToDelete => ({
              ...prevToDelete,
              [date]: updatedEntries
            }));
          }, 300); // Задержка в 300 мс для анимации
        } else {
          // Если удаляем только одну запись, применяем изменения сразу без анимации блока даты
          return {
            ...prev,
            [date]: updatedEntries
          };
        }
        
        // Возвращаем предыдущее состояние, так как фактическое обновление произойдет позже
        return prev;
      });
    }, 300); // Задержка в 300 мс для анимации текста
  };

  const saveEntry = async () => {
    if (!selectedEntry) return;
    
    try {
      // Создание новой записи (для незаполненных блоков)
      const newEntry = await createEntryForDate({
        userId: 'mock-user',
        date: selectedEntry.date,
        type: selectedEntry.type as 'plan' | 'fact',
        rawText: editedText,
      });
      
      // Обновляем список записей
      setEntries(prev => [...prev, { ...newEntry, text: editedText }]);
      
      closeEntry();
    } catch (error) {
      console.error('Ошибка при сохранении записи:', error);
      // Дополнительно выводим сообщение для пользователя
      alert('Не удалось сохранить запись. Пожалуйста, проверьте консоль браузера для получения дополнительной информации.');
    }
  };

  return (
    <div className="flex h-full">
      {/* Main feed */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-4">Лента</h1>
            
            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Filter className="w-5 h-5" />
                  <span className="text-sm">Период:</span>
                </div>
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={filterPeriod === 'week' ? 'primary' : 'outline'}
                      onClick={() => setFilterPeriod('week')}
                      className="px-4 py-2 text-sm"
                    >
                      Неделя
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={filterPeriod === 'month' ? 'primary' : 'outline'}
                      onClick={() => setFilterPeriod('month')}
                      className="px-4 py-2 text-sm"
                    >
                      Месяц
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={filterPeriod === 'quarter' ? 'primary' : 'outline'}
                      onClick={() => setFilterPeriod('quarter')}
                      className="px-4 py-2 text-sm"
                    >
                      Квартал
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Period navigation */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigatePeriod('prev')}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <span className="text-sm text-foreground">‹</span>
                </button>
                <span className="text-sm font-medium text-foreground min-w-[200px] text-center capitalize">
                  {getPeriodTitle()}
                </span>
                <button
                  onClick={() => navigatePeriod('next')}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <span className="text-sm text-foreground">›</span>
                </button>
              </div>
            </div>

            {/* Search placeholder */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск по записям (скоро)..."
                disabled
                className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring opacity-50"
              />
            </div>
          </div>

          {/* Entries grouped by week */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${filterPeriod}-${currentDate.toISOString()}`}
              className="space-y-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
            >
              {Object.entries(groupedEntries)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([weekStart, entries]) => {
                  const dateGroups = groupByDate(entries);
 
                  return (
                    <div key={weekStart}>
                      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        {formatWeekRange(weekStart)}
                      </h2>
                      <div className="space-y-4">
                        {Object.entries(dateGroups)
                          .sort(([a], [b]) => b.localeCompare(a))
                          .filter(([date, { plan, fact }]) => !(emptyDates[date] && !deletingDates[date] && !plan && !fact))
                          .map(([date, { plan, fact }]) => (
                            <motion.div
                              key={date}
                              className="space-y-2"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.14 }}
                            >
                            <div className="text-sm text-muted-foreground px-1">
                              {formatDate(date)}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {/* Plan */}
                              <AnimatePresence>
                                {(!deletingEntries[date]?.plan) && (
                                  <motion.div
                                    className="cursor-pointer"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 1, scale: 1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                                    onClick={() => openEntry(plan || {
                                      id: '',
                                      user_id: '',
                                      date,
                                      type: 'plan',
                                      raw_text: '',
                                      created_at: '',
                                      text: ''
                                    })}
                                  >
                                    <Card className={`shadow-md hover:shadow-lg transition-shadow duration-300 ${!plan || !plan.text || plan.text.trim().length === 0 ? 'opacity-40' : ''}`}>
                                      <CardContent className="p-4 h-full">
                                        <div className="flex flex-col h-full">
                                          <div className="flex items-center justify-between mb-3">
                                            <Badge variant="warning">План</Badge>
                                            <div className="flex space-x-2">
                                              <Edit2 className="w-4 h-4 text-muted-foreground" />
                                              {plan && plan.text && plan.text.trim().length > 0 && (
                                                <Trash2
                                                  className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-red-500"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteEntry(plan);
                                                  }}
                                                />
                                              )}
                                            </div>
                                          </div>
                                          <AnimatePresence mode="wait">
                                            {plan && plan.text && plan.text.trim().length > 0 ? (
                                              <motion.div
                                                key="plan-content"
                                                className="text-foreground text-sm flex-1 prose prose-sm max-w-none [&_ul[data-type='taskList']]:list-none [&_ul[data-type='taskList']_li]:flex [&_ul[data-type='taskList']_li]:items-start [&_ul[data-type='taskList']_li]:ml-0 [&_ul[data-type='taskList']_input]:mr-2 [&_ul[data-type='taskList']_input]:mt-1"
                                                dangerouslySetInnerHTML={{ __html: plan.text }}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                              />
                                            ) : (
                                              <motion.p
                                                key="no-plan"
                                                className="text-muted-foreground text-sm italic flex-1"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                              >
                                                Нет плана
                                              </motion.p>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Fact */}
                              <AnimatePresence>
                                {(!deletingEntries[date]?.fact) && (
                                  <motion.div
                                    className="cursor-pointer"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 1, scale: 1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                                    onClick={() => openEntry(fact || {
                                      id: '',
                                      user_id: '',
                                      date,
                                      type: 'fact',
                                      raw_text: '',
                                      created_at: '',
                                      text: ''
                                    })}
                                  >
                                    <Card className={`shadow-md hover:shadow-lg transition-shadow duration-300 ${!fact || !fact.text || fact.text.trim().length === 0 ? 'opacity-40' : ''}`}>
                                      <CardContent className="p-4 h-full">
                                        <div className="flex flex-col h-full">
                                          <div className="flex items-center justify-between mb-3">
                                            <Badge variant="success">Факт</Badge>
                                            <div className="flex space-x-2">
                                              <Edit2 className="w-4 h-4 text-muted-foreground" />
                                              {fact && fact.text && fact.text.trim().length > 0 && (
                                                <Trash2
                                                  className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-red-500"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteEntry(fact);
                                                  }}
                                                />
                                              )}
                                            </div>
                                          </div>
                                          <AnimatePresence mode="wait">
                                            {fact && fact.text && fact.text.trim().length > 0 ? (
                                              <motion.div
                                                key="fact-content"
                                                className="text-foreground text-sm flex-1 prose prose-sm max-w-none [&_ul[data-type='taskList']]:list-none [&_ul[data-type='taskList']_li]:flex [&_ul[data-type='taskList']_li]:items-start [&_ul[data-type='taskList']_li]:ml-0 [&_ul[data-type='taskList']_input]:mr-2 [&_ul[data-type='taskList']_input]:mt-1"
                                                dangerouslySetInnerHTML={{ __html: fact.text }}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                              />
                                            ) : (
                                              <motion.p
                                                key="no-fact"
                                                className="text-muted-foreground text-sm italic flex-1"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                              >
                                                Нет факта
                                              </motion.p>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Entry detail panel */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            className="w-[500px] border-l border-border bg-card overflow-auto shadow-xl"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-card-foreground">Редактирование записи</h2>
              <button
                onClick={closeEntry}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Тип</label>
                {selectedEntry && (
                  <Badge variant={selectedEntry.type === 'plan' ? 'warning' : 'success'}>
                    {selectedEntry.type === 'plan' ? 'План' : 'Факт'}
                  </Badge>
                )}
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Дата</label>
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {selectedEntry && <span>{formatDate(selectedEntry.date)}</span>}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Текст</label>
                <TiptapRichTextArea
                  value={editedText}
                  onChange={setEditedText}
                  rows={12}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={saveEntry} variant="primary" className="flex-1">
                  Сохранить
                </Button>
                <Button onClick={closeEntry} variant="outline" className="flex-1">
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
}
