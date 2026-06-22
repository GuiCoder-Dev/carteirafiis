import React, { useState, useEffect } from 'react';
import { authApi }               from './services/authApi';
import Dashboard          from './pages/Dashboard';
import FiiManager         from './pages/FiiManager';
import TransactionManager from './pages/TransactionManager';
import EarningsManager    from './pages/EarningsManager';
import AuthManager        from './pages/AuthManager';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authApi.isAuthenticated());
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [toasts, setToasts] = useState([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState(authApi.getCurrentUser());

  // Escuta mudanças no estado de autenticação
  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(authApi.isAuthenticated());
      setUser(authApi.getCurrentUser());
    };
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogout = () => {
    authApi.logout();
    addToast('Sessão encerrada com sucesso.', 'success');
  };

  const navigateToTab = (tab) => {
    setCurrentTab(tab);
    setMobileSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <AuthManager
          onAuthSuccess={() => setIsAuthenticated(true)}
          addToast={addToast}
        />
        {/* Toast Notifications na tela de Auth */}
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              <span className="toast-msg">{toast.message}</span>
              <button className="toast-close" onClick={() => removeToast(toast.id)}>×</button>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="app-shell">
      {/* Mobile Top Header */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="brand-logo" style={{ width: '32px', height: '32px', fontSize: '1rem', borderRadius: '8px' }}>$</div>
          <span className="brand-name" style={{ fontSize: '1rem' }}>Carteira FIIs</span>
        </div>
        <button
          className="mobile-burger"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          aria-label="Toggle menu"
        >
          <svg className="nav-icon" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Navigation Sidebar */}
      <aside className={`app-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="brand-section">
          <div className="brand-logo">$</div>
          <span className="brand-name">Carteira FIIs</span>
        </div>

        <nav>
          <ul className="nav-menu">
            <li>
              <div
                className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => navigateToTab('dashboard')}
              >
                <svg className="nav-icon" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Dashboard
              </div>
            </li>
            <li>
              <div
                className={`nav-item ${currentTab === 'fiis' ? 'active' : ''}`}
                onClick={() => navigateToTab('fiis')}
              >
                <svg className="nav-icon" viewBox="0 0 24 24">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="2 17 12 22 22 17" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="2 12 12 17 22 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                FIIs Cadastrados
              </div>
            </li>
            <li>
              <div
                className={`nav-item ${currentTab === 'transactions' ? 'active' : ''}`}
                onClick={() => navigateToTab('transactions')}
              >
                <svg className="nav-icon" viewBox="0 0 24 24">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="17 6 23 6 23 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Transações
              </div>
            </li>
            <li>
              <div
                className={`nav-item ${currentTab === 'earnings' ? 'active' : ''}`}
                onClick={() => navigateToTab('earnings')}
              >
                <svg className="nav-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="8" x2="12" y2="16" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="8" y1="12" x2="16" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Proventos
              </div>
            </li>
          </ul>
        </nav>

        {/* Widget de Perfil */}
        <div className="user-profile-widget">
          <div className="user-info">
            <span className="user-name">Logado como</span>
            <span className="user-email" title={user?.email || 'Investidor'}>
              {user?.email || 'Investidor'}
            </span>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Sair da conta" aria-label="Sair">
            <svg className="nav-icon" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Sidebar mobile backdrop overlay */}
      {mobileSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Área principal */}
      <main className="app-main">
        {/* Renderiza a aba ativa */}
        {currentTab === 'dashboard'    && <Dashboard addToast={addToast} />}
        {currentTab === 'fiis'         && <FiiManager addToast={addToast} />}
        {currentTab === 'transactions' && <TransactionManager addToast={addToast} navigateToTab={navigateToTab} />}
        {currentTab === 'earnings'     && <EarningsManager addToast={addToast} navigateToTab={navigateToTab} />}
      </main>

      {/* Toast Portal */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span className="toast-msg">{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
