<template>
  <form @submit.prevent="handleSubmit">

    <div v-for="item in fields" :key="item.key" class="flex flex-col md:flex-row border-b dark:border-zinc-800 py-1">
        <div class="md:basis-1/4 mb-1">
          <label :for="item.key">{{ item.label }}</label>
        </div>
        <div class="md:flex-1">
          
          <Textarea v-if="item.type=='textarea'" :id="item.key" v-model="form[item.key]" class="w-full"></Textarea>
          
          <InputText v-else :id="item.key" :type="item.type" v-model="form[item.key]" class="w-full" required/>

        </div>
    </div>
    
    <div class="text-end mt-3">
      <Button type="submit" :loading="isLoading">
        <span v-if="isLoading" class="flex items-center gap-1">
          <Icon name="lucide:loader-circle" mode="svg" class="mr-1 animate-spin" /> proccess..
        </span>
        <span v-else class="flex items-center gap-1">
          <Icon name="lucide:save" mode="svg" class="mr-1" /> Save
        </span>
      </Button>
    </div>

  </form>

</template>

<script setup lang="ts">
  const emit = defineEmits(['update'])
  const props = defineProps(['data','action','taxonomy'])
  const data = props.data
  const action = props.action
  const taxonomy = props.taxonomy
  const client = useSanctumClient();
  const isLoading = ref(false)
  const toast = useToast();
  const errors = ref('' as any)

  const fields = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },];

  const form = reactive({
    name: '',
    description: '',
    taxonomy: taxonomy||'category'
  } as any)

  //update form dari data
  if (data) {
    form.name = data.name
    form.description = data.description
  }

  const handleSubmit = async () => {
    isLoading.value = true
    errors.value = ''

    if(action == 'add'){
      try {          
        const response = await client(`/api/terms`, {
          method: 'POST',
          body: form
        })
        toast.add({
          severity: 'success',
          summary: 'Berhasil!',
          detail: 'Data Terms berhasil ditambah',
          life: 3000
        });
        emit('update')
      } catch (error) {
        isLoading.value = true
        const er = useSanctumError(error)  
        errors.value = er.bag
        toast.add({
            severity: 'error',
            summary: 'Gagal!',
            detail: er.msg ? er.msg : 'Terjadi kesalahan saat menambahkan data',
            life: 3000
        });
      }
    } else if(action == 'edit') {
      try {          
        const response = await client(`/api/terms/`+data.id, {
          method: 'PUT',
          body: form
        })
        toast.add({
          severity: 'success',
          summary: 'Berhasil!',
          detail: 'Data Term berhasil disimpan',
          life: 3000
        });
        emit('update')
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
    }
    
    isLoading.value = false
  }

</script>
