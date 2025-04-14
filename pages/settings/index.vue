<template>

  <Card class="md:w-[40rem]">
    <template #content>
      
      <form @submit.prevent="handleSubmit">
            
        <div class="flex flex-col mb-4">
          <label class="text-sm mb-2" for="app_name">Nama Aplikasi</label>
          <InputText v-model="form.app_name" id="app_name" type="text" class="w-full" required/>
        </div>
        <div class="flex flex-col mb-4">
          <label class="text-sm mb-2" for="app_description">Deskripsi Aplikasi</label>
          <Textarea v-model="form.app_description" id="app_description" type="text" class="w-full" required/>
        </div>

        <hr class="mb-5">

        
        <div class="flex flex-col md:flex-row gap-5 mb-4">
          
          <div class="flex flex-col mb-4">
            <label class="text-sm mb-2" for="app_logo">Logo Aplikasi</label>
            <img v-if="previewLogo" :src="previewLogo" alt="Image" class="mb-2 shadow-md rounded-md w-full sm:w-64" />
            <div class="w-[6rem]">
              <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary" class="!justify-end"/>
            </div>
          </div>

          <div class="flex flex-col mb-4">
            <label class="text-sm mb-2" for="app_logo_small">Logo Aplikasi (small)</label>
            <img v-if="previewLogoSmall" :src="previewLogoSmall" alt="Image" class="mb-2 shadow-md rounded-md max-w-[80px] aspect-square" />
            <div class="w-[6rem]">
              <FileUpload mode="basic" @select="onLogoSmallSelect" customUpload auto severity="secondary" class="!justify-end"/>
            </div>
          </div>
            
          <div class="flex flex-col mb-4">
            <label class="text-sm mb-2" for="app_favicon">Favicon Aplikasi</label>
            <img v-if="previewFavicon" :src="previewFavicon" alt="Image" class="mb-2 max-w-[80px] shadow-md rounded-md w-auto aspect-square" />
            <div class="w-[6rem]">
              <FileUpload mode="basic" @select="onFaviconSelect" customUpload auto severity="secondary" class="!justify-end"/>
            </div>
          </div>

        </div>
            
        <div class="flex flex-col mb-4">
          <label class="text-sm mb-2" for="bg_welcome">Background Welcome</label>
          <img v-if="previewBGwelcome" :src="previewBGwelcome" alt="Image" class="mb-2 shadow-md rounded-md w-full" />
          <div class="w-[6rem]">
            <FileUpload mode="basic" @select="onBGwelcomeSelect" customUpload auto severity="secondary" class="!justify-end"/>
          </div>
        </div>

        <div class="text-end mt-5">
          <Button type="submit">
            <div class="flex items-center gap-1 animate-pulse" v-if="isLoading"><Icon name="lucide:loader-circle" class="animate-spin"/> memproses..</div> 
            <div class="flex items-center gap-1" v-else><Icon name="lucide:save" /> Simpan</div>             
          </Button>
        </div>
      </form>

    </template>
  </Card>

</template>

<script setup lang="ts">
definePageMeta({
    title: 'Pengaturan Umum',
    description: 'Pengaturan Umum di Aplikasi',
})

const useConfig = useConfigStore()
const client = useSanctumClient();
const toast = useToast();
const isLoading = ref(false)

const form = reactive({
  app_name: '',
  app_description: '',
  app_logo: null,
  app_logo_small: null,
  app_favicon: null,
  bg_welcome: null
})

const previewLogo = ref(null as any)
function onFileSelect(event: any) {
    previewLogo.value = URL.createObjectURL(event.files[0]);
    form.app_logo = event.files[0]
}

const previewLogoSmall = ref(null as any)
function onLogoSmallSelect(event: any) {
  previewLogoSmall.value = URL.createObjectURL(event.files[0]);
  form.app_logo_small = event.files[0]
}

const previewFavicon = ref(null as any)
function onFaviconSelect(event: any) {
  previewFavicon.value = URL.createObjectURL(event.files[0]);
  form.app_favicon = event.files[0]
}

const previewBGwelcome = ref(null as any)
function onBGwelcomeSelect(event: any) {
  previewBGwelcome.value = URL.createObjectURL(event.files[0]);
  form.bg_welcome = event.files[0]
}

onMounted(async () => {
  const { data } = await useAsyncData(
    'config',
    () => client('/api/config')
  )
  form.app_name = data.value.app_name
  form.app_description = data.value.app_description
  previewLogo.value = data.value.app_logo
  previewLogoSmall.value = data.value.app_logo_small
  previewFavicon.value = data.value.app_favicon
})

const handleSubmit = async () => {
  isLoading.value = true
  
  const formData = new FormData();
  formData.append('app_name', form.app_name);
  formData.append('app_description', form.app_description);

  if (form.app_logo) {
    formData.append('app_logo', form.app_logo);
  }

  if (form.app_logo_small) {
    formData.append('app_logo_small', form.app_logo_small);
  }
  if (form.app_favicon) {
    formData.append('app_favicon', form.app_favicon);
  }
  if(form.bg_welcome){
    formData.append('bg_welcome', form.bg_welcome);
  }

  try {
    const res = await client('/api/setconfig', {
      method: 'POST',
      body: formData
    })
    toast.add({
      severity: 'success',
      summary: 'Berhasil!',
      detail: 'Pengaturan aplikasi berhasil disimpan',
      life: 3000
    });
    
    const getconfig = await client('/api/config');
    useConfig.setConfig(getconfig);

  } catch (error) {
    toast.add({
      severity: 'warn',
      summary: 'Gagal!',
      detail: 'Pengaturan aplikasi gagal disimpan',
      life: 3000
    });
  }
  isLoading.value = false
}
</script>
