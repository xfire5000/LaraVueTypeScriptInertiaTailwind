<script setup lang="ts">
  import { router, usePage } from '@inertiajs/vue3'
  import {
    mdiArrowRight,
    mdiCheck,
    mdiChevronDown,
    mdiDotsHorizontal,
    mdiFilter,
    mdiPencil,
    mdiPlusCircleOutline,
    mdiTrashCanOutline,
  } from '@mdi/js'
  import { StatusCodes } from 'http-status-codes'
  import { toast } from 'vue3-toastify'
  import route from 'ziggy-js'

  defineProps<{
    users: TPageProps
    roles: IRoleItem[]
  }>()

  const $page = usePage<InertiaPageProps>()

  const searchedParam = useUrlSearchParams('history').s

  const search = ref<string>(searchedParam ? searchedParam.toString() : '')

  const doSearch = () =>
    router.get(route('users.index', { _query: { s: search.value } }))

  const userDialog = ref<boolean>(false)
  const userItem = ref<IUserItem | undefined>(undefined)

  function userDialogActivator(item: any = undefined) {
    userItem.value = item
    userDialog.value = !_.isUndefined(item)
  }

  const { t } = useI18n()

  const headers: { title: string; key: string; sortable?: boolean }[] = [
    { title: t('user-infos.name'), key: 'name' },
    { title: t('user-infos.email'), key: 'email' },
    { title: t('user-infos.roles'), key: 'roles' },
    { title: t('created_at'), key: 'created_at', sortable: true },
    { title: t('actions'), key: 'actions' },
  ]

  const deleteDialog = ref<boolean>(false)

  function deleteUser(item: any = undefined) {
    userItem.value = item
    deleteDialog.value = !_.isUndefined(item)
  }

  const doDelete = () =>
    useFetchClient
      .delete<{ msg: string }>(route('users.destroy', userItem.value?.id))
      .then(({ data, statusCode }) => {
        deleteDialog.value = false
        if (statusCode.value === StatusCodes.OK) {
          toast(data.value?.msg || '', { type: 'success' })
          _.remove(
            $page.props.users['data'],
            (item: IUserItem) => item.id == userItem.value?.id,
          )
          userItem.value = undefined
        }
      })

  function onSubmitted(item: IUserItem) {
    let items = $page.props.users['data']
    if (item.created_at === item.updated_at) items.unshift(item)
    else {
      let index = items.findIndex((u: IUserItem) => u.id === item.id)
      items[index] = item
    }
  }

  const selectedItems = ref<number[]>([])
</script>

<template lang="pug">
Head(:title="$t('users')")
PanelLayout
  .container
    v-row
      v-col(cols="12", md="8")
        | {{ $t('users') }}
        SearchField(::="search", @do-search="doSearch", class="w-1/3").mt-4
      v-col(cols="12", md="4").flex.flex-row-reverse.items-center.gap-x-2
        Link(:href="route('users.index')", v-if="search.length > 0")
          v-btn(
            :prepend-icon="mdiArrowRight",
            rounded="lg",
            variant="outlined"
          ).my-auto.ml-3 {{ $t('back') }}
        v-btn(
          :prepend-icon="mdiPlusCircleOutline",
          @click="userDialogActivator",
          color="secondary",
          rounded="lg",
          v-if="$page.props.auth['can']['add-users']"
        ).my-auto {{ $t('add', { name: $t('user') }) }}
        v-menu(location="bottom")
          template(#activator="{ props }")
            v-btn(
              :append-icon="mdiChevronDown",
              :prepend-icon="mdiFilter",
              rounded="full",
              size="small",
              v-bind="props"
            ) {{ $t('roles') }}
          v-list.flex.max-h-34.flex-col.overflow-y-scroll
            Link(:href="route('users.index')", as="button")
              v-list-item
                .flex.flex-row.items-center.justify-center.gap-x-2
                  v-icon(size="small", v-if="route().current('users.index')") {{ mdiCheck }}
                  | {{ $t('all') }}
            Link(
              :href="route('users.index', { _query: { role: item.name } })",
              as="button",
              v-for="item in roles"
            )
              v-list-item
                .flex.flex-row.items-center.justify-center.gap-x-2
                  v-icon(
                    size="small",
                    v-if="route().current('users.index', { _query: { role: item.name } })"
                  ) {{ mdiCheck }}
                  | {{ item.title }}
      v-col(cols="12")
        v-data-table(
          ::="selectedItems",
          :headers,
          :items="users.data",
          :items-per-page="users.per_page",
          item-value="id",
          show-select
        )
          template(#bottom)
            Paginator(
              :current-page="users.current_page",
              :links="users.links",
              :total="users.last_page",
              type="api"
            ).w-full.p-4
          template(#item.roles="{ value }")
            v-chip-group.flex.flex-row.items-center.justify-start.gap-x-2
              v-chip(
                :key="item.id",
                v-for="item in value"
              ).bg-sky-600.bg-opacity-30.text-sky-600 {{ item.title }}
          template(#item.created_at="{ value }")
            span(dir="ltr") {{ $d(value, 'long') }}
          template(#item.name="{ value }")
            a(
              @click="userDialogActivator(value)",
              class="hover:underline",
              v-if="$page.props.auth['can']['edit-users']"
            ).cursor-pointer.text-sky-600 {{ value }}
            span(v-else) {{ value }}
          template(#item.actions="{ item }")
            v-menu(location="bottom")
              template(#activator="{ props: menu }")
                v-btn(
                  :icon="mdiDotsHorizontal",
                  size="small",
                  v-bind="menu",
                  variant="text"
                )
              v-list
                v-list-item(
                  :prepend-icon="mdiPencil",
                  @click="userDialogActivator(item)",
                  v-if="$page.props.auth['can']['edit-users']"
                ) {{ $t('edit') }}
                v-list-item(
                  :prepend-icon="mdiTrashCanOutline",
                  @click="deleteUser(item)",
                  v-if="$page.props.auth['can']['delete-users']"
                ) {{ $t('delete') }}
UserDialog(
  :initial-form="userItem",
  :roles,
  :show="userDialog",
  @close="userDialogActivator()",
  @submitted="onSubmitted"
)
ConfirmationModal(:show="deleteDialog", @close="deleteUser()", @yes="doDelete")
  template(#title) {{ $t('delete', { name: $t('user') }) }}
  template(#content) {{ $t('delete-confirmation', { name: $t('user') }) }}
</template>
