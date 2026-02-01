import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TodayView } from './components/TodayView';
import { FeedView } from './components/FeedView';
import { SummaryView } from './components/SummaryView';
import { UIKitView } from './components/UIKitView';
import { LoginView } from './components/LoginView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'feed' | 'summary' | 'uikit'>('today');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Проверяем аутентификацию при загрузке
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setIsAuthenticated(true);
      setUserEmail(storedEmail);
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // В реальном приложении здесь будет вызов API для аутентификации
    // Для демонстрации просто сохраняем email
    localStorage.setItem('userEmail', email);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail('');
    setIsAuthenticated(false);
    setActiveTab('today');
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onLogout={handleLogout}
      userEmail={userEmail}
    >
      {activeTab === 'today' && <TodayView />}
      {activeTab === 'feed' && <FeedView />}
      {activeTab === 'summary' && <SummaryView />}
      {activeTab === 'uikit' && <UIKitView />}
    </Layout>
  );
}