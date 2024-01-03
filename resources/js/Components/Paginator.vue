<script setup lang="ts">
  import { mdiChevronRight } from '@mdi/js'

  interface IProps {
    links?: TPageLinks[]
    total: number
    maxLength?: number
    currentPage?: number
    type?: 'link' | 'api'
  }

  withDefaults(defineProps<IProps>(), {
    maxLength: 5,
    type: 'link',
    links: () => [],
    currentPage: 1,
  })

  const emit = defineEmits(['page:click'])
</script>

<template lang="pug">
.flex
  Link(
    :class=`[
        'ltr:-scale-x-100',
        total === 1 ? 'inactive-arrow-link' : 'active-arrow-link',
      ]`,
    :disabled="total === 1",
    :href=`
        links.length > 1 ? links[currentPage - 1].url : links[currentPage].url
      `,
    as="button",
    data-instant,
    type="button",
    v-if="type.includes('link')"
  ).arrow-links
    v-icon {{ mdiChevronRight }}
  button(
    :class=`[
        'ltr:-scale-x-100',
        total === 1 ? 'inactive-arrow-link' : 'active-arrow-link',
      ]`,
    :disabled="total === 1",
    @click="emit('page:click', links.length > 1 ? parseInt(links[currentPage - 1].label) : parseInt(links[currentPage].label))",
    data-instant,
    v-else
  ).arrow-links
    v-icon {{ mdiChevronRight }}
  template(
    v-for="(item, index) in links?.slice(currentPage, links.length - 1)"
  )
    Link(
      :class="['hover:bg-sky-500 hover:text-white dark:text-gray-200 dark:hover:bg-sky-500 dark:hover:text-gray-200 sm:inline', item.label === currentPage.toString() ? 'dark:bg-sky-700 bg-gray-400' : 'dark:bg-dark-200 bg-white']",
      :href="item.url",
      as="button",
      data-instant,
      type="button",
      v-if="type.includes('link')"
    ).mx-1.hidden.transform.rounded-md.px-4.py-2.text-gray-700.transition-colors.duration-300 {{ item.label }}
    button(
      :class="['hover:bg-sky-500 hover:text-white dark:text-gray-200 dark:hover:bg-sky-500 dark:hover:text-gray-200 sm:inline', item.label === currentPage.toString() ? 'dark:bg-sky-700 bg-gray-400' : 'dark:bg-dark-200 bg-white']",
      @click="emit('page:click', parseInt(item.label))",
      data-instant,
      v-else
    ).mx-1.hidden.transform.rounded-md.px-4.py-2.text-gray-700.transition-colors.duration-300 {{ item.label }}
    a(
      class="sm:inline dark:bg-dark-200 dark:text-gray-200",
      v-if="Math.round(maxLength / 2) === index"
    ).mx-1.hidden.transform.rounded-md.bg-white.px-4.py-2.text-gray-700.transition-colors.duration-300 ...
  Link(
    :href="links.length - 1 > 1 ? links[currentPage + 1].url : links[currentPage].url",
    as="button",
    class="rtl:-scale-x-100",
    data-instant,
    type="button",
    v-if="type.includes('link')"
  ).active-arrow-link.arrow-links
    v-icon {{ mdiChevronRight }}
  button(
    @click="emit('page:click', links.length - 1 > 1 ? parseInt(links[currentPage + 1].label) : parseInt(links[currentPage].label))",
    class="rtl:-scale-x-100",
    data-instant,
    v-else
  ).active-arrow-link.arrow-links
    v-icon {{ mdiChevronRight }}
</template>

<style scoped>
  .arrow-links {
    @apply mx-1 flex items-center justify-center rounded-md bg-white px-4 py-2 dark:bg-dark-200;
  }
  .active-arrow-link {
    @apply transform text-gray-700 transition-colors duration-300 hover:bg-sky-500 hover:text-white dark:text-gray-200 dark:hover:bg-sky-500 dark:hover:text-gray-200;
  }
  .inactive-arrow-link {
    @apply cursor-not-allowed capitalize text-gray-500 dark:text-gray-600;
  }
</style>
