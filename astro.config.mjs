import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.URL || 'https://azedinbarber.com',
  integrations: [tailwind(), sitemap()],
  // ~32 KB of CSS (≈7 KB gzipped) goes into the HTML: no render-blocking
  // stylesheet requests before first paint on slow phones.
  build: { inlineStylesheets: 'always' },
  server: {
    host: '0.0.0.0',
  },
});
