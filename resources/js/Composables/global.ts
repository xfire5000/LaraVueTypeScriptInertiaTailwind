import i18n from '../Plugins/i18n'
import type {
  UseTimeAgoMessages,
  UseTimeAgoUnitNamesDefault,
} from '@vueuse/core'

const { t } = i18n.global

export function useObjectResolve(path: string, obj?: any) {
  return path.split('.').reduce(function (prev, curr) {
    return prev ? prev[curr] : null
  }, obj || self)
}

export function useConvertFileSize(bytes: number, decimals: number = 0) {
  if (bytes == 0) return '0 Bytes'
  let k = 1000,
    dm = decimals + 1 || 3,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function useLocaleTimeAgo(date: Date) {
  const I18N_MESSAGES: UseTimeAgoMessages<UseTimeAgoUnitNamesDefault> = {
    justNow: t('timeAgo.just-now'),
    past: (n) => (n.match(/\d/) ? t('timeAgo.ago', [n]) : n),
    future: (n) => (n.match(/\d/) ? t('timeAgo.in', [n]) : n),
    month: (n, past) =>
      n === 1
        ? past
          ? t('timeAgo.last-month')
          : t('timeAgo.next-month')
        : `${n} ${t('timeAgo.month', n.toString())}`,
    year: (n, past) =>
      n === 1
        ? past
          ? t('timeAgo.last-year')
          : t('timeAgo.next-year')
        : `${n} ${t('timeAgo.year', n.toString())}`,
    day: (n, past) =>
      n === 1
        ? past
          ? t('timeAgo.yesterday')
          : t('timeAgo.tomorrow')
        : `${n} ${t('timeAgo.day', n.toString())}`,
    week: (n, past) =>
      n === 1
        ? past
          ? t('timeAgo.last-week')
          : t('timeAgo.next-week')
        : `${n} ${t('timeAgo.week', n.toString())}`,
    hour: (n) => `${n} ${t('timeAgo.hour', n.toString())}`,
    minute: (n) => `${n} ${t('timeAgo.minute', n.toString())}`,
    second: (n) => `${n} ${t('timeAgo.second', n.toString())}`,
    invalid: '',
  }

  return useTimeAgo(date, {
    fullDateFormatter: (date: Date) => date.toLocaleDateString(),
    messages: I18N_MESSAGES,
  })
}

export const useCsrf = document.head.querySelector('meta[name="csrf-token"]')
  ?.content

export const useDate = (
  date: Date = new Date(),
  type: 'date' | 'time' | 'datetime' = 'date',
) => {
  let dateSeparator = `${date.getFullYear()}-${
    date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
  }-${date.getDay() < 10 ? `0${date.getDay()}` : date.getDay()}`
  let timeSeparator = `${date.getHours()}:${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}`

  switch (type) {
    case 'date':
      return dateSeparator
    case 'time':
      return timeSeparator
    default:
      return `${dateSeparator} ${timeSeparator}`
  }
}

export const addDays = (date: Date = new Date(), days: number = 1) =>
  date.setDate(date.getDate() + days)

export const eventDay = computed<{ title: string; event: string }>(() => {
  let currentTime = useNow()
  let hrs: number = currentTime.value.getHours()

  switch (true) {
    default:
      return { title: t('dayEvents.good-morning'), event: 'morning' }
    case hrs >= 10 && hrs < 12:
      return { title: t('dayEvents.good-time'), event: 'morning' }
    case hrs >= 12 && hrs < 15:
      return { title: t('dayEvents.good-lunch'), event: 'afternoon' }
    case hrs >= 15 && hrs < 19:
      return { title: t('dayEvents.good-evening'), event: 'evening' }
    case hrs >= 19:
      return { title: t('dayEvents.good-night'), event: 'night' }
  }
})

export const useJsonParser = (data: string | any): any =>
  _.isString(data) ? JSON.parse(data) : data
