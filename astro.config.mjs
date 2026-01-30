import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://anuskazw.github.io',
  base: '/copa-badminton-2526',
  output: 'hybrid',
  adapter: node({
    mode: 'standalone'
  })
});
