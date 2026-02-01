import { useState } from 'react';
import { Filter, Calendar, Edit2, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

interface Entry {
  id: string;
  type: 'plan' | 'fact';
  date: string;
  text: string;
}

export function FeedView() {
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [editedText, setEditedText] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock data - добавим больше данных для демонстрации календаря
  const mockEntries: Entry[] = [
    {
      id: '1',
      type: 'fact',
      date: '2026-01-29',
      text: 'Завершил реализацию новой фичи для дашборда. Провёл код-ревью для двух PR от коллег. Помог джуниору разобраться с архитектурой микросервисов.'
    },
    {
      id: '2',
      type: 'plan',
      date: '2026-01-29',
      text: 'Доработать API для интеграции с внешним сервисом. Провести встречу с дизайнерами по новому UI. Написать документацию для команды.'
    },
    {
      id: '3',
      type: 'fact',
      date: '2026-01-28',
      text: 'Провёл успешную презентацию для стейкхолдеров. Оптимизировал производительность запросов к БД.'
    },
    {
      id: '4',
      type: 'plan',
      date: '2026-01-28',
      text: 'Рефакторинг старого кода в модуле авторизации.'
    },
    {
      id: '5',
      type: 'fact',
      date: '2026-01-27',
      text: 'Исправил критический баг в продакшене. Провёл онбординг для нового члена команды.'
    },
    {
      id: '6',
      type: 'plan',
      date: '2026-01-27',
      text: 'Начать работу над новой функциональностью для мобильного приложения.'
    },
    {
      id: '7',
      type: 'fact',
      date: '2026-01-24',
      text: 'Завершил миграцию базы данных. Написал unit-тесты для нового модуля.'
    },
    {
      id: '8',
      type: 'plan',
      date: '2026-01-24',
      text: 'Провести ретроспективу спринта. Подготовить план на следующую неделю.'
    },
    {
      id: '9',
      type: 'fact',
      date: '2026-01-23',
      text: 'Оптимизировал CI/CD pipeline, сократив время сборки на 30%.'
    },
    {
      id: '10',
      type: 'plan',
      date: '2026-01-23',
      text: 'Изучить новую версию фреймворка и подготовить план миграции.'
    },
    {
      id: '11',
      type: 'fact',
      date: '2026-01-22',
      text: 'Провёл техническое интервью с кандидатом. Помог команде с архитектурными решениями.'
    },
    {
      id: '12',
      type: 'plan',
      date: '2026-01-22',
      text: 'Обновить документацию API. Провести code review для критических PR.'
    },
    {
      id: '13',
      type: 'fact',
      date: '2026-01-21',
      text: 'Реализовал новую систему кэширования. Улучшил производительность на 50%.'
    },
    {
      id: '14',
      type: 'plan',
      date: '2026-01-21',
      text: 'Встреча с продакт-менеджером по новым фичам.'
    },
    {
      id: '15',
      type: 'fact',
      date: '2026-01-20',
      text: 'Настроил мониторинг для новых сервисов. Написал алерты для критических метрик.'
    }
  ];

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

  // Генерация дней календаря для месяца
  const getCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = new Date(firstDay);
    startDay.setDate(startDay.getDate() - (firstDay.getDay() || 7) + 1);
    
    const days: Date[] = [];
    const current = new Date(startDay);
    
    while (days.length < 42) { // 6 недель
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Получить записи для конкретной даты
  const getEntriesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockEntries.filter(entry => entry.date === dateStr);
  };

  // Навигация по периодам
  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (filterPeriod === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (filterPeriod === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (filterPeriod === 'quarter') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 3 : -3));
    }
    
    setCurrentDate(newDate);
  };

  // Получить заголовок периода
  const getPeriodTitle = () => {
    if (filterPeriod === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - (currentDate.getDay() || 7) + 1);
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
  };

  // Группировка для недельного вида
  const groupByWeek = (entries: Entry[]) => {
    const grouped: { [key: string]: Entry[] } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - (date.getDay() || 7) + 1);
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = [];
      }
      grouped[weekKey].push(entry);
    });
    
    return grouped;
  };

  const formatWeekRange = (weekStart: string) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('ru-RU', options)} - ${end.toLocaleDateString('ru-RU', options)}`;
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
    setEditedText(entry.text);
  };

  const closeEntry = () => {
    setSelectedEntry(null);
    setEditedText('');
  };

  const saveEntry = () => {
    console.log('Сохранение изменений:', { id: selectedEntry?.id, text: editedText });
    closeEntry();
  };

  // Рендер недельного вида (текущий)
  const renderWeekView = () => {
    const groupedEntries = groupByWeek(mockEntries);
    
    return (
      <div className="space-y-8">
        {Object.entries(groupedEntries).sort(([a], [b]) => b.localeCompare(a)).map(([weekStart, entries]) => {
          const dateGroups = groupByDate(entries);
          
          return (
            <div key={weekStart}>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                {formatWeekRange(weekStart)}
              </h2>
              <div className="space-y-4">
                {Object.entries(dateGroups).sort(([a], [b]) => b.localeCompare(a)).map(([date, { plan, fact }]) => (
                  <div key={date} className="space-y-2">
                    <div className="text-sm text-muted-foreground px-1">
                      {formatDate(date)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Plan */}
                      <Card 
                        className={`hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer ${!plan ? 'opacity-40' : ''}`}
                        onClick={() => plan && openEntry(plan)}
                      >
                        <CardContent className="p-4 h-full">
                          <div className="flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="warning">План</Badge>
                            </div>
                            {plan ? (
                              <p className="text-foreground text-sm line-clamp-3 flex-1">
                                {plan.text}
                              </p>
                            ) : (
                              <p className="text-muted-foreground text-sm italic flex-1">
                                Нет плана
                              </p>
                            )}
                            {plan && (
                              <div className="flex justify-end mt-3">
                                <Edit2 className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Fact */}
                      <Card 
                        className={`hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer ${!fact ? 'opacity-40' : ''}`}
                        onClick={() => fact && openEntry(fact)}
                      >
                        <CardContent className="p-4 h-full">
                          <div className="flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="success">Факт</Badge>
                            </div>
                            {fact ? (
                              <p className="text-foreground text-sm line-clamp-3 flex-1">
                                {fact.text}
                              </p>
                            ) : (
                              <p className="text-muted-foreground text-sm italic flex-1">
                                Нет факта
                              </p>
                            )}
                            {fact && (
                              <div className="flex justify-end mt-3">
                                <Edit2 className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Рендер календарного вида для месяца и квартала
  const renderCalendarView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Для квартала показываем 3 месяца
    const monthsToShow = filterPeriod === 'quarter' ? 3 : 1;
    const startMonth = filterPeriod === 'quarter' ? Math.floor(month / 3) * 3 : month;
    
    return (
      <div className="space-y-6">
        {Array.from({ length: monthsToShow }).map((_, monthOffset) => {
          const currentMonth = startMonth + monthOffset;
          const days = getCalendarDays(year, currentMonth);
          const monthName = new Date(year, currentMonth).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
          
          return (
            <div key={currentMonth}>
              {filterPeriod === 'quarter' && (
                <h2 className="text-lg font-semibold text-foreground mb-4 capitalize">{monthName}</h2>
              )}
              
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {/* Заголовки дней недели */}
                <div className="grid grid-cols-7 border-b border-border bg-muted">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Сетка календаря */}
                <div className="grid grid-cols-7">
                  {days.map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentMonth;
                    const entries = getEntriesForDate(day);
                    const hasPlan = entries.some(e => e.type === 'plan');
                    const hasFact = entries.some(e => e.type === 'fact');
                    const isToday = day.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={`${filterPeriod === 'quarter' ? 'min-h-[80px]' : 'min-h-[120px]'} border-r border-b border-border p-2 transition-all hover:bg-muted/50 cursor-pointer ${
                          !isCurrentMonth ? 'bg-muted/30' : ''
                        } ${isToday ? 'bg-primary/5' : ''}`}
                        onClick={() => {
                          if (entries.length > 0) {
                            openEntry(entries[0]);
                          }
                        }}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                        } ${isToday ? 'text-primary font-semibold' : ''}`}>
                          {day.getDate()}
                        </div>
                        
                        {isCurrentMonth && entries.length > 0 && (
                          <div className="space-y-1">
                            {hasPlan && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-warning flex-shrink-0" />
                                {filterPeriod === 'month' && (
                                  <span className="text-xs text-foreground line-clamp-2">
                                    {entries.find(e => e.type === 'plan')?.text}
                                  </span>
                                )}
                              </div>
                            )}
                            {hasFact && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
                                {filterPeriod === 'month' && (
                                  <span className="text-xs text-foreground line-clamp-2">
                                    {entries.find(e => e.type === 'fact')?.text}
                                  </span>
                                )}
                              </div>
                            )}
                            {filterPeriod === 'quarter' && entries.length > 2 && (
                              <span className="text-xs text-foreground">
                                +{entries.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Легенда */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground px-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span>План</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span>Факт</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full">
      {/* Main feed */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
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
                  <Button
                    variant={filterPeriod === 'week' ? 'primary' : 'outline'}
                    onClick={() => setFilterPeriod('week')}
                    className="text-sm"
                  >
                    Неделя
                  </Button>
                  <Button
                    variant={filterPeriod === 'month' ? 'primary' : 'outline'}
                    onClick={() => setFilterPeriod('month')}
                    className="text-sm"
                  >
                    Месяц
                  </Button>
                  <Button
                    variant={filterPeriod === 'quarter' ? 'primary' : 'outline'}
                    onClick={() => setFilterPeriod('quarter')}
                    className="text-sm"
                  >
                    Квартал
                  </Button>
                </div>
              </div>
              
              {/* Period navigation */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigatePeriod('prev')}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <span className="text-sm font-medium text-foreground min-w-[200px] text-center capitalize">
                  {getPeriodTitle()}
                </span>
                <button
                  onClick={() => navigatePeriod('next')}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
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

          {/* Content based on filter */}
          {filterPeriod === 'week' ? renderWeekView() : renderCalendarView()}
        </div>
      </div>

      {/* Entry detail panel */}
      {selectedEntry && (
        <div className="w-[500px] border-l border-border bg-card overflow-auto shadow-xl">
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
                <Badge variant={selectedEntry.type === 'plan' ? 'warning' : 'success'}>
                  {selectedEntry.type === 'plan' ? 'План' : 'Факт'}
                </Badge>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Дата</label>
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{formatDate(selectedEntry.date)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Текст</label>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
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
        </div>
      )}
    </div>
  );
}