import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Download, ChevronDown, ChevronUp, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';
import { Calendar } from './ui/calendar';

interface Goal {
  id: string;
  title: string;
  context: string;
  outputs: string[];
  outcomes: string[];
}

export function SummaryView() {
  const [period, setPeriod] = useState('6months');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Функция для вычисления диапазона текущих полугодия
  const getCurrentHalfYearRange = (): { start: Date; end: Date } => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Определяем, в какой половине года мы находимся
    if (now.getMonth() < 6) {
      // Первая половина года (январь-июнь)
      return {
        start: new Date(currentYear, 0, 1), // 1 января
        end: new Date(currentYear, 5, 30)   // 30 июня
      };
    } else {
      // Вторая половина года (июль-декабрь)
      return {
        start: new Date(currentYear, 6, 1), // 1 июля
        end: new Date(currentYear, 11, 31)  // 31 декабря
      };
    }
  };

  // Функция для вычисления диапазона текущего года
  const getCurrentYearRange = (): { start: Date; end: Date } => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    return {
      start: new Date(currentYear, 0, 1),  // 1 января
      end: new Date(currentYear, 11, 31)   // 31 декабря
    };
  };

  // Функция для форматирования даты в формате DD.MM.YYYY
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Получаем диапазон дат для отображения
  const getDateRangeText = (): string => {
    if (period === '6months') {
      const { start, end } = getCurrentHalfYearRange();
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    
    if (period === 'year') {
      const { start, end } = getCurrentYearRange();
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
    
    if (period === 'custom' && startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    
    return '';
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/perf/summary:mock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'mock-user',
          period,
          ...(period === 'custom' && startDate && endDate && {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
          }),
          ...(period === '6months' && (() => {
            const { start, end } = getCurrentHalfYearRange();
            return {
              start_date: start.toISOString().split('T')[0],
              end_date: end.toISOString().split('T')[0]
            };
          })()),
          ...(period === 'year' && (() => {
            const { start, end } = getCurrentYearRange();
            return {
              start_date: start.toISOString().split('T')[0],
              end_date: end.toISOString().split('T')[0]
            };
          })()),
        }),
      });

      if (!response.ok) {
        console.error('Ошибка при генерации перф-саммари:', response.status, response.statusText);
        setIsGenerating(false);
        return;
      }

      const data = await response.json();
      console.log('Перф-саммари получено:', data);

      const mappedGoals: Goal[] = (data.goals || []).map((goal: any) => ({
        id: goal.id,
        title: goal.title,
        context: goal.context,
        outputs: goal.outputs || [],
        outcomes: goal.outcomes || [],
      }));

      setGoals(mappedGoals);
      setExpandedGoals(new Set(mappedGoals.map((g) => g.id)));
      setIsGenerated(true);
      setIsGenerating(false);
    } catch (error) {
      console.error('Ошибка сети при генерации перф-саммари:', error);
      setIsGenerating(false);
    }
  };

  const toggleGoal = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const copyToClipboard = () => {
    const text = goals.map(goal => {
      return `## ${goal.title}\n\n**Context:**\n${goal.context}\n\n**Outputs:**\n${goal.outputs.map(o => `- ${o}`).join('\n')}\n\n**Outcomes:**\n${goal.outcomes.map(o => `- ${o}`).join('\n')}`;
    }).join('\n\n---\n\n');

    navigator.clipboard.writeText(text);
    console.log('Скопировано в буфер обмена');
  };

  const exportToMarkdown = () => {
    const text = goals.map(goal => {
      return `## ${goal.title}\n\n**Context:**\n${goal.context}\n\n**Outputs:**\n${goal.outputs.map(o => `- ${o}`).join('\n')}\n\n**Outcomes:**\n${goal.outcomes.map(o => `- ${o}`).join('\n')}`;
    }).join('\n\n---\n\n');

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'perf-summary.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-4">Перф-саммари</h1>
        <p className="text-muted-foreground mb-6">
          Генерация черновика self-review на основе ваших записей за выбранный период
        </p>

        {/* Period selection */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">Период перф-цикла:</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="6months">Текущие полгода</option>
                <option value="year">Текущий год</option>
                <option value="custom">Свой диапазон</option>
              </select>
              {getDateRangeText() && (
                <div className="text-sm text-muted-foreground ml-2">
                  {getDateRangeText()}
                </div>
              )}
            </div>
            
            <AnimatePresence>
                          {period === 'custom' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 p-4 border border-input rounded-lg bg-input-background w-full">
                                <div className="flex flex-col md:flex-row gap-4 w-full">
                                  <div className="flex-1 w-full">
                                    <label className="block text-sm font-medium text-foreground mb-2">Начальная дата</label>
                                    <div className="w-full">
                                      <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        className="rounded-md border w-full"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-1 w-full">
                                    <label className="block text-sm font-medium text-foreground mb-2">Конечная дата</label>
                                    <div className="w-full">
                                      <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        className="rounded-md border w-full"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
          </CardContent>
        </Card>

        {/* Generate button */}
        {!isGenerated && (
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
            variant="primary"
            className="w-full py-4"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Генерация черновика...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Сгенерировать черновик
              </>
            )}
          </Button>
        )}
      </div>

      {/* Generated summary */}
            <AnimatePresence>
              {isGenerated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <>
                    {/* Actions */}
                    <div className="flex gap-3 mb-6">
                      <Button onClick={copyToClipboard} variant="secondary" className="flex-1">
                        <Copy className="w-4 h-4 mr-2" />
                        Скопировать всё
                      </Button>
                      <Button onClick={exportToMarkdown} variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Экспорт в Markdown
                      </Button>
                      <Button onClick={handleGenerate} variant="outline">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Перегенерировать
                      </Button>
                    </div>
      
                    {/* Goals */}
                    <div className="space-y-4">
                      {goals.map((goal, index) => {
                        const isExpanded = expandedGoals.has(goal.id);
                        
                        return (
                          <Card key={goal.id} className="overflow-hidden">
                            <div
                              onClick={() => toggleGoal(goal.id)}
                              className="cursor-pointer"
                            >
                              <CardHeader className="border-b border-border flex flex-row items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                                      {index + 1}
                                    </span>
                                    <h2 className="text-xl font-semibold text-card-foreground">
                                      {goal.title}
                                    </h2>
                                  </div>
                                </div>
                                <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="p-2 hover:bg-muted rounded-lg transition-colors ml-4"
                                                              >
                                                                <motion.div
                                                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                                                  transition={{ duration: 0.3 }}
                                                                >
                                                                  {isExpanded ? (
                                                                    <ChevronDown className="w-5 h-5 text-foreground" />
                                                                  ) : (
                                                                    <ChevronDown className="w-5 h-5 text-foreground" />
                                                                  )}
                                                                </motion.div>
                                                              </motion.button>
                              </CardHeader>
                            </div>
      
                            <AnimatePresence>
                                                          {isExpanded && (
                                                            <motion.div
                                                              initial={{ height: 0, opacity: 0 }}
                                                              animate={{ height: 'auto', opacity: 1 }}
                                                              exit={{ height: 0, opacity: 0 }}
                                                              transition={{ duration: 0.3 }}
                                                              className="overflow-hidden"
                                                            >
                                                              <CardContent className="p-6 space-y-6">
                                                                {/* Context */}
                                                                <div>
                                                                  <h3 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
                                                                    Context
                                                                  </h3>
                                                                  <textarea
                                                                    defaultValue={goal.context}
                                                                    rows={4}
                                                                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                                                  />
                                                                </div>
                                      
                                                                {/* Outputs */}
                                                                <div>
                                                                  <h3 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
                                                                    Outputs
                                                                  </h3>
                                                                  <ul className="space-y-2">
                                                                    {goal.outputs.map((output, idx) => (
                                                                      <li key={idx} className="flex gap-3">
                                                                        <span className="text-accent mt-1">•</span>
                                                                        <input
                                                                          type="text"
                                                                          defaultValue={output}
                                                                          className="flex-1 px-3 py-2 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                                        />
                                                                      </li>
                                                                    ))}
                                                                  </ul>
                                                                </div>
                                      
                                                                {/* Outcomes */}
                                                                <div>
                                                                  <h3 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
                                                                    Outcomes
                                                                  </h3>
                                                                  <ul className="space-y-2">
                                                                    {goal.outcomes.map((outcome, idx) => (
                                                                      <li key={idx} className="flex gap-3">
                                                                        <span className="text-accent mt-1">•</span>
                                                                        <input
                                                                          type="text"
                                                                          defaultValue={outcome}
                                                                          className="flex-1 px-3 py-2 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                                        />
                                                                      </li>
                                                                    ))}
                                                                  </ul>
                                                                </div>
                                                              </CardContent>
                                                            </motion.div>
                                                          )}
                                                        </AnimatePresence>
                          </Card>
                        );
                      })}
                    </div>
                  </>
                </motion.div>
              )}
            </AnimatePresence>
    </div>
  );
}
