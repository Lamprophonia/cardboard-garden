import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DecksPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="auth-prompt">
          <h2>🃏 Deck Builder</h2>
          <p>Please log in to access your deck builder and manage your card collections.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🃏 Deck Builder</h1>
        <p>Welcome to your deck builder, {user?.name || 'Player'}!</p>
      </div>
      
      <div className="content-section">
        <div className="placeholder-content">
          <h3>Your Decks</h3>
          <p>Create and manage your Magic: The Gathering decks here.</p>
          
          <div className="deck-stats">
            <div className="stat-item">
              <span className="stat-label">Total Decks</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Favorite Format</span>
              <span className="stat-value">Standard</span>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="primary-button">
              + Create New Deck
            </button>
            <button className="secondary-button">
              Import Deck List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecksPage;
