import { Calendar, ListFilter, FileText, Settings, Figma } from 'lucide-react';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  activeTab: 'today' | 'feed' | 'summary' | 'ui-kit' | 'settings';
  onTabChange: (tab: 'today' | 'feed' | 'summary' | 'ui-kit' | 'settings') => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="h-screen flex bg-background dark overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-semibold text-sidebar-foreground">Perf Assist</h1>
          <p className="text-xs text-muted-foreground mt-1">Личный помощник для перфа</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col">
          <ul className="space-y-2 flex-1">
            <li>
              <button
                onClick={() => onTabChange('today')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'today'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1 hover:cursor-pointer'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Сегодня</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onTabChange('feed')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'feed'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1 hover:cursor-pointer'
                }`}
              >
                <ListFilter className="w-5 h-5" />
                <span>Лента</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onTabChange('summary')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'summary'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1 hover:cursor-pointer'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Перф-саммари</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onTabChange('ui-kit')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'ui-kit'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1 hover:cursor-pointer'
                }`}
              >
                <span className="w-5 h-5 rounded-sm border border-sidebar-border flex items-center justify-center text-[10px] font-semibold">
                  UI
                </span>
                <span>UI Kit</span>
              </button>
            </li>
          </ul>

          {/* Figma design button */}
          <div className="mt-4">
            <button
              onClick={() => {
                // Открываем макеты из директории design_template
                // Макеты доступны по адресу http://localhost:5174
                window.open('http://localhost:5174', '_blank', 'noopener,noreferrer');
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs text-muted-foreground border border-dashed border-sidebar-border hover:border-sidebar-accent hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/30 transition-colors"
            >
              <Figma className="w-4 h-4" />
              <span>Открыть макет Figma</span>
            </button>
            <p className="text-xs text-muted-foreground mt-2 px-4">
              Макеты находятся в директории <code className="bg-sidebar-accent/30 px-1 rounded">design_template/</code>
            </p>
            <p className="text-xs text-muted-foreground mt-1 px-4">
              Макеты доступны по адресу <code className="bg-sidebar-accent/30 px-1 rounded">http://localhost:5174</code>
            </p>
          </div>
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'settings'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1 hover:cursor-pointer'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Настройки</span>
          </button>
          <div className="mt-4 px-4 text-xs text-muted-foreground">
            <div className="flex items-center justify-between mb-1">
              <span>Роль:</span>
              <span className="text-sidebar-foreground">Инженер</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Перф-цикл:</span>
              <span className="text-sidebar-foreground">6 месяцев</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto h-full">
        {children}
      </main>
    </div>
  );
}