import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function RightPanel() {
  const { isAuthenticated, user } = useAuth();

  return (
    <aside className="right-panel">
      <div className="panel-content">
        {isAuthenticated ? (
          <>
            <div className="panel-section">
              <h3 className="panel-title">Quick Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Cards</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Decks</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">$0</div>
                  <div className="stat-label">Value</div>
                </div>
              </div>
            </div>

            <div className="panel-section">
              <h3 className="panel-title">Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">📥</span>
                  <div className="activity-content">
                    <div className="activity-text">Welcome to Cardboard Garden!</div>
                    <div className="activity-time">Just now</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel-section">
              <h3 className="panel-title">Quick Actions</h3>
              <div className="quick-actions">
                <button className="action-btn">
                  <span>➕</span>
                  Add Cards
                </button>
                <button className="action-btn">
                  <span>🎯</span>
                  New Deck
                </button>
                <button className="action-btn">
                  <span>📊</span>
                  View Stats
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="panel-section">
              <h3 className="panel-title">Featured</h3>
              <div className="featured-content">
                <div className="featured-item">
                  <h4>Magic: The Gathering</h4>
                  <p>Browse our complete database of over 100,000 Magic cards.</p>
                </div>
              </div>
            </div>

            <div className="panel-section">
              <h3 className="panel-title">Getting Started</h3>
              <div className="help-list">
                <div className="help-item">
                  <span className="help-number">1</span>
                  <span className="help-text">Search for cards</span>
                </div>
                <div className="help-item">
                  <span className="help-number">2</span>
                  <span className="help-text">Create an account</span>
                </div>
                <div className="help-item">
                  <span className="help-number">3</span>
                  <span className="help-text">Build your collection</span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="panel-section">
          <h3 className="panel-title">System Status</h3>
          <div className="status-item">
            <div className="status-indicator success"></div>
            <span>API Online</span>
          </div>
          <div className="status-item">
            <div className="status-indicator success"></div>
            <span>Database Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default RightPanel;
