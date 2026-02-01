import { useState } from 'react';
import { 
  Check, X, Info, AlertCircle, Loader2, ChevronDown, 
  Search, Settings, Calendar, Star, Heart, Home,
  User, Mail, Lock, Eye, EyeOff
} from 'lucide-react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { TextArea } from './TextArea';

export function UIKitView() {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('option1');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('radio1');
  const [switchValue, setSwitchValue] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">UI Kit</h1>
          <p className="text-muted-foreground">Все компоненты дизайн-системы Perf Assist</p>
        </div>

        <div className="space-y-12">
          {/* Colors */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Цвета</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="h-24 bg-background border border-border rounded-lg mb-2" />
                <p className="text-sm font-medium text-foreground">Background</p>
                <p className="text-xs text-muted-foreground">bg-background</p>
              </div>
              <div>
                <div className="h-24 bg-card border border-border rounded-lg mb-2" />
                <p className="text-sm font-medium text-foreground">Card</p>
                <p className="text-xs text-muted-foreground">bg-card</p>
              </div>
              <div>
                <div className="h-24 bg-primary rounded-lg mb-2" />
                <p className="text-sm font-medium text-foreground">Primary</p>
                <p className="text-xs text-muted-foreground">bg-primary</p>
              </div>
              <div>
                <div className="h-24 bg-accent rounded-lg mb-2" />
                <p className="text-sm font-medium text-foreground">Accent</p>
                <p className="text-xs text-muted-foreground">bg-accent</p>
              </div>
              <div>
                <div className="h-24 bg-success rounded-lg mb-2" />
                <p className="text-sm font-medium text-foreground">Success</p>
                <p className="text-xs text-muted-foreground">bg-success</p>
              </div>
              <div>
                <div className="h-24 bg-warning rounded-lg mb-2" />
                <p className="text-sm font-medium text-foreground">Warning</p>
                <p className="text-xs text-muted-foreground">bg-warning</p>
              </div>
              <div>
                <div className="h-24 bg-info rounded-lg mb-2" />
                <p className="text-sm font-medium text-foreground">Info</p>
                <p className="text-xs text-muted-foreground">bg-info</p>
              </div>
              <div>
                <div className="h-24 bg-destructive rounded-lg mb-2" />
                <p className="text-sm font-medium text-foreground">Destructive</p>
                <p className="text-xs text-muted-foreground">bg-destructive</p>
              </div>
              <div>
                <div className="h-24 bg-muted rounded-lg mb-2" />
                <p className="text-sm font-medium text-foreground">Muted</p>
                <p className="text-xs text-muted-foreground">bg-muted</p>
              </div>
              <div>
                <div className="h-24 bg-sidebar border border-border rounded-lg mb-2" />
                <p className="text-sm font-medium text-foreground">Sidebar</p>
                <p className="text-xs text-muted-foreground">bg-sidebar</p>
              </div>
              <div>
                <div className="h-24 bg-sidebar-primary rounded-lg mb-2" />
                <p className="text-sm font-medium text-foreground">Sidebar Primary</p>
                <p className="text-xs text-muted-foreground">bg-sidebar-primary</p>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Типографика</h2>
            <div className="space-y-4">
              <div>
                <h1 className="text-foreground">Заголовок H1</h1>
                <p className="text-xs text-muted-foreground mt-1">text-2xl font-medium</p>
              </div>
              <div>
                <h2 className="text-foreground">Заголовок H2</h2>
                <p className="text-xs text-muted-foreground mt-1">text-xl font-medium</p>
              </div>
              <div>
                <h3 className="text-foreground">Заголовок H3</h3>
                <p className="text-xs text-muted-foreground mt-1">text-lg font-medium</p>
              </div>
              <div>
                <h4 className="text-foreground">Заголовок H4</h4>
                <p className="text-xs text-muted-foreground mt-1">text-base font-medium</p>
              </div>
              <div>
                <p className="text-foreground">Обычный текст параграфа</p>
                <p className="text-xs text-muted-foreground mt-1">text-base</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Мелкий текст</p>
                <p className="text-xs text-muted-foreground mt-1">text-sm text-muted-foreground</p>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Кнопки</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="primary" disabled>Disabled Button</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" className="text-sm px-4 py-2">
                  Small Button
                </Button>
                <Button variant="primary">
                  <Calendar className="w-4 h-4 mr-2" />
                  Button with Icon
                </Button>
                <Button variant="outline">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </Button>
              </div>
            </div>
          </section>

          {/* Badges */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Badges</h2>
            <div className="flex flex-wrap gap-4">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </section>

          {/* Cards */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Cards</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Card with Header</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Это пример карточки с загол��вком и контентом. Карточки используются для группировки связанной информации.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Card without Header</h3>
                  <p className="text-sm text-muted-foreground">
                    Карточка может использоваться только с контентом, без отдельного заголовка.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Hover Card</h3>
                  <p className="text-sm text-muted-foreground">
                    Эта карточка имеет эффект при наведении.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Inputs */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Inputs</h2>
            <div className="space-y-6 max-w-2xl">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Текстовое поле
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Введите текст..."
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Поиск
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Поиск..."
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Введите пароль..."
                    className="w-full pl-10 pr-12 py-3 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Textarea */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Текстовая область
                </label>
                <TextArea
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  placeholder="Введите текст..."
                  rows={4}
                />
              </div>

              {/* Select */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Выпадающий список
                </label>
                <div className="relative">
                  <select
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                  >
                    <option value="option1">Опция 1</option>
                    <option value="option2">Опция 2</option>
                    <option value="option3">Опция 3</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Checkbox */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkboxValue}
                    onChange={(e) => setCheckboxValue(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-input bg-input-background checked:bg-accent checked:border-accent focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                  />
                  <span className="text-sm font-medium text-foreground">
                    Checkbox пример
                  </span>
                </label>
              </div>

              {/* Radio Group */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Radio группа
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="radio-group"
                      value="radio1"
                      checked={radioValue === 'radio1'}
                      onChange={(e) => setRadioValue(e.target.value)}
                      className="w-5 h-5 rounded-full border-2 border-input bg-input-background checked:bg-accent checked:border-accent focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    />
                    <span className="text-sm text-foreground">Опция 1</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="radio-group"
                      value="radio2"
                      checked={radioValue === 'radio2'}
                      onChange={(e) => setRadioValue(e.target.value)}
                      className="w-5 h-5 rounded-full border-2 border-input bg-input-background checked:bg-accent checked:border-accent focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    />
                    <span className="text-sm text-foreground">Опция 2</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="radio-group"
                      value="radio3"
                      checked={radioValue === 'radio3'}
                      onChange={(e) => setRadioValue(e.target.value)}
                      className="w-5 h-5 rounded-full border-2 border-input bg-input-background checked:bg-accent checked:border-accent focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    />
                    <span className="text-sm text-foreground">Опция 3</span>
                  </label>
                </div>
              </div>

              {/* Switch */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setSwitchValue(!switchValue)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      switchValue ? 'bg-accent' : 'bg-switch-background'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        switchValue ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Switch пример
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* Icons */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Иконки (Lucide React)</h2>
            <div className="grid grid-cols-6 md:grid-cols-10 gap-6">
              <div className="flex flex-col items-center gap-2">
                <Home className="w-6 h-6 text-foreground" />
                <span className="text-xs text-muted-foreground">Home</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <User className="w-6 h-6 text-foreground" />
                <span className="text-xs text-muted-foreground">User</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Settings className="w-6 h-6 text-foreground" />
                <span className="text-xs text-muted-foreground">Settings</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Calendar className="w-6 h-6 text-foreground" />
                <span className="text-xs text-muted-foreground">Calendar</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Search className="w-6 h-6 text-foreground" />
                <span className="text-xs text-muted-foreground">Search</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Mail className="w-6 h-6 text-foreground" />
                <span className="text-xs text-muted-foreground">Mail</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Star className="w-6 h-6 text-foreground" />
                <span className="text-xs text-muted-foreground">Star</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Heart className="w-6 h-6 text-foreground" />
                <span className="text-xs text-muted-foreground">Heart</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Check className="w-6 h-6 text-foreground" />
                <span className="text-xs text-muted-foreground">Check</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <X className="w-6 h-6 text-foreground" />
                <span className="text-xs text-muted-foreground">X</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Info className="w-6 h-6 text-foreground" />
                <span className="text-xs text-muted-foreground">Info</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AlertCircle className="w-6 h-6 text-foreground" />
                <span className="text-xs text-muted-foreground">Alert</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-foreground animate-spin" />
                <span className="text-xs text-muted-foreground">Loader</span>
              </div>
            </div>
          </section>

          {/* Alerts / Notifications */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Уведомления / Alerts</h2>
            <div className="space-y-4">
              <div className="p-4 bg-accent/10 border border-accent rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Информация</h4>
                  <p className="text-sm text-muted-foreground">
                    Это информационное уведомление для пользователя.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-success/10 border border-success rounded-lg flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Успех</h4>
                  <p className="text-sm text-muted-foreground">
                    Операция выполнена успешно!
                  </p>
                </div>
              </div>
              <div className="p-4 bg-warning/10 border border-warning rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Предупреждение</h4>
                  <p className="text-sm text-muted-foreground">
                    Обратите внимание на это предупреждение.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Ошибка</h4>
                  <p className="text-sm text-muted-foreground">
                    Произошла ошибка при выполнении операции.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Loading States */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Loading состояния</h2>
            <div className="flex flex-wrap gap-8 items-center">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">Загрузка...</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </section>

          {/* Spacing */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Отступы</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm text-muted-foreground">gap-1</div>
                <div className="flex gap-1">
                  <div className="w-8 h-8 bg-accent rounded" />
                  <div className="w-8 h-8 bg-accent rounded" />
                  <div className="w-8 h-8 bg-accent rounded" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm text-muted-foreground">gap-2</div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-accent rounded" />
                  <div className="w-8 h-8 bg-accent rounded" />
                  <div className="w-8 h-8 bg-accent rounded" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm text-muted-foreground">gap-4</div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-accent rounded" />
                  <div className="w-8 h-8 bg-accent rounded" />
                  <div className="w-8 h-8 bg-accent rounded" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm text-muted-foreground">gap-6</div>
                <div className="flex gap-6">
                  <div className="w-8 h-8 bg-accent rounded" />
                  <div className="w-8 h-8 bg-accent rounded" />
                  <div className="w-8 h-8 bg-accent rounded" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm text-muted-foreground">gap-8</div>
                <div className="flex gap-8">
                  <div className="w-8 h-8 bg-accent rounded" />
                  <div className="w-8 h-8 bg-accent rounded" />
                  <div className="w-8 h-8 bg-accent rounded" />
                </div>
              </div>
            </div>
          </section>

          {/* Border Radius */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Скругления</h2>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-accent rounded-none" />
                <span className="text-xs text-muted-foreground">rounded-none</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-accent rounded-sm" />
                <span className="text-xs text-muted-foreground">rounded-sm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-accent rounded" />
                <span className="text-xs text-muted-foreground">rounded</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-accent rounded-lg" />
                <span className="text-xs text-muted-foreground">rounded-lg</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-accent rounded-xl" />
                <span className="text-xs text-muted-foreground">rounded-xl</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-accent rounded-full" />
                <span className="text-xs text-muted-foreground">rounded-full</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}