import { Calendar, ListFilter, FileText, Settings, Palette, LogOut } from 'lucide-react';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  activeTab: 'today' | 'feed' | 'summary' | 'uikit';
  onTabChange: (tab: 'today' | 'feed' | 'summary' | 'uikit') => void;
  onLogout: () => void;
  userEmail?: string;
}

export function Layout({ children, activeTab, onTabChange, onLogout, userEmail }: LayoutProps) {
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
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onTabChange('today')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'today'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Перф-саммари</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onTabChange('uikit')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'uikit'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Palette className="w-5 h-5" />
                <span>UI Kit</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Settings and user info */}
        <div className="p-4 border-t border-sidebar-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all mb-3">
            <Settings className="w-5 h-5" />
            <span>Настройки</span>
          </button>
          
          {/* User info */}
          {userEmail && (
            <div className="px-4 pb-3 mb-3 border-b border-sidebar-border">
              <p className="text-xs text-muted-foreground mb-1">Пользователь:</p>
              <p className="text-sm text-sidebar-foreground truncate">{userEmail}</p>
            </div>
          )}
          
          {/* Role and cycle info */}
          <div className="px-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center justify-between mb-1">
              <span>Роль:</span>
              <span className="text-sidebar-foreground">Инженер</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Перф-цикл:</span>
              <span className="text-sidebar-foreground">6 месяцев</span>
            </div>
          </div>
          
          {/* Logout button */}
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto h-full">
        {children}
      </main>
    </div>
  );
}