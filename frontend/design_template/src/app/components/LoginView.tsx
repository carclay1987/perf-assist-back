import { useState } from 'react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface LoginViewProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (!email.includes('@')) {
      setError('Введите корректный email');
      return;
    }

    // В реальном приложении здесь будет проверка через API
    // Для демонстрации принимаем любые данные
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-foreground mb-2">Perf Assist</h1>
          <p className="text-muted-foreground">
            Личный помощник для перфа
          </p>
        </div>

        {/* Login form */}
        <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6">Вход в систему</h2>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Submit button */}
            <Button type="submit" variant="primary" className="w-full mt-6">
              Войти
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              Для регистрации обратитесь к администратору
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Self-hosted веб-приложение для подготовки к performance review
        </p>
      </div>
    </div>
  );
}
