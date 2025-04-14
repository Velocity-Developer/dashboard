<template>

  <UserLayoutEdit>
    
    <h3>Profile information</h3>
    <p class="text-sm text-zinc-400 mb-4">Update profile name and email address</p>
    <form @submit.prevent="handleSubmit">

      <div v-for="item in fields" :key="item.key" class="flex flex-col gap-2 py-1">
          <div class="md:basis-1/4 mb-1">
            <label :for="item.key">{{ item.label }}</label>
          </div>
          <div class="md:flex-1">
            
            <div v-if="item.type=='select'">
              <Select :id="item.key" v-model="form[item.key]" :options="item.options" optionLabel="label" optionValue="value" class="w-full" required/>
            </div>
            
            <InputText v-else :id="item.key" :type="item.type" v-model="form[item.key]" class="w-full" required/>

            <div v-if="errors[item.key]">        
              <Message severity="warn" class="my-1" closable>
                {{ errors[item.key][0] }}
              </Message>
            </div>

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

    <div class="bg-red-100 border border-red-400 p-4 rounded-md mt-5 mb-3">
      <h3 class="text-red-600 font-bold">Delete Account</h3>
      <p class="text-sm text-red-400 mb-4">Warning! Please proceed with caution, this cannot be undone.</p>
      <Button type="button" severity="danger" @click="confirmDelete">
        <Icon name="lucide:trash-2" mode="svg" class="mr-1" /> Delete Account
      </Button>
    </div>

  </UserLayoutEdit>

</template>

<script setup lang="ts">
  definePageMeta({
      title: 'Profile User',
      description: 'Pengaturan Profil User',
  })
  const useConfig = useConfigStore()
  const route = useRoute()
  const client = useSanctumClient();
  const isLoading = ref(false)
  const toast = useToast();
  const errors = ref('' as any)
  const confirm = useConfirm();

  const fields = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Active', value: 'active' }, { label: 'Deactive', value: 'deactive' }] },
    { key: 'role', label: 'Role', type: 'select', options: [{ label: 'Admin', value: 'admin' }, { label: 'Web Developer', value: 'webdeveloper' }] },
  ];

  const { data: OptionRoles} = await useAsyncData(
    'options-role',
    () => client('/api/option/roles')
  )
  const roleField = fields.find(f => f.key == 'role');
  if (roleField) {
    roleField.options = OptionRoles.value;
  }

  const form = reactive({
    name: '',
    email: '',
    status: 'active',
    password: '',
    password_confirmation: '',
    role: '',
  } as any)

  const { data: dataUser } = await useAsyncData(
    'user-'+route.params.id,
    () => client('/api/users/'+route.params.id)
  )

  if (dataUser.value) {
    form.name = dataUser.value.name
    form.email = dataUser.value.email
    form.status = dataUser.value.status
    form.role = dataUser.value.user_roles[0]
  }

  const handleSubmit = async () => {
    isLoading.value = true
    errors.value = ''

    try {          
        const response = await client(`/api/users/`+route.params.id, {
          method: 'PUT',
          body: form
        })
        toast.add({
          severity: 'success',
          summary: 'Berhasil!',
          detail: 'Data User berhasil disimpan',
          life: 3000
        });
        
        if(useConfig.config.user.id == route.params.id){
          useConfig.config.user = response
        }

      } catch (error) {
        const er = useSanctumError(error)  
        errors.value = er.bag
        console.log(errors) 
        toast.add({
            severity: 'error',
            summary: 'Gagal!',
            detail: er.msg ? er.msg : 'Terjadi kesalahan saat simpan data',
            life: 3000
        });
      }
    
    isLoading.value = false
  }

  /**
   * Confirm delete a User
   * @param {string} id
   */
   const confirmDelete = (id : any) => {
      confirm.require({
          message: 'Are you sure you want to delete this user?',
          header: 'Delete User',
          rejectLabel: 'Cancel',
          rejectProps: {
              label: 'Cancel',
              severity: 'secondary',
              outlined: true
          },
          acceptProps: {
              label: 'Delete',
              severity: 'danger'
          },
          accept: async () => {
              await client('/api/users/'+route.params.id, { method: 'DELETE' })   
              navigateTo('/users')
              toast.add({ severity: 'success', summary: 'Success', detail: 'Account has been deleted', life: 3000 });
          },
      });
  };

</script>
