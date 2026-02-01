import { useState } from 'react';
import { Sparkles, Copy, Download, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';

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

  // Mock generation
  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockGoals: Goal[] = [
        {
          id: '1',
          title: 'Разработка и запуск новой системы аналитики',
          context: 'В начале года команда столкнулась с недостатком инструментов для анализа пользовательского поведения. Было принято решение разработать собственную систему аналитики, интегрированную с существующими продуктами. Я взял на себя роль технического лидера проекта, координируя работу 3 инженеров и взаимодействуя с продуктовой командой.',
          outputs: [
            'Спроектировал архитектуру системы с использованием микросервисов',
            'Реализовал сбор и обработку 50+ типов событий',
            'Разработал API для интеграции с фронтенд-приложениями',
            'Написал документацию и провёл обучение команды'
          ],
          outcomes: [
            'Система успешно запущена в продакшн за 4 месяца',
            'Обрабатывает 2M+ событий в день с latency < 100ms',
            'Продуктовая команда получила инструмент для принятия data-driven решений',
            'Снижены затраты на сторонние аналитические сервисы на 60%'
          ]
        },
        {
          id: '2',
          title: 'Оптимизация производительности критических сервисов',
          context: 'После роста пользовательской базы на 200% начали проявляться проблемы с производительностью ключевых API. Время отклика увеличилось до неприемлемых значений, что негативно влияло на UX. Я инициировал и возглавил работу по комплексной оптимизации.',
          outputs: [
            'Провёл профилирование и выявил узкие места в 5 критических сервисах',
            'Оптимизировал запросы к базе данных, добавил индексы и кеширование',
            'Рефакторил алгоритмы обработки данных',
            'Внедрил мониторинг производительности с алертами'
          ],
          outcomes: [
            'Снизил среднее время отклика API с 800ms до 120ms (85%)',
            'Уменьшил нагрузку на БД на 70%',
            'Повысил customer satisfaction score на 15%',
            'Команда получила best practices по оптимизации'
          ]
        },
        {
          id: '3',
          title: 'Менторство и развитие junior-инженеров',
          context: 'В команду пришли два junior-разработчика без опыта работы с нашим стеком. Я взял на себя роль ментора для их успешной адаптации и профессионального роста.',
          outputs: [
            'Разработал персональные планы развития для каждого',
            'Проводил еженедельные 1-on-1 сессии',
            'Организовал code review с подробными комментариями',
            'Делегировал задачи возрастающей сложности'
          ],
          outcomes: [
            'Оба инженера успешно прошли испытательный срок',
            'Через 3 месяца самостоятельно реализовали production-фичи',
            'Получили позитивные отзывы от команды',
            'Один из них провёл внутренний tech talk по новой технологии'
          ]
        }
      ];

      setGoals(mockGoals);
      setExpandedGoals(new Set(mockGoals.map(g => g.id)));
      setIsGenerated(true);
      setIsGenerating(false);
    }, 2000);
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
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">Период перф-цикла:</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="6months">Последние 6 месяцев</option>
                <option value="year">Последний год</option>
                <option value="custom">Свой диапазон</option>
              </select>
            </div>
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
      {isGenerated && (
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
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors ml-4">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </CardHeader>
                  </div>

                  {isExpanded && (
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
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
