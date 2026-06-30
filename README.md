# OPL Themes List

Gallery of OPL (Open PS2 Loader) themes, fetched from the [PixeliGer/OPL-Themes](https://github.com/PixeliGer/OPL-Themes) GitHub repository.

## Features

- **Dynamic backgrounds** — switch between canvas particle wave and CSS-animated geometric figures; extensible via the background registry (`src/config/backgrounds.js`). First-time visitors get a random background; returning visitors keep their previous choice.
- **Dark / light mode** — follows system preference by default, persists manual choice.
- **Preview modal** — image carousel with side arrows, smart dot pagination (caps at 7 with ellipsis for large galleries), infinite looping, CSS aspect-ratio sizing, crossfade transitions, keyboard (arrow keys) and touch-swipe navigation, and image preloading of adjacent slides.
- **Lazy-loaded images** — card screenshots load via intersection observer; only visible cards fetch their image.
- **Code-split bundles** — backgrounds, preview modal, and main app are separate lazy chunks.
- **Inline critical CSS** — on build, all CSS is inlined into the HTML to eliminate render-blocking requests.
- **Responsive grid** — adaptive layout from mobile to wide desktop.
- **Self-hosted fonts** — Roboto, Roboto Condensed, and Roboto Mono Variable served via fontsource (no external requests).

## Stack

| Layer      | Choice                                                             |
| ---------- | ------------------------------------------------------------------ |
| Framework  | [React 19](https://react.dev/)                                     |
| UI library | [MUI 9](https://mui.com/) (Material UI) with Emotion               |
| Styling    | Emotion CSS-in-JS + SCSS                                           |
| Build      | [Vite 7](https://vitejs.dev/)                                      |
| Language   | JavaScript (JSX)                                                   |
| Icons      | [MUI Icons](https://mui.com/material-ui/material-icons/)           |
| Fonts      | [Fontsource](https://fontsource.org/) (self-hosted variable fonts) |

## Getting started

```bash
npm install
npm run dev       # dev server with HMR
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint      # ESLint
npm run build && npm run preview   # full production test
```

## Project structure

```
src/
├── App.jsx                          # Root component (lazy backgrounds, providers)
├── App.css                          # Scrollbar styling, background fade-in animation
├── main.jsx                         # Entry point (font imports, renders App)
├── theme.js                         # MUI dark/light theme creation
├── assets/
│   ├── placeholder.svg              # Fallback image for cards
│   └── placeholder_wide.svg         # Fallback image for modal
├── Components/
│   ├── Backgrounds/
│   │   ├── FiguresBackground.jsx    # Geometric shapes background (CSS animated)
│   │   ├── FiguresBackground.scss
│   │   ├── ParticleWaveBackground.jsx # Canvas particle wave background
│   │   └── ParticleWaveBackground.scss
│   ├── ErrorBoundary.jsx            # React error boundary wrapper
│   ├── Footer.jsx                   # Fixed footer with credits
│   ├── Header.jsx                   # Top bar with theme & background toggles
│   ├── PreviewModal.jsx             # Image carousel (arrows, dots, crossfade)
│   ├── ProjectList.jsx              # Responsive grid of project cards
│   └── SquareProjectCard.jsx        # Card with lazy image + hover overlay
├── Pages/
│   └── Home.jsx                     # Single-page layout
├── config/
│   ├── api.js                       # GitHub API constants and URL helpers
│   └── backgrounds.js               # Background registry (add new backgrounds here)
├── context/
│   └── ThemeContext.jsx              # Dark/light mode + background state + localStorage
├── hooks/
│   ├── useGitHubProjects.js         # Fetch OPL themes from GitHub API with caching
│   ├── useIntersectionObserver.js    # Element visibility detection
│   └── useLazyImage.js              # Deferred image loading
└── styles/
    ├── palette.js                    # Dark & light colour palettes + CSS variable generator
    └── variables.css                 # CSS custom properties
```

## Background registry

Backgrounds are managed through a registry pattern in `src/config/backgrounds.js`. Each entry is a self-contained lazy-loaded component:

```js
figures: {
  name: 'Figures',
  component: lazy(() => import('../Components/Backgrounds/FiguresBackground')),
},
```

**To add a new background**, create the component and add one entry to the registry. The header toggle, context cycling, and random initial selection all adapt automatically.

The toggle button cycles through all registered backgrounds; on first visit (no stored preference) a random one is selected.

## Preview modal

The modal implements a Flickr-inspired image carousel:

- **Side arrows** — semi-transparent overlay, full opacity on hover, infinite wrapping
- **Smart dots** — caps at 7 indicators with ellipsis gaps for large galleries; active dot is a wider pill; `"N / M"` counter alongside
- **Crossfade transitions** — image fades in (300ms opacity) after preload, sized via CSS `aspect-ratio` using the preloaded image's natural dimensions
- **Adjacent preloading** — the next and previous images load in the background before navigation
- **Keyboard** — arrow keys navigate; Escape closes
- **Touch** — horizontal swipe with 50px threshold
- **Minimal chrome** — close is an X icon overlaid on the image; download is a compact button inline with the title; title and description use Roboto Mono

## Performance

Lighthouse score targets **90+** on mobile emulation:

- **Code splitting** — `React.lazy` + `Suspense` for backgrounds, modal, and app shell
- **Inline critical CSS** — custom Vite plugin inlines the stylesheet into the HTML at build time
- **Deferred canvas** — particle wave animation starts after the main thread is free
- **Image lazy loading** — intersection observer triggers screenshot loads only for visible cards
- **Asset fingerprinting** — content-hashed filenames enable immutable cache headers
- **Tree-shaken MUI imports** — direct subpath imports (no barrel files)
- **Minimal re-renders** — `React.memo` on project list and card components; `useCallback`/`useMemo` throughout
