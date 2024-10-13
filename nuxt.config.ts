// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'gestion-comptes',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    }
  },
  modules: [
    '@pinia/nuxt', 
    '@primevue/nuxt-module', 
    '@nuxtjs/google-fonts',
    
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
  googleFonts: {
    families: {
      Montserrat: true,
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  css: [
    '/node_modules/primeflex/primeflex.css',
  ],
  plugins: [
    //require('tailwindcss-primeui')
  ],
})