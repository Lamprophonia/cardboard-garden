import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Cardboard Garden</h1>
          <p className="hero-subtitle">
            Your personal Magic: The Gathering collection manager
          </p>
          
          {isAuthenticated ? (
            <div className="welcome-back">
              <h2>Welcome back, {user?.username}!</h2>
              <p>Ready to explore your collection?</p>
              <div className="hero-actions">
                <Link to="/collection" className="btn btn-primary btn-lg">
                  View My Collection
                </Link>
                <Link to="/search" className="btn btn-outline btn-lg">
                  Search Cards
                </Link>
              </div>
            </div>
          ) : (
            <div className="get-started">
              <p>
                Build your digital Magic collection, track your cards, and discover new strategies.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/search" className="btn btn-outline btn-lg">
                  Browse Cards
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Search & Discover</h3>
              <p>Search through thousands of Magic cards with detailed information and images.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Collection Management</h3>
              <p>Track your cards, organize your collection, and never lose track of what you own.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Deck Building</h3>
              <p>Create and manage decks, plan your strategies, and optimize your gameplay.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
