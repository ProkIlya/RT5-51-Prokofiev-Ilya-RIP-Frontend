import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Для Vite config используем прямые значения или импортируем из JS
const target_tauri = true;
const api_proxy_addr = "http://192.168.56.1:8080"
const img_proxy_addr = "http://192.168.56.1:9000"
const dest_root = target_tauri ? "" : ""

export default defineConfig({
  base: dest_root,
  plugins: [react()],
  server: {
    port: 3000,
    host: '192.168.56.1',
    strictPort: true,
    cors: true,
    proxy: {
      "/api": {
        target: api_proxy_addr,
        changeOrigin: true,
        secure: false,
        //rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      "/img-proxy": {
        target: img_proxy_addr,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/img-proxy/, '')
      }
    }
  },
  build: {
    target: 'esnext'
  }
})