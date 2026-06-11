import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// =============================================================================
// Vite Configuration
// Adds React plugin for JSX/HMR and Tailwind CSS via the official Vite plugin
// =============================================================================
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
