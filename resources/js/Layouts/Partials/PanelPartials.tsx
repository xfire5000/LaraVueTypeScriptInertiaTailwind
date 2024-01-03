import ApplicationLogo from '@Components/ApplicationLogo.vue'
import ThemeProviderVue from '@Components/ThemeProvider.vue'
import { Link, usePage } from '@inertiajs/vue3'
import { mdiArrowLeft, mdiChevronLeft, mdiHomeOutline, mdiMenu } from '@mdi/js'
import { TransitionSlide } from '@morev/vue-transitions'
import { useI18n } from 'vue-i18n'
import { VBtn, VDivider, VIcon } from 'vuetify/lib/components/index.mjs'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import route from 'ziggy-js'

export const Header = defineComponent({
  setup(props, { slots }) {
    return () => (
      <div class="dark:bg-dark-300 h-12 shadow-sm dark:shadow-gray-800 z-40">
        <div class="mx-4 h-full flex flex-row-reverse items-center justify-start gap-x-2">
          <div class="w-12">
            <ThemeProviderVue />
          </div>
          {slots.default ? <VDivider vertical class="h-3/4 my-auto" /> : null}
          {slots.default?.()}
        </div>
      </div>
    )
  },
})

export const BreadCrumb = defineComponent({
  setup() {
    const { breadCrumb, homeBreadCrumb, drawerOpener } = useGlobalState()

    return () => (
      <div class="flex items-center overflow-x-auto whitespace-nowrap py-4 child:text-xs">
        <div onClick={() => (drawerOpener.value = !drawerOpener.value)}>
          {!drawerOpener.value ? (
            <VBtn icon={mdiMenu} variant="text"></VBtn>
          ) : null}
        </div>
        <Link
          href={homeBreadCrumb.value}
          class="hover:text-primary dark:text-gray-200 text-gray-600"
        >
          <VIcon>{mdiHomeOutline}</VIcon>
        </Link>
        {breadCrumb.value.length ? (
          <span class="ltr:-scale-x-100 dark:text-gray-300 mx-2 text-gray-500">
            <VIcon class="h-5 w-5">{mdiChevronLeft}</VIcon>
          </span>
        ) : null}
        {breadCrumb.value.map((item, index) => (
          <>
            {breadCrumb.value.length - 1 > index &&
            breadCrumb.value.length !== 1 &&
            item.link ? (
              <Link
                class="hover:underline dark:text-gray-200 -px-2 flex items-center text-gray-600"
                href={item.link}
              >
                <VIcon size={15} class="rtl:ml-2">
                  {item.icon}
                </VIcon>
                {item.title}
              </Link>
            ) : (
              <div class="-px-2 flex items-center text-gray-600 dark:text-gray-200">
                <span>{item.title}</span>
              </div>
            )}
            <span
              class={[
                'mx-2 text-gray-500 dark:text-gray-300 ltr:-scale-x-100',
                { hidden: index > breadCrumb.value.length - 2 },
              ]}
            >
              <VIcon class="h-5 w-5">{mdiChevronLeft}</VIcon>
            </span>
          </>
        ))}
      </div>
    )
  },
})

