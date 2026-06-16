import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Bundle size analyzer — run `npm run build` then open dist/stats.html
    // Only active during production build to avoid dev server overhead
    visualizer({
      filename:  'dist/stats.html',
      open:      false,
      gzipSize:  true,
      brotliSize: true,
    }),
  ],

  // =============================================================================
  // SECTION: Vitest configuration
  // =============================================================================
  test: {
    environment: 'jsdom',
    globals:     true,
    setupFiles:  ['./src/test/setup.js'],
    plugins:     [react()],
    // Exclude Playwright e2e tests from Vitest
    exclude:     ['**/node_modules/**', '**/e2e/**', '**/*.spec.js'],
    coverage: {
      provider:   'v8',
      reporter:   ['text', 'html'],
      include:    ['src/**/*.{js,jsx}'],
      exclude:    ['src/test/**', 'src/main.jsx'],
    },
  },
})
