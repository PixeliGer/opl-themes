export const darkPalette = {
  surface: {
    body: '#121212',
    card: 'rgba(18, 18, 18, 0.65)',
    header: 'rgba(18, 18, 18, 0.75)',
    footer: 'rgba(18, 18, 18, 0.75)',
    modal: 'rgba(18, 18, 18, 0.75)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.25)',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#bbb',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.1)',
  },
  scrollbar: {
    track: '#272727',
    thumb: '#888',
  },
  error: {
    bg: 'rgba(255, 0, 0, 0.1)',
    main: '#ff6b6b',
  },
  accent: ['#ff6ec4', '#7873f5', '#4ade80', '#facc15'],
};

export const lightPalette = {
  surface: {
    body: '#f5f5f5',
    card: 'rgba(255, 255, 255, 0.85)',
    header: 'rgba(255, 255, 255, 0.5)',
    footer: 'rgba(255, 255, 255, 0.5)',
    modal: 'rgba(255, 255, 255, 0.95)',
    backdrop: 'rgba(0, 0, 0, 0.3)',
    shadow: 'rgba(0, 0, 0, 0.15)',
    overlay: 'rgba(255, 255, 255, 0.85)',
  },
  text: {
    primary: '#1a1a1a',
    secondary: '#666',
  },
  border: {
    subtle: 'rgba(0, 0, 0, 0.1)',
  },
  scrollbar: {
    track: '#ddd',
    thumb: '#aaa',
  },
  error: {
    bg: 'rgba(255, 0, 0, 0.05)',
    main: '#d32f2f',
  },
  accent: ['#e91e63', '#5c6bc0', '#43a047', '#f9a825'],
};

export function getPalette(mode) {
  return mode === 'light' ? lightPalette : darkPalette;
}

export function getCssVariables(mode) {
  const p = getPalette(mode);
  return {
    '--color-surface-body': p.surface.body,
    '--color-surface-card': p.surface.card,
    '--color-surface-header': p.surface.header,
    '--color-surface-footer': p.surface.footer,
    '--color-surface-modal': p.surface.modal,
    '--color-surface-backdrop': p.surface.backdrop,
    '--color-surface-shadow': p.surface.shadow,
    '--color-surface-overlay': p.surface.overlay,
    '--color-text-primary': p.text.primary,
    '--color-text-secondary': p.text.secondary,
    '--color-border-subtle': p.border.subtle,
    '--color-scrollbar-track': p.scrollbar.track,
    '--color-scrollbar-thumb': p.scrollbar.thumb,
    '--color-error-bg': p.error.bg,
    '--color-error-main': p.error.main,
  };
}

export default darkPalette;
