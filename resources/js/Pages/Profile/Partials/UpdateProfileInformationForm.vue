<script setup lang="ts">
  import { router, useForm, usePage } from '@inertiajs/vue3'
  import {
    mdiCameraOutline,
    mdiDotsHorizontal,
    mdiTrashCanOutline,
  } from '@mdi/js'
  import route from 'ziggy-js'

  const props = defineProps<{ user: IUserItem }>()

  const form = useForm<{
    _method: string
    name: string
    email: string
    photo: File | null
  }>({
    _method: 'PUT',
    name: props.user.name,
    email: props.user.email,
    photo: null,
  })

  const verificationLinkSent = ref<boolean>(false)
  const photoPreview = ref<string | null>(null)
  const photoInput = ref<HTMLInputElement | null>(null)

  const updateProfileInformation = () => {
    if (photoInput.value && photoInput.value.files) {
      form.photo = photoInput.value.files[0]
    }

    form.post(route('user-profile-information.update'), {
      errorBag: 'updateProfileInformation',
      preserveScroll: true,
      onSuccess: () => clearPhotoFileInput(),
    })
  }

  const sendEmailVerification = () => {
    verificationLinkSent.value = true
  }

  const selectNewPhoto = () => {
    if (photoInput.value) photoInput.value.click()
  }

  const updatePhotoPreview = () => {
    const photo =
      photoInput.value && photoInput.value.files
        ? photoInput.value.files[0]
        : null

    if (!photo) return

    const reader = new FileReader()

    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }

    reader.readAsDataURL(photo)
  }

  const deletePhoto = () => {
    router.delete(route('current-user-photo.destroy'), {
      preserveScroll: true,
      onSuccess: () => {
        photoPreview.value = null
        clearPhotoFileInput()
      },
    })
  }

  const clearPhotoFileInput = () => {
    if (photoInput.value?.value) {
      photoInput.value.value = ''
    }
  }

  const $page = usePage<InertiaPageProps>()
</script>

<template>
  <FormSection @submitted="updateProfileInformation">
    <template #title> {{ $t('profile-info') }} </template>

    <template #description>
      {{ $t('profile-desc') }}
    </template>

    <template #form>
      <!-- Profile Photo -->
      <div
        v-if="$page.props.jetstream['managesProfilePhotos']"
        class="col-span-6 sm:col-span-4"
      >
        <!-- Profile Photo File Input -->
        <input
          id="photo"
          ref="photoInput"
          type="file"
          class="hidden"
          @change="updatePhotoPreview"
        />

        <InputLabel for="photo" :value="$t('photo')" />

        <div class="relative">
          <!-- Current Profile Photo -->
          <div v-if="!photoPreview" class="mt-2">
            <img
              :src="user.profile_photo_url"
              :alt="user.name"
              class="rounded-full h-20 w-20 object-cover"
            />
          </div>

          <!-- New Profile Photo Preview -->
          <div v-else class="mt-2">
            <span
              class="block rounded-full w-20 h-20 bg-cover bg-no-repeat bg-center"
              :style="'background-image: url(\'' + photoPreview + '\');'"
            />
          </div>

          <v-menu location="bottom">
            <template #activator="{ props: menu }">
              <v-btn
                :icon="mdiDotsHorizontal"
                size="x-small"
                color="secondary"
                class="absolute -bottom-1 -right-1"
                v-bind="menu"
              />
            </template>
            <v-list>
              <v-list-item
                @click="selectNewPhoto"
                :append-icon="mdiCameraOutline"
                >{{ $t('add-new-profile-image') }}</v-list-item
              >
              <v-list-item
                :prepend-icon="mdiTrashCanOutline"
                v-if="user.profile_photo_path"
                @click="deletePhoto"
                >{{ $t('remove-profile-image') }}</v-list-item
              >
            </v-list>
          </v-menu>
        </div>

        <InputError :message="form.errors.photo" class="mt-2" />
      </div>

      <!-- Name -->
      <div class="col-span-6 sm:col-span-4">
        <v-text-field
          :label="$t('name')"
          v-model="form.name"
          :error-messages="form.errors?.name"
          hide-details="auto"
        />
      </div>

      <!-- Email -->
      <div class="col-span-6 sm:col-span-4">
        <v-text-field
          hide-details="auto"
          v-model="form.email"
          :error-messages="form.errors?.email"
          :label="$t('auth.email')"
        />

        <div
          v-if="
            $page.props.jetstream['hasEmailVerification'] &&
            user.email_verified_at === null
          "
        >
          <v-alert type="error" class="text-sm mt-2" rounded="lg">
            <template #text>
              {{ $t('verifications.email-unverified') }}
            </template>

            <Link
              :href="route('verification.send')"
              method="post"
              as="button"
              class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click.prevent="sendEmailVerification"
            >
              {{ $t('verifications.resend-verification') }}
            </Link>
          </v-alert>

          <div
            v-show="verificationLinkSent"
            class="mt-2 font-medium text-sm text-green-600"
          >
            {{ $t('verifications.link-sent') }}
          </div>
        </div>
      </div>
    </template>

    <template #actions>
      <ActionMessage :on="form.recentlySuccessful" class="me-3">
        {{ $t('verifications.saved') }}.
      </ActionMessage>

      <v-btn
        type="submit"
        :loading="form.processing"
        color="primary"
        rounded="lg"
        >{{ $t('submit-store') }}</v-btn
      >
    </template>
  </FormSection>
</template>
