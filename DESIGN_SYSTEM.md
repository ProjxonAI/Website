# Projxon AI Design System

This document outlines the complete design system used throughout the Projxon AI website.

## 🎨 Color Palette

### Primary Colors
```scss
$primary-base: #6366f1        // Indigo - Main brand color
$primary-light: #818cf8       // Light variant
$primary-lighter: #a5b4fc     // Lighter variant (for backgrounds)
$primary-dark: #4f46e5        // Dark variant
$primary-darker: #4338ca      // Darker variant
```

### Secondary Colors
```scss
$secondary-base: #8b5cf6      // Purple - Complementary color
$secondary-light: #a78bfa     // Light variant
$secondary-dark: #7c3aed      // Dark variant
```

### Accent Colors
```scss
// Cyan
$accent-cyan: #06b6d4
$accent-cyan-light: #22d3ee
$accent-cyan-dark: #0891b2

// Emerald (Success)
$accent-emerald: #10b981
$accent-emerald-light: #34d399
$accent-emerald-dark: #059669
```

### Neutral Colors (Grayscale)
```scss
$neutral-50: #fafafa          // Lightest
$neutral-100: #f4f4f5
$neutral-200: #e4e4e7         // Borders
$neutral-300: #d4d4d8
$neutral-400: #a1a1aa
$neutral-500: #71717a         // Muted text
$neutral-600: #52525b         // Secondary text
$neutral-700: #3f3f46
$neutral-800: #27272a         // Dark backgrounds
$neutral-900: #18181b         // Primary text, darkest
```

### Semantic Colors
```scss
$success: #10b981             // Green
$warning: #f59e0b             // Orange
$error: #ef4444               // Red
$info: #06b6d4                // Cyan
```

## 📝 Typography

### Font Families
```scss
$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif
$font-display: 'Inter'        // Same as primary for consistency
$font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace
```

### Font Sizes (Responsive)
```scss
$font-size-xs: 0.75rem        // 12px
$font-size-sm: 0.875rem       // 14px
$font-size-base: 1rem         // 16px (default)
$font-size-lg: 1.125rem       // 18px
$font-size-xl: 1.25rem        // 20px
$font-size-2xl: 1.5rem        // 24px
$font-size-3xl: 1.875rem      // 30px
$font-size-4xl: 2.25rem       // 36px
$font-size-5xl: 3rem          // 48px
$font-size-6xl: 3.75rem       // 60px
$font-size-7xl: 4.5rem        // 72px
```

### Font Weights
```scss
$font-weight-light: 300
$font-weight-normal: 400
$font-weight-medium: 500
$font-weight-semibold: 600
$font-weight-bold: 700
$font-weight-extrabold: 800
```

### Line Heights
```scss
$line-height-tight: 1.25      // Headings
$line-height-snug: 1.375
$line-height-normal: 1.5      // Body text
$line-height-relaxed: 1.625   // Comfortable reading
$line-height-loose: 2
```

## 📏 Spacing Scale

Consistent spacing throughout the design:

```scss
$space-1: 0.25rem    // 4px
$space-2: 0.5rem     // 8px
$space-3: 0.75rem    // 12px
$space-4: 1rem       // 16px
$space-5: 1.25rem    // 20px
$space-6: 1.5rem     // 24px
$space-8: 2rem       // 32px
$space-10: 2.5rem    // 40px
$space-12: 3rem      // 48px
$space-16: 4rem      // 64px
$space-20: 5rem      // 80px
$space-24: 6rem      // 96px
$space-32: 8rem      // 128px
```

## 📐 Layout

### Container
```scss
$container-max-width: 1280px
$container-padding: 1.5rem    // 24px on mobile
```

### Breakpoints
```scss
$breakpoint-sm: 640px         // Mobile landscape
$breakpoint-md: 768px         // Tablet
$breakpoint-lg: 1024px        // Desktop
$breakpoint-xl: 1280px        // Large desktop
$breakpoint-2xl: 1536px       // Extra large
```

### Usage
```scss
@include respond-to(md) {
  // Styles for tablet and up
}
```

## 🎭 Effects

### Border Radius
```scss
$radius-sm: 0.375rem   // 6px
$radius-base: 0.5rem   // 8px
$radius-md: 0.75rem    // 12px
$radius-lg: 1rem       // 16px
$radius-xl: 1.5rem     // 24px
$radius-full: 9999px   // Perfect circle/pill
```

