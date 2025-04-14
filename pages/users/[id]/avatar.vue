<template>
  <UserLayoutEdit>
    
    <h3>Update Avatar Photo</h3>
    <p class="text-sm text-zinc-400 mb-4">Upload an image for the user profile photo, use a square ratio and size less than 1mb</p>

    <form @submit.prevent="handleSubmit" class="md:max-w-[300px]">
      <img v-if="previewImage" :src="previewImage" alt="Image" class="mb-2 shadow-md rounded-md w-full sm:w-64" />


      <div class="flex justify-between gap-2">
        <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="warning" class="w-full"/>

        <Button type="submit" class="w-full">
          <div class="flex items-center gap-1 animate-pulse" v-if="isLoading"><Icon name="lucide:loader-circle" class="animate-spin"/> memproses..</div> 
          <div class="flex items-center gap-1" v-else><Icon name="lucide:save" /> Simpan</div>             
        </Button>
      </div>

    </form>

  </UserLayoutEdit>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Profile User',
  description: 'Pengaturan Avatar User',
})

const route = useRoute()
const client = useSanctumClient();
const useConfig = useConfigStore()
const isLoading = ref(false)
const toast = useToast();
const errors = ref('' as any)

const form = reactive({
  image: null,
})

const previewImage = ref(null as any)
function onFileSelect(event: any) {
  previewImage.value = URL.createObjectURL(event.files[0]);
  form.image = event.files[0]
}

const { data: dataUser } = await useAsyncData(
    'user-'+route.params.id,
    () => client('/api/users/'+route.params.id)
)
previewImage.value = dataUser.value.avatar_url

const handleSubmit = async () => {
    if(form.image){
      
      isLoading.value = true
      errors.value = ''
      const formData = new FormData();
      formData.append('image', form.image);

      try {
        const res = await client(`/api/user/updateavatar/`+route.params.id, {
          method: 'PUT',
          body: formData
        })
        toast.add({
          severity: 'success',
          summary: 'Berhasil!',
          detail: 'Avatar berhasil diubah',
          life: 3000
        });

        if(useConfig.config.user.id == route.params.id){
          useConfig.config.user.avatar_url = res.avatar_url
        }

      } catch (error) {
        const er = useSanctumError(error)  
        errors.value = er.bag
        console.log(errors) 
        toast.add({
            severity: 'error',
            summary: 'Gagal!',
            detail: er.msg ? er.msg : 'Terjadi kesalahan saat ubah avatar',
            life: 3000
        });
      }
      isLoading.value = false

    } else {
       
      toast.add({
          severity: 'warn',
          summary: 'Gagal!',
          detail: 'Gambar tidak boleh kosong',
          life: 3000
      });
    }
}
</script>
