<template>
  <div>

    <div class="flex flex-col md:flex-row md:justify-between gap-3 mb-5">      
      <Button as="router-link" :to="'/posts/create'" class="mb-3 md:mb-0" size="small">
        <Icon name="lucide:plus" size="small"/> Add New Post
      </Button>

      <form @submit.prevent="refresh()" class="flex flex-row justify-end items-center gap-1">
        <div v-if="status == 'pending'">
          <Icon name="lucide:loader-circle" size="small" class="animate-spin"/>
        </div>
        <Select v-model="formFilter.count" :options="[20,50,100]" placeholder="Posts per page" size="small"/>
        <InputText v-model="formFilter.title" placeholder="Search..." size="small" class="max-w-[150px]"/>
        <Button type="submit" size="small" class="py-2">
          <Icon name="lucide:search" size="small"/>
        </Button>
      </form>
    </div>
    
    <DataTable v-if="data" :value="data.data" v-model:selection="selectedPosts" size="small" stripedRows scrollable>
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="title" header="Title">
        <template #body="slotProps">
          <div class="flex">
            <img 
                class="aspect-square object-cover w-9 h-9" 
                :src="slotProps.data?.featured_image?.thumbnail ?? slotProps.data?.featured_image?.default"
                :alt="slotProps.data?.title"
              /> 
              <div class="ms-2">
              <nuxtLink :to="'/posts/edit/'+slotProps.data.id">{{ slotProps.data?.title }}</nuxtLink>
            </div>
          </div>
        </template>
      </Column>
      <Column field="author" header="Author">
        <template #body="slotProps">
          {{ slotProps.data?.author?.name }}
        </template>
      </Column>
      <Column field="date" header="Date"></Column>
      <Column field="category" header="Category" class="hidden md:table-cell">
        <template #body="slotProps">
          <span class="text-xs" v-for="item in slotProps.data?.category" :key="item">{{ item.name }}, </span>
        </template>
      </Column>
      <Column field="tags" header="Tags" class="hidden xl:table-cell">
        <template #body="slotProps">
          <span class="text-xs" v-for="item in slotProps.data?.tags" :key="item">{{ item.name }}, </span>
        </template>
      </Column>
      <Column field="status" header="Status">
        <template #body="slotProps">
          <PostBadgeStatus :status="slotProps.data?.status" />
        </template>
      </Column>
      <Column field="actions" header="">
        <template #body="slotProps">
          <div class="flex justify-end items-center gap-1">
            <Button @click="openDialog(slotProps.data)"  type="button" severity="secondary" size="small" variant="text" class="!px-1">
              <Icon name="lucide:eye" size="small"/>
            </Button>
            <Button as="router-link" :to="'/posts/edit/'+slotProps.data.id" type="button" severity="secondary" size="small" variant="text" class="!px-1">
              <Icon name="lucide:pen" size="small"/>
            </Button>
            <Button @click="confirmDelete(slotProps.data)" type="button" severity="danger" size="small" variant="text" class="!px-1">
              <Icon name="lucide:trash-2" size="small"/>
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
    
    <Message v-else severity="warn">
      Posts Kosong
    </Message>
          
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
    
    <Dialog v-model:visible="dialog" header="Post" :style="{ width: '40rem', minHeight: '50vh' }" :breakpoints="{ '1000px': '40rem', '768px': '90vw' }" :modal="true">
      <PostPreview :data="selectedItem" />
    </Dialog>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
    title: 'Posts',
    description: 'Daftar Posts',
})

const toast = useToast();
const route = useRoute();
const page = ref(route.query.page ? Number(route.query.page) : 1);
const client = useSanctumClient();

const formFilter = reactive({
    title: '',
    count: 20,
})

const { data, status, error, refresh } = await useAsyncData(
    'posts-page-'+page.value,
    () => client('/api/posts?page='+page.value,{
        params: {
            page: page.value,
            title: formFilter.title,
            count: formFilter.count,
        }
    })
)
const selectedPosts = ref();
const onPaginate = (event: { page: number }) => {
    page.value = event.page + 1; 
    refresh()
    navigateTo('/posts?page='+page.value)
};

const confirm = useConfirm();
const confirmDelete = (id: any) => {    
    confirm.require({
        message: 'Anda yakin hapus post ini?',
        header: 'Hapus Post',
        accept: async () => {
            try {              
              const re = await client(`/api/posts/${id.id}`, {
                  method: 'DELETE',
              })
              toast.add({
                severity: 'success',
                summary: 'Berhasil!',
                detail: 'Post berhasil dihapus',
                life: 3000
              });
              refresh();
            } catch (error) {
                const er = useSanctumError(error)                 
                toast.add({
                    severity: 'error',
                    summary: 'Gagal!',
                    detail: er.msg ? er.msg : 'Terjadi kesalahan saat menghapus data',
                    life: 3000
                });
            }
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

const dialog = ref(false);
const selectedItem = ref();
const openDialog = (data: any) => {
    dialog.value = true;
    selectedItem.value = data;   
}
</script>
