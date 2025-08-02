import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="brand-logo">
            <span className="brand-icon">🃏</span>
            <span className="brand-text">Cardboard Garden</span>
          </Link>
        </div>
        
        <div className="header-center">
          <div className="search-bar-header">
            <input
              type="text"
              placeholder="Quick search cards..."
              className="header-search-input"
            />
            <button className="header-search-btn">
              <span>🔍</span>
            </button>
          </div>
        </div>
        
        <div className="header-right">
          <ThemeToggle variant="button" />
          
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-avatar">👤</span>
                <span className="user-name">{user?.username}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
