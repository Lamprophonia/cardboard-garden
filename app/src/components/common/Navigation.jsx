import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🃏</span>
          Cardboard Garden
        </Link>
        
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/collection" className="nav-link">
                My Collection
              </Link>
              <Link to="/search" className="nav-link">
                Search Cards
              </Link>
              <div className="user-menu">
                <span className="user-greeting">
                  Welcome, {user?.username}
                </span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/search" className="nav-link">
                Search Cards
              </Link>
              <div className="auth-links">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
