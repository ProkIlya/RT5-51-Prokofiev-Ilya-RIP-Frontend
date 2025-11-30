import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['/*.{js,css,html,ico,png,svg,jpg,woff,woff2}']
      },
      manifest: {
        name: "Tesla Charge Calculator",
        short_name: "Tesla Charge Calc",
        start_url: "/RT5-51-Prokofiev-Ilya-Tesla-Charge-Calculator-Frontend/", //"/RT5-51-Prokofiev-Ilya-RIP-Frontend/"
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#3E6AE1",
        orientation: "portrait-primary",
        icons: [
          {
            src: "icon.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "default-scenario.jpg",
            type: "image/jpeg",
            sizes: "512x512"
          }
        ],
      }
    })
  ],
  base: "/RT5-51-Prokofiev-Ilya-Tesla-Charge-Calculator-Frontend/", // "/RT5-51-Prokofiev-Ilya-RIP-Frontend/"  RT5-51-Prokofiev-Ilya-Tesla-Charge-Calculator-Frontend
  server: {
    //https: true,
    host: '0.0.0.0', // 0.0.0.0
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    port: 3000,
    proxy: {
      "/api": {
        target: "https://192.168.56.1:8080",
        changeOrigin: true,
        secure: false,
      },
      "/img-proxy": {
        target: "http://192.168.56.1:9000", // MinIO пока оставляем по IP
        changeOrigin: true,
        secure: false,
      }
    },
    watch: {
      ignored: ["/src-tauri/**"]
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
});