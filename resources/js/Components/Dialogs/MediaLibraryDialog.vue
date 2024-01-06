<script setup lang="ts">
  import ConfirmationDialog from '../ConfirmationModal.vue'
  import DialogModal from '../DialogModal.vue'
  import FileAssetIcon from '../FileAssetIcon.vue'
  import PreviewDialog from '../PreviewDialog.vue'
  import { usePage } from '@inertiajs/vue3'
  import {
    mdiArrowDown,
    mdiArrowLeft,
    mdiCheck,
    mdiChevronDown,
    mdiChevronLeft,
    mdiCloudUploadOutline,
    mdiContentCopy,
    mdiDotsHorizontal,
    mdiEye,
    mdiFile,
    mdiFileDocument,
    mdiFilter,
    mdiFolderAlertOutline,
    mdiFolderOutline,
    mdiImage,
    mdiMagnify,
    mdiMovie,
    mdiMusic,
    mdiPlay,
    mdiSortAscending,
    mdiSortDescending,
    mdiTrashCanOutline,
  } from '@mdi/js'
  import { TransitionSlide } from '@morev/vue-transitions'
  import { StatusCodes } from 'http-status-codes'
  import { api as viewerApi } from 'v-viewer'
  import 'viewerjs/dist/viewer.css'
  import Dropzone, { type DropzoneOptions } from 'vue2-dropzone-vue3'
  import { toast } from 'vue3-toastify'
  import route from 'ziggy-js'

  interface IProps {
    show: boolean
    multiple?: boolean
    maxFileSize?: number
    destination?: string
    modelValue?: IMediaItem | IMediaItem[]
    collection?: string
  }

  const props = withDefaults(defineProps<IProps>(), {
    show: false,
    multiple: false,
    maxFileSize: 50,
    destination: 'media-library',
    collection: '',
  })

  const ModelValue = computed(() =>
    props.multiple ? (props.modelValue as IMediaItem[]) : [],
  )

  const emit = defineEmits(['close', 'update:modelValue'])

  const value = useVModel(props, 'modelValue', emit)

  const { t } = useI18n()

  const search = ref<string>('')

  const mediaModule = reactive<{
    mediaItems: IMediaItem[]
    page: number
    fetchLock: boolean
    sortTypes: {
      title: string
      value: string | null
      color: string
      icon: string
    }[]
    sortType: string | null
    sortDate: string | null
  }>({
    mediaItems: [],
    page: 1,
    fetchLock: false,
    sortTypes: [
      {
        title: t('media-library.all'),
        value: null,
        color: '#b2972e',
        icon: mdiFile,
      },
      {
        title: t('media-library.images'),
        value: 'image',
        color: '#1b8959',
        icon: mdiImage,
      },
      {
        title: t('media-library.videos'),
        value: 'video',
        color: '#b22830',
        icon: mdiMovie,
      },
      {
        title: t('media-library.audios'),
        value: 'audio',
        color: '#0076e4',
        icon: mdiMusic,
      },
      {
        title: t('media-library.documents'),
        value: 'officedocument',
        color: '#652acb',
        icon: mdiFileDocument,
      },
    ],
    sortType: null,
    sortDate: null,
  })

  const el = ref<HTMLDivElement>()

  const dropzone = reactive<DropzoneOptions>({
    url: route('media-library.store'),
    headers: {
      'X-CSRF-TOKEN': useCsrf || 'no-token',
      Authorization: usePage<InertiaPageProps>().props.auth.token,
    },
    timeout: 6800000,
    addRemoveLinks: true,
    thumbnailWidth: 100,
    thumbnailHeight: 100,
    maxFilesize: props.maxFileSize, // MB
    parallelUploads: 1,
    chunking: true,
    forceChunking: true,
    parallelChunkUploads: false,
    autoQueue: true,
    autoProcessQueue: true,
    retryChunks: true,
    retryChunksLimit: 3,
  })

  const uploader = ref()

  function cleanUploadList() {
    setTimeout(() => {
      uploader.value.removeAllFiles()
    }, 3000)
  }

  const successUpload = (file, response) => {
    response.forEach((item) => mediaModule.mediaItems.unshift(item))
  }

  function sendingEvent(file, xhr, formData) {
    formData.append('destination', props.destination)
    formData.append('collection', props.collection)
  }

  const visibleDropzone = ref<boolean>(false)

  const { execute, isFetching, data, abort, canAbort } =
    useFetchClient.get<TPageProps>(
      route('media-library.index', {
        _query: _.merge(
          { page: mediaModule.page },
          search.value.length ? { s: search.value } : null,
          mediaModule.sortType ? { t: mediaModule.sortType } : null,
          mediaModule.sortDate ? { d: mediaModule.sortDate } : null,
        ),
      }),
    )

  watch(
    () => data.value,
    (newValue) => {
      if (
        newValue &&
        newValue.data.length &&
        !mediaModule.fetchLock &&
        _.differenceBy(newValue.data, mediaModule.mediaItems, 'id').length
      ) {
        mediaModule.mediaItems.push(...(newValue.data as IMediaItem[]))
        _.uniqBy(mediaModule.mediaItems, 'id')
        mediaModule.page++
      } else mediaModule.fetchLock = true
    },
  )

  function fetchMedia(isNewFetch: boolean = false) {
    if (isNewFetch) {
      mediaModule.page = 1
      mediaModule.mediaItems = []
      mediaModule.fetchLock = false
    }
    execute()
  }

  useInfiniteScroll(
    el,
    () => {
      if (!isFetching.value && !mediaModule.fetchLock) fetchMedia()
    },
    {
      interval: 4000,
    },
  )

  const deleteFile = reactive<{ dialog: boolean; fileId: number }>({
    dialog: false,
    fileId: 0,
  })

  function initDeleteFile(id: number = 0) {
    deleteFile.fileId = id
    deleteFile.dialog = id !== 0
  }

  const doDelete = () =>
    useFetchClient
      .delete<{ msg: string }>(
        route(
          'media-library.delete',
          props.multiple && (props.modelValue as IMediaItem[]).length
            ? (props.modelValue as IMediaItem[])
                .map((item) => item.id)
                .toString()
            : deleteFile.fileId,
        ),
      )
      .then(({ statusCode, data }) => {
        if (statusCode.value === StatusCodes.OK) {
          deleteFile.dialog = false
          _.remove(
            mediaModule.mediaItems,
            (item) => item.id === deleteFile.fileId,
          )
          if (props.multiple && (props.modelValue as IMediaItem[]).length)
            value.value = []
          deleteFile.fileId = 0
          toast(data.value?.msg || '', { type: 'success' })
        }
      })

  function changeFileType(type: string | null) {
    mediaModule.sortType = type
    fetchMedia(true)
  }

  onUpdated(() => {
    if (!props.show && mediaModule.mediaItems.length) {
      mediaModule.page = 1
      mediaModule.sortType = null
      mediaModule.fetchLock = false
    }
  })

  function selectFile(item: IMediaItem) {
    if (props.multiple) {
      let items = value.value as IMediaItem[]
      if (!items.find((i) => i.id === item.id)) items.unshift(item)
      else _.remove(items, (i) => i.id === item.id)
    } else {
      let i = value.value as IMediaItem
      if (i && i.id === item.id) value.value = undefined
      else value.value = item
    }
  }

  const fileType = (mimeType: string) => {
    switch (true) {
      case mimeType.includes('image'):
        return t('media-library.image')
      case mimeType.includes('video'):
        return t('media-library.video')
      case mimeType.includes('audio'):
        return t('media-library.audio')
      case mimeType.includes('officedocument'):
        return t('media-library.document')
      default:
        return t('media-library.file')
    }
  }

  const isSelected = (id: number) =>
    (!props.multiple && (value.value as IMediaItem)?.id === id) ||
    (props.multiple &&
      (value.value as IMediaItem[])?.find((item) => item.id === id))

  const preview = (image: string) =>
    viewerApi({
      images: [`/upload/${image}`],
      options: { toolbar: false, navbar: false },
    })

  function fileTypeInfo(type: string) {
    let typeFinder = mediaModule.sortTypes.find((i) => {
      if (i.value) return type.includes(i.value)
    })
    if (!typeFinder) return mediaModule.sortTypes[0]
    else return typeFinder
  }

  const mediaPreview = reactive({
    dialog: false,
    src: '',
    type: '',
  })

  function initMediaPreview(item?: IMediaItem) {
    mediaPreview.src = item?.path || ''
    mediaPreview.type = item?.type || ''
    mediaPreview.dialog = item !== undefined
  }

  function changeSortDate(type: string) {
    mediaModule.sortDate = type
    fetchMedia(true)
  }
