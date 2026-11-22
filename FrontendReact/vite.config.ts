import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@NM': fileURLToPath(new URL('./node_modules', import.meta.url)),
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100
    }
  }
})