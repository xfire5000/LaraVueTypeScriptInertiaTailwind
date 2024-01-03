<script setup lang="ts">
  const emit = defineEmits(['close'])

  withDefaults(
    defineProps<{ show: boolean; maxWidth: string; closeable: boolean }>(),
    {
      show: false,
      maxWidth: '2xl',
      closeable: true,
    },
  )

  const close = () => {
    emit('close')
  }
</script>

<template>
  <Modal
    :show="show"
    :max-width="maxWidth"
    :closeable="closeable"
    @close="close"
  >
    <div class="px-6 py-4">
      <div class="text-lg font-medium text-gray-900 dark:text-white">
        <slot name="title" />
      </div>

      <div class="mt-4 text-sm text-gray-600">
        <slot name="content" />
      </div>
    </div>

    <div
      class="flex flex-row justify-end px-6 py-4 bg-gray-100 text-end dark:bg-dark-200"
    >
      <slot name="footer" />
      <v-btn
        @click="close"
        class="ltr:ml-2 rtl:mr-4"
        color="red"
        rounded="lg"
        v-if="!closeable"
        variant="tonal"
      >
        {{ $t('close') }}
      </v-btn>
    </div>
  </Modal>
</template>
