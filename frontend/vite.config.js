import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// All three portals proxy /api to the backend on port 5000.
// This means the browser never makes a cross-origin request —
// CORS is completely bypassed.
const proxy = {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    secure: false,
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,        // overridden by --port flag in npm scripts
    strictPort: false,
    proxy,
  },
  preview: {
    port: 5173,
    proxy,
  }
})
