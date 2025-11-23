import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';
import fs from 'fs'
import path from 'path'
import { BASE_PATH} from './src/utils/target_config';

export default defineConfig({
  base: BASE_PATH,
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
        start_url: "*/RT5-51-Prokofiev-Ilya-RIP-Frontend",
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
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    cors: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    proxy: {
      "/api": {
        target: "http://192.168.56.1:8080",
        changeOrigin: true,
        secure: false,
      },
      "/img-proxy": {
        target: "http://192.168.56.1:9000",
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


/*
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
        start_url: "./",
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
*/