export const NavDrawer = defineComponent({
  setup() {
    const page = usePage<InertiaPageProps>()

    const permissions: any[] = page.props.auth.can

    const { t } = useI18n()

    const { mobile } = useDisplay()

    const { selectDrawerItem, drawerOpener, drawerItem } = useGlobalState()

    const menuItems: IMenuItem[] = [
      {
        title: t('dashboard'),
        link: route('dashboard'),
        icon: mdiHomeOutline,
        can: true,
      },
    ]

    const search = ref<string>('')

    onMounted(() => {
      let currentUrl = page.props.ziggy['url'] + page.url
      let itemFinder = menuItems.find(
        (item) =>
          item.link === currentUrl ||
          (item.child && item.child.find((child) => child.link === currentUrl)),
      )
      if (itemFinder) selectDrawerItem(itemFinder, true)
      else if (page.url.includes('list-items'))
        selectDrawerItem(menuItems[1], true)
      setTimeout(() => (drawerOpener.value = !mobile.value), 500)
    })

    return () => (
      <aside
        class={[
          'sticky transition duration-300 right-0 top-0 z-20 flex flex-col h-screen py-6 overflow-y-auto border-t-0 border-b-0 rtl:border-r-0 ltr:border-l-0 border dark:bg-gray-900 dark:border-gray-700',
          !drawerOpener.value ? 'w-0' : 'w-64 px-5',
        ]}
      >
        <div
          class="absolute top-2 left-2 block lg:hidden"
          onClick={() => (drawerOpener.value = !drawerOpener.value)}
        >
          <VBtn
            icon={mdiArrowLeft}
            variant="text"
            class="dark:text-white"
          ></VBtn>
        </div>
        <Link href={route('dashboard')} class="mx-auto">
          <ApplicationLogo class="w-full h-8 -mt-1" />
        </Link>

        <div class="flex flex-col justify-between flex-1 mt-6">
          <nav class="flex-1 -mx-3 space-y-3">
            <div class="relative mx-3">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  class="w-5 h-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </span>

              <input
                value={search.value}
                onInput={(e) =>
                  e.target ? (search.value = e.target['value']) : null
                }
                type="text"
                class="w-full py-1.5 pl-10 pr-4 text-gray-700 border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                placeholder={t('search-placeholder')}
              />
            </div>

            {menuItems
              .filter((f) =>
                search.value.length
                  ? (f.title.includes(search.value) && f.can) ||
                    (f.child &&
                      f.child.find(
                        (c) => c.title.includes(search.value) && c.can,
                      ))
                  : f.can,
              )
              .map((item) =>
                item.child ? (
                  <a
                    onClick={() => selectDrawerItem(item)}
                    class={[
                      'group flex flex-col transform text-gray-600 transition-colors duration-300 px-3 py-2 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 w-full',
                      {
                        'dark:text-gray-200 text-gray-700 dark:bg-gray-800 bg-gray-100':
                          item.title === drawerItem.value?.title,
                      },
                    ]}
                  >
                    <div class="flex items-center">
                      <VIcon size="20">{item.icon}</VIcon>

                      <span class="mx-2 text-sm font-medium">{item.title}</span>

                      <div class="grow flex flex-row-reverse items-center">
                        <div class="group-hover:bg-primary px-1 py-0.5 rounded-full group-hover:text-white">
                          <VIcon
                            size="small"
                            class={[
                              'mt-0.4 transition',
                              {
                                '-rotate-90':
                                  item.title === drawerItem.value?.title,
                              },
                            ]}
                          >
                            {mdiChevronLeft}
                          </VIcon>
                        </div>
                      </div>
                    </div>
                    <TransitionSlide group>
                      {item.title === drawerItem.value?.title ? (
                        <>
                          <VDivider class="my-2" />
                          <ul class="gap-y-2 child:text-xs">
                            {item.child.map((child) => (
                              <li>
                                <Link
                                  href={child.link}
                                  class="gap-x-2 flex flex-row items-center"
                                >
                                  <VIcon>{item.icon}</VIcon>
                                  {child.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </TransitionSlide>
                  </a>
                ) : (
                  <Link
                    as="button"
                    class={[
                      'flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 w-full',
                      {
                        'dark:text-gray-200 text-gray-700 dark:bg-gray-800 bg-gray-100':
                          item.link === page.props.ziggy['location'],
                      },
                    ]}
                    href={item.link}
                  >
                    <VIcon size="20">{item.icon}</VIcon>

                    <span class="mx-2 text-sm font-medium">{item.title}</span>
                  </Link>
                ),
              )}
          </nav>

          <div class="mt-6">
            <div class="flex items-center justify-between mt-6">
              <Link
                href={route('profile.show')}
                as="button"
                class="flex items-center gap-x-2"
              >
                <img
                  class="object-cover rounded-full h-7 w-7"
                  src={page.props.auth['user'].profile_photo_url}
                  alt="avatar"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {page.props.auth['user'].name}
                </span>
              </Link>

              <Link
                method="post"
                as="button"
                href={route('logout')}
                class="text-gray-500 transition-colors duration-200 rotate-180 dark:text-gray-400 rtl:rotate-0 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    )
  },
})

export const Footer = defineComponent({
  props: { floatFooter: { default: false, type: Boolean } },
  setup(props, { slots }) {
    const { d } = useI18n()

    return () => (
      <footer
        class={[
          { 'fixed bottom-0 w-full': props.floatFooter },
          'mx-4 dark:text-white dark:bg-dark-300 flex flex-row items-center gap-x-2 justify-start',
        ]}
      >
        <div class="text-xs pb-2">&copy; {d(new Date(), 'year')}</div>
        {slots.default?.()}
      </footer>
    )
  },
})
