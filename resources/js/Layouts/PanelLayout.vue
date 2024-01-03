<script setup lang="ts">
  import {
    BreadCrumb,
    Footer,
    Header,
    NavDrawer,
  } from './Partials/PanelPartials'
</script>

<template lang="pug">
.flex.h-full.w-full.flex-col
  .flex.flex-1
    NavDrawer(v-once)
    main.relative.flex-1.overflow-hidden
      Header
      .container
        BreadCrumb
      slot
      Footer
</template>
