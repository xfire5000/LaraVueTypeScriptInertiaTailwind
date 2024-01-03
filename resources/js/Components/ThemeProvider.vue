<script setup lang="ts">
  import { mdiWeatherNight, mdiWhiteBalanceSunny } from '@mdi/js'

  const { value } = useColorMode({ initialValue: 'auto' })

  function onModeChange(params) {
    useColorMode().value = params as 'dark' | 'light'
  }

  const mode = ref<string>(value)
</script>

<template lang="pug">
v-switch#theme-toggle(
  ::="mode",
  @update:model-value="onModeChange",
  false-value="light",
  hide-details="auto",
  inset,
  loading,
  true-value="dark"
)
  template(#loader)
    v-icon(class="dark:text-amber-500", size="16").relative {{ mode !== 'dark' ? mdiWeatherNight : mdiWhiteBalanceSunny }}
</template>
