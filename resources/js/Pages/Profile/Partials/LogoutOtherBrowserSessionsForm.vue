<script setup lang="ts">
  import { useForm } from '@inertiajs/vue3'
  import route from 'ziggy-js'

  defineProps<{ sessions: any[] }>()

  const confirmingLogout = ref<boolean>(false)

  const form = useForm({
    password: '',
  })

  const confirmLogout = () => {
    confirmingLogout.value = true
  }

  const logoutOtherBrowserSessions = () => {
    form.delete(route('other-browser-sessions.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onFinish: () => form.reset(),
    })
  }

  const closeModal = () => {
    confirmingLogout.value = false

    form.reset()
  }
</script>

<template>
  <ActionSection>
    <template #title> {{ $t('last-sessions.title') }} </template>

    <template #description>
      {{ $t('last-sessions.desc') }}
    </template>

    <template #content>
      <div class="max-w-xl text-sm text-gray-600">
        {{ $t('last-sessions.info') }}
      </div>

      <!-- Other Browser Sessions -->
      <div v-if="sessions.length > 0" class="mt-5 space-y-6">
        <div
          v-for="(session, i) in sessions"
          :key="i"
          class="flex items-center"
        >
          <div>
            <svg
              v-if="session.agent.is_desktop"
              class="w-8 h-8 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
              />
            </svg>

            <svg
              v-else
              class="w-8 h-8 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
              />
            </svg>
          </div>

          <div class="ms-3">
            <div class="text-sm text-gray-600">
              {{ session.agent.platform ? session.agent.platform : 'Unknown' }}
              - {{ session.agent.browser ? session.agent.browser : 'Unknown' }}
            </div>

            <div>
              <div class="text-xs text-gray-500">
                {{ session.ip_address }},

                <span
                  v-if="session.is_current_device"
                  class="text-green-500 font-semibold"
                  >{{ $t('last-sessions.this-device') }}</span
                >
                <span v-else
                  >{{ $t('last-sessions.last-active') }}
                  {{ session.last_active }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center mt-5">
        <v-btn color="primary" rounded="lg" @click="confirmLogout">
          {{ $t('last-sessions.logout-other') }}
        </v-btn>

        <ActionMessage :on="form.recentlySuccessful" class="ms-3">
          {{ $t('done') }}.
        </ActionMessage>
      </div>

      <!-- Log Out Other Devices Confirmation Modal -->
      <DialogModal :show="confirmingLogout" @close="closeModal">
        <template #title> {{ $t('last-sessions.logout-other') }} </template>

        <template #content>
          {{ $t('last-sessions.logout-info') }}

          <div class="mt-4">
            <v-text-field
              v-model="form.password"
              :error-messages="form.errors?.password"
              type="password"
              class="mt-1 block w-3/4"
              :label="$t('auth.password')"
              autocomplete="current-password"
              @keyup.enter="logoutOtherBrowserSessions"
            />
          </div>
        </template>

        <template #footer>
          <v-btn color="red" rounded="lg" @click="closeModal">
            {{ $t('cancel') }}
          </v-btn>

          <v-btn
            color="primary"
            rounded="lg"
            class="ms-3"
            :loading="form.processing"
            @click="logoutOtherBrowserSessions"
          >
            {{ $t('last-sessions.logout-other') }}
          </v-btn>
        </template>
      </DialogModal>
    </template>
  </ActionSection>
</template>
