import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['esm'],
  minify: 'terser',
  sourcemap: true,
  splitting: true,
  treeshake: 'smallest',
  entry: ['src/index.ts'],
});
