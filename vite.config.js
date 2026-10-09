import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '172.18.0.1',
    port: 3057,
    proxy: {
      '/api': 'http://172.18.0.1:3057',
    },
  },
  preview: {
    host: '172.18.0.1',
    port: 3057,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.js',
    globals: true,
  },
})
