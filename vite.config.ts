import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import compression from 'vite-plugin-compression'
import compressionBrotli from 'vite-plugin-compression'

const RADIX_PACKAGES = [
  '@radix-ui/react-accordion',
  '@radix-ui/react-alert-dialog',
  '@radix-ui/react-aspect-ratio',
  '@radix-ui/react-avatar',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-collapsible',
  '@radix-ui/react-context-menu',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-hover-card',
  '@radix-ui/react-label',
  '@radix-ui/react-menubar',
  '@radix-ui/react-navigation-menu',
  '@radix-ui/react-popover',
  '@radix-ui/react-progress',
  '@radix-ui/react-radio-group',
  '@radix-ui/react-scroll-area',
  '@radix-ui/react-select',
  '@radix-ui/react-separator',
  '@radix-ui/react-slider',
  '@radix-ui/react-slot',
  '@radix-ui/react-switch',
  '@radix-ui/react-tabs',
  '@radix-ui/react-toggle',
  '@radix-ui/react-toggle-group',
  '@radix-ui/react-tooltip',
] as const

const UI_VENDOR = [
  'cmdk',
  'embla-carousel-react',
  'input-otp',
  'lucide-react',
  'next-themes',
  'react-day-picker',
  'react-resizable-panels',
  'sonner',
  'vaul',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
] as const

function previewCacheHeaders(): Plugin {
  return {
    name: 'preview-cache-headers',
    apply: 'serve',
    configurePreviewServer(server) {
      server.middlewares.use((_req, res, next) => {
        const url = _req.url || ''
        if (url.startsWith('/assets/')) {
          res.setHeader(
            'Cache-Control',
            'public, max-age=31536000, immutable',
          )
        } else if (
          url === '/' ||
          url.endsWith('/index.html') ||
          (!url.startsWith('/assets/') && !url.includes('.'))
        ) {
          res.setHeader('Cache-Control', 'no-cache')
        }
        next()
      })
    },
  }
}

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/Absolute-Consultancy/' : '/',
  plugins: [
    inspectAttr(),
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
    }),
    compressionBrotli({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),
    previewCacheHeaders(),
  ],
  server: {
    port: 3000,
    cors: true,
    hmr: {
      overlay: true,
    },
  },
  preview: {
    port: 3000,
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    cssMinify: true,
    minify: 'esbuild',
    sourcemap: false,
    reportCompressedSize: false,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 800,
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, _importer, _options) => {
        const deps = new Set<string>()
        if (filename.includes('react-vendor') ||
            filename.includes('mobile-critical')) {
          deps.add('/Absolute-Consultancy/' + filename)
        }
        return Array.from(deps)
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id: string): string | undefined {
          if (!id.includes('node_modules')) {
            if (id.includes('/src/data/')) {
              return 'data-vendor'
            }
            if (id.includes('/src/components/ui/')) {
              return 'ui-internal'
            }
            return undefined
          }

          if (
            id.includes('react-router') ||
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor'
          }

          if (id.includes('gsap/ScrollTrigger')) {
            return 'animation-vendor'
          }
          if (id.includes('gsap')) {
            return 'animation-vendor'
          }

          if (id.includes('lenis')) {
            return 'lenis-vendor'
          }

          for (const pkg of RADIX_PACKAGES) {
            if (id.includes(`/node_modules/${pkg}/`)) {
              return 'radix-vendor'
            }
          }

          if (id.includes('recharts') || id.includes('d3-')) {
            return 'charts-vendor'
          }

          if (
            id.includes('react-hook-form') ||
            id.includes('/zod/') ||
            id.includes('/zod/lib/')
          ) {
            return 'forms-vendor'
          }

          for (const pkg of UI_VENDOR) {
            if (id.includes(`/node_modules/${pkg}/`)) {
              return 'ui-vendor'
            }
          }

          if (
            id.includes('@google/generative-ai') ||
            id.includes('imagesloaded')
          ) {
            return 'mobile-critical'
          }

          return undefined
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
}))
