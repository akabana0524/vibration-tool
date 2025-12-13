import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://akabana0524.github.io/vibration-tool/',
  plugins: [vue()],
});
