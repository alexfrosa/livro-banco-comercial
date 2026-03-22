import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://alexfrosa.github.io',
  base: '/livro-banco-comercial',
  integrations: [
    mdx(),
    preact({ compat: true }),
  ],
  vite: {
    build: {
      rollupOptions: {
        external: (id) => /\.test\.(ts|tsx)$/.test(id),
      },
    },
  },
});
