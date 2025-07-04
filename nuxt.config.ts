// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@sidebase/nuxt-auth'],
  runtimeConfig: {
    baseURL: '/api/auth'
  },
  css: ['~/assets/main.css'],
    vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  auth: {
    isEnabled: true,
    globalAppMiddleware: true,
    originEnvKey: 'AUTH_ORIGIN',
  },
})