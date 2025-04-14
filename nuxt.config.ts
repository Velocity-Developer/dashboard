import Aura from '@primeuix/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,  
  sanctum: {
    mode: 'cookie',
    baseUrl: process.env.API_URL,
    redirectIfAuthenticated: true,
    redirectIfUnauthenticated: true,
    redirect: {
      keepRequestedRoute: true,
      onAuthOnly: '/login',
      onGuestOnly: '/',
      onLogout: '/login'
    },
    globalMiddleware: {
      enabled: true,
      allow404WithoutAuth: true,
    },
    logLevel: 1,
  },
  primevue: {
    autoImport: true,
    options: {
        theme: {
            preset: Aura,
            options: {
              darkModeSelector: '.dark',
            }
        }
    }
  }, 
  tailwindcss: {   
    config: { 
      darkMode: 'class',
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-auth-sanctum',
    '@primevue/nuxt-module',
    '@nuxt/icon',
    '@pinia/nuxt',
    'dayjs-nuxt',
    '@nuxt/fonts'
  ]
})