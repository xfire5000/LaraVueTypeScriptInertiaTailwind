import Vue, { VNode } from 'vue'
import { IVueI18n } from 'vue-i18n'

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
