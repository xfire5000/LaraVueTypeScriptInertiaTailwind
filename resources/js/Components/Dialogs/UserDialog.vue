<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
  import DialogModal from '../DialogModal.vue'
  import {
    mdiAccount,
    mdiAccountPlus,
    mdiAccountStar,
    mdiAt,
    mdiBackupRestore,
    mdiCheck,
    mdiEyeOffOutline,
    mdiEyeOutline,
    mdiLockOutline,
    mdiPencil,
    mdiPlus,
  } from '@mdi/js'
  import { TransitionSlide } from '@morev/vue-transitions'
  import { useForm } from 'laravel-precognition-vue'
  import { toast } from 'vue3-toastify'
  import route from 'ziggy-js'

  interface IProps {
    initialForm?: IUserItem
    show: boolean
    roles: IRoleItem[]
    addressTypes: { title: string; value: string }[]
  }

  const props = withDefaults(defineProps<IProps>(), {
    show: false,
    initialForm: () => ({
      name: '',
      email: '',
      password: '',
    }),
  })

  const form = useForm('post', route('users.store'), {
    ...props.initialForm,
    password_confirmation: '',
    change_pass: !props.initialForm.id,
  })

  watch(
    () => props.initialForm,
    (newVal: IUserItem) => {
      if (props.show && props.initialForm.id) {
        let data = newVal
        data.roles = (newVal.roles as IRoleItem[]).map((role) => role.name)
        form.setData(data)
      }
    },
  )

  const emit = defineEmits(['submitted', 'close'])

  const submit = () =>
    form.submit({
      method: form.id ? 'patch' : 'post',
      url: form.id ? route('users.update', form.id) : route('users.store'),
      onSuccess(res) {
        toast(res.data.msg, { type: 'success' })
        emit('submitted', res.data.item)
        form.reset()
        if (!form.id) emit('close')
      },
    })

  onUpdated(() => {
    if (form.id && !props.show) form.id = undefined
  })

  const typeChange = reactive({
    isPassword: true,
    isPasswordConf: true,
  })
</script>

<template lang="pug">
DialogModal(:closeable="false", :show, @close="emit('close')")
  template(#title)
    .flex.flex-row.items-center.gap-x-2
      v-icon(size="small") {{ mdiAccountPlus }}
      | {{ form.id ? $t('edit', { name: $t('user') }) : $t('add', { name: $t('user') }) }}
  template(#content)
    v-row
      v-col(cols="12", md="4")
        v-text-field(
          ::="form.name",
          :error-messages="form.errors?.name",
          :label="$t('user-infos.name')",
          :prepend-inner-icon="mdiAccount",
          :rules="[rules.required]",
          hide-details="auto"
        )
      v-col(cols="12", md="4")
        v-text-field(
          ::="form.email",
          :error-messages="form.errors?.email",
          :label="$t('user-infos.email')",
          :prepend-inner-icon="mdiAt",
          :rules="[rules.required, rules.email]",
          hide-details="auto",
          type="email"
        )
      v-col(cols="12", md="4")
        v-autocomplete(
          ::="form.roles",
          :error-messages="form.errors?.roles",
          :items="roles",
          :label="$t('role')",
          :prepend-inner-icon="mdiAccountStar",
          hide-details="auto",
          item-title="title",
          item-value="name",
          multiple
        )
      v-col(cols="12", v-if="form.id")
        v-checkbox(
          ::="form.change_pass",
          :label="$t('auth.change-password')",
          color="primary",
          hide-details="auto"
        )
      TransitionSlide
        v-col(cols="12", v-if="form.change_pass")
          .grid.grid-cols-2.gap-2
            div(class="lg:col-span-1").col-span-full
              v-text-field(
                ::="form.password",
                :append-inner-icon="typeChange.isPassword ? mdiEyeOutline : mdiEyeOffOutline",
                :error-messages="form.errors?.password",
                :label="$t('auth.password')",
                :prepend-inner-icon="mdiLockOutline",
                :rules="[rules.required]",
                :type="typeChange.isPassword ? 'password' : 'text'",
                @click:append-inner="typeChange.isPassword = !typeChange.isPassword",
                hide-details="auto"
              )
            div(class="lg:col-span-1").col-span-full
              v-text-field(
                ::="form.password_confirmation",
                :append-inner-icon="typeChange.isPasswordConf ? mdiEyeOutline : mdiEyeOffOutline",
                :error-messages="form.errors?.password_confirmation",
                :label="$t('auth.password_conf')",
                :prepend-inner-icon="mdiBackupRestore",
                :rules="[rules.required]",
                :type="typeChange.isPasswordConf ? 'password' : 'text'",
                @click:append-inner="typeChange.isPasswordConf = !typeChange.isPasswordConf",
                hide-details="auto"
              )
  template(#footer)
    v-btn(
      :color="form.id ? 'secondary' : 'success'",
      :disabled="!form.name.length || !form.roles?.length || !form.email.length",
      :prepend-icon="form.id ? mdiPencil : mdiCheck",
      @click="submit",
      rounded="lg"
    ) {{ form.id ? $t('submit-edit') : $t('submit-store') }}
</template>
