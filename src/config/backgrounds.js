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

export const BACKGROUND_OPTIONS = Object.freeze(
  Object.keys(BACKGROUND_REGISTRY),
);

export function getBackgroundInfo(key) {
  return BACKGROUND_REGISTRY[key] ?? null;
}

export function getNextBackground(current) {
  const idx = BACKGROUND_OPTIONS.indexOf(current);
  return BACKGROUND_OPTIONS[(idx + 1) % BACKGROUND_OPTIONS.length];
}
