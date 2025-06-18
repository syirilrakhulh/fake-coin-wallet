import tailwindCssPlugin from '@tailwindcss/vite';
import vuePlugin from '@vitejs/plugin-vue';
import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vueDevToolsPlugin from 'vite-plugin-vue-devtools';
import vueSvgPlugin from 'vite-svg-loader';

export default defineConfig({
  plugins: [
    vuePlugin(),
    vueDevToolsPlugin(),
    tailwindCssPlugin(),
    vueSvgPlugin({
      defaultImport: 'component',
    }),
  ],
  resolve: {
    alias: {
      '@fake-coin/client': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3001,
  },
});
