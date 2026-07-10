// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  build: {
    assets: '_astro',
    assetsPrefix: './',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
