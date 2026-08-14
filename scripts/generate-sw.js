const { generateSW } = require('workbox-build')
const path = require('path')

async function buildSW() {
  // Note: run after Vite build so 'dist' exists
  const distDir = path.join(process.cwd(), 'dist')
  try {
    const { count, size, warnings } = await generateSW({
      globDirectory: distDir,
      globPatterns: ['**/*.{html,js,css,png,svg,json}'],
      swDest: path.join(distDir, 'sw.js'),
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: '/offline.html',
      navigateFallbackWhitelist: [/^\/.*$/],
      runtimeCaching: [
        {
          urlPattern: /\/api\/.*$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 3,
            expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: { cacheName: 'image-cache', expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 } }
        }
      ]
    })

    if (warnings && warnings.length) console.warn('Workbox warnings', warnings)
    console.log(`Generated sw.js, which will precache ${count} files, totaling ${size} bytes.`)
  } catch (err) {
    console.error('Failed to generate service worker', err)
    process.exit(1)
  }
}

buildSW()
