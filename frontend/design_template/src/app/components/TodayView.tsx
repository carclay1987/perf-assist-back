import { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';
import { TextArea } from './TextArea';
import { Badge } from './Badge';

export function TodayView() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [planText, setPlanText] = useState('');
  const [factText, setFactText] = useState('');
  const [hasPlan, setHasPlan] = useState(false);
  const [hasFact, setHasFact] = useState(false);

  const handleSavePlan = () => {
    if (planText.trim()) {
      console.log('Сохранение плана:', { date: selectedDate, text: planText });
      setHasPlan(true);
      setPlanText('');
    }
  };

  const handleSaveFact = () => {
    if (factText.trim()) {
      console.log('Сохранение факта:', { date: selectedDate, text: factText });
      setHasFact(true);
      setFactText('');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold text-foreground">Сегодня</h1>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Calendar className="w-5 h-5" />
          <span>{formatDate(selectedDate)}</span>
          {hasPlan && <Badge variant="success">План сохранён</Badge>}
          {hasFact && <Badge variant="info">Факт сохранён</Badge>}
        </div>
      </div>

      {/* Motivational message */}
      <div className="mb-8 p-4 bg-muted/30 border-l-4 border-accent rounded-r-lg">
        <p className="text-sm text-muted-foreground italic">
          💡 Регулярная фиксация планов и результатов поможет вам чувствовать себя увереннее на performance review
        </p>
      </div>

      <div className="space-y-6">
        {/* Plans Section */}
        <Card>
          <CardHeader className="border-b border-border">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">Планы</h2>
            <p className="text-muted-foreground">
              Что ты планируешь сегодня/на эту неделю сделать?
            </p>
          </CardHeader>
          <CardContent>
            <TextArea
              value={planText}
              onChange={setPlanText}
              placeholder="Опиши свои планы на сегодня или неделю. Например: 'Завершить дизайн новой фичи', 'Провести код-ревью для команды', 'Написать документацию по API'..."
              rows={8}
              className="mb-4"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSavePlan}
                disabled={!planText.trim()}
                variant="primary"
              >
                <Check className="w-4 h-4 mr-2" />
                Сохранить план
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Facts Section */}
        <Card>
          <CardHeader className="border-b border-border">
            <h2 className="text-xl font-semibold text-card-foreground mb-2">Факты</h2>
            <p className="text-muted-foreground">
              Что получилось из намеченного? Что ещё важного произошло?
            </p>
          </CardHeader>
          <CardContent>
            <TextArea
              value={factText}
              onChange={setFactText}
              placeholder="Опиши свои достижения за день/неделю. Что удалось сделать? Какие были результаты? Какие сложности преодолел? Например: 'Завершил фичу раньше срока', 'Помог коллеге разобраться с багом', 'Провёл успешную презентацию для стейкхолдеров'..."
              rows={8}
              className="mb-4"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveFact}
                disabled={!factText.trim()}
                variant="primary"
              >
                <Check className="w-4 h-4 mr-2" />
                Сохранить факт
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
