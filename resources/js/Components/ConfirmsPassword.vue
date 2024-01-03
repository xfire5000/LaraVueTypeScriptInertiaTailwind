<script setup lang="ts">
  import DialogModal from './DialogModal.vue'
  import { mdiCheck, mdiEye, mdiEyeOff } from '@mdi/js'
  import route from 'ziggy-js'

  const emit = defineEmits(['confirmed'])

  defineProps<{ title?: string; content?: string; button?: string }>()

  const confirmingPassword = ref(false)

  const form = reactive({
    password: '',
    error: '',
    processing: false,
  })

  const startConfirmingPassword = () =>
    useFetchClient.get<any>(route('password.confirmation')).then(({ data }) => {
      if (data.value.confirmed) {
        emit('confirmed')
      } else {
        confirmingPassword.value = true
      }
    })

  const confirmPassword = () => {
    form.processing = true

    useFetchClient
      .post(route('password.confirm'), {
        password: form.password,
      })
      .then(({ error }) => {
        if (error.value) {
          form.processing = false
          form.error = error.value.errors.password[0]
        } else {
          form.processing = false

          closeModal()
          nextTick().then(() => emit('confirmed'))
        }
      })
  }

  const closeModal = () => {
    confirmingPassword.value = false
    form.password = ''
    form.error = ''
  }

  const isPassword = ref<boolean>(true)
</script>

<template>
  <span>
    <span @click="startConfirmingPassword">
      <slot />
    </span>

    <DialogModal :show="confirmingPassword" @close="closeModal">
      <template #title>
        {{ title ? title : $t('confirm-pass.title') }}
      </template>

      <template #content>
        {{ content ? content : $t('confirm-pass.desc') }}

        <div class="mt-4">
          <v-text-field
            v-model="form.password"
            :type="isPassword ? 'password' : 'text'"
            :append-inner-icon="isPassword ? mdiEye : mdiEyeOff"
            @click:append-inner="isPassword = !isPassword"
            class="mt-1 block w-3/4"
            :label="$t('auth.password')"
            hide-details="auto"
            :error-messages="form.error"
            autocomplete="current-password"
            @keyup.enter="confirmPassword"
          />
        </div>
      </template>

      <template #footer>
        <v-btn @click="closeModal" color="red" variant="tonal" rounded="lg">
          {{ $t('close') }}
        </v-btn>

        <v-btn
          color="primary"
          rounded="lg"
          class="ms-3"
          :prepend-icon="mdiCheck"
          :loading="form.processing"
          @click="confirmPassword"
        >
          {{ button ? button : $t('confirm') }}
        </v-btn>
      </template>
    </DialogModal>
  </span>
</template>
