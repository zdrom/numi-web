import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use repository name as base when building for GitHub Pages
// Use '/' for local development and other deployments
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/numi-web/' : '/',
})
