import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: '/bitcoin-price-chart/',
  build: {
    outDir: 'build',
  },
  plugins: [react()]
})