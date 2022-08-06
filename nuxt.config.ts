import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'AuroraNFT',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      meta: [
        { hid: 'title', name: 'title', content: 'AuroraNFT' },
        { hid: 'description', name: 'description', content: 'description' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      style: [
        { children: 'html { height: 100% }', type: 'text/css' }
      ]
    },
  },
  meta: {
    link: [
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css'
        // href: '/assets/bootstrap-5.2.0-dist/css/bootstrap.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css'
      }
    ],
    script: [
      {
        src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js'
        // src: '/assets/bootstrap-5.2.0-dist/js/bootstrap.bundle.min.js'
      }
    ]
  },
  modules: [
    // '~/assets/bootstrap-5.2.0-dist/js/bootstrap.bundle.min.js',
    '@instadapp/vue-web3/nuxt'
  ],

  web3 :{
    autoImport: false,
  }

})
