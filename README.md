# OPL Themes List

Gallery of OPL (Open PS2 Loader) themes, fetched from the [PixeliGer/OPL-Themes](https://github.com/PixeliGer/OPL-Themes) GitHub repository.

## Features

- **Dynamic backgrounds** — switch between particle wave and geometric figures; extensible via the background registry (`src/config/backgrounds.js`)
- **Dark / light mode** — follows system preference by default, persists manual choice
- **Lazy-loaded images** — cards only load their screenshot when scrolled into view
- **Preview modal** — full-screen screenshot carousel with download links
- **Code-split bundles** — backgrounds and the preview modal are lazy-loaded via `React.lazy`
- **Responsive grid** — adaptive layout from mobile to wide desktop
- **Inline critical CSS** — on build, the main CSS is inlined into the HTML to eliminate render-blocking requests

## Stack

| Layer | Choice |
|-------|--------|
| Framework | [React 19](https://react.dev/) |
| UI library | [MUI 9](https://mui.com/) (Material UI) |
| Styling | [Emotion](https://emotion.sh/) + SCSS |
| Build | [Vite 7](https://vitejs.dev/) |
| Language | JavaScript (JSX) |
| Icons | [MUI Icons](https://mui.com/material-ui/material-icons/) |

## Getting started

```bash
npm install
npm run dev       # dev server with HMR
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint      # ESLint
```

## Project structure

```
src/
├── Components/          # Reusable UI components
│   ├── FiguresBackground.jsx     # Geometric shapes background (CSS animated)
│   ├── ParticleWaveBackground.jsx# Canvas particle wave background
│   ├── Header.jsx                # Top bar with theme & background toggles
│   ├── Footer.jsx
│   ├── ProjectList.jsx
│   ├── SquareProjectCard.jsx     # Card with lazy image + hover overlay
│   └── PreviewModal.jsx          # Full-screen screenshot carousel
├── Pages/
│   └── Home.jsx                  # Single-page layout
├── config/
│   ├── api.js                    # GitHub API constants
│   └── backgrounds.js            # Background registry (add new backgrounds here)
├── context/
│   └── ThemeContext.jsx           # Dark/light mode + background state
├── hooks/
│   ├── useGitHubProjects.js      # Fetch OPL themes from GitHub
│   ├── useIntersectionObserver.js # Visibility detection for lazy loading
│   └── useLazyImage.js           # Deferred image loading
└── styles/
    ├── palette.js                # Dark & light colour palettes
    └── variables.css             # CSS custom properties
```

## Adding a new background

1. Create your component in `src/Components/` (it will be lazy-loaded, so keep it self-contained).
2. Register it in `src/config/backgrounds.js`:

```js
myNewBackground: {
  name: 'My New Background',
  component: lazy(() => import('../Components/MyNewBackground')),
},
```

The toggle button, context cycling, and random initial selection all pick it up automatically — no other changes needed.

## Performance

Lighthouse score is kept at **90+** through:

- Code splitting via `React.lazy` and `Suspense`
- Inline critical CSS (custom Vite plugin)
- Lazy image loading with intersection observer
- Deferred background animation startup
- Tree-shaken MUI imports
- Asset fingerprinting for long-term caching
