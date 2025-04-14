<template>

  <Card>
    <template #content>

      <div class="text-end mb-3">
        <Button type="button" @click="openDialog(null,'add')" size="small">
            <Icon name="lucide:plus" mode="svg"/> Tambah
        </Button>
      </div>

      <DataTable :value="data.data" size="small" class="text-sm" stripedRows scrollable>
        <Column field="name" header="Name">
          <template #body="slotProps">

            <NuxtLink :to="'/users/'+slotProps.data.id" class="flex justify-start items-center gap-2">
              <Avatar :image="slotProps.data.avatar_url" size="small" shape="circle" class="max-w-[40px]"/>
              <div>{{ slotProps.data.name }}</div>
            </NuxtLink>

          </template> 
        </Column>
        <Column field="email" header="Email"></Column>
        <Column field="user_roles" header="Role">
          <template #body="slotProps">
            {{ slotProps.data.user_roles[0] }}
          </template> 
        </Column>
        <Column field="options" header="">
          <template #body="slotProps">
            <Button type="button" @click="displayPop($event, slotProps.data)" variant="text" severity="secondary" rounded>
              <Icon name="lucide:ellipsis-vertical" mode="svg"/>
            </Button>
          </template>
        </Column>
      </DataTable>

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

    </template>    
  </Card>

  <Popover ref="op" :dismissable="true">
    <div v-if="selectedItem" class="rounded flex flex-col">
      <div class="text-xs border-b pb-1 mb-1 opacity-50">
        {{ selectedItem.name }}
      </div>
      <Button as="router-link" :to="'users/'+selectedItem.id" severity="secondary" variant="text" class="!p-1 !flex !justify-start">
        <Icon name="lucide:pen" mode="svg"/> Edit
      </Button>
      <Button type="button" @click="confirmDelete(selectedItem)" severity="danger" variant="text" class="!p-1 !flex !justify-start">
        <Icon name="lucide:trash" mode="svg"/> Delete
      </Button>
    </div>
  </Popover>

  <Dialog v-model:visible="dialog" :header="selectedItem ? 'Edit User' : 'Tambah User'" :style="{ width: '40rem', minHeight: '50vh' }" :breakpoints="{ '1000px': '40rem', '768px': '90vw' }" :modal="true">
      <UserForm :data="selectedItem" :action="dialogAction" @close="dialog = false" @update="refresh"/>
  </Dialog>

</template>

<script setup lang="ts">
definePageMeta({
    title: 'Users',
    description: 'Daftar User Aplikasi',
})
const confirm = useConfirm();
const dialog = ref(false);
const dialogAction = ref('view');
const selectedItem = ref();
const op = ref();

const route = useRoute();
const page = ref(route.query.page ? Number(route.query.page) : 1);
const client = useSanctumClient();
const { data, status, error, refresh } = await useAsyncData(
    'users-page-'+page.value,
    () => client('/api/users?page='+page.value)
)
const onPaginate = (event: { page: number }) => {
    page.value = event.page + 1; 
    refresh()
    navigateTo('/users?page='+page.value)
};

const displayPop = async (event: Event, data: any) => {
  dialog.value = false;  
  op.value.hide();
  selectedItem.value = data;
  await op.value.show(event);
}

const openDialog = (data: any, action: any) => {
    op.value.hide();
    dialog.value = true;
    selectedItem.value = data;    
    dialogAction.value = action;
}

const confirmDelete = (id: any) => {    
    confirm.require({
        message: 'Anda yakin hapus user ini?',
        header: 'Hapus User',
        accept: () => {
            client(`/api/users/${id.id}`, {
                method: 'DELETE',
            }).then(() => {
                refresh();
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

