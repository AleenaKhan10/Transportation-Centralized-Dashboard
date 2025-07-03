import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@services': path.resolve(__dirname, './src/services'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/trailers': {
        target: 'https://get-trailers-and-trips-181509438418.us-central1.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trailers/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('X-API-Key', '0bcf49a90e765ca3d7ea8ba1ae25373142e374c556919aa3e5c41adf8b2ff220');
          });
        }
      },
      '/api/trip-data': {
        target: 'https://get-trip-data-181509438418.us-central1.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trip-data/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('X-API-Key', '0bcf49a90e765ca3d7ea8ba1ae25373142e374c556919aa3e5c41adf8b2ff220');
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}) 