<template>

  <Message severity="error" class="mb-4 max-w-[400px] w-full mx-auto" v-if="route.query.redirect && route.query.redirect !== '/'">
    Hmmm, sepertinya anda mencoba mengakses halaman
    <em>"{{ route.query.redirect }}"</em>, silahkan login terlebih dahulu
    untuk melanjutkan.
  </Message>
  <Message severity="error" class="mb-4 max-w-[400px] w-full mx-auto" v-if="loginError">
    {{ loginError }}
  </Message>

  <form @submit.prevent="handleLogin" ref="form" class="max-w-[400px] mx-auto p-4
  flex justify-center flex-col gap-4 w-full" >
      
      <img v-if="appLogo" :src="appLogo" class="h-[50px] mx-auto mb-5"/>
      <img v-else src="~/public/vd.webp" class="h-[50px] mx-auto mb-5"/>

      <IftaLabel>
          <InputText id="email" v-model="credentials.email" class="w-full" type="email" variant="filled"/>
          <label for="email">Email</label>
      </IftaLabel>
      <IftaLabel>
          <InputText type="password" id="password" v-model="credentials.password" class="w-full" />
          <label for="password">Password</label>
      </IftaLabel>

      <div class="flex items-center gap-2 text-sm opacity-70">
          <Checkbox v-model="credentials.remember" inputId="remember" name="remember" value="1" />
          <label for="remember">Remember </label>
      </div>

      <div class="text-center">

        <Button label="Login" type="submit" :loading="isLoading" class="!w-full shadow">          
          <span v-if="isLoading" class="flex items-center gap-1">
            <Icon name="lucide:loader-circle" class="animate-spin" mode="svg"/>  memproses...
          </span>
          <span v-else class="flex items-center gap-1">
            Masuk 
          </span>
        </Button>

      </div>
  </form>

</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'welcome',
    title: 'Login',
  })
  const useConfig = useConfigStore()
  const { login } = useSanctumAuth()
  const route = useRoute()
  const isLoading = ref(false)
  const appLogo = computed(() => useConfig.config.app_logo?useConfig.config.app_logo:'')

  const credentials = ref({
    email: '',
    password: '',
    remember: false
  } as any)

  const loginError = ref('')

  async function handleLogin() {
    isLoading.value = true

    if(credentials.value.remember && credentials.value.remember[0] === '1') {
      credentials.value.remember = true
    }

    try {
      await login(credentials.value)
      loginError.value = ''
      isLoading.value = false
    }
    catch (err: any) {
      loginError.value = err.response._data.message
      isLoading.value = false
    }
  }

</script>