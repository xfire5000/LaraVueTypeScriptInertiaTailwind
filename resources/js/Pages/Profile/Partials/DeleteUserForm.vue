<script setup lang="ts">
  import { useForm } from '@inertiajs/vue3'
  import { mdiAccountRemove } from '@mdi/js'
  import route from 'ziggy-js'

  const confirmingUserDeletion = ref<boolean>(false)

  const form = useForm({
    password: '',
  })

  const confirmUserDeletion = () => {
    confirmingUserDeletion.value = true
  }

  const deleteUser = () => {
    form.delete(route('current-user.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onFinish: () => form.reset(),
    })
  }

  const closeModal = () => {
    confirmingUserDeletion.value = false

    form.reset()
  }
</script>

<template>
  <ActionSection>
    <template #title> {{ $t('delete-account.title') }} </template>

    <template #description> {{ $t('delete-account.desc') }} </template>

    <template #content>
      <div class="max-w-xl text-sm text-gray-600">
        {{ $t('delete-account.info') }}
      </div>

      <div class="mt-5">
        <v-btn
          color="red"
          @click="confirmUserDeletion"
          rounded="lg"
          :prepend-icon="mdiAccountRemove"
        >
          {{ $t('delete-account.title') }}
        </v-btn>
      </div>

      <!-- Delete Account Confirmation Modal -->
      <DialogModal :show="confirmingUserDeletion" @close="closeModal">
        <template #title> {{ $t('delete-account.title') }} </template>

        <template #content>
          {{ $t('delete-account.ask') }}

          <div class="mt-4">
            <v-text-field
              v-model="form.password"
              type="password"
              class="mt-1 block w-3/4"
              :label="$t('auth.password')"
              hide-details="auto"
              autocomplete="current-password"
              @keyup.enter="deleteUser"
              :error-messages="form.errors?.password"
            />
          </div>
        </template>

        <template #footer>
          <v-btn color="red" rounded="lg" @click="closeModal">
            {{ $t('cancel') }}
          </v-btn>

          <v-btn
            color="red"
            rounded="lg"
            class="ms-3"
            :loading="form.processing"
            @click="deleteUser"
          >
            {{ $t('delete-account.title') }}
          </v-btn>
        </template>
      </DialogModal>
    </template>
  </ActionSection>
</template>
