<script setup lang="ts">
  import { usePage } from '@inertiajs/vue3'
  import route from 'ziggy-js'

  const props = defineProps<{ status: number }>()

  const { t } = useI18n()

  const title = computed(() => {
    return {
      503: t('exceptions.Service-Unavailable'),
      500: t('exceptions.Server-Error'),
      404: t('exceptions.Page-Not-Found'),
      403: t('exceptions.Forbidden'),
    }[props.status]
  })

  const description = computed(() => {
    return {
      503: t('exceptions.Service-Unavailable-Hint'),
      500: t('exceptions.Server-Error-Hint'),
      404: t('exceptions.Page-Not-Found-Hint'),
      403: t('exceptions.Forbidden-Hint'),
    }[props.status]
  })

  const { props: pageProps } = usePage<{ auth: { user: IUserItem } }>()
</script>

<template>
  <ErrorLayout>
    <section class="bg-white dark:bg-dark-300">
      <div class="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <div class="flex flex-col items-center max-w-sm mx-auto text-center">
          <p
            class="p-3 text-sm font-medium text-primary rounded-full bg-blue-50 dark:bg-dark-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2"
              >
                <path
                  stroke-dasharray="60"
                  stroke-dashoffset="60"
                  d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                >
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    dur="0.5s"
                    values="60;0"
                  />
                </path>
                <path stroke-dasharray="8" stroke-dashoffset="8" d="M12 7V13">
                  <animate
                    fill="freeze"
                    attributeName="stroke-dashoffset"
                    begin="0.6s"
                    dur="0.2s"
                    values="8;0"
                  />
                </path>
              </g>
              <circle
                cx="12"
                cy="17"
                r="1"
                fill="currentColor"
                fill-opacity="0"
              >
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="0.8s"
                  dur="0.4s"
                  values="0;1"
                />
              </circle>
            </svg>
          </p>
          <h1
            class="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl"
          >
            {{ title }}
          </h1>
          <p class="mt-4 text-gray-500 dark:text-gray-400">
            {{ description }}
          </p>

          <div class="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <button
              class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 rtl:rotate-180"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>

              <span>{{ $t('go-back') }}</span>
            </button>

            <Link
              type="button"
              as="button"
              :href="route(pageProps.auth.user ? 'dashboard' : 'home')"
              class="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-primary rounded-lg shrink-0 sm:w-auto hover:bg-green-500 dark:hover:bg-primary dark:bg-green-500"
            >
              {{
                pageProps.auth.user
                  ? $t('take-me-home')
                  : $t('take-me-dashboard')
              }}
            </Link>
          </div>
        </div>
      </div>
    </section>
  </ErrorLayout>
</template>
