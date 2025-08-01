import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="auth-prompt">
          <h2>⚙️ Settings</h2>
          <p>Please log in to access your account settings and preferences.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>
      
      <div className="content-section">
        <div className="settings-group">
          <h3>Account Information</h3>
          <div className="setting-item">
            <label>Display Name</label>
            <input type="text" defaultValue={user?.name || ''} />
          </div>
          <div className="setting-item">
            <label>Email</label>
            <input type="email" defaultValue={user?.email || ''} />
          </div>
        </div>
        
        <div className="settings-group">
          <h3>Display Preferences</h3>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Show card prices
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Enable dark mode
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              Show high-resolution images
            </label>
          </div>
        </div>
        
        <div className="settings-group">
          <h3>Collection Settings</h3>
          <div className="setting-item">
            <label>Default Format</label>
            <select>
              <option>Standard</option>
              <option>Modern</option>
              <option>Legacy</option>
              <option>Commander</option>
            </select>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              Auto-sync collection
            </label>
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="primary-button">
            Save Changes
          </button>
          <button className="secondary-button">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
