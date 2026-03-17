import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Serve both 'public' and 'images' as static directories
  publicDir: 'images',
})
