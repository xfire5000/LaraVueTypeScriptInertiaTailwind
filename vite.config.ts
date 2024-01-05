import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { transformShortVmodel } from '@vue-macros/short-vmodel'
import type { Options } from '@vuetify/loader-shared/dist'
import laravel from 'laravel-vite-plugin'
import AutoImport from 'unplugin-auto-import/vite'
import { Vuetify3Resolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import vueMacros from 'unplugin-vue-macros/vite'
import { defineConfig, loadEnv } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'
import Inspect from 'vite-plugin-inspect'
import { VitePWA } from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import webfontDownload from 'vite-plugin-webfont-dl'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    build: {
      minify: true,
      manifest: 'manifest.json',
    },
    plugins: [
      laravel({
        input: 'resources/js/app.ts',
        ssr: 'resources/js/ssr.ts',
        refresh: true,
      }),
      vueMacros({
        defineModels: {
          unified: false,
        },
        shortBind: true,
        shortVmodel: true,
        plugins: {
          vue: vue({
            include: [/\.vue$/],
            // ziggy router problem
            //* reactivityTransform: true,
            template: {
              transformAssetUrls,
              compilerOptions: {
                nodeTransforms: [
                  transformShortVmodel({
                    prefix: '::',
                  }) as any,
                ],
              },
            },
          }),
          vueJsx: vueJsx(),
        },
      }),
      VueDevTools(),
      vuetify({ autoImport: true } as Options),
      Inspect({
        enabled: true,
      }),
      Components({
        dts: './resources/js/Types/components.d.ts',
        dirs: ['resources/js/Components', 'resources/js/Layouts'],
        deep: true,
        include: [
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        resolvers: [Vuetify3Resolver()],
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // match .ts, .tsx, .js, .jsx
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
        ],
        imports: ['vue', 'vue-i18n', '@vueuse/core', 'vue/macros'],
        dirs: [
          './resources/js/Stores',
          './resources/js/Apis',
          './resources/js/Composables',
          './resources/js/Core',
        ],
        dts: './resources/js/Types/auto-imports.d.ts',
        vueTemplate: true,
      }),
      DefineOptions(),
      VitePWA({
        base: '/',
        outDir: 'public',
        srcDir: 'public',
        manifestFilename: '../manifest.webmanifest',
        includeAssets: ['/assets/img/logo.png', 'favicon.ico', 'robots.txt'],
        injectRegister: 'inline',
        manifest: {
          start_url: './',
          scope: '.',
          name: process.env.VITE_APP_NAME,
          lang: 'fa',
          display: 'standalone',
          background_color: '#333',
          theme_color: process.env.VITE_THEME_COLOR_APP,
          orientation: 'portrait',
          short_name: `${process.env.VITE_APP_NAME}`.replace(' ', '-'),
          description: '',
          icons: [
            {
              src: '/assets/img/icons/pwa/homescreen48.png',
              sizes: '48x48',
              type: 'image/png',
            },
            {
              src: '/assets/img/icons/pwa/homescreen72.png',
              sizes: '72x72',
              type: 'image/png',
            },
            {
              src: '/assets/img/icons/pwa/homescreen96.png',
              sizes: '96x96',
              type: 'image/png',
            },
            {
              src: '/assets/img/icons/pwa/homescreen144.png',
              sizes: '144x144',
              type: 'image/png',
            },
            {
              src: '/assets/img/icons/pwa/homescreen168.png',
              sizes: '168x168',
              type: 'image/png',
            },
            {
              src: '/assets/img/icons/pwa/homescreen192.png',
              sizes: '192x192',
              type: 'image/png',
            },
          ],
        },
      }),
      webfontDownload(
        [
          // 'https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap',
          'https://db.onlinewebfonts.com/c/bd84acf61e0af29bab6db956e6182bf0?family=IRANSansWeb%28FaNum%29+Medium',
          'https://db.onlinewebfonts.com/c/bd84acf61e0af29bab6db956e6182bf0?family=IRANSansWeb%28FaNum%29+Normal',
          'https://db.onlinewebfonts.com/c/bd84acf61e0af29bab6db956e6182bf0?family=IRANSansWeb%28FaNum%29+Normal+Bold',
        ],
        { injectAsStyleTag: false },
      ),
      eslintPlugin(),
    ],
    resolve: {
      alias: [
        {
          find: '@Components',
          replacement: '/resources/js/Components',
        },
        {
          find: '@Layouts',
          replacement: '/resources/js/Layouts',
        },
        {
          find: '@Stores',
          replacement: '/resources/js/Stores',
        },
        {
          find: '@Composables',
          replacement: '/resources/js/Composables',
        },
        {
          find: '@Apis',
          replacement: '/resources/js/Apis',
        },
      ],
      mainFields: ['browser', 'module', 'main', 'jsnext:main', 'jsnext'],
    },
    ssr: {
      noExternal: [
        'vuetify',
        'laravel-vite-plugin',
        '@inertiajs/vue3/server',
        /vue-i18n/,
      ],
      external: ['lodash'],
    },
    optimizeDeps: {
      include: ['vue-countup-v3'],
    },
  })
}
