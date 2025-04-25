<template>
  <DashUserLayoutEdit>

    <h3>Update password</h3>
    <p class="text-sm text-zinc-400 mb-4">Ensure your account is using a long, random password to stay secure</p>

    <form @submit.prevent="handleSubmit">
      
      <div v-for="item in fields" :key="item.key" class="flex flex-col gap-2 py-1">
          <div class="md:basis-1/4 mb-1">
            <label :for="item.key">{{ item.label }}</label>
          </div>
          <div class="md:flex-1">
            <InputText v-model="form[item.key]" :id="item.key" :type="item.type" class="w-full" :placeholder="item.label" required/>
          </div>
      </div>
      <div class="text-end mt-3">
        <Button type="submit">
          <span v-if="isLoading" class="flex items-center gap-1">
            <Icon name="lucide:loader-circle" mode="svg" class="mr-1 animate-spin" /> proses..
          </span>
          <span v-else class="flex items-center gap-1">
            <Icon name="lucide:save" mode="svg" class="mr-1" /> Simpan
          </span>
        </Button>
      </div>

    </form>

  </DashUserLayoutEdit>
</template>

<script setup lang="ts">
  definePageMeta({
    title: 'Profile User',
    description: 'Pengaturan Password User',
  })
  const route = useRoute()
  const client = useSanctumClient();
  const isLoading = ref(false)
  const toast = useToast();
  const errors = ref('' as any)

  const fields = [
    { key: 'password', label: 'New password', type: 'password' },
    { key: 'password_confirmation', label: 'Confirm password', type: 'password' },
  ];

  const form = reactive({
    password: '',
    password_confirmation: '',
  } as any)
  
  const handleSubmit = async () => {
    isLoading.value = true
    errors.value = ''

    try {          
        const response = await client(`/api/user/updatepassword/`+route.params.id, {
          method: 'PUT',
          body: form
        })
        toast.add({
          severity: 'success',
          summary: 'Berhasil!',
          detail: 'Password berhasil diubah',
          life: 3000
        });
      } catch (error) {
        const er = useSanctumError(error)  
        errors.value = er.bag
        console.log(errors) 
        toast.add({
            severity: 'error',
            summary: 'Gagal!',
            detail: er.msg ? er.msg : 'Terjadi kesalahan saat ubah password',
            life: 3000
        });
      }

    isLoading.value = false
  }

</script>
