<script setup lang="ts">
  import { useForm } from '@inertiajs/vue3'
  import route from 'ziggy-js'

  const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const updatePassword = () => {
    form.put(route('user-password.update'), {
      errorBag: 'updatePassword',
      preserveScroll: true,
      onSuccess: () => form.reset(),
      onError: () => {
        if (form.errors.password) {
          form.reset('password', 'password_confirmation')
        }

        if (form.errors.current_password) {
          form.reset('current_password')
        }
      },
    })
  }
</script>

<template>
  <FormSection @submitted="updatePassword">
    <template #title> {{ $t('update-password') }} </template>

    <template #description>
      {{ $t('update-pass-desc') }}
    </template>

    <template #form>
      <div class="col-span-6 sm:col-span-4">
        <v-text-field
          ref="currentPasswordInput"
          :label="$t('verifications.current-pass')"
          v-model="form.current_password"
          :error-messages="form.errors?.current_password"
          type="password"
          hide-details="auto"
          autocomplete="current-password"
        />
      </div>

      <div class="col-span-6 sm:col-span-4">
        <v-text-field
          ref="passwordInput"
          :label="$t('verifications.new-pass')"
          v-model="form.password"
          :error-messages="form.errors?.password"
          type="password"
          hide-details="auto"
          autocomplete="new-password"
        />
      </div>

      <div class="col-span-6 sm:col-span-4">
        <v-text-field
          :label="$t('verifications.conf-pass')"
          v-model="form.password_confirmation"
          :error-messages="form.errors?.password_confirmation"
          type="password"
          hide-details="auto"
          autocomplete="new-password"
        />
      </div>
    </template>

    <template #actions>
      <ActionMessage :on="form.recentlySuccessful" class="me-3">
        {{ $t('verifications.saved') }}.
      </ActionMessage>

      <v-btn
        :loading="form.processing"
        color="primary"
        type="submit"
        rounded="lg"
        >{{ $t('submit-store') }}</v-btn
      >
    </template>
  </FormSection>
</template>
