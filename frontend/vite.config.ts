import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'favicon.jpg',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
        'site.webmanifest',
        'analogy.json',
        'wordsmart1.json',
        'wordsmart2.json',
      ],
      manifest: false,
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff,woff2,ttf,otf,json,webmanifest}',
        ],
        globIgnores: [
          '**/node_modules/**/*',
          '**/*.map',
          'sw.js',
          'workbox-*.js',
          'manifest.webmanifest',
        ],
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^\/$/],
        navigateFallbackDenylist: [
          /^\/api\//,
          /^\/admin/,
          /^\/_/,
          /\.[^/]+$/,
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        runtimeCaching: [
          // Data files — CacheFirst forever
          {
            urlPattern: /\/wordsmart[12]\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'vocabulary-data-v2',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\/analogy\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'analogy-data-v2',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-css',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Navigation — NetworkFirst with offline fallback
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
    build: {
    target: 'es2018',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'query-vendor': ['@tanstack/react-query', 'axios'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})