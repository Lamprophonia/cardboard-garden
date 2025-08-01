# Cardboard Garden Design System

This document outlines the design system and styling best practices for consistent UI/UX across the Cardboard Garden application.

## 🎨 Design Philosophy

**Theme**: "Digital Garden Cultivation" 
- Organic growth meets digital precision
- Warm, earthy tones with clean modern interfaces
- Nature-inspired elements balanced with card game aesthetics

## 🎯 Color Palette

### **Primary Colors**
```css
--cg-primary-green: #2D5016;     /* Forest Green - Primary brand */
--cg-primary-light: #4A7C2A;     /* Sage Green - Hover states */
--cg-primary-dark: #1A3009;      /* Deep Forest - Active states */
```

### **Secondary Colors**
```css
--cg-secondary-brown: #8B4513;   /* Earthy Brown - Wood/cardboard */
--cg-secondary-gold: #B8860B;    /* Harvest Gold - Accent/premium */
--cg-accent-blue: #4682B4;       /* Steel Blue - Card backs */
```

### **Neutral Colors**
```css
--cg-neutral-100: #F8F9FA;       /* Light backgrounds */
--cg-neutral-200: #E9ECEF;       /* Subtle borders */
--cg-neutral-300: #DEE2E6;       /* Input borders */
--cg-neutral-400: #CED4DA;       /* Disabled states */
--cg-neutral-500: #6C757D;       /* Muted text */
--cg-neutral-600: #495057;       /* Secondary text */
--cg-neutral-700: #343A40;       /* Primary text */
--cg-neutral-800: #212529;       /* Headers */
--cg-neutral-900: #000000;       /* High contrast */
```

### **Semantic Colors**
```css
--cg-success: #28A745;           /* Success states */
--cg-warning: #FFC107;           /* Warning states */
--cg-danger: #DC3545;            /* Error states */
--cg-info: #17A2B8;              /* Info states */
```

### **Game-Specific Colors**
```css
--cg-pokemon-red: #FF6B6B;       /* Pokemon theme */
--cg-magic-purple: #8E44AD;      /* Magic: The Gathering */
--cg-yugioh-blue: #3498DB;       /* Yu-Gi-Oh! */
--cg-lorcana-gold: #F39C12;      /* Disney Lorcana */
```

## 📝 Typography

### **Font Stack**
```css
--cg-font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--cg-font-heading: 'Poppins', 'Inter', sans-serif;
--cg-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### **Font Sizes (Fluid Typography)**
```css
--cg-text-xs: clamp(0.75rem, 0.5vw + 0.7rem, 0.8rem);
--cg-text-sm: clamp(0.875rem, 0.5vw + 0.8rem, 0.9rem);
--cg-text-base: clamp(1rem, 0.5vw + 0.9rem, 1.1rem);
--cg-text-lg: clamp(1.125rem, 0.5vw + 1rem, 1.25rem);
--cg-text-xl: clamp(1.25rem, 1vw + 1rem, 1.5rem);
--cg-text-2xl: clamp(1.5rem, 1.5vw + 1rem, 2rem);
--cg-text-3xl: clamp(1.875rem, 2vw + 1rem, 2.5rem);
--cg-text-4xl: clamp(2.25rem, 2.5vw + 1rem, 3rem);
```

### **Font Weights**
```css
--cg-font-light: 300;
--cg-font-normal: 400;
--cg-font-medium: 500;
--cg-font-semibold: 600;
--cg-font-bold: 700;
```

## 📐 Spacing & Layout

### **Spacing Scale**
```css
--cg-space-1: 0.25rem;   /* 4px */
--cg-space-2: 0.5rem;    /* 8px */
--cg-space-3: 0.75rem;   /* 12px */
--cg-space-4: 1rem;      /* 16px */
--cg-space-5: 1.25rem;   /* 20px */
--cg-space-6: 1.5rem;    /* 24px */
--cg-space-8: 2rem;      /* 32px */
--cg-space-10: 2.5rem;   /* 40px */
--cg-space-12: 3rem;     /* 48px */
--cg-space-16: 4rem;     /* 64px */
--cg-space-20: 5rem;     /* 80px */
```

### **Container Widths**
```css
--cg-container-sm: 640px;
--cg-container-md: 768px;
--cg-container-lg: 1024px;
--cg-container-xl: 1280px;
--cg-container-2xl: 1536px;
```

### **Border Radius**
```css
--cg-radius-sm: 0.25rem;    /* Small elements */
--cg-radius-md: 0.5rem;     /* Buttons, inputs */
--cg-radius-lg: 0.75rem;    /* Cards */
--cg-radius-xl: 1rem;       /* Large cards */
--cg-radius-full: 9999px;   /* Pills, avatars */
```

## 🎪 Component Standards

### **Cards**
- **Shadow**: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- **Border**: `1px solid var(--cg-neutral-200)`
- **Radius**: `var(--cg-radius-lg)`
- **Padding**: `var(--cg-space-6)`
- **Hover**: Lift with `0 10px 15px -3px rgba(0, 0, 0, 0.1)`

### **Buttons**
- **Primary**: Green background, white text
- **Secondary**: White background, green border
- **Padding**: `var(--cg-space-3) var(--cg-space-6)`
- **Radius**: `var(--cg-radius-md)`
- **Transition**: `all 0.2s ease-in-out`

### **Forms**
- **Input Height**: `2.75rem` (44px minimum for mobile)
- **Border**: `1px solid var(--cg-neutral-300)`
- **Focus**: Green border + shadow
- **Error**: Red border + error text below

### **Navigation**
- **Height**: `4rem` (64px)
- **Background**: White with subtle shadow
- **Logo**: Left-aligned
- **Menu**: Right-aligned
- **Mobile**: Hamburger menu

## 📱 Responsive Design

### **Breakpoints**
```css
--cg-bp-sm: 640px;    /* Small tablets */
--cg-bp-md: 768px;    /* Large tablets */
--cg-bp-lg: 1024px;   /* Small laptops */
--cg-bp-xl: 1280px;   /* Large laptops */
--cg-bp-2xl: 1536px;  /* Desktop */
```

### **Mobile-First Approach**
- Start with mobile design
- Progressive enhancement for larger screens
- Touch-friendly targets (44px minimum)
- Readable text without zooming

## ⚡ Animation Standards

### **Transitions**
```css
--cg-transition-fast: 0.15s ease-out;
--cg-transition-base: 0.2s ease-in-out;
--cg-transition-slow: 0.3s ease-in-out;
```

### **Easing Functions**
```css
--cg-ease-in: cubic-bezier(0.4, 0, 1, 1);
--cg-ease-out: cubic-bezier(0, 0, 0.2, 1);
--cg-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## 🎭 Theme Support

