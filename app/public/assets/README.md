# Assets Directory - Cardboard Garden

This directory contains all visual assets for the Cardboard Garden application following industry best practices for web development.

## 📁 Directory Structure

### `/icons/` - Application Icons
**Purpose**: UI icons, navigation elements, action buttons
**Formats**: SVG (preferred), PNG with transparency
**Sizes**: 16px, 20px, 24px, 32px, 48px
**Examples**:
- `search-24.svg` - Search functionality
- `add-32.svg` - Add new items
- `settings-24.svg` - Settings/preferences
- `user-profile-32.svg` - User account
- `collection-24.svg` - Collection management
- `deck-builder-24.svg` - Deck building tools

### `/logos/` - Brand Assets
**Purpose**: Company/project branding elements
**Formats**: SVG (primary), PNG (fallback)
**Variants**: Primary, secondary, monochrome, light/dark themes
**Examples**:
- `cardboard-garden-logo.svg` - Primary logo
- `cardboard-garden-logo-white.svg` - White version for dark backgrounds
- `cardboard-garden-icon.svg` - Icon only (no text)
- `cardboard-garden-wordmark.svg` - Text only

### `/backgrounds/` - Background Images
**Purpose**: Hero sections, page backgrounds, decorative elements
**Formats**: WebP (primary), JPEG (fallback)
**Optimization**: Compressed, multiple resolutions
**Examples**:
- `hero-background.webp` - Main landing page hero
- `collection-bg.webp` - Collection page background
- `deck-builder-bg.webp` - Deck building interface background
- `pattern-subtle.svg` - Repeatable pattern overlay

### `/game-icons/` - Trading Card Game Assets
**Purpose**: Game-specific logos, symbols, and identifiers
**Formats**: SVG (preferred), PNG with transparency
**Organization**: Subdirectories by game
**Examples**:
- `pokemon/pokemon-tcg-logo.svg`
- `magic/mtg-logo.svg`
- `yugioh/yugioh-logo.svg`
- `lorcana/lorcana-logo.svg`
- `generic/tcg-card-back.svg`

### `/ui/` - User Interface Elements
**Purpose**: Custom UI components, decorative elements
**Formats**: SVG, PNG
**Examples**:
- `card-frame.svg` - Card display frame
- `rarity-stars.svg` - Rarity indicators
- `loading-spinner.svg` - Loading animations
- `success-checkmark.svg` - Success states
- `error-warning.svg` - Error states

### `/images/` - Content Images
**Purpose**: Feature illustrations, promotional content
**Formats**: WebP (primary), JPEG/PNG (fallback)
**Examples**:
- `feature-collection-management.webp`
- `feature-deck-building.webp`
- `onboarding-welcome.webp`
- `about-team-photo.webp`

### `/placeholders/` - Placeholder Content
**Purpose**: Default images when content is unavailable
**Formats**: SVG (scalable), PNG
**Examples**:
- `card-placeholder.svg` - Missing card images
- `avatar-default.svg` - Default user avatars
- `deck-placeholder.svg` - Empty deck state
- `collection-empty.svg` - Empty collection state

## 🎨 Design Guidelines

### **File Naming Convention**
- Use kebab-case: `my-asset-name.svg`
- Include size when relevant: `icon-search-24.svg`
- Include variant: `logo-white.svg`, `button-hover.svg`
- Use descriptive names: `collection-management-hero.webp`

### **Size Standards**
**Icons**: 16px, 20px, 24px, 32px, 48px, 64px
**Logos**: Multiple sizes from 32px to 512px
**Backgrounds**: 1920x1080 (desktop), 768x1024 (tablet), 375x667 (mobile)
**Content Images**: Max 1200px width, optimized for web

### **Format Selection Guide**
- **SVG**: Icons, logos, simple illustrations (scalable, small file size)
- **WebP**: Photos, complex images (best compression, modern browsers)
- **PNG**: Images with transparency, fallback for complex graphics
- **JPEG**: Photos without transparency, fallback format
- **ICO**: Favicons only

### **Accessibility Requirements**
- Maintain 4.5:1 contrast ratio minimum
- Provide alternative text descriptions
- Include high-contrast versions for accessibility
- Support dark/light theme variants

### **Performance Optimization**
- Compress all images (aim for <500KB backgrounds, <50KB icons)
- Provide multiple resolutions for high-DPI displays
- Use lazy loading for non-critical images
- Implement proper caching headers

## 🔧 Implementation Notes

### **Favicon Setup**
Place in `/public/` root (not in assets):
- `favicon.ico` - Multi-size ICO file
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` - 180x180 for iOS
- `android-chrome-192x192.png` - Android home screen
- `android-chrome-512x512.png` - Android splash screen

### **Responsive Images**
Use HTML picture elements or CSS media queries:
- 1x displays: standard resolution
- 2x displays: @2x suffix (`icon-search-24@2x.png`)
- 3x displays: @3x suffix (`icon-search-24@3x.png`)

### **Theme Support**
Organize theme variants:
- Light theme: default files
- Dark theme: `-dark` suffix (`logo-dark.svg`)
- High contrast: `-high-contrast` suffix

## 📋 Asset Checklist

### **Essential Branding**
- [ ] Primary logo (SVG + PNG)
- [ ] Logo variations (white, dark, icon-only)
- [ ] Favicon (ICO + PNG variants)
- [ ] Apple touch icons
- [ ] Android app icons

### **Core UI Icons**
- [ ] Navigation icons (home, search, profile, settings)
- [ ] Action icons (add, edit, delete, save, cancel)
- [ ] Status icons (success, error, warning, info)
- [ ] Game-specific icons (deck, collection, cards)

### **Background Assets**
- [ ] Hero background for landing page
- [ ] Section backgrounds for key features
- [ ] Pattern overlays for visual interest
- [ ] Loading/empty state illustrations

### **Game-Specific Assets**
- [ ] Pokemon TCG logo and elements
- [ ] Magic: The Gathering logo and symbols
- [ ] Yu-Gi-Oh! logo and elements
- [ ] Disney Lorcana logo and elements

This structure provides a scalable foundation for all visual assets while maintaining performance and accessibility standards.