</script>

<template lang="pug">
DialogModal(:closeable="false", :show, @close="emit('close')")
  template(#title)
    .flex.flex-row.items-center.gap-x-2
      v-icon(size="small") {{ mdiFolderOutline }}
      | {{ $t('media-library.index') }}
      div(class="ltr:text-right rtl:text-left", v-if="multiple").grow
        v-btn(
          :disabled="!ModelValue?.length",
          :prepend-icon="mdiTrashCanOutline",
          @click="deleteFile.dialog = true",
          color="red",
          rounded="full",
          size="small",
          variant="tonal"
        ).my-auto {{ $t('delete', { name: ModelValue?.length }) }}
  template(#content)
    .flex.flex-col.pb-4
      TransitionSlide
        Dropzone(
          :options="dropzone",
          :useCustomSlot="true",
          @vdropzone-complete="cleanUploadList",
          @vdropzone-success="successUpload",
          ref="uploader",
          v-if="visibleDropzone",
          v-on:vdropzone-sending="sendingEvent"
        ).max-h-24.border-dashed.transition.duration-300
          div(
            class="dark:text-gray-200"
          ).dropzone-custom-content.mt-n5.flex.cursor-pointer.flex-col.items-center.gap-y-2.text-gray-600
            v-icon(size="32") {{ mdiContentCopy }}
            .dropzone-custom-title {{ $t('media-library.drag-upload') }}
      div(class="lg:flex-row lg:gap-x-2").mt-4.flex.flex-col.items-center.gap-y-2
        v-btn(
          :prepend-icon="mdiCloudUploadOutline",
          :variant="visibleDropzone ? 'tonal' : 'flat'",
          @click="visibleDropzone = !visibleDropzone",
          color="info",
          rounded="full"
        ) {{ $t('media-library.upload') }}
        .grow
          v-text-field(
            ::="search",
            :append-inner-icon="mdiArrowLeft",
            :disabled="isFetching",
            :placeholder="$t('search-placeholder')",
            :prepend-inner-icon="mdiMagnify",
            @click:append-inner="fetchMedia(true)",
            @keypress.enter="fetchMedia(true)",
            class="[&_input]:text-xs",
            hide-details="auto",
            rounded="full"
          )
        v-menu(location="bottom")
          template(#activator="{ props }")
            v-btn(
              :append-icon="mdiChevronDown",
              :disabled="!isFetching && !mediaModule.mediaItems.length",
              :prepend-icon="mdiFilter",
              rounded="full",
              size="small",
              v-bind="props",
              variant="text"
            ) {{ $t('media-library.filter') }}
          v-list
            v-menu(location="left")
              template(#activator="{ props: submenu }")
                v-list-item(:append-icon="mdiChevronLeft", v-bind="submenu") {{ $t('media-library.sortByDate') }}
              v-list
                v-list-item(
                  :prepend-icon="mdiSortAscending",
                  @click="changeSortDate('asc')"
                ) {{ $t('media-library.asc') }}
                v-list-item(
                  :prepend-icon="mdiSortDescending",
                  @click="changeSortDate('desc')"
                ) {{ $t('media-library.desc') }}
            v-menu(location="left")
              template(#activator="{ props: submenu }")
                v-list-item(:append-icon="mdiChevronLeft", v-bind="submenu") {{ $t('media-library.sortByType') }}
              v-list
                v-list-item(
                  @click="changeFileType(item.value)",
                  v-for="item in mediaModule.sortTypes",
                  v-text="item.title"
                )
    div(class="lg:grid-cols-4", ref="el").grid.max-h-60.grid-cols-2.gap-2.overflow-y-auto
      TransitionSlide
        div(
          v-if="isFetching"
        ).col-span-full.flex.flex-col.items-center.gap-y-4.py-12
          v-progress-circular(color="indigo", indeterminate)
          | {{ $t('media-library.loading') }}
          v-btn(
            @click="abort",
            color="red",
            v-show="canAbort",
            variant="outlined"
          ) {{ $t('cancel') }}
        div(
          v-if="!isFetching && !mediaModule.mediaItems.length"
        ).col-span-full.flex.flex-col.items-center.gap-y-4.py-12
          v-icon(size="50") {{ mdiFolderAlertOutline }}
          | {{ $t('media-library.no-files') }}
      div(
        :key="item.id",
        @click="selectFile(item)",
        v-for="item in mediaModule.mediaItems"
      ).media-item.group
        FileAssetIcon(
          :color="fileTypeInfo(item.type).color",
          class="dark:opacity-70"
        ).mt-4
        v-icon(class="right-1/3 top-1/2", size="70").absolute.opacity-30 {{ fileTypeInfo(item.type).icon }}
        .absolute.top-0.mx-5.mt-8.flex.flex-col.gap-y-1.text-left
          strong(v-text="fileType(item.type)").pb-4.text-white
          p(v-text="item.title")
          small.dir-ltr.-mt-2.text-gray-400 {{ $d(item.created_at, 'long').toString().replace(',', '') }}
        div(
          :class="[!isSelected(item.id) ? 'bg-gray-300 opacity-0 group-hover:opacity-100' : 'bg-primary', 'px-1.4']"
        ).absolute.bottom-6.left-2.rounded-lg.py-1.transition.duration-300
          v-icon(color="white") {{ isSelected(item.id) ? mdiCheck : null }}
        v-menu(location="left")
          template(#activator="{ props }")
            v-btn(
              :icon="mdiDotsHorizontal",
              rounded="lg",
              size="x-small",
              v-bind="props"
            ).absolute.bottom-2.right-2.bg-indigo-800.text-white
          v-list
            v-list-item(
              :prepend-icon="mdiEye",
              @click="preview(item.path)",
              v-if="item.type.includes('image')"
            ) {{ $t('media-library.preview') }}
            v-list-item(
              :prepend-icon="mdiPlay",
              @click="initMediaPreview(item)",
              v-else-if="item.type.includes('video') || item.type.includes('audio')"
            ) {{ $t('media-library.play') }}
            v-list-item(
              :href="route('media-library.download', item.id)",
              :prepend-icon="mdiArrowDown",
              target="_blank"
            ) {{ $t('media-library.download') }}
            v-divider.mx-3
            v-list-item(
              :prepend-icon="mdiTrashCanOutline",
              @click="initDeleteFile(item.id)"
            ) {{ $t('delete') }}
ConfirmationDialog(
  :show="deleteFile.dialog",
  @close="initDeleteFile()",
  @yes="doDelete"
)
  template(#title)
    | {{ $t('delete', { name: multiple ? $t('media-library.files') : $t('media-library.file') }) }}
  template(#content)
    | {{ $t('delete-confirmation', { name: multiple ? $t('media-library.files') : $t('media-library.file') }) }}
PreviewDialog(
  :mime-type="mediaPreview.type",
  :show="mediaPreview.dialog",
  :src="mediaPreview.src",
  @close="initMediaPreview()"
)
</template>

<style scoped>
  .media-item {
    @apply relative m-2 h-[200px] cursor-pointer text-white;
  }
  .media-item p {
    @apply line-clamp-3 break-words text-xs;
    direction: ltr;
  }
</style>
