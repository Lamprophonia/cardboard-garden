import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'light' since dark is the CSS default
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('cg-theme');
    return storedTheme || 'light';
  });

  // Apply theme to document when theme changes
  useEffect(() => {
    const applyTheme = (selectedTheme) => {
      const body = document.body;
      const html = document.documentElement;
      
      // Remove existing theme classes
      body.removeAttribute('data-theme');
      html.removeAttribute('data-theme');
      
      // Apply new theme
      if (selectedTheme !== 'dark') {
        // Dark is the CSS default, so only apply data attribute for other themes
        body.setAttribute('data-theme', selectedTheme);
        html.setAttribute('data-theme', selectedTheme);
      }
      
      // Store in localStorage
      localStorage.setItem('cg-theme', selectedTheme);
    };

    applyTheme(theme);
  }, [theme]);

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      const storedTheme = localStorage.getItem('cg-theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      let initialTheme = 'light'; // Default to light since our CSS defaults to dark
      
      if (storedTheme) {
        initialTheme = storedTheme;
      } else if (systemPrefersDark) {
        initialTheme = 'dark';
      }
      
      setTheme(initialTheme);
    };

    initializeTheme();

    // Listen for system theme changes
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('cg-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addListener(handleSystemThemeChange);

    return () => {
      mediaQuery.removeListener(handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      return prevTheme === 'light' ? 'dark' : 'light';
    });
  };

  const setSpecificTheme = (newTheme) => {
    if (['light', 'dark'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  const value = {
    theme,
    setTheme: setSpecificTheme,
    toggleTheme,
    isDark,
    isLight,
    availableThemes: [
      { value: 'light', label: 'Light', icon: '☀️' },
      { value: 'dark', label: 'Dark', icon: '🌙' }
    ]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
