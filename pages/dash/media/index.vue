<template>
  <div class="bg-zinc-100 dark:bg-zinc-800 p-3 md:p-5 rounded-lg min-h-[calc(100vh-6.5rem)]">
     
    <div v-if="data.data && data.data.length > 0" class="items-start grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      
      <div v-for="item in data.data" :key="item.id">
        
        <button type="button" @click="openDialog(item)" class="border-0 block h-full">
          <img :src="item.original_url" :alt="item.file_name" class="aspect-square w-full object-cover shadow-sm rounded hover:shadow">
          <div class="py-2 md:py-3 text-left">
            <div class="text-xs break-all mb-1">
              {{ item.file_name }}
            </div>
            <div class="text-xs opacity-50">
              {{ item.size }} KB
            </div>
          </div>
        </button>

      </div>      

    </div>
    <div v-else class="text-center p-5 flex flex-col justify-center items-center h-full">
      <Icon name="lucide:image-off" size="2rem"/>
      Media Kosong      
    </div>

  </div>
  
  <div class="flex justify-end">
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
  
  <Dialog v-model:visible="dialog" header="Preview Media" :style="{ width: '60rem', minHeight: '60vh' }" :breakpoints="{ '1000px': '60rem', '768px': '90vw' }" :modal="true">
    <DashMediaPreview :data="selectedItem" @update="dialog = false; refresh();" />
  </Dialog>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Media Library',
})
const route = useRoute();
const page = ref(route.query.page ? Number(route.query.page) : 1);
const client = useSanctumClient();
const { data, status, error, refresh } = await useAsyncData(
    'media-page-'+page.value,
    () => client('/api/dash/media',{
        params: {
            page: page.value,
        }
    })
)
const onPaginate = (event: { page: number }) => {
    page.value = event.page + 1; 
    refresh()
    navigateTo('/posts?page='+page.value)
};
const selectedPosts = ref();

const dialog = ref(false);
const selectedItem = ref();
const openDialog = (data: any) => {
    dialog.value = true;
    selectedItem.value = data;   
}

</script>
