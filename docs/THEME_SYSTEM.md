# 🎨 Theme System Documentation

## Overview

Cardboard Garden implements a comprehensive theme system supporting Light, Dark, and High Contrast modes with smooth transitions and accessibility features.

## Architecture

### 1. **Theme Context** (`/contexts/ThemeContext.jsx`)
- Manages global theme state
- Persists theme preference in localStorage  
- Responds to system color scheme preferences
- Provides theme switching utilities

### 2. **Theme Toggle Component** (`/components/common/ThemeToggle.jsx`)
- **Button variant**: Cycles through themes with icons
- **Select variant**: Dropdown for theme selection (Settings page)
- **Checkbox variant**: Simple dark/light toggle

### 3. **CSS Variable System** (`/styles/variables.css`)
- **Dark theme default**: Primary CSS variables optimized for dark backgrounds
- **Light theme override**: `[data-theme="light"]` selector with light-appropriate colors
- **High contrast override**: `[data-theme="high-contrast"]` with maximum accessibility

### 4. **Smooth Transitions** (`/styles/theme-transitions.css`)
- Automatic transitions for background, text, and border colors
- Respects `prefers-reduced-motion` for accessibility
- Enhanced focus indicators for high contrast mode

## Theme Specifications

### **Light Theme** ☀️
```css
[data-theme="light"] {
  --cg-primary-green: #2D5016;     /* Darker green for light backgrounds */
  --cg-neutral-100: #F8F9FA;       /* Light backgrounds */
  --cg-neutral-700: #343A40;       /* Dark text */
  /* Optimized for readability on light backgrounds */
}
```

### **Dark Theme** 🌙 (Default)
```css
:root {
  --cg-primary-green: #4A7C2A;     /* Brighter green for dark backgrounds */
  --cg-neutral-100: #1A1A1A;       /* Dark backgrounds */
  --cg-neutral-700: #E5E7EB;       /* Light text */
  /* Optimized for comfortable night viewing */
}
```

### **High Contrast Theme** 🔲
```css
[data-theme="high-contrast"] {
  --cg-primary-green: #00ff00;     /* Maximum contrast green */
  --cg-neutral-100: #000000;       /* Pure black backgrounds */
  --cg-neutral-700: #ffffff;       /* Pure white text */
  /* Enhanced borders and focus indicators */
}
```

## Usage Examples

### **Basic Theme Toggle**
```jsx
import ThemeToggle from '../components/common/ThemeToggle';

// Header button
<ThemeToggle variant="button" />

// Settings dropdown
<ThemeToggle variant="select" />

// Simple checkbox
<ThemeToggle variant="checkbox" />
```

### **Using Theme Context**
```jsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, isDark, setTheme } = useTheme();
  
  return (
    <div className={`my-component ${isDark ? 'dark-specific' : ''}`}>
      Current theme: {theme}
      <button onClick={() => setTheme('high-contrast')}>
        Switch to High Contrast
      </button>
    </div>
  );
}
```

## Accessibility Features

### **System Preference Detection**
- Automatically detects `prefers-color-scheme: dark`
- Falls back to light theme if no preference stored
- Updates when system preference changes

### **High Contrast Support**
- Enhanced border widths (`2px` instead of `1px`)
- Stronger focus indicators (`3px outline`)
- Pure black/white contrast ratios
- Supports `prefers-contrast: high` media query

### **Reduced Motion Support**
- Disables all transitions when `prefers-reduced-motion: reduce`
- Maintains functionality without animation
- Focus on usability over aesthetics

## Theme Persistence

### **localStorage Integration**
```javascript
// Theme preference saved as 'cg-theme'
localStorage.setItem('cg-theme', 'dark');
const savedTheme = localStorage.getItem('cg-theme');
```

### **Theme Application**
```javascript
// Applied via data attributes
document.body.setAttribute('data-theme', 'light');
document.documentElement.setAttribute('data-theme', 'light');
```

## Implementation Notes

### **CSS Variable Inheritance**
- All components use CSS variables for colors
- Variables cascade properly through theme changes
- No hardcoded colors in component styles

### **Performance Optimization**
- Theme switching is instantaneous (no re-renders)
- CSS variables provide native browser optimization
- Minimal DOM manipulation (only data attributes)

### **Browser Support**
- Modern browsers with CSS custom properties
- Graceful degradation for older browsers
- Progressive enhancement approach

## Future Enhancements

### **Planned Features**
- [ ] Game-specific theme variants (Pokemon, Yu-Gi-Oh!, etc.)
- [ ] Custom theme creator
- [ ] Color blindness support
- [ ] Theme scheduling (auto-switch based on time)

### **Possible Extensions**
- [ ] Component-level theme overrides
- [ ] Theme animation presets
- [ ] Advanced accessibility options
- [ ] Theme sharing/export functionality

## Testing

### **Manual Testing Checklist**
- [ ] Theme toggle works in header
- [ ] Settings page theme selector functions
- [ ] Theme persists across page refreshes
- [ ] System preference detection works
- [ ] High contrast mode properly accessible
- [ ] Smooth transitions (when motion not reduced)
- [ ] All components respond to theme changes

### **Accessibility Testing**
- [ ] Screen reader compatibility
- [ ] Keyboard navigation works with all themes
- [ ] Focus indicators visible in all themes
- [ ] Color contrast ratios meet WCAG standards
- [ ] High contrast mode passes accessibility audit

## Troubleshooting

### **Theme Not Applying**
1. Check if ThemeProvider wraps the app
2. Verify CSS variable imports are correct
3. Ensure data-theme attribute is set on body/html

### **Transitions Not Working**
1. Check if `prefers-reduced-motion` is enabled
2. Verify theme-transitions.css is imported
3. Ensure CSS variables are being used, not hardcoded colors

### **Performance Issues**
1. Check for excessive re-renders during theme changes
2. Verify transitions are not applied to heavy elements
3. Consider reducing transition duration for complex layouts
