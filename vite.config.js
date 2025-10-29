import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  
  server: {
    proxy: {
      '/api': {
        // === YEH CHANGE HUA HAI ===
        // Port 3000 se 5000 kar diya
        target: 'http://localhost:5000', 
        changeOrigin: true,
      }
    }
  }
})