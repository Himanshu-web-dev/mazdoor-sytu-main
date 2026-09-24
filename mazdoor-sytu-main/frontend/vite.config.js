import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable CSS code splitting per route
    cssCodeSplit: true,
    // Increase warning limit slightly since firebase is inherently large
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunking: separate firebase + vendor to avoid polluting app chunks
        manualChunks(id) {
          // Firebase goes into a standalone async chunk (only loaded when auth is needed)
          if (id.includes('node_modules/firebase')) {
            return 'firebase'
          }
          // React core into vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
        },
      },
    },
    // Default Rolldown minification
  },
})
