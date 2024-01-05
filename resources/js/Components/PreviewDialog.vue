<script setup lang="ts">
  import DialogModalVue from './DialogModal.vue'

  defineProps<{ mimeType: string; src: string; show: boolean }>()

  const emit = defineEmits(['close'])
</script>

<template>
  <DialogModalVue :show="show" @close="emit('close')">
    <template #content>
      <div class="max-h-64 lg:max-h-85 overflow-y-scroll">
        <div class="py-4">
          <vue-plyr>
            <video controls playsinline v-if="mimeType.includes('video')">
              <source :src="`/upload/${src}`" :type="mimeType" />
            </video>
            <audio controls playsinline v-else-if="mimeType.includes('audio')">
              <source :src="`/upload/${src}`" :type="mimeType" />
            </audio>
          </vue-plyr>
        </div>
      </div>
    </template>
  </DialogModalVue>
</template>
