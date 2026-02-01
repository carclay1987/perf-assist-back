import { useState } from 'react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';
import { Input } from './ui/input';
import { Badge } from './Badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Shield, Save, Info } from 'lucide-react';

export function SettingsView() {
  const [apiToken, setApiToken] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // TODO: заменить на реальное сохранение (localStorage / backend)
    console.log('Сохранение настроек', { apiToken });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const maskedToken = apiToken
    ? apiToken.length <= 8
      ? '*'.repeat(apiToken.length)
      : `${apiToken.slice(0, 4)}${'*'.repeat(apiToken.length - 8)}${apiToken.slice(-4)}`
    : '';

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Настройки</h1>
        <p className="text-muted-foreground">
          Конфигурация доступа к моделям и общие параметры работы Perf Assist.
        </p>
      </div>

      {/* API токен */}
      <Card className="bg-card">
        <CardHeader className="border-b border-border space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold text-card-foreground">Доступ к модели</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Укажи токен доступа к LLM-провайдеру. Он хранится локально в браузере и не отправляется на сервер.
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="api-token">
              API токен
            </label>
            <Input
              id="api-token"
              type="password"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="sk-..."
              className="text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Токен будет использоваться для запросов к модели. Не делись им с другими людьми.
            </p>
          </div>

          {apiToken && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Текущий токен:</span>
              <code className="px-2 py-1 rounded bg-muted/40 border border-border text-[11px]">
                {maskedToken}
              </code>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!apiToken.trim()}
              className="min-w-[160px]"
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          </div>

          {isSaved && (
            <div className="pt-2">
              <Badge variant="success" className="text-xs">
                Настройки сохранены
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Подсказка по использованию */}
      <Alert className="bg-muted/40 border-border/80">
        <Info className="w-4 h-4" />
        <AlertTitle>Как это будет работать дальше</AlertTitle>
        <AlertDescription className="text-sm">
          Сейчас токен просто сохраняется локально (см. TODO в коде). На следующих шагах мы будем использовать его для
          реальных запросов к модели и добавим выбор провайдера (OpenAI, Anthropic и т.д.).
        </AlertDescription>
      </Alert>
    </div>
  );
}
