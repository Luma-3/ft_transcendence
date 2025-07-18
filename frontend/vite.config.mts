import { defineConfig } from 'vite'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    ...(isDev && {
      https: {
        key: fs.readFileSync('/etc/certs/www.transcenduck.fr.key'),
        cert: fs.readFileSync('/etc/certs/www.transcenduck.fr.crt'),
      }
    }),

    proxy: {
      '/api': {
        target: 'https://gateway:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true,
        secure: false,
      }
    }
  }
})

