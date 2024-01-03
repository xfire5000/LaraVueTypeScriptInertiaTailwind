<script setup lang="ts">
  import { router, useForm, usePage } from '@inertiajs/vue3'
  import { mdiCheck } from '@mdi/js'
  import route from 'ziggy-js'

  const props = defineProps<{ requiresConfirmation: boolean }>()

  const page = usePage<InertiaPageProps>()
  const enabling = ref<boolean>(false)
  const confirming = ref<boolean>(false)
  const disabling = ref<boolean>(false)
  const qrCode = ref(null)
  const setupKey = ref(null)
  const recoveryCodes = ref([])

  const confirmationForm = useForm({
    code: '',
  })

  const twoFactorEnabled = computed(
    () => !enabling.value && page.props.auth['user']?.two_factor_enabled,
  )

  watch(twoFactorEnabled, () => {
    if (!twoFactorEnabled.value) {
      confirmationForm.reset()
      confirmationForm.clearErrors()
    }
  })

  const enableTwoFactorAuthentication = () => {
    enabling.value = true

    router.post(
      route('two-factor.enable'),
      {},
      {
        preserveScroll: true,
        onSuccess: () =>
          Promise.all([showQrCode(), showSetupKey(), showRecoveryCodes()]),
        onFinish: () => {
          enabling.value = false
          confirming.value = props.requiresConfirmation
        },
      },
    )
  }

  const showQrCode = () => {
    return useFetchClient
      .get<{ svg: any }>(route('two-factor.qr-code'))
      .then(({ data }) => {
        qrCode.value = data.value?.svg
      })
  }

  const showSetupKey = () => {
    return useFetchClient
      .get<{ secretKey: any }>(route('two-factor.secret-key'))
      .then(({ data }) => {
        setupKey.value = data.value?.secretKey
      })
  }

  const showRecoveryCodes = () => {
    return useFetchClient
      .get<any>(route('two-factor.recovery-codes'))
      .then(({ data }) => {
        recoveryCodes.value = data.value
      })
  }

  const confirmTwoFactorAuthentication = () => {
    confirmationForm.post(route('two-factor.confirm'), {
      errorBag: 'confirmTwoFactorAuthentication',
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        confirming.value = false
        qrCode.value = null
        setupKey.value = null
      },
    })
  }

  const regenerateRecoveryCodes = () => {
    useFetchClient
      .post(route('two-factor.recovery-codes'))
      .then(() => showRecoveryCodes())
  }

  const disableTwoFactorAuthentication = () => {
    disabling.value = true

    router.delete(route('two-factor.disable'), {
      preserveScroll: true,
      onSuccess: () => {
        disabling.value = false
        confirming.value = false
      },
    })
  }
</script>

<template>
  <ActionSection>
    <template #title> {{ $t('two-factor-auth.title') }} </template>

    <template #description>
      {{ $t('two-factor-auth.desc') }}
    </template>

    <template #content>
      <h3
        v-if="twoFactorEnabled && !confirming"
        class="text-lg font-medium text-gray-900 dark:text-white"
      >
        {{ $t('two-factor-auth.activated') }}
      </h3>

      <h3
        v-else-if="twoFactorEnabled && confirming"
        class="text-lg font-medium text-gray-900 dark:text-white"
      >
        {{ $t('two-factor-auth.finished') }}
      </h3>

      <h3 v-else class="text-lg font-medium text-gray-900 dark:text-white">
        {{ $t('two-factor-auth.deactivated') }}
      </h3>

      <div class="mt-3 max-w-xl text-sm text-gray-600">
        <p>
          {{ $t('two-factor-auth.info') }}
        </p>
      </div>

      <div v-if="twoFactorEnabled">
        <div v-if="qrCode">
          <div class="mt-4 max-w-xl text-sm text-gray-600">
            <p v-if="confirming" class="font-semibold">
              To finish enabling two factor authentication, scan the following
              QR code using your phone's authenticator application or enter the
              setup key and provide the generated OTP code.
            </p>

            <p v-else>
              Two factor authentication is now enabled. Scan the following QR
              code using your phone's authenticator application or enter the
              setup key.
            </p>
          </div>

          <div class="mt-4 p-2 inline-block bg-white" v-html="qrCode" />

          <div v-if="setupKey" class="mt-4 max-w-xl text-sm text-gray-600">
            <p class="font-semibold">
              Setup Key: <span v-html="setupKey"></span>
            </p>
          </div>

          <div v-if="confirming" class="mt-4">
            <InputLabel for="code" value="Code" />

            <TextInput
              id="code"
              v-model="confirmationForm.code"
              type="text"
              name="code"
              class="block mt-1 w-1/2"
              inputmode="numeric"
              autofocus
              autocomplete="one-time-code"
              @keyup.enter="confirmTwoFactorAuthentication"
            />

            <InputError :message="confirmationForm.errors.code" class="mt-2" />
          </div>
        </div>

        <div v-if="recoveryCodes.length > 0 && !confirming">
          <div class="mt-4 max-w-xl text-sm text-gray-600">
            <p class="font-semibold">
              Store these recovery codes in a secure password manager. They can
              be used to recover access to your account if your two factor
              authentication device is lost.
            </p>
          </div>

          <div
            class="grid gap-1 max-w-xl mt-4 px-4 py-4 font-mono text-sm bg-gray-100 rounded-lg"
          >
            <div v-for="code in recoveryCodes" :key="code">
              {{ code }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <div v-if="!twoFactorEnabled">
          <ConfirmsPassword @confirmed="enableTwoFactorAuthentication">
            <v-btn
              color="primary"
              rounded="lg"
              type="button"
              :loading="enabling"
            >
              {{ $t('enable') }}
            </v-btn>
          </ConfirmsPassword>
        </div>

        <div v-else>
          <ConfirmsPassword @confirmed="confirmTwoFactorAuthentication">
            <v-btn
              v-if="confirming"
              color="primary"
              :prepend-icon="mdiCheck"
              rounded="lg"
              type="button"
              class="me-3"
              :class="{ 'opacity-25': enabling }"
              :disabled="enabling"
            >
              {{ $t('confirm') }}
            </v-btn>
          </ConfirmsPassword>

          <ConfirmsPassword @confirmed="regenerateRecoveryCodes">
            <v-btn
              color="secondary"
              rounded="lg"
              v-if="recoveryCodes.length > 0 && !confirming"
              class="me-3"
            >
              {{ $t('two-factor-auth.regenerate') }}
            </v-btn>
          </ConfirmsPassword>

          <ConfirmsPassword @confirmed="showRecoveryCodes">
            <v-btn
              color="secondary"
              rounded="lg"
              v-if="recoveryCodes.length === 0 && !confirming"
              class="me-3"
            >
              {{ $t('two-factor-auth.show-recovery-code') }}
            </v-btn>
          </ConfirmsPassword>

          <ConfirmsPassword @confirmed="disableTwoFactorAuthentication">
            <v-btn
              color="red"
              rounded="lg"
              v-if="confirming"
              :loading="disabling"
            >
              {{ $t('cancel') }}
            </v-btn>
          </ConfirmsPassword>

          <ConfirmsPassword @confirmed="disableTwoFactorAuthentication">
            <v-btn color="red" rounded="lg" v-if="!confirming">
              {{ $t('disable') }}
            </v-btn>
          </ConfirmsPassword>
        </div>
      </div>
    </template>
  </ActionSection>
</template>
