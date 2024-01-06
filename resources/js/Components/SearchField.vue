<script setup lang="ts">
  import { mdiArrowLeft, mdiMagnify } from '@mdi/js'

  const props = withDefaults(
    defineProps<{ modelValue: string; disabled?: boolean }>(),
    {
      modelValue: () => '',
      disabled: false,
    },
  )

  const emit = defineEmits(['update:modelValue', 'doSearch'])

  const value = useVModel(props, 'modelValue', emit)
</script>

<template lang="pug">
v-text-field(
  ::="value",
  :append-inner-icon="mdiArrowLeft",
  :disabled,
  :placeholder="$t('search-placeholder')",
  :prepend-inner-icon="mdiMagnify",
  @click:append-inner="emit('doSearch')",
  @keypress.enter="emit('doSearch')",
  class="dark:bg-dark-200",
  hide-details="auto",
  rounded="full",
  variant="outlined"
)
</template>