### Shadows
```scss
$shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
$shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
$shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
$shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
$shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
$shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
$shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3)
```

### Transitions
```scss
$transition-fast: 150ms ease-in-out
$transition-base: 250ms ease-in-out
$transition-slow: 350ms ease-in-out
```

## 🧩 Components

### Buttons

**Button Variants:**
- `.btn--primary` - Primary gradient button (main CTAs)
- `.btn--secondary` - Light background button
- `.btn--outline` - Outlined button
- `.btn--ghost` - Transparent button

**Button Sizes:**
- `.btn--sm` - Small button
- `.btn` - Default size
- `.btn--lg` - Large button

**Usage:**
```html
<button class="btn btn--primary btn--lg">Get Started</button>
<button class="btn btn--outline">Learn More</button>
```

### Cards

**Card Variants:**
- `.card` - Basic card with border
- `.card--elevated` - Card with shadow, hover effect
- `.card--gradient` - Card with gradient background
- `.card--feature` - Centered card with icon

**Card Structure:**
```html
<div class="card card--elevated">
  <div class="card__header">
    <h3 class="card__title">Title</h3>
    <p class="card__description">Description</p>
  </div>
  <div class="card__content">Content</div>
  <div class="card__footer">Footer</div>
</div>
```

### Grid Layouts

**Grid Classes:**
- `.grid--2` - 2 columns (desktop)
- `.grid--3` - 3 columns (desktop)
- `.grid--4` - 4 columns (desktop)

All grids are responsive and stack on mobile.

**Usage:**
```html
<div class="grid grid--3">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

### Navigation

Fixed navigation bar that:
- Sticks to top
- Adds backdrop blur when scrolled
- Collapses to hamburger menu on mobile
- Smooth transitions

### Sections

**Section Variants:**
- `.section` - Standard section with vertical padding
- `.section--dark` - Dark gradient background
- `.section--gradient` - Primary gradient background

**Section Structure:**
```html
<section class="section">
  <div class="container">
    <div class="section__header">
      <div class="section__badge">Badge Text</div>
      <h2 class="section__title">Section Title</h2>
      <p class="section__description">Description</p>
    </div>
    <!-- Section content -->
  </div>
</section>
```

## 🎨 Gradients

### Primary Gradient
```scss
background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
```

### Accent Gradient
```scss
background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
```

### Dark Gradient
```scss
background: linear-gradient(180deg, #18181b 0%, #27272a 100%);
```

### Gradient Text
Apply gradient to text:
```html
<h1 class="gradient-text">Gradient Text</h1>
```

## ♿ Accessibility

- Focus states with visible outline
- Semantic HTML elements
- ARIA labels where needed
- Sufficient color contrast (WCAG AA compliant)
- Keyboard navigation support

## 📱 Responsive Design

The design follows a mobile-first approach:

1. **Mobile (Default)**: 320px - 767px
   - Single column layouts
   - Stacked navigation
   - Larger touch targets

2. **Tablet**: 768px - 1023px
   - 2 column layouts
   - Horizontal navigation
   - Optimized spacing

3. **Desktop**: 1024px+
   - Multi-column layouts
   - Full navigation menu
   - Maximum 1280px container width

## 🎯 Design Principles

1. **Consistency**: Use design system variables everywhere
2. **Modularity**: Reusable components with variants
3. **Scalability**: Easy to extend with new components
4. **Performance**: Optimized CSS, minimal dependencies
5. **Accessibility**: WCAG compliant, keyboard friendly
6. **Responsiveness**: Mobile-first, works on all devices

## 🔧 Customization

To customize the design:

1. **Colors**: Edit `scss/_variables.scss` color variables
2. **Typography**: Modify font variables in `scss/_variables.scss`
3. **Spacing**: Adjust spacing scale if needed
4. **Components**: Add new components in `scss/_components.scss`
5. **Rebuild**: Run `npm run build` to compile changes

## 📚 File Structure

```
scss/
├── _variables.scss      # All design tokens
├── _mixins.scss         # Reusable mixins & utilities
├── _base.scss           # Base styles, reset, typography
├── _components.scss     # Component styles
└── style.scss           # Main file that imports all others
```

---

**Note**: This design system is built to be consistent, modular, and easy to maintain. All design decisions are centralized in the SCSS files using variables, making it simple to update the entire site's appearance by changing a few values.

