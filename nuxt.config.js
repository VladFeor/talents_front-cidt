// https://nuxt.com/docs/api/configuration/nuxt-config
require('dotenv').config();
import { splitVendorChunkPlugin } from 'vite';

// @ts-ignore
export default defineNuxtConfig({
  loading: false,
  modules: ['@pinia/nuxt', '@nuxt/ui'],
  ssr: false,
  loadingIndicator: {
    loading: false,
  },
  router: {
    middleware: ['layout'],
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
  layouts: {
    // Specify the default layout for all pages
    default: '~/layouts/default.vue',
    loading: '~/layouts/_loading.vue',
    spaLoadingTemplate: '~/layouts/_loading.vue',
  },
  runtimeConfig: {
    // The private keys which are only available within server-side
    // Keys within public, will be also exposed to the client-side
    public: {
      gtagId: 'GTM-5PKW9LWC',
      pusherKey: '18f7028f674aef56fa35',
      pusherCluster: 'eu',
      base: 'http://54.227.53.151/back/',
      apiBase: 'http://54.227.53.151/back/api/',
      apiBaseV2: 'http://54.227.53.151/back/api/v2/',
      apiLink: 'http://3.80.105.149:3000/',
      apiChain: 'https://api.talentum.id/'
      // apiBase: 'https://app.talentum.id/api/',
      // apiBaseV2: 'https://app.talentum.id/api/v2/',
      // apiLink: 'https://app.talentum.id/',
      // apiBase: 'http://localhost:8000/api/',
      // apiBaseV2: 'http://localhost:8000/api/v2/',
    },
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  components: {
    path: '~/components',
    extensions: ['.vue'],
    pathPrefix: false,
    global: true,
  },
  vite: {
    css: {
      minify: true,
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/main.scss";',
        },
      },
    },
    plugins: [splitVendorChunkPlugin()],
    build: {
      cacheDir: '.vitecache',
    },
  },
  publicRuntimeConfig: {
    apiURL: process.env.NUXT_API || '',
  },
  buildModules: [
    // Simple usage
    '@nuxtjs/dotenv',
  ],
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  plugins: [{ src: './alert.plugin' }],
});
