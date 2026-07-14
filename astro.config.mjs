// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  build: {
    assets: '_astro',
  },

  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },

  adapter: node({
    mode: 'standalone',
  }),
});