<script setup lang="ts">
  withDefaults(defineProps<{ color: string }>(), { color: '#50e6ff' })
</script>

<template>
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 151.54 190.58"
  >
    <defs>
      <clipPath id="clippath">
        <rect class="cls-2" y=".58" width="150" height="190" />
      </clipPath>
      <clipPath id="clippath-1">
        <path class="cls-2" d="m95,.58v45c0,5.52,4.48,10,10,10h45L95,.58Z" />
      </clipPath>
      <clipPath id="clippath-2">
        <rect class="cls-2" x="95" y=".58" width="55" height="55" />
      </clipPath>
    </defs>
    <g class="cls-5">
      <path
        :fill="color"
        class="cls-3"
        d="m150,55.58v125c0,5.52-4.48,10-10,10H10c-5.52,0-10-4.48-10-10V10.58C0,5.06,4.48.58,10,.58h85l55,55Z"
      />
    </g>
    <g class="cls-4">
      <g class="cls-1">
        <rect
          width="120"
          height="118"
          :fill="color"
          class="brightness-200"
          transform="translate(93.94 56.64) scale(.48 -.48)"
        />
      </g>
    </g>
  </svg>
</template>

<style scoped>
  .cls-1 {
    clip-path: url(#clippath-2);
  }

  .cls-2 {
    fill: none;
  }

  .cls-2,
  .cls-3 {
    stroke-width: 0px;
  }

  .cls-4 {
    clip-path: url(#clippath-1);
  }

  .cls-5 {
    clip-path: url(#clippath);
  }
</style>
