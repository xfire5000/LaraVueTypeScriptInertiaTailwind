<script setup lang="ts">
  import { TransitionFade } from '@morev/vue-transitions'
  import { useTheme } from 'vuetify/lib/framework.mjs'

  useTheme().global.name.value = useColorMode().value

  useFavicon('/assets/img/icons/pwa/homescreen192.png')
</script>

<template lang="pug">
Head
  meta(name="darkreader-lock")
  meta(content="#01DC84", name="theme-color")
  link(:href="$page.props.ziggy['url']", rel="canonical")
transition-fade
  slot
</template>
