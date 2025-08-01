import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function CollectionPage() {
  const { user } = useAuth();

  return (
    <div className="collection-page">
      <div className="collection-header">
        <h1>My Collection</h1>
        <p className="collection-subtitle">
          Welcome to your personal Magic collection, {user?.username}!
        </p>
      </div>

      <div className="collection-container">
        <div className="coming-soon">
          <div className="coming-soon-icon">📚</div>
          <h2>Collection Management Coming Soon</h2>
          <p>
            We're working on building an amazing collection management system where you'll be able to:
          </p>
          <ul>
            <li>Add cards to your personal collection</li>
            <li>Track quantities and conditions</li>
            <li>Organize cards by sets, colors, or custom categories</li>
            <li>View collection statistics and value estimates</li>
            <li>Export and share your collection</li>
          </ul>
          <p>
            In the meantime, you can browse and search for cards to plan your collection.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CollectionPage;
