# Projxon AI Website

Revolutionary AI models and applications that run locally offline, even on mobile devices.

## 🚀 Features

- **Modern Design System**: Built with SCSS variables and modular components
- **Fully Responsive**: Optimized for all screen sizes from mobile to desktop
- **Fast & Lightweight**: Minimal dependencies, optimized performance
- **SEO Friendly**: Semantic HTML and proper meta tags
- **Easy to Deploy**: Configured for Vercel deployment

## 🛠️ Tech Stack

- HTML5
- SCSS/CSS3
- Vanilla JavaScript
- Sass for CSS preprocessing

## 📦 Installation

```bash
# Install dependencies
npm install

# Build CSS from SCSS
npm run build

# Watch for SCSS changes during development
npm run watch:css
```

## 🏗️ Project Structure

```
ProjxonAIWebsite/
├── articles/               # Generated article listing & pages
├── content/
│   └── posts/             # Individual article YAML files (metadata + Markdown)
├── scss/
│   ├── _variables.scss     # Design system variables (colors, typography, spacing)
│   ├── _mixins.scss        # Reusable SCSS mixins
│   ├── _base.scss          # Base styles and resets
│   ├── _components.scss    # Component styles (buttons, cards, navigation)
│   └── style.scss          # Main stylesheet (imports all partials)
├── css/
│   └── style.css           # Compiled CSS (generated)
├── js/
│   └── main.js             # JavaScript functionality
├── scripts/
│   └── generate-articles.js# YAML → HTML generator
├── static/
│   └── assets/
│       └── images/
│           └── logo/       # Logo assets
├── index.html              # Landing page
├── about.html              # About page
├── solutions.html          # Vision page
├── team.html               # Team directory
├── contact.html            # Contact page
├── package.json            # Dependencies and scripts
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

## 🎨 Design System

The website uses a comprehensive design system built with SCSS variables:

### Colors
- **Primary**: Indigo (#6366f1)
- **Secondary**: Purple (#8b5cf6)
- **Accent**: Cyan (#06b6d4), Emerald (#10b981)
- **Neutral**: Gray scale from 50-900

### Typography
- **Font Family**: Inter (from Google Fonts)
- **Font Sizes**: Responsive scale from 0.75rem to 4.5rem
- **Font Weights**: 300-800

### Spacing
- **Spacing Scale**: 0.25rem to 8rem (4px to 128px)
- **Consistent**: Using variables for all spacing

### Components
- Buttons (primary, secondary, outline, ghost)
- Cards (elevated, gradient, feature)
- Navigation (fixed, responsive)
- Sections (regular, dark, gradient)
- Grid layouts (2, 3, 4 columns)
- Footer

## 📰 Articles & Blog Workflow

Articles are generated from a single YAML file so anyone on the team can publish without touching HTML.

### Adding or editing a post
1. Inside `content/posts/`, create a new `.yaml` file (one file per article).
2. Populate it with metadata plus Markdown content, e.g.
   ```yaml
   slug: building-local-ai
   title: Building Local AI with Intention
   date: 2025-11-10
   author: Maya Chen
   readingTime: 5
   summary: How we think about bringing assistants on-device.
   tags:
     - Product
     - Behind the scenes
   content: |
     ## Why local matters
     Markdown body goes here...
   ```
3. Run `npm run generate:articles` to rebuild `articles/index.html` and each `articles/<slug>.html`.
4. Commit the new/updated YAML file **and** the generated HTML files inside `articles/`.

The generator uses the same navigation/footer template, so the articles automatically inherit the site chrome.

## 🌐 Deployment

This site is configured for deployment on Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in Vercel
3. Vercel will automatically detect the configuration and deploy

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📝 Customization

### Changing Colors

Edit the color variables in `scss/_variables.scss`:

```scss
$primary-base: #6366f1;
$secondary-base: #8b5cf6;
// ... more colors
```

### Modifying Typography

Update font families and sizes in `scss/_variables.scss`:

```scss
$font-primary: 'Inter', sans-serif;
$font-size-base: 1rem;
// ... more typography settings
```

### Adding New Components

Create component styles in `scss/_components.scss` following the existing patterns.

## 🔧 Development

```bash
# Start SCSS watch mode
npm run watch:css

# Regenerate article listing & pages
npm run generate:articles

# Build CSS for production
npm run build

# Open index.html in your browser or use a local server
# Recommended: Use VS Code Live Server extension
```

## 📄 Pages

- **Home** (`index.html`): Launch-focused hero, feature highlights, focus areas, and CTA
- **About** (`about.html`): Company mission, values, and working principles
- **Vision** (`solutions.html`): Product direction, roadmap, and guiding rules
- **Team** (`team.html`): Meet the core team with direct contact info
- **Contact** (`contact.html`): Simple instructions to email support@projxon.ai

## 🤝 Contributing

This is a company website. For internal changes, please follow the established design system and component patterns.

## 📧 Contact

- Website: www.projxon.ai
- Email: support@projxon.ai

## 📄 License

Copyright © 2025 Projxon AI. All rights reserved.

