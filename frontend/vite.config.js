import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // =============================================================================
  // SECTION: Vitest configuration
  // =============================================================================
  test: {
    environment: 'jsdom',
    globals:     true,
    setupFiles:  ['./src/test/setup.js'],
    // Pass the React plugin so JSX transform works in test environment
    plugins:     [react()],
    coverage: {
      provider:   'v8',
      reporter:   ['text', 'html'],
      include:    ['src/**/*.{js,jsx}'],
      exclude:    ['src/test/**', 'src/main.jsx'],
    },
  },
})
