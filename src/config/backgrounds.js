/**
 * Background component registry.
 * Single source of truth for all available backgrounds.
 * To add a new background, create its component in `src/Components/`,
 * then add an entry here with a unique key, display `name`, and a
 * `lazy(() => import(...))` component. All consumers (header toggle,
 * context cycling, random initial selection) automatically pick it up.
 */
import { lazy } from 'react';

export const BACKGROUND_REGISTRY = {
  figures: {
    name: 'Figures',
    component: lazy(() => import('../Components/FiguresBackground')),
  },
  particleWave: {
    name: 'Particle Wave',
    component: lazy(() => import('../Components/ParticleWaveBackground')),
  },
};

/** Frozen array of valid background keys, derived from the registry. */
export const BACKGROUND_OPTIONS = Object.freeze(
  Object.keys(BACKGROUND_REGISTRY),
);

/**
 * Returns the registry entry for a given key, or `null` if not found.
 * @param {string} key
 * @returns {{ name: string, component: React.LazyExoticComponent } | null}
 */
export function getBackgroundInfo(key) {
  return BACKGROUND_REGISTRY[key] ?? null;
}

/**
 * Cycles to the next background in the registry (wraps around).
 * Used by `ThemeContext.toggleBackground`.
 * @param {string} current
 * @returns {string}
 */
export function getNextBackground(current) {
  const idx = BACKGROUND_OPTIONS.indexOf(current);
  return BACKGROUND_OPTIONS[(idx + 1) % BACKGROUND_OPTIONS.length];
}
