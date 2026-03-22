import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://alexfrosa.github.io',
  base: '/livro-banco-comercial',
  integrations: [
    mdx(),
    preact({ compat: true }),
    sitemap(),
  ],
  vite: {
    build: {
      rollupOptions: {
        external: (id) => /\.test\.(ts|tsx)$/.test(id),
      },
    },
  },
});
