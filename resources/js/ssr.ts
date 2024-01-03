// @ts-ignore
import { ZiggyVue } from '../../vendor/tightenco/ziggy/dist/vue.m'
import App from './App.vue'
import i18n from './Plugins/i18n'
import vuetify from './Plugins/vuetify.js'
import { createInertiaApp, Head, Link } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import { renderToString } from '@vue/server-renderer'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createSSRApp, h } from 'vue'
import type { DefineComponent } from 'vue'

const appName = import.meta.env.VITE_APP_NAME

createServer((page) =>
  createInertiaApp({
    page,
    render: renderToString,
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
      const page = resolvePageComponent(
        `./Pages/${name}.vue`,
        import.meta.glob<DefineComponent>('./Pages/**/*.vue'),
      )
      page.then((module) => {
        module.default.layout = module.default.layout || App
      })
      return page
    },
    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h(App, props) })
        .use(plugin)
        .use(ZiggyVue, {
          // @ts-ignore
          ...page.props.ziggy,
          location: new URL(page.props.ziggy['location']),
        })
        .component('Link', Link)
        .component('p-head', Head)
        .use(i18n)
        .use(vuetify)
    },
  }),
)
