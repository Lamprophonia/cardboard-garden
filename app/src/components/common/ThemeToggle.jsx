import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

function ThemeToggle({ variant = 'button' }) {
  const { theme, setTheme, availableThemes } = useTheme();

  if (variant === 'select') {
    return (
      <div className="theme-select-container">
        <label htmlFor="theme-select" className="theme-label">
          Theme
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="theme-select cg-input"
        >
          {availableThemes.map((themeOption) => (
            <option key={themeOption.value} value={themeOption.value}>
              {themeOption.icon} {themeOption.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (variant === 'checkbox') {
    const isDark = theme === 'dark';
    
    return (
      <div className="theme-checkbox-container">
        <label htmlFor="dark-mode-toggle" className="theme-checkbox-label">
          <input
            id="dark-mode-toggle"
            type="checkbox"
            checked={isDark}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            className="theme-checkbox"
          />
          <span className="theme-checkbox-text">
            {isDark ? '🌙' : '☀️'} Enable dark mode
          </span>
        </label>
      </div>
    );
  }

  // Default button variant
  const currentTheme = availableThemes.find(t => t.value === theme);
  
  return (
    <button
      onClick={() => {
        const currentIndex = availableThemes.findIndex(t => t.value === theme);
        const nextIndex = (currentIndex + 1) % availableThemes.length;
        setTheme(availableThemes[nextIndex].value);
      }}
      className="theme-toggle-btn cg-btn-secondary"
      title={`Current: ${currentTheme?.label || theme}. Click to toggle theme.`}
      aria-label={`Switch theme. Currently ${currentTheme?.label || theme}`}
    >
      <span className="theme-icon">{currentTheme?.icon || '🎨'}</span>
      <span className="theme-text">{currentTheme?.label || 'Theme'}</span>
    </button>
  );
}

export default ThemeToggle;
