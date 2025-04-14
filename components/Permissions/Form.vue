<template>
  <div>

    <div class="text-end">
      <Button @click="openDialog(null,'add')" size="small">
        <Icon name="lucide:plus"/> Add New
      </Button>
    </div>
    
    <DataTable :value="data" size="small" stripedRows scrollable>
      <Column field="name" header="Name"></Column>
      <Column field="guard_name" header="Guard Name"></Column>
      <Column field="options" header="">
        <template #body="slotProps">
          <div class="flex gap-2 justify-end items-center">
              <Button @click="openDialog(slotProps.data,'edit')" severity="secondary" size="small">
                <Icon name="lucide:pen" size="small"/>
              </Button>
              <Button @click="confirmDelete(slotProps.data.name)" severity="danger" size="small">
                <Icon name="lucide:trash-2" size="small"/>
              </Button>
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialog" :header="selectedItem ? 'Edit Permission' : 'Add New Permission'" :style="{ width: '30rem', minHeight: '20vh' }" :breakpoints="{ '1000px': '30rem', '768px': '90vw' }" :modal="true">
      <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="name" class="form-label">Name</label>
            <InputText v-model="form.name" id="name" type="text" class="w-full" required/>
            <Message size="small" severity="secondary" variant="simple">huruf kecil tanpa spasi contoh: view-dashboard</Message>
          </div>
          <div class="text-end mt-5">
            <Button type="submit">
              <div class="flex items-center gap-1 animate-pulse" v-if="isLoading"><Icon name="lucide:loader-circle" class="animate-spin"/> memproses..</div> 
              <div class="flex items-center gap-1" v-else><Icon name="lucide:save" /> Simpan</div>             
            </Button>
          </div>
      </form>
    </Dialog>
    
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['update'])
const client = useSanctumClient();
const { data, status, error, refresh } = await useAsyncData(
    'permissions',
    () => client('/api/permissions')
)

const form = reactive({
    name: '',
})

const dialog = ref(false);
const dialogAction = ref('add');
const selectedItem = ref();
const isLoading = ref(false)
const toast = useToast();
const openDialog = (data: any, action: any) => {
    dialog.value = true;
    selectedItem.value = data;    
    dialogAction.value = action;

    if(action === 'edit') {
        form.name = data.name
    } else {
        form.name = ''
    }
}

const handleSubmit = async () => {
    isLoading.value = true;

    if(dialogAction.value === 'add') {        
          try {
            const response = await client(`/api/permissions`, {
                method: 'POST',
                body: form
            })
            refresh(); 
            toast.add({
              severity: 'success',
              summary: 'Berhasil!',
              detail: 'Permission Role berhasil disimpan',
              life: 3000
            });
            dialog.value = false;
            emit('update')
        } catch (error: any) {
            const er = useSanctumError(error)
            toast.add({
                severity: 'error',
                summary: 'Gagal!',
                detail: error.response._data.message ? error.response._data.message : 'Terjadi kesalahan saat menambahkan data',
                life: 3000
            });
        }
    } else if(dialogAction.value === 'edit') {
        client(`/api/permissions/${selectedItem.value.name}`, {
            method: 'PUT',
            body: form
        }).then(() => {
            refresh();
            dialog.value = false;
            emit('update')
            toast.add({
              severity: 'success',
              summary: 'Berhasil!',
              detail: 'Permission Role berhasil disimpan',
              life: 3000
            });
        });
    }

    isLoading.value = false
}

const confirm = useConfirm();
const confirmDelete = (name: any) => {
    confirm.require({
        message: 'Anda yakin hapus Permission ini ?',
        header: 'Peringatan Hapus Permission Role',
        accept: () => {
            client(`/api/permissions/${name}`, {
                method: 'DELETE',
            }).then(() => {
                refresh();
                toast.add({
                  severity: 'success',
                  summary: 'Berhasil!',
                  detail: 'Permission Role berhasil dihapus',
                  life: 3000
                });
                emit('update')
            });
        },
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Hapus',
            severity: 'danger',
            outlined: false
        },
        reject: () => {
            //callback to execute when user rejects to delete
        }
    });
}
</script>
