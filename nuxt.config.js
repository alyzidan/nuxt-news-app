const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons' }
    ]

  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#9ccc65', height: '10px' },

  /*
  ** Global CSS
  */
  css: [
    {
      src: 'vue-material/dist/vue-material.min.css',
      lang: 'css'
    },
    {
      src: '~/assets/theme.scss'
    }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/vue-material' },
    { src: '~/plugins/axios' },
    { src: '~/plugins/firestore' },

  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    credentials: true,
    proxy: true
  },
  proxy: {
    "/api/": {
      target: 'https://newsapi.org/v2/',
                  pathRewrite: { "^/api/": "" }
          },
          "/register/": {
                  target: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA9YZEMdoiV8_ay87ordsQo0jy1A0Vy2bw',
                  pathRewrite: { '^/register/':''}
          }
  },
  env: {
    NEWS_API_KEY: 'c5b2d4aec91f484b9e985ae218c1eb84',
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    },
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
      ]
    }
  }
}
