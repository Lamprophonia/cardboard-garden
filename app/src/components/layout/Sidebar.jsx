import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Sidebar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navigationItems = [
    {
      path: '/',
      label: 'Home',
      icon: '🏠',
      public: true
    },
    {
      path: '/search',
      label: 'Search Cards',
      icon: '🔍',
      public: true
    },
    {
      path: '/collection',
      label: 'My Collection',
      icon: '📚',
      public: false
    },
    {
      path: '/decks',
      label: 'Deck Builder',
      icon: '🃏',
      public: false
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: '⚙️',
      public: false
    }
  ];

  const publicItems = [
    {
      path: '/about',
      label: 'About',
      icon: 'ℹ️',
      public: true
    },
    {
      path: '/help',
      label: 'Help',
      icon: '❓',
      public: true
    }
  ];

  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Main</h3>
          <ul className="nav-list">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isLocked = !item.public && !isAuthenticated;
              
              return (
                <li key={item.path} className="nav-item">
                  <Link 
                    to={isLocked ? '/login' : item.path} 
                    className={`nav-link ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {isLocked && <span className="lock-icon">🔒</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Support</h3>
          <ul className="nav-list">
            {publicItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {!isAuthenticated && (
          <div className="nav-section sidebar-auth">
            <div className="auth-prompt">
              <h4>Join Cardboard Garden</h4>
              <p>Create an account to build your collection and manage decks.</p>
              <Link to="/register" className="btn btn-primary btn-sm btn-full">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