### **Dark Mode Variables**
```css
[data-theme="dark"] {
  --cg-bg-primary: #1a1a1a;
  --cg-bg-secondary: #2d2d2d;
  --cg-text-primary: #ffffff;
  --cg-text-secondary: #a0a0a0;
  /* Override other colors as needed */
}
```

### **High Contrast Mode**
```css
[data-theme="high-contrast"] {
  --cg-primary-green: #00ff00;
  --cg-text-primary: #ffffff;
  --cg-bg-primary: #000000;
  /* High contrast overrides */
}
```

## 📋 Component Library Structure

### **Atomic Design Hierarchy**
1. **Atoms**: Button, Input, Icon, Typography
2. **Molecules**: SearchBox, Card, NavItem
3. **Organisms**: Header, Sidebar, CardGrid
4. **Templates**: PageLayout, DashboardLayout
5. **Pages**: HomePage, CollectionPage, DeckBuilder

### **CSS Architecture**
- **Base**: Reset, typography, global styles
- **Components**: Reusable UI components
- **Utilities**: Helper classes for spacing, colors
- **Themes**: Dark mode, high contrast variations

## 🔧 Implementation Tools

### **Recommended Stack**
- **CSS Framework**: Tailwind CSS (with custom config)
- **Component Library**: Headless UI or Radix UI
- **Icons**: Heroicons or Lucide React
- **Animations**: Framer Motion

### **File Organization**
```
src/styles/
├── globals.css           # Global styles and CSS variables
├── components.css        # Component-specific styles
├── utilities.css         # Utility classes
├── themes/
│   ├── light.css        # Light theme
│   ├── dark.css         # Dark theme
│   └── high-contrast.css # Accessibility theme
└── game-themes/
    ├── pokemon.css      # Pokemon-specific styling
    ├── magic.css        # MTG-specific styling
    ├── yugioh.css       # Yu-Gi-Oh!-specific styling
    └── lorcana.css      # Lorcana-specific styling
```

## ✅ Best Practices Checklist

### **Consistency**
- [ ] Use design tokens for all colors, spacing, typography
- [ ] Follow established component patterns
- [ ] Maintain consistent naming conventions
- [ ] Test across all breakpoints

### **Accessibility**
- [ ] Maintain proper color contrast (4.5:1 minimum)
- [ ] Support keyboard navigation
- [ ] Include focus indicators
- [ ] Test with screen readers

### **Performance**
- [ ] Optimize CSS bundle size
- [ ] Use CSS custom properties for theming
- [ ] Minimize layout shifts
- [ ] Optimize critical rendering path

### **Maintainability**
- [ ] Document component usage
- [ ] Use consistent class naming (BEM or utility-first)
- [ ] Version control design tokens
- [ ] Regular design system audits

This design system ensures consistency, accessibility, and maintainability across your entire application while staying true to the "Cardboard Garden" theme!
