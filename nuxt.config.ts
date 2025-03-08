// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';
export default defineNuxtConfig({
  components: true,
  ssr: true,
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@nuxtjs/i18n',
    '@nuxt/image'
  ],
  plugins: [
    // jQuery plugin
    {src: '@/plugins/jquery.js', mode: 'client'},
    {src: '@/plugins/vue-toastify.client.ts', mode: 'client'},
  ],
  image: {
    dir: 'public', // مشخص کردن مسیر تصاویر در پوشه `public`
  },
  primevue: {
    locale: {
      rtl: true // فعال‌سازی حالت راست‌به‌چپ
    },
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'light',
        },
      }
    }
  },

  runtimeConfig: {
    public: {
      BACK_END_URL: process.env.BACK_END_URL,
      TABLES_PER_PAGE: process.env.TABLES_PER_PAGE
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      meta: [
        // <meta name="viewport" content="width=device-width, initial-scale=1">
        {name: 'viewport', content: 'width=device-width, initial-scale=1'}
      ],
      script: [
        { src: '/js/jquery.min.js' },
        { src: '/js/persian-date.min.js' },
        { src: '/js/persian-datepicker.min.js' },
        { src: '/js/jquery.mask.min.js' }
      ],
      link: [
        {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;700&display=swap'},
        { rel: 'stylesheet', href: '/css/persian-datepicker.min.css' }
      ],
      style: [],
      noscript: []
    },
    pageTransition: { name: 'page', mode: 'default' }
  },
  experimental: {
    sharedPrerenderData: true,
    buildCache: true,
    defaults: {
      nuxtLink: {
        prefetch: true,
        prefetchOn: { visibility: false },
      },
    },
  },
  i18n: {
    globalInjection: true,
    detectBrowserLanguage:false,
    lazy: true,
    locales: [
      { code: 'fa-FA', file: 'fa-FA.json', name: 'Persian 🇺🇸' },
      { code: 'en_US', file: 'en-US.json', name: 'English 🇺🇸' },
      { code: 'de_DE', file: 'de-DE.json', name: 'Deutsch 🇩🇪' },
      { code: 'es_ES', file: 'es-ES.json', name: 'Español 🇪🇸' },
      { code: 'fr_FR', file: 'fr-FR.json', name: 'Français 🇫🇷' },
      { code: 'it_IT', file: 'it-IT.json', name: 'Italiano 🇮🇹' },
      { code: 'pt_BR', file: 'pt-BR.json', name: 'Português 🇧🇷' },
    ],
    langDir: 'locales',
    defaultLocale: 'fa-FA',
    strategy: 'no_prefix',
  },
  compatibilityDate: '2024-09-27'
})