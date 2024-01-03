import en from '../Langs/en.json'
import fa from '../Langs/fa.json'
import _ from 'lodash'
import type { I18nOptions } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import { en as vuetifyEn, fa as vuetifyFa } from 'vuetify/locale'

const FaMessages = _.merge(fa, { $vuetify: vuetifyFa })
FaMessages.$vuetify.datePicker['ok'] = 'تأیید'
const EnMessages = _.merge(en, { $vuetify: vuetifyEn })

export default createI18n({
  globalInjection: true,
  legacy: false,
  locale: 'fa',
  messages: { fa: FaMessages, en: EnMessages },
  fallbackLocale: 'fa',
  datetimeFormats: {
    fa: {
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      },
      year: {
        year: 'numeric',
      },
      shortMonth: {
        month: 'numeric',
      },
    },
  },
  numberFormats: {
    fa: {
      currency: {
        style: 'currency',
        currency: 'تومان',
        currencyDisplay: 'name',
      },
    },
  },
} as I18nOptions)
