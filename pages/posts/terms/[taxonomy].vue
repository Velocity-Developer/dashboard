<template>
  <div v-if="taxonomy" class="bg-primary-50 dark:bg-zinc-800 p-3 md:p-5 rounded-lg mb-3 md:mb-5">
      <h1 class="text-lg md:text-2xl font-medium text-zinc-700 dark:text-primary-400 capitalize">
          {{ taxonomy }}
      </h1>
      <div class="text-sm text-zinc-400">
        Terms posts
      </div>
    </div>
    
  <div>
    <div class="text-end">
      <Button type="button" @click="openDialog(null,'add')" size="small">
        <Icon name="lucide:plus" /> Add New
      </Button>
    </div>
    <DataTable v-if="data" :value="data.data" v-model:selection="selectedPosts" size="small" stripedRows scrollable>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="name" header="Name"/>
      <Column field="slug" header="Slug"/>
      <Column field="description" header="Description"/>
      <Column field="" header="">
        <template #body="slotProps">
          <div v-if="slotProps.data.name!='Uncategorized'" class="flex justify-end items-center gap-1">
            <Button @click="openDialog(slotProps.data,'edit')" type="button" severity="secondary" size="small" variant="text" class="!px-1">
              <Icon name="lucide:pen" size="small"/>
            </Button>
            <Button @click="confirmDelete(slotProps.data.id)" type="button" severity="danger" size="small" variant="text" class="!px-1">
              <Icon name="lucide:trash-2" size="small"/>
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
    <div class="flex flex-col md:flex-row md:justify-between gap-3 mt-4 mb-5">
      <div>
        <span class="text-sm text-gray-500">Showing {{ data.from }} to {{ data.to }} of {{ data.total }} entries</span>
      </div>

      <Paginator
            :rows="data.per_page"
            :totalRecords="data.total"
            @page="onPaginate"
            :pt="{
                root: (event: any) => {
                    const itemForPage =  data.per_page;
                    const currentPage =  page - 1;
                    event.state.d_first = itemForPage * currentPage;
                },
            }"
        >
      </Paginator>
    </div>

  </div>
  
  <Dialog v-model:visible="dialog" :header="selectedItem ? 'Edit Term' : 'Add Term'" :style="{ width: '40rem', minHeight: '50vh' }" :breakpoints="{ '1000px': '40rem', '768px': '90vw' }" :modal="true">
    <PostTermForm :taxonomy="taxonomy" :data="selectedItem" :action="dialogAction" @update="refresh" />
  </Dialog>

</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  permission: 'edit-post'
})

const route = useRoute()
const taxonomy = computed(() => route.params.taxonomy)

const toast = useToast();
const page = ref(route.query.page ? Number(route.query.page) : 1);
const client = useSanctumClient();
const { data, status, error, refresh } = await useAsyncData(
    'terms-page-'+page.value,
    () => client('/api/terms',{
        params: {
            page: page.value,
            taxonomy: taxonomy.value,
        }
    })
)
const onPaginate = (event: { page: number }) => {
    page.value = event.page + 1; 
    refresh()
    navigateTo('/posts/terms/'+taxonomy.value+'?page='+page.value)
};

const selectedPosts = ref();


const dialog = ref(false);
const dialogAction = ref('view');
const selectedItem = ref();
const openDialog = (data: any, action: any) => {
    dialog.value = true;
    selectedItem.value = data;    
    dialogAction.value = action;
}


const confirm = useConfirm();
const confirmDelete = (id: any) => {    
    confirm.require({
        message: 'Anda yakin hapus term ini?',
        header: 'Hapus Term',
        accept: () => {
            client(`/api/terms/${id}`, {
                method: 'DELETE',
            }).then(() => {
                refresh();
                toast.add({
                  severity: 'success',
                  summary: 'Berhasil!',
                  detail: 'Term berhasil dihapus',
                  life: 3000
                });
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