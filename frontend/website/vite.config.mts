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
    servers: {
      proxy: {
        '/api': {
          target: 'https://',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
  }
})

//Sayf-allah gabsi 
