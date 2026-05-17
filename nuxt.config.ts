// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@sidebase/nuxt-auth',
    'shadcn-nuxt',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    '@vite-pwa/nuxt'
  ],
  runtimeConfig: {
    baseURL: '/api/auth'
  },
  css: ['~/assets/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  auth: {
    isEnabled: true,
    globalAppMiddleware: true,
    originEnvKey: 'AUTH_ORIGIN'
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  googleFonts: {
    families: {
      'Playfair Display': [400, 700],
      Lato: [400, 700]
    },
    display: 'swap'
  },
  app: {
    head: {
      title: 'Recettes à gogo',
      meta: [{ name: 'description', content: 'Mon app de recettes de cuisine' }]
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    manifest: {
      name: 'Recettes à gogo',
      short_name: 'RecettesAGogo',
      description: 'Mon app de recettes de cuisine',
      theme_color: '#f7f0ea',
      background_color: '#f7f0ea',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/'
    }
  }
})
