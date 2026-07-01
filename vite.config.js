import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function inlineCriticalCss() {
  let config;
  return {
    name: 'inline-critical-css',
    enforce: 'post',
    apply: 'build',
    configResolved(c) {
      config = c;
    },
    generateBundle(_, bundle) {
      const htmlEntry = Object.values(bundle).find(
        (chunk) => chunk.type === 'asset' && chunk.fileName === 'index.html',
      );
      if (!htmlEntry || typeof htmlEntry.source !== 'string') return;

      const base = config.base || '/';
      let html = htmlEntry.source;
      const toRemove = new Set();

      const preloadFonts = [];

      html = html.replace(
        /<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g,
        (match, href) => {
          const relative = href.replace(base, '');
          const cssAsset = Object.values(bundle).find(
            (chunk) => chunk.type === 'asset' && chunk.fileName === relative,
          );
          if (cssAsset && typeof cssAsset.source === 'string') {
            toRemove.add(relative);

            // Extract @font-face src URLs to add preload links for latin subsets
            const fontUrls = cssAsset.source.match(
              /url\(([^)]+)\)/g,
            );
            if (fontUrls) {
              for (const fu of fontUrls) {
                const url = fu.slice(4, -1).replace(/['"]/g, '');
                if (url.includes('-latin-')) {
                  preloadFonts.push(url);
                }
              }
            }

            return `<style>${cssAsset.source}</style>`;
          }
          return match;
        },
      );

      // Preload latin font subsets for faster initial load
      if (preloadFonts.length) {
        const links = preloadFonts
          .map(
            (url) =>
              `<link rel="preload" as="font" type="font/woff2" crossorigin href="${url}">`,
          )
          .join('\n    ');
        html = html.replace('</head>', `    ${links}\n  </head>`);
      }

      for (const key of Object.keys(bundle)) {
        if (toRemove.has(key)) {
          delete bundle[key];
        }
      }

      htmlEntry.source = html;
    },
  };
}

export default defineConfig({
  plugins: [react(), inlineCriticalCss()],
  base: '/opl-themes/',

});
