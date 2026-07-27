// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE || 'https://www.psb.smpitdarussalam.web.id',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  security: {
    checkOrigin: false
  },
  integrations: [react()],
  vite: {
    // @ts-ignore - Mengabaikan perbedaan definisi tipe Vite antara @tailwindcss/vite dan Astro
    plugins: [tailwindcss()],
  }
});