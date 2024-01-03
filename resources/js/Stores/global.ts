import route from 'ziggy-js'

export const useGlobalState = createGlobalState(() => {
  const breadCrumb = ref<IBreadCrumbItem[]>([])

  function setBreadCrumbItem(item: IBreadCrumbItem) {
    breadCrumb.value.push({
      title: item.title,
      icon: item.icon,
      link: item.link,
    })
  }

  const drawerItem = ref<IMenuItem | null>(null)

  function selectDrawerItem(item: IMenuItem, isActive: boolean = false) {
    drawerItem.value = drawerItem.value?.title === item.title ? null : item

    if (isActive) {
      breadCrumb.value = []
      setBreadCrumbItem({
        title: item.title,
        icon: item.icon,
        link: item.link,
      })
    }
  }

  const drawerOpener = ref<boolean>(false)

  const homeBreadCrumb = ref<string>(route('dashboard'))

  return {
    breadCrumb,
    selectDrawerItem,
    setBreadCrumbItem,
    drawerOpener,
    homeBreadCrumb,
    drawerItem,
  }
})
