import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
const MyPreset = definePreset(Aura, {
  semantic: {
      primary: {
          50: '{teal.50}',
          100: '{teal.100}',
          200: '{teal.200}',
          300: '{teal.300}',
          400: '{teal.400}',
          500: '{teal.500}',
          600: '{teal.600}',
          700: '{teal.700}',
          800: '{teal.800}',
          900: '{teal.900}',
          950: '{teal.950}'
      }
  }
});

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
            preset: MyPreset,
            options: {
              darkModeSelector: '.dark',
            }
        }
    }
  }, 
  tailwindcss: {   
    config: { 
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: 'theme(colors.teal.500)',
              50: 'theme(colors.teal.50)',
              100: 'theme(colors.teal.100)',
              200: 'theme(colors.teal.200)',
              300: 'theme(colors.teal.300)',
              400: 'theme(colors.teal.400)',
              500: 'theme(colors.teal.500)',
              600: 'theme(colors.teal.600)',
              700: 'theme(colors.teal.700)',
              800: 'theme(colors.teal.800)',
              900: 'theme(colors.teal.900)',
            },
            secondary: {
              DEFAULT: 'theme(colors.blue.500)',
              50: 'theme(colors.blue.50)',
              100: 'theme(colors.blue.100)',
              200: 'theme(colors.blue.200)',
              300: 'theme(colors.blue.300)',
              400: 'theme(colors.blue.400)',
              500: 'theme(colors.blue.500)',
              600: 'theme(colors.blue.600)',
              700: 'theme(colors.blue.700)',
              800: 'theme(colors.blue.800)',
              900: 'theme(colors.blue.900)',
            },
          },
        },
      },
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