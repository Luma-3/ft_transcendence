import { defineConfig, FSWatcher } from 'vite'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: {
      key: fs.readFileSync('cert/key.dev.pem'),
      cert: fs.readFileSync('cert/cert.dev.pem'),
    },

    proxy: {
      '/api': {
        target: 'https://gateway:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true,
        secure: false,
      },
      '/doc': {
        target: 'https://gateway:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/doc/, '/doc'),
        secure: false,
      },
    }

  }
})